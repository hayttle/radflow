import { AuthLayoutWrapper } from "@/components/auth-layout-wrapper";

export default function Page() {
  return (
    <AuthLayoutWrapper
      title="Cadastro realizado com sucesso!"
      description="Quase lá! Verifique seu e-mail para confirmar sua conta."
    >
      <div className="flex flex-col gap-4 text-center">
        <p className="text-muted-foreground">
          Enviamos um link de confirmação para o seu e-mail. Por favor, clique no link para ativar sua conta e começar a usar o RadFlow.
        </p>
      </div>
    </AuthLayoutWrapper>
  );
}
