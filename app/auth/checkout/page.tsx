import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { createCheckoutForPlanAndIntervalServer } from "@/lib/stripe/checkout-server";

async function CheckoutWithStripe({
  searchParams,
}: {
  searchParams: Promise<{ planId?: string; interval?: string }>;
}) {
  const params = await searchParams;
  const planId = params.planId || "";
  const interval = params.interval === "year" ? "year" : "month";

  if (!planId) {
    redirect("/auth/sign-up");
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      `/auth/login?redirect=${encodeURIComponent(`/auth/checkout?planId=${planId}&interval=${interval}`)}`
    );
  }

  // Não usar try-catch aqui, pois o redirect do Next.js lança um erro interno para funcionar.
  await createCheckoutForPlanAndIntervalServer(planId, interval);
  return null;
}

function CheckoutFallback() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <div
        className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"
        aria-hidden
      />
    </div>
  );
}

export default function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ planId?: string; interval?: string }>;
}) {
  return (
    <Suspense fallback={<CheckoutFallback />}>
      <CheckoutWithStripe searchParams={searchParams} />
    </Suspense>
  );
}
