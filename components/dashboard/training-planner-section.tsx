"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Calendar, Clock, Target, PieChart, Users, X, Check, Search, Trash2, Edit, Eye } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

// Función de ayuda para obtener la fecha y hora actual predeterminada
const getInitialDateTime = () => {
  const now = new Date();
  
  // Formato YYYY-MM-DD para input type="date"
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const dateString = `${year}-${month}-${day}`;
  
  // Formato HH:MM para input type="time"
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const timeString = `${hours}:${minutes}`;

  return { date: dateString, time: timeString };
};

export function TrainingPlannerSection() {
  const [showPlannerForm, setShowPlannerForm] = useState(false)
  const [selectedExercises, setSelectedExercises] = useState<any[]>([])
  const [showTrainingDetail, setShowTrainingDetail] = useState<any>(null)
  const [showAttendance, setShowAttendance] = useState(false)
  // attendance: Guarda { playerId: true } si el jugador está AUSENTE
  const [attendance, setAttendance] = useState<Record<number, boolean>>({})
  const [showValidationAlert, setShowValidationAlert] = useState(false)
  const [trainingToDelete, setTrainingToDelete] = useState<number | null>(null)
  const [showExerciseDetail, setShowExerciseDetail] = useState<any>(null)
  
  // NUEVOS ESTADOS PARA NOTAS/DESCANSOS
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [newNote, setNewNote] = useState({
    type: 'note', // Distinguir del tipo 'exercise'
    name: '', // Título
    description: '',
    duration: 0, // Tiempo en minutos
    id: 0, // Placeholder, se inicializará con Date.now()
  });


  const [newTraining, setNewTraining] = useState(() => {
    const initialDateTime = getInitialDateTime();
    return {
      name: "",
      date: initialDateTime.date,
      time: initialDateTime.time,
      category: "",
    }
  });