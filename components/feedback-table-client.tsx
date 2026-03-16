"use client";

import { DataTable } from "@/components/data-table";
import { FeedbackStatusSwitcher } from "@/components/feedback-status-switcher";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Mail, Calendar, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface FeedbackTableClientProps {
  feedbacks: any[];
}

export function FeedbackTableClient({ feedbacks }: FeedbackTableClientProps) {
  const columns = [
    {
      key: "type",
      label: "Tipo",
      render: (row: any) => {
        const typeLabels: any = {
          bug: "Bug",
          suggestion: "Sugestão",
          critique: "Crítica",
          feature_request: "Funcionalidade",
        };
        const typeColors: any = {
          bug: "destructive",
          suggestion: "secondary",
          critique: "outline",
          feature_request: "default",
        };
        return <Badge variant={typeColors[row.type] || "outline"}>{typeLabels[row.type] || row.type}</Badge>;
      },
    },
    {
      key: "content",
      label: "Mensagem",
      render: (row: any) => (
        <div className="flex flex-col max-w-[400px]">
          <span className="font-semibold text-foreground truncate">{row.title}</span>
          <span className="text-xs text-muted-foreground line-clamp-1">{row.description}</span>
        </div>
      ),
    },
    {
      key: "user",
      label: "Autor",
      render: (row: any) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{row.profiles?.full_name || "Usuário"}</span>
          <span className="text-[10px] text-muted-foreground">{row.profiles?.email}</span>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row: any) => (
        <FeedbackStatusSwitcher feedbackId={row.id} currentStatus={row.status} />
      ),
    },
    {
      key: "actions",
      label: "Ações",
      render: (row: any) => (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-orange-600">
              <Eye className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{row.type}</Badge>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(row.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </span>
              </div>
              <DialogTitle className="text-xl font-bold">{row.title}</DialogTitle>
              <DialogDescription className="border-t pt-4 mt-4 whitespace-pre-wrap text-foreground">
                {row.description}
              </DialogDescription>
            </DialogHeader>
            <div className="mt-6 flex items-center justify-between border-t pt-6">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground">
                  {row.profiles?.full_name?.[0] || "U"}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold">{row.profiles?.full_name}</span>
                  <span className="text-xs text-muted-foreground">{row.profiles?.email}</span>
                </div>
              </div>
              <FeedbackStatusSwitcher feedbackId={row.id} currentStatus={row.status} />
            </div>
          </DialogContent>
        </Dialog>
      ),
    },
  ];

  return (
    <DataTable
      data={feedbacks}
      columns={columns}
      getRowId={(row) => row.id}
      emptyMessage="Nenhuma mensagem de feedback recebida."
    />
  );
}
