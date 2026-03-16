"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Ensures the current user is a super_admin.
 * Returns the supabase client and profile if authorized, otherwise throws error.
 */
async function ensureSuperAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Não autorizado");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "super_admin") {
    throw new Error("Acesso negado: Requer privilégios de Super Admin");
  }

  return { supabase, user };
}

export async function updateUserRole(userId: string, role: "user" | "admin" | "super_admin") {
  try {
    const { supabase } = await ensureSuperAdmin();

    const { error } = await supabase
      .from("profiles")
      .update({ role, updated_at: new Date().toISOString() })
      .eq("id", userId);

    if (error) throw error;

    revalidatePath("/admin/usuarios");
    return { success: true, message: "Papel do usuário atualizado com sucesso" };
  } catch (error: any) {
    console.error("Erro ao atualizar papel:", error);
    return { success: false, error: error.message || "Erro ao atualizar papel" };
  }
}

export async function updateFeedbackStatus(feedbackId: string, status: "pending" | "viewed" | "resolved") {
  try {
    const { supabase } = await ensureSuperAdmin();

    const { error } = await supabase
      .from("feedbacks")
      .update({ status })
      .eq("id", feedbackId);

    if (error) throw error;

    revalidatePath("/admin/feedbacks");
    revalidatePath("/admin");
    return { success: true, message: "Status do feedback atualizado com sucesso" };
  } catch (error: any) {
    console.error("Erro ao atualizar feedback:", error);
    return { success: false, error: error.message || "Erro ao atualizar feedback" };
  }
}

export async function toggleUserActive(userId: string, is_active: boolean) {
  try {
    const { supabase, user: currentUser } = await ensureSuperAdmin();

    // Prevent deactivating yourself
    if (userId === currentUser.id) {
      throw new Error("Você não pode desativar sua própria conta");
    }

    const { error } = await supabase
      .from("profiles")
      .update({ is_active, updated_at: new Date().toISOString() })
      .eq("id", userId);

    if (error) throw error;

    revalidatePath("/admin/usuarios");
    return { success: true, message: `Usuário ${is_active ? 'ativado' : 'desativado'} com sucesso` };
  } catch (error: any) {
    console.error("Erro ao alternar status do usuário:", error);
    return { success: false, error: error.message || "Erro ao alternar status do usuário" };
  }
}
