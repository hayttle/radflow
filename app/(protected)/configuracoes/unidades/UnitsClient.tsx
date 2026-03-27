"use client";

import { useState, useTransition } from "react";
import { Plus, Pencil, Trash, Building2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ActionButton } from "@/components/ui/action-button";
import { PageHeader } from "@/components/page-header";
import { deleteUnit } from "./actions";
import { toast } from "sonner";
import type { Unit } from "@/types/supabase";
import { UnitSheet } from "@/components/configuracoes/UnitSheet";
import { DataTable } from "@/components/data-table";
import type { DataTableColumn } from "@/components/data-table";
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog";

export function UnitsClient({ units }: { units: Unit[] }) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [unitToDelete, setUnitToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleNew = () => {
    setEditingUnit(null);
    setSheetOpen(true);
  };

  const handleEdit = (u: Unit) => {
    setEditingUnit(u);
    setSheetOpen(true);
  };

  const handleDeleteClick = (id: string, name: string) => {
    setUnitToDelete({ id, name });
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!unitToDelete) return;
    
    startTransition(async () => {
      const res = await deleteUnit(unitToDelete.id);
      if (res.error) toast.error("Falha ao excluir", { description: res.error });
      else toast.success("Unidade excluída com sucesso");
      setUnitToDelete(null);
    });
  };

  const COLUMNS: DataTableColumn<Unit>[] = [
    {
      key: "name",
      label: "Nome",
      render: (row) => (
        <div className="flex items-center gap-2 font-medium">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          {row.name}
        </div>
      ),
    },
    {
      key: "active",
      label: "Status",
      render: (row) => (
        <div className="flex items-center gap-1.5">
          {row.active ? (
            <><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Ativa</>
          ) : (
            <><XCircle className="h-3.5 w-3.5 text-muted-foreground" /> Inativa</>
          )}
        </div>
      ),
    },
    {
      key: "address",
      label: "Endereço",
      render: (row) => (
        <span className="text-muted-foreground">{row.address || "Sem endereço"}</span>
      ),
    },
    {
      key: "phone",
      label: "Telefone",
      render: (row) => (
        <span className="text-muted-foreground">{row.phone || "Sem telefone"}</span>
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
            icon={Trash}
            tooltip="Excluir"
            variant="destructive"
            onClick={() => handleDeleteClick(row.id, row.name)}
            disabled={isPending}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Unidades de Atendimento"
        description="Gerencie as clínicas atendidas e os cabeçalhos de laudos"
        actions={
          <Button onClick={handleNew} className="shrink-0 rounded-full shadow-md">
            <Plus className="h-4 w-4 mr-2" />
            Nova Unidade
          </Button>
        }
      />

      <div className="mt-4">
        <DataTable
          columns={COLUMNS}
          data={units}
          getRowId={(row) => row.id}
          emptyMessage="Nenhuma unidade configurada. Clique em 'Nova Unidade' para começar."
          emptyAction={
            <Button onClick={handleNew} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Nova Unidade
            </Button>
          }
        />
      </div>

      <UnitSheet 
        open={sheetOpen} 
        onOpenChange={setSheetOpen} 
        unit={editingUnit} 
      />

      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Excluir unidade"
        itemName={unitToDelete?.name}
        onConfirm={handleDeleteConfirm}
        isLoading={isPending}
      />
    </>
  );
}
