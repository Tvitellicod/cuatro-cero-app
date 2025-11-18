// components/dashboard/kinesiology-exercise-management.tsx

"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Search, Trash2, Edit, Target, Clock, Users, HeartPulse, Upload, Eye } from "lucide-react"
import { toast } from "@/hooks/use-toast"
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


// Definición de tipos para los ejercicios de kinesiología
interface KinesiologyExercise {
  id: number
  name: string
  category: string
  duration: number
  players: number // Usualmente 1 para rehabilitación
  goalkeepers: number
  difficulty: "Fácil" | "Media" | "Difícil"
  materials: string
  objective: string
  description: string
  createdAt: string
  type: "Kinesiológico"
}

// ESTADO INICIAL LIMPIO DE EJERCICIOS DE KINESIOLOGÍA
const initialKinesiologyExercises: KinesiologyExercise[] = [];

// Estado inicial del formulario
const initialFormState: Omit<KinesiologyExercise, 'id' | 'createdAt' | 'type'> = {
  name: "",
  category: "Rehabilitación",
  duration: 20,
  players: 1, // Por defecto 1
  goalkeepers: 0,
  difficulty: "Fácil",
  materials: "",
  objective: "",
  description: "",
}


export function KinesiologyExerciseManagement() {
  const { profile } = useProfile();
  // El estado de los ejercicios ahora comienza vacío
  const [exercises, setExercises] = useState<KinesiologyExercise[]>(initialKinesiologyExercises);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDetail, setShowDetail] = useState<KinesiologyExercise | null>(null);

  // Opciones hardcodeadas para la demo (Ajustadas a Kinesiología)
  const categories = ["Rehabilitación", "Prevención", "Movilidad", "Fortalecimiento"];
  const difficulties: ("Fácil" | "Media" | "Difícil")[] = ["Fácil", "Media", "Difícil"];

  // Filtros
  const filteredExercises = useMemo(() => {
    let filtered = exercises.filter(ex =>
      ex.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ex.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    // Ordenar por ID para que los nuevos salgan al final, manteniendo el orden de creación
    return filtered.sort((a, b) => b.id - a.id);
  }, [exercises, searchTerm]);


  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Fácil": return "bg-[#25d03f] text-black"
      case "Media": return "bg-[#f4c11a] text-black"
      case "Difícil": return "bg-red-500 text-white"
      default: return "bg-gray-500 text-white"
    }
  }

  const handleSave = () => {
    if (!formData.name.trim() || !formData.objective.trim() || formData.duration < 5) {
      toast({
        title: "Error de validación",
        description: "El nombre, el objetivo y la duración (mín. 5 min) son obligatorios.",
        variant: "destructive",
      });
      return;
    }

    if (editingId !== null) {
      // Editar
      setExercises(prev => prev.map(ex => ex.id === editingId ? { ...ex, ...formData } : ex));
      toast.success(`Ejercicio kinesiológico "${formData.name}" actualizado.`);
    } else {
      // Crear nuevo
      const newExercise: KinesiologyExercise = {
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString().split('T')[0],
        type: "Kinesiológico",
      };
      setExercises(prev => [...prev, newExercise]);
      toast.success(`Ejercicio kinesiológico "${newExercise.name}" creado.`);
    }

    handleCancel();
  };

  const handleEdit = (exercise: KinesiologyExercise) => {
    setFormData(exercise);
    setEditingId(exercise.id);
    setShowForm(true);
  };

  const handleDelete = () => {
    if (deleteId !== null) {
      setExercises(prev => prev.filter(ex => ex.id !== deleteId));
      toast.success("Ejercicio kinesiológico eliminado correctamente.");
    }
    setDeleteId(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(initialFormState);
  };


  // Rol de perfil para la etiqueta de visibilidad
  const isKinesiologist = profile?.role === "KINESIOLOGO";
  const roleLabel = isKinesiologist ? "Kinesiólogo" : "Salud";


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
            <HeartPulse className="h-6 w-6 mr-2 text-[#4ecdc4]" />
            Catálogo de Ejercicios de Kinesiología
          </h2>
          <p className="text-gray-400">
            Crea y administra ejercicios centrados en la rehabilitación y prevención de lesiones.
          </p>
        </div>
      </div>

      {/* Formulario de Creación/Edición */}
      <Card className={`bg-[#213041] border-[#305176] transition-all duration-300 ${showForm ? 'block' : 'hidden'}`}>
        <CardHeader>
          <CardTitle className="text-white">
            {editingId ? `Editar Ejercicio: ${formData.name}` : "Crear Nuevo Ejercicio Kinesiológico"}
          </CardTitle>
          <p className="text-gray-400 text-sm">
            {editingId ? "Actualiza los detalles del ejercicio." : "Los ejercicios que crees aparecerán en el planificador físico/kinesiológico."}
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="space-y-2 col-span-1 md:col-span-2">
              <Label htmlFor="name" className="text-white">Nombre del Ejercicio *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-[#1d2834] border-[#305176] text-white"
                placeholder="Ej: Fortalecimiento de isquiotibiales con banda elástica"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category" className="text-white">Categoría</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger className="w-full bg-[#1d2834] border-[#305176] text-white">
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent className="bg-[#213041] border-[#305176]">
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat} className="text-white">{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-white">Duración (min) *</Label>
              <Input
                id="duration"
                type="number"
                min="5"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                className="bg-[#1d2834] border-[#305176] text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="players" className="text-white">Jugadores (Usualmente 1)</Label>
              <Input
                id="players"
                type="number"
                min="0"
                value={formData.players}
                onChange={(e) => setFormData({ ...formData, players: parseInt(e.target.value) || 0 })}
                className="bg-[#1d2834] border-[#305176] text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="goalkeepers" className="text-white">Arqueros</Label>
              <Input
                id="goalkeepers"
                type="number"
                min="0"
                value={formData.goalkeepers}
                onChange={(e) => setFormData({ ...formData, goalkeepers: parseInt(e.target.value) || 0 })}
                className="bg-[#1d2834] border-[#305176] text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="difficulty" className="text-white">Dificultad</Label>
              <Select
                value={formData.difficulty}
                onValueChange={(value: "Fácil" | "Media" | "Difícil") => setFormData({ ...formData, difficulty: value })}
              >
                <SelectTrigger className="w-full bg-[#1d2834] border-[#305176] text-white">
                  <SelectValue placeholder="Seleccionar dificultad" />
                </SelectTrigger>
                <SelectContent className="bg-[#213041] border-[#305176]">
                  {difficulties.map(diff => (
                    <SelectItem key={diff} value={diff} className="text-white">{diff}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <Label htmlFor="objective" className="text-white">Objetivo Principal *</Label>
            <Textarea
              id="objective"
              value={formData.objective}
              onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
              className="bg-[#1d2834] border-[#305176] text-white min-h-[80px]"
              placeholder="Ej: Recuperar el rango de movimiento completo de la articulación."
            />
          </div>

          <div className="space-y-2 mb-6">
            <Label htmlFor="description" className="text-white">Protocolo y Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-[#1d2834] border-[#305176] text-white min-h-[120px]"
              placeholder="Detalla la serie de ejercicios, repeticiones y el protocolo de seguridad."
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white bg-transparent"
              onClick={handleCancel}
            >
              Cancelar
            </Button>
            <Button
              className="bg-[#4ecdc4] text-black hover:bg-[#39a79d]"
              onClick={handleSave}
            >
              {editingId ? "Guardar Cambios" : "Crear Ejercicio"}
            </Button>
          </div>
        </CardContent>
      </Card>


      {/* Lista y Herramientas */}
      <Card className="bg-[#213041] border-[#305176]">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-4 w-full">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar ejercicio..."
                className="pl-10 bg-[#1d2834] border-[#305176] text-white w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              size="sm"
              className="bg-[#4ecdc4] text-black hover:bg-[#39a79d] font-semibold flex-shrink-0"
              onClick={() => {
                handleCancel();
                setShowForm(true);
              }}
            >
              <Plus className="h-4 w-4 mr-1" />
              Nuevo Ejercicio
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredExercises.length > 0 ? (
              filteredExercises.map((exercise) => (
                <div
                  key={exercise.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-[#1d2834] rounded-lg border-l-4 border-[#4ecdc4]"
                >
                  <div className="flex-1 space-y-1 sm:space-y-0 sm:flex sm:items-center sm:space-x-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-[#305176] rounded-full flex-shrink-0">
                        <HeartPulse className="h-6 w-6 text-[#4ecdc4]" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold">{exercise.name}</h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <Badge variant="secondary" className="bg-[#305176] text-gray-300">
                          {exercise.category}
                        </Badge>
                        <Badge className={getDifficultyColor(exercise.difficulty)}>
                          {exercise.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mt-3 sm:mt-0">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-[#33d9f6] text-[#33d9f6] hover:bg-[#33d9f6]/20 bg-transparent"
                      onClick={() => setShowDetail(exercise)}
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-[#f4c11a] text-[#f4c11a] hover:bg-[#f4c11a]/20 bg-transparent"
                      onClick={() => handleEdit(exercise)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-400 hover:bg-red-500/20 hover:text-red-300"
                      onClick={() => setDeleteId(exercise.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">
                No hay ejercicios de kinesiología creados. Utiliza el botón "Nuevo Ejercicio" para comenzar.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!showDetail} onOpenChange={() => setShowDetail(null)}>
        <DialogContent className="sm:max-w-[500px] bg-[#213041] border-[#305176] text-white">
          <DialogHeader>
            <DialogTitle className="text-white text-2xl">{showDetail?.name}</DialogTitle>
            <DialogDescription className="text-gray-400">
                {showDetail?.category} - Creado por: {roleLabel}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-[#f4c11a]" />
                    <span className="text-gray-300 font-medium">{showDetail?.duration} min</span>
                </div>
                <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-[#33d9f6]" />
                    <span className="text-gray-300 font-medium">{showDetail?.players} Jugadores</span>
                </div>
                <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-[#ea3498]" />
                    <span className="text-gray-300 font-medium">Arqueros: {showDetail?.goalkeepers}</span>
                </div>
                <Badge className={`${getDifficultyColor(showDetail?.difficulty || 'Media')} text-xs h-6 px-3`}>
                    {showDetail?.difficulty}
                </Badge>
            </div>
            <div className="space-y-2">
                <h4 className="text-white font-bold border-b border-[#305176] pb-1">Objetivo:</h4>
                <p className="text-gray-300 italic">{showDetail?.objective}</p>
            </div>
            <div className="space-y-2">
                <h4 className="text-white font-bold border-b border-[#305176] pb-1">Protocolo y Materiales:</h4>
                <p className="text-gray-300">{showDetail?.description || 'No hay descripción detallada.'}</p>
                <p className="text-gray-400 text-sm">Materiales: {showDetail?.materials || 'Ninguno'}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Alert Dialog for Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-[#213041] border-[#305176]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Confirmar Eliminación</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              ¿Estás seguro de que quieres eliminar este ejercicio de forma permanente?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-[#305176] text-white hover:bg-[#305176]">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
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