"use client"

import { useState, useEffect, useMemo } from "react"
// Importamos los tipos necesarios del hook (ContextPlayer y ContextCategory son los tipos de Player y Category en el contexto)
import { useProfile, Player as ContextPlayer, Category as ContextCategory } from "@/hooks/use-profile" 
import { toast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { es } from "date-fns/locale/es"
import { v4 as uuidv4 } from 'uuid'; // Para generar IDs al crear

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Upload, Plus, Search, Edit, Trash2, Users, FileText, Eye, HeartPulse } from "lucide-react"
import Image from 'next/image'
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
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
import { useIsMobile } from "@/hooks/use-mobile"

// Mapeo de tipos del contexto a la UI local
interface CategoryUI {
    id: string; // Category ID
    name: string;
    playerCount: number;
    color: string;
}

// Player MOCK DE BASE PARA EL FORMULARIO
const INITIAL_PLAYER_STATE = {
  id: '', 
  name: '',
  birthDate: '', // YYYY-MM-DD
  birthDateDisplay: '', // DD/MM/AAAA para la UI
  position: '',
  number: 0,
  categoryId: '', 
  photo: '',
  nickname: '',
  phoneNumber: '',
  foot: '',
  status: 'DISPONIBLE',
  injury: null, // Si es un campo custom no del contexto
};

export function ClubManagement() {
  const isMobile = useIsMobile();
  // --- MODIFICACIÓN CLAVE: Destructurar el nuevo contexto ---
  const {
    profile,
    club,
    categories: contextCategories, 
    players: contextPlayers, 
    limits, 
    usedPlayersCount,
    usedCategoriesCount,
    addPlayer,
    updatePlayer: updatePlayerContext, 
    deletePlayer: deletePlayerContext,
    addCategory,
    deleteCategory: deleteCategoryContext,
  } = useProfile();
  // --------------------------------------------------------

  const [selectedCategory, setSelectedCategory] = useState("all"); 
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<ContextPlayer | null>(null);
  const [newPlayer, setNewPlayer] = useState<any>(INITIAL_PLAYER_STATE);
  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#aff606");
  const [showMedicalReport, setShowMedicalReport] = useState<ContextPlayer | null>(null);
  const [playerToDelete, setPlayerToDelete] = useState<string | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [showPlayerDetail, setShowPlayerDetail] = useState<ContextPlayer | null>(null);
  const [showEditClub, setShowEditClub] = useState(false);
  
  // Estado Club (Usaremos la data del contexto si existe)
  const clubInfo = club || { name: "Mi Club", abbreviation: "MC", logoUrl: "/images/cuatro-cero-logo.png" };
  const [tempClubInfo, setTempClubInfo] = useState(clubInfo);

  // --- Roles y Permisos ---
  const isKinesiologo = profile?.role === "KINESIOLOGO";
  const isTechnician = profile?.role?.includes("TECNICO") || profile?.role?.includes("DIRECTIVO");
  // --- Fin Roles y Permisos ---

  const colorsOption = [
    "#aff606", "#33d9f6", "#f4c11a", "#ea3498", "#25d03f", 
    "#8a46c5", "#ff6b35", "#4ecdc4", "#45b7d1", "#96ceb4",
    "#609966", "#c37a6b", "#77c4e4", "#f1a85f", "#d64b5e",
    "#6d89ff", "#ff8a65", "#b478d1", "#e69138", "#4e7c8e",
    "#a1c5d9", "#f5d76e", "#e8787c", "#c9d99d", "#7c7c7c"
  ];

  const positions = ["Arquero", "Ultimo", "Ala", "Pivot"];
  const feet = ["Derecho", "Izquierdo", "Ambidiestro"];

  // --- Mapeo de Categorías (Calculado: Fuente de la verdad es contextCategories) ---
  const categoriesUI = useMemo(() => {
      // 1. Contar jugadores por categoría
      const counts = contextPlayers.reduce((acc, player) => {
          acc[player.categoryId] = (acc[player.categoryId] || 0) + 1;
          return acc;
      }, {} as Record<string, number>);

      // 2. Mapear las categorías del contexto a la UI
      const mappedCategories: CategoryUI[] = contextCategories.map(cat => ({
          id: cat.id,
          name: cat.name,
          // Usamos el color de la categoría si está disponible, si no el mock color
          color: cat.isDemo ? "#305176" : "#aff606", 
          playerCount: counts[cat.id] || 0,
      }));

      // 3. Añadir la opción 'Todas'
      const allCategory: CategoryUI = {
        id: "all",
        name: "Todas las categorías",
        playerCount: contextPlayers.length,
        color: "#213041",
      };

      return [allCategory, ...mappedCategories];
  }, [contextCategories, contextPlayers]);
  
  // --- FILTRADO DE JUGADORES (Usa datos del contexto) ---
  const filteredPlayers = useMemo(() => {
    return contextPlayers.filter((player) => {
        const matchesSearch =
            player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            player.name.toLowerCase().replace(/ /g, '').includes(searchTerm.toLowerCase());

        const matchesCategory = selectedCategory === "all" || player.categoryId === selectedCategory;

        return matchesSearch && matchesCategory;
    });
  }, [contextPlayers, searchTerm, selectedCategory]);
  // ----------------------------------------------------

  // --- UTILIDAD: Mapeo de status a la UI local (DISPONIBLE/LESIONADO) ---
  const getPlayerStatusBadge = (status: ContextPlayer['injuryStatus']) => {
    switch (status) {
      case 'INJURED': return { label: 'LESIONADO', className: "bg-orange-500 text-white" };
      case 'FIT':
      default: return { label: 'DISPONIBLE', className: "bg-[#25d03f] text-black" };
    }
  };


  // --- FUNCIÓN PARA MASCARA DD/MM/YYYY ---
  const handleBirthDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    let cleaned = value.replace(/[^0-9]/g, '');
    let formattedValue = '';
    let storedDate = '';

    if (cleaned.length > 0) formattedValue = cleaned.slice(0, 2);
    if (cleaned.length >= 3) formattedValue += '/' + cleaned.slice(2, 4);
    if (cleaned.length >= 5) formattedValue += '/' + cleaned.slice(4, 8);

    formattedValue = formattedValue.slice(0, 10);

    if (cleaned.length === 8) {
        const day = cleaned.slice(0, 2);
        const month = cleaned.slice(2, 4);
        const year = cleaned.slice(4, 8);
        
        if (day.length === 2 && month.length === 2 && year.length === 4) {
            storedDate = `${year}-${month}-${day}`;
        }
    }

    setNewPlayer({
        ...newPlayer,
        birthDate: storedDate || '',
        birthDateDisplay: formattedValue
    });
  };

  // --- FUNCIÓN DE CREACIÓN DE JUGADOR (CON LÍMITE) ---
  const handleCreatePlayer = () => {
    const isDateValid = /^(\d{4})-(\d{2})-(\d{2})$/.test(newPlayer.birthDate);
    const categoryId = newPlayer.categoryId || selectedCategory;
    const playerCategory = categoriesUI.find(c => c.id === categoryId);

    if (usedPlayersCount >= limits.MAX_PLAYERS) {
      toast({
        title: "Límite de Jugadores Alcanzado",
        description: `Tu plan (${profile?.plan.toUpperCase()}) solo permite ${limits.MAX_PLAYERS} jugadores.`,
        variant: "default",
      });
      return;
    }

    if (!newPlayer.name || !newPlayer.position || !newPlayer.birthDate || !isDateValid || !categoryId || categoryId === "all") {
        toast({
            title: "Campos Faltantes/Inválidos",
            description: "Asegúrate de completar Nombre, Posición, y una Fecha de Nacimiento válida (DD/MM/AAAA).",
            variant: "destructive",
        });
        return;
    }

    // Se crea un objeto Player que cumple con el tipo ContextPlayer (omitiendo campos no estándar si es necesario)
    const playerToSave: Omit<ContextPlayer, "id" | "isDemo" | "injuryStatus"> = {
        categoryId: categoryId,
        name: newPlayer.name.trim(),
        birthDate: newPlayer.birthDate,
        position: newPlayer.position,
        number: newPlayer.number || 0,
        // Asumimos que los demás campos son opcionales para el contexto principal
        // Los campos extra (photo, nickname, etc.) se perderán si no están en el ContextPlayer original,
        // pero se mantendrán los campos que se definieron en el hook.
    };
    
    addPlayer(playerToSave as any); // Usamos 'any' para pasar el objeto (el hook maneja el ID y la Demo flag)

    handleCancelForm();
    toast.success(`Jugador ${newPlayer.name} añadido a ${playerCategory?.name}.`);
  };
  // -------------------------------------------------------------

  const handleEditPlayer = (player: ContextPlayer) => {
    const fullPlayer = player as any;
    
    const birthDateDisplay = player.birthDate?.length === 10 && player.birthDate.includes('-')
        ? player.birthDate.split('-').reverse().join('/')
        : player.birthDate || '';

    setEditingPlayer(player);
    setNewPlayer({
        ...INITIAL_PLAYER_STATE,
        ...fullPlayer, 
        birthDateDisplay: birthDateDisplay,
        categoryId: player.categoryId,
        status: player.injuryStatus === 'INJURED' ? 'LESIONADO' : 'DISPONIBLE',
    });
    setShowCreateForm(true);
  };

  const handleUpdatePlayer = () => {
    const isDateValid = /^(\d{4})-(\d{2})-(\d{2})$/.test(newPlayer.birthDate);

    if (!editingPlayer || !newPlayer.name || !newPlayer.position || !newPlayer.birthDate || !isDateValid) {
      toast({
          title: "Campos Faltantes/Inválidos",
          description: "Asegúrate de completar Nombre, Posición, y una Fecha de Nacimiento válida.",
          variant: "destructive",
      });
      return;
    }

    const playerToUpdate: Partial<ContextPlayer> = {
        categoryId: newPlayer.categoryId,
        name: newPlayer.name.trim(),
        birthDate: newPlayer.birthDate,
        position: newPlayer.position,
        number: newPlayer.number,
        injuryStatus: newPlayer.status === 'LESIONADO' ? 'INJURED' : 'FIT',
        // Otros campos mock se actualizarían si estuvieran definidos en ContextPlayer
    };

    updatePlayerContext(editingPlayer.id, playerToUpdate);

    handleCancelForm();
    toast.success(`Jugador ${newPlayer.name} actualizado.`);
  };

  const handleDeletePlayer = (id: string) => {
    deletePlayerContext(id);
    setPlayerToDelete(null);
  };

  // --- FUNCIÓN DE CREACIÓN DE CATEGORÍA (CON LÍMITE) ---
  const handleCreateCategory = () => {
    if (!newCategoryName.trim()) return;

    if (usedCategoriesCount >= limits.MAX_CATEGORIES) {
      toast({
        title: "Límite de Categorías Alcanzado",
        description: `Tu plan (${profile?.plan.toUpperCase()}) solo permite ${limits.MAX_CATEGORIES} categorías.`,
        variant: "default",
      });
      return;
    }

    const newCat = {
        name: newCategoryName.trim(),
        ageGroup: "N/A", 
    };

    addCategory(newCat as any); // Usamos 'any' ya que las propiedades extra se añadirían en el hook

    setNewCategoryName("");
    setNewCategoryColor("#aff606");
    setShowCreateCategory(false);
  };
  // -----------------------------------------------------

  const handleDeleteCategory = () => {
    if (categoryToDelete) {
      deleteCategoryContext(categoryToDelete);
      setCategoryToDelete(null);
      setSelectedCategory("all");
    }
  };

  const handleCancelForm = () => {
    setShowCreateForm(false);
    setEditingPlayer(null);
    setNewPlayer({ ...INITIAL_PLAYER_STATE, categoryId: selectedCategory === "all" ? '' : selectedCategory });
  };

  const handleViewMedicalReport = (player: ContextPlayer) => {
    if (player.injuryStatus === 'INJURED') {
        setShowMedicalReport(player);
    }
  }

  const calculateRecoveryDate = (recoveryString: string): string => {
    const match = recoveryString.match(/(\d+)/);
    if (!match) return "N/A";

    const weeks = parseInt(match[0], 10);
    const recoveryDate = new Date();
    recoveryDate.setDate(recoveryDate.getDate() + weeks * 7);

    return format(recoveryDate, "dd-MM-yyyy");
  };

  const handleRecoverPlayer = (playerId: string) => {
    updatePlayerContext(playerId, { injuryStatus: 'FIT', injuryDetails: '' } as any);
    toast({
      title: "Jugador Recuperado",
      description: "El jugador ha sido marcado como DISPONIBLE.",
    });
    setShowMedicalReport(null);
  };

  const handleClubLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setTempClubInfo({ ...tempClubInfo, logoUrl: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }
  
  const handleSaveClubChanges = () => {
    // Aquí se debería llamar a setClub del ProfileProvider, pero como el club no tiene un setter en el hook,
    // solo simulamos el guardado de los campos del Club que son estáticos para el demo.
    toast.success("Información del club actualizada (Simulación).");
    setShowEditClub(false);
  }

  const handleCancelClubChanges = () => {
    setTempClubInfo(clubInfo);
    setShowEditClub(false);
  }

  const categoryIds = categoriesUI.filter(c => c.id !== "all");

  const playerLimitReached = usedPlayersCount >= limits.MAX_PLAYERS;
  const categoryLimitReached = usedCategoriesCount >= limits.MAX_CATEGORIES;


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Mi Club</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel de información del Club y Categorías */}
        <div className="lg:col-span-1 space-y-6">
          <Dialog open={showEditClub} onOpenChange={setShowEditClub}>
            <Card className="bg-[#213041] border-[#305176]">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-white">Información del Club</CardTitle>
                <DialogTrigger asChild>
                  {isTechnician && (
                    <Button variant="ghost" size="icon" className="text-white hover:text-[#aff606]">
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                </DialogTrigger>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="relative w-20 h-20 bg-[#305176] rounded-lg flex items-center justify-center overflow-hidden">
                    <Image
                      src={clubInfo.logoUrl}
                      alt="Escudo del club"
                      width={80}
                      height={80}
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div>
                    <h3 className="text-white font-medium text-lg">{clubInfo.name}</h3>
                    <p className="text-gray-400 text-sm">{clubInfo.abbreviation}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <DialogContent className="sm:max-w-[425px] bg-[#213041] border-[#305176] text-white">
              <DialogHeader>
                <DialogTitle className="text-white">Editar Información del Club</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Actualiza el nombre, abreviatura y logo de tu club.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="clubName" className="text-white">Nombre del Club</Label>
                  <Input
                    id="clubName"
                    value={tempClubInfo.name}
                    onChange={(e) => setTempClubInfo({ ...tempClubInfo, name: e.target.value })}
                    className="bg-[#1d2834] border-[#305176] text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clubAbbreviation" className="text-white">Abreviatura</Label>
                  <Input
                    id="clubAbbreviation"
                    value={tempClubInfo.abbreviation}
                    onChange={(e) => setTempClubInfo({ ...tempClubInfo, abbreviation: e.target.value })}
                    className="bg-[#1d2834] border-[#305176] text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clubLogo" className="text-white">Logo del Club</Label>
                  <div className="flex items-center space-x-4">
                    <div className="relative w-24 h-24 bg-[#305176] rounded-lg flex items-center justify-center overflow-hidden">
                      <Image
                        src={tempClubInfo.logoUrl}
                        alt="Vista previa del logo"
                        width={96}
                        height={96}
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <Button
                      variant="outline"
                      className="border-[#305176] text-white hover:bg-[#305176] bg-transparent"
                      onClick={() => document.getElementById('logo-upload-input')?.click()}
                    >
                      Subir Logo
                    </Button>
                    <input
                      id="logo-upload-input"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleClubLogoUpload}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white bg-transparent"
                  onClick={handleCancelClubChanges}
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  className="bg-[#aff606] text-black hover:bg-[#25d03f]"
                  onClick={handleSaveClubChanges}
                >
                  Guardar Cambios
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Card className="bg-[#213041] border-[#305176]">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Categorías ({usedCategoriesCount}{limits.MAX_CATEGORIES !== Infinity ? `/${limits.MAX_CATEGORIES}` : ''})
              </CardTitle>
              {categoryLimitReached && limits.MAX_CATEGORIES !== Infinity && (
                <p className="text-red-400 text-xs mt-1">Límite de categorías alcanzado.</p>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              {categoriesUI.map((category) => (
                <div
                  key={category.id}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors group ${
                    selectedCategory === category.id ? "bg-[#305176]" : "bg-[#1d2834] hover:bg-[#305176]"
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <div className="flex items-center space-x-3">
                    {category.id !== "all" && <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }}></div>}
                    <span className="text-white font-medium">{category.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {/* Botón de eliminar */}
                    {selectedCategory === category.id && category.id !== "all" && isTechnician ? (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="bg-red-500/20 text-red-400 hover:bg-red-500/40 opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation()
                          setCategoryToDelete(category.id)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Badge variant="secondary" className="bg-[#305176] text-gray-300">
                        {category.playerCount}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Nuevo botón para crear categoría */}
              {!showCreateCategory && isTechnician && (
                <Button
                  className="w-full bg-[#305176] text-white hover:bg-[#aff606] hover:text-black"
                  onClick={() => setShowCreateCategory(true)}
                  disabled={categoryLimitReached}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Categoría
                </Button>
              )}
              {showCreateCategory && (
                <div className="space-y-3 p-3 bg-[#1d2834] rounded-lg">
                  <Input
                    placeholder="Nombre de la categoría"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="bg-[#305176] border-[#305176] text-white"
                  />
                  <div className="flex flex-wrap gap-2">
                    {colorsOption
                      .filter(color => !categoriesUI.find(cat => cat.color === color))
                      .map((color) => (
                      <button
                        key={color}
                        className={`w-6 h-6 rounded-full border-2 ${
                          newCategoryColor === color ? "border-white" : "border-gray-500"
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setNewCategoryColor(color)}
                      />
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      className="bg-[#aff606] text-black hover:bg-[#25d03f]"
                      onClick={handleCreateCategory}
                    >
                      Crear
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white bg-transparent"
                      onClick={() => setShowCreateCategory(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Lista de Jugadores o Formulario */}
        <div className="lg:col-span-2 space-y-6">
          {showCreateForm ? (
            <Card className="bg-[#213041] border-[#305176]">
              <CardHeader>
                <CardTitle className="text-white text-2xl text-center font-bold">
                  {editingPlayer ? "Editar Jugador" : "Nuevo Jugador"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Nombre Completo</Label>
                    <Input
                      value={newPlayer.name}
                      onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
                      placeholder="Nombre Completo"
                      className="bg-[#1d2834] border-[#305176] text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Número</Label>
                    <Input
                      type="number"
                      value={newPlayer.number || ''}
                      onChange={(e) => setNewPlayer({ ...newPlayer, number: parseInt(e.target.value) || 0 })}
                      placeholder="Número"
                      className="bg-[#1d2834] border-[#305176] text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Apodo</Label>
                    <Input
                      value={newPlayer.nickname}
                      onChange={(e) => setNewPlayer({ ...newPlayer, nickname: e.target.value })}
                      placeholder="Apodo"
                      className="bg-[#1d2834] border-[#305176] text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Posición</Label>
                    <Select
                      value={newPlayer.position}
                      onValueChange={(value) => setNewPlayer({ ...newPlayer, position: value })}
                    >
                      <SelectTrigger className="bg-[#1d2834] border-[#305176] text-white">
                        <SelectValue placeholder="Seleccionar posición" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#213041] border-[#305176]">
                        {positions.map((pos) => (
                          <SelectItem key={pos} value={pos} className="text-white">
                            {pos}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Pierna Hábil</Label>
                    <Select value={newPlayer.foot} onValueChange={(value) => setNewPlayer({ ...newPlayer, foot: value })}>
                      <SelectTrigger className="bg-[#1d2834] border-[#305176] text-white">
                        <SelectValue placeholder="Seleccionar pierna" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#213041] border-[#305176]">
                        {feet.map((foot) => (
                          <SelectItem key={foot} value={foot} className="text-white">
                            {foot}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Categoría</Label>
                    <Select
                      value={newPlayer.categoryId}
                      onValueChange={(value) => setNewPlayer({ ...newPlayer, categoryId: value })}
                    >
                      <SelectTrigger className="bg-[#1d2834] border-[#305176] text-white">
                        <SelectValue placeholder="Seleccionar categoría" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#213041] border-[#305176]">
                        {categoryIds.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id} className="text-white">
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* CAMPO DE FECHA DE NACIMIENTO CON MÁSCARA DD/MM/YYYY */}
                  <div className="space-y-2">
                    <Label className="text-white">Fecha de Nacimiento (DD/MM/AAAA)</Label>
                    <Input
                      value={newPlayer.birthDateDisplay}
                      onChange={handleBirthDateChange}
                      placeholder="DD/MM/AAAA"
                      maxLength={10}
                      className="bg-[#1d2834] border-[#305176] text-white"
                    />
                    <p className="text-gray-500 text-xs mt-1">El formato requerido es DD/MM/AAAA.</p>
                  </div>

                  {/* CAMPO DE CELULAR (Texto flexible) */}
                  <div className="space-y-2">
                    <Label className="text-white">Número de celular</Label>
                    <Input
                      type="text"
                      value={newPlayer.phoneNumber}
                      onChange={(e) => setNewPlayer({ ...newPlayer, phoneNumber: e.target.value })}
                      placeholder="Ej: +54 9 11 1234-5678"
                      className="bg-[#1d2834] border-[#305176] text-white"
                    />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:justify-between md:space-x-4 space-y-4 md:space-y-0">
                  <div className="space-y-2 flex-1">
                    <Label className="text-white">Foto del Jugador</Label>
                    <div className="flex items-center space-x-4">
                      <div className="w-24 h-24 bg-[#305176] rounded-lg flex items-center justify-center overflow-hidden">
                        {newPlayer.photo ? (
                          <Image
                            src={newPlayer.photo}
                            alt="Preview de la foto del jugador"
                            width={96}
                            height={96}
                            className="object-cover w-full h-full"
                            unoptimized
                          />
                        ) : (
                          <Upload className="h-8 w-8 text-gray-400" />
                        )}
                      </div>
                      <Button
                        variant="outline"
                        className="border-[#305176] text-white hover:bg-[#305176] bg-transparent"
                        onClick={() => document.getElementById('file-upload-input')?.click()}
                      >
                        Subir Foto
                      </Button>
                      <input
                        id="file-upload-input"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={() => {/* handlePlayerFileUpload */}}
                      />
                    </div>
                  </div>

                  <div className="space-y-2 flex-1">
                    <Label className="text-white">Estado</Label>
                    <div className="flex space-x-4">
                      <Button
                        variant={newPlayer.status === "DISPONIBLE" ? "default" : "outline"}
                        className={
                          newPlayer.status === "DISPONIBLE"
                            ? "bg-[#25d03f] text-black hover:bg-[#20b136]"
                            : "border-[#25d03f] text-[#25d03f] hover:bg-[#25d03f] hover:text-black bg-transparent"
                        }
                        onClick={() => setNewPlayer({ ...newPlayer, status: "DISPONIBLE", injury: null })}
                      >
                        DISPONIBLE
                      </Button>
                      <Button
                        variant={newPlayer.status === "NO DISPONIBLE" ? "default" : "outline"}
                        className={
                          newPlayer.status === "NO DISPONIBLE"
                            ? "bg-red-500 text-white hover:bg-red-600"
                            : "border-red-500 text-red-500 hover:bg-red-500 hover:text-white bg-transparent"
                        }
                        onClick={() => setNewPlayer({ ...newPlayer, status: "NO DISPONIBLE" })}
                      >
                        NO DISPONIBLE
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col-reverse space-y-3 space-y-reverse sm:flex-row sm:justify-center sm:space-x-4 sm:space-y-0 pt-4 border-t border-[#305176]">
                  <Button
                    variant="outline"
                    className="w-full h-12 text-lg border-red-500 text-red-500 hover:bg-red-500 hover:text-white bg-transparent sm:w-1/4"
                    onClick={handleCancelForm}
                  >
                    Cancelar
                  </Button>
                  <Button
                    className="w-full h-12 text-lg bg-[#aff606] text-black hover:bg-[#25d03f] sm:w-1/4"
                    onClick={editingPlayer ? handleUpdatePlayer : handleCreatePlayer}
                  >
                    {editingPlayer ? "Actualizar" : "Crear"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-[#213041] border-[#305176]">
              <CardHeader>
                <div className="flex items-center justify-between gap-2 sm:gap-4 flex-wrap">
                    <CardTitle
                        className="text-lg sm:text-2xl font-bold text-white whitespace-nowrap overflow-hidden truncate max-w-[calc(100%-100px)] sm:max-w-none"
                        title={
                            selectedCategory !== "all"
                            ? `${categoriesUI.find((c) => c.id === selectedCategory)?.name} - Jugadores (${filteredPlayers.length})`
                            : `Todas las categorías - Jugadores (${filteredPlayers.length})`
                        }
                    >
                      {categoriesUI.find((c) => c.id === selectedCategory)?.name || "Todas las categorías"}{" "}
                      - Jugadores ({filteredPlayers.length})
                    </CardTitle>
                    {/* BOTÓN NUEVO JUGADOR CON LÍMITE */}
                    {isTechnician && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                           <Button
                                size={isMobile ? "icon" : "default"}
                                className="bg-[#305176] text-white hover:bg-[#aff606] hover:text-black font-bold h-9 px-3 flex-shrink-0 ml-auto"
                                onClick={() => {
                                    if (playerLimitReached) {
                                      toast({
                                        title: "Límite de Jugadores",
                                        description: `Tu plan (${profile?.plan.toUpperCase()}) solo permite ${limits.MAX_PLAYERS} jugadores.`,
                                        variant: "default"
                                      });
                                      return;
                                    }
                                    setEditingPlayer(null);
                                    setShowCreateForm(true);
                                }}
                                disabled={playerLimitReached}
                            >
                                <Plus className="h-4 w-4" />
                                <span className="hidden sm:inline ml-1">Nuevo Jugador</span>
                            </Button>
                        </TooltipTrigger>
                        {playerLimitReached && limits.MAX_PLAYERS !== Infinity && (
                          <TooltipContent side="bottom" className="bg-red-500 text-white">
                            Límite de {limits.MAX_PLAYERS} jugadores alcanzado.
                          </TooltipContent>
                        )}
                      </Tooltip>
                    )}
                </div>
                {/* BARRA DE BÚSQUEDA */}
                <div className="flex-1 flex items-center space-x-2 mt-4 w-full">
                    <div className="relative w-full">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Buscar jugadores..."
                        className="pl-10 bg-[#1d2834] border-[#305176] text-white w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                </div>
                {/* Indicador de uso de jugadores */}
                {limits.MAX_PLAYERS !== Infinity && (
                    <p className={`text-sm mt-2 font-medium ${playerLimitReached ? 'text-red-400' : 'text-[#aff606]'}`}>
                        Uso de Jugadores: {usedPlayersCount} / {limits.MAX_PLAYERS}
                    </p>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredPlayers.map((player) => {
                    const statusBadge = getPlayerStatusBadge(player.injuryStatus);
                    return (
                        <div
                          key={player.id}
                          className={`flex items-center justify-between p-4 bg-[#1d2834] rounded-lg group ${isMobile ? 'cursor-pointer' : ''}`}
                          onClick={isMobile ? () => setShowPlayerDetail(player) : undefined}
                        >
                          <div className="flex items-center space-x-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={player.photo} alt={player.name} unoptimized />
                              <AvatarFallback className="bg-[#305176] text-white">
                                {player.name.split(" ").map((n) => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="text-white font-medium">
                                {player.name} ({player.number})
                              </h3>
                              <p className="text-gray-400 text-sm">
                                "{player.nickname}" • {player.position}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            {/* Botón de Lesión/Status */}
                            {player.injuryStatus === "INJURED" ? (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            size="sm"
                                            variant="default"
                                            className="bg-orange-500 text-white hover:bg-orange-600 h-7 px-3 group"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleViewMedicalReport(player);
                                            }}
                                        >
                                            {statusBadge.label}
                                            <FileText className="h-4 w-4 ml-1 transition-transform group-hover:scale-110" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-[#305176] text-white border-orange-500">
                                        {player.injuryDetails}
                                    </TooltipContent>
                                </Tooltip>
                            ) : (
                                <Badge className={statusBadge.className}>
                                    {statusBadge.label}
                                </Badge>
                            )}
                            
                            {/* Botón Eye (Ver Detalles) */}
                            <Button
                              variant="ghost"
                              size="icon"
                              className={`text-white hover:text-[#aff606] ${isMobile ? 'hidden lg:flex' : ''}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowPlayerDetail(player);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            
                            {/* Botón Trash2 (Eliminar) */}
                            {isTechnician && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className={`text-white hover:text-red-400 ${isMobile ? 'hidden lg:flex' : ''}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPlayerToDelete(player.id);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      {/* Player Detail Dialog */}
      <Dialog open={!!showPlayerDetail} onOpenChange={() => setShowPlayerDetail(null)}>
        <DialogContent className="sm:max-w-[425px] bg-[#213041] border-[#305176] text-white">
          <DialogHeader className="text-center">
            <DialogTitle className="text-white text-2xl font-bold">FICHA DEL JUGADOR</DialogTitle>
            <DialogDescription className="text-gray-400">
              Información de {showPlayerDetail?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center space-x-4 mb-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={showPlayerDetail?.photo} alt={showPlayerDetail?.name} unoptimized />
                <AvatarFallback className="bg-[#305176] text-white text-2xl">
                  {showPlayerDetail?.name?.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h3 className="text-white font-bold text-xl">{showPlayerDetail?.name}</h3>
                <Badge className={getPlayerStatusBadge(showPlayerDetail?.injuryStatus || 'FIT').className}>
                  {getPlayerStatusBadge(showPlayerDetail?.injuryStatus || 'FIT').label}
                </Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Posición</Label>
                <Input value={showPlayerDetail?.position} readOnly className="bg-[#1d2834] border-[#305176] text-white"/>
              </div>
              <div className="space-y-2">
                <Label className="text-white">Categoría</Label>
                <Input value={categoriesUI.find(c => c.id === showPlayerDetail?.categoryId)?.name || "N/A"} readOnly className="bg-[#1d2834] border-[#305176] text-white"/>
              </div>
              <div className="space-y-2">
                <Label className="text-white">Pierna Hábil</Label>
                <Input value={showPlayerDetail?.foot} readOnly className="bg-[#1d2834] border-[#305176] text-white"/>
              </div>
              <div className="space-y-2">
                <Label className="text-white">Fecha Nacimiento</Label>
                <Input
                  value={showPlayerDetail?.birthDate?.length === 10 && showPlayerDetail.birthDate.includes('-')
                    ? showPlayerDetail.birthDate.split('-').reverse().join('/') 
                    : showPlayerDetail?.birthDate || 'N/A'}
                  readOnly
                  className="bg-[#1d2834] border-[#305176] text-white"
                />
              </div>
              {/* Otros campos del detalle... */}
            </div>
          </div>
          
          {/* Botones */}
          {isTechnician && (
            <div className="flex flex-col space-y-3 sm:flex-row sm:justify-between sm:space-x-4 sm:space-y-0 pt-4 border-t border-[#305176]">
              <Button
                variant="default"
                className="w-full bg-[#aff606] text-black hover:bg-[#25d03f] sm:w-1/2 order-1"
                onClick={() => {
                  handleEditPlayer(showPlayerDetail!);
                  setShowPlayerDetail(null);
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar Jugador
              </Button>
              <Button
                variant="outline"
                className="w-full border-red-500 text-red-500 hover:bg-red-500 hover:text-white bg-transparent sm:w-1/2 order-2"
                onClick={() => setPlayerToDelete(showPlayerDetail?.id ?? null)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar Jugador
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Medical Report Dialog (AÑADIR LOGICA KINE) */}
      <Dialog open={!!showMedicalReport} onOpenChange={() => setShowMedicalReport(null)}>
        <DialogContent className="sm:max-w-[425px] bg-[#213041] border-[#305176] text-white">
          <DialogHeader className="text-center">
            <DialogTitle className="text-white text-2xl font-bold flex items-center justify-center">
                <FileText className="h-6 w-6 mr-2 text-orange-500" />
                INFORME MEDICO
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Detalles de la lesión de {showMedicalReport?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
             <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-white col-span-1">Estado</Label>
              <Input
                value={showMedicalReport?.injuryStatus === 'INJURED' ? 'LESIONADO' : 'DISPONIBLE'}
                readOnly
                className="col-span-3 bg-[#1d2834] border-[#305176] text-white"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-white col-span-1">Detalle</Label>
              <Input
                value={showMedicalReport?.injuryDetails || 'Sin detalles de lesión.'}
                readOnly
                className="col-span-3 bg-[#1d2834] border-[#305176] text-white"
              />
            </div>
            {/* Si el perfil puede recuperar jugador (Kine), se muestra el botón */}
            {isKinesiologo && showMedicalReport?.injuryStatus === 'INJURED' && (
              <Button
                className="w-full bg-[#25d03f] text-black hover:bg-[#20b136] mt-4"
                onClick={() => handleRecoverPlayer(showMedicalReport!.id)}
              >
                Marcar como Jugador Recuperado
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>


      {/* Alert Dialog for Delete Confirmation */}
      <AlertDialog open={!!playerToDelete} onOpenChange={() => setPlayerToDelete(null)}>
        <AlertDialogContent className="bg-[#213041] border-[#305176]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Confirmar Eliminación</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              ¿Estás seguro de que quieres eliminar a este jugador de forma permanente? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-[#305176] text-white hover:bg-[#305176]">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDeletePlayer(playerToDelete!)}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

       {/* Alert Dialog for Category Deletion Confirmation */}
       <AlertDialog open={!!categoryToDelete} onOpenChange={() => setCategoryToDelete(null)}>
        <AlertDialogContent className="bg-[#213041] border-[#305176]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Confirmar Eliminación</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              ¿Estás seguro de que quieres eliminar la categoría "{categoriesUI.find(c => c.id === categoryToDelete)?.name}"? Todos los jugadores dentro de esta categoría también serán eliminados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-[#305176] text-white hover:bg-[#305176]">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCategory}
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