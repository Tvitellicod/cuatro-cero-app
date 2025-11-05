"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { useProfile } from "@/hooks/use-profile"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Menu, LogOut, Settings, User as UserIcon } from "lucide-react"
import { Sidebar as SidebarNav } from "./sidebar" // Renombrado para evitar conflicto

export function DashboardHeader() {
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const { signOut } = useAuth()
  const { currentProfile } = useProfile() // Obtener el nombre completo del perfil y rol
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    // Limpiar localStorage al cerrar sesión
    localStorage.removeItem("userProfile");
    localStorage.removeItem("selectedCategory");
    localStorage.removeItem("allUserCategories");
    localStorage.removeItem("allUserProfiles");
    // Se mantiene el club (clubData) para que pueda volver a iniciar sesión en el mismo club.
    router.push("/app") // Redirigir a la página de login
  }
  
  // Extraer iniciales del nombre del perfil (Se mantiene igual)
  const getInitials = (name: string | null) => {
    if (!name) return "4C"
    const parts = name.split(" - ")[0]?.split(" ");
    if (!parts) return "4C";
    const firstNameInitial = parts[0] ? parts[0][0] : "";
    const lastNameInitial = parts[1] ? parts[1][0] : "";
    return (firstNameInitial + lastNameInitial).toUpperCase() || "4C";
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-[#305176] bg-[#213041] px-4 md:px-6">
      
      {/* --- Lado Izquierdo: Texto del Perfil y Menú Móvil --- */}
      <div className="flex items-center gap-4">
        {/* Menú Hamburguesa (Móvil) */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden bg-transparent border-none text-white hover:bg-[#305176] hover:text-[#aff606]"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-[#1d2834] border-r-[#305176] text-white w-[280px]">
            {/* El contenido del Sidebar para móvil */}
            <SidebarNav isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)} /> 
          </SheetContent>
        </Sheet>
        
        {/* --- Texto del Perfil/Rol/Categoría (Visible en Desktop) --- */}
        <div className="hidden md:flex items-center space-x-2">
          <UserIcon className="h-5 w-5 text-[#aff606]" /> {/* Ícono de usuario */}
          <span className="text-white text-sm font-semibold truncate max-w-xs lg:max-w-md">
            {currentProfile || "Cargando perfil..."} {/* Muestra el texto directamente */}
          </span>
        </div>
      </div>

      {/* --- Lado Derecho: Perfil de Usuario --- */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full bg-transparent border border-[#305176] text-white hover:bg-[#305176]"
          >
            <Avatar className="h-8 w-8">
              {/* Se eliminó AvatarImage ya que no estaba en el código original */}
              <AvatarFallback className="bg-[#305176] text-[#aff606] text-sm font-bold">
                {getInitials(currentProfile)}
              </AvatarFallback>
            </Avatar>
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-[#213041] border-[#305176] text-white">
          <DropdownMenuLabel className="font-normal">
             <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Mi Cuenta</p>
                <p className="text-xs leading-none text-gray-400 truncate max-w-[200px]">
                  {currentProfile || "Cargando..."}
                </p>
             </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-[#305176]" />
          <DropdownMenuItem className="focus:bg-[#305176]">
            <Settings className="mr-2 h-4 w-4" />
            <span>Configuración</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="focus:bg-[#305176]"
            // Redirige al inicio del flujo de selección de perfil/categoría
            onClick={() => router.push('/select-category')} 
          >
            <UserIcon className="mr-2 h-4 w-4" />
            <span>Cambiar Categoría/Perfil</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-[#305176]" />
          <DropdownMenuItem onClick={handleSignOut} className="text-red-400 focus:bg-red-500 focus:text-white">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Cerrar Sesión</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}