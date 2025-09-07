"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface ProfileContextType {
  currentProfile: string | null
  userPlan: string
  setCurrentProfile: (profile: string) => void
  setUserPlan: (plan: string) => void
  getPermissions: () => ProfilePermissions
}

interface ProfilePermissions {
  canEditClub: boolean
  canEditPlayers: boolean
  canCreateExercises: boolean
  canPlanTraining: boolean
  canManageMatches: boolean
  canViewStats: boolean
  canViewNutrition: boolean
  canViewMedical: boolean
  exerciseTypes: string[]
  sections: string[]
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [currentProfile, setCurrentProfile] = useState<string | null>(null)
  const [userPlan, setUserPlan] = useState<string>("institucional") // Default for demo

  // Cargar perfil guardado al inicializar
  useEffect(() => {
    const savedProfile = localStorage.getItem("selectedProfile")
    if (savedProfile) {
      setCurrentProfile(savedProfile)
    }
  }, [])

  const getPermissions = (): ProfilePermissions => {
    const isTechnician = currentProfile?.includes("TECNICO")
    const isPhysicalTrainer = currentProfile?.includes("PREPARADOR FISICO")
    const isKinesiologist = currentProfile === "KINESIOLOGO"
    const isNutritionist = currentProfile === "NUTRICIONISTA"
    const isDirective = currentProfile?.includes("DIRECTIVO") || currentProfile?.includes("EXTRA")

    return {
      canEditClub: isTechnician || false,
      canEditPlayers: isTechnician || false,
      canCreateExercises: isTechnician || isPhysicalTrainer || isKinesiologist || false,
      canPlanTraining: !isNutritionist,
      canManageMatches: isTechnician || false,
      canViewStats: isTechnician || isDirective || false,
      canViewNutrition: isNutritionist || false,
      canViewMedical: isKinesiologist || false,
      exerciseTypes: isTechnician
        ? ["EJERCICIOS"]
        : isPhysicalTrainer
          ? ["EJERCICIOS FISICOS", "EJERCICIOS KINESIOLOGIA"]
          : isKinesiologist
            ? ["EJERCICIOS KINESIOLOGIA"]
            : [],
      sections: getSectionsForProfile(currentProfile),
    }
  }

  return (
    <ProfileContext.Provider
      value={{
        currentProfile,
        userPlan,
        setCurrentProfile,
        setUserPlan,
        getPermissions,
      }}
    >
      {children}
    </ProfileContext.Provider>
  )
}

function getSectionsForProfile(profile: string | null): string[] {
  if (!profile) return []

  const isTechnician = profile.includes("TECNICO")
  const isPhysicalTrainer = profile.includes("PREPARADOR FISICO")
  const isKinesiologist = profile === "KINESIOLOGO"
  const isNutritionist = profile === "NUTRICIONISTA"
  const isDirective = profile.includes("DIRECTIVO") || profile.includes("EXTRA")

  const sections = ["INICIO", "CLUB"]

  if (!isNutritionist) {
    sections.push("ENTRENAMIENTO")
  }

  sections.push("PARTIDOS")

  if (isTechnician || isDirective) {
    sections.push("ESTADISTICAS")
  }

  if (isNutritionist) {
    sections.push("NUTRICION")
  }

  return sections
}

export function useProfile() {
  const context = useContext(ProfileContext)
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider")
  }
  return context
}
