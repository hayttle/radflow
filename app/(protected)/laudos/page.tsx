import {createClient} from "@/lib/supabase/server"
import {redirect} from "next/navigation"
import {cookies} from "next/headers"
import Link from "next/link"
import {Button} from "@/components/ui/button"
import {Plus} from "lucide-react"
import {PageContainer} from "@/components/shared/page-container"
import {PageHeader} from "@/components/shared/page-header"
import {DataPagination} from "@/components/shared/data-pagination"
import {DataFilter} from "@/components/shared/data-filter"
import {LaudosTable, type LaudoRequestRow} from "@/components/laudos/LaudosTable"
import {LaudosUnitSync} from "@/components/laudos/LaudosUnitSync"

const PAGE_SIZE = 15

const STATUS_OPTIONS = [
  {label: "Todos", value: undefined as string | undefined},
  {label: "Pendentes", value: "pending"},
  {label: "Em andamento", value: "in_progress"},
  {label: "Concluídos", value: "completed"}
]

interface PageProps {
  searchParams: Promise<{page?: string; status?: string; from?: string; to?: string}>
}

export const metadata = {
  title: "Laudos | RadFlow",
  description: "Gerencie seus atendimentos e laudos radiológicos"
}

const UNIT_COOKIE = "radflow_active_unit_id"

export default async function LaudosPage({searchParams}: PageProps) {
  const {page: pageParam, status: statusParam, from: fromParam, to: toParam} = await searchParams
  const currentPage = Math.max(1, parseInt(pageParam ?? "1", 10))
  const offset = (currentPage - 1) * PAGE_SIZE

  const cookieStore = await cookies()
  const unitId = cookieStore.get(UNIT_COOKIE)?.value

  const supabase = await createClient()
  const {
    data: {user}
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  let query = supabase
    .from("exam_requests")
    .select(
      `
      id, status, date, notes, created_at,
      patients ( id, name, cpf ),
      units ( id, name ),
      exam_items ( id )
    `,
      {count: "exact"}
    )
    .eq("user_id", user.id)
    .order("date", {ascending: false})
    .order("created_at", {ascending: false})
    .range(offset, offset + PAGE_SIZE - 1)

  if (statusParam && ["pending", "in_progress", "completed"].includes(statusParam)) {
    query = query.eq("status", statusParam)
  }
  if (fromParam) {
    query = query.gte("date", fromParam)
  }
  if (toParam) {
    query = query.lte("date", toParam)
  }
  if (unitId) {
    query = query.eq("unit_id", unitId)
  }

  const {data: requests, count} = await query
  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE)

  return (
    <PageContainer
      title="Laudos"
      description="Atendimentos e laudos radiológicos"
      actions={
        <Button asChild className="shrink-0 rounded-full shadow-md">
          <Link href="/laudos/novo">
            <Plus className="h-4 w-4 mr-2" />
            Novo Laudo
          </Link>
        </Button>
      }
    >
      <LaudosUnitSync />

      <div className="mt-6">
        <DataFilter statusOptions={STATUS_OPTIONS} showDateRange />
      </div>

      <div className="mt-4">
        <LaudosTable
          data={(requests ?? []) as unknown as LaudoRequestRow[]}
          emptyMessage="Nenhum atendimento encontrado para esta data/unidade."
          emptyAction={
            <Button asChild variant="outline">
              <Link href="/laudos/novo">
                <Plus className="h-4 w-4 mr-2" />
                Criar primeiro laudo
              </Link>
            </Button>
          }
        />
      </div>

      {totalPages > 1 && (
        <div className="mt-6">
          <DataPagination currentPage={currentPage} totalPages={totalPages} />
        </div>
      )}
    </PageContainer>
  )
}
