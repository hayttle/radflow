"use server";

import { createClient } from "@/lib/supabase/server";
import { PatientSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

async function getAuthUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Não autenticado");
  return { supabase, user };
}

export async function savePatient(formData: FormData, patientId?: string) {
  const raw = {
    name: formData.get("name"),
    cpf: formData.get("cpf") || null,
    birth_date: formData.get("birth_date") || null,
    gender: formData.get("gender") || null,
    phone: formData.get("phone") || null,
    mother_name: formData.get("mother_name") || null,
    notes: formData.get("notes") || null,
  };

  const parsed = PatientSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const { supabase, user } = await getAuthUser();

  if (patientId) {
    // Update
    const { error } = await supabase
      .from("patients")
      .update(parsed.data)
      .eq("id", patientId)
      .eq("user_id", user.id);
    if (error) return { error: error.message };
  } else {
    // Insert
    const { error } = await supabase
      .from("patients")
      .insert({ ...parsed.data, user_id: user.id });
    if (error) return { error: error.message };
  }

  revalidatePath("/pacientes");
  return { success: true };
}

export async function deletePatient(patientId: string) {
  const { supabase, user } = await getAuthUser();

  const { error } = await supabase
    .from("patients")
    .delete()
    .eq("id", patientId)
    .eq("user_id", user.id);

  if (error) {
    if (error.code === "23503") {
      return { error: "Não é possível excluir este paciente pois ele já possui atendimentos vinculados." };
    }
    return { error: error.message };
  }

  revalidatePath("/pacientes");
  return { success: true };
}
