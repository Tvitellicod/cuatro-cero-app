"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useMemo } from "react"

interface LegalModalProps {
  type: 'terms' | 'privacy' | null
  isOpen: boolean
  onClose: () => void
}

const LEGAL_CONTENT = {
  terms: {
    title: "Términos y Condiciones del Servicio",
    date: "Última actualización: 22 de Octubre de 2025",
    sections: [
      {
        heading: "1. Aceptación de Términos",
        text: "Al acceder o utilizar la plataforma CUATRO CERO, usted acepta estar sujeto a estos Términos y Condiciones. Si no está de acuerdo con alguna parte de los términos, no podrá acceder al servicio. Estos términos se aplican a todos los visitantes, usuarios y otras personas que acceden o utilizan el Servicio."
      },
      {
        heading: "2. Uso del Servicio",
        text: "CUATRO CERO proporciona herramientas de gestión y análisis deportivo. Usted se compromete a utilizar la plataforma únicamente para fines lícitos relacionados con la gestión de su equipo de fútbol. Está prohibida la distribución, venta o modificación del contenido y ejercicios generados por la plataforma."
      },
      {
        heading: "3. Suscripciones y Pagos",
        text: "El acceso a ciertas funciones del Servicio requiere un pago recurrente ('Suscripción'). Las Suscripciones se facturan por adelantado de forma mensual o anual. Todos los pagos no son reembolsables, excepto cuando lo exija la ley aplicable."
      },
      {
        heading: "4. Contenido Digital (Ebooks y Pizarras)",
        text: "Los productos digitales adquiridos (Ebooks y Pizarras) son para uso interno exclusivo del club o cuerpo técnico que los adquiere. Se otorga una licencia de uso limitada, no transferible ni exclusiva. La reventa o redistribución está estrictamente prohibida."
      },
      {
        heading: "5. Terminación",
        text: "Podemos terminar o suspender su cuenta de inmediato, sin previo aviso ni responsabilidad, por cualquier motivo, incluyendo, sin limitación, si usted incumple los Términos."
      },
      {
        heading: "6. Jurisdicción Aplicable",
        text: "Estos Términos se regirán e interpretarán de acuerdo con las leyes de la República Argentina, sin tener en cuenta sus disposiciones sobre conflicto de leyes."
      },
    ]
  },
  privacy: {
    title: "Política de Privacidad",
    date: "Última actualización: 22 de Octubre de 2025",
    sections: [
      {
        heading: "1. Información que Recopilamos",
        text: "Recopilamos información de identificación personal ('Datos Personales'), incluyendo, pero no limitado a: Nombre, dirección de correo electrónico, y datos específicos de gestión deportiva (nombres de jugadores, estadísticas de rendimiento, datos de entrenamiento)."
      },
      {
        heading: "2. Uso de Datos",
        text: "CUATRO CERO utiliza los datos recopilados para proporcionar, mantener y mejorar el Servicio; gestionar su cuenta y suscripción; y comunicar actualizaciones importantes. Nunca compartimos sus estadísticas detalladas de rendimiento ni la información de sus jugadores con terceros, excepto con su consentimiento expreso o si es requerido por ley."
      },
      {
        heading: "3. Seguridad de Datos",
        text: "La seguridad de sus datos es importante para nosotros. Nos esforzamos por utilizar medios comercialmente aceptables para proteger sus Datos Personales, incluyendo cifrado y autenticación de dos factores. Sin embargo, ningún método de transmisión por Internet o almacenamiento electrónico es 100% seguro."
      },
      {
        heading: "4. Proveedores de Servicios",
        text: "Podemos emplear empresas e individuos de terceros para facilitar nuestro Servicio ('Proveedores de Servicios'), incluyendo proveedores de hosting y pasarelas de pago. Estos terceros tienen acceso a sus Datos Personales solo para realizar estas tareas en nuestro nombre y están obligados a no divulgarlos ni utilizarlos para ningún otro propósito."
      },
      {
        heading: "5. Sus Derechos de Privacidad",
        text: "Usted tiene derecho a acceder, actualizar o eliminar la información que tenemos sobre usted. Si desea ejercer cualquiera de estos derechos, contáctenos utilizando la información de contacto proporcionada en la sección 'Contacto'."
      },
    ]
  }
}

export function LegalModal({ type, isOpen, onClose }: LegalModalProps) {
  
  const content = useMemo(() => {
    return type === 'terms' ? LEGAL_CONTENT.terms : LEGAL_CONTENT.privacy;
  }, [type]);
  
  const formattedTitle = type === 'terms' ? 'Términos y Condiciones' : 'Política de Privacidad';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        // CLASES MODIFICADAS: Aseguramos que el Dialog ocupe casi toda la pantalla en móvil (w-full)
        // y usamos h-full/max-h-[90vh] para que quepa en pantallas pequeñas.
        className="w-full max-w-xl sm:max-w-3xl bg-[#213041] border-[#305176] text-white flex flex-col p-0 h-full max-h-[90vh] sm:h-auto sm:max-h-[90vh]"
      >
        <DialogHeader className="p-6 pb-2 flex-shrink-0">
          <DialogTitle className="text-white text-2xl font-bold">{content.title}</DialogTitle>
          <DialogDescription className="text-gray-400 text-sm">
            {content.date}
          </DialogDescription>
        </DialogHeader>

        {/* Mantenemos el ScrollArea como flex-grow para que se ajuste a la altura restante */}
        <ScrollArea className="flex-1 px-6 py-4 min-h-[50vh]"> 
          <div className="pr-4 space-y-6">
            {content.sections.map((section, index) => (
              <div key={index}>
                {/* Título de sección con ajuste de línea */}
                <h3 className="text-[#aff606] font-semibold text-lg mb-2 break-words">{section.heading}</h3>
                {/* Contenido con ajuste de línea */}
                <p className="text-gray-300 text-sm break-words">{section.text}</p>
              </div>
            ))}
            
            <Separator className="bg-[#305176]" />
            
            <p className="text-gray-500 text-xs text-center pb-2">
              Si tiene alguna pregunta sobre {formattedTitle}, contáctenos a info@cuatrocero.com.
            </p>
          </div>
        </ScrollArea>
        
      </DialogContent>
    </Dialog>
  )
}