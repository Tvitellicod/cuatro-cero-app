"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Clock, Play, Eye } from "lucide-react"

export function UpcomingMatches() {
  const upcomingMatches = [
    {
      id: 1,
      opponent: "Club Atlético River",
      date: "2024-01-16",
      time: "16:00",
      location: "Local",
      tournament: "Liga Profesional",
      category: "Primera División",
      status: "Próximamente",
    },
    {
      id: 2,
      opponent: "Boca Juniors",
      date: "2024-01-22",
      time: "18:30",
      location: "Visitante",
      tournament: "Copa Argentina",
      category: "Primera División",
      status: "Próximamente",
    },
    {
      id: 3,
      opponent: "Racing Club",
      date: "2024-01-15",
      time: "20:00",
      location: "Local",
      tournament: "Liga Profesional",
      category: "Primera División",
      status: "En Vivo",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Próximos Partidos</h2>
        <p className="text-gray-400">Gestiona los próximos encuentros y acciones de juego</p>
      </div>

      {/* Upcoming Matches */}
      <Card className="bg-[#213041] border-[#305176]">
        <CardHeader>
          <CardTitle className="text-white">Partidos Programados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingMatches.map((match) => (
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
                          <MapPin className="h-4 w-4 mr-1" />
                          {match.location}
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
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-[#aff606] text-[#aff606] hover:bg-[#aff606] hover:text-black bg-transparent"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalles
                      </Button>
                    )}
                  </div>
                </div>

                {/* Interfaz simple para acciones de juego cuando está "En Vivo" */}
                {match.status === "En Vivo" && (
                  <div className="mt-4 p-4 bg-[#213041] rounded-lg border border-red-500">
                    <h4 className="text-white font-medium mb-3">Acciones de Juego en Vivo</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      <Button size="sm" className="bg-[#25d03f] text-black hover:bg-[#20b136]">
                        Gol
                      </Button>
                      <Button size="sm" className="bg-[#f4c11a] text-black hover:bg-[#e6b000]">
                        T. Amarilla
                      </Button>
                      <Button size="sm" className="bg-red-500 text-white hover:bg-red-600">
                        T. Roja
                      </Button>
                      <Button size="sm" className="bg-[#33d9f6] text-black hover:bg-[#2bc4ea]">
                        Cambio
                      </Button>
                    </div>
                    <div className="mt-3 text-center">
                      <span className="text-white text-lg font-bold">Resultado: 0 - 0</span>
                      <span className="text-gray-400 text-sm ml-4">Tiempo: 45'</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
