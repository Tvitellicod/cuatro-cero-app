// components/dashboard/tournaments-overview.tsx

"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trophy, Calendar, Users, Hash } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useProfile } from "@/hooks/use-profile"


// Definiciones de tipos
interface ClassificationRow {
    pos: number
    team: string
    pj: number
    pg: number
    pe: number
    pp: number
    gf: number
    gc: number
    pts: number
}

interface TournamentMatch {
    date: string
    homeTeam: string
    awayTeam: string
    score: string
    result: "W" | "L" | "D"
}

// ESTADOS INICIALES LIMPIOS
const initialClassification: ClassificationRow[] = [];
const initialCalendar: TournamentMatch[] = [];


export function TournamentsOverview() {
  const { profile, categories } = useProfile();
  const [selectedTournament, setSelectedTournament] = useState("Liga Local");
  const [selectedCategory, setSelectedCategory] = useState(categories.length > 0 ? categories[0].id : "all");

  const [classification, setClassification] = useState<ClassificationRow[]>(initialClassification);
  const [calendar, setCalendar] = useState<TournamentMatch[]>(initialCalendar);
  
  const isAnalyst = profile?.role === "ANALISTA" || profile?.role === "DIRECTOR TECNICO";
  const isTeamStaff = profile?.role !== "DIRECTIVO"; // Todos excepto Directivo


  // Opciones de torneos y categorías
  const tournamentOptions = ["Liga Local", "Copa Regional", "Torneo Amistoso"];
  const categoryOptions = useMemo(() => {
    return categories.map(c => ({ id: c.id, name: c.name }))
  }, [categories]);

  // Manejo de la categoría seleccionada por defecto
  useState(() => {
    if (categories.length > 0 && selectedCategory === "all") {
        setSelectedCategory(categories[0].id);
    }
  });


  // Si no hay categorías, no mostramos nada
  if (categories.length === 0) {
     return (
        <Card className="bg-[#213041] border-[#305176] text-white p-6 text-center">
             <h2 className="text-2xl font-bold mb-2">No hay Torneos disponibles</h2>
             <p className="text-gray-400">Debes crear al menos una categoría en el módulo de Club para usar Torneos.</p>
        </Card>
     );
  }

  // Obtenemos el nombre de la categoría seleccionada
  const currentCategoryName = categories.find(c => c.id === selectedCategory)?.name || "N/A";


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
            <Trophy className="h-6 w-6 mr-2 text-[#f4c11a]" />
            Resumen de Torneos
          </h2>
          <p className="text-gray-400">
            Clasificaciones y calendario de los torneos activos para la categoría seleccionada.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
            <Label className="text-white">Seleccionar Categoría</Label>
            <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
            >
                <SelectTrigger className="w-full bg-[#1d2834] border-[#305176] text-white">
                    <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent className="bg-[#213041] border-[#305176]">
                    {categoryOptions.map(cat => (
                        <SelectItem key={cat.id} value={cat.id} className="text-white">{cat.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
        <div className="space-y-2">
            <Label className="text-white">Seleccionar Torneo</Label>
            <Select
                value={selectedTournament}
                onValueChange={setSelectedTournament}
            >
                <SelectTrigger className="w-full bg-[#1d2834] border-[#305176] text-white">
                    <SelectValue placeholder="Seleccionar torneo" />
                </SelectTrigger>
                <SelectContent className="bg-[#213041] border-[#305176]">
                    {tournamentOptions.map(t => (
                        <SelectItem key={t} value={t} className="text-white">{t}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
        {/* Placeholder para Acciones del Torneo */}
        <div className="flex items-end space-x-2">
            {isTeamStaff && (
                <Button variant="outline" className="w-full border-[#33d9f6] text-[#33d9f6] hover:bg-[#33d9f6]/20">
                    <Calendar className="h-4 w-4 mr-2" />
                    Ver Calendario Completo
                </Button>
            )}
        </div>
      </div>

      {/* Tabla de Clasificación */}
      <Card className="bg-[#213041] border-[#305176]">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Hash className="h-5 w-5 mr-2" />
            Clasificación - {selectedTournament} ({currentCategoryName})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {classification.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#305176] hover:bg-[#305176]">
                    <TableHead className="text-white">#</TableHead>
                    <TableHead className="text-white">Equipo</TableHead>
                    <TableHead className="text-white text-center">PJ</TableHead>
                    <TableHead className="text-white text-center">PG</TableHead>
                    <TableHead className="text-white text-center">PE</TableHead>
                    <TableHead className="text-white text-center">PP</TableHead>
                    <TableHead className="text-white text-center">GF</TableHead>
                    <TableHead className="text-white text-center">GC</TableHead>
                    <TableHead className="text-white text-right">Pts</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classification.map((row) => (
                    <TableRow key={row.pos} className={`border-[#305176] ${row.team.includes('Mi Club') ? 'bg-[#305176]' : 'hover:bg-[#305176]/50'}`}>
                      <TableCell className="font-bold text-[#f4c11a]">{row.pos}</TableCell>
                      <TableCell className="font-medium text-white">{row.team}</TableCell>
                      <TableCell className="text-center text-gray-300">{row.pj}</TableCell>
                      <TableCell className="text-center text-gray-300">{row.pg}</TableCell>
                      <TableCell className="text-center text-gray-300">{row.pe}</TableCell>
                      <TableCell className="text-center text-gray-300">{row.pp}</TableCell>
                      <TableCell className="text-center text-gray-300">{row.gf}</TableCell>
                      <TableCell className="text-center text-gray-300">{row.gc}</TableCell>
                      <TableCell className="text-right font-bold text-[#aff606]">{row.pts}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
             <p className="text-center text-gray-500 py-4">
                No hay datos de clasificación para este torneo y categoría.
             </p>
          )}
        </CardContent>
      </Card>

      {/* Partidos Recientes / Calendario */}
      <Card className="bg-[#213041] border-[#305176]">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Partidos Recientes y Próxima Fecha
          </CardTitle>
        </CardHeader>
        <CardContent>
          {calendar.length > 0 ? (
            <div className="space-y-4">
              {calendar.slice(0, 5).map((match, index) => (
                <div 
                    key={index} 
                    className="flex items-center justify-between p-3 bg-[#1d2834] rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-white font-medium">{match.homeTeam} vs {match.awayTeam}</p>
                      <p className="text-gray-400 text-sm">{match.date}</p>
                    </div>
                  </div>
                  <Badge className={match.result === 'W' ? 'bg-[#25d03f] text-black' : match.result === 'L' ? 'bg-red-500 text-white' : 'bg-[#f4c11a] text-black'}>
                    {match.score}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">
              No hay partidos registrados para esta categoría en el torneo.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}