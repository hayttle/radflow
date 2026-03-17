"use client";

import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Clock, CheckCircle2, AlertCircle, Printer, Eye } from "lucide-react";
import { DataTable } from "@/components/data-table";
import type { DataTableColumn } from "@/components/data-table";

export type LaudoRequestRow = {
  id: string;
  status: string;
  date: string;
  patients: { id: string; name: string; cpf: string | null } | null;
  units: { id: string; name: string } | null;
  exam_items: { id: string }[];
};

const statusConfig: Record<
  string,
  { label: string; variant: "default" | "secondary" | "outline" | "success"; Icon: React.ElementType }
> = {
  pending: { label: "Pendente", variant: "secondary", Icon: Clock },
  in_progress: { label: "Em andamento", variant: "default", Icon: AlertCircle },
  completed: { label: "Concluído", variant: "success", Icon: CheckCircle2 },
};

const COLUMNS: DataTableColumn<LaudoRequestRow>[] = [
  {
    key: "patient",
    label: "Paciente",
    render: (row) => (
      <span className="font-medium">{row.patients?.name ?? "—"}</span>
    ),
  },
  {
    key: "date",
    label: "Data",
    render: (row) => (
      <span className="text-muted-foreground">
        {row.date
          ? format(new Date(row.date + "T00:00:00"), "dd/MM/yyyy", {
              locale: ptBR,
            })
          : "—"}
      </span>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (row) => {
      const config = statusConfig[row.status] ?? statusConfig.pending;
      const { Icon } = config;
      return (
        <Badge variant={config.variant} className="gap-1 w-fit">
          <Icon className="h-3 w-3" />
          {config.label}
        </Badge>
      );
    },
  },
  {
    key: "actions",
    label: "Ações",
    className: "text-right",
    render: (row) => {
      const firstItemId = row.exam_items?.[0]?.id;
      const href = firstItemId
        ? `/laudos/${row.id}/${firstItemId}`
        : `/laudos/${row.id}`;
      return (
        <div className="flex items-center justify-end gap-1">
          <Button asChild variant="ghost" size="icon" className="h-8 w-8" title="Abrir Laudo">
            <Link href={href}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            disabled={row.status !== "completed"}
            title="Imprimir Laudo"
            onClick={() => {
              if (firstItemId) {
                window.open(`/laudos/${row.id}/${firstItemId}/imprimir`, "_blank");
              }
            }}
          >
            <Printer className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];

interface LaudosTableProps {
  data: LaudoRequestRow[];
  emptyMessage?: string;
  emptyAction?: React.ReactNode;
}

export function LaudosTable({
  data,
  emptyMessage = "Nenhum atendimento encontrado.",
  emptyAction,
}: LaudosTableProps) {
  return (
    <DataTable
      columns={COLUMNS}
      data={data}
      getRowId={(row) => row.id}
      emptyMessage={emptyMessage}
      emptyAction={emptyAction}
    />
  );
}
