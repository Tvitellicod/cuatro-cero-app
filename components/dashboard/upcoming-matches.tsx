// components/dashboard/upcoming-matches.tsx

"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Trophy, Clock, Calendar, MapPin, Edit, Trash2, Eye, Plus, Search } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { format } from "date-fns"
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
interface UpcomingMatch {
  id: number
  opponent: string
  date: string // YYYY-MM-DD
  time: string // HH:MM
  category: string
  tournament: string
  location: string
  isHome: boolean
}

// ESTADO INICIAL LIMPIO DE PRÓXIMOS PARTIDOS
const initialUpcomingMatches: UpcomingMatch[] = [];

// Estado inicial del formulario
const initialFormState = {
    opponent: "",
    date: format(new Date(), 'yyyy-MM-dd'),
    time: "17:00",
    category: "", // Se llenará con la primera categoría real
    tournament: "Liga Local",
    location: "Estadio Propio",
    isHome: true,
};


export function UpcomingMatches() {
  const { profile, categories } = useProfile();
  const [matches, setMatches] = useState<UpcomingMatch[]>(initialUpcomingMatches);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const isTechnician = profile?.role === "DIRECTOR TECNICO";
  const tournamentOptions = ["Liga Local", "Copa Regional", "Amistoso"];
  
  // Categorías reales del contexto
  const categoryOptions = categories.map(c => ({ id: c.id, name: c.name }));
  const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || "N/A";

  // Inicializar formData con la primera categoría si existe
  useState(() => {
    if (categories.length > 0 && formData.category === "") {
        setFormData(prev => ({ ...prev, category: categories[0].id }));
    }
  });


  // Filtros
  const filteredMatches = useMemo(() => {
    let filtered = matches.filter(match =>
      match.opponent.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    // Ordenar por fecha ascendente
    return filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [matches, searchTerm]);


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
    const newMatch = {
        ...formData,
        category: categoryName,
        opponent: formData.opponent.trim(),
    };

    if (editingId !== null) {
      // Editar
      setMatches(prev => prev.map(m => m.id === editingId ? { ...m, ...newMatch } : m as UpcomingMatch));
      toast.success(`Partido vs ${newMatch.opponent} actualizado.`);
    } else {
      // Crear nuevo
      const matchWithId: UpcomingMatch = {
        ...newMatch,
        id: Date.now(),
      } as UpcomingMatch;
      setMatches(prev => [...prev, matchWithId]);
      toast.success(`Partido vs ${matchWithId.opponent} programado.`);
    }

    handleCancel();
  };

  const handleEdit = (match: UpcomingMatch) => {
      // Necesitamos el ID original de la categoría para el Select
      const categoryId = categories.find(c => c.name === match.category)?.id || match.category;
      setFormData({ 
          ...match, 
          category: categoryId,
      });
      setEditingId(match.id);
      setShowForm(true);
  };

  const handleDelete = () => {
    if (deleteId !== null) {
      setMatches(prev => prev.filter(m => m.id !== deleteId));
      toast.success("Partido eliminado del calendario.");
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
            <Calendar className="h-6 w-6 mr-2 text-[#33d9f6]" />
            Próximos Partidos
          </h2>
          <p className="text-gray-400">
            Agenda y detalles de los encuentros venideros.
          </p>
        </div>
      </div>

      {/* Formulario de Creación/Edición */}
      <Card className={`bg-[#213041] border-[#305176] transition-all duration-300 ${showForm ? 'block' : 'hidden'}`}>
        <CardHeader>
          <CardTitle className="text-white">
            {editingId ? `Editar Partido vs ${formData.opponent}` : "Programar Nuevo Partido"}
          </CardTitle>
          <p className="text-gray-400 text-sm">
            Ingresa los detalles del próximo encuentro.
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
              <Label htmlFor="time" className="text-white">Hora *</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="bg-[#1d2834] border-[#305176] text-white"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
            <div className="space-y-2">
              <Label htmlFor="location" className="text-white">Ubicación</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="bg-[#1d2834] border-[#305176] text-white"
                placeholder="Estadio o Campo de juego"
              />
            </div>
            <div className="space-y-2">
                <Label htmlFor="isHome" className="text-white">Condición</Label>
                <Select
                    value={formData.isHome ? "home" : "away"}
                    onValueChange={(value) => setFormData({ ...formData, isHome: value === "home" })}
                >
                    <SelectTrigger className="w-full bg-[#1d2834] border-[#305176] text-white">
                        <SelectValue placeholder="Condición" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#213041] border-[#305176]">
                        <SelectItem value="home" className="text-white">Local</SelectItem>
                        <SelectItem value="away" className="text-white">Visitante</SelectItem>
                    </SelectContent>
                </Select>
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
              className="bg-[#33d9f6] text-black hover:bg-[#2bc4ea]"
              onClick={handleSave}
            >
              {editingId ? "Guardar Cambios" : "Programar Partido"}
            </Button>
          </div>
        </CardContent>
      </Card>


      {/* Lista de Partidos */}
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
                    className="bg-[#33d9f6] text-black hover:bg-[#2bc4ea] font-semibold flex-shrink-0"
                    onClick={() => {
                        handleCancel();
                        setShowForm(true);
                    }}
                >
                    <Plus className="h-4 w-4 mr-1" />
                    Programar Partido
                </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredMatches.length > 0 ? (
              filteredMatches.map((match) => (
                <div
                  key={match.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-[#1d2834] rounded-lg border-l-4 border-[#33d9f6]"
                >
                  <div className="flex-1 space-y-1 sm:space-y-0 sm:flex sm:items-center sm:space-x-4">
                    <div className="text-center flex-shrink-0 w-20">
                        <p className="text-xs text-gray-400">{format(new Date(match.date), 'dd/MM/yyyy')}</p>
                        <p className="text-white font-bold">{match.time}</p>
                    </div>
                    <div>
                      <h3 className="text-white font-bold">vs {match.opponent}</h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <Badge variant="secondary" className="bg-[#305176] text-gray-300">
                          {match.category}
                        </Badge>
                        <Badge className={match.isHome ? 'bg-[#aff606] text-black' : 'bg-[#f4c11a] text-black'}>
                          {match.isHome ? 'LOCAL' : 'VISITANTE'}
                        </Badge>
                        <span className="text-sm text-gray-400 font-medium">({match.tournament})</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mt-3 sm:mt-0">
                    <div className="flex items-center space-x-2 text-gray-400 text-sm">
                        <MapPin className="h-4 w-4" />
                        <span>{match.location}</span>
                    </div>
                    {isTechnician && (
                      <>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-[#f4c11a] hover:bg-[#f4c11a]/20"
                          onClick={() => handleEdit(match)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-red-400 hover:bg-red-500/20"
                          onClick={() => setDeleteId(match.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">
                No hay partidos programados.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Alert Dialog for Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-[#213041] border-[#305176]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Confirmar Eliminación</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              ¿Estás seguro de que quieres eliminar este partido del calendario de forma permanente?
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