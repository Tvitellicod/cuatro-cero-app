"use client"

import { toast } from "@/hooks/use-toast"

const STORAGE_KEY = "mock_integrated_ebook_exercises"

interface IntegratedExercise {
  id: string | number 
  name: string
  category: string
  duration: number
  players: number
  goalkeepers: number
  difficulty: string
  materials: string
  objective: string
  type: string
  createdBy: string
}

const generateMockExerciseFromEbook = (ebookName: string): IntegratedExercise => {
  const baseName = ebookName.replace('eBook:', '').trim();
  const id = `ebook-${Date.now()}-${Math.floor(Math.random() * 100)}`;

  return {
    id: id,
    name: `${baseName} - Reporte Metodológico`,
    category: "Biblioteca Ebook", // Categoría dedicada para los Ebooks
    duration: 35,
    players: 0,
    goalkeepers: 0,
    difficulty: "Fácil",
    materials: "Reporte Digital",
    objective: `Aplicación de la metodología de ${baseName} al plan de entrenamiento.`,
    type: "Ebook",
    createdBy: "CUATRO CERO",
  };
};

export function useMockIntegration() {
  
  const integrateEbooks = (ebooks: { id: number; name: string }[]) => {
    if (typeof window === 'undefined') return;

    const savedExercisesJson = localStorage.getItem(STORAGE_KEY);
    let existingExercises: IntegratedExercise[] = savedExercisesJson ? JSON.parse(savedExercisesJson) : [];
    
    let addedCount = 0;

    ebooks.forEach(ebook => {
      const mockId = `ebook-item-${ebook.id}`;
      if (!existingExercises.some(ex => ex.id === mockId)) {
        
        const newExercise = {
            ...generateMockExerciseFromEbook(ebook.name),
            id: mockId, 
        };

        existingExercises.push(newExercise);
        addedCount++;
      }
    });

    if (addedCount > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existingExercises));
      toast({
        title: "Integración Completa",
        description: `Se han añadido ${addedCount} Ebooks a tu Biblioteca de Ejercicios.`,
        variant: "default",
      });
    }

    return addedCount;
  };

  const getIntegratedExercises = (): IntegratedExercise[] => {
    if (typeof window === 'undefined') return [];
    const savedExercisesJson = localStorage.getItem(STORAGE_KEY);
    return savedExercisesJson ? JSON.parse(savedExercisesJson) : [];
  };
  
  const hasManagementService = (): boolean => {
      if (typeof window === 'undefined') return false;
      
      const profileJson = localStorage.getItem("userProfile");
      if (profileJson) {
          try {
              const profile = JSON.parse(profileJson);
              const allowedRoles = ["DIRECTOR TECNICO", "PREPARADOR FISICO", "KINESIOLOGO", "NUTRICIONISTA"];
              return allowedRoles.includes(profile.role); 
          } catch (e) {
              return false;
          }
      }
      return false;
  };

  return { integrateEbooks, getIntegratedExercises, hasManagementService };
}