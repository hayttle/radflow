import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Activity, CheckCircle2, Clock, FilePlus2, FileText, ArrowRight, Users, BookTemplate, MessageSquareQuote } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const metadata = { title: "Dashboard | RadFlow" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const todayStr = new Date().toISOString().split('T')[0];

  // Fetch metrics and onboarding status concurrently
  const [
    todayMetrics,
    pendingMetrics,
    completedMetrics,
    recentExamsResult,
    unitsResult,
    profileResult
  ] = await Promise.all([
    supabase
      .from("exam_requests")
      .select("*", { count: 'exact', head: true })
      .eq("user_id", user.id)
      .gte("created_at", `${todayStr}T00:00:00.000Z`),
      
    supabase
      .from("exam_requests")
      .select("*", { count: 'exact', head: true })
      .eq("user_id", user.id)
      .eq("status", "pending"),
      
    supabase
      .from("exam_requests")
      .select("*", { count: 'exact', head: true })
      .eq("user_id", user.id)
      .eq("status", "completed"),

    supabase
      .from("exam_requests")
      .select(`
        id,
        status,
        created_at,
        patients ( name )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5),

    // Mandatory onboarding checks: at least one unit and signature
    supabase.from("units").select("id").eq("user_id", user.id).limit(1),
    supabase.from("profiles").select("signature").eq("id", user.id).single()
  ]);

  // Check if mandatory onboarding is missing
  const hasUnit = unitsResult.data && unitsResult.data.length > 0;
  const hasSignature = !!profileResult.data?.signature;

  if (!hasUnit || !hasSignature) {
    redirect("/onboarding");
  }

  const totalToday = todayMetrics.count ?? 0;
  const pendingCount = pendingMetrics.count ?? 0;
  const completedCount = completedMetrics.count ?? 0;
  const recentExams = recentExamsResult.data || [];

  return (
    <PageContainer>
      <PageHeader
        title="Painel de Controle"
        description="Visão geral dos seus laudos e produtividade."
        actions={
          <Button asChild className="shrink-0 rounded-full shadow-md group">
            <Link href="/laudos/novo">
              <FilePlus2 className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
              Novo Laudo
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card className="bg-gradient-to-br from-card to-muted/20 border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Laudos Hoje</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-foreground">{totalToday}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-amber-500/5 border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pendentes (Rascunhos)</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-amber-600">{pendingCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Aguardando finalização</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-emerald-500/5 border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Concluídos</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-emerald-600">{completedCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Assinados e fechados</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Exams List */}
        <Card className="lg:col-span-2 shadow-sm border overflow-hidden flex flex-col">
          <CardHeader className="bg-muted/30 border-b pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Últimos Atendimentos</CardTitle>
                <CardDescription>Atividades recentes no seu painel.</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild className="hidden sm:flex text-primary">
                <Link href="/laudos">
                  Ver todos <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1 flex flex-col">
            {recentExams && recentExams.length > 0 ? (
              <div className="divide-y">
                {recentExams.map((exam: any) => (
                  <div key={exam.id} className="p-4 flex items-center justify-between hover:bg-muted/20 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-sm leading-none mb-1">{exam.patients?.name || "Paciente Removido"}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(exam.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                        exam.status === "completed" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                        "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                      }`}>
                        {exam.status === "completed" ? "Concluído" : "Rascunho"}
                      </div>
                      <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        <Link href={`/laudos/${exam.id}`}>
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center flex-1 min-h-[200px]">
                <FileText className="h-10 w-10 text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground text-sm">Nenhum laudo encontrado.</p>
                <Button variant="link" asChild className="mt-2 text-primary font-medium hover:text-primary/90">
                  <Link href="/laudos/novo">Comece criando o primeiro</Link>
                </Button>
              </div>
            )}
          </CardContent>
          <div className="p-3 border-t bg-muted/10 sm:hidden">
            <Button variant="ghost" size="sm" asChild className="w-full text-primary">
              <Link href="/laudos">Ver todos os laudos</Link>
            </Button>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-sm border">
          <CardHeader className="bg-muted/30 border-b pb-4">
            <CardTitle className="text-lg">Acesso Rápido</CardTitle>
            <CardDescription>Atalhos mais utilizados</CardDescription>
          </CardHeader>
          <CardContent className="p-4 flex flex-col gap-2">
            <Button variant="outline" className="justify-start h-12" asChild>
              <Link href="/pacientes">
                <Users className="h-4 w-4 mr-3 text-primary" />
                Gestão de Pacientes
              </Link>
            </Button>
            <Button variant="outline" className="justify-start h-12" asChild>
              <Link href="/configuracoes/modelos">
                <BookTemplate className="h-4 w-4 mr-3 text-primary" />
                Modelos de Exame
              </Link>
            </Button>
            <Button variant="outline" className="justify-start h-12" asChild>
              <Link href="/configuracoes/frases">
                <MessageSquareQuote className="h-4 w-4 mr-3 text-primary" />
                Frases Padrão (Autotexto)
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
