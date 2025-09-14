"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Play, Pause, StopCircle, Goal, ShieldOff, Footprints,
  X, Plus, Clock, ChevronsRight, Award, History, FileText, CheckCircle2
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";

// Acciones de juego disponibles para jugadores individuales
const GAME_ACTIONS = [
  { id: "recuperoPelota", name: "Recuperó Pelota", icon: CheckCircle2, color: "bg-[#25d03f]" },
  { id: "perdioPelota", name: "Perdió Pelota", icon: X, color: "bg-red-500" },
  { id: "remate", name: "Remate", icon: Footprints, color: "bg-[#aff606]" },
  { id: "remateAlArco", name: "Remate al arco", icon: Goal, color: "bg-[#aff606]" },
  { id: "faltaCometida", name: "Falta Cometida", icon: History, color: "bg-[#ea3498]" },
  { id: "faltaRecibida", name: "Falta Recibida", icon: Award, color: "bg-[#33d9f6]" },
  { id: "tarjetaAmarilla", name: "T. Amarilla", icon: ShieldOff, color: "bg-[#f4c11a]" },
  { id: "tarjetaRoja", name: "T. Roja", icon: ShieldOff, color: "bg-red-500" },
];

const GOAL_ACTIONS = [
  { id: "golAFavor", name: "Gol a Favor", icon: Goal, color: "bg-[#25d03f]" },
  { id: "golEnContra", name: "Gol en Contra", icon: Goal, color: "bg-red-500" },
];

// Tipos para la gestión del partido
type PlayerStats = {
  goles: number;
  asistencias: number;
  minutosJugados: number;
  recuperoPelota: number;
  perdioPelota: number;
  remate: number;
  remateAlArco: number;
  tarjetaAmarilla: number;
  tarjetaRoja: number;
  faltaCometida: number;
  faltaRecibida: number;
  golAFavor: number;
  golEnContra: number;
  expulsado?: boolean; // Nuevo campo para saber si está expulsado
};

type Player = {
  id: number;
  name: string;
  position: string;
  photo: string;
  stats: PlayerStats;
  hasRedCard: boolean;
};

type GameState = "roster_selection" | "in_game" | "paused" | "second_half_roster" | "finished";

interface RealTimeMatchManagementProps {
  matchId: string;
}

export function RealTimeMatchManagement({ matchId }: RealTimeMatchManagementProps) {
  const isMobile = useIsMobile();
  const [gameState, setGameState] = useState<GameState>("roster_selection");
  const [timer, setTimer] = useState(0);
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [currentHalf, setCurrentHalf] = useState(1);
  const [activePlayerTimers, setActivePlayerTimers] = useState<Record<number, number>>({});
  const [selectedPlayerForAction, setSelectedPlayerForAction] = useState<Player | null>(null);
  const [selectedSubstitute, setSelectedSubstitute] = useState<Player | null>(null);
  const [isSubbing, setIsSubbing] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [redCardedPlayer, setRedCardedPlayer] = useState<Player | null>(null);

  // Datos de ejemplo para el partido y los jugadores
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
        recuperoPelota: 0,
        perdioPelota: 0,
        remate: 0,
        remateAlArco: 0,
        tarjetaAmarilla: 0,
        tarjetaRoja: 0,
        faltaCometida: 0,
        faltaRecibida: 0,
        golAFavor: 0,
        golEnContra: 0,
      },
      hasRedCard: false,
    }))
  );

  const [starters, setStarters] = useState<Player[]>([]);
  const [substitutes, setSubstitutes] = useState<Player[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (gameState === "in_game") {
      interval = setInterval(() => {
        setTimer((t) => t + 1);
        setActivePlayerTimers((timers) => {
          const newTimers = { ...timers };
          starters.forEach((player) => {
            // Solo sumar tiempo si no está expulsado
            if (!player.hasRedCard && !(player.stats.expulsado)) {
              newTimers[player.id] = (newTimers[player.id] || 0) + 1;
            }
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


  const startGame = () => setGameState("in_game");
  const pauseGame = () => setGameState("paused");

  const startSecondHalf = () => {
    setCurrentHalf(2);
    setGameState("second_half_roster");
    setTimer(0);
    setRedCardedPlayer(null);
    // Los expulsados siguen en suplentes pero no pueden volver a ingresar
    setSubstitutes(allPlayers.filter((p) => !starters.some(s => s.id === p.id) && !p.hasRedCard && !p.stats.expulsado));
  };

  const finishGame = () => {
    setGameState("finished");
    setIsFinalizing(false);
    console.log("¡Partido finalizado!");
    console.log("Estadísticas del partido:", { homeScore, awayScore });
    console.log("Estadísticas de jugadores:", allPlayers);
    alert("Partido finalizado y datos guardados. Revisa el panel de estadísticas.");
  };

  const handlePlayerSelect = (playerId: number) => {
    if (gameState !== "roster_selection" && gameState !== "second_half_roster") {
      return;
    }

    const playerToAdd = allPlayers.find((p) => p.id === playerId);
    if (!playerToAdd || playerToAdd.hasRedCard) return;

    if (starters.some(s => s.id === playerToAdd.id)) {
      setStarters(starters.filter((p) => p.id !== playerToAdd.id));
    } else {
      if (starters.length < 5) {
        setStarters([...starters, playerToAdd]);
      }
    }
  };

  const confirmRoster = () => {
    if (starters.length !== 5) return;
    // Los expulsados no pueden volver a ingresar en el segundo tiempo
    setSubstitutes(allPlayers.filter((p) => !starters.some(s => s.id === p.id) && !p.hasRedCard && !p.stats.expulsado));
    setGameState("in_game");
  };

  const handleSubstituteClick = (player: Player) => {
    if (gameState !== "in_game" || player.hasRedCard) return;

    if (isSubbing) {
      setSelectedSubstitute(null);
      setIsSubbing(false);
    } else {
      setSelectedSubstitute(player);
      setIsSubbing(true);
    }
  };

  const handleStarterClick = (player: Player) => {
    if (gameState !== "in_game") {
      return;
    }
    
    if (player.hasRedCard) {
      if (isSubbing && selectedSubstitute) {
        // Realizar la sustitución del jugador expulsado
        const newStarters = starters.filter(p => p.id !== player.id).concat(selectedSubstitute);
        setStarters(newStarters);
        setSubstitutes(substitutes.filter(p => p.id !== selectedSubstitute.id));
        
        setAllPlayers(prevPlayers => prevPlayers.map(p => {
          if (p.id === player.id) {
            return { ...p, stats: { ...p.stats, minutosJugados: (p.stats.minutosJugados || 0) + (activePlayerTimers[p.id] || 0) } };
          }
          return p;
        }));

        setActivePlayerTimers(prevTimers => ({ ...prevTimers, [selectedSubstitute.id]: 0 }));
        
        setSelectedSubstitute(null);
        setIsSubbing(false);
        setRedCardedPlayer(null);
      } else {
        // Opción para anular la tarjeta roja si no hay sustitución en curso
        setSelectedPlayerForAction(player);
      }
      return;
    }

    if (isSubbing && selectedSubstitute) {
      setStarters(starters.map(p => p.id === player.id ? selectedSubstitute : p));
      setSubstitutes(substitutes.map(p => p.id === selectedSubstitute.id ? player : p));
      
      setAllPlayers(prevPlayers => prevPlayers.map(p => {
        if (p.id === player.id) {
          return { ...p, stats: { ...p.stats, minutosJugados: (p.stats.minutosJugados || 0) + (activePlayerTimers[p.id] || 0) } };
        }
        return p;
      }));

      setActivePlayerTimers(prevTimers => ({ ...prevTimers, [selectedSubstitute.id]: 0 }));
      
      setSelectedSubstitute(null);
      setIsSubbing(false);
      setRedCardedPlayer(null);

    } else {
      setSelectedPlayerForAction(player);
    }
  };


  const handleActionClick = (actionId: string) => {
    if (!selectedPlayerForAction) return;

    // Si el jugador está expulsado, no permitir acciones
    if (selectedPlayerForAction.hasRedCard || selectedPlayerForAction.stats.expulsado) return;

    if (actionId === "tarjetaRoja") {
      setAllPlayers((prevPlayers) =>
        prevPlayers.map((player) =>
          player.id === selectedPlayerForAction.id
            ? {
                ...player,
                stats: { ...player.stats, tarjetaRoja: (player.stats.tarjetaRoja || 0) + 1, expulsado: true },
                hasRedCard: true,
              }
            : player
        )
      );
      setActivePlayerTimers(prevTimers => {
        const newTimers = { ...prevTimers };
        delete newTimers[selectedPlayerForAction.id];
        return newTimers;
      });
      setRedCardedPlayer(selectedPlayerForAction);
      setSelectedPlayerForAction(null);
    } else if (actionId === "tarjetaAmarilla") {
      setAllPlayers((prevPlayers) =>
        prevPlayers.map((player) => {
          if (player.id === selectedPlayerForAction.id) {
            const amarillas = (player.stats.tarjetaAmarilla || 0) + 1;
            // Si llega a 2 amarillas, expulsar igual que roja
            if (amarillas >= 2) {
              return {
                ...player,
                stats: { ...player.stats, tarjetaAmarilla: amarillas, tarjetaRoja: (player.stats.tarjetaRoja || 0) + 1, expulsado: true },
                hasRedCard: true,
              };
            }
            return {
              ...player,
              stats: { ...player.stats, tarjetaAmarilla: amarillas },
            };
          }
          return player;
        })
      );
      // Si fue expulsado por doble amarilla, pausar tiempo y setear redCardedPlayer
      const updatedPlayer = allPlayers.find(p => p.id === selectedPlayerForAction.id);
      if (updatedPlayer && ((updatedPlayer.stats.tarjetaAmarilla || 0) + 1) >= 2) {
        setActivePlayerTimers(prevTimers => {
          const newTimers = { ...prevTimers };
          delete newTimers[selectedPlayerForAction.id];
          return newTimers;
        });
        setRedCardedPlayer(selectedPlayerForAction);
      }
      setSelectedPlayerForAction(null);
    } else {
      setAllPlayers((prevPlayers) =>
        prevPlayers.map((player) =>
          player.id === selectedPlayerForAction.id
            ? { ...player, stats: { ...player.stats, [actionId]: (player.stats[actionId as keyof PlayerStats] as number) + 1 } }
            : player
        )
      );
      setSelectedPlayerForAction(null);
    }
  };
  
  const handleHomeGoal = () => {
    if (selectedPlayerForAction && !selectedPlayerForAction.hasRedCard) {
      setHomeScore(homeScore + 1);
      handleActionClick("golAFavor");
    } else {
      alert("Selecciona un jugador para registrar el Gol a Favor.");
    }
  };

  const handleOpponentGoal = () => {
    setAwayScore(awayScore + 1);
    setSelectedPlayerForAction(null);
  };

  const handleCancelAction = () => {
    setSelectedPlayerForAction(null);
  }

  const handleRedCardSubstitution = (substitutePlayer: Player) => {
    if (!redCardedPlayer) return;

    const newStarters = starters.filter(p => p.id !== redCardedPlayer.id).concat(substitutePlayer);
    setStarters(newStarters);
    setSubstitutes(substitutes.filter(p => p.id !== substitutePlayer.id));

    setAllPlayers(prevPlayers => prevPlayers.map(p => {
      if (p.id === redCardedPlayer.id) {
        return { ...p, stats: { ...p.stats, minutosJugados: (p.stats.minutosJugados || 0) + (activePlayerTimers[p.id] || 0) } };
      }
      return p;
    }));

    setActivePlayerTimers(prevTimers => ({ ...prevTimers, [substitutePlayer.id]: 0 }));
    
    setSelectedSubstitute(null);
    setIsSubbing(false);
    setRedCardedPlayer(null);
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
      {playersList.map((player) => {
        const isExpulsado = player.hasRedCard || player.stats.expulsado;
        const amarillas = player.stats.tarjetaAmarilla || 0;
        return (
          <div
            key={player.id}
            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
              isExpulsado
                ? "bg-red-500/20 border border-red-500 opacity-50"
                : isStarter
                  ? (isSubbing && selectedSubstitute?.id !== player.id ? "bg-red-500/20 border border-red-500" : "bg-[#1d2834] hover:bg-[#305176] border border-[#305176]")
                  : (isSubbing && selectedSubstitute?.id === player.id ? "bg-blue-600/20 border border-blue-500" : "bg-[#1d2834] hover:bg-[#305176]")
            }`}
            onClick={() => {
              // Si está expulsado, solo permitir sustitución
              if (isExpulsado) {
                if (isStarter && isSubbing && selectedSubstitute) {
                  handleStarterClick(player);
                }
                return;
              }
              isStarter ? handleStarterClick(player) : handleSubstituteClick(player);
            }}
          >
            <div className="flex items-center space-x-3">
              <Avatar className={`h-8 w-8 ${!isStarter || gameState === "paused" || isExpulsado ? "opacity-50" : ""}`}>
                <AvatarImage src={player.photo} alt={player.name} />
                <AvatarFallback className="bg-[#305176] text-white text-xs">
                  {player.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <p className={`text-white text-sm ${!isStarter || gameState === "paused" || isExpulsado ? "opacity-50" : ""}`}>{player.name}</p>
            </div>
            {isStarter && !isExpulsado && (
              <Badge className="bg-[#33d9f6] text-black text-xs font-medium flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {getPlayerDisplayTime(player.id)}
                {amarillas === 1 && (
                  <ShieldOff className="h-3 w-3 ml-1 text-[#f4c11a]" title="Tarjeta Amarilla" />
                )}
              </Badge>
            )}
            {isStarter && isExpulsado && (
              <Badge className="bg-red-500 text-white text-xs font-medium flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {getPlayerDisplayTime(player.id)}
                <ShieldOff className="h-3 w-3 ml-1" title="Tarjeta Roja" />
              </Badge>
            )}
            {amarillas === 1 && !isStarter && !isExpulsado && (
              <Badge className="bg-[#f4c11a] text-black text-xs font-medium flex items-center ml-2">
                <ShieldOff className="h-3 w-3" title="Tarjeta Amarilla" />
              </Badge>
            )}
            {isExpulsado && !isStarter && (
              <Badge className="bg-red-500 text-white text-xs font-medium flex items-center ml-2">
                <ShieldOff className="h-3 w-3" title="Tarjeta Roja" />
              </Badge>
            )}
          </div>
        );
      })}
    </div>
  );

  const initialRosterPlayers = useMemo(() => allPlayers.filter(p => !p.hasRedCard), [allPlayers]);

  const starterSelectionUI = (
    <div className="space-y-4">
      <p className="text-gray-400">
        Selecciona los 5 jugadores que irán de titulares.
        <span className="text-[#aff606] font-bold ml-2">({starters.length}/5)</span>
      </p>
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
  
  const desktopGameActions = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {GOAL_ACTIONS.map((action) => (
          <Button
            key={action.id}
            className={`flex-col h-20 ${action.color} text-white font-bold text-xs md:text-sm`}
            onClick={action.id === 'golAFavor' ? handleHomeGoal : handleOpponentGoal}
            disabled={action.id === 'golAFavor' && !selectedPlayerForAction}
          >
            <action.icon className="h-6 w-6" />
            {action.name}
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {GAME_ACTIONS.slice(0, 2).map((action) => (
          <Button
            key={action.id}
            className={`flex-col h-20 ${action.color} text-white font-bold text-xs md:text-sm`}
            onClick={() => handleActionClick(action.id)}
            disabled={!selectedPlayerForAction || selectedPlayerForAction.hasRedCard}
          >
            <action.icon className="h-6 w-6" />
            {action.name}
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {GAME_ACTIONS.slice(2, 4).map((action) => (
          <Button
            key={action.id}
            className={`flex-col h-20 ${action.color} text-white font-bold text-xs md:text-sm`}
            onClick={() => handleActionClick(action.id)}
            disabled={!selectedPlayerForAction}
          >
            <action.icon className="h-6 w-6" />
            {action.name}
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {GAME_ACTIONS.slice(4, 6).map((action) => (
          <Button
            key={action.id}
            className={`flex-col h-20 ${action.color} text-white font-bold text-xs md:text-sm`}
            onClick={() => handleActionClick(action.id)}
            disabled={!selectedPlayerForAction}
          >
            <action.icon className="h-6 w-6" />
            {action.name}
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {GAME_ACTIONS.slice(6, 8).map((action) => (
          <Button
            key={action.id}
            className={`flex-col h-20 ${action.color} text-white font-bold text-xs md:text-sm`}
            onClick={() => handleActionClick(action.id)}
            disabled={!selectedPlayerForAction}
          >
            <action.icon className="h-6 w-6" />
            {action.name}
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Button
          onClick={handleCancelAction}
          className="col-span-2 h-12 bg-gray-500 text-white hover:bg-gray-600 font-bold"
        >
          Cancelar acción
        </Button>
      </div>
    </div>
  );

  const mobileGameActions = (
    <Dialog open={!!selectedPlayerForAction && isMobile} onOpenChange={() => setSelectedPlayerForAction(null)}>
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
        <div className="grid grid-cols-2 gap-4">
          {GOAL_ACTIONS.map((action) => (
            <Button
              key={action.id}
              className={`flex-col h-20 ${action.color} text-white font-bold`}
              onClick={() => {
                if (action.id === 'golAFavor') {
                  handleHomeGoal();
                } else {
                  handleOpponentGoal();
                }
              }}
              disabled={action.id === 'golAFavor' && !selectedPlayerForAction}
            >
              <action.icon className="h-6 w-6" />
              {action.name}
            </Button>
          ))}
        </div>
          {GAME_ACTIONS.map((action) => (
            <Button
              key={action.id}
              className={`flex-col h-20 ${action.color} text-white font-bold`}
              onClick={() => handleActionClick(action.id)}
            >
              <action.icon className="h-6 w-6" />
              {action.name}
            </Button>
          ))}
          <Button
            onClick={handleCancelAction}
            className="col-span-2 h-12 bg-gray-500 text-white hover:bg-gray-600 font-bold"
          >
            Cancelar acción
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  const gameControlUI = (
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
            className="w-1/2 h-14 bg-[#aff606] text-black hover:bg-[#25d03f]"
          >
            <Play className="h-6 w-6 mr-2" />
            Reanudar Partido
          </Button>
          <Button
            onClick={currentHalf === 1 ? startSecondHalf : () => setIsFinalizing(true)}
            className="w-1/2 h-14 bg-[#33d9f6] text-black hover:bg-[#2bc4ea]"
          >
            {currentHalf === 1 ? "Iniciar Segundo Tiempo" : "Finalizar Partido"}
          </Button>
        </>
      )}
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

      {(gameState === "roster_selection" || gameState === "second_half_roster") ? (
        starterSelectionUI
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                <h3 className="text-white font-medium mb-2">Suplentes ({allPlayers.length - starters.length})</h3>
                {renderPlayerList(substitutes, false)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#213041] border-[#305176] lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-white">Acciones en vivo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {gameControlUI}
              {isSubbing && (
                <div className="bg-blue-500/20 text-white p-3 rounded-lg text-sm text-center">
                  Selecciona al jugador titular que saldrá por {selectedSubstitute.name}
                </div>
              )}
              {isMobile ? mobileGameActions : desktopGameActions}
            </CardContent>
          </Card>
        </div>
      )}

      <Dialog open={isFinalizing} onOpenChange={setIsFinalizing}>
        <DialogContent className="sm:max-w-[425px] bg-[#213041] border-[#305176] text-white">
          <DialogHeader className="text-center">
            <DialogTitle className="text-white text-2xl font-bold">
              Finalizar Partido
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              ¿Estás seguro de que quieres finalizar el partido? Se guardarán todas las estadísticas.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center space-x-4">
            <Button
              className="bg-red-500 text-white hover:bg-red-600"
              onClick={finishGame}
            >
              Finalizar Partido
            </Button>
            <Button
              variant="outline"
              className="border-[#305176] text-white hover:bg-[#305176]"
              onClick={() => setIsFinalizing(false)}
            >
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}