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

  const rawData = {
    full_name: fullName,
    crm: crm || null,
  };

  const parsed = ProfileSchema.omit({ signature: true }).safeParse(rawData);
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
      .update({ full_name: parsed.data.full_name, crm: parsed.data.crm })
      .eq("id", user.id);
    if (updateError) {
      return { error: updateError.message };
    }
  } else {
    const { error: insertError } = await supabase
      .from("profiles")
      .insert({
        id: user.id,
        full_name: parsed.data.full_name,
        crm: parsed.data.crm,
        email: user.email ?? "",
      });
    if (insertError) {
      return { error: insertError.message };
    }
  }

  revalidatePath("/configuracoes/perfil");
  revalidatePath("/", "layout"); // Ensure the layout refetches updated profile info
  return { success: true };
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { error: "Não autenticado" };

  const password = (formData.get("password") as string)?.trim();
  const confirmPassword = (formData.get("confirm_password") as string)?.trim();

  if (!password || password.length < 6) {
    return { error: "A senha deve ter pelo menos 6 caracteres." };
  }
  if (password !== confirmPassword) {
    return { error: "As senhas não coincidem." };
  }

  const { error: updateError } = await supabase.auth.updateUser({ password });
  if (updateError) {
    const msg = updateError.message;
    if (msg.includes("reauthenticate") || msg.includes("requires recent login")) {
      return { error: "Por segurança, faça logout e login novamente antes de alterar a senha." };
    }
    return { error: msg };
  }

  return { success: true };
}
