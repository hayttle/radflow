"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthLayoutWrapperProps {
  children: React.ReactNode;
  title: string;
  description: string;
}

const benefits = [
  {
    title: "Laudos 10x mais rápidos",
    description: "Nossa IA assistente gera rascunhos precisos em segundos, otimizando drasticamente seu tempo.",
  },
  {
    title: "Precisão e Consistência",
    description: "Minimize erros com nossa validação inteligente e modelos padronizados.",
  },
  {
    title: "Workflow de Alta Performance",
    description: "Organização automática e ferramentas avançadas para gestão de exames.",
  },
  {
    title: "Segurança de Elite",
    description: "Criptografia de ponta a ponta e total conformidade com os mais rigorosos padrões de dados.",
  },
];

export function AuthLayoutWrapper({ children, title, description }: AuthLayoutWrapperProps) {
  return (
    <div className="flex min-h-svh w-full flex-col md:flex-row">
      {/* Left Section - Benefits */}
      <div className="relative hidden w-full items-center justify-center overflow-hidden bg-primary/5 p-10 lg:flex lg:w-1/2 xl:w-[60%]">
        <div className="absolute inset-0 z-0">
          <div className="absolute -left-10 -top-10 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-10 -right-10 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        </div>

        <div className="relative z-10 max-w-lg space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              O futuro dos <span className="text-primary">Laudos</span> chegou.
            </h1>
            <p className="text-lg text-muted-foreground">
              Simplifique sua rotina e eleve o padrão de suas entregas com o ecossistema RadFlow.
            </p>
          </div>

          <div className="grid gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all hover:bg-white/10">
                <div className="mt-1 h-6 w-6 shrink-0 text-primary">
                  <CheckCircle2 className="h-full w-full" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-foreground">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4">
            <p className="text-sm italic text-muted-foreground/60">
              "O RadFlow transformou radicalmente nossa eficiência operacional. Uma solução indispensável para alta performance."
            </p>
            <div className="mt-2 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/20" />
              <div>
                <p className="text-sm font-medium">Ricardo Silva</p>
                <p className="text-xs text-muted-foreground">Diretor de Operações</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Auth Form */}
      <div className="flex w-full flex-col items-center justify-center p-6 md:p-10 lg:w-1/2 xl:w-[40%]">
        <div className="flex w-full max-w-md flex-col space-y-8">
          {/* Logo Center Top */}
          <div className="flex flex-col items-center justify-center gap-3 mb-4">
            <Link href="/" className="flex items-center gap-2 group transition-all hover:scale-105">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/25">
                <span className="text-primary-foreground text-xl font-bold italic">RF</span>
              </div>
              <span className="text-2xl font-bold tracking-tight">
                Rad<span className="text-primary">Flow</span>
              </span>
            </Link>
            <div className="text-center">
              <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {description}
              </p>
            </div>
          </div>

          {/* Children (Forms) */}
          <div className="w-full">
            {children}
          </div>

          <div className="text-center text-xs text-muted-foreground">
            Ao continuar, você concorda com nossos{" "}
            <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
              Termos de Serviço
            </Link>{" "}
            e{" "}
            <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
              Política de Privacidade
            </Link>
            .
          </div>
        </div>
      </div>
    </div>
  );
}
