"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload } from "lucide-react"

export function ClubManagement() {
  const [clubData, setClubData] = useState({
    name: "Amigos de Villa Luro",
    abbreviation: "AVL",
    logo: null,
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Mi Club</h2>
        <p className="text-gray-400">Información del club</p>
      </div>

      {/* Club Information */}
      <Card className="bg-[#213041] border-[#305176]">
        <CardHeader>
          <CardTitle className="text-white">Información del Club</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="club-name" className="text-white">
                Nombre del Club
              </Label>
              <Input
                id="club-name"
                placeholder="Ej: Club Atlético Independiente"
                className="bg-[#1d2834] border-[#305176] text-white"
                value={clubData.name}
                onChange={(e) => setClubData({ ...clubData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="club-abbr" className="text-white">
                Abreviatura
              </Label>
              <Input
                id="club-abbr"
                placeholder="Ej: CAI"
                className="bg-[#1d2834] border-[#305176] text-white"
                value={clubData.abbreviation}
                onChange={(e) => setClubData({ ...clubData, abbreviation: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-white">Escudo del Club</Label>
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-[#305176] rounded-lg flex items-center justify-center">
                <Upload className="h-8 w-8 text-gray-400" />
              </div>
              <Button className="bg-[#aff606] text-black hover:bg-[#25d03f]">Subir Escudo</Button>
            </div>
          </div>

          <Button className="bg-[#aff606] text-black hover:bg-[#25d03f]">Guardar Información</Button>
        </CardContent>
      </Card>
    </div>
  )
}
