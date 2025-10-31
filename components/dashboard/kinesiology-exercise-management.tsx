"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Clock, Target, Search, Trash2, Edit, Eye, User as UserIcon, HeartPulse } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useProfile } from "@/hooks/use-profile"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// --- Interfaces y Constantes ---

interface PlayerInfo {
  id: number;
  name: string;
  category: string; // ID de la categoría global (ej: "primera", "juveniles")
}

interface KinesiologyExercise {
  id: number;
  name: string; // Título / Lesión
  kineCategory: string; // "Rehabilitación", "Prevención", etc.
  duration: number;
  difficulty: string; // "Fácil", "Media", "Difícil"
  materials: string;
  description: string; // Descripción / Objetivo
  createdBy: string; // "Kinesiólogo" o "Preparador Físico"
  playerId: number | null; // ID del jugador (null si es general)
  playerName: string | null; // Nombre del jugador (null si es general)
  createdAt: string; // Fecha de creación (YYYY-MM-DD)
  category: string; // ID de la categoría global a la que pertenece el jugador (ej: "primera")
}

// Clave de LocalStorage (debe ser la misma que usa el Kinesiólogo)
const KINESIOLOGY_EXERCISES_KEY = "allKinesiologyExercises";

// Estado inicial para resetear el formulario
const INITIAL_KINE_EXERCISE_STATE: Omit<KinesiologyExercise, "id" | "createdAt" | "createdBy"> = {
  name: "",
  kineCategory: "Rehabilitación", // Default
  duration: 0,
  difficulty: "Media", // Default
  materials: "",
  description: "",
  playerId: null,
  playerName: null,
  category: "", // Se llenará con la categoría global actual
};

// --- DATOS DE EJEMPLO (MOCKS) ---

// EJEMPLO 1: Lista de jugadores (simula los jugadores de tu base de datos)
const MOCK_PLAYERS_KINE: PlayerInfo[] = [
  { id: 1, name: "Juan Pérez", category: "primera" },
  { id: 2, name: "Carlos Gómez", category: "primera" },
  { id: 5, name: "Miguel Torres", category: "primera" },
  { id: 10, name: "Lucas Martínez", category: "juveniles" },
  { id: 11, name: "Diego Salas", category: "juveniles" },
  { id: 12, name: "Tomás Giménez", category: "juveniles" },
];

// EJEMPLO 2: Ejercicios iniciales (simula lo que el Kine y tú ya han guardado)
const INITIAL_MOCK_EXERCISES_LIST: KinesiologyExercise[] = [
  // --- EJEMPLOS PARA "PRIMERA" ---
  {
    id: 101,
    name: "Rehabilitación Rodilla LCA (Semana 2)",
    kineCategory: "Rehabilitación",
    duration: 30,
    difficulty: "Media",
    materials: "Banda elástica, pelota",
    description: "Ejercicios isométricos de cuáiceps 4x15seg. Movilidad pasiva de rodilla hasta 90 grados.",
    createdBy: "Kinesiólogo", // <--- Creado por Kine
    playerId: 1, // ID de Juan Pérez
    playerName: "Juan Pérez",
    createdAt: "2025-10-28",
    category: "primera",
  },
  {
    id: 102,
    name: "Propiocepción Tobillo (Post-Esguince)",
    kineCategory: "Rehabilitación",
    duration: 15,
    difficulty: "Fácil",
    materials: "Plataforma inestable (BOSU)",
    description: "Balance unipodal 3x30 segundos por pierna. Foco en estabilidad.",
    createdBy: "Kinesiólogo",
    playerId: 1, // ID de Juan Pérez
    playerName: "Juan Pérez",
    createdAt: "2025-10-25",
    category: "primera",
  },
  {
    id: 103,
    name: "Fortalecimiento Isquiotibiales",
    kineCategory: "Fortalecimiento",
    duration: 20,
    difficulty: "Media",
    materials: "Pesas rusas, slider",
    description: "Puente de glúteos unipodal 3x10. Curls nórdicos asistidos 3x5.",
    createdBy: "Preparador Físico", // <--- Creado por PF
    playerId: 2, // ID de Carlos Gómez
    playerName: "Carlos Gómez",
    createdAt: "2025-10-29",
    category: "primera",
  },
  {
    id: 104,
    name: "Recuperación Post-Partido",
    kineCategory: "Recuperación",
    duration: 15,
    difficulty: "Fácil",
    materials: "Foam roller, colchoneta",
    description: "Rodillo en cuáiceps, isquios y glúteos (2 min por grupo). Elongación suave general.",
    createdBy: "Preparador Físico",
    playerId: 5, // ID de Miguel Torres
    playerName: "Miguel Torres",
    createdAt: "2025-10-27",
    category: "primera",
  },
  {
    id: 105,
    name: "Prevención General de Hombro (Arqueros)",
    kineCategory: "Prevención",
    duration: 10,
    difficulty: "Fácil",
    materials: "Bandas elásticas ligeras",
    description: "Manguito rotador: Rotaciones externas e internas 3x15.",
    createdBy: "Kinesiólogo",
    playerId: null, // <--- Ejercicio General
    playerName: null,
    createdAt: "2025-10-26",
    category: "primera",
  },
  {
    id: 106,
    name: "Activación Core Pre-Entreno",
    kineCategory: "Movilidad",
    duration: 10,
    difficulty: "Fácil",
    materials: "Colchoneta",
    description: "Planchas frontales (3x30s), laterales (3x20s) y 'bicho muerto' (3x10).",
    createdBy: "Preparador Físico",
    playerId: null, // <--- Ejercicio General
    playerName: null,
    createdAt: "2025-10-24",
    category: "primera",
  },

  // --- EJEMPLOS PARA "JUVENILES" ---
  {
    id: 201,
    name: "Movilidad de Cadera (Psoas)",
    kineCategory: "Movilidad",
    duration: 10,
    difficulty: "Fácil",
    materials: "Colchoneta",
    description: "Estiramiento del psoas (3x30s por lado) y rotaciones de cadera '90/90'.",
    createdBy: "Kinesiólogo",
    playerId: 10, // ID de Lucas Martínez
    playerName: "Lucas Martínez",
    createdAt: "2025-10-28",
    category: "juveniles",
  },
    {
    id: 202,
    name: "Tratamiento Pubalgia (Fase 1)",
    kineCategory: "Rehabilitación",
    duration: 25,
    difficulty: "Media",
    materials: "Pelota de pilates (esfera)",
    description: "Ejercicios de aducción isométrica (apretar pelota) 5x10seg. Activación de transverso.",
    createdBy: "Kinesiólogo",
    playerId: 12, // ID de Tomás Giménez
    playerName: "Tomás Giménez",
    createdAt: "2025-10-29",
    category: "juveniles",
  },
  {
    id: 203,
    name: "Fortalecimiento Zona Media (Pubalgia)",
    kineCategory: "Fortalecimiento",
    duration: 15,
    difficulty: "Media",
    materials: "Colchoneta, banda elástica",
    description: "Ejercicios de estabilización lumbopélvica. Puente de glúteos con banda.",
    createdBy: "Preparador Físico",
    playerId: 12, // ID de Tomás Giménez
    playerName: "Tomás Giménez",
    createdAt: "2025-10-30",
    category: "juveniles",
  },
  {
    id: 204,
    name: "Técnica de Aterrizaje (Prevención)",
    kineCategory: "Prevención",
    duration: 15,
    difficulty: "Media",
    materials: "Cajón pliométrico bajo",
    description: "Saltos al cajón (3x8) y 'drop jumps' controlados (3x5). Foco en alinear rodilla con pie.",
    createdBy: "Preparador Físico",
    playerId: null, // <-- Ejercicio General
    playerName: null,
    createdAt: "2025-10-27",
    category: "juveniles",
  }
];

// Tipos de ejercicios Kine (para el Select del formulario)
const KINESIOLOGY_TYPES = ["Rehabilitación", "Prevención", "Fortalecimiento", "Movilidad", "Recuperación"];

// --- ARREGLO: Función Helper para mapear Nombres de Categoría a IDs de Mocks ---
const getMockIdFromName = (name: string | undefined) => {
  if (!name) return "";
  if (name.toLowerCase().includes("primera")) return "primera";
  if (name.toLowerCase().includes("juveniles")) return "juveniles";
  if (name.toLowerCase().includes("tercera")) return "tercera";
  // Añade más mapeos si tus mocks usan otros IDs
  return name.toLowerCase(); // Fallback
};
// ------------------------------------------------------------------


// --- COMPONENTE ---

export function KinesiologyExerciseManagement() {
  // --- ARREGLO: Usamos el hook useProfile para obtener la categoría seleccionada ---
  const { selectedCategory: currentGlobalCategory } = useProfile(); // Categoría global (ej: { id: "cat_123", name: "Primera División" })
  // --------------------------------------------------------------------------
  
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null) // Jugador seleccionado
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newExercise, setNewExercise] = useState<any>(INITIAL_KINE_EXERCISE_STATE)
  const [exerciseToDelete, setExerciseToDelete] = useState<number | null>(null)
  const [showExerciseDetail, setShowExerciseDetail] = useState<KinesiologyExercise | null>(null)
  const [showValidationAlert, setShowValidationAlert] = useState(false)
  const [validationMessage, setValidationMessage] = useState("")

  // Estados locales
  const [playersInCategory, setPlayersInCategory] = useState<PlayerInfo[]>([]);
  const [allExercises, setAllExercises] = useState<KinesiologyExercise[]>([]);

  // Filtros
  const [filterDifficulty, setFilterDifficulty] = useState("all")
  const [filterTime, setFilterTime] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  // --- Cargar Jugadores de la Categoría Global ---
  useEffect(() => {
    if (currentGlobalCategory) {
      
      // --- ARREGLO: Mapear el nombre de la categoría global (ej: "Primera División") al ID estático del mock (ej: "primera") ---
      const mockCategoryId = getMockIdFromName(currentGlobalCategory.name);
      // -----------------------------------------------------------------------------------------------------------

      // Simula la carga de jugadores (en tu caso, esto vendría de tu hook o DB)
      // --- ARREGLO: Usar el mockCategoryId para filtrar ---
      const filtered = MOCK_PLAYERS_KINE.filter(p => p.category === mockCategoryId);
      // ---------------------------------------------------

      setPlayersInCategory(filtered);
      setSelectedPlayerId(null); // Deseleccionar jugador
      
      // --- ARREGLO: Usar el ID estático del mock para el estado inicial del formulario ---
      setNewExercise((prev: any) => ({ ...prev, playerId: null, playerName: null, category: mockCategoryId }));
      // --------------------------------------------------------------------------

    } else {
      setPlayersInCategory([]);
      setSelectedPlayerId(null);
    }
  }, [currentGlobalCategory]);

  // --- Cargar/Guardar Ejercicios de Kinesiología (LocalStorage) ---
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedExercises = localStorage.getItem(KINESIOLOGY_EXERCISES_KEY);
      // Si no hay nada, carga los ejemplos
      const exercises = savedExercises ? JSON.parse(savedExercises) : INITIAL_MOCK_EXERCISES_LIST; // <--- USA LA LISTA GRANDE
      setAllExercises(exercises);
      
      // (Opcional) Si cargas los mocks, guárdalos para que el Kine los vea
      if (!savedExercises) {
          localStorage.setItem(KINESIOLOGY_EXERCISES_KEY, JSON.stringify(INITIAL_MOCK_EXERCISES_LIST)); // <--- USA LA LISTA GRANDE
      }
    }
  }, []);

  const saveExercisesToLocalStorage = (updatedExercises: KinesiologyExercise[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(KINESIOLOGY_EXERCISES_KEY, JSON.stringify(updatedExercises));
    }
  };
  // ----------------------------------------------------------------

  // --- Lógica CRUD ---
  const handleCreateExercise = () => {
    // Validación
    if (!newExercise.name || newExercise.duration <= 0 || !newExercise.description) {
      setValidationMessage("Completa Nombre/Lesión, Duración y Descripción.");
      setShowValidationAlert(true);
      return;
    }
    if (!currentGlobalCategory) return; // Seguridad

    const selectedPlayer = playersInCategory.find(p => p.id === newExercise.playerId);

    // --- ARREGLO: Guardar el ID estático ("primera") en lugar del dinámico ("cat_123") ---
    const mockCategoryId = getMockIdFromName(currentGlobalCategory.name);
    // ------------------------------------------------------------------------------------

    const exerciseToAdd: KinesiologyExercise = {
      ...newExercise,
      id: Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
      playerName: selectedPlayer?.name || null,
      category: mockCategoryId, // <-- Usar el ID estático del mock
      createdBy: "Preparador Físico", // Creado desde esta vista (PF)
    };

    const updatedExercises = [...allExercises, exerciseToAdd];
    setAllExercises(updatedExercises);
    saveExercisesToLocalStorage(updatedExercises); // Guardar en LS

    setNewExercise(INITIAL_KINE_EXERCISE_STATE);
    setShowCreateForm(false);
  };

  const handleEditExercise = (exercise: KinesiologyExercise) => {
    setShowExerciseDetail(null);
    setNewExercise(exercise);
    setShowCreateForm(true);
  };

  const handleUpdateExercise = () => {
    // Validación
    if (!newExercise.name || newExercise.duration <= 0 || !newExercise.description) {
      setValidationMessage("Completa Nombre/Lesión, Duración y Descripción.");
      setShowValidationAlert(true);
      return;
    }
    if (!currentGlobalCategory) return;

    const selectedPlayer = playersInCategory.find(p => p.id === newExercise.playerId);

    // --- ARREGLO: Guardar el ID estático ("primera") en lugar del dinámico ("cat_123") ---
    const mockCategoryId = getMockIdFromName(currentGlobalCategory.name);
    // ------------------------------------------------------------------------------------

    const updatedExerciseData: KinesiologyExercise = {
      ...newExercise,
      playerName: selectedPlayer?.name || null,
      category: mockCategoryId, // <-- Usar el ID estático del mock
    };

    const updatedExercises = allExercises.map(ex =>
      ex.id === updatedExerciseData.id ? updatedExerciseData : ex
    );
    setAllExercises(updatedExercises);
    saveExercisesToLocalStorage(updatedExercises); // Guardar en LS

    setNewExercise(INITIAL_KINE_EXERCISE_STATE);
    setShowCreateForm(false);
  };

  const handleDeleteExercise = () => {
    if (exerciseToDelete !== null) {
      const updatedExercises = allExercises.filter(ex => ex.id !== exerciseToDelete);
      setAllExercises(updatedExercises);
      saveExercisesToLocalStorage(updatedExercises); // Guardar en LS
      setExerciseToDelete(null);
      setShowExerciseDetail(null);
    }
  };

  // --- Lógica de Filtros y UI ---
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Fácil": return "bg-[#25d03f] text-black";
      case "Media": return "bg-[#f4c11a] text-black";
      case "Difícil": return "bg-red-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const handleClearFilters = () => {
    setFilterDifficulty("all");
    setFilterTime("all");
    setSearchQuery("");
  };

  // 1. Filtra por Categoría Global
  // --- ARREGLO: Mapear el nombre de la categoría global (ej: "Primera División") al ID estático del mock (ej: "primera") ---
  const mockCategoryId = currentGlobalCategory ? getMockIdFromName(currentGlobalCategory.name) : "";
  const exercisesInGlobalCategory = currentGlobalCategory
     ? allExercises.filter(ex => ex.category === mockCategoryId)
     : [];
  // -----------------------------------------------------------------------------------------------------------


  // 2. Filtra por Jugador Seleccionado (y filtros de UI)
  const filteredExercises = exercisesInGlobalCategory
    .filter((exercise) => {
        // A. Filtro principal por jugador
        const matchesPlayer = selectedPlayerId === null
                               ? exercise.playerId === null // Muestra solo Generales
                               : exercise.playerId === selectedPlayerId; // Muestra solo los del jugador
        if (!matchesPlayer) return false;

        // B. Filtros adicionales de UI
        const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDifficulty = filterDifficulty === "all" || exercise.difficulty === filterDifficulty;
        const matchesTime = filterTime === "all" || exercise.duration.toString() === filterTime;

        return matchesSearch && matchesDifficulty && matchesTime;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); // Más reciente primero

  // Opciones para los Select de filtros (basados en el jugador)
  const exercisesForFilterOptions = exercisesInGlobalCategory.filter(ex =>
      selectedPlayerId === null ? ex.playerId === null : ex.playerId === selectedPlayerId
  );
  const uniqueDurations = [...new Set(exercisesForFilterOptions.map(ex => ex.duration))].sort((a, b) => a - b);

  // --- Renderizado ---
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Ejercicios Kinesiología</h2>
          <p className="text-gray-400">
            {currentGlobalCategory
                ? `Gestiona ejercicios para ${currentGlobalCategory.name}`
                : "Selecciona una categoría global para empezar."
            }
          </p>
        </div>
      </div>

       {!currentGlobalCategory && (
         <p className="text-center text-yellow-400">Selecciona una categoría en el encabezado para gestionar ejercicios.</p>
      )}

      {currentGlobalCategory && ( // Solo mostrar contenido si hay categoría global
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Columna Izquierda: Lista de Jugadores */}
          <div className="lg:col-span-1">
            <Card className="bg-[#213041] border-[#305176]">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <UserIcon className="h-5 w-5 mr-2" />
                  Jugadores en {currentGlobalCategory.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                 
                 {/* Opción para ejercicios generales */}
                 <div
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors group ${
                        selectedPlayerId === null ? "bg-[#305176]" : "bg-[#1d2834] hover:bg-[#305176]"
                    }`}
                    onClick={() => setSelectedPlayerId(null)} // Selecciona "null" para generales
                  >
                    <div className="flex items-center space-x-3">
                       <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center">
                            <HeartPulse className="h-4 w-4 text-white"/>
                       </div>
                       <span className="text-white font-medium">Ejercicios Generales</span>
                    </div>
                     <Badge variant="secondary" className="bg-[#305176] text-gray-300">
                        {/* Cuenta solo los generales de ESTA categoría global */}
                        {exercisesInGlobalCategory.filter(ex => ex.playerId === null).length}
                    </Badge>
                  </div>

                {/* Lista de jugadores */}
                {playersInCategory.length > 0 ? (
                  playersInCategory.map((player) => {
                    // Contar ejercicios (solo de esta cat global) para este jugador
                    const exerciseCount = exercisesInGlobalCategory.filter(ex => ex.playerId === player.id).length;
                    return (
                        <div
                          key={player.id}
                          className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors group ${
                            selectedPlayerId === player.id ? "bg-[#305176]" : "bg-[#1d2834] hover:bg-[#305176]"
                          }`}
                          onClick={() => setSelectedPlayerId(player.id)}
                        >
                          <div className="flex items-center space-x-3">
                             <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-[#aff606] text-black text-xs">
                                  {player.name.split(" ").map((n) => n[0]).join("")}
                                </AvatarFallback>
                            </Avatar>
                            <span className="text-white font-medium">{player.name}</span>
                          </div>
                           <Badge variant="secondary" className="bg-[#305176] text-gray-300">
                              {exerciseCount}
                          </Badge>
                        </div>
                    );
                  })
                ) : (
                  <p className="text-center text-gray-500 py-4">No hay jugadores en esta categoría.</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Columna Derecha: Lista de Ejercicios o Formulario */}
          <div className="lg:col-span-2">
            {showCreateForm ? (
              // FORMULARIO DE CREACIÓN/EDICIÓN
              <Card className="bg-[#213041] border-[#305176]">
                <CardHeader className="text-center">
                  <CardTitle className="text-white text-2xl font-bold">
                    {newExercise.id ? "Editar Ejercicio Kine" : "Nuevo Ejercicio Kine"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="exercise-name" className="text-white">Lesión / Título *</Label>
                      <Input
                        id="exercise-name"
                        placeholder="Ej: Esguince Tobillo Grado 1"
                        value={newExercise.name}
                        onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                        className="bg-[#1d2834] border-[#305176] text-white"
                      />
                    </div>
                     <div className="space-y-2">
                      <Label className="text-white">Jugador Asociado</Label>
                      <Select
                        // El valor debe ser "general" si playerId es null
                        value={newExercise.playerId?.toString() ?? "general"}
                        onValueChange={(value) => setNewExercise({
                            ...newExercise,
                            // Si el valor es "general", playerId es null
                            playerId: value === "general" ? null : parseInt(value)
                        })}
                        disabled={playersInCategory.length === 0}
                      >
                        <SelectTrigger className="bg-[#1d2834] border-[#305176] text-white">
                           <SelectValue placeholder="Seleccionar..." />
                        </SelectTrigger>
                        <SelectContent className="bg-[#213041] border-[#305176]">
                          {/* Opción para ejercicio general */}
                          <SelectItem value="general" className="text-gray-400 italic">
                             (Ejercicio General - Sin Jugador)
                          </SelectItem>
                          {playersInCategory.map((player) => (
                            <SelectItem key={player.id} value={player.id.toString()} className="text-white">
                              {player.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white">Tipo Kine *</Label>
                      <Select
                        value={newExercise.kineCategory}
                        onValueChange={(value) => setNewExercise({ ...newExercise, kineCategory: value })}
                      >
                        <SelectTrigger className="bg-[#1d2834] border-[#305176] text-white">
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#213041] border-[#305176]">
                          {KINESIOLOGY_TYPES.map((type) => (
                            <SelectItem key={type} value={type} className="text-white">{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duration" className="text-white">Duración (min) *</Label>
                      <Input
                        id="duration" type="number" placeholder="15" min="1"
                        value={newExercise.duration > 0 ? newExercise.duration : ""}
                        onChange={(e) => setNewExercise({ ...newExercise, duration: parseInt(e.target.value) || 0 })}
                        className="bg-[#1d2834] border-[#305176] text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Dificultad *</Label>
                      <Select
                        value={newExercise.difficulty}
                        onValueChange={(value) => setNewExercise({ ...newExercise, difficulty: value })}
                      >
                        <SelectTrigger className="bg-[#1d2834] border-[#305176] text-white">
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#213041] border-[#305176]">
                          <SelectItem value="Fácil" className="text-white">Fácil</SelectItem>
                          <SelectItem value="Media" className="text-white">Media</SelectItem>
                          <SelectItem value="Difícil" className="text-white">Difícil</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="materials" className="text-white">Materiales</Label>
                    <Input
                      id="materials" placeholder="Banda elástica, pelota..."
                      value={newExercise.materials}
                      onChange={(e) => setNewExercise({ ...newExercise, materials: e.target.value })}
                      className="bg-[#1d2834] border-[#305176] text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-white">Descripción / Objetivo *</Label>
                    <Textarea
                      id="description" placeholder="Describe el ejercicio, series, repeticiones, objetivo..."
                      value={newExercise.description}
                      onChange={(e) => setNewExercise({ ...newExercise, description: e.target.value })}
                      className="bg-[#1d2834] border-[#305176] text-white min-h-[100px]"
                    />
                  </div>

                  <div className="flex justify-between space-x-4">
                    <Button
                      className="w-1/2 bg-[#aff606] text-black hover:bg-[#25d03f]"
                      onClick={newExercise.id ? handleUpdateExercise : handleCreateExercise}
                    >
                      {newExercise.id ? "Actualizar Ejercicio" : "Guardar Ejercicio"}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-1/2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white bg-transparent"
                      onClick={() => { setShowCreateForm(false); setNewExercise(INITIAL_KINE_EXERCISE_STATE); }}
                    >
                      Cancelar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              // LISTA DE EJERCICIOS
              <Card className="bg-[#213041] border-[#305176]">
                <CardHeader>
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <CardTitle className="text-2xl font-bold text-white whitespace-nowrap">
                       {selectedPlayerId
                            ? `Ejercicios para ${playersInCategory.find(p=>p.id === selectedPlayerId)?.name || 'Jugador'}`
                            : "Ejercicios Generales"}
                       {" "}
                       ({filteredExercises.length})
                    </CardTitle>
                    <Button
                      size="default"
                      className="bg-[#305176] text-white hover:bg-[#aff606] hover:text-black font-bold h-9 px-4 ml-auto flex-shrink-0"
                      onClick={() => {
                        setNewExercise({
                            ...INITIAL_KINE_EXERCISE_STATE,
                            // Pre-seleccionar jugador si uno está activo en la UI
                            playerId: selectedPlayerId,
                            playerName: selectedPlayerId ? playersInCategory.find(p=>p.id === selectedPlayerId)?.name || null : null,
                            // ARREGLO: Usar el ID estático del mock al crear
                            category: mockCategoryId, 
                        });
                        setShowCreateForm(true);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Nuevo Ejercicio Kine
                    </Button>
                  </div>
                  {/* Filtros */}
                  <div className="flex items-center flex-wrap gap-2 mt-4">
                    <div className="relative flex-1 min-w-[200px]">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Buscar por lesión/título..."
                        className="pl-10 h-9 bg-[#1d2834] border-[#305176] text-white"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                     <div className="space-y-1 min-w-[120px]">
                        <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
                          <SelectTrigger className="h-9 bg-[#1d2834] border-[#305176] text-white text-xs w-full">
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
                      <div className="space-y-1 min-w-[120px]">
                        <Select value={filterTime} onValueChange={setFilterTime}>
                          <SelectTrigger className="h-9 bg-[#1d2834] border-[#305176] text-white text-xs w-full">
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
                     <div className="mt-auto">
                        <Button size="icon" variant="ghost" className="text-red-400 hover:bg-red-500/20 hover:text-red-300" onClick={handleClearFilters}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredExercises.length > 0 ? (
                      filteredExercises.map((exercise) => (
                        <div key={exercise.id} className="p-4 bg-[#1d2834] rounded-lg">
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="text-white font-medium">{exercise.name}</h3>
                             <Badge className="text-white bg-purple-500">{exercise.kineCategory}</Badge>
                          </div>
                           <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                              <div className="flex items-center text-gray-400">
                                <Clock className="h-4 w-4 mr-1" /> {exercise.duration}min
                              </div>
                              <div className="flex items-center text-gray-400">
                                <Target className="h-4 w-4 mr-1" />
                                <Badge className={getDifficultyColor(exercise.difficulty)}>{exercise.difficulty}</Badge>
                              </div>
                          </div>
                          <p className="text-gray-400 text-sm mb-3">{exercise.description}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">{exercise.materials || "Sin materiales"}</span>
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary" className={`text-xs ${exercise.createdBy === "Kinesiólogo" ? "bg-blue-800 text-white" : "bg-green-800 text-white"}`}>
                                  {exercise.createdBy}
                                </Badge>
                                <Button size="sm" variant="outline" className="border-[#aff606] text-[#aff606] hover:bg-[#aff606] hover:text-black bg-transparent" onClick={() => setShowExerciseDetail(exercise)}>
                                  <Eye className="h-4 w-4 mr-1 sm:mr-2" />
                                  <span className="hidden sm:inline">Ver Detalles</span>
                                </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-400">
                         No se encontraron ejercicios para {selectedPlayerId
                            ? playersInCategory.find(p=>p.id === selectedPlayerId)?.name || 'este jugador'
                            : "ejercicios generales"}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )} {/* Fin del condicional currentGlobalCategory */}

      {/* --- Modales --- */}
       <Dialog open={!!showExerciseDetail} onOpenChange={() => setShowExerciseDetail(null)}>
        <DialogContent className="sm:max-w-[425px] bg-[#213041] border-[#305176] text-white">
          <DialogHeader className="text-center">
            <DialogTitle className="text-white text-2xl font-bold">{showExerciseDetail?.name}</DialogTitle>
             <DialogDescription className="text-gray-400">
                 {showExerciseDetail?.playerName
                    ? `Ejercicio para ${showExerciseDetail.playerName} - ${showExerciseDetail?.kineCategory}`
                    : `Ejercicio General - ${showExerciseDetail?.kineCategory}`
                 }
             </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label className="text-white">Duración</Label><Input value={`${showExerciseDetail?.duration} min`} readOnly className="bg-[#1d2834] border-[#305176] text-white"/></div>
                <div className="space-y-2"><Label className="text-white">Dificultad</Label><Input value={showExerciseDetail?.difficulty} readOnly className="bg-[#1d2834] border-[#305176] text-white"/></div>
            </div>
            <div className="space-y-2"><Label className="text-white">Materiales</Label><Input value={showExerciseDetail?.materials || "Ninguno"} readOnly className="bg-[#1d2834] border-[#305176] text-white"/></div>
            <div className="space-y-2"><Label className="text-white">Descripción / Objetivo</Label><Textarea value={showExerciseDetail?.description} readOnly className="bg-[#1d2834] border-[#305176] text-white min-h-[100px]"/></div>
             <div className="space-y-2"><Label className="text-white">Creado por</Label><Input value={showExerciseDetail?.createdBy} readOnly className="bg-[#1d2834] border-[#305176] text-white"/></div>
          </div>
          <div className="flex justify-between space-x-4">
            <Button variant="default" className="w-1/2 bg-[#aff606] text-black hover:bg-[#25d03f]" onClick={() => handleEditExercise(showExerciseDetail!)}>
              <Edit className="h-4 w-4 mr-2" /> Editar
            </Button>
            <Button variant="outline" className="w-1/2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white bg-transparent" onClick={() => setExerciseToDelete(showExerciseDetail?.id ?? null)}>
              <Trash2 className="h-4 w-4 mr-2" /> Eliminar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={exerciseToDelete !== null} onOpenChange={() => setExerciseToDelete(null)}>
        <AlertDialogContent className="bg-[#213041] border-[#305176]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Confirmar Eliminación</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">¿Estás seguro de eliminar este ejercicio de kinesiología?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-[#305176] text-white hover:bg-[#305176]">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteExercise} className="bg-red-500 text-white hover:bg-red-600">Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showValidationAlert} onOpenChange={setShowValidationAlert}>
        <AlertDialogContent className="bg-[#213041] border-[#305176]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Campos Requeridos</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">{validationMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowValidationAlert(false)} className="bg-[#aff606] text-black hover:bg-[#25d03f]">Aceptar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}