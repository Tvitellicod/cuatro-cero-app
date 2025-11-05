// tvitellicod/cuatro-cero-app/cuatro-cero-app-60479741c8ea2ca449bfcef814f36d999ab6ab01/hooks/use-profile.tsx

"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

// --- INTERFACES ---
interface UserCategory {
  id: string; 
  name: string;
  color: string;
}

interface UserProfile {
    id: number;
    firstName: string;
    lastName: string;
    profileType: string;
    category: string; // ID de la categoría
    displayName: string;
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

interface ProfileContextType {
  // Perfil Activo (quién eres)
  currentProfile: string | null // El displayName
  setCurrentProfile: (profile: string) => void
  
  // Categoría Activa (dónde estás trabajando)
  selectedCategory: UserCategory | null
  allCategories: UserCategory[]
  setSelectedCategory: (category: UserCategory | null) => void
  
  // Permisos y Plan
  userPlan: string
  setUserPlan: (plan: string) => void
  getPermissions: () => ProfilePermissions
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

// --- Claves de LocalStorage ---
const ACTIVE_PROFILE_KEY = "userProfile"; // El perfil con rol (DT, PF...)
const SELECTED_CATEGORY_KEY = "selectedCategory"; // La categoría (Primera, Reserva...)
const ALL_CATEGORIES_KEY = "allUserCategories";

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [currentProfile, setCurrentProfile] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategoryState] = useState<UserCategory | null>(null)
  const [allCategories, setAllCategories] = useState<UserCategory[]>([])
  const [userPlan, setUserPlan] = useState<string>("institucional")

  // Cargar estado desde localStorage al iniciar
  useEffect(() => {
    const savedProfileJson = localStorage.getItem(ACTIVE_PROFILE_KEY);
    const savedCategoryJson = localStorage.getItem(SELECTED_CATEGORY_KEY);
    const savedAllCategoriesJson = localStorage.getItem(ALL_CATEGORIES_KEY);

    if (savedProfileJson) {
      try {
        const savedProfile: UserProfile = JSON.parse(savedProfileJson);
        setCurrentProfile(savedProfile.displayName);
      } catch (e) {
        console.error("Error parsing profile", e);
        localStorage.removeItem(ACTIVE_PROFILE_KEY);
      }
    }
    
    if (savedCategoryJson) {
       try {
        const savedCategory: UserCategory = JSON.parse(savedCategoryJson);
        setSelectedCategoryState(savedCategory);
      } catch (e) {
        console.error("Error parsing selected category", e);
        localStorage.removeItem(SELECTED_CATEGORY_KEY);
      }
    }

    if (savedAllCategoriesJson) {
       try {
        const allCats: UserCategory[] = JSON.parse(savedAllCategoriesJson);
        setAllCategories(allCats);
      } catch (e) {
        console.error("Error parsing all categories", e);
        localStorage.removeItem(ALL_CATEGORIES_KEY);
      }
    }
  }, [])

  // Función para actualizar la categoría (y guardarla en localStorage)
  const setSelectedCategory = (category: UserCategory | null) => {
    setSelectedCategoryState(category);
    if (category) {
      localStorage.setItem(SELECTED_CATEGORY_KEY, JSON.stringify(category));
    } else {
      localStorage.removeItem(SELECTED_CATEGORY_KEY);
    }
  };

  // --- Lógica de Permisos ---
  const getPermissions = (): ProfilePermissions => {
    let profileType: string | null = null;
    if (typeof window !== 'undefined') {
        const savedProfileJson = localStorage.getItem(ACTIVE_PROFILE_KEY);
        if (savedProfileJson) {
            try {
                const savedProfile: UserProfile = JSON.parse(savedProfileJson);
                profileType = savedProfile.profileType;
            } catch (e) {
                console.error("Error parsing profile for permissions", e);
            }
        }
    }

    // Basado en el profileType (esto no cambia)
    const isTechnician = profileType?.includes("DIRECTOR TECNICO") || profileType?.includes("TECNICO");
    const isPhysicalTrainer = profileType?.includes("PREPARADOR FISICO");
    const isKinesiologist = profileType === "KINESIOLOGO";
    const isNutritionist = profileType === "NUTRICIONISTA";
    const isDirective = profileType?.includes("DIRECTIVO") || profileType?.includes("ANALISTA");
    const isPublisher = profileType === "PUBLICADOR";

     return {
      canEditClub: isTechnician || false,
      canEditPlayers: isTechnician || false,
      canCreateExercises: isTechnician || isPhysicalTrainer || isKinesiologist || false,
      canPlanTraining: !isNutritionist && !isPublisher, 
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
      sections: getSectionsForProfile(profileType),
    };
  };

  return (
    <ProfileContext.Provider
      value={{
        currentProfile,
        setCurrentProfile,
        selectedCategory,
        allCategories,
        setSelectedCategory,
        userPlan,
        setUserPlan,
        getPermissions,
      }}
    >
      {children}
    </ProfileContext.Provider>
  )
}

// --- Función para Secciones (para construir el Sidebar) ---
function getSectionsForProfile(profileType: string | null): string[] {
  if (!profileType) return [];

  const isTechnician = profileType.includes("DIRECTOR TECNICO") || profileType.includes("TECNICO");
  const isPhysicalTrainer = profileType.includes("PREPARADOR FISICO");
  const isKinesiologist = profileType === "KINESIOLOGO";
  const isNutritionist = profileType === "NUTRICIONISTA";
  const isDirective = profileType.includes("DIRECTIVO") || profileType.includes("ANALISTA"); 
  const isPublisher = profileType === "PUBLICADOR";

  const sections = ["INICIO"];

  if (isPublisher) {
    sections.push("PUBLICAR");
    return sections;
  }
  
  // [MODIFICACIÓN CLAVE]: Lógica específica para el Analista
  if (profileType === "ANALISTA") {
      sections.push("TORNEOS"); // Acceso al menú Torneos
      return sections;
  }

  // --- Lógica para todos los demás (DT, PF, KINE, NUTRI, Directivo)
  sections.push("CLUB");

  if (!isNutritionist) {
    sections.push("ENTRENAMIENTO");
  }

  sections.push("TORNEOS");

  if (isTechnician || isDirective) {
    sections.push("ESTADISTICAS");
  }

  if (isNutritionist) {
    sections.push("NUTRICION");
  }

  return sections;
}


// --- Hook useProfile (sin cambios) ---
export function useProfile() {
  const context = useContext(ProfileContext)
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider")
  }
  return context
}