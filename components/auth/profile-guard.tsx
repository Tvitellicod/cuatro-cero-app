"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface ProfileGuardProps {
  children: React.ReactNode
}

export function ProfileGuard({ children }: ProfileGuardProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verificar si hay un perfil creado
    const savedProfile = localStorage.getItem("userProfile")

    if (!savedProfile) {
      router.push("/create-profile")
    } else {
      setIsLoading(false)
    }
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1d2834] flex items-center justify-center">
        <div className="text-white">Cargando perfil...</div>
      </div>
    )
  }

  return <>{children}</>
}
