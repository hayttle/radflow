import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, LayoutDashboard, Share2, ClipboardList } from "lucide-react"

export function ProblemSolution() {
  return (
    <section id="problema" className="py-24 bg-slate-50 dark:bg-slate-900/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">O Caos do Trabalho Manual</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Médicos radiologistas perdem 40% do tempo formatando documentos no Word em vez de focar no diagnóstico.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Problem Side */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-destructive flex items-center gap-2">
              <AlertCircle className="w-6 h-6" />
              O Cenário Atual (Ineficiente)
            </h3>
            <ul className="space-y-4">
              {[
                "Arquivos .docx espalhados sem qualquer gestão",
                "Falta de padronização nas terminologias",
                "Risco alto de erros ao copiar e colar dados",
                "Formatação manual demorada para cada laudo",
                "Dificuldade em gerenciar múltiplas unidades"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 p-4 rounded-xl border border-destructive/10 bg-destructive/5 text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-destructive mt-2" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Solution Side */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-primary flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6" />
              A Solução RadFlow
            </h3>
            <div className="grid gap-4">
              <Card className="border-primary/20 bg-primary/5 shadow-none">
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <LayoutDashboard className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Gestão Multitenant</h4>
                      <p className="text-sm text-muted-foreground">Gerencie várias clínicas ou hospitais em um único painel centralizado.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-primary/20 bg-primary/5 shadow-none">
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <ClipboardList className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Fluxo de Exames</h4>
                      <p className="text-sm text-muted-foreground">Acompanhe o status de cada exame, desde a triagem até a assinatura final.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-primary/20 bg-primary/5 shadow-none">
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Share2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Compartilhamento ágil</h4>
                      <p className="text-sm text-muted-foreground">Envio instantâneo do laudo para pacientes e médicos solicitantes.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
