"use client"

import { useState, useEffect } from "react" // <-- Añadir useEffect
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Users } from "lucide-react" // <-- Añadir Users

export function PlansSection() {
  const plans = [
    // ... (contenido de los planes sin cambios) ...
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
      id: "tecnico", // <-- Añadir IDs para la simulación
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
      id: "cuerpo_tecnico", // <-- Añadir IDs para la simulación
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
      id: "institucional", // <-- Añadir IDs para la simulación
    },
  ]

  // Estado para los contadores (simulados)
  const [planCounts, setPlanCounts] = useState({
    tecnico: 123,
    cuerpo_tecnico: 456,
    institucional: 78,
  })

  // Simulación de actualización en tiempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setPlanCounts(prevCounts => ({
        tecnico: prevCounts.tecnico + Math.floor(Math.random() * 3) - 1, // Cambia +/- 1
        cuerpo_tecnico: prevCounts.cuerpo_tecnico + Math.floor(Math.random() * 3) - 1,
        institucional: prevCounts.institucional + Math.floor(Math.random() * 3) - 1,
      }))
    }, 3000) // Actualiza cada 3 segundos

    return () => clearInterval(interval) // Limpia el intervalo al desmontar
  }, [])


  return (
    <div className="max-w-6xl mx-auto px-4 mb-2 mt-2">
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">Planes de Gestión</h1>
        <p className="text-lg md:text-xl text-gray-300 mb-6 px-2">
          Elige el plan que mejor se adapte a tus necesidades
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-2">
        {/* ... (mapeo de los planes sin cambios) ... */}
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

              {/* Botón con 10px por debajo del último texto y 4px por encima del final de la card */}
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

      {/* Div de ayuda */}
      <div className="bg-[#213041] border border-[#305176] rounded-lg p-4 w-full mb-2 px-16 mt-6 py-5">
        {/* ... (contenido del div de ayuda sin cambios) ... */}
         <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-1">
              ¿No sabes cual es tu plan ideal? Nosotros te ayudamos!
            </h3>
          </div>
          <div className="ml-6">
            <Button
              className="bg-[#aff606] text-black hover:bg-[#25d03f] px-6 rounded-lg font-semibold py-7"
              onClick={() => window.open("https://wa.me/5491112345678", "_blank")}
            >
              Mandanos un mensaje
            </Button>
          </div>
        </div>
      </div>

      {/* --- NUEVA SECCIÓN DE CONTADORES --- */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-white mb-4 text-center">Usuarios Activos por Plan</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <Card key={plan.id} className="bg-[#1d2834] border-[#305176] text-center">
              <CardContent className="p-4">
                <Users className="h-8 w-8 text-[#aff606] mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-400 mb-1">{plan.name}</p>
                <p className="text-3xl font-bold text-white">
                  {/* Aseguramos que la clave exista antes de accederla */}
                  {planCounts[plan.id as keyof typeof planCounts] !== undefined
                    ? planCounts[plan.id as keyof typeof planCounts]
                    : 0}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      {/* --- FIN NUEVA SECCIÓN --- */}

    </div>
  )
}