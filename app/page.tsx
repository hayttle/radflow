import { Navbar } from "@/components/landing-page/Navbar"
import { FakeDoorHero } from "@/components/landing-page/FakeDoorHero"
import { Footer } from "@/components/landing-page/Footer"
export default async function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30 flex flex-col">
      <div className="flex-1">
        <Navbar />
        <FakeDoorHero />
      </div>
      
      <Footer />
    </main>
  );
}
