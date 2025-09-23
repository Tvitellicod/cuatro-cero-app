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
        fouls: 10,
        yellowCards: 3,
        redCards: 0,
      },
      playerStats: [
        { id: 1, name: "Juan C. Pérez", goals: 2, assists: 1, yellowCards: 1, redCards: 0, minutes: 90 },
        { id: 2, name: "Miguel A. González", goals: 0, assists: 1, yellowCards: 1, redCards: 0, minutes: 90 },
        { id: 3, name: "Roberto Silva", goals: 0, assists: 0, yellowCards: 1, redCards: 0, minutes: 75 },
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
        fouls: 15,
        yellowCards: 2,
        redCards: 0,
      },
      playerStats: [
        { id: 1, name: "Juan C. Pérez", goals: 1, assists: 0, yellowCards: 0, redCards: 0, minutes: 90 },
        { id: 2, name: "Miguel A. González", goals: 0, assists: 1, yellowCards: 0, redCards: 0, minutes: 90 },
        { id: 3, name: "Roberto Silva", goals: 0, assists: 0, yellowCards: 1, redCards: 0, minutes: 90 },
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
        fouls: 8,
        yellowCards: 1,
        redCards: 0,
      },
      playerStats: [
        { id: 1, name: "Juan C. Pérez", goals: 1, assists: 1, yellowCards: 0, redCards: 0, minutes: 90 },
        { id: 2, name: "Miguel A. González", goals: 1, assists: 1, yellowCards: 0, redCards: 0, minutes: 90 },
        { id: 3, name: "Roberto Silva", goals: 1, assists: 0, yellowCards: 0, redCards: 0, minutes: 90 },
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
        fouls: 12,
        yellowCards: 4,
        redCards: 1,
      },
      playerStats: [
        { id: 1, name: "Juan C. Pérez", goals: 0, assists: 0, yellowCards: 1, redCards: 0, minutes: 90 },
        { id: 2, name: "Miguel A. González", goals: 0, assists: 0, yellowCards: 1, redCards: 0, minutes: 90 },
        { id: 3, name: "Roberto Silva", goals: 0, assists: 0, yellowCards: 1, redCards: 1, minutes: 60 },
      ],
    },
  ]

  const players = [
    {
      id: 1,
      name: "Juan Carlos Pérez",
      position: "Delantero",
      photo: "/placeholder-user.jpg",
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
      trainingAttendance: [
        { date: "10/01/2024", status: "Presente" },
        { date: "09/01/2024", status: "Ausente" },
        { date: "08/01/2024", status: "Presente" },
      ],
      matchHistory: [
        { matchId: 1, opponent: "Boca Juniors", date: "12/01/2024", result: "2-1", goals: 2, assists: 1 },
        { matchId: 2, opponent: "Racing Club", date: "08/01/2024", result: "1-1", goals: 1, assists: 0 },
      ],
    },
    {
      id: 2,
      name: "Miguel Ángel González",
      position: "Mediocampista",
      photo: "/placeholder-user.jpg",
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
      trainingAttendance: [
        { date: "10/01/2024", status: "Presente" },
        { date: "09/01/2024", status: "Presente" },
        { date: "08/01/2024", status: "Presente" },
      ],
      matchHistory: [
        { matchId: 1, opponent: "Boca Juniors", date: "12/01/2024", result: "2-1", goals: 0, assists: 1 },
        { matchId: 2, opponent: "Racing Club", date: "08/01/2024", result: "1-1", goals: 0, assists: 1 },
      ],
    },
    {
      id: 3,
      name: "Roberto Silva",
      position: "Defensor",
      photo: "/placeholder-user.jpg",
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
      trainingAttendance: [
        { date: "10/01/2024", status: "Presente" },
        { date: "09/01/2024", status: "Presente" },
        { date: "08/01/2024", status: "Presente" },
      ],
      matchHistory: [
        { matchId: 1, opponent: "Boca Juniors", date: "12/01/2024", result: "2-1", goals: 0, assists: 0 },
        { matchId: 2, opponent: "Racing Club", date: "08/01/2024", result: "1-1", goals: 0, assists: 0 },
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
                      Ver
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas por Jugador */}
      <Card className="bg-[#213041] border-[#305176]">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Estadísticas por Jugador
          </CardTitle>
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
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-[#aff606] text-[#aff606] hover:bg-[#aff606] hover:text-black bg-transparent"
                    onClick={() => setShowPlayerDetailModal(player)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver
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

      {/* Modal para ver todos los partidos */}
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


      {/* Modal de Estadísticas de Partidos */}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-[#1d2834] border-[#305176]">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Resumen</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Resultado</span>
                      <Badge className={getResultColor(showMatchDetailModal?.status)}>
                        {showMatchDetailModal?.result}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Goles a favor</span>
                      <span className="text-[#25d03f] font-bold">{showMatchDetailModal?.stats?.goalsFor}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Goles en contra</span>
                      <span className="text-red-400 font-bold">{showMatchDetailModal?.stats?.goalsAgainst}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Posesión</span>
                      <span className="text-white font-bold">{showMatchDetailModal?.stats?.possession}</span>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-[#1d2834] border-[#305176]">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Detalle</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tiros al arco</span>
                      <span className="text-white font-bold">{showMatchDetailModal?.stats?.shotsOnTarget}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tiros totales</span>
                      <span className="text-white font-bold">{showMatchDetailModal?.stats?.totalShots}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Faltas</span>
                      <span className="text-white font-bold">{showMatchDetailModal?.stats?.fouls}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tarjetas amarillas</span>
                      <span className="text-white font-bold">{showMatchDetailModal?.stats?.yellowCards}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tarjetas rojas</span>
                      <span className="text-white font-bold">{showMatchDetailModal?.stats?.redCards}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-4">
                <h3 className="text-lg font-semibold text-white mb-2">Estadísticas por Jugador</h3>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-[#305176]">
                        <TableHead className="text-white">Jugador</TableHead>
                        <TableHead className="text-white text-center">Goles</TableHead>
                        <TableHead className="text-white text-center">Asist.</TableHead>
                        <TableHead className="text-white text-center">T. Amarillas</TableHead>
                        <TableHead className="text-white text-center">T. Rojas</TableHead>
                        <TableHead className="text-white text-center">Minutos</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {showMatchDetailModal?.playerStats?.map((pStat: any) => (
                        <TableRow key={pStat.id} className="hover:bg-[#1d2834] border-[#305176]">
                          <TableCell className="py-2">{pStat.name}</TableCell>
                          <TableCell className="py-2 text-center text-[#25d03f] font-bold">{pStat.goals}</TableCell>
                          <TableCell className="py-2 text-center text-[#aff606] font-bold">{pStat.assists}</TableCell>
                          <TableCell className="py-2 text-center text-[#f4c11a] font-bold">{pStat.yellowCards}</TableCell>
                          <TableCell className="py-2 text-center text-[#ea3498] font-bold">{pStat.redCards}</TableCell>
                          <TableCell className="py-2 text-center text-gray-300">{pStat.minutes} min</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
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
      
      {/* Nuevo Modal para todas las estadísticas de jugadores */}
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
                    <TableHead className="text-white text-center">Goles</TableHead>
                    <TableHead className="text-white text-center">Asist.</TableHead>
                    <TableHead className="text-white text-center">Remates</TableHead>
                    <TableHead className="text-white text-center">R. al arco</TableHead>
                    <TableHead className="text-white text-center">Recup.</TableHead>
                    <TableHead className="text-white text-center">Pérdidas</TableHead>
                    <TableHead className="text-white text-center">Faltas C.</TableHead>
                    <TableHead className="text-white text-center">Faltas R.</TableHead>
                    <TableHead className="text-white text-center">T. Amarillas</TableHead>
                    <TableHead className="text-white text-center">T. Rojas</TableHead>
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
                      <TableCell className="py-2 text-center text-[#aff606] font-bold">{player.generalStats.assists}</TableCell>
                      <TableCell className="py-2 text-center text-gray-300">{player.generalStats.remate}</TableCell>
                      <TableCell className="py-2 text-center text-gray-300">{player.generalStats.remateAlArco}</TableCell>
                      <TableCell className="py-2 text-center text-gray-300">{player.generalStats.recuperoPelota}</TableCell>
                      <TableCell className="py-2 text-center text-gray-300">{player.generalStats.perdioPelota}</TableCell>
                      <TableCell className="py-2 text-center text-gray-300">{player.generalStats.faltaCometida}</TableCell>
                      <TableCell className="py-2 text-center text-gray-300">{player.generalStats.faltaRecibida}</TableCell>
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