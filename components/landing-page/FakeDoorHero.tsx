import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle2, Zap, MessageCircle, Users, Building2, FileCheck } from "lucide-react"

export function FakeDoorHero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden min-h-[90vh] flex flex-col justify-center">
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] bg-blue-500/20 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-semibold mb-6 animate-fade-in mx-auto">
          <Zap className="w-4 h-4 fill-current" />
          <span>Lançamento em Breve</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl mx-auto leading-[1.1]">
          Diga adeus ao <span className="text-muted-foreground line-through">Microsoft Word</span>. <br />
          Laudos radiológicos no <span className="text-primary bg-clip-text">estado da arte.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
          A plataforma criada para radiologistas que querem <strong className="text-foreground">reduzir pela metade o tempo de laudo</strong> sem perder a precisão. 
          Sem erros, menos cliques e foco absoluto no diagnóstico.
        </p>

        {/* Benefícios Reais em Grid/Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 text-left max-w-5xl mx-auto">
          <div className="p-6 rounded-2xl bg-card border border-border/50 dark:border-white/5 shadow-md hover:shadow-xl hover:-translate-y-1 hover:border-green-500/30 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mb-4 text-green-500">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Laudos em Segundos</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Crie modelos e máscaras inteligentes que eliminam a digitação repetitiva de forma imediata.
            </p>
          </div>
          
          <div className="p-6 rounded-2xl bg-card border border-border/50 dark:border-white/5 shadow-md hover:shadow-xl hover:-translate-y-1 hover:border-blue-500/30 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-4 text-blue-500">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Padronização Total</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Garanta que absolutamente todos os seus laudos sigam o mesmo rigor técnico e estético.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border/50 dark:border-white/5 shadow-md hover:shadow-xl hover:-translate-y-1 hover:border-purple-500/30 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mb-4 text-purple-500">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Redução da Fadiga Mental</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Foque na análise profunda e técnica da imagem, não no preenchimento manual do editor de texto.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border/50 dark:border-white/5 shadow-md hover:shadow-xl hover:-translate-y-1 hover:border-orange-500/30 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center mb-4 text-orange-500">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-lg mb-2">CRM Integrado</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Gestão completa de pacientes: histórico de exames, dados unificados e acompanhamento perfeito.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border/50 dark:border-white/5 shadow-md hover:shadow-xl hover:-translate-y-1 hover:border-teal-500/30 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-teal-500/10 flex items-center justify-center mb-4 text-teal-500">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Multi-Unidades</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Timbre e identidade visual personalizados de forma automática para cada local onde você atende.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border/50 dark:border-white/5 shadow-md hover:shadow-xl hover:-translate-y-1 hover:border-rose-500/30 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center mb-4 text-rose-500">
              <FileCheck className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Assinatura Digital</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Sua assinatura perfeitamente posicionada e impressa com alta qualidade nos laudos finais.
            </p>
          </div>
        </div>

        {/* CTA (Fake Door Validation) */}
        <div className="p-8 md:p-12 rounded-2xl border border-border/50 dark:border-white/10 bg-card/60 backdrop-blur-md shadow-2xl max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Seja um dos primeiros a testar o RadFlow!</h2>
          <p className="text-muted-foreground mb-6">
            Entre no <strong className="text-white">grupo VIP</strong> dos 100 primeiros usuários.
          </p>

          <ul className="text-left md:w-5/6 mx-auto mb-8 space-y-4">
            <li className="flex items-start gap-4 text-sm md:text-base text-foreground/90 leading-relaxed text-justify">
              <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" /> 
              <span><strong className="text-foreground">Desconto exclusivo:</strong> Assinatura com valor reduzido (exclusivo para o grupo).</span>
            </li>
            <li className="flex items-start gap-4 text-sm md:text-base text-foreground/90 leading-relaxed text-justify">
              <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" /> 
              <span><strong className="text-foreground">Influência no Produto:</strong> Sugira funcionalidades e garanta que a ferramenta seja moldada exatamente para o seu fluxo de trabalho.</span>
            </li>
            <li className="flex items-start gap-4 text-sm md:text-base text-foreground/90 leading-relaxed text-justify">
              <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" /> 
              <span><strong className="text-foreground">Acesso Antecipado:</strong> Tenha acesso prioritário aos novos módulos e melhorias da plataforma.</span>
            </li>
          </ul>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="h-14 px-8 text-base shadow-xl shadow-green-500/20 bg-[#078836] hover:bg-[#1DA851] text-white flex items-center gap-3 transition-transform hover:scale-105" asChild>
              {/* O link de whatsapp entra no 'href'. Substitua quando desejar */}
              <Link href="https://chat.whatsapp.com/Gj59vE5XW8B2f2rHMqW39M" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                </svg>
                Entrar no Grupo VIP
              </Link>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-6 font-medium">
            🔒 Feito por médicos e engenheiros. Sua privacidade e produtividade são nossa prioridade.
          </p>
        </div>
      </div>
    </section>
  )
}
