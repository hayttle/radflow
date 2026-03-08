"use server";

import { createClient } from "@/lib/supabase/server";
import { ProfileSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function saveProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return { error: "Não autenticado" };

  const fullName = formData.get("full_name") as string;
  const crm = formData.get("crm") as string;
  const signatureFile = formData.get("signature") as File | null;

  let signatureUrl = formData.get("signature_url") as string | null;

  // Handle file upload if a new file is provided
  if (signatureFile && signatureFile.size > 0) {
    const fileExt = signatureFile.name.split('.').pop() || 'png';
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    // Upload to 'signatures' bucket
    const { error: uploadError, data: uploadData } = await supabase.storage
      .from("signatures")
      .upload(filePath, signatureFile, { upsert: true });

    if (uploadError) {
      if (uploadError.message.includes("Bucket not found")) {
        // Fallback: the bucket doesn't exist, we can create it or inform the user
        // Creating bucket requires admin privileges often, so we return a clear error
        return { error: "O bucket 'signatures' não foi criado no Supabase. Por favor, crie-o antes de enviar assinaturas." };
      }
      return { error: `Erro ao fazer upload da assinatura: ${uploadError.message}` };
    }

    if (uploadData) {
      const { data: publicUrlData } = supabase.storage
        .from("signatures")
        .getPublicUrl(filePath);
      signatureUrl = publicUrlData.publicUrl;
    }
  }

  const rawData = {
    full_name: fullName,
    crm: crm || null,
    signature_url: signatureUrl || null,
  };

  const parsed = ProfileSchema.safeParse(rawData);
  if (!parsed.success) {
    console.log("Validation error:", parsed.error.flatten().fieldErrors);
    return { error: parsed.error.flatten().fieldErrors };
  }

  // Check if profile exists
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();


  if (existingProfile) {
    const { error: updateError } = await supabase
      .from("profiles")
      .update(parsed.data)
      .eq("id", user.id);
    if (updateError) {
      return { error: updateError.message };
    }
  } else {
    // If profiles is created by a trigger, it might be an update instead of insert
    // but assuming standard structure
    const { error: insertError } = await supabase
      .from("profiles")
      .insert({ ...parsed.data, id: user.id });
    if (insertError) {
      return { error: insertError.message };
    }
  }

  revalidatePath("/configuracoes/perfil");
  revalidatePath("/", "layout"); // Ensure the layout refetches updated profile info
  return { success: true };
}
