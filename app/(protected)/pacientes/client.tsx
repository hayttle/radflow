"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Plus, Search, MoreHorizontal, Pencil, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PageHeader } from "@/components/page-header";
import { DataPagination } from "@/components/data-pagination";

import { PatientSheet } from "@/components/pacientes/PatientSheet";
import { deletePatient } from "./actions";
import { toast } from "sonner";
import type { Patient } from "@/types/supabase";

type ExtendedPatient = Patient & {
  exam_requests: { id: string; date: string; status: string }[];
};

export function PatientsClient({
  patients,
  currentPage,
  totalPages,
  initialQuery,
}: {
  patients: any[];
  currentPage: number;
  totalPages: number;
  initialQuery: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(initialQuery);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (search) params.set("q", search);
    else params.delete("q");
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleNew = () => {
    setEditingPatient(null);
    setSheetOpen(true);
  };

  const handleEdit = (p: Patient) => {
    setEditingPatient(p);
    setSheetOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Tem certeza que deseja excluir o paciente ${name}? Esta ação não pode ser desfeita.`)) return;
    startTransition(async () => {
      const res = await deletePatient(id);
      if (res.error) toast.error("Falha ao excluir", { description: res.error });
      else toast.success("Paciente excluído com sucesso");
    });
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <PageHeader title="Pacientes" description="Gestão de cadastros e histórico" />
        <Button onClick={handleNew} className="shrink-0 rounded-full shadow-md">
          <Plus className="h-4 w-4 mr-2" />
          Novo Paciente
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 mb-6">
        <form onSubmit={handleSearch} className="flex flex-1 items-center gap-2 max-w-sm">
          <Input 
            placeholder="Buscar por nome ou CPF..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-background shadow-xs hover:border-primary/50 focus-visible:ring-primary/20 transition-all rounded-full"
          />
          <Button type="submit" variant="secondary" size="icon" className="rounded-full">
            <Search className="h-4 w-4" />
          </Button>
        </form>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
        <div className="w-full overflow-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
              <tr>
                <th className="px-4 py-3 font-medium">Paciente</th>
                <th className="px-4 py-3 font-medium">Contatos</th>
                <th className="px-4 py-3 font-medium hidden md:table-cell">Nascimento</th>
                <th className="px-4 py-3 font-medium hidden sm:table-cell">Atendimentos</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {patients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                    Nenhum paciente encontrado.
                  </td>
                </tr>
              ) : (
                patients.map((p: ExtendedPatient) => {
                  const reqs = p.exam_requests || [];
                  const sortedReqs = [...reqs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                  const lastReq = sortedReqs[0];

                  return (
                    <tr key={p.id} className="hover:bg-accent/40 transition-colors group">
                      <td className="px-4 py-3 align-top min-w-[200px]">
                        <p className="font-semibold text-foreground">{p.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{p.cpf || "Sem CPF"}</p>
                      </td>
                      <td className="px-4 py-3 align-top">
                        <p className="text-sm">{p.phone || "—"}</p>
                      </td>
                      <td className="px-4 py-3 align-top hidden md:table-cell">
                        {p.birth_date ? format(new Date(p.birth_date + "T00:00:00"), "dd/MM/yyyy") : "—"}
                      </td>
                      <td className="px-4 py-3 align-top hidden sm:table-cell">
                        <div className="flex flex-col gap-1">
                          <span className="font-medium">{reqs.length} laudos</span>
                          {lastReq && (
                            <span className="text-xs text-muted-foreground">
                              Último: {format(new Date(lastReq.date + "T00:00:00"), "dd/MM/yy")}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 align-top text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 md:opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-[160px]">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleEdit(p)} className="cursor-pointer">
                              <Pencil className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(p.id, p.name)}
                              disabled={isPending}
                              className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                            >
                              <Trash className="h-4 w-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
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
