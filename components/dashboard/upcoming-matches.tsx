"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Calendar, Clock, Eye, Plus, Users, X, Check, Trash2, Play } from "lucide-react"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function UpcomingMatches() {
  const [showScheduleForm, setShowScheduleForm] = useState(false)
  const [showPlayerSelection, setShowPlayerSelection] = useState(false)
  const [selectedPlayers, setSelectedPlayers] = useState<number[]>([])
  const [selectedCategory, setSelectedCategory] = useState("primera")
  const [showValidationAlert, setShowValidationAlert] = useState(false)
  const [matchToDelete, setMatchToDelete] = useState<number | null>(null)
  const [showMatchDetail, setShowMatchDetail] = useState<any>(null)

  // Lista de partidos próximos con datos de ejemplo
  const [upcomingMatches, setUpcomingMatches] = useState([
    {
      id: 1,
      opponent: "Club Atlético River",
      date: "15-09-2025",
      time: "16:00",
      location: "Local",
      tournament: "Liga Profesional",
      category: "Primera División",
      status: "Próximamente",
    },
    {
      id: 2,
      opponent: "Boca Juniors",
      date: "22-09-2025",
      time: "18:30",
      location: "Visitante",
      tournament: "Copa Argentina",
      category: "Primera División",
      status: "Próximamente",
    },
  ]);

  // Estado para el formulario de nuevo partido
  const [newMatch, setNewMatch] = useState({
    opponent: "",
    tournament: "",
    location: "",
    category: "",
    date: "",
    time: "",
  });

  // Hardcoded categories and players for demo purposes
  const categories = [
    { id: "primera", name: "Primera División" },
    { id: "tercera", name: "Tercera División" },
    { id: "juveniles", name: "Juveniles" },
    { id: "cuarta", name: "Cuarta División" },
    { id: "quinta", name: "Quinta División" },
    { id: "sexta", name: "Sexta División" },
    { id: "septima", name: "Séptima División" },
    { id: "infantiles", name: "Infantiles" },
  ]
  
  const allPlayers = [
    { id: 1, name: "Juan García", category: "primera", position: "Arquero", status: "DISPONIBLE" },
    { id: 2, name: "Carlos Rodríguez", category: "primera", position: "Defensor", status: "DISPONIBLE" },
    { id: 3, name: "Miguel González", category: "primera", position: "Mediocampista", status: "DISPONIBLE" },
    { id: 4, name: "Roberto Fernández", category: "primera", position: "Delantero", status: "DISPONIBLE" },
    { id: 5, name: "Diego López", category: "primera", position: "Defensor", status: "DISPONIBLE" },
    { id: 6, name: "Fernando Martínez", category: "primera", position: "Mediocampista", status: "DISPONIBLE" },
    { id: 7, name: "Alejandro Sánchez", category: "tercera", position: "Delantero", status: "DISPONIBLE" },
    { id: 8, name: "Sebastián Pérez", category: "tercera", position: "Arquero", status: "LESIONADO" },
    { id: 9, name: "Martín Gómez", category: "tercera", position: "Defensor", status: "DISPONIBLE" },
    { id: 10, name: "Pablo Martín", category: "tercera", position: "Mediocampista", status: "DISPONIBLE" },
    { id: 11, name: "Gonzalo Jiménez", category: "juveniles", position: "Delantero", status: "DISPONIBLE" },
    { id: 12, name: "Nicolás Ruiz", category: "juveniles", position: "Arquero", status: "DISPONIBLE" },
    { id: 13, name: "Facundo Hernández", category: "juveniles", position: "Defensor", status: "DISPONIBLE" },
    { id: 14, name: "Matías Díaz", category: "juveniles", position: "Mediocampista", status: "DISPONIBLE" },
    { id: 15, name: "Lucas Moreno", category: "juveniles", position: "Delantero", status: "DISPONIBLE" },
    { id: 16, name: "Tomás Muñoz", category: "cuarta", position: "Defensor", status: "DISPONIBLE" },
    { id: 17, name: "Agustín Álvarez", category: "cuarta", position: "Mediocampista", status: "LESIONADO" },
  ];

  const availablePlayers = allPlayers.filter(p => p.category === selectedCategory && p.status === "DISPONIBLE")

  const tournaments = [
    { name: "Liga Profesional", matches: 8 },
    { name: "Copa Argentina", matches: 3 },
    { name: "Torneo Clausura", matches: 12 },
    { name: "Copa Libertadores", matches: 6 },
    { name: "Supercopa", matches: 2 },
  ]
  
  const handlePlayerToggle = (playerId: number) => {
    setSelectedPlayers((prev) => (prev.includes(playerId) ? prev.filter((id) => id !== playerId) : [...prev, playerId]))
  }

  const handleSaveMatch = () => {
    if (!newMatch.opponent || !newMatch.tournament || !newMatch.location || !newMatch.category || !newMatch.date || !newMatch.time) {
      setShowValidationAlert(true);
      return;
    }
    
    const newMatchData = {
        id: upcomingMatches.length + 1,
        opponent: newMatch.opponent,
        date: newMatch.date,
        time: newMatch.time,
        location: newMatch.location,
        tournament: newMatch.tournament,
        category: categories.find(c => c.id === newMatch.category)?.name || "",
        status: "Próximamente",
    };

    setUpcomingMatches(prevMatches => [...prevMatches, newMatchData]);

    // Resetear el formulario
    setNewMatch({
      opponent: "",
      tournament: "",
      location: "",
      category: "",
      date: "",
      time: "",
    });
    setSelectedPlayers([]);
    setShowScheduleForm(false);
  }

  const handleDeleteMatch = () => {
    if (matchToDelete !== null) {
      setUpcomingMatches(prevMatches => prevMatches.filter(match => match.id !== matchToDelete));
      setMatchToDelete(null);
    }
  }

  const handleViewDetails = (match: any) => {
    setShowMatchDetail(match)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Próximos Partidos</h2>
          <p className="text-gray-400">Gestiona los próximos encuentros y acciones de juego</p>
        </div>
        {!showScheduleForm && (
          <Button className="bg-[#aff606] text-black hover:bg-[#25d03f]" onClick={() => setShowScheduleForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Agendar Próximo Partido
          </Button>
        )}
      </div>

      {/* Player Selection Modal */}
      {showPlayerSelection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="bg-[#213041] border-[#305176] w-full max-w-2xl max-h-[90vh] overflow-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">Seleccionar Jugadores</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-red-400"
                onClick={() => setShowPlayerSelection(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-gray-400">Seleccionados: {selectedPlayers.length}/{availablePlayers.length} jugadores</div>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {availablePlayers.length > 0 ? (
                    availablePlayers.map((player) => (
                      <div
                        key={player.id}
                        className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedPlayers.includes(player.id)
                            ? "bg-[#aff606]/20 border border-[#aff606]"
                            : "bg-[#1d2834] hover:bg-[#305176]"
                        }`}
                        onClick={() => handlePlayerToggle(player.id)}
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              selectedPlayers.includes(player.id) ? "border-[#aff606] bg-[#aff606]" : "border-gray-400"
                            }`}
                          >
                            {selectedPlayers.includes(player.id) && <Check className="h-3 w-3 text-black" />}
                          </div>
                          <div>
                            <span className="text-white font-medium">{player.name}</span>
                            <p className="text-gray-400 text-sm">{player.position}</p>
                          </div>
                        </div>
                        <Badge className="bg-[#25d03f] text-black">{player.status}</Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-400">No hay jugadores disponibles en esta categoría.</p>
                  )}
                </div>
                <div className="flex justify-end space-x-4">
                  <Button
                    variant="outline"
                    className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white bg-transparent"
                    onClick={() => setShowPlayerSelection(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    className="bg-[#aff606] text-black hover:bg-[#25d03f]"
                    onClick={() => setShowPlayerSelection(false)}
                  >
                    Confirmar Selección
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Schedule Form */}
      {showScheduleForm && (
        <Card className="bg-[#213041] border-[#305176]">
          <CardHeader>
            <CardTitle className="text-white">Agendar Nuevo Partido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-white text-sm">Rival</label>
                <Input 
                  placeholder="Nombre del equipo rival" 
                  className="bg-[#1d2834] border-[#305176] text-white" 
                  value={newMatch.opponent}
                  onChange={(e) => setNewMatch({...newMatch, opponent: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-white text-sm">Torneo</label>
                <Select
                  value={newMatch.tournament}
                  onValueChange={(value) => setNewMatch({...newMatch, tournament: value})}
                >
                  <SelectTrigger className="bg-[#1d2834] border-[#305176] text-white">
                    <SelectValue placeholder="Seleccionar torneo" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#213041] border-[#305176]">
                    {tournaments.map((tournament) => (
                      <SelectItem key={tournament.name} value={tournament.name} className="text-white">
                        {tournament.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Nuevo bloque para los 4 campos en una misma fila */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-white text-sm">Condición</label>
                <Select
                  value={newMatch.location}
                  onValueChange={(value) => setNewMatch({...newMatch, location: value})}
                >
                  <SelectTrigger className="bg-[#1d2834] border-[#305176] text-white">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#213041] border-[#305176]">
                    <SelectItem value="Local" className="text-white">
                      Local
                    </SelectItem>
                    <SelectItem value="Visitante" className="text-white">
                      Visitante
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-white text-sm">Categoría</label>
                <Select value={newMatch.category} onValueChange={(value) => {
                  setNewMatch({...newMatch, category: value});
                  setSelectedCategory(value);
                  setSelectedPlayers([]);
                }}>
                  <SelectTrigger className="bg-[#1d2834] border-[#305176] text-white">
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#213041] border-[#305176]">
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id} className="text-white">
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-white text-sm">Fecha</label>
                <Input 
                  type="date" 
                  className="bg-[#1d2834] border-[#305176] text-white w-full" 
                  value={newMatch.date}
                  onChange={(e) => setNewMatch({...newMatch, date: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-white text-sm">Hora</label>
                <Input 
                  type="time" 
                  className="bg-[#1d2834] border-[#305176] text-white w-full" 
                  value={newMatch.time}
                  onChange={(e) => setNewMatch({...newMatch, time: e.target.value})}
                />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <Button
                className="bg-[#33d9f6] text-black hover:bg-[#2bc4ea]"
                onClick={() => setShowPlayerSelection(true)}
              >
                <Users className="h-4 w-4 mr-2" />
                Seleccionar Jugadores ({selectedPlayers.length})
              </Button>
              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white bg-transparent"
                  onClick={() => setShowScheduleForm(false)}
                >
                  Cancelar
                </Button>
                <Button className="bg-[#aff606] text-black hover:bg-[#25d03f]" onClick={handleSaveMatch}>Agendar Partido</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Matches */}
      <Card className="bg-[#213041] border-[#305176]">
        <CardHeader>
          <CardTitle className="text-white">Partidos Programados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingMatches.length > 0 ? (
              upcomingMatches.map((match) => (
                <div key={match.id} className="p-4 bg-[#1d2834] rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="text-white font-bold text-lg">VS</div>
                        <div className="text-xs text-gray-400">{match.category}</div>
                      </div>
                      <div>
                        <h3 className="text-white font-medium">{match.opponent}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {match.date}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {match.time}
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {selectedPlayers.length} jugadores citados
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{match.tournament}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge
                        variant={match.status === "En Vivo" ? "destructive" : "default"}
                        className={
                          match.status === "En Vivo"
                            ? "bg-red-500 text-white"
                            : match.location === "Local"
                              ? "bg-[#25d03f] text-black"
                              : "bg-[#ea3498] text-white"
                        }
                      >
                        {match.status === "En Vivo" ? "EN VIVO" : match.location}
                      </Badge>
                      {match.status === "En Vivo" ? (
                        <Button size="sm" className="bg-red-500 text-white hover:bg-red-600">
                          <Play className="h-4 w-4 mr-2" />
                          Acciones de Juego
                        </Button>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-[#aff606] text-[#aff606] hover:bg-[#aff606] hover:text-black bg-transparent"
                            onClick={() => handleViewDetails(match)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalles
                          </Button>
                           <Button
                            size="sm"
                            variant="ghost"
                            className="text-white hover:text-red-400"
                            onClick={() => setMatchToDelete(match.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center">No hay partidos próximos. Agenda uno para empezar.</p>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Modal de Detalles del Partido */}
      <Dialog open={!!showMatchDetail} onOpenChange={() => setShowMatchDetail(null)}>
        <DialogContent className="sm:max-w-[425px] bg-[#213041] border-[#305176] text-white">
          <DialogHeader className="text-center">
            <DialogTitle className="text-white text-2xl font-bold">Detalles del Partido</DialogTitle>
            <DialogDescription className="text-gray-400">
              VS {showMatchDetail?.opponent}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-white text-sm">Torneo</label>
              <Input value={showMatchDetail?.tournament} readOnly className="bg-[#1d2834] border-[#305176] text-white" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-white text-sm">Condición</label>
                <Input value={showMatchDetail?.location} readOnly className="bg-[#1d2834] border-[#305176] text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-white text-sm">Categoría</label>
                <Input value={showMatchDetail?.category} readOnly className="bg-[#1d2834] border-[#305176] text-white" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-white text-sm">Fecha</label>
                <Input value={showMatchDetail?.date} readOnly className="bg-[#1d2834] border-[#305176] text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-white text-sm">Hora</label>
                <Input value={showMatchDetail?.time} readOnly className="bg-[#1d2834] border-[#305176] text-white" />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Alert Dialog for Form Validation */}
      <AlertDialog open={showValidationAlert} onOpenChange={setShowValidationAlert}>
        <AlertDialogContent className="bg-[#213041] border-[#305176]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Campos Incompletos</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Por favor, completa todos los campos del formulario antes de agendar un partido.
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

      {/* AlertDialog for Delete Confirmation */}
      <AlertDialog open={matchToDelete !== null} onOpenChange={() => setMatchToDelete(null)}>
        <AlertDialogContent className="bg-[#213041] border-[#305176]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Confirmar Eliminación</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              ¿Estás seguro de que quieres eliminar este partido de forma permanente? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-[#305176] text-white hover:bg-[#305176]">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteMatch}
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