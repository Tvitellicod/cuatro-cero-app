"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, Users, Target, Eye, Calendar, Clock, Trophy, Dumbbell, Filter } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function StatisticsSection() {
  const [showMatchDetailModal, setShowMatchDetailModal] = useState<any>(null)
  const [showPlayerDetailModal, setShowPlayerDetailModal] = useState<any>(null)
  const [showAllMatchesModal, setShowAllMatchesModal] = useState(false);
  const [showAllPlayersModal, setShowAllPlayersModal] = useState(false);
  const [filterResult, setFilterResult] = useState("all");
  const [filterLocation, setFilterLocation] = useState("all");
  const [filterTournament, setFilterTournament] = useState("all");

  const generalStats = [
    {
      title: "Total Partidos",
      value: "24",
      icon: Trophy,
      color: "text-[#aff606]",
      change: "+3 este mes",
    },
    {
      title: "Victorias",
      value: "16",
      icon: TrendingUp,
      color: "text-[#25d03f]",
      change: "66.7% efectividad",
    },
    {
      title: "Goles Anotados",
      value: "45",
      icon: Target,
      color: "text-[#f4c11a]",
      change: "1.9 promedio/partido",
    },
    {
      title: "Jugadores Activos",
      value: "28",
      icon: Users,
      color: "text-[#33d9f6]",
      change: "3 categorías",
    },
  ]

  const matches = [
    {
      id: 1,
      opponent: "Boca Juniors",
      date: "12/01/2024",
      time: "18:30",
      location: "Visitante",
      tournament: "Copa Argentina",
      result: "2-1",
      status: "Victoria",
      stats: {
        goalsFor: 2,
        goalsAgainst: 1,
        possession: "60%",
        shotsOnTarget: 5,
        totalShots: 8,
        foulsCommitted: 10,
        foulsReceived: 8,
        yellowCards: 3,
        redCards: 0,
        recuperoPelota: 50,
        perdioPelota: 30,
      },
      duration: 90, // Agregado para el tiempo jugado total
      playerStats: [
        { id: 1, name: "Juan C. Pérez", goals: 2, assists: 1, yellowCards: 1, redCards: 0, minutes: 90, shots: 5, foulsReceived: 3 },
        { id: 2, name: "Miguel A. González", goals: 0, assists: 1, yellowCards: 1, redCards: 0, minutes: 90, shots: 2, foulsReceived: 5 },
        { id: 3, name: "Roberto Silva", goals: 0, assists: 0, yellowCards: 1, redCards: 0, minutes: 75, shots: 0, foulsReceived: 2 },
      ],
    },
    {
      id: 2,
      opponent: "Racing Club",
      date: "08/01/2024",
      time: "20:00",
      location: "Local",
      tournament: "Liga Profesional",
      result: "1-1",
      status: "Empate",
      stats: {
        goalsFor: 1,
        goalsAgainst: 1,
        possession: "55%",
        shotsOnTarget: 3,
        totalShots: 5,
        foulsCommitted: 15,
        foulsReceived: 12,
        yellowCards: 2,
        redCards: 0,
        recuperoPelota: 45,
        perdioPelota: 40,
      },
      duration: 90, // Agregado para el tiempo jugado total
      playerStats: [
        { id: 1, name: "Juan C. Pérez", goals: 1, assists: 0, yellowCards: 0, redCards: 0, minutes: 90, shots: 3, foulsReceived: 4 },
        { id: 2, name: "Miguel A. González", goals: 0, assists: 1, yellowCards: 0, redCards: 0, minutes: 90, shots: 1, foulsReceived: 2 },
        { id: 3, name: "Roberto Silva", goals: 0, assists: 0, yellowCards: 1, redCards: 0, minutes: 90, shots: 0, foulsReceived: 1 },
      ],
    },
    {
      id: 3,
      opponent: "Independiente",
      date: "05/01/2024",
      time: "16:00",
      location: "Local",
      tournament: "Liga Profesional",
      result: "3-0",
      status: "Victoria",
      stats: {
        goalsFor: 3,
        goalsAgainst: 0,
        possession: "70%",
        shotsOnTarget: 8,
        totalShots: 12,
        foulsCommitted: 8,
        foulsReceived: 5,
        yellowCards: 1,
        redCards: 0,
        recuperoPelota: 60,
        perdioPelota: 25,
      },
      duration: 90, // Agregado para el tiempo jugado total
      playerStats: [
        { id: 1, name: "Juan C. Pérez", goals: 1, assists: 1, yellowCards: 0, redCards: 0, minutes: 90, shots: 4, foulsReceived: 1 },
        { id: 2, name: "Miguel A. González", goals: 1, assists: 1, yellowCards: 0, redCards: 0, minutes: 90, shots: 3, foulsReceived: 2 },
        { id: 3, name: "Roberto Silva", goals: 1, assists: 0, yellowCards: 0, redCards: 0, minutes: 90, shots: 1, foulsReceived: 1 },
      ],
    },
    {
      id: 4,
      opponent: "River Plate",
      date: "02/01/2024",
      time: "19:00",
      location: "Visitante",
      tournament: "Liga Profesional",
      result: "0-2",
      status: "Derrota",
      stats: {
        goalsFor: 0,
        goalsAgainst: 2,
        possession: "40%",
        shotsOnTarget: 2,
        totalShots: 6,
        foulsCommitted: 12,
        foulsReceived: 18,
        yellowCards: 4,
        redCards: 1,
        recuperoPelota: 35,
        perdioPelota: 50,
      },
      duration: 90, // Agregado para el tiempo jugado total
      playerStats: [
        { id: 1, name: "Juan C. Pérez", goals: 0, assists: 0, yellowCards: 1, redCards: 0, minutes: 90, shots: 2, foulsReceived: 8 },
        { id: 2, name: "Miguel A. González", goals: 0, assists: 0, yellowCards: 1, redCards: 0, minutes: 90, shots: 1, foulsReceived: 5 },
        { id: 3, name: "Roberto Silva", goals: 0, assists: 0, yellowCards: 1, redCards: 1, minutes: 60, shots: 0, foulsReceived: 3 },
      ],
    },
  ]
  
  // Lista de posiciones de ClubManagement.tsx: ["Arquero", "Ultimo", "Ala", "Pivot"]
  // Actualización del mock para ser consistente con ClubManagement
  const players = [
    {
      id: 1,
      name: "Juan Carlos Pérez",
      position: "Pivot", // Corregido a Pivot
      photo: "/placeholder-user.jpg",
      nickname: "Pipa", 
      foot: "Derecho", 
      generalStats: {
        matches: 18,
        goals: 12,
        assists: 5,
        yellowCards: 2,
        redCards: 0,
        minutesPlayed: 1500,
        recuperoPelota: 80,
        perdioPelota: 55,
        remate: 65,
        remateAlArco: 30,
        faltaCometida: 15,
        faltaRecibida: 25,
      },
      matchHistory: [ // Datos de prueba para el historial del modal
        { matchId: 1, opponent: "Boca Juniors", date: "12/01/2024", result: "2-1", status: "Victoria", minutes: 90, goles: 2, recupero: 5, perdida: 3, remate: 5, tiroAlArco: 3, faltaRecibida: 3, faltaCometida: 2, tAmarilla: 1, tRoja: 0 },
        { matchId: 2, opponent: "Racing Club", date: "08/01/2024", result: "1-1", status: "Empate", minutes: 90, goles: 1, recupero: 4, perdida: 5, remate: 3, tiroAlArco: 1, faltaRecibida: 4, faltaCometida: 2, tAmarilla: 0, tRoja: 0 },
        { matchId: 3, opponent: "Independiente", date: "05/01/2024", result: "3-0", status: "Victoria", minutes: 90, goles: 1, recupero: 6, perdida: 2, remate: 4, tiroAlArco: 2, faltaRecibida: 1, faltaCometida: 1, tAmarilla: 0, tRoja: 0 },
        { matchId: 4, opponent: "River Plate", date: "02/01/2024", result: "0-2", status: "Derrota", minutes: 90, goles: 0, recupero: 3, perdida: 6, remate: 2, tiroAlArco: 0, faltaRecibida: 8, faltaCometida: 1, tAmarilla: 1, tRoja: 0 },
      ],
    },
    {
      id: 2,
      name: "Miguel Ángel González",
      position: "Ala", // Corregido a Ala
      photo: "/placeholder-user.jpg",
      nickname: "Chino", 
      foot: "Ambidiestro",
      generalStats: {
        matches: 20,
        goals: 3,
        assists: 8,
        yellowCards: 4,
        redCards: 1,
        minutesPlayed: 1650,
        recuperoPelota: 120,
        perdioPelota: 70,
        remate: 40,
        remateAlArco: 15,
        faltaCometida: 25,
        faltaRecibida: 35,
      },
      matchHistory: [
        { matchId: 1, opponent: "Boca Juniors", date: "12/01/2024", result: "2-1", status: "Victoria", minutes: 90, goles: 0, recupero: 8, perdida: 6, remate: 2, tiroAlArco: 1, faltaRecibida: 5, faltaCometida: 4, tAmarilla: 1, tRoja: 0 },
        { matchId: 2, opponent: "Racing Club", date: "08/01/2024", result: "1-1", status: "Empate", minutes: 90, goles: 0, recupero: 6, perdida: 7, remate: 1, tiroAlArco: 0, faltaRecibida: 2, faltaCometida: 3, tAmarilla: 0, tRoja: 0 },
        { matchId: 3, opponent: "Independiente", date: "05/01/2024", result: "3-0", status: "Victoria", minutes: 90, goles: 1, recupero: 7, perdida: 4, remate: 3, tiroAlArco: 1, faltaRecibida: 2, faltaCometida: 2, tAmarilla: 0, tRoja: 0 },
        { matchId: 4, opponent: "River Plate", date: "02/01/2024", result: "0-2", status: "Derrota", minutes: 90, goles: 0, recupero: 5, perdida: 8, remate: 1, tiroAlArco: 0, faltaRecibida: 5, faltaCometida: 3, tAmarilla: 1, tRoja: 0 },
      ],
    },
    {
      id: 3,
      name: "Roberto Silva",
      position: "Ultimo", // Corregido a Ultimo
      photo: "/placeholder-user.jpg",
      nickname: "Robi",
      foot: "Izquierdo",
      generalStats: {
        matches: 15,
        goals: 1,
        assists: 2,
        yellowCards: 3,
        redCards: 0,
        minutesPlayed: 1200,
        recuperoPelota: 150,
        perdioPelota: 40,
        remate: 10,
        remateAlArco: 5,
        faltaCometida: 30,
        faltaRecibida: 10,
      },
      matchHistory: [
        { matchId: 1, opponent: "Boca Juniors", date: "12/01/2024", result: "2-1", status: "Victoria", minutes: 75, goles: 0, recupero: 10, perdida: 3, remate: 0, tiroAlArco: 0, faltaRecibida: 2, faltaCometida: 5, tAmarilla: 1, tRoja: 0 },
        { matchId: 2, opponent: "Racing Club", date: "08/01/2024", result: "1-1", status: "Empate", minutes: 90, goles: 0, recupero: 12, perdida: 5, remate: 0, tiroAlArco: 0, faltaRecibida: 1, faltaCometida: 4, tAmarilla: 1, tRoja: 0 },
        { matchId: 3, opponent: "Independiente", date: "05/01/2024", result: "3-0", status: "Victoria", minutes: 90, goles: 1, recupero: 15, perdida: 4, remate: 1, tiroAlArco: 1, faltaRecibida: 1, faltaCometida: 2, tAmarilla: 0, tRoja: 0 },
        { matchId: 4, opponent: "River Plate", date: "02/01/2024", result: "0-2", status: "Derrota", minutes: 60, goles: 0, recupero: 8, perdida: 6, remate: 0, tiroAlArco: 0, faltaRecibida: 3, faltaCometida: 3, tAmarilla: 1, tRoja: 1 },
      ],
    },
  ]

  const categories = [
    { id: "primera", name: "Primera División" },
    { id: "tercera", name: "Tercera División" },
    { id: "juveniles", name: "Juveniles" },
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

  const filteredMatches = matches.filter((match) => {
    const matchesResult = filterResult === "all" || match.status === filterResult
    const matchesLocation = filterLocation === "all" || match.location === filterLocation
    const matchesTournament = filterTournament === "all" || match.tournament === filterTournament
    return matchesResult && matchesLocation && matchesTournament
  }).sort((a, b) => {
    const [dayA, monthA, yearA] = a.date.split('/').map(Number);
    const [dayB, monthB, yearB] = b.date.split('/').map(Number);
    const dateA = new Date(yearA, monthA - 1, dayA);
    const dateB = new Date(yearB, monthB - 1, dayB);
    return dateB.getTime() - dateA.getTime();
  });

  const uniqueTournaments = [...new Set(matches.map(m => m.tournament))];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Estadísticas</h2>
        <p className="text-gray-400">Análisis completo del rendimiento del equipo</p>
      </div>

      {/* Estadísticas Generales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {generalStats.map((stat, index) => (
          <Card key={index} className="bg-[#213041] border-[#305176]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
                <Badge variant="secondary" className="bg-[#305176] text-gray-300 text-xs">
                  {stat.change}
                </Badge>
              </div>
              <div>
                <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Estadísticas de Partidos */}
      <Card className="bg-[#213041] border-[#305176]">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-white flex items-center">
            <Trophy className="h-5 w-5 mr-2" />
            Estadísticas de Partidos
          </CardTitle>
          <Button
            size="sm"
            variant="outline"
            className="border-[#aff606] text-[#aff606] hover:bg-[#aff606] hover:text-black bg-transparent"
            onClick={() => setShowAllMatchesModal(true)}
          >
            Ver demás partidos
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Se muestran solo los 3 últimos partidos */}
            {matches.slice(0, 3).map((match) => (
              <div key={match.id} className="p-4 bg-[#1d2834] rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-white font-medium">VS {match.opponent}</h3>
                    <p className="text-gray-400 text-sm">{match.date} - {match.tournament}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getResultColor(match.status)}>{match.result}</Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-[#aff606] text-[#aff606] hover:bg-[#aff606] hover:text-black bg-transparent"
                      onClick={() => setShowMatchDetailModal(match)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Estadísticas de Partido
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas por Jugador (MODIFICADO: Botón Ver Demas Jugadores) */}
      <Card className="bg-[#213041] border-[#305176]">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Estadísticas por Jugador
          </CardTitle>
          {/* Nuevo botón para Ver Demas Jugadores (Abre la página de gestión de club) */}
          <Link href="/dashboard/club">
            <Button
              size="sm"
              variant="outline"
              className="border-[#305176] text-white hover:bg-[#305176]/50 bg-transparent"
            >
              Ver Demas Jugadores
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {players.map((player) => (
              <div key={player.id} className="p-4 bg-[#1d2834] rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={player.photo} alt={player.name} />
                      <AvatarFallback className="bg-[#305176] text-white">
                        {player.name.split(" ").map((n) => n[0])}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-white font-medium">{player.name}</h3>
                      <p className="text-gray-400 text-sm">{player.position}</p>
                    </div>
                  </div>
                  {/* BOTÓN MODIFICADO */}
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-[#aff606] text-[#aff606] hover:bg-[#aff606] hover:text-black bg-transparent"
                    onClick={() => setShowPlayerDetailModal(player)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Estadísticas de Jugador
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rendimiento por Categoría y Entrenamientos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-[#213041] border-[#305176]">
          <CardHeader>
            <CardTitle className="text-white">Rendimiento por Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categories.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-[#1d2834] rounded-lg">
                  <div>
                    <p className="text-white font-medium">{category.name}</p>
                    <p className="text-gray-400 text-sm">8 partidos jugados</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#25d03f] font-bold">75% victorias</p>
                    <p className="text-gray-400 text-sm">6V - 1E - 1D</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#213041] border-[#305176]">
          <CardHeader>
            <CardTitle className="text-white">Entrenamientos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-[#1d2834] rounded-lg">
                <div>
                  <p className="text-white font-medium">Total Entrenamientos</p>
                  <p className="text-gray-400 text-sm">Este mes</p>
                </div>
                <div className="text-right">
                  <p className="text-[#aff606] font-bold text-2xl">24</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#1d2834] rounded-lg">
                <div>
                  <p className="text-white font-medium">Promedio Semanal</p>
                  <p className="text-gray-400 text-sm">Entrenamientos</p>
                </div>
                <div className="text-right">
                  <p className="text-[#33d9f6] font-bold text-2xl">6</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#1d2834] rounded-lg">
                <div>
                  <p className="text-white font-medium">Asistencia Promedio</p>
                  <p className="text-gray-400 text-sm">Jugadores por entrenamiento</p>
                </div>
                <div className="text-right">
                  <p className="text-[#f4c11a] font-bold text-2xl">22</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal para ver todos los partidos (Sin cambios) */}
      <Dialog open={showAllMatchesModal} onOpenChange={setShowAllMatchesModal}>
        <DialogContent className="sm:max-w-[800px] bg-[#213041] border-[#305176] text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 px-6">
            <div className="space-y-1">
              <DialogTitle className="text-white text-2xl font-bold">Todos los Partidos</DialogTitle>
              <DialogDescription className="text-gray-400">
                Historial completo de partidos jugados.
              </DialogDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={filterResult} onValueChange={setFilterResult}>
                <SelectTrigger className="w-full sm:w-32 bg-[#1d2834] border-[#305176] text-white text-xs">
                  <SelectValue placeholder="Resultado" />
                </SelectTrigger>
                <SelectContent className="bg-[#213041] border-[#305176]">
                  <SelectItem value="all" className="text-white text-xs">Resultado</SelectItem>
                  <SelectItem value="Victoria" className="text-white text-xs">Victorias</SelectItem>
                  <SelectItem value="Empate" className="text-white text-xs">Empates</SelectItem>
                  <SelectItem value="Derrota" className="text-white text-xs">Derrotas</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterLocation} onValueChange={setFilterLocation}>
                <SelectTrigger className="w-full sm:w-32 bg-[#1d2834] border-[#305176] text-white text-xs">
                  <SelectValue placeholder="Localía" />
                </SelectTrigger>
                <SelectContent className="bg-[#213041] border-[#305176]">
                  <SelectItem value="all" className="text-white text-xs">Condición</SelectItem>
                  <SelectItem value="Local" className="text-white text-xs">Local</SelectItem>
                  <SelectItem value="Visitante" className="text-white text-xs">Visitante</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterTournament} onValueChange={setFilterTournament}>
                <SelectTrigger className="w-full sm:w-32 bg-[#1d2834] border-[#305176] text-white text-xs">
                  <SelectValue placeholder="Torneo" />
                </SelectTrigger>
                <SelectContent className="bg-[#213041] border-[#305176]">
                  <SelectItem value="all" className="text-white text-xs">Torneo</SelectItem>
                  {uniqueTournaments.map((tournament: any) => (
                    <SelectItem key={tournament} value={tournament} className="text-white text-xs">
                      {tournament}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <ScrollArea className="h-[400px] pr-6">
            <div className="space-y-4">
              {filteredMatches.length > 0 ? (
                filteredMatches.map((match) => (
                  <div key={match.id} className="p-4 bg-[#1d2834] rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-white font-medium">VS {match.opponent}</h3>
                        <p className="text-gray-400 text-sm">{match.date} - {match.tournament}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getResultColor(match.status)}>{match.result}</Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-[#aff606] text-[#aff606] hover:bg-[#aff606] hover:text-black bg-transparent"
                          onClick={() => {
                            setShowMatchDetailModal(match);
                            setShowAllMatchesModal(false);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Ver
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400">No se encontraron partidos con estos filtros.</p>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>


      {/* Modal de Estadísticas de Partidos (UNIFICADO Y ACTUALIZADO) */}
      <Dialog open={!!showMatchDetailModal} onOpenChange={setShowMatchDetailModal}>
        <DialogContent className="sm:max-w-[800px] bg-[#213041] border-[#305176] text-white">
          <DialogHeader className="text-center">
            <DialogTitle className="text-white text-2xl font-bold">
              Estadísticas del Partido vs {showMatchDetailModal?.opponent}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {showMatchDetailModal?.tournament} - {showMatchDetailModal?.date}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[400px] pr-6">
            <div className="grid gap-4 py-4">
              
              {/* CUADRANTE DETALLE UNIFICADO */}
              <Card className="bg-[#1d2834] border-[#305176]">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Detalle</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  
                  {/* RESUMEN: Resultado */}
                  <div className="flex justify-between">
                    <span className="text-gray-400">Resultado</span>
                    <Badge className={getResultColor(showMatchDetailModal?.status)}>
                      {showMatchDetailModal?.result}
                    </Badge>
                  </div>
                  {/* RESUMEN: Tiempo jugado */}
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tiempo jugado</span>
                    <span className="text-white font-bold">{showMatchDetailModal?.duration} min</span>
                  </div>
                  
                  {/* Separador visual para las métricas de detalle */}
                  <div className="h-px bg-[#305176] my-4"></div>

                  {/* DETALLE: Goles a favor */}
                  <div className="flex justify-between">
                    <span className="text-gray-400">Goles a favor</span>
                    <span className="text-[#25d03f] font-bold">{showMatchDetailModal?.stats?.goalsFor}</span>
                  </div>
                  {/* DETALLE: Goles en contra */}
                  <div className="flex justify-between">
                    <span className="text-gray-400">Goles en contra</span>
                    <span className="text-red-400 font-bold">{showMatchDetailModal?.stats?.goalsAgainst}</span>
                  </div>
                  {/* DETALLE: Recuperación de Pelota */}
                  <div className="flex justify-between">
                    <span className="text-gray-400">Recuperación de Pelota</span>
                    <span className="text-white font-bold">{showMatchDetailModal?.stats?.recuperoPelota}</span>
                  </div>
                  {/* DETALLE: Pérdida de Pelota */}
                  <div className="flex justify-between">
                    <span className="text-gray-400">Pérdida de Pelota</span>
                    <span className="text-white font-bold">{showMatchDetailModal?.stats?.perdioPelota}</span>
                  </div>
                  {/* DETALLE: Faltas recibidas */}
                  <div className="flex justify-between">
                    <span className="text-gray-400">Faltas recibidas</span>
                    <span className="text-white font-bold">{showMatchDetailModal?.stats?.foulsReceived}</span>
                  </div>
                  {/* DETALLE: Faltas cometidas */}
                  <div className="flex justify-between">
                    <span className="text-gray-400">Faltas cometidas</span>
                    <span className="text-white font-bold">{showMatchDetailModal?.stats?.foulsCommitted}</span>
                  </div>
                   {/* DETALLE: Tiros totales */}
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tiros totales</span>
                    <span className="text-white font-bold">{showMatchDetailModal?.stats?.totalShots}</span>
                  </div>
                  {/* DETALLE: Tiros al arco */}
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tiros al arco</span>
                    <span className="text-white font-bold">{showMatchDetailModal?.stats?.shotsOnTarget}</span>
                  </div>
                  {/* DETALLE: Tarjetas amarillas */}
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tarjetas amarillas</span>
                    <span className="text-white font-bold">{showMatchDetailModal?.stats?.yellowCards}</span>
                  </div>
                  {/* DETALLE: Tarjetas rojas */}
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tarjetas rojas</span>
                    <span className="text-white font-bold">{showMatchDetailModal?.stats?.redCards}</span>
                  </div>
                  
                </CardContent>
              </Card>

              {/* Nota: La tabla de jugadores ha sido eliminada de este modal según tu solicitud anterior. */}
              
            </div>
            <div className="mt-4">
              <Button
                className="w-full bg-[#aff606] text-black hover:bg-[#25d03f]"
                onClick={() => {
                  setShowAllPlayersModal(true);
                  setShowMatchDetailModal(null);
                }}
              >
                Ver estadísticas de jugadores
              </Button>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
      
      {/* Modal de Estadísticas por Jugador (REDISENADO PARA LEGIBILIDAD y con Información de Jugador) */}
      <Dialog open={!!showPlayerDetailModal} onOpenChange={setShowPlayerDetailModal}>
        {/* Aumentamos el ancho del modal para la nueva disposición */}
        <DialogContent className="sm:max-w-[1000px] bg-[#213041] border-[#305176] text-white">
          <DialogHeader className="text-center">
            <DialogTitle className="text-white text-2xl font-bold">
              Estadísticas de {showPlayerDetailModal?.name}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Análisis de rendimiento a lo largo de los partidos.
            </DialogDescription>
          </DialogHeader>
          
          {/* Nuevo Layout Grid: 1 columna para información, 2 para estadísticas */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* COLUMNA 1: Información del Jugador (NUEVA ADICIÓN) */}
            <Card className="bg-[#1d2834] border-[#305176] lg:col-span-1 h-fit">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center"> 
                   <Users className="h-5 w-5 mr-2 text-[#33d9f6]" /> Información de Jugador
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 flex flex-col items-center p-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={showPlayerDetailModal?.photo} alt={showPlayerDetailModal?.name} />
                  <AvatarFallback className="bg-[#305176] text-white text-2xl">
                    {showPlayerDetailModal?.name?.split(" ").map((n: string) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h3 className="text-white font-bold text-xl">{showPlayerDetailModal?.name}</h3>
                </div>
                
                {/* Detalles del Jugador */}
                <div className="w-full space-y-2 text-sm pt-4 border-t border-[#305176]">
                    <div className="flex justify-between">
                        <span className="text-gray-400">Apodo</span>
                        <span className="text-white font-medium">"{showPlayerDetailModal?.nickname || 'N/A'}"</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Posición</span>
                        <span className="text-white font-medium">{showPlayerDetailModal?.position}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Pierna Hábil</span>
                        <span className="text-white font-medium">{showPlayerDetailModal?.foot}</span>
                    </div>
                </div>
              </CardContent>
            </Card>

            {/* COLUMNAS 2 & 3: Estadísticas */}
            <div className="lg:col-span-2">
              <ScrollArea className="h-[500px] pr-6 space-y-6">
                
                {/* CUADRANTE 1: ESTADÍSTICAS TOTALES (Diseño optimizado) */}
                <Card className="bg-[#1d2834] border-[#305176]">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Historial Acumulado</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
                    
                    {/* Bloque Ofensivo */}
                    <div className="space-y-2">
                        <div className="flex justify-between border-b border-white/10 pb-1">
                            <span className="text-gray-400">Tiempo Jugado</span>
                            <span className="text-white font-bold">{showPlayerDetailModal?.generalStats?.minutesPlayed} min</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-1">
                            <span className="text-gray-400">Goles</span>
                            <span className="text-[#25d03f] font-bold">{showPlayerDetailModal?.generalStats?.goals}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-1">
                            <span className="text-gray-400">Asistencias</span>
                            <span className="text-[#f4c11a] font-bold">{showPlayerDetailModal?.generalStats?.assists}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-1">
                            <span className="text-gray-400">Remate</span>
                            <span className="text-white font-bold">{showPlayerDetailModal?.generalStats?.remate}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Tiro al Arco</span>
                            <span className="text-white font-bold">{showPlayerDetailModal?.generalStats?.remateAlArco}</span>
                        </div>
                    </div>

                    {/* Bloque Defensivo y Disciplina */}
                    <div className="space-y-2">
                        <div className="flex justify-between border-b border-white/10 pb-1">
                            <span className="text-gray-400">Pelota Recuperada</span>
                            <span className="text-white font-bold">{showPlayerDetailModal?.generalStats?.recuperoPelota}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-1">
                            <span className="text-gray-400">Pelota Perdida</span>
                            <span className="text-white font-bold">{showPlayerDetailModal?.generalStats?.perdioPelota}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-1">
                            <span className="text-gray-400">Falta Recibida</span>
                            <span className="text-white font-bold">{showPlayerDetailModal?.generalStats?.faltaRecibida}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-1">
                            <span className="text-gray-400">Falta Cometida</span>
                            <span className="text-white font-bold">{showPlayerDetailModal?.generalStats?.faltaCometida}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-1">
                            <span className="text-gray-400">T. Amarilla</span>
                            <span className="text-[#f4c11a] font-bold">{showPlayerDetailModal?.generalStats?.yellowCards}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">T. Roja</span>
                            <span className="text-[#ea3498] font-bold">{showPlayerDetailModal?.generalStats?.redCards}</span>
                        </div>
                    </div>
                  </CardContent>
                </Card>

                {/* CUADRANTE 2: DETALLE POR PARTIDO (Diseño optimizado y vertical) */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white mb-2">Historial Partido a Partido</h3>
                    {showPlayerDetailModal?.matchHistory?.map((match: any) => (
                        <Card key={match.matchId} className="bg-[#1d2834] border-[#305176] p-0">
                            <CardHeader className="py-2 px-4 bg-[#305176]/50 rounded-t-lg">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-white text-sm font-bold">VS {match.opponent} ({match.date})</CardTitle>
                                    <Badge className={getResultColor(match.status)}>{match.result}</Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-y-1 gap-x-4 p-4 text-sm">
                                
                                {/* Fila 1 */}
                                <div className="col-span-1 flex justify-between">
                                    <span className="text-gray-400">Minutos</span>
                                    <span className="text-white font-bold">{match.minutes} min</span>
                                </div>
                                <div className="col-span-1 flex justify-between">
                                    <span className="text-gray-400">Goles</span>
                                    <span className="text-[#25d03f] font-bold">{match.goles}</span>
                                </div>
                                <div className="col-span-1 flex justify-between">
                                    <span className="text-gray-400">Asistencias</span>
                                    <span className="text-[#f4c11a] font-bold">{match.asistencias || 0}</span>
                                </div>
                                
                                {/* Fila 2 (Separador implícito) */}
                                <div className="col-span-1 flex justify-between pt-2 border-t border-white/10">
                                    <span className="text-gray-400">Recuperada</span>
                                    <span className="text-white font-bold">{match.recupero}</span>
                                </div>
                                <div className="col-span-1 flex justify-between pt-2 border-t border-white/10">
                                    <span className="text-gray-400">Perdida</span>
                                    <span className="text-white font-bold">{match.perdida}</span>
                                </div>
                                <div className="col-span-1 flex justify-between pt-2 border-t border-white/10">
                                    <span className="text-gray-400">Remates</span>
                                    <span className="text-white font-bold">{match.remate}</span>
                                </div>
                                
                                {/* Fila 3 (Separador implícito) */}
                                <div className="col-span-1 flex justify-between pt-2 border-t border-white/10">
                                    <span className="text-gray-400">R. al Arco</span>
                                    <span className="text-white font-bold">{match.tiroAlArco}</span>
                                </div>
                                <div className="col-span-1 flex justify-between pt-2 border-t border-white/10">
                                    <span className="text-gray-400">F. Recibida</span>
                                    <span className="text-white font-bold">{match.faltaRecibida}</span>
                                </div>
                                <div className="col-span-1 flex justify-between pt-2 border-t border-white/10">
                                    <span className="text-gray-400">F. Cometida</span>
                                    <span className="text-white font-bold">{match.faltaCometida}</span>
                                </div>

                                {/* Fila 4 (Disciplina) */}
                                <div className="col-span-1 flex justify-between pt-2 border-t border-white/10">
                                    <span className="text-gray-400">T. Amarilla</span>
                                    <span className="text-[#f4c11a] font-bold">{match.tAmarilla}</span>
                                </div>
                                <div className="col-span-1 flex justify-between pt-2 border-t border-white/10">
                                    <span className="text-gray-400">T. Roja</span>
                                    <span className="text-[#ea3498] font-bold">{match.tRoja}</span>
                                </div>
                                
                            </CardContent>
                        </Card>
                    ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Modal global de todos los jugadores (Sin cambios) */}
      <Dialog open={showAllPlayersModal} onOpenChange={setShowAllPlayersModal}>
        <DialogContent className="sm:max-w-[1200px] bg-[#213041] border-[#305176] text-white">
          <DialogHeader>
            <DialogTitle className="text-white text-2xl font-bold">
              Estadísticas de Jugadores
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Resumen completo del rendimiento de todos los jugadores.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[500px] pr-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#305176]">
                    <TableHead className="text-white">Jugador</TableHead>
                    <TableHead className="text-white text-center">Minutos</TableHead>
                    <TableHead className="text-white text-center">Gol</TableHead>
                    <TableHead className="text-white text-center">Pelota Recuperada</TableHead>
                    <TableHead className="text-white text-center">Pelota Perdida</TableHead>
                    <TableHead className="text-white text-center">Remate</TableHead>
                    <TableHead className="text-white text-center">R. al Arco</TableHead>
                    <TableHead className="text-white text-center">Falta Recibida</TableHead>
                    <TableHead className="text-white text-center">Falta Cometida</TableHead>
                    <TableHead className="text-white text-center">T. Amarilla</TableHead>
                    <TableHead className="text-white text-center">T. Roja</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {players.map((player) => (
                    <TableRow key={player.id} className="hover:bg-[#1d2834] border-[#305176]">
                      <TableCell className="py-2 flex items-center space-x-2">
                        <Avatar className="size-8">
                          <AvatarImage src={player.photo} alt={player.name} />
                          <AvatarFallback className="bg-[#305176] text-white text-xs">
                            {player.name.split(" ").map((n) => n[0])}
                          </AvatarFallback>
                        </Avatar>
                        <p className="text-white font-medium">{player.name}</p>
                      </TableCell>
                      <TableCell className="py-2 text-center text-gray-300">{player.generalStats.minutesPlayed} min</TableCell>
                      <TableCell className="py-2 text-center text-[#25d03f] font-bold">{player.generalStats.goals}</TableCell>
                      <TableCell className="py-2 text-center text-gray-300">{player.generalStats.recuperoPelota}</TableCell>
                      <TableCell className="py-2 text-center text-gray-300">{player.generalStats.perdioPelota}</TableCell>
                      <TableCell className="py-2 text-center text-gray-300">{player.generalStats.remate}</TableCell>
                      <TableCell className="py-2 text-center text-gray-300">{player.generalStats.remateAlArco}</TableCell>
                      <TableCell className="py-2 text-center text-gray-300">{player.generalStats.faltaRecibida}</TableCell>
                      <TableCell className="py-2 text-center text-gray-300">{player.generalStats.faltaCometida}</TableCell>
                      <TableCell className="py-2 text-center text-[#f4c11a] font-bold">{player.generalStats.yellowCards}</TableCell>
                      <TableCell className="py-2 text-center text-[#ea3498] font-bold">{player.generalStats.redCards}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  )
}