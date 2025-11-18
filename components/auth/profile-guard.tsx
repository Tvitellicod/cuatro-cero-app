// components/auth/profile-guard.tsx

"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useProfile } from "@/hooks/use-profile" 

interface ProfileGuardProps {
  children: React.ReactNode
}

// Claves consistentes para el estado (CORREGIDAS)
const ACTIVE_PROFILE_KEY = "userProfile"; 
const CLUB_DATA_KEY = "4c_club"; // <-- CLAVE CORREGIDA PARA COINCIDIR CON use-profile.tsx
const SELECTED_CATEGORY_KEY = "selectedCategory"; 

export function ProfileGuard({ children }: ProfileGuardProps) {
  const router = useRouter();
  // Usamos el perfil del contexto
  const { profile: currentProfileInContext, isLoading } = useProfile(); 
  const [isVerifying, setIsVerifying] = useState(true); 

  useEffect(() => {
    const path = window.location.pathname;
    
    // Permitir acceso a las rutas de configuración sin verificación
    if (path === '/create-club' || path === '/select-category' || path === '/select-profile') {
        setIsVerifying(false);
        return;
    }

    // Esperar a que el hook useProfile termine de cargar el estado de localStorage
    if (isLoading) {
        return;
    }

    // Leemos las claves directamente del localStorage para la lógica de redirección
    const savedClubJson = typeof window !== 'undefined' ? localStorage.getItem(CLUB_DATA_KEY) : null;
    const savedCategoryJson = typeof window !== 'undefined' ? localStorage.getItem(SELECTED_CATEGORY_KEY) : null;
    const savedProfileJson = typeof window !== 'undefined' ? localStorage.getItem(ACTIVE_PROFILE_KEY) : null;
    
    let clubExists = !!savedClubJson;
    let categoryExists = !!savedCategoryJson;
    let profileExists = !!currentProfileInContext || !!savedProfileJson; 

    // Lógica principal de redirección
    if (isVerifying) {
        
        // Si no hay perfil, forzamos la limpieza de claves para asegurar el inicio del flujo
        if (!profileExists && (clubExists || categoryExists)) {
             console.warn("ProfileGuard: Profile missing but Club/Category data found. Clearing data to force start at Paso 1 for new session simulation.");
             localStorage.removeItem(CLUB_DATA_KEY);
             localStorage.removeItem(SELECTED_CATEGORY_KEY);
             clubExists = false; 
             categoryExists = false;
        }
        
        // 1. Verificar el CLUB (Paso 1)
        if (!clubExists) {
          console.log("ProfileGuard: Club not found. Redirecting to /create-club...");
          router.replace("/create-club");
          return; 
        }
        
        // 2. Verificar la CATEGORÍA (Paso 2)
        if (clubExists && !categoryExists) {
          console.log("ProfileGuard: Club found, but category not found. Redirecting to /select-category...");
          router.replace("/select-category");
          return; 
        }
        
        // 3. Verificar el PERFIL (Paso 3)
        if (clubExists && categoryExists && !profileExists) {
          console.log("ProfileGuard: Club and Category found, but profile not found. Redirecting to /select-profile...");
          router.replace("/select-profile");
          return;
        }
      
      setIsVerifying(false);
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, router, currentProfileInContext]);
  
  // Lógica para reaccionar a un logout
  useEffect(() => {
      if (!isVerifying && !currentProfileInContext) {
          const clubExists = !!(typeof window !== 'undefined' && localStorage.getItem(CLUB_DATA_KEY));
          
          if (clubExists) {
              router.replace("/select-category");
          } else {
               router.replace("/create-club");
          }
      }
  }, [currentProfileInContext, isVerifying, router]);


  // Muestra "Cargando..." mientras se realiza la verificación inicial o carga del perfil
  if (isVerifying || isLoading) {
    return (
      <div className="min-h-screen bg-[#1d2834] flex items-center justify-center">
        <div className="text-white">Cargando perfil...</div>
      </div>
    );
  }

  // Si la verificación terminó y estamos en una ruta de selección o el perfil existe, permite el render.
  if (currentProfileInContext || window.location.pathname === '/create-club' || window.location.pathname === '/select-category' || window.location.pathname === '/select-profile') {
    return <>{children}</>;
  }
  
  return null;
}