"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

async function getAuthUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Não autenticado");
  return { supabase, user };
}

export async function saveUnit(formData: FormData, unitId?: string) {
  const { supabase, user } = await getAuthUser();
  const raw = {
    name: formData.get("name") as string,
    phone: (formData.get("phone") as string) || null,
    address: (formData.get("address") as string) || null,
    report_header: (formData.get("report_header") as string) || null,
    report_footer: (formData.get("report_footer") as string) || null,
    active: formData.get("active") === "true",
  };

  if (!raw.name || raw.name.trim() === "") {
    return { error: "Nome da unidade é obrigatório." };
  }

  if (unitId) {
    const { error } = await supabase
      .from("units")
      .update(raw)
      .eq("id", unitId)
      .eq("user_id", user.id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase
      .from("units")
      .insert({ ...raw, user_id: user.id });
    if (error) return { error: error.message };
  }

  revalidatePath("/configuracoes/unidades");
  // The layout loads units for the context, we should clear the layout cache to fetch the new units
  revalidatePath("/", "layout");
  return { success: true };
}

export async function deleteUnit(unitId: string) {
  const { supabase, user } = await getAuthUser();

  const { error } = await supabase
    .from("units")
    .delete()
    .eq("id", unitId)
    .eq("user_id", user.id);

  if (error) {
    if (error.code === "23503") {
      return { error: "Não é possível excluir esta unidade pois ela possui cadastros vinculados." };
    }
    return { error: error.message };
  }

  revalidatePath("/configuracoes/unidades");
  revalidatePath("/", "layout");
  return { success: true };
}
