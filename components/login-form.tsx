// components/login-form.tsx

"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { isSupabaseConfigured } from "@/lib/supabase"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { DEMO_ACCOUNTS, PlanKey } from "@/lib/limits" // <-- Importa las cuentas corregidas
import { useProfile } from "@/hooks/use-profile"


// --- MOCK DATA NECESARIA PARA SALTAR EL PROFILE GUARD (Paso 1 y 2) ---
const MOCK_CLUB_ID = "mock_club_test";
const MOCK_CATEGORY_ID = "mock_category_test";

// Claves consistentes para el estado
const CLUB_DATA_KEY = "clubData"; 
const SELECTED_CATEGORY_KEY = "selectedCategory"; 
const ACTIVE_PROFILE_KEY = "userProfile"; 
// --------------------------------------------------------------------

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { signIn, signUp } = useAuth()
  const { setProfile, clearProfileData } = useProfile()
  const router = useRouter()

  // --- FUNCIÓN CENTRAL DE LOGIN DEMO ---
  const handleDemoLogin = (email: string, password: string) => {
    // 1. Encontrar cuenta de demo por email
    const demoAccountEntry = Object.values(DEMO_ACCOUNTS).find(
      (account) => account.email === email
    );

    if (!demoAccountEntry) {
      // CORRECCIÓN: Si el usuario intenta usar un email de registro en demo, no lo permitimos
      setError("Usuario demo no encontrado. Solo se permiten las cuentas de prueba.");
      return false;
    }

    if (password !== demoAccountEntry.password) {
      setError("Contraseña incorrecta.");
      return false;
    }
    
    // 2. Éxito de login: Limpiar datos anteriores y configurar mocks
    clearProfileData(); 

    // A. Mockear datos de Club y Categoría para satisfacer el ProfileGuard (Paso 1 y 2)
    const mockClubData = {
        id: MOCK_CLUB_ID,
        name: `${demoAccountEntry.plan.toUpperCase()} Test Club`,
        abbreviation: demoAccountEntry.plan.toUpperCase().slice(0, 3),
        logoUrl: "/images/cuatro-cero-logo.png",
    };
    const mockCategoryData = {
        id: MOCK_CATEGORY_ID,
        name: `Categoría ${demoAccountEntry.plan.toUpperCase()}`,
        color: "#aff606",
    };
    
    localStorage.setItem(CLUB_DATA_KEY, JSON.stringify(mockClubData));
    localStorage.setItem(SELECTED_CATEGORY_KEY, JSON.stringify(mockCategoryData));

    // B. Crear objeto de perfil para guardar en localStorage
    const mockProfile = {
        id: Date.now(),
        firstName: demoAccountEntry.role.split(' ')[0],
        lastName: 'Test',
        profileType: demoAccountEntry.role,
        category: MOCK_CATEGORY_ID,
        displayName: `${demoAccountEntry.role.split(' ')[0]} Test - ${demoAccountEntry.role} (${mockCategoryData.name})`,
        plan: demoAccountEntry.plan as PlanKey, 
    };
    
    localStorage.setItem(ACTIVE_PROFILE_KEY, JSON.stringify(mockProfile));

    // C. Redirigimos al dashboard, el ProfileGuard permitirá el acceso.
    router.push("/dashboard");

    return true;
  };
  
  // --- FUNCIÓN DE SUBMIT ---
  const handleSubmit = async (e: React.FormEvent, isSignUp = false) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(e.target as HTMLFormElement)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const fullName = formData.get("fullName") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (isSignUp && password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      setIsLoading(false)
      return
    }

    // --- Lógica de Modo Demo ---
    if (!isSupabaseConfigured()) {
      setTimeout(() => {
        setIsLoading(false);
        // Llama a la función de login demo para manejar la autenticación
        handleDemoLogin(email, password);
      }, 1000);
      return;
    }

    // --- Lógica de Supabase Real ---
    try {
      let result
      if (isSignUp) {
        result = await signUp(email, password, fullName || email.split("@")[0])
      } else {
        result = await signIn(email, password)
      }

      if (result.error) {
        setError(result.error.message)
      } else {
        // En Supabase real, siempre vamos a seleccionar categoría/perfil
        router.push("/select-category"); 
      }
    } catch (err) {
      setError("Ha ocurrido un error inesperado")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#1d2834] flex items-center justify-center p-4 pt-8">
      <Card className="w-full max-w-md mx-4 bg-[#213041] border-[#305176]">
        <CardHeader className="text-center px-4 md:px-6">
          <div className="flex justify-center mb-4">
            <img
              src="/images/cuatro-cero-logo.png"
              alt="CUATRO CERO - Gestión de Equipo"
              className="h-[3.14rem] md:h-[4.19rem] w-auto"
            />
          </div>
          <CardTitle className="text-white text-lg md:text-xl">Acceso a la App Web</CardTitle>
        </CardHeader>
        <CardContent className="px-4 md:px-6">
          {!isSupabaseConfigured() && (
            <Alert className="mb-4 bg-[#f4c11a] border-[#f4c11a] text-black">
              <AlertDescription>
                <strong>Modo Demo:</strong> Usa las cuentas de prueba: 
                <ul className="list-disc ml-4 mt-2 text-sm">
                    <li>tecnico@4c.com (Técnico / Límite)</li>
                    <li>cuerpo@4c.com (PF / Límite)</li>
                    <li>institucional@4c.com (Directivo / Ilimitado)</li>
                    <li>cuatrocero@gmail.com (Publicador)</li>
                </ul>
                Contraseña para todas: `pass123` (excepto Publicador: `Chata202`).
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert className="mb-4 bg-red-500 border-red-500 text-white">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-[#1d2834] mb-6">
              <TabsTrigger
                value="login"
                className="data-[state=active]:bg-[#aff606] data-[state=active]:text-black text-sm"
              >
                Iniciar Sesión
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="data-[state=active]:bg-[#aff606] data-[state=active]:text-black text-sm"
              >
                Registrarse
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white text-sm">
                    Correo electrónico
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="tu@email.com"
                    className="bg-[#1d2834] border-[#305176] text-white h-11"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white text-sm">
                    Contraseña
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    className="bg-[#1d2834] border-[#305176] text-white h-11"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[#aff606] text-black hover:bg-[#25d03f] h-11"
                  disabled={isLoading}
                >
                  {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={(e) => handleSubmit(e, true)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-white text-sm">
                    Nombre completo
                  </Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Tu nombre completo"
                    className="bg-[#1d2834] border-[#305176] text-white h-11"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-email" className="text-white text-sm">
                    Correo electrónico
                  </Label>
                  <Input
                    id="reg-email"
                    name="email"
                    type="email"
                    placeholder="tu@email.com"
                    className="bg-[#1d2834] border-[#305176] text-white h-11"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password" className="text-white text-sm">
                    Contraseña
                  </Label>
                  <Input
                    id="reg-password"
                    name="password"
                    type="password"
                    className="bg-[#1d2834] border-[#305176] text-white h-11"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-white text-sm">
                    Confirmar contraseña
                  </Label>
                  <Input
                    id="confirm-password"
                    name="confirmPassword"
                    type="password"
                    className="bg-[#1d2834] border-[#305176] text-white h-11"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[#aff606] text-black hover:bg-[#25d03f] h-11"
                  disabled={isLoading}
                >
                  {isLoading ? "Registrando..." : "Registrarse"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="forgot-password">
              <form className="space-y-4">
                <p className="text-gray-400 text-sm">
                  Ingresa tu correo para recibir un enlace de restablecimiento.
                </p>
                <div className="space-y-2">
                  <Label htmlFor="reset-email" className="text-white text-sm">
                    Correo electrónico
                  </Label>
                  <Input
                    id="reset-email"
                    name="email"
                    type="email"
                    placeholder="tu@email.com"
                    className="bg-[#1d2834] border-[#305176] text-white h-11"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[#33d9f6] text-black hover:bg-[#2bc4ea] h-11"
                >
                  Enviar Enlace
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              ¿Problemas para acceder?{" "}
              <Button variant="link" className="text-[#aff606] p-0 h-auto text-sm">
                Contactar soporte
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}