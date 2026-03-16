"use client";

import { useTransition, useRef, useState } from "react";
import { Save, Loader2, User, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="space-y-8">
      {/* Personal Information */}
      <Card className="border-2 border-primary/10 shadow-sm overflow-hidden">
        <CardHeader className="bg-muted/20 border-b pb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-2xl">
              <User className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold">Informações Pessoais</CardTitle>
              <CardDescription>Gerencie seus dados de identificação e registro profissional.</CardDescription>
            </div>
          </div>
        </CardHeader>

        <form ref={formRef} onSubmit={onSubmit}>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="full_name" className="font-semibold" required>Nome Completo</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  defaultValue={profile?.full_name ?? ""}
                  placeholder="Seu nome completo"
                  className="rounded-xl h-11"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="crm" className="font-semibold">CRM / Registro Profissional</Label>
                <Input
                  id="crm"
                  name="crm"
                  defaultValue={profile?.crm ?? ""}
                  placeholder="Ex: CRM-SP 123456"
                  className="rounded-xl h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="font-semibold text-muted-foreground">E-mail de Acesso</Label>
              <Input
                id="email"
                type="email"
                value={userEmail ?? ""}
                readOnly
                disabled
                className="bg-muted/50 rounded-xl h-11 cursor-not-allowed"
              />
              <p className="text-[13px] text-muted-foreground font-medium">O e-mail é vinculado à sua conta e não pode ser alterado aqui.</p>
            </div>
          </CardContent>

          <CardFooter className="bg-slate-50/50 dark:bg-slate-900/20 border-t px-6 py-4 flex justify-end">
            <Button type="submit" disabled={isPending} className="rounded-full px-8 font-bold shadow-md">
              {isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {profile ? "Salvar Alterações" : "Concluir Cadastro"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Security / Password */}
      <Card className="border-2 border-primary/10 shadow-sm overflow-hidden">
        <CardHeader className="bg-muted/20 border-b pb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-2xl">
              <KeyRound className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold">Segurança da Conta</CardTitle>
              <CardDescription>Mantenha sua conta protegida atualizando sua senha regularmente.</CardDescription>
            </div>
          </div>
        </CardHeader>

        <form onSubmit={onPasswordSubmit}>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="password" className="font-semibold" required>Nova Senha</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  className="rounded-xl h-11"
                  required
                  minLength={6}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm_password" className="font-semibold" required>Confirmar Nova Senha</Label>
                <Input
                  id="confirm_password"
                  name="confirm_password"
                  type="password"
                  placeholder="Repita a nova senha"
                  className="rounded-xl h-11"
                  required
                  minLength={6}
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="bg-slate-50/50 dark:bg-slate-900/20 border-t px-6 py-4 flex justify-end">
            <Button type="submit" disabled={isPasswordPending} variant="secondary" className="rounded-full px-8 font-bold border shadow-sm">
              {isPasswordPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <KeyRound className="h-4 w-4 mr-2" />
              )}
              Atualizar Senha
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
