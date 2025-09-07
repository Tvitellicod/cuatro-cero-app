"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Calendar, Clock, Eye, Plus, Users, X, Check } from "lucide-react"

export function MatchesManagement() {
  const [showScheduleForm, setShowScheduleForm] = useState(false)
  const [showPlayerSelection, setShowPlayerSelection] = useState(false)
  const [selectedPlayers, setSelectedPlayers] = useState<number[]>([])

  // Filtros
  const [filterResult, setFilterResult] = useState("")
  const [filterLocation, setFilterLocation] = useState("")
  const [filterTournament, setFilterTournament] = useState("")

  const today = new Date()

  // Obtener el perfil del usuario para filtrar jugadores
  const savedProfile = typeof window !== "undefined" ? localStorage.getItem("userProfile") : null
  const profileData = savedProfile ? JSON.parse(savedProfile) : null

  // Generar jugadores para la categoría actual
  const generatePlayersForCategory = () => {
    const firstNames = [
      "Juan",
      "Carlos",
      "Miguel",
      "Roberto",
      "Diego",
      "Fernando",
      "Alejandro",
      "Sebastián",
      "Martín",
      "Pablo",
      "Gonzalo",
      "Nicolás",
      "Facundo",
      "Matías",
      "Lucas",
      "Tomás",
      "Agustín",
      "Franco",
      "Ignacio",
      "Maximiliano",
      "Santiago",
      "Joaquín",
      "Emiliano",
      "Valentín",
      "Thiago",
    ]
    const lastNames = [
      "García",
      "Rodríguez",
      "González",
      "Fernández",
      "López",
      "Martínez",
      "Sánchez",
      "Pérez",
      "Gómez",
      "Martín",
      "Jiménez",
      "Ruiz",
      "Hernández",
      "Díaz",
      "Moreno",
      "Muñoz",
      "Álvarez",
      "Romero",
      "Alonso",
      "Gutiérrez",
      "Navarro",
      "Torres",
      "Domínguez",
      "Vázquez",
      "Ramos",
    ]

    const players = []
    for (let i = 0; i < 25; i++) {
      const firstName = firstNames[i % firstNames.length]
      const lastName = lastNames[i % lastNames.length]
      players.push({
        id: i + 1,
        name: `${firstName} ${lastName}`,
        position: ["Arquero", "Defensor", "Mediocampista", "Delantero"][Math.floor(Math.random() * 4)],
        status: Math.random() > 0.1 ? "DISPONIBLE" : "LESIONADO", // 90% disponibles
      })
    }
    return players.filter((p) => p.status === "DISPONIBLE")
  }

  const availablePlayers = generatePlayersForCategory()

  const pastMatches = [
    {
      id: 1,
      opponent: "Boca Juniors",
      date: "2024-01-12",
      time: "18:30",
      location: "Visitante",
      tournament: "Copa Argentina",
      result: "2-1",
      status: "Victoria",
    },
    {
      id: 2,
      opponent: "Racing Club",
      date: "2024-01-08",
      time: "20:00",
      location: "Local",
      tournament: "Liga Profesional",
      result: "1-1",
      status: "Empate",
    },
    {
      id: 3,
      opponent: "Independiente",
      date: "2024-01-05",
      time: "16:00",
      location: "Local",
      tournament: "Liga Profesional",
      result: "3-0",
      status: "Victoria",
    },
    {
      id: 4,
      opponent: "San Lorenzo",
      date: "2024-01-02",
      time: "19:00",
      location: "Visitante",
      tournament: "Copa Argentina",
      result: "0-2",
      status: "Derrota",
    },
    {
      id: 5,
      opponent: "Estudiantes",
      date: "2023-12-28",
      time: "17:30",
      location: "Local",
      tournament: "Liga Profesional",
      result: "2-2",
      status: "Empate",
    },
    {
      id: 6,
      opponent: "Gimnasia",
      date: "2023-12-22",
      time: "21:00",
      location: "Visitante",
      tournament: "Liga Profesional",
      result: "1-0",
      status: "Victoria",
    },
  ]

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
    const matchesResult = !filterResult || match.status === filterResult
    const matchesLocation = !filterLocation || match.location === filterLocation
    const matchesTournament = !filterTournament || match.tournament === filterTournament

    return matchesResult && matchesLocation && matchesTournament
  })

  const handlePlayerToggle = (playerId: number) => {
    setSelectedPlayers((prev) => (prev.includes(playerId) ? prev.filter((id) => id !== playerId) : [...prev, playerId]))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Partidos</h2>
          <p className="text-gray-400">Historial de partidos jugados</p>
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
                <div className="text-sm text-gray-400">Seleccionados: {selectedPlayers.length}/18 jugadores</div>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {availablePlayers.map((player) => (
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
                  ))}
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
                <Input placeholder="Nombre del equipo rival" className="bg-[#1d2834] border-[#305176] text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-white text-sm">Torneo</label>
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-white text-sm">Condición</label>
                <Select>
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
                <label className="text-white text-sm">Fecha</label>
                <Input type="date" className="bg-[#1d2834] border-[#305176] text-white w-32" />
              </div>
              <div className="space-y-2">
                <label className="text-white text-sm">Hora</label>
                <Input type="time" className="bg-[#1d2834] border-[#305176] text-white w-24" />
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
                <Button className="bg-[#aff606] text-black hover:bg-[#25d03f]">Agendar Partido</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Past Matches */}
      {!showScheduleForm && (
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
                    <SelectItem value="" className="text-white text-xs">
                      Todos
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
                  <SelectTrigger className="w-24 h-8 bg-[#1d2834] border-[#305176] text-white text-xs">
                    <SelectValue placeholder="Lugar" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#213041] border-[#305176]">
                    <SelectItem value="" className="text-white text-xs">
                      Todos
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
                    <SelectItem value="" className="text-white text-xs">
                      Todos
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
              {filteredMatches.map((match) => (
                <div key={match.id} className="p-4 bg-[#1d2834] rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-center">
                      <div className="text-white font-bold text-lg">VS</div>
                      <div className="text-xs text-gray-400">{match.tournament}</div>
                    </div>
                    <Badge
                      className={match.location === "Local" ? "bg-[#25d03f] text-black" : "bg-[#ea3498] text-white"}
                    >
                      {match.location}
                    </Badge>
                  </div>

                  <div className="mb-3">
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

                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full border-[#aff606] text-[#aff606] hover:bg-[#aff606] hover:text-black bg-transparent"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Estadísticas
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
