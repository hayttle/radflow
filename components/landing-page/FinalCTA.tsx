import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function FinalCTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5 -z-10" />
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto p-12 rounded-[3rem] bg-gradient-to-br from-primary to-baltic-blue-600 border border-primary/20 shadow-2xl shadow-primary/20 text-white">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Pronto para transformar sua produtividade?</h2>
          <p className="text-primary-foreground/80 text-lg mb-10 leading-relaxed">
            Junte-se a centenas de profissionais que já abandonaram o Word e estão redescobrindo o prazer de laudar com eficiência.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" variant="secondary" className="h-14 px-10 text-lg font-bold group" asChild>
              <Link href="/auth/sign-up">
                Criar Minha Conta Grátis
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Link href="https://wa.me/seu-numero" className="text-white hover:text-white/80 transition-colors underline underline-offset-4 font-medium">
               Falar com um consultor
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
