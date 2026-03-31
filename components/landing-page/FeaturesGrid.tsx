import { CheckCircle2, Zap, MessageCircle, Users, Building2, FileCheck } from "lucide-react"

export function FeaturesGrid() {
  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      color: "text-green-500",
      bg: "bg-green-500/10",
      title: "Laudos em Segundos",
      desc: "Modelos e máscaras inteligentes que eliminam a digitação."
    },
    {
      icon: <CheckCircle2 className="w-6 h-6" />,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      title: "Padronização Total",
      desc: "Todos os seus laudos com o mesmo rigor técnico e estético."
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      title: "Redução da Fadiga Mental",
      desc: "Foque na análise da imagem, não na formatação do texto."
    },
    {
      icon: <Users className="w-6 h-6" />,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      title: "CRM Integrado",
      desc: "Gestão completa do histórico de pacientes e exames."
    },
    {
      icon: <Building2 className="w-6 h-6" />,
      color: "text-teal-500",
      bg: "bg-teal-500/10",
      title: "Multi-Unidades",
      desc: "Timbre automático para cada local de atendimento."
    },
    {
      icon: <FileCheck className="w-6 h-6" />,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      title: "Assinatura Digital",
      desc: "Aprovação instantânea e impressão com alta qualidade."
    }
  ]

  return (
    <section id="recursos" className="py-20 md:py-28 lg:py-32 bg-background">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">O fluxo perfeito para a sua rotina</h2>
          <p className="text-lg text-muted-foreground">
            Acompanhe o percurso do paciente desde a sala de espera até a entrega do laudo assinado.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feat, i) => (
            <div key={i} className="group p-6 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col">
              
              {/* O Placeholder de Imagem no topo do card */}
              <div className="w-full h-40 bg-slate-100 dark:bg-slate-900 border border-border/50 rounded-xl mb-6 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10" />
                <span className="text-sm text-slate-400 font-mono z-20 text-center px-4">
                  📸 Placeholder<br/>(ex: foto da {feat.title})
                </span>
              </div>

              <div className={`w-12 h-12 rounded-full ${feat.bg} flex items-center justify-center mb-4 ${feat.color}`}>
                {feat.icon}
              </div>
              
              <h3 className="font-semibold text-xl mb-2">{feat.title}</h3>
              <p className="text-muted-foreground leading-relaxed flex-grow">
                {feat.desc}
              </p>
              
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
