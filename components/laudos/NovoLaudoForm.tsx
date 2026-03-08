"use client";

import { useState, useTransition, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUnit } from "@/contexts/unit-context";
import { toast } from "sonner";
import { createExamRequest, searchPatients, createPatientQuick } from "@/app/(protected)/laudos/actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, UserPlus, Loader2, ChevronRight } from "lucide-react";
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

interface PatientItem {
  id: string;
  name: string;
  cpf: string | null;
  birth_date: string | null;
}

interface UnitItem { id: string; name: string }
interface TemplateItem { id: string; title: string; unit_id: string | null; variables: unknown }

interface NovoLaudoFormProps {
  units: UnitItem[];
  templates: TemplateItem[];
}

export function NovoLaudoForm({ units, templates }: NovoLaudoFormProps) {
  const { activeUnitId } = useUnit();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Patient search
  const [patientOpen, setPatientOpen] = useState(false);
  const [patientQuery, setPatientQuery] = useState("");
  const [patientResults, setPatientResults] = useState<PatientItem[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<PatientItem | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isCreatingPatient, setIsCreatingPatient] = useState(false);
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Form values
  const [unitId, setUnitId] = useState(activeUnitId ?? "");
  const [templateId, setTemplateId] = useState("");

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

  const handleCreatePatient = async () => {
    if (!patientQuery.trim()) return;
    setIsCreatingPatient(true);
    const { data, error } = await createPatientQuick(patientQuery.trim());
    setIsCreatingPatient(false);
    if (error || !data) { toast.error(error ?? "Erro ao criar paciente"); return; }
    setSelectedPatient({ id: data.id, name: data.name, cpf: null, birth_date: null });
    setPatientOpen(false);
    toast.success(`Paciente "${data.name}" criado!`);
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
        <Label htmlFor="patient">Paciente *</Label>
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
            <Command>
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
                        onClick={handleCreatePatient}
                        disabled={isCreatingPatient}
                      >
                        {isCreatingPatient ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <UserPlus className="h-4 w-4" />
                        )}
                        Criar &quot;{patientQuery}&quot;
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
                        onSelect={handleCreatePatient}
                        className="gap-2 text-primary"
                      >
                        <UserPlus className="h-4 w-4" />
                        Criar &quot;{patientQuery}&quot; como novo paciente
                      </CommandItem>
                    )}
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Unit */}
      <div className="space-y-2">
        <Label htmlFor="unit">Unidade de Atendimento *</Label>
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

      {/* Template */}
      <div className="space-y-2">
        <Label htmlFor="template">Modelo de Exame *</Label>
        <Select value={templateId} onValueChange={setTemplateId}>
          <SelectTrigger id="template">
            <SelectValue placeholder="Selecione o modelo..." />
          </SelectTrigger>
          <SelectContent>
            {templates.map((t) => (
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
