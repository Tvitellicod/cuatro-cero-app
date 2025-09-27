"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dumbbell, Target, Users, TrendingUp, Calendar, PieChart, Clock, Trophy, Eye } from "lucide-react"
import Link from "next/link"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useProfile } from "@/hooks/use-profile"
import { useAuth } from "@/hooks/use-auth"
import { isSupabaseConfigured } from "@/lib/supabase"
import { trainingSessionsService } from "@/lib/database"

export function TrainingOverview() {
  const [showTrainingDetail, setShowTrainingDetail] = useState<any>(null)
  const [pieFilter, setPieFilter] = useState("lastSession")
  const [upcomingTrainingSessions, setUpcomingTrainingSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const { currentProfile } = useProfile()
  const { user } = useAuth()
  const profileType = currentProfile?.profileType

  // Helper function to get consistent colors for the pie chart
  const getCategoryColors = (category: string) => {
    switch (category) {
        case 'Ataque': return '#ea3498';
        case 'Defensa': return '#33d9f6';
        case 'Transiciones': return '#f4c11a';
        case 'Balón Parado': return '#8a46c5';
        case 'Físico': return '#25d03f';
        case 'Técnico': return '#aff606';
        case 'Arquero-Jugador': return '#ff6b35';
        case 'Resistencia': return '#25d03f';
        case 'Fuerza': return '#ff6b35';
        case 'Rehabilitación': return '#4ecdc4';
        case 'Prevención': return '#45b7d1';
        case 'Fortalecimiento': return '#96ceb4';
        case 'Movilidad': return '#f1a85f';
        case 'Recuperación': return '#c9d99d';
        default: return '#aff606';
    }
  };

  // Helper function to calculate pie data for a specific session
  const calculatePieDataForSession = (exercises: any[]) => {
    const categoryCount = exercises.reduce(
      (acc, exercise) => {
        const category = exercise.category;
        // Asumiendo que los ejercicios de ejemplo ya tienen 'duration' en minutos
        acc[category] = (acc[category] || 0) + (exercise.duration || 0);
        return acc;
      },
      {} as Record<string, number>,
    )

    const total = Object.values(categoryCount).reduce((sum, duration) => sum + duration, 0)

    return Object.entries(categoryCount).map(([category, duration]) => ({
      category,
      duration,
      percentage: total > 0 ? Math.round((duration / total) * 100) : 0,
      color: getCategoryColors(category),
      duration,
    }))
  }

  useEffect(() => {
    const fetchUpcomingTrainings = async () => {
      setLoading(true)

      if (!isSupabaseConfigured()) {
        // Modo demo
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const demoSessions = [
          {
            id: 1,
            name: "Entrenamiento Táctico - Ataque",
            date: today.toISOString().split('T')[0],
            duration: 90,
            exercises: [
              { name: "Ataque 4-3-3 por bandas", category: "Ataque", duration: 20, type: "Táctico", color: "#ea3498" },
              { name: "Transición defensa-ataque", category: "Transiciones", duration: 18, type: "Táctico", color: "#f4c11a" },
              { name: "Presión alta coordinada", category: "Defensa", duration: 15, type: "Físico", color: "#33d9f6" },
              { name: "Tiros libres directos", category: "Balón Parado", duration: 12, type: "Táctico", color: "#8a46c5" },
              { name: "Salida con los pies", category: "Arquero-Jugador", duration: 25, type: "Físico", color: "#ff6b35" },
            ],
            category: "Primera División",
            focus: "Ataque Posicional",
            attendance: "20/22",
            path: "/dashboard/entrenamiento/planificar"
          },
          {
            id: 2,
            name: "Preparación Física - Resistencia",
            date: tomorrow.toISOString().split('T')[0],
            duration: 75,
            exercises: [
              { name: "Circuito de resistencia", category: "Resistencia", duration: 30, type: "Físico", color: "#25d03f" },
              { name: "Sprints cortos", category: "Fuerza", duration: 20, type: "Físico", color: "#ff6b35" },
              { name: "Trabajo aeróbico", category: "Resistencia", duration: 25, type: "Físico", color: "#25d03f" },
            ],
            category: "Primera División",
            focus: "Resistencia Aeróbica",
            attendance: "21/22",
            path: "/dashboard/entrenamiento/planificar"
          },
        ]
        setUpcomingTrainingSessions(demoSessions)
        setLoading(false)
        return
      }
      
      if (!user) {
        setLoading(false)
        setUpcomingTrainingSessions([])
        return
      }

      const { data, error } = await trainingSessionsService.getUpcomingTrainingSessions(user.club_id);

      if (error) {
        console.error("Error fetching upcoming training sessions:", error);
        setUpcomingTrainingSessions([]);
      } else {
        const formattedSessions = data?.map(session => ({
          ...session,
          date: session.date || 'N/A',
          duration: session.duration_minutes || 0,
          category: session.category?.name || 'N/A',
          focus: 'N/A', 
          exercises: [],
        })) || [];
        setUpcomingTrainingSessions(formattedSessions);
      }
      setLoading(false)
    }
    
    fetchUpcomingTrainings()
  }, [user?.club_id])


  const getAvailableOptions = () => {
    const options = []

    // Modificación: Se añade la tarjeta de "Ejercicios" aquí
    options.push({
      title: "Ejercicios",
      description: "Gestiona ejercicios reutilizables para tus entrenamientos",
      icon: Target,
      href: "/dashboard/entrenamiento/ejercicios",
      color: "bg-blue-500",
    })

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

  const previousSessions = [
    {
      id: 3,
      name: "Entrenamiento Técnico",
      date: "2024-01-10",
      duration: 60,
      exercises: [
        { name: "Control y pase", category: "Técnico", duration: 20, type: "Técnico", color: "#aff606" },
        { name: "Definición", category: "Ataque", duration: 25, type: "Técnico", color: "#ea3498" },
        { name: "Juego aéreo", category: "Defensa", duration: 15, type: "Técnico", color: "#33d9f6" },
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
        { name: "Marcaje individual", category: "Defensa", duration: 25, type: "Táctico", color: "#33d9f6" },
        { name: "Coberturas", category: "Defensa", duration: 20, type: "Táctico", color: "#33d9f6" },
        { name: "Salida jugada", category: "Defensa", duration: 35, type: "Táctico", color: "#33d9f6" },
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

  // Datos para los 4 gráficos (Mantenidos para la sección de estadísticas general)
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

      {/* Bloque de 2 columnas principales, con la segunda dividida en 2 filas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Columna 1: Ocupa la mitad de la pantalla */}
        <Card className="bg-[#213041] border-[#305176]">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Próximos Entrenamientos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {loading ? (
                <p className="text-gray-400 text-center">Cargando entrenamientos...</p>
              ) : upcomingTrainingSessions.length > 0 ? (
                upcomingTrainingSessions.map((session, index) => (
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
                            {session.exercises.map((cat, index) => (
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
                ))
              ) : (
                <p className="text-gray-400 text-center">No hay entrenamientos próximos.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Columna 2: Contiene las otras dos tarjetas apiladas */}
        <div className="space-y-6">
          <Card className="bg-[#213041] border-[#305176]">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg bg-blue-500`}>
                  <Target className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white">Ejercicios</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-4">Gestiona ejercicios reutilizables para tus entrenamientos</p>
              <Link href="/dashboard/entrenamiento/ejercicios">
                <Button className="w-full bg-[#aff606] text-black hover:bg-[#25d03f]">Acceder</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-[#213041] border-[#305176]">
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
                  {/* Badge de session.focus eliminado */}
                  <Button
                    size="sm"
                    className="bg-[#aff606] text-black hover:bg-[#25d03f] h-10 font-bold"
                    onClick={() => setShowTrainingDetail(session)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Entrenamiento
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
      
      {/* Modal de Detalle del Entrenamiento con Gráfico de Pizza */}
      <Dialog open={!!showTrainingDetail} onOpenChange={setShowTrainingDetail}>
        <DialogContent className="sm:max-w-[700px] bg-[#213041] border-[#305176] text-white">
          <DialogHeader className="text-center">
            <DialogTitle className="text-white text-2xl font-bold">
              {showTrainingDetail?.name}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Detalles del entrenamiento del {showTrainingDetail?.date}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-4">
            
            {/* Columna Izquierda: Ejercicios y Resumen */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Duración Total:</span>
                  <p className="text-white font-bold">{showTrainingDetail?.duration} min</p>
                </div>
                <div>
                  <span className="text-gray-400">Categoría:</span>
                  <p className="text-white">{showTrainingDetail?.category}</p>
                </div>
                {/* Se mantiene el bloque focus por si existe en el modelo de datos, aunque el badge se eliminó en la vista anterior */}
                {showTrainingDetail?.focus && (
                  <div>
                    <span className="text-gray-400">Enfoque:</span>
                    <p className="text-white">{showTrainingDetail?.focus}</p>
                  </div>
                )}
              </div>
              
              {/* Bloque de Asistencia No Modificable */}
              <div className="col-span-2">
                <span className="text-gray-400">Asistencia Registrada:</span>
                <div className="flex items-center justify-between p-3 mt-1 bg-[#305176] rounded-lg">
                  <p className="text-white font-medium">VER ASISTENCIA</p>
                  <Badge className="bg-[#aff606] text-black">
                    {showTrainingDetail?.attendance}
                  </Badge>
                </div>
              </div>
              

              {/* Lista de Ejercicios */}
              <div>
                <h4 className="text-white font-medium mb-3">Ejercicios ({showTrainingDetail?.exercises.length})</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {showTrainingDetail?.exercises.map((exercise: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-[#1d2834] rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-[#aff606] font-bold">{index + 1}.</span>
                        <div>
                          <p className="text-white font-medium">{exercise.name}</p>
                          <p className="text-gray-400 text-sm">{exercise.duration} min</p>
                        </div>
                      </div>
                      <Badge
                        className="text-white"
                        style={{ backgroundColor: exercise.color || getCategoryColors(exercise.category) }}
                      >
                        {exercise.category}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Columna Derecha: Gráfico de Distribución (Pie Chart) */}
            <div className="space-y-4">
              <h3 className="text-white font-medium mb-3 flex items-center">
                <PieChart className="h-5 w-5 mr-2" />
                Distribución por Categoría
              </h3>
              <div className="flex flex-col items-center">
                <div className="relative w-48 h-48 mx-auto mb-4">
                  {/* Renderizado del gráfico de pizza */}
                  {showTrainingDetail?.exercises.length > 0 ? (
                    <svg viewBox="0 0 200 200" className="w-full h-full">
                      {calculatePieDataForSession(showTrainingDetail.exercises).map((segment, segIndex) => {
                        const pieData = calculatePieDataForSession(showTrainingDetail.exercises);
                        const startAngle = pieData.slice(0, segIndex).reduce((sum, s) => sum + s.percentage * 3.6, 0)
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
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-500">
                      Sin datos para el gráfico
                    </div>
                  )}
                </div>
                {/* Leyenda/Detalle de Porcentajes */}
                <div className="w-full space-y-1">
                  {calculatePieDataForSession(showTrainingDetail?.exercises || []).map((segment, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: segment.color }}></div>
                        <span className="text-white text-sm">{segment.category}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold">{segment.percentage}%</p>
                        <p className="text-gray-400 text-xs">{segment.duration}min</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
        </DialogContent>
      </Dialog>
    </div>
  )
}