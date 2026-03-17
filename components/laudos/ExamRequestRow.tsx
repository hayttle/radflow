"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FileText, ChevronRight, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type RequestWithRelations = {
  id: string;
  status: string;
  date: string;
  created_at: string | null;
  patients: { id: string; name: string; cpf: string | null } | null;
  units: { id: string; name: string } | null;
  exam_items: { id: string }[];
};

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "success"; Icon: React.ElementType }> = {
  pending: { label: "Pendente", variant: "secondary", Icon: Clock },
  in_progress: { label: "Em andamento", variant: "default", Icon: AlertCircle },
  completed: { label: "Concluído", variant: "success", Icon: CheckCircle2 },
};

export function ExamRequestRow({ request }: { request: RequestWithRelations }) {
  const config = statusConfig[request.status] ?? statusConfig.pending;
  const { Icon } = config;

  const firstItemId = request.exam_items?.[0]?.id;
  const href = firstItemId ? `/laudos/${request.id}/${firstItemId}` : `/laudos/${request.id}`;

  return (
    <Link
      href={href}
      className="flex items-center gap-4 p-4 rounded-xl border bg-card hover:bg-accent/40 transition-colors group"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
        <FileText className="h-5 w-5" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">
          {request.patients?.name ?? "—"}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5 truncate">
          {request.units?.name ?? "—"} ·{" "}
          {request.created_at
            ? formatDistanceToNow(new Date(request.created_at), {
                addSuffix: true,
                locale: ptBR,
              })
            : request.date}
        </p>
      </div>

      <Badge variant={config.variant} className="gap-1 shrink-0">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>

      <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
    </Link>
  );
}
