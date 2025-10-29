"use client"

import { useState, useEffect } from "react" // Import useEffect
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Clock, Users, Target, Heart, User as UserIcon } from "lucide-react" // Import UserIcon
import { useProfile } from "@/hooks/use-profile" // Para obtener la categoría actual

// --- Datos Mock de Jugadores (Simulación) ---
// En una implementación real, estos vendrían de Supabase o estado global
const MOCK_PLAYERS = [
  { id: 1, name: "Juan Pérez", categoryId: "primera" },
  { id: 2, name: "Carlos Gómez", categoryId: "primera" },
  { id: 3, name: "Luis Fernández", categoryId: "tercera" },
  { id: 4, name: "Pedro Rodríguez", categoryId: "juveniles" },
  { id: 5, name: "Miguel Torres", categoryId: "primera" },
];
// ------------------------------------------

// --- Interfaz para el ejercicio con datos del jugador ---
interface KinesiologyExercise {
    id: number;
    name: string; // Título / Lesión
    category: string; // Rehabilitación, Prevención, etc.
    duration: number;
    difficulty: string;
    materials: string;
    objective: string; // Descripción del ejercicio
    createdBy: string;
    playerId?: number | null; // ID del jugador asociado (opcional)
    playerName?: string | null; // Nombre del jugador asociado (opcional, para mostrar)
}
// ----------------------------------------------------

export function KinesiologyExerciseManagement() {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const { selectedCategory: currentGlobalCategory } = useProfile(); // Obtener categoría global
  const [playersInCategory, setPlayersInCategory] = useState<{id: number, name: string}[]>([]);

  // --- Estado inicial para el formulario ---
  const initialFormState = {
    name: "", // Título / Lesión
    category: "Rehabilitación", // Categoría Kine (default)
    duration: 0,
    difficulty: "Media", // Default
    materials: "",
    objective: "", // Descripción
    playerId: null as number | null, // Jugador seleccionado
  };
  const [newExercise, setNewExercise] = useState(initialFormState);
  // ------------------------------------------

  const kinesiologyCategories = [
    { name: "Rehabilitación", color: "bg-green-500", exercises: 10 },
    { name: "Prevención", color: "bg-blue-500", exercises: 8 },
    { name: "Fortalecimiento", color: "bg-purple-500", exercises: 12 },
    { name: "Movilidad", color: "bg-orange-500", exercises: 6 },
    { name: "Recuperación", color: "bg-teal-500", exercises: 7 },
  ]

  // --- Lista de ejercicios (ahora usa la interfaz KinesiologyExercise) ---
  const [exercises, setExercises] = useState<KinesiologyExercise[]>([
    {
      id: 1,
      name: "Rehabilitación de Rodilla LCA",
      category: "Rehabilitación",
      duration: 20,
      difficulty: "Media",
      materials: "Banda elástica, pelota suiza",
      objective: "Recuperar movilidad y fuerza post-cirugía.",
      createdBy: "Kinesiólogo",
      playerId: 1, // Asociado a Juan Pérez
      playerName: "Juan Pérez",
    },
    {
      id: 2,
      name: "Prevención Esguince Tobillo",
      category: "Prevención",
      duration: 15,
      difficulty: "Fácil",
      materials: "Conos, plataforma inestable",
      objective: "Fortalecer músculos estabilizadores del tobillo.",
      createdBy: "Kinesiólogo",
      playerId: null, // No asociado a un jugador específico
      playerName: null,
    },
    {
      id: 3,
      name: "Fortalecimiento Isquiotibiales",
      category: "Fortalecimiento",
      duration: 25,
      difficulty: "Media",
      materials: "Máquina de isquios, pesas rusas",
      objective: "Aumentar fuerza en cadena posterior.",
      createdBy: "Kinesiólogo",
      playerId: 2, // Asociado a Carlos Gómez
      playerName: "Carlos Gómez",
    }
  ]);
  // ------------------------------------------------------------------

  // --- Efecto para cargar jugadores de la categoría seleccionada ---
  useEffect(() => {
    if (currentGlobalCategory) {
      // Simula la carga de jugadores (reemplazar con fetch real si aplica)
      const filteredPlayers = MOCK_PLAYERS.filter(p => p.categoryId === currentGlobalCategory.id);
      setPlayersInCategory(filteredPlayers);
      // Resetea el jugador seleccionado si la categoría cambia
      setNewExercise(prev => ({ ...prev, playerId: null }));
    } else {
      setPlayersInCategory([]); // Vaciar si no hay categoría seleccionada
    }
  }, [currentGlobalCategory]); // Se ejecuta cuando cambia la categoría global
  // -----------------------------------------------------------

  // --- Lógica para guardar el ejercicio ---
  const handleSaveExercise = () => {
    // Validación básica
    if (!newExercise.name || newExercise.duration <= 0 || !newExercise.playerId) {
      alert("Por favor, completa el título/lesión, selecciona un jugador y asigna una duración válida.");
      return;
    }

    const selectedPlayer = playersInCategory.find(p => p.id === newExercise.playerId);

    const exerciseToSave: KinesiologyExercise = {
      id: Date.now(), // ID simple para el ejemplo
      name: newExercise.name,
      category: newExercise.category,
      duration: newExercise.duration,
      difficulty: newExercise.difficulty,
      materials: newExercise.materials,
      objective: newExercise.objective, // Descripción va en 'objective'
      createdBy: "Kinesiólogo", // Asumiendo que lo crea el Kine
      playerId: newExercise.playerId,
      playerName: selectedPlayer?.name || null, // Guardar nombre para mostrar
    };

    setExercises(prev => [...prev, exerciseToSave]); // Añadir a la lista
    setNewExercise(initialFormState); // Resetear formulario
    setShowCreateForm(false); // Ocultar formulario
  };
  // ---------------------------------------

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Ejercicios Kinesiología</h2>
          <p className="text-gray-400">Gestión de ejercicios de rehabilitación y prevención</p>
        </div>
        <Button
          className="bg-[#aff606] text-black hover:bg-[#25d03f]"
          onClick={() => {
              setNewExercise(initialFormState); // Asegura resetear al abrir
              setShowCreateForm(!showCreateForm);
          }}
          // Deshabilitar si no hay categoría global seleccionada
          disabled={!currentGlobalCategory}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Ejercicio Kine
        </Button>
      </div>

      {!currentGlobalCategory && (
         <p className="text-center text-yellow-400">Selecciona una categoría en el encabezado para gestionar ejercicios.</p>
      )}

      {currentGlobalCategory && ( // Solo mostrar contenido si hay categoría
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Categories (se mantiene igual) */}
            <div className="lg:col-span-1">
              <Card className="bg-[#213041] border-[#305176]">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Heart className="h-5 w-5 mr-2" />
                    Tipos de Ejercicio Kine
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {kinesiologyCategories.map((category, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-[#1d2834] rounded-lg cursor-pointer hover:bg-[#305176] transition-colors"
                      // onClick={() => console.log("Filtrar por tipo:", category.name)} // Opcional: Filtrar lista por tipo
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full ${category.color}`}></div>
                        <span className="text-white font-medium">{category.name}</span>
                      </div>
                      <Badge variant="secondary" className="bg-[#305176] text-gray-300">
                        {exercises.filter(ex => ex.category === category.name).length} {/* Conteo dinámico */}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Exercise Form / List */}
            <div className="lg:col-span-2">
              {showCreateForm && (
                <Card className="bg-[#213041] border-[#305176] mb-6">
                  <CardHeader>
                    <CardTitle className="text-white">Crear Nuevo Ejercicio Kinesiológico para {currentGlobalCategory.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">

                    {/* Fila: Lesión/Título y Jugador */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="space-y-2">
                        {/* Label cambiado */}
                        <Label htmlFor="exercise-name" className="text-white">
                          Lesión / Título del Ejercicio *
                        </Label>
                        <Input
                          id="exercise-name"
                          placeholder="Ej: Desgarro Isquiotibial Grado 1"
                          className="bg-[#1d2834] border-[#305176] text-white"
                          value={newExercise.name}
                          onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white">Jugador Asociado *</Label>
                        <Select
                          value={newExercise.playerId?.toString() ?? ""}
                          onValueChange={(value) => setNewExercise({ ...newExercise, playerId: value ? parseInt(value) : null })}
                          disabled={playersInCategory.length === 0} // Deshabilitar si no hay jugadores
                        >
                          <SelectTrigger className="bg-[#1d2834] border-[#305176] text-white">
                            <SelectValue placeholder={playersInCategory.length > 0 ? "Seleccionar jugador" : "No hay jugadores disponibles"} />
                          </SelectTrigger>
                          <SelectContent className="bg-[#213041] border-[#305176]">
                            {playersInCategory.map((player) => (
                              <SelectItem key={player.id} value={player.id.toString()} className="text-white">
                                {player.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                         {playersInCategory.length === 0 && <p className="text-xs text-red-400 mt-1">No hay jugadores en esta categoría.</p>}
                      </div>
                    </div>

                    {/* Fila: Tipo Kine y Dificultad */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="space-y-2">
                        <Label className="text-white">Tipo de Ejercicio Kine</Label>
                        <Select
                           value={newExercise.category}
                           onValueChange={(value) => setNewExercise({ ...newExercise, category: value })}
                        >
                          <SelectTrigger className="bg-[#1d2834] border-[#305176] text-white">
                            <SelectValue placeholder="Seleccionar tipo" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#213041] border-[#305176]">
                            {kinesiologyCategories.map((cat) => (
                              <SelectItem key={cat.name} value={cat.name} className="text-white">
                                {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                       <div className="space-y-2">
                        <Label className="text-white">Dificultad</Label>
                        <Select
                          value={newExercise.difficulty}
                          onValueChange={(value) => setNewExercise({ ...newExercise, difficulty: value })}
                        >
                          <SelectTrigger className="bg-[#1d2834] border-[#305176] text-white">
                            <SelectValue placeholder="Seleccionar dificultad" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#213041] border-[#305176]">
                            <SelectItem value="Fácil" className="text-white">Fácil</SelectItem>
                            <SelectItem value="Media" className="text-white">Media</SelectItem>
                            <SelectItem value="Difícil" className="text-white">Difícil</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Fila: Duración y Materiales */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="duration" className="text-white">
                            Duración (min) *
                            </Label>
                            <Input
                            id="duration"
                            type="number"
                            placeholder="20"
                            className="bg-[#1d2834] border-[#305176] text-white"
                            value={newExercise.duration > 0 ? newExercise.duration.toString() : ""}
                            onChange={(e) => setNewExercise({ ...newExercise, duration: parseInt(e.target.value) || 0 })}
                            min="1"
                            />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="materials" className="text-white">
                            Materiales
                          </Label>
                          <Input
                            id="materials"
                            placeholder="Banda elástica, pelota suiza..."
                            className="bg-[#1d2834] border-[#305176] text-white"
                            value={newExercise.materials}
                            onChange={(e) => setNewExercise({ ...newExercise, materials: e.target.value })}
                          />
                        </div>
                    </div>

                    {/* Fila: Descripción */}
                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-white">
                        Descripción del Ejercicio *
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="Describe el ejercicio paso a paso, indicaciones..."
                        className="bg-[#1d2834] border-[#305176] text-white min-h-[100px]"
                        value={newExercise.objective} // Usamos 'objective' para la descripción
                        onChange={(e) => setNewExercise({ ...newExercise, objective: e.target.value })}
                      />
                    </div>

                    <div className="flex justify-end space-x-4">
                      <Button
                        variant="outline"
                        className="border-[#305176] text-white hover:bg-[#305176] bg-transparent"
                        onClick={() => setShowCreateForm(false)}
                      >
                        Cancelar
                      </Button>
                      <Button className="bg-[#aff606] text-black hover:bg-[#25d03f]" onClick={handleSaveExercise}>
                          Guardar Ejercicio
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Existing Exercises List */}
              <Card className="bg-[#213041] border-[#305176]">
                <CardHeader>
                  <CardTitle className="text-white">Ejercicios Kine Creados para {currentGlobalCategory.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Filtrar ejercicios por la categoría global */}
                    {exercises.filter(ex => {
                         // Mostrar si no tiene jugador O si el jugador pertenece a la categoría actual
                         if (!ex.playerId) return true;
                         const player = MOCK_PLAYERS.find(p => p.id === ex.playerId);
                         return player?.categoryId === currentGlobalCategory.id;
                    }).map((exercise) => (
                      <div key={exercise.id} className="p-4 bg-[#1d2834] rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-white font-medium">{exercise.name}</h3>
                            {/* Mostrar jugador si está asociado */}
                            {exercise.playerName && (
                              <p className="text-xs text-gray-400 flex items-center mt-1">
                                <UserIcon className="h-3 w-3 mr-1" /> {exercise.playerName}
                              </p>
                            )}
                          </div>
                           {/* Badge usa el color de la categoría kine */}
                          <Badge style={{ backgroundColor: kinesiologyCategories.find(c => c.name === exercise.category)?.color }} className="text-white">
                              {exercise.category}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-3 text-sm"> {/* Ajustado a 2 columnas */}
                          <div className="flex items-center text-gray-400">
                            <Clock className="h-4 w-4 mr-1" />
                            {exercise.duration} min
                          </div>
                          <div className="flex items-center text-gray-400">
                            <Target className="h-4 w-4 mr-1" />
                            {exercise.difficulty}
                          </div>
                        </div>
                        <p className="text-gray-400 text-sm mb-3">{exercise.objective}</p> {/* Muestra la descripción */}
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">{exercise.materials}</span>
                          <div className="flex items-center space-x-2">
                             {/* Badge Creador (Se mantiene Kine) */}
                            <Badge variant="secondary" className="bg-[#305176] text-gray-300 text-xs">
                              {exercise.createdBy}
                            </Badge>
                            {/*<Button
                              size="sm"
                              variant="outline"
                              className="border-[#aff606] text-[#aff606] hover:bg-[#aff606] hover:text-black bg-transparent"
                            >
                              Ver Detalles
                            </Button>*/} {/* Botón Ver Detalles eliminado temporalmente */}
                          </div>
                        </div>
                      </div>
                    ))}
                     {/* Mensaje si no hay ejercicios para esta categoría */}
                     {exercises.filter(ex => {
                         if (!ex.playerId) return true;
                         const player = MOCK_PLAYERS.find(p => p.id === ex.playerId);
                         return player?.categoryId === currentGlobalCategory.id;
                     }).length === 0 && (
                        <p className="text-center text-gray-500 py-4">No hay ejercicios de kinesiología creados para {currentGlobalCategory.name}.</p>
                     )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
      )} {/* Fin del condicional currentGlobalCategory */}
    </div>
  )
}