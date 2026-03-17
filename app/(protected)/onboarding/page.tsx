import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PageContainer } from "@/components/page-container";
import { OnboardingChecklist, OnboardingStep } from "@/components/onboarding-checklist";

export const metadata = { title: "Boas-vindas | RadFlow" };

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  // Fetch onboarding status data
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

  const onboardingSteps: OnboardingStep[] = [
    {
      id: "unidades",
      title: "Unidades",
      description: "Cadastre suas unidades com cabeçalho e rodapé personalizados.",
      href: "/configuracoes/unidades",
      icon: "building",
      isCompleted: (unitsResult.data && unitsResult.data.length > 0 && !!unitsResult.data[0].report_header && !!unitsResult.data[0].report_footer) as boolean,
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

  const mandatorySteps = onboardingSteps.filter(s => !s.isOptional);
  const allMandatoryCompleted = mandatorySteps.every(s => s.isCompleted);

  // If everything is done, they don't need to be here anymore
  if (allMandatoryCompleted && onboardingSteps.every(s => s.isCompleted)) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-muted/10 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Vamos começar, {user.user_metadata?.full_name?.split(' ')[0] || 'Doutor'}!
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Siga os passos abaixo para deixar o sistema pronto para sua rotina de laudos.
          </p>
        </div>
        
        <OnboardingChecklist steps={onboardingSteps} />
        
        <div className="mt-8 text-center text-sm text-muted-foreground">
          Precisa de ajuda? <Link href="/suporte" className="text-primary hover:underline">Fale com nosso suporte</Link>
        </div>
      </div>
    </div>
  );
}
