"use client";

import { useTransition, useState } from "react";
import { Save, Loader2, Signature } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { saveSignature } from "./actions";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

interface SignatureFormProps {
  initialSignature?: string | null;
}

export function SignatureForm({ initialSignature }: SignatureFormProps) {
  const [isPending, startTransition] = useTransition();
  const [signatureHtml, setSignatureHtml] = useState<string>(initialSignature || "");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("signature", signatureHtml);

    startTransition(async () => {
      const result = await saveSignature(formData);
      if (result.error) {
        toast.error("Erro ao salvar", { description: result.error });
        return;
      }
      toast.success("Assinatura atualizada com sucesso!");
    });
  }

  return (
    <div className="bg-card border rounded-2xl shadow-sm overflow-hidden max-w-3xl">
      <div className="p-6 border-b bg-muted/20">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 text-primary rounded-xl">
            <Signature className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Assinatura dos Laudos</h2>
            <p className="text-sm text-muted-foreground">
              Defina o conteúdo da sua assinatura (texto, formatação e imagens). Esta assinatura será usada na impressão dos laudos.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={onSubmit} className="p-6 space-y-6">
        <div className="space-y-2">
          <Label className="text-base font-semibold">Conteúdo da assinatura</Label>
          <RichTextEditor
            value={signatureHtml}
            onChange={setSignatureHtml}
            placeholder="Digite ou cole sua assinatura aqui..."
          />
        </div>

        <div className="pt-4 flex justify-end">
          <Button type="submit" disabled={isPending} className="min-w-32">
            {isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Salvar
          </Button>
        </div>
      </form>
    </div>
  );
}
