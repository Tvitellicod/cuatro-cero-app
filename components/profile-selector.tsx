"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User } from "lucide-react"
import { useRouter } from "next/navigation"

interface ProfileSelectorProps {
  userPlan: string
  onProfileSelect: (profile: string) => void
}

export function ProfileSelector({ userPlan, onProfileSelect }: ProfileSelectorProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const getProfilesForPlan = (plan: string) => {
    switch (plan) {
      case "institucional":
        return [
          "TECNICO PRINCIPAL",
          "SEGUNDO TECNICO",
          "TERCER TECNICO",
          "PREPARADOR FISICO",
          "SEGUNDO PREPARADOR FISICO",
          "KINESIOLOGO",
          "NUTRICIONISTA",
          "DIRECTIVO N1",
          "DIRECTIVO N2",
          "DIRECTIVO N3",
          "EXTRA 1",
          "EXTRA 2",
        ]
      case "cuerpo_tecnico":
        return ["TECNICO PRINCIPAL", "SEGUNDO TECNICO", "PREPARADOR FISICO", "EXTRA 1", "EXTRA 2"]
      default:
        return ["TECNICO PRINCIPAL"]
    }
  }

  const profiles = getProfilesForPlan(userPlan)

  const handleProfileSelect = (profile: string) => {
    setIsLoading(true)
    onProfileSelect(profile)

    // Guardar el perfil seleccionado
    localStorage.setItem("selectedProfile", profile)

    // Ir directamente al dashboard
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
          <CardTitle className="text-white text-lg md:text-xl">Seleccionar Perfil</CardTitle>
          <p className="text-gray-400 text-sm">Toca el perfil que vas a usar</p>
        </CardHeader>
        <CardContent className="px-4 md:px-6">
          <div className="space-y-3">
            {profiles.map((profile) => (
              <Button
                key={profile}
                variant="outline"
                className="w-full justify-start h-12 text-left border-[#305176] text-white hover:bg-[#aff606] hover:text-black hover:border-[#aff606] transition-all duration-200 bg-transparent"
                onClick={() => handleProfileSelect(profile)}
                disabled={isLoading}
              >
                <User className="h-4 w-4 mr-3" />
                {profile}
              </Button>
            ))}
          </div>

          {isLoading && (
            <div className="mt-6 text-center">
              <p className="text-[#aff606] text-sm">Cargando dashboard...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
