"use client";

import { DataTable } from "@/components/data-table";
import { RoleSwitcher } from "@/components/role-switcher";
import { UserActiveToggle } from "@/components/user-active-toggle";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Mail, Calendar } from "lucide-react";

interface UserTableClientProps {
  users: any[];
  currentUserId: string;
}

export function UserTableClient({ users, currentUserId }: UserTableClientProps) {
  const columns = [
    {
      key: "user",
      label: "Usuário",
      render: (row: any) => (
        <div className="flex flex-col">
          <span className="font-semibold text-foreground">{row.full_name || "Sem Nome"}</span>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
            <Mail className="h-3 w-3" />
            <span>{row.email}</span>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      label: "Papel / Permissões",
      render: (row: any) => <RoleSwitcher userId={row.id} currentRole={row.role} currentUserId={currentUserId} />,
    },
    {
      key: "is_active",
      label: "Status",
      render: (row: any) => (
        <UserActiveToggle 
          userId={row.id} 
          isActive={row.is_active} 
          currentUserId={currentUserId} 
        />
      ),
    },
    {
      key: "created_at",
      label: "Membro Desde",
      render: (row: any) => (
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          <span>{format(new Date(row.created_at), "dd/MM/yyyy", { locale: ptBR })}</span>
        </div>
      ),
    },
    {
      key: "crm",
      label: "CRM",
      render: (row: any) => row.crm ? (
        <Badge variant="outline" className="font-mono text-[10px]">{row.crm}</Badge>
      ) : (
        <span className="text-muted-foreground/30">—</span>
      ),
    },
  ];

  return (
    <DataTable
      data={users}
      columns={columns}
      getRowId={(row) => row.id}
      emptyMessage="Nenhum usuário encontrado."
    />
  );
}
