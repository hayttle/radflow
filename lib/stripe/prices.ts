"use server";

import { createClient } from "@/lib/supabase/server";

export type BillingInterval = "month" | "year";

/**
 * Obtém o price ID do Stripe para o intervalo de cobrança.
 * Prioridade: env vars > tabela plans no Supabase
 */
export async function getPriceIdForInterval(
  interval: BillingInterval
): Promise<string | null> {
  const envKey =
    interval === "month"
      ? "STRIPE_PRICE_ID_MONTHLY"
      : "STRIPE_PRICE_ID_ANNUAL";
  const envPriceId = process.env[envKey];
  if (envPriceId) return envPriceId;

  const supabase = await createClient();
  const column =
    interval === "month" ? "stripe_price_id_monthly" : "stripe_price_id_annual";

  const { data } = await supabase
    .from("plans")
    .select(column)
    .eq("active", true)
    .not(column, "is", null)
    .limit(1)
    .maybeSingle();

  const priceId = data?.[column as keyof typeof data];
  return typeof priceId === "string" ? priceId : null;
}

/**
 * Obtém o price ID para um plano específico e intervalo de cobrança.
 */
export async function getPriceIdForPlanAndInterval(
  planId: string,
  interval: BillingInterval
): Promise<string | null> {
  const supabase = await createClient();
  const column =
    interval === "month" ? "stripe_price_id_monthly" : "stripe_price_id_annual";

  const { data } = await supabase
    .from("plans")
    .select(column)
    .eq("id", planId)
    .eq("active", true)
    .not(column, "is", null)
    .maybeSingle();

  const priceId = data?.[column as keyof typeof data];
  return typeof priceId === "string" ? priceId : null;
}
