"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { Check } from "lucide-react";
import type { AvailablePlan } from "@/lib/plans";

type BillingInterval = "month" | "year";

interface SignUpFormProps extends React.ComponentPropsWithoutRef<"div"> {
  plans: AvailablePlan[];
}

export function SignUpForm({ className, plans, ...props }: SignUpFormProps) {
  const searchParams = useSearchParams();
  const intervalFromUrl = searchParams.get("interval");
  const planIdFromUrl = searchParams.get("planId");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(
    planIdFromUrl && plans.some((p) => p.id === planIdFromUrl) ? planIdFromUrl : null
  );
  const [isAnnual, setIsAnnual] = useState(intervalFromUrl === "year");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const selectedPlan = useMemo(
    () => plans.find((p) => p.id === selectedPlanId) ?? null,
    [plans, selectedPlanId]
  );

  // Preset vindo da LP
  useEffect(() => {
    setIsAnnual(intervalFromUrl === "year");
  }, [intervalFromUrl]);

  // Auto-select quando só tem um plano ou vem planId da URL
  useEffect(() => {
    if (planIdFromUrl && plans.some((p) => p.id === planIdFromUrl) && !selectedPlanId) {
      setSelectedPlanId(planIdFromUrl);
    } else if (plans.length === 1 && !selectedPlanId) {
      setSelectedPlanId(plans[0].id);
    }
  }, [planIdFromUrl, plans, selectedPlanId]);

  // Ajustar recorrência quando plano tem só uma opção
  useEffect(() => {
    const plan = plans.find((p) => p.id === selectedPlanId);
    if (plan) {
      if (plan.has_monthly && !plan.has_annual) setIsAnnual(false);
      if (plan.has_annual && !plan.has_monthly) setIsAnnual(true);
      if (!plan.has_annual && isAnnual) setIsAnnual(false);
      if (!plan.has_monthly && !isAnnual) setIsAnnual(true);
    }
  }, [selectedPlanId, plans, isAnnual]);
  const canChooseAnnual = selectedPlan?.has_annual ?? true;
  const canChooseMonthly = selectedPlan?.has_monthly ?? true;
  const interval: BillingInterval =
    isAnnual && canChooseAnnual ? "year" : "month";
  const canSubmit =
    selectedPlanId &&
    (interval === "month" ? canChooseMonthly : canChooseAnnual) &&
    plans.length > 0;

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedPlanId) {
      setError("Por favor, selecione um plano para continuar.");
      return;
    }
    if (!canSubmit) return;

    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError("As senhas não coincidem.");
      setIsLoading(false);
      return;
    }

    const checkoutUrl = `${window.location.origin}/auth/checkout?planId=${selectedPlanId}&interval=${interval}`;

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: checkoutUrl },
      });

      if (signUpError) throw signUpError;

      const nextPath =
        data?.session
          ? `/auth/checkout?planId=${selectedPlanId}&interval=${interval}`
          : `/auth/sign-up-success?planId=${selectedPlanId}&interval=${interval}`;
      const fullUrl = `${window.location.origin}${nextPath}`;
      // Redirect imediato: delay às vezes permitia que o React cancelasse a navegação
      window.location.replace(fullUrl);
      return;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro ao criar a conta.");
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSignUp}>
        <div className="flex flex-col gap-6">
          {plans.length > 0 ? (
            <>
              <div className="grid gap-2">
                <Label>Escolha seu plano</Label>
                <div className="grid gap-3">
                  {plans.map((plan) => {
                    const isSelected = selectedPlanId === plan.id;
                    const hasBoth = plan.has_monthly && plan.has_annual;
                    const hasOnlyMonthly = plan.has_monthly && !plan.has_annual;
                    const hasOnlyAnnual = plan.has_annual && !plan.has_monthly;

                    return (
                      <button
                        key={plan.id}
                        type="button"
                        onClick={() => setSelectedPlanId(plan.id)}
                        className={cn(
                          "flex flex-col p-4 rounded-xl border-2 text-left transition-all",
                          isSelected
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50 bg-card"
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-semibold">{plan.name}</p>
                            {plan.description && (
                              <p className="text-xs text-muted-foreground mt-0.5">{plan.description}</p>
                            )}
                          </div>
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                              <Check className="w-3 h-3 text-primary-foreground stroke-[3]" />
                            </div>
                          )}
                        </div>
                        <div className="mt-2 flex gap-2 text-sm">
                          {plan.has_monthly && (
                            <span>Mensal: R$ {(plan.amount_monthly_cents / 100).toFixed(2).replace(".", ",")}</span>
                          )}
                          {plan.has_annual && (
                            <span className="text-muted-foreground">
                              Anual: R$ {(plan.amount_annual_cents / 100).toFixed(2).replace(".", ",")}
                            </span>
                          )}
                        </div>
                        {plan.features.length > 0 && (
                          <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                            {plan.features.slice(0, 3).map((f, i) => (
                              <li key={i}>• {f}</li>
                            ))}
                          </ul>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {selectedPlan && (selectedPlan.has_monthly || selectedPlan.has_annual) && (
                <div className="grid gap-2">
                  <Label>Recorrência</Label>
                  <div className="flex items-center gap-4 p-3 rounded-lg border bg-muted/30">
                    <span
                      className={cn(
                        "text-sm font-medium",
                        !isAnnual ? "text-primary" : "text-muted-foreground"
                      )}
                    >
                      Mensal
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        selectedPlan.has_monthly && selectedPlan.has_annual && setIsAnnual(!isAnnual)
                      }
                      disabled={!selectedPlan.has_monthly || !selectedPlan.has_annual}
                      className="relative w-14 h-7 rounded-full bg-slate-200 dark:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div
                        className={cn(
                          "absolute top-1 left-1 w-5 h-5 rounded-full bg-primary transition-transform duration-200 ease-in-out shadow-sm",
                          isAnnual ? "translate-x-7" : "translate-x-0"
                        )}
                      />
                    </button>
                    <span
                      className={cn(
                        "text-sm font-medium flex items-center gap-2",
                        isAnnual ? "text-primary" : "text-muted-foreground"
                      )}
                    >
                      Anual
                      <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/30 px-2 py-0.5 text-xs font-semibold text-green-700 dark:text-green-400">
                        10% OFF
                      </span>
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">7 dias grátis. Sem compromisso inicial.</p>
                </div>
              )}
            </>
          ) : (
            <div className="p-6 rounded-xl border border-dashed text-center text-muted-foreground">
              <p className="font-medium">Nenhum plano disponível no momento.</p>
              <p className="text-sm mt-1">Entre em contato conosco para conhecer as opções.</p>
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 shadow-sm"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 shadow-sm"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="repeat-password">Confirmar Senha</Label>
            <Input
              id="repeat-password"
              type="password"
              required
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              className="h-11 shadow-sm"
            />
          </div>

          {error && <p className="text-sm font-medium text-destructive">{error}</p>}
          <Button
            type="submit"
            className="w-full h-11 text-base font-semibold shadow-lg shadow-primary/20"
            disabled={isLoading || !canSubmit}
          >
            {isLoading ? "Criando conta..." : "Criar conta e iniciar teste grátis"}
          </Button>
        </div>
        <div className="mt-6 text-center text-sm text-muted-foreground">
          Já tem uma conta?{" "}
          <Link href="/auth/login" className="text-primary font-medium hover:underline underline-offset-4">
            Entrar
          </Link>
        </div>
      </form>
    </div>
  );
}
