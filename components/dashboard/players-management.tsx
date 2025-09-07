"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Search, Filter, Edit, Trash2, Cross, Upload, X } from "lucide-react"

export function PlayersManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showMedicalInfo, setShowMedicalInfo] = useState<number | null>(null)
  const [editingPlayer, setEditingPlayer] = useState<any>(null)

  const [newPlayer, setNewPlayer] = useState({
    firstName: "",
    lastName: "",
    nickname: "",
    birthDate: "",
    position: "",
    foot: "",
    categories: [],
    photo: null,
    status: "DISPONIBLE",
  })

  const categories = [
    { id: "primera", name: "Primera División" },
    { id: "tercera", name: "Tercera División" },
    { id: "cuarta", name: "Cuarta División" },
    { id: "quinta", name: "Quinta División" },
    { id: "sexta", name: "Sexta División" },
    { id: "septima", name: "Séptima División" },
    { id: "octava", name: "Octava División" },
  ]

  const positions = ["Arquero", "Defensor", "Mediocampista", "Delantero"]
  const feet = ["Derecho", "Izquierdo", "Ambidiestro"]

  // Generar 25 jugadores por categoría
  const generatePlayers = () => {
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
    const nicknames = [
      "Checo",
      "Toto",
      "Pipa",
      "Chino",
      "Flaco",
      "Gordo",
      "Ruso",
      "Turco",
      "Negro",
      "Rubio",
      "Pelado",
      "Chiqui",
      "Tano",
      "Mono",
      "Loco",
      "Pato",
      "Gato",
      "Oso",
      "León",
      "Tigre",
      "Lobo",
      "Colo",
      "Nacho",
      "Maxi",
      "Santi",
    ]

    const players = []
    let playerId = 1

    categories.forEach((category) => {
      for (let i = 0; i < 25; i++) {
        const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)]
        const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)]
        const randomNickname = nicknames[Math.floor(Math.random() * nicknames.length)]
        const randomPosition = positions[Math.floor(Math.random() * positions.length)]
        const randomFoot = feet[Math.floor(Math.random() * feet.length)]
        const randomYear = 1990 + Math.floor(Math.random() * 15)
        const randomMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0")
        const randomDay = String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")

        // 90% disponibles, 10% lesionados
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
          categories: [category.id],
          photo: `/placeholder.svg?height=40&width=40`,
          injury: isInjured
            ? {
                type: ["Lesión de rodilla", "Desgarro muscular", "Esguince de tobillo", "Contractura"][
                  Math.floor(Math.random() * 4)
                ],
                date: "2024-01-05",
                recovery: ["2-3 semanas", "3-4 semanas", "1-2 semanas", "4-6 semanas"][Math.floor(Math.random() * 4)],
              }
            : null,
        })
      }
    })

    return players
  }

  const [players, setPlayers] = useState(generatePlayers())

  // Obtener el perfil del usuario
  const savedProfile = typeof window !== "undefined" ? localStorage.getItem("userProfile") : null
  const profileData = savedProfile ? JSON.parse(savedProfile) : null
  const isKinesiologist = profileData?.role === "KINESIOLOGO"

  const filteredPlayers = players.filter((player) => {
    const matchesSearch =
      player.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.nickname.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = selectedCategory === "all" || player.categories.includes(selectedCategory)

    // Filtrar por categoría del usuario si está definida
    const userCategory = profileData?.category
    const matchesUserCategory = !userCategory || player.categories.includes(userCategory)

    return matchesSearch && matchesCategory && matchesUserCategory
  })

  const handleCreatePlayer = () => {
    if (newPlayer.firstName && newPlayer.lastName && newPlayer.position) {
      const player = {
        id: players.length + 1,
        ...newPlayer,
        categories: newPlayer.categories.length > 0 ? newPlayer.categories : [profileData?.category || "primera"],
      }
      setPlayers([...players, player])
      setNewPlayer({
        firstName: "",
        lastName: "",
        nickname: "",
        birthDate: "",
        position: "",
        foot: "",
        categories: [],
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
      position: player.position,
      foot: player.foot,
      categories: player.categories,
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
        position: "",
        foot: "",
        categories: [],
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

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    if (checked) {
      setNewPlayer({
        ...newPlayer,
        categories: [...newPlayer.categories, categoryId],
      })
    } else {
      setNewPlayer({
        ...newPlayer,
        categories: newPlayer.categories.filter((c) => c !== categoryId),
      })
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
      position: "",
      foot: "",
      categories: [],
      photo: null,
      status: "DISPONIBLE",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Jugadores</h2>
          <p className="text-gray-400">Administra la información de todos los jugadores</p>
        </div>
        {!showCreateForm && (
          <Button className="bg-[#aff606] text-black hover:bg-[#25d03f]" onClick={() => setShowCreateForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Jugador
          </Button>
        )}
      </div>

      {/* Create/Edit Player Form */}
      {showCreateForm && (
        <Card className="bg-[#213041] border-[#305176]">
          <CardHeader>
            <CardTitle className="text-white">{editingPlayer ? "Editar Jugador" : "Nuevo Jugador"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Apodo</Label>
                <Input
                  value={newPlayer.nickname}
                  onChange={(e) => setNewPlayer({ ...newPlayer, nickname: e.target.value })}
                  placeholder="Apodo"
                  className="bg-[#1d2834] border-[#305176] text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Fecha de Nacimiento</Label>
                <Input
                  type="date"
                  value={newPlayer.birthDate}
                  onChange={(e) => setNewPlayer({ ...newPlayer, birthDate: e.target.value })}
                  className="bg-[#1d2834] border-[#305176] text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>

            <div className="space-y-2">
              <Label className="text-white">Categorías</Label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <label key={cat.id} className="flex items-center space-x-2 text-white">
                    <input
                      type="checkbox"
                      checked={newPlayer.categories.includes(cat.id)}
                      onChange={(e) => handleCategoryChange(cat.id, e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Foto del Jugador</Label>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-[#305176] rounded-lg flex items-center justify-center">
                  <Upload className="h-6 w-6 text-gray-400" />
                </div>
                <Button variant="outline" className="border-[#305176] text-white hover:bg-[#305176] bg-transparent">
                  Subir Foto
                </Button>
              </div>
            </div>

            <div className="space-y-2">
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

            <div className="flex flex-col space-y-2">
              <Button
                className="bg-[#aff606] text-black hover:bg-[#25d03f]"
                onClick={editingPlayer ? handleUpdatePlayer : handleCreatePlayer}
              >
                {editingPlayer ? "Actualizar" : "Crear"}
              </Button>
              <Button
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white bg-transparent"
                onClick={handleCancelForm}
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Medical Info Modal */}
      {showMedicalInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="bg-[#213041] border-[#305176] w-full max-w-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-white text-sm">Información Médica</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-red-400 h-6 w-6"
                onClick={() => setShowMedicalInfo(null)}
              >
                <X className="h-3 w-3" />
              </Button>
            </CardHeader>
            <CardContent className="pt-2">
              {(() => {
                const player = players.find((p) => p.id === showMedicalInfo)
                return player?.injury ? (
                  <div className="space-y-2 text-xs">
                    <div>
                      <p className="text-gray-400">Fecha:</p>
                      <p className="text-white">{player.injury.date}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Lesión:</p>
                      <p className="text-white">{player.injury.type}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Recuperación:</p>
                      <p className="text-white">{player.injury.recovery}</p>
                    </div>
                    {isKinesiologist && (
                      <Button size="sm" className="w-full bg-[#aff606] text-black hover:bg-[#25d03f] mt-3">
                        Editar
                      </Button>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-400 text-xs">No hay información médica</p>
                )
              })()}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      {!showCreateForm && (
        <Card className="bg-[#213041] border-[#305176]">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
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
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48 bg-[#1d2834] border-[#305176] text-white">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Categoría" />
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
          </CardContent>
        </Card>
      )}

      {/* Players List */}
      {!showCreateForm && (
        <Card className="bg-[#213041] border-[#305176]">
          <CardHeader>
            <CardTitle className="text-white">Jugadores ({filteredPlayers.length})</CardTitle>
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

                    {/* Cruz médica - solo visible para jugadores lesionados */}
                    {player.status === "LESIONADO" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:text-[#f4c11a]"
                        title="Historial Médico"
                        onClick={() => setShowMedicalInfo(player.id)}
                      >
                        <Cross className="h-4 w-4" />
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:text-[#aff606]"
                      onClick={() => handleEditPlayer(player)}
                    >
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
      )}
    </div>
  )
}
