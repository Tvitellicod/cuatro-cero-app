// components/dashboard/matches-management.tsx

"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Trophy, Clock, Zap, Target, Edit, Trash2, Eye, Plus, Search } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
import { useProfile, Category as ContextCategory } from "@/hooks/use-profile"


// Definición de tipos
interface MatchResult {
  id: number
  opponent: string
  homeScore: number
  awayScore: number
  date: string // YYYY-MM-DD
  category: string
  tournament: string
  events: {
    minute: number
    type: "Goal" | "Assist" | "Yellow Card" | "Red Card" | "Substitution"
    player: string
  }[]
}

// ESTADO INICIAL LIMPIO DE RESULTADOS DE PARTIDOS
const initialMatchResults: MatchResult[] = [];

// Estado inicial del formulario (simplificado para el mock)
const initialFormState = {
    opponent: "",
    homeScore: 0,
    awayScore: 0,
    date: new Date().toISOString().split('T')[0],
    category: "Primera", // Debe coincidir con alguna categoría en useProfile
    tournament: "Liga Local",
};

export function MatchesManagement() {
  const { profile, categories } = useProfile();
  const [results, setResults] = useState<MatchResult[]>(initialMatchResults);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDetail, setShowDetail] = useState<MatchResult | null>(null);

  const isTechnician = profile?.role === "DIRECTOR TECNICO";
  const tournamentOptions = ["Liga Local", "Copa Regional", "Amistoso"];
  
  // Categorías reales del contexto
  const categoryOptions = categories.map(c => ({ id: c.id, name: c.name }));
  const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || "N/A";

  // Filtros
  const filteredResults = useMemo(() => {
    let filtered = results.filter(res =>
      res.opponent.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    // Ordenar por fecha descendente
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [results, searchTerm]);

  const getMatchResult = (home: number, away: number) => {
    if (home > away) return "Ganado";
    if (home < away) return "Perdido";
    return "Empatado";
  };

  const getResultColor = (home: number, away: number) => {
    if (home > away) return "bg-[#25d03f] text-black";
    if (home < away) return "bg-red-500 text-white";
    return "bg-[#f4c11a] text-black";
  };

  const handleSave = () => {
    if (!formData.opponent.trim() || !formData.date || !formData.category) {
      toast({
        title: "Error de validación",
        description: "Debe completar Oponente, Fecha y Categoría.",
        variant: "destructive",
      });
      return;
    }

    const categoryName = getCategoryName(formData.category);

    const newResult = {
        ...formData,
        category: categoryName,
        opponent: formData.opponent.trim(),
        homeScore: Math.max(0, formData.homeScore), // Asegura no negativos
        awayScore: Math.max(0, formData.awayScore), // Asegura no negativos
        // Mock de eventos, ya que no se gestionan en este formulario simplificado
        events: [],
    };

    if (editingId !== null) {
      // Editar
      setResults(prev => prev.map(res => res.id === editingId ? { ...res, ...newResult } : res as MatchResult));
      toast.success(`Resultado actualizado: ${newResult.opponent}`);
    } else {
      // Crear nuevo
      const matchWithId: MatchResult = {
        ...newResult,
        id: Date.now(),
      } as MatchResult;
      setResults(prev => [...prev, matchWithId]);
      toast.success(`Resultado guardado: ${matchWithId.opponent}`);
    }

    handleCancel();
  };

  const handleEdit = (result: MatchResult) => {
      // Necesitamos el ID original de la categoría para el Select
      const categoryId = categories.find(c => c.name === result.category)?.id || result.category;
      setFormData({ 
          ...result, 
          category: categoryId,
      });
      setEditingId(result.id);
      setShowForm(true);
  };

  const handleDelete = () => {
    if (deleteId !== null) {
      setResults(prev => prev.filter(res => res.id !== deleteId));
      toast.success("Resultado de partido eliminado.");
    }
    setDeleteId(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(initialFormState);
  };


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
            <Trophy className="h-6 w-6 mr-2 text-[#f4c11a]" />
            Registro de Resultados de Partidos
          </h2>
          <p className="text-gray-400">
            Historial de resultados de todos los partidos jugados.
          </p>
        </div>
      </div>

      {/* Formulario de Creación/Edición */}
      <Card className={`bg-[#213041] border-[#305176] transition-all duration-300 ${showForm ? 'block' : 'hidden'}`}>
        <CardHeader>
          <CardTitle className="text-white">
            {editingId ? `Editar Resultado` : "Registrar Nuevo Resultado"}
          </CardTitle>
          <p className="text-gray-400 text-sm">
            Ingresa la información del partido, el rival y el marcador final.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="space-y-2 col-span-1 md:col-span-2">
              <Label htmlFor="opponent" className="text-white">Oponente *</Label>
              <Input
                id="opponent"
                value={formData.opponent}
                onChange={(e) => setFormData({ ...formData, opponent: e.target.value })}
                className="bg-[#1d2834] border-[#305176] text-white"
                placeholder="Nombre del equipo rival"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date" className="text-white">Fecha *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="bg-[#1d2834] border-[#305176] text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tournament" className="text-white">Torneo</Label>
              <Select
                value={formData.tournament}
                onValueChange={(value) => setFormData({ ...formData, tournament: value })}
              >
                <SelectTrigger className="w-full bg-[#1d2834] border-[#305176] text-white">
                  <SelectValue placeholder="Seleccionar torneo" />
                </SelectTrigger>
                <SelectContent className="bg-[#213041] border-[#305176]">
                  {tournamentOptions.map(t => (
                    <SelectItem key={t} value={t} className="text-white">{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 items-end">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-white">Categoría *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger className="w-full bg-[#1d2834] border-[#305176] text-white">
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent className="bg-[#213041] border-[#305176]">
                  {categoryOptions.map(cat => (
                    <SelectItem key={cat.id} value={cat.id} className="text-white">{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="homeScore" className="text-white">Goles Propios</Label>
              <Input
                id="homeScore"
                type="number"
                min="0"
                value={formData.homeScore}
                onChange={(e) => setFormData({ ...formData, homeScore: parseInt(e.target.value) || 0 })}
                className="bg-[#1d2834] border-[#305176] text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="awayScore" className="text-white">Goles Rival</Label>
              <Input
                id="awayScore"
                type="number"
                min="0"
                value={formData.awayScore}
                onChange={(e) => setFormData({ ...formData, awayScore: parseInt(e.target.value) || 0 })}
                className="bg-[#1d2834] border-[#305176] text-white"
              />
            </div>
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
              className="bg-[#f4c11a] text-black hover:bg-[#d9a80e]"
              onClick={handleSave}
            >
              {editingId ? "Guardar Cambios" : "Registrar Resultado"}
            </Button>
          </div>
        </CardContent>
      </Card>


      {/* Lista de Resultados */}
      <Card className="bg-[#213041] border-[#305176]">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-4 w-full">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar oponente o categoría..."
                className="pl-10 bg-[#1d2834] border-[#305176] text-white w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {isTechnician && (
                <Button
                    size="sm"
                    className="bg-[#f4c11a] text-black hover:bg-[#d9a80e] font-semibold flex-shrink-0"
                    onClick={() => {
                        handleCancel();
                        setShowForm(true);
                    }}
                >
                    <Plus className="h-4 w-4 mr-1" />
                    Registrar Partido
                </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredResults.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="border-[#305176] hover:bg-[#305176]">
                    <TableHead className="text-white">Fecha</TableHead>
                    <TableHead className="text-white">Oponente</TableHead>
                    <TableHead className="text-white">Categoría</TableHead>
                    <TableHead className="text-white text-center">Resultado</TableHead>
                    <TableHead className="text-white text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResults.map((match) => (
                    <TableRow key={match.id} className="border-[#305176] hover:bg-[#305176]/50 transition-colors">
                      <TableCell className="font-medium text-gray-300">{match.date}</TableCell>
                      <TableCell className="text-white font-semibold">{match.opponent}</TableCell>
                      <TableCell>
                          <Badge variant="secondary" className="bg-[#305176] text-gray-300">
                            {match.category}
                          </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                          <Badge className={getResultColor(match.homeScore, match.awayScore)}>
                              {match.homeScore} - {match.awayScore} ({getMatchResult(match.homeScore, match.awayScore)})
                          </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button size="icon" variant="ghost" className="text-[#33d9f6] hover:bg-[#33d9f6]/20" onClick={() => setShowDetail(match)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {isTechnician && (
                            <>
                              <Button size="icon" variant="ghost" className="text-[#f4c11a] hover:bg-[#f4c11a]/20" onClick={() => handleEdit(match)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="icon" variant="ghost" className="text-red-400 hover:bg-red-500/20" onClick={() => setDeleteId(match.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center text-gray-500 py-4">
                No hay resultados de partidos registrados.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!showDetail} onOpenChange={() => setShowDetail(null)}>
        <DialogContent className="sm:max-w-[500px] bg-[#213041] border-[#305176] text-white">
          <DialogHeader>
            <DialogTitle className="text-white text-2xl">Detalle del Partido</DialogTitle>
            <DialogDescription className="text-gray-400">
                {showDetail?.tournament} - {showDetail?.date}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="text-center mb-4">
                <h3 className="text-3xl font-bold text-white mb-2">
                    {showDetail?.category} vs {showDetail?.opponent}
                </h3>
                <Badge className={`${getResultColor(showDetail?.homeScore || 0, showDetail?.awayScore || 0)} text-lg px-4 py-1`}>
                    {showDetail?.homeScore} - {showDetail?.awayScore}
                </Badge>
            </div>

            <div className="space-y-2">
                <h4 className="text-white font-bold border-b border-[#305176] pb-1 flex items-center">
                    <Zap className="h-4 w-4 mr-2 text-[#f4c11a]" />
                    Eventos Destacados
                </h4>
                {showDetail?.events && showDetail.events.length > 0 ? (
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                        {showDetail.events.map((event, index) => (
                            <div key={index} className="flex justify-between text-sm text-gray-300 bg-[#1d2834] p-2 rounded">
                                <span>{event.player}</span>
                                <span className={`font-medium ${event.type === 'Goal' ? 'text-[#25d03f]' : 'text-[#f4c11a]'}`}>
                                    {event.type}
                                </span>
                                <span>Min {event.minute}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-sm italic">No se registraron eventos detallados.</p>
                )}
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
              ¿Estás seguro de que quieres eliminar este resultado de partido de forma permanente?
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