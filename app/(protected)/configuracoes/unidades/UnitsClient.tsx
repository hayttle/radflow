"use client";

import { useState, useTransition } from "react";
import { Plus, Pencil, Trash, Building2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { deleteUnit } from "./actions";
import { toast } from "sonner";
import type { Unit } from "@/types/supabase";
import { UnitSheet } from "@/components/configuracoes/UnitSheet";

export function UnitsClient({ units }: { units: Unit[] }) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleNew = () => {
    setEditingUnit(null);
    setSheetOpen(true);
  };

  const handleEdit = (u: Unit) => {
    setEditingUnit(u);
    setSheetOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Tem certeza que deseja excluir a unidade ${name}?`)) return;
    
    startTransition(async () => {
      const res = await deleteUnit(id);
      if (res.error) toast.error("Falha ao excluir", { description: res.error });
      else toast.success("Unidade excluída com sucesso");
    });
  };

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {units.length === 0 ? (
          <div className="col-span-full border border-dashed rounded-xl p-12 text-center text-muted-foreground bg-muted/20">
            Nenhuma unidade configurada. Clique em &quot;Nova Unidade&quot; para começar.
          </div>
        ) : (
          units.map((u) => (
            <div key={u.id} className="relative group bg-card border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <div className="flex items-center gap-1.5 bg-background border px-2.5 py-1 rounded-full text-xs font-medium">
                    {u.active ? (
                      <><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Ativa</>
                    ) : (
                      <><XCircle className="h-3.5 w-3.5 text-muted-foreground" /> Inativa</>
                    )}
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-foreground line-clamp-1 mb-1">{u.name}</h3>
                
                <div className="text-sm text-muted-foreground space-y-1 mb-6">
                  <p className="line-clamp-1">{u.address || "Sem endereço cadastrado"}</p>
                  <p>{u.phone || "Sem telefone"}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mt-auto">
                  <Button variant="secondary" className="w-full text-sm font-medium" onClick={() => handleEdit(u)}>
                    <Pencil className="h-3.5 w-3.5 mr-2" /> Editar
                  </Button>
                  <Button variant="ghost" className="w-full text-sm font-medium hover:bg-destructive/10 hover:text-destructive text-muted-foreground" onClick={() => handleDelete(u.id, u.name)} disabled={isPending}>
                    <Trash className="h-3.5 w-3.5 mr-2" /> Excluir
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <UnitSheet 
        open={sheetOpen} 
        onOpenChange={setSheetOpen} 
        unit={editingUnit} 
      />
    </>
  );
}
