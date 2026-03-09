"use server";

import { createClient } from "@/lib/supabase/server";
import { ExamTemplateSchema, type ExamTemplateInput } from "@/lib/validations";
import { revalidatePath } from "next/cache";

async function getAuthUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Não autenticado");
  return { supabase, user };
}

export async function saveExamTemplate(rawData: ExamTemplateInput | Record<string, unknown>, templateId?: string) {
  const { supabase, user } = await getAuthUser();
  
  const parsed = ExamTemplateSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  if (templateId) {
    const { error } = await supabase
      .from("exam_templates")
      .update(parsed.data)
      .eq("id", templateId)
      .eq("user_id", user.id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase
      .from("exam_templates")
      .insert({ ...parsed.data, user_id: user.id });
    if (error) return { error: error.message };
  }

  revalidatePath("/configuracoes/modelos");
  return { success: true };
}

export async function deleteExamTemplate(templateId: string) {
  const { supabase, user } = await getAuthUser();

  const { error } = await supabase
    .from("exam_templates")
    .delete()
    .eq("id", templateId)
    .eq("user_id", user.id);

  if (error) {
    if (error.code === "23503") {
      return { error: "Não é possível excluir este modelo pois ele já foi utilizado em laudos." };
    }
    return { error: error.message };
  }

  revalidatePath("/configuracoes/modelos");
  return { success: true };
}
