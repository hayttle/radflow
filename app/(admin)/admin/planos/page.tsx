import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/shared/page-header";
import { PlansTableClient } from "@/components/admin/plans-table-client";

export const metadata = { title: "Planos de Assinatura | Admin" };

export default async function PlanosPage() {
  const supabase = await createClient();

  const { data: plans } = await supabase
    .from("plans")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <PageHeader
        title="Planos de Assinatura"
        description="Gerencie os planos disponíveis para os clientes. Configure preços, recorrência e recursos."
      />

      <div className="p-1 bg-gradient-to-br from-orange-600/10 via-transparent to-orange-600/10 rounded-2xl">
        <PlansTableClient plans={plans || []} />
      </div>
    </div>
  );
}
