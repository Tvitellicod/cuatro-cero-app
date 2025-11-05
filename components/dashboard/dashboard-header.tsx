// tvitellicod/cuatro-cero-app/cuatro-cero-app-60479741c8ea2ca449bfcef814f36d999ab6ab01/components/dashboard/dashboard-header.tsx

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, User, Settings } from "lucide-react" 
import { useProfile } from "@/hooks/use-profile"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"

import { ConfigurationModal } from "./configuration-modal" 

interface DashboardHeaderProps {
  onMenuToggle: () => void
}

export function DashboardHeader({ onMenuToggle }: DashboardHeaderProps) {
  const { currentProfile, selectedCategory, setCurrentProfile } = useProfile()
  const router = useRouter()
  
  const handleLogout = () => {
    // 1. Limpiar localStorage de sesión y perfil
    localStorage.removeItem("authStatus");
    localStorage.removeItem("userProfile");
    localStorage.removeItem("selectedCategory");
    localStorage.removeItem("clubData");
    localStorage.removeItem("allUserCategories");
    localStorage.removeItem("allUserProfiles");

    // 2. Limpiar contexto (opcional, pero buena práctica)
    setCurrentProfile(null);
    
    // 3. Redirigir a la página de inicio de sesión
    router.push("/");
  }

  // Obtener iniciales para el Avatar
  const getInitials = (fullName: string | null) => {
    if (!fullName) return "CU";
    // Extrae las iniciales del nombre y apellido (la primera parte del displayName)
    const parts = fullName.split(' - ')[0].split(' ');
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  }
  
  const profileName = currentProfile ? currentProfile.split(' - ')[0] : 'Usuario';
  const profileRole = currentProfile ? currentProfile.split(' - ')[1] : 'No asignado';
  const initials = getInitials(currentProfile);

  return (
    <header className="flex h-16 items-center justify-between border-b border-[#305176] bg-[#213041] px-4 md:px-6">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden text-white hover:bg-[#305176] mr-4"
          onClick={onMenuToggle}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold text-white hidden sm:block">Dashboard</h1>
      </div>

      <div className="flex items-center space-x-3">
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-9 w-9 rounded-full p-0 flex items-center justify-center bg-[#305176] hover:bg-[#406186]"
            >
              <Avatar className="h-9 w-9 border-2 border-[#aff606]">
                <AvatarImage src="/placeholder-user.jpg" alt="User Avatar" />
                <AvatarFallback className="bg-transparent text-[#aff606] font-bold text-sm">
                    {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 bg-[#213041] border-[#305176] text-white" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-white">{profileName}</p>
                <p className="text-xs leading-none text-[#aff606]">{profileRole}</p>
                {selectedCategory && (
                    <p className="text-xs leading-none text-gray-400">Categoría: {selectedCategory.name}</p>
                )}
              </div>
            </DropdownMenuLabel>
            
            <DropdownMenuSeparator className="bg-[#305176]" />
            
            {/* INICIO DE MODIFICACIÓN: Configuración como ítem de menú */}
            <ConfigurationModal>
                <DropdownMenuItem 
                    // onSelect={(e) => e.preventDefault()} está ahora en el componente ConfigurationModal
                    className="cursor-pointer hover:bg-[#305176] focus:bg-[#305176]"
                >
                    <Settings className="h-4 w-4 mr-2" />
                    Configuración
                </DropdownMenuItem>
            </ConfigurationModal>
            {/* FIN DE MODIFICACIÓN */}

            {/* Opción renombrada */}
            <DropdownMenuItem 
              onClick={() => router.push("/select-category")}
              className="cursor-pointer hover:bg-[#305176] focus:bg-[#305176]"
            >
              Cambiar Perfil / Categoría
            </DropdownMenuItem>
            
            <DropdownMenuSeparator className="bg-[#305176]" /> 
            
            <DropdownMenuItem 
              onClick={handleLogout}
              className="cursor-pointer text-red-400 hover:bg-[#305176] focus:bg-[#305176] focus:text-red-400 hover:text-red-400"
            >
              Cerrar Sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}