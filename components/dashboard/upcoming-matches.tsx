"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Calendar, Clock, Eye, Plus, Users, X, Check, Trash2, Play, Calendar as CalendarIcon } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useIsMobile } from "@/hooks/use-mobile" // <-- IMPORTADO

// --- Importaciones del Calendario ---
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as DatePickerCalendar } from "@/components/ui/calendar" // Renomrado para evitar conflicto
import { format } from "date-fns"
import { es } from 'date-fns/locale/es';
// ------------------------------------

export function UpcomingMatches() {
  const isMobile = useIsMobile(); // <-- Uso del hook
  const [showScheduleForm, setShowScheduleForm] = useState(false)
  const [showPlayerSelection, setShowPlayerSelection] = useState(false) 
  const [selectedPlayers, setSelectedPlayers] = useState<number[]>([])
  const [selectedCategory, setSelectedCategory] = useState("primera")
  const [showValidationAlert, setShowValidationAlert] = useState(false)
  const [matchToDelete, setMatchToDelete] = useState<number | null>(null)
  const [showMatchDetail, setShowMatchDetail] = useState<any>(null)
  const [showRosterModal, setShowRosterModal] = useState(false)
  const [rosterToEdit, setRosterToEdit] = useState<any>(null)
  const [rosterEditPlayers, setRosterEditPlayers] = useState<number[]>([])
  
  // --- ESTADO PARA EL FILTRO DENTRO DEL MODAL ---
  const [selectedModalCategory, setSelectedModalCategory] = useState<string>("all");


  // Lista de partidos próximos con datos de ejemplo
  const [upcomingMatches, setUpcomingMatches] = useState([
    {
      id: 1,
      opponent: "Club Atlético River",
      date: "15-09-2025",
      time: "16:00",
      location: "Local",
      tournament: "Liga Profesional",
      category: "Primera División",
      status: "Próximamente",
      citedPlayers: [1, 2, 3, 4, 5, 6],
      categoryId: "primera",
    },
    {
      id: 2,
      opponent: "Boca Juniors",
      date: "22-09-2025",
      time: "18:30",
      location: "Visitante",
      tournament: "Copa Argentina",
      category: "Primera División",
      status: "Próximamente",
      citedPlayers: [1, 2, 3, 4, 5],
      categoryId: "primera",
    },
  ]);

  // Estado para el formulario de nuevo partido
  const [newMatch, setNewMatch] = useState<{
    opponent: string;
    tournament: string;
    location: string;
    category: string;
    date: Date | undefined; // Usamos Date object
    time: string;
  }>({
    opponent: "",
    tournament: "",
    location: "",
    category: "",
    date: new Date(), // Inicializado con la fecha actual
    time: "10:00", // Inicializado con una hora por defecto
  });

  // Hardcoded categories and players for demo purposes
  const categories = [
    { id: "primera", name: "Primera División" },
    { id: "tercera", name: "Tercera División" },
    { id: "juveniles", name: "Juveniles" },
    { id: "cuarta", name: "Cuarta División" },
    { id: "quinta", name: "Quinta División" },
    { id: "sexta", name: "Sexta División" },
    { id: "septima", name: "Séptima División" },
    { id: "infantiles", name: "Infantiles" },
  ]
  
  const allPlayers = [
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

  const availablePlayers = allPlayers.filter(p => p.category === selectedCategory && p.status === "DISPONIBLE")
  const playersForRosterEdit = rosterToEdit ? allPlayers.filter(p => p.category === rosterToEdit.categoryId) : [];

  const tournaments = [
    { name: "Liga Profesional", matches: 8 },
    { name: "Copa Argentina", matches: 3 },
    { name: "Torneo Clausura", matches: 12 },
    { name: "Copa Libertadores", matches: 6 },
    { name: "Supercopa", matches: 2 },
  ]
  
  // Opciones de Hora y Minuto para los Selects
  const hourOptions = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
  const minuteOptions = ["00", "15", "30", "45"];
  
  const getCurrentHour = () => newMatch.time ? newMatch.time.split(':')[0] : "10";
  const getCurrentMinute = () => newMatch.time ? newMatch.time.split(':')[1] : "00";
  
  // Handlers para actualizar HH y MM en el estado newMatch.time
  const setTimePart = (part: 'hour' | 'minute', value: string) => {
    const currentHour = getCurrentHour();
    const currentMinute = getCurrentMinute();
    
    let newHour = part === 'hour' ? value : currentHour;
    let newMinute = part === 'minute' ? value : currentMinute;
    
    setNewMatch(prev => ({ ...prev, time: `${newHour}:${newMinute}` }));
  };

  
  const handlePlayerToggle = (playerId: number) => {
    setSelectedPlayers((prev) => (prev.includes(playerId) ? prev.filter((id) => id !== playerId) : [...prev, playerId]))
  }

  const handleRosterToggle = (playerId: number) => {
    setRosterEditPlayers((prev) => (prev.includes(playerId) ? prev.filter((id) => id !== playerId) : [...prev, playerId]))
  }

  const handleSaveMatch = () => {
    // 1. Validación de campos
    if (!newMatch.opponent || !newMatch.tournament || !newMatch.location || !newMatch.category || !newMatch.date || !newMatch.time || selectedPlayers.length === 0) {
      alert("Por favor, completa todos los campos del formulario y selecciona al menos un jugador.");
      setShowValidationAlert(true);
      return;
    }
    
    // 2. VALIDACIÓN DE FECHA Y HORA FUTURA
    const [hours, minutes] = newMatch.time.split(':').map(Number);
    const plannedDateTime = new Date(newMatch.date);
    // Aseguramos que la hora del plannedDateTime sea la del formulario
    plannedDateTime.setHours(hours, minutes, 0, 0); 

    const currentDateTime = new Date();

    if (plannedDateTime.getTime() <= currentDateTime.getTime()) {
      alert("Error: El partido debe ser agendado para una fecha y hora futuras.");
      return;
    }
    
    // 3. Formatear la fecha para guardar en el array de strings DD-MM-YYYY
    const dateString = format(newMatch.date, 'dd-MM-yyyy');


    const newMatchData = {
        id: upcomingMatches.length + 1,
        opponent: newMatch.opponent,
        date: dateString, // Usamos DD-MM-YYYY
        time: newMatch.time,
        location: newMatch.location,
        tournament: newMatch.tournament,
        category: categories.find(c => c.id === newMatch.category)?.name || "",
        status: "Próximamente",
        citedPlayers: selectedPlayers,
        categoryId: newMatch.category,
    };

    setUpcomingMatches(prevMatches => [...prevMatches, newMatchData]);

    // Resetear el formulario
    setNewMatch({
      opponent: "",
      tournament: "",
      location: "",
      category: "",
      date: new Date(),
      time: "10:00",
    });
    setSelectedPlayers([]);
    setShowScheduleForm(false);
  }

  const handleSaveRosterEdit = () => {
    if (rosterToEdit) {
      const updatedMatches = upcomingMatches.map(match =>
        match.id === rosterToEdit.id ? { ...match, citedPlayers: rosterEditPlayers } : match
      );
      setUpcomingMatches(updatedMatches);
      setShowRosterModal(false);
      setShowMatchDetail({ ...rosterToEdit, citedPlayers: rosterEditPlayers });
      setRosterToEdit(null);
    }
  };

  const handleCancelRosterEdit = () => {
    setShowRosterModal(false);
    setShowMatchDetail(rosterToEdit);
    setRosterToEdit(null);
  };


  const handleDeleteMatch = () => {
    if (matchToDelete !== null) {
      setUpcomingMatches(prevMatches => prevMatches.filter(match => match.id !== matchToDelete));
      setMatchToDelete(null);
    }
  }

  const handleViewDetails = (match: any) => {
    setShowMatchDetail(match)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Próximos Partidos</h2>
          <p className="text-gray-400">Gestiona los próximos encuentros y acciones de juego</p>
        </div>
      </div>

      {/* Player Selection Modal - CORREGIDO PARA ELIMINAR LA CRUZ REDUNDANTE */}
      <Dialog open={showPlayerSelection} onOpenChange={setShowPlayerSelection}>
        <DialogContent 
            className="sm:max-w-4xl bg-[#213041] border-[#305176] text-white p-6" 
            style={{ maxWidth: '900px' }}
            showCloseButton={false} // <-- Deshabilita la cruz por defecto
        >
            <div className="flex items-center justify-between mb-4">
                <DialogTitle className="text-white text-2xl font-bold">Seleccionar Jugadores</DialogTitle>
                <Button // <-- Esta es la única cruz que se mantiene
                  variant="ghost"
                  size="icon"
                  className="text-white hover:text-red-400"
                  onClick={() => setShowPlayerSelection(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
            </div>
            
            {/* Contenedor principal de selección: Categoría (1/4) y Jugadores (3/4) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4"> 
            
              {/* COLUMNA 1: Panel de Categorías */}
              <div className="md:col-span-1 space-y-3 p-3 bg-[#1d2834] rounded-lg h-full"> 
                  <h4 className="text-white font-semibold mb-3 border-b border-[#305176] pb-2">
                      Filtrar por Categoría
                  </h4>
                  
                  {/* Listado de Categorías */}
                  {categories.map((cat) => (
                      <div
                          key={cat.id}
                          className={`p-2 rounded-lg cursor-pointer transition-colors ${
                              selectedModalCategory === cat.id
                                  ? "bg-[#aff606] text-black font-bold"
                                  : "text-white hover:bg-[#305176]"
                          }`}
                          onClick={() => setSelectedModalCategory(cat.id)}
                      >
                          {cat.name}
                      </div>
                  ))}
                  <div
                      className={`p-2 rounded-lg cursor-pointer transition-colors ${
                          selectedModalCategory === "all"
                              ? "bg-[#33d9f6] text-black font-bold"
                              : "text-white hover:bg-[#305176]"
                      }`}
                      onClick={() => setSelectedModalCategory("all")}
                  >
                      Mostrar Todas
                  </div>
              </div>

              {/* COLUMNA 2: Lista de Jugadores */}
              <div className="md:col-span-3 space-y-4">
                  <div className="text-sm text-gray-400">
                      Lista de Jugadores ({selectedModalCategory === "all" ? "Todas" : categories.find(c => c.id === selectedModalCategory)?.name || ""})
                  </div>
                  
                  <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                      {/* Lógica de Filtrado por Categoría del Modal */}
                      {allPlayers
                          .filter(player => 
                              selectedModalCategory === "all" || player.category === selectedModalCategory
                          )
                          .map((player) => (
                              <div
                                  key={player.id}
                                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                                      selectedPlayers.includes(player.id)
                                          ? "bg-[#aff606]/20 border border-[#aff606]"
                                          : "bg-[#1d2834] hover:bg-[#305176]"
                                  } ${player.status === "LESIONADO" ? 'opacity-50 cursor-not-allowed' : ''}`}
                                  onClick={() => player.status !== "LESIONADO" && handlePlayerToggle(player.id)}
                              >
                                  <div className="flex items-center space-x-3">
                                      <div
                                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                              selectedPlayers.includes(player.id) ? "border-[#aff606] bg-[#aff606]" : "border-gray-400"
                                          }`}
                                      >
                                          {selectedPlayers.includes(player.id) && <Check className="h-3 w-3 text-black" />}
                                      </div>
                                      <div>
                                          <span className="text-white font-medium">{player.name}</span>
                                          <p className="text-gray-400 text-sm">{player.position}</p>
                                      </div>
                                  </div>
                                  <Badge 
                                      className={player.status === "LESIONADO" ? "bg-red-500 text-white" : "bg-[#25d03f] text-black"}
                                  >
                                      {player.status}
                                  </Badge>
                              </div>
                          ))
                      }
                  </div>
                  <div className="text-sm text-gray-400 pt-2 border-t border-[#305176]">
                      Jugadores Seleccionados: {selectedPlayers.length}
                  </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 pt-4 border-t border-[#305176] mt-4">
                <Button
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white bg-transparent"
                  onClick={() => setShowPlayerSelection(false)}
                >
                  Cancelar
                </Button>
                <Button
                  className="bg-[#aff606] text-black hover:bg-[#25d03f]"
                  onClick={() => setShowPlayerSelection(false)}
                >
                  Confirmar Selección
                </Button>
            </div>
        </DialogContent>
      </Dialog>
      
      {/* Schedule Form */}
      {showScheduleForm && (
        <Card className="bg-[#213041] border-[#305176]">
          <CardHeader>
            <CardTitle className="text-white">Agendar Nuevo Partido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {/* PRIMERA FILA: Rival, Torneo, Condición, Categoría, Jugadores */}
            <div className="grid grid-cols-8 gap-4 items-center"> {/* <-- CAMBIO: Usamos grid-cols-8 */}
              
              {/* Rival (1/8) */}
              <div className="col-span-1 w-full"> 
                <Input
                  placeholder="Rival" 
                  className="bg-[#1d2834] border-[#305176] text-white h-10" // Altura uniforme h-10
                  value={newMatch.opponent}
                  onChange={(e) => setNewMatch({ ...newMatch, opponent: e.target.value })}
                />
              </div>

              {/* Torneo (2/8) */}
              <div className="col-span-2 w-full"> {/* <-- CAMBIO: col-span-2 */}
                <Select
                  value={newMatch.tournament}
                  onValueChange={(value) => setNewMatch({ ...newMatch, tournament: value })}
                >
                  <SelectTrigger className="bg-[#1d2834] border-[#305176] text-white h-10">  {/* Altura uniforme h-10 */}
                    <SelectValue placeholder="Torneo" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#213041] border-[#305176]">
                    {tournaments.map((tournament) => (
                      <SelectItem key={tournament.name} value={tournament.name} className="text-white">
                        {tournament.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Condición (2/8) */}
              <div className="col-span-2 w-full"> {/* <-- CAMBIO: col-span-2 */}
                <Select
                  value={newMatch.location}
                  onValueChange={(value) => setNewMatch({ ...newMatch, location: value })}
                >
                  <SelectTrigger className="bg-[#1d2834] border-[#305176] text-white h-10">  {/* Altura uniforme h-10 */}
                    <SelectValue placeholder="Condición" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#213041] border-[#305176]">
                    <SelectItem value="Local" className="text-white">
                      Local
                    </SelectItem>
                    <SelectItem value="Visitante" className="text-white">
                      Visitante
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Categoría (2/8) */}
              <div className="col-span-2 w-full"> {/* <-- CAMBIO: col-span-2 */}
                <Select
                  value={newMatch.category}
                  onValueChange={(value) => {
                    setNewMatch({ ...newMatch, category: value })
                    setSelectedCategory(value)
                    setSelectedPlayers([])
                  }}
                >
                  <SelectTrigger className="bg-[#1d2834] border-[#305176] text-white h-10">  {/* Altura uniforme h-10 */}
                    <SelectValue placeholder="Categoría" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#213041] border-[#305176]">
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id} className="text-white">
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Botón de Selección de Jugadores (1/8) */}
              <div className="col-span-1 w-full"> {/* <-- CAMBIO: col-span-1 */}
                  <Button
                      className="bg-[#33d9f6] text-black hover:bg-[#2bc4ea] h-10 w-full" // Altura uniforme h-10
                      onClick={() => {
                        // Al abrir, preseleccionar la categoría del partido
                        setSelectedModalCategory(newMatch.category);
                        setShowPlayerSelection(true);
                      }}
                  >
                      <Users className="h-4 w-4 mr-2" />
                      Jugadores ({selectedPlayers.length})
                  </Button>
              </div>
            </div>

            {/* SEGUNDA FILA: Fecha y Hora */}
            <div className="grid grid-cols-8 gap-4 pt-4 border-t border-[#305176] items-center"> {/* <-- CAMBIO: Usamos grid-cols-8 */}
              
              {/* Fecha (Ocupa 1/8) */}
              <div className="space-y-1 col-span-1 w-full"> 
                <label className="text-white text-sm">Fecha</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="w-full justify-start text-left font-normal bg-[#1d2834] border-[#305176] text-white hover:bg-[#305176] hover:text-white h-10" // Altura uniforme h-10
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
                      {newMatch.date ? (
                        format(newMatch.date, "PPP", { locale: es })
                      ) : (
                        <span className="text-gray-400">Seleccionar fecha</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-[#213041] border-[#305176]">
                    <DatePickerCalendar
                      mode="single"
                      selected={newMatch.date}
                      onSelect={(date) => setNewMatch({ ...newMatch, date })}
                      initialFocus
                      locale={es} // Usar el locale español
                      classNames={{
                          caption_label: "text-white font-semibold", 
                          head_cell: "text-white rounded-md w-9 font-medium text-[0.8rem]", 
                          day: "text-white", 
                          day_outside: "text-gray-500 opacity-80", 
                          day_today: "bg-[#aff606] text-black hover:bg-[#25d03f] hover:text-black font-bold", 
                          day_selected: "bg-[#aff606] text-black hover:bg-[#aff606] hover:text-black focus:bg-[#aff606] focus:text-black",
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              {/* Hora (Ocupa 7/8) */}
              <div className="space-y-1 col-span-7 w-full"> {/* <-- CAMBIO: col-span-7 */}
                <label className="text-white text-sm">Hora</label>
                <div className="flex items-center space-x-1">
                  <Select
                    value={getCurrentHour()}
                    onValueChange={(value) => setTimePart('hour', value)}
                  >
                    <SelectTrigger className="bg-[#1d2834] border-[#305176] text-white h-10"> {/* Altura uniforme h-10 */}
                      <SelectValue placeholder="HH" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#213041] border-[#305176] max-h-[15rem]">
                      {hourOptions.map(hour => (
                        <SelectItem key={hour} value={hour} className="text-white">{hour}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="text-white text-lg h-10 flex items-center">:</span> {/* Altura uniforme h-10 */}
                  <Select
                    value={getCurrentMinute()}
                    onValueChange={(value) => setTimePart('minute', value)}
                  >
                    <SelectTrigger className="bg-[#1d2834] border-[#305176] text-white h-10"> {/* Altura uniforme h-10 */}
                      <SelectValue placeholder="MM" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#213041] border-[#305176] max-h-[15rem]">
                      {minuteOptions.map(minute => (
                        <SelectItem key={minute} value={minute} className="text-white">{minute}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

            </div>

            <div className="flex justify-end space-x-4 pt-4 border-t border-[#305176] mt-4">
              <Button
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white bg-transparent h-11" 
                onClick={() => setShowScheduleForm(false)}
              >
                Cancelar
              </Button>
              <Button className="bg-[#aff606] text-black hover:bg-[#25d03f] h-11" 
              onClick={handleSaveMatch}>
                Agendar Partido
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Matches */}
      <Card className="bg-[#213041] border-[#305176]">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Partidos Programados</CardTitle>
          {!showScheduleForm && (
            <Button className="bg-[#aff606] text-black hover:bg-[#25d03f]" onClick={() => setShowScheduleForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Agendar Próximo Partido
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingMatches.length > 0 ? (
              upcomingMatches.map((match) => (
                <div 
                    key={match.id} 
                    className={`p-4 bg-[#1d2834] rounded-lg ${isMobile ? 'cursor-pointer hover:bg-[#305176]' : ''}`}
                    onClick={isMobile ? () => handleViewDetails(match) : undefined} // <-- Asigna el click
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="text-white font-bold text-lg">VS</div>
                        <div className="text-xs text-gray-400">{match.category}</div>
                      </div>
                      <div>
                        <h3 className="text-white font-medium">{match.opponent}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {match.date}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {match.time}
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {upcomingMatches.find(m => m.id === match.id)?.citedPlayers.length} jugadores citados
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{match.tournament}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge
                        variant={match.status === "En Vivo" ? "destructive" : "default"}
                        className={
                          match.status === "En Vivo"
                            ? "bg-red-500 text-white"
                            : match.location === "Local"
                              ? "bg-[#25d03f] text-black"
                              : "bg-[#ea3498] text-white"
                        }
                      >
                        {match.status === "En Vivo" ? "EN VIVO" : match.location}
                      </Badge>
                      {match.status === "En Vivo" ? (
                        <Button size="sm" className="bg-red-500 text-white hover:bg-red-600">
                          <Play className="h-4 w-4 mr-2" />
                          Acciones de Juego
                        </Button>
                      ) : (
                        <>
                          {/* Botón VER DETALLES - OCULTO EN MÓVIL */}
                          <Button
                            size="sm"
                            variant="outline"
                            className={`border-[#aff606] text-[#aff606] hover:bg-[#aff606] hover:text-black bg-transparent ${isMobile ? 'hidden lg:flex' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation(); // Previene el click de la fila
                              handleViewDetails(match);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalles
                          </Button>
                           <Button
                            size="sm"
                            variant="ghost"
                            className="text-white hover:text-red-400"
                            onClick={(e) => {
                                e.stopPropagation();
                                setMatchToDelete(match.id);
                              }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center">No hay partidos próximos. Agenda uno para empezar.</p>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Modal de Detalles del Partido */}
      <Dialog open={!!showMatchDetail} onOpenChange={() => setShowMatchDetail(null)}>
        <DialogContent className="sm:max-w-[425px] bg-[#213041] border-[#305176] text-white">
          <DialogHeader className="text-center">
            <DialogTitle className="text-white text-2xl font-bold">Detalles del Partido</DialogTitle>
            <DialogDescription className="text-gray-400">
              VS {showMatchDetail?.opponent}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-white text-sm">Torneo</label>
              <Input value={showMatchDetail?.tournament} readOnly className="bg-[#1d2834] border-[#305176] text-white" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-white text-sm">Condición</label>
                <Input value={showMatchDetail?.location} readOnly className="bg-[#1d2834] border-[#305176] text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-white text-sm">Categoría</label>
                <Input value={showMatchDetail?.category} readOnly className="bg-[#1d2834] border-[#305176] text-white" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-white text-sm">Fecha</label>
                <Input value={showMatchDetail?.date} readOnly className="bg-[#1d2834] border-[#305176] text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-white text-sm">Hora</label>
                <Input value={showMatchDetail?.time} readOnly className="bg-[#1d2834] border-[#305176] text-white" />
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-[#1d2834] rounded-lg">
              <span className="text-gray-400 text-sm">
                Jugadores citados: {showMatchDetail?.citedPlayers.length || 0}
              </span>
              <Button
                size="sm"
                variant="outline"
                className="border-[#aff606] text-[#aff606] hover:bg-[#aff606] hover:text-black bg-transparent"
                onClick={() => {
                  setRosterToEdit(showMatchDetail);
                  setRosterEditPlayers(showMatchDetail?.citedPlayers || []);
                  setShowMatchDetail(null); // Cierra la vista de detalles
                  setShowRosterModal(true); // Abre la vista de edición
                }}
              >
                Editar Citación
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-4 pt-4 border-t border-[#305176]">
            <Link href={`/dashboard/partidos/${showMatchDetail?.id}`} passHref target="_blank" rel="noopener noreferrer">
              <Button asChild className="w-full bg-red-500 text-white hover:bg-red-600">
                <span>
                  <Play className="h-4 w-4 mr-2" />
                  Gestionar Partido en Tiempo Real
                </span>
              </Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Modal para ver y editar la lista de citados */}
      <Dialog open={showRosterModal} onOpenChange={handleCancelRosterEdit}>
        <DialogContent className="sm:max-w-[425px] bg-[#213041] border-[#305176] text-white">
          <DialogHeader className="text-center">
            <DialogTitle className="text-white text-2xl font-bold">Lista de Citados</DialogTitle>
            <DialogDescription className="text-gray-400">
              {rosterToEdit?.category} - VS {rosterToEdit?.opponent}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-sm text-gray-400">
              Jugadores citados: {rosterEditPlayers?.length}/{allPlayers.filter(p => p.category.toLowerCase() === rosterToEdit?.categoryId.toLowerCase()).length}
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {allPlayers
                .filter(p => p.category.toLowerCase() === rosterToEdit?.categoryId.toLowerCase())
                .map((player) => (
                  <div
                    key={player.id}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                      rosterEditPlayers?.includes(player.id)
                        ? "bg-[#aff606]/20 border border-[#aff606]"
                        : "bg-[#1d2834] hover:bg-[#305176]"
                    }`}
                    onClick={() => handleRosterToggle(player.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          rosterEditPlayers?.includes(player.id) ? "border-[#aff606] bg-[#aff606]" : "border-gray-400"
                        }`}
                      >
                        {rosterEditPlayers?.includes(player.id) && <Check className="h-3 w-3 text-black" />}
                      </div>
                      <div>
                        <span className="text-white font-medium">{player.name}</span>
                        <p className="text-gray-400 text-sm">{player.position}</p>
                      </div>
                    </div>
                    <Badge className={rosterEditPlayers?.includes(player.id) ? "bg-[#25d03f] text-black" : "bg-gray-500 text-white"}>
                      {rosterEditPlayers?.includes(player.id) ? "Citado" : "No Citado"}
                    </Badge>
                  </div>
                ))}
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white bg-transparent"
              onClick={handleCancelRosterEdit}
            >
              Cancelar
            </Button>
            <Button
              className="bg-[#aff606] text-black hover:bg-[#25d03f]"
              onClick={handleSaveRosterEdit}
            >
              Aceptar
            </Button>
          </div>
        </DialogContent>
      </Dialog>


      {/* Alert Dialog for Form Validation */}
      <AlertDialog open={showValidationAlert} onOpenChange={setShowValidationAlert}>
        <AlertDialogContent className="bg-[#213041] border-[#305176]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Campos Incompletos</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Por favor, completa todos los campos del formulario antes de agendar un partido.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setShowValidationAlert(false)}
              className="bg-[#aff606] text-black hover:bg-[#25d03f]"
            >
              Aceptar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* AlertDialog for Delete Confirmation */}
      <AlertDialog open={matchToDelete !== null} onOpenChange={() => setMatchToDelete(null)}>
        <AlertDialogContent className="bg-[#213041] border-[#305176]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Confirmar Eliminación</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              ¿Estás seguro de que quieres eliminar este partido de forma permanente? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-[#305176] text-white hover:bg-[#305176]">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteMatch}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}