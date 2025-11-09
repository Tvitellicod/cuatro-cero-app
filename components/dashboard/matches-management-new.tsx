"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Calendar, Clock, Eye, Plus, Users, X, Check, BarChart3, Trash2 } from "lucide-react"
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
import { useIsMobile } from "@/hooks/use-mobile" // <-- IMPORTADO

export function MatchesManagement() {
  const isMobile = useIsMobile(); // <-- Uso del hook
  const [showStatsModal, setShowStatsModal] = useState(false)
  const [selectedMatchStats, setSelectedMatchStats] = useState<any>(null)
  const [matchToDelete, setMatchToDelete] = useState<number | null>(null)

  // Filtros
  const [filterResult, setFilterResult] = useState("all")
  const [filterLocation, setFilterLocation] = useState("all")
  const [filterTournament, setFilterTournament] = useState("all")

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
  
  // Datos de ejemplo para partidos pasados
  const [pastMatches, setPastMatches] = useState([
    {
      id: 1,
      opponent: "Boca Juniors",
      date: "12-01-2024",
      time: "18:30",
      location: "Visitante",
      tournament: "Copa Argentina",
      result: "2-1",
      status: "Victoria",
      stats: {
        goals: 2,
        assists: 1,
        yellowCards: 3,
        redCards: 0,
        fouls: 10,
        shots: 8,
        possession: "60%",
      }
    },
    {
      id: 2,
      opponent: "Racing Club",
      date: "08-01-2024",
      time: "20:00",
      location: "Local",
      tournament: "Liga Profesional",
      result: "1-1",
      status: "Empate",
      stats: {
        goals: 1,
        assists: 1,
        yellowCards: 2,
        redCards: 0,
        fouls: 15,
        shots: 5,
        possession: "55%",
      }
    },
    {
      id: 3,
      opponent: "Independiente",
      date: "05-01-2024",
      time: "16:00",
      location: "Local",
      tournament: "Liga Profesional",
      result: "3-0",
      status: "Victoria",
      stats: {
        goals: 3,
        assists: 2,
        yellowCards: 1,
        redCards: 0,
        fouls: 8,
        shots: 12,
        possession: "70%",
      }
    },
  ]);

  const tournaments = [
    { name: "Liga Profesional", matches: 8 },
    { name: "Copa Argentina", matches: 3 },
    { name: "Torneo Clausura", matches: 12 },
    { name: "Copa Libertadores", matches: 6 },
    { name: "Supercopa", matches: 2 },
  ]

  const getResultColor = (status: string) => {
    switch (status) {
      case "Victoria":
        return "bg-[#25d03f] text-black"
      case "Empate":
        return "bg-[#f4c11a] text-black"
      case "Derrota":
        return "bg-red-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const filteredMatches = pastMatches.filter((match) => {
    const matchesResult = filterResult === "all" || match.status === filterResult
    const matchesLocation = filterLocation === "all" || match.location === filterLocation
    const matchesTournament = filterTournament === "all" || match.tournament === filterTournament

    return matchesResult && matchesLocation && matchesTournament
  }).sort((a, b) => {
      const dateA = a.date.split('-').reverse().join('-');
      const dateB = b.date.split('-').reverse().join('-');
      return dateB.localeCompare(dateA);
  })
  
  const handleViewStats = (match: any) => {
    setSelectedMatchStats(match)
    setShowStatsModal(true)
  }

  const handleDeletePastMatch = () => {
    setPastMatches(pastMatches.filter(match => match.id !== matchToDelete))
    setMatchToDelete(null)
    setShowStatsModal(false)
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Partidos</h2>
        <p className="text-gray-400">Historial de partidos jugados</p>
      </div>

      <Card className="bg-[#213041] border-[#305176]">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-white">Partidos Anteriores</CardTitle>

            {/* Filtros */}
            <div className="flex flex-wrap gap-2">
              <Select value={filterResult} onValueChange={setFilterResult}>
                <SelectTrigger className="w-28 h-8 bg-[#1d2834] border-[#305176] text-white text-xs">
                  <SelectValue placeholder="Resultado" />
                </SelectTrigger>
                <SelectContent className="bg-[#213041] border-[#305176]">
                  <SelectItem value="all" className="text-white text-xs">
                    Resultado
                  </SelectItem>
                  <SelectItem value="Victoria" className="text-white text-xs">
                    Victorias
                  </SelectItem>
                  <SelectItem value="Empate" className="text-white text-xs">
                    Empates
                  </SelectItem>
                  <SelectItem value="Derrota" className="text-white text-xs">
                    Derrotas
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterLocation} onValueChange={setFilterLocation}>
                <SelectTrigger className="w-30 h-8 bg-[#1d2834] border-[#305176] text-white text-xs">
                  <SelectValue placeholder="Condición" />
                </SelectTrigger>
                <SelectContent className="bg-[#213041] border-[#305176]">
                  <SelectItem value="all" className="text-white text-xs">
                    Condición
                  </SelectItem>
                  <SelectItem value="Local" className="text-white text-xs">
                    Local
                  </SelectItem>
                  <SelectItem value="Visitante" className="text-white text-xs">
                    Visitante
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterTournament} onValueChange={setFilterTournament}>
                <SelectTrigger className="w-32 h-8 bg-[#1d2834] border-[#305176] text-white text-xs">
                  <SelectValue placeholder="Torneo" />
                </SelectTrigger>
                <SelectContent className="bg-[#213041] border-[#305176]">
                  <SelectItem value="all" className="text-white text-xs">
                    Torneo
                  </SelectItem>
                  {tournaments.map((tournament) => (
                    <SelectItem key={tournament.name} value={tournament.name} className="text-white text-xs">
                      {tournament.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMatches.length > 0 ? (
              filteredMatches.map((match) => (
                <div 
                  key={match.id} 
                  className={`p-4 bg-[#1d2834] rounded-lg ${isMobile ? 'cursor-pointer hover:bg-[#305176]' : ''}`}
                  onClick={isMobile ? () => handleViewStats(match) : undefined} // <-- Asigna el click
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-center">
                      <div className="text-white font-medium text-sm">{match.tournament}</div>
                    </div>
                    <Badge
                      className={match.location === "Local" ? "bg-[#25d03f] text-black" : "bg-[#ea3498] text-white"}
                    >
                      {match.location}
                    </Badge>
                  </div>

                  <div className="mb-3">
                    <div className="text-white font-medium text-center">VS</div>
                    <h3 className="text-white font-medium text-center">{match.opponent}</h3>
                    <div className="text-center mt-2">
                      <Badge className={getResultColor(match.status)}>{match.result}</Badge>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-400 mb-3">
                    <div className="flex items-center justify-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {match.date}
                    </div>
                    <div className="flex items-center justify-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {match.time}
                    </div>
                  </div>

                  {/* Botón VER ESTADÍSTICAS - OCULTO EN MÓVIL */}
                  <Button
                    size="sm"
                    variant="outline"
                    className={`w-full border-[#aff606] text-[#aff606] hover:bg-[#aff606] hover:text-black bg-transparent ${isMobile ? 'hidden lg:flex' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation(); // Previene el click de la fila
                      handleViewStats(match)
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Estadísticas
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center">No hay partidos anteriores.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal de Estadísticas del Partido - MODIFICADO */}
      <Dialog open={showStatsModal} onOpenChange={setShowStatsModal}>
        <DialogContent className="sm:max-w-[425px] bg-[#213041] border-[#305176] text-white">
          <DialogHeader className="text-center">
            <DialogTitle className="text-white text-2xl font-bold">Estadísticas del Partido</DialogTitle>
            <DialogDescription className="text-gray-400">
              VS {selectedMatchStats?.opponent} ({selectedMatchStats?.date})
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              {/* Resultado */}
              <div className="flex items-center justify-between p-3 bg-[#1d2834] rounded-lg">
                <span className="text-gray-400">Resultado</span>
                <Badge className={getResultColor(selectedMatchStats?.status)}>{selectedMatchStats?.result}</Badge>
              </div>
              
              {/* Tiempo Total Jugado */}
              <div className="flex items-center justify-between p-3 bg-[#1d2834] rounded-lg">
                <span className="text-gray-400">Tiempo Total Jugado</span>
                {/* Nota: Se utiliza 90 min como valor estándar para un partido completo. */}
                <span className="text-white font-bold">90 min</span> 
              </div>

              {/* Tiros al Arco */}
              <div className="flex items-center justify-between p-3 bg-[#1d2834] rounded-lg">
                <span className="text-gray-400">Tiros al Arco</span>
                <span className="text-white font-bold">{selectedMatchStats?.stats?.shots || 0}</span>
              </div>
              
              {/* Tarjetas Amarillas */}
              <div className="flex items-center justify-between p-3 bg-[#1d2834] rounded-lg">
                <span className="text-gray-400">Tarjetas Amarillas</span>
                <span className="text-white font-bold">{selectedMatchStats?.stats?.yellowCards || 0}</span>
              </div>
            </div>
          </div>
          <div className="flex justify-between space-x-4">
            <Link href="/dashboard/estadisticas" className="flex-1">
              <Button className="w-full bg-[#aff606] text-black hover:bg-[#25d03f]">
                <BarChart3 className="h-4 w-4 mr-2" />
                Ver todas las estadísticas
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-400 hover:bg-red-500/20 hover:text-red-300"
              onClick={() => {
                setShowStatsModal(false)
                setMatchToDelete(selectedMatchStats?.id)
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
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
              onClick={handleDeletePastMatch}
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