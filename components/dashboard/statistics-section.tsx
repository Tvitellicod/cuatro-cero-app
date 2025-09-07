"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, Users, Target, Filter } from "lucide-react"

export function StatisticsSection() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedPlayer, setSelectedPlayer] = useState("all")
  const [selectedPeriod, setSelectedPeriod] = useState("all")
  const [selectedAction, setSelectedAction] = useState("all")

  const categories = [
    { id: "primera", name: "Primera División" },
    { id: "tercera", name: "Tercera División" },
    { id: "juveniles", name: "Juveniles" },
  ]

  const players = [
    { id: "1", name: "Juan Carlos Pérez" },
    { id: "2", name: "Miguel Ángel González" },
    { id: "3", name: "Roberto Silva" },
  ]

  const gameActions = [
    "Goles",
    "Asistencias",
    "Tarjetas Amarillas",
    "Tarjetas Rojas",
    "Faltas",
    "Corners",
    "Tiros al Arco",
    "Pases Completados",
  ]

  const generalStats = [
    {
      title: "Total Partidos",
      value: "24",
      icon: Target,
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

  const playerStats = [
    {
      name: "Juan Carlos Pérez",
      position: "Delantero",
      matches: 18,
      goals: 12,
      assists: 5,
      yellowCards: 2,
      redCards: 0,
    },
    {
      name: "Miguel Ángel González",
      position: "Mediocampista",
      matches: 20,
      goals: 3,
      assists: 8,
      yellowCards: 4,
      redCards: 1,
    },
    {
      name: "Roberto Silva",
      position: "Defensor",
      matches: 15,
      goals: 1,
      assists: 2,
      yellowCards: 3,
      redCards: 0,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Estadísticas</h2>
        <p className="text-gray-400">Análisis completo del rendimiento del equipo</p>
      </div>

      {/* Filtros */}
      <Card className="bg-[#213041] border-[#305176]">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-white text-sm mb-2 block">Categoría</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-[#1d2834] border-[#305176] text-white">
                  <SelectValue placeholder="Todas las categorías" />
                </SelectTrigger>
                <SelectContent className="bg-[#213041] border-[#305176]">
                  <SelectItem value="all" className="text-white">
                    Todas las categorías
                  </SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id} className="text-white">
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-white text-sm mb-2 block">Jugador</label>
              <Select value={selectedPlayer} onValueChange={setSelectedPlayer}>
                <SelectTrigger className="bg-[#1d2834] border-[#305176] text-white">
                  <SelectValue placeholder="Todos los jugadores" />
                </SelectTrigger>
                <SelectContent className="bg-[#213041] border-[#305176]">
                  <SelectItem value="all" className="text-white">
                    Todos los jugadores
                  </SelectItem>
                  {players.map((player) => (
                    <SelectItem key={player.id} value={player.id} className="text-white">
                      {player.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-white text-sm mb-2 block">Acción de Juego</label>
              <Select value={selectedAction} onValueChange={setSelectedAction}>
                <SelectTrigger className="bg-[#1d2834] border-[#305176] text-white">
                  <SelectValue placeholder="Todas las acciones" />
                </SelectTrigger>
                <SelectContent className="bg-[#213041] border-[#305176]">
                  <SelectItem value="all" className="text-white">
                    Todas las acciones
                  </SelectItem>
                  {gameActions.map((action) => (
                    <SelectItem key={action} value={action} className="text-white">
                      {action}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-white text-sm mb-2 block">Tiempo de Partido</label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="bg-[#1d2834] border-[#305176] text-white">
                  <SelectValue placeholder="Todo el partido" />
                </SelectTrigger>
                <SelectContent className="bg-[#213041] border-[#305176]">
                  <SelectItem value="all" className="text-white">
                    Todo el partido
                  </SelectItem>
                  <SelectItem value="first" className="text-white">
                    Primer Tiempo
                  </SelectItem>
                  <SelectItem value="second" className="text-white">
                    Segundo Tiempo
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

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

      {/* Estadísticas por Jugador */}
      <Card className="bg-[#213041] border-[#305176]">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Estadísticas por Jugador
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#305176]">
                  <th className="text-left text-white font-medium py-3">Jugador</th>
                  <th className="text-left text-white font-medium py-3">Posición</th>
                  <th className="text-center text-white font-medium py-3">Partidos</th>
                  <th className="text-center text-white font-medium py-3">Goles</th>
                  <th className="text-center text-white font-medium py-3">Asistencias</th>
                  <th className="text-center text-white font-medium py-3">T. Amarillas</th>
                  <th className="text-center text-white font-medium py-3">T. Rojas</th>
                </tr>
              </thead>
              <tbody>
                {playerStats.map((player, index) => (
                  <tr key={index} className="border-b border-[#305176] hover:bg-[#1d2834]">
                    <td className="py-3">
                      <div>
                        <p className="text-white font-medium">{player.name}</p>
                      </div>
                    </td>
                    <td className="py-3">
                      <Badge variant="secondary" className="bg-[#305176] text-gray-300">
                        {player.position}
                      </Badge>
                    </td>
                    <td className="text-center py-3 text-gray-300">{player.matches}</td>
                    <td className="text-center py-3 text-[#25d03f] font-bold">{player.goals}</td>
                    <td className="text-center py-3 text-[#aff606] font-bold">{player.assists}</td>
                    <td className="text-center py-3 text-[#f4c11a] font-bold">{player.yellowCards}</td>
                    <td className="text-center py-3 text-[#ea3498] font-bold">{player.redCards}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas por Categoría */}
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
    </div>
  )
}
