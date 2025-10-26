"use client"

import { Menu, Bell, User, LogOut, Users } from "lucide-react" // Importar Users
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
// Eliminamos useProfile ya que leeremos directo de localStorage aquí
// import { useProfile } from "@/hooks/use-profile"
import { useAuth } from "@/hooks/use-auth"; // Mantenemos useAuth para signOut

interface DashboardHeaderProps {
  onMenuClick: () => void
}

export function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  // const { currentProfile } = useProfile() // Ya no necesitamos esto aquí
  const { signOut } = useAuth(); // Obtenemos signOut del hook de autenticación

  // Leer el perfil activo directamente desde localStorage
  const savedProfile = typeof window !== "undefined" ? localStorage.getItem("userProfile") : null;
  const profileData = savedProfile ? JSON.parse(savedProfile) : null;

  const handleSignOut = async () => {
    await signOut();
    // Limpiar perfiles al cerrar sesión
    localStorage.removeItem("userProfile");
    localStorage.removeItem("allUserProfiles"); // Limpiamos todos los perfiles también
    localStorage.removeItem("userCategories");
    localStorage.removeItem("userNamedProfiles");
    window.location.href = "/app"; // Redirigir a la página de login
  };


  return (
    <header className="bg-[#213041] border-b border-[#305176] px-4 lg:px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-white hover:text-[#aff606] mr-4"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div>
            {/* Mostrar Nombre y Rol del Perfil Activo */}
            <h1 className="text-xl font-semibold text-white">
              {profileData ? `${profileData.firstName} ${profileData.lastName}` : "Dashboard"}
            </h1>
            {/* Mostrar Rol y Categoría */}
            {profileData && (
              <p className="text-sm text-gray-400">
                {profileData.role} - {profileData.categoryName || profileData.category}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="text-white hover:text-[#aff606]">
            <Bell className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:text-[#aff606]">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#213041] border-[#305176]">
              {/* Opción para ir a la pantalla de selección/creación */}
              <DropdownMenuItem
                className="text-white hover:bg-[#305176]"
                onClick={() => {
                  // Solo limpiamos el perfil activo para forzar la re-selección
                  localStorage.removeItem("userProfile");
                  window.location.href = "/create-profile"; // Ir a la pantalla de selección
                }}
              >
                <Users className="h-4 w-4 mr-2" /> {/* Cambiado a Users */}
                Cambiar Perfil/Categoría
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#305176]" />
              {/* Usar handleSignOut para cerrar sesión y limpiar localStorage */}
              <DropdownMenuItem
                className="text-white hover:bg-[#305176]"
                onClick={handleSignOut}
               >
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}