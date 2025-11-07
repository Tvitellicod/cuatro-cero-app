"use client"

import { useState, useEffect } from "react"
// Importaciones añadidas para el rol y la fecha
import { useProfile } from "@/hooks/use-profile"
import { toast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { es } from "date-fns/locale/es"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
// Icono 'HeartPulse' (Botiquín) añadido
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

// Opcional: Define un tipo para Player (Mantenido al final del archivo para coherencia)

export function ClubManagement() {
  // --- AÑADIDO: Hook de perfil para verificar el rol ---
  const { currentProfile } = useProfile()
  const savedProfile = typeof window !== "undefined" ? localStorage.getItem("userProfile") : null
  const profileData = savedProfile ? JSON.parse(savedProfile) : null
  const isKinesiologo = profileData?.profileType === "KINESIOLOGO";
  // --- FIN AÑADIDO ---

  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null)
  const [newPlayer, setNewPlayer] = useState<Player>({
    id: 0,
    firstName: "",
    lastName: "",
    nickname: "",
    birthDate: "",
    phoneNumber: "",
    position: "",
    foot: "",
    category: "primera",
    photo: "",
    status: "DISPONIBLE",
    injury: null,
  })
  const [showCreateCategory, setShowCreateCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryColor, setNewCategoryColor] = useState("#aff606")
  const [showMedicalReport, setShowMedicalReport] = useState<Player | null>(null)
  const [playerToDelete, setPlayerToDelete] = useState<number | null>(null)
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null)
  const [showPlayerDetail, setShowPlayerDetail] = useState<Player | null>(null)
  const [showEditClub, setShowEditClub] = useState(false)
  const [clubInfo, setClubInfo] = useState({
    name: "Amigos de Villa Luro",
    abbreviation: "AVL",
    logo: "/images/cuatro-cero-logo.png",
  })
  const [tempClubInfo, setTempClubInfo] = useState(clubInfo)

  // --- AÑADIDO: Estado para el nuevo modal de reporte de lesión ---
  const [injuryReportModalOpen, setInjuryReportModalOpen] = useState<Player | null>(null);
  const [newInjury, setNewInjury] = useState({
    name: "",
    recoveryTime: "", // Ej: "3-4 semanas"
  });
  // --- FIN AÑADIDO ---


  const colorsOption = [
    "#aff606", "#33d9f6", "#f4c11a", "#ea3498", "#25d03f",
    "#8a46c5", "#ff6b35", "#4ecdc4", "#45b7d1", "#96ceb4",
    "#609966", "#c37a6b", "#77c4e4", "#f1a85f", "#d64b5e",
    "#6d89ff", "#ff8a65", "#b478d1", "#e69138", "#4e7c8e",
    "#a1c5d9", "#f5d76e", "#e8787c", "#c9d99d", "#7c7c7c"
  ];


  const [categories, setCategories] = useState([
    { id: "all", name: "Todas las categorías", playerCount: 65, color: "#213041" },
    { id: "primera", name: "Primera División", playerCount: 25, color: "#aff606" },
    { id: "tercera", name: "Tercera División", playerCount: 18, color: "#33d9f6" },
    { id: "juveniles", name: "Juveniles", playerCount: 22, color: "#f4c11a" },
  ])

  const positions = ["Arquero", "Ultimo", "Ala", "Pivot"]
  const feet = ["Derecho", "Izquierdo", "Ambidiestro"]

  const generatePlayers = () => {
    const firstNames = ["Juan", "Carlos", "Miguel", "Roberto", "Diego", "Fernando", "Alejandro", "Sebastián", "Martín", "Pablo", "Gonzalo", "Nicolás", "Facundo", "Matías", "Lucas", "Tomás", "Agustín", "Franco", "Ignacio", "Maximiliano", "Santiago", "Joaquín", "Emiliano", "Valentín", "Thiago"]
    const lastNames = ["García", "Rodríguez", "González", "Fernández", "López", "Martínez", "Sánchez", "Pérez", "Gómez", "Martín", "Jiménez", "Ruiz", "Hernández", "Díaz", "Moreno", "Muñoz", "Álvarez", "Romero", "Alonso", "Gutiérrez", "Navarro", "Torres", "Domínguez", "Vázquez", "Ramos"]
    const nicknames = ["Checo", "Toto", "Pipa", "Chino", "Flaco", "Gordo", "Ruso", "Turco", "Negro", "Rubio", "Pelado", "Chiqui", "Tano", "Mono", "Loco", "Pato", "Gato", "Oso", "León", "Tigre", "Lobo", "Colo", "Nacho", "Maxi", "Santi"]

    const players = []
    let playerId = 1

    const categoryMap: Record<string, { name: string; count: number }> = {
      "primera": { name: "Primera División", count: 25 },
      "tercera": { name: "Tercera División", count: 18 },
      "juveniles": { name: "Juveniles", count: 22 },
    }

    for (const categoryId in categoryMap) {
      for (let i = 0; i < categoryMap[categoryId as keyof typeof categoryMap].count; i++) {
        const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)]
        const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)]
        const randomNickname = nicknames[Math.floor(Math.random() * nicknames.length)]
        const randomPosition = positions[Math.floor(Math.random() * positions.length)]
        const randomFoot = feet[Math.floor(Math.random() * feet.length)]
        const randomYear = 1990 + Math.floor(Math.random() * 15)
        const randomMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0")
        const randomDay = String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")
        const isInjured = Math.random() < 0.3
        const randomPhone = `+54 9 11 ${Math.floor(Math.random() * 10000)}-${Math.floor(Math.random() * 10000)}`

        players.push({
          id: playerId++,
          firstName: randomFirstName,
          lastName: randomLastName,
          nickname: randomNickname,
          birthDate: `${randomYear}-${randomMonth}-${randomDay}`,
          phoneNumber: randomPhone,
          position: randomPosition,
          foot: randomFoot,
          status: isInjured ? "LESIONADO" : "DISPONIBLE",
          category: categoryId,
          photo: `/placeholder-user.jpg`,
          injury: isInjured
            ? {
                type: ["Lesión de rodilla", "Desgarro muscular", "Esguince de tobillo", "Contractura"][Math.floor(Math.random() * 4)],
                date: "2024-01-05",
                recovery: ["2-3 semanas", "3-4 semanas", "1-2 semanas", "4-6 semanas"][Math.floor(Math.random() * 4)],
              }
            : null,
        })
      }
    }
    return players
  }
  
  const [players, setPlayers] = useState<Player[]>(generatePlayers()) // Especificar tipo
  
  const filteredPlayers = players.filter((player) => {
    const matchesSearch =
      player.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.nickname.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === "all" || player.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  // --- NUEVA FUNCIÓN PARA MASCARA DD/MM/YYYY ---
  const handleBirthDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // 1. Remover todos los caracteres que no sean dígitos
    let cleaned = value.replace(/[^0-9]/g, '');
    let formattedValue = '';
    let storedDate = ''; // YYYY-MM-DD for consistency

    // 2. Aplicar la máscara DD/MM/AAAA
    if (cleaned.length > 0) {
      formattedValue = cleaned.slice(0, 2);
    }
    if (cleaned.length >= 3) {
      formattedValue += '/' + cleaned.slice(2, 4);
    }
    if (cleaned.length >= 5) {
      formattedValue += '/' + cleaned.slice(4, 8);
    }

    // 3. Limitar a 10 caracteres (DD/MM/YYYY)
    formattedValue = formattedValue.slice(0, 10);
    
    // 4. Si la cadena está completa (8 dígitos), se convierte a YYYY-MM-DD
    if (cleaned.length === 8) {
        const day = cleaned.slice(0, 2);
        const month = cleaned.slice(2, 4);
        const year = cleaned.slice(4, 8);
        
        // Simple validación de estructura para guardar en formato de fecha estándar
        if (day.length === 2 && month.length === 2 && year.length === 4) {
            storedDate = `${year}-${month}-${day}`;
        }
    }

    // 5. Actualizar el estado: guardamos la fecha en YYYY-MM-DD si está completa, sino guardamos el texto con máscara para mostrar
    setNewPlayer({ 
        ...newPlayer, 
        // Si hay una fecha válida para almacenar, la guardamos. Si no, guardamos el texto formateado.
        birthDate: storedDate || formattedValue 
    });
  };

  const handleCreatePlayer = () => {
    // Validación adicional: si la birthDate no es YYYY-MM-DD, significa que está incompleta o mal formateada
    const isDateValid = /^(\d{4})-(\d{2})-(\d{2})$/.test(newPlayer.birthDate);

    if (newPlayer.firstName && newPlayer.lastName && newPlayer.position && isDateValid) {
      const player: Player = {
        ...newPlayer,
        id: players.length + 1,
        photo: newPlayer.photo || "/placeholder-user.jpg",
      }
      setPlayers([...players, player])
      handleCancelForm()
    } else if (!isDateValid) {
        alert("Por favor, introduce la Fecha de Nacimiento completa en formato DD/MM/AAAA.");
    }
  }

  const handleEditPlayer = (player: Player) => {
    setEditingPlayer(player)
    setNewPlayer({
      ...player,
      photo: player.photo || "",
    })
    setShowCreateForm(true)
  }

  const handleUpdatePlayer = () => {
    const isDateValid = /^(\d{4})-(\d{2})-(\d{2})$/.test(newPlayer.birthDate);

    if (editingPlayer && isDateValid) {
      setPlayers(players.map((p) => (p.id === editingPlayer.id ? { ...p, ...newPlayer } : p)))
      handleCancelForm()
    } else if (!isDateValid) {
        alert("Por favor, introduce la Fecha de Nacimiento completa en formato DD/MM/AAAA.");
    }
  }

  const handleDeletePlayer = (id: number) => {
    setPlayers(players.filter((p) => p.id !== id))
    setPlayerToDelete(null)
  }

  const handleCancelForm = () => {
    setShowCreateForm(false)
    setEditingPlayer(null)
    setNewPlayer({
      id: 0,
      firstName: "",
      lastName: "",
      nickname: "",
      birthDate: "",
      phoneNumber: "",
      position: "",
      foot: "",
      category: "primera",
      photo: "",
      status: "DISPONIBLE",
      injury: null,
    })
  }

  const handleCreateCategory = () => {
    if (newCategoryName.trim()) {
      const newCat = {
        id: newCategoryName.toLowerCase().replace(/\s/g, ''),
        name: newCategoryName,
        playerCount: 0,
        color: newCategoryColor,
      }
      setCategories([...categories, newCat])
      setNewCategoryName("")
      setNewCategoryColor("#aff606")
      setShowCreateCategory(false)
    }
  }

  // --- MODIFICADO: Esta función AHORA abre el modal de lesión para Kine, o el de detalle para otros ---
  const handleViewMedicalReport = (player: Player) => {
    // Si es Kinesiologo, abre el modal de reporte de lesión (que tiene el botón de recuperar)
    if (isKinesiologo) {
      setShowMedicalReport(player);
    } else {
      // Si es otro rol, solo muestra el reporte (comportamiento anterior)
      setShowMedicalReport(player);
    }
  }
  // --- FIN MODIFICACIÓN ---

  // --- AÑADIDO: Handler para abrir el modal de reporte (botiquín) ---
  const handleOpenInjuryModal = (player: Player) => {
    setInjuryReportModalOpen(player);
    setNewInjury({ name: "", recoveryTime: "" }); // Resetea el form
  };
  // --- FIN AÑADIDO ---

  // --- AÑADIDO: Handler para GUARDAR la lesión (Kine) ---
  const handleSaveInjury = () => {
    if (!injuryReportModalOpen || !newInjury.name || !newInjury.recoveryTime) {
      toast({
        title: "Campos Incompletos",
        description: "Debe ingresar el nombre de la lesión y el tiempo de recuperación.",
        variant: "destructive",
      });
      return;
    }

    const playerId = injuryReportModalOpen.id;
    const injuryData = {
      type: newInjury.name,
      date: new Date().toISOString().split('T')[0], // Fecha de hoy
      recovery: newInjury.recoveryTime,
    };

    setPlayers(players.map(p => 
      p.id === playerId 
        ? { ...p, status: "LESIONADO", injury: injuryData } 
        : p
    ));

    toast({
      title: "Jugador Lesionado",
      description: `Se reportó la lesión de ${injuryReportModalOpen.firstName} ${injuryReportModalOpen.lastName}.`,
    });

    setInjuryReportModalOpen(null);
    setNewInjury({ name: "", recoveryTime: "" });
  };
  // --- FIN AÑADIDO ---
  
  // --- AÑADIDO: Handler para MARCAR COMO RECUPERADO (Kine) ---
  const handleRecoverPlayer = (playerId: number) => {
    setPlayers(players.map(p =>
      p.id === playerId
        ? { ...p, status: "DISPONIBLE", injury: null }
        : p
    ));
    
    toast({
      title: "Jugador Recuperado",
      description: "El jugador ha sido marcado como DISPONIBLE.",
    });

    setInjuryReportModalOpen(null); // Cierra el modal de lesión
    setShowMedicalReport(null); // Cierra el modal de reporte (si estaba abierto)
  };
  // --- FIN AÑADIDO ---


  const handleDeleteCategory = () => {
    if (categoryToDelete) {
      setCategories(categories.filter(cat => cat.id !== categoryToDelete));
      setPlayers(players.filter(p => p.category !== categoryToDelete));
      setCategoryToDelete(null);
      setSelectedCategory("all");
    }
  };

  const handlePlayerFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setNewPlayer({ ...newPlayer, photo: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  };

  const handleClubLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setTempClubInfo({ ...tempClubInfo, logo: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveClubChanges = () => {
    setClubInfo(tempClubInfo);
    setShowEditClub(false); // Cierra el modal
  }

  const handleCancelClubChanges = () => {
    setTempClubInfo(clubInfo);
    setShowEditClub(false); // Cierra el modal
  }

  // --- MODIFICADO: getEstimatedEndDate ahora es calculateRecoveryDate ---
  const calculateRecoveryDate = (recoveryString: string): string => {
    // Extraer el primer número del string (ej: "3-4 semanas" -> 3)
    const match = recoveryString.match(/(\d+)/);
    if (!match) return "N/A";

    const weeks = parseInt(match[0], 10);
    const recoveryDate = new Date();
    recoveryDate.setDate(recoveryDate.getDate() + weeks * 7);

    return format(recoveryDate, "dd-MM-yyyy");
  };
  // --- FIN MODIFICACIÓN ---

  // Helper para mostrar la fecha de nacimiento en el input DD/MM/AAAA
  const displayBirthDate = newPlayer.birthDate?.length === 10 && newPlayer.birthDate.includes('-')
    ? newPlayer.birthDate.split('-').reverse().join('/')
    : newPlayer.birthDate;


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
                  {/* --- MODIFICADO: Oculto si es Kinesiologo --- */}
                  {!isKinesiologo && (
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
                      src={clubInfo.logo}
                      alt="Escudo del club"
                      width={80}
                      height={80}
                      className="object-cover"
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
                        src={tempClubInfo.logo}
                        alt="Vista previa del logo"
                        width={96}
                        height={96}
                        className="object-cover"
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
                Categorías
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {categories.map((category) => (
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
                    {/* --- MODIFICADO: Oculto si es Kinesiologo --- */}
                    {selectedCategory === category.id && category.id !== "all" && !isKinesiologo ? (
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
              {/* --- MODIFICADO: Oculto si es Kinesiologo --- */}
              {!showCreateCategory && !isKinesiologo && (
                <Button
                  className="w-full bg-[#305176] text-white hover:bg-[#aff606] hover:text-black"
                  onClick={() => setShowCreateCategory(true)}
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
                      .filter(color => !categories.find(cat => cat.color === color))
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
                    <Label className="text-white">Nombre</Label>
                    <Input
                      value={newPlayer.firstName}
                      onChange={(e) => setNewPlayer({ ...newPlayer, firstName: e.target.value })}
                      placeholder="Nombre"
                      className="bg-[#1d2834] border-[#305176] text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Apellido</Label>
                    <Input
                      value={newPlayer.lastName}
                      onChange={(e) => setNewPlayer({ ...newPlayer, lastName: e.target.value })}
                      placeholder="Apellido"
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
                      value={newPlayer.category}
                      onValueChange={(value) => setNewPlayer({ ...newPlayer, category: value })}
                    >
                      <SelectTrigger className="bg-[#1d2834] border-[#305176] text-white">
                        <SelectValue placeholder="Seleccionar categoría" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#213041] border-[#305176]">
                        {categories.filter(c => c.id !== "all").map((cat) => (
                          <SelectItem key={cat.id} value={cat.id} className="text-white">
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* CAMPO DE FECHA DE NACIMIENTO CON MÁSCARA DD/MM/AAAA */}
                  <div className="space-y-2">
                    <Label className="text-white">Fecha de Nacimiento (DD/MM/AAAA)</Label>
                    <Input
                      value={displayBirthDate}
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
                        onChange={handlePlayerFileUpload}
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
                        onClick={() => setNewPlayer({ ...newPlayer, status: "DISPONIBLE", injury: null })} // Limpia lesión al poner disponible
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

                <div className="flex justify-center space-x-4">
                  <Button
                    className="w-1/4 h-12 text-lg bg-[#aff606] text-black hover:bg-[#25d03f]"
                    onClick={editingPlayer ? handleUpdatePlayer : handleCreatePlayer}
                  >
                    {editingPlayer ? "Actualizar" : "Crear"}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-1/4 h-12 text-lg border-red-500 text-red-500 hover:bg-red-500 hover:text-white bg-transparent"
                    onClick={handleCancelForm}
                  >
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-[#213041] border-[#305176]">
              <CardHeader>
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <CardTitle className="text-2xl font-bold text-white whitespace-nowrap">
                      {selectedCategory !== "all"
                        ? `${categories.find((c) => c.id === selectedCategory)?.name}`
                        : "Todas las categorías"}{" "}
                      - Jugadores ({filteredPlayers.length})
                    </CardTitle>
                    {/* --- MODIFICADO: Oculto si es Kinesiologo --- */}
                    {!isKinesiologo && (
                      <Button
                        size="default"
                        className="bg-[#305176] text-white hover:bg-[#aff606] hover:text-black font-bold h-9 px-4 ml-auto flex-shrink-0"
                        onClick={() => {
                          setEditingPlayer(null);
                          setShowCreateForm(true);
                        }}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Nuevo Jugador
                      </Button>
                    )}
                </div>
                <div className="flex-1 flex items-center space-x-2 mt-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Buscar jugadores..."
                        className="pl-10 bg-[#1d2834] border-[#305176] text-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredPlayers.map((player) => (
                    <div key={player.id} className="flex items-center justify-between p-4 bg-[#1d2834] rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={player.photo || "/placeholder.svg"} alt={player.firstName} />
                          <AvatarFallback className="bg-[#305176] text-white">
                            {(player.firstName?.[0] || "") + (player.lastName?.[0] || "")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-white font-medium">
                            {player.firstName} {player.lastName}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            "{player.nickname}" • {player.position} • {player.foot}
                          </p>
                          <p className="text-gray-500 text-xs">Estado: {player.status}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge
                          className={
                            player.status === "DISPONIBLE"
                              ? "bg-[#25d03f] text-black"
                              : player.status === "LESIONADO"
                                ? "bg-orange-500 text-white"
                                : "bg-red-500 text-white"
                          }
                        >
                          {player.status}
                        </Badge>
                        {/* --- INICIO DE MODIFICACIONES KINESIOLOGO --- */}
                        {player.status === "LESIONADO" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-white/10"
                            onClick={() => handleViewMedicalReport(player)} // Esta función ahora es inteligente
                          >
                            <FileText className="h-4 w-4 text-orange-500" />
                          </Button>
                        )}
                        {/* Botón de Botiquín (Solo para Kine y jugadores DISPONIBLES) */}
                        {isKinesiologo && player.status === "DISPONIBLE" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:text-orange-500"
                            onClick={() => handleOpenInjuryModal(player)}
                          >
                            <HeartPulse className="h-5 w-5" />
                          </Button>
                        )}
                        {/* --- FIN DE MODIFICACIONES KINESIOLOGO --- */}
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white hover:text-[#aff606]"
                          onClick={() => setShowPlayerDetail(player)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        {/* --- MODIFICADO: Oculto si es Kinesiologo --- */}
                        {!isKinesiologo && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:text-red-400"
                            onClick={() => setPlayerToDelete(player.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
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
              Información de {showPlayerDetail?.firstName} {showPlayerDetail?.lastName}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center space-x-4 mb-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={showPlayerDetail?.photo || "/placeholder.svg"} alt={showPlayerDetail?.firstName} />
                <AvatarFallback className="bg-[#305176] text-white text-2xl">
                  {(showPlayerDetail?.firstName?.[0] || "") + (showPlayerDetail?.lastName?.[0] || "")}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h3 className="text-white font-bold text-xl">
                  {showPlayerDetail?.firstName} {showPlayerDetail?.lastName}
                </h3>
                <p className="text-gray-400 text-sm">
                  "{showPlayerDetail?.nickname}"
                </p>
                <Badge
                  className={
                    showPlayerDetail?.status === "DISPONIBLE"
                      ? "bg-[#25d03f] text-black"
                      : showPlayerDetail?.status === "LESIONADO"
                        ? "bg-orange-500 text-white"
                        : "bg-red-500 text-white"
                  }
                >
                  {showPlayerDetail?.status}
                </Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Posición</Label>
                <Input
                  value={showPlayerDetail?.position}
                  readOnly
                  className="bg-[#1d2834] border-[#305176] text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Categoría</Label>
                <Input
                  value={categories.find(c => c.id === showPlayerDetail?.category)?.name || ""}
                  readOnly
                  className="bg-[#1d2834] border-[#305176] text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Pierna Hábil</Label>
                <Input
                  value={showPlayerDetail?.foot}
                  readOnly
                  className="bg-[#1d2834] border-[#305176] text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Fecha Nacimiento</Label>
                {/* Mostrar la fecha en formato DD/MM/AAAA */}
                <Input
                  value={showPlayerDetail?.birthDate?.length === 10 && showPlayerDetail.birthDate.includes('-')
                    ? showPlayerDetail.birthDate.split('-').reverse().join('/') 
                    : showPlayerDetail?.birthDate || 'N/A'}
                  readOnly
                  className="bg-[#1d2834] border-[#305176] text-white"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label className="text-white">Celular</Label>
                <Input
                  value={showPlayerDetail?.phoneNumber}
                  readOnly
                  className="bg-[#1d2834] border-[#305176] text-white"
                />
              </div>
            </div>
          </div>
          {/* --- MODIFICADO: Oculto si es Kinesiologo --- */}
          {!isKinesiologo && (
            <div className="flex justify-between space-x-4">
              <Button
                variant="default"
                className="w-full bg-[#aff606] text-black hover:bg-[#25d03f]"
                onClick={() => {
                  handleEditPlayer(showPlayerDetail!);
                  setShowPlayerDetail(null);
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar Jugador
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>


      {/* Medical Report Dialog (MODIFICADO PARA KINE) */}
      <Dialog open={!!showMedicalReport} onOpenChange={() => setShowMedicalReport(null)}>
        <DialogContent className="sm:max-w-[425px] bg-[#213041] border-[#305176] text-white">
          <DialogHeader className="text-center">
            <DialogTitle className="text-white text-2xl font-bold">INFORME MEDICO</DialogTitle>
            <DialogDescription className="text-gray-400">
              Detalles de la lesión de {showMedicalReport?.firstName} {showMedicalReport?.lastName}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="injury-date" className="text-right text-white">
                Fecha
              </Label>
              <Input
                id="injury-date"
                value={showMedicalReport?.injury?.date.split('-').reverse().join('-') || ""}
                readOnly
                className="col-span-3 bg-[#1d2834] border-[#305176] text-white"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="injury-description" className="text-right text-white">
                Descripción
              </Label>
              <Input
                id="injury-description"
                value={showMedicalReport?.injury?.type || ""}
                readOnly
                className="col-span-3 bg-[#1d2834] border-[#305176] text-white"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="injury-recovery" className="text-right text-white">
                Recuperación
              </Label>
              <Input
                id="injury-recovery"
                value={showMedicalReport?.injury?.recovery || ""}
                readOnly
                className="col-span-3 bg-[#1d2834] border-[#305176] text-white"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="injury-end-date" className="text-right text-white">
                Fecha Estimada
              </Label>
              {/* --- MODIFICADO: usa la nueva función --- */}
              <Input
                id="injury-end-date"
                value={calculateRecoveryDate(showMedicalReport?.injury?.recovery || '')}
                readOnly
                className="col-span-3 bg-[#1d2834] border-[#305176] text-white"
              />
            </div>
          </div>
          {/* --- AÑADIDO: Botón de Recuperar Jugador (Solo Kine) --- */}
          {isKinesiologo && (
            <DialogFooter>
              <Button
                className="w-full bg-[#25d03f] text-black hover:bg-[#20b136]"
                onClick={() => handleRecoverPlayer(showMedicalReport!.id)}
              >
                Marcar como Jugador Recuperado
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
      
      {/* --- AÑADIDO: Nuevo Modal para Reportar Lesión (Kine) --- */}
      <Dialog open={!!injuryReportModalOpen} onOpenChange={() => setInjuryReportModalOpen(null)}>
        <DialogContent className="sm:max-w-[425px] bg-[#213041] border-[#305176] text-white">
          <DialogHeader className="text-center">
            <DialogTitle className="text-white text-2xl font-bold">Reportar Lesión</DialogTitle>
            <DialogDescription className="text-gray-400">
              Registrar nueva lesión para {injuryReportModalOpen?.firstName} {injuryReportModalOpen?.lastName}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="injury-date-new" className="text-white">Fecha Actual</Label>
              <Input
                id="injury-date-new"
                value={format(new Date(), "dd-MM-yyyy")}
                readOnly
                className="bg-[#1d2834] border-[#305176] text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="injury-name" className="text-white">Nombre de la Lesión *</Label>
              <Input
                id="injury-name"
                value={newInjury.name}
                onChange={(e) => setNewInjury(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ej: Desgarro isquiotibial"
                className="bg-[#1d2834] border-[#305176] text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="injury-recovery-time" className="text-white">Tiempo de Recuperación *</Label>
              <Input
                id="injury-recovery-time"
                value={newInjury.recoveryTime}
                onChange={(e) => setNewInjury(prev => ({ ...prev, recoveryTime: e.target.value }))}
                placeholder="Ej: 3-4 semanas"
                className="bg-[#1d2834] border-[#305176] text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="injury-estimated-date" className="text-white">Fecha Estimada de Recuperación</Label>
              <Input
                id="injury-estimated-date"
                value={calculateRecoveryDate(newInjury.recoveryTime)}
                readOnly
                className="bg-[#1d2834] border-[#305176] text-white"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white bg-transparent"
              onClick={() => setInjuryReportModalOpen(null)}
            >
              Cancelar
            </Button>
            <Button
              className="bg-[#aff606] text-black hover:bg-[#25d03f]"
              onClick={handleSaveInjury}
            >
              Guardar Reporte
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* --- FIN AÑADIDO --- */}

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
              ¿Estás seguro de que quieres eliminar la categoría "{categoryToDelete}"? Todos los jugadores dentro de esta categoría también serán eliminados.
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

// Opcional: Define un tipo para Player
type Player = {
  id: number;
  firstName: string;
  lastName: string;
  nickname: string;
  birthDate: string;
  phoneNumber: string;
  position: string;
  foot: string;
  status: string; // "DISPONIBLE", "LESIONADO", "NO DISPONIBLE"
  category: string;
  photo: string;
  injury?: {
    type: string;
    date: string;
    recovery: string;
  } | null;
}