import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";

async function AuthGuard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth/login");
  }

  return null;
}

export default function PrintLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen print:min-h-0 print:block bg-gray-100 print:bg-white text-black font-sans">
      <Suspense fallback={null}>
        <AuthGuard />
      </Suspense>
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Carregando laudo...</div>}>
        {children}
      </Suspense>
    </div>
  );
}
