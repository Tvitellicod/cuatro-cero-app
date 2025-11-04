"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useProfile } from "@/hooks/use-profile"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { User, Apple, FileText, Plus, Eye, Calendar, ArrowLeft, Trash2 } from "lucide-react" // Importar Trash2
import { ScrollArea } from "@/components/ui/scroll-area" 
import { Separator } from "@/components/ui/separator" 
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


// --- Interfaces ---
interface Player {
  id: number;
  name: string;
  category: string; // Este es el ID estático (ej: "primera")
  photo: string;
  position: string;
}

type Diagnosis = "ADECUADA" | "PODRIA MEJORAR" | "AUMENTADA" | "NORMAL"; 

interface NutritionReport {
  id: string; 
  date: string;
  edad: string; 
  altura: string; 
  peso: string; 
  sumatoriaPliegues: string; 
  imc: string; 
  diagMasaAdiposa: Diagnosis; 
  diagMasaMuscular: Diagnosis; 
  supplementation: string;
  objective: string;
  observations: string; 
}

const INITIAL_FORM_DATA: NutritionReport = {
  id: "",
  date: new Date().toISOString().split('T')[0], 
  edad: "",
  altura: "",
  peso: "",
  sumatoriaPliegues: "",
  imc: "",
  diagMasaAdiposa: "NORMAL",
  diagMasaMuscular: "NORMAL",
  supplementation: "",
  objective: "",
  observations: "", 
};

const NUTRITION_REPORTS_KEY = "nutritionReports";

// --- DATOS MOCK ---
const MOCK_PLAYERS_LIST: Player[] = [
  // Primera
  { id: 1, name: "Juan C. Pérez", category: "primera", photo: "/placeholder-user.jpg", position: "Pivot" },
  { id: 2, name: "Miguel A. González", category: "primera", photo: "/placeholder-user.jpg", position: "Ala" },
  { id: 4, name: "Tomás López", category: "primera", photo: "/placeholder-user.jpg", position: "Arquero" },
  // Juveniles
  { id: 3, name: "Roberto Silva", category: "juveniles", photo: "/placeholder-user.jpg", position: "Ultimo" },
  { id: 7, name: "Martín Palacios", category: "juveniles", photo: "/placeholder-user.jpg", position: "Ultimo" },
  // Tercera
  { id: 5, name: "Alejandro Díaz", category: "tercera", photo: "/placeholder-user.jpg", position: "Defensor" },
  { id: 6, name: "Santiago Giménez", category: "tercera", photo: "/placeholder-user.jpg", position: "Ala" },
];

const getMockIdFromName = (name: string | undefined) => {
  if (!name) return "";
  if (name.toLowerCase().includes("primera")) return "primera";
  if (name.toLowerCase().includes("juveniles")) return "juveniles";
  if (name.toLowerCase().includes("tercera")) return "tercera";
  return name.toLowerCase(); 
};

const INITIAL_MOCK_REPORTS: Record<number, NutritionReport[]> = {
  1: [ 
    {
      id: "report_1700000000001",
      date: "2025-10-01",
      edad: "28",
      altura: "180",
      peso: "80.5",
      sumatoriaPliegues: "67",
      imc: "24.8",
      diagMasaAdiposa: "ADECUADA",
      diagMasaMuscular: "ADECUADA",
      supplementation: "Creatina 5g post-entreno. Whey Protein 30g AM.",
      observations: "Buena adherencia al plan. Reporta más energía.", 
      objective: "Mantener peso, reducir % graso y aumentar masa muscular.",
    },
    {
      id: "report_1700000000000",
      date: "2025-09-01",
      edad: "28",
      altura: "180",
      peso: "81.2",
      sumatoriaPliegues: "74",
      imc: "25.1",
      diagMasaAdiposa: "PODRIA MEJORAR",
      diagMasaMuscular: "ADECUADA",
      supplementation: "Whey Protein 30g AM.",
      observations: "Inicio de plan. Ajustar porciones de carbohidratos.", 
      objective: "Evaluación inicial. Objetivo: Reducir % graso.",
    }
  ],
  3: [ 
    {
      id: "report_1700000000002",
      date: "2025-10-05",
      edad: "19",
      altura: "175",
      peso: "75.0",
      sumatoriaPliegues: "60",
      imc: "24.5",
      diagMasaAdiposa: "ADECUADA",
      diagMasaMuscular: "PODRIA MEJORAR",
      supplementation: "Ninguna.",
      observations: "Jugador juvenil. Foco en hábitos alimenticios.", 
      objective: "Aumentar ingesta calórica saludable. Mejorar timing de comidas.",
    }
  ]
};
// --- FIN DATOS MOCK ---


export function NutritionSection() {
  const { selectedCategory: currentGlobalCategory } = useProfile();
  
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [showReportModal, setShowReportModal] = useState(false); 
  const [activeReportId, setActiveReportId] = useState<string | null>(null); 
  const [newReportData, setNewReportData] = useState<NutritionReport>(INITIAL_FORM_DATA);
  const [reports, setReports] = useState<Record<number, NutritionReport[]>>({});
  
  const [reportToDelete, setReportToDelete] = useState<NutritionReport | null>(null);
  
  const playerReports = useMemo(() => {
    if (selectedPlayer) {
      return (reports[selectedPlayer.id] || []).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    return [];
  }, [selectedPlayer, reports]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedReports = localStorage.getItem(NUTRITION_REPORTS_KEY);
      if (storedReports) {
        setReports(JSON.parse(storedReports));
      } else {
        setReports(INITIAL_MOCK_REPORTS);
        localStorage.setItem(NUTRITION_REPORTS_KEY, JSON.stringify(INITIAL_MOCK_REPORTS));
      }
    }
  }, []);

  const mockCategoryId = currentGlobalCategory ? getMockIdFromName(currentGlobalCategory.name) : "";
  const filteredPlayers = MOCK_PLAYERS_LIST.filter(
    (player) => player.category === mockCategoryId
  );
  
  const handleOpenReportModal = (player: Player) => {
    setSelectedPlayer(player);
    setActiveReportId(null); 
    setNewReportData({
      ...INITIAL_FORM_DATA,
      date: new Date().toISOString().split('T')[0]
    });
    setShowReportModal(true);
  };
  
  const handleSaveReport = () => {
    if (!selectedPlayer || !newReportData.objective || !newReportData.peso || !newReportData.altura || !newReportData.edad) {
      toast({
        title: "Error de Validación",
        description: "Edad, Altura, Peso y Objetivo son campos obligatorios.",
        variant: "destructive",
      });
      return;
    }

    const newReport: NutritionReport = {
      ...newReportData,
      id: `report_${Date.now()}`, 
      date: new Date().toISOString().split('T')[0] 
    };

    const existingReports = reports[selectedPlayer.id] || [];
    const updatedReports = [...existingReports, newReport];

    const newAllReports = {
      ...reports,
      [selectedPlayer.id]: updatedReports
    };

    setReports(newAllReports);
    if (typeof window !== "undefined") {
      localStorage.setItem(NUTRITION_REPORTS_KEY, JSON.stringify(newAllReports));
    }

    toast({
      title: "Informe Guardado",
      description: `El informe para ${selectedPlayer.name} fue guardado.`,
      variant: "default",
    });
    
    setNewReportData(INITIAL_FORM_DATA);
    setActiveReportId(newReport.id); 
  };

  const handleDeleteReport = () => {
    if (!reportToDelete || !selectedPlayer) return;

    const updatedPlayerReports = (reports[selectedPlayer.id] || []).filter(
      report => report.id !== reportToDelete.id
    );

    const newAllReports = {
      ...reports,
      [selectedPlayer.id]: updatedPlayerReports
    };

    setReports(newAllReports);
    if (typeof window !== "undefined") {
      localStorage.setItem(NUTRITION_REPORTS_KEY, JSON.stringify(newAllReports));
    }

    toast({
      title: "Informe Eliminado",
      description: `El informe del ${formatDate(reportToDelete.date)} fue eliminado.`,
      variant: "destructive",
    });

    if (activeReportId === reportToDelete.id) {
      setActiveReportId(null);
    }
    
    setReportToDelete(null); 
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewReportData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleDiagnosisChange = (name: "diagMasaAdiposa" | "diagMasaMuscular", value: Diagnosis) => {
    setNewReportData(prev => ({ ...prev, [name]: value }));
  };

  const viewingReport = useMemo(() => {
    if (activeReportId && selectedPlayer) {
      return playerReports.find(r => r.id === activeReportId);
    }
    return null;
  }, [activeReportId, playerReports, selectedPlayer]);

  const isReadOnly = !!viewingReport;
  const displayData = viewingReport || newReportData;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Seguimiento Nutricional</h2>
          <p className="text-gray-400">
            {currentGlobalCategory 
              ? `Viendo jugadores de ${currentGlobalCategory.name}`
              : "Gestiona los informes y objetivos nutricionales."
            }
          </p>
        </div>
      </div>
      
      {!currentGlobalCategory ? (
        <Card className="bg-[#213041] border-[#305176] text-center p-8">
          <CardTitle className="text-white">Selecciona una Categoría</CardTitle>
          <CardDescription className="text-gray-400 mt-2">
            Por favor, selecciona una categoría desde el menú superior para ver los jugadores.
          </CardDescription>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredPlayers.length > 0 ? (
            filteredPlayers.map(player => (
              <PlayerCard 
                key={player.id} 
                player={player} 
                onOpenHistory={() => handleOpenReportModal(player)}
              />
            ))
          ) : (
             <p className="text-gray-500 col-span-full text-center py-8">
                No hay jugadores de ejemplo para la categoría seleccionada.
             </p>
          )}
        </div>
      )}

      
      <Dialog open={showReportModal} onOpenChange={setShowReportModal}>
        <DialogContent className="sm:max-w-6xl h-[90vh] bg-[#213041] border-[#305176] text-white flex flex-col">
          <DialogHeader className="pr-16"> 
            <DialogTitle className="text-white text-2xl font-bold">
              Gestión Nutricional: {selectedPlayer?.name}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {activeReportId === null 
                ? "Creando un nuevo informe" 
                : `Viendo informe del ${formatDate(viewingReport?.date || "")}`
              }
            </DialogDescription>
          </DialogHeader>
          
          {/* --- ARREGLO: Contenedor del Grid con min-h-0 --- */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-0">

            {/* Columna Izquierda: Historial */}
            <div className="md:col-span-1 flex flex-col h-full bg-[#1d2834] rounded-lg p-4 overflow-hidden min-h-0"> 
              <h3 className="text-lg font-semibold text-white mb-4">Historial de Informes</h3>
              <Button
                size="sm"
                className="w-full bg-[#aff606] text-black hover:bg-[#25d03f] mb-4"
                onClick={() => setActiveReportId(null)} 
              >
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Informe
              </Button>
              <Separator className="bg-[#305176] mb-4" />
              <ScrollArea className="flex-1 pr-2">
                <div className="space-y-3">
                  {playerReports.length > 0 ? (
                    playerReports.map(report => (
                      <div 
                        key={report.id} 
                        className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors group ${
                          activeReportId === report.id
                            ? "bg-[#305176]"
                            : "bg-[#213041] hover:bg-[#305176]/50"
                        }`}
                      >
                        <div 
                          className="flex items-center space-x-3 overflow-hidden flex-1"
                          onClick={() => setActiveReportId(report.id)} 
                        >
                          <Calendar className={`h-5 w-5 ${activeReportId === report.id ? 'text-[#aff606]' : 'text-gray-400'}`} />
                          <div>
                            <p className="text-white font-medium">{formatDate(report.date)}</p>
                          </div>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-red-500/60 hover:text-red-500 hover:bg-red-500/10 h-8 w-8 ml-2"
                          onClick={(e) => {
                            e.stopPropagation(); 
                            setReportToDelete(report);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      <FileText className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm">Sin informes previos.</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* --- ARREGLO: Columna Derecha: Formulario + Botón --- */}
            <div className="md:col-span-2 h-full flex flex-col overflow-hidden min-h-0"> 
              
              {/* 1. Área de Scroll (solo para el formulario) */}
              <ScrollArea className="flex-1 pr-6"> 
                <form className="space-y-6 p-1">
                  <div className="flex justify-end -mb-4">
                    <p className="text-sm text-gray-400">
                      Fecha del Informe: 
                      <span className="font-medium text-white ml-2">{formatDate(displayData.date)}</span>
                    </p>
                  </div>

                  {/* --- Sección 1: Datos Antropométricos --- */}
                  <SectionTitle title="Datos Antropométricos" />
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <InputGroup label="Edad" name="edad" type="number" placeholder="25" value={displayData.edad} onChange={handleInputChange} readOnly={isReadOnly} />
                    <InputGroup label="Altura (cm)" name="altura" type="number" placeholder="180" value={displayData.altura} onChange={handleInputChange} readOnly={isReadOnly} />
                    <InputGroup label="Peso (kg)" name="peso" type="number" placeholder="80.5" value={displayData.peso} onChange={handleInputChange} readOnly={isReadOnly} />
                    <InputGroup label="Sumatoria Pliegues (mm)" name="sumatoriaPliegues" type="number" placeholder="67" value={displayData.sumatoriaPliegues} onChange={handleInputChange} readOnly={isReadOnly} />
                    <InputGroup label="IMC" name="imc" type="number" placeholder="24.8" value={displayData.imc} onChange={handleInputChange} readOnly={isReadOnly} />
                  </div>

                  {/* --- Sección 2: Diagnósticos --- */}
                  <SectionTitle title="Diagnóstico Nutricional" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SelectGroup
                      label="Diagnóstico Masa Adiposa"
                      name="diagMasaAdiposa"
                      value={displayData.diagMasaAdiposa}
                      onValueChange={(value: Diagnosis) => handleDiagnosisChange("diagMasaAdiposa", value)}
                      disabled={isReadOnly}
                    />
                    <SelectGroup
                      label="Diagnóstico Masa Muscular"
                      name="diagMasaMuscular"
                      value={displayData.diagMasaMuscular}
                      onValueChange={(value: Diagnosis) => handleDiagnosisChange("diagMasaMuscular", value)}
                      disabled={isReadOnly}
                    />
                  </div>

                  {/* --- Sección 3: Suplementación y Objetivos --- */}
                  <SectionTitle title="Plan de Suplementación y Objetivos" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextareaGroup 
                      label="Objetivo Principal (Obligatorio)" 
                      name="objective" 
                      placeholder="Ej: Aumentar 2kg de masa muscular..." 
                      value={displayData.objective} 
                      onChange={handleInputChange} 
                      readOnly={isReadOnly} 
                    />
                    <TextareaGroup 
                      label="Plan de Suplementación" 
                      name="supplementation" 
                      placeholder="Ej: Creatina 5g post-entreno..." 
                      value={displayData.supplementation} 
                      onChange={handleInputChange} 
                      readOnly={isReadOnly} 
                    />
                     <div className="md:col-span-2">
                      <TextareaGroup 
                        label="Observaciones" 
                        name="observations" 
                        placeholder="Ej: Jugador reporta buena digestión..." 
                        value={displayData.observations} 
                        onChange={handleInputChange} 
                        readOnly={isReadOnly} 
                      />
                    </div>
                  </div>
                </form>
              </ScrollArea>
              
              {/* --- ARREGLO: Botón de Guardar movido FUERA del ScrollArea --- */}
              {!isReadOnly && (
                <div className="flex-shrink-0 flex justify-end pt-4 mt-4 border-t border-[#305176] pr-6">
                  <Button className="bg-[#aff606] text-black hover:bg-[#25d03f]" onClick={handleSaveReport} type="button">
                    Guardar Informe
                  </Button>
                </div>
              )}
              {/* --- FIN DEL ARREGLO --- */}

            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={!!reportToDelete} onOpenChange={() => setReportToDelete(null)}>
        <AlertDialogContent className="bg-[#213041] border-[#305176]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Esta acción eliminará permanentemente el informe del{" "}
              <span className="font-bold text-white">{formatDate(reportToDelete?.date || "")}</span>.
              No se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              className="bg-transparent border-[#305176] text-white hover:bg-[#305176]"
              onClick={() => setReportToDelete(null)}
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-500 text-white hover:bg-red-600" 
              onClick={handleDeleteReport}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// --- Componentes Hijos ---

// Card del Jugador
const PlayerCard = ({ player, onOpenHistory }: { player: Player; onOpenHistory: () => void; }) => (
  <Card className="bg-[#1d2834] border-[#305176] flex flex-col">
    <CardHeader className="flex-row items-center gap-4 space-y-0 pb-4">
      <Avatar className="h-12 w-12">
        <AvatarImage src={player.photo} alt={player.name} />
        <AvatarFallback className="bg-[#305176] text-[#aff606]">
          {player.name.split(" ").map(n => n[0]).join("")}
        </AvatarFallback>
      </Avatar>
      <div>
        <CardTitle className="text-white text-lg">{player.name}</CardTitle>
        <CardDescription className="text-gray-400">{player.position}</CardDescription>
      </div>
    </CardHeader>
    <CardContent className="flex-grow"></CardContent>
    <Button
      className="w-full bg-[#aff606] text-black hover:bg-[#25d03f] rounded-t-none"
      onClick={onOpenHistory} 
    >
      <FileText className="h-4 w-4 mr-2" />
      Ver Informes del Jugador
    </Button>
  </Card>
);

// Título de sección del formulario
const SectionTitle = ({ title }: { title: string }) => (
  <h3 className="text-lg font-semibold text-white border-b border-[#305176] pb-2">{title}</h3>
);


// --- MODIFICACIÓN: Inputs y Textareas con color de Label cambiado a text-white ---
// Grupo de Input
const InputGroup = ({ label, name, value, onChange, readOnly, placeholder, type = "text" }: any) => (
  <div className="space-y-2">
    {/* 1. Label/Título (Blanco) */}
    <Label htmlFor={name} className="text-white">{label}</Label> 
    <Input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      placeholder={placeholder}
      // 2. Input (Texto Blanco)
      className="bg-[#1d2834] border-[#305176] text-white read-only:bg-[#1d2834]/60 read-only:cursor-default"
    />
  </div>
);

// Grupo de Textarea
const TextareaGroup = ({ label, name, value, onChange, readOnly, placeholder }: any) => (
  <div className="space-y-2">
    {/* 1. Label/Título (Blanco) */}
    <Label htmlFor={name} className="text-white">{label}</Label>
    <Textarea
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      placeholder={placeholder}
       // 2. Textarea (Texto Blanco)
      className="bg-[#1d2834] border-[#305176] text-white min-h-[100px] read-only:bg-[#1d2834]/60 read-only:cursor-default"
    />
  </div>
);
// -----------------------------------------------------------------

// --- MODIFICACIÓN: Select de Diagnóstico con Label en text-white ---
const getDiagnosisColor = (value: Diagnosis) => {
  switch (value) {
    case "ADECUADA": return "text-[#25d03f]";
    case "PODRIA MEJORAR": return "text-[#f4c11a]";
    case "AUMENTADA": return "text-red-500";
    default: return "text-white"; 
  }
}

const SelectGroup = ({ label, name, value, onValueChange, disabled }: any) => (
  <div className="space-y-2">
    {/* 1. Label/Título (Blanco) */}
    <Label htmlFor={name} className="text-white">{label}</Label>
    <Select
      value={value || "NORMAL"}
      onValueChange={onValueChange}
      disabled={disabled}
    >
      <SelectTrigger
        id={name}
        className={`bg-[#1d2834] border-[#305176] font-bold ${getDiagnosisColor(value)} disabled:opacity-100 disabled:cursor-default`}
      >
        <SelectValue placeholder="Seleccionar..." />
      </SelectTrigger>
      <SelectContent className="bg-[#213041] border-[#305176]">
        <SelectItem value="NORMAL" className="text-gray-400">(Seleccionar...)</SelectItem>
        <SelectItem value="ADECUADA" className="text-[#25d03f]">ADECUADA</SelectItem>
        <SelectItem value="PODRIA MEJORAR" className="text-[#f4c11a]">PODRIA MEJORAR</SelectItem>
        <SelectItem value="AUMENTADA" className="text-red-500">AUMENTADA</SelectItem>
      </SelectContent>
    </Select>
  </div>
);
// --- FIN MODIFICACIÓN ---

// Helper para formatear fecha
const formatDate = (dateString: string) => {
  if (!dateString) return "Fecha no disponible";
  try {
    const date = new Date(dateString);
    // Ajustar por zona horaria (sumar un día si es necesario por UTC)
    const adjustedDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    return adjustedDate.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch (error) {
    return dateString; // Devuelve el string original si falla
  }
};