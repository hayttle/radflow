import { LayoutTemplate, Building2 } from "lucide-react"

export function CoreAdvantages() {
  return (
    <section className="py-20 md:py-28 lg:py-32 bg-muted/30 border-y border-border/50 overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">O dobro de velocidade na sua rotina</h2>
          <p className="text-lg text-muted-foreground">
            O segredo não está em digitar mais rápido, está em não precisar digitar o que já está pronto.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto items-stretch">
          
          {/* Advantage 1: Máscaras */}
          <div className="flex flex-col gap-6">
            <div className="w-full aspect-[4/3] rounded-2xl bg-slate-100 dark:bg-slate-900 border border-border/50 flex flex-col items-center justify-center relative overflow-hidden shadow-xl">
               <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10 pointer-events-none" />
               <span className="text-sm text-slate-400 font-mono z-20 text-center px-4">
                 📸 Placeholder<br/>(Interface editando uma máscara personalizável)
               </span>
            </div>
            
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <LayoutTemplate className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-semibold">Modelos com Máscaras</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Crie milhares de modelos clínicos predefinidos (máscaras). Substituímos suas longas digitações manuais por um fluxo automatizado e flexível. O seu diagnóstico central, padronizado, e pronto para o uso.
              </p>
            </div>
          </div>

          {/* Advantage 2: Unidades */}
          <div className="flex flex-col gap-6">
            <div className="w-full aspect-[4/3] rounded-2xl bg-slate-100 dark:bg-slate-900 border border-border/50 flex flex-col items-center justify-center relative overflow-hidden shadow-xl">
               <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10 pointer-events-none" />
               <span className="text-sm text-slate-400 font-mono z-20 text-center px-4">
                 📸 Placeholder<br/>(Menu de seleção trocando de Clínica/Hospital)
               </span>
            </div>
            
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-500">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-semibold">Múltiplas Unidades</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Um único sistema, ilimitados locais de trabalho. Cadastre os hospitais e clínicas onde atende. O RadFlow alterna automaticamente os rodapés, cabeçalhos, logos institucionais e identidades visuais de cada local enquanto você lauda.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
