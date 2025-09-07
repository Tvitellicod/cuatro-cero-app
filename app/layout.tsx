import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/hooks/use-auth"
import { Toaster } from "@/components/ui/toaster"
import { ProfileProvider } from "@/hooks/use-profile"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CUATRO CERO - Gestión de Equipos",
  description: "La plataforma más completa para la gestión profesional de equipos de fútbol",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          <ProfileProvider>
            {children}
            <Toaster />
          </ProfileProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
