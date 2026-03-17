"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface LoginFormProps extends React.ComponentPropsWithoutRef<"div"> {
  redirectTo?: string;
}

export function LoginForm({
  className,
  redirectTo,
  ...props
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError("Email ou senha inválidos.");
        return;
      }

      if (!data.user) {
        setError("Usuário não encontrado.");
        return;
      }

      // Check if user is active and their role
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role, is_active")
        .eq("id", data.user.id)
        .single();

      if (profileError) {
        setError("Erro ao verificar perfil do usuário.");
        return;
      }

      if (profile.is_active === false) {
        await supabase.auth.signOut();
        setError("Sua conta está inativa. Entre em contato com o administrador.");
        return;
      }

      // Redireciona: super_admin sempre para /admin, outros para redirect seguro ou dashboard
      const target =
        profile.role === "super_admin"
          ? "/admin"
          : redirectTo?.startsWith("/") && !redirectTo.startsWith("//")
            ? redirectTo
            : "/dashboard";
      router.push(target);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro inesperado");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleLogin}>
        <div className="flex flex-col gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 shadow-sm"
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Senha</Label>
              <Link
                href="/auth/forgot-password"
                className="ml-auto inline-block text-xs text-primary hover:underline underline-offset-4"
              >
                Esqueceu sua senha?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 shadow-sm"
            />
          </div>
          {error && <p className="text-sm font-medium text-destructive">{error}</p>}
          <Button type="submit" className="w-full h-11 text-base font-semibold shadow-lg shadow-primary/20" disabled={isLoading}>
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </div>
        <div className="mt-6 text-center text-sm text-muted-foreground">
          Ainda não tem uma conta?{" "}
          <Link
            href="/auth/sign-up"
            className="text-primary font-medium hover:underline underline-offset-4"
          >
            Cadastre-se agora
          </Link>
        </div>
      </form>
    </div>
  );
}
