"use client";

import { useState, useTransition } from "react";
import { Plus, Pencil, Trash, FileType2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { deleteExamPhrase } from "./actions";
import { toast } from "sonner";
import { PhraseSheet } from "@/components/configuracoes/PhraseSheet";

export function PhrasesClient({ phrases }: { phrases: any[] }) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingPhrase, setEditingPhrase] = useState<any | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleNew = () => {
    setEditingPhrase(null);
    setSheetOpen(true);
  };

  const handleEdit = (p: any) => {
    setEditingPhrase(p);
    setSheetOpen(true);
  };

  const handleDelete = (id: string, label: string) => {
    if (!confirm(`Tem certeza que deseja excluir a frase "${label}"?`)) return;
    
    startTransition(async () => {
      const res = await deleteExamPhrase(id);
      if (res.error) toast.error("Falha ao excluir", { description: res.error });
      else toast.success("Frase excluída com sucesso");
    });
  };

  // Group phrases by category
  const grouped = phrases.reduce((acc, phrase) => {
    const cat = phrase.category || "Sem Categoria";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(phrase);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <PageHeader title="Frases Padrão" description="Crie blocos de texto rápido para utilizar durante os laudos" />
        <Button onClick={handleNew} className="shrink-0 rounded-full shadow-md">
          <Plus className="h-4 w-4 mr-2" />
          Nova Frase
        </Button>
      </div>

      <div className="space-y-8">
        {Object.entries(grouped).length === 0 ? (
          <div className="border border-dashed rounded-xl p-12 text-center text-muted-foreground bg-muted/20">
            Nenhuma frase configurada. Clique em "Nova Frase" para começar.
          </div>
        ) : (
          Object.entries<any[]>(grouped).map(([category, items]) => (
            <div key={category} className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2 flex items-center gap-2">
                <FileType2 className="h-5 w-5 text-primary" />
                {category}
                <span className="text-xs font-normal text-muted-foreground ml-2 bg-muted px-2 py-0.5 rounded-full">
                  {items.length} itens
                </span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((p: any) => (
                  <div key={p.id} className="relative group bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
                    <div className="p-4 flex-1">
                      <h4 className="font-semibold text-foreground mb-2">{p.label}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-3 whitespace-pre-wrap">
                        {p.content}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-1 p-2 bg-muted/30 border-t mt-auto">
                      <Button variant="ghost" size="sm" className="w-full text-xs font-medium h-8" onClick={() => handleEdit(p)}>
                        <Pencil className="h-3.5 w-3.5 mr-2" /> Editar
                      </Button>
                      <Button variant="ghost" size="sm" className="w-full text-xs font-medium hover:bg-destructive/10 hover:text-destructive h-8 text-muted-foreground" onClick={() => handleDelete(p.id, p.label)} disabled={isPending}>
                        <Trash className="h-3.5 w-3.5 mr-2" /> Excluir
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <PhraseSheet 
        open={sheetOpen} 
        onOpenChange={setSheetOpen} 
        phrase={editingPhrase} 
      />
    </>
  );
}
