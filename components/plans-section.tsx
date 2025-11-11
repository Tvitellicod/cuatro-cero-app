"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Users } from "lucide-react"
import { supabase, isSupabaseConfigured } from "@/lib/supabase" // <-- Importar Supabase

export function PlansSection() {
  const plans = [
     {
      name: "TÉCNICO",
      price: "$29",
      period: "/mes",
      description: "Perfecto para entrenadores individuales",
      features: [
        "Gestión de 1 equipo",
        "Hasta 25 jugadores",
        "Planificación de entrenamientos",
        "Estadísticas básicas",
        "Soporte por email",
      ],
      popular: false,
      color: "bg-[#213041]",
      id: "tecnico", // <-- Usaremos este ID para consultar
    },
    {
      name: "CUERPO TÉCNICO",
      price: "$59",
      period: "/mes",
      description: "Ideal para cuerpos técnicos completos",
      features: [
        "Gestión de 3 equipos",
        "Hasta 75 jugadores",
        "Planificación avanzada",
        "Estadísticas completas",
        "Análisis de rendimiento",
        "Soporte prioritario",
      ],
      popular: true,
      color: "bg-[#213041]",
      id: "cuerpo_tecnico", // <-- Usaremos este ID para consultar
    },
    {
      name: "INSTITUCIONAL",
      price: "$99",
      period: "/mes",
      description: "Para clubes e instituciones",
      features: [
        "Equipos ilimitados",
        "Jugadores ilimitados",
        "Múltiples categorías",
        "Dashboard institucional",
        "Reportes avanzados",
        "API personalizada",
        "Soporte 24/7",
      ],
      popular: false,
      color: "bg-[#213041]",
      id: "institucional", // <-- Usaremos este ID para consultar
    },
  ]

  // Estado inicial para los contadores
  const [planCounts, setPlanCounts] = useState({
    tecnico: 0,
    cuerpo_tecnico: 0,
    institucional: 0,
  })
  const [isLoadingCounts, setIsLoadingCounts] = useState(true); // Estado de carga

  // useEffect para obtener los datos reales de Supabase
  useEffect(() => {
    const fetchPlanCounts = async () => {
      // Si Supabase no está configurado, mantenemos los números de simulación anteriores
      if (!isSupabaseConfigured()) {
        console.warn("Supabase no configurado, usando datos de simulación para contadores.");
        setPlanCounts({ tecnico: 123, cuerpo_tecnico: 456, institucional: 78 });
        setIsLoadingCounts(false);
        return;
      }

      setIsLoadingCounts(true);
      try {
        const counts = {
          tecnico: 0,
          cuerpo_tecnico: 0,
          institucional: 0,
        };

        // Hacemos una consulta por cada plan
        for (const plan of plans) {
          // Usamos el ID del plan que coincide con `subscription_plan` en la tabla users
          const { count, error } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true })
            .eq('subscription_plan', plan.id)
            .eq('subscription_status', 'active'); // Contamos solo suscripciones activas

          if (error) {
            console.error(`Error fetching count for plan ${plan.id}:`, error);
          } else {
            counts[plan.id as keyof typeof counts] = count ?? 0;
          }
        }
        setPlanCounts(counts);
      } catch (error) {
        console.error("Error general fetching plan counts:", error);
        // Podrías mantener los valores en 0 o mostrar un mensaje de error
      } finally {
        setIsLoadingCounts(false);
      }
    };

    fetchPlanCounts();
    // Ya no necesitamos el intervalo de simulación
    // El array de dependencias vacío [] asegura que se ejecute solo una vez al montar
  }, []);


  return (
    <div className="max-w-6xl mx-auto px-4 mb-2 mt-2">
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">Planes de Gestión</h1>
        <p className="text-lg md:text-xl text-gray-300 mb-6 px-2">
          Elige el plan que mejor se adapte a tus necesidades
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-2">
         {plans.map((plan, index) => (
          <Card
            key={index}
            className={`${plan.color} border-[#305176] relative flex flex-col ${plan.popular ? "ring-2 ring-[#aff606]" : ""}`}
          >
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#aff606] text-black">
                Más Popular
              </Badge>
            )}

            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl md:text-2xl font-bold text-white mb-2">{plan.name}</CardTitle>
              <div className="mb-4">
                <span className="text-3xl md:text-4xl font-bold text-[#aff606]">{plan.price}</span>
                <span className="text-gray-400">{plan.period}</span>
              </div>
              <p className="text-gray-400 text-sm">{plan.description}</p>
            </CardHeader>

            <CardContent className="pt-0 flex-1 flex flex-col">
              <ul className="space-y-3 mb-2.5 flex-1">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <Check className="h-4 w-4 md:h-5 md:w-5 text-[#25d03f] mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-2.5 mb-1">
                <Button variant="primary"
                  className={`w-full text-lg ${
                    plan.popular
                      ? "bg-[#aff606] text-black hover:bg-[#25d03f]"
                      : "bg-[#305176] text-white hover:bg-[#aff606] hover:text-black"
                  }`}
                >
                  ¡Quiero este!
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-[#213041] border border-[#305176] rounded-lg p-4 w-full mb-2 px-4 sm:px-16 mt-6 py-5">
         {/* MODIFICACIÓN CLAVE DE LAYOUT AQUÍ */}
         <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          
          <div className="flex-1 text-center md:text-left">
            {/* El texto completo ahora ocupa todo el ancho en móvil y se centra */}
            <h3 className="text-lg font-semibold text-white mb-1">
              ¿No sabes cual es tu plan ideal? Nosotros te ayudamos!
            </h3>
          </div>
          
          <div className="w-full md:w-auto flex-shrink-0">
            {/* El botón se mueve debajo del texto y usa todo el ancho en móvil */}
            <Button
              className="w-full bg-[#aff606] text-black hover:bg-[#25d03f] px-6 rounded-lg font-semibold py-7"
              onClick={() => window.open("https://wa.me/5491112345678", "_blank")}
            >
              Mandanos un mensaje
            </Button>
          </div>
          
        </div>
      </div>

      {/* --- SECCIÓN DE CONTADORES (MODIFICADA PARA MOSTRAR DATOS REALES) --- */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-white mb-4 text-center">Usuarios Activos por Plan</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <Card key={plan.id} className="bg-[#1d2834] border-[#305176] text-center">
              <CardContent className="p-4">
                <Users className="h-8 w-8 text-[#aff606] mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-400 mb-1">{plan.name}</p>
                <p className="text-3xl font-bold text-white">
                  {/* Muestra "Cargando..." o el número */}
                  {isLoadingCounts ? "..." : (planCounts[plan.id as keyof typeof planCounts] ?? 0)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      {/* --- FIN SECCIÓN MODIFICADA --- */}

    </div>
  )
}