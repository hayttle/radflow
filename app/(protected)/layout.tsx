import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { UserProfile } from "@/components/user-profile";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";

async function AuthWrapper({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth/login");
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col h-screen min-w-0 overflow-hidden">
        {/* Header Fixo acima do Main */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b px-6 bg-background sticky top-0 z-10 w-full">
          <SidebarTrigger />
          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <UserProfile userEmail={user.email} avatarUrl={user.user_metadata?.avatar_url} />
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-muted/20">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div className="flex h-screen w-full items-center justify-center">Carregando...</div>}>
      <AuthWrapper>{children}</AuthWrapper>
    </Suspense>
  );
}
