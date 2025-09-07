"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Users, Activity, Apple, Stethoscope } from "lucide-react"
import { useRouter } from "next/navigation"

export default function SelectProfilePage() {
  const [selectedProfile, setSelectedProfile] = useState<any>(null)
  const [selectedCategory, setSelectedCategory] = useState("")
  const router = useRouter()

  const profiles = [
    {
      id: 1,
      name: "Carlos Mendoza",
      role: "DIRECTOR TECNICO",
      icon: User,
      color: "bg-[#aff606]",
    },
    {
      id: 2,
      name: "María González",
      role: "PREPARADOR FISICO",
      icon: Activity,
      color: "bg-[#f4c11a]",
    },
    {
      id: 3,
      name: "Juan Pérez",
      role: "KINESIOLOGO",
      icon: Stethoscope,
      color: "bg-[#33d9f6]",
    },
    {
      id: 4,
      name: "Ana Rodríguez",
      role: "NUTRICIONISTA",
      icon: Apple,
      color: "bg-[#ea3498]",
    },
    {
      id: 5,
      name: "Roberto Silva",
      role: "DIRECTIVO",
      icon: Users,
      color: "bg-[#8a46c5]",
    },
  ]

  const categories = [
    { id: "primera", name: "Primera División" },
    { id: "tercera", name: "Tercera División" },
    { id: "cuarta", name: "Cuarta División" },
    { id: "quinta", name: "Quinta División" },
    { id: "sexta", name: "Sexta División" },
    { id: "septima", name: "Séptima División" },
    { id: "octava", name: "Octava División" },
  ]

  const handleProfileSelect = (profile: any) => {
    setSelectedProfile(profile)
    setSelectedCategory("")
  }

  const handleContinue = () => {
    if (selectedProfile && selectedCategory) {
      const profileData = {
        id: selectedProfile.id,
        name: selectedProfile.name,
        role: selectedProfile.role,
        category: selectedCategory,
        displayName: `${selectedProfile.name} - ${selectedProfile.role}`,
      }
      localStorage.setItem("userProfile", JSON.stringify(profileData))
      router.push("/dashboard")
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0f1c] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <img src="/images/cuatro-cero-logo.png" alt="CUATRO CERO" className="h-12 w-auto mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">Seleccionar Perfil</h1>
          <p className="text-gray-400">Elige tu perfil y categoría de trabajo</p>
        </div>

        {!selectedProfile ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {profiles.map((profile) => {
              const IconComponent = profile.icon
              return (
                <Card
                  key={profile.id}
                  className="bg-[#213041] border-[#305176] hover:bg-[#305176] transition-colors cursor-pointer"
                  onClick={() => handleProfileSelect(profile)}
                >
                  <CardContent className="p-6 text-center">
                    <div
                      className={`w-16 h-16 ${profile.color} rounded-full flex items-center justify-center mx-auto mb-4`}
                    >
                      <IconComponent className="h-8 w-8 text-black" />
                    </div>
                    <h3 className="text-white font-semibold text-lg mb-2">{profile.name}</h3>
                    <p className="text-gray-400 text-sm">{profile.role}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card className="bg-[#213041] border-[#305176] max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-white text-center">
                {selectedProfile.name} - {selectedProfile.role}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-white text-sm font-medium">Seleccionar Categoría de Trabajo</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="bg-[#1d2834] border-[#305176] text-white">
                    <SelectValue placeholder="Elegir categoría" />
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

              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  className="flex-1 border-[#305176] text-white hover:bg-[#305176] bg-transparent"
                  onClick={() => setSelectedProfile(null)}
                >
                  Volver
                </Button>
                <Button
                  className="flex-1 bg-[#aff606] text-black hover:bg-[#25d03f]"
                  onClick={handleContinue}
                  disabled={!selectedCategory}
                >
                  Continuar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
