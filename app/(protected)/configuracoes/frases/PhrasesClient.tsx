"use client";

import { useState, useTransition } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ActionButton } from "@/components/ui/action-button";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import type { DataTableColumn } from "@/components/shared/data-table";
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog";
import { PhrasesFilter } from "@/components/configuracoes/PhrasesFilter";
import { PhraseSheet } from "@/components/configuracoes/PhraseSheet";
import { deleteExamPhrase } from "./actions";
import { toast } from "sonner";
import type { ExamPhrase } from "@/types/supabase";

interface PhrasesClientProps {
  phrases: ExamPhrase[];
  categories: string[];
}

export function PhrasesClient({ phrases, categories }: PhrasesClientProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingPhrase, setEditingPhrase] = useState<ExamPhrase | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [phraseToDelete, setPhraseToDelete] = useState<{
    id: string;
    label: string;
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleNew = () => {
    setEditingPhrase(null);
    setSheetOpen(true);
  };

  const handleEdit = (p: ExamPhrase) => {
    setEditingPhrase(p);
    setSheetOpen(true);
  };

  const handleDeleteClick = (id: string, label: string) => {
    setPhraseToDelete({ id, label });
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!phraseToDelete) return;
    startTransition(async () => {
      const res = await deleteExamPhrase(phraseToDelete.id);
      if (res.error)
        toast.error("Falha ao excluir", { description: res.error });
      else toast.success("Frase excluída com sucesso");
      setPhraseToDelete(null);
    });
  };

  const COLUMNS: DataTableColumn<ExamPhrase>[] = [
    {
      key: "category",
      label: "Categoria",
      render: (row) => (
        <span className="font-medium">
          {row.category || "Sem categoria"}
        </span>
      ),
    },
    {
      key: "label",
      label: "Rótulo",
      render: (row) => (
        <span className="text-muted-foreground">{row.label}</span>
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
            icon={Trash2}
            tooltip="Excluir"
            variant="destructive"
            onClick={() => handleDeleteClick(row.id, row.label)}
            disabled={isPending}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Frases Padrão"
        description="Crie blocos de texto rápido para utilizar durante os laudos"
        actions={
          <Button onClick={handleNew} className="shrink-0 rounded-full shadow-md">
            <Plus className="h-4 w-4 mr-2" />
            Nova Frase
          </Button>
        }
      />

      <div className="mt-6">
        <PhrasesFilter categories={categories} />
      </div>

      <div className="mt-4">
        <DataTable
          columns={COLUMNS}
          data={phrases}
          getRowId={(row) => row.id}
          emptyMessage="Nenhuma frase configurada. Clique em Nova Frase para começar."
          emptyAction={
            <Button onClick={handleNew} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Nova Frase
            </Button>
          }
        />
      </div>

      <PhraseSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        phrase={editingPhrase}
      />

      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Excluir frase"
        itemName={phraseToDelete?.label}
        onConfirm={handleDeleteConfirm}
        isLoading={isPending}
      />
    </>
  );
}
