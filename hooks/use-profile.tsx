// hooks/use-profile.tsx

"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useMemo } from "react"
import { toast } from "sonner"
// import { v4 as uuidv4 } from "uuid"; // <-- DEPENDENCIA ELIMINADA: CAUSA EL ERROR
import { getLimits, PlanKey } from "@/lib/limits"

// --- FUNCIÓN DE ID TEMPORAL (SUSTITUTO DE UUID PARA EL MOCK) ---
const generateMockId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);
// -----------------------------------------------------------


// --- INTERFACES ---
interface UserCategory {
  id: string; 
  name: string;
  color: string;
}

// Definiciones de Tipos (Mantenidas y modificadas para incluir el 'plan')

export type Club = {
  id: string;
  name: string;
  logoUrl: string;
  isDemo: boolean;
};

export type Profile = {
  id: string;
  name: string;
  role: string;
  clubId: string;
  plan: PlanKey; // Propiedad 'plan' AÑADIDA
};

export type Category = {
  id: string;
  clubId: string;
  name: string;
  ageGroup: string;
  isDemo: boolean;
};

export type Player = {
  id: string;
  categoryId: string;
  name: string;
  birthDate: string;
  position: string;
  number: number;
  isDemo: boolean;
  injuryStatus: "FIT" | "INJURED";
  injuryDetails?: string;
  // Campos extra añadidos para evitar errores de tipo en ClubManagement.tsx
  photo: string;
  nickname: string;
  phoneNumber: string;
  foot: string;
};


// Definición de Tipos para el Contexto

type ProfileContextType = {
  // Datos principales
  profile: Profile | null;
  club: Club | null;
  categories: Category[];
  players: Player[];
  // Funciones de modificación
  setProfile: (profile: Profile) => void;
  setClub: (club: Club) => void;
  addCategory: (category: Omit<Category, "id" | "clubId" | "isDemo">) => void;
  addPlayer: (player: Omit<Player, "id" | "isDemo" | "injuryStatus">) => void;
  updatePlayer: (playerId: string, data: Partial<Player>) => void;
  deleteCategory: (categoryId: string) => void;
  deletePlayer: (playerId: string) => void;
  // Estado de carga y demo
  isAuthenticated: boolean;
  isLoading: boolean;
  // LÍMITES Y USO DEL PLAN (NUEVAS PROPIEDADES)
  limits: ReturnType<typeof getLimits>;
  usedPlayersCount: number;
  usedCategoriesCount: number;
  // Limpieza
  clearProfileData: () => void;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

// --- Claves de LocalStorage (Actualizadas para usar prefijo simple '4c_') ---
const CLUB_STORAGE_KEY = "4c_club";
const PROFILE_STORAGE_KEY = "4c_profile";
const CATEGORIES_STORAGE_KEY = "4c_categories";
const PLAYERS_STORAGE_KEY = "4c_players";
// -------------------------------------------------------------------------

// Mocks vacíos para iniciar la app limpia
const initialClub: Club | null = null;
const initialProfile: Profile | null = null;
const initialCategories: Category[] = [];
const initialPlayers: Player[] = [];

// Proveedor de Contexto

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfileState] = useState<Profile | null>(initialProfile);
  const [club, setClubState] = useState<Club | null>(initialClub);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Cargar datos del localStorage al montar
  useEffect(() => {
    try {
      const storedClub = localStorage.getItem(CLUB_STORAGE_KEY);
      const storedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
      const storedCategories = localStorage.getItem(CATEGORIES_STORAGE_KEY);
      const storedPlayers = localStorage.getItem(PLAYERS_STORAGE_KEY);

      if (storedClub) {
        setClubState(JSON.parse(storedClub));
      }
      if (storedProfile) {
        setProfileState(JSON.parse(storedProfile));
      }
      // NOTA: Cargamos lo que haya, si el login lo limpió (previo), serán arrays vacíos
      if (storedCategories) {
          setCategories(JSON.parse(storedCategories));
      }
      if (storedPlayers) {
          setPlayers(JSON.parse(storedPlayers));
      }
    } catch (error) {
      console.error("Error loading initial data from localStorage:", error);
      clearProfileData();
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 2. Persistencia de datos al cambiar el estado
  useEffect(() => {
    if (club) localStorage.setItem(CLUB_STORAGE_KEY, JSON.stringify(club));
  }, [club]);

  useEffect(() => {
    if (profile) localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(PLAYERS_STORAGE_KEY, JSON.stringify(players));
  }, [players]);


  // 3. Funciones de actualización

  const clearProfileData = () => {
    localStorage.removeItem(CLUB_STORAGE_KEY);
    localStorage.removeItem(PROFILE_STORAGE_KEY);
    localStorage.removeItem(CATEGORIES_STORAGE_KEY);
    localStorage.removeItem(PLAYERS_STORAGE_KEY);
    // Limpieza de datos viejos que podrían causar conflicto con el ProfileGuard (previo al plan)
    localStorage.removeItem("userProfile"); 
    localStorage.removeItem("selectedCategory");
    localStorage.removeItem("allUserCategories"); 
    localStorage.removeItem("allUserProfiles"); 
    localStorage.removeItem("clubData"); 
    
    setClubState(initialClub);
    setProfileState(initialProfile);
    setCategories(initialCategories);
    setPlayers(initialPlayers);
    // No mostramos toast aquí, el login-form lo maneja.
  };

  const setProfile = (newProfile: Profile) => {
    const profileWithPlan = {
      ...newProfile,
      plan: newProfile.plan || 'tecnico',
    } as Profile;
    setProfileState(profileWithPlan);
  };

  const setClub = (newClub: Club) => {
    setClubState(newClub);
  };
  
  const addCategory = (categoryData: Omit<Category, "id" | "clubId" | "isDemo">) => {
    if (!club) return toast.error("Club no encontrado. No se puede crear la categoría.");

    // Validación de Límite de Categorías
    if (usedCategoriesCount >= limits.MAX_CATEGORIES) {
        toast.error(`Límite alcanzado: Su plan solo permite ${limits.MAX_CATEGORIES} categorías.`);
        return;
    }

    const newCategory: Category = {
      id: generateMockId(), // <-- USO DE ID TEMPORAL
      clubId: club.id,
      name: categoryData.name,
      ageGroup: categoryData.ageGroup,
      isDemo: club.isDemo,
      // Color debe venir de categoryData si lo expandimos
      color: (categoryData as any).color, 
    };
    setCategories((prev) => [...prev, newCategory]);
    toast.success("Categoría creada con éxito.");
  };

  // NOTA: addPlayer espera un objeto con las propiedades definidas en ContextPlayer, incluyendo photo, nickname, etc.
  const addPlayer = (playerData: Omit<Player, "id" | "isDemo" | "injuryStatus">) => {
    if (!profile || !club) return toast.error("Error de perfil/club. No se puede crear el jugador.");

    // Validación de Límite de Jugadores
    if (usedPlayersCount >= limits.MAX_PLAYERS) {
        toast.error(`Límite alcanzado: Su plan solo permite ${limits.MAX_PLAYERS} jugadores.`);
        return;
    }

    const newPlayer: Player = {
      ...playerData,
      id: generateMockId(), // <-- USO DE ID TEMPORAL
      number: playerData.number || 0,
      isDemo: club.isDemo,
      injuryStatus: "FIT", // Estado inicial
      // Aseguramos que los campos obligatorios del tipo Player existan
      photo: playerData.photo || "/placeholder-user.jpg",
      nickname: playerData.nickname || "",
      phoneNumber: playerData.phoneNumber || "",
      foot: playerData.foot || "Derecho",
    };

    setPlayers((prev) => [...prev, newPlayer]);
    toast.success(`Jugador ${newPlayer.name} añadido.`);
  };

  const updatePlayer = (playerId: string, data: Partial<Player>) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === playerId ? { ...p, ...data } : p))
    );
  };

  const deleteCategory = (categoryId: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== categoryId));
    setPlayers((prev) => prev.filter((p) => p.categoryId !== categoryId));
    toast.success("Categoría y sus jugadores eliminados.");
  };

  const deletePlayer = (playerId: string) => {
    setPlayers((prev) => prev.filter((p) => p.id !== playerId));
    toast.success("Jugador eliminado.");
  };

  // 4. Lógica de LÍMITES

  const limits = useMemo(() => {
    if (profile) {
      return getLimits(profile.plan);
    }
    return getLimits("tecnico");
  }, [profile]);

  const usedCategoriesCount = categories.length;
  const usedPlayersCount = players.length;
  
  // 5. Contexto

  const value = {
    profile,
    club,
    categories,
    players,
    setProfile,
    setClub,
    addCategory,
    addPlayer,
    updatePlayer,
    deleteCategory,
    deletePlayer,
    isAuthenticated: !!profile && !!club,
    isLoading,
    clearProfileData,
    limits,
    usedPlayersCount,
    usedCategoriesCount,
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};

// Hook personalizado
export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile debe usarse dentro de un ProfileProvider")
  }
  return context
}