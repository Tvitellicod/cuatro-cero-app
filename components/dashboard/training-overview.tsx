"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dumbbell, Target, Users, TrendingUp, Calendar } from "lucide-react"
import Link from "next/link"

export function TrainingOverview() {
  // Obtener el perfil del usuario
  const savedProfile = typeof window !== "undefined" ? localStorage.getItem("userProfile") : null
  const profileData = savedProfile ? JSON.parse(savedProfile) : null
  const profileType = profileData?.profileType

  const getAvailableOptions = () => {
    const options = []

    if (profileType === "DIRECTOR TECNICO") {
      options.push({
        title: "Ejercicios",
        description: "Gestiona ejercicios reutilizables para entrenamientos",
        icon: Target,
        href: "/dashboard/entrenamiento/ejercicios",
        color: "bg-blue-500",
      })
    }

    if (profileType === "PREPARADOR FISICO") {
      options.push(
        {
          title: "Ejercicios Físicos",
          description: "Gestiona ejercicios de preparación física",
          icon: Dumbbell,
          href: "/dashboard/entrenamiento/ejercicios-fisicos",
          color: "bg-green-500",
        },
        {
          title: "Ejercicios Kinesiología",
          description: "Gestiona ejercicios de kinesiología y rehabilitación",
          icon: Users,
          href: "/dashboard/entrenamiento/ejercicios-kinesiologia",
          color: "bg-purple-500",
        },
      )
    }

    if (profileType === "KINESIOLOGO") {
      options.push({
        title: "Ejercicios Kinesiología",
        description: "Gestiona ejercicios de kinesiología y rehabilitación",
        icon: Users,
        href: "/dashboard/entrenamiento/ejercicios-kinesiologia",
        color: "bg-purple-500",
      })
    }

    // Planificar entrenamiento está disponible para todos los perfiles de entrenamiento
    options.push({
      title: "Planificar Entrenamiento",
      description: "Crea y programa entrenamientos para tu equipo",
      icon: Calendar,
      href: "/dashboard/entrenamiento/planificar",
      color: "bg-[#aff606]",
    })

    return options
  }

  const availableOptions = getAvailableOptions()

  const stats = [
    {
      title: "Entrenamientos esta semana",
      value: "4",
      icon: Calendar,
      color: "text-blue-400",
    },
    {
      title: "Ejercicios creados",
      value: "23",
      icon: Target,
      color: "text-green-400",
    },
    {
      title: "Promedio asistencia",
      value: "87%",
      icon: TrendingUp,
      color: "text-[#aff606]",
    },
    {
      title: "Jugadores activos",
      value: "22",
      icon: Users,
      color: "text-purple-400",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Entrenamiento</h2>
        <p className="text-gray-400">Gestiona todos los aspectos del entrenamiento de tu equipo</p>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-[#213041] border-[#305176]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Opciones disponibles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableOptions.map((option, index) => (
          <Card key={index} className="bg-[#213041] border-[#305176] hover:border-[#aff606] transition-colors">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg ${option.color}`}>
                  <option.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white">{option.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-4">{option.description}</p>
              <Link href={option.href}>
                <Button className="w-full bg-[#aff606] text-black hover:bg-[#25d03f]">Acceder</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Entrenamientos recientes */}
      <Card className="bg-[#213041] border-[#305176]">
        <CardHeader>
          <CardTitle className="text-white">Entrenamientos Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                date: "2024-01-15",
                time: "16:00",
                category: "Primera División",
                exercises: 4,
                attendance: "20/22",
              },
              {
                date: "2024-01-14",
                time: "18:00",
                category: "Primera División",
                exercises: 3,
                attendance: "21/22",
              },
              {
                date: "2024-01-13",
                time: "16:00",
                category: "Primera División",
                exercises: 5,
                attendance: "19/22",
              },
            ].map((training, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-[#1d2834] rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <p className="text-white font-medium">{training.date}</p>
                    <p className="text-gray-400 text-sm">{training.time}</p>
                  </div>
                  <div>
                    <p className="text-white font-medium">{training.category}</p>
                    <p className="text-gray-400 text-sm">{training.exercises} ejercicios</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[#aff606] font-medium">{training.attendance}</p>
                  <p className="text-gray-400 text-sm">Asistencia</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
