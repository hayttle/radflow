import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, MessageSquare, Building2, TrendingUp, ShieldAlert, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const metadata = { title: "Admin Dashboard | RadFlow" };

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // Fetch global metrics
  const [
    { count: usersCount },
    { count: feedbacksCount },
    { count: pendingFeedbacksCount },
    { count: unitsCount },
    { data: recentFeedbacks },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: 'exact', head: true }),
    supabase.from("feedbacks").select("*", { count: 'exact', head: true }),
    supabase.from("feedbacks").select("*", { count: 'exact', head: true }).eq("status", "pending"),
    supabase.from("units").select("*", { count: 'exact', head: true }),
    supabase.from("feedbacks")
      .select(`
        id,
        title,
        type,
        status,
        created_at,
        profiles ( full_name, email )
      `)
      .order("created_at", { ascending: false })
      .limit(5)
  ]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Visão Geral do Sistema</h1>
        <p className="text-muted-foreground mt-1">Bem-vindo à central de controle do RadFlow.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Users Stats */}
        <Card className="bg-gradient-to-br from-card to-blue-500/5 border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Usuários Totais</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-foreground">{usersCount ?? 0}</div>
            <div className="flex items-center gap-1 mt-1 text-emerald-600">
              <TrendingUp className="h-3 w-3" />
              <span className="text-[10px] font-medium">+2 esta semana</span>
            </div>
          </CardContent>
        </Card>

        {/* Feedbacks Stats */}
        <Card className="bg-gradient-to-br from-card to-orange-500/5 border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pendentes de Suporte</CardTitle>
            <ShieldAlert className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-orange-600">{pendingFeedbacksCount ?? 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Aguardando visualização</p>
          </CardContent>
        </Card>

        {/* Units Stats */}
        <Card className="bg-gradient-to-br from-card to-emerald-500/5 border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Unidades de Saúde</CardTitle>
            <Building2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-foreground">{unitsCount ?? 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Cadastradas no sistema</p>
          </CardContent>
        </Card>

        {/* Total Feedback Stats */}
        <Card className="bg-gradient-to-br from-card to-purple-500/5 border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Feedbacks Totais</CardTitle>
            <MessageSquare className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-foreground">{feedbacksCount ?? 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Enviados por usuários</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Feedback List */}
        <Card className="lg:col-span-2 shadow-sm border overflow-hidden flex flex-col">
          <CardHeader className="bg-muted/30 border-b pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Feedbacks Recentes</CardTitle>
                <CardDescription>Últimas mensagens enviadas pelos usuários.</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild className="hidden sm:flex text-orange-600 hover:text-orange-700 hover:bg-orange-50">
                <Link href="/admin/feedbacks">
                  Ver todos <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1 flex flex-col">
            {recentFeedbacks && recentFeedbacks.length > 0 ? (
              <div className="divide-y">
                {recentFeedbacks.map((feedback) => (
                  <div key={feedback.id} className="p-4 flex items-center justify-between hover:bg-muted/20 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${
                        feedback.type === "bug" ? "bg-red-100 text-red-600" :
                        feedback.type === "feature_request" ? "bg-blue-100 text-blue-600" :
                        "bg-orange-100 text-orange-600"
                      }`}>
                        <MessageSquare className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-sm leading-none mb-1">{feedback.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {/* @ts-expect-error supabase typing */}
                          Por: {feedback.profiles?.full_name || "Usuário"} • {format(new Date(feedback.created_at), "dd/MM/yyyy", { locale: ptBR })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        feedback.status === "pending" ? "bg-orange-100 text-orange-700" :
                        feedback.status === "resolved" ? "bg-emerald-100 text-emerald-700" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {feedback.status === "pending" ? "Pendente" : feedback.status === "resolved" ? "Resolvido" : "Visualizado"}
                      </div>
                      <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        <Link href={`/admin/feedbacks?id=${feedback.id}`}>
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center flex-1 min-h-[200px]">
                <MessageSquare className="h-10 w-10 text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground text-sm">Nenhum feedback recebido ainda.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats/Actions */}
        <Card className="shadow-sm border h-fit">
          <CardHeader className="bg-muted/30 border-b pb-4">
            <CardTitle className="text-lg">Ações Rápidas</CardTitle>
            <CardDescription>Ferramentas de administração</CardDescription>
          </CardHeader>
          <CardContent className="p-4 flex flex-col gap-3">
            <Button variant="outline" className="justify-start h-12 border-orange-200 hover:bg-orange-50 hover:text-orange-700" asChild>
              <Link href="/admin/usuarios">
                <Users className="h-4 w-4 mr-3 text-orange-600" />
                Gerenciar Usuários
              </Link>
            </Button>
            <Button variant="outline" className="justify-start h-12" asChild>
              <Link href="/admin/feedbacks">
                <MessageSquare className="h-4 w-4 mr-3 text-primary" />
                Responder Mensagens
              </Link>
            </Button>
            <div className="mt-4 p-4 rounded-xl bg-orange-600/5 border border-orange-600/10">
              <h4 className="text-xs font-bold text-orange-800 uppercase tracking-widest mb-2">Dica do Sistema</h4>
              <p className="text-[11px] text-orange-700 leading-relaxed">
                Periodicamente revise os feedbacks marcados como "Pendente" para manter o suporte em dia.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
