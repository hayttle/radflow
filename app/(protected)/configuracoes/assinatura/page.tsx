import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { SignatureForm } from "./SignatureForm";

export const metadata = { title: "Assinatura | RadFlow" };

export default async function AssinaturaPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("signature")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <PageContainer>
      <div className="mb-8">
        <PageHeader
          title="Assinatura"
          description="Configure a assinatura utilizada na impressão dos laudos"
        />
      </div>
      <SignatureForm initialSignature={profile?.signature} />
    </PageContainer>
  );
}
