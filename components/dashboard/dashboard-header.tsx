// tvitellicod/cuatro-cero-app/cuatro-cero-app-02dc91cb8697f7842c0382cd6eb47962b822935d/components/dashboard/dashboard-header.tsx

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
  
  // --- INICIO DE MODIFICACIÓN ---

  const profileName = currentProfile ? currentProfile.split(' - ')[0] : 'Usuario';
  const initials = getInitials(currentProfile);

  // Lógica para extraer el ROL LIMPIO, quitando la categoría (con o sin paréntesis)
  let profileRole = 'No asignado';
  if (currentProfile) {
    const parts = currentProfile.split(' - ');
    if (parts.length > 1) {
        profileRole = parts[1]; // Ej: "DIRECTOR TECNICO (Primera División)" O "DIRECTOR TECNICO - Primera División"
        
        // Limpiar el rol (eliminar la parte de la categoría)
        if (profileRole.includes('(')) {
            profileRole = profileRole.split(' (')[0].trim(); // Ej: "DIRECTOR TECNICO"
        } else if (selectedCategory && profileRole.includes(selectedCategory.name)) {
            // Manejar formato nuevo "ROL - CATEGORIA"
            profileRole = profileRole.replace(selectedCategory.name, '').replace(' - ', '').trim();
        }
    }
  }
  
  // Variable para el nuevo título del encabezado (Header)
  const headerTitle = selectedCategory 
    ? `${profileName} - ${profileRole} - ${selectedCategory.name}`
    : `${profileName} - ${profileRole}`;

  // --- FIN DE MODIFICACIÓN ---

  return (
    <header className="flex h-16 items-center justify-between border-b border-[#305176] bg-[#213041] px-4 md:px-6">
      <div className="flex items-center min-w-0"> {/* Añadido min-w-0 para que funcione truncate */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden text-white hover:bg-[#305176] mr-4"
          onClick={onMenuToggle}
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        {/* Título del encabezado reemplazado */}
        <h1 
          className="text-lg font-semibold text-white hidden sm:block truncate"
          title={headerTitle} // Muestra el texto completo al pasar el ratón
        >
          {headerTitle}
        </h1>
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
                {/* [MODIFICADO] Usar el rol limpio */}
                <p className="text-xs leading-none text-[#aff606]">{profileRole}</p>
                {selectedCategory && (
                    <p className="text-xs leading-none text-gray-400">Categoría: {selectedCategory.name}</p>
                )}
              </div>
            </DropdownMenuLabel>
            
            <DropdownMenuSeparator className="bg-[#305176]" />
            
            <ConfigurationModal>
                <DropdownMenuItem 
                    onSelect={(e) => e.preventDefault()} 
                    className="cursor-pointer hover:bg-[#305176] focus:bg-[#305176]"
                >
                    <Settings className="h-4 w-4 mr-2" />
                    Configuración
                </DropdownMenuItem>
            </ConfigurationModal>

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