"use client"

import type React from "react"
import { useState, useEffect } from "react"
// import { motion, AnimatePresence } from "framer-motion" // <-- LÍNEA ELIMINADA (Error anterior)
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { Users, User, Plus } from "lucide-react"
import { toast } from "@/hooks/use-toast" // Importamos el toast para notificaciones

// Clave para guardar TODOS los perfiles creados por el usuario
const ALL_PROFILES_KEY = "allUserProfiles";
// Clave para guardar el perfil ACTIVO
const ACTIVE_PROFILE_KEY = "userProfile";

// Definición de tipo para un perfil
interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  profileType: string; // "DIRECTOR TECNICO", "PREPARADOR FISICO", etc.
  category: string; // "primera", "tercera", etc.
  displayName: string;
}

// Opciones de formulario
const profileTypes = ["DIRECTOR TECNICO", "PREPARADOR FISICO", "KINESIOLOGO", "DIRECTIVO", "EXTRA", "NUTRICIONISTA"];
const categories = [
  { id: "primera", name: "Primera División" },
  { id: "tercera", name: "Tercera División" },
  { id: "cuarta", name: "Cuarta División" },
  { id: "quinta", name: "Quinta División" },
  { id: "sexta", name: "Sexta División" },
  { id: "septima", name: "Séptima División" },
  { id: "juveniles", name: "Juveniles" },
  { id: "infantiles", name: "Infantiles" },
];

export default function ProfileHubPage() {
  const router = useRouter()
  const [existingProfiles, setExistingProfiles] = useState<UserProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Estado para el formulario de creación de nuevo perfil
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    profileType: "",
    category: "",
  })

  // Cargar perfiles existentes desde localStorage al montar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedProfiles = localStorage.getItem(ALL_PROFILES_KEY);
      if (savedProfiles) {
        setExistingProfiles(JSON.parse(savedProfiles));
      }
      setIsLoading(false);
    }
  }, []);

  // Función para seleccionar un perfil y entrar al dashboard
  const handleSelectProfile = (profile: UserProfile) => {
    // Setea el perfil ACTIVO
    localStorage.setItem(ACTIVE_PROFILE_KEY, JSON.stringify(profile));
    router.push("/dashboard");
  };

  // Función para crear un nuevo perfil
  const handleSubmitNewProfile = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.firstName || !formData.lastName || !formData.profileType || !formData.category) {
      toast({
        title: "Campos incompletos",
        description: "Por favor, completa todos los campos para crear el perfil.",
        variant: "destructive", // Usamos 'destructive' para errores
      });
      return
    }

    // Crear el nuevo perfil
    const categoryName = categories.find(c => c.id === formData.category)?.name || formData.category;
    const newProfile: UserProfile = {
      id: Date.now(),
      firstName: formData.firstName,
      lastName: formData.lastName,
      profileType: formData.profileType,
      category: formData.category,
      displayName: `${formData.firstName} ${formData.lastName} - ${formData.profileType} (${categoryName})`,
    };

    // Actualizar la lista de perfiles
    const updatedProfiles = [...existingProfiles, newProfile];
    setExistingProfiles(updatedProfiles);
    localStorage.setItem(ALL_PROFILES_KEY, JSON.stringify(updatedProfiles));

    // Notificar al usuario
    toast({
      title: "Perfil Creado",
      description: `¡Perfil "${newProfile.displayName}" creado! Ahora puedes seleccionarlo.`,
    });

    // Limpiar el formulario
    setFormData({
      firstName: "",
      lastName: "",
      profileType: "",
      category: "",
    });
  };
  
  // Helper para obtener el nombre legible de la categoría
  const getCategoryName = (categoryId: string) => {
      return categories.find(c => c.id === categoryId)?.name || categoryId;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1d2834] flex items-center justify-center">
        <div className="text-white">Cargando perfiles...</div>
      </div>
    );
  }

  return (
    // LÍNEA 114 CORREGIDA: bg-[#1d2834] (con el número 1)
    <div className="min-h-screen bg-[#1d2834] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        
        <div className="flex justify-center mb-6">
            <img
              src="/images/cuatro-cero-logo.png"
              alt="CUATRO CERO - Gestión de Equipo"
              className="h-[3.14rem] md:h-[4.19rem] w-auto"
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* COLUMNA 1: PERFILES EXISTENTES */}
          <Card className="bg-[#213041] border-[#305176]">
            <CardHeader className="text-center">
              <CardTitle className="text-white text-lg md:text-xl flex items-center justify-center">
                <Users className="h-5 w-5 mr-2 text-[#aff606]" />
                Seleccionar Perfil de Trabajo
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 md:px-6">
              {existingProfiles.length > 0 ? (
                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
                  {existingProfiles.map((profile) => (
                    <Button
                      key={profile.id}
                      variant="outline"
                      className="w-full justify-start h-14 text-left border-[#305176] text-white hover:bg-[#305176] hover:text-[#aff606] transition-all duration-200 bg-transparent flex items-center space-x-3"
                      onClick={() => handleSelectProfile(profile)}
                    >
                      <User className="h-5 w-5 text-[#aff606] flex-shrink-0" />
                      <div className="flex flex-col items-start">
                        {/* NOMBRE APELLIDO */}
                        <span className="font-bold">{profile.firstName} {profile.lastName}</span>
                        {/* FUNCION - CATEGORIA */}
                        <span className="text-xs text-gray-400">{profile.profileType} - {getCategoryName(profile.category)}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-10">
                  Aún no has creado ningún perfil. Utiliza el formulario para crear el primero.
                </p>
              )}
            </CardContent>
          </Card>

          {/* COLUMNA 2: CREAR NUEVO PERFIL (CUMPLE REQ DE "ELEGIR OTRA CATEGORÍA") */}
          <Card className="bg-[#213041] border-[#305176]">
            <CardHeader className="text-center">
              <CardTitle className="text-white text-lg md:text-xl flex items-center justify-center">
                <Plus className="h-5 w-5 mr-2 text-[#33d9f6]" />
                Crear Nuevo Perfil
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 md:px-6">
              <form onSubmit={handleSubmitNewProfile} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-white text-sm">
                      Nombre
                    </Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="Tu nombre"
                      className="bg-[#1d2834] border-[#305176] text-white h-11"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-white text-sm">
                      Apellido
                    </Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="Tu apellido"
                      className="bg-[#1d2834] border-[#305176] text-white h-11"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-white text-sm">Función</Label>
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

                <div className="space-y-2">
                  <Label className="text-white text-sm">Categoría de trabajo</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger className="bg-[#1d2834] border-[#305176] text-white h-11">
                      <SelectValue placeholder="Selecciona la categoría" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#213041] border-[#305176]">
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id} className="text-white">
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#33d9f6] text-black hover:bg-[#2bc4ea] h-11 mt-6"
                >
                  {isLoading ? "Creando..." : "Crear Perfil"}
                </Button>
              </form>
            </CardContent>
          </Card>
          
        </div>
      </div>
    </div>
  )
}