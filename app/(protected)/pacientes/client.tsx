"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Plus, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ActionButton } from "@/components/ui/action-button";
import { PageHeader } from "@/components/page-header";
import { DataTable } from "@/components/data-table";
import type { DataTableColumn } from "@/components/data-table";
import { DataPagination } from "@/components/data-pagination";
import { PatientsFilter } from "@/components/pacientes/PatientsFilter";
import { PatientSheet } from "@/components/pacientes/PatientSheet";
import type { Patient } from "@/types/supabase";

type PatientRow = Patient & {
  exam_requests: { id: string; date: string; status: string }[];
};

interface PatientsClientProps {
  patients: PatientRow[];
  currentPage: number;
  totalPages: number;
}

export function PatientsClient({
  patients,
  currentPage,
  totalPages,
}: PatientsClientProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  const handleNew = () => {
    setEditingPatient(null);
    setSheetOpen(true);
  };

  const handleEdit = (p: Patient) => {
    setEditingPatient(p);
    setSheetOpen(true);
  };

  const COLUMNS: DataTableColumn<PatientRow>[] = [
    {
      key: "name",
      label: "Nome do paciente",
      render: (row) => (
        <span className="font-medium">{row.name}</span>
      ),
    },
    {
      key: "cpf",
      label: "CPF",
      render: (row) => (
        <span className="text-muted-foreground">{row.cpf || "—"}</span>
      ),
    },
    {
      key: "phone",
      label: "Telefone",
      render: (row) => (
        <span className="text-muted-foreground">{row.phone || "—"}</span>
      ),
    },
    {
      key: "birth_date",
      label: "Nascimento",
      render: (row) => (
        <span className="text-muted-foreground">
          {row.birth_date
            ? format(new Date(row.birth_date + "T00:00:00"), "dd/MM/yyyy", {
                locale: ptBR,
              })
            : "—"}
        </span>
      ),
    },
    {
      key: "atendimentos",
      label: "Atendimentos",
      render: (row) => {
        const reqs = row.exam_requests || [];
        return (
          <span className="text-muted-foreground">{reqs.length}</span>
        );
      },
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
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Pacientes"
        description="Gestão de cadastros e histórico"
        actions={
          <Button onClick={handleNew} className="shrink-0 rounded-full shadow-md">
            <Plus className="h-4 w-4 mr-2" />
            Novo Paciente
          </Button>
        }
      />

      <div className="mt-6">
        <PatientsFilter />
      </div>

      <div className="mt-4">
        <DataTable
          columns={COLUMNS}
          data={patients}
          getRowId={(row) => row.id}
          emptyMessage="Nenhum paciente encontrado."
          emptyAction={
            <Button onClick={handleNew} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Novo Paciente
            </Button>
          }
        />
      </div>

      {totalPages > 1 && (
        <div className="mt-6">
          <DataPagination currentPage={currentPage} totalPages={totalPages} />
        </div>
      )}

      <PatientSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        patient={editingPatient}
      />
    </>
  );
}
