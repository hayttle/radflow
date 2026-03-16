/**
 * Lógica de checkout para uso em Server Components (dentro de Suspense).
 * Não usa "use server" para evitar o erro "Blocking Route" com cacheComponents.
 */
import { stripe } from "./config";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  getPriceIdForPlanAndInterval,
  type BillingInterval,
} from "./prices";

const TRIAL_DAYS = 7;

export async function createCheckoutForPlanAndIntervalServer(
  planId: string,
  interval: BillingInterval
) {
  const priceId = await getPriceIdForPlanAndInterval(planId, interval);
  if (!priceId) {
    throw new Error("Price ID não configurado para este plano.");
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      `/auth/login?redirect=${encodeURIComponent(`/auth/checkout?planId=${planId}&interval=${interval}`)}`
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single();

  let stripeCustomerId = profile?.stripe_customer_id;

  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { supabase_user_id: user.id },
    });
    stripeCustomerId = customer.id;
    await supabase
      .from("profiles")
      .update({
        stripe_customer_id: stripeCustomerId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);
  }

  const session = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    line_items: [{ price: priceId, quantity: 1 }],
    mode: "subscription",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/configuracoes/plano?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/configuracoes/plano?canceled=true`,
    subscription_data: {
      trial_period_days: TRIAL_DAYS,
      metadata: { supabase_user_id: user.id },
    },
  });

  if (!session.url) {
    throw new Error("Could not create checkout session");
  }

  redirect(session.url);
}
