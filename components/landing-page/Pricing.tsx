"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"
import type { AvailablePlan } from "@/lib/plans"

interface PricingProps {
  plans: AvailablePlan[]
}

export function Pricing({ plans }: PricingProps) {
  const [isAnnual, setIsAnnual] = useState(false)

  if (plans.length === 0) return null;

  return (
    <section id="precos" className="py-24 bg-slate-50 dark:bg-slate-900/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Investimento Transparente</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Simplicidade no preço para você focar no que importa: seus pacientes.
          </p>
          
          <div className="mt-8 flex items-center justify-center gap-4">
            <span className={cn("text-sm font-medium", !isAnnual ? "text-primary" : "text-muted-foreground")}>Mensal</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative w-14 h-7 rounded-full bg-slate-200 dark:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <div className={cn(
                "absolute top-1 left-1 w-5 h-5 rounded-full bg-primary transition-transform duration-200 ease-in-out shadow-sm",
                isAnnual ? "translate-x-7" : "translate-x-0"
              )} />
            </button>
            <span className={cn("text-sm font-medium flex items-center gap-2", isAnnual ? "text-primary" : "text-muted-foreground")}>
              Anual
              <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/30 px-2.5 py-0.5 text-xs font-semibold text-green-700 dark:text-green-400">
                10% OFF
              </span>
            </span>
          </div>
        </div>

        <div className={cn(
          "grid gap-8 mx-auto",
          plans.length === 1 ? "max-w-md" : "max-w-5xl grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        )}>
          {plans.map((plan) => {
            const price = isAnnual ? plan.amount_annual_cents / 12 / 100 : plan.amount_monthly_cents / 100;
            const checkoutUrl = `/auth/sign-up?planId=${plan.id}&interval=${isAnnual ? "year" : "month"}`;

            return (
              <div key={plan.id} className="relative p-8 rounded-[2.5rem] border-2 border-primary bg-card shadow-2xl shadow-primary/10 overflow-hidden transition-all duration-300 hover:shadow-primary/20 flex flex-col">
                <div className="absolute top-0 right-0 px-6 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-bl-2xl uppercase">
                  {plan.name}
                </div>
                
                <div className="mb-2">
                  <span className="text-5xl font-extrabold font-mono tracking-tight">
                    R$ {price.toFixed(0)}
                  </span>
                  <span className="text-muted-foreground ml-2 font-medium">/mês</span>
                </div>
                <div className="h-6 mb-8">
                  {isAnnual && (
                    <p className="text-sm text-muted-foreground font-medium">
                      R$ {(plan.amount_annual_cents / 100).toLocaleString('pt-BR')} cobrados anualmente
                    </p>
                  )}
                </div>

                <ul className="space-y-4 mb-10 flex-grow">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-primary stroke-[3]" />
                      </div>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button size="lg" className="w-full h-14 text-lg font-bold group mt-auto" asChild>
                  <Link href={checkoutUrl}>
                    Iniciar Teste Grátis
                    <Check className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                  </Link>
                </Button>
                
                <p className="text-center text-xs text-muted-foreground mt-6 italic font-medium">
                  Acesso total por 7 dias. Sem compromisso inicial.
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  )
}
