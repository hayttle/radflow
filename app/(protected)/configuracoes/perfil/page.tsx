import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { ProfileForm } from "./ProfileForm";

export const metadata = { title: "Perfil | RadFlow" };

export default async function ProfileSettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <PageContainer>
      <PageHeader 
        title="Perfil do Usuário" 
        description="Gerencie suas informações pessoais e segurança da conta." 
      />
      
      <div className="max-w-4xl">
        <ProfileForm profile={profile} userEmail={user.email ?? undefined} />
      </div>
    </PageContainer>
  );
}
