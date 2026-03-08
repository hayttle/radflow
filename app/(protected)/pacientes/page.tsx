import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PageContainer } from "@/components/page-container";
import { PatientsClient } from "./PatientsClient";

const PAGE_SIZE = 15;

export const metadata = { title: "Pacientes | RadFlow" };

export default async function PacientesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const { page, q } = await searchParams;
  const currentPage = Math.max(1, parseInt(page ?? "1", 10));
  const offset = (currentPage - 1) * PAGE_SIZE;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  let query = supabase
    .from("patients")
    .select(
      `
      *,
      exam_requests (
        id, date, status
      )
    `,
      { count: "exact" }
    )
    .eq("user_id", user.id)
    .order("name", { ascending: true })
    .range(offset, offset + PAGE_SIZE - 1);

  if (q) {
    query = query.or(`name.ilike.%${q}%,cpf.ilike.%${q}%`);
  }

  const { data: patients, count } = await query;
  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE);

  return (
    <PageContainer>
      <PatientsClient 
        patients={patients ?? []} 
        currentPage={currentPage}
        totalPages={totalPages}
        initialQuery={q ?? ""}
      />
    </PageContainer>
  );
}
