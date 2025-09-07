"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Clock, Users, Target, Heart } from "lucide-react"

export function KinesiologyExerciseManagement() {
  const [showCreateForm, setShowCreateForm] = useState(false)

  const kinesiologyCategories = [
    { name: "Rehabilitación", color: "bg-green-500", exercises: 10 },
    { name: "Prevención", color: "bg-blue-500", exercises: 8 },
    { name: "Fortalecimiento", color: "bg-purple-500", exercises: 12 },
    { name: "Movilidad", color: "bg-orange-500", exercises: 6 },
    { name: "Recuperación", color: "bg-teal-500", exercises: 7 },
  ]

  const exercises = [
    {
      id: 1,
      name: "Ejercicios de Rehabilitación de Rodilla",
      category: "Rehabilitación",
      duration: 20,
      players: 1,
      difficulty: "Media",
      materials: "Banda elástica, pelota suiza",
      objective: "Recuperar movilidad y fuerza en rodilla",
      createdBy: "Kinesiólogo",
    },
    {
      id: 2,
      name: "Prevención de Lesiones de Tobillo",
      category: "Prevención",
      duration: 15,
      players: 8,
      difficulty: "Fácil",
      materials: "Conos, plataforma inestable",
      objective: "Fortalecer músculos estabilizadores del tobillo",
      createdBy: "Kinesiólogo",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Ejercicios Kinesiología</h2>
          <p className="text-gray-400">Gestión de ejercicios de rehabilitación y prevención</p>
        </div>
        <Button
          className="bg-[#aff606] text-black hover:bg-[#25d03f]"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Ejercicio
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Categories */}
        <div className="lg:col-span-1">
          <Card className="bg-[#213041] border-[#305176]">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Heart className="h-5 w-5 mr-2" />
                Categorías Kinesiológicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {kinesiologyCategories.map((category, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-[#1d2834] rounded-lg cursor-pointer hover:bg-[#305176] transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${category.color}`}></div>
                    <span className="text-white font-medium">{category.name}</span>
                  </div>
                  <Badge variant="secondary" className="bg-[#305176] text-gray-300">
                    {category.exercises}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Exercise Form */}
        <div className="lg:col-span-2">
          {showCreateForm && (
            <Card className="bg-[#213041] border-[#305176] mb-6">
              <CardHeader>
                <CardTitle className="text-white">Crear Nuevo Ejercicio Kinesiológico</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="exercise-name" className="text-white">
                      Nombre del Ejercicio
                    </Label>
                    <Input
                      id="exercise-name"
                      placeholder="Ej: Rehabilitación de rodilla"
                      className="bg-[#1d2834] border-[#305176] text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Categoría Kinesiológica</Label>
                    <Select>
                      <SelectTrigger className="bg-[#1d2834] border-[#305176] text-white">
                        <SelectValue placeholder="Seleccionar categoría" />
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
                      placeholder="1"
                      className="bg-[#1d2834] border-[#305176] text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Dificultad</Label>
                    <Select>
                      <SelectTrigger className="bg-[#1d2834] border-[#305176] text-white">
                        <SelectValue placeholder="Seleccionar dificultad" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#213041] border-[#305176]">
                        <SelectItem value="facil" className="text-white">
                          Fácil
                        </SelectItem>
                        <SelectItem value="media" className="text-white">
                          Media
                        </SelectItem>
                        <SelectItem value="dificil" className="text-white">
                          Difícil
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="materials" className="text-white">
                    Materiales
                  </Label>
                  <Input
                    id="materials"
                    placeholder="Banda elástica, pelota suiza..."
                    className="bg-[#1d2834] border-[#305176] text-white"
                  />
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
                    placeholder="¿Qué se busca rehabilitar o prevenir?"
                    className="bg-[#1d2834] border-[#305176] text-white"
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
                  <Button className="bg-[#aff606] text-black hover:bg-[#25d03f]">Guardar Ejercicio</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Existing Exercises */}
          <Card className="bg-[#213041] border-[#305176]">
            <CardHeader>
              <CardTitle className="text-white">Ejercicios Creados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {exercises.map((exercise) => (
                  <div key={exercise.id} className="p-4 bg-[#1d2834] rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-white font-medium">{exercise.name}</h3>
                      <Badge className="bg-green-500 text-white">{exercise.category}</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                      <div className="flex items-center text-gray-400">
                        <Clock className="h-4 w-4 mr-1" />
                        {exercise.duration}min
                      </div>
                      <div className="flex items-center text-gray-400">
                        <Users className="h-4 w-4 mr-1" />
                        {exercise.players}
                      </div>
                      <div className="flex items-center text-gray-400">
                        <Target className="h-4 w-4 mr-1" />
                        {exercise.difficulty}
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm mb-3">{exercise.objective}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">{exercise.materials}</span>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="bg-[#305176] text-gray-300 text-xs">
                          {exercise.createdBy}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-[#aff606] text-[#aff606] hover:bg-[#aff606] hover:text-black bg-transparent"
                        >
                          Ver Detalles
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
