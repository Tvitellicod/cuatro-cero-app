"use client"

import type React from "react"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#1d2834]">
      {/* El Sidebar recibe el estado y la función para cerrarse (esto está bien) */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:pl-64">
        {/* AQUÍ ESTÁ LA CORRECCIÓN: 
          1. Renombramos la prop 'onMenuClick' a 'onMenuToggle' para que coincida con lo que espera el Header.
          2. Cambiamos la función para que alterne el estado (abrir/cerrar) en lugar de solo abrir.
        */}
        <DashboardHeader onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  )
}