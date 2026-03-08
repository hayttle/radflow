import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PageContainer } from "@/components/page-container";
import { PhrasesClient } from "./PhrasesClient";

export const metadata = { title: "Frases Padrão | RadFlow" };

export default async function ExamPhrasesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: phrases } = await supabase
    .from("exam_phrases")
    .select("*")
    .eq("user_id", user.id)
    .order("category", { ascending: true })
    .order("label", { ascending: true });

  return (
    <PageContainer>
      <PhrasesClient phrases={phrases ?? []} />
    </PageContainer>
  );
}
