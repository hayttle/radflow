import { Suspense } from "react";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { AuthLayoutWrapper } from "@/components/auth/auth-layout-wrapper";
import { getAvailablePlans } from "@/lib/plans";

async function SignUpWithPlans() {
  const plans = await getAvailablePlans();
  return <SignUpForm plans={plans} />;
}

export default function Page() {
  return (
    <AuthLayoutWrapper
      title="Crie sua conta"
      description="Comece hoje mesmo a transformar seu fluxo de trabalho"
    >
      <Suspense fallback={<div className="h-64 animate-pulse rounded-lg bg-muted/30" />}>
        <SignUpWithPlans />
      </Suspense>
    </AuthLayoutWrapper>
  );
}
