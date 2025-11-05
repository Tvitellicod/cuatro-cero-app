// components/dashboard/configuration-modal.tsx

"use client"

import * as React from "react"
import { Settings } from "lucide-react" // Se mantiene Settings importado aunque no se use en el título por si se usa en otro lado.
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

import { ProfileSettingsForm } from "./profile-settings-form"
import { CategorySettingsForm } from "./category-settings-form"


// Modificación clave: Aseguramos que el children pueda ser usado como trigger.
export function ConfigurationModal({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger> 
      <DialogContent className="bg-[#213041] border-[#305176] text-white sm:max-w-[425px]">
        <DialogHeader>
          {/* [MODIFICADO] Eliminado el ícono Settings del título del modal */}
          <DialogTitle className="text-white text-xl flex items-center">
            Configuración del Espacio
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-[#1d2834]">
                <TabsTrigger value="profile" className="text-white data-[state=active]:bg-[#aff606] data-[state=active]:text-black">
                    Editar Perfil
                </TabsTrigger>
                <TabsTrigger value="category" className="text-white data-[state=active]:bg-[#aff606] data-[state=active]:text-black">
                    Editar Categoría
                </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="mt-4">
                <ProfileSettingsForm />
            </TabsContent>
            
            <TabsContent value="category" className="mt-4">
                <CategorySettingsForm />
            </TabsContent>
        </Tabs>

      </DialogContent>
    </Dialog>
  )
}