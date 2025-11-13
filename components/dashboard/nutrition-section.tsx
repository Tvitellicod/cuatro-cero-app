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
// --- MODIFICADO: Iconos 'Users' y 'Trash2' añadidos ---
import { User, Apple, FileText, Plus, Eye, Calendar, ArrowLeft, Users as UsersIcon, Trash2 } from "lucide-react" 
import { ScrollArea } from "@/components/ui/scroll-area" 
import { Separator } from "@/components/ui/separator" 
// --- MODIFICADO: Imports de AlertDialog añadidos ---
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

const MOCK_CATEGORIES = [
  { id: "all", name: "Todas las Categorías" },
  { id: "primera", name: "Primera División" },
  { id: "tercera", name: "Tercera División" },
  { id: "juveniles", name: "Juveniles" },
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
      objective: "Aumentar ingesta calórica saludable. Mejorar timing de comidas.",
    }
  ]
};
// --- FIN DATOS MOCK ---


export function NutritionSection() {
  const { selectedCategory: currentGlobalCategory } = useProfile();
  const initialMockId = currentGlobalCategory ? getMockIdFromName(currentGlobalCategory.name) : "all";
  const [localCategoryId, setLocalCategoryId] = useState<string>(initialMockId);
  
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [showReportModal, setShowReportModal] = useState(false); 
  
  const [activeReportId, setActiveReportId] = useState<string | null>(null); // Para ver uno existente
  const [isCreatingReport, setIsCreatingReport] = useState(false); // Para mostrar el form vacío

  const [newReportData, setNewReportData] = useState<NutritionReport>(INITIAL_FORM_DATA);
  const [reports, setReports] = useState<Record<number, NutritionReport[]>>({});

  // --- MODIFICADO: Estado para controlar el diálogo de eliminación ---
  const [reportToDelete, setReportToDelete] = useState<NutritionReport | null>(null);
  // ---------------------------------------------------------------
  
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

  useEffect(() => {
    if (isCreatingReport) {
      const peso = parseFloat(newReportData.peso);
      const alturaCm = parseFloat(newReportData.altura);

      if (peso > 0 && alturaCm > 0) {
        const alturaM = alturaCm / 100;
        const imcValue = peso / (alturaM * alturaM);
        setNewReportData(prev => ({
          ...prev,
          imc: imcValue.toFixed(1)
        }));
      } else {
        setNewReportData(prev => ({ ...prev, imc: "" }));
      }
    }
  }, [newReportData.peso, newReportData.altura, isCreatingReport]); 


  // --- MODIFICADO: Helper para guardar en LS ---
  const saveReportsToLocalStorage = (updatedReports: Record<number, NutritionReport[]>) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(NUTRITION_REPORTS_KEY, JSON.stringify(updatedReports));
    }
  };
  // ---------------------------------------------


  const filteredPlayers = MOCK_PLAYERS_LIST.filter(
    (player) => localCategoryId === "all" || player.category === localCategoryId
  );
  
  const handleOpenReportModal = (player: Player) => {
    setSelectedPlayer(player);
    setActiveReportId(null); 
    setIsCreatingReport(false); 
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
      date: new Date(newReportData.date).toISOString().split('T')[0] 
    };

    const existingReports = reports[selectedPlayer.id] || [];
    const updatedReports = [...existingReports, newReport];

    const newAllReports = {
      ...reports,
      [selectedPlayer.id]: updatedReports
    };

    setReports(newAllReports);
    // --- MODIFICADO: Usa el helper ---
    saveReportsToLocalStorage(newAllReports);
    // ----------------------------------

    toast({
      title: "Informe Guardado",
      description: `El informe para ${selectedPlayer.name} fue guardado.`,
      variant: "default",
    });
    
    setNewReportData(INITIAL_FORM_DATA);
    setIsCreatingReport(false);
    setActiveReportId(newReport.id);
  };

  // --- MODIFICADO: Nueva función para manejar la eliminación ---
  const handleDeleteReport = () => {
    if (!reportToDelete || !selectedPlayer) return;

    const playerReportsList = reports[selectedPlayer.id] || [];
    // Filtra el reporte a eliminar
    const updatedReports = playerReportsList.filter(r => r.id !== reportToDelete.id);

    // Actualiza el estado general
    const newAllReports = {
      ...reports,
      [selectedPlayer.id]: updatedReports
    };

    setReports(newAllReports);
    saveReportsToLocalStorage(newAllReports);

    toast({
      title: "Informe Eliminado",
      description: `El informe del ${formatDate(reportToDelete.date)} ha sido eliminado.`,
      variant: "destructive", // Usamos 'destructive' para eliminaciones
    });

    // Si el informe borrado era el que estábamos viendo, volvemos al placeholder
    if (activeReportId === reportToDelete.id) {
      setActiveReportId(null);
      setIsCreatingReport(false);
    }
    
    setReportToDelete(null); // Cierra el modal de confirmación
  };
  // -------------------------------------------------------------

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

  const isReadOnly = !isCreatingReport; 
  const displayData = isCreatingReport ? newReportData : (viewingReport || INITIAL_FORM_DATA);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Seguimiento Nutricional</h2>
          <p className="text-gray-400">
            Viendo jugadores de {MOCK_CATEGORIES.find(c => c.id === localCategoryId)?.name || "N/A"}
          </p>
        </div>
        
        <div className="w-full sm:w-64">
            <Select value={localCategoryId} onValueChange={setLocalCategoryId}>
              <SelectTrigger className="w-full bg-[#1d2834] border-[#305176] text-white h-11">
                <div className="flex items-center">
                    <UsersIcon className="h-4 w-4 mr-2 text-gray-400" />
                    <SelectValue placeholder="Seleccionar categoría" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-[#213041] border-[#305176]">
                {MOCK_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id} className="text-white">
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
      </div>
      
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

      
      <Dialog open={showReportModal} onOpenChange={setShowReportModal}>
        {/* --- MODIFICACIÓN CLAVE PARA RESPONSIVE --- */}
        {/* max-h-[95vh] asegura que el modal quepa en la pantalla del móvil, y sm:max-w-4xl reduce el ancho. */}
        <DialogContent className="sm:max-w-4xl max-h-[95vh] lg:h-[90vh] overflow-y-auto bg-[#213041] border-[#305176] text-white flex flex-col">
          <DialogHeader className="pr-16"> 
            <DialogTitle className="text-white text-2xl font-bold">
              Gestión Nutricional: {selectedPlayer?.name}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {isCreatingReport 
                ? "Creando un nuevo informe..."
                : activeReportId
                  ? `Viendo informe del ${formatDate(viewingReport?.date || "")}`
                  : "Selecciona un informe o crea uno nuevo."
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-0">

            {/* Columna Izquierda: Historial */}
            {/* Se elimina h-full y overflow-hidden para móvil, se añaden en lg: */}
            <div className="md:col-span-1 flex flex-col lg:h-full bg-[#1d2834] rounded-lg p-4 lg:overflow-hidden min-h-0"> 
              <h3 className="text-lg font-semibold text-white mb-4">Historial de Informes</h3>
              <Button
                size="sm"
                className="w-full bg-[#aff606] text-black hover:bg-[#25d03f] mb-4"
                onClick={() => {
                  setActiveReportId(null);
                  setNewReportData({ ...INITIAL_FORM_DATA, date: new Date().toISOString().split('T')[0] });
                  setIsCreatingReport(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Informe
              </Button>
              <Separator className="bg-[#305176] mb-4" />
              <ScrollArea className="flex-1 pr-2">
                <div className="space-y-3">
                  {playerReports.length > 0 ? (
                    playerReports.map(report => (
                      // --- MODIFICADO: Contenedor flex y botón de basura ---
                      <div 
                        key={report.id} 
                        className={`flex items-center justify-between p-3 rounded-lg transition-colors group ${ // 'group' añadido
                          activeReportId === report.id && !isCreatingReport 
                            ? "bg-[#305176]"
                            : "bg-[#213041] hover:bg-[#305176]/50"
                        }`}
                      >
                        {/* Contenedor principal clickeable para ver */}
                        <div
                          className="flex-1 flex items-center space-x-3 overflow-hidden cursor-pointer"
                          onClick={() => {
                            setActiveReportId(report.id);
                            setIsCreatingReport(false);
                          }}
                        >
                          <Calendar className={`h-5 w-5 ${activeReportId === report.id && !isCreatingReport ? 'text-[#aff606]' : 'text-gray-400'}`} />
                          <div>
                            <p className="text-white font-medium">{formatDate(report.date)}</p>
                          </div>
                        </div>
                        {/* Botón de Borrar (Tacho de basura) */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-500 hover:text-red-500 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation(); // Evita que se active el onClick principal
                            setReportToDelete(report); // Abre el modal de confirmación
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      // --- FIN DE LA MODIFICACIÓN ---
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

            {/* Columna Derecha: Formulario (CON ARREGLO DE SCROLL) */}
            {/* Se elimina h-full y overflow-hidden para móvil, se añaden en lg: */}
            <div className="md:col-span-2 lg:h-full flex flex-col lg:overflow-hidden min-h-0"> 
              
              {!isCreatingReport && !activeReportId ? (
                // 1. VISTA PLACEHOLDER (NUEVA)
                <ReportPlaceholder onNewReportClick={() => {
                  setActiveReportId(null);
                  setNewReportData({ ...INITIAL_FORM_DATA, date: new Date().toISOString().split('T')[0] });
                  setIsCreatingReport(true);
                }} />
              ) : (
                // 2. VISTA DE FORMULARIO (Crear o Ver)
                <ScrollArea className="flex-1 pr-6"> 
                  <form className="space-y-6 p-1">
                    {/* --- Sección 1: Datos Antropométricos --- */}
                    <SectionTitle title="Datos Antropométricos" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <InputGroup label="Fecha del Informe" name="date" type="date" value={displayData.date} onChange={handleInputChange} readOnly={isReadOnly} />
                      <InputGroup label="Edad *" name="edad" type="number" placeholder="25" value={displayData.edad} onChange={handleInputChange} readOnly={isReadOnly} />
                      <InputGroup label="Altura (cm) *" name="altura" type="number" placeholder="180" value={displayData.altura} onChange={handleInputChange} readOnly={isReadOnly} />
                      <InputGroup label="Peso (kg) *" name="peso" type="number" placeholder="80.5" value={displayData.peso} onChange={handleInputChange} readOnly={isReadOnly} />
                      <InputGroup label="Sumatoria Pliegues (mm)" name="sumatoriaPliegues" type="number" placeholder="67" value={displayData.sumatoriaPliegues} onChange={handleInputChange} readOnly={isReadOnly} />
                      
                      <InputGroup 
                        label="IMC (auto)" 
                        name="imc" 
                        type="text" 
                        placeholder="24.8" 
                        value={displayData.imc} 
                        onChange={handleInputChange} 
                        readOnly={true} 
                      />
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
                        label="Objetivo Principal (Obligatorio) *" 
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
                    </div>
                    
                    {isCreatingReport && (
                      <div className="flex justify-end pt-4">
                        <Button className="bg-[#aff606] text-black hover:bg-[#25d03f]" onClick={handleSaveReport} type="button">
                          Guardar Informe
                        </Button>
                      </div>
                    )}
                  </form>
                </ScrollArea>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* --- MODIFICADO: AlertDialog para confirmar eliminación --- */}
      <AlertDialog open={!!reportToDelete} onOpenChange={() => setReportToDelete(null)}>
        <AlertDialogContent className="bg-[#213041] border-[#305176]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Confirmar Eliminación</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              ¿Estás seguro de que quieres eliminar el informe del 
              <span className="font-bold text-white"> {reportToDelete && formatDate(reportToDelete.date)}</span>?
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-[#305176] text-white hover:bg-[#305176]">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteReport}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* --- FIN DE LA MODIFICACIÓN --- */}

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

// Componente Placeholder
const ReportPlaceholder = ({ onNewReportClick }: { onNewReportClick: () => void }) => (
  <div className="flex flex-col items-center justify-center h-full bg-[#1d2834] rounded-lg p-10 text-center">
    <Apple className="h-16 w-16 text-gray-500 mb-4" />
    <h3 className="text-xl font-semibold text-white mb-2">Bienvenido a Nutrición</h3>
    <p className="text-gray-400 mb-6">Selecciona un informe del historial para verlo en detalle o crea uno nuevo.</p>
    <Button className="bg-[#aff606] text-black hover:bg-[#25d03f]" onClick={onNewReportClick}>
      <Plus className="h-4 w-4 mr-2" />
      Crear Nuevo Informe
    </Button>
  </div>
);


// Grupo de Input
const InputGroup = ({ label, name, value, onChange, readOnly, placeholder, type = "text" }: any) => (
  <div className="space-y-2">
    <Label htmlFor={name} className="text-white">{label}</Label> 
    <Input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      placeholder={placeholder}
      className="bg-[#1d2834] border-[#305176] text-white read-only:bg-[#1d2834]/60 read-only:cursor-default"
    />
  </div>
);

// Grupo de Textarea
const TextareaGroup = ({ label, name, value, onChange, readOnly, placeholder }: any) => (
  <div className="space-y-2">
    <Label htmlFor={name} className="text-white">{label}</Label>
    <Textarea
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      placeholder={placeholder}
      className="bg-[#1d2834] border-[#305176] text-white min-h-[100px] read-only:bg-[#1d2834]/60 read-only:cursor-default"
    />
  </div>
);

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