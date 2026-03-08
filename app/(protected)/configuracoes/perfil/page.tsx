import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { ProfileForm } from "./ProfileForm";

export const metadata = { title: "Perfil e Assinatura | RadFlow" };

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
      <div className="mb-8">
        <PageHeader title="Perfil & Assinatura" description="Configurações da sua conta de médico radiologista" />
      </div>
      <ProfileForm profile={profile} />
    </PageContainer>
  );
}
