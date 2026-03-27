import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { OnboardingChecklist } from "@/components/onboarding/onboarding-checklist";
import { getOnboardingStatus } from "./actions";

export const metadata = { title: "Boas-vindas | RadFlow" };

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const onboardingStatus = await getOnboardingStatus();

  // If everything is done, they don't need to be here anymore
  if (onboardingStatus.isCompleted) {
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
        
        <OnboardingChecklist steps={onboardingStatus.steps} />
        
        <div className="mt-8 text-center text-sm text-muted-foreground">
          Precisa de ajuda? <Link href="/suporte" className="text-primary hover:underline">Fale com nosso suporte</Link>
        </div>
      </div>
    </div>
  );
}
