"use server";

import { stripe } from "./config";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getPriceIdForInterval, getPriceIdForPlanAndInterval, type BillingInterval } from "./prices";

const TRIAL_DAYS = 7;

export async function createCheckoutSession(
  priceId: string,
  options?: { trialPeriodDays?: number }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth/login");
  }

  // Get or create Stripe customer (armazenado em profiles.stripe_customer_id)
  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single();

  let stripeCustomerId = profile?.stripe_customer_id;

  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: {
        supabase_user_id: user.id,
      },
    });
    stripeCustomerId = customer.id;

    await supabase
      .from("profiles")
      .update({ stripe_customer_id: stripeCustomerId, updated_at: new Date().toISOString() })
      .eq("id", user.id);
  }

  const session = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/configuracoes/plano?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/configuracoes/plano?canceled=true`,
    subscription_data: {
      trial_period_days: 7, // Sempre 7 dias de trial conforme solicitado
      metadata: {
        supabase_user_id: user.id,
      },
    },
  });

  if (!session.url) {
    throw new Error("Could not create checkout session");
  }

  redirect(session.url);
}

/** Cria sessão de checkout com trial de 7 dias para o intervalo informado. */
export async function createCheckoutForInterval(interval: BillingInterval) {
  const priceId = await getPriceIdForInterval(interval);
  if (!priceId) {
    throw new Error("Price ID não configurado.");
  }
  return createCheckoutSession(priceId, { trialPeriodDays: TRIAL_DAYS });
}

/** Cria sessão de checkout para plano e intervalo específicos. */
export async function createCheckoutForPlanAndInterval(
  planId: string,
  interval: BillingInterval
) {
  const priceId = await getPriceIdForPlanAndInterval(planId, interval);
  if (!priceId) {
    throw new Error("Price ID não configurado para este plano.");
  }
  return createCheckoutSession(priceId, { trialPeriodDays: TRIAL_DAYS });
}

export async function getCustomerPortalUrl() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single();

  if (!profile?.stripe_customer_id) {
    throw new Error("No stripe customer found");
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/configuracoes/plano`,
  });

  return portalSession.url;
}

export async function createCustomerPortal() {
  const url = await getCustomerPortalUrl();
  redirect(url);
}
