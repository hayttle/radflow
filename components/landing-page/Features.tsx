import { Badge } from "@/components/ui/badge"
import { Type, Library, FileCheck, Search } from "lucide-react"

const features = [
  {
    title: "Editor Rich Text Inteligente",
    description: "Use variáveis dinâmicas como {{ecogenicidade}} para automatizar o preenchimento de medidas e achados.",
    icon: Type,
    badge: "Exclusivo"
  },
  {
    title: "Biblioteca de Frases",
    description: "Insira modelos e frases padrão com um clique, mantendo a consistência e velocidade do seu laudo.",
    icon: Library,
  },
  {
    title: "Assinatura Digitalizada",
    description: "Assinatura automática e segura integrada ao fluxo, pronta para impressão ou envio digital.",
    icon: FileCheck,
  },
  {
    title: "Busca Inteligente",
    description: "Encontre exames anteriores e histórico do paciente em segundos com filtros avançados.",
    icon: Search,
  }
]

export function Features() {
  return (
    <section id="recursos" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <Badge variant="outline" className="mb-4 border-primary/30 text-primary">Diferenciais Técnicos</Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Produtividade Sem Compromissos</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto italic">
            "A ferramenta que eu desejava ter quando comecei na radiologia."
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, i) => (
            <div key={i} className="group p-8 rounded-3xl border border-border bg-card hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              {feature.badge && (
                <Badge className="mb-2 bg-primary/20 text-primary hover:bg-primary/20 border-none">{feature.badge}</Badge>
              )}
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Feature Focus: Dynamic Variables */}
        <div className="mt-20 p-8 md:p-12 rounded-[2.5rem] bg-slate-950 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/10 blur-[100px] pointer-events-none" />
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-6 text-primary">Variáveis Dinâmicas e Automação</h3>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                Chega de preencher as mesmas medidas manualmente. Configure seu template e o RadFlow faz o resto.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-200">
                   <div className="w-2 h-2 rounded-full bg-primary" />
                   <span>Criação de laudos estruturados</span>
                </div>
                <div className="flex items-center gap-3 text-slate-200">
                   <div className="w-2 h-2 rounded-full bg-primary" />
                   <span>Formatação A4 impecável automática</span>
                </div>
                <div className="flex items-center gap-3 text-slate-200">
                   <div className="w-2 h-2 rounded-full bg-primary" />
                   <span>Visualização em tempo real do resultado final</span>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-900 border border-white/5 rounded-2xl p-6 shadow-2xl">
               <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
                  <span className="text-xs text-slate-500 ml-2 font-mono italic">Template: Ultrassom_Abdominal.rad</span>
               </div>
               <div className="font-mono text-sm space-y-3 leading-relaxed">
                  <p className="text-slate-400">O fígado apresenta dimensões <span className="text-primary font-bold">{"{{"}dimensões{"}}"}</span>, contornos regulares e <span className="text-primary font-bold">{"{{"}ecogenicidade{"}}"}</span> preservada.</p>
                  <p className="text-slate-400">Ausência de lesões focais ou <span className="text-primary font-bold">{"{{"}cistos{"}}"}</span> parenquimatosos.</p>
                  <p className="text-slate-500 border-t border-white/5 pt-4 mt-4 text-xs">Aperte [TAB] para navegar entre as variáveis.</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
