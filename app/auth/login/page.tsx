import { LoginForm } from "@/components/auth/login-form";
import { AuthLayoutWrapper } from "@/components/auth/auth-layout-wrapper";
import { Suspense } from "react";

async function LoginContent({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const params = await searchParams;
  const redirectTo = params.redirect?.startsWith("/") ? params.redirect : undefined;

  return (
    <AuthLayoutWrapper
      title="Bem-vindo de volta"
      description="Entre com suas credenciais para acessar sua conta"
    >
      <LoginForm redirectTo={redirectTo} />
    </AuthLayoutWrapper>
  );
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <LoginContent searchParams={searchParams} />
    </Suspense>
  );
}
