// components/dashboard/profile-settings-form.tsx

"use client"

import * as React from "react"
import { useProfile } from "@/hooks/use-profile"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

interface UserProfile {
    id: number;
    firstName: string;
    lastName: string;
    profileType: string;
    category: string;
    displayName: string;
}

export function ProfileSettingsForm() {
  const { currentProfile, setCurrentProfile } = useProfile()
  const { toast } = useToast()
  const [localProfile, setLocalProfile] = React.useState<UserProfile | null>(null)
  const [formData, setFormData] = React.useState({ firstName: "", lastName: "" })
  const [isLoading, setIsLoading] = React.useState(false)

  // Cargar perfil actual desde LocalStorage
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
        const savedProfileJson = localStorage.getItem("userProfile");
        if (savedProfileJson) {
            try {
                const profile: UserProfile = JSON.parse(savedProfileJson);
                setLocalProfile(profile);
                setFormData({ firstName: profile.firstName, lastName: profile.lastName });
            } catch (e) {
                console.error("Error parsing profile for settings", e);
            }
        }
    }
  }, [currentProfile])


  const handleSave = () => {
    if (!localProfile || !formData.firstName || !formData.lastName) {
      toast({ title: "Error", description: "Completa todos los campos.", variant: "destructive" });
      return;
    }
    
    setIsLoading(true);

    // 1. Crear el perfil actualizado
    const updatedProfile: UserProfile = {
      ...localProfile,
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      displayName: `${formData.firstName.trim()} ${formData.lastName.trim()} - ${localProfile.profileType} (${localProfile.category})`,
    };

    // 2. Obtener lista completa y actualizar
    const savedProfilesJson = localStorage.getItem("allUserProfiles");
    const allProfiles: UserProfile[] = savedProfilesJson ? JSON.parse(savedProfilesJson) : [];
    
    const updatedAllProfiles = allProfiles.map(p => 
        p.id === updatedProfile.id ? updatedProfile : p
    );
    localStorage.setItem("allUserProfiles", JSON.stringify(updatedAllProfiles));

    // 3. Actualizar LocalStorage y contexto de perfil activo
    localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
    setCurrentProfile(updatedProfile.displayName);
    setLocalProfile(updatedProfile);


    toast({
      title: "Perfil Actualizado",
      description: `Nombre cambiado a: ${updatedProfile.firstName} ${updatedProfile.lastName}`,
    });

    setIsLoading(false);
  }

  // Lógica de ELIMINACIÓN de Perfil
  const handleDeleteProfile = () => {
    if (!localProfile) return;

    if (!confirm(`¿Estás seguro de que quieres eliminar el perfil "${localProfile.displayName}"? Esta acción es irreversible.`)) {
        return;
    }
    
    setIsLoading(true);

    // 1. Obtener la lista completa de perfiles
    const savedProfilesJson = localStorage.getItem("allUserProfiles");
    const allProfiles: UserProfile[] = savedProfilesJson ? JSON.parse(savedProfilesJson) : [];

    // 2. Filtrar y eliminar el perfil actual
    const updatedAllProfiles = allProfiles.filter(p => 
        p.id !== localProfile.id
    );

    // 3. Actualizar LocalStorage con la lista sin el perfil eliminado
    localStorage.setItem("allUserProfiles", JSON.stringify(updatedAllProfiles));
    
    // 4. Limpiar sesión actual
    setCurrentProfile(null);
    localStorage.removeItem("userProfile");
    
    toast({
        title: "Perfil Eliminado",
        description: `El perfil "${localProfile.firstName} ${localProfile.lastName}" ha sido eliminado.`,
        variant: "destructive"
    });

    setIsLoading(false);

    // 5. Redirigir a la selección de perfil (requiere una nueva selección)
    window.location.href = "/select-profile"; 
  }


  if (!localProfile) {
    return <p className="text-gray-400">Cargando datos del perfil...</p>
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">Editar Perfil Actual</h3>
      <p className="text-sm text-gray-400">
        Modifica tu nombre y apellido. El rol ({localProfile.profileType}) y la categoría activa ({localProfile.category}) no se pueden cambiar aquí.
      </p>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-white">Nombre</Label>
          <Input 
            id="firstName"
            value={formData.firstName} 
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            className="bg-[#1d2834] border-[#305176] text-white"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-white">Apellido</Label>
          <Input 
            id="lastName"
            value={formData.lastName} 
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            className="bg-[#1d2834] border-[#305176] text-white"
          />
        </div>
      </div>
      
      <Button 
        onClick={handleSave} 
        disabled={isLoading}
        className="bg-[#aff606] hover:bg-[#99db05] text-black w-full"
      >
        {isLoading ? "Guardando..." : "Guardar Cambios"}
      </Button>

      <Separator className="bg-[#305176]" />

      <h3 className="text-lg font-semibold text-white">Eliminar Perfil</h3>
      <p className="text-sm text-gray-400">
        Eliminará este perfil de la lista de selección.
      </p>
      <Button 
        onClick={handleDeleteProfile} 
        variant="destructive" 
        disabled={isLoading}
        className="w-full bg-red-600 hover:bg-red-700"
      >
        Eliminar este Perfil
      </Button>
    </div>
  )
}