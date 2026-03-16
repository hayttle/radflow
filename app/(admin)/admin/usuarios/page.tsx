import { createClient } from "@/lib/supabase/server";
import { UserTableClient } from "@/components/user-table-client";
import { Users } from "lucide-react";

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-lg bg-orange-600/10 text-orange-600">
              <Users className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Gestão de Usuários</h1>
          </div>
          <p className="text-muted-foreground text-sm">Controle de acessos e permissões globais do sistema.</p>
        </div>
      </div>

      <div className="p-1 bg-gradient-to-br from-orange-600/10 via-transparent to-orange-600/10 rounded-2xl">
        <UserTableClient users={users || []} currentUserId={user?.id || ""} />
      </div>
    </div>
  );
}
