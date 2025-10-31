"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, FileText, DollarSign, Save, Image as ImageIcon, ArrowLeft } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"

const PRODUCT_CATEGORIES = [
  { id: "pizarras", name: "Pizarra (Plantilla)" },
  { id: "ebooks", name: "Ebook (Contenido Digital)" },
]

const IMAGE_GUIDES: Record<string, string> = {
    product: "Tamaño de Portada recomendado: 1200 x 900 px (Relación 4:3)",
    file: "Archivos permitidos: PDF, EPUB, ZIP, RAR.",
};

const STORAGE_KEY = "mock_store_products";

const INITIAL_PRODUCT_STATE = {
  name: "",
  price: 0,
  category: "pizarras", 
  description: "",
  image: "",
  file: "",
}

interface ProductFormProps {
    onBack: () => void;
}

export function ProductForm({ onBack }: ProductFormProps) {
  const [formData, setFormData] = useState(INITIAL_PRODUCT_STATE)
  const [isLoading, setIsLoading] = useState(false)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, field: 'image' | 'file') => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({ 
          ...prev, 
          [field]: reader.result as string 
        }))
      }
      reader.readAsDataURL(file)
    }
  }
  
  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault()
    
    let isValid = formData.name && formData.image && formData.price > 0 && formData.description && formData.file;

    if (!isValid) {
      toast({
        title: "Error de Validación",
        description: "Por favor, completa todos los campos requeridos (*).",
        variant: "default", 
      })
      return
    }

    setIsLoading(true)

    // LÓGICA CLAVE: Simular guardado de producto en el mock de la tienda
    const newProduct = { ...formData, id: Date.now() };
    
    if (typeof window !== 'undefined') {
        const existingProductsJson = localStorage.getItem(STORAGE_KEY);
        const existingProducts = existingProductsJson ? JSON.parse(existingProductsJson) : [];
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...existingProducts, newProduct]));
    }

    console.log("Producto de Tienda Publicado (Mock):", newProduct);
    
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "¡Producto Publicado!",
        description: `"${formData.name}" fue agregado a la tienda.`,
        variant: "default",
      })
      setFormData(INITIAL_PRODUCT_STATE) 
      onBack(); // Regresar al dashboard de publicador
    }, 1500)
  }

  return (
    <Card className="bg-[#213041] border-[#305176] w-full mx-auto">
        <CardHeader>
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={onBack} className="text-white hover:bg-[#305176] p-2">
                    <ArrowLeft className="h-5 w-5 mr-2" /> Volver
                </Button>
                <CardTitle className="text-white text-2xl">
                    Publicar Producto Digital
                </CardTitle>
                <div></div> {/* Spacer */}
            </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePublish} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2 col-span-2">
                    <Label htmlFor="product-name" className="text-white">Nombre / Título *</Label>
                    <Input
                      id="product-name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ej: Táctica y Estrategia"
                      className="bg-[#1d2834] border-[#305176] text-white"
                      required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="product-price" className="text-white flex items-center">
                      <DollarSign className="h-4 w-4 mr-1 text-[#25d03f]" />
                      Precio ($) *
                    </Label>
                    <Input
                      id="product-price"
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={formData.price > 0 ? formData.price : ""}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                      placeholder="24.99"
                      className="bg-[#1d2834] border-[#305176] text-white"
                      required
                    />
                </div>
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="product-category" className="text-white">Categoría</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger id="product-category" className="bg-[#1d2834] border-[#305176] text-white h-11">
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#213041] border-[#305176]">
                    {PRODUCT_CATEGORIES.map(type => (
                      <SelectItem key={type.id} value={type.id} className="text-white">
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="product-description" className="text-white">Descripción Detallada *</Label>
                <Textarea
                  id="product-description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe el contenido, beneficios y el objetivo del producto..."
                  className="bg-[#1d2834] border-[#305176] text-white min-h-[100px]"
                  required
                />
            </div>
            
            <Separator className="bg-[#305176]" />
            <h3 className="text-white font-bold text-lg">Archivos Digitales</h3>
            
            {/* Archivos de Producto */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="file-image" className="text-white flex items-center">
                      <ImageIcon className="h-4 w-4 mr-1" />
                      Foto de Portada *
                    </Label>
                    <p className="text-xs text-gray-500">{IMAGE_GUIDES.product}</p>
                    <div className="flex items-center space-x-2">
                        <div className="w-12 h-12 bg-[#305176] rounded flex items-center justify-center overflow-hidden">
                          {formData.image ? (
                            <img src={formData.image} alt="Portada" className="w-full h-full object-cover" />
                          ) : (
                            <FileText className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                        <Button 
                          type="button"
                          variant="outline"
                          className="flex-1 border-[#305176] text-white hover:bg-[#305176] bg-transparent"
                          onClick={() => document.getElementById('product-image-upload')?.click()}
                        >
                          Subir
                        </Button>
                    </div>
                    <input
                      id="product-image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'image')}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="file-upload" className="text-white flex items-center">
                      <BookOpen className="h-4 w-4 mr-1" />
                      Archivo Digital *
                    </Label>
                    <p className="text-xs text-gray-500">{IMAGE_GUIDES.file}</p>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="file-display"
                        value={formData.file ? `Cargado: ${formData.category}` : "Ningún archivo"}
                        readOnly
                        className="bg-[#1d2834] border-[#305176] text-gray-400"
                      />
                      <Button 
                        type="button"
                        variant="outline"
                        className="flex-shrink-0 border-[#305176] text-white hover:bg-[#305176] bg-transparent"
                        onClick={() => document.getElementById('product-file-upload')?.click()}
                      >
                        Subir
                      </Button>
                    </div>
                    <input
                      id="product-file-upload"
                      type="file"
                      accept={formData.category === 'ebooks' ? '.pdf,.epub' : '.zip,.rar'}
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'file')}
                      required
                    />
                  </div>
            </div>

            {/* --- MODIFICACIÓN AQUÍ --- */}
            {/* Botones de Publicar y Cancelar */}
            <div className="flex justify-end space-x-4 pt-4 border-t border-[#305176]">
              <Button
                type="button"
                variant="outline"
                className="w-1/2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white bg-transparent h-11 text-lg"
                onClick={onBack}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="w-1/2 bg-[#33d9f6] text-black hover:bg-[#2bc4ea] h-11 text-lg font-bold"
                disabled={isLoading}
              >
                <Save className="h-5 w-5 mr-2" />
                {isLoading ? "Publicando..." : "Publicar Producto"}
              </Button>
            </div>
            {/* --- FIN DE LA MODIFICACIÓN --- */}

          </form>
        </CardContent>
      </Card>
  )
}