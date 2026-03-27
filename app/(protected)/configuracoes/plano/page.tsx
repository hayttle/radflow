import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, CreditCard, ExternalLink, Zap } from "lucide-react";
import { ManageSubscriptionButton } from "@/components/configuracoes/plano/manage-subscription-button";
import { SubscriptionAlert } from "@/components/configuracoes/plano/subscription-alert";
import { hasActiveSubscriptionAccess } from "@/lib/subscription-access";

export default async function SubscriptionPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth/login");
  }

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*, plans(*)")
    .eq("user_id", user.id)
    .single();

  const isActive = hasActiveSubscriptionAccess(subscription);
  const showTrialingUi =
    isActive && subscription?.status === "trialing";
  const plan = subscription?.plans;

  return (
    <PageContainer>
      <Suspense fallback={null}>
        <SubscriptionAlert hasAccess={isActive} />
      </Suspense>
      <PageHeader
        title="Plano e Faturamento"
        description="Gerencie sua assinatura, visualize faturas e atualize seus métodos de pagamento."
      />

      <div className="grid gap-8 max-w-4xl">
        <Card className="border-2 border-primary/10 shadow-sm overflow-hidden">
          <CardHeader className="bg-muted/20 border-b pb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                  <CreditCard className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">Assinatura Atual</CardTitle>
                  <CardDescription>
                    {isActive ? "Informações detalhadas sobre seu plano ativo." : "Você não possui uma assinatura ativa no momento."}
                  </CardDescription>
                </div>
              </div>
              {isActive ? (
                <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-none px-4 py-1.5 rounded-full text-xs font-bold shadow-sm">
                  {showTrialingUi ? "Período de Teste" : "Assinatura Ativa"}
                </Badge>
              ) : (
                <Badge variant="outline" className="px-4 py-1.5 rounded-full text-xs font-bold border-2 shadow-sm">
                  Inativo
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {isActive && plan ? (
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-100 dark:border-slate-800 shadow-inner">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary shadow-lg shadow-primary/20 flex items-center justify-center">
                    <Zap className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-xl text-foreground">RadFlow {plan.name}</h3>
                    <p className="text-[15px] font-medium text-muted-foreground mt-0.5">
                      {subscription.billing_interval === 'month'
                        ? `R$ ${(plan.amount_monthly_cents / 100).toFixed(2).replace('.', ',')} / mês`
                        : `R$ ${(plan.amount_annual_cents / 100).toFixed(2).replace('.', ',')} / ano`
                      }
                    </p>
                  </div>
                </div>
                <div className="flex flex-col md:items-end gap-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">
                    {showTrialingUi ? "Expira em" : "Próxima cobrança"}
                  </span>
                  <span className="text-sm font-bold text-foreground">
                    {new Date(
                      showTrialingUi
                        ? (subscription.trial_end ?? subscription.current_period_end)
                        : subscription.current_period_end
                    ).toLocaleDateString("pt-BR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 px-6 border-2 border-dashed rounded-3xl bg-muted/5">
                <div className="inline-flex p-4 rounded-3xl bg-primary/5 text-primary mb-4">
                  <Zap className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-bold mb-2">Desbloqueie todo o potencial</h3>
                <p className="text-muted-foreground mb-8 max-w-sm mx-auto font-medium">Experimente todos os recursos profissionais do RadFlow e eleve o nível dos seus laudos.</p>
                <Button size="lg" className="rounded-full px-10 font-bold shadow-xl hover:shadow-primary/20 transition-all active:scale-95" asChild>
                  <a href="/#precos">Ver Planos Disponíveis</a>
                </Button>
              </div>
            )}

            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-4">
                <h4 className="text-[13px] font-bold uppercase tracking-[0.1em] text-primary/70">O que está incluído</h4>
                <ul className="grid gap-3">
                  {[
                    "Laudos Ilimitados",
                    "Gestão de Unidades",
                    "Editor Inteligente com Variáveis",
                    "Assinatura Digital Integrada",
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm font-medium text-foreground/80">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center">
                        <Check className="w-3 h-3 text-emerald-600" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-[13px] font-bold uppercase tracking-[0.1em] text-primary/70">Portal do Cliente</h4>
                <div className="p-5 rounded-2xl bg-muted/20 border-2 border-muted/30">
                  <p className="text-sm leading-relaxed font-medium text-muted-foreground">
                    Utilizamos o Stripe para garantir a segurança máxima dos seus dados. No portal, você pode:
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-foreground/70 font-medium">
                    <li className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-primary" /> Alterar forma de pagamento
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-primary" /> Baixar notas fiscais
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-primary" /> Cancelar ou trocar plano
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="bg-slate-50/50 dark:bg-slate-900/20 border-t px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground/80 uppercase tracking-tight">
              <CreditCard className="w-3.5 h-3.5" />
              Pagamento Seguro e Criptografado
            </div>
            {subscription && (
              <div className="w-full sm:w-auto">
                <ManageSubscriptionButton />
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    </PageContainer>
  );
}
