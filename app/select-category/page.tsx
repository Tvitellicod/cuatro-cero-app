"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react" // Added useMemo/useEffect
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Plus, Tag, ArrowLeft } from "lucide-react" 
import { toast } from "@/hooks/use-toast"
import { useProfile, Category as ContextCategory } from "@/hooks/use-profile" // <-- USO DEL HOOK

// Definición de tipo para Categoría (simplificado para usar el tipo del contexto)
type UserCategory = ContextCategory;

// Opciones de colores
const categoryColors = [
  "bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-red-500", 
  "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-cyan-500"
];

export default function SelectCategoryPage() {
  const router = useRouter()
  const { 
    club, 
    categories, 
    isLoading, // <-- USAR ESTE ESTADO DE CARGA GLOBAL
    usedCategoriesCount,
    limits,
    addCategory, 
  } = useProfile();
  
  // Estados para el modal local
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState(categoryColors[0]);

  // Redirección/Comprobación de Club (Se lanza cuando club o isLoading cambian)
  useEffect(() => {
    // Si no está cargando Y el club es null, redirigir al paso 1
    if (!isLoading && !club) {
        router.replace("/create-club");
    }
  }, [isLoading, club, router]);

  // Creación de nueva categoría (Usa la función del contexto)
  const handleCreateCategory = () => {
    if (!newCategoryName || !newCategoryColor) {
      toast({
        title: "Campos incompletos",
        description: "Por favor, ingresa un nombre y selecciona un color.",
        variant: "destructive",
      });
      return;
    }
    
    // 1. Verificar Límite 
    if (usedCategoriesCount >= limits.MAX_CATEGORIES) {
        toast({
            title: "Límite Alcanzado",
            description: `Tu plan solo permite ${limits.MAX_CATEGORIES} categorías.`,
            variant: "destructive",
        });
        setNewCategoryName("");
        setIsModalOpen(false);
        return;
    }

    // 2. Evitar duplicados por nombre
    if(categories.some(cat => cat.name.toLowerCase() === newCategoryName.trim().toLowerCase())) {
         toast({
            title: "Error",
            description: "Ya existe una categoría con ese nombre.",
            variant: "destructive",
        });
        return;
    }

    const categoryData = {
      name: newCategoryName.trim(),
      // El hook espera un objeto que omiya el ID y clubId. Añadimos 'color' y 'ageGroup'
      color: newCategoryColor, 
      ageGroup: "N/A", 
    };

    // 3. Crear en el contexto (El hook se encarga de la lógica y la persistencia)
    addCategory(categoryData as any); 

    setNewCategoryName("");
    setNewCategoryColor(categoryColors[0]);
    setIsModalOpen(false);
  };

  // Selección de categoría y avance (Guarda la categoría seleccionada en localStorage para el Paso 3)
  const handleSelectCategory = (category: UserCategory) => {
    // La clave debe coincidir con lo que el ProfileGuard espera para avanzar
    localStorage.setItem("selectedCategory", JSON.stringify(category));
    
    // Limpiar el perfil activo para forzar la selección del rol en la siguiente pantalla (Paso 3)
    localStorage.removeItem("userProfile"); 
    
    router.push("/select-profile"); 
  };

  if (isLoading || !club) { // <-- Comprueba el estado de carga global Y si el club existe
    return (
      <div className="min-h-screen bg-[#1d2834] flex items-center justify-center">
        <div className="text-white">Cargando categorías...</div>
      </div>
    );
  }
  
  // Si llegamos aquí, no está cargando y el club existe.
  const hasCategories = categories.length > 0;
  const categoryLimitReached = usedCategoriesCount >= limits.MAX_CATEGORIES && limits.MAX_CATEGORIES !== Infinity;

  return (
    <div className="min-h-screen bg-[#1d2834] flex flex-col items-center justify-center p-4">
      {/* Botón para volver al Club */}
      <Button
          variant="ghost" 
          className="absolute text-white hover:text-[#aff606] top-8 left-4"
          onClick={() => router.push("/create-club")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Club
        </Button>
        
      <img
        src="/images/cuatro-cero-logo.png"
        alt="CUATRO CERO"
        className="h-16 w-auto mb-8"
      />
      <Card className="w-full max-w-2xl bg-[#213041] border-[#305176]">
        <CardHeader className="text-center">
          <CardTitle className="text-white text-xl">
            Paso 2: Selecciona una Categoría
          </CardTitle>
           <p className="text-gray-400 text-sm">
            {hasCategories ? "Selecciona o crea una nueva categoría." : "Debes crear al menos una categoría para continuar."}
            {limits.MAX_CATEGORIES !== Infinity && (
                <span className={`block mt-1 font-medium ${categoryLimitReached ? 'text-red-400' : 'text-[#aff606]'}`}>
                    Categorías en uso: {usedCategoriesCount} / {limits.MAX_CATEGORIES}
                </span>
            )}
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`aspect-square rounded-lg flex flex-col items-center justify-center text-white font-bold text-lg p-4 transition-all duration-200 hover:scale-105 ${cat.color} opacity-80 hover:opacity-100`}
                onClick={() => handleSelectCategory(cat)}
              >
                <Tag className="h-8 w-8 mb-2" />
                {cat.name}
              </button>
            ))}

            {/* Botón de Crear Categoría */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <button 
                    className={`aspect-square rounded-lg flex flex-col items-center justify-center font-bold text-lg p-4 transition-all duration-200 hover:scale-105 border-2 border-dashed ${categoryLimitReached ? 'border-gray-500 text-gray-500 cursor-not-allowed' : 'border-[#33d9f6] text-[#33d9f6] hover:bg-[#33d9f6] hover:text-black'}`}
                    disabled={categoryLimitReached}
                >
                  <Plus className="h-8 w-8 mb-2" />
                  Crear Categoría
                </button>
              </DialogTrigger>
              <DialogContent className="bg-[#213041] border-[#305176] text-white">
                <DialogHeader>
                  <DialogTitle className="text-white">Crear Nueva Categoría</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="categoryName" className="text-white">
                      Nombre de la Categoría
                    </Label>
                    <Input
                      id="categoryName"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="Ej: Primera División, Reserva"
                      className="bg-[#1d2834] border-[#305176] text-white h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Color</Label>
                    <div className="flex flex-wrap gap-2">
                      {categoryColors.map((color) => (
                        <button
                          key={color}
                          className={`h-10 w-10 rounded-full transition-all ${color} ${newCategoryColor === color ? 'ring-2 ring-offset-2 ring-offset-[#213041] ring-white' : ''}`}
                          onClick={() => setNewCategoryColor(color)}
                        />
                      ))}
                    </div>
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
                    onClick={handleCreateCategory}
                    className="bg-[#aff606] text-black hover:bg-[#25d03f]"
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
  )
}