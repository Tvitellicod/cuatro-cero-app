"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Plus, Tag, ArrowLeft } from "lucide-react" 
import { toast } from "@/hooks/use-toast"

// Definición de tipo para Categoría
interface UserCategory {
  id: string; 
  name: string;
  color: string; // Guardaremos un color de Tailwind, ej: "bg-blue-500"
}

// Opciones de colores
const categoryColors = [
  "bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-red-500", 
  "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-cyan-500"
];

// Claves de LocalStorage
const ALL_CATEGORIES_KEY = "allUserCategories";
const SELECTED_CATEGORY_KEY = "selectedCategory";
const CLUB_DATA_KEY = "clubData"; 

export default function SelectCategoryPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<UserCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryColor, setNewCategoryColor] = useState(categoryColors[0])

  // Cargar categorías guardadas y verificar el club
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // ** 1. Verificar Club **
      const savedClub = localStorage.getItem(CLUB_DATA_KEY);
      if (!savedClub) {
        // Si no hay club, redirigir a crearlo
        router.replace("/create-club");
        return; 
      }
      
      // ** 2. Cargar Categorías **
      const savedCategories = localStorage.getItem(ALL_CATEGORIES_KEY);
      
      let initialCategories: UserCategory[] = [];
      if (savedCategories) {
        initialCategories = JSON.parse(savedCategories);
      } 
      
      setCategories(initialCategories);
      setIsLoading(false);
    }
  }, [router]);

  // Guardar nueva categoría
  const handleCreateCategory = () => {
    if (!newCategoryName || !newCategoryColor) {
      toast({
        title: "Campos incompletos",
        description: "Por favor, ingresa un nombre y selecciona un color.",
        variant: "destructive",
      });
      return;
    }
    
    // Evitar duplicados por nombre
    if(categories.some(cat => cat.name.toLowerCase() === newCategoryName.trim().toLowerCase())) {
         toast({
            title: "Error",
            description: "Ya existe una categoría con ese nombre.",
            variant: "destructive",
        });
        return;
    }


    const newCategory: UserCategory = {
      id: newCategoryName.toLowerCase().replace(/\s/g, '_'), // Usar nombre como ID base
      name: newCategoryName,
      color: newCategoryColor,
    };

    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
    localStorage.setItem(ALL_CATEGORIES_KEY, JSON.stringify(updatedCategories));
    
    toast({
      title: "Categoría Creada",
      description: `"${newCategory.name}" ha sido creada.`,
    });

    setNewCategoryName("");
    setNewCategoryColor(categoryColors[0]);
    setIsModalOpen(false);
  };

  // Seleccionar categoría y avanzar
  const handleSelectCategory = (category: UserCategory) => {
    localStorage.setItem(SELECTED_CATEGORY_KEY, JSON.stringify(category));
    // Limpiar el perfil activo para forzar la selección del rol en la siguiente pantalla (Paso 3)
    localStorage.removeItem("userProfile"); 
    router.push("/select-profile"); 
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1d2834] flex items-center justify-center">
        <div className="text-white">Cargando categorías...</div>
      </div>
    );
  }
  
  const hasCategories = categories.length > 0;

  return (
    <div className="min-h-screen bg-[#1d2834] flex flex-col items-center justify-center p-4">
      {/* Botón para volver al Club (por si se equivocó) */}
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
                <button className="aspect-square rounded-lg flex flex-col items-center justify-center text-[#aff606] font-bold text-lg p-4 transition-all duration-200 hover:scale-105 border-2 border-dashed border-[#aff606] hover:bg-[#aff606] hover:text-black">
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