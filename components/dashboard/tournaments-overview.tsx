"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, Trophy, TrendingUp, Activity, Target } from "lucide-react"
import Link from "next/link"

export function TournamentsOverview() {
  // Obtener fecha actual
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

  const tournaments = [
    { name: "Liga Profesional", matches: 8, position: "2°" },
    { name: "Copa Argentina", matches: 3, position: "Octavos" },
    { name: "Torneo Clausura", matches: 12, position: "1°" },
  ]

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

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
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

            <div className="flex justify-end">
              <Link href="/dashboard/torneos/proximos">
                <Button className="bg-[#aff606] text-black hover:bg-[#25d03f]">Ver Detalles</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas de Partidos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Último Partido */}
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

        {/* Último Mes */}
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

        {/* Goles */}
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

      {/* Torneos */}
      <Card className="bg-[#213041] border-[#305176]">
        <CardHeader>
          <CardTitle className="text-white">Torneos Activos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tournaments.map((tournament, index) => (
              <div key={index} className="p-4 bg-[#1d2834] rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-medium">{tournament.name}</h3>
                  <Badge className="bg-[#aff606] text-black">{tournament.position}</Badge>
                </div>
                <p className="text-gray-400 text-sm">{tournament.matches} partidos jugados</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
