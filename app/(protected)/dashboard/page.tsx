import { PageContainer } from "@/components/page-container";

export default function ProtectedPage() {
  return (
    <PageContainer
      title="Dashboard"
      description="Bem-vindo ao seu painel de controle principal."
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Dashboard cards/content here */}
        <div className="p-6 rounded-xl bg-card border shadow-sm">
          <h3 className="font-semibold mb-2">Resumo Geral</h3>
          <p className="text-2xl font-bold">1,234</p>
        </div>
      </div>
    </PageContainer>
  );
}
