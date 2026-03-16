"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

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

  return { supabase };
}

export type PlanFormData = {
  id?: string;
  name: string;
  description?: string | null;
  stripe_price_id_monthly?: string | null;
  stripe_price_id_annual?: string | null;
  amount_monthly_cents: number;
  amount_annual_cents: number;
  features: string[];
  active: boolean;
};

export async function savePlan(formData: PlanFormData) {
  try {
    const { supabase } = await ensureSuperAdmin();

    const payload = {
      name: formData.name.trim(),
      description: formData.description?.trim() || null,
      stripe_price_id_monthly: formData.stripe_price_id_monthly?.trim() || null,
      stripe_price_id_annual: formData.stripe_price_id_annual?.trim() || null,
      amount_monthly_cents: Number(formData.amount_monthly_cents) || 0,
      amount_annual_cents: Number(formData.amount_annual_cents) || 0,
      features: Array.isArray(formData.features) ? formData.features : [],
      active: !!formData.active,
      updated_at: new Date().toISOString(),
    };

    if (formData.id) {
      const { error } = await supabase
        .from("plans")
        .update(payload)
        .eq("id", formData.id);

      if (error) throw error;
    } else {
      const { error } = await supabase.from("plans").insert(payload);
      if (error) throw error;
    }

    revalidatePath("/admin/planos");
    revalidatePath("/");
    return { success: true, message: "Plano salvo com sucesso" };
  } catch (error: unknown) {
    console.error("Erro ao salvar plano:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao salvar plano",
    };
  }
}

export async function deletePlan(planId: string) {
  try {
    const { supabase } = await ensureSuperAdmin();

    const { error } = await supabase.from("plans").delete().eq("id", planId);

    if (error) throw error;

    revalidatePath("/admin/planos");
    revalidatePath("/");
    return { success: true, message: "Plano excluído com sucesso" };
  } catch (error: unknown) {
    console.error("Erro ao excluir plano:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao excluir plano",
    };
  }
}

export async function togglePlanActive(planId: string, active: boolean) {
  try {
    const { supabase } = await ensureSuperAdmin();

    const { error } = await supabase
      .from("plans")
      .update({ active, updated_at: new Date().toISOString() })
      .eq("id", planId);

    if (error) throw error;

    revalidatePath("/admin/planos");
    revalidatePath("/");
    return { success: true, message: `Plano ${active ? "ativado" : "desativado"} com sucesso` };
  } catch (error: unknown) {
    console.error("Erro ao alterar status:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao alterar status",
    };
  }
}
