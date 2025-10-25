"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select" // Necesario para el formulario
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Users, User, Plus, Building, Activity, Apple, Stethoscope, UserPlus, ArrowLeft } from "lucide-react" // Añadido ArrowLeft
import { toast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"

// Claves de LocalStorage
const ACTIVE_PROFILE_KEY = "userProfile"; // Perfil de contexto activo (Rol + Categoría)
const ALL_PROFILES_KEY = "allUserProfiles"; // Lista de TODOS los perfiles creados (Nombre, Apellido, Rol, Categorías)
const ALL_CATEGORIES_KEY = "appManagedCategories"; // Categorías creadas por el usuario

// --- Tipos ---
interface Category {
  id: string;
  name: string;
}

interface Role {
    id: string; // Ej: DIRECTOR TECNICO
    name: string; // Ej: Director Técnico
    icon: React.ElementType;
    color: string;
}

// Perfil de Usuario Completo (el que se guarda en ALL_PROFILES_KEY)
interface UserProfile {
  id: number; // Identificador único del perfil creado
  firstName: string;
  lastName: string;
  profileType: string; // El ID del rol (Ej: DIRECTOR TECNICO)
  categories: string[]; // IDs de las categorías asociadas
  displayName: string; // Nombre legible (combinado)
}

// Perfil de Contexto Activo (el que se guarda en ACTIVE_PROFILE_KEY)
interface ActiveContextProfile {
    userProfileId: number; // ID del UserProfile asociado
    role: string; // ID del Rol
    category: string; // ID de la Categoría seleccionada para trabajar
    displayName: string; // Nombre legible del contexto (Ej: "Juan Pérez - DT (Primera)")
    // Incluir datos básicos del UserProfile para mostrar en el header del dashboard
    firstName: string;
    lastName: string;
    profileTypeName: string; // Nombre legible del rol
    categoryName: string; // Nombre legible de la categoría
}
// -----------

// --- Datos Iniciales ---
const initialCategories: Category[] = [
  { id: "primera", name: "Primera División" },
  { id: "tercera", name: "Tercera División" },
  { id: "cuarta", name: "Cuarta División" },
  { id: "quinta", name: "Quinta División" },
  { id: "sexta", name: "Sexta División" },
  { id: "septima", name: "Séptima División" },
  { id: "juveniles", name: "Juveniles" },
  { id: "infantiles", name: "Infantiles" },
];

const availableRoles: Role[] = [
    { id: "DIRECTOR TECNICO", name: "Director Técnico", icon: User, color: "bg-[#aff606]" },
    { id: "PREPARADOR FISICO", name: "Preparador Físico", icon: Activity, color: "bg-[#f4c11a]" },
    { id: "KINESIOLOGO", name: "Kinesiólogo", icon: Stethoscope, color: "bg-[#33d9f6]" },
    { id: "NUTRICIONISTA", name: "Nutricionista", icon: Apple, color: "bg-[#ea3498]" },
    { id: "DIRECTIVO", name: "Directivo", icon: Building, color: "bg-[#8a46c5]" },
    { id: "EXTRA", name: "Extra", icon: Users, color: "bg-gray-500" }, // Mantenemos Extra por si acaso
];
// -----------------------

export default function SelectWorkingContextPage() {
  const router = useRouter();
  const [step, setStep] = useState<'category' | 'role' | 'create_profile'>('category');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [managedCategories, setManagedCategories] = useState<Category[]>(initialCategories);
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]); // Para guardar/cargar perfiles creados
  const [filteredRolesToShow, setFilteredRolesToShow] = useState<UserProfile[]>([]); // Perfiles existentes para la categoría seleccionada
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateCategoryModalOpen, setIsCreateCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  // Estado para el formulario de nuevo perfil
  const [newProfileData, setNewProfileData] = useState({
    firstName: "",
    lastName: "",
    profileType: "", // Guardará el ID del rol seleccionado
  });

  // Cargar datos al inicio
  useEffect(() => {
    if (typeof window !== 'undefined') {
        // 1. Verificar si ya existe un contexto activo y redirigir
        const activeContext = localStorage.getItem(ACTIVE_PROFILE_KEY);
        if (activeContext) {
            router.replace('/dashboard');
            return;
        }

        // 2. Cargar categorías personalizadas
        const savedCategories = localStorage.getItem(ALL_CATEGORIES_KEY);
        let currentCategories = [...initialCategories]; // Empezar con las iniciales
        if (savedCategories) {
            try {
                const parsedCategories: Category[] = JSON.parse(savedCategories);
                parsedCategories.forEach(savedCat => {
                    if (!currentCategories.some(initCat => initCat.id === savedCat.id)) {
                        currentCategories.push(savedCat);
                    }
                });
            } catch (e) { console.error("Error parsing saved categories:", e); }
        }
        setManagedCategories(currentCategories);

        // 3. Cargar perfiles de usuario existentes
        const savedUserProfiles = localStorage.getItem(ALL_PROFILES_KEY);
        if (savedUserProfiles) {
            try {
                setUserProfiles(JSON.parse(savedUserProfiles));
            } catch (e) { console.error("Error parsing user profiles:", e); }
        }

        setIsLoading(false); // Termina la carga
    }
  }, [router]);

  // Filtrar roles/perfiles a mostrar cuando se selecciona una categoría
  useEffect(() => {
      if (step === 'role' && selectedCategory) {
          const profilesInCategory = userProfiles.filter(p =>
              Array.isArray(p.categories) && p.categories.includes(selectedCategory.id)
          );
          setFilteredRolesToShow(profilesInCategory);
      } else {
          setFilteredRolesToShow([]); // Limpiar si no estamos en el paso de roles
      }
  }, [step, selectedCategory, userProfiles]);


  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setStep('role');
  };

  // Seleccionar un PERFIL EXISTENTE para trabajar en la categoría seleccionada
  const handleExistingProfileSelect = (profile: UserProfile) => {
    if (!selectedCategory) return; // Seguridad

    const roleInfo = availableRoles.find(r => r.id === profile.profileType);
    const categoryName = selectedCategory.name;
    const roleName = roleInfo?.name || profile.profileType;

    const activeContext: ActiveContextProfile = {
        userProfileId: profile.id,
        role: profile.profileType,
        category: selectedCategory.id,
        displayName: `${profile.firstName} ${profile.lastName} - ${roleName} (${categoryName})`,
        // Pasar datos básicos para el header
        firstName: profile.firstName,
        lastName: profile.lastName,
        profileTypeName: roleName,
        categoryName: categoryName,
    };

    localStorage.setItem(ACTIVE_PROFILE_KEY, JSON.stringify(activeContext));
    router.push('/dashboard');
  };

  // Iniciar la creación de un NUEVO perfil
  const handleStartCreateProfile = () => {
      setNewProfileData({ firstName: "", lastName: "", profileType: "" }); // Resetear form
      setStep('create_profile');
  }

  // Guardar el NUEVO perfil creado
  const handleSaveNewProfile = () => {
      // Validación
      if (!newProfileData.firstName.trim() || !newProfileData.lastName.trim() || !newProfileData.profileType || !selectedCategory) {
          toast({ title: "Error", description: "Completa Nombre, Apellido y Función.", variant: "destructive" });
          return;
      }

      const roleInfo = availableRoles.find(r => r.id === newProfileData.profileType);
      const roleName = roleInfo?.name || newProfileData.profileType;
      const categoryName = selectedCategory.name;

      // Crear el nuevo UserProfile completo
      const newUserProfile: UserProfile = {
          id: Date.now(), // ID único simple
          firstName: newProfileData.firstName.trim(),
          lastName: newProfileData.lastName.trim(),
          profileType: newProfileData.profileType,
          categories: [selectedCategory.id], // Asociado a la categoría actual
          displayName: `${newProfileData.firstName.trim()} ${newProfileData.lastName.trim()} - ${roleName} (${categoryName})`, // Display inicial
      };

      // Guardar en la lista de perfiles
      const updatedUserProfiles = [...userProfiles, newUserProfile];
      setUserProfiles(updatedUserProfiles);
      localStorage.setItem(ALL_PROFILES_KEY, JSON.stringify(updatedUserProfiles));

       // Crear el ActiveContextProfile para este nuevo perfil y categoría
      const activeContext: ActiveContextProfile = {
          userProfileId: newUserProfile.id,
          role: newUserProfile.profileType,
          category: selectedCategory.id,
          displayName: newUserProfile.displayName,
          firstName: newUserProfile.firstName,
          lastName: newUserProfile.lastName,
          profileTypeName: roleName,
          categoryName: categoryName,
      };

      // Establecer como activo y redirigir
      localStorage.setItem(ACTIVE_PROFILE_KEY, JSON.stringify(activeContext));
      toast({ title: "Perfil Creado", description: `Nuevo perfil "${newUserProfile.displayName}" creado y seleccionado.` });
      router.push('/dashboard');
  }

  const handleCreateCategory = () => {
    // ... (lógica sin cambios) ...
        if (!newCategoryName.trim()) {
      toast({ title: "Error", description: "El nombre de la categoría no puede estar vacío.", variant: "destructive" });
      return;
    }
    const newCategoryId = newCategoryName.trim().toLowerCase().replace(/\s+/g, '-');

    if (managedCategories.some(cat => cat.id === newCategoryId || cat.name.toLowerCase() === newCategoryName.trim().toLowerCase())) {
         toast({ title: "Error", description: "Ya existe una categoría con ese nombre o ID.", variant: "destructive" });
        return;
    }

    const newCategory: Category = { id: newCategoryId, name: newCategoryName.trim() };
    const updatedCategories = [...managedCategories, newCategory];

    setManagedCategories(updatedCategories);
    localStorage.setItem(ALL_CATEGORIES_KEY, JSON.stringify(updatedCategories));

    setNewCategoryName("");
    setIsCreateCategoryModalOpen(false);
    toast({ title: "Éxito", description: `Categoría "${newCategory.name}" creada.` });
  };

  const handleBack = () => {
      if(step === 'create_profile') {
          setStep('role'); // Vuelve a la selección de rol
      } else if (step === 'role') {
          setSelectedCategory(null);
          setStep('category'); // Vuelve a la selección de categoría
      }
  }

  if (isLoading) {
     return (
      <div className="min-h-screen bg-[#1d2834] flex items-center justify-center">
        <div className="text-white">Cargando contexto...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1d2834] flex flex-col items-center justify-center p-4">
        <div className="flex justify-center mb-8">
            <img
              src="/images/cuatro-cero-logo.png"
              alt="CUATRO CERO - Gestión de Equipo"
              className="h-[3.14rem] md:h-[4.19rem] w-auto"
            />
        </div>

        <Card className="w-full max-w-3xl bg-[#213041] border-[#305176]">
            <CardHeader className="text-center relative pt-6 pb-4">
                {/* Botón Volver (visible en pasos 'role' y 'create_profile') */}
                {step !== 'category' && (
                     <Button variant="link" onClick={handleBack} className="text-[#aff606] absolute top-5 left-4 p-0 h-auto text-sm z-10">
                        <ArrowLeft className="h-4 w-4 mr-1"/> {step === 'create_profile' ? 'Volver a Roles' : 'Volver a Categorías'}
                    </Button>
                )}
                <CardTitle className={`text-white text-xl md:text-2xl ${step !== 'category' ? 'mt-6' : ''}`}>
                   {step === 'category' && 'Selecciona una Categoría para Trabajar'}
                   {step === 'role' && `Selecciona tu Perfil para ${selectedCategory?.name}`}
                   {step === 'create_profile' && `Crear Nuevo Perfil en ${selectedCategory?.name}`}
                </CardTitle>
            </CardHeader>

            <CardContent className="px-4 md:px-6 py-6">
                {/* Paso 1: Seleccionar Categoría */}
                {step === 'category' && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {managedCategories.map((category) => (
                            <Card
                                key={category.id}
                                className="bg-[#1d2834] border-[#305176] hover:border-[#aff606] hover:bg-[#305176]/50 transition-all cursor-pointer aspect-square flex flex-col items-center justify-center"
                                onClick={() => handleCategorySelect(category)}
                            >
                                <CardContent className="p-4 text-center">
                                    <Users className="h-8 w-8 text-[#aff606] mx-auto mb-3" />
                                    <p className="text-white font-medium text-sm">{category.name}</p>
                                </CardContent>
                            </Card>
                        ))}
                         <Card
                            className="bg-transparent border-dashed border-[#305176] hover:border-[#33d9f6] hover:bg-[#1d2834]/50 transition-all cursor-pointer aspect-square flex flex-col items-center justify-center"
                            onClick={() => setIsCreateCategoryModalOpen(true)}
                        >
                            <CardContent className="p-4 text-center">
                                <Plus className="h-8 w-8 text-[#33d9f6] mx-auto mb-3" />
                                <p className="text-[#33d9f6] font-medium text-sm">Crear Nueva</p>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Paso 2: Seleccionar Rol/Perfil Existente o Crear Nuevo */}
                {step === 'role' && selectedCategory && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
                        {/* Mapear perfiles existentes filtrados */}
                        {filteredRolesToShow.map((profile) => {
                             const roleInfo = availableRoles.find(r => r.id === profile.profileType);
                             const IconComponent = roleInfo?.icon || Users; // Fallback icon
                             const color = roleInfo?.color || "bg-gray-500";
                            return (
                                <Card
                                    key={profile.id}
                                    className="bg-[#1d2834] border-[#305176] hover:border-[#aff606] hover:bg-[#305176]/50 transition-all cursor-pointer aspect-square flex flex-col items-center justify-center"
                                    onClick={() => handleExistingProfileSelect(profile)}
                                >
                                    <CardContent className="p-4 text-center">
                                         <div className={`w-12 h-12 ${color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                                            <IconComponent className="h-6 w-6 text-black" />
                                        </div>
                                        <p className="text-white font-medium text-sm">{roleInfo?.name || profile.profileType}</p>
                                        <p className="text-gray-400 text-xs mt-1">{profile.firstName} {profile.lastName}</p>
                                    </CardContent>
                                </Card>
                            );
                        })}
                        {/* Tarjeta "Crear Nuevo Perfil" */}
                         <Card
                            className="bg-transparent border-dashed border-[#305176] hover:border-[#33d9f6] hover:bg-[#1d2834]/50 transition-all cursor-pointer aspect-square flex flex-col items-center justify-center"
                            onClick={handleStartCreateProfile}
                        >
                            <CardContent className="p-4 text-center">
                                <UserPlus className="h-8 w-8 text-[#33d9f6] mx-auto mb-3" />
                                <p className="text-[#33d9f6] font-medium text-sm">Crear Nuevo Perfil</p>
                            </CardContent>
                        </Card>
                    </div>
                )}

                 {/* Paso 3: Formulario Crear Nuevo Perfil */}
                {step === 'create_profile' && selectedCategory && (
                    <div className="max-w-md mx-auto space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label htmlFor="newFirstName" className="text-white text-xs">Nombre *</Label>
                                <Input
                                id="newFirstName"
                                value={newProfileData.firstName}
                                onChange={(e) => setNewProfileData({ ...newProfileData, firstName: e.target.value })}
                                placeholder="Nombre"
                                className="bg-[#1d2834] border-[#305176] text-white h-10"
                                required
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="newLastName" className="text-white text-xs">Apellido *</Label>
                                <Input
                                id="newLastName"
                                value={newProfileData.lastName}
                                onChange={(e) => setNewProfileData({ ...newProfileData, lastName: e.target.value })}
                                placeholder="Apellido"
                                className="bg-[#1d2834] border-[#305176] text-white h-10"
                                required
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="newProfileType" className="text-white text-xs">Función *</Label>
                            <Select
                                value={newProfileData.profileType}
                                onValueChange={(value) => setNewProfileData({ ...newProfileData, profileType: value })}
                            >
                                <SelectTrigger id="newProfileType" className="bg-[#1d2834] border-[#305176] text-white h-10">
                                <SelectValue placeholder="Selecciona la función" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#213041] border-[#305176]">
                                {availableRoles.map((role) => (
                                    <SelectItem key={role.id} value={role.id} className="text-white">
                                    {role.name}
                                    </SelectItem>
                                ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Separator className="bg-[#305176] my-4"/>
                        <div className="flex justify-end space-x-3">
                             <Button type="button" variant="outline" onClick={handleBack} className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white bg-transparent">
                                Cancelar
                            </Button>
                            <Button type="button" onClick={handleSaveNewProfile} className="bg-[#aff606] text-black hover:bg-[#25d03f]">
                                Guardar Perfil
                            </Button>
                        </div>
                    </div>
                )}

            </CardContent>
        </Card>

        {/* Modal para Crear Categoría (sin cambios) */}
        <Dialog open={isCreateCategoryModalOpen} onOpenChange={setIsCreateCategoryModalOpen}>
           <DialogContent className="sm:max-w-[425px] bg-[#213041] border-[#305176] text-white">
                <DialogHeader>
                    <DialogTitle className="text-white">Crear Nueva Categoría</DialogTitle>
                    <DialogDescription className="text-gray-400">
                      Ingresa el nombre para la nueva categoría de trabajo.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-2">
                    <Label htmlFor="new-category-name" className="text-white">
                    Nombre de la Categoría
                    </Label>
                    <Input
                    id="new-category-name"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Ej: Reserva"
                    className="bg-[#1d2834] border-[#305176] text-white"
                    />
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                         <Button type="button" variant="outline" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white bg-transparent">
                            Cancelar
                        </Button>
                    </DialogClose>
                    <Button type="button" onClick={handleCreateCategory} className="bg-[#aff606] text-black hover:bg-[#25d03f]">
                    Crear Categoría
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
  );
}