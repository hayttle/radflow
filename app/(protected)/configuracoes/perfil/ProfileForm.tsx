"use client";

import { useTransition, useRef, useState } from "react";
import { Save, Loader2, UploadCloud, User, FileImage } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { saveProfile } from "./actions";
import Image from "next/image";

interface ProfileFormProps {
  profile: any | null;
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [signaturePreview, setSignaturePreview] = useState<string | null>(profile?.signature_url || null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("O arquivo deve ter no máximo 2MB.");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      const url = URL.createObjectURL(file);
      setSignaturePreview(url);
    }
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (profile?.signature_url && !formData.get("signature") && !signaturePreview) {
      // Retaining existing URL if not changed and not removed
      formData.append("signature_url", profile.signature_url);
    } else if (signaturePreview && signaturePreview.startsWith("http")) {
      formData.append("signature_url", signaturePreview);
    }

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

  const removeSignature = () => {
    setSignaturePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

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
              <Label htmlFor="full_name">Nome Completo *</Label>
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

          <div className="space-y-4">
            <div>
              <Label className="text-base">Assinatura Digitalizada</Label>
              <p className="text-sm text-muted-foreground mt-1">Carregue uma imagem transparente (.png) da sua assinatura. Ela será inserida automaticamente ao final da impressão dos laudos.</p>
            </div>

            <div className="flex flex-col md:flex-row items-start gap-6">
              <div 
                className="relative flex items-center justify-center w-64 h-32 border-2 border-dashed rounded-xl overflow-hidden group cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {signaturePreview ? (
                  <div className="w-full h-full relative">
                    <img 
                      src={signaturePreview} 
                      alt="Assinatura" 
                      className="object-contain w-full h-full p-2 bg-white"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <p className="text-white text-sm font-medium">Trocar Imagem</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-muted-foreground p-6 text-center space-y-2">
                    <UploadCloud className="h-8 w-8 opacity-70" />
                    <span className="text-xs">Clique para fazer upload (Max: 2MB)</span>
                  </div>
                )}
                <input
                  type="file"
                  id="signature"
                  name="signature"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/png, image/jpeg"
                  className="hidden"
                />
              </div>

              {signaturePreview && (
                <div className="flex flex-col gap-2 w-full md:w-auto mt-auto py-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                    <FileImage className="h-4 w-4 mr-2" /> Alterar Imagem
                  </Button>
                  <Button type="button" variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={removeSignature}>
                    Remover Assinatura
                  </Button>
                </div>
              )}
            </div>
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
