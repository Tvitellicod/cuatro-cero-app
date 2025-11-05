"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, ArrowRight, X } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Clave para guardar el club en localStorage (simulando la DB)
const CLUB_DATA_KEY = "clubData";

export default function CreateClubPage() {
  const router = useRouter()
  const [clubName, setClubName] = useState("")
  const [clubAbbreviation, setClubAbbreviation] = useState("")
  const [clubLogo, setClubLogo] = useState<string>("") // Usaremos base64 para el mock
  const [isLoading, setIsLoading] = useState(false)

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validar tamaño (máx 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error de archivo",
          description: "El archivo es demasiado grande (máx. 5MB).",
          variant: "default",
        })
        return;
      }
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setClubLogo(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCreateClub = () => {
    if (!clubName.trim() || !clubAbbreviation.trim()) {
      toast({
        title: "Campos incompletos",
        description: "El Nombre y la Abreviatura del club son obligatorios.",
        variant: "destructive",
      })
      return
    }

    // Validación de logo opcional (si se requiere)
    if (!clubLogo) {
      toast({
        title: "Logo no subido",
        description: "Recomendamos subir un logo para una mejor experiencia.",
        variant: "default",
      })
    }

    setIsLoading(true)

    // Simular el guardado del club
    const clubData = {
      id: `club_${Date.now()}`, // Mock ID
      name: clubName.trim(),
      abbreviation: clubAbbreviation.trim().toUpperCase(),
      logoUrl: clubLogo || "/placeholder-logo.png", // Usar un placeholder si no hay logo
      createdAt: new Date().toISOString(),
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(CLUB_DATA_KEY, JSON.stringify(clubData))
      // Limpiar estados de navegación anteriores
      localStorage.removeItem("userProfile");
      localStorage.removeItem("selectedCategory");
    }
    
    toast({
        title: "Club Creado",
        description: `¡El club "${clubData.name}" ha sido creado con éxito!`,
    });

    setTimeout(() => {
      setIsLoading(false)
      // Redirigir al siguiente paso: Seleccionar Categoría (Paso 2)
      router.push("/select-category")
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-[#1d2834] flex flex-col items-center justify-center p-4">
      <img
        src="/images/cuatro-cero-logo.png"
        alt="CUATRO CERO"
        className="h-16 w-auto mb-8"
      />
      <Card className="w-full max-w-lg bg-[#213041] border-[#305176]">
        <CardHeader className="text-center">
          <CardTitle className="text-white text-xl">
            Paso 1: Crea tu Club
          </CardTitle>
          <p className="text-gray-400 text-sm">
            Ingresa la información básica de tu institución para empezar.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            
            {/* Sección de Logo */}
            <div className="space-y-2 text-center">
              <Label className="text-white flex items-center justify-center">Logo del Club (Opcional)</Label>
              <div className="flex flex-col items-center space-y-3">
                
                <Avatar className="h-24 w-24 border-4 border-[#305176]">
                  {clubLogo ? (
                    // Usar un img tag normal para Base64/Mock URL
                    <img src={clubLogo} alt="Logo del Club" className="w-full h-full object-cover" />
                  ) : (
                    <AvatarFallback className="bg-[#305176] text-white text-2xl">
                      {clubAbbreviation.slice(0, 2) || "4C"}
                    </AvatarFallback>
                  )}
                </Avatar>

                <div className="flex space-x-2">
                    <Button
                    variant="outline"
                    className="border-[#305176] text-white hover:bg-[#305176] bg-transparent"
                    onClick={() => document.getElementById('logo-upload')?.click()}
                    >
                    <Upload className="h-4 w-4 mr-2" />
                    Subir Logo
                    </Button>
                    {clubLogo && (
                       <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-400 hover:bg-red-500/20"
                        onClick={() => setClubLogo("")}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                </div>
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoUpload}
                />
              </div>
            </div>

            {/* Campos de Nombre y Abreviatura */}
            <div className="space-y-2">
              <Label htmlFor="club-name" className="text-white">Nombre Completo del Club *</Label>
              <Input
                id="club-name"
                value={clubName}
                onChange={(e) => setClubName(e.target.value)}
                placeholder="Ej: Club Atlético Villa Luro"
                className="bg-[#1d2834] border-[#305176] text-white h-11"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="club-abbreviation" className="text-white">Abreviatura (3-5 letras) *</Label>
              <Input
                id="club-abbreviation"
                value={clubAbbreviation}
                onChange={(e) => setClubAbbreviation(e.target.value.toUpperCase().slice(0, 5))}
                placeholder="Ej: AVL"
                className="bg-[#1d2834] border-[#305176] text-white h-11"
                maxLength={5}
                required
                disabled={isLoading}
              />
            </div>

            <Button
              className="w-full bg-[#aff606] text-black hover:bg-[#25d03f] h-11 text-lg font-bold"
              onClick={handleCreateClub}
              disabled={isLoading || !clubName.trim() || !clubAbbreviation.trim()}
            >
              {isLoading ? "Creando Club..." : (
                <>
                  Continuar <ArrowRight className="h-5 w-5 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}