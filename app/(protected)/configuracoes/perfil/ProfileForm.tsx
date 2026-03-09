"use client";

import { useTransition, useRef, useState } from "react";
import { Save, Loader2, User, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { saveProfile, updatePassword } from "./actions";
import type { Profile } from "@/types/supabase";

interface ProfileFormProps {
  profile: Profile | null;
  userEmail?: string;
}

export function ProfileForm({ profile, userEmail }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition();
  const [isPasswordPending, setPasswordPending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

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

  async function onPasswordSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setPasswordPending(true);
    try {
      const result = await updatePassword(formData);
      if (result.error) {
        toast.error("Erro ao alterar senha", { description: result.error });
        return;
      }
      toast.success("Senha alterada com sucesso!");
      e.currentTarget.reset();
    } finally {
      setPasswordPending(false);
    }
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
              <p className="text-sm text-muted-foreground">Gerencie seus dados de perfil.</p>
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
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={userEmail ?? ""}
              readOnly
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">O e-mail é vinculado à conta e não pode ser alterado aqui.</p>
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

      <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 text-primary rounded-xl">
              <KeyRound className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Alterar Senha</h2>
              <p className="text-sm text-muted-foreground">Defina uma nova senha para acessar sua conta.</p>
            </div>
          </div>
        </div>

        <form onSubmit={onPasswordSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="password" required>Nova Senha</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm_password" required>Confirmar Senha</Label>
              <Input
                id="confirm_password"
                name="confirm_password"
                type="password"
                placeholder="Repita a nova senha"
                required
                minLength={6}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isPasswordPending} variant="secondary" className="min-w-32">
              {isPasswordPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <KeyRound className="h-4 w-4 mr-2" />
              )}
              Alterar Senha
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
