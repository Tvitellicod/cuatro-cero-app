// lib/limits.ts

/**
 * Define las claves de los planes utilizados en la aplicación.
 */
export type PlanKey = "tecnico" | "cuerpo_tecnico" | "institucional" | "publicador";

/**
 * Define las cuentas de prueba para el Modo Demo.
 * Las direcciones de correo se han acortado para coincidir con la UI.
 */
export const DEMO_ACCOUNTS: Record<string, { email: string; password: string; plan: PlanKey; role: string }> = {
  // Plan Básico
  tecnico: {
    email: "tecnico@4c.com", // <-- CORREGIDO
    password: "pass123",
    plan: "tecnico",
    role: "DIRECTOR TECNICO",
  },
  // Plan Intermedio
  cuerpo_tecnico: {
    email: "cuerpo@4c.com", // <-- CORREGIDO
    password: "pass123",
    plan: "cuerpo_tecnico",
    role: "PREPARADOR FISICO",
  },
  // Plan Ilimitado
  institucional: {
    email: "institucional@4c.com", // <-- CORREGIDO
    password: "pass123",
    plan: "institucional",
    role: "DIRECTIVO",
  },
  // Cuenta Publicador 
  publicador: {
    email: "cuatrocero@gmail.com",
    password: "Chata202",
    plan: "publicador",
    role: "PUBLICADOR",
  },
};


/**
 * Define los límites de uso por cada plan.
 * MAX_PLAYERS es el total de jugadores que pueden crearse en todas las categorías.
 * MAX_CATEGORIES es el total de categorías que pueden crearse.
 * MAX_EXERCISES_OWNED es el total de ejercicios que pueden crear.
 */
export const PLAN_LIMITS: Record<PlanKey, {
  MAX_PLAYERS: number;
  MAX_CATEGORIES: number;
  MAX_EXERCISES_OWNED: number;
}> = {
  tecnico: {
    MAX_PLAYERS: 25,
    MAX_CATEGORIES: 1, // Limita a solo una categoría (la que crean/seleccionan al inicio)
    MAX_EXERCISES_OWNED: 30,
  },
  cuerpo_tecnico: {
    MAX_PLAYERS: 75,
    MAX_CATEGORIES: 3,
    MAX_EXERCISES_OWNED: 100,
  },
  institucional: {
    MAX_PLAYERS: Infinity, // Ilimitado
    MAX_CATEGORIES: Infinity, // Ilimitado
    MAX_EXERCISES_OWNED: Infinity, // Ilimitado
  },
  publicador: {
     MAX_PLAYERS: Infinity, // No aplica, pero se pone alto
     MAX_CATEGORIES: Infinity,
     MAX_EXERCISES_OWNED: Infinity,
  }
};

/**
 * Función helper para obtener los límites de un plan.
 * @param planKey La clave del plan del usuario.
 * @returns Los límites correspondientes.
 */
export const getLimits = (planKey: PlanKey | string): typeof PLAN_LIMITS[PlanKey] => {
  if (planKey in PLAN_LIMITS) {
    return PLAN_LIMITS[planKey as PlanKey];
  }
  // Valor por defecto si el plan no se encuentra (ej: modo desarrollo sin plan asignado)
  return PLAN_LIMITS.tecnico;
};