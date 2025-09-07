import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BarChart3, Users, Calendar, Trophy } from "lucide-react"
import Link from "next/link"

export function AppPreviewSection() {
  const features = [
    {
      icon: Users,
      title: "Gestión de Jugadores",
      description: "Administra tu plantilla completa con estadísticas detalladas",
    },
    {
      icon: Calendar,
      title: "Planificación de Entrenamientos",
      description: "Crea y organiza sesiones de entrenamiento personalizadas",
    },
    {
      icon: Trophy,
      title: "Seguimiento de Partidos",
      description: "Registra resultados y estadísticas en tiempo real",
    },
    {
      icon: BarChart3,
      title: "Análisis y Reportes",
      description: "Obtén insights valiosos sobre el rendimiento del equipo",
    },
  ]

  return (
    <section className="py-4 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 mt-0">App Web de Gestión de Equipos</h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto px-2">
            Lleva tu equipo al siguiente nivel con nuestras herramientas profesionales
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {features.map((feature, index) => (
            <Card key={index} className="bg-[#213041] border-[#305176]">
              <CardContent className="p-4 text-center">
                <feature.icon className="h-10 w-10 md:h-12 md:w-12 text-[#aff606] mx-auto mb-2" />
                <h3 className="text-base md:text-lg font-semibold text-white mb-1">{feature.title}</h3>
                <p className="text-gray-400 text-sm mt-0">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center px-4">
          <Link href="/gestion">
            <Button size="lg" className="bg-[#aff606] text-black hover:bg-[#25d03f] font-semibold w-full sm:w-auto my-2">
              Contratar Servicio
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
