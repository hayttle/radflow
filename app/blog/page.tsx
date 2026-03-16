import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/landing-page/Navbar"
import { Footer } from "@/components/landing-page/Footer"
import { Calendar, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"

const posts = [
  {
    title: "Como a IA está transformando o diagnóstico por imagem",
    description: "Descubra como algoritmos inteligentes auxiliam radiologistas a identificar achados sutis com maior precisão.",
    category: "Tecnologia",
    date: "10 Mar, 2026",
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1576091160550-217359f4ecf8?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "5 dicas para aumentar a produtividade na elaboração de laudos",
    description: "Pequenas mudanças no fluxo de trabalho que podem economizar horas do seu dia a dia na clínica.",
    category: "Produtividade",
    date: "08 Mar, 2026",
    readTime: "4 min",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "O futuro da telerradiologia: tendências para 2026",
    description: "O que esperar da expansão dos serviços de diagnóstico remoto e como se preparar para o mercado.",
    category: "Mercado",
    date: "05 Mar, 2026",
    readTime: "6 min",
    image: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=800",
  }
]

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-slate-50 dark:bg-slate-900/30">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">Nosso Blog</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Conhecimento que Flui</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explorando o futuro da radiologia, tecnologia e produtividade médica.
          </p>
        </div>
      </section>

      {/* Blog Feed */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, i) => (
              <Card key={i} className="group overflow-hidden border-border bg-card hover:border-primary/50 transition-all duration-300 flex flex-col">
                <div className="relative aspect-video overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/90 dark:bg-slate-950/90 text-primary backdrop-blur-sm border-none">
                      {post.category}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader className="flex-1">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="mt-3 line-clamp-3">
                    {post.description}
                  </CardDescription>
                </CardHeader>
                
                <CardFooter className="pt-0 border-t border-border mt-auto">
                  <Button variant="ghost" className="w-full justify-between group/btn text-muted-foreground hover:text-primary font-medium" asChild>
                    <Link href="#">
                      Ler Artigo Completo
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="mt-20 text-center">
            <Button size="lg" variant="outline" className="rounded-full px-8">
              Carregar mais artigos
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto rounded-[2.5rem] bg-primary p-12 text-primary-foreground relative overflow-hidden shadow-2xl shadow-primary/20 text-center">
             <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
             <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-black/10 rounded-full blur-3xl" />
             
             <h2 className="text-3xl font-bold mb-4 relative z-10">Fique por dentro das novidades</h2>
             <p className="text-primary-foreground/80 mb-8 max-w-lg mx-auto relative z-10">
               Inscreva-se na nossa newsletter e receba conteúdos exclusivos sobre radiologia e tecnologia.
             </p>
             
             <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto relative z-10">
                <input 
                  type="email" 
                  placeholder="seu@email.com" 
                  className="flex-1 h-12 px-4 rounded-xl bg-white/10 border border-white/20 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all shadow-inner"
                />
                <Button variant="secondary" size="lg" className="h-12 shadow-md">Inscrever-se</Button>
             </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
