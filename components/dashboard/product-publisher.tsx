"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Upload, BookOpen, FileText, DollarSign, Save, Image as ImageIcon, Briefcase } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"


const CONTENT_TYPES = [
  { id: "product", name: "Producto (Ebook/Pizarra)", icon: BookOpen },
  { id: "sponsor", name: "Patrocinador (Banner)", icon: Briefcase },
]

const PRODUCT_CATEGORIES = [
  { id: "pizarras", name: "Pizarra (Plantilla)" },
  { id: "ebooks", name: "Ebook (Contenido Digital)" },
]

// Guías de dimensiones para el usuario
const IMAGE_GUIDES: Record<string, string> = {
    // Para Productos de la Tienda
    image: "Tamaño recomendado: 1200 x 900 px (Relación 4:3)",
    file: "Archivos permitidos: PDF, EPUB, ZIP, RAR.",
    // Para Patrocinadores (SponsorsSection usa h-64 md:h-80 w-full, que es una relación amplia y responsive)
    sponsor: "Tamaño recomendado: 1920 x 480 px (Relación 4:1 o similar)",
};


const INITIAL_FORM_STATE = {
  contentType: "product", // Nuevo selector principal
  name: "",
  price: 0,
  category: "pizarras", // Solo para productos
  description: "",
  image: "", // URL/Base64 de la imagen
  file: "", // URL/Base64 del archivo digital (si es producto)
  link: "", // URL del patrocinador (si es sponsor)
}

export function ProductPublisher() {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE)
  const [isLoading, setIsLoading] = useState(false)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, field: 'image' | 'file') => {
    const file = event.target.files?.[0]
    if (file) {
      // Usamos FileReader para simular la carga y obtener una URL temporal/base64
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
    
    // VALIDACIÓN GENERAL
    let isValid = formData.name && formData.image;

    if (formData.contentType === 'product') {
        isValid = isValid && formData.price > 0 && formData.description && formData.file;
    } else if (formData.contentType === 'sponsor') {
        // Validación mínima para sponsors: nombre, imagen y enlace.
        isValid = isValid && formData.link;
    }


    if (!isValid) {
      toast({
        title: "Error de Validación",
        description: "Por favor, completa todos los campos requeridos para el tipo de contenido seleccionado.",
        variant: "default", // Usamos default para que se vea, pero es un error
      })
      return
    }

    setIsLoading(true)

    // Lógica de MOCK: Simular la publicación y el guardado
    console.log("Publicando contenido:", formData)
    
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "¡Publicado con Éxito!",
        description: `El contenido (${formData.contentType}) "${formData.name}" ha sido agregado a la plataforma. (Mock)`,
        variant: "default",
      })
      setFormData(INITIAL_FORM_STATE) // Resetear formulario
    }, 1500)
  }

  // Define el icono principal según el tipo de contenido seleccionado
  const MainIcon = CONTENT_TYPES.find(t => t.id === formData.contentType)?.icon || Plus;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Gestión de Contenido</h2>
        <p className="text-gray-400">Publica nuevos productos o banners de patrocinadores.</p>
      </div>

      <Card className="bg-[#213041] border-[#305176]">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <MainIcon className="h-5 w-5 mr-2 text-[#aff606]" />
            Nuevo Contenido
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePublish} className="space-y-6">
            
            {/* TIPO DE CONTENIDO */}
            <div className="space-y-2">
                <Label htmlFor="content-type" className="text-white">Tipo de Contenido a Publicar</Label>
                <Select
                  value={formData.contentType}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, contentType: value, name: "", price: 0, link: "", file: "" }))}
                >
                  <SelectTrigger id="content-type" className="bg-[#1d2834] border-[#305176] text-white h-11">
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#213041] border-[#305176]">
                    {CONTENT_TYPES.map(type => (
                      <SelectItem key={type.id} value={type.id} className="text-white">
                        <div className="flex items-center">
                            <type.icon className="h-4 w-4 mr-2" /> {type.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
            </div>
            
            <Separator className="bg-[#305176]" />

            {/* SECCIÓN PRODUCTO (EBOOK/PIZARRA) */}
            {formData.contentType === 'product' && (
                <div className="space-y-4">
                    <h3 className="text-white font-bold text-lg flex items-center"><BookOpen className="h-5 w-5 mr-2 text-[#33d9f6]" /> Detalles del Producto</h3>

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
                    
                    {/* Archivos de Producto */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#305176]">
                        <div className="space-y-2">
                            <Label htmlFor="file-image" className="text-white flex items-center">
                              <ImageIcon className="h-4 w-4 mr-1" />
                              Foto de Portada *
                            </Label>
                            {/* Guía de Medida */}
                            <p className="text-xs text-gray-500">{IMAGE_GUIDES.image}</p>
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
                              required={formData.contentType === 'product'}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="file-upload" className="text-white flex items-center">
                              <BookOpen className="h-4 w-4 mr-1" />
                              Archivo Digital *
                            </Label>
                             {/* Guía de Medida */}
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
                              required={formData.contentType === 'product'}
                            />
                          </div>
                    </div>
                </div>
            )}
            
            {/* SECCIÓN PATROCINADOR (BANNER) */}
            {formData.contentType === 'sponsor' && (
                <div className="space-y-4">
                    <h3 className="text-white font-bold text-lg flex items-center"><Briefcase className="h-5 w-5 mr-2 text-[#f4c11a]" /> Detalles del Patrocinador</h3>

                    <div className="space-y-2">
                        <Label htmlFor="sponsor-name" className="text-white">Nombre de la Marca *</Label>
                        <Input
                          id="sponsor-name"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Ej: Nike"
                          className="bg-[#1d2834] border-[#305176] text-white"
                          required
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="sponsor-link" className="text-white">URL de Redirección *</Label>
                        <Input
                          id="sponsor-link"
                          type="url"
                          value={formData.link}
                          onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                          placeholder="https://www.marca.com"
                          className="bg-[#1d2834] border-[#305176] text-white"
                          required
                        />
                    </div>

                    {/* Subir Banner */}
                    <div className="space-y-2 pt-4 border-t border-[#305176]">
                        <Label htmlFor="file-image-sponsor" className="text-white flex items-center">
                          <ImageIcon className="h-4 w-4 mr-1" />
                          Banner del Patrocinador *
                        </Label>
                        {/* Guía de Medida */}
                        <p className="text-xs text-gray-500">{IMAGE_GUIDES.sponsor}</p>
                        <div className="flex items-center space-x-2">
                            <div className="w-16 h-10 bg-[#305176] rounded flex items-center justify-center overflow-hidden">
                              {formData.image ? (
                                <img src={formData.image} alt="Banner Preview" className="w-full h-full object-cover" />
                              ) : (
                                <ImageIcon className="h-5 w-5 text-gray-400" />
                              )}
                            </div>
                            <Button 
                              type="button"
                              variant="outline"
                              className="flex-1 border-[#305176] text-white hover:bg-[#305176] bg-transparent"
                              onClick={() => document.getElementById('sponsor-image-upload')?.click()}
                            >
                              Subir
                            </Button>
                        </div>
                        <input
                          id="sponsor-image-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, 'image')}
                          required={formData.contentType === 'sponsor'}
                        />
                    </div>
                </div>
            )}


            {/* Botón de Publicar Final */}
            <div className="pt-4 border-t border-[#305176]">
              <Button
                type="submit"
                className="w-full bg-[#aff606] text-black hover:bg-[#25d03f] h-11 text-lg font-bold"
                disabled={isLoading}
              >
                <Save className="h-5 w-5 mr-2" />
                {isLoading ? "Publicando..." : "Publicar Contenido"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}