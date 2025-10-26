"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { useProfile } from "@/hooks/use-profile"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Menu, LogOut, Settings, User as UserIcon, Tag } from "lucide-react"
import { SidebarNav } from "./sidebar" // Asumiendo que sidebar.tsx exporta SidebarNav

// --- Interfaz para Categoría (debe coincidir con use-profile) ---
interface UserCategory {
  id: string; 
  name: string;
  color: string;
}

// --- NUEVO COMPONENTE: Selector de Categoría ---
function CategorySwitcher() {
  const { selectedCategory, allCategories, setSelectedCategory } = useProfile();
  
  if (!selectedCategory || allCategories.length === 0) {
    return null; // No mostrar nada si no hay categoría seleccionada
  }

  const handleCategoryChange = (categoryId: string) => {
    const newCategory = allCategories.find(cat => cat.id === categoryId);
    if (newCategory) {
      // Aquí simplemente cambiamos la categoría en el contexto.
      // El perfil (rol) sigue siendo el mismo.
      setSelectedCategory(newCategory);
      
      // Opcional: Podrías forzar una recarga para que toda la app lea la nueva categoría,
      // aunque el contexto debería ser suficiente.
      // window.location.reload(); 
      
      // IMPORTANTE: Si cambiar de categoría implica cambiar de ROL,
      // deberías redirigir a "/select-profile"
      // router.push("/select-profile");
      // Por ahora, solo cambiamos el contexto.
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Tag className={`h-5 w-5 ${selectedCategory.color.replace('bg', 'text')}`} />
      <Select value={selectedCategory.id} onValueChange={handleCategoryChange}>
        <SelectTrigger className="w-[180px] bg-transparent border-none text-white text-lg font-semibold focus:ring-0">
          <SelectValue placeholder="Seleccionar categoría" />
        </SelectTrigger>
        <SelectContent className="bg-[#213041] border-[#305176] text-white">
          {allCategories.map((cat) => (
            <SelectItem key={cat.id} value={cat.id} className={`focus:text-black ${cat.color.replace('bg-', 'focus:bg-')}`}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
// --- FIN NUEVO COMPONENTE ---


export function DashboardHeader() {
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const { signOut } = useAuth()
  const { currentProfile } = useProfile() // Obtener el nombre del perfil
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    // Limpiar localStorage al cerrar sesión
    localStorage.removeItem("userProfile");
    localStorage.removeItem("selectedCategory");
    localStorage.removeItem("allUserCategories");
    localStorage.removeItem("allUserProfiles");
    router.push("/app") // Redirigir a la página de login
  }
  
  // Extraer iniciales del nombre del perfil
  const getInitials = (name: string | null) => {
    if (!name) return "4C"
    // Tomar el displayName "John Doe - DIRECTOR TECNICO (Primera)"
    // y extraer "JD"
    const parts = name.split(" - ")[0]?.split(" ");
    if (!parts) return "4C";
    const firstNameInitial = parts[0] ? parts[0][0] : "";
    const lastNameInitial = parts[1] ? parts[1][0] : "";
    return (firstNameInitial + lastNameInitial).toUpperCase() || "4C";
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-[#305176] bg-[#213041] px-4 md:px-6">
      
      {/* --- Lado Izquierdo: Switcher de Categoría y Menú Móvil --- */}
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
            <SidebarNav onLinkClick={() => setIsSheetOpen(false)} /> 
          </SheetContent>
        </Sheet>
        
        {/* --- Selector de Categoría (Visible en Desktop) --- */}
        <div className="hidden md:flex">
          <CategorySwitcher />
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
              {/* <AvatarImage src="/path-to-user-image.jpg" alt="@username" /> */}
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
            onClick={() => router.push('/select-category')} // Opción para cambiar todo
          >
            <UserIcon className="mr-2 h-4 w-4" />
            <span>Cambiar Perfil</span>
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