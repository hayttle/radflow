"use client";

import { CheckCircle2, Circle, ArrowRight, Building2, BookTemplate, MessageSquareQuote, Signature as SignatureIcon, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  href: string;
  isCompleted: boolean;
  isOptional?: boolean;
  icon: "building" | "book" | "message" | "signature";
}

const ICON_MAP = {
  building: Building2,
  book: BookTemplate,
  message: MessageSquareQuote,
  signature: SignatureIcon,
};

interface OnboardingChecklistProps {
  steps: OnboardingStep[];
}

export function OnboardingChecklist({ steps }: OnboardingChecklistProps) {
  const completedSteps = steps.filter(s => s.isCompleted).length;
  const totalSteps = steps.length;
  const progress = Math.round((completedSteps / totalSteps) * 100);
  
  // Only show the checklist if not all mandatory steps are completed
  const mandatorySteps = steps.filter(s => !s.isOptional);
  const allMandatoryCompleted = mandatorySteps.every(s => s.isCompleted);

  if (allMandatoryCompleted && progress === 100) return null;

  return (
    <Card className="relative overflow-hidden border-none bg-gradient-to-br from-primary/10 via-background to-primary/5 shadow-2xl group transition-all duration-500">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/15 transition-colors duration-700" />
      <div className="absolute bottom-[-10%] left-[-5%] w-48 h-48 bg-primary/5 rounded-full blur-2xl" />
      
      <CardContent className="p-6 md:p-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Sparkles className="h-5 w-5 text-primary animate-pulse" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Bem-vindo ao RadFlow!
              </h2>
            </div>
            <p className="text-muted-foreground text-lg">
              Complete estes passos para configurar sua conta e começar a criar laudos incríveis.
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-2 shrink-0">
            <div className="text-sm font-semibold text-primary mb-1">
              Progresso do Setup: {progress}%
            </div>
            <Progress value={progress} className="w-full md:w-48 h-2.5" />
            <p className="text-xs text-muted-foreground mt-1">
              {completedSteps} de {totalSteps} tarefas concluídas
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => {
            const Icon = ICON_MAP[step.icon];
            return (
              <Link 
                key={step.id} 
                href={step.href}
                className={cn(
                  "group/item relative p-5 rounded-2xl border transition-all duration-300",
                  step.isCompleted 
                    ? "bg-muted/30 border-primary/20 opacity-80" 
                    : "bg-background/50 hover:bg-background hover:shadow-lg hover:-translate-y-1 border-border/50 hover:border-primary/50"
                )}
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className={cn(
                      "p-3 rounded-xl transition-colors",
                      step.isCompleted 
                        ? "bg-primary/20 text-primary" 
                        : "bg-muted text-muted-foreground group-hover/item:bg-primary/10 group-hover/item:text-primary"
                    )}>
                      <Icon className="h-6 w-6" />
                    </div>
                    {step.isCompleted ? (
                      <CheckCircle2 className="h-6 w-6 text-primary" />
                    ) : (
                      <Circle className="h-6 w-6 text-muted-foreground/30 group-hover/item:text-primary/50" />
                    )}
                  </div>
                  
                  <h3 className="font-bold text-lg mb-1 flex items-center gap-1.5">
                    {step.title}
                    {step.isOptional && (
                      <span className="text-[10px] font-normal uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground border">
                        Opcional
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4 group-hover/item:text-foreground/80 transition-colors">
                    {step.description}
                  </p>
                  
                  <div className="mt-auto flex items-center text-xs font-semibold text-primary">
                    {step.isCompleted ? 'Configurado' : 'Configurar agora'}
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover/item:translate-x-1" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {allMandatoryCompleted && (
          <div className="mt-12 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="p-4 bg-emerald-500/10 text-emerald-600 rounded-full mb-4 border border-emerald-500/20">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">Tudo Pronto!</h3>
            <p className="text-muted-foreground mb-6 max-w-md text-center">
              Você concluiu os passos essenciais. Agora você já pode começar a emitir seus laudos com total profissionalismo.
            </p>
            <Button asChild size="lg" className="rounded-full px-8 shadow-lg hover:shadow-xl transition-all hover:scale-105">
              <Link href="/dashboard">
                Ir para o Painel de Controle
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
