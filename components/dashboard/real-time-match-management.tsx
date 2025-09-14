"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Play, Pause, Goal, ShieldOff, Footprints,
  X, Clock, Award, History, CheckCircle2,
  Users,
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
  expulsado?: boolean;
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

export default function RealTimeMatchManagement({ matchId }: RealTimeMatchManagementProps) {
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
    Array.from({ length: 14 }, (_, i) => ({
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
            if (!player.stats.expulsado) {
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
    setSubstitutes(allPlayers.filter((p) => !starters.some(s => s.id === p.id) && !p.stats.expulsado));
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
    if (!playerToAdd || playerToAdd.stats.expulsado) return;

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
    setSubstitutes(allPlayers.filter((p) => !starters.some(s => s.id === p.id) && !p.stats.expulsado));
    setGameState("in_game");
  };

  const handleSubstituteClick = (player: Player) => {
    if (gameState !== "in_game" || player.stats.expulsado) return;

    if (isSubbing) {
      setSelectedSubstitute(null);
      setIsSubbing(false);
      setSelectedPlayerForAction(null);
    } else {
      setSelectedSubstitute(player);
      setIsSubbing(true);
      setSelectedPlayerForAction(null);
    }
  };

  const handleStarterClick = (player: Player) => {
    if (gameState !== "in_game") {
      return;
    }

    if (isSubbing && selectedSubstitute) {
      const exitingPlayer = starters.find(p => p.id === player.id);
      if (exitingPlayer) {
          setAllPlayers(prevPlayers => prevPlayers.map(p => {
              if (p.id === exitingPlayer.id) {
                  return { ...p, stats: { ...p.stats, minutosJugados: (p.stats.minutosJugados || 0) + (activePlayerTimers[p.id] || 0) } };
              }
              return p;
          }));
      }

      setStarters(starters.map(p => p.id === player.id ? selectedSubstitute : p));
      setSubstitutes(substitutes.map(p => p.id === selectedSubstitute.id ? player : p));
      
      setActivePlayerTimers(prevTimers => ({ ...prevTimers, [selectedSubstitute.id]: 0 }));
      
      setSelectedSubstitute(null);
      setIsSubbing(false);
    } else {
      setSelectedPlayerForAction(player);
      setSelectedSubstitute(null);
      setIsSubbing(false);
    }
  };

  const handleActionClick = (actionId: string) => {
    if (!selectedPlayerForAction) return;

    if (actionId === "tarjetaRoja") {
      setAllPlayers((prevPlayers) =>
        prevPlayers.map((player) =>
          player.id === selectedPlayerForAction.id
            ? {
                ...player,
                stats: {
                  ...player.stats,
                  tarjetaRoja: (player.stats.tarjetaRoja || 0) + 1,
                  expulsado: true,
                  minutosJugados: (player.stats.minutosJugados || 0) + (activePlayerTimers[player.id] || 0)
                },
              }
            : player
        )
      );
      setActivePlayerTimers(prevTimers => {
        const newTimers = { ...prevTimers };
        delete newTimers[selectedPlayerForAction.id];
        return newTimers;
      });
      setSelectedPlayerForAction(null);
    } else if (actionId === "tarjetaAmarilla") {
      setAllPlayers((prevPlayers) =>
        prevPlayers.map((player) => {
          if (player.id === selectedPlayerForAction.id) {
            const amarillas = (player.stats.tarjetaAmarilla || 0) + 1;
            if (amarillas >= 2) {
              return {
                ...player,
                stats: {
                  ...player.stats,
                  tarjetaAmarilla: amarillas,
                  tarjetaRoja: (player.stats.tarjetaRoja || 0) + 1,
                  expulsado: true,
                  minutosJugados: (player.stats.minutosJugados || 0) + (activePlayerTimers[player.id] || 0)
                },
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
      const updatedPlayer = allPlayers.find(p => p.id === selectedPlayerForAction.id);
      if (updatedPlayer && ((updatedPlayer.stats.tarjetaAmarilla || 0) + 1) >= 2) {
        setActivePlayerTimers(prevTimers => {
          const newTimers = { ...prevTimers };
          delete newTimers[selectedPlayerForAction.id];
          return newTimers;
        });
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
    if (selectedPlayerForAction && !selectedPlayerForAction.stats.expulsado) {
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

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const getPlayerDisplayTime = (playerId: number) => {
    const player = allPlayers.find(p => p.id === playerId);
    if (player?.stats.expulsado) {
      return formatTime(player.stats.minutosJugados || 0);
    }
    return formatTime(activePlayerTimers[playerId] || 0);
  };

  const renderPlayerList = (playersList: Player[], isStarter: boolean) => (
    <div className="grid grid-cols-3 gap-4 w-full mx-auto">
      {playersList.map((player) => {
        const isSelectedForAction = selectedPlayerForAction?.id === player.id;
        const isSelectedForSubbing = isSubbing && selectedSubstitute?.id === player.id;
        const isExpulsado = player.stats.expulsado;
        const amarillas = player.stats.tarjetaAmarilla || 0;
        const hasRedCard = player.stats.tarjetaRoja > 0;

        let cardClasses = "bg-[#1d2834] hover:bg-[#305176] border border-[#305176]";
        if (isExpulsado || hasRedCard) {
            cardClasses = "bg-red-500/20 border-2 border-red-500";
        } else if (amarillas >= 1) {
            cardClasses = "bg-yellow-500/20 border-2 border-yellow-500";
        }
        
        if (isSelectedForAction || isSelectedForSubbing) {
            cardClasses = "bg-[#aff606]/20 border-2 border-[#aff606]";
        }
        
        return (
          <div
            key={player.id}
            className={`p-3 rounded-lg cursor-pointer transition-colors space-y-2 aspect-square flex flex-col items-center justify-center ${cardClasses}`}
            onClick={() => {
              if (isStarter) {
                handleStarterClick(player);
              } else {
                handleSubstituteClick(player);
              }
            }}
          >
            <Avatar className={`h-16 w-16`}>
                <AvatarImage src={player.photo} alt={player.name} />
                <AvatarFallback className="bg-[#305176] text-white text-base">
                    {player.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-center justify-center space-y-1 mt-2">
              <p className={`text-white text-sm font-medium text-center`}>{player.name}</p>
              <div className="flex items-center space-x-1">
                {hasRedCard && (
                  <ShieldOff className="h-4 w-4 text-red-500" title="Tarjeta Roja" />
                )}
                {amarillas === 1 && !hasRedCard && (
                  <ShieldOff className="h-4 w-4 text-[#f4c11a]" title="Tarjeta Amarilla" />
                )}
                {amarillas >= 2 && (
                  <>
                    <ShieldOff className="h-4 w-4 text-[#f4c11a]" title="Doble Amarilla" />
                    <ShieldOff className="h-4 w-4 text-[#f4c11a]" title="Doble Amarilla" />
                  </>
                )}
                <Badge className="bg-[#33d9f6] text-black text-xs font-medium flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {getPlayerDisplayTime(player.id)}
                </Badge>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const initialRosterPlayers = useMemo(() => allPlayers.filter(p => !p.stats.expulsado), [allPlayers]);

  const starterSelectionUI = (
    <div className="space-y-4 text-center">
      <p className="text-gray-400">
        Selecciona los 5 jugadores que irán de titulares.
        <span className="text-[#aff606] font-bold ml-2">({starters.length}/5)</span>
      </p>
      <div className="flex justify-center flex-wrap gap-4 w-full mx-auto max-w-4xl">
        {initialRosterPlayers.map((player) => (
          <div
            key={player.id}
            onClick={() => handlePlayerSelect(player.id)}
            className={`p-2 bg-[#1d2834] rounded-lg border-2 aspect-square flex flex-col justify-center items-center cursor-pointer transition-colors w-[150px]
              ${starters.some(s => s.id === player.id)
                ? "border-[#aff606]"
                : "border-transparent hover:border-[#305176]"
            }`}
          >
            <Avatar className="h-20 w-20 mb-2">
              <AvatarImage src={player.photo} alt={player.name} />
              <AvatarFallback className="bg-[#305176] text-white text-base">
                {player.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <h3 className="text-white font-medium text-sm text-center">{player.name}</h3>
            <p className="text-gray-400 text-xs text-center">{player.position}</p>
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
    <div className="grid grid-cols-2 gap-4">
      <Button
        onClick={handleCancelAction}
        className="col-span-2 h-12 bg-gray-500 text-white hover:bg-gray-600 font-bold"
      >
        Cancelar acción
      </Button>
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
              disabled={action.id === 'golAFavor' && (!selectedPlayerForAction || selectedPlayerForAction.stats.expulsado)}
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
              disabled={selectedPlayerForAction?.stats.expulsado}
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
    <div className="flex justify-center space-x-4 w-full">
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
    <div className="space-y-6 p-4 lg:p-8">
      {(gameState === "roster_selection" || gameState === "second_half_roster") ? (
        initialRosterPlayers.length > 0 ? (
          starterSelectionUI
        ) : (
          <p className="text-center text-gray-400">No hay jugadores disponibles para esta categoría.</p>
        )
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-[#213041] border-[#305176] lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Users className="h-5 w-5 text-gray-400" />
                <span>Jugadores</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 max-h-[80vh] overflow-y-auto scrollbar-hide">
              <div>
                <h3 className="text-white font-medium mb-2 text-center">Jugadores en Juego ({starters.length})</h3>
                <div className="flex justify-center flex-wrap gap-4">
                  {renderPlayerList(starters, true)}
                </div>
              </div>
              <div>
                <h3 className="text-white font-medium mb-2 text-center">Suplentes ({substitutes.length})</h3>
                <div className="flex justify-center flex-wrap gap-4">
                  {renderPlayerList(substitutes, false)}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#213041] border-[#305176] lg:col-span-2 flex flex-col h-full">
            <CardHeader className="flex flex-col items-center space-y-2 flex-grow-0 h-[35%]">
              <h2 className="text-xl font-bold text-white text-center">
                {matchInfo.location === "Local" ? `Mi Club vs ${matchInfo.opponent}` : `${matchInfo.opponent} vs Mi Club`}
              </h2>
              <div className="flex flex-col items-center">
                <div className="flex items-center space-x-4 text-center">
                  <span className="text-4xl font-bold text-white">{homeScore}</span>
                  <span className="text-xl text-gray-400">-</span>
                  <span className="text-4xl font-bold text-white">{awayScore}</span>
                </div>
                <Badge className="bg-[#33d9f6] text-black mt-2 text-base font-bold flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>{formatTime(timer)}</span>
                </Badge>
              </div>
              <div className="w-full max-w-md">
                {gameControlUI}
              </div>
            </CardHeader>
            <CardContent className="space-y-4 flex flex-col flex-grow h-[65%] overflow-y-auto scrollbar-hide">
              {isSubbing && (
                <div className="bg-[#aff606]/20 text-white p-3 rounded-lg text-sm text-center border border-[#aff606]">
                  Selecciona al jugador titular que saldrá por {selectedSubstitute?.name}
                </div>
              )}
              <CardTitle className="text-white">Acciones en vivo</CardTitle>
              <div className="grid grid-cols-2 gap-4">
                {GOAL_ACTIONS.map((action) => (
                  <Button
                    key={action.id}
                    className={`flex-col h-20 ${action.color} text-white font-bold text-xs md:text-sm`}
                    onClick={action.id === 'golAFavor' ? handleHomeGoal : handleOpponentGoal}
                    disabled={action.id === 'golAFavor' && (!selectedPlayerForAction || selectedPlayerForAction.stats.expulsado)}
                  >
                    <action.icon className="h-6 w-6" />
                    {action.name}
                  </Button>
                ))}
                {GAME_ACTIONS.slice(0, 2).map((action) => (
                  <Button
                    key={action.id}
                    className={`flex-col h-20 ${action.color} text-white font-bold text-xs md:text-sm`}
                    onClick={() => handleActionClick(action.id)}
                    disabled={!selectedPlayerForAction || selectedPlayerForAction.stats.expulsado}
                  >
                    <action.icon className="h-6 w-6" />
                    {action.name}
                  </Button>
                ))}
                {GAME_ACTIONS.slice(2, 4).map((action) => (
                  <Button
                    key={action.id}
                    className={`flex-col h-20 ${action.color} text-white font-bold text-xs md:text-sm`}
                    onClick={() => handleActionClick(action.id)}
                    disabled={!selectedPlayerForAction || selectedPlayerForAction.stats.expulsado}
                  >
                    <action.icon className="h-6 w-6" />
                    {action.name}
                  </Button>
                ))}
                {GAME_ACTIONS.slice(4, 6).map((action) => (
                  <Button
                    key={action.id}
                    className={`flex-col h-20 ${action.color} text-white font-bold text-xs md:text-sm`}
                    onClick={() => handleActionClick(action.id)}
                    disabled={!selectedPlayerForAction || selectedPlayerForAction.stats.expulsado}
                  >
                    <action.icon className="h-6 w-6" />
                    {action.name}
                  </Button>
                ))}
                {GAME_ACTIONS.slice(6, 8).map((action) => (
                  <Button
                    key={action.id}
                    className={`flex-col h-20 ${action.color} text-white font-bold text-xs md:text-sm`}
                    onClick={() => handleActionClick(action.id)}
                    disabled={!selectedPlayerForAction || selectedPlayerForAction.stats.expulsado}
                  >
                    <action.icon className="h-6 w-6" />
                    {action.name}
                  </Button>
                ))}
              </div>
              <Button
                onClick={handleCancelAction}
                className="w-full h-12 bg-gray-500 text-white hover:bg-gray-600 font-bold mt-auto"
              >
                Cancelar acción
              </Button>
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