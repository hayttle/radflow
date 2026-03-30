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
        <div className="flex flex-col md:flex-row justify-center items-center gap-2 text-center text-xs text-muted-foreground">
          <span>© {year || "2026"} RadFlow SaaS. Todos os direitos reservados.</span>
          <span className="hidden md:inline text-muted-foreground/50">•</span>
          <span className="text-muted-foreground/70">
            Um produto da{' '}
            <Link 
              href="https://loggatech.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-primary transition-colors decoration-muted-foreground/30"
            >
              Logga Tecnologia LTDA
            </Link>
            {' '}- CNPJ 60.859.566/0001-03
          </span>        </div>
      </div>
    </footer>
  )
}
