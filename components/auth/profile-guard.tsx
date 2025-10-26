"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useProfile } from "@/hooks/use-profile" // <-- IMPORTADO

interface ProfileGuardProps {
  children: React.ReactNode
}

// Clave consistente para el perfil activo (para lectura inicial)
const ACTIVE_PROFILE_KEY = "userProfile";

export function ProfileGuard({ children }: ProfileGuardProps) {
  const router = useRouter();
  const { currentProfile } = useProfile(); // <-- USANDO EL CONTEXTO
  const [isVerifying, setIsVerifying] = useState(true); // Estado para la verificación inicial

  useEffect(() => {
    // Verificación inicial solo al montar el componente
    if (isVerifying) {
      console.log("ProfileGuard: Initial check running...");
      // Primero, intenta leer desde localStorage como respaldo inicial rápido
      const savedProfileJson = localStorage.getItem(ACTIVE_PROFILE_KEY);
      let profileExistsInitially = false;
      if (savedProfileJson) {
        try {
          JSON.parse(savedProfileJson);
          profileExistsInitially = true;
          console.log("ProfileGuard: Profile found in localStorage on initial mount.");
        } catch (e) {
          console.error("ProfileGuard: Invalid profile data found on initial mount. Clearing...", e);
          localStorage.removeItem(ACTIVE_PROFILE_KEY);
        }
      }

      // Si ni el contexto ni localStorage tienen perfil al inicio, redirige
      if (!currentProfile && !profileExistsInitially) {
        console.log("ProfileGuard: No profile in context or localStorage initially. Redirecting...");
        router.push("/create-profile");
      } else {
        // Si hay perfil (ya sea en contexto o localmente), marca como verificado
        console.log("ProfileGuard: Initial check passed (profile found in context or localStorage).");
        setIsVerifying(false);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Dependencia vacía para ejecutar solo al montar

  useEffect(() => {
    // Verificación continua basada en el estado del contexto
    // No redirigir si aún estamos en la verificación inicial
    if (!isVerifying) {
      console.log("ProfileGuard: Context check running. Current profile:", currentProfile);
      if (!currentProfile) {
        // Si el contexto se vacía DESPUÉS de la carga inicial (ej. logout), redirige
        console.log("ProfileGuard: Profile lost from context. Redirecting...");
        router.push("/create-profile");
      } else {
        // Si el perfil existe en el contexto, nos aseguramos de no estar cargando
        if (isVerifying) setIsVerifying(false); // Asegura que salgamos del estado de carga si el contexto ya tiene datos
      }
    }
  }, [currentProfile, router, isVerifying]); // Reacciona a cambios en el perfil del contexto

  // Muestra "Cargando..." mientras se realiza la verificación inicial
  if (isVerifying) {
    return (
      <div className="min-h-screen bg-[#1d2834] flex items-center justify-center">
        <div className="text-white">Cargando perfil...</div>
      </div>
    );
  }

  // Si la verificación terminó y hay un perfil en el contexto, muestra el contenido
  if (currentProfile) {
    return <>{children}</>;
  }

  // Si no está verificando y no hay perfil (ya fue redirigido), no renderiza nada más
  return null;
}