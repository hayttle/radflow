import { stripe } from "@/lib/stripe/config";
import { createClient } from "@supabase/supabase-js";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const relevantEvents = new Set([
  "product.created",
  "product.updated",
  "price.created",
  "price.updated",
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature");

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event: Stripe.Event;

  try {
    if (!signature || !webhookSecret) return new Response("Webhook secret not found.", { status: 400 });
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[Stripe Webhook] Error constructing event: ${message}`);
    return new NextResponse(`Webhook Error: ${message}`, { status: 400 });
  }

  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        case "product.created":
        case "product.updated":
          const product = event.data.object as Stripe.Product;
          await supabaseAdmin.from("products").upsert({
            id: product.id,
            active: product.active,
            name: product.name,
            description: product.description ?? null,
            image: product.images?.[0] ?? null,
            metadata: product.metadata,
          });
          break;
        case "price.created":
        case "price.updated":
          const price = event.data.object as Stripe.Price;
          await supabaseAdmin.from("prices").upsert({
            id: price.id,
            product_id: typeof price.product === "string" ? price.product : price.product.id,
            active: price.active,
            currency: price.currency,
            type: price.type,
            unit_amount: price.unit_amount,
            interval: price.recurring?.interval,
            interval_count: price.recurring?.interval_count,
            trial_period_days: price.recurring?.trial_period_days,
            metadata: price.metadata,
          });
          break;
        case "customer.subscription.created":
        case "customer.subscription.updated":
        case "customer.subscription.deleted":
          const subscription = event.data.object as Stripe.Subscription;
          
          // 1. Get user_id from customer metadata or profile lookup
          const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer;
          let userId = customer.metadata?.supabase_user_id;

          if (!userId) {
            // Fallback: search profile by stripe_customer_id
            const { data: profile, error: profileError } = await supabaseAdmin
              .from("profiles")
              .select("id")
              .eq("stripe_customer_id", customer.id)
              .maybeSingle();
            
            if (profileError) console.error(`[Webhook] Profile lookup error:`, profileError);
            userId = profile?.id;
          }

          if (userId) {
            // 2. Find plan_id from the price_id
            const priceId = subscription.items.data[0].price.id;
            const { data: plan, error: planError } = await supabaseAdmin
              .from("plans")
              .select("id")
              .or(`stripe_price_id_monthly.eq.${priceId},stripe_price_id_annual.eq.${priceId}`)
              .maybeSingle();

            if (planError) console.error(`[Webhook] Plan lookup error:`, planError);

            // 3. Upsert subscription
            const { error: upsertError } = await supabaseAdmin.from("subscriptions").upsert({
              id: subscription.id,
              user_id: userId,
              plan_id: plan?.id ?? null,
              status: subscription.status,
              stripe_price_id: priceId,
              billing_interval: subscription.items.data[0].price.recurring?.interval ?? 'month',
              quantity: subscription.items.data[0].quantity,
              cancel_at_period_end: subscription.cancel_at_period_end,
              cancel_at: subscription.cancel_at ? new Date(Number(subscription.cancel_at) * 1000).toISOString() : null,
              canceled_at: subscription.canceled_at ? new Date(Number(subscription.canceled_at) * 1000).toISOString() : null,
              current_period_start: new Date(Number((subscription as any).current_period_start || Date.now() / 1000) * 1000).toISOString(),
              current_period_end: new Date(Number((subscription as any).current_period_end || Date.now() / 1000) * 1000).toISOString(),
              trial_start: subscription.trial_start ? new Date(subscription.trial_start * 1000).toISOString() : null,
              trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
              updated_at: new Date().toISOString(),
            });

            if (upsertError) {
              console.error(`[Webhook] Subscription upsert error:`, upsertError);
            }
          } else {
            console.warn(`[Webhook] No user found for customer ${customer.id}`);
          }
          break;
        case "checkout.session.completed":
          const checkoutSession = event.data.object as Stripe.Checkout.Session;
          if (checkoutSession.mode === "subscription") {
            const subscriptionId = checkoutSession.subscription as string;
            // Subscription details will be handled by customer.subscription.created/updated
          }
          break;
        default:
          throw new Error("Unhandled relevant event!");
      }
    } catch (error) {
      console.log(error);
      return new Response("Webhook handler failed. View logs.", {
        status: 400,
      });
    }
  }

  return NextResponse.json({ received: true });
}
