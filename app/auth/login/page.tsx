import { LoginForm } from "@/components/login-form";
import { AuthLayoutWrapper } from "@/components/auth-layout-wrapper";

export default function Page() {
  return (
    <AuthLayoutWrapper 
      title="Bem-vindo de volta" 
      description="Entre com suas credenciais para acessar sua conta"
    >
      <LoginForm />
    </AuthLayoutWrapper>
  );
}
