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
  const signature = formData.get("signature") as string;


  const rawData = {
    full_name: fullName,
    crm: crm || null,
    signature: signature || null,
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
