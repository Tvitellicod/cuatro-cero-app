"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Plus, User, ArrowLeft } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useProfile } from "@/hooks/use-profile" // Importamos el hook

// Definición de tipo para Categoría
interface UserCategory {
  id: string; 
  name: string;
  color: string;
}

// Definición de tipo para un perfil
interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  profileType: string; // "DIRECTOR TECNICO", "PREPARADOR FISICO", etc.
  category: string; // ID de la categoría (ej: "cat_123456")
  displayName: string;
}

// Opciones de roles
const profileTypes = ["DIRECTOR TECNICO", "PREPARADOR FISICO", "KINESIOLOGO", "DIRECTIVO", "EXTRA", "NUTRICIONISTA"];

// Claves de LocalStorage
const ALL_CATEGORIES_KEY = "allUserCategories";
const SELECTED_CATEGORY_KEY = "selectedCategory";
const ALL_PROFILES_KEY = "allUserProfiles";
const ACTIVE_PROFILE_KEY = "userProfile"; // Perfil activo final

export default function SelectProfilePage() {
  const router = useRouter()
  const { setCurrentProfile } = useProfile() // Hook para la redirección final
  const [selectedCategory, setSelectedCategory] = useState<UserCategory | null>(null)
  const [allProfiles, setAllProfiles] = useState<UserProfile[]>([])
  const [profilesForCategory, setProfilesForCategory] = useState<UserProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Estado del modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    profileType: "",
  })

  // Cargar categoría seleccionada y perfiles
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCategory = localStorage.getItem(SELECTED_CATEGORY_KEY);
      if (!savedCategory) {
        // Si no hay categoría, no debería estar aquí. Vuelve atrás.
        router.push("/select-category");
        return;
      }
      const category: UserCategory = JSON.parse(savedCategory);
      setSelectedCategory(category);

      const savedProfiles = localStorage.getItem(ALL_PROFILES_KEY);
      const allProfilesList: UserProfile[] = savedProfiles ? JSON.parse(savedProfiles) : [];
      setAllProfiles(allProfilesList);

      // Filtrar perfiles para esta categoría
      const filteredProfiles = allProfilesList.filter(p => p.category === category.id);
      setProfilesForCategory(filteredProfiles);
      
      setIsLoading(false);
    }
  }, [router]);

  // Crear nuevo perfil
  const handleCreateProfile = () => {
    if (!formData.firstName || !formData.lastName || !formData.profileType || !selectedCategory) {
      toast({
        title: "Campos incompletos",
        description: "Completa todos los campos para crear el perfil.",
        variant: "destructive",
      });
      return;
    }

    const newProfile: UserProfile = {
      id: Date.now(),
      firstName: formData.firstName,
      lastName: formData.lastName,
      profileType: formData.profileType,
      category: selectedCategory.id, // Asignar la categoría actual
      displayName: `${formData.firstName} ${formData.lastName} - ${formData.profileType} (${selectedCategory.name})`,
    };

    const updatedAllProfiles = [...allProfiles, newProfile];
    setAllProfiles(updatedAllProfiles);
    setProfilesForCategory([...profilesForCategory, newProfile]); // Añadir al state local
    localStorage.setItem(ALL_PROFILES_KEY, JSON.stringify(updatedAllProfiles));

    toast({
      title: "Perfil Creado",
      description: `¡Perfil "${newProfile.displayName}" creado!`,
    });

    setFormData({ firstName: "", lastName: "", profileType: "" });
    setIsModalOpen(false);
  };

  // Selección final del perfil
  const handleSelectProfile = (profile: UserProfile) => {
    // 1. Guardar como perfil activo
    localStorage.setItem(ACTIVE_PROFILE_KEY, JSON.stringify(profile));
    // 2. Actualizar el contexto (¡LA CLAVE PARA QUE NO SE CUELGUE!)
    setCurrentProfile(profile.displayName);
    // 3. Ir al Dashboard
    router.push("/dashboard");
  };

  if (isLoading || !selectedCategory) {
    return (
      <div className="min-h-screen bg-[#1d2834] flex items-center justify-center">
        <div className="text-white">Cargando perfiles...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1d2834] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl relative">
        <Button
          variant="ghost" 
          className="absolute -top-12 left-0 text-white hover:text-[#aff606]"
          onClick={() => router.push("/select-category")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Categorías
        </Button>
        
        <Card className="w-full bg-[#213041] border-[#305176]">
          <CardHeader className="text-center">
            {/* --- CORRECCIÓN AQUÍ --- */}
            <CardTitle className="text-white text-xl">
              Selecciona tu Perfil para: <span className="text-[#aff606] font-semibold">{selectedCategory.name}</span>
            </CardTitle>
            {/* --- FIN CORRECCIÓN --- */}
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {profilesForCategory.map((profile) => (
                <button
                  key={profile.id}
                  className="aspect-square rounded-lg flex flex-col items-center justify-center text-white p-4 transition-all duration-200 hover:scale-105 border border-[#305176] hover:bg-[#305176] hover:border-[#aff606]"
                  onClick={() => handleSelectProfile(profile)}
                >
                  <User className="h-8 w-8 mb-2 text-[#aff606]" />
                  <span className="font-bold text-center">{profile.firstName} {profile.lastName}</span>
                  <span className="text-xs text-gray-400 text-center">{profile.profileType}</span>
                </button>
              ))}

              {/* Botón de Crear Perfil */}
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <button className="aspect-square rounded-lg flex flex-col items-center justify-center text-[#33d9f6] font-bold text-lg p-4 transition-all duration-200 hover:scale-105 border-2 border-dashed border-[#33d9f6] hover:bg-[#33d9f6] hover:text-black">
                    <Plus className="h-8 w-8 mb-2" />
                    Crear Perfil
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-[#213041] border-[#305176] text-white">
                  <DialogHeader>
                    <DialogTitle className="text-white">Crear Nuevo Perfil para {selectedCategory.name}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-white">Nombre</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          placeholder="Tu nombre"
                          className="bg-[#1d2834] border-[#305176] text-white h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-white">Apellido</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          placeholder="Tu apellido"
                          className="bg-[#1d2834] border-[#305176] text-white h-11"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Función (Rol)</Label>
                      <Select
                        value={formData.profileType}
                        onValueChange={(value) => setFormData({ ...formData, profileType: value })}
                      >
                        <SelectTrigger className="bg-[#1d2834] border-[#305176] text-white h-11">
                          <SelectValue placeholder="Selecciona tu función" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#213041] border-[#305176]">
                          {profileTypes.map((type) => (
                            <SelectItem key={type} value={type} className="text-white">
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="ghost"
                      onClick={() => setIsModalOpen(false)}
                      className="text-white hover:bg-[#305176]"
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleCreateProfile}
                      className="bg-[#33d9f6] text-black hover:bg-[#2bc4ea]"
                    >
                      Guardar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}