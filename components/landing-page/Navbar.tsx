"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeSwitcher } from "@/components/layout/theme-switcher"

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-background/60 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
            <span className="text-primary-foreground font-bold italic">RF</span>
          </div>
          <span className="text-xl font-bold tracking-tight">
            Rad<span className="text-primary">Flow</span>
          </span>
        </Link>
        
        <div className="flex items-center gap-4">
          <ThemeSwitcher />
        </div>
      </div>
    </nav>
  )
}
