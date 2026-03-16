"use server";

import { createClient } from "@/lib/supabase/server";
import { FeedbackSchema, type FeedbackInput } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function submitFeedback(input: FeedbackInput) {
  try {
    const validatedFields = FeedbackSchema.safeParse(input);

    if (!validatedFields.success) {
      return {
        error: "Dados inválidos. Por favor, verifique os campos.",
        details: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { type, title, description } = validatedFields.data;
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Você precisa estar logado para enviar feedback." };
    }

    const { error } = await supabase.from("feedbacks").insert({
      user_id: user.id,
      type,
      title,
      description,
    });

    if (error) {
      console.error("Erro ao enviar feedback:", error);
      return { error: "Ocorreu um erro ao enviar seu feedback. Tente novamente mais tarde." };
    }

    revalidatePath("/dashboard"); // or wherever appropriate

    return { success: true, message: "Feedback enviado com sucesso! Obrigado pela sua contribuição." };
  } catch (error) {
    console.error("Unexpected error in submitFeedback:", error);
    return { error: "Ocorreu um erro inesperado. Tente novamente mais tarde." };
  }
}
