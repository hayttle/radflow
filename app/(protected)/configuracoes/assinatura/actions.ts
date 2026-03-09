"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function saveSignature(formData: FormData) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return { error: "Não autenticado" };

  const signature = (formData.get("signature") as string) || null;

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ signature })
    .eq("id", user.id);

  if (updateError) return { error: updateError.message };

  revalidatePath("/configuracoes/assinatura");
  revalidatePath("/", "layout");
  return { success: true };
}
