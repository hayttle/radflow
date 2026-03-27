import { createClient } from "@/lib/supabase/server";
import { UserTableClient } from "@/components/admin/user-table-client";
import { PageHeader } from "@/components/shared/page-header";

export const metadata = { title: "Gerenciar Usuários | Admin" };

export default async function UsuariosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: users } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <PageHeader
        title="Gestão de Usuários"
        description="Controle de acessos e permissões globais do sistema."
      />

      <div className="p-1 bg-gradient-to-br from-orange-600/10 via-transparent to-orange-600/10 rounded-2xl">
        <UserTableClient users={users || []} currentUserId={user?.id || ""} />
      </div>
    </div>
  );
}
