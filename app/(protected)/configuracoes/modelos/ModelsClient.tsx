"use client";

import { useState, useTransition } from "react";
import { Plus, Pencil, Trash2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ActionButton } from "@/components/ui/action-button";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import type { DataTableColumn } from "@/components/shared/data-table";
import { DataPagination } from "@/components/shared/data-pagination";
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog";
import { ModelsFilter } from "@/components/configuracoes/ModelsFilter";
import { ModelSheet } from "@/components/configuracoes/ModelSheet";
import { deleteExamTemplate } from "./actions";
import { toast } from "sonner";
import type { ExamTemplate } from "@/types/supabase";

interface UnitOption {
  id: string;
  name: string;
}

interface ModelsClientProps {
  templates: ExamTemplate[];
  units: UnitOption[];
  currentPage: number;
  totalPages: number;
}

export function ModelsClient({
  templates,
  units,
  currentPage,
  totalPages,
}: ModelsClientProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ExamTemplate | null>(
    null
  );
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleNew = () => {
    setEditingTemplate(null);
    setSheetOpen(true);
  };

  const handleEdit = (t: ExamTemplate) => {
    setEditingTemplate(t);
    setSheetOpen(true);
  };

  const handleDuplicate = (t: ExamTemplate) => {
    const copy = {
      ...t,
      id: undefined,
      title: `${t.title} (Cópia)`,
      variables: Array.isArray(t.variables) ? [...t.variables] : [],
    } as unknown as ExamTemplate;
    setEditingTemplate(copy);
    setSheetOpen(true);
  };

  const handleDeleteClick = (id: string, title: string) => {
    setTemplateToDelete({ id, title });
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!templateToDelete) return;
    startTransition(async () => {
      const res = await deleteExamTemplate(templateToDelete.id);
      if (res.error)
        toast.error("Falha ao excluir", { description: res.error });
      else toast.success("Modelo de exame excluído com sucesso");
      setTemplateToDelete(null);
    });
  };

  const getUnitName = (unitId: string | null) =>
    unitId ? units.find((u) => u.id === unitId)?.name ?? "—" : "Todas (Comum)";

  const COLUMNS: DataTableColumn<ExamTemplate>[] = [
    {
      key: "title",
      label: "Nome do exame",
      render: (row) => (
        <span className="font-medium">{row.title}</span>
      ),
    },
    {
      key: "unit",
      label: "Unidade",
      render: (row) => (
        <span className="text-muted-foreground">
          {getUnitName(row.unit_id)}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Ações",
      className: "text-right",
      render: (row) => (
        <div className="flex justify-end gap-1">
          <ActionButton
            icon={Pencil}
            tooltip="Editar"
            onClick={() => handleEdit(row)}
          />
          <ActionButton
            icon={Copy}
            tooltip="Duplicar"
            onClick={() => handleDuplicate(row)}
          />
          <ActionButton
            icon={Trash2}
            tooltip="Excluir"
            variant="destructive"
            onClick={() => handleDeleteClick(row.id, row.title)}
            disabled={isPending}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Modelos de Exame"
        description="Crie templates de laudos padronizados com variáveis dinâmicas"
        actions={
          <Button onClick={handleNew} className="shrink-0 rounded-full shadow-md">
            <Plus className="h-4 w-4 mr-2" />
            Novo Modelo
          </Button>
        }
      />

      <div className="mt-6">
        <ModelsFilter units={units} />
      </div>

      <div className="mt-4">
        <DataTable
          columns={COLUMNS}
          data={templates}
          getRowId={(row) => row.id}
          emptyMessage="Nenhum modelo configurado. Clique em Novo Modelo para começar."
          emptyAction={
            <Button onClick={handleNew} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Novo Modelo
            </Button>
          }
        />
      </div>

      {totalPages > 1 && (
        <div className="mt-6">
          <DataPagination currentPage={currentPage} totalPages={totalPages} />
        </div>
      )}

      <ModelSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        template={editingTemplate}
        units={units}
      />

      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Excluir modelo"
        itemName={templateToDelete?.title}
        onConfirm={handleDeleteConfirm}
        isLoading={isPending}
      />
    </>
  );
}
