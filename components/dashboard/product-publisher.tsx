"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, BookOpen, Briefcase } from "lucide-react"
import { ProductForm } from "./product-form"
import { SponsorForm } from "./sponsor-form"

// Tipos de vista
type View = 'dashboard' | 'product_form' | 'sponsor_form';

export function ProductPublisher() {
  const [currentView, setCurrentView] = useState<View>('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'product_form':
        return <ProductForm onBack={() => setCurrentView('dashboard')} />;
      case 'sponsor_form':
        return <SponsorForm onBack={() => setCurrentView('dashboard')} />;
      case 'dashboard':
      default:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Gestión de Contenido</h2>
              <p className="text-gray-400">Selecciona el tipo de contenido que deseas publicar.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* CUADRADO 1: PUBLICAR PRODUCTOS (TIENDA) */}
              <Card className="bg-[#213041] border-[#305176] transition-all hover:ring-2 ring-[#33d9f6]">
                <CardHeader className="text-center">
                  <BookOpen className="h-10 w-10 text-[#33d9f6] mx-auto mb-2" />
                  <CardTitle className="text-white">Publicar Productos</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 mb-4 text-center">Ebooks, Pizarras y recursos digitales para la tienda.</p>
                  <Button 
                    className="w-full bg-[#33d9f6] text-black hover:bg-[#2bc4ea]"
                    onClick={() => setCurrentView('product_form')}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Crear Producto
                  </Button>
                </CardContent>
              </Card>

              {/* CUADRADO 2: PUBLICAR BANNERS (CARRUSEL) */}
              <Card className="bg-[#213041] border-[#305176] transition-all hover:ring-2 ring-[#f4c11a]">
                <CardHeader className="text-center">
                  <Briefcase className="h-10 w-10 text-[#f4c11a] mx-auto mb-2" />
                  <CardTitle className="text-white">Publicar Banners</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 mb-4 text-center">Banners y publicidad para la sección de patrocinadores.</p>
                  <Button 
                    className="w-full bg-[#f4c11a] text-black hover:bg-[#e0b018]"
                    onClick={() => setCurrentView('sponsor_form')}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Crear Banner
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        );
    }
  }

  return <div className="max-w-4xl mx-auto">{renderView()}</div>
}