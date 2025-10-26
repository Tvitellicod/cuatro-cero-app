"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Users, User, Plus, Palette, ArrowLeft } from "lucide-react";
import { toast } from "@/components/ui/use-toast"; // Asegúrate que la ruta sea correcta

// --- Claves de LocalStorage ---
const CATEGORIES_KEY = "userCategories"; // Guarda las categorías creadas
const NAMED_PROFILES_KEY = "userNamedProfiles"; // Guarda los perfiles con nombre/apellido/rol por categoría
const ACTIVE_PROFILE_KEY = "userProfile"; // Guarda el perfil activo (combinación de categoría y perfil)

// --- Tipos ---
interface Category {
  id: string;
  name: string;
  color: string;
}

interface NamedProfile {
  id: number;
  categoryId: string; // Vincula el perfil a una categoría
  firstName: string;
  lastName: string;
  role: string; // El tipo de perfil (DT, PF, etc.)
  displayName: string; // Nombre completo + Rol
}

// Perfil activo que se guarda para el dashboard
interface ActiveProfile extends NamedProfile {
  categoryName: string;
  categoryColor: string;
}

// --- Opciones ---
const profileRoles = ["DIRECTOR TECNICO", "PREPARADOR FISICO", "KINESIOLOGO", "DIRECTIVO", "EXTRA", "NUTRICIONISTA"];
const availableColors = [
    "#aff606", "#33d9f6", "#f4c11a", "#ea3498", "#25d03f",
    "#8a46c5", "#ff6b35", "#4ecdc4", "#45b7d1", "#96ceb4",
    "#609966", "#c37a6b", "#77c4e4", "#f1a85f", "#d64b5e",
    "#6d89ff", "#ff8a65", "#b478d1", "#e69138", "#4e7c8e",
    "#a1c5d9", "#f5d76e", "#e8787c", "#c9d99d", "#7c7c7c"
];

// --- Componente Principal ---
export default function CreateProfilePage() {
  const router = useRouter();
  const [step, setStep] = useState<'category' | 'profile'>('category');
  const [categories, setCategories] = useState<Category[]>([]);
  const [namedProfiles, setNamedProfiles] = useState<NamedProfile[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Estados para los modales
  const [showNewCategoryModal, setShowNewCategoryModal] = useState(false);
  const [newCategoryData, setNewCategoryData] = useState({ name: "", color: availableColors[0] });
  const [showNewProfileModal, setShowNewProfileModal] = useState(false);
  const [newProfileData, setNewProfileData] = useState({ firstName: "", lastName: "", role: "" });

  // Cargar datos de localStorage al inicio
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCategories = localStorage.getItem(CATEGORIES_KEY);
      const savedNamedProfiles = localStorage.getItem(NAMED_PROFILES_KEY);
      if (savedCategories) {
        setCategories(JSON.parse(savedCategories));
      }
      if (savedNamedProfiles) {
        setNamedProfiles(JSON.parse(savedNamedProfiles));
      }
      setIsLoading(false);
    }
  }, []);

  // --- Manejadores ---
  const handleSelectCategory = (category: Category) => {
    setSelectedCategory(category);
    setStep('profile');
  };

  const handleSaveCategory = () => {
    if (!newCategoryData.name.trim()) {
      toast({ title: "Error", description: "El nombre de la categoría no puede estar vacío.", variant: "destructive" });
      return;
    }
    const newCategory: Category = {
      id: newCategoryData.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(), // ID único simple
      name: newCategoryData.name.trim(),
      color: newCategoryData.color,
    };
    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(updatedCategories));
    setShowNewCategoryModal(false);
    setNewCategoryData({ name: "", color: availableColors.find(c => !updatedCategories.some(uc => uc.color === c)) || availableColors[0] }); // Reset y elige nuevo color disponible
    handleSelectCategory(newCategory); // Selecciona la categoría recién creada
  };

  const handleSaveProfile = () => {
    if (!newProfileData.firstName.trim() || !newProfileData.lastName.trim() || !newProfileData.role || !selectedCategory) {
      toast({ title: "Error", description: "Completa Nombre, Apellido y Rol.", variant: "destructive" });
      return;
    }
    const newNamedProfile: NamedProfile = {
      id: Date.now(),
      categoryId: selectedCategory.id,
      firstName: newProfileData.firstName.trim(),
      lastName: newProfileData.lastName.trim(),
      role: newProfileData.role,
      displayName: `${newProfileData.firstName.trim()} ${newProfileData.lastName.trim()} - ${newProfileData.role}`,
    };
    const updatedNamedProfiles = [...namedProfiles, newNamedProfile];
    setNamedProfiles(updatedNamedProfiles);
    localStorage.setItem(NAMED_PROFILES_KEY, JSON.stringify(updatedNamedProfiles));
    setShowNewProfileModal(false);
    setNewProfileData({ firstName: "", lastName: "", role: "" });
    // Opcional: seleccionar automáticamente el perfil recién creado
    // handleSelectProfile(newNamedProfile);
  };

  const handleSelectProfileAndContinue = (profile: NamedProfile) => {
    if (!selectedCategory) return; // Seguridad extra
    const activeProfileData: ActiveProfile = {
      ...profile,
      categoryName: selectedCategory.name,
      categoryColor: selectedCategory.color,
      category: selectedCategory.id // Mantenemos 'category' como el ID para consistencia interna si se usa en otros lados
    };
    localStorage.setItem(ACTIVE_PROFILE_KEY, JSON.stringify(activeProfileData));
    router.push("/dashboard");
  };

  const filteredNamedProfiles = namedProfiles.filter(p => p.categoryId === selectedCategory?.id);
  const usedColors = categories.map(c => c.color);
  const nextAvailableColor = availableColors.find(c => !usedColors.includes(c)) || availableColors[0];

  // --- Renderizado ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1d2834] flex items-center justify-center">
        <div className="text-white">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1d2834] flex items-center justify-center p-4">
      <Card className="w-full max-w-lg mx-auto bg-[#213041] border-[#305176]">
        <CardHeader className="text-center">
           <img
              src="/images/cuatro-cero-logo.png"
              alt="CUATRO CERO"
              className="h-12 w-auto mx-auto mb-4"
            />
          <CardTitle className="text-white text-xl md:text-2xl">
            {step === 'category' ? 'Selecciona o Crea una Categoría' : `Perfiles en ${selectedCategory?.name}`}
          </CardTitle>
          {step === 'profile' && (
             <Button variant="ghost" size="sm" onClick={() => setStep('category')} className="absolute top-4 left-4 text-gray-400 hover:text-white">
                <ArrowLeft className="h-4 w-4 mr-1" /> Volver
             </Button>
          )}
        </CardHeader>
        <CardContent className="px-4 md:px-6">

          {/* PASO 1: SELECCIÓN DE CATEGORÍA */}
          {step === 'category' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <Card
                  key={cat.id}
                  className="bg-[#1d2834] border-[#305176] hover:ring-2 cursor-pointer transition-all aspect-square flex flex-col items-center justify-center text-center p-2"
                  style={{ '--ring-color': cat.color } as React.CSSProperties}
                  onClick={() => handleSelectCategory(cat)}
                >
                  <div className="w-8 h-8 rounded-full mb-2" style={{ backgroundColor: cat.color }}></div>
                  <p className="text-white font-medium text-sm break-words">{cat.name}</p>
                </Card>
              ))}
              <Card
                className="bg-[#1d2834] border-[#305176] hover:ring-2 ring-[#aff606] cursor-pointer transition-all aspect-square flex flex-col items-center justify-center text-center p-2 border-dashed"
                onClick={() => {
                    setNewCategoryData({ name: "", color: nextAvailableColor }); // Pre-selecciona color disponible
                    setShowNewCategoryModal(true);
                }}
              >
                <Plus className="h-8 w-8 text-[#aff606] mb-2" />
                <p className="text-[#aff606] font-medium text-sm">Crear Categoría</p>
              </Card>
            </div>
          )}

          {/* PASO 2: SELECCIÓN DE PERFIL */}
          {step === 'profile' && selectedCategory && (
            <div className="space-y-4">
               <p className="text-gray-400 text-sm text-center">Selecciona un perfil existente o crea uno nuevo para la categoría "{selectedCategory.name}".</p>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2">
                 {filteredNamedProfiles.map((profile) => (
                    <Button
                      key={profile.id}
                      variant="outline"
                      className="w-full justify-start h-14 text-left border-[#305176] text-white hover:bg-[#305176] hover:text-[#aff606] transition-all duration-200 bg-transparent flex items-center space-x-3"
                      onClick={() => handleSelectProfileAndContinue(profile)}
                    >
                      <User className="h-5 w-5 text-gray-400 flex-shrink-0" />
                      <div className="flex flex-col items-start">
                        <span className="font-bold">{profile.firstName} {profile.lastName}</span>
                        <span className="text-xs text-gray-400">{profile.role}</span>
                      </div>
                    </Button>
                 ))}
                  <Button
                      variant="outline"
                      className="w-full justify-center h-14 text-center border-[#305176] text-[#33d9f6] hover:bg-[#305176] hover:text-[#33d9f6] transition-all duration-200 bg-transparent border-dashed flex flex-col items-center"
                      onClick={() => setShowNewProfileModal(true)}
                    >
                      <Plus className="h-5 w-5 mb-1" />
                      <span className="text-sm font-medium">Crear Nuevo Perfil</span>
                    </Button>
               </div>
            </div>
          )}

        </CardContent>
      </Card>

      {/* MODAL: Crear Nueva Categoría */}
      <Dialog open={showNewCategoryModal} onOpenChange={setShowNewCategoryModal}>
        <DialogContent className="sm:max-w-[425px] bg-[#213041] border-[#305176] text-white">
          <DialogHeader>
            <DialogTitle className="text-white text-xl">Crear Nueva Categoría</DialogTitle>
            <DialogDescription className="text-gray-400">
              Dale un nombre y elige un color para identificarla.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="category-name" className="text-white">Nombre de la Categoría</Label>
              <Input
                id="category-name"
                value={newCategoryData.name}
                onChange={(e) => setNewCategoryData({ ...newCategoryData, name: e.target.value })}
                placeholder="Ej: Reserva"
                className="bg-[#1d2834] border-[#305176] text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white flex items-center"><Palette className="h-4 w-4 mr-2"/>Color</Label>
              <div className="flex flex-wrap gap-2">
                {availableColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`w-6 h-6 rounded-full border-2 transition-all ${
                      newCategoryData.color === color ? "border-white ring-2 ring-white ring-offset-2 ring-offset-[#213041]" : "border-gray-500 hover:border-gray-300"
                    } ${usedColors.includes(color) && newCategoryData.color !== color ? 'opacity-30 cursor-not-allowed' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => {
                        if (!usedColors.includes(color)) {
                            setNewCategoryData({ ...newCategoryData, color: color });
                        }
                    }}
                    disabled={usedColors.includes(color) && newCategoryData.color !== color}
                    title={usedColors.includes(color) && newCategoryData.color !== color ? 'Color ya en uso' : ''}
                  />
                ))}
              </div>
               {availableColors.length === usedColors.length && (
                 <p className="text-xs text-yellow-400 mt-1">Todos los colores están en uso. Edita una categoría existente para liberar uno.</p>
               )}
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" className="border-red-500 text-red-500 hover:bg-red-500/10">Cancelar</Button>
            </DialogClose>
            <Button type="button" onClick={handleSaveCategory} className="bg-[#aff606] text-black hover:bg-[#25d03f]">Guardar Categoría</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL: Crear Nuevo Perfil */}
      <Dialog open={showNewProfileModal} onOpenChange={setShowNewProfileModal}>
        <DialogContent className="sm:max-w-[425px] bg-[#213041] border-[#305176] text-white">
          <DialogHeader>
            <DialogTitle className="text-white text-xl">Crear Nuevo Perfil en {selectedCategory?.name}</DialogTitle>
            <DialogDescription className="text-gray-400">
              Ingresa los datos de la persona y su función.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label htmlFor="profile-firstName" className="text-white">Nombre</Label>
                 <Input
                   id="profile-firstName"
                   value={newProfileData.firstName}
                   onChange={(e) => setNewProfileData({ ...newProfileData, firstName: e.target.value })}
                   placeholder="Nombre"
                   className="bg-[#1d2834] border-[#305176] text-white"
                   required
                 />
               </div>
               <div className="space-y-2">
                 <Label htmlFor="profile-lastName" className="text-white">Apellido</Label>
                 <Input
                   id="profile-lastName"
                   value={newProfileData.lastName}
                   onChange={(e) => setNewProfileData({ ...newProfileData, lastName: e.target.value })}
                   placeholder="Apellido"
                   className="bg-[#1d2834] border-[#305176] text-white"
                   required
                 />
               </div>
            </div>
             <div className="space-y-2">
               <Label htmlFor="profile-role" className="text-white">Función (Rol)</Label>
               <Select
                  value={newProfileData.role}
                  onValueChange={(value) => setNewProfileData({ ...newProfileData, role: value })}
               >
                 <SelectTrigger id="profile-role" className="bg-[#1d2834] border-[#305176] text-white">
                   <SelectValue placeholder="Selecciona la función" />
                 </SelectTrigger>
                 <SelectContent className="bg-[#213041] border-[#305176]">
                   {profileRoles.map((role) => (
                     <SelectItem key={role} value={role} className="text-white">
                       {role}
                     </SelectItem>
                   ))}
                 </SelectContent>
               </Select>
             </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" className="border-red-500 text-red-500 hover:bg-red-500/10">Cancelar</Button>
            </DialogClose>
            <Button type="button" onClick={handleSaveProfile} className="bg-[#aff606] text-black hover:bg-[#25d03f]">Guardar Perfil</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}