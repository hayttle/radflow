import { createClient } from "@/lib/supabase/server";
import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, CreditCard, Activity, TrendingUp } from "lucide-react";

export default async function AdminSubscriptionsPage() {
  const supabase = await createClient();

  const { data: subscriptions } = await supabase
    .from("subscriptions")
    .select(`
      *,
      profiles:user_id(full_name, email),
      prices(*, products(*))
    `)
    .order('created', { ascending: false });

  const activeCount = subscriptions?.filter(s => s.status === 'active').length ?? 0;
  const trialCount = subscriptions?.filter(s => s.status === 'trialing').length ?? 0;
  const totalRevenue = subscriptions?.reduce((acc, s) => s.status === 'active' ? acc + (s.prices.unit_amount / 100) : acc, 0) ?? 0;

  return (
    <PageContainer>
      <PageHeader
        title="Gestão de Assinaturas"
        description="Acompanhe todas as assinaturas e faturamento do sistema."
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="bg-primary/5 border-primary/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assinaturas Ativas</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCount}</div>
            <p className="text-xs text-muted-foreground">Clientes pagantes ativos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Período de Teste</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trialCount}</div>
            <p className="text-xs text-muted-foreground">Novos usuários testando</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Mensal Est.</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalRevenue.toFixed(2).replace('.', ',')}</div>
            <p className="text-xs text-muted-foreground">Baseado em planos ativos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subscriptions?.length ?? 0}</div>
            <p className="text-xs text-muted-foreground">Histórico total de registros</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Assinantes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead>Plano</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Faturamento</TableHead>
                <TableHead>Início</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions?.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{sub.profiles?.full_name || 'Usuário'}</span>
                      <span className="text-xs text-muted-foreground">{sub.profiles?.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {sub.prices.products.name} ({sub.prices.interval === 'month' ? 'Mensal' : 'Anual'})
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={
                      sub.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-none' :
                      sub.status === 'trialing' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-none' :
                      'bg-slate-100 text-slate-700 dark:bg-slate-900/30'
                    }>
                      {sub.status === 'active' ? 'Ativo' : 
                       sub.status === 'trialing' ? 'Teste' : sub.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm font-medium">
                    R$ {(sub.prices.unit_amount / 100).toFixed(2).replace('.', ',')}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(sub.created).toLocaleDateString('pt-BR')}
                  </TableCell>
                </TableRow>
              ))}
              {(!subscriptions || subscriptions.length === 0) && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                    Nenhuma assinatura encontrada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
