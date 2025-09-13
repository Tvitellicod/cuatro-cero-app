"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, StopCircle, Square, Goal, ShieldOff, Footprints, X, Plus, Clock, ChevronsRight, Award, History, FileText, CheckCircle2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Define las acciones de juego disponibles
const GAME_ACTIONS = [
  { id: "recupero", name: "Recuperó", icon: CheckCircle2, color: "bg-[#25d03f]" },
  { id: "perdio", name: "Perdió", icon: X, color: "bg-red-500" },
  { id: "remate", name: "Remate", icon: Footprints, color: "bg-[#aff606]" },
  { id: "remateAlArco", name: "Remate al arco", icon: Goal, color: "bg-[#aff606]" },
  { id: "tarjetaAmarilla", name: "Tarjeta Amarilla", icon: ShieldOff, color: "bg-[#f4c11a]" },
  { id: "tarjetaRoja", name: "Tarjeta Roja", icon: ShieldOff, color: "bg-red-500" },
  { id: "faltaRecibida", name: "Falta recibida", icon: Award, color: "bg-[#33d9f6]" },
  { id: "faltaCometida", name: "Falta cometida", icon: History, color: "bg-[#ea3498]" },
];

// Tipos para la gestión del partido
type PlayerStats = {
  goles: number;
  asistencias: number;
  minutosJugados: number;
  recupero: number;
  perdio: number;
  remate: number;
  remateAlArco: number;
  tarjetaAmarilla: number;
  tarjetaRoja: number;
  faltaRecibida: number;
  faltaCometida: number;
};

type Player = {
  id: number;
  name: string;
  position: string;
  photo: string;
  stats: PlayerStats;
};

type GameState = "roster_selection" | "in_game" | "paused" | "second_half_roster" | "finished";

interface RealTimeMatchManagementProps {
  matchId: string;
}

export function RealTimeMatchManagement({ matchId }: RealTimeMatchManagementProps) {
  const [gameState, setGameState] = useState<GameState>("roster_selection");
  const [timer, setTimer] = useState(0);
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [currentHalf, setCurrentHalf] = useState(1);
  const [activePlayerTimers, setActivePlayerTimers] = useState<Record<number, number>>({});
  const [selectedPlayerForAction, setSelectedPlayerForAction] = useState<Player | null>(null);
  const [selectedSubstitute, setSelectedSubstitute] = useState<Player | null>(null);
  const [selectedStarterForSwap, setSelectedStarterForSwap] = useState<Player | null>(null);

  // Datos de ejemplo
  const [matchInfo] = useState({
    id: "1",
    opponent: "Club Atlético River",
    date: "15-09-2025",
    time: "16:00",
    location: "Local",
    tournament: "Liga Profesional",
    category: "Primera División",
  });

  const [allPlayers, setAllPlayers] = useState<Player[]>(
    Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      name: `Jugador ${i + 1}`,
      position: ["Arquero", "Defensor", "Mediocampista", "Delantero"][Math.floor(Math.random() * 4)],
      photo: "/placeholder-user.jpg",
      stats: {
        goles: 0,
        asistencias: 0,
        minutosJugados: 0,
        recupero: 0,
        perdio: 0,
        remate: 0,
        remateAlArco: 0,
        tarjetaAmarilla: 0,
        tarjetaRoja: 0,
        faltaRecibida: 0,
        faltaCometida: 0,
      },
    }))
  );

  const [starters, setStarters] = useState<Player[]>([]);
  const [substitutes, setSubstitutes] = useState<Player[]>([]);

  // Lógica de cronómetros
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (gameState === "in_game") {
      interval = setInterval(() => {
        setTimer((t) => t + 1);
        setActivePlayerTimers((timers) => {
          const newTimers = { ...timers };
          starters.forEach((player) => {
            newTimers[player.id] = (newTimers[player.id] || 0) + 1;
          });
          return newTimers;
        });
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState, starters]);

  // Funciones de control de juego
  const startGame = () => setGameState("in_game");
  const pauseGame = () => setGameState("paused");

  const startSecondHalf = () => {
    setGameState("second_half_roster");
    setTimer(0);
  };

  const finishGame = () => {
    setGameState("finished");
    // Lógica para guardar datos
    console.log("¡Partido finalizado!");
    console.log("Estadísticas del partido:", { homeScore, awayScore });
    console.log("Estadísticas de jugadores:", allPlayers);
    alert("Partido finalizado y datos guardados. Revisa el panel de estadísticas.");
  };

  // Funciones de selección de jugadores
  const handlePlayerSelect = (playerId: number) => {
    if (gameState !== "roster_selection" && gameState !== "second_half_roster") {
      return;
    }
    
    const playerToAdd = allPlayers.find((p) => p.id === playerId);
    if (!playerToAdd) return;

    if (starters.find((p) => p.id === playerId)) {
      setStarters(starters.filter((p) => p.id !== playerId));
    } else if (starters.length < 5) {
      setStarters([...starters, playerToAdd]);
    }
  };

  const confirmRoster = () => {
    if (starters.length !== 5) return;
    setSubstitutes(allPlayers.filter((p) => !starters.some(s => s.id === p.id)));
    setGameState("in_game");
  };

  // Lógica para sustituciones
  const handleSubstituteClick = (player: Player) => {
    if (gameState !== "in_game") return;
    setSelectedSubstitute(player);
  };

  const handleStarterClick = (player: Player) => {
    if (gameState !== "in_game") return;
    if (selectedSubstitute) {
      // Realizar el cambio
      setStarters(starters.map(p => p.id === player.id ? selectedSubstitute : p));
      setSubstitutes(substitutes.map(p => p.id === selectedSubstitute.id ? player : p));
      
      // Limpiar estados
      setSelectedSubstitute(null);
      setSelectedStarterForSwap(null);
    } else {
      setSelectedPlayerForAction(player);
    }
  };

  const handleActionClick = (actionId: string) => {
    if (!selectedPlayerForAction) return;

    setAllPlayers((prevPlayers) => 
      prevPlayers.map((player) => 
        player.id === selectedPlayerForAction.id
          ? {
              ...player,
              stats: {
                ...player.stats,
                [actionId]: (player.stats[actionId as keyof PlayerStats] as number) + 1,
              },
            }
          : player
      )
    );
    setSelectedPlayerForAction(null);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const getPlayerDisplayTime = (playerId: number) => {
    return formatTime(activePlayerTimers[playerId] || 0);
  };

  const renderPlayerList = (playersList: Player[], isStarter: boolean) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-2">
      {playersList.map((player) => (
        <div
          key={player.id}
          className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
            isStarter && gameState === "in_game"
              ? "bg-[#1d2834] hover:bg-[#305176] border border-[#305176]"
              : isStarter && (gameState === "roster_selection" || gameState === "second_half_roster")
                ? "bg-[#aff606]/20 border border-[#aff606]"
                : !isStarter && gameState === "in_game" && selectedSubstitute?.id === player.id
                  ? "bg-blue-600/20 border border-blue-500"
                  : !isStarter && (gameState === "roster_selection" || gameState === "second_half_roster")
                    ? "bg-[#1d2834] hover:bg-[#305176]"
                    : "bg-[#1d2834] hover:bg-[#305176]"
          }`}
          onClick={() => isStarter ? handleStarterClick(player) : handleSubstituteClick(player)}
        >
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={player.photo} alt={player.name} />
              <AvatarFallback className="bg-[#305176] text-white text-xs">
                {player.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <p className="text-white text-sm">{player.name}</p>
          </div>
          {isStarter && (
            <Badge className="bg-[#33d9f6] text-black text-xs font-medium">
              <Clock className="h-3 w-3 mr-1" />
              {getPlayerDisplayTime(player.id)}
            </Badge>
          )}
        </div>
      ))}
    </div>
  );

  const initialRosterPlayers = useMemo(() => {
    // Para el modo de selección, mostramos todos los jugadores disponibles
    return allPlayers;
  }, [allPlayers]);

  const starterSelectionUI = (
    <div className="space-y-4">
      <p className="text-gray-400">Selecciona los 5 jugadores que irán de titulares.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {initialRosterPlayers.map((player) => (
          <div
            key={player.id}
            onClick={() => handlePlayerSelect(player.id)}
            className={`p-4 bg-[#1d2834] rounded-lg border-2 cursor-pointer transition-colors ${
              starters.some(s => s.id === player.id)
                ? "border-[#aff606]"
                : "border-transparent hover:border-[#305176]"
            }`}
          >
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={player.photo} alt={player.name} />
                <AvatarFallback className="bg-[#305176] text-white text-xs">
                  {player.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-white font-medium">{player.name}</h3>
                <p className="text-gray-400 text-sm">{player.position}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-6">
        <Button
          className="w-full max-w-sm bg-[#aff606] text-black hover:bg-[#25d03f] text-lg h-12"
          onClick={confirmRoster}
          disabled={starters.length !== 5}
        >
          {gameState === "roster_selection" ? "Iniciar Primer Tiempo" : "Iniciar Segundo Tiempo"}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Gestión en vivo: {matchInfo.opponent}
          </h2>
          <p className="text-gray-400">
            {matchInfo.tournament} - {matchInfo.category} - Tiempo: {currentHalf}
          </p>
        </div>
        {(gameState === "in_game" || gameState === "paused") && (
          <div className="flex items-center space-x-4">
            <Badge className="bg-[#aff606] text-black">
              {homeScore} - {awayScore}
            </Badge>
            <Badge className="bg-[#33d9f6] text-black">
              <Clock className="h-4 w-4 mr-1" />
              {formatTime(timer)}
            </Badge>
          </div>
        )}
      </div>

      {/* Condición para mostrar el selector de titulares */}
      {(gameState === "roster_selection" || gameState === "second_half_roster") ? (
        starterSelectionUI
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Jugadores en juego y suplentes */}
          <Card className="bg-[#213041] border-[#305176] lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-white">Jugadores</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-white font-medium mb-2">Jugadores en Juego ({starters.length})</h3>
                {renderPlayerList(starters, true)}
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">Suplentes ({substitutes.length})</h3>
                {renderPlayerList(substitutes, false)}
              </div>
            </CardContent>
          </Card>

          {/* Acciones del partido y control */}
          <Card className="bg-[#213041] border-[#305176] lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-white">Acciones en vivo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Botones de control del partido */}
              <div className="flex justify-center space-x-4">
                {gameState === "in_game" && (
                  <Button
                    onClick={pauseGame}
                    className="w-full h-14 bg-red-500 text-white hover:bg-red-600"
                  >
                    <Pause className="h-6 w-6 mr-2" />
                    Parar Partido
                  </Button>
                )}
                {gameState === "paused" && (
                  <>
                    <Button
                      onClick={startGame}
                      className="w-full h-14 bg-[#aff606] text-black hover:bg-[#25d03f]"
                    >
                      <Play className="h-6 w-6 mr-2" />
                      Reanudar Partido
                    </Button>
                    <Button
                      onClick={currentHalf === 1 ? startSecondHalf : finishGame}
                      className="w-full h-14 bg-[#33d9f6] text-black hover:bg-[#2bc4ea]"
                    >
                      {currentHalf === 1 ? "Iniciar Segundo Tiempo" : "Finalizar Partido"}
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal para registrar una acción */}
      <Dialog open={!!selectedPlayerForAction} onOpenChange={() => setSelectedPlayerForAction(null)}>
        <DialogContent className="sm:max-w-[425px] bg-[#213041] border-[#305176] text-white">
          <DialogHeader className="text-center">
            <DialogTitle className="text-white text-2xl font-bold">
              Acción de {selectedPlayerForAction?.name}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Selecciona una acción para registrar en el minuto {Math.floor(timer / 60)}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            {GAME_ACTIONS.map((action) => (
              <Button
                key={action.id}
                className={`flex-col h-20 ${action.color} text-black font-bold`}
                onClick={() => handleActionClick(action.id)}
              >
                <action.icon className="h-6 w-6" />
                {action.name}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}