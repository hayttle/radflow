import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PageContainer } from "@/components/page-container";
import { ModelsClient } from "./ModelsClient";

export const metadata = { title: "Modelos de Exame | RadFlow" };

export default async function ExamTemplatesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  // Fetch both templates and units to pass to the client
  const [templatesRes, unitsRes] = await Promise.all([
    supabase
      .from("exam_templates")
      .select("*")
      .eq("user_id", user.id)
      .order("title", { ascending: true }),
    supabase
      .from("units")
      .select("*")
      .eq("user_id", user.id)
      .order("name", { ascending: true }),
  ]);

  return (
    <PageContainer>
      <ModelsClient 
        templates={templatesRes.data ?? []} 
        units={unitsRes.data ?? []} 
      />
    </PageContainer>
  );
}
