"use client";

import { 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Circle, 
  ArrowRight,
  Building2,
  BookTemplate,
  MessageSquareQuote,
  Signature as SignatureIcon
} from "lucide-react";
import { useState } from "react";
import { useOnboarding } from "./onboarding-provider";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ICON_MAP = {
  building: Building2,
  book: BookTemplate,
  message: MessageSquareQuote,
  signature: SignatureIcon,
};

export function OnboardingTracker() {
  const { status, isLoading } = useOnboarding();
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname();

  // Don't show if loading, completed, or on the onboarding page itself
  if (isLoading || !status || status.isCompleted || pathname === "/onboarding") {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-none">
      {/* Expanded Checklist */}
      {isExpanded && (
        <div className="pointer-events-auto w-80 bg-background border shadow-2xl rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="p-4 bg-primary/5 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="font-bold text-sm">Seu Setup</span>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full" 
              onClick={() => setIsExpanded(false)}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="p-4 space-y-3">
            <div className="space-y-1.5 mb-4">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                <span>Progresso</span>
                <span>{status.progress}%</span>
              </div>
              <Progress value={status.progress} className="h-1.5" />
            </div>

            <div className="space-y-2">
              {status.steps.map((step) => {
                const Icon = ICON_MAP[step.icon];
                const isActive = pathname === step.href;
                
                return (
                  <Link 
                    key={step.id} 
                    href={step.href}
                    className={cn(
                      "flex items-center gap-3 p-2 rounded-lg transition-all border border-transparent",
                      step.isCompleted ? "opacity-60 grayscale-[0.5]" : "hover:bg-primary/5 hover:border-primary/10",
                      isActive && "bg-primary/10 border-primary/20"
                    )}
                  >
                    <div className={cn(
                      "p-1.5 rounded-md",
                      step.isCompleted ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                    )}>
                      <Icon className="h-4 w-4" />
                    </div>
                    
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-medium truncate">{step.title}</span>
                        {step.isOptional && (
                          <span className="text-[8px] uppercase px-1 rounded bg-muted text-muted-foreground font-semibold">
                            Opt
                          </span>
                        )}
                      </div>
                    </div>

                    {step.isCompleted ? (
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground/30 shrink-0" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
          
          <div className="p-3 bg-muted/30 border-t">
            <Button asChild variant="link" size="sm" className="w-full text-xs h-auto py-1">
              <Link href="/onboarding">Ver checklist completo</Link>
            </Button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        size="lg"
        className={cn(
          "pointer-events-auto rounded-full h-14 px-6 shadow-xl hover:shadow-2xl transition-all duration-300 gap-3 group border-2 border-primary/20",
          isExpanded ? "scale-90 opacity-0" : "animate-in zoom-in-50"
        )}
      >
        {!isExpanded && (
          <>
            <div className="relative">
              <Sparkles className="h-5 w-5 text-primary-foreground group-hover:animate-pulse" />
              <div className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-emerald-500 rounded-full border-2 border-primary shadow-sm" />
            </div>
            <div className="flex flex-col items-start leading-none">
              <span className="text-xs font-bold uppercase tracking-wider opacity-90">Setup Pendente</span>
              <span className="text-[10px] opacity-70">Complete sua configuração</span>
            </div>
            <div className="ml-2 h-8 w-8 rounded-full bg-primary-foreground/10 flex items-center justify-center text-[10px] font-bold">
              {status.steps.filter(s => s.isCompleted).length}/{status.steps.length}
            </div>
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </>
        )}
      </Button>
    </div>
  );
}
