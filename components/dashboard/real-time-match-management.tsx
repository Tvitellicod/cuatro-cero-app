"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Play, Pause, Goal, ShieldOff, Footprints,
  X, Clock, Award, History, CheckCircle2,
  Users, AlertTriangle,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "@/hooks/use-toast";

// Acciones de juego disponibles para jugadores individuales
const GAME_ACTIONS = [
  { id: "recuperoPelota", name: "Recuperó Pelota", icon: CheckCircle2, color: "bg-[#25d03f]" },
  { id: "perdioPelota", name: "Perdió Pelota", icon: X, color: "bg-red-500" },
  { id: "remate", name: "Remate", icon: Footprints, color: "bg-[#aff606]" },
  { id: "remateAlArco", name: "Remate al arco", icon: Goal, color: "bg-[#aff606]" },
  { id: "faltaCometida", name: "Falta Cometida", icon: History, color: "bg-[#ea3498]" },
  { id: "faltaRecibida", name: "Falta Recibida", icon: Award, color: "bg-[#33d9f6]" },
  { id: "tarjetaAmarilla", name: "T. Amarilla", icon: AlertTriangle, color: "bg-[#f4c11a]" },
  { id: "tarjetaRoja", name: "T. Roja", icon: ShieldOff, color: "bg-red-500" },
];

const GOAL_ACTIONS = [
  { id: "golAFavor", name: "Gol a Favor", icon: Goal, color: "bg-[#25d03f]" },
  { id: "golEnContra", name: "Gol en Contra", icon: Goal, color: "bg-red-500" },
];

// Consolidación de todas las acciones para la búsqueda de nombres
const ALL_ACTIONS = [...GAME_ACTIONS, ...GOAL_ACTIONS];

type PlayerStats = {
  goles: number;
  asistencias: number;
  minutosJugados: number; 
  minutosPrimerTiempo: number; 
  minutosSegundoTiempo: number; 
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
};

type Player = {
  id: number;
  name: string;
  position: string;
  photo: string;
  stats: PlayerStats;
  isExpelled: boolean;
  isStarter: boolean;
};

type GameState = "roster_selection" | "in_game" | "paused" | "second_half_roster" | "finished";

interface MatchAction {
  type: string; 
  playerId: number | null; 
  oldValue: any; 
  scoreChange: { home: number; away: number }; 
  minutes: number; 
  exitingPlayerId?: number;
  enteringPlayerId?: number;
  timeOnFieldBeforeSub?: number; // Tiempo del jugador que sale ANTES de este stint.
}

interface RealTimeMatchManagementProps {
  matchId: string;
}

// --- MOCK DATA PARA DEMO ---

// Lista maestra de todos los jugadores (Simulando consulta a la base de datos)
const MASTER_PLAYERS = [
  { id: 1, name: "Juan García", category: "primera", position: "Arquero", status: "DISPONIBLE" },
  { id: 2, name: "Carlos Rodríguez", category: "primera", position: "Defensor", status: "DISPONIBLE" },
  { id: 3, name: "Miguel González", category: "primera", position: "Mediocampista", status: "DISPONIBLE" },
  { id: 4, name: "Roberto Fernández", category: "primera", position: "Delantero", status: "DISPONIBLE" },
  { id: 5, name: "Diego López", category: "primera", position: "Defensor", status: "DISPONIBLE" },
  { id: 6, name: "Fernando Martínez", category: "primera", position: "Mediocampista", status: "DISPONIBLE" },
  { id: 7, name: "Alejandro Sánchez", category: "tercera", position: "Delantero", status: "DISPONIBLE" },
  { id: 8, name: "Sebastián Pérez", category: "tercera", position: "Arquero", status: "LESIONADO" },
  { id: 9, name: "Martín Gómez", category: "tercera", position: "Defensor", status: "DISPONIBLE" },
  { id: 10, name: "Pablo Martín", category: "tercera", position: "Mediocampista", status: "DISPONIBLE" },
  { id: 11, name: "Gonzalo Jiménez", category: "juveniles", position: "Delantero", status: "DISPONIBLE" },
  { id: 12, name: "Nicolás Ruiz", category: "juveniles", position: "Arquero", status: "DISPONIBLE" },
  { id: 13, name: "Facundo Hernández", category: "juveniles", position: "Defensor", status: "DISPONIBLE" },
  { id: 14, name: "Matías Díaz", category: "juveniles", position: "Mediocampista", status: "DISPONIBLE" },
  { id: 15, name: "Lucas Moreno", category: "juveniles", position: "Delantero", status: "DISPONIBLE" },
  { id: 16, name: "Tomás Muñoz", category: "cuarta", position: "Defensor", status: "DISPONIBLE" },
  { id: 17, name: "Agustín Álvarez", category: "cuarta", position: "Mediocampista", status: "LESIONADO" },
];

// Partidos citados (Simulando datos guardados en Próximos Partidos)
const UPCOMING_MATCHES_MOCK = [
  { id: "1", opponent: "Club Atlético River", category: "Primera División", citedPlayers: [1, 2, 3, 4, 5, 6] },
  { id: "2", opponent: "Boca Juniors", category: "Primera División", citedPlayers: [1, 2, 3, 4, 5, 7, 9, 10] },
  { id: "100", opponent: "San Lorenzo", category: "Juveniles", citedPlayers: [11, 12, 13, 14, 15] },
];

// --- FUNCIÓN DE INICIALIZACIÓN ---
const initializePlayers = (matchId: string): Player[] => {
  const match = UPCOMING_MATCHES_MOCK.find(m => m.id.toString() === matchId);
  const citedIds = match ? match.citedPlayers : [];

  return MASTER_PLAYERS
    .filter(p => citedIds.includes(p.id)) // <-- FILTRADO CLAVE: Solo jugadores citados
    .map(p => ({
      id: p.id,
      name: p.name,
      position: p.position,
      photo: "/placeholder-user.jpg",
      stats: { // Stats iniciales en 0
        goles: 0, asistencias: 0, minutosJugados: 0, minutosPrimerTiempo: 0, minutosSegundoTiempo: 0,
        recuperoPelota: 0, perdioPelota: 0, remate: 0, remateAlArco: 0, tarjetaAmarilla: 0, tarjetaRoja: 0,
        faltaCometida: 0, faltaRecibida: 0, golAFavor: 0, golEnContra: 0,
      },
      isExpelled: false,
      isStarter: false,
    }));
};

// --- FUNCIÓN DE INICIALIZACIÓN DE DATOS DEL PARTIDO ---
const getMatchInfo = (matchId: string) => {
    const defaultInfo = {
        id: matchId,
        opponent: "Rival Desconocido",
        date: "N/A",
        location: "N/A",
        tournament: "N/A",
        category: "N/A",
    };
    return UPCOMING_MATCHES_MOCK.find(m => m.id.toString() === matchId) || defaultInfo;
};


export default function RealTimeMatchManagement({ matchId }: RealTimeMatchManagementProps) {
  const isMobile = useIsMobile();
  const [gameState, setGameState] = useState<GameState>("roster_selection");
  const [timer, setTimer] = useState(0); 
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [currentHalf, setCurrentHalf] = useState(1);
  
  // activePlayerTimers almacena el tiempo TOTAL ACUMULADO para el jugador en la mitad actual.
  const [activePlayerTimers, setActivePlayerTimers] = useState<Record<number, number>>({});
  
  const [selectedPlayerForAction, setSelectedPlayerForAction] = useState<Player | null>(null);
  const [selectedSubstitute, setSelectedSubstitute] = useState<Player | null>(null);
  const [isSubbing, setIsSubbing] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  
  const actionHistoryRef = useRef<MatchAction[]>([]);
  
  // INICIALIZACIÓN USANDO EL matchId
  const [allPlayers, setAllPlayers] = useState<Player[]>(() => initializePlayers(matchId)); 

  const matchInfo = useMemo(() => getMatchInfo(matchId), [matchId]);

  const clubName = "Amigos de Villa Luro";

  // Jugadores que actualmente están en el campo (isStarter = true)
  const starters = useMemo(() => allPlayers.filter(p => p.isStarter && !p.isExpelled), [allPlayers]);
  
  // Jugadores que están en el banquillo (isStarter = false)
  const substitutes = useMemo(() => allPlayers.filter(p => !p.isStarter && !p.isExpelled), [allPlayers]);
  
  // Jugadores disponibles para seleccionar como titulares al inicio de cada mitad
  const starterSelectionPlayers = useMemo(() => {
    return allPlayers.filter(p => !p.isExpelled);
  }, [allPlayers]);


  // Timer logic for clock and activePlayerTimers
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (gameState === "in_game") {
      interval = setInterval(() => {
        setTimer((t) => t + 1);
        
        setActivePlayerTimers((timers) => {
          const newTimers = { ...timers };
          // Itera sobre las claves de los jugadores activos y suma 1 segundo.
          for (const id in newTimers) {
              newTimers[Number(id)] = newTimers[Number(id)] + 1;
          }
          return newTimers;
        });
      }, 1000);
    } 
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState]); 

  // --- FUNCIÓN AUXILIAR: Obtener Nombre de la Acción ---
  const getActionNameById = (id: string): string => {
    const action = ALL_ACTIONS.find(a => a.id === id);
    if (action) return action.name;

    if (id === 'substitution') return "Sustitución"; 
    if (id === 'golAFavor') return "Gol a Favor";
    if (id === 'golEnContra') return "Gol en Contra";
    
    return id; 
  };

  // --- FUNCIÓN AUXILIAR: Obtener Jugador por ID ---
  const getPlayerById = (id: number) => allPlayers.find(p => p.id === id);


  // --- FUNCIÓN PARA REGISTRAR ACCIONES ---
  const addActionToHistory = (action: MatchAction) => {
    actionHistoryRef.current.push({ 
        ...action, 
        minutes: timer 
    });
  };

  // --- FUNCIÓN UNDO (CORREGIDA PARA EL MENSAJE) ---
  const undoLastAction = () => {
    const lastAction = actionHistoryRef.current.pop();
    if (!lastAction) return;
  
    const { type, playerId, oldValue, scoreChange, exitingPlayerId, enteringPlayerId, timeOnFieldBeforeSub } = lastAction;

    // 1. Revert Score
    setHomeScore(s => s - scoreChange.home);
    setAwayScore(s => s - scoreChange.away);

    // 2. Revert Player Stats/Expulsion & Position Swap
    setAllPlayers(prevPlayers => {
        const timeField = currentHalf === 1 ? 'minutosPrimerTiempo' : 'minutosSegundoTiempo';
        let newPlayers = [...prevPlayers];
        
        // Encontrar los jugadores originales (sin el cambio de posición)
        const exitingPlayer = prevPlayers.find(p => p.id === exitingPlayerId);
        const enteringPlayer = prevPlayers.find(p => p.id === enteringPlayerId);
        
        // --- Lógica de Sustitución Revertida (Intercambio de posiciones y status) ---
        if (type === 'substitution' && exitingPlayerId && enteringPlayerId && timeOnFieldBeforeSub !== undefined && exitingPlayer && enteringPlayer) {
            
            // 2.1. Buscar la posición final de cada jugador en el array modificado por el cambio.
            const currentEnterIndex = newPlayers.findIndex(p => p.id === enteringPlayerId);
            const currentExitIndex = newPlayers.findIndex(p => p.id === exitingPlayerId);

            // 2.2. Revertir las propiedades de los jugadores:
            // El jugador que salió vuelve a ser titular con su tiempo ANTES del stint de salida
            const revertedExitingPlayer = { 
                ...exitingPlayer, 
                isStarter: true,
                stats: { ...exitingPlayer.stats, [timeField]: timeOnFieldBeforeSub } 
            };
            // El jugador que entró vuelve a ser suplente con el tiempo que tenía antes de entrar (que ya estaba en sus stats)
            const revertedEnteringPlayer = { 
                ...enteringPlayer, 
                isStarter: false
            };
            
            // 2.3. Deshacer el intercambio:
            if (currentEnterIndex !== -1 && currentExitIndex !== -1) {
                // El ex-titular (revertedExitingPlayer) vuelve a su puesto (currentEnterIndex)
                newPlayers[currentEnterIndex] = revertedExitingPlayer; 
                // El ex-suplente (revertedEnteringPlayer) vuelve a su puesto (currentExitIndex)
                newPlayers[currentExitIndex] = revertedEnteringPlayer; 
            }

        } else if (playerId !== null) {
             // --- Lógica de Acción Revertida ---
            newPlayers = newPlayers.map(p => {
                if (p.id === playerId) {
                    const newStats = { ...p.stats };
                    const newPlayer = { ...p };
                    
                    // Revert Cards & Expulsion
                    if (type === 'tarjetaRoja' || (type === 'tarjetaAmarilla' && oldValue === 1)) {
                        newPlayer.isExpelled = false;
                        newStats.tarjetaRoja = Math.max(0, newStats.tarjetaRoja - 1);
                    } 
                    
                    // Revert the specific stat value
                    if (type in newStats) {
                        newStats[type as keyof PlayerStats] = oldValue;
                    }
                    
                    return { ...newPlayer, stats: newStats };
                }
                return p;
            });
        }
        return newPlayers;
    });
    
    // 3. Revert Timers (en activePlayerTimers)
    if (lastAction.type !== 'substitution') {
        const player = allPlayers.find(p => p.id === playerId)!;
        if (player.isExpelled) {
             const timeField = currentHalf === 1 ? 'minutosPrimerTiempo' : 'minutosSegundoTiempo';
             // Reingresar el jugador al timer con su tiempo correcto (si estaba fuera por expulsión)
             setActivePlayerTimers(prevTimers => ({ ...prevTimers, [playerId!]: player.stats[timeField] }));
        }
    } else if (exitingPlayerId && enteringPlayerId && timeOnFieldBeforeSub !== undefined) {
        // Revertir timer para la sustitución
        setActivePlayerTimers(prevTimers => {
            const newTimers = { ...prevTimers };
            // El jugador que entró (ex-sub) se le quita el timer
            delete newTimers[enteringPlayerId];
            // El jugador que salió (ex-starter) se le pone el tiempo que tenía antes del cambio
            newTimers[exitingPlayerId] = timeOnFieldBeforeSub; // Usamos el valor guardado antes del stint

            return newTimers;
        });
    }

    // --- GENERACIÓN DEL MENSAJE DE CONFIRMACIÓN ---
    let toastActionName: string;
    let toastPlayerName: string;
    
    if (type === 'substitution') {
        const exited = getPlayerById(exitingPlayerId!);
        const entered = getPlayerById(enteringPlayerId!);
        toastActionName = `Sustitución`;
        toastPlayerName = `(Sale: ${exited?.name || 'N/A'}, Entra: ${entered?.name || 'N/A'})`;
    } else if (type === 'golEnContra') {
        toastActionName = getActionNameById(type); // "Gol en Contra"
        toastPlayerName = 'Rival';
    } else if (playerId && type !== 'substitution') {
        const player = getPlayerById(playerId);
        toastActionName = getActionNameById(type);
        toastPlayerName = player?.name || 'Jugador Desconocido';
    } else {
        toastActionName = 'Acción de Sistema';
        toastPlayerName = 'N/A';
    }
    
    // Aplicamos el formato final (sin los **)
    toast({
        title: "Confirmado",
        description: `La acción ${toastActionName} del jugador ${toastPlayerName}, fue cancelada.`,
        variant: "default",
    });
    
    // 4. Resetear flags
    setSelectedPlayerForAction(null);
    setSelectedSubstitute(null);
    setIsSubbing(false);
  };
  
  const startGame = () => {
    // Usado para reanudar el juego desde estado 'paused'
    setGameState("in_game");
  }
  
  const pauseGame = () => setGameState("paused");

  const startSecondHalf = () => {
    pauseGame(); 
    const timeField = 'minutosPrimerTiempo';
    
    // 1. Guardar el tiempo jugado del 1T para todos los jugadores
    setAllPlayers(prevPlayers => prevPlayers.map(p => {
      // Si el jugador es titular al final (p.isStarter), su tiempo total es el valor del timer.
      const totalTimePlayedThisHalf = activePlayerTimers[p.id] || 0;
      
      // Solo actualizamos p.stats[timeField] si el jugador estaba EN EL CAMPO al finalizar.
      const finalTimeForHalf = p.isStarter ? totalTimePlayedThisHalf : p.stats[timeField];

      const updatedStats = {
          ...p.stats,
          [timeField]: finalTimeForHalf, 
      };

      return {
          ...p,
          stats: updatedStats,
          isStarter: false, // Reset starter status for second half roster selection
      };
    }));
    
    // 2. Resetear timers, cambiar mitad, y entrar a selección de plantilla 2T
    setTimer(0);
    setActivePlayerTimers({});
    setCurrentHalf(2);
    setGameState("second_half_roster"); 
  };

  const finishGame = () => {
    pauseGame(); 
    const timeField = 'minutosSegundoTiempo';

    // 1. Guardar el tiempo jugado de la 2T para los que estaban en juego
    setAllPlayers(prevPlayers => prevPlayers.map(p => {
      // Si el jugador es titular al final, su tiempo total es el valor del timer.
      const totalTimePlayedThisHalf = activePlayerTimers[p.id] || 0;
      
      // Solo actualizamos p.stats[timeField] si el jugador estaba EN EL CAMPO.
      const finalTimeForHalf = p.isStarter ? totalTimePlayedThisHalf : p.stats[timeField];

      const updatedStats = {
          ...p.stats,
          [timeField]: finalTimeForHalf,
      };

      return {
        ...p,
        stats: {
            ...updatedStats,
            minutosJugados: updatedStats.minutosPrimerTiempo + updatedStats.minutosSegundoTiempo,
        },
      };
    }));

    setGameState("finished");
    setIsFinalizing(false);
    
    console.log("¡Partido finalizado!");
    console.log("Tiempo Total Jugado (general):", formatTime(timer + (currentHalf === 1 ? 0 : 45 * 60))); 
    console.log("Estadísticas de jugadores finales:", allPlayers);
    alert("Partido finalizado y datos listos para guardar. Revisa la consola para las estadísticas finales.");
  };

  const handlePlayerSelect = (playerId: number) => {
    if (gameState !== "roster_selection" && gameState !== "second_half_roster") return;

    setAllPlayers(prevPlayers => {
        const selectedCount = prevPlayers.filter(pl => pl.isStarter).length;
        return prevPlayers.map(p => {
            if (p.id === playerId) {
                if (p.isExpelled) return p; 
                
                const newStarterStatus = !p.isStarter;
                
                if (newStarterStatus && selectedCount >= 5) {
                    return p; 
                }
                
                return { ...p, isStarter: newStarterStatus };
            }
            return p;
        });
    });
  };

  const confirmRoster = () => {
    if (starters.length !== 5) {
        toast({
            title: "Error de Selección",
            description: "Debes seleccionar exactamente 5 jugadores para iniciar el partido.",
            variant: "default",
        });
        return;
    }
    
    // --- LÓGICA DE INICIALIZACIÓN DE TIEMPO ---
    const timeField = currentHalf === 1 ? 'minutosPrimerTiempo' : 'minutosSegundoTiempo';
    const initialTimers: Record<number, number> = {};
    
    // Inicializa los timers con el tiempo que tienen acumulado en esta mitad (tiempo congelado).
    allPlayers.forEach(player => {
      // Solo los jugadores seleccionados como titulares (y no expulsados) entran en el juego
      if (player.isStarter && !player.isExpelled) {
        initialTimers[player.id] = player.stats[timeField] || 0;
      }
    });
    
    setActivePlayerTimers(initialTimers);
    setGameState("in_game");
  };

  const handleSubstituteClick = (player: Player) => {
    if (gameState !== "in_game") return;
    
    if (selectedSubstitute?.id === player.id) {
        setSelectedSubstitute(null);
        setIsSubbing(false);
    } else {
        setSelectedSubstitute(player);
        setIsSubbing(true);
        setSelectedPlayerForAction(null);
    }
  };
  
  const handleStarterClick = (player: Player) => {
    if (gameState !== "in_game") return;

    // Case 1: Perform a substitution.
    if (isSubbing && selectedSubstitute) {
        if (player.isExpelled && !player.isStarter) return; // Suplente expulsado no puede entrar
        
        const exitingPlayer = player;
        const enteringPlayer = selectedSubstitute;
        
        const timeField = currentHalf === 1 ? 'minutosPrimerTiempo' : 'minutosSegundoTiempo';

        // 1. Obtener el tiempo jugado (activePlayerTimers) que es el tiempo total acumulado para el jugador.
        const totalMinutesPlayedInHalf = activePlayerTimers[exitingPlayer.id] || 0; // Tiempo a congelar
        
        // 2. Registrar la acción
        addActionToHistory({ 
            type: 'substitution', 
            playerId: enteringPlayer.id, 
            oldValue: null,
            scoreChange: { home: 0, away: 0 },
            exitingPlayerId: exitingPlayer.id, 
            enteringPlayerId: enteringPlayer.id,
            // Guardamos el tiempo base antes del stint (tiempo congelado)
            timeOnFieldBeforeSub: exitingPlayer.stats[timeField] 
        });

        // 3. Actualizar el estado de los jugadores y realizar el intercambio posicional en el array 'allPlayers'.
        setAllPlayers(prevPlayers => {
            const exitIndex = prevPlayers.findIndex(p => p.id === exitingPlayer.id);
            const enterIndex = prevPlayers.findIndex(p => p.id === enteringPlayer.id);

            if (exitIndex === -1 || enterIndex === -1) return prevPlayers;

            const newPlayers = [...prevPlayers];
            
            // --- Cargar datos y cambiar el isStarter de forma lógica ---
            // Jugador que sale: isStarter: false, congela su tiempo
            const dataExiting = { ...exitingPlayer, isStarter: false, stats: { ...exitingPlayer.stats, [timeField]: totalMinutesPlayedInHalf } };
            // Jugador que entra: isStarter: true 
            const dataEntering = { ...enteringPlayer, isStarter: true };

            // --- Intercambio de Posición: El que entra toma el lugar del que salió, y viceversa ---
            
            // El jugador que entra (dataEntering) toma el lugar del que salió (exitIndex)
            newPlayers[exitIndex] = dataEntering;
            
            // El jugador que sale (dataExiting) toma el lugar del que entró (enterIndex)
            newPlayers[enterIndex] = dataExiting;

            return newPlayers;
        });


        // 4. Actualizar los timers activos (LÓGICA CLAVE DE INICIO/PAUSA)
        setActivePlayerTimers(prevTimers => {
            const newTimers = { ...prevTimers };
            
            // Pausar el tiempo del jugador que salió (removiéndolo del mapa de timers activos)
            delete newTimers[exitingPlayer.id]; 
            
            // Reanudar/Iniciar el tiempo del jugador que entró (usando el tiempo previamente guardado en sus stats)
            const enteringPlayerTime = enteringPlayer.stats[timeField]; 
            newTimers[enteringPlayer.id] = enteringPlayerTime; 
            
            return newTimers;
        });
        
        // 5. Resetear flags
        setSelectedSubstitute(null);
        setIsSubbing(false);
        return;
    }

    // Case 2: Select a player for an action.
    if (!isSubbing) {
        if (selectedPlayerForAction?.id === player.id) {
            setSelectedPlayerForAction(null);
            handleCancelAction();
        } else {
            setSelectedPlayerForAction(player);
            setSelectedSubstitute(null);
        }
    }
  };

  const handleActionClick = (actionId: string) => {
    if (!selectedPlayerForAction) return;

    const playerId = selectedPlayerForAction.id;
    const player = allPlayers.find(p => p.id === playerId);
    if (!player || player.isExpelled) return;

    const oldStats = { ...player.stats };

    // Card Logic
    if (actionId === "tarjetaRoja" || (actionId === "tarjetaAmarilla" && oldStats.tarjetaAmarilla >= 1)) {
        const timeField = currentHalf === 1 ? 'minutosPrimerTiempo' : 'minutosSegundoTiempo';

        setAllPlayers((prevPlayers) =>
            prevPlayers.map((p) => {
              if (p.id === playerId) {
                // El tiempo total es el que tiene en su cronómetro activo
                const totalMinutesPlayedInHalf = activePlayerTimers[playerId] || 0;
                
                let newAmarillas = oldStats.tarjetaAmarilla;
                let newRedCards = oldStats.tarjetaRoja;
                let isExpelled = p.isExpelled; 
                let timeUpdate = p.stats[timeField];

                // 1. Acumulación de tarjetas
                if (actionId === "tarjetaAmarilla") {
                    newAmarillas += 1;
                }
                
                // 2. Lógica de Expulsión
                if ((newAmarillas >= 2 && !p.isExpelled) || actionId === "tarjetaRoja") {
                    if (newAmarillas >= 2) {
                        newRedCards += 1;
                    } else if (actionId === "tarjetaRoja") {
                        newRedCards += 1;
                    }
                    isExpelled = true;
                    // Mantenemos isStarter = p.isStarter (TRUE) HASTA EL CAMBIO MANUAL
                    timeUpdate = totalMinutesPlayedInHalf; // Congelar el tiempo
                }

                // 3. Registro de Acción
                addActionToHistory({ 
                    type: actionId, 
                    playerId, 
                    oldValue: (actionId === "tarjetaAmarilla") ? oldStats.tarjetaAmarilla : oldStats.tarjetaRoja,
                    scoreChange: { home: 0, away: 0 }
                });
                
                return { 
                    ...p, 
                    isExpelled: isExpelled,
                    isStarter: p.isStarter, // Mantenemos el estado de titular para que aparezca en el campo.
                    stats: {
                        ...p.stats,
                        tarjetaAmarilla: newAmarillas,
                        tarjetaRoja: newRedCards,
                        [timeField]: timeUpdate,
                    }
                };
              }
              return p;
            })
        );
        
        // 4. Si es expulsión, detener el timer
        if ((actionId === "tarjetaAmarilla" && (oldStats.tarjetaAmarilla + 1) >= 2) || actionId === "tarjetaRoja") {
          setActivePlayerTimers(prevTimers => {
            const newTimers = { ...prevTimers };
            delete newTimers[playerId];
            return newTimers;
          });
        }
        setSelectedPlayerForAction(null);
    } else {
        const statKey = actionId as keyof PlayerStats;
        
        setAllPlayers((prevPlayers) =>
          prevPlayers.map((p) =>
            p.id === playerId
              ? { 
                  ...p, 
                  stats: { 
                      ...p.stats, 
                      [statKey]: (p.stats[statKey] as number) + 1,
                  } 
                }
              : p
          )
        );
        
        addActionToHistory({ 
            type: actionId, 
            playerId, 
            oldValue: oldStats[statKey],
            scoreChange: { home: 0, away: 0 }
        });
        setSelectedPlayerForAction(null);
    }
  };

  const handleHomeGoal = () => {
    if (!selectedPlayerForAction || selectedPlayerForAction.isExpelled) {
      alert("Selecciona un jugador para registrar el Gol a Favor.");
      return;
    }

    const playerId = selectedPlayerForAction.id;
    const oldStats = { ...selectedPlayerForAction.stats };
    
    setHomeScore(s => s + 1);
    
    addActionToHistory({ 
        type: 'golAFavor', 
        playerId, 
        oldValue: oldStats.goles,
        scoreChange: { home: 1, away: 0 }
    });
    
    setAllPlayers((prevPlayers) =>
      prevPlayers.map((player) =>
        player.id === playerId
          ? { ...player, stats: { ...player.stats, goles: (player.stats.goles || 0) + 1 } }
          : player
      )
    );
    setSelectedPlayerForAction(null);
  };

  const handleOpponentGoal = () => {
    setAwayScore(s => s + 1);
    addActionToHistory({ 
        type: 'golEnContra', 
        playerId: null, 
        oldValue: null,
        scoreChange: { home: 0, away: 1 }
    });
    setSelectedPlayerForAction(null);
  };

  const handleCancelAction = () => {
    setSelectedPlayerForAction(null);
    setSelectedSubstitute(null);
    setIsSubbing(false);
  }

  // Utilities
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };
  
  const getPlayerTimeForDisplay = (player: Player): string => {
    const timeField = currentHalf === 1 ? 'minutosPrimerTiempo' : 'minutosSegundoTiempo';
    
    if (player.isExpelled || !player.isStarter) {
        // Expulsado o Suplente: Muestra el tiempo congelado (guardado en stats[timeField])
        return formatTime(player.stats[timeField] || 0);
    } else {
        // Titular: Muestra el tiempo activo (viene de activePlayerTimers)
        return formatTime(activePlayerTimers[player.id] || 0);
    }
  };

  const renderPlayerCard = (player: Player, isStarter: boolean) => {
    const isSelectedForAction = selectedPlayerForAction?.id === player.id;
    const isSelectedSubstitute = selectedSubstitute?.id === player.id;
    const isExpulsado = player.isExpelled;
    const amarillas = player.stats.tarjetaAmarilla || 0;
    const isDoubleYellow = amarillas >= 2 && !isExpulsado; 

    let cardClasses = "bg-[#1d2834] hover:bg-[#305176] border border-[#305176]";
    
    // ESTADOS ESPECIALES (Expulsado, Doble Amarilla, Sustitución, Acción)
    if (isExpulsado) {
        // El jugador es expulsado pero permanece en el campo (isStarter=true) hasta el cambio.
        cardClasses = "bg-red-500/20 border-2 border-red-500 cursor-default";
    }
    else if (isSubbing) {
        if (isStarter) {
            // Jugador de campo a salir (ROJO para indicar que está siendo sacado)
            cardClasses = "bg-red-500/20 border-2 border-red-500 hover:bg-red-500/40";
        } else if (isSelectedSubstitute) {
            // Jugador suplente a entrar (VERDE para indicar que está entrando)
            cardClasses = "bg-[#aff606]/20 border-2 border-[#aff606]";
        }
    } 
    else if (isSelectedForAction) {
        // Jugador seleccionado para acción
        cardClasses = "bg-[#aff606]/20 border-2 border-[#aff606]";
    } 
    else if (amarillas === 1) {
        // Jugador con una amarilla (Precaución)
        cardClasses = "bg-yellow-500/20 border-2 border-yellow-500";
    }

    // LÓGICA DE BLOQUEO DE CLICKS:
    // Si el jugador está expulsado Y es titular (aún en la lista de campo),
    // solo se le puede hacer clic si estamos en modo sustitución (isSubbing).
    const isClickBlockedForExpelled = isExpulsado && isStarter && !isSubbing; 

    return (
        <div
            key={player.id}
            className={`p-3 rounded-lg cursor-pointer transition-colors space-y-2 aspect-square flex flex-col items-center justify-center ${cardClasses}`}
            onClick={() => {
                
                if (isClickBlockedForExpelled) {
                    // Si está expulsado y NO estamos en modo sustitución, bloqueamos la acción y mostramos mensaje.
                    toast({
                        title: "Acción Bloqueada",
                        description: `El jugador ${player.name} fue expulsado. Selecciona un suplente (verde) para retirarlo del campo.`,
                        variant: "default",
                    });
                    return;
                }
                
                // Si llegamos aquí, el click es válido: o no está expulsado, O estamos en modo sustitución y el usuario lo está sacando.
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
            <div className="flex flex-col items-center justify-center space-y-1">
              <p className={`text-white text-sm font-medium text-center`}>{player.name}</p>
              
              <div className="flex items-center space-x-1">
                
                {/* Icono de Tarjeta Roja/Expulsado */}
                {isExpulsado && (
                  <ShieldOff className="h-4 w-4 text-red-500" title="EXPULSADO" />
                )}
                
                {/* Icono de Tarjeta Amarilla (una sola) */}
                {amarillas === 1 && !isExpulsado && (
                    <AlertTriangle className="h-4 w-4 text-[#f4c11a]" title="Tarjeta Amarilla" />
                )}

                {/* Reloj para Titulares (Activo) o Suplentes (Congelado) */}
                {(!isExpulsado || isStarter) && (
                  <Badge 
                    className={
                        isStarter 
                            ? "bg-[#33d9f6] text-black text-xs font-medium flex items-center space-x-2" 
                            : "bg-gray-500 text-white text-xs font-medium flex items-center space-x-2" 
                    }
                  >
                    <Clock className="h-3 w-3 mr-1" />
                    {getPlayerTimeForDisplay(player)}
                  </Badge>
                )}
              </div>
            </div>
        </div>
    );
  };
  
  // DEFINICIÓN DE starterSelectionUI 
  const starterSelectionUI = (
    <div className="space-y-4 text-center">
      <p className="text-gray-400">
        Selecciona los 5 jugadores que irán de titulares.
        <span className="text-[#aff606] font-bold ml-2">({starters.length}/5)</span>
      </p>
      <div className="flex justify-center flex-wrap gap-4 w-full mx-auto max-w-4xl">
        {starterSelectionPlayers.map((player) => (
          <div
            key={player.id}
            onClick={() => handlePlayerSelect(player.id)}
            className={`p-2 bg-[#1d2834] rounded-lg border-2 aspect-square flex flex-col justify-center items-center cursor-pointer transition-colors w-[150px]
              ${player.isExpelled 
                ? "border-red-500 bg-red-500/20 opacity-50 cursor-not-allowed"
                : starters.some(s => s.id === player.id)
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
            {player.stats.tarjetaAmarilla > 0 && !player.isExpelled && (
                <Badge className="bg-[#f4c11a] text-black">1A</Badge>
            )}
            {player.isExpelled && (
                <Badge className="bg-red-500 text-white">EXPULSADO</Badge>
            )}
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

  // Renderizado principal
  return (
    <div className="space-y-6 p-4 lg:p-8">
      {(gameState === "roster_selection" || gameState === "second_half_roster") ? (
        starterSelectionPlayers.length > 0 ? (
          starterSelectionUI
        ) : (
          <p className="text-center text-gray-400">No hay jugadores citados disponibles para este partido.</p>
        )
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* CUADRANTE 1: Jugadores (Starters & Subs) */}
          <Card className="bg-[#213041] border-[#305176] lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Users className="h-5 w-5 text-gray-400" />
                <span>Jugadores ({currentHalf === 1 ? "1T" : "2T"})</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 max-h-[80vh] overflow-y-auto">
              
              {/* Starters */}
              <div>
                <h3 className="text-white font-medium mb-2 text-center">Jugadores en Juego ({starters.length})</h3>
                <div className="grid grid-cols-3 gap-4 mx-auto max-w-md">
                  {/* Importante: Renderiza solo los que son isStarter: true */}
                  {allPlayers.filter(p => p.isStarter).map((player) => renderPlayerCard(player, true))}
                </div>
              </div>
              
              {/* Substitutes */}
              <div>
                <h3 className="text-white font-medium mb-2 text-center">Jugadores Suplentes ({substitutes.length})</h3>
                {/* Importante: Renderiza solo los que son isStarter: false */}
                <div className="grid grid-cols-3 gap-4 mx-auto max-w-md">
                  {allPlayers.filter(p => !p.isStarter).map((player) => renderPlayerCard(player, false))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CUADRANTE 2 & 3: Control y Acciones */}
          <Card className="bg-[#213041] border-[#305176] lg:col-span-2 flex flex-col h-full">
            <CardHeader className="flex-grow-0 flex flex-col items-center space-y-2">
              <h2 className="text-xl font-bold text-white text-center">
                {matchInfo.location === "Local" ? `${clubName} vs ${matchInfo.opponent}` : `${matchInfo.opponent} vs ${clubName}`}
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
            
            <CardContent className="space-y-4 flex flex-col flex-grow h-2/3 pt-0">
              
              {/* Zona de Selección/Feedback */}
              <CardTitle className="text-white pt-4 border-t border-[#305176]">
                {isSubbing && selectedSubstitute ? 
                    <span className="text-lg flex items-center text-red-400">
                        <Users className="h-5 w-5 mr-2" />
                        Sustitución: Entra **{selectedSubstitute.name}** - Selecciona el jugador que sale.
                    </span>
                    : selectedPlayerForAction ?
                    <span className="text-lg flex items-center text-[#aff606]">
                        <Users className="h-5 w-5 mr-2" />
                        Acciones para **{selectedPlayerForAction.name}**
                    </span>
                    :
                    <span className="text-lg flex items-center text-gray-400">
                        <Users className="h-5 w-5 mr-2" />
                        Selecciona un jugador o un suplente.
                    </span>
                }
              </CardTitle>
              
              {/* Acciones en vivo (Buttons) */}
              <div className="grid grid-cols-2 gap-4">
                {GOAL_ACTIONS.map((action) => (
                  <Button
                    key={action.id}
                    className={`flex-col h-20 ${action.color} text-white font-bold text-xs md:text-sm`}
                    onClick={action.id === 'golAFavor' ? handleHomeGoal : handleOpponentGoal}
                    disabled={action.id === 'golAFavor' && (!selectedPlayerForAction || selectedPlayerForAction.isExpelled)}
                  >
                    <action.icon className="h-6 w-6" />
                    {action.name}
                  </Button>
                ))}
                {GAME_ACTIONS.map((action) => (
                  <Button
                    key={action.id}
                    className={`flex-col h-20 ${action.color} text-white font-bold text-xs md:text-sm`}
                    onClick={() => handleActionClick(action.id)}
                    disabled={!selectedPlayerForAction || selectedPlayerForAction.isExpelled}
                  >
                    <action.icon className="h-6 w-6" />
                    {action.name}
                  </Button>
                ))}
              </div>
              
              {/* Cancel Last Action */}
              <Button
                onClick={undoLastAction}
                className="w-full h-12 bg-gray-500 text-white hover:bg-gray-600 font-bold mt-4"
                disabled={actionHistoryRef.current.length === 0}
              >
                Cancelar Última Acción
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Finalize Game Modal (No major changes here) */}
      <Dialog open={isFinalizing} onOpenChange={setIsFinalizing}>
        <DialogContent className="sm:max-w-[425px] bg-[#213041] border-[#305176] text-white">
          <DialogHeader className="text-center">
            <DialogTitle className="text-white text-2xl font-bold">
              Finalizar Partido
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              ¿Estás seguro de que quieres finalizar el partido? Se guardarán todas las estadísticas y se generará un PDF.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center space-x-4">
            <Button
              variant="outline"
              className="border-blue-500 text-blue-500 hover:bg-blue-500/20 hover:text-blue-300" // ESTILO CORREGIDO
              onClick={() => setIsFinalizing(false)}
            >
              Cancelar
            </Button>
            <Button
              className="bg-red-500 text-white hover:bg-red-600"
              onClick={finishGame}
            >
              Finalizar Partido
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}