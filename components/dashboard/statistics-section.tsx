// components/dashboard/statistics-section.tsx

"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Users, Goal, TrendingUp, Filter } from "lucide-react"
import { useProfile, Player as ContextPlayer } from "@/hooks/use-profile"

// Importar Recharts si están disponibles. Asumo que están instalados:
import {
  Bar,
  BarChart as RechartsBarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"


// --- ESTADOS INICIALES LIMPIOS ---

// Datos para el gráfico de Goles y Asistencias
const initialGoalsData = [
  // { name: "Jugador 1", Goles: 0, Asistencias: 0 },
];

// Datos para el gráfico de Distribución de Entrenamiento (si lo hubiera, aquí estará vacío)
const initialTrainingDistribution = [
  // { name: "Técnico", value: 0 },
];

// Datos para el gráfico de Lesiones
const initialInjuryData = [
  // { name: 'Rodilla', Lesiones: 0 },
];

// ---------------------------------

export function StatisticsSection() {
  const { profile, players: allPlayers, categories } = useProfile();
  const [selectedPlayer, setSelectedPlayer] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [statType, setStatType] = useState("performance");

  const isAnalyst = profile?.role === "ANALISTA" || profile?.role === "DIRECTOR TECNICO";
  
  // Mapeo de jugadores para el select (incluye "Todos")
  const playerOptions = useMemo(() => {
    return [
      { id: "all", name: "Todos los jugadores" },
      ...allPlayers.map(p => ({ id: p.id, name: p.name }))
    ]
  }, [allPlayers]);

  const categoryOptions = useMemo(() => {
    return [
      { id: "all", name: "Todas las categorías" },
      ...categories.map(c => ({ id: c.id, name: c.name }))
    ]
  }, [categories]);


  // Función para generar datos simulados limpios, basada en el filtro
  const generateCleanData = useMemo(() => {
      // Si no hay jugadores, devolvemos datos vacíos
      if (allPlayers.length === 0) {
          return {
              goals: initialGoalsData,
              injuries: initialInjuryData,
              training: initialTrainingDistribution,
          }
      }

      // 1. Filtrar jugadores por categoría (si se selecciona)
      const filteredPlayers = allPlayers.filter(player => 
          selectedCategory === "all" || player.categoryId === selectedCategory
      );

      // 2. Si se selecciona un jugador específico
      const playersToAnalyze = selectedPlayer !== "all" 
          ? filteredPlayers.filter(p => p.id === selectedPlayer) 
          : filteredPlayers;
      
      // 3. Generar datos limpios/vacíos para el gráfico
      
      // Goles/Asistencias (Performance) - Solo listamos los jugadores
      const goalsData = playersToAnalyze.map(p => ({
          name: p.name,
          Goles: 0,
          Asistencias: 0,
      }));

      // Lesiones (Health) - Contamos las lesiones
      const injuryMap = playersToAnalyze.reduce((acc, player) => {
          if (player.injuryStatus === 'INJURED') {
              // Si está lesionado, asumimos una lesión genérica para el mock
              const injuryType = player.injuryDetails || "Lesión Genérica";
              acc[injuryType] = (acc[injuryType] || 0) + 1;
          }
          return acc;
      }, {} as Record<string, number>);

      const injuryData = Object.entries(injuryMap).map(([name, Lesiones]) => ({
          name,
          Lesiones,
      }));


      // Entrenamiento (Tactical/Physical) - Siempre vacío
      const trainingData = initialTrainingDistribution;


      return {
          goals: goalsData,
          injuries: injuryData,
          training: trainingData,
      }

  }, [allPlayers, selectedPlayer, selectedCategory]);

  const { goals, injuries, training } = generateCleanData;


  if (!isAnalyst) {
    return (
      <Card className="bg-[#213041] border-[#305176] text-white p-6 text-center">
        <h2 className="text-2xl font-bold mb-2">Acceso Restringido</h2>
        <p className="text-gray-400">Solo los perfiles con rol de **ANALISTA** o **DIRECTOR TECNICO** tienen acceso a este módulo.</p>
      </Card>
    );
  }


  const renderChart = () => {
    switch (statType) {
      case 'performance':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <RechartsBarChart data={goals}>
              <CartesianGrid strokeDasharray="3 3" stroke="#305176" />
              <XAxis dataKey="name" stroke="#fff" angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="#fff" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#213041', border: '1px solid #305176', color: '#fff' }}
                formatter={(value: number, name: string) => [`${value}`, name]}
              />
              <Legend wrapperStyle={{ color: '#fff', paddingTop: '10px' }} />
              <Bar dataKey="Goles" fill="#aff606" name="Goles" />
              <Bar dataKey="Asistencias" fill="#33d9f6" name="Asistencias" />
            </RechartsBarChart>
          </ResponsiveContainer>
        );
      case 'health':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <RechartsBarChart data={injuries}>
              <CartesianGrid strokeDasharray="3 3" stroke="#305176" />
              <XAxis dataKey="name" stroke="#fff" angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="#fff" />
              <Tooltip 
                 contentStyle={{ backgroundColor: '#213041', border: '1px solid #305176', color: '#fff' }}
                 formatter={(value: number, name: string) => [`${value}`, name]}
              />
              <Legend wrapperStyle={{ color: '#fff', paddingTop: '10px' }} />
              <Bar dataKey="Lesiones" fill="#ff6b35" name="Lesiones" />
            </RechartsBarChart>
          </ResponsiveContainer>
        );
      case 'training':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <div className="flex items-center justify-center h-full text-gray-500">
                Aún no hay datos de distribución de entrenamiento.
            </div>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
            <TrendingUp className="h-6 w-6 mr-2 text-[#33d9f6]" />
            Estadísticas y Análisis
          </h2>
          <p className="text-gray-400">
            Visualiza el rendimiento y el estado de salud de tu plantilla.
          </p>
        </div>
      </div>

      <Card className="bg-[#213041] border-[#305176]">
        <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <CardTitle className="text-white flex items-center">
                    <BarChart className="h-5 w-5 mr-2" />
                    Gráfico de Análisis: {statType === 'performance' ? 'Rendimiento' : statType === 'health' ? 'Salud' : 'Entrenamiento'}
                </CardTitle>
                <div className="flex flex-wrap gap-2">
                    <Button
                        size="sm"
                        className={`font-semibold ${statType === 'performance' ? 'bg-[#aff606] text-black' : 'bg-[#305176] text-white hover:bg-[#305176]/80'}`}
                        onClick={() => setStatType('performance')}
                    >
                        Rendimiento
                    </Button>
                    <Button
                        size="sm"
                        className={`font-semibold ${statType === 'health' ? 'bg-[#ff6b35] text-white' : 'bg-[#305176] text-white hover:bg-[#305176]/80'}`}
                        onClick={() => setStatType('health')}
                    >
                        Salud
                    </Button>
                    <Button
                        size="sm"
                        className={`font-semibold ${statType === 'training' ? 'bg-[#33d9f6] text-black' : 'bg-[#305176] text-white hover:bg-[#305176]/80'}`}
                        onClick={() => setStatType('training')}
                    >
                        Entrenamiento
                    </Button>
                </div>
            </div>
        </CardHeader>
        <CardContent>
            {/* Filtros de Datos */}
            <div className="flex flex-wrap gap-4 mb-6 pt-2 border-t border-[#305176]">
                <div className="w-full sm:w-auto flex-1 sm:flex-initial">
                    <Label className="text-gray-400 text-sm">Categoría</Label>
                    <Select
                        value={selectedCategory}
                        onValueChange={setSelectedCategory}
                    >
                        <SelectTrigger className="w-full bg-[#1d2834] border-[#305176] text-white">
                            <SelectValue placeholder="Todas las categorías" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#213041] border-[#305176]">
                            {categoryOptions.map(cat => (
                                <SelectItem key={cat.id} value={cat.id} className="text-white">{cat.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                {statType === 'performance' && (
                    <div className="w-full sm:w-auto flex-1 sm:flex-initial">
                        <Label className="text-gray-400 text-sm">Jugador Específico</Label>
                        <Select
                            value={selectedPlayer}
                            onValueChange={setSelectedPlayer}
                        >
                            <SelectTrigger className="w-full bg-[#1d2834] border-[#305176] text-white">
                                <SelectValue placeholder="Todos los jugadores" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#213041] border-[#305176]">
                                {playerOptions.filter(p => selectedCategory === "all" || allPlayers.some(ap => ap.id === p.id && ap.categoryId === selectedCategory)).map(p => (
                                    <SelectItem key={p.id} value={p.id} className="text-white">{p.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}
            </div>
            {/* Contenedor del Gráfico */}
            <div className="h-[300px] w-full">
                {renderChart()}
            </div>
        </CardContent>
      </Card>
      
      {/* Resumen de Métricas Clave */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="bg-[#213041] border-[#305176]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Total Jugadores</CardTitle>
                <Users className="h-4 w-4 text-[#aff606]" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-white">{allPlayers.length}</div>
                <p className="text-xs text-gray-500">
                    Jugadores registrados
                </p>
            </CardContent>
        </Card>

        <Card className="bg-[#213041] border-[#305176]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Jugadores Lesionados</CardTitle>
                <HeartPulse className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-red-500">
                    {allPlayers.filter(p => p.injuryStatus === 'INJURED').length}
                </div>
                <p className="text-xs text-gray-500">
                    Aptos para entrenar: {allPlayers.filter(p => p.injuryStatus === 'FIT').length}
                </p>
            </CardContent>
        </Card>
        
        <Card className="bg-[#213041] border-[#305176]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Promedio de Goles (Simulado)</CardTitle>
                <Goal className="h-4 w-4 text-[#33d9f6]" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-white">0.0</div>
                <p className="text-xs text-gray-500">
                    Basado en partidos jugados (0)
                </p>
            </CardContent>
        </Card>
      </div>
    </div>
  )
}