"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dumbbell, Target, Users, TrendingUp, Calendar, PieChart, Clock, Trophy } from "lucide-react"
import Link from "next/link"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"


export function TrainingOverview() {
  const [showTrainingDetail, setShowTrainingDetail] = useState<any>(null)
  const [pieFilter, setPieFilter] = useState("lastSession")

  // Obtener el perfil del usuario para filtrar jugadores
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

  const trainingSessions = [
    {
      id: 1,
      name: "Entrenamiento Táctico - Ataque",
      date: "2024-01-16",
      duration: 90,
      exercises: [
        { name: "Ataque 4-3-3 por bandas", category: "Ataque", duration: 20, type: "Táctico" },
        { name: "Transición defensa-ataque", category: "Transiciones", duration: 18, type: "Táctico" },
        { name: "Presión alta coordinada", category: "Defensa", duration: 15, type: "Físico" },
        { name: "Tiros libres directos", category: "Balón Parado", duration: 12, type: "Táctico" },
        { name: "Salida con los pies", category: "Arquero-Jugador", duration: 25, type: "Físico" },
      ],
      category: "Primera División",
      focus: "Ataque Posicional",
      attendance: "20/22",
      path: "/dashboard/entrenamiento/planificar"
    },
    {
      id: 2,
      name: "Preparación Física - Resistencia",
      date: "2024-01-18",
      duration: 75,
      exercises: [
        { name: "Circuito de resistencia", category: "Físico", duration: 30, type: "Físico" },
        { name: "Sprints cortos", category: "Físico", duration: 20, type: "Físico" },
        { name: "Trabajo aeróbico", category: "Físico", duration: 25, type: "Físico" },
      ],
      category: "Primera División",
      focus: "Resistencia Aeróbica",
      attendance: "21/22",
      path: "/dashboard/entrenamiento/planificar"
    },
  ]

  const previousSessions = [
    {
      id: 3,
      name: "Entrenamiento Técnico",
      date: "2024-01-10",
      duration: 60,
      exercises: [
        { name: "Control y pase", category: "Técnico", duration: 20, type: "Técnico" },
        { name: "Definición", category: "Ataque", duration: 25, type: "Técnico" },
        { name: "Juego aéreo", category: "Defensa", duration: 15, type: "Técnico" },
      ],
      category: "Juveniles",
      focus: "Técnica Individual",
      attendance: "19/22"
    },
    {
      id: 4,
      name: "Trabajo Defensivo",
      date: "2024-01-08",
      duration: 80,
      exercises: [
        { name: "Marcaje individual", category: "Defensa", duration: 25, type: "Táctico" },
        { name: "Coberturas", category: "Defensa", duration: 20, type: "Táctico" },
        { name: "Salida jugada", category: "Defensa", duration: 35, type: "Táctico" },
      ],
      category: "Primera División",
      focus: "Presión Alta",
      attendance: "20/22"
    },
  ]

  const getCategoriesInTraining = (exercises: any[]) => {
    const categories = [...new Set(exercises.map((ex) => ex.category))]
    const colors = {
      Ataque: "#ea3498",
      Defensa: "#33d9f6",
      Transiciones: "#f4c11a",
      "Balón Parado": "#8a46c5",
      Físico: "#25d03f",
      Técnico: "#aff606",
      "Arquero-Jugador": "#ff6b35",
    }

    return categories.map((cat) => ({
      name: cat,
      color: colors[cat as keyof typeof colors] || "#aff606",
    }))
  }

  // Datos para los 4 gráficos
  const pieChartData = [
    {
      title: "Último Entrenamiento",
      pieData: [
        { type: "Táctico", percentage: 65, color: "#aff606" },
        { type: "Físico", percentage: 25, color: "#f4c11a" },
        { type: "Técnico", percentage: 10, color: "#33d9f6" },
      ],
    },
    {
      title: "Última Semana",
      pieData: [
        { type: "Físico", percentage: 40, color: "#f4c11a" },
        { type: "Técnico", percentage: 35, color: "#33d9f6" },
        { type: "Táctico", percentage: 25, color: "#aff606" },
      ],
    },
    {
      title: "Lo que va del Mes",
      pieData: [
        { type: "Táctico", percentage: 50, color: "#aff606" },
        { type: "Físico", percentage: 30, color: "#f4c11a" },
        { type: "Técnico", percentage: 20, color: "#33d9f6" },
      ],
    },
    {
      title: "Lo que va del Año",
      pieData: [
        { type: "Táctico", percentage: 45, color: "#aff606" },
        { type: "Físico", percentage: 35, color: "#f4c11a" },
        { type: "Técnico", percentage: 20, color: "#33d9f6" },
      ],
    },
  ];
  

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

      {/* Bloque de 2 columnas para Próximos Entrenamientos y Opciones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Próximos Entrenamientos */}
        <Card className="bg-[#213041] border-[#305176]">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Próximos Entrenamientos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {trainingSessions.map((session, index) => (
                <Link key={session.id} href={session.path}>
                  <div className="flex items-center justify-between p-3 bg-[#1d2834] rounded-lg hover:bg-[#305176] transition-colors cursor-pointer">
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <Calendar className="h-8 w-8 text-[#aff606] mx-auto mb-1" />
                        <p className="text-xs text-gray-400">{session.date}</p>
                      </div>
                      <div>
                        <h3 className="text-white font-medium">{session.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {session.duration}min
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {getCategoriesInTraining(session.exercises).map((cat, index) => (
                            <div
                              key={index}
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: cat.color }}
                              title={cat.name}
                            ></div>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{session.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className="bg-[#aff606] text-black">{session.focus}</Badge>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contenedor para las dos tarjetas de opciones, apiladas */}
        <div className="space-y-6">
          {availableOptions.find(opt => opt.title === "Ejercicios" || opt.title === "Ejercicios Físicos" || opt.title === "Ejercicios Kinesiología") && (
            <Card className="bg-[#213041] border-[#305176] hover:border-[#aff606] transition-colors w-full">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-lg bg-blue-500`}>
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-white">Ejercicios</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4">Gestiona ejercicios reutilizables para entrenamientos</p>
                <Link href="/dashboard/entrenamiento/ejercicios">
                  <Button className="w-full bg-[#aff606] text-black hover:bg-[#25d03f]">Acceder</Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {availableOptions.find(opt => opt.title === "Planificar Entrenamiento") && (
            <Card className="bg-[#213041] border-[#305176] hover:border-[#aff606] transition-colors w-full">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-lg bg-[#aff606]`}>
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-white">Planificar Entrenamiento</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4">Crea y programa entrenamientos para tu equipo</p>
                <Link href="/dashboard/entrenamiento/planificar">
                  <Button className="w-full bg-[#aff606] text-black hover:bg-[#25d03f]">Acceder</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Sección de Estadísticas de Entrenamiento - 4 gráficos en línea */}
      <Card className="bg-[#213041] border-[#305176]">
        <CardHeader className="text-center">
          <CardTitle className="text-white text-2xl font-bold flex items-center justify-center">
            <PieChart className="h-6 w-6 mr-3" />
            Estadísticas de Entrenamiento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {pieChartData.map((data, index) => (
              <div key={index} className="space-y-4 border border-[#305176] rounded-lg p-4">
                <h3 className="text-white text-lg font-medium text-center">{data.title}</h3>
                <div className="relative w-48 h-48 mx-auto">
                  <svg viewBox="0 0 200 200" className="w-full h-full">
                    {data.pieData.map((segment, segIndex) => {
                      const startAngle = data.pieData.slice(0, segIndex).reduce((sum, s) => sum + s.percentage * 3.6, 0)
                      const endAngle = startAngle + segment.percentage * 3.6
                      const x1 = 100 + 80 * Math.cos(((startAngle - 90) * Math.PI) / 180)
                      const y1 = 100 + 80 * Math.sin(((startAngle - 90) * Math.PI) / 180)
                      const x2 = 100 + 80 * Math.cos(((endAngle - 90) * Math.PI) / 180)
                      const y2 = 100 + 80 * Math.sin(((endAngle - 90) * Math.PI) / 180)
                      const largeArc = segment.percentage > 50 ? 1 : 0

                      return (
                        <path
                          key={segIndex}
                          d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`}
                          fill={segment.color}
                          stroke="#1d2834"
                          strokeWidth="2"
                        />
                      )
                    })}
                  </svg>
                </div>
                <div className="space-y-2">
                  <h4 className="text-white text-sm font-medium">Lo que se trabajó:</h4>
                  {data.pieData.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <p className="text-gray-400 text-sm">
                        {item.type} <span className="text-white font-medium">({item.percentage}%)</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>


      {/* Entrenamientos recientes */}
      <Card className="bg-[#213041] border-[#305176]">
        <CardHeader>
          <CardTitle className="text-white">Entrenamientos Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            {previousSessions.map((session, index) => (
              <div key={session.id} className="flex items-center justify-between p-4 bg-[#1d2834] rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <Calendar className="h-8 w-8 text-gray-500 mx-auto mb-1" />
                    <p className="text-xs text-gray-400">{session.date}</p>
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{session.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {session.duration}min
                      </div>
                      <div className="flex items-center">
                        <Target className="h-4 w-4 mr-1" />
                        {session.exercises.length} ejercicios
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {getCategoriesInTraining(session.exercises).map((cat, index) => (
                        <div
                          key={index}
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: cat.color }}
                          title={cat.name}
                        ></div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{session.category}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant="secondary" className="bg-[#305176] text-gray-300">
                    {session.focus}
                  </Badge>
                  <Button
                    size="sm"
                    className="bg-[#305176] h-10 font-bold text-white hover:bg-[#aff606] hover:text-black"
                    onClick={() => setShowTrainingDetail(session)}
                  >
                    VER DETALLE
                  </Button>
                  <div className="text-right">
                    <p className="text-[#aff606] font-medium">{session.attendance}</p>
                    <p className="text-gray-400 text-sm">Asistencia</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>


      {/* Training Detail Dialog */}
      <Dialog open={!!showTrainingDetail} onOpenChange={() => setShowTrainingDetail(null)}>
        <DialogContent className="sm:max-w-[425px] bg-[#213041] border-[#305176] text-white">
          <DialogHeader>
            <DialogTitle className="text-white">{showTrainingDetail?.name}</DialogTitle>
            <DialogDescription className="text-gray-400">
              Detalles del entrenamiento del {showTrainingDetail?.date}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label className="text-white">Duración</Label>
              <Input
                value={`${showTrainingDetail?.duration} min`}
                readOnly
                className="bg-[#1d2834] border-[#305176] text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Categoría</Label>
              <Input
                value={showTrainingDetail?.category}
                readOnly
                className="bg-[#1d2834] border-[#305176] text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Enfoque</Label>
              <Input
                value={showTrainingDetail?.focus}
                readOnly
                className="bg-[#1d2834] border-[#305176] text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Ejercicios</Label>
              <ul className="space-y-2">
                {showTrainingDetail?.exercises.map((exercise: any, index: number) => (
                  <li key={index} className="p-2 bg-[#1d2834] rounded-lg text-sm">
                    {exercise.name} ({exercise.duration} min)
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}