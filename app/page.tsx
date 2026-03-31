import { Navbar } from "@/components/landing-page/Navbar"
import { Hero } from "@/components/landing-page/Hero"
import { DarkPainSection } from "@/components/landing-page/DarkPainSection"
import { FeaturesGrid } from "@/components/landing-page/FeaturesGrid"
import { CoreAdvantages } from "@/components/landing-page/CoreAdvantages"
import { FinalCTA } from "@/components/landing-page/FinalCTA"
import { Footer } from "@/components/landing-page/Footer"

export default async function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30 flex flex-col">
      <div className="flex-1">
        <Navbar />
        <Hero />
        <DarkPainSection />
        <FeaturesGrid />
        <CoreAdvantages />
        <FinalCTA />
      </div>
      
      <Footer />
    </main>
  );
}
