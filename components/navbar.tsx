"use client"

import Link from "next/link"
import { ShoppingCart, User, Menu, X } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-[#213041] border-b border-[#305176] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-[#aff606] hover:bg-[#305176]"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          {/* Desktop Navigation Menu - Encerrado en rectángulo */}
          <div className="hidden md:flex items-center bg-[#213041] rounded-[10px] px-6 py-2 border border-[#305176]">
            <div className="flex items-center space-x-8 text-xs">
              <Link href="/" className="text-white hover:text-[#aff606] transition-colors">
                INICIO
              </Link>
              <Link href="/tienda" className="text-white hover:text-[#aff606] transition-colors">
                TIENDA
              </Link>
              <Link href="/gestion" className="text-white hover:text-[#aff606] transition-colors">
                SERVICIOS
              </Link>
              <Link href="/contacto" className="text-white hover:text-[#aff606] transition-colors">
                CONTACTO
              </Link>
            </div>
          </div>

          {/* Logo - Centrado absoluto */}
          <div className="absolute left-1/2 transform -translate-x-1/2 leading-9">
            <img
              src="/images/cuatro-cero-logo.png"
              alt="CUATRO CERO - Gestión de Equipo"
              className="h-10 md:h-12 w-auto"
            />
          </div>

          {/* Right Icons - Encerrados en rectángulo y 25% más grandes */}
          <div className="flex items-center bg-[#213041] rounded-[10px] border border-[#305176] space-x-3 py-0 px-0">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-[#aff606] hover:bg-[#305176] h-12 w-12"
              onClick={() => window.open("/app", "_blank")}
            >
              <User className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-[#aff606] hover:bg-[#305176] h-12 w-12"
            >
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-[#305176]">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/"
                className="block px-3 py-2 text-white hover:text-[#aff606] hover:bg-[#305176] rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                INICIO
              </Link>
              <Link
                href="/tienda"
                className="block px-3 py-2 text-white hover:text-[#aff606] hover:bg-[#305176] rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                TIENDA
              </Link>
              <Link
                href="/gestion"
                className="block px-3 py-2 text-white hover:text-[#aff606] hover:bg-[#305176] rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                GESTIÓN
              </Link>
              <Link
                href="/contacto"
                className="block px-3 py-2 text-white hover:text-[#aff606] hover:bg-[#305176] rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                CONTACTO
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
