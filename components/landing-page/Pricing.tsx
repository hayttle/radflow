import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const features = [
  "Laudos Ilimitados",
  "Gestão Multitenant (Unidades)",
  "Editor Rich Text com Variáveis",
  "Biblioteca de Frases Personalizada",
  "Assinatura Digitalizada",
  "Exportação A4 em PDF",
  "Suporte Prioritário",
  "Armazenamento Seguro em Nuvem"
]

export function Pricing() {
  return (
    <section id="precos" className="py-24 bg-slate-50 dark:bg-slate-900/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Investimento Único</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Simplicidade no preço para você focar no que importa: seus pacientes.
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <div className="relative p-8 rounded-[2.5rem] border-2 border-primary bg-card shadow-2xl shadow-primary/10 overflow-hidden">
            <div className="absolute top-0 right-0 px-6 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-bl-2xl">
              PLANO PROFISSIONAL
            </div>
            
            <div className="mb-8">
              <span className="text-5xl font-extrabold font-mono">R$ 297</span>
              <span className="text-muted-foreground ml-2">/mês</span>
            </div>

            <ul className="space-y-4 mb-10">
              {features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-primary stroke-[3]" />
                  </div>
                  <span className="text-sm font-medium">{feature}</span>
                </li>
              ))}
            </ul>

            <Button size="lg" className="w-full h-14 text-lg font-bold group" asChild>
              <Link href="/auth/sign-up">
                Assinar Agora
                <Check className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />
              </Link>
            </Button>
            
            <p className="text-center text-xs text-muted-foreground mt-6 italic font-medium">
              Teste grátis por 7 dias. Sem compromisso.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
