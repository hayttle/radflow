"use server";

import { createClient } from "@/lib/supabase/server";
import { ExamPhraseSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

async function getAuthUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Não autenticado");
  return { supabase, user };
}

export async function saveExamPhrase(formData: FormData, phraseId?: string) {
  const { supabase, user } = await getAuthUser();
  
  const rawData = {
    category: formData.get("category"),
    label: formData.get("label"),
    content: formData.get("content"),
  };

  const parsed = ExamPhraseSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  if (phraseId) {
    const { error } = await supabase
      .from("exam_phrases")
      .update(parsed.data)
      .eq("id", phraseId)
      .eq("user_id", user.id);
    if (error) {
      return { error: error.message };
    }
  } else {
    const { error } = await supabase
      .from("exam_phrases")
      .insert({ ...parsed.data, user_id: user.id });
    if (error) {
      return { error: error.message };
    }
  }

  revalidatePath("/configuracoes/frases");
  return { success: true };
}

export async function deleteExamPhrase(phraseId: string) {
  const { supabase, user } = await getAuthUser();

  const { error } = await supabase
    .from("exam_phrases")
    .delete()
    .eq("id", phraseId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/configuracoes/frases");
  return { success: true };
}
