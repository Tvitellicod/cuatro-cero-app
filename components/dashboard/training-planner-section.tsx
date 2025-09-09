"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Calendar, Clock, Target, PieChart, Users, X, Check, Search, Trash2 } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"


export function TrainingPlannerSection() {
  const [showPlannerForm, setShowPlannerForm] = useState(false)
  const [selectedExercises, setSelectedExercises] = useState<any[]>([])
  const [showTrainingDetail, setShowTrainingDetail] = useState<any>(null)
  const [showAttendance, setShowAttendance] = useState(false)
  const [attendance, setAttendance] = useState<Record<number, boolean>>({})
  const [showValidationAlert, setShowValidationAlert] = useState(false)


  const [newTraining, setNewTraining] = useState({
    name: "",
    date: "",
    time: "",
    category: "",
  });

  const [trainingSessions, setTrainingSessions] = useState([
    {
      id: 1,
      name: "Entrenamiento Táctico - Ataque",
      date: "2025-09-08",
      time: "10:00",
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
      date: "2025-09-10",
      time: "15:00",
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
  ]);

  // Filtros
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterPlayers, setFilterPlayers] = useState("all")
  const [filterGoalkeepers, setFilterGoalkeepers] = useState("all")
  const [filterDifficulty, setFilterDifficulty] = useState("all")
  const [filterTime, setFilterTime] = useState("all")
  const today = new Date().toISOString().split("T")[0]

  // Obtener el perfil del usuario para filtrar jugadores
  const savedProfile = typeof window !== "undefined" ? localStorage.getItem("userProfile") : null
  const profileData = savedProfile ? JSON.parse(savedProfile) : null
  const profileType = profileData?.profileType

  // Generar jugadores para la categoría
  const generatePlayersForCategory = () => {
    const firstNames = ["Juan", "Carlos", "Miguel", "Roberto", "Diego", "Fernando", "Alejandro", "Sebastián", "Martín", "Pablo", "Gonzalo", "Nicolás", "Facundo", "Matías", "Lucas", "Tomás", "Agustín", "Franco", "Ignacio", "Maximiliano", "Santiago", "Joaquín", "Emiliano", "Valentín", "Thiago"]
    const lastNames = ["García", "Rodríguez", "González", "Fernández", "López", "Martínez", "Sánchez", "Pérez", "Gómez", "Martín", "Jiménez", "Ruiz", "Hernández", "Díaz", "Moreno", "Muñoz", "Álvarez", "Romero", "Alonso", "Gutiérrez", "Navarro", "Torres", "Domínguez", "Vázquez", "Ramos"]
    const nicknames = ["Checo", "Toto", "Pipa", "Chino", "Flaco", "Gordo", "Ruso", "Turco", "Negro", "Rubio", "Pelado", "Chiqui", "Tano", "Mono", "Loco", "Pato", "Gato", "Oso", "León", "Tigre", "Lobo", "Colo", "Nacho", "Maxi", "Santi"]

    const players = []
    let playerId = 1

    const categoryMap = {
      "primera": { name: "Primera División", count: 25 },
      "tercera": { name: "Tercera División", count: 18 },
      "juveniles": { name: "Juveniles", count: 22 },
      "cuarta": { name: "Cuarta División", count: 20 },
      "quinta": { name: "Quinta División", count: 20 },
      "sexta": { name: "Sexta División", count: 20 },
      "septima": { name: "Séptima División", count: 20 },
      "infantiles": { name: "Infantiles", count: 20 },
    }

    for (const categoryId in categoryMap) {
      for (let i = 0; i < categoryMap[categoryId].count; i++) {
        const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)]
        const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)]
        const isInjured = Math.random() < 0.3
        const randomPhone = `+54 9 11 ${Math.floor(Math.random() * 10000)}-${Math.floor(Math.random() * 10000)}`

        players.push({
          id: playerId++,
          firstName: randomFirstName,
          lastName: randomLastName,
          nickname: nicknames[Math.floor(Math.random() * nicknames.length)],
          birthDate: "1990-01-01",
          phoneNumber: randomPhone,
          position: ["Arquero", "Defensor", "Mediocampista", "Delantero"][Math.floor(Math.random() * 4)],
          foot: ["Derecho", "Izquierdo", "Ambidiestro"][Math.floor(Math.random() * 3)],
          status: isInjured ? "LESIONADO" : "DISPONIBLE",
          category: categoryId,
          photo: "/placeholder-user.jpg",
          injury: isInjured
            ? {
                type: "Lesión muscular",
                date: "2024-01-05",
                recovery: "3-4 semanas",
              }
            : null,
        })
      }
    }
    return players
  }
  
  const allPlayers = generatePlayersForCategory()
  
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
  const exercisesFromManagement = [
    {
      id: 1,
      name: "Ataque 4-3-3 por bandas",
      category: "Ataque",
      duration: 20,
      players: 11,
      goalkeepers: 1,
      difficulty: "Media",
      materials: "Conos, balones",
      objective: "Mejorar el juego por las bandas",
      createdAt: "2024-01-15",
      type: "Técnico",
    },
    {
      id: 2,
      name: "Presión alta coordinada",
      category: "Defensa",
      duration: 15,
      players: 8,
      goalkeepers: 0,
      difficulty: "Difícil",
      materials: "Conos, petos",
      objective: "Coordinar la presión defensiva",
      createdAt: "2024-01-14",
      type: "Técnico",
    },
    {
      id: 3,
      name: "Transición defensa-ataque",
      category: "Transiciones",
      duration: 18,
      players: 10,
      goalkeepers: 1,
      difficulty: "Media",
      materials: "Balones, conos",
      objective: "Mejorar transiciones rápidas",
      createdAt: "2024-01-13",
      type: "Técnico",
    },
    {
      id: 4,
      name: "Tiros libres directos",
      category: "Balón Parado",
      duration: 12,
      players: 6,
      goalkeepers: 1,
      difficulty: "Fácil",
      materials: "Balones, barrera",
      objective: "Mejorar precisión en tiros libres",
      createdAt: "2024-01-12",
      type: "Técnico",
    },
    {
      id: 5,
      name: "Salida con los pies",
      category: "Arquero-Jugador",
      duration: 25,
      players: 4,
      goalkeepers: 1,
      difficulty: "Media",
      materials: "Balones, conos",
      objective: "Mejorar distribución del arquero",
      createdAt: "2024-01-11",
      type: "Técnico",
    },
  ];

  const exercisesFromPhysical = [
    {
      id: 101,
      name: "Circuito de Resistencia Aeróbica",
      category: "Resistencia",
      duration: 25,
      players: 15,
      goalkeepers: 0,
      difficulty: "Media",
      materials: "Conos, cronómetro",
      objective: "Mejorar la capacidad aeróbica",
      createdBy: "Preparador Físico",
      type: "Físico",
      createdAt: "2024-01-15"
    },
    {
      id: 102,
      name: "Entrenamiento de Fuerza Funcional",
      category: "Fuerza",
      duration: 30,
      players: 12,
      goalkeepers: 0,
      difficulty: "Difícil",
      materials: "Pesas, bandas elásticas",
      objective: "Desarrollar fuerza específica para fútbol",
      createdBy: "Preparador Físico",
      type: "Físico",
      createdAt: "2024-01-14"
    },
  ];

  const exercisesFromKinesiology = [
    {
      id: 201,
      name: "Ejercicios de Rehabilitación de Rodilla",
      category: "Rehabilitación",
      duration: 20,
      players: 1,
      goalkeepers: 0,
      difficulty: "Media",
      materials: "Banda elástica, pelota suiza",
      objective: "Recuperar movilidad y fuerza en rodilla",
      createdBy: "Kinesiólogo",
      type: "Kinesiológico",
      createdAt: "2024-01-15"
    },
    {
      id: 202,
      name: "Prevención de Lesiones de Tobillo",
      category: "Prevención",
      duration: 15,
      players: 8,
      goalkeepers: 0,
      difficulty: "Fácil",
      materials: "Conos, plataforma inestable",
      objective: "Fortalecer músculos estabilizadores del tobillo",
      createdBy: "Kinesiólogo",
      type: "Kinesiológico",
      createdAt: "2024-01-14"
    },
  ];

  let availableExercises = []
  if (profileType === "DIRECTOR TECNICO") {
    availableExercises = exercisesFromManagement.filter(ex => ex.type === "Técnico")
  } else if (profileType === "PREPARADOR FISICO") {
    availableExercises = [...exercisesFromPhysical, ...exercisesFromKinesiology].filter(ex => ex.type === "Físico" || ex.type === "Kinesiológico")
  } else if (profileType === "KINESIOLOGO") {
    availableExercises = exercisesFromKinesiology.filter(ex => ex.type === "Kinesiológico")
  } else {
    availableExercises = [...exercisesFromManagement, ...exercisesFromPhysical, ...exercisesFromKinesiology]
  }

  // Filtros
  const uniquePlayers = [...new Set(availableExercises.map(ex => ex.players))].sort((a, b) => a - b);
  const uniqueGoalkeepers = [...new Set(availableExercises.map(ex => ex.goalkeepers))].sort((a, b) => a - b);
  const uniqueDurations = [...new Set(availableExercises.map(ex => ex.duration))].sort((a, b) => a - b);
  const uniqueCategories = [...new Set(availableExercises.map(ex => ex.category))];
  const uniqueDifficulties = [...new Set(availableExercises.map(ex => ex.difficulty))];

  const categoriesOptions = [{ id: "all", name: "Todas las categorías" }, ...uniqueCategories.map(cat => ({ id: cat, name: cat }))];
  const difficultyOptions = [{ id: "all", name: "Todas" }, ...uniqueDifficulties.map(diff => ({ id: diff, name: diff }))];
  
  const playersInTraining = [
    {
      id: "primera", name: "Primera División"
    },
    {
      id: "tercera", name: "Tercera División"
    },
    {
      id: "juveniles", name: "Juveniles"
    },
  ];

  const filteredExercises = availableExercises
    .filter((exercise) => {
      const matchesSearch = searchQuery === "" || exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = filterCategory === "all" || exercise.category === filterCategory
      const matchesPlayers = filterPlayers === "all" || exercise.players.toString() === filterPlayers.toString()
      const matchesGoalkeepers = filterGoalkeepers === "all" || exercise.goalkeepers.toString() === filterGoalkeepers.toString()
      const matchesDifficulty = filterDifficulty === "all" || exercise.difficulty === filterDifficulty
      const matchesTime = filterTime === "all" || exercise.duration.toString() === filterTime

      return matchesSearch && matchesCategory && matchesPlayers && matchesGoalkeepers && matchesDifficulty && matchesTime
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const addExercise = (exercise: any) => {
    if (!selectedExercises.find((e) => e.id === exercise.id)) {
      setSelectedExercises([...selectedExercises, exercise])
    }
  }

  const removeExercise = (exerciseId: number) => {
    setSelectedExercises(selectedExercises.filter((e) => e.id !== exerciseId))
  }

  const getCategoryColors = (category: string) => {
    switch (category) {
        case 'Ataque': return '#ea3498';
        case 'Defensa': return '#33d9f6';
        case 'Transiciones': return '#f4c11a';
        case 'Balón Parado': return '#8a46c5';
        case 'Resistencia': return '#25d03f';
        case 'Fuerza': return '#ff6b35';
        case 'Rehabilitación': return '#4ecdc4';
        case 'Prevención': return '#45b7d1';
        case 'Técnico': return '#aff606';
        default: return '#aff606';
    }
  };

  const calculatePieData = () => {
    const categoryCount = selectedExercises.reduce(
      (acc, exercise) => {
        const category = exercise.category;
        acc[category] = (acc[category] || 0) + exercise.duration;
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
      Resistencia: "bg-red-500",
      Fuerza: "bg-blue-500",
      Velocidad: "bg-green-500",
      Agilidad: "bg-yellow-500",
      Flexibilidad: "bg-purple-500",
      Rehabilitación: "bg-green-500",
      Prevención: "bg-blue-500",
      Fortalecimiento: "bg-purple-500",
      Movilidad: "bg-orange-500",
      Recuperación: "bg-teal-500",
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

  const handleClearFilters = () => {
    setSearchQuery("")
    setFilterCategory("all")
    setFilterPlayers("all")
    setFilterGoalkeepers("all")
    setFilterDifficulty("all")
    setFilterTime("all")
  }

  const handleCancelForm = () => {
    setShowPlannerForm(false);
    setNewTraining({ name: "", date: "", time: "", category: "" });
    setSelectedExercises([]);
  };

  const handleSaveTraining = () => {
    if (!newTraining.name || !newTraining.date || !newTraining.time || !newTraining.category || selectedExercises.length === 0) {
      setShowValidationAlert(true);
      return;
    }

    const newSession = {
      id: trainingSessions.length + previousSessions.length + 1,
      name: newTraining.name,
      date: newTraining.date,
      duration: selectedExercises.reduce((sum, ex) => sum + ex.duration, 0),
      exercises: selectedExercises,
      category: newTraining.category,
      focus: "Custom",
      attendance: "0/0",
      path: "/dashboard/entrenamiento/planificar"
    };

    setTrainingSessions(prevSessions => [...prevSessions, newSession]);
    handleCancelForm();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Fácil":
        return "bg-[#25d03f] text-black"
      case "Media":
        return "bg-[#f4c11a] text-black"
      case "Difícil":
        return "bg-red-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const playersForAttendance = newTraining.category
  ? allPlayers.filter(p => p.category === newTraining.category && p.status === 'DISPONIBLE')
  : allPlayers.filter(p => p.status === 'DISPONIBLE');


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Planificar Entrenamiento</h2>
          <p className="text-gray-400">Organiza y programa las sesiones de entrenamiento</p>
        </div>
        
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
                      <p className="text-white">{showTrainingDetail.date.split("-").reverse().join(" - ")}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Hora:</span>
                      <p className="text-white">{showTrainingDetail.time}</p>
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
                            style={{ backgroundColor: getCategoryColors(exercise.category) }}
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
                    {playersForAttendance.map((player: any) => (
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
                        {playersForAttendance.length - Object.values(attendance).filter(Boolean).length}/
                        {playersForAttendance.length}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Contenido principal, que se oculta al planificar */}
      {!showPlannerForm ? (
        <>
          <Card className="bg-[#213041] border-[#305176]">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-white flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Entrenamientos Programados
              </CardTitle>
              <Button className="bg-[#aff606] text-black hover:bg-[#25d03f]" onClick={() => setShowPlannerForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Planificar Próximo Entrenamiento
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trainingSessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 bg-[#1d2834] rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <Calendar className="h-8 w-8 text-[#aff606] mx-auto mb-1" />
                        <p className="text-xs text-gray-400">{session.date.split("-").reverse().join(" - ")}</p>
                        <p className="text-xs text-gray-400">{session.time}</p>
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
      ) : (
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
                      value={newTraining.name}
                      onChange={(e) => setNewTraining({ ...newTraining, name: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="training-date" className="text-white">
                        Fecha
                      </Label>
                      <Input
                        id="training-date"
                        type="date"
                        className="bg-[#1d2834] border-[#305176] text-white"
                        value={newTraining.date}
                        onChange={(e) => setNewTraining({ ...newTraining, date: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="training-time" className="text-white">
                        Hora
                      </Label>
                      <Input
                        id="training-time"
                        type="time"
                        className="bg-[#1d2834] border-[#305176] text-white"
                        value={newTraining.time}
                        onChange={(e) => setNewTraining({ ...newTraining, time: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Categoría de la Plantilla</Label>
                  <Select
                    value={newTraining.category}
                    onValueChange={(value) => setNewTraining({ ...newTraining, category: value })}
                  >
                    <SelectTrigger className="bg-[#1d2834] border-[#305176] text-white">
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#213041] border-[#305176]">
                      {playersInTraining.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id} className="text-white">
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                

                {/* Filtros para Ejercicios Disponibles */}
                <div className="space-y-3">
                  <Label className="text-white">Ejercicios Disponibles</Label>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="space-y-1 flex-1 min-w-[150px]">
                      <Label className="text-white text-xs">Búsqueda</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          placeholder="Buscar ejercicio..."
                          className="pl-10 h-9 bg-[#1d2834] border-[#305176] text-white"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-white text-xs">Categoría</Label>
                      <Select value={filterCategory} onValueChange={setFilterCategory}>
                        <SelectTrigger className="w-24 h-9 bg-[#1d2834] border-[#305176] text-white text-xs">
                          <SelectValue placeholder="Categoría" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#213041] border-[#305176]">
                          {categoriesOptions.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id} className="text-white text-xs">
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-white text-xs">Jugadores</Label>
                      <Select value={filterPlayers} onValueChange={setFilterPlayers}>
                        <SelectTrigger className="w-24 h-9 bg-[#1d2834] border-[#305176] text-white text-xs">
                          <SelectValue placeholder="Jugadores" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#213041] border-[#305176]">
                          <SelectItem value="all" className="text-white text-xs">
                            Todos
                          </SelectItem>
                          {uniquePlayers.map((num) => (
                            <SelectItem key={num} value={num.toString()} className="text-white text-xs">
                              {num}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-white text-xs">Arqueros</Label>
                      <Select value={filterGoalkeepers} onValueChange={setFilterGoalkeepers}>
                        <SelectTrigger className="w-24 h-9 bg-[#1d2834] border-[#305176] text-white text-xs">
                          <SelectValue placeholder="Arqueros" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#213041] border-[#305176]">
                          <SelectItem value="all" className="text-white text-xs">
                            Todos
                          </SelectItem>
                          {uniqueGoalkeepers.map((num) => (
                            <SelectItem key={num} value={num.toString()} className="text-white text-xs">
                              {num}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-white text-xs">Dificultad</Label>
                      <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
                        <SelectTrigger className="w-24 h-9 bg-[#1d2834] border-[#305176] text-white text-xs">
                          <SelectValue placeholder="Dificultad" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#213041] border-[#305176]">
                          {difficultyOptions.map((opt) => (
                            <SelectItem key={opt.id} value={opt.id} className="text-white text-xs">
                              {opt.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-white text-xs">Tiempo</Label>
                      <Select value={filterTime} onValueChange={setFilterTime}>
                        <SelectTrigger className="w-24 h-9 bg-[#1d2834] border-[#305176] text-white text-xs">
                          <SelectValue placeholder="Tiempo" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#213041] border-[#305176]">
                          <SelectItem value="all" className="text-white text-xs">
                            Todos
                          </SelectItem>
                          {uniqueDurations.map((time) => (
                            <SelectItem key={time} value={time.toString()} className="text-white text-xs">
                              {time}min
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="mt-auto">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-red-400 hover:bg-red-500/20 hover:text-red-300"
                        onClick={handleClearFilters}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto mt-4">
                    {filteredExercises.map((exercise) => (
                      <div key={exercise.id} className="flex items-center justify-between p-3 bg-[#1d2834] rounded-lg">
                        <div>
                          <p className="text-white font-medium">{exercise.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                             <p className="text-gray-400 text-sm">
                               {exercise.category} • {exercise.duration}min
                             </p>
                             <Badge
                               className={getDifficultyColor(exercise.difficulty)}
                            >
                              {exercise.difficulty}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
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
                  <Button
                    className="w-full bg-[#aff606] text-black hover:bg-[#25d03f] h-11 text-lg"
                    onClick={handleSaveTraining}
                  >
                    Guardar Entrenamiento
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-red-500 text-red-500 hover:bg-red-500 hover:text-white bg-transparent h-11 text-lg"
                    onClick={handleCancelForm}
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
                        {pieData.length === 1 ? (
                          <circle
                            cx="100"
                            cy="100"
                            r="80"
                            fill={pieData[0].color}
                            stroke="#1d2834"
                            strokeWidth="2"
                          />
                        ) : (
                          pieData.map((segment, index) => {
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
                          })
                        )}
                      </svg>
                    </div>

                    {/* Leyenda */}
                    <div className="space-y-2">
                      {pieData.map((segment, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: segment.color }}></div>
                            <span className="text-white text-sm">{segment.category}</span>
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
      
      {/* Alert Dialog for Form Validation */}
      <AlertDialog open={showValidationAlert} onOpenChange={setShowValidationAlert}>
        <AlertDialogContent className="bg-[#213041] border-[#305176]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Campos Incompletos</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Por favor, completa todos los campos del formulario y agrega al menos un ejercicio.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setShowValidationAlert(false)}
              className="bg-[#aff606] text-black hover:bg-[#25d03f]"
            >
              Aceptar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  )
}