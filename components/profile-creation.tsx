"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"

interface ProfileCreationProps {
  userPlan: string
  onProfileCreate: (profileData: any) => void
}

export function ProfileCreation({ userPlan, onProfileCreate }: ProfileCreationProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    profileType: "",
    category: "",
  })
  const router = useRouter()

  const profileTypes = ["DIRECTOR TECNICO", "PREPARADOR FISICO", "KINESIOLOGO", "DIRECTIVO", "EXTRA", "NUTRICIONISTA"]

  const categories = [
    { id: "primera", name: "Primera División" },
    { id: "tercera", name: "Tercera División" },
    { id: "cuarta", name: "Cuarta División" },
    { id: "quinta", name: "Quinta División" },
    { id: "sexta", name: "Sexta División" },
    { id: "septima", name: "Séptima División" },
    { id: "juveniles", name: "Juveniles" },
    { id: "infantiles", name: "Infantiles" },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.firstName || !formData.lastName || !formData.profileType || !formData.category) {
      return
    }

    setIsLoading(true)

    const profileData = {
      ...formData,
      fullName: `${formData.firstName} ${formData.lastName}`,
      displayName: `${formData.firstName} ${formData.lastName} - ${formData.profileType}`,
    }

    onProfileCreate(profileData)

    // Guardar el perfil
    localStorage.setItem("userProfile", JSON.stringify(profileData))

    setTimeout(() => {
      router.push("/dashboard")
    }, 500)
  }

  return (
    <div className="min-h-screen bg-[#1d2834] flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-4 bg-[#213041] border-[#305176]">
        <CardHeader className="text-center px-4 md:px-6">
          <div className="flex justify-center mb-4">
            <img
              src="/images/cuatro-cero-logo.png"
              alt="CUATRO CERO - Gestión de Equipo"
              className="h-16 md:h-20 w-auto"
            />
          </div>
          <CardTitle className="text-white text-lg md:text-xl">Crear Perfil</CardTitle>
          <p className="text-gray-400 text-sm">Completa tu información para comenzar</p>
        </CardHeader>
        <CardContent className="px-4 md:px-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-white text-sm">
                  Nombre
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="Tu nombre"
                  className="bg-[#1d2834] border-[#305176] text-white h-11"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-white text-sm">
                  Apellido
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Tu apellido"
                  className="bg-[#1d2834] border-[#305176] text-white h-11"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white text-sm">Función</Label>
              <Select
                value={formData.profileType}
                onValueChange={(value) => setFormData({ ...formData, profileType: value })}
              >
                <SelectTrigger className="bg-[#1d2834] border-[#305176] text-white h-11">
                  <SelectValue placeholder="Selecciona tu función" />
                </SelectTrigger>
                <SelectContent className="bg-[#213041] border-[#305176]">
                  {profileTypes.map((type) => (
                    <SelectItem key={type} value={type} className="text-white">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-white text-sm">Categoría de trabajo</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger className="bg-[#1d2834] border-[#305176] text-white h-11">
                  <SelectValue placeholder="Selecciona la categoría" />
                </SelectTrigger>
                <SelectContent className="bg-[#213041] border-[#305176]">
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id} className="text-white">
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#aff606] text-black hover:bg-[#25d03f] h-11 mt-6"
              disabled={isLoading}
            >
              {isLoading ? "Creando perfil..." : "Crear Perfil"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
