import { Navbar } from "@/components/landing-page/Navbar"
import { Hero } from "@/components/landing-page/Hero"
import { ProblemSolution } from "@/components/landing-page/ProblemSolution"
import { Features } from "@/components/landing-page/Features"
import { FAQ } from "@/components/landing-page/FAQ"
import { FinalCTA } from "@/components/landing-page/FinalCTA"
import { Footer } from "@/components/landing-page/Footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30">
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
