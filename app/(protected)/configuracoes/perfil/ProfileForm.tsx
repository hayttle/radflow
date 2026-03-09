"use client";

import { useTransition, useRef, useState } from "react";
import { Save, Loader2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { saveProfile } from "./actions";
import Image from "next/image";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

interface ProfileFormProps {
  profile: any | null;
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const [signatureHtml, setSignatureHtml] = useState<string>(profile?.signature || "");


  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append("signature", signatureHtml);

    startTransition(async () => {
      const result = await saveProfile(formData);
      
      if (result.error) {
        if (typeof result.error === "string") {
          toast.error("Erro ao salvar", { description: result.error });
        } else {
          toast.error("Erro de validação", { description: "Verifique os dados informados." });
        }
        return;
      }

      toast.success("Perfil atualizado com sucesso!");
    });
  }


  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 text-primary rounded-xl">
              <User className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Informações Pessoais</h2>
              <p className="text-sm text-muted-foreground">Gerencie seus dados e a assinatura utilizada na impressão dos laudos.</p>
            </div>
          </div>
        </div>

        <form ref={formRef} onSubmit={onSubmit} className="p-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="full_name" required>Nome Completo</Label>
              <Input
                id="full_name"
                name="full_name"
                defaultValue={profile?.full_name ?? ""}
                placeholder="Dr. João da Silva"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="crm">CRM / Registro Profissional</Label>
              <Input
                id="crm"
                name="crm"
                defaultValue={profile?.crm ?? ""}
                placeholder="CRM-SP 123456"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-base font-semibold">Assinatura em Texto (HTML)</Label>
            <p className="text-sm text-muted-foreground">
              Defina o conteúdo da sua assinatura (texto, formatação e imagens). Esta assinatura será usada nos laudos.
            </p>
            <RichTextEditor 
              value={signatureHtml} 
              onChange={setSignatureHtml} 
              placeholder="Digite ou cole sua assinatura aqui..." 
            />
          </div>

          <div className="pt-6 border-t flex justify-end">
            <Button type="submit" disabled={isPending} className="min-w-32">
              {isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {profile ? "Salvar Alterações" : "Concluir Cadastro"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
