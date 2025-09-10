"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, Trophy, TrendingUp, Activity, Target, Plus, X } from "lucide-react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function TournamentsOverview() {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showTournamentStats, setShowTournamentStats] = useState<any>(null)
  const [newTournamentName, setNewTournamentName] = useState("")
  const [newTournamentColor, setNewTournamentColor] = useState("#aff606")

  const today = new Date()
  const nextMatch = new Date(today)
  nextMatch.setDate(nextMatch.getDate() + 2)

  const upcomingMatch = {
    id: 1,
    opponent: "Club Atlético River",
    date: nextMatch.toISOString().split("T")[0],
    time: "16:00",
    location: "Local",
    tournament: "Liga Profesional",
    category: "Primera División",
  }

  const lastMatchStats = {
    opponent: "Boca Juniors",
    date: "2024-01-12",
    result: "2-1",
    location: "Visitante",
    tournament: "Copa Argentina",
    performance: "Victoria",
  }

  const monthlyStats = {
    matches: 4,
    wins: 3,
    draws: 1,
    losses: 0,
    goalsFor: 8,
    goalsAgainst: 3,
    winPercentage: 75,
  }

  const [tournaments, setTournaments] = useState([
    { name: "Liga Profesional", matches: 8, color: "#f4c11a", wins: 5, draws: 2, losses: 1, goalsFor: 15, goalsAgainst: 8 },
    { name: "Copa Argentina", matches: 3, color: "#33d9f6", wins: 2, draws: 1, losses: 0, goalsFor: 6, goalsAgainst: 3 },
    { name: "Torneo Clausura", matches: 12, color: "#ea3498", wins: 9, draws: 3, losses: 0, goalsFor: 25, goalsAgainst: 10 },
  ])

  const allColorOptions = [
    "#aff606", "#f4c11a", "#33d9f6", "#ea3498", "#25d03f", "#8a46c5",
    "#ff6b35", "#4ecdc4", "#45b7d1", "#96ceb4", "#609966", "#c37a6b",
    "#77c4e4", "#f1a85f", "#d64b5e", "#6d89ff", "#ff8a65", "#b478d1",
    "#e69138", "#4e7c8e",
  ];

  const assignedColors = tournaments.map(t => t.color);
  const availableColors = allColorOptions.filter(color => !assignedColors.includes(color));

  const handleCreateTournament = () => {
    if (newTournamentName.trim()) {
      setTournaments([
        ...tournaments,
        { name: newTournamentName, matches: 0, color: newTournamentColor, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0 }
      ])
      setNewTournamentName("")
      setShowCreateForm(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Torneos</h2>
        <p className="text-gray-400">Gestión de partidos y torneos</p>
      </div>

      {/* Próximo Partido */}
      <Card className="bg-[#213041] border-[#305176]">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Trophy className="h-5 w-5 mr-2 text-[#f4c11a]" />
            Próximo Partido
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-[#1d2834] rounded-lg p-4">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-white font-semibold text-lg">VS {upcomingMatch.opponent}</h3>
                <p className="text-gray-400">{upcomingMatch.tournament}</p>
              </div>
              <Badge
                className={upcomingMatch.location === "Local" ? "bg-[#25d03f] text-black" : "bg-[#ea3498] text-white"}
              >
                {upcomingMatch.location}
              </Badge>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center text-gray-300">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="text-sm">{upcomingMatch.date}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Clock className="h-4 w-4 mr-2" />
                  <span className="text-sm">{upcomingMatch.time}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span className="text-sm">{upcomingMatch.location}</span>
                </div>
              </div>
              <Link href="/dashboard/torneos/proximos">
                <Button className="bg-[#aff606] text-black hover:bg-[#25d03f] w-full sm:w-auto mt-2 sm:mt-0">Ver Próximo Partido</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas de Partidos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-[#213041] border-[#305176]">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Activity className="h-5 w-5 mr-2 text-[#33d9f6]" />
              Último Partido
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-white font-medium">VS {lastMatchStats.opponent}</p>
              <p className="text-gray-400 text-sm">{lastMatchStats.date}</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Resultado:</span>
                <span className="text-[#25d03f] text-sm font-bold">{lastMatchStats.result}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Condición:</span>
                <span className="text-white text-sm">{lastMatchStats.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Torneo:</span>
                <span className="text-white text-sm">{lastMatchStats.tournament}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Resultado:</span>
                <Badge className="bg-[#25d03f] text-black">{lastMatchStats.performance}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#213041] border-[#305176]">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-[#f4c11a]" />
              Último Mes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Partidos:</span>
                <span className="text-white text-sm font-bold">{monthlyStats.matches}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Victorias:</span>
                <span className="text-[#25d03f] text-sm font-bold">{monthlyStats.wins}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Empates:</span>
                <span className="text-[#f4c11a] text-sm font-bold">{monthlyStats.draws}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Derrotas:</span>
                <span className="text-red-400 text-sm font-bold">{monthlyStats.losses}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Efectividad:</span>
                <span className="text-[#aff606] text-sm font-bold">{monthlyStats.winPercentage}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#213041] border-[#305176]">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Target className="h-5 w-5 mr-2 text-[#ea3498]" />
              Estadísticas de Gol
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Goles a favor:</span>
                <span className="text-[#25d03f] text-sm font-bold">{monthlyStats.goalsFor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Goles en contra:</span>
                <span className="text-red-400 text-sm font-bold">{monthlyStats.goalsAgainst}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Diferencia:</span>
                <span className="text-[#aff606] text-sm font-bold">
                  +{monthlyStats.goalsFor - monthlyStats.goalsAgainst}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Promedio goles/partido:</span>
                <span className="text-white text-sm font-bold">
                  {(monthlyStats.goalsFor / monthlyStats.matches).toFixed(1)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Torneos Activos */}
      <Card className="bg-[#213041] border-[#305176]">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-white">Torneos Activos</CardTitle>
          <Button
            size="sm"
            className="bg-[#aff606] text-black hover:bg-[#25d03f]"
            onClick={() => setShowCreateForm(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Crear Nuevo Torneo
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {tournaments.map((tournament, index) => (
              <div 
                key={index} 
                className="p-4 bg-[#1d2834] rounded-lg border-2 cursor-pointer hover:opacity-80 transition-opacity"
                style={{ borderColor: tournament.color }}
                onClick={() => setShowTournamentStats(tournament)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-medium">{tournament.name}</h3>
                </div>
                <p className="text-gray-400 text-sm">{tournament.matches} partidos jugados</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Diálogo para crear un nuevo torneo */}
      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogContent className="sm:max-w-[425px] bg-[#213041] border-[#305176] text-white">
          <DialogHeader className="text-center">
            <DialogTitle className="text-white text-2xl font-bold">
              Crear Nuevo Torneo
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Ingresa los detalles para un nuevo torneo.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="tournament-name" className="text-white">
                Nombre del Torneo
              </Label>
              <Input
                id="tournament-name"
                placeholder="Ej: Copa Apertura"
                value={newTournamentName}
                onChange={(e) => setNewTournamentName(e.target.value)}
                className="bg-[#1d2834] border-[#305176] text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Color Representativo</Label>
              <div className="flex flex-wrap gap-2">
                {availableColors.map((color) => (
                  <button
                    key={color}
                    className={`w-6 h-6 rounded-full border-2 ${
                      newTournamentColor === color ? "border-white" : "border-gray-500"
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setNewTournamentColor(color)}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white bg-transparent"
              onClick={() => {
                setShowCreateForm(false);
                setNewTournamentName("");
              }}
            >
              Cancelar
            </Button>
            <Button
              className="bg-[#aff606] text-black hover:bg-[#25d03f]"
              onClick={handleCreateTournament}
            >
              Crear Torneo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de Estadísticas del Torneo */}
      <Dialog open={!!showTournamentStats} onOpenChange={() => setShowTournamentStats(null)}>
        <DialogContent className="sm:max-w-[500px] bg-[#213041] border-[#305176] text-white">
          <DialogHeader className="text-center">
            <DialogTitle className="text-white text-2xl font-bold">
              Estadísticas: {showTournamentStats?.name}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Análisis de rendimiento en el torneo seleccionado.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-[#1d2834] rounded-lg">
                <span className="text-gray-400">Partidos jugados</span>
                <span className="text-white font-bold">{showTournamentStats?.matches}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#1d2834] rounded-lg">
                <span className="text-gray-400">Victorias</span>
                <span className="text-[#25d03f] font-bold">{showTournamentStats?.wins}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#1d2834] rounded-lg">
                <span className="text-gray-400">Empates</span>
                <span className="text-[#f4c11a] font-bold">{showTournamentStats?.draws}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#1d2834] rounded-lg">
                <span className="text-gray-400">Derrotas</span>
                <span className="text-red-400 font-bold">{showTournamentStats?.losses}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#1d2834] rounded-lg">
                <span className="text-gray-400">Goles a favor</span>
                <span className="text-[#aff606] font-bold">{showTournamentStats?.goalsFor}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#1d2834] rounded-lg">
                <span className="text-gray-400">Goles en contra</span>
                <span className="text-red-400 font-bold">{showTournamentStats?.goalsAgainst}</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Link href="/dashboard/estadisticas" className="w-full">
              <Button
                className="bg-[#aff606] text-black hover:bg-[#25d03f] w-full"
                onClick={() => setShowTournamentStats(null)}
              >
                Ver más estadísticas
              </Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}