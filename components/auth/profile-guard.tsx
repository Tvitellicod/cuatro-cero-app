"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useProfile } from "@/hooks/use-profile" 

interface ProfileGuardProps {
  children: React.ReactNode
}

// Claves consistentes para el estado
const ACTIVE_PROFILE_KEY = "userProfile";
const CLUB_DATA_KEY = "clubData"; 
const SELECTED_CATEGORY_KEY = "selectedCategory"; 

export function ProfileGuard({ children }: ProfileGuardProps) {
  const router = useRouter();
  // currentProfile se usa para verificar si el usuario tiene un perfil activo cargado en el contexto.
  const { currentProfile } = useProfile(); 
  const [isVerifying, setIsVerifying] = useState(true); 

  useEffect(() => {
    const path = window.location.pathname;
    
    // Permitir acceso a las rutas de configuración sin verificación
    if (path === '/create-club' || path === '/select-category' || path === '/select-profile') {
        setIsVerifying(false);
        return;
    }

    const savedClubJson = typeof window !== 'undefined' ? localStorage.getItem(CLUB_DATA_KEY) : null;
    const savedProfileJson = typeof window !== 'undefined' ? localStorage.getItem(ACTIVE_PROFILE_KEY) : null;
    const savedCategoryJson = typeof window !== 'undefined' ? localStorage.getItem(SELECTED_CATEGORY_KEY) : null;
    
    let clubExists = !!savedClubJson;
    let categoryExists = !!savedCategoryJson;
    let profileExists = !!currentProfile || !!savedProfileJson; 

    // Lógica principal de redirección
    if (isVerifying) {
        
        // FIX: Si un usuario accede a una ruta protegida (dashboard) sin un perfil activo,
        // pero con datos de club viejos (por el mock de localStorage), borramos los datos del club 
        // para forzar el inicio en el Paso 1. Esto simula un nuevo usuario en un entorno de prueba.
        if (!profileExists && clubExists) {
             console.warn("ProfileGuard: Profile missing but old Club data found. Clearing Club/Category data to force start at Paso 1 for new session simulation.");
             localStorage.removeItem(CLUB_DATA_KEY);
             localStorage.removeItem(SELECTED_CATEGORY_KEY);
             clubExists = false; // Forzar el fallo en el siguiente chequeo
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
        
        // 4. Si todo existe, conceder acceso al Dashboard.
        if (clubExists && categoryExists && profileExists) {
          console.log("ProfileGuard: Club, Category, and Profile found. Access granted.");
        }
      
      setIsVerifying(false);
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, currentProfile]); // currentProfile agregado para reaccionar al estado de autenticación
  
  // Lógica para reaccionar a un logout (currentProfile se vuelve null)
  useEffect(() => {
      // SOLO si no estamos en medio de una verificación y el perfil se perdió:
      if (!isVerifying && !currentProfile) {
          const clubExists = !!(typeof window !== 'undefined' && localStorage.getItem(CLUB_DATA_KEY));
          
          // Si hay club, el flujo debe reanudar en selección de categoría (Comportamiento deseado para usuarios que comparten club)
          if (clubExists) {
              router.replace("/select-category");
          } else {
              // Si no hay club, debe reanudar en creación de club
               router.replace("/create-club");
          }
      }
  }, [currentProfile, isVerifying, router]);


  // Muestra "Cargando..." mientras se realiza la verificación inicial
  if (isVerifying) {
    return (
      <div className="min-h-screen bg-[#1d2834] flex items-center justify-center">
        <div className="text-white">Cargando perfil...</div>
      </div>
    );
  }

  // Si no estamos verificando, el contenido se muestra.
  if (currentProfile) {
    return <>{children}</>;
  }

  // Si la verificación terminó y estamos en una ruta de selección, permite renderizar la página.
  if (window.location.pathname === '/create-club' || window.location.pathname === '/select-category' || window.location.pathname === '/select-profile') {
      return <>{children}</>;
  }
  
  return null;
}