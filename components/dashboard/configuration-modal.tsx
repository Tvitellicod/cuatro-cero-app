// components/dashboard/configuration-modal.tsx

"use client"

import * as React from "react"
import { Settings } from "lucide-react"
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


export function ConfigurationModal() {
  const [isOpen, setIsOpen] = React.useState(false);
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white hover:bg-[#305176] hover:text-[#aff606] transition-colors"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#213041] border-[#305176] text-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-white text-xl flex items-center">
            <Settings className="h-5 w-5 mr-2 text-[#aff606]" />
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