// components/dashboard/profile-settings-form.tsx

"use client"

import * as React from "react"
import { useProfile } from "@/hooks/use-profile"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Trash2 } from "lucide-react" 
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

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
  const [isSaving, setIsSaving] = React.useState(false) 
  const [isDeleting, setIsDeleting] = React.useState(false)

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
    
    setIsSaving(true);

    const updatedProfile: UserProfile = {
      ...localProfile,
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      displayName: `${formData.firstName.trim()} ${formData.lastName.trim()} - ${localProfile.profileType} (${localProfile.category})`,
    };

    const savedProfilesJson = localStorage.getItem("allUserProfiles");
    const allProfiles: UserProfile[] = savedProfilesJson ? JSON.parse(savedProfilesJson) : [];
    
    const updatedAllProfiles = allProfiles.map(p => 
        p.id === updatedProfile.id ? updatedProfile : p
    );
    localStorage.setItem("allUserProfiles", JSON.stringify(updatedAllProfiles));

    localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
    setCurrentProfile(updatedProfile.displayName);
    setLocalProfile(updatedProfile);


    toast({
      title: "Perfil Actualizado",
      description: `Nombre cambiado a: ${updatedProfile.firstName} ${updatedProfile.lastName}`,
    });

    setIsSaving(false);
  }

  const handleDeleteProfile = () => {
    if (!localProfile) return;
    
    setIsDeleting(true);

    const savedProfilesJson = localStorage.getItem("allUserProfiles");
    const allProfiles: UserProfile[] = savedProfilesJson ? JSON.parse(savedProfilesJson) : [];

    const updatedAllProfiles = allProfiles.filter(p => 
        p.id !== localProfile.id
    );

    localStorage.setItem("allUserProfiles", JSON.stringify(updatedAllProfiles));
    
    setCurrentProfile(null);
    localStorage.removeItem("userProfile");
    
    toast({
        title: "Perfil Eliminado",
        description: `El perfil "${localProfile.firstName} ${localProfile.lastName}" ha sido eliminado.`,
        variant: "destructive"
    });

    setIsDeleting(false);

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
        disabled={isSaving}
        className="bg-[#aff606] hover:bg-[#99db05] text-black w-full"
      >
        {isSaving ? "Guardando..." : "Guardar Cambios"}
      </Button>

      <Separator className="bg-[#305176]" />

      <h3 className="text-lg font-semibold text-white">Eliminar Perfil</h3>
      <p className="text-sm text-gray-400">
        Eliminará este perfil de la lista de selección y cerrará tu sesión.
      </p>
      
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            variant="destructive" 
            disabled={isDeleting}
            className="w-full bg-red-600 hover:bg-red-700"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar este Perfil
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-[#213041] border-[#305176] text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-500 flex items-center">
                <Trash2 className="h-5 w-5 mr-2" />
                Confirmar Eliminación de Perfil
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              Esta acción es irreversible. Estás a punto de eliminar tu perfil 
              "{localProfile.displayName}". Deberás seleccionar un perfil nuevo 
              o crearlo la próxima vez que inicies sesión.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-white bg-[#3363f6] hover:bg-[#2a50c8] border-none"> {/* Color azul para Cancelar */}
                Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
                onClick={handleDeleteProfile} 
                className="bg-red-600 hover:bg-red-700 text-white"
                disabled={isDeleting}
            >
                {isDeleting ? "Eliminando..." : "Confirmar Eliminación"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
    </div>
  )
}