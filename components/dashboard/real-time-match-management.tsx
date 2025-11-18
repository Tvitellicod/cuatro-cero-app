// components/dashboard/real-time-match-management.tsx

"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Clock, Goal, CornerRightUp, Minus, Plus, RefreshCw, X, Square, Users, Pause, Play, Redo, RotateCw } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useProfile, Player as ContextPlayer, Category as ContextCategory } from "@/hooks/use-profile"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"


// --- TIPOS ---
interface MatchEvent {
  minute: number
  half: number
  type: "GOAL" | "ASSIST" | "SHOT" | "RECOVERY" | "LOSS" | "FOUL" | "YELLOW" | "RED" | "SUB_IN" | "SUB_OUT"
  player: string // Player ID
  detail?: string
}

interface PlayerStats {
  id: string
  name: string
  number: number
  timePlayed: number
  goals: number
  assists: number
  shots: number
  recoveries: number
  losses: number
  fouls: number
  yellowCards: number
  redCards: number
  isOnField: boolean
  isExpulsed: boolean
}

// ESTADOS INICIALES LIMPIOS
const initialMatchState = {
    teamName: "Mi Equipo",
    opponentName: "Oponente",
    scoreHome: 0,
    scoreAway: 0,
    half: 1,
    matchStarted: false,
    matchPaused: false,
};

const initialEvents: MatchEvent[] = [];


export function RealTimeMatchManagement() {
  const { profile, players: allPlayers, categories } = useProfile();
  
  // Roles de acceso
  const isTechnician = profile?.role === "DIRECTOR TECNICO";

  // Estado del partido
  const [matchState, setMatchState] = useState(initialMatchState);
  const [matchEvents, setMatchEvents] = useState<MatchEvent[]>(initialEvents);
  
  // Estado de jugadores
  const [availablePlayers, setAvailablePlayers] = useState<ContextPlayer[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [squad, setSquad] = useState<ContextPlayer[]>([]);
  const [stats, setStats] = useState<Record<string, PlayerStats>>({});

  // Tiempo
  const [time, setTime] = useState(0); // Tiempo en segundos
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Estados de control de la interfaz
  const [showStartingSquad, setShowStartingSquad] = useState(false);
  const [selectedPlayerForEvent, setSelectedPlayerForEvent] = useState("");
  const [playerToSub, setPlayerToSub] = useState("");
  const [playerIn, setPlayerIn] = useState("");
  const [playerToExpulse, setPlayerToExpulse] = useState("");


  // --- USE MEMOS Y CALCULADOS ---

  const playersOnField = useMemo(() => {
    return squad.filter(p => stats[p.id]?.isOnField && !stats[p.id]?.isExpulsed);
  }, [squad, stats]);

  const playersOnBench = useMemo(() => {
    return squad.filter(p => !stats[p.id]?.isOnField && !stats[p.id]?.isExpulsed);
  }, [squad, stats]);

  const sortedStats = useMemo(() => {
      return Object.values(stats)
          .filter(s => s.isOnField || s.timePlayed > 0)
          .sort((a, b) => {
              // Goles primero, luego asistencias, luego minutos
              if (b.goals !== a.goals) return b.goals - a.goals;
              if (b.assists !== a.assists) return b.assists - a.assists;
              return b.timePlayed - a.timePlayed;
          });
  }, [stats]);


  // --- EFECTOS Y LÓGICA DE TIEMPO ---

  // Inicializar disponibles al cargar
  useEffect(() => {
      if (categories.length > 0 && selectedCategory === "") {
          setSelectedCategory(categories[0].id);
      }
  }, [categories, selectedCategory]);
  
  // Actualizar jugadores disponibles al cambiar de categoría
  useEffect(() => {
      setAvailablePlayers(allPlayers.filter(p => p.categoryId === selectedCategory && p.injuryStatus === 'FIT'));
      setSquad([]);
      setStats({});
  }, [allPlayers, selectedCategory]);


  // Lógica del cronómetro
  useEffect(() => {
    if (matchState.matchStarted && !matchState.matchPaused) {
      timerRef.current = setInterval(() => {
        setTime(prevTime => prevTime + 1);
        // Actualizar minutos jugados para los jugadores en campo cada segundo
        setStats(prevStats => {
            const newStats = { ...prevStats };
            playersOnField.forEach(p => {
                newStats[p.id] = {
                    ...newStats[p.id],
                    timePlayed: (newStats[p.id].timePlayed || 0) + 1,
                };
            });
            return newStats;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [matchState.matchStarted, matchState.matchPaused, playersOnField]);
  
  // Resetea el tiempo si se cambia de mitad
  useEffect(() => {
      if (matchState.half === 2 && matchState.matchStarted) {
          setTime(0); // Reiniciar para la segunda mitad
      }
  }, [matchState.half, matchState.matchStarted]);


  // --- FUNCIONES DE ACCIÓN ---

  const handleStartMatch = () => {
      if (playersOnField.length < 5) {
          toast.error("Debes seleccionar al menos 5 jugadores titulares.");
          return;
      }

      setMatchState(prev => ({
          ...prev,
          matchStarted: true,
          matchPaused: false,
      }));
      toast.success("Partido iniciado.");
  };

  const handlePauseToggle = () => {
      if (!matchState.matchStarted) return;

      setMatchState(prev => ({
          ...prev,
          matchPaused: !prev.matchPaused,
      }));
      toast.info(matchState.matchPaused ? "Partido reanudado." : "Partido en pausa.");
  };

  const handleEndHalf = () => {
      if (matchState.half === 1) {
          setMatchState(prev => ({
              ...prev,
              matchStarted: false,
              matchPaused: true,
              half: 2,
          }));
          toast.info("Fin del primer tiempo. Seleccione el segundo tiempo para reanudar.");
      } else {
          setMatchState(prev => ({
              ...prev,
              matchStarted: false,
              matchPaused: true,
          }));
          toast.success("¡Partido finalizado!");
      }
  };
  
  const handleEndMatchReset = () => {
      const isConfirmed = window.confirm("¿Estás seguro de finalizar y resetear el partido? Se perderán los datos si no se guardan.");
      if (isConfirmed) {
          setMatchState(initialMatchState);
          setMatchEvents(initialEvents);
          setSquad([]);
          setStats({});
          setTime(0);
          setShowStartingSquad(false);
          toast.success("Partido reseteado.");
      }
  }


  const handleSquadSelection = (playerId: string) => {
      if (matchState.matchStarted) return; // No se puede cambiar la plantilla si ya empezó

      const player = availablePlayers.find(p => p.id === playerId);
      if (!player) return;

      setSquad(prevSquad => {
          const isSelected = prevSquad.some(p => p.id === playerId);
          const newSquad = isSelected ? prevSquad.filter(p => p.id !== playerId) : [...prevSquad, player];
          
          // Mantenemos solo 5 en campo (titulares) al inicio
          const currentOnField = newSquad.slice(0, 5);

          setStats(prevStats => {
              const newStats = { ...prevStats };
              newSquad.forEach(p => {
                  newStats[p.id] = {
                      ...(newStats[p.id] || { id: p.id, name: p.name, number: p.number, timePlayed: 0, goals: 0, assists: 0, shots: 0, recoveries: 0, losses: 0, fouls: 0, yellowCards: 0, redCards: 0, isExpulsed: false }),
                      isOnField: currentOnField.some(onF => onF.id === p.id),
                  };
              });
              // Eliminar jugadores que ya no están en el squad
              Object.keys(newStats).forEach(id => {
                  if (!newSquad.some(p => p.id === id)) {
                      delete newStats[id];
                  }
              });

              return newStats;
          });

          return newSquad;
      });
  };

  const handleScoreChange = (isHome: boolean, increment: boolean) => {
      setMatchState(prev => {
          const newScore = isHome 
              ? (increment ? prev.scoreHome + 1 : Math.max(0, prev.scoreHome - 1))
              : (increment ? prev.scoreAway + 1 : Math.max(0, prev.scoreAway - 1));
          
          return {
              ...prev,
              scoreHome: isHome ? newScore : prev.scoreHome,
              scoreAway: !isHome ? newScore : prev.scoreAway,
          };
      });
  };

  const handleEvent = (type: MatchEvent['type']) => {
      const player = squad.find(p => p.id === selectedPlayerForEvent);
      if (!player) return toast.error("Selecciona un jugador.");
      if (matchState.matchPaused) return toast.error("El partido está en pausa.");
      if (!matchState.matchStarted && matchState.half === 1) return toast.error("Inicia el partido primero.");
      
      const currentMinute = Math.floor(time / 60) + 1 + (matchState.half - 1) * 45; // Simulación de minutos
      
      const newEvent: MatchEvent = {
          minute: currentMinute,
          half: matchState.half,
          type,
          player: player.id,
          detail: player.name,
      };

      setMatchEvents(prev => [...prev, newEvent]);

      // Actualizar estadísticas
      setStats(prevStats => {
          const newStats = { ...prevStats };
          const pStats = newStats[player.id];

          switch (type) {
              case 'GOAL':
                  pStats.goals += 1;
                  // Si es gol del equipo, actualiza el marcador
                  handleScoreChange(true, true);
                  toast.success(`¡GOL de ${player.name}!`);
                  break;
              case 'ASSIST':
                  pStats.assists += 1;
                  break;
              case 'SHOT':
                  pStats.shots += 1;
                  break;
              case 'RECOVERY':
                  pStats.recoveries += 1;
                  break;
              case 'LOSS':
                  pStats.losses += 1;
                  break;
              case 'FOUL':
                  pStats.fouls += 1;
                  break;
              case 'YELLOW':
                  pStats.yellowCards += 1;
                  toast.warning(`Tarjeta Amarilla para ${player.name}`);
                  break;
              case 'RED':
                  pStats.redCards += 1;
                  pStats.isExpulsed = true;
                  pStats.isOnField = false; // Sale del campo
                  toast.error(`¡Tarjeta ROJA para ${player.name}!`);
                  break;
          }
          newStats[player.id] = pStats;
          return newStats;
      });
      setSelectedPlayerForEvent("");
  };
  
  const handleSubstitution = () => {
      if (!playerToSub || !playerIn) return toast.error("Selecciona un jugador saliente y uno entrante.");
      if (matchState.matchPaused) return toast.error("El partido está en pausa.");
      
      const subOutPlayer = playersOnField.find(p => p.id === playerToSub);
      const subInPlayer = playersOnBench.find(p => p.id === playerIn);
      
      if (!subOutPlayer || !subInPlayer) return toast.error("Selección de jugadores inválida.");

      setStats(prevStats => {
          const newStats = { ...prevStats };
          
          // 1. Jugador saliente
          newStats[playerToSub] = {
              ...newStats[playerToSub],
              isOnField: false,
          };
          
          // 2. Jugador entrante
          newStats[playerIn] = {
              ...newStats[playerIn],
              isOnField: true,
          };
          
          return newStats;
      });
      
      toast.info(`Sustitución: Sale ${subOutPlayer.name} (Min ${Math.floor(time / 60) + 1 + (matchState.half - 1) * 45}), Entra ${subInPlayer.name}.`);
      setPlayerToSub("");
      setPlayerIn("");
  }


  // --- COMPONENTES AUXILIARES PARA EL RENDER ---

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const getCardColor = (stat: PlayerStats) => {
      if (stat.redCards > 0) return "border-red-500";
      if (stat.yellowCards > 0) return "border-[#f4c11a]";
      if (stat.goals > 0) return "border-[#aff606]";
      return "border-[#305176]";
  }

  // Si no hay categorías, forzamos el mensaje de creación de club
  if (categories.length === 0) {
     return (
        <Card className="bg-[#213041] border-[#305176] text-white p-6 text-center">
             <h2 className="text-2xl font-bold mb-2">Módulo de Partido no Disponible</h2>
             <p className="text-gray-400">Debes crear un **Club**, una **Categoría** y al menos **5 Jugadores** para usar este simulador.</p>
        </Card>
     );
  }


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
            <Clock className="h-6 w-6 mr-2 text-[#f4c11a]" />
            Gestión de Partido en Tiempo Real
          </h2>
          <p className="text-gray-400">
            Simulación de marcador, tiempo y estadísticas de juego.
          </p>
        </div>
      </div>

      {/* Control y Marcador */}
      <Card className="bg-[#213041] border-[#305176]">
        <CardHeader>
          <CardTitle className="text-white text-center">
            {matchState.teamName} vs {matchState.opponentName}
          </CardTitle>
          <p className="text-gray-400 text-center text-sm">
              {matchState.half === 1 ? "Primer Tiempo" : matchState.half === 2 ? "Segundo Tiempo" : "Partido Finalizado"}
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center space-x-8 mb-4">
            {/* Marcador */}
            <div className="flex items-center space-x-4">
              <div className="text-4xl font-extrabold text-[#aff606]">{matchState.scoreHome}</div>
              <span className="text-4xl font-extrabold text-white">-</span>
              <div className="text-4xl font-extrabold text-white">{matchState.scoreAway}</div>
              <div className="flex flex-col space-y-1">
                  <Button size="icon" variant="ghost" className="h-6 w-6 text-[#aff606]" onClick={() => handleScoreChange(true, true)}><Plus className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" className="h-6 w-6 text-[#aff606]" onClick={() => handleScoreChange(true, false)}><Minus className="h-4 w-4" /></Button>
              </div>
            </div>
            
            {/* Cronómetro y Estado */}
            <div className={`text-center p-3 rounded-lg ${matchState.matchPaused ? 'bg-red-500/20' : matchState.matchStarted ? 'bg-[#aff606]/20' : 'bg-[#305176]'}`}>
                <p className={`text-5xl font-mono font-bold ${matchState.matchPaused ? 'text-red-500' : 'text-white'}`}>
                    {formatTime(time)}
                </p>
                <p className={`text-xs font-semibold ${matchState.matchPaused ? 'text-red-500' : 'text-gray-400'}`}>
                    {matchState.matchPaused ? "PAUSA" : matchState.matchStarted ? "JUGANDO" : "LISTO"}
                </p>
            </div>

             <div className="flex flex-col space-y-1">
                <Button size="icon" variant="ghost" className="h-6 w-6 text-white" onClick={() => handleScoreChange(false, true)}><Plus className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" className="h-6 w-6 text-white" onClick={() => handleScoreChange(false, false)}><Minus className="h-4 w-4" /></Button>
            </div>
          </div>
          
          {/* Botones de Control */}
          <div className="flex justify-center space-x-4 mt-4 pt-4 border-t border-[#305176]">
              {!matchState.matchStarted && matchState.half === 1 && (
                  <Button className="bg-[#aff606] text-black hover:bg-[#25d03f] font-semibold" onClick={() => setShowStartingSquad(true)}>
                      <Users className="h-4 w-4 mr-2" />
                      Definir Plantilla
                  </Button>
              )}
              {matchState.matchStarted && (
                  <Button 
                      className={`font-semibold ${matchState.matchPaused ? 'bg-[#aff606] text-black hover:bg-[#25d03f]' : 'bg-[#f4c11a] text-black hover:bg-[#d9a80e]'}`}
                      onClick={handlePauseToggle}
                  >
                      {matchState.matchPaused ? <Play className="h-4 w-4 mr-2" /> : <Pause className="h-4 w-4 mr-2" />}
                      {matchState.matchPaused ? "Reanudar" : "Pausa"}
                  </Button>
              )}
              {(matchState.matchStarted || matchState.matchPaused) && matchState.half < 2 && (
                  <Button 
                      variant="outline"
                      className="border-[#33d9f6] text-[#33d9f6] hover:bg-[#33d9f6]/20"
                      onClick={handleEndHalf}
                  >
                      <RotateCw className="h-4 w-4 mr-2" />
                      Fin de la Mitad
                  </Button>
              )}
              {matchState.half === 2 && (matchState.matchStarted || matchState.matchPaused) && (
                   <Button 
                      variant="destructive"
                      onClick={handleEndMatchReset}
                  >
                      <Square className="h-4 w-4 mr-2" />
                      Finalizar Partido y Resetear
                  </Button>
              )}
          </div>

        </CardContent>
      </Card>


      {/* Módulo de Eventos (Solo visible si el partido inició) */}
      {matchState.matchStarted && (
          <Card className="bg-[#213041] border-[#305176]">
              <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Goal className="h-5 w-5 mr-2" />
                    Registro de Eventos
                  </CardTitle>
              </CardHeader>
              <CardContent>
                
                  {/* Selector de Jugador */}
                  <div className="mb-4">
                      <Label className="text-white">Seleccionar Jugador en Campo</Label>
                      <Select
                          value={selectedPlayerForEvent}
                          onValueChange={setSelectedPlayerForEvent}
                          disabled={matchState.matchPaused}
                      >
                          <SelectTrigger className="w-full bg-[#1d2834] border-[#305176] text-white">
                              <SelectValue placeholder="Jugador..." />
                          </SelectTrigger>
                          <SelectContent className="bg-[#213041] border-[#305176]">
                              {playersOnField.map(p => (
                                  <SelectItem key={p.id} value={p.id} className="text-white">
                                      #{p.number} {p.name}
                                  </SelectItem>
                              ))}
                          </SelectContent>
                      </Select>
                  </div>
                  
                  {/* Botones de Eventos */}
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                      <Button onClick={() => handleEvent('GOAL')} disabled={!selectedPlayerForEvent || matchState.matchPaused} className="bg-[#aff606] text-black hover:bg-[#25d03f]"><Goal className="h-4 w-4 mr-1" /> Gol</Button>
                      <Button onClick={() => handleEvent('ASSIST')} disabled={!selectedPlayerForEvent || matchState.matchPaused} className="bg-[#33d9f6] text-black hover:bg-[#2bc4ea]"><CornerRightUp className="h-4 w-4 mr-1" /> Asistencia</Button>
                      <Button onClick={() => handleEvent('SHOT')} disabled={!selectedPlayerForEvent || matchState.matchPaused} className="bg-[#f4c11a] text-black hover:bg-[#d9a80e]">Remate</Button>
                      <Button onClick={() => handleEvent('RECOVERY')} disabled={!selectedPlayerForEvent || matchState.matchPaused} className="bg-[#ff6b35] text-white hover:bg-[#d4552b]">Recuperación</Button>
                      <Button onClick={() => handleEvent('LOSS')} disabled={!selectedPlayerForEvent || matchState.matchPaused} variant="outline" className="border-red-500 text-red-500 hover:bg-red-500/20">Pérdida</Button>
                      <Button onClick={() => handleEvent('FOUL')} disabled={!selectedPlayerForEvent || matchState.matchPaused} variant="outline" className="border-gray-500 text-gray-400 hover:bg-gray-500/20">Falta</Button>
                      <Button onClick={() => handleEvent('YELLOW')} disabled={!selectedPlayerForEvent || matchState.matchPaused} className="bg-yellow-500 text-black hover:bg-yellow-600">Amarilla</Button>
                      <Button onClick={() => handleEvent('RED')} disabled={!selectedPlayerForEvent || matchState.matchPaused} className="bg-red-700 text-white hover:bg-red-800">Roja</Button>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#305176]">
                      <h4 className="text-white font-medium mb-2">Sustituciones</h4>
                      <div className="flex flex-col md:flex-row gap-4">
                          <div className="flex-1 space-y-2">
                              <Label className="text-white">Sale del Campo</Label>
                              <Select
                                  value={playerToSub}
                                  onValueChange={setPlayerToSub}
                                  disabled={matchState.matchPaused}
                              >
                                  <SelectTrigger className="w-full bg-[#1d2834] border-[#305176] text-white">
                                      <SelectValue placeholder="Jugador que sale" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-[#213041] border-[#305176]">
                                      {playersOnField.map(p => (
                                          <SelectItem key={p.id} value={p.id} className="text-white">
                                              #{p.number} {p.name}
                                          </SelectItem>
                                      ))}
                                  </SelectContent>
                              </Select>
                          </div>
                          <div className="flex-1 space-y-2">
                              <Label className="text-white">Entra al Campo</Label>
                              <Select
                                  value={playerIn}
                                  onValueChange={setPlayerIn}
                                  disabled={matchState.matchPaused}
                              >
                                  <SelectTrigger className="w-full bg-[#1d2834] border-[#305176] text-white">
                                      <SelectValue placeholder="Jugador que entra" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-[#213041] border-[#305176]">
                                      {playersOnBench.map(p => (
                                          <SelectItem key={p.id} value={p.id} className="text-white">
                                              #{p.number} {p.name}
                                          </SelectItem>
                                      ))}
                                  </SelectContent>
                              </Select>
                          </div>
                          <div className="flex items-end">
                              <Button 
                                  onClick={handleSubstitution} 
                                  disabled={!playerToSub || !playerIn || matchState.matchPaused}
                                  className="w-full bg-[#4ecdc4] text-black hover:bg-[#39a79d]"
                              >
                                  <Redo className="h-4 w-4 mr-1" />
                                  Realizar Cambio
                              </Button>
                          </div>
                      </div>
                  </div>
              </CardContent>
          </Card>
      )}


      {/* Estadísticas Detalladas */}
      <Card className="bg-[#213041] border-[#305176]">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Estadísticas de Jugadores
          </CardTitle>
          <p className="text-gray-400 text-sm">
            Estadísticas detalladas de los jugadores que participaron en el partido.
          </p>
        </CardHeader>
        <CardContent>
          {sortedStats.length > 0 ? (
              <div className="overflow-x-auto">
                  <Table>
                      <TableHeader>
                          <TableRow className="border-[#305176] hover:bg-[#305176]">
                              <TableHead className="text-white">Jugador</TableHead>
                              <TableHead className="text-white text-center">T. Jugado</TableHead>
                              <TableHead className="text-white text-center">G/A</TableHead>
                              <TableHead className="text-white text-center">Remates</TableHead>
                              <TableHead className="text-white text-center">Rec/Per</TableHead>
                              <TableHead className="text-white text-center">Faltas</TableHead>
                              <TableHead className="text-white text-center">Tarjetas</TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                          {sortedStats.map(stat => (
                              <TableRow key={stat.id} className={`border-[#305176] hover:bg-[#305176]/50 ${stat.isOnField ? 'bg-[#305176]/30' : ''}`}>
                                  <TableCell className="font-semibold text-white flex items-center space-x-2">
                                      <div className={`w-3 h-3 rounded-full ${stat.isOnField ? 'bg-[#aff606]' : stat.isExpulsed ? 'bg-red-500' : 'bg-gray-500'}`}></div>
                                      <span>#{stat.number} {stat.name}</span>
                                  </TableCell>
                                  <TableCell className="text-center text-gray-300">
                                      {Math.floor(stat.timePlayed / 60)} min
                                  </TableCell>
                                  <TableCell className="text-center font-bold text-[#aff606]">
                                      {stat.goals}/{stat.assists}
                                  </TableCell>
                                  <TableCell className="text-center text-gray-300">
                                      {stat.shots}
                                  </TableCell>
                                  <TableCell className="text-center text-gray-300">
                                      {stat.recoveries}/{stat.losses}
                                  </TableCell>
                                  <TableCell className="text-center text-gray-300">
                                      {stat.fouls}
                                  </TableCell>
                                  <TableCell className="text-center">
                                      {stat.yellowCards > 0 && <Badge className="bg-yellow-500 text-black h-4 px-1.5 mr-1">{stat.yellowCards}A</Badge>}
                                      {stat.redCards > 0 && <Badge className="bg-red-700 text-white h-4 px-1.5">{stat.redCards}R</Badge>}
                                      {stat.redCards === 0 && stat.yellowCards === 0 && <span className="text-gray-500">-</span>}
                                  </TableCell>
                              </TableRow>
                          ))}
                      </TableBody>
                  </Table>
              </div>
          ) : (
              <p className="text-center text-gray-500 py-4">
                  Define la plantilla y comienza el partido para ver las estadísticas.
              </p>
          )}
        </CardContent>
      </Card>


      {/* MODAL DE SELECCIÓN DE PLANTILLA INICIAL */}
      <Dialog open={showStartingSquad} onOpenChange={setShowStartingSquad}>
          <DialogContent className="sm:max-w-[800px] bg-[#213041] border-[#305176] text-white">
              <DialogHeader>
                  <DialogTitle className="text-white text-2xl">Seleccionar Plantilla Inicial</DialogTitle>
                  <DialogDescription className="text-gray-400">
                      Selecciona los jugadores para la plantilla (Titulares y Suplentes).
                  </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="category-select" className="text-white">Categoría a Jugar</Label>
                    <Select
                        value={selectedCategory}
                        onValueChange={setSelectedCategory}
                        disabled={matchState.matchStarted}
                    >
                        <SelectTrigger id="category-select" className="w-full bg-[#1d2834] border-[#305176] text-white">
                            <SelectValue placeholder="Seleccionar Categoría" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#213041] border-[#305176]">
                            {categories.map(c => (
                                <SelectItem key={c.id} value={c.id} className="text-white">{c.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                  </div>
                  
                  <h4 className="text-white font-bold mt-4">Jugadores Disponibles ({availablePlayers.length})</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-80 overflow-y-auto p-2 bg-[#1d2834] rounded-lg">
                      {availablePlayers.map(player => {
                          const isSelected = squad.some(p => p.id === player.id);
                          const currentStats = stats[player.id];
                          const isInjured = player.injuryStatus === 'INJURED';

                          return (
                              <button
                                  key={player.id}
                                  disabled={isInjured || matchState.matchStarted}
                                  onClick={() => handleSquadSelection(player.id)}
                                  className={`p-3 rounded-lg text-sm text-center transition-all ${
                                      isInjured 
                                      ? 'bg-red-900/40 text-red-300 cursor-not-allowed'
                                      : isSelected 
                                      ? 'bg-[#33d9f6] text-black' 
                                      : 'bg-[#305176] text-white hover:bg-[#305176]/80'
                                  }`}
                              >
                                  #{player.number} {player.name}
                                  {isInjured && <span className="block text-xs font-bold mt-1">LESIONADO</span>}
                              </button>
                          );
                      })}
                  </div>

                  <h4 className="text-white font-bold mt-4">Plantilla Seleccionada ({squad.length})</h4>
                  <div className="grid grid-cols-5 gap-4">
                      {squad.slice(0, 5).map(p => (
                          <div key={p.id} className="text-center p-3 bg-[#aff606] text-black rounded-lg font-semibold">
                              #{p.number} {p.name} (Titular)
                          </div>
                      ))}
                      {squad.slice(5).map(p => (
                          <div key={p.id} className="text-center p-3 bg-[#f4c11a] text-black rounded-lg font-semibold">
                              #{p.number} {p.name} (Suplente)
                          </div>
                      ))}
                  </div>
                  {squad.length < 5 && (
                      <p className="text-red-400 text-sm mt-2">¡Advertencia! Debes seleccionar al menos 5 jugadores.</p>
                  )}
              </div>

              <div className="flex justify-end space-x-4 pt-4 border-t border-[#305176]">
                  <Button
                      variant="outline"
                      className="border-gray-500 text-gray-400 hover:bg-gray-500/20"
                      onClick={() => setShowStartingSquad(false)}
                  >
                      Cerrar
                  </Button>
                  <Button
                      className="bg-[#aff606] text-black hover:bg-[#25d03f]"
                      onClick={() => {
                          setShowStartingSquad(false);
                          handleStartMatch();
                      }}
                      disabled={squad.length < 5}
                  >
                      Comenzar Partido
                  </Button>
              </div>
          </DialogContent>
      </Dialog>
    </div>
  )
}