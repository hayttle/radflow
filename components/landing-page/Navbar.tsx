"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeSwitcher } from "@/components/theme-switcher"

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-background/60 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold italic">RF</span>
          </div>
          <span className="text-xl font-bold tracking-tight">
            Rad<span className="text-primary">Flow</span>
          </span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <Link href="#problema" className="hover:text-primary transition-colors">Problema</Link>
          <Link href="#solucao" className="hover:text-primary transition-colors">Solução</Link>
          <Link href="#recursos" className="hover:text-primary transition-colors">Recursos</Link>
          <Link href="#faq" className="hover:text-primary transition-colors">FAQ</Link>
        </div>

        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          <Button variant="ghost" asChild className="hidden sm:inline-flex">
            <Link href="/auth/login">Entrar</Link>
          </Button>
          <Button asChild>
            <Link href="/auth/sign-up">Começar Agora</Link>
          </Button>
        </div>
      </div>
    </nav>
  )
}
