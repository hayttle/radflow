import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { NovoLaudoForm } from "@/components/laudos/NovoLaudoForm";

export const metadata = {
  title: "Novo Laudo | RadFlow",
};

export default async function NovoLaudoPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  // Load units and templates for the form
  const [{ data: units }, { data: templates }] = await Promise.all([
    supabase
      .from("units")
      .select("id, name")
      .eq("user_id", user.id)
      .eq("active", true)
      .order("name"),
    supabase
      .from("exam_templates")
      .select("id, title, unit_id, variables")
      .eq("user_id", user.id)
      .eq("active", true)
      .order("title"),
  ]);

  return (
    <PageContainer className="max-w-2xl">
      <PageHeader
        title="Novo Laudo"
        description="Selecione o paciente, a unidade e o modelo de exame para iniciar."
      />
      <NovoLaudoForm
        units={units ?? []}
        templates={templates ?? []}
      />
    </PageContainer>
  );
}
