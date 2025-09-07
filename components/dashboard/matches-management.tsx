"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Clock, Plus, Play, Eye } from "lucide-react"

export function MatchesManagement() {
  const [selectedCategory, setSelectedCategory] = useState("")

  const tournaments = [
    { name: "Liga Profesional", matches: 8 },
    { name: "Copa Argentina", matches: 3 },
    { name: "Torneo Clausura", matches: 12 },
  ]

  const upcomingMatches = [
    {
      id: 1,
      opponent: "Club Atlético River",
      date: "2024-01-15",
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
      date: "2024-01-29",
      time: "20:00",
      location: "Local",
      tournament: "Liga Profesional",
      category: "Primera División",
      status: "En Vivo",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Gestión de Partidos</h2>
          <p className="text-gray-400">Programa encuentros y gestiona la información de los partidos</p>
        </div>
        <Button className="bg-[#aff606] text-black hover:bg-[#25d03f]">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Partido
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tournament Creation */}
        <div className="lg:col-span-1">
          <Card className="bg-[#213041] border-[#305176] mb-6">
            <CardHeader>
              <CardTitle className="text-white">Torneos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {tournaments.map((tournament, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-[#1d2834] rounded-lg">
                  <span className="text-white font-medium">{tournament.name}</span>
                  <Badge variant="secondary" className="bg-[#305176] text-gray-300">
                    {tournament.matches}
                  </Badge>
                </div>
              ))}
              <Button className="w-full bg-[#305176] text-white hover:bg-[#aff606] hover:text-black">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Torneo
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Match Creation Form */}
        <div className="lg:col-span-2">
          <Card className="bg-[#213041] border-[#305176]">
            <CardHeader>
              <CardTitle className="text-white">Agendar Nuevo Partido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">Categoría</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="bg-[#1d2834] border-[#305176] text-white">
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#213041] border-[#305176]">
                      <SelectItem value="primera" className="text-white">
                        Primera División
                      </SelectItem>
                      <SelectItem value="tercera" className="text-white">
                        Tercera División
                      </SelectItem>
                      <SelectItem value="juveniles" className="text-white">
                        Juveniles
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Torneo</Label>
                  <Select>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="opponent" className="text-white">
                    Rival
                  </Label>
                  <Input
                    id="opponent"
                    placeholder="Nombre del equipo rival"
                    className="bg-[#1d2834] border-[#305176] text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Condición</Label>
                  <Select>
                    <SelectTrigger className="bg-[#1d2834] border-[#305176] text-white">
                      <SelectValue placeholder="Local/Visitante" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#213041] border-[#305176]">
                      <SelectItem value="local" className="text-white">
                        Local
                      </SelectItem>
                      <SelectItem value="visitante" className="text-white">
                        Visitante
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="match-date" className="text-white">
                    Fecha
                  </Label>
                  <Input id="match-date" type="date" className="bg-[#1d2834] border-[#305176] text-white" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="match-time" className="text-white">
                    Hora
                  </Label>
                  <Input id="match-time" type="time" className="bg-[#1d2834] border-[#305176] text-white" />
                </div>
              </div>

              <Button className="w-full bg-[#aff606] text-black hover:bg-[#25d03f]">Agendar Partido</Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Upcoming Matches */}
      <Card className="bg-[#213041] border-[#305176]">
        <CardHeader>
          <CardTitle className="text-white">Próximos Partidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingMatches.map((match) => (
              <div key={match.id} className="flex items-center justify-between p-4 bg-[#1d2834] rounded-lg">
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
                      Gestionar
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
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
