import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { DataPagination } from "@/components/data-pagination";
import { ExamRequestRow } from "@/components/laudos/ExamRequestRow";

const PAGE_SIZE = 15;

interface PageProps {
  searchParams: Promise<{ page?: string; status?: string }>;
}

export const metadata = {
  title: "Laudos | RadFlow",
  description: "Gerencie seus atendimentos e laudos radiológicos",
};

export default async function LaudosPage({ searchParams }: PageProps) {
  const { page: pageParam, status: statusParam } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageParam ?? "1", 10));
  const offset = (currentPage - 1) * PAGE_SIZE;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  let query = supabase
    .from("exam_requests")
    .select(
      `
      id, status, date, notes, created_at,
      patients ( id, name, cpf ),
      units ( id, name )
    `,
      { count: "exact" }
    )
    .eq("user_id", user.id)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1);

  if (statusParam && ["pending", "in_progress", "completed"].includes(statusParam)) {
    query = query.eq("status", statusParam);
  }

  const { data: requests, count } = await query;
  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE);

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <PageHeader
          title="Laudos"
          description="Atendimentos e laudos radiológicos"
        />
        <Button asChild>
          <Link href="/laudos/novo">
            <Plus className="h-4 w-4 mr-2" />
            Novo Laudo
          </Link>
        </Button>
      </div>

      {/* Status Filters */}
      <div className="flex gap-2 mt-6">
        {[
          { label: "Todos", value: undefined },
          { label: "Pendentes", value: "pending" },
          { label: "Em andamento", value: "in_progress" },
          { label: "Concluídos", value: "completed" },
        ].map(({ label, value }) => (
          <Link
            key={label}
            href={value ? `/laudos?status=${value}` : "/laudos"}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              statusParam === value || (!statusParam && !value)
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* List */}
      <div className="mt-4 space-y-2">
        {requests && requests.length > 0 ? (
          requests.map((req) => (
            <ExamRequestRow key={req.id} request={(req as unknown) as Parameters<typeof ExamRequestRow>[0]["request"]} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-muted-foreground text-sm">Nenhum atendimento encontrado.</p>
            <Button asChild variant="outline" className="mt-4">
              <Link href="/laudos/novo">
                <Plus className="h-4 w-4 mr-2" />
                Criar primeiro laudo
              </Link>
            </Button>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-6">
          <DataPagination currentPage={currentPage} totalPages={totalPages} />
        </div>
      )}
    </PageContainer>
  );
}
