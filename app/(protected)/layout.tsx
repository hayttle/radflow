import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { UserProfile } from "@/components/layout/user-profile";
import { UnitSwitcher } from "@/components/layout/unit-switcher";
import { UnitProvider } from "@/contexts/unit-context";
import { OnboardingProvider } from "@/components/onboarding/onboarding-provider";
import { OnboardingTracker } from "@/components/onboarding/onboarding-tracker";
import { getOnboardingStatus } from "@/app/(protected)/onboarding/actions";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import type { Unit } from "@/types/supabase";

async function AuthWrapper({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth/login");
  }

  const [{ data: units }, { data: profile }] = await Promise.all([
    supabase
      .from("units")
      .select("*")
      .eq("user_id", user.id)
      .eq("active", true)
      .order("name", { ascending: true }),
    supabase.from("profiles").select("full_name, role").eq("id", user.id).single(),
  ]);

  const onboardingStatus = await getOnboardingStatus();
  const userName = profile?.full_name ?? (user.user_metadata?.full_name as string | undefined);

  return (
    <UnitProvider initialUnits={(units as Unit[]) ?? []}>
      <OnboardingProvider initialStatus={onboardingStatus}>
        <SidebarProvider>
          <AppSidebar
            userEmail={user.email}
            userName={userName}
            avatarUrl={user.user_metadata?.avatar_url}
            role={profile?.role}
          />
          <SidebarInset className="flex flex-col h-screen min-w-0 overflow-hidden">
            {/* Fixed Header */}
            <header className="flex h-16 shrink-0 items-center justify-between border-b px-6 bg-background sticky top-0 z-10 w-full">
              <SidebarTrigger />
              <div className="flex items-center gap-3">
                <span className="hidden lg:inline-block text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                  Unidade de Trabalho:
                </span>
                <UnitSwitcher />
                <UserProfile
                  userEmail={user.email}
                  userName={userName}
                  avatarUrl={user.user_metadata?.avatar_url}
                />
              </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-muted/20">
              {children}
            </main>
            <OnboardingTracker />
          </SidebarInset>
        </SidebarProvider>
      </OnboardingProvider>
    </UnitProvider>
  );
}

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center">
          Carregando...
        </div>
      }
    >
      <AuthWrapper>{children}</AuthWrapper>
    </Suspense>
  );
}
