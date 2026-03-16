import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Zap } from "lucide-react"

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] bg-baltic-blue-500/20 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-semibold mb-6 animate-fade-in">
          <Zap className="w-3 h-3 fill-current" />
          <span>A revolução nos laudos radiológicos chegou</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl mx-auto leading-[1.1]">
          Diga adeus ao <span className="text-muted-foreground line-through">MS Word</span>. <br />
          Bem-vindo ao <span className="text-primary bg-clip-text">Laudo Inteligente</span>.
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
          Transforme seu fluxo de trabalho manual em uma plataforma automatizada, 
          segura e focada em produtividade. Laudos em minutos, não em horas.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Button size="lg" className="h-12 px-8 text-base shadow-xl shadow-primary/20 group" asChild>
            <Link href="/auth/sign-up">
              Começar Teste Grátis
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="h-12 px-8 text-base" asChild>
            <Link href="#recursos">Ver Demonstração</Link>
          </Button>
        </div>

        {/* Dashboard Preview Placeholder */}
        <div className="relative max-w-5xl mx-auto">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
          <div className="rounded-2xl border border-white/10 bg-card p-2 shadow-2xl overflow-hidden aspect-[16/9] flex items-center justify-center">
             <div className="w-full h-full bg-slate-900/50 flex flex-col items-center justify-center relative">
                <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                <div className="p-8 text-center text-slate-500 font-mono text-sm">
                  [ Screenshot do Editor de Laudos RadFlow ]
                </div>
                {/* Mock UI elements to make it feel "premium" */}
                <div className="absolute top-4 left-4 right-4 flex gap-2">
                   <div className="w-12 h-2 rounded bg-slate-800" />
                   <div className="w-12 h-2 rounded bg-slate-800" />
                   <div className="w-12 h-2 rounded bg-slate-800" />
                </div>
                <div className="w-4/5 h-2/3 border border-slate-700/50 rounded-lg p-6 bg-slate-900/40 backdrop-blur-sm">
                   <div className="space-y-4">
                      <div className="h-3 w-1/3 bg-slate-800 rounded" />
                      <div className="h-3 w-full bg-slate-800/50 rounded" />
                      <div className="h-3 w-4/5 bg-slate-800/50 rounded" />
                      <div className="h-4 w-1/4 bg-primary/40 rounded mt-8" />
                      <div className="h-3 w-full bg-slate-800/30 rounded" />
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  )
}
