"use server";

import { createClient } from "@/lib/supabase/server";

export interface OnboardingStatus {
  isCompleted: boolean;
  steps: {
    id: string;
    title: string;
    description: string;
    href: string;
    icon: "building" | "book" | "message" | "signature";
    isCompleted: boolean;
    isOptional?: boolean;
  }[];
  progress: number;
}

export async function getOnboardingStatus(): Promise<OnboardingStatus> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const [
    unitsResult,
    modelsResult,
    phrasesResult,
    profileResult
  ] = await Promise.all([
    supabase.from("units").select("id, report_header, report_footer").eq("user_id", user.id).limit(1),
    supabase.from("exam_templates").select("id").eq("user_id", user.id).limit(1),
    supabase.from("exam_phrases").select("id").eq("user_id", user.id).limit(1),
    supabase.from("profiles").select("signature").eq("id", user.id).single()
  ]);

  const steps: OnboardingStatus["steps"] = [
    {
      id: "unidades",
      title: "Unidades",
      description: "Cadastre suas unidades com cabeçalho e rodapé personalizados.",
      href: "/configuracoes/unidades",
      icon: "building",
      isCompleted: (unitsResult.data && unitsResult.data.length > 0) as boolean,
    },
    {
      id: "modelos",
      title: "Modelos de Exame",
      description: "Crie modelos de laudos com variáveis dinâmicas.",
      href: "/configuracoes/modelos",
      icon: "book",
      isCompleted: (modelsResult.data && modelsResult.data.length > 0) as boolean,
    },
    {
      id: "frases",
      title: "Frases Padrão",
      description: "Agilize seus laudos com frases prontas.",
      href: "/configuracoes/frases",
      icon: "message",
      isCompleted: (phrasesResult.data && phrasesResult.data.length > 0) as boolean,
      isOptional: true,
    },
    {
      id: "assinatura",
      title: "Assinatura Digital",
      description: "Configure sua assinatura para inserir automaticamente nos laudos.",
      href: "/configuracoes/assinatura",
      icon: "signature",
      isCompleted: !!profileResult.data?.signature,
    },
  ];

  const completedSteps = steps.filter(s => s.isCompleted).length;
  const totalSteps = steps.length;
  const progress = Math.round((completedSteps / totalSteps) * 100);
  
  const mandatorySteps = steps.filter(s => !s.isOptional);
  const allMandatoryCompleted = mandatorySteps.every(s => s.isCompleted);
  const isCompleted = allMandatoryCompleted;

  return {
    isCompleted,
    steps,
    progress
  };
}
