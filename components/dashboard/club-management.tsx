"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Upload, Plus, Search, Filter, Edit, Trash2, Cross, Users, X } from "lucide-react"
import Image from 'next/image'

export function ClubManagement() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingPlayer, setEditingPlayer] = useState<any>(null)
  const [newPlayer, setNewPlayer] = useState({
    firstName: "",
    lastName: "",
    nickname: "",
    birthDate: "",
    phoneNumber: "",
    position: "",
    foot: "",
    category: "primera",
    photo: null,
    status: "DISPONIBLE",
  })
  const [showCreateCategory, setShowCreateCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryColor, setNewCategoryColor] = useState("#aff606")


  const colorsOption = [
    "#aff606",
    "#33d9f6",
    "#f4c11a",
    "#ea3498",
    "#25d03f",
    "#8a46c5",
    "#ff6b35",
    "#4ecdc4",
    "#45b7d1",
    "#96ceb4",
  ]


  const [categories, setCategories] = useState([
    { id: "all", name: "Todas las categorías", playerCount: 65, color: "#213041" },
    { id: "primera", name: "Primera División", playerCount: 25, color: "#aff606" },
    { id: "tercera", name: "Tercera División", playerCount: 18, color: "#33d9f6" },
    { id: "juveniles", name: "Juveniles", playerCount: 22, color: "#f4c11a" },
  ])

  const positions = ["Arquero", "Defensor", "Mediocampista", "Delantero"]
  const feet = ["Derecho", "Izquierdo", "Ambidiestro"]

  const generatePlayers = () => {
    const firstNames = ["Juan", "Carlos", "Miguel", "Roberto", "Diego", "Fernando", "Alejandro", "Sebastián", "Martín", "Pablo", "Gonzalo", "Nicolás", "Facundo", "Matías", "Lucas", "Tomás", "Agustín", "Franco", "Ignacio", "Maximiliano", "Santiago", "Joaquín", "Emiliano", "Valentín", "Thiago"]
    const lastNames = ["García", "Rodríguez", "González", "Fernández", "López", "Martínez", "Sánchez", "Pérez", "Gómez", "Martín", "Jiménez", "Ruiz", "Hernández", "Díaz", "Moreno", "Muñoz", "Álvarez", "Romero", "Alonso", "Gutiérrez", "Navarro", "Torres", "Domínguez", "Vázquez", "Ramos"]
    const nicknames = ["Checo", "Toto", "Pipa", "Chino", "Flaco", "Gordo", "Ruso", "Turco", "Negro", "Rubio", "Pelado", "Chiqui", "Tano", "Mono", "Loco", "Pato", "Gato", "Oso", "León", "Tigre", "Lobo", "Colo", "Nacho", "Maxi", "Santi"]

    const players = []
    let playerId = 1

    const categoryMap = {
      "primera": { name: "Primera División", count: 25 },
      "tercera": { name: "Tercera División", count: 18 },
      "juveniles": { name: "Juveniles", count: 22 },
    }

    for (const categoryId in categoryMap) {
      for (let i = 0; i < categoryMap[categoryId].count; i++) {
        const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)]
        const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)]
        const randomNickname = nicknames[Math.floor(Math.random() * nicknames.length)]
        const randomPosition = positions[Math.floor(Math.random() * positions.length)]
        const randomFoot = feet[Math.floor(Math.random() * feet.length)]
        const randomYear = 1990 + Math.floor(Math.random() * 15)
        const randomMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0")
        const randomDay = String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")
        const isInjured = Math.random() < 0.1
        const randomPhone = `+54 9 11 ${Math.floor(Math.random() * 10000)}-${Math.floor(Math.random() * 10000)}`

        players.push({
          id: playerId++,
          firstName: randomFirstName,
          lastName: randomLastName,
          nickname: randomNickname,
          birthDate: `${randomYear}-${randomMonth}-${randomDay}`,
          phoneNumber: randomPhone,
          position: randomPosition,
          foot: randomFoot,
          status: isInjured ? "LESIONADO" : "DISPONIBLE",
          category: categoryId,
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
    }
    return players
  }
  
  const [players, setPlayers] = useState(generatePlayers())
  const filteredPlayers = allPlayers.filter((player) => {
    const matchesSearch =
      player.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.nickname.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === "all" || player.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const handleCreatePlayer = () => {
    if (newPlayer.firstName && newPlayer.lastName && newPlayer.position) {
      const player = {
        id: players.length + 1,
        ...newPlayer,
      }
      setPlayers([...players, player])
      setNewPlayer({
        firstName: "",
        lastName: "",
        nickname: "",
        birthDate: "",
        phoneNumber: "",
        position: "",
        foot: "",
        category: "primera",
        photo: null,
        status: "DISPONIBLE",
      })
      setShowCreateForm(false)
    }
  }

  const handleEditPlayer = (player: any) => {
    setEditingPlayer(player)
    setNewPlayer({
      firstName: player.firstName,
      lastName: player.lastName,
      nickname: player.nickname,
      birthDate: player.birthDate,
      phoneNumber: player.phoneNumber,
      position: player.position,
      foot: player.foot,
      category: player.category,
      photo: player.photo,
      status: player.status,
    })
    setShowCreateForm(true)
  }

  const handleUpdatePlayer = () => {
    if (editingPlayer) {
      setPlayers(players.map((p) => (p.id === editingPlayer.id ? { ...p, ...newPlayer } : p)))
      setEditingPlayer(null)
      setShowCreateForm(false)
      setNewPlayer({
        firstName: "",
        lastName: "",
        nickname: "",
        birthDate: "",
        phoneNumber: "",
        position: "",
        foot: "",
        category: "primera",
        photo: null,
        status: "DISPONIBLE",
      })
    }
  }

  const handleDeletePlayer = (id: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar este jugador?")) {
      setPlayers(players.filter((p) => p.id !== id))
    }
  }

  const handleCancelForm = () => {
    setShowCreateForm(false)
    setEditingPlayer(null)
    setNewPlayer({
      firstName: "",
      lastName: "",
      nickname: "",
      birthDate: "",
      phoneNumber: "",
      position: "",
      foot: "",
      category: "primera",
      photo: null,
      status: "DISPONIBLE",
    })
  }

  const handleCreateCategory = () => {
    if (newCategoryName.trim()) {
      const newCat = {
        id: newCategoryName.toLowerCase().replace(/\s/g, ''),
        name: newCategoryName,
        playerCount: 0,
        color: newCategoryColor,
      }
      setCategories([...categories, newCat])
      setNewCategoryName("")
      setNewCategoryColor("#aff606")
      setShowCreateCategory(false)
    }
  }

  const colorsOption = [
    "#aff606",
    "#33d9f6",
    "#f4c11a",
    "#ea3498",
    "#25d03f",
    "#8a46c5",
    "#ff6b35",
    "#4ecdc4",
    "#45b7d1",
    "#96ceb4",
  ]


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">CLUB</h2>
          <p className="text-gray-400">Información general del club</p>
        </div>
        {!showCreateForm && (
          <Button className="bg-[#aff606] text-black hover:bg-[#25d03f]" onClick={() => setShowCreateForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Jugador
          </Button>
        )}
      </div>

      {showCreateForm ? (
        <Card className="bg-[#213041] border-[#305176]">
          <CardHeader>
            <CardTitle className="text-white">{editingPlayer ? "Editar Jugador" : "Nuevo Jugador"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Nombre</Label>
                <Input
                  value={newPlayer.firstName}
                  onChange={(e) => setNewPlayer({ ...newPlayer, firstName: e.target.value })}
                  placeholder="Nombre"
                  className="bg-[#1d2834] border-[#305176] text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Apellido</Label>
                <Input
                  value={newPlayer.lastName}
                  onChange={(e) => setNewPlayer({ ...newPlayer, lastName: e.target.value })}
                  placeholder="Apellido"
                  className="bg-[#1d2834] border-[#305176] text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Apodo</Label>
                <Input
                  value={newPlayer.nickname}
                  onChange={(e) => setNewPlayer({ ...newPlayer, nickname: e.target.value })}
                  placeholder="Apodo"
                  className="bg-[#1d2834] border-[#305176] text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Posición</Label>
                <Select
                  value={newPlayer.position}
                  onValueChange={(value) => setNewPlayer({ ...newPlayer, position: value })}
                >
                  <SelectTrigger className="bg-[#1d2834] border-[#305176] text-white">
                    <SelectValue placeholder="Seleccionar posición" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#213041] border-[#305176]">
                    {positions.map((pos) => (
                      <SelectItem key={pos} value={pos} className="text-white">
                        {pos}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-white">Pierna Hábil</Label>
                <Select value={newPlayer.foot} onValueChange={(value) => setNewPlayer({ ...newPlayer, foot: value })}>
                  <SelectTrigger className="bg-[#1d2834] border-[#305176] text-white">
                    <SelectValue placeholder="Seleccionar pierna" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#213041] border-[#305176]">
                    {feet.map((foot) => (
                      <SelectItem key={foot} value={foot} className="text-white">
                        {foot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-white">Categoría</Label>
                <Select
                  value={newPlayer.category}
                  onValueChange={(value) => setNewPlayer({ ...newPlayer, category: value })}
                >
                  <SelectTrigger className="bg-[#1d2834] border-[#305176] text-white">
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#213041] border-[#305176]">
                    {categories.filter(c => c.id !== "all").map((cat) => (
                      <SelectItem key={cat.id} value={cat.id} className="text-white">
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Fecha de Nacimiento</Label>
                <Input
                  type="date"
                  value={newPlayer.birthDate}
                  onChange={(e) => setNewPlayer({ ...newPlayer, birthDate: e.target.value })}
                  className="bg-[#1d2834] border-[#305176] text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Número de celular</Label>
                <Input
                  type="tel"
                  value={newPlayer.phoneNumber}
                  onChange={(e) => setNewPlayer({ ...newPlayer, phoneNumber: e.target.value })}
                  placeholder="Ej: +54 9 11 1234-5678"
                  className="bg-[#1d2834] border-[#305176] text-white"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:justify-between md:space-x-4 space-y-4 md:space-y-0">
              <div className="space-y-2 flex-1">
                <Label className="text-white">Foto del Jugador</Label>
                <div className="flex items-center space-x-4">
                  <div className="w-24 h-24 bg-[#305176] rounded-lg flex items-center justify-center">
                    <Upload className="h-8 w-8 text-gray-400" />
                  </div>
                  <Button variant="outline" className="border-[#305176] text-white hover:bg-[#305176] bg-transparent">
                    Subir Foto
                  </Button>
                </div>
              </div>

              <div className="space-y-2 flex-1">
                <Label className="text-white">Estado</Label>
                <div className="flex space-x-4">
                  <Button
                    variant={newPlayer.status === "DISPONIBLE" ? "default" : "outline"}
                    className={
                      newPlayer.status === "DISPONIBLE"
                        ? "bg-[#25d03f] text-black hover:bg-[#20b136]"
                        : "border-[#25d03f] text-[#25d03f] hover:bg-[#25d03f] hover:text-black bg-transparent"
                    }
                    onClick={() => setNewPlayer({ ...newPlayer, status: "DISPONIBLE" })}
                  >
                    DISPONIBLE
                  </Button>
                  <Button
                    variant={newPlayer.status === "NO DISPONIBLE" ? "default" : "outline"}
                    className={
                      newPlayer.status === "NO DISPONIBLE"
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : "border-red-500 text-red-500 hover:bg-red-500 hover:text-white bg-transparent"
                    }
                    onClick={() => setNewPlayer({ ...newPlayer, status: "NO DISPONIBLE" })}
                  >
                    NO DISPONIBLE
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-between space-x-4">
              <Button
                className="bg-[#aff606] text-black hover:bg-[#25d03f] w-1/2"
                onClick={editingPlayer ? handleUpdatePlayer : handleCreatePlayer}
              >
                {editingPlayer ? "Actualizar" : "Crear"}
              </Button>
              <Button
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white bg-transparent w-1/2"
                onClick={handleCancelForm}
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
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
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Categorías
              </CardTitle>
              <Button
                size="sm"
                className="bg-[#aff606] text-black hover:bg-[#25d03f]"
                onClick={() => setShowCreateCategory(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Nueva Categoría
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {showCreateCategory && (
                <div className="space-y-3 p-3 bg-[#1d2834] rounded-lg">
                  <Input
                    placeholder="Nombre de la categoría"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="bg-[#305176] border-[#305176] text-white"
                  />
                  <div className="flex flex-wrap gap-2">
                    {colorsOption.map((color) => (
                      <button
                        key={color}
                        className={`w-6 h-6 rounded-full border-2 ${
                          newCategoryColor === color ? "border-white" : "border-gray-500"
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setNewCategoryColor(color)}
                      />
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      className="bg-[#aff606] text-black hover:bg-[#25d03f]"
                      onClick={handleCreateCategory}
                    >
                      Crear
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white bg-transparent"
                      onClick={() => setShowCreateCategory(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}
              {categories.map((category) => (
                <div
                  key={category.id}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedCategory === category.id ? "bg-[#305176]" : "bg-[#1d2834] hover:bg-[#305176]"
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <div className="flex items-center space-x-3">
                    {category.id !== "all" && <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }}></div>}
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
                          "{player.nickname}" • {player.position} • {player.foot} • {player.phoneNumber}
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
                      <Button variant="ghost" size="icon" className="text-white hover:text-[#aff606]" onClick={() => handleEditPlayer(player)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:text-red-400"
                        onClick={() => handleDeletePlayer(player.id)}
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
      )}
    </div>
  )
}