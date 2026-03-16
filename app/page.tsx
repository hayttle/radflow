import { Navbar } from "@/components/landing-page/Navbar"
import { Hero } from "@/components/landing-page/Hero"
import { ProblemSolution } from "@/components/landing-page/ProblemSolution"
import { Features } from "@/components/landing-page/Features"
import { FAQ } from "@/components/landing-page/FAQ"
import { FinalCTA } from "@/components/landing-page/FinalCTA"
import { Footer } from "@/components/landing-page/Footer"
import { JsonLd } from "@/components/seo/JsonLd"

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "RadFlow",
    "operatingSystem": "Web",
    "applicationCategory": "HealthApplication",
    "description": "Plataforma de automação e inteligência para laudos radiológicos. Substitua o fluxo manual por produtividade e segurança.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "BRL"
    }
  };

  const organizationLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "RadFlow",
    "url": "https://radflow.com.br",
    "logo": "https://radflow.com.br/logo.png",
    "description": "Soluções inteligentes para radiologia moderna."
  };

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <JsonLd data={jsonLd} />
      <JsonLd data={organizationLd} />
      <Navbar />
      <Hero />
      <ProblemSolution />
      <Features />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}
