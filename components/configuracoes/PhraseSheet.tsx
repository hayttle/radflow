"use client";

import { useTransition, useRef } from "react";
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
import { saveExamPhrase } from "@/app/(protected)/configuracoes/frases/actions";
import type { ExamPhrase } from "@/types/supabase";

interface PhraseSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  phrase?: ExamPhrase | null;
}

export function PhraseSheet({ open, onOpenChange, phrase }: PhraseSheetProps) {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (phrase) {
      formData.append("id", phrase.id);
    }
    
    startTransition(async () => {
      const result = await saveExamPhrase(formData, phrase?.id);
      
      if (result.error) {
        if (typeof result.error === "string") {
          toast.error("Erro", { description: result.error });
        } else {
          toast.error("Erro de validação", { description: "Verifique os dados informados." });
        }
        return;
      }

      toast.success(phrase ? "Frase atualizada!" : "Frase cadastrada!");
      onOpenChange(false);
    });
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-md" side="right">
        <SheetHeader>
          <SheetTitle>{phrase ? "Editar Frase" : "Nova Frase Padrão"}</SheetTitle>
          <SheetDescription>
            {phrase ? "Edite" : "Adicione"} um bloco de texto rápido que pode ser reutilizado na hora do laudo.
          </SheetDescription>
        </SheetHeader>

        <form ref={formRef} onSubmit={onSubmit} className="space-y-6 mt-6 pb-6">
          <div className="space-y-2">
            <Label htmlFor="category" required>Categoria</Label>
            <Input
              id="category"
              name="category"
              defaultValue={phrase?.category ?? ""}
              placeholder="Ex: Pulmão, Fígado, Achados Normais"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="label">Rótulo / Nome Curto *</Label>
            <Input
              id="label"
              name="label"
              defaultValue={phrase?.label ?? ""}
              placeholder="Ex: Cisto simples"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content" required>Texto do Laudo</Label>
            <Textarea
              id="content"
              name="content"
              defaultValue={phrase?.content ?? ""}
              placeholder="Este é o texto que será inserido no editor..."
              className="resize-none"
              rows={8}
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
              {phrase ? "Salvar" : "Cadastrar"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
