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

// CREDENCIALES DEL USUARIO PUBLICADOR (MODO DEMO)
const PUBLISHER_EMAIL = "cuatrocero@gmail.com";
const PUBLISHER_PASSWORD = "Chata202";
const PUBLISHER_PROFILE = {
    id: 9999,
    firstName: "Cuatro",
    lastName: "Cero",
    profileType: "PUBLICADOR",
    category: "primera", // Aunque publicador no use categoría, la necesita para el objeto
    displayName: "Cuatro Cero - Publicador",
};


export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { signIn, signUp } = useAuth()
  const router = useRouter()

  // --- FUNCIÓN CLAVE: FORZAR CIERRE DE SESIÓN EN MODO DEMO ---
  const clearDemoSession = () => {
      localStorage.removeItem("userProfile"); // <- Mantenemos esto por si acaso
      localStorage.removeItem("selectedProfile"); // Limpia el perfil seleccionado también
      localStorage.removeItem("activeProfile"); // <-- LIMPIAR EL NUEVO PERFIL ACTIVO
      // Opcional: Podrías limpiar el carrito si quieres sesiones totalmente aisladas
      // localStorage.removeItem("app_cart");
  };


  const handleDemoLogin = (email: string, isSignUp: boolean) => {
    // Si estamos en modo demo (Supabase no configurado)
    if (!isSupabaseConfigured()) {

      // *** 1. LIMPIAR SIEMPRE LA SESIÓN ANTERIOR ANTES DE CONTINUAR ***
      clearDemoSession();

      setTimeout(() => {
        setIsLoading(false)

        // 2. Verificar si es el usuario publicador
        if (email === PUBLISHER_EMAIL) {
            // Guardamos el perfil del publicador como 'activeProfile' también
            localStorage.setItem("activeProfile", JSON.stringify(PUBLISHER_PROFILE));
            // Redirige al dashboard directamente
            router.push("/dashboard");
            return;
        }

        // --- CORRECCIÓN: REDIRIGIR A /create-profile ---
        // Cualquier otro usuario demo va a crear/seleccionar perfil
        router.push("/create-profile"); // <-- ¡CAMBIO AQUÍ!
        // ------------------------------------

      }, 1000);
      return true; // Indica que manejamos el login demo
    }
    return false; // Indica que se debe usar el login de Supabase
  }


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
        // Manejo del usuario publicador en modo demo
        if (email === PUBLISHER_EMAIL) {
            if (password !== PUBLISHER_PASSWORD) {
                setError("Contraseña incorrecta para el usuario publicador demo.");
                setIsLoading(false);
                return;
            }
             handleDemoLogin(email, isSignUp); // Llama a la lógica demo del publicador
        } else {
             // Cualquier otro login/signup en modo demo va directo a handleDemoLogin
             handleDemoLogin(email, isSignUp);
        }
        return; // Detiene la ejecución aquí para el modo demo
    }

    // --- Lógica de Supabase Real (si está configurado) ---
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
        // --- CORRECCIÓN: REDIRIGIR A /create-profile ---
        // Siempre ir a crear/seleccionar perfil después de login/signup exitoso
        router.push("/create-profile"); // <-- ¡CAMBIO AQUÍ!
        // -----------------------------
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
                <strong>Modo Demo:</strong> Usa `cuatrocero@gmail.com` / `Chata202` para el perfil publicador. Los datos no se guardarán.
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