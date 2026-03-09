"use client";

import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, Loader2 } from "lucide-react";
import { savePatient } from "@/app/(protected)/pacientes/actions";
import type { Patient } from "@/types/supabase";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type CreatedPatient = {
  id: string;
  name: string;
  cpf: string | null;
  birth_date: string | null;
};

export type UpdatedPatient = CreatedPatient & {
  gender?: string | null;
  phone?: string | null;
  mother_name?: string | null;
  notes?: string | null;
};

type EditablePatient = Pick<Patient, "id" | "name"> & Partial<Pick<Patient, "cpf" | "birth_date" | "gender" | "phone" | "mother_name" | "notes">>;

interface PatientSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient?: EditablePatient | null;
  /** Nome padrão para novo paciente (ex: termo de busca) */
  defaultName?: string;
  /** Chamado após criar paciente com sucesso; recebe os dados do paciente criado */
  onCreated?: (patient: CreatedPatient) => void;
  /** Chamado após atualizar paciente com sucesso; recebe os dados atualizados */
  onUpdated?: (patient: UpdatedPatient) => void;
}

export function PatientSheet({
  open,
  onOpenChange,
  patient,
  defaultName,
  onCreated,
  onUpdated,
}: PatientSheetProps) {
  const [isPending, setIsPending] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (open) setSubmitError(null);
  }, [open]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!formRef.current) return;

    setSubmitError(null);
    const formData = new FormData(formRef.current);
    if (patient) {
      formData.append("id", patient.id);
    }

    setIsPending(true);
    try {
      const result = await savePatient(formData, patient?.id);

      if (result.error) {
        const errorMsg =
          typeof result.error === "string"
            ? result.error
            : Object.values(result.error).flat().map(String).join(", ");
        setSubmitError(errorMsg);
        return;
      }

      setSubmitError(null);
      toast.success(patient ? "Paciente atualizado!" : "Paciente cadastrado!");

      if (!patient && result.data && onCreated) {
        onCreated(result.data as CreatedPatient);
      }
      if (patient && result.data && onUpdated) {
        onUpdated(result.data as UpdatedPatient);
      }

      onOpenChange(false);
    } finally {
      setIsPending(false);
    }
  }

  // Helper to pre-format dates for the native date input (YYYY-MM-DD)
  const defaultDate = patient?.birth_date 
    ? patient.birth_date.split("T")[0] 
    : undefined;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-md" side="right">
        <SheetHeader>
          <SheetTitle>{patient ? "Editar Paciente" : "Novo Paciente"}</SheetTitle>
          <SheetDescription>
            {patient ? "Atualize" : "Preencha"} as informações do paciente abaixo. Nome e data de nascimento são obrigatórios.
          </SheetDescription>
        </SheetHeader>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 mt-6 pb-6">
          {submitError && (
            <div
              role="alert"
              className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            >
              {submitError}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="name" required>Nome Completo</Label>
            <Input
              id="name"
              name="name"
              defaultValue={patient?.name ?? defaultName ?? ""}
              placeholder="Digite o nome do paciente"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                name="cpf"
                defaultValue={patient?.cpf ?? ""}
                placeholder="000.000.000-00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birth_date" required>Data de Nascimento</Label>
              <Input
                id="birth_date"
                name="birth_date"
                type="date"
                defaultValue={defaultDate}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gender">Gênero</Label>
              <Select name="gender" defaultValue={patient?.gender ?? ""}>
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Prefiro não informar</SelectItem>
                  <SelectItem value="M">Masculino</SelectItem>
                  <SelectItem value="F">Feminino</SelectItem>
                  <SelectItem value="O">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                name="phone"
                defaultValue={patient?.phone ?? ""}
                placeholder="(00) 00000-0000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mother_name">Nome da Mãe</Label>
            <Input
              id="mother_name"
              name="mother_name"
              defaultValue={patient?.mother_name ?? ""}
              placeholder="Digite o nome da mãe"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              name="notes"
              defaultValue={patient?.notes ?? ""}
              placeholder="Informações adicionais, alergias, restrições..."
              className="resize-none"
              rows={3}
            />
          </div>

          <div className="flex gap-2 justify-end pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {patient ? "Salvar" : "Cadastrar"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
