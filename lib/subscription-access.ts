/**
 * Verifica se o usuário pode acessar o app com base na linha `subscriptions`.
 *
 * Stripe envia `customer.subscription.updated` quando o trial termina; se o webhook falhar,
 * o status pode permanecer `trialing` com `trial_end` no passado — por isso também checamos a data.
 */
export function hasActiveSubscriptionAccess(
  subscription:
    | { status?: string | null; trial_end?: string | null }
    | null
    | undefined
): boolean {
  if (!subscription?.status) return false;
  const { status, trial_end: trialEnd } = subscription;

  if (status === "active") return true;

  if (status === "trialing") {
    if (!trialEnd) return true;
    return new Date(trialEnd).getTime() > Date.now();
  }

  return false;
}
