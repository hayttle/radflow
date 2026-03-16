"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

export function Footer() {
  const [year, setYear] = useState<number | null>(null)

  useEffect(() => {
    setYear(new Date().getFullYear())
  }, [])

  return (
    <footer className="py-12 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
              <span className="text-primary-foreground font-bold italic text-xs">RF</span>
            </div>
            <span className="text-lg font-bold tracking-tight"> RadFlow </span>
          </div>

          <div className="flex items-center gap-8 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-primary transition-colors">Privacidade</Link>
            <Link href="#" className="hover:text-primary transition-colors">Termos de Uso</Link>
            <Link href="#" className="hover:text-primary transition-colors">Contato</Link>
          </div>

          <p className="text-xs text-muted-foreground">
             © {year || "2026"} RadFlow SaaS. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
