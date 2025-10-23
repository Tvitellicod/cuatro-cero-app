"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { DashboardHome } from "@/components/dashboard/dashboard-home"
import { useProfile } from "@/hooks/use-profile" // Importamos el hook de perfil

export default function DashboardPage() {
  const router = useRouter()
  const { currentProfile } = useProfile()

  // Leer el perfil completo del localStorage
  const savedProfile = typeof window !== "undefined" ? localStorage.getItem("userProfile") : null
  const profileData = savedProfile ? JSON.parse(savedProfile) : null
  const profileType = profileData?.profileType

  useEffect(() => {
    if (profileType === "PUBLICADOR") {
      // Redirigir al panel de publicación
      router.replace("/dashboard/tienda-admin")
    }
  }, [profileType, router])

  // Si es Publicador, no renderizar nada mientras se redirige
  if (profileType === "PUBLICADOR") {
    return (
      <div className="min-h-screen bg-[#1d2834] flex items-center justify-center">
        <div className="text-white">Redirigiendo a Gestión de Contenido...</div>
      </div>
    )
  }
  
  // Si no es Publicador o el perfil aún se está cargando, muestra la vista normal
  if (!profileType) {
       return (
        <div className="min-h-screen bg-[#1d2834] flex items-center justify-center">
            <div className="text-white">Cargando Dashboard...</div>
        </div>
    )
  }


  return (
    <DashboardLayout>
      <DashboardHome />
    </DashboardLayout>
  )
}