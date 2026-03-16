import { SignUpForm } from "@/components/sign-up-form";
import { AuthLayoutWrapper } from "@/components/auth-layout-wrapper";

export default function Page() {
  return (
    <AuthLayoutWrapper 
      title="Crie sua conta" 
      description="Comece hoje mesmo a transformar seu fluxo de trabalho"
    >
      <SignUpForm />
    </AuthLayoutWrapper>
  );
}
