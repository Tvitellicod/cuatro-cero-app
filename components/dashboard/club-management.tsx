"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Upload, Plus, Search, Filter, Edit, Trash2, Cross, Users } from "lucide-react"
import Image from 'next/image'

export function ClubManagement() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const [categories, setCategories] = useState([
    { id: "primera", name: "Primera División", playerCount: 25, color: "#aff606" },
    { id: "tercera", name: "Tercera División", playerCount: 18, color: "#33d9f6" },
    { id: "juveniles", name: "Juveniles", playerCount: 22, color: "#f4c11a" },
  ])

  // Generar 25 jugadores por categoría
  const generatePlayers = () => {
    const firstNames = ["Juan", "Carlos", "Miguel", "Roberto", "Diego", "Fernando", "Alejandro", "Sebastián", "Martín", "Pablo", "Gonzalo", "Nicolás", "Facundo", "Matías", "Lucas", "Tomás", "Agustín", "Franco", "Ignacio", "Maximiliano", "Santiago", "Joaquín", "Emiliano", "Valentín", "Thiago"]
    const lastNames = ["García", "Rodríguez", "González", "Fernández", "López", "Martínez", "Sánchez", "Pérez", "Gómez", "Martín", "Jiménez", "Ruiz", "Hernández", "Díaz", "Moreno", "Muñoz", "Álvarez", "Romero", "Alonso", "Gutiérrez", "Navarro", "Torres", "Domínguez", "Vázquez", "Ramos"]
    const nicknames = ["Checo", "Toto", "Pipa", "Chino", "Flaco", "Gordo", "Ruso", "Turco", "Negro", "Rubio", "Pelado", "Chiqui", "Tano", "Mono", "Loco", "Pato", "Gato", "Oso", "León", "Tigre", "Lobo", "Colo", "Nacho", "Maxi", "Santi"]
    const positions = ["Arquero", "Defensor", "Mediocampista", "Delantero"]
    const feet = ["Derecho", "Izquierdo", "Ambidiestro"]

    const players = []
    let playerId = 1

    categories.forEach((category) => {
      for (let i = 0; i < category.playerCount; i++) {
        const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)]
        const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)]
        const randomNickname = nicknames[Math.floor(Math.random() * nicknames.length)]
        const randomPosition = positions[Math.floor(Math.random() * positions.length)]
        const randomFoot = feet[Math.floor(Math.random() * feet.length)]
        const randomYear = 1990 + Math.floor(Math.random() * 15)
        const randomMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0")
        const randomDay = String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")

        const isInjured = Math.random() < 0.1

        players.push({
          id: playerId++,
          firstName: randomFirstName,
          lastName: randomLastName,
          nickname: randomNickname,
          birthDate: `${randomYear}-${randomMonth}-${randomDay}`,
          position: randomPosition,
          foot: randomFoot,
          status: isInjured ? "LESIONADO" : "DISPONIBLE",
          category: category.id,
          photo: `/placeholder-user.jpg`,
          injury: isInjured
            ? {
                type: ["Lesión de rodilla", "Desgarro muscular", "Esguince de tobillo", "Contractura"][Math.floor(Math.random() * 4)],
                date: "2024-01-05",
                recovery: ["2-3 semanas", "3-4 semanas", "1-2 semanas", "4-6 semanas"][Math.floor(Math.random() * 4)],
              }
            : null,
        })
      }
    })

    return players
  }

  const allPlayers = generatePlayers()

  const filteredPlayers = allPlayers.filter((player) => {
    const matchesSearch =
      player.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.nickname.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === "all" || player.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">CLUB</h2>
          <p className="text-gray-400">Información general del club</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel de información del Club y Categorías */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-[#213041] border-[#305176]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-white">Panel General</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <div className="relative w-20 h-20 bg-[#305176] rounded-lg flex items-center justify-center overflow-hidden">
                  <Image
                    src="/images/cuatro-cero-logo.png"
                    alt="Escudo del club"
                    width={80}
                    height={80}
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-white font-medium text-lg">Amigos de Villa Luro</h3>
                  <p className="text-gray-400 text-sm">AVL</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#213041] border-[#305176]">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Categorías
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div
                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedCategory === "all" ? "bg-[#305176]" : "bg-[#1d2834] hover:bg-[#305176]"
                }`}
                onClick={() => setSelectedCategory("all")}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-white font-medium">Todas las categorías</span>
                </div>
                <Badge variant="secondary" className="bg-[#305176] text-gray-300">
                  {allPlayers.length}
                </Badge>
              </div>
              {categories.map((category) => (
                <div
                  key={category.id}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedCategory === category.id ? "bg-[#305176]" : "bg-[#1d2834] hover:bg-[#305176]"
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }}></div>
                    <span className="text-white font-medium">{category.name}</span>
                  </div>
                  <Badge variant="secondary" className="bg-[#305176] text-gray-300">
                    {category.playerCount}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Lista de Jugadores */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-[#213041] border-[#305176]">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle className="text-white">
                  Jugadores ({filteredPlayers.length}) {selectedCategory !== "all" && `- ${categories.find(c => c.id === selectedCategory)?.name}`}
                </CardTitle>
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar jugadores..."
                      className="pl-10 bg-[#1d2834] border-[#305176] text-white"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredPlayers.map((player) => (
                  <div key={player.id} className="flex items-center justify-between p-4 bg-[#1d2834] rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={player.photo || "/placeholder.svg"} alt={player.firstName} />
                        <AvatarFallback className="bg-[#305176] text-white">
                          {player.firstName[0]}
                          {player.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-white font-medium">
                          {player.firstName} {player.lastName}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          "{player.nickname}" • {player.position} • {player.foot}
                        </p>
                        <p className="text-gray-500 text-xs">Estado: {player.status}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge
                        className={
                          player.status === "DISPONIBLE"
                            ? "bg-[#25d03f] text-black"
                            : player.status === "LESIONADO"
                              ? "bg-orange-500 text-white"
                              : "bg-red-500 text-white"
                        }
                      >
                        {player.status}
                      </Badge>
                      <Button variant="ghost" size="icon" className="text-white hover:text-[#aff606]">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 