import { createClient } from "@/lib/supabase/server";

export interface AvailablePlan {
  id: string;
  name: string;
  description: string | null;
  amount_monthly_cents: number;
  amount_annual_cents: number;
  features: string[];
  has_monthly: boolean;
  has_annual: boolean;
}

/**
 * Retorna planos ativos que têm ao menos um Stripe Price ID configurado.
 * Usado no signup e na LP para exibir opções disponíveis.
 */
export async function getAvailablePlans(): Promise<AvailablePlan[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("plans")
    .select("id, name, description, stripe_price_id_monthly, stripe_price_id_annual, amount_monthly_cents, amount_annual_cents, features")
    .eq("active", true)
    .or("stripe_price_id_monthly.not.is.null,stripe_price_id_annual.not.is.null")
    .order("created_at", { ascending: true });

  if (!data) return [];

  return data.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description ?? null,
    amount_monthly_cents: p.amount_monthly_cents ?? 0,
    amount_annual_cents: p.amount_annual_cents ?? 0,
    features: Array.isArray(p.features) ? (p.features as string[]) : [],
    has_monthly: !!p.stripe_price_id_monthly,
    has_annual: !!p.stripe_price_id_annual,
  }));
}
