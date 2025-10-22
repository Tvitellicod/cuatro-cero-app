"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Upload, BookOpen, FileText, DollarSign, Save } from "lucide-react"
import { toast } from "@/hooks/use-toast"

const PRODUCT_TYPES = [
  { id: "pizarras", name: "Pizarra (Plantilla)" },
  { id: "ebooks", name: "Ebook (Contenido Digital)" },
]

// Estado inicial para el formulario
const INITIAL_PRODUCT_STATE = {
  name: "",
  price: 0,
  category: "pizarras",
  description: "",
  image: "", // Base64 o URL para mock
  file: "", // URL para mock de archivo descargable/integrable
}

export function ProductPublisher() {
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
    if (!formData.name || formData.price <= 0 || !formData.description || !formData.image || !formData.file) {
      toast({
        title: "Error de Validación",
        description: "Por favor, completa todos los campos requeridos.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Lógica de MOCK: Simular la publicación y el guardado
    console.log("Publicando producto:", formData)
    
    // Simulación: Aquí se actualizaría la base de datos de productos (supabase)
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "¡Publicado con Éxito!",
        description: `El producto "${formData.name}" ha sido agregado a la tienda. (Mock)`,
        variant: "default",
      })
      setFormData(INITIAL_PRODUCT_STATE) // Resetear formulario
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Publicador de Tienda</h2>
        <p className="text-gray-400">Publica nuevos Ebooks y Pizarras para la tienda.</p>
      </div>

      <Card className="bg-[#213041] border-[#305176]">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Plus className="h-5 w-5 mr-2 text-[#aff606]" />
            Nuevo Producto Digital
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePublish} className="space-y-6">
            
            {/* Tipo y Nombre */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="product-category" className="text-white">Tipo de Producto</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger id="product-category" className="bg-[#1d2834] border-[#305176] text-white">
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#213041] border-[#305176]">
                    {PRODUCT_TYPES.map(type => (
                      <SelectItem key={type.id} value={type.id} className="text-white">
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="product-name" className="text-white">Nombre / Título</Label>
                <Input
                  id="product-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ej: Metodología de Entrenamiento"
                  className="bg-[#1d2834] border-[#305176] text-white"
                  required
                />
              </div>
            </div>

            {/* Precio y Descripción */}
            <div className="space-y-2">
              <Label htmlFor="product-description" className="text-white">Descripción Detallada</Label>
              <Textarea
                id="product-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe el contenido, beneficios y el objetivo del producto..."
                className="bg-[#1d2834] border-[#305176] text-white min-h-[120px]"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="product-price" className="text-white flex items-center">
                  <DollarSign className="h-4 w-4 mr-1 text-[#25d03f]" />
                  Precio ($)
                </Label>
                <Input
                  id="product-price"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={formData.price > 0 ? formData.price : ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                  placeholder="19.99"
                  className="bg-[#1d2834] border-[#305176] text-white"
                  required
                />
              </div>

              {/* Subir Foto (Imagen de Portada) */}
              <div className="space-y-2">
                <Label htmlFor="file-image" className="text-white flex items-center">
                  <Upload className="h-4 w-4 mr-1" />
                  Foto de Portada
                </Label>
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
                      onClick={() => document.getElementById('image-upload')?.click()}
                    >
                      Subir
                    </Button>
                </div>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, 'image')}
                  required
                />
              </div>
              
              {/* Subir Archivo (PDF/Plantilla) */}
              <div className="space-y-2">
                <Label htmlFor="file-upload" className="text-white flex items-center">
                  <BookOpen className="h-4 w-4 mr-1" />
                  Archivo Digital
                </Label>
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
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    Subir
                  </Button>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  accept={formData.category === 'ebooks' ? '.pdf,.epub' : '.zip,.rar'}
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, 'file')}
                  required
                />
              </div>

            </div>

            {/* Botón de Publicar */}
            <div className="pt-4 border-t border-[#305176]">
              <Button
                type="submit"
                className="w-full bg-[#aff606] text-black hover:bg-[#25d03f] h-11 text-lg font-bold"
                disabled={isLoading}
              >
                <Save className="h-5 w-5 mr-2" />
                {isLoading ? "Publicando..." : "Publicar Producto"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}