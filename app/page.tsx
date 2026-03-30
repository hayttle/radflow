import { Suspense } from "react"
import { Navbar } from "@/components/landing-page/Navbar"
import { FakeDoorHero } from "@/components/landing-page/FakeDoorHero"
import { Footer } from "@/components/landing-page/Footer"
import { JsonLd } from "@/components/seo/JsonLd"

export default async function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "RadFlow",
    "operatingSystem": "Web",
    "applicationCategory": "HealthApplication",
    "description": "Plataforma de automação para laudos radiológicos. Substitua o fluxo manual por produtividade e segurança.",
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
    "description": "Soluções de produtividade para radiologia moderna."
  };

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30 flex flex-col">
      <JsonLd data={jsonLd} />
      <JsonLd data={organizationLd} />
      
      <div className="flex-1">
        <Navbar />
        <FakeDoorHero />
      </div>
      
      <Footer />
    </main>
  );
}
