// components/dashboard/category-settings-form.tsx

"use client"

import * as React from "react"
import { useProfile } from "@/hooks/use-profile"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { PaintBucket, Trash2 } from "lucide-react"


const COLORS = [
  "#aff606", "#33d9f6", "#f63333", "#f6a733", 
  "#3363f6", "#d933f6", "#f6d933", "#33f633"
]

interface UserCategory {
    id: string; 
    name: string;
    color: string;
}

export function CategorySettingsForm() {
  const { selectedCategory, setSelectedCategory, allCategories } = useProfile()
  const { toast } = useToast()
  const router = useRouter()
  const [formData, setFormData] = React.useState({ name: "", color: "" })
  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    if (selectedCategory) {
        setFormData({ name: selectedCategory.name, color: selectedCategory.color });
    }
  }, [selectedCategory])


  const handleSave = () => {
    if (!selectedCategory || !formData.name || !formData.color) {
      toast({ title: "Error", description: "Completa todos los campos.", variant: "destructive" });
      return;
    }
    
    setIsLoading(true);

    // 1. Crear la categoría actualizada
    const updatedCategory: UserCategory = {
      ...selectedCategory,
      name: formData.name.trim(),
      color: formData.color,
    };

    // 2. Actualizar localStorage (categories)
    const updatedAllCategories = allCategories.map(cat => 
        cat.id === updatedCategory.id ? updatedCategory : cat
    );
    localStorage.setItem("allUserCategories", JSON.stringify(updatedAllCategories));

    // 3. Actualizar localStorage (selectedCategory)
    localStorage.setItem("selectedCategory", JSON.stringify(updatedCategory));
    
    // 4. Actualizar el contexto
    setSelectedCategory(updatedCategory);

    toast({
      title: "Categoría Actualizada",
      description: `Categoría "${updatedCategory.name}" modificada.`,
    });

    setIsLoading(false);
  }
  
  const handleDelete = () => {
      if (!selectedCategory) return;
      
      const categoryIdToDelete = selectedCategory.id;

      // 1. Eliminar de todas las categorías
      const updatedAllCategories = allCategories.filter(cat => cat.id !== categoryIdToDelete);
      localStorage.setItem("allUserCategories", JSON.stringify(updatedAllCategories));

      // 2. Borrar la categoría activa
      setSelectedCategory(null);
      localStorage.removeItem("selectedCategory");
      localStorage.removeItem("userProfile"); // Forzamos re-selección de perfil

      toast({
        title: "Categoría Eliminada",
        description: `La categoría "${selectedCategory.name}" ha sido eliminada.`,
      });

      // 3. Redirigir a la selección de Categoría
      router.push("/select-category");
  }


  if (!selectedCategory) {
    return <p className="text-gray-400">No hay categoría activa seleccionada.</p>
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">Editar Categoría Activa</h3>
      <p className="text-sm text-gray-400">
        Modifica el nombre y el color de la categoría actual ({selectedCategory.name}).
      </p>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-white">Nombre de la Categoría</Label>
          <Input 
            id="name"
            value={formData.name} 
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="bg-[#1d2834] border-[#305176] text-white"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="color" className="text-white block">Color de Identificación</Label>
          <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start bg-[#1d2834] border-[#305176] text-white hover:bg-[#305176]">
                    <PaintBucket className="h-4 w-4 mr-2" style={{ color: formData.color }} />
                    {formData.color}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 bg-[#213041] border-[#305176]">
                <div className="grid grid-cols-4 gap-2">
                    {COLORS.map(color => (
                        <button
                            key={color}
                            style={{ backgroundColor: color }}
                            className={`h-8 w-8 rounded-full border-2 ${formData.color === color ? 'border-white' : 'border-transparent'}`}
                            onClick={() => setFormData({ ...formData, color })}
                        />
                    ))}
                </div>
            </PopoverContent>
          </Popover>
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

      <h3 className="text-lg font-semibold text-white">Eliminar Categoría</h3>
      <p className="text-sm text-gray-400">
        Eliminará esta categoría y forzará la re-selección de categoría y perfil a todos los usuarios que la usen.
      </p>
      <Button 
        onClick={handleDelete}
        variant="destructive" 
        disabled={isLoading}
        className="w-full bg-red-600 hover:bg-red-700"
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Eliminar Categoría
      </Button>
    </div>
  )
}