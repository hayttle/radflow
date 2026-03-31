import { XCircle, CheckCircle } from "lucide-react"

export function DarkPainSection() {
  return (
    <section className="relative py-20 md:py-28 lg:py-32 bg-slate-950 text-slate-50 overflow-hidden dark">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
            Pare de perder tempo com editores que não entendem de medicina
          </h2>
          <p className="text-lg text-slate-400">
            A dor de usar ferramentas genéricas custa horas do seu dia e aumenta o risco de erros no laudo final.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
          
          {/* O Caos (Problema) */}
          <div className="p-8 rounded-2xl border border-red-500/20 bg-slate-900/50 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6 text-red-500">
              <XCircle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-red-100">O Caos Atual</h3>
            <ul className="space-y-4 text-slate-400 text-left w-full mt-4">
              <li className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <span>Textos bagunçados e formatação que quebra do nada.</span>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <span>Copiar e colar os textos é árduo e aumenta o risco de erros no laudo final.</span>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <span>Digitando as mesmas conclusões repetidamente.</span>
              </li>
            </ul>
          </div>

          {/* A Solução (RadFlow) */}
          <div className="p-8 rounded-2xl border border-primary/30 bg-primary/5 flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
            
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-6 text-primary">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-primary">A Solução RadFlow</h3>
            <ul className="space-y-4 text-slate-300 text-left w-full mt-4">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>Modelos personalizados inteligentes que preenchem 99% do laudo com 1 clique.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>Variáveis seguras. O nome, histórico do paciente e achados já vêm pré-integrados.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>Formatos consistentes, limpos e sempre com a mesma identidade visual.</span>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  )
}
