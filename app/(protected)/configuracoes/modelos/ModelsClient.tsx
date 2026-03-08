"use client";

import { useState, useTransition } from "react";
import { Plus, Pencil, Trash, FileText, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { deleteExamTemplate } from "./actions";
import { toast } from "sonner";
import type { ExamTemplate, Unit } from "@/types/supabase";
import { ModelSheet } from "@/components/configuracoes/ModelSheet";

export function ModelsClient({ templates, units }: { templates: ExamTemplate[], units: Unit[] }) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ExamTemplate | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleNew = () => {
    setEditingTemplate(null);
    setSheetOpen(true);
  };

  const handleEdit = (t: ExamTemplate) => {
    setEditingTemplate(t);
    setSheetOpen(true);
  };

  const handleDelete = (id: string, title: string) => {
    if (!confirm(`Tem certeza que deseja excluir o modelo "${title}"?`)) return;
    
    startTransition(async () => {
      const res = await deleteExamTemplate(id);
      if (res.error) toast.error("Falha ao excluir", { description: res.error });
      else toast.success("Modelo de exame excluído com sucesso");
    });
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <PageHeader title="Modelos de Exame" description="Crie templates de laudos padronizados com variáveis dinâmicas" />
        <Button onClick={handleNew} className="shrink-0 rounded-full shadow-md">
          <Plus className="h-4 w-4 mr-2" />
          Novo Modelo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.length === 0 ? (
          <div className="col-span-full border border-dashed rounded-xl p-12 text-center text-muted-foreground bg-muted/20">
            Nenhum modelo configurado. Clique em "Novo Modelo" para começar.
          </div>
        ) : (
          templates.map((t) => {
            const variables = Array.isArray(t.variables) ? t.variables : [];
            const unitName = t.unit_id ? units.find(u => u.id === t.unit_id)?.name : "Todas (Comum)";

            return (
              <div key={t.id} className="relative group bg-card border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                <div className="p-5 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 bg-primary/10 text-primary rounded-xl shrink-0">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div className="flex items-center gap-1.5 bg-background border px-2.5 py-1 rounded-full text-xs font-medium">
                      {t.active ? (
                        <><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Ativo</>
                      ) : (
                        <><XCircle className="h-3.5 w-3.5 text-muted-foreground" /> Inativo</>
                      )}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-foreground line-clamp-2 mb-2" title={t.title}>{t.title}</h3>
                  
                  <div className="text-sm text-muted-foreground space-y-2 mb-6 flex-1">
                    <p className="line-clamp-1"><span className="font-medium text-foreground/80">Unidade:</span> {unitName}</p>
                    <p><span className="font-medium text-foreground/80">Variáveis:</span> {variables.length}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mt-auto">
                    <Button variant="secondary" className="w-full text-sm font-medium" onClick={() => handleEdit(t)}>
                      <Pencil className="h-3.5 w-3.5 mr-2" /> Editar
                    </Button>
                    <Button variant="ghost" className="w-full text-sm font-medium hover:bg-destructive/10 hover:text-destructive text-muted-foreground" onClick={() => handleDelete(t.id, t.title)} disabled={isPending}>
                      <Trash className="h-3.5 w-3.5 mr-2" /> Excluir
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <ModelSheet 
        open={sheetOpen} 
        onOpenChange={setSheetOpen} 
        template={editingTemplate} 
        units={units}
      />
    </>
  );
}
