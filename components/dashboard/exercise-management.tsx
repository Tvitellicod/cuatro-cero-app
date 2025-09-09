"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Clock, Users, Target, Search, Trash2, Edit } from "lucide-react"
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


export function ExerciseManagement() {
  const [selectedCategory, setSelectedCategory] = useState("")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showCreateCategory, setShowCreateCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryColor, setNewCategoryColor] = useState("#aff606")
  const [newExercise, setNewExercise] = useState({
    name: "",
    category: "",
    duration: 0,
    players: 0,
    goalkeepers: 0,
    difficulty: "",
    materials: "",
    description: "",
    objective: "",
  })
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null)
  const [showExerciseDetail, setShowExerciseDetail] = useState<any>(null)
  const [exerciseToDelete, setExerciseToDelete] = useState<number | null>(null)


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

  const [exerciseCategories, setExerciseCategories] = useState([
    { name: "Ataque", color: "#ea3498", exercises: 12 },
    { name: "Defensa", color: "#33d9f6", exercises: 8 },
    { name: "Arquero-Jugador", color: "#25d03f", exercises: 6 },
    { name: "Transiciones", color: "#f4c11a", exercises: 10 },
    { name: "Balón Parado", color: "#8a46c5", exercises: 5 },
  ])

  const [exercises, setExercises] = useState([
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
    },
  ])

  // Lógica para actualizar el conteo de ejercicios por categoría
  useEffect(() => {
    const updatedCategories = exerciseCategories.map(cat => ({
      ...cat,
      exercises: exercises.filter(ex => ex.category === cat.name).length
    }))
    setExerciseCategories(updatedCategories)
  }, [exercises])

  const handleCreateCategory = () => {
    if (newCategoryName.trim()) {
      setExerciseCategories([
        ...exerciseCategories,
        {
          name: newCategoryName,
          color: newCategoryColor,
          exercises: 0,
        },
      ])
      setNewCategoryName("")
      setNewCategoryColor("#aff606")
      setShowCreateCategory(false)
    }
  }

  const handleCreateExercise = () => {
    if (newExercise.name && newExercise.category && newExercise.difficulty) {
      const exerciseToAdd = {
        ...newExercise,
        id: exercises.length + 1,
        createdAt: new Date().toISOString().split('T')[0],
      }
      setExercises([...exercises, exerciseToAdd])
      setNewExercise({
        name: "",
        category: "",
        duration: 0,
        players: 0,
        goalkeepers: 0,
        difficulty: "",
        materials: "",
        description: "",
        objective: "",
      })
      setShowCreateForm(false)
    }
  }

  const handleEditExercise = (exercise: any) => {
    setShowExerciseDetail(null);
    setNewExercise(exercise);
    setShowCreateForm(true);
  }

  const handleDeleteExercise = () => {
    if (exerciseToDelete) {
      setExercises(exercises.filter(ex => ex.id !== exerciseToDelete));
      setExerciseToDelete(null);
      setShowExerciseDetail(null);
    }
  }

  const handleDeleteCategory = () => {
    if (categoryToDelete) {
      setExerciseCategories(exerciseCategories.filter(cat => cat.name !== categoryToDelete))
      setExercises(exercises.filter(ex => ex.category !== categoryToDelete))
      setSelectedCategory("")
      setCategoryToDelete(null)
    }
  }

  const getCategoryColor = (categoryName: string) => {
    const category = exerciseCategories.find((cat) => cat.name === categoryName)
    return category ? category.color : "#aff606"
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

  // Generar opciones dinámicas para los filtros
  const uniquePlayers = [...new Set(exercises.map(ex => ex.players))].sort((a, b) => a - b)
  const uniqueGoalkeepers = [...new Set(exercises.map(ex => ex.goalkeepers))].sort((a, b) => a - b)
  const uniqueDurations = [...new Set(exercises.map(ex => ex.duration))].sort((a, b) => a - b)


  // Función para resetear todos los filtros
  const handleClearFilters = () => {
    setFilterPlayers("all")
    setFilterGoalkeepers("all")
    setFilterDifficulty("all")
    setFilterTime("all")
    setSearchQuery("")
  }

  // Filtrar ejercicios
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
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

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
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors group ${
                    selectedCategory === category.name ? "bg-[#305176]" : "bg-[#1d2834] hover:bg-[#305176]"
                  }`}
                  onClick={() => setSelectedCategory(selectedCategory === category.name ? "" : category.name)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }}></div>
                    <span className="text-white font-medium">{category.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {selectedCategory === category.name ? (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="bg-red-500/20 text-red-400 hover:bg-red-500/40 opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation()
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
                      .filter(color => !exerciseCategories.find(cat => cat.color === color))
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

        {/* Exercise List or Create Form */}
        <div className="lg:col-span-2">
          {showCreateForm ? (
            <Card className="bg-[#213041] border-[#305176]">
              <CardHeader className="text-center">
                <CardTitle className="text-white text-2xl font-bold">Crear Nuevo Ejercicio</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="exercise-name" className="text-white">
                      Nombre del Ejercicio
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
                    <Label className="text-white">Categoría</Label>
                    <Select
                      value={newExercise.category}
                      onValueChange={(value) => setNewExercise({ ...newExercise, category: value })}
                    >
                      <SelectTrigger className="bg-[#1d2834] border-[#305176] text-white">
                        <SelectValue placeholder="Seleccionar categoría" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#213041] border-[#305176]">
                        {exerciseCategories.map((cat) => (
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
                      Duración (min)
                    </Label>
                    <Input
                      id="duration"
                      type="number"
                      placeholder="20"
                      value={newExercise.duration}
                      onChange={(e) => setNewExercise({ ...newExercise, duration: parseInt(e.target.value) || 0 })}
                      className="bg-[#1d2834] border-[#305176] text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="players" className="text-white">
                      Jugadores
                    </Label>
                    <Input
                      id="players"
                      type="number"
                      placeholder="11"
                      value={newExercise.players}
                      onChange={(e) => setNewExercise({ ...newExercise, players: parseInt(e.target.value) || 0 })}
                      className="bg-[#1d2834] border-[#305176] text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="goalkeepers" className="text-white">
                      Arqueros
                    </Label>
                    <Input
                      id="goalkeepers"
                      type="number"
                      placeholder="1"
                      value={newExercise.goalkeepers}
                      onChange={(e) => setNewExercise({ ...newExercise, goalkeepers: parseInt(e.target.value) || 0 })}
                      className="bg-[#1d2834] border-[#305176] text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    />
                  </div>
                </div>

                <div className="flex justify-between space-x-4">
                  <Button
                    className="w-1/2 bg-[#aff606] text-black hover:bg-[#25d03f]"
                    onClick={handleCreateExercise}
                  >
                    Guardar Ejercicio
                  </Button>
                  <Button
                    variant="outline"
                    className="w-1/2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white bg-transparent"
                    onClick={() => setShowCreateForm(false)}
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
                  </CardTitle>
                  <Button
                    size="default"
                    className="bg-[#305176] text-white hover:bg-[#aff606] hover:text-black font-bold h-9 px-4 ml-auto flex-shrink-0"
                    onClick={() => setShowCreateForm(true)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Nuevo Ejercicio
                  </Button>
                </div>
                <div className="flex items-center flex-wrap gap-2 mt-4">
                  <div className="space-y-1">
                    <Label className="text-white text-xs">Búsqueda</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Buscar ejercicio..."
                        className="pl-10 bg-[#1d2834] border-[#305176] text-white"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-white text-xs">Jugadores</Label>
                    <Select value={filterPlayers} onValueChange={setFilterPlayers}>
                      <SelectTrigger className="w-24 h-8 bg-[#1d2834] border-[#305176] text-white text-xs">
                        <SelectValue placeholder="Jugadores" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#213041] border-[#305176]">
                         <SelectItem value="all" className="text-white text-xs">
                          Todas
                        </SelectItem>
                        {[...new Set(exercises.map(ex => ex.players))].sort((a, b) => a - b).map((num) => (
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
                      <SelectTrigger className="w-24 h-8 bg-[#1d2834] border-[#305176] text-white text-xs">
                        <SelectValue placeholder="Arqueros" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#213041] border-[#305176]">
                         <SelectItem value="all" className="text-white text-xs">
                          Todas
                        </SelectItem>
                        {[...new Set(exercises.map(ex => ex.goalkeepers))].sort((a, b) => a - b).map((num) => (
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
                      <SelectTrigger className="w-24 h-8 bg-[#1d2834] border-[#305176] text-white text-xs">
                        <SelectValue placeholder="Dificultad" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#213041] border-[#305176]">
                        <SelectItem value="all" className="text-white text-xs">
                          Todas
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
                  <div className="space-y-1">
                    <Label className="text-white text-xs">Tiempo</Label>
                    <Select value={filterTime} onValueChange={setFilterTime}>
                      <SelectTrigger className="w-24 h-8 bg-[#1d2834] border-[#305176] text-white text-xs">
                        <SelectValue placeholder="Tiempo" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#213041] border-[#305176]">
                        <SelectItem value="all" className="text-white text-xs">
                          Todos
                        </SelectItem>
                        {[...new Set(exercises.map(ex => ex.duration))].sort((a, b) => a - b).map((time) => (
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
                  {filteredExercises.map((exercise) => (
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
                          {exercise.players}+{exercise.goalkeepers}
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
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
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
          <div className="flex justify-between space-x-4">
            <Button
              variant="default"
              className="w-1/2 bg-[#aff606] text-black hover:bg-[#25d03f]"
              onClick={() => handleEditExercise(showExerciseDetail)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar Ejercicio
            </Button>
            <Button
              variant="outline"
              className="w-1/2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white bg-transparent"
              onClick={() => {
                setShowExerciseDetail(null);
                setExerciseToDelete(showExerciseDetail?.id);
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar Ejercicio
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog for Deleting Exercise */}
      <AlertDialog open={!!exerciseToDelete} onOpenChange={() => setExerciseToDelete(null)}>
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
              onClick={handleDeleteExercise}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}