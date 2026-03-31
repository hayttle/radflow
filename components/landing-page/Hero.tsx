import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Zap } from "lucide-react"

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 lg:pt-48 md:pb-32 overflow-hidden flex flex-col justify-center min-h-[90vh]">
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] bg-blue-500/20 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        
        {/* Lado Esquerdo: Texto e CTA */}
        <div className="text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary text-sm md:text-base font-semibold mb-6 animate-fade-in">
            <Zap className="w-4 h-4 fill-current" />
            <span>Lançamento em Breve</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
            Diga adeus ao <span className="text-muted-foreground line-through">Microsoft Word</span>. <br />
            Laudos no <span className="text-primary bg-clip-text">estado da arte.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            A plataforma criada para médicos que querem <strong className="text-foreground">reduzir o tempo de laudo</strong> pela metade. 
            Sem erros de digitação e com foco absoluto no diagnóstico.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 z-20 relative">
            <Button size="lg" className="h-14 px-8 text-base shadow-xl shadow-green-500/20 bg-[#078836] hover:bg-[#1DA851] text-white flex items-center gap-3 transition-transform hover:scale-105" asChild>
              <a href="#cta">
                Garantir Acesso Antecipado
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
          </div>
        </div>

        {/* Lado Direito: Dashboard 3D Preview Placeholder */}
        <div className="relative w-full max-w-2xl mx-auto lg:mx-0 lg:ml-auto perspective-[2000px] mt-12 lg:mt-0">
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent z-10 lg:hidden" />
          
          <div 
            className="rounded-2xl border border-white/10 bg-card/60 backdrop-blur-md p-2 shadow-2xl overflow-hidden aspect-[4/3] lg:aspect-[16/10] flex items-center justify-center transform-gpu transition-transform duration-700 ease-out hover:-rotate-y-[2deg] rotate-x-[4deg] rotate-y-[-12deg] rotate-z-[2deg] shadow-primary/10"
            style={{ transformStyle: 'preserve-3d' }}
          >
             <div className="w-full h-full bg-slate-900/50 flex flex-col items-center justify-center relative rounded-xl border border-border">
                {/* Image Placeholder text */}
                <div className="p-4 md:p-8 text-center text-slate-500 font-mono text-xs md:text-sm z-10 flex flex-col items-center">
                  <span className="mb-2 text-base md:text-lg">📸 [ Placeholder : Editor RadFlow ]</span>
                  <span>Proporção sugerida: 16:10</span>
                </div>
                
                {/* Mock UI elements to make it feel premium */}
                <div className="absolute top-4 left-4 right-4 flex gap-2">
                   <div className="w-8 md:w-12 h-2 rounded bg-slate-800" />
                   <div className="w-8 md:w-12 h-2 rounded bg-slate-800" />
                   <div className="w-flex-1" />
                   <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-slate-800/80" />
                </div>
                
                <div className="absolute left-4 top-16 bottom-4 w-32 md:w-48 border border-slate-700/50 rounded-lg p-4 bg-slate-900/40 backdrop-blur-sm hidden sm:block">
                  <div className="space-y-3">
                    <div className="h-2 w-full bg-slate-800 rounded" />
                    <div className="h-2 w-4/5 bg-slate-800 rounded" />
                    <div className="h-2 w-full bg-slate-800 rounded" />
                    <div className="h-2 w-3/4 bg-slate-800 rounded" />
                  </div>
                </div>

                <div className="absolute right-4 sm:left-[10rem] md:left-[14rem] left-4 top-16 bottom-4 border border-slate-700/50 rounded-lg p-4 md:p-6 bg-slate-900/40 backdrop-blur-sm">
                   <div className="space-y-4 md:space-y-6">
                      <div className="h-3 md:h-4 w-1/3 bg-slate-800 rounded" />
                      <div className="space-y-2">
                        <div className="h-2 md:h-3 w-full bg-slate-800/50 rounded" />
                        <div className="h-2 md:h-3 w-full bg-slate-800/50 rounded" />
                        <div className="h-2 md:h-3 w-4/5 bg-slate-800/50 rounded" />
                      </div>
                      <div className="h-3 md:h-4 w-1/4 bg-primary/40 rounded mt-4 md:mt-8" />
                      <div className="h-2 md:h-3 w-full bg-slate-800/30 rounded" />
                   </div>
                </div>
             </div>
          </div>
        </div>

      </div>
    </section>
  )
}
