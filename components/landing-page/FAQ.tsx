import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "O RadFlow é compatível com quais especialidades?",
    answer: "Embora focado inicialmente em radiologia geral e ultrassom, o RadFlow é altamente flexível e pode ser adaptado para qualquer especialidade que utilize laudos estruturados."
  },
  {
    question: "Como funciona a assinatura digital?",
    answer: "Você pode subir sua assinatura digitalizada uma única vez no perfil. O sistema a aplicará automaticamente em todos os laudos finalizados, garantindo um visual profissional e seguro."
  },
  {
    question: "Posso exportar os laudos para PDF?",
    answer: "Sim! Todos os laudos são gerados em formato A4 cinematográfico e podem ser exportados para PDF ou impressos diretamente pelo navegador."
  },
  {
    question: "O sistema é multi-usuário (multitenant)?",
    answer: "Sim. O RadFlow foi construído para suportar múltiplas unidades de atendimento e diversos médicos radiologistas sob a mesma organização ou em silos separados."
  }
]

export function FAQ() {
  return (
    <section id="faq" className="py-24 bg-slate-50 dark:bg-slate-900/30">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Perguntas Frequentes</h2>
          <p className="text-muted-foreground italic">
            Tudo o que você precisa saber para começar a usar o RadFlow hoje.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-b border-border/50">
              <AccordionTrigger className="text-left hover:no-underline font-semibold py-6">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
