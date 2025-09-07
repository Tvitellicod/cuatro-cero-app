"use client"

import { Menu, Bell, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useProfile } from "@/hooks/use-profile"

interface DashboardHeaderProps {
  onMenuClick: () => void
}

export function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const { currentProfile } = useProfile()

  // Obtener el perfil guardado
  const savedProfile = typeof window !== "undefined" ? localStorage.getItem("userProfile") : null
  const profileData = savedProfile ? JSON.parse(savedProfile) : null

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
            <h1 className="text-xl font-semibold text-white">{profileData ? profileData.displayName : "Dashboard"}</h1>
            {profileData && (
              <p className="text-sm text-gray-400">
                {profileData.category === "primera"
                  ? "Primera División"
                  : profileData.category === "tercera"
                    ? "Tercera División"
                    : profileData.category === "cuarta"
                      ? "Cuarta División"
                      : profileData.category === "quinta"
                        ? "Quinta División"
                        : profileData.category === "sexta"
                          ? "Sexta División"
                          : profileData.category === "septima"
                            ? "Séptima División"
                            : profileData.category === "juveniles"
                              ? "Juveniles"
                              : profileData.category === "infantiles"
                                ? "Infantiles"
                                : profileData.category}
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
              <DropdownMenuItem className="text-white hover:bg-[#305176]">
                <User className="h-4 w-4 mr-2" />
                Perfil
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-white hover:bg-[#305176]"
                onClick={() => {
                  localStorage.removeItem("userProfile")
                  window.location.href = "/create-profile"
                }}
              >
                <User className="h-4 w-4 mr-2" />
                Cambiar Perfil
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#305176]" />
              <DropdownMenuItem className="text-white hover:bg-[#305176]">
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
