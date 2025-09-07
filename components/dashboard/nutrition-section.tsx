"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Apple, FileText, Scale, Activity } from "lucide-react"

export function NutritionSection() {
  const [selectedCategory, setSelectedCategory] = useState("")
  const [showReportForm, setShowReportForm] = useState(false)
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null)

  const categories = [
    { id: "primera", name: "Primera División", playerCount: 25 },
    { id: "tercera", name: "Tercera División", playerCount: 18 },
    { id: "juveniles", name: "Juveniles", playerCount: 22 },
  ]

  const players = [
    {
      id: 1,
      name: "Juan Carlos",
      surname: "Pérez",
      position: "Delantero",
      category: "Primera División",
      photo: "/placeholder.svg?height=40&width=40",
      lastReport: "2024-01-10",
    },
    {
      id: 2,
      name: "Miguel Ángel",
      surname: "González",
      position: "Mediocampista",
      category: "Primera División",
      photo: "/placeholder.svg?height=40&width=40",
      lastReport: "2024-01-08",
    },
    {
      id: 3,
      name: "Roberto",
      surname: "Silva",
      position: "Defensor",
      category: "Tercera División",
      photo: "/placeholder.svg?height=40&width=40",
      lastReport: "2024-01-05",
    },
  ]

  const filteredPlayers = selectedCategory
    ? players.filter((player) => player.category === categories.find((c) => c.id === selectedCategory)?.name)
    : players

  const handleCreateReport = (player: any) => {
    setSelectedPlayer(player)
    setShowReportForm(true)
  }

  const handleSaveReport = () => {
    setShowReportForm(false)
    setSelectedPlayer(null)
    // Aquí se guardaría el reporte
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Nutrición</h2>
        <p className="text-gray-400">Gestión nutricional de los jugadores</p>
      </div>

      {!showReportForm ? (
        <>
          {/* Selector de Categoría */}
          <Card className="bg-[#213041] border-[#305176]">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <Label className="text-white">Filtrar por categoría:</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-64 bg-[#1d2834] border-[#305176] text-white">
                    <SelectValue placeholder="Todas las categorías" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#213041] border-[#305176]">
                    <SelectItem value="" className="text-white">
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

          {/* Lista de Jugadores */}
          <Card className="bg-[#213041] border-[#305176]">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Apple className="h-5 w-5 mr-2" />
                Jugadores ({filteredPlayers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredPlayers.map((player) => (
                  <div key={player.id} className="flex items-center justify-between p-4 bg-[#1d2834] rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={player.photo || "/placeholder.svg"} alt={player.name} />
                        <AvatarFallback className="bg-[#305176] text-white">
                          {player.name[0]}
                          {player.surname[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-white font-medium">
                          {player.name} {player.surname}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {player.position} • {player.category}
                        </p>
                        <p className="text-gray-500 text-xs">Último reporte: {player.lastReport}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Button
                        size="sm"
                        className="bg-[#aff606] text-black hover:bg-[#25d03f]"
                        onClick={() => handleCreateReport(player)}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Informe
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        /* Formulario de Reporte Nutricional */
        <Card className="bg-[#213041] border-[#305176]">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Informe Nutricional - {selectedPlayer?.name} {selectedPlayer?.surname}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Datos Antropométricos */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Scale className="h-5 w-5 mr-2" />
                Datos Antropométricos
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight" className="text-white">
                    Peso (kg)
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="75.5"
                    className="bg-[#1d2834] border-[#305176] text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height" className="text-white">
                    Altura (cm)
                  </Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="180"
                    className="bg-[#1d2834] border-[#305176] text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="body-fat" className="text-white">
                    Grasa Corporal (%)
                  </Label>
                  <Input
                    id="body-fat"
                    type="number"
                    placeholder="12.5"
                    className="bg-[#1d2834] border-[#305176] text-white"
                  />
                </div>
              </div>
            </div>

            {/* Composición Corporal */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Composición Corporal
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="muscle-mass" className="text-white">
                    Masa Muscular (kg)
                  </Label>
                  <Input
                    id="muscle-mass"
                    type="number"
                    placeholder="65.2"
                    className="bg-[#1d2834] border-[#305176] text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bmi" className="text-white">
                    IMC
                  </Label>
                  <Input
                    id="bmi"
                    type="number"
                    placeholder="23.3"
                    className="bg-[#1d2834] border-[#305176] text-white"
                  />
                </div>
              </div>
            </div>

            {/* Suplementación */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Suplementación</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">¿Necesita proteína?</Label>
                  <Select>
                    <SelectTrigger className="bg-[#1d2834] border-[#305176] text-white">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#213041] border-[#305176]">
                      <SelectItem value="si" className="text-white">
                        Sí
                      </SelectItem>
                      <SelectItem value="no" className="text-white">
                        No
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supplements" className="text-white">
                    Otros suplementos
                  </Label>
                  <Input
                    id="supplements"
                    placeholder="Creatina, Vitamina D..."
                    className="bg-[#1d2834] border-[#305176] text-white"
                  />
                </div>
              </div>
            </div>

            {/* Recomendaciones */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Recomendaciones</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="diet-plan" className="text-white">
                    Plan Alimentario
                  </Label>
                  <Textarea
                    id="diet-plan"
                    placeholder="Describe el plan alimentario recomendado..."
                    className="bg-[#1d2834] border-[#305176] text-white min-h-[100px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hydration" className="text-white">
                    Hidratación
                  </Label>
                  <Textarea
                    id="hydration"
                    placeholder="Recomendaciones de hidratación..."
                    className="bg-[#1d2834] border-[#305176] text-white min-h-[80px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="observations" className="text-white">
                    Observaciones
                  </Label>
                  <Textarea
                    id="observations"
                    placeholder="Observaciones adicionales..."
                    className="bg-[#1d2834] border-[#305176] text-white min-h-[80px]"
                  />
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                className="border-[#305176] text-white hover:bg-[#305176] bg-transparent"
                onClick={() => setShowReportForm(false)}
              >
                Cancelar
              </Button>
              <Button className="bg-[#aff606] text-black hover:bg-[#25d03f]" onClick={handleSaveReport}>
                Guardar Informe
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
