"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Calendar as CalendarIcon, Clock, Target, PieChart, Users, X, Check, Search, Trash2, Edit, Eye } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { format } from "date-fns" // Importación necesaria para el formato de fecha
import { es } from 'date-fns/locale/es'; // Importar locale español

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog" 
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover" 
import { Calendar } from "@/components/ui/calendar" 

// --- CONSTANTES GLOBALES DE NOTA ---
const NOTE_TYPE = "Note"; 
const NOTE_NEUTRAL_COLOR = "#7c7c7c"; // Color gris oscuro neutro
const NOTE_CATEGORY_NAME = "Nota de Sesión";
// ---------------------------------

// Función de ayuda para obtener la fecha y hora actual predeterminada
const getInitialDateTime = () => {
  const now = new Date();
  
  // Usamos el objeto Date para almacenar la fecha completa
  const dateObject = now;
  
  // Formato HH:MM para input type="time"
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const timeString = `${hours}:${minutes}`;

  return { date: dateObject, time: timeString };
};

// --- FUNCIÓN AUXILIAR PARA OBTENER LA CATEGORÍA POR DEFECTO DEL PERFIL (CORREGIDA) ---
const getInitialCategory = (): string => {
  if (typeof window !== "undefined") {
    const profileJson = localStorage.getItem("userProfile");
    if (profileJson) {
      try {
        const profile = JSON.parse(profileJson);
        // CORRECCIÓN: La categoría está anidada
        return profile?.category?.id || ""; 
      } catch (e) {
        console.error("Error parsing user profile from localStorage", e);
        return "";
      }
    }
  }
  return "";
};
// ---------------------------------------------------------------------------------


export function TrainingPlannerSection() {
  const [showPlannerForm, setShowPlannerForm] = useState(false)
  const [selectedExercises, setSelectedExercises] = useState<any[]>([])
  const [showTrainingDetail, setShowTrainingDetail] = useState<any>(null)
  const [showAttendance, setShowAttendance] = useState(false)
  const [attendance, setAttendance] = useState<Record<number, boolean>>({}) 
  const [showValidationAlert, setShowValidationAlert] = useState(false)
  const [trainingToDelete, setTrainingToDelete] = useState<number | null>(null)
  const [showExerciseDetail, setShowExerciseDetail] = useState<any>(null)
  
  const [validationMessage, setValidationMessage] = useState("Por favor, completa todos los campos del formulario y agrega al menos un ejercicio.");

  const [showNoteModal, setShowNoteModal] = useState(false)
  const [newNote, setNewNote] = useState({
    title: "",
    duration: "",
    description: "",
  })

  const [newTraining, setNewTraining] = useState(() => {
    const initialDateTime = getInitialDateTime();
    return {
      name: "",
      date: initialDateTime.date as Date, 
      time: initialDateTime.time,
      category: getInitialCategory(), // <-- Se establece la categoría predeterminada aquí
    }
  });

  // #######################################################################
  // ###       EJEMPLOS DE ENTRENAMIENTOS CON "createdBy" AÑADIDO        ###
  // #######################################################################
  const [trainingSessions, setTrainingSessions] = useState([
    {
      id: 1,
      name: "Entrenamiento Táctico - Ataque",
      date: "2025-11-08", // Fecha futura
      time: "10:00",
      duration: 90,
      exercises: [
        { id:1, name: "Ataque 4-3-3 por bandas", category: "Ataque", duration: 20, type: "Táctico", players:11, goalkeepers:1, difficulty:"Media", materials:"Conos, balones", objective:"Mejorar el juego por las bandas", description: "Ejercicio de ataque posicional para romper líneas por las bandas y buscar centros al área.", },
        { id:2, name: "Transición defensa-ataque", category: "Transiciones", duration: 18, type: "Táctico", players:10, goalkeepers:1, difficulty:"Media", materials:"Balones, conos", objective:"Mejorar transiciones rápidas", description: "Ejercicio para practicar la transición rápida de defensa a ataque, creando superioridad numérica.", },
        { id:3, name: "Presión alta coordinada", category: "Defensa", duration: 15, type: "Táctico", players:8, goalkeepers:0, difficulty:"Difícil", materials:"Conos, petos", objective:"Coordinar la presión defensiva", description: "Ejercicio para coordinar la presión de todo el equipo en campo rival, forzando errores del oponente.", },
        { id:4, name: "Tiros libres directos", category: "Balón Parado", duration: 12, type: "Táctico", players:6, goalkeepers:1, difficulty:"Fácil", materials:"Balones, barrera", objective:"Mejorar precisión en tiros libres", description: "Práctica de tiros libres directos para mejorar la técnica y la efectividad en estas jugadas.", },
        { id:5, name: "Salida con los pies", category: "Arquero-Jugador", duration: 25, type: "Táctico", players:4, goalkeepers:1, difficulty:"Media", materials:"Balones, conos", objective:"Mejorar distribución del arquero", description: "Ejercicio para que el arquero practique la distribución de balón con los pies, buscando pases largos y cortos.", },
      ],
      category: "Primera División",
      categoryId: "primera",
      createdBy: "DIRECTOR TECNICO", // <-- ETIQUETA
      attendance: "0/25", // Aún no sucedió
      path: "/dashboard/entrenamiento/planificar"
    },
    {
      id: 2,
      name: "Preparación Física - Resistencia",
      date: "2025-11-10", // Fecha futura
      time: "15:00",
      duration: 75,
      exercises: [
        { id:101, name: "Circuito de resistencia", category: "Resistencia", duration: 30, type: "Físico", players:15, goalkeepers:0, difficulty:"Media", materials:"Conos, cronómetro", objective:"Mejorar la capacidad aeróbica", description: "Circuito de alta intensidad para mejorar la resistencia cardiovascular y la capacidad aeróbica.", },
        { id:102, name: "Sprints cortos", category: "Fuerza", duration: 20, type: "Físico", players:12, goalkeepers:0, difficulty:"Difícil", materials:"Pesas, bandas elásticas", objective:"Desarrollar fuerza específica para fútbol", description: "Sprints de corta distancia con recuperación activa para mejorar la velocidad y la aceleración.", },
        { id:103, name: "Trabajo aeróbico", category: "Resistencia", duration: 25, type: "Físico", players:10, goalkeepers:0, difficulty:"Fácil", materials:"Conos, petos", objective:"Mejorar la resistencia aeróbica", description: "Trabajo aeróbico a baja intensidad para la recuperación activa y el desarrollo de la resistencia.", },
      ],
      category: "Primera División",
      categoryId: "primera",
      createdBy: "PREPARADOR FISICO", // <-- ETIQUETA
      attendance: "0/25", // Aún no sucedió
      path: "/dashboard/entrenamiento/planificar"
    },
  ]);
  // #######################################################################

  // Filtros
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterPlayers, setFilterPlayers] = useState("all")
  const [filterGoalkeepers, setFilterGoalkeepers] = useState("all")
  const [filterDifficulty, setFilterDifficulty] = useState("all")
  const [filterTime, setFilterTime] = useState("all")
  const today = new Date().toISOString().split("T")[0]

  // --- OBTENER PERFIL Y CATEGORÍA ACTUAL (CORREGIDO) ---
  const savedProfile = typeof window !== "undefined" ? localStorage.getItem("userProfile") : null
  const profileData = savedProfile ? JSON.parse(savedProfile) : null

  // #######################################################################
  // ###                 ESTA ES LA CORRECCIÓN CLAVE                     ###
  // ###     Se lee la estructura correcta del JSON de userProfile       ###
  // #######################################################################
  const profileType = profileData?.profile?.role; // Ej: "PREPARADOR FISICO"
  const profileCategory = profileData?.category?.id; // Ej: "primera"
  // #######################################################################


  // Helper function to format the date as DD - MM - YYYY
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A"
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const [year, month, day] = parts;
      return `${day} - ${month} - ${year}`;
    }
    return dateString;
  };
  
  // Helper function to format Date object for display
  const formatDisplayDate = (date: Date | undefined) => {
    if (!date) return "Seleccionar fecha";
    // Formato legible: DD/MM/YYYY
    return format(date, "PPP", { locale: es }); // Usamos el locale español para el display
  };


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
        const randomNickname = nicknames[Math.floor(Math.random() * nicknames.length)]
        const randomPosition = ["Arquero", "Defensor", "Mediocampista", "Delantero"][Math.floor(Math.random() * 4)]
        const randomFoot = ["Derecho", "Izquierdo", "Ambidiestro"][Math.floor(Math.random() * 3)]
        const randomYear = 1990 + Math.floor(Math.random() * 15)
        const randomMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0")
        const randomDay = String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")
        const isInjured = Math.random() < 0.3
        const randomPhone = `+54 9 11 ${Math.floor(Math.random() * 10000)}-${Math.floor(Math.random() * 10000)}`

        players.push({
          id: playerId++,
          firstName: randomFirstName,
          lastName: randomLastName,
          nickname: randomNickname,
          birthDate: `${randomYear}-${randomMonth}-${randomDay}`,
          phoneNumber: randomPhone,
          position: randomPosition,
          foot: randomFoot,
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
  
  // #######################################################################
  // ###     EJEMPLOS DE SESIONES RECIENTES CON "createdBy" AÑADIDO      ###
  // #######################################################################
  const previousSessions = [
    {
      id: 3,
      name: "Entrenamiento Técnico",
      date: "2024-01-10",
      duration: 60,
      exercises: [
        { id:1, name: "Control y pase", category: "Técnico", duration: 20, type: "Técnico", players:11, goalkeepers:1, difficulty:"Media", materials:"Conos, balones", objective:"Mejorar el juego por las bandas" },
        { id:2, name: "Definición", category: "Ataque", duration: 25, type: "Técnico", players:10, goalkeepers:1, difficulty:"Media", materials:"Balones, conos", objective:"Mejorar transiciones rápidas" },
        { id:3, name: "Juego aéreo", category: "Defensa", duration: 15, type: "Técnico", players:8, goalkeepers:0, difficulty:"Difícil", materials:"Conos, petos", objective:"Coordinar la presión defensiva" },
      ],
      category: "Juveniles",
      categoryId: "juveniles",
      createdBy: "DIRECTOR TECNICO", // <-- ETIQUETA
      attendance: "19/22"
    },
    {
      id: 4,
      name: "Trabajo Defensivo",
      date: "2024-01-08",
      duration: 80,
      exercises: [
        { id:1, name: "Marcaje individual", category: "Defensa", duration: 25, type: "Táctico", players:11, goalkeepers:1, difficulty:"Media", materials:"Conos, balones", objective:"Mejorar el juego por las bandas" },
        { id:2, name: "Coberturas", category: "Defensa", duration: 20, type: "Táctico", players:10, goalkeepers:1, difficulty:"Media", materials:"Balones, conos", objective:"Mejorar transiciones rápidas" },
        { id:3, name: "Salida jugada", category: "Defensa", duration: 35, type: "Táctico", players:8, goalkeepers:0, difficulty:"Difícil", materials:"Conos, petos", objective:"Coordinar la presión defensiva" },
      ],
      category: "Primera División",
      categoryId: "primera",
      createdBy: "DIRECTOR TECNICO", // <-- ETIQUETA
      attendance: "20/22"
    },
    {
      id: 5,
      name: "Sesión Física Juveniles",
      date: "2024-01-07",
      duration: 40,
      exercises: [ 
        { id:101, name: "Circuito de resistencia", category: "Resistencia", duration: 40, type: "Físico", players:15, goalkeepers:0, difficulty:"Media", materials:"Conos, cronómetro", objective:"Mejorar la capacidad aeróbica", description: "...", },
      ],
      category: "Juveniles",
      categoryId: "juveniles",
      createdBy: "PREPARADOR FISICO", // <-- ETIQUETA
      attendance: "15/15"
    },
  ];
  // #######################################################################
  
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
      description: "Ejercicio de ataque posicional para romper líneas por las bandas y buscar centros al área.",
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
      description: "Ejercicio para coordinar la presión de todo el equipo en campo rival, forzando errores del oponente.",
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
      description: "Ejercicio para practicar la transición rápida de defensa a ataque, creando superioridad numérica.",
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
      description: "Práctica de tiros libres directos para mejorar la técnica y la efectividad en estas jugadas.",
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
      description: "Ejercicio para que el arquero practique la distribución de balón con los pies, buscando pases largos y cortos.",
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
      createdAt: "2024-01-15",
      description: "Circuito de alta intensidad para mejorar la resistencia cardiovascular y la capacidad aeróbica.",
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
      createdAt: "2024-01-14",
      description: "Sprints de corta distancia con recuperación activa para mejorar la velocidad y la aceleración.",
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
      type: "Kinesiológico", // Ajustado a "Kinesiológico"
      createdAt: "2024-01-15",
      description: "Ejercicio para que el arquero practique la distribución de balón con los pies, buscando pases largos y cortos.",
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
      type: "Kinesiológico", // Ajustado a "Kinesiológico"
      createdAt: "2024-01-14",
      description: "Fortalecimiento de músculos estabilizadores del tobillo para prevenir lesiones comunes en el fútbol.",
    },
  ];

  // --- LÓGICA DE EJERCICIOS DISPONIBLES MODIFICADA ---
  // El PF ahora también puede ver los ejercicios TÉCNICOS del DT
  let availableExercises = []
  if (profileType === "DIRECTOR TECNICO") {
    availableExercises = exercisesFromManagement.filter(ex => ex.type === "Técnico")
  } else if (profileType === "PREPARADOR FISICO") {
    availableExercises = [
      ...exercisesFromPhysical, 
      ...exercisesFromKinesiology,
      ...exercisesFromManagement.filter(ex => ex.type === "Técnico") // <-- PF PUEDE VER TÉCNICOS
    ]
  } else if (profileType === "KINESIOLOGO") {
    availableExercises = exercisesFromKinesiology.filter(ex => ex.type === "Kinesiológico")
  } else {
    // Modo "TODOS" (ej. Directivo)
    availableExercises = [...exercisesFromManagement, ...exercisesFromPhysical, ...exercisesFromKinesiology]
  }
  // --------------------------------------------------

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
    .sort((a, b) => a.id - b.id)

  // Helper para generar ID de nota
  const generateNoteId = () => `note-${Date.now()}`;

  const addExercise = (exercise: any) => {
    if (!selectedExercises.find((e) => e.id === exercise.id)) {
      setSelectedExercises([...selectedExercises, exercise])
    }
  }

  // --- LÓGICA PARA AÑADIR NOTA ---
  const handleAddNote = () => {
    if (!newNote.title.trim()) {
      alert("El Título de la nota es obligatorio.");
      return;
    }

    const duration = parseInt(newNote.duration) || 0;

    const note = {
      id: generateNoteId(),
      name: newNote.title.trim(),
      category: NOTE_CATEGORY_NAME, 
      duration: duration,
      players: 0,
      goalkeepers: 0,
      difficulty: "N/A",
      materials: "N/A",
      objective: newNote.description,
      type: NOTE_TYPE, // Flag para exclusión del gráfico
    };

    setSelectedExercises(prev => [...prev, note]);
    setNewNote({ title: "", duration: "", description: "" });
    setShowNoteModal(false);
  };
  // ------------------------------

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
        case 'Kinesiológico': return '#4ecdc4'; // Añadido para Kine
        case 'Físico': return '#25d03f'; // Añadido para Físico
        case NOTE_CATEGORY_NAME: return NOTE_NEUTRAL_COLOR; // Color neutral para notas
        default: return '#aff606';
    }
  };

  const calculatePieData = () => {
    const sessionToDisplay = showTrainingDetail || { exercises: selectedExercises };

    // MODIFICACIÓN CLAVE: Filtramos explícitamente las notas (`exercise.type === NOTE_TYPE`)
    const graphExercises = sessionToDisplay.exercises
      .filter((exercise: any) => exercise.type !== NOTE_TYPE);

    const categoryCount = graphExercises.reduce(
      (acc: Record<string, number>, exercise: any) => {
        const category = exercise.category;
        acc[category] = (acc[category] || 0) + exercise.duration;
        return acc;
      },
      {} as Record<string, number>,
    );

    const totalGraphDuration = Object.values(categoryCount).reduce((sum, duration) => sum + duration, 0);

    return Object.entries(categoryCount).map(([category, duration]) => ({
      category,
      duration,
      // Usamos la duración total de los ejercicios que SÍ están en el gráfico
      percentage: totalGraphDuration > 0 ? Math.round((duration / totalGraphDuration) * 100) : 0, 
      color: getCategoryColors(category),
    }));
  }

  const pieData = calculatePieData()

  const getCategoriesInTraining = (exercises: any[]) => {
    // Esta función se utiliza para los puntos de color en el resumen de la sesión
    const categories = [...new Set(exercises.map((ex) => ex.category))]
    const colors = {
      Ataque: "#ea3498",
      Defensa: "#33d9f6",
      Transiciones: "#f4c11a",
      "Balón Parado": "#8a46c5",
      Físico: "#25d03f",
      Técnico: "#aff606",
      "Arquero-Jugador": "#ff6b35",
      Resistencia: "#25d03f",
      Fuerza: "#ff6b35",
      Velocidad: "#4ecdc4",
      Agilidad: "#45b7d1",
      Flexibilidad: "#96ceb4",
      Rehabilitación: "#4ecdc4",
      Prevención: "#45b7d1",
      Fortalecimiento: "#96ceb4",
      Movilidad: "#f1a85f",
      Recuperación: "#c9d99d",
      [NOTE_CATEGORY_NAME]: NOTE_NEUTRAL_COLOR,
    }

    return categories.map((cat) => ({
      name: cat,
      color: colors[cat as keyof typeof colors] || "#aff606",
    }))
  }
  
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


  const handleAttendanceToggle = (playerId: number) => {
    // Si la sesión está programada, actualiza el estado de asistencia, que a su vez afectará la simulación.
    if (showTrainingDetail && trainingSessions.some(s => s.id === showTrainingDetail.id)) {
      setAttendance((prev) => ({
        ...prev,
        [playerId]: !prev[playerId],
      }))
    }
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
    const initialDateTime = getInitialDateTime();
    setShowPlannerForm(false);
    setNewTraining({ 
      name: "", 
      date: initialDateTime.date as Date,
      time: initialDateTime.time,
      category: getInitialCategory() // Restablecer a la categoría por defecto
    });
    setSelectedExercises([]);
  };

  // --- FUNCIÓN DE GUARDADO MODIFICADA ---
  const handleSaveTraining = () => {
    // 0. Preliminary validation (Fields)
    if (!newTraining.name || !newTraining.date || !newTraining.time || !newTraining.category || selectedExercises.length === 0) {
      setValidationMessage("Por favor, completa todos los campos del formulario y agrega al menos un ejercicio.");
      setShowValidationAlert(true);
      return;
    }

    // 1. Time Validation
    const [hours, minutes] = newTraining.time.split(':').map(Number);
    const plannedDateTime = new Date(newTraining.date);
    // Establecemos la hora, minutos, y segundos a cero para la comparación
    plannedDateTime.setHours(hours, minutes, 0, 0); 

    const currentDateTime = new Date();

    if (plannedDateTime.getTime() <= currentDateTime.getTime()) {
      setValidationMessage("La fecha y hora del entrenamiento deben ser futuras a la hora actual.");
      setShowValidationAlert(true);
      return;
    }
    
    // Convertir el objeto Date a string en formato YYYY-MM-DD para la sesión
    const dateString = format(newTraining.date, 'yyyy-MM-dd');

    const newSession = {
      id: trainingSessions.length + previousSessions.length + 1,
      name: newTraining.name,
      date: dateString,
      time: newTraining.time,
      // Se suman los minutos de ejercicios y notas
      duration: selectedExercises.reduce((sum, ex) => sum + ex.duration, 0), 
      exercises: selectedExercises,
      category: playersInTraining.find(cat => cat.id === newTraining.category)?.name || "N/A",
      categoryId: newTraining.category,
      createdBy: profileType, // <-- CAMBIO CLAVE: Se etiqueta el ROL que lo crea
      attendance: `0/${allPlayers.filter(p => p.category === newTraining.category).length}`, // Simulación de asistencia
      path: "/dashboard/entrenamiento/planificar"
    };

    setTrainingSessions(prevSessions => [...prevSessions, newSession]);
    handleCancelForm();
  };
  // --- FIN DE FUNCIÓN DE GUARDADO ---
  
  const handleDeleteTraining = () => {
    if (trainingToDelete) {
      setTrainingSessions(prevSessions => prevSessions.filter(t => t.id !== trainingToDelete));
      setTrainingToDelete(null);
      setShowTrainingDetail(null);
    }
  };

  const playersForAttendance = showTrainingDetail?.categoryId
  ? allPlayers.filter(p => p.category.toLowerCase() === showTrainingDetail.categoryId.toLowerCase() && p.status === 'DISPONIBLE')
  : [];

  const sortedAttendance = playersForAttendance.sort((a: any, b: any) => {
    // SIMULACIÓN DE ASISTENCIA: Los jugadores cuyo ID es divisible por 5 están ausentes por defecto.
    const isMissingA = (a.id % 5) === 0; 
    const isMissingB = (b.id % 5) === 0;

    // ORDENAMIENTO: Inasistentes primero
    if (isMissingA && !isMissingB) return -1;
    if (!isMissingA && isMissingB) return 1;
    return 0;
  });

  // Determina si el entrenamiento es uno "programado" (que permite tomar asistencia en vivo)
  const isScheduledSession = trainingSessions.some(s => s.id === showTrainingDetail?.id);

  // Calcula el conteo de asistentes/inasistentes para mostrar en el encabezado de la lista
  const attendanceCount = sortedAttendance.reduce((acc, player) => {
    // La inasistencia se basa en la simulación por ID, o en el estado si fue tocado (aunque solo funciona en el render)
    const isMissingSimulated = (player.id % 5) === 0;
    
    // Para simplificar la simulación visual, nos basamos solo en la simulación por ID en este mock
    if (isMissingSimulated) {
      acc.missing++;
    } else {
      acc.present++;
    }
    return acc;
  }, { present: 0, missing: 0 });

  
  // #######################################################################
  // ###       FILTRADO DE SESIONES POR ROL Y CATEGORÍA                  ###
  // #######################################################################
  // Filtramos las sesiones que se mostrarán en la UI
  const filteredProgrammedSessions = trainingSessions.filter(
    (session) =>
      session.categoryId === profileCategory && // Coincide la categoría (ej: "primera")
      session.createdBy === profileType // Coincide el ROL (ej: "PREPARADOR FISICO")
  );

  const filteredRecentSessions = previousSessions.filter(
    (session) =>
      session.categoryId === profileCategory && // Coincide la categoría
      session.createdBy === profileType // Coincide el ROL
  );
  // #######################################################################


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Planificar Entrenamiento</h2>
          <p className="text-gray-400">Organiza y programa las sesiones de entrenamiento</p>
        </div>
        
      </div>

      {/* Training Detail Modal (COMPARTIDO Y FUNCIONAL) */}
      <Dialog open={!!showTrainingDetail} onOpenChange={() => {setShowTrainingDetail(null); setShowAttendance(false);}}>
        <DialogContent className="sm:max-w-[700px] bg-[#213041] border-[#305176] text-white">
          <DialogHeader className="text-center">
            <DialogTitle className="text-white text-2xl font-bold">
              {showTrainingDetail?.name}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Detalles del entrenamiento del {formatDate(showTrainingDetail?.date)}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-4">
            
            {/* Columna Izquierda: Ejercicios y Resumen / Asistencia */}
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
              </div>
              
              {/* Botón de Asistencia para alternar la vista */}
              <div className="col-span-2">
                <Button 
                  className={`w-full justify-between h-12 text-white font-medium ${isScheduledSession ? 'bg-[#ff6b35] hover:bg-[#d4552b]' : 'bg-[#305176] hover:bg-[#305176]/80'}`}
                  onClick={() => setShowAttendance(!showAttendance)}
                >
                  <Users className="h-5 w-5 mr-2" />
                  {showAttendance ? "Ver Detalles" : (isScheduledSession ? "Tomar Asistencia" : "Ver Asistencia")}
                  <Badge className="bg-[#aff606] text-black ml-auto">
                    {showTrainingDetail?.attendance}
                  </Badge>
                </Button>
              </div>
              
              {!showAttendance ? (
                /* Contenido de Detalles */
                <>
                  {/* Lista de Ejercicios */}
                  <div>
                    <h4 className="text-white font-medium mb-3">Ejercicios ({showTrainingDetail?.exercises?.length || 0})</h4>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                      {showTrainingDetail?.exercises?.map((exercise: any, index: number) => (
                        <div 
                          key={index} 
                          className="flex items-center justify-between p-3 bg-[#1d2834] rounded-lg cursor-pointer hover:bg-[#305176] transition-colors"
                          // Permite abrir el detalle solo si no es una nota
                          onClick={() => exercise.type !== NOTE_TYPE && setShowExerciseDetail(exercise)} 
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-[#aff606] font-bold">{index + 1}.</span>
                            <div>
                              {/* Título y tiempo */}
                              <p className="text-white font-medium">{exercise.name}</p>
                              {/* Muestra duración si es un ejercicio o una nota con tiempo */}
                              {exercise.duration > 0 && <p className="text-gray-400 text-sm">{exercise.duration} min</p>} 
                              {/* Muestra descripción si es una nota sin duración */}
                              {exercise.type === NOTE_TYPE && exercise.objective && <p className="text-gray-500 text-xs italic">{exercise.objective}</p>}
                            </div>
                          </div>
                          {/* Solo el círculo de color */}
                          <div
                            className="w-4 h-4 rounded-full"
                            // Usa el color de categoría, que es neutro para las notas
                            style={{ backgroundColor: getCategoryColors(exercise.category) }}
                            title={exercise.category} // Añadir título para accesibilidad
                          ></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                /* Contenido de Asistencia (SIMULACIÓN ACTIVA) */
                <div className="space-y-4 lg:col-span-2">
                  <h4 className="text-white font-medium">Lista de Asistencia - {showTrainingDetail?.category}</h4>
                  <div className="space-y-2 max-h-72 overflow-y-auto">
                    {sortedAttendance.map((player: any) => {
                      // LÓGICA DE SIMULACIÓN PARA LA LISTA:
                      const isMissingSimulated = (player.id % 5) === 0;

                      return (
                        <div
                          key={player.id}
                          className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                            isMissingSimulated
                              ? "bg-red-900/30 border border-red-500"
                              : "bg-[#1d2834] hover:bg-[#305176]"
                          } ${isScheduledSession ? 'cursor-pointer' : 'cursor-default'}`}
                          // Si la sesión es programada, permite el toggle (aunque el efecto visual se resetea al salir del modal)
                          onClick={() => {
                            if (isScheduledSession) {
                              handleAttendanceToggle(player.id);
                            }
                          }}
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                isMissingSimulated ? "border-red-500 bg-red-500" : "border-[#25d03f] bg-[#25d03f]"
                              }`}
                            >
                              {isMissingSimulated ? (
                                <X className="h-3 w-3 text-white" />
                              ) : (
                                <Check className="h-3 w-3 text-black" />
                              )}
                            </div>
                            <span className={`font-medium ${isMissingSimulated ? "text-red-400" : "text-white"}`}>
                              {player.firstName} {player.lastName}
                            </span>
                          </div>
                          <Badge className={isMissingSimulated ? "bg-red-500 text-white" : "bg-[#25d03f] text-black"}>
                            {isMissingSimulated ? "Inasistente" : "Presente"}
                          </Badge>
                        </div>
                      )
                    })}
                  </div>
                  <div className="pt-4 border-t border-[#305176]">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Presentes:</span>
                      <span className="text-[#25d03f] font-bold">
                        {attendanceCount.present}/{playersForAttendance.length}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Columna Derecha: Gráfico de Distribución (Pie Chart) */}
            <div className={`space-y-4 ${showAttendance ? 'hidden lg:block' : ''}`}> 
              <CardHeader className="p-0 flex flex-row items-center justify-between">
                <CardTitle className="text-white flex items-center">
                  <PieChart className="h-5 w-5 mr-2" />
                  Distribución por Categoría
                </CardTitle>
              </CardHeader>
              <div className="flex flex-col items-center">
                <div className="relative w-48 h-48 mx-auto mb-4">
                  {/* Renderizado del gráfico de pizza */}
                  {showTrainingDetail?.exercises?.filter((ex: any) => ex.type !== NOTE_TYPE).length > 0 ? (
                    <svg viewBox="0 0 200 200" className="w-full h-full">
                      {calculatePieData().map((segment, segIndex) => {
                        const pieData = calculatePieData();
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
                  {calculatePieData().map((segment, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: segment.color }}></div>
                      <span className="text-white text-sm">{segment.category}</span>
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


      {/* Contenido principal, que se oculta al planificar */}
      {!showPlannerForm ? (
        <>
          <Card className="bg-[#213041] border-[#305176]">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2" />
                Entrenamientos Programados
              </CardTitle>
              <Button 
                size="sm"
                className="bg-[#aff606] text-black hover:bg-[#25d03f] whitespace-nowrap font-semibold" 
                onClick={() => setShowPlannerForm(true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Planificar Próximo Entrenamiento
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                
                {/* ###################################################### */}
                {/* ###    SE USA LA LISTA FILTRADA "filteredProgrammedSessions"   ### */}
                {/* ###################################################### */}
                {filteredProgrammedSessions.length > 0 ? (
                  filteredProgrammedSessions.slice(0, 3).map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 bg-[#1d2834] rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <CalendarIcon className="h-8 w-8 text-[#aff606] mx-auto mb-1" />
                          <p className="text-xs text-gray-400">{formatDate(session.date)}</p>
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
                        {/* Botón de Programados con Eye icon y estilo outline */}
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-[#aff606] text-[#aff606] hover:bg-[#aff606] hover:text-black bg-transparent"
                          onClick={() => {
                              setShowAttendance(false); // <-- Asegura que se abra en vista de detalles
                              setShowTrainingDetail(session);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Entrenamiento
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-400 hover:bg-red-500/20 hover:text-red-300"
                          onClick={() => setTrainingToDelete(session.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">
                    No hay entrenamientos programados para este perfil en esta categoría.
                  </p>
                )}
                {/* ###################################################### */}

              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#213041] border-[#305176]">
            <CardHeader>
              {/* Título con ícono de Calendar */}
              <CardTitle className="text-white flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2" />
                Entrenamientos Recientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                
                {/* ###################################################### */}
                {/* ###    SE USA LA LISTA FILTRADA "filteredRecentSessions"   ### */}
                {/* ###################################################### */}
                {filteredRecentSessions.length > 0 ? (
                  filteredRecentSessions.slice(0, 3).map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 bg-[#1d2834] rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <CalendarIcon className="h-8 w-8 text-gray-500 mx-auto mb-1" />
                          <p className="text-xs text-gray-400">{formatDate(session.date)}</p>
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
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">
                    No hay entrenamientos recientes para este perfil en esta categoría.
                  </p>
                )}
                {/* ###################################################### */}

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
                    
                    {/* CAMPO DE SELECCIÓN DE FECHA (CON POPOVER/CALENDARIO) */}
                    <div className="space-y-2">
                      <Label htmlFor="training-date" className="text-white">
                        Fecha
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className="w-full justify-start text-left font-normal bg-[#1d2834] border-[#305176] text-white hover:bg-[#305176] hover:text-white"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
                            {newTraining.date ? (
                              format(newTraining.date, "PPP", { locale: es }) // Usamos el locale español
                            ) : (
                              <span className="text-gray-400">Seleccionar fecha</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-[#213041] border-[#305176]">
                          <Calendar
                            mode="single"
                            selected={newTraining.date}
                            onSelect={(date) => setNewTraining({ ...newTraining, date: date as Date })}
                            initialFocus
                            locale={es} // Usar el locale español
                            classNames={{
                                caption_label: "text-white font-semibold", // Mes y Año en blanco
                                head_cell: "text-white rounded-md w-9 font-medium text-[0.8rem]", // Abreviaturas de días en blanco
                                day: "text-white", // Días del mes actual en blanco
                                day_outside: "text-gray-500 opacity-80", // Días fuera del mes en gris
                                // ESTILO PARA EL DÍA ACTUAL (Fondo verde, texto negro/negrita)
                                day_today: "bg-[#aff606] text-black hover:bg-[#25d03f] hover:text-black font-bold", 
                                // ESTILO para el día seleccionado (importante para mantener el contraste si se selecciona hoy)
                                day_selected: "bg-[#aff606] text-black hover:bg-[#aff606] hover:text-black focus:bg-[#aff606] focus:text-black",
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    {/* CAMPO DE HORA (Input simple) */}
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
                    <SelectTrigger className="w-full bg-[#1d2834] border-[#305176] text-white">
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
                    <div className="min-w-[140px] max-w-full flex-1">
                      <div className="relative">
                        <Input
                          placeholder="Buscar ejercicio..."
                          className="pl-8 h-9 bg-[#1d2834] border-[#305176] text-white text-xs w-full"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      </div>
                    </div>
                    <div className="min-w-[120px]">
                      <Select value={filterCategory} onValueChange={setFilterCategory}>
                        <SelectTrigger className="w-full h-8 bg-[#1d2834] border-[#305176] text-white text-xs">
                          <SelectValue placeholder="Categoría" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#213041] border-[#305176]">
                          <SelectItem value="all" className="text-white text-xs">Categoría</SelectItem>
                          {uniqueCategories.map((cat) => (
                            <SelectItem key={cat} value={cat} className="text-white text-xs">{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="min-w-[120px]">
                      <Select value={filterPlayers} onValueChange={setFilterPlayers}>
                        <SelectTrigger className="w-full h-8 bg-[#1d2834] border-[#305176] text-white text-xs">
                          <SelectValue placeholder="Jugadores" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#213041] border-[#305176]">
                          <SelectItem value="all" className="text-white text-xs">Jugadores</SelectItem>
                          {uniquePlayers.map((num) => (
                            <SelectItem key={num} value={num.toString()} className="text-white text-xs">{num}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="min-w-[120px]">
                      <Select value={filterGoalkeepers} onValueChange={setFilterGoalkeepers}>
                        <SelectTrigger className="w-full h-8 bg-[#1d2834] border-[#305176] text-white text-xs">
                          <SelectValue placeholder="Arqueros" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#213041] border-[#305176]">
                          <SelectItem value="all" className="text-white text-xs">Arqueros</SelectItem>
                          {uniqueGoalkeepers.map((num) => (
                            <SelectItem key={num} value={num.toString()} className="text-white text-xs">{num}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="min-w-[120px]">
                      <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
                        <SelectTrigger className="w-full h-8 bg-[#1d2834] border-[#305176] text-white text-xs">
                          <SelectValue placeholder="Dificultad" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#213041] border-[#305176]">
                          <SelectItem value="all" className="text-white text-xs">Dificultad</SelectItem>
                          <SelectItem value="Fácil" className="text-white text-xs">Fácil</SelectItem>
                          <SelectItem value="Media" className="text-white text-xs">Media</SelectItem>
                          <SelectItem value="Difícil" className="text-white text-xs">Difícil</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="min-w-[120px]">
                      <Select value={filterTime} onValueChange={setFilterTime}>
                        <SelectTrigger className="w-full h-8 bg-[#1d2834] border-[#305176] text-white text-xs">
                          <SelectValue placeholder="Tiempo" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#213041] border-[#305176]">
                          <SelectItem value="all" className="text-white text-xs">Tiempo</SelectItem>
                          {uniqueDurations.map((time) => (
                            <SelectItem key={time} value={time.toString()} className="text-white text-xs">{time}min</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
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
                              {exercise.duration > 0 && <p className="text-gray-300 text-xs">{exercise.duration}min</p>}
                              {exercise.type === NOTE_TYPE && exercise.objective && <p className="text-gray-500 text-xs italic">{exercise.objective}</p>}
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

                {/* Bloque modificado: Botones lado a lado */}
                <div className="flex justify-between space-x-4">
                  <Button
                    className="w-1/2 bg-[#aff606] text-black hover:bg-[#25d03f] h-11 text-lg"
                    onClick={handleSaveTraining}
                  >
                    Guardar Entrenamiento
                  </Button>
                  <Button
                    variant="outline"
                    className="w-1/2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white bg-transparent h-11 text-lg"
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
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white flex items-center">
                  <PieChart className="h-5 w-5 mr-2" />
                  Distribución del Entrenamiento
                </CardTitle>
                <Dialog open={showNoteModal} onOpenChange={setShowNoteModal}>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      className="bg-[#33d9f6] text-black hover:bg-[#2bc4ea] font-semibold"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Agregar Nota
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] bg-[#213041] border-[#305176] text-white">
                    <DialogHeader className="text-center">
                      <DialogTitle className="text-white text-2xl font-bold">
                        Agregar Nota/Pausa
                      </DialogTitle>
                      <DialogDescription className="text-gray-400">
                        Añade una nota o un tiempo de pausa a la sesión.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="note-title" className="text-white">
                          Título de la Nota *
                        </Label>
                        <Input
                          id="note-title"
                          placeholder="Ej: Charla Técnica"
                          value={newNote.title}
                          onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                          className="bg-[#1d2834] border-[#305176] text-white"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="note-duration" className="text-white">
                          Tiempo/Duración (min, opcional)
                        </Label>
                        <Input
                          id="note-duration"
                          type="number"
                          placeholder="10"
                          min="0"
                          value={newNote.duration}
                          onChange={(e) => setNewNote({ ...newNote, duration: e.target.value })}
                          className="bg-[#1d2834] border-[#305176] text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="note-description" className="text-white">
                          Descripción (opcional)
                        </Label>
                        <Textarea
                          id="note-description"
                          placeholder="Detalles sobre esta pausa o nota..."
                          value={newNote.description}
                          onChange={(e) => setNewNote({ ...newNote, description: e.target.value })}
                          className="bg-[#1d2834] border-[#305176] text-white min-h-[80px]"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-4">
                      <Button
                        variant="outline"
                        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white bg-transparent"
                        onClick={() => {
                          setShowNoteModal(false);
                          setNewNote({ title: "", duration: "", description: "" });
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button
                        className="bg-[#aff606] text-black hover:bg-[#25d03f]"
                        onClick={handleAddNote}
                      >
                        Guardar Nota
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {selectedExercises.filter((ex: any) => ex.type !== NOTE_TYPE).length > 0 ? (
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
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: segment.color }}></div>
                          <span className="text-white text-sm">{segment.category}</span>
                          <div className="text-right">
                            <p className="text-white font-bold">{segment.percentage}%</p>
                            <p className="text-gray-400 text-xs">{segment.duration}min</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-[#305176]">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Duración Total (Solo ejercicios):</span>
                        <span className="text-[#aff606] font-bold">
                          {selectedExercises.filter((ex: any) => ex.type !== NOTE_TYPE).reduce((sum, ex) => sum + ex.duration, 0)}min
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Duración Total (Incl. Notas):</span>
                        <span className="text-white font-bold">
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
            <AlertDialogTitle className="text-white">Error de Validación</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              {validationMessage}
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

      {/* Confirmation Dialog for Deleting Training */}
      <AlertDialog open={!!trainingToDelete} onOpenChange={() => setTrainingToDelete(null)}>
        <AlertDialogContent className="bg-[#213041] border-[#305176]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Confirmar Eliminación</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              ¿Estás seguro de que quieres eliminar este entrenamiento de forma permanente? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-[#305176] text-white hover:bg-[#305176]">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTraining}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Exercise Detail Dialog (READ-ONLY) */}
      <Dialog open={!!showExerciseDetail} onOpenChange={() => setShowExerciseDetail(null)}>
        <DialogContent className="sm:max-w-[425px] bg-[#213041] border-[#305176] text-white">
          <DialogHeader className="text-center">
            <DialogTitle className="text-white text-2xl font-bold">
              {showExerciseDetail?.name}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Categoría: {showExerciseDetail?.category}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Duración</Label>
                <Input
                  value={`${showExerciseDetail?.duration} min`}
                  readOnly
                  className="bg-[#1d2834] border-[#305176] text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Dificultad</Label>
                <Input
                  value={showExerciseDetail?.difficulty}
                  readOnly
                  className="bg-[#1d2834] border-[#305176] text-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Jugadores</Label>
                <Input
                  value={showExerciseDetail?.players}
                  readOnly
                  className="bg-[#1d2834] border-[#305176] text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Arqueros</Label>
                <Input
                  value={showExerciseDetail?.goalkeepers}
                  readOnly
                  className="bg-[#1d2834] border-[#305176] text-white"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-white">Materiales</Label>
              <Input
                value={showExerciseDetail?.materials}
                readOnly
                className="bg-[#1d2834] border-[#305176] text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Descripción</Label>
              <Textarea
                value={showExerciseDetail?.description}
                readOnly
                className="bg-[#1d2834] border-[#305176] text-white min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Objetivo</Label>
              <Textarea
                value={showExerciseDetail?.objective}
                readOnly
                className="bg-[#1d2834] border-[#305176] text-white min-h-[100px]"
              />
            </div>
          </div>
          {/* Se eliminan los botones de edición/eliminación para que sea read-only */}
        </DialogContent>
      </Dialog>

      {/* Dialogo para Agregar Nota (NUEVA INTERFAZ) */}
      <Dialog open={showNoteModal} onOpenChange={setShowNoteModal}>
        <DialogContent className="sm:max-w-[425px] bg-[#213041] border-[#305176] text-white">
          <DialogHeader className="text-center">
            <DialogTitle className="text-white text-2xl font-bold">
              Agregar Nota/Pausa
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Añade una nota o un tiempo de pausa a la sesión.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="note-title" className="text-white">
                Título de la Nota *
              </Label>
              <Input
                id="note-title"
                placeholder="Ej: Charla Técnica"
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                className="bg-[#1d2834] border-[#305176] text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="note-duration" className="text-white">
                Tiempo/Duración (min, opcional)
              </Label>
              <Input
                id="note-duration"
                type="number"
                placeholder="10"
                min="0"
                value={newNote.duration}
                onChange={(e) => setNewNote({ ...newNote, duration: e.target.value })}
                className="bg-[#1d2834] border-[#305176] text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="note-description" className="text-white">
                Descripción (opcional)
              </Label>
              <Textarea
                id="note-description"
                placeholder="Detalles sobre esta pausa o nota..."
                value={newNote.description}
                onChange={(e) => setNewNote({ ...newNote, description: e.target.value })}
                className="bg-[#1d2834] border-[#305176] text-white min-h-[80px]"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white bg-transparent"
              onClick={() => {
                setShowNoteModal(false);
                setNewNote({ title: "", duration: "", description: "" });
              }}
            >
              Cancelar
            </Button>
            <Button
              className="bg-[#aff606] text-black hover:bg-[#25d03f]"
              onClick={handleAddNote}
            >
              Guardar Nota
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}