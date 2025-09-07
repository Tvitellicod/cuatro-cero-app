"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Calendar, Clock, Target, PieChart, Users, X, Check } from "lucide-react"

export function TrainingPlannerSection() {
  const [showPlannerForm, setShowPlannerForm] = useState(false)
  const [selectedExercises, setSelectedExercises] = useState<any[]>([])
  const [showTrainingDetail, setShowTrainingDetail] = useState<any>(null)
  const [showAttendance, setShowAttendance] = useState(false)
  const [attendance, setAttendance] = useState<Record<number, boolean>>({})

  const today = new Date().toISOString().split("T")[0]

  // Obtener el perfil del usuario para filtrar jugadores
  const savedProfile = typeof window !== "undefined" ? localStorage.getItem("userProfile") : null
  const profileData = savedProfile ? JSON.parse(savedProfile) : null

  // Generar jugadores para la categoría actual
  const generatePlayersForCategory = () => {
    const firstNames = [
      "Juan",
      "Carlos",
      "Miguel",
      "Roberto",
      "Diego",
      "Fernando",
      "Alejandro",
      "Sebastián",
      "Martín",
      "Pablo",
      "Gonzalo",
      "Nicolás",
      "Facundo",
      "Matías",
      "Lucas",
      "Tomás",
      "Agustín",
      "Franco",
      "Ignacio",
      "Maximiliano",
      "Santiago",
      "Joaquín",
      "Emiliano",
      "Valentín",
      "Thiago",
    ]
    const lastNames = [
      "García",
      "Rodríguez",
      "González",
      "Fernández",
      "López",
      "Martínez",
      "Sánchez",
      "Pérez",
      "Gómez",
      "Martín",
      "Jiménez",
      "Ruiz",
      "Hernández",
      "Díaz",
      "Moreno",
      "Muñoz",
      "Álvarez",
      "Romero",
      "Alonso",
      "Gutiérrez",
      "Navarro",
      "Torres",
      "Domínguez",
      "Vázquez",
      "Ramos",
    ]

    const players = []
    for (let i = 0; i < 25; i++) {
      const firstName = firstNames[i % firstNames.length]
      const lastName = lastNames[i % lastNames.length]
      players.push({
        id: i + 1,
        name: `${firstName} ${lastName}`,
        status: Math.random() > 0.1 ? "DISPONIBLE" : "LESIONADO", // 90% disponibles
      })
    }
    return players.filter((p) => p.status === "DISPONIBLE")
  }

  const availablePlayers = generatePlayersForCategory()

  const trainingSessions = [
    {
      id: 1,
      name: "Entrenamiento Táctico - Ataque",
      date: "2024-01-16",
      duration: 90,
      exercises: [
        { name: "Ataque 4-3-3 por bandas", category: "Ataque", duration: 20 },
        { name: "Transición defensa-ataque", category: "Transiciones", duration: 18 },
        { name: "Presión alta coordinada", category: "Defensa", duration: 15 },
        { name: "Tiros libres directos", category: "Balón Parado", duration: 12 },
        { name: "Salida con los pies", category: "Arquero-Jugador", duration: 25 },
      ],
      category: "Primera División",
      focus: "Ataque Posicional",
    },
    {
      id: 2,
      name: "Preparación Física - Resistencia",
      date: "2024-01-18",
      duration: 75,
      exercises: [
        { name: "Circuito de resistencia", category: "Físico", duration: 30 },
        { name: "Sprints cortos", category: "Físico", duration: 20 },
        { name: "Trabajo aeróbico", category: "Físico", duration: 25 },
      ],
      category: "Primera División",
      focus: "Resistencia Aeróbica",
    },
  ]

  const previousSessions = [
    {
      id: 3,
      name: "Entrenamiento Técnico",
      date: "2024-01-10",
      duration: 60,
      exercises: [
        { name: "Control y pase", category: "Técnico", duration: 20 },
        { name: "Definición", category: "Ataque", duration: 25 },
        { name: "Juego aéreo", category: "Defensa", duration: 15 },
      ],
      category: "Juveniles",
      focus: "Técnica Individual",
    },
    {
      id: 4,
      name: "Trabajo Defensivo",
      date: "2024-01-08",
      duration: 80,
      exercises: [
        { name: "Marcaje individual", category: "Defensa", duration: 25 },
        { name: "Coberturas", category: "Defensa", duration: 20 },
        { name: "Salida jugada", category: "Defensa", duration: 35 },
      ],
      category: "Primera División",
      focus: "Presión Alta",
    },
  ]

  const exerciseCategories = [
    "Ataque",
    "Defensa",
    "Transiciones",
    "Balón Parado",
    "Físico",
    "Técnico",
    "Arquero-Jugador",
  ]

  const availableExercises = [
    {
      id: 1,
      name: "Ataque 4-3-3 por bandas",
      category: "Ataque",
      duration: 20,
      type: "Técnico",
      createdAt: "2024-01-15",
    },
    {
      id: 2,
      name: "Circuito de Resistencia",
      category: "Físico",
      duration: 25,
      type: "Físico",
      createdAt: "2024-01-14",
    },
    {
      id: 3,
      name: "Presión alta coordinada",
      category: "Defensa",
      duration: 18,
      type: "Técnico",
      createdAt: "2024-01-13",
    },
    {
      id: 4,
      name: "Transición defensa-ataque",
      category: "Transiciones",
      duration: 15,
      type: "Técnico",
      createdAt: "2024-01-12",
    },
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const categories = [
    { id: "primera", name: "Primera División" },
    { id: "tercera", name: "Tercera División" },
    { id: "juveniles", name: "Juveniles" },
  ]

  const addExercise = (exercise: any) => {
    if (!selectedExercises.find((e) => e.id === exercise.id)) {
      setSelectedExercises([...selectedExercises, exercise])
    }
  }

  const removeExercise = (exerciseId: number) => {
    setSelectedExercises(selectedExercises.filter((e) => e.id !== exerciseId))
  }

  const calculatePieData = () => {
    const typeCount = selectedExercises.reduce(
      (acc, exercise) => {
        acc[exercise.type] = (acc[exercise.type] || 0) + exercise.duration
        return acc
      },
      {} as Record<string, number>,
    )

    const total = Object.values(typeCount).reduce((sum, duration) => sum + duration, 0)

    return Object.entries(typeCount).map(([type, duration]) => ({
      type,
      duration,
      percentage: total > 0 ? Math.round((duration / total) * 100) : 0,
      color: type === "Técnico" ? "#aff606" : type === "Físico" ? "#f4c11a" : "#33d9f6",
    }))
  }

  const pieData = calculatePieData()

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

  const handleAttendanceToggle = (playerId: number) => {
    setAttendance((prev) => ({
      ...prev,
      [playerId]: !prev[playerId],
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Planificar Entrenamiento</h2>
          <p className="text-gray-400">Organiza y programa las sesiones de entrenamiento</p>
        </div>
        {!showPlannerForm && (
          <Button className="bg-[#aff606] text-black hover:bg-[#25d03f]" onClick={() => setShowPlannerForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Planificar Próximo Entrenamiento
          </Button>
        )}
      </div>

      {/* Training Detail Modal */}
      {showTrainingDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="bg-[#213041] border-[#305176] w-full max-w-2xl max-h-[90vh] overflow-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">{showTrainingDetail.name}</CardTitle>
              <div className="flex space-x-2">
                <Button
                  className="bg-[#33d9f6] text-black hover:bg-[#2bc4ea]"
                  onClick={() => setShowAttendance(!showAttendance)}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Asistencia
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:text-red-400"
                  onClick={() => setShowTrainingDetail(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {!showAttendance ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Fecha:</span>
                      <p className="text-white">{showTrainingDetail.date}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Duración:</span>
                      <p className="text-white">{showTrainingDetail.duration} min</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Categoría:</span>
                      <p className="text-white">{showTrainingDetail.category}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Enfoque:</span>
                      <p className="text-white">{showTrainingDetail.focus}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white font-medium mb-3">Ejercicios ({showTrainingDetail.exercises.length})</h4>
                    <div className="space-y-2">
                      {showTrainingDetail.exercises.map((exercise: any, index: number) => (
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
                            style={{ backgroundColor: getCategoriesInTraining([exercise])[0]?.color || "#aff606" }}
                          >
                            {exercise.category}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white font-medium mb-3">Categorías Trabajadas</h4>
                    <div className="flex flex-wrap gap-2">
                      {getCategoriesInTraining(showTrainingDetail.exercises).map((cat, index) => (
                        <Badge key={index} className="text-white" style={{ backgroundColor: cat.color }}>
                          {cat.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <h4 className="text-white font-medium">Lista de Asistencia</h4>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {availablePlayers.map((player) => (
                      <div
                        key={player.id}
                        className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                          attendance[player.id]
                            ? "bg-red-900/30 border border-red-500"
                            : "bg-[#1d2834] hover:bg-[#305176]"
                        }`}
                        onClick={() => handleAttendanceToggle(player.id)}
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              attendance[player.id] ? "border-red-500 bg-red-500" : "border-[#25d03f] bg-[#25d03f]"
                            }`}
                          >
                            {attendance[player.id] ? (
                              <X className="h-3 w-3 text-white" />
                            ) : (
                              <Check className="h-3 w-3 text-black" />
                            )}
                          </div>
                          <span className={`font-medium ${attendance[player.id] ? "text-red-400" : "text-white"}`}>
                            {player.name}
                          </span>
                        </div>
                        <Badge className={attendance[player.id] ? "bg-red-500 text-white" : "bg-[#25d03f] text-black"}>
                          {attendance[player.id] ? "Inasistente" : "Presente"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t border-[#305176]">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Presentes:</span>
                      <span className="text-[#25d03f] font-bold">
                        {availablePlayers.length - Object.values(attendance).filter(Boolean).length}/
                        {availablePlayers.length}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Entrenamientos Programados */}
      {!showPlannerForm && (
        <>
          <Card className="bg-[#213041] border-[#305176]">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Entrenamientos Programados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trainingSessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 bg-[#1d2834] rounded-lg">
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
                      <Badge className="bg-[#aff606] text-black">{session.focus}</Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-[#aff606] text-[#aff606] hover:bg-[#aff606] hover:text-black bg-transparent"
                        onClick={() => setShowTrainingDetail(session)}
                      >
                        Ver Detalles
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#213041] border-[#305176]">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Anteriores Entrenamientos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {previousSessions.map((session) => (
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
                        variant="outline"
                        className="border-[#305176] text-gray-400 hover:bg-[#305176] hover:text-white bg-transparent"
                        onClick={() => setShowTrainingDetail(session)}
                      >
                        Ver Detalles
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {showPlannerForm && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulario de Planificación */}
          <div className="lg:col-span-2">
            <Card className="bg-[#213041] border-[#305176]">
              <CardHeader>
                <CardTitle className="text-white">Nuevo Entrenamiento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="training-name" className="text-white">
                      Nombre del Entrenamiento
                    </Label>
                    <Input
                      id="training-name"
                      placeholder="Ej: Entrenamiento Táctico"
                      className="bg-[#1d2834] border-[#305176] text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="training-date" className="text-white">
                      Fecha
                    </Label>
                    <Input id="training-date" type="date" className="bg-[#1d2834] border-[#305176] text-white" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Categoría de Ejercicio</Label>
                  <Select>
                    <SelectTrigger className="bg-[#1d2834] border-[#305176] text-white">
                      <SelectValue placeholder="Seleccionar categoría de ejercicio" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#213041] border-[#305176]">
                      {exerciseCategories.map((cat) => (
                        <SelectItem key={cat} value={cat} className="text-white">
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Ejercicios Disponibles */}
                <div className="space-y-3">
                  <Label className="text-white">Ejercicios Disponibles</Label>
                  <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
                    {availableExercises.map((exercise) => (
                      <div key={exercise.id} className="flex items-center justify-between p-3 bg-[#1d2834] rounded-lg">
                        <div>
                          <p className="text-white font-medium">{exercise.name}</p>
                          <p className="text-gray-400 text-sm">
                            {exercise.category} • {exercise.duration}min
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge
                            className={`${
                              exercise.type === "Técnico"
                                ? "bg-[#aff606] text-black"
                                : exercise.type === "Físico"
                                  ? "bg-[#f4c11a] text-black"
                                  : "bg-[#33d9f6] text-black"
                            }`}
                          >
                            {exercise.type}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-[#aff606] text-[#aff606] hover:bg-[#aff606] hover:text-black bg-transparent"
                            onClick={() => addExercise(exercise)}
                          >
                            Agregar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ejercicios Seleccionados */}
                {selectedExercises.length > 0 && (
                  <div className="space-y-3">
                    <Label className="text-white">Ejercicios Seleccionados ({selectedExercises.length})</Label>
                    <div className="space-y-2">
                      {selectedExercises.map((exercise, index) => (
                        <div
                          key={exercise.id}
                          className="flex items-center justify-between p-2 bg-[#305176] rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-[#aff606] font-bold">{index + 1}.</span>
                            <div>
                              <p className="text-white text-sm font-medium">{exercise.name}</p>
                              <p className="text-gray-300 text-xs">{exercise.duration}min</p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                            onClick={() => removeExercise(exercise.id)}
                          >
                            Quitar
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-col space-y-2">
                  <Button className="bg-[#aff606] text-black hover:bg-[#25d03f] px-8 py-2">
                    Guardar Entrenamiento
                  </Button>
                  <Button
                    variant="outline"
                    className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white bg-transparent"
                    onClick={() => setShowPlannerForm(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gráfico Pizza */}
          <div className="lg:col-span-1">
            <Card className="bg-[#213041] border-[#305176]">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <PieChart className="h-5 w-5 mr-2" />
                  Distribución del Entrenamiento
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedExercises.length > 0 ? (
                  <div className="space-y-4">
                    {/* Gráfico Pizza Simple */}
                    <div className="relative w-48 h-48 mx-auto">
                      <svg viewBox="0 0 200 200" className="w-full h-full">
                        {pieData.map((segment, index) => {
                          const startAngle = pieData.slice(0, index).reduce((sum, s) => sum + s.percentage * 3.6, 0)
                          const endAngle = startAngle + segment.percentage * 3.6
                          const x1 = 100 + 80 * Math.cos(((startAngle - 90) * Math.PI) / 180)
                          const y1 = 100 + 80 * Math.sin(((startAngle - 90) * Math.PI) / 180)
                          const x2 = 100 + 80 * Math.cos(((endAngle - 90) * Math.PI) / 180)
                          const y2 = 100 + 80 * Math.sin(((endAngle - 90) * Math.PI) / 180)
                          const largeArc = segment.percentage > 50 ? 1 : 0

                          return (
                            <path
                              key={index}
                              d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`}
                              fill={segment.color}
                              stroke="#1d2834"
                              strokeWidth="2"
                            />
                          )
                        })}
                      </svg>
                    </div>

                    {/* Leyenda */}
                    <div className="space-y-2">
                      {pieData.map((segment, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: segment.color }}></div>
                            <span className="text-white text-sm">{segment.type}</span>
                          </div>
                          <div className="text-right">
                            <p className="text-white font-bold">{segment.percentage}%</p>
                            <p className="text-gray-400 text-xs">{segment.duration}min</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-[#305176]">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Duración Total:</span>
                        <span className="text-[#aff606] font-bold">
                          {selectedExercises.reduce((sum, ex) => sum + ex.duration, 0)}min
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <PieChart className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">Agrega ejercicios para ver la distribución</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
