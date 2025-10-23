"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save, Image as ImageIcon, Briefcase, ArrowLeft } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"

const STORAGE_KEY = "mock_sponsors_banners";

const IMAGE_GUIDES: Record<string, string> = {
    sponsor: "Tamaño de Banner recomendado: 1920 x 480 px (Relación 4:1 o similar)",
};

const INITIAL_SPONSOR_STATE = {
  name: "",
  image: "",
  link: "",
}

interface SponsorFormProps {
    onBack: () => void;
}

export function SponsorForm({ onBack }: SponsorFormProps) {
  const [formData, setFormData] = useState(INITIAL_SPONSOR_STATE)
  const [isLoading, setIsLoading] = useState(false)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({ 
          ...prev, 
          image: reader.result as string // Usamos Base64 para el mock
        }))
      }
      reader.readAsDataURL(file)
    }
  }
  
  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault()
    
    let isValid = formData.name && formData.image && formData.link;

    if (!isValid) {
      toast({
        title: "Error de Validación",
        description: "Por favor, completa Nombre, Imagen y Enlace del patrocinador.",
        variant: "default", 
      })
      return
    }

    setIsLoading(true)

    // LÓGICA CLAVE: Guardar banner en localStorage para que sponsors-section.tsx lo cargue.
    const newSponsor = { 
        name: formData.name, 
        image: formData.image, 
        link: formData.link,
        id: Date.now() // Mock ID
    };
    
    if (typeof window !== 'undefined') {
        const existingSponsorsJson = localStorage.getItem(STORAGE_KEY);
        const existingSponsors = existingSponsorsJson ? JSON.parse(existingSponsorsJson) : [];
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...existingSponsors, newSponsor]));
    }

    console.log("Banner de Patrocinador Publicado (Mock):", newSponsor);
    
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "¡Banner Publicado!",
        description: `El banner de "${formData.name}" ha sido agregado al carrusel.`,
        variant: "default",
      })
      setFormData(INITIAL_SPONSOR_STATE) 
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
                    Publicar Banner de Patrocinador
                </CardTitle>
                <div></div> {/* Spacer */}
            </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePublish} className="space-y-6">
            
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
                <p className="text-xs text-gray-500 text-[#f4c11a]">{IMAGE_GUIDES.sponsor}</p>
                <div className="flex items-center space-x-2">
                    <div className="w-24 h-12 bg-[#305176] rounded flex items-center justify-center overflow-hidden">
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
                  onChange={handleFileUpload}
                  required
                />
            </div>

            {/* Botón de Publicar Final */}
            <div className="pt-4 border-t border-[#305176]">
              <Button
                type="submit"
                className="w-full bg-[#f4c11a] text-black hover:bg-[#e0b018] h-11 text-lg font-bold"
                disabled={isLoading}
              >
                <Save className="h-5 w-5 mr-2" />
                {isLoading ? "Publicando Banner..." : "Publicar Banner"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
  )
}