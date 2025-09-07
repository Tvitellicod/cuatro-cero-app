"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Clock, Users, Target } from "lucide-react"

export function ExerciseManagement() {
  const [selectedCategory, setSelectedCategory] = useState("")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showCreateCategory, setShowCreateCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryColor, setNewCategoryColor] = useState("#aff606")

  // Filtros
  const [filterPlayers, setFilterPlayers] = useState("")
  const [filterGoalkeepers, setFilterGoalkeepers] = useState("")
  const [filterDifficulty, setFilterDifficulty] = useState("")
  const [filterTime, setFilterTime] = useState("")

  const colorOptions = [
    "#aff606",
    "#33d9f6",
    "#f4c11a",
    "#ea3498",
    "#25d03f",
    "#8a46c5",
    "#ff6b35",
    "#4ecdc4",
    "#45b7d1",
    "#96ceb4",
  ]

  const [exerciseCategories, setExerciseCategories] = useState([
    { name: "Ataque", color: "#ea3498", exercises: 12 },
    { name: "Defensa", color: "#33d9f6", exercises: 8 },
    { name: "Arquero-Jugador", color: "#25d03f", exercises: 6 },
    { name: "Transiciones", color: "#f4c11a", exercises: 10 },
    { name: "Balón Parado", color: "#8a46c5", exercises: 5 },
  ])

  const exercises = [
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
  ]

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

  const getCategoryColor = (categoryName: string) => {
    const category = exerciseCategories.find((cat) => cat.name === categoryName)
    return category ? category.color : "#aff606"
  }

  // Filtrar ejercicios
  const filteredExercises = exercises
    .filter((exercise) => {
      const matchesCategory = !selectedCategory || exercise.category === selectedCategory
      const matchesPlayers = !filterPlayers || exercise.players.toString().includes(filterPlayers)
      const matchesGoalkeepers = !filterGoalkeepers || exercise.goalkeepers.toString().includes(filterGoalkeepers)
      const matchesDifficulty = !filterDifficulty || exercise.difficulty === filterDifficulty
      const matchesTime = !filterTime || exercise.duration.toString().includes(filterTime)

      return matchesCategory && matchesPlayers && matchesGoalkeepers && matchesDifficulty && matchesTime
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Ejercicios</h2>
          <p className="text-gray-400">Gestiona ejercicios reutilizables para tus entrenamientos</p>
        </div>
        {!showCreateForm && (
          <Button className="bg-[#aff606] text-black hover:bg-[#25d03f]" onClick={() => setShowCreateForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Ejercicio
          </Button>
        )}
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
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedCategory === category.name ? "bg-[#305176]" : "bg-[#1d2834] hover:bg-[#305176]"
                  }`}
                  onClick={() => setSelectedCategory(selectedCategory === category.name ? "" : category.name)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }}></div>
                    <span className="text-white font-medium">{category.name}</span>
                  </div>
                  <Badge variant="secondary" className="bg-[#305176] text-gray-300">
                    {category.exercises}
                  </Badge>
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
                    {colorOptions.map((color) => (
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
              <CardHeader>
                <CardTitle className="text-white">Crear Nuevo Ejercicio</CardTitle>
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
                      className="bg-[#1d2834] border-[#305176] text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Categoría</Label>
                    <Select>
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
                      className="bg-[#1d2834] border-[#305176] text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Dificultad</Label>
                    <Select>
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
                      className="bg-[#1d2834] border-[#305176] text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-white">
                    Descripción
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe el ejercicio paso a paso..."
                    className="bg-[#1d2834] border-[#305176] text-white min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="objective" className="text-white">
                    Objetivo
                  </Label>
                  <Input
                    id="objective"
                    placeholder="¿Qué se busca mejorar con este ejercicio?"
                    className="bg-[#1d2834] border-[#305176] text-white"
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <Button
                    className="bg-[#aff606] text-black hover:bg-[#25d03f]"
                    onClick={() => setShowCreateForm(false)}
                  >
                    Guardar Ejercicio
                  </Button>
                  <Button
                    variant="outline"
                    className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white bg-transparent"
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
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CardTitle className="text-white">
                    Ejercicios Creados {selectedCategory && `- ${selectedCategory}`}
                  </CardTitle>

                  {/* Filtros */}
                  <div className="flex flex-wrap gap-2">
                    <Input
                      placeholder="Jugadores"
                      value={filterPlayers}
                      onChange={(e) => setFilterPlayers(e.target.value)}
                      className="w-20 h-8 bg-[#1d2834] border-[#305176] text-white text-xs"
                    />
                    <Input
                      placeholder="Arqueros"
                      value={filterGoalkeepers}
                      onChange={(e) => setFilterGoalkeepers(e.target.value)}
                      className="w-20 h-8 bg-[#1d2834] border-[#305176] text-white text-xs"
                    />
                    <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
                      <SelectTrigger className="w-24 h-8 bg-[#1d2834] border-[#305176] text-white text-xs">
                        <SelectValue placeholder="Dificultad" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#213041] border-[#305176]">
                        <SelectItem value="" className="text-white text-xs">
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
                    <Input
                      placeholder="Tiempo"
                      value={filterTime}
                      onChange={(e) => setFilterTime(e.target.value)}
                      className="w-20 h-8 bg-[#1d2834] border-[#305176] text-white text-xs"
                    />
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
                          {exercise.difficulty}
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm mb-3">{exercise.objective}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">{exercise.materials}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-[#aff606] text-[#aff606] hover:bg-[#aff606] hover:text-black bg-transparent"
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
    </div>
  )
}
