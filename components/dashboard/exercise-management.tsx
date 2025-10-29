"use client"

import { useState, useEffect } from "react" // Asegúrate que useEffect esté importado
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Clock, Users, Target, Search, Trash2, Edit, Eye } from "lucide-react"
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
import { useMockIntegration } from "@/hooks/use-mock-integration"


// NUEVA CONSTANTE PARA REINICIAR EL FORMULARIO (MÁS ROBUSTO)
const INITIAL_EXERCISE_STATE = {
  id: 0, // Añadido para manejo de edición
  name: "",
  category: "",
  duration: 0,
  players: 0,
  goalkeepers: 0,
  difficulty: "",
  materials: "",
  description: "",
  objective: "",
  createdAt: "", // Añadido para consistencia
  type: "", // Añadido para consistencia
};


export function ExerciseManagement() {
  const { getIntegratedExercises } = useMockIntegration();
  const [selectedCategory, setSelectedCategory] = useState("")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showCreateCategory, setShowCreateCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryColor, setNewCategoryColor] = useState("#aff606")
  const [newExercise, setNewExercise] = useState<any>(INITIAL_EXERCISE_STATE) // Usar any temporalmente si la estructura varía
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null)
  const [showExerciseDetail, setShowExerciseDetail] = useState<any>(null)
  const [exerciseToDelete, setExerciseToDelete] = useState<number | string | null>(null) // Permitir string para IDs de mock
  const [showValidationAlert, setShowValidationAlert] = useState(false)


  // Filtros
  const [filterPlayers, setFilterPlayers] = useState("all")
  const [filterGoalkeepers, setFilterGoalkeepers] = useState("all")
  const [filterDifficulty, setFilterDifficulty] = useState("all")
  const [filterTime, setFilterTime] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const colorOptions = [
    "#aff606", "#33d9f6", "#f4c11a", "#ea3498", "#25d03f",
    "#8a46c5", "#ff6b35", "#4ecdc4", "#45b7d1", "#96ceb4",
    "#609966", "#c37a6b", "#77c4e4", "#f1a85f", "#d64b5e",
    "#6d89ff", "#ff8a65", "#b478d1", "#e69138", "#4e7c8e",
    "#a1c5d9", "#f5d76e", "#e8787c", "#c9d99d", "#7c7c7c"
  ];

  const initialCategories = [
    { name: "Ataque", color: "#ea3498", exercises: 12, isNew: false },
    { name: "Defensa", color: "#33d9f6", exercises: 8, isNew: false },
    { name: "Arquero-Jugador", color: "#25d03f", exercises: 6, isNew: false },
    { name: "Transiciones", color: "#f4c11a", exercises: 10, isNew: false },
    { name: "Balón Parado", color: "#8a46c5", exercises: 5, isNew: false },
  ];

  const initialExercises = [
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
      description: "Ejercicio de ataque posicional...", // Añadido para consistencia
      type: "Técnico", // Añadido para consistencia
      createdAt: "2024-01-15",
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
      description: "Ejercicio para coordinar la presión...", // Añadido
      type: "Técnico", // Añadido
      createdAt: "2024-01-14",
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
      objective: "Mejorar transiciones rápidas", // Añadido
      description: "Ejercicio para practicar la transición...", // Añadido
      type: "Técnico", // Añadido
      createdAt: "2024-01-13",
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
      objective: "Mejorar precisión en tiros libres", // Añadido
      description: "Práctica de tiros libres...", // Añadido
      type: "Técnico", // Añadido
      createdAt: "2024-01-12",
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
      objective: "Mejorar distribución del arquero", // Añadido
      description: "Ejercicio para que el arquero...", // Añadido
      type: "Técnico", // Añadido
      createdAt: "2024-01-11",
    },
  ];

  const [exercises, setExercises] = useState<any[]>(initialExercises); // Usar any[] para manejar IDs mixtos
  const [exerciseCategories, setExerciseCategories] = useState(initialCategories);


  // Efecto para cargar y actualizar los ejercicios/categorías integradas (Ebooks)
  useEffect(() => {
    const integratedExercises = getIntegratedExercises();

    // 1. Crear un mapa de todos los ejercicios (base + integrados) para manejar IDs mixtos
    const allExercisesMap = new Map();
    [...initialExercises, ...integratedExercises].forEach(ex => {
        allExercisesMap.set(ex.id, ex);
    });

    const currentExercisesList = Array.from(allExercisesMap.values());

    // 2. Obtener todas las categorías únicas
    const allUniqueCategories = new Set([
        ...initialCategories.map(c => c.name),
        ...integratedExercises.map(ex => ex.category)
    ]);

    // 3. Crear la lista de categorías actualizada con conteos y colores
    const updatedCategories = Array.from(allUniqueCategories).map(catName => {
        const existingCat = initialCategories.find(c => c.name === catName);
        const integratedCatExercises = integratedExercises.filter(ex => ex.category === catName);

        let color = existingCat ? existingCat.color : "#33d9f6"; // Color por defecto si no existe
        let isNew = !existingCat; // Marcar como nueva si no estaba en initialCategories

        // Caso especial para la categoría de Ebooks
        if (catName === "Biblioteca Ebook" && integratedCatExercises.length > 0) {
            color = "#aff606"; // Color distintivo
            isNew = true; // Siempre marcarla como "nueva" visualmente si viene de integración
        }

        return {
            name: catName,
            color: color,
            exercises: currentExercisesList.filter(ex => ex.category === catName).length,
            isNew: isNew, // isNew ahora indica si la categoría no estaba en initialCategories O es la de Ebooks
        };
    });

    // Solo actualizamos si hay cambios reales en los ejercicios o categorías
    // Comparación simple (puede mejorarse si es necesario)
    if (JSON.stringify(exercises) !== JSON.stringify(currentExercisesList) || JSON.stringify(exerciseCategories) !== JSON.stringify(updatedCategories)) {
      setExercises(currentExercisesList);
      setExerciseCategories(updatedCategories);
    }

  }, [getIntegratedExercises, exercises, exerciseCategories]); // Dependencias actualizadas


  // --- NUEVO useEffect para resetear filtros ---
  useEffect(() => {
      // Resetea los filtros cada vez que la categoría seleccionada cambie.
      setFilterPlayers("all");
      setFilterGoalkeepers("all");
      setFilterDifficulty("all");
      setFilterTime("all");
      // Opcionalmente, resetea la búsqueda también
      // setSearchQuery("");
      // console.log("Filters reset due to category change:", selectedCategory); // Para depuración
  }, [selectedCategory]); // <-- El hook depende SOLO de selectedCategory
  // --- FIN NUEVO useEffect ---


  const handleCreateCategory = () => {
    if (newCategoryName.trim()) {
      setExerciseCategories(prev => [
        ...prev,
        {
          name: newCategoryName,
          color: newCategoryColor,
          exercises: 0,
          isNew: true, // Marcar como nueva
        },
      ])
      setNewCategoryName("")
      setNewCategoryColor("#aff606")
      setShowCreateCategory(false)
    }
  }

  const handleCreateExercise = () => {
    if (
        !newExercise.name ||
        !newExercise.category ||
        !newExercise.difficulty ||
        newExercise.duration <= 0 || // Asegurar que sea mayor a 0
        newExercise.players <= 0 // Asegurar que sea mayor a 0
      ) {
      setShowValidationAlert(true);
      return;
    }

    const exerciseToAdd = {
      ...newExercise,
      id: Date.now(), // Usar timestamp como ID simple para mock
      createdAt: new Date().toISOString().split('T')[0],
      type: "Técnico", // Asignar un tipo por defecto si no se especifica
    }
    setExercises(prev => [...prev, exerciseToAdd])
    // Actualizar conteo de la categoría
    setExerciseCategories(prevCats => prevCats.map(cat =>
        cat.name === exerciseToAdd.category
        ? { ...cat, exercises: cat.exercises + 1 }
        : cat
    ));
    setNewExercise(INITIAL_EXERCISE_STATE)
    setShowCreateForm(false)
  }

  const handleEditExercise = (exercise: any) => {
    setShowExerciseDetail(null); // Cerrar detalle si está abierto
    setNewExercise(exercise); // Cargar datos del ejercicio en el formulario
    setShowCreateForm(true); // Abrir el formulario
  }

  // --- FUNCIÓN handleUpdateExercise ---
  const handleUpdateExercise = () => {
      if (
          !newExercise.name ||
          !newExercise.category ||
          !newExercise.difficulty ||
          newExercise.duration <= 0 ||
          newExercise.players <= 0
        ) {
        setShowValidationAlert(true);
        return;
      }

      // Encontrar el ejercicio original para saber la categoría anterior si cambió
      const originalExercise = exercises.find(ex => ex.id === newExercise.id);
      const oldCategory = originalExercise?.category;

      setExercises(prev =>
        prev.map(ex => (ex.id === newExercise.id ? { ...newExercise } : ex))
      );

      // Actualizar conteos de categorías si la categoría cambió
      if (oldCategory && oldCategory !== newExercise.category) {
          setExerciseCategories(prevCats => prevCats.map(cat => {
              if (cat.name === oldCategory) return { ...cat, exercises: Math.max(0, cat.exercises - 1) };
              if (cat.name === newExercise.category) return { ...cat, exercises: cat.exercises + 1 };
              return cat;
          }));
      }

      setNewExercise(INITIAL_EXERCISE_STATE); // Resetear formulario
      setShowCreateForm(false); // Cerrar formulario
  }


  const handleDeleteExercise = () => {
    if (exerciseToDelete !== null) {
      const exerciseToRemove = exercises.find(ex => ex.id === exerciseToDelete);
      if (exerciseToRemove) {
          setExercises(prev => prev.filter(ex => ex.id !== exerciseToDelete));
          // Decrementar contador de la categoría
          setExerciseCategories(prevCats => prevCats.map(cat =>
              cat.name === exerciseToRemove.category
              ? { ...cat, exercises: Math.max(0, cat.exercises - 1) }
              : cat
          ));
      }
      setExerciseToDelete(null);
      setShowExerciseDetail(null); // Cierra el detalle si estaba abierto
    }
  }

  const handleDeleteCategory = () => {
    if (categoryToDelete) {
      setExerciseCategories(prev => prev.filter(cat => cat.name !== categoryToDelete))
      setExercises(prev => prev.filter(ex => ex.category !== categoryToDelete))
      setSelectedCategory("") // Deseleccionar la categoría
      setCategoryToDelete(null)
    }
  }

  const getCategoryColor = (categoryName: string) => {
    const category = exerciseCategories.find((cat) => cat.name === categoryName)
    return category ? category.color : "#aff606" // Color por defecto
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

  // Lógica de filtros (se mantiene igual, pero los Selects usarán los datos recalculados)
  const exercisesForFilterOptions = selectedCategory === ""
    ? exercises
    : exercises.filter(ex => ex.category === selectedCategory);

  const uniquePlayers = [...new Set(exercisesForFilterOptions.map(ex => ex.players))].sort((a, b) => a - b)
  const uniqueGoalkeepers = [...new Set(exercisesForFilterOptions.map(ex => ex.goalkeepers))].sort((a, b) => a - b)
  const uniqueDurations = [...new Set(exercisesForFilterOptions.map(ex => ex.duration))].sort((a, b) => a - b)

  const handleClearFilters = () => {
    setFilterPlayers("all")
    setFilterGoalkeepers("all")
    setFilterDifficulty("all")
    setFilterTime("all")
    setSearchQuery("")
  }

  const filteredExercises = exercises
    .filter((exercise) => {
      const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "" || exercise.category === selectedCategory

      const matchesPlayers = filterPlayers === "all" || exercise.players.toString() === filterPlayers.toString()
      const matchesGoalkeepers = filterGoalkeepers === "all" || exercise.goalkeepers.toString() === filterGoalkeepers.toString()
      const matchesDifficulty = filterDifficulty === "all" || exercise.difficulty === filterDifficulty
      const matchesTime = filterTime === "all" || exercise.duration.toString() === filterTime

      return matchesSearch && matchesCategory && matchesPlayers && matchesGoalkeepers && matchesDifficulty && matchesTime
    })
    .sort((a, b) => {
        // Priorizar Ebooks al principio
        if (a.category === "Biblioteca Ebook" && b.category !== "Biblioteca Ebook") return -1;
        if (b.category === "Biblioteca Ebook" && a.category !== "Biblioteca Ebook") return 1;
        // Luego ordenar por fecha de creación (más reciente primero) si existe
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
    })


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Ejercicios</h2>
          <p className="text-gray-400">Gestiona ejercicios reutilizables para tus entrenamientos</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Categories */}
        <div className="lg:col-span-1">
          <Card className="bg-[#213041] border-[#305176]">
            <CardHeader>
              <CardTitle className="text-white">Categorías</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {exerciseCategories.map((category, index) => (
                <div
                  key={category.name} // Usar nombre como clave
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors group ${
                    selectedCategory === category.name ? "bg-[#305176]" : "bg-[#1d2834] hover:bg-[#305176]"
                  }`}
                  onClick={() => {
                     // --- onClick MODIFICADO ---
                     const newCategory = selectedCategory === category.name ? "" : category.name;
                     setSelectedCategory(newCategory); // Solo actualiza la categoría seleccionada
                     // --- FIN onClick MODIFICADO ---
                   }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: getCategoryColor(category.name) }}></div>
                    <span className="text-white font-medium">{category.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {/* Botón de eliminar solo si está seleccionada Y no es nueva/Ebook */}
                    {selectedCategory === category.name && !category.isNew ? (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="bg-red-500/20 text-red-400 hover:bg-red-500/40 opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation() // Evita que el click cambie la categoría seleccionada
                          setCategoryToDelete(category.name)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Badge variant="secondary" className="bg-[#305176] text-gray-300">
                        {category.exercises}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}

              {!showCreateCategory ? (
                <Button
                  className="w-full bg-[#305176] text-white hover:bg-[#aff606] hover:text-black"
                  onClick={() => setShowCreateCategory(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Categoría
                </Button>
              ) : (
                <div className="space-y-3 p-3 bg-[#1d2834] rounded-lg">
                  <Input
                    placeholder="Nombre de la categoría"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="bg-[#305176] border-[#305176] text-white"
                  />
                  <div className="flex flex-wrap gap-2">
                    {colorOptions
                      .filter(color => !exerciseCategories.find(cat => cat.color === color)) // Filtrar colores ya usados
                      .map((color) => (
                      <button
                        key={color}
                        className={`w-6 h-6 rounded-full border-2 ${
                          newCategoryColor === color ? "border-white" : "border-gray-500"
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setNewCategoryColor(color)}
                      />
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      className="bg-[#aff606] text-black hover:bg-[#25d03f]"
                      onClick={handleCreateCategory}
                    >
                      Crear
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white bg-transparent"
                      onClick={() => setShowCreateCategory(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Exercise List or Create/Edit Form */}
        <div className="lg:col-span-2">
          {showCreateForm ? (
            <Card className="bg-[#213041] border-[#305176]">
              <CardHeader className="text-center">
                 {/* Título dinámico */}
                <CardTitle className="text-white text-2xl font-bold">{newExercise.id ? "Editar Ejercicio" : "Crear Nuevo Ejercicio"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="exercise-name" className="text-white">
                      Nombre del Ejercicio *
                    </Label>
                    <Input
                      id="exercise-name"
                      placeholder="Ej: Ataque posicional 4-3-3"
                      value={newExercise.name}
                      onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                      className="bg-[#1d2834] border-[#305176] text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Categoría *</Label>
                    <Select
                      value={newExercise.category}
                      onValueChange={(value) => setNewExercise({ ...newExercise, category: value })}
                      // Deshabilitar si es un Ebook
                      disabled={newExercise.category === "Biblioteca Ebook"}
                    >
                      <SelectTrigger className="bg-[#1d2834] border-[#305176] text-white">
                        <SelectValue placeholder="Seleccionar categoría" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#213041] border-[#305176]">
                        {/* Filtrar la categoría de Ebooks para no poder seleccionarla */}
                        {exerciseCategories.filter(c => c.name !== 'Biblioteca Ebook').map((cat) => (
                          <SelectItem key={cat.name} value={cat.name} className="text-white">
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration" className="text-white">
                      Duración (min) *
                    </Label>
                    <Input
                      id="duration"
                      type="number"
                      placeholder="20"
                      value={newExercise.duration > 0 ? newExercise.duration : ""}
                      onChange={(e) => setNewExercise({ ...newExercise, duration: parseInt(e.target.value) || 0 })}
                      className="bg-[#1d2834] border-[#305176] text-white"
                      disabled={newExercise.category === "Biblioteca Ebook"} // Deshabilitar si es Ebook
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Jugadores *</Label>
                    <Input
                      id="players"
                      type="number"
                      placeholder="11"
                      value={newExercise.players > 0 ? newExercise.players : ""}
                      onChange={(e) => setNewExercise({ ...newExercise, players: parseInt(e.target.value) || 0 })}
                      className="bg-[#1d2834] border-[#305176] text-white"
                       disabled={newExercise.category === "Biblioteca Ebook"} // Deshabilitar si es Ebook
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Arqueros</Label>
                    <Input
                      id="goalkeepers"
                      type="number"
                      placeholder="1"
                      value={newExercise.goalkeepers >= 0 ? newExercise.goalkeepers : ""} // Permitir 0
                      onChange={(e) => setNewExercise({ ...newExercise, goalkeepers: parseInt(e.target.value) || 0 })}
                      className="bg-[#1d2834] border-[#305176] text-white"
                       disabled={newExercise.category === "Biblioteca Ebook"} // Deshabilitar si es Ebook
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Dificultad *</Label>
                    <Select
                      value={newExercise.difficulty}
                      onValueChange={(value) => setNewExercise({ ...newExercise, difficulty: value })}
                      disabled={newExercise.category === "Biblioteca Ebook"} // Deshabilitar si es Ebook
                    >
                      <SelectTrigger className="bg-[#1d2834] border-[#305176] text-white">
                        <SelectValue placeholder="Seleccionar dificultad" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#213041] border-[#305176]">
                        <SelectItem value="Fácil" className="text-white">
                          Fácil
                        </SelectItem>
                        <SelectItem value="Media" className="text-white">
                          Media
                        </SelectItem>
                        <SelectItem value="Difícil" className="text-white">
                          Difícil
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="materials" className="text-white">
                      Materiales
                    </Label>
                    <Input
                      id="materials"
                      placeholder="Conos, balones, petos..."
                      value={newExercise.materials}
                      onChange={(e) => setNewExercise({ ...newExercise, materials: e.target.value })}
                      className="bg-[#1d2834] border-[#305176] text-white"
                       disabled={newExercise.category === "Biblioteca Ebook"} // Deshabilitar si es Ebook
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-white">
                      Descripción
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Describe el ejercicio paso a paso..."
                      value={newExercise.description}
                      onChange={(e) => setNewExercise({ ...newExercise, description: e.target.value })}
                      className="bg-[#1d2834] border-[#305176] text-white min-h-[100px]"
                      disabled={newExercise.category === "Biblioteca Ebook"} // Deshabilitar si es Ebook
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="objective" className="text-white">
                      Objetivo
                    </Label>
                    <Textarea
                      id="objective"
                      placeholder="¿Qué se busca mejorar con este ejercicio?"
                      value={newExercise.objective}
                      onChange={(e) => setNewExercise({ ...newExercise, objective: e.target.value })}
                      className="bg-[#1d2834] border-[#305176] text-white min-h-[100px]"
                      // Permitir editar objetivo para Ebooks
                      // disabled={newExercise.category === "Biblioteca Ebook"}
                    />
                  </div>
                </div>

                <div className="flex justify-between space-x-4">
                  {/* Botón dinámico para guardar o actualizar */}
                  <Button
                    className="w-1/2 bg-[#aff606] text-black hover:bg-[#25d03f]"
                    // Llama a la función correcta según si estamos editando o creando
                    onClick={newExercise.id ? handleUpdateExercise : handleCreateExercise}
                    // Deshabilitar si es un Ebook
                    disabled={newExercise.category === "Biblioteca Ebook"}
                  >
                    {newExercise.id ? "Actualizar Ejercicio" : "Guardar Ejercicio"}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-1/2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white bg-transparent"
                    onClick={() => {
                      setShowCreateForm(false);
                      setNewExercise(INITIAL_EXERCISE_STATE); // Reiniciar al cancelar
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-[#213041] border-[#305176]">
              <CardHeader>
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <CardTitle className="text-2xl font-bold text-white whitespace-nowrap">
                    {selectedCategory && selectedCategory !== "" ? selectedCategory : "Ejercicios Creados"}
                    {" "}
                    ({filteredExercises.length})
                  </CardTitle>
                  <Button
                    size="default"
                    className="bg-[#305176] text-white hover:bg-[#aff606] hover:text-black font-bold h-9 px-4 ml-auto flex-shrink-0"
                    onClick={() => {
                      setNewExercise(INITIAL_EXERCISE_STATE); // Asegura que el form esté vacío
                      setShowCreateForm(true);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Nuevo Ejercicio
                  </Button>
                </div>
                <div className="flex items-center flex-wrap gap-2 mt-4">
                  <div className="relative flex-1 min-w-[200px]"> {/* Añadido min-w */}
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Búsqueda de Ejercicios"
                      className="pl-10 h-9 bg-[#1d2834] border-[#305176] text-white"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1 min-w-[120px]"> {/* Añadido min-w */}
                    <Select value={filterPlayers} onValueChange={setFilterPlayers}>
                      <SelectTrigger className="h-9 bg-[#1d2834] border-[#305176] text-white text-xs w-full"> {/* w-full */}
                        <SelectValue placeholder="Jugadores" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#213041] border-[#305176]">
                        <SelectItem value="all" className="text-white text-xs">
                          Jugadores
                        </SelectItem>
                        {uniquePlayers.map((num) => (
                          <SelectItem key={num} value={num.toString()} className="text-white text-xs">
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1 min-w-[120px]"> {/* Añadido min-w */}
                    <Select value={filterGoalkeepers} onValueChange={setFilterGoalkeepers}>
                      <SelectTrigger className="h-9 bg-[#1d2834] border-[#305176] text-white text-xs w-full"> {/* w-full */}
                        <SelectValue placeholder="Arqueros" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#213041] border-[#305176]">
                        <SelectItem value="all" className="text-white text-xs">
                          Arqueros
                        </SelectItem>
                        {uniqueGoalkeepers.map((num) => (
                          <SelectItem key={num} value={num.toString()} className="text-white text-xs">
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1 min-w-[120px]"> {/* Añadido min-w */}
                    <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
                      <SelectTrigger className="h-9 bg-[#1d2834] border-[#305176] text-white text-xs w-full"> {/* w-full */}
                        <SelectValue placeholder="Dificultad" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#213041] border-[#305176]">
                        <SelectItem value="all" className="text-white text-xs">
                          Dificultad
                        </SelectItem>
                        <SelectItem value="Fácil" className="text-white text-xs">
                          Fácil
                        </SelectItem>
                        <SelectItem value="Media" className="text-white text-xs">
                          Media
                        </SelectItem>
                        <SelectItem value="Difícil" className="text-white text-xs">
                          Difícil
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1 min-w-[120px]"> {/* Añadido min-w */}
                    <Select value={filterTime} onValueChange={setFilterTime}>
                      <SelectTrigger className="h-9 bg-[#1d2834] border-[#305176] text-white text-xs w-full"> {/* w-full */}
                        <SelectValue placeholder="Tiempo" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#213041] border-[#305176]">
                        <SelectItem value="all" className="text-white text-xs">
                          Tiempo
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
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredExercises.length > 0 ? (
                    filteredExercises.map((exercise) => (
                      <div key={exercise.id} className="p-4 bg-[#1d2834] rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-white font-medium">{exercise.name}</h3>
                          <Badge className="text-white" style={{ backgroundColor: getCategoryColor(exercise.category) }}>
                            {exercise.category}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                          <div className="flex items-center text-gray-400">
                            <Clock className="h-4 w-4 mr-1" />
                            {exercise.duration}min
                          </div>
                          <div className="flex items-center text-gray-400">
                            <Users className="h-4 w-4 mr-1" />
                            {exercise.players}{exercise.goalkeepers > 0 ? `+${exercise.goalkeepers}` : ''}
                          </div>
                          <div className="flex items-center text-gray-400">
                            <Target className="h-4 w-4 mr-1" />
                            <Badge className={getDifficultyColor(exercise.difficulty)}>
                              {exercise.difficulty}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-gray-400 text-sm mb-3">{exercise.objective}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">{exercise.materials}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-[#aff606] text-[#aff606] hover:bg-[#aff606] hover:text-black bg-transparent"
                            onClick={() => setShowExerciseDetail(exercise)}
                          >
                            Ver Detalles
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-400">No se encontraron ejercicios con los filtros aplicados.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* AlertDialog for Category Deletion */}
      <AlertDialog open={!!categoryToDelete} onOpenChange={() => setCategoryToDelete(null)}>
        <AlertDialogContent className="bg-[#213041] border-[#305176]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Confirmar Eliminación</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              ¿Estás seguro de que quieres eliminar la categoría "{categoryToDelete}"? Todos los ejercicios dentro de esta categoría también serán eliminados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-[#305176] text-white hover:bg-[#305176]">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCategory}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog for Exercise Detail */}
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
          {/* Botones de Editar/Eliminar solo si NO es un Ebook */}
          {showExerciseDetail?.category !== "Biblioteca Ebook" && (
            <div className="flex justify-between space-x-4">
              <Button
                variant="default"
                className="w-1/2 bg-[#aff606] text-black hover:bg-[#25d03f]"
                onClick={() => handleEditExercise(showExerciseDetail)} // Llama a la función de edición
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar Ejercicio
              </Button>
              <Button
                variant="outline"
                className="w-1/2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white bg-transparent"
                onClick={() => setExerciseToDelete(showExerciseDetail?.id)} // Inicia el proceso de borrado
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar Ejercicio
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* AlertDialog for Exercise Deletion */}
      <AlertDialog open={exerciseToDelete !== null} onOpenChange={() => setExerciseToDelete(null)}>
        <AlertDialogContent className="bg-[#213041] border-[#305176]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Confirmar Eliminación</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              ¿Estás seguro de que quieres eliminar este ejercicio de forma permanente? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-[#305176] text-white hover:bg-[#305176]">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteExercise} // Llama a la función de borrado final
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* AlertDialog for Form Validation */}
      <AlertDialog open={showValidationAlert} onOpenChange={setShowValidationAlert}>
        <AlertDialogContent className="bg-[#213041] border-[#305176]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Campos Requeridos</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Por favor, completa Nombre, Categoría, Duración, Jugadores y Dificultad para guardar el ejercicio.
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