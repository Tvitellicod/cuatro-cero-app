// components/dashboard/nutrition-section.tsx

"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Trash2, Edit, Scale, User, Calendar, FileText, Eye } from "lucide-react"
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
import { useProfile, Player as ContextPlayer } from "@/hooks/use-profile"
import { format } from "date-fns"


// Definición de tipos para el reporte
interface AnthropometricReport {
  id: number
  playerId: string
  playerName: string
  date: string // YYYY-MM-DD
  weight: number
  height: number
  bmi: number
  fatMass: number // Masa adiposa (%)
  muscleMass: number // Masa muscular (%)
  observations: string
  goal: "Ganar Masa" | "Mantener" | "Perder Grasa"
}

// ESTADO INICIAL LIMPIO DE REPORTES
const initialReports: AnthropometricReport[] = [];

// Estado inicial del formulario
const initialFormState = {
  playerId: "",
  weight: 75,
  height: 1.75,
  fatMass: 12,
  muscleMass: 45,
  observations: "",
  goal: "Mantener",
}

export function NutritionSection() {
  const { profile, players: allPlayers } = useProfile();
  const [reports, setReports] = useState<AnthropometricReport[]>(initialReports);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDetail, setShowDetail] = useState<AnthropometricReport | null>(null);

  const isNutritionist = profile?.role === "NUTRICIONISTA";
  const goals: ("Ganar Masa" | "Mantener" | "Perder Grasa")[] = ["Ganar Masa", "Mantener", "Perder Grasa"];

  const getPlayerName = (playerId: string) => {
    return allPlayers.find(p => p.id === playerId)?.name || "Jugador Desconocido";
  };

  const calculateBMI = (weight: number, height: number): number => {
    if (height <= 0) return 0;
    // BMI = weight (kg) / height (m)^2
    return parseFloat((weight / (height * height)).toFixed(1));
  };


  // Filtros
  const filteredReports = useMemo(() => {
    let filtered = reports.filter(report => {
        const playerName = getPlayerName(report.playerId);
        return playerName.toLowerCase().includes(searchTerm.toLowerCase());
    });
    // Ordenar por fecha, el más reciente primero
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [reports, searchTerm, allPlayers]);


  const handleSave = () => {
    if (!formData.playerId || formData.weight <= 0 || formData.height <= 0) {
      toast({
        title: "Error de validación",
        description: "Debe seleccionar un jugador y completar Peso y Altura.",
        variant: "destructive",
      });
      return;
    }

    const playerName = getPlayerName(formData.playerId);
    const calculatedBMI = calculateBMI(formData.weight, formData.height);
    const currentDate = format(new Date(), 'yyyy-MM-dd');

    const reportData = {
        ...formData,
        bmi: calculatedBMI,
        playerName: playerName,
    };

    if (editingId !== null) {
      // Editar
      setReports(prev => prev.map(rep => rep.id === editingId ? { ...rep, ...reportData } : rep as AnthropometricReport));
      toast.success(`Reporte de ${playerName} actualizado.`);
    } else {
      // Crear nuevo
      const newReport: AnthropometricReport = {
        ...reportData,
        id: Date.now(),
        date: currentDate,
      } as AnthropometricReport;
      setReports(prev => [...prev, newReport]);
      toast.success(`Nuevo reporte creado para ${playerName}.`);
    }

    handleCancel();
  };

  const handleEdit = (report: AnthropometricReport) => {
    setFormData(report);
    setEditingId(report.id);
    setShowForm(true);
  };

  const handleDelete = () => {
    if (deleteId !== null) {
      setReports(prev => prev.filter(rep => rep.id !== deleteId));
      toast.success("Reporte eliminado correctamente.");
    }
    setDeleteId(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(initialFormState);
  };

  const getGoalColor = (goal: string) => {
      switch (goal) {
          case "Ganar Masa": return "bg-[#ff6b35] text-white";
          case "Perder Grasa": return "bg-[#33d9f6] text-black";
          case "Mantener":
          default: return "bg-[#25d03f] text-black";
      }
  }


  if (!isNutritionist) {
    return (
      <Card className="bg-[#213041] border-[#305176] text-white p-6 text-center">
        <h2 className="text-2xl font-bold mb-2">Acceso Restringido</h2>
        <p className="text-gray-400">Solo el perfil de **NUTRICIONISTA** tiene acceso a este módulo.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
            <Scale className="h-6 w-6 mr-2 text-[#ff6b35]" />
            Seguimiento Nutricional y Antropométrico
          </h2>
          <p className="text-gray-400">
            Registra el peso, altura, IMC y porcentaje de masa corporal de los jugadores.
          </p>
        </div>
      </div>

      {/* Formulario de Creación/Edición */}
      <Card className={`bg-[#213041] border-[#305176] transition-all duration-300 ${showForm ? 'block' : 'hidden'}`}>
        <CardHeader>
          <CardTitle className="text-white">
            {editingId ? `Editar Reporte` : "Crear Nuevo Reporte Antropométrico"}
          </CardTitle>
          <p className="text-gray-400 text-sm">
            Ingresa los datos del jugador y su estado físico actual.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="space-y-2 col-span-1 md:col-span-4">
              <Label htmlFor="player" className="text-white">Jugador *</Label>
              <Select
                value={formData.playerId}
                onValueChange={(value) => setFormData({ ...formData, playerId: value })}
                disabled={editingId !== null} // No se cambia el jugador al editar
              >
                <SelectTrigger className="w-full bg-[#1d2834] border-[#305176] text-white">
                  <SelectValue placeholder="Seleccionar jugador" />
                </SelectTrigger>
                <SelectContent className="bg-[#213041] border-[#305176]">
                  {allPlayers.map(player => (
                    <SelectItem key={player.id} value={player.id} className="text-white">
                      {player.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="weight" className="text-white">Peso (kg) *</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                min="0"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || 0 })}
                className="bg-[#1d2834] border-[#305176] text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height" className="text-white">Altura (m) *</Label>
              <Input
                id="height"
                type="number"
                step="0.01"
                min="0"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: parseFloat(e.target.value) || 0 })}
                className="bg-[#1d2834] border-[#305176] text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fatMass" className="text-white">Masa Adiposa (%)</Label>
              <Input
                id="fatMass"
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={formData.fatMass}
                onChange={(e) => setFormData({ ...formData, fatMass: parseFloat(e.target.value) || 0 })}
                className="bg-[#1d2834] border-[#305176] text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="muscleMass" className="text-white">Masa Muscular (%)</Label>
              <Input
                id="muscleMass"
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={formData.muscleMass}
                onChange={(e) => setFormData({ ...formData, muscleMass: parseFloat(e.target.value) || 0 })}
                className="bg-[#1d2834] border-[#305176] text-white"
              />
            </div>
          </div>
          
          <div className="space-y-2 mb-4">
            <Label htmlFor="goal" className="text-white">Objetivo Nutricional</Label>
              <Select
                value={formData.goal}
                onValueChange={(value: "Ganar Masa" | "Mantener" | "Perder Grasa") => setFormData({ ...formData, goal: value })}
              >
                <SelectTrigger className="w-full bg-[#1d2834] border-[#305176] text-white">
                  <SelectValue placeholder="Seleccionar objetivo" />
                </SelectTrigger>
                <SelectContent className="bg-[#213041] border-[#305176]">
                  {goals.map(g => (
                    <SelectItem key={g} value={g} className="text-white">{g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
          </div>

          <div className="space-y-2 mb-6">
            <Label htmlFor="observations" className="text-white">Observaciones</Label>
            <Textarea
              id="observations"
              value={formData.observations}
              onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
              className="bg-[#1d2834] border-[#305176] text-white min-h-[100px]"
              placeholder="Recomendaciones dietéticas, plan de suplementos, etc."
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
              className="bg-[#ff6b35] text-white hover:bg-[#d4552b]"
              onClick={handleSave}
              disabled={!formData.playerId}
            >
              {editingId ? "Guardar Cambios" : "Crear Reporte"}
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
                placeholder="Buscar jugador..."
                className="pl-10 bg-[#1d2834] border-[#305176] text-white w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              size="sm"
              className="bg-[#ff6b35] text-white hover:bg-[#d4552b] font-semibold flex-shrink-0"
              onClick={() => {
                handleCancel();
                setShowForm(true);
              }}
            >
              <Plus className="h-4 w-4 mr-1" />
              Nuevo Reporte
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredReports.length > 0 ? (
              filteredReports.map((report) => (
                <div
                  key={report.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-[#1d2834] rounded-lg border-l-4 border-[#ff6b35]"
                >
                  <div className="flex-1 space-y-1 sm:space-y-0 sm:flex sm:items-center sm:space-x-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-[#305176] rounded-full flex-shrink-0">
                        <User className="h-6 w-6 text-[#ff6b35]" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold">{report.playerName}</h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <Badge variant="secondary" className="bg-[#305176] text-gray-300">
                          {report.date}
                        </Badge>
                        <Badge className={getGoalColor(report.goal)}>
                          {report.goal}
                        </Badge>
                        <span className="text-sm text-gray-400 font-medium">IMC: {report.bmi}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mt-3 sm:mt-0">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-[#33d9f6] text-[#33d9f6] hover:bg-[#33d9f6]/20 bg-transparent"
                      onClick={() => setShowDetail(report)}
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-[#f4c11a] text-[#f4c11a] hover:bg-[#f4c11a]/20 bg-transparent"
                      onClick={() => handleEdit(report)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-400 hover:bg-red-500/20 hover:text-red-300"
                      onClick={() => setDeleteId(report.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">
                No hay reportes antropométricos registrados.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!showDetail} onOpenChange={() => setShowDetail(null)}>
        <DialogContent className="sm:max-w-[500px] bg-[#213041] border-[#305176] text-white">
          <DialogHeader>
            <DialogTitle className="text-white text-2xl">{showDetail?.playerName}</DialogTitle>
            <DialogDescription className="text-gray-400">
                Reporte del {showDetail?.date}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4 text-sm border-b border-[#305176] pb-4">
                <div className="space-y-1">
                    <p className="text-gray-400">Peso:</p>
                    <p className="text-white font-bold">{showDetail?.weight} kg</p>
                </div>
                <div className="space-y-1">
                    <p className="text-gray-400">Altura:</p>
                    <p className="text-white font-bold">{showDetail?.height} m</p>
                </div>
                <div className="space-y-1">
                    <p className="text-gray-400">IMC:</p>
                    <p className="text-white font-bold">{showDetail?.bmi}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-gray-400">Objetivo:</p>
                    <Badge className={getGoalColor(showDetail?.goal || 'Mantener')}>{showDetail?.goal}</Badge>
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm border-b border-[#305176] pb-4">
                <div className="space-y-1">
                    <p className="text-gray-400">Masa Adiposa (Grasa):</p>
                    <p className="text-white font-bold">{showDetail?.fatMass}%</p>
                </div>
                <div className="space-y-1">
                    <p className="text-gray-400">Masa Muscular:</p>
                    <p className="text-white font-bold">{showDetail?.muscleMass}%</p>
                </div>
            </div>

            <div className="space-y-2">
                <h4 className="text-white font-bold">Observaciones:</h4>
                <p className="text-gray-300 italic min-h-[50px] bg-[#1d2834] p-3 rounded-md">{showDetail?.observations || 'Sin observaciones registradas.'}</p>
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
              ¿Estás seguro de que quieres eliminar este reporte de forma permanente?
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