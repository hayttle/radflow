import { AdminSidebar } from "@/components/admin-sidebar";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { UserProfile } from "@/components/user-profile";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";

async function AdminAuthWrapper({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth/login");
  }

  // Verify super_admin role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "super_admin") {
    // If not a super_admin, redirect to main dashboard with a friendly message (future enhancement: toast)
    return redirect("/dashboard");
  }

  const userName = profile?.full_name ?? (user.user_metadata?.full_name as string | undefined);

  return (
    <SidebarProvider>
      <AdminSidebar
        userEmail={user.email}
        userName={userName}
        avatarUrl={user.user_metadata?.avatar_url}
      />
      <SidebarInset className="flex flex-col h-screen min-w-0 overflow-hidden">
        {/* Admin Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b px-6 bg-background/95 backdrop-blur-md sticky top-0 z-10 w-full">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <div className="h-4 w-px bg-border hidden sm:block" />
            <h1 className="font-semibold text-sm text-muted-foreground uppercase tracking-widest hidden sm:block">
              Área Administrativa
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <UserProfile
              userEmail={user.email}
              userName={userName}
              avatarUrl={user.user_metadata?.avatar_url}
            />
          </div>
        </header>

        {/* Admin Main Content */}
        <main className="flex-1 overflow-y-auto bg-muted/30 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 rounded-full border-4 border-orange-600/20 border-t-orange-600 animate-spin" />
            <p className="text-sm font-medium text-muted-foreground animate-pulse">
              Validando credenciais de administrador...
            </p>
          </div>
        </div>
      }
    >
      <AdminAuthWrapper>{children}</AdminAuthWrapper>
    </Suspense>
  );
}
