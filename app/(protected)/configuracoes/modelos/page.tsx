import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PageContainer } from "@/components/shared/page-container";
import { ModelsClient } from "./ModelsClient";

export const metadata = { title: "Modelos de Exame | RadFlow" };

const PAGE_SIZE = 15;

interface PageProps {
  searchParams: Promise<{ page?: string; q?: string; unit?: string }>;
}

export default async function ExamTemplatesPage({ searchParams }: PageProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { page: pageParam, q, unit } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageParam ?? "1", 10));
  const offset = (currentPage - 1) * PAGE_SIZE;

  let query = supabase
    .from("exam_templates")
    .select("*", { count: "exact" })
    .eq("user_id", user.id)
    .order("title", { ascending: true })
    .range(offset, offset + PAGE_SIZE - 1);

  if (q?.trim()) query = query.ilike("title", `%${q.trim()}%`);
  if (unit) query = query.eq("unit_id", unit);

  const [templatesRes, unitsRes] = await Promise.all([
    query,
    supabase
      .from("units")
      .select("id, name")
      .eq("user_id", user.id)
      .order("name", { ascending: true }),
  ]);

  const templates = templatesRes.data ?? [];
  const totalCount = templatesRes.count ?? 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const units = unitsRes.data ?? [];

  return (
    <PageContainer>
      <ModelsClient
        templates={templates}
        units={units}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </PageContainer>
  );
}
