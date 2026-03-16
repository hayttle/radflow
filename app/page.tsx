import { Suspense } from "react"
import { Navbar } from "@/components/landing-page/Navbar"
import { Hero } from "@/components/landing-page/Hero"
import { ProblemSolution } from "@/components/landing-page/ProblemSolution"
import { Features } from "@/components/landing-page/Features"
import { Pricing } from "@/components/landing-page/Pricing"
import { FAQ } from "@/components/landing-page/FAQ"
import { FinalCTA } from "@/components/landing-page/FinalCTA"
import { Footer } from "@/components/landing-page/Footer"
import { JsonLd } from "@/components/seo/JsonLd"
import { getAvailablePlans } from "@/lib/plans"

async function PricingWrapper() {
  const plans = await getAvailablePlans();
  return <Pricing plans={plans} />;
}

function PricingFallback() {
  return (
    <div className="container py-24 space-y-8 animate-pulse">
      <div className="h-10 w-48 bg-muted rounded mx-auto" />
      <div className="h-6 w-96 bg-muted rounded mx-auto" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-[500px] bg-muted rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export default async function Home() {
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
      <Suspense fallback={<PricingFallback />}>
        <PricingWrapper />
      </Suspense>
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}
