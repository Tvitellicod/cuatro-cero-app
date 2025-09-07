"use client"

import type React from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { isSupabaseConfigured } from "@/lib/supabase"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: string[]
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      // If Supabase is not configured, allow access for demo purposes
      if (!isSupabaseConfigured()) {
        return
      }

      if (!user) {
        router.push("/app")
        return
      }

      if (requiredRole && !requiredRole.includes(user.role || "")) {
        router.push("/dashboard")
        return
      }
    }
  }, [user, loading, router, requiredRole])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1d2834] flex items-center justify-center">
        <div className="text-white">Cargando...</div>
      </div>
    )
  }

  // Allow access if Supabase is not configured (demo mode)
  if (!isSupabaseConfigured()) {
    return <>{children}</>
  }

  if (!user) {
    return null
  }

  if (requiredRole && !requiredRole.includes(user.role || "")) {
    return (
      <div className="min-h-screen bg-[#1d2834] flex items-center justify-center">
        <div className="text-white">No tienes permisos para acceder a esta página</div>
      </div>
    )
  }

  return <>{children}</>
}
