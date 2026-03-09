"use client";

import { useState, useTransition, useRef, useCallback, useEffect } from "react";
import { useUnit } from "@/contexts/unit-context";
import { toast } from "sonner";
import { createExamRequest, searchPatients } from "@/app/(protected)/laudos/actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, UserPlus, Loader2, ChevronRight, User, Pencil } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PatientSheet } from "@/components/pacientes/PatientSheet";

interface PatientItem {
  id: string;
  name: string;
  cpf: string | null;
  birth_date: string | null;
  gender?: string | null;
  phone?: string | null;
  mother_name?: string | null;
  notes?: string | null;
}

interface UnitItem { id: string; name: string }
interface TemplateItem { id: string; title: string; unit_id: string | null; variables: unknown }

interface NovoLaudoFormProps {
  units: UnitItem[];
  templates: TemplateItem[];
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("T")[0].split("-");
  return d && m && y ? `${d}/${m}/${y}` : iso;
}

function formatCpf(cpf: string): string {
  const digits = cpf.replace(/\D/g, "");
  if (digits.length !== 11) return cpf;
  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function formatGender(g: string): string {
  return { M: "Masculino", F: "Feminino", O: "Outro" }[g] ?? g;
}

export function NovoLaudoForm({ units, templates }: NovoLaudoFormProps) {
  const { activeUnitId, isLoading: unitContextLoading } = useUnit();
  const [isPending, startTransition] = useTransition();

  // Patient search
  const [patientOpen, setPatientOpen] = useState(false);
  const [patientQuery, setPatientQuery] = useState("");
  const [patientResults, setPatientResults] = useState<PatientItem[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<PatientItem | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [patientSheetOpen, setPatientSheetOpen] = useState(false);
  const [patientToEdit, setPatientToEdit] = useState<PatientItem | null>(null);
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Form values - unidade padrão do contexto (aguarda contexto carregar)
  const [unitId, setUnitId] = useState("");

  useEffect(() => {
    if (!unitContextLoading && activeUnitId && !unitId) {
      const existsInUnits = units.some((u) => u.id === activeUnitId);
      if (existsInUnits) setUnitId(activeUnitId);
    }
  }, [unitContextLoading, activeUnitId, unitId, units]);

  const [templateId, setTemplateId] = useState("");

  // Limpa template quando troca a unidade (pode não existir na nova unidade)
  useEffect(() => {
    if (unitId && templateId) {
      const template = templates.find((t) => t.id === templateId);
      const belongsToUnit =
        !template?.unit_id || template.unit_id === unitId;
      if (!belongsToUnit) setTemplateId("");
    }
  }, [unitId, templateId, templates]);

  // Modelos filtrados pela unidade: comuns (unit_id null) + da unidade selecionada
  const filteredTemplates = unitId
    ? templates.filter(
        (t) => t.unit_id === null || t.unit_id === unitId
      )
    : [];

  const handlePatientSearch = useCallback(async (query: string) => {
    setPatientQuery(query);
    clearTimeout(searchDebounceRef.current);
    if (query.length < 2) { setPatientResults([]); return; }
    searchDebounceRef.current = setTimeout(async () => {
      setIsSearching(true);
      const { data } = await searchPatients(query);
      setPatientResults((data as PatientItem[]) ?? []);
      setIsSearching(false);
    }, 300);
  }, []);

  const handleOpenNewPatientSheet = () => {
    setPatientOpen(false);
    setPatientToEdit(null);
    setPatientSheetOpen(true);
  };

  const handleEditPatient = () => {
    if (!selectedPatient) return;
    setPatientToEdit(selectedPatient);
    setPatientSheetOpen(true);
  };

  const handlePatientSheetClose = (open: boolean) => {
    if (!open) setPatientToEdit(null);
    setPatientSheetOpen(open);
  };

  const handlePatientCreated = (patient: PatientItem) => {
    setSelectedPatient(patient);
    setPatientSheetOpen(false);
    setPatientToEdit(null);
    toast.success(`Paciente "${patient.name}" adicionado!`);
  };

  const handlePatientUpdated = (patient: PatientItem) => {
    setSelectedPatient(patient);
    setPatientSheetOpen(false);
    setPatientToEdit(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) { toast.error("Selecione um paciente"); return; }
    if (!unitId) { toast.error("Selecione uma unidade"); return; }
    if (!templateId) { toast.error("Selecione um modelo de exame"); return; }

    const formData = new FormData();
    formData.set("patient_id", selectedPatient.id);
    formData.set("unit_id", unitId);
    formData.set("template_id", templateId);

    startTransition(async () => {
      const result = await createExamRequest(formData);
      if (result?.error) {
        toast.error("Erro ao criar atendimento. Verifique os dados.");
      }
      // On success, createExamRequest redirects server-side
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      {/* Patient */}
      <div className="space-y-2">
        <Label htmlFor="patient" required>Paciente</Label>
        <Popover open={patientOpen} onOpenChange={setPatientOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-full justify-between font-normal"
              id="patient"
              type="button"
            >
              <span className={selectedPatient ? "text-foreground" : "text-muted-foreground"}>
                {selectedPatient?.name ?? "Buscar paciente..."}
              </span>
              <Search className="ml-2 h-4 w-4 shrink-0 text-muted-foreground" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[400px] p-0" align="start">
            <Command shouldFilter={false}>
              <CommandInput
                placeholder="Digite o nome do paciente..."
                value={patientQuery}
                onValueChange={handlePatientSearch}
              />
              <CommandList>
                {isSearching && (
                  <div className="flex items-center justify-center py-4 text-sm text-muted-foreground gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Buscando...
                  </div>
                )}
                {!isSearching && patientResults.length === 0 && patientQuery.length >= 2 && (
                  <CommandEmpty>
                    <div className="py-2 text-center text-sm">
                      <p className="text-muted-foreground mb-3">Nenhum paciente encontrado.</p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={handleOpenNewPatientSheet}
                      >
                        <UserPlus className="h-4 w-4" />
                        Novo paciente
                      </Button>
                    </div>
                  </CommandEmpty>
                )}
                {patientResults.length > 0 && (
                  <CommandGroup>
                    {patientResults.map((p) => (
                      <CommandItem
                        key={p.id}
                        value={p.id}
                        onSelect={() => {
                          setSelectedPatient(p);
                          setPatientOpen(false);
                        }}
                      >
                        <span className="font-medium">{p.name}</span>
                        {p.cpf && (
                          <span className="ml-2 text-xs text-muted-foreground">CPF {p.cpf}</span>
                        )}
                      </CommandItem>
                    ))}
                    {patientQuery.length >= 2 && (
                      <CommandItem
                        value="__create__"
                        onSelect={handleOpenNewPatientSheet}
                        className="gap-2 text-primary"
                      >
                        <UserPlus className="h-4 w-4" />
                        Novo paciente
                      </CommandItem>
                    )}
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {selectedPatient && (
          <div className="rounded-lg border bg-card p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 flex-1 items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <User className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1 space-y-2 text-sm">
                <h3 className="font-semibold text-foreground">{selectedPatient.name}</h3>
                <dl className="grid gap-1.5 sm:grid-cols-2">
                  {selectedPatient.birth_date && (
                    <div>
                      <dt className="text-muted-foreground">Nascimento</dt>
                      <dd>{formatDate(selectedPatient.birth_date)}</dd>
                    </div>
                  )}
                  {selectedPatient.cpf && (
                    <div>
                      <dt className="text-muted-foreground">CPF</dt>
                      <dd>{formatCpf(selectedPatient.cpf)}</dd>
                    </div>
                  )}
                  {selectedPatient.gender && (
                    <div>
                      <dt className="text-muted-foreground">Gênero</dt>
                      <dd>{formatGender(selectedPatient.gender)}</dd>
                    </div>
                  )}
                  {selectedPatient.phone && (
                    <div>
                      <dt className="text-muted-foreground">Telefone</dt>
                      <dd>{selectedPatient.phone}</dd>
                    </div>
                  )}
                  {selectedPatient.mother_name && (
                    <div>
                      <dt className="text-muted-foreground">Nome da Mãe</dt>
                      <dd>{selectedPatient.mother_name}</dd>
                    </div>
                  )}
                </dl>
                {selectedPatient.notes && (
                  <div className="sm:col-span-2">
                    <span className="text-muted-foreground">Observações: </span>
                    <span className="text-muted-foreground">{selectedPatient.notes}</span>
                  </div>
                )}
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="shrink-0 gap-1.5"
                onClick={handleEditPatient}
              >
                <Pencil className="h-3.5 w-3.5" />
                Editar
              </Button>
            </div>
          </div>
        )}
      </div>

      <PatientSheet
        open={patientSheetOpen}
        onOpenChange={handlePatientSheetClose}
        patient={patientToEdit}
        defaultName={patientToEdit ? undefined : (patientQuery.trim() || undefined)}
        onCreated={handlePatientCreated}
        onUpdated={handlePatientUpdated}
      />

      {/* Unit */}
      <div className="space-y-2">
        <Label htmlFor="unit" required>Unidade de Atendimento</Label>
        <Select value={unitId} onValueChange={setUnitId}>
          <SelectTrigger id="unit">
            <SelectValue placeholder="Selecione a unidade..." />
          </SelectTrigger>
          <SelectContent>
            {units.map((u) => (
              <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Template - filtrado pela unidade selecionada */}
      <div className="space-y-2">
        <Label htmlFor="template" required>Modelo de Exame</Label>
        <Select
          value={templateId}
          onValueChange={setTemplateId}
          disabled={!unitId}
        >
          <SelectTrigger id="template">
            <SelectValue
              placeholder={
                unitId
                  ? "Selecione o modelo..."
                  : "Selecione a unidade primeiro"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {filteredTemplates.map((t) => (
              <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        type="submit"
        disabled={isPending || !selectedPatient || !unitId || !templateId}
        className="w-full gap-2"
        size="lg"
      >
        {isPending ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> Abrindo editor...</>
        ) : (
          <>Abrir Editor de Laudo <ChevronRight className="h-4 w-4" /></>
        )}
      </Button>
    </form>
  );
}
