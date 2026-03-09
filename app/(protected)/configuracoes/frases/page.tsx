import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PageContainer } from "@/components/page-container";
import { PhrasesClient } from "./PhrasesClient";

export const metadata = { title: "Frases Padrão | RadFlow" };

interface PageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function ExamPhrasesPage({ searchParams }: PageProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { category } = await searchParams;

  let phrasesQuery = supabase
    .from("exam_phrases")
    .select("*")
    .eq("user_id", user.id)
    .order("category", { ascending: true })
    .order("label", { ascending: true });

  if (category) phrasesQuery = phrasesQuery.eq("category", category);

  const [phrasesRes, categoriesRes] = await Promise.all([
    phrasesQuery,
    supabase
      .from("exam_phrases")
      .select("category")
      .eq("user_id", user.id),
  ]);

  const phrases = phrasesRes.data ?? [];
  const categories = [
    ...new Set((categoriesRes.data ?? []).map((r) => r.category)),
  ].sort();

  return (
    <PageContainer>
      <PhrasesClient phrases={phrases} categories={categories} />
    </PageContainer>
  );
}
