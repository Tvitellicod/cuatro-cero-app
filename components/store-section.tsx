"use client"

import { useState } from "react"
// Eliminada importación de Check y uso de estado local de addedItems
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/hooks/use-cart" // <-- AÑADIDO

export function StoreSection() {
  const [activeTab, setActiveTab] = useState("pizarras")
  // Eliminado el estado 'addedItems' ya que el contexto y el toast lo manejan
  
  const { addItemToCart } = useCart() // <-- USANDO EL HOOK

  const pizarras = [
    {
      id: 1,
      name: "Ejercicios de Ataque Posicional",
      price: "$15.99",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 2,
      name: "Defensa en Zona",
      price: "$12.99",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 3,
      name: "Transiciones Ofensivas",
      price: "$18.99",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 4,
      name: "Jugadas a Balón Parado",
      price: "$14.99",
      image: "/placeholder.svg?height=200&width=300",
    },
  ]

  const ebooks = [
    {
      id: 5, // Asegurando ID único en toda la tienda
      name: "Metodología de Entrenamiento Moderno",
      price: "$29.99",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 6,
      name: "Táctica y Estrategia Futbolística",
      price: "$24.99",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 7,
      name: "Preparación Física en el Fútbol",
      price: "$22.99",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 8,
      name: "Psicología Deportiva Aplicada",
      price: "$19.99",
      image: "/placeholder.svg?height=200&width=300",
    },
  ]

  const currentProducts = activeTab === "pizarras" ? pizarras : ebooks

  // Lógica simplificada: Llama al hook que maneja el estado y el toast.
  const handleAddToCart = (product: any) => {
    addItemToCart(product)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 my-2">
      <div className="text-center mb-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">Tienda</h1>
        <p className="text-lg md:text-xl text-gray-300 px-2">
          Recursos profesionales para mejorar tu metodología de entrenamiento
        </p>
      </div>

      {/* Botones separados */}
      <div className="flex justify-center mb-4 gap-4">
        <Button
          variant={activeTab === "pizarras" ? "default" : "outline"}
          className={`px-8 py-2 rounded-lg ${
            activeTab === "pizarras"
              ? "bg-[#aff606] text-black hover:bg-[#25d03f]"
              : "border-[#aff606] text-[#aff606] hover:bg-[#aff606] hover:text-black bg-transparent"
          }`}
          onClick={() => setActiveTab("pizarras")}
        >
          Pizarras
        </Button>
        <Button
          variant={activeTab === "ebooks" ? "default" : "outline"}
          className={`px-8 py-2 rounded-lg ${
            activeTab === "ebooks"
              ? "bg-[#aff606] text-black hover:bg-[#25d03f]"
              : "border-[#aff606] text-[#aff606] hover:bg-[#aff606] hover:text-black bg-transparent"
          }`}
          onClick={() => setActiveTab("ebooks")}
        >
          eBooks
        </Button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {currentProducts.map((product) => (
          <Card key={product.id} className="bg-[#213041] border-[#305176] overflow-hidden flex flex-col p-0">
            {/* Imagen que se estira desde el inicio de la card */}
            <div className="aspect-video bg-[#305176] relative">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <Badge className="absolute top-1 right-1 bg-[#aff606] text-black text-xs">Nuevo</Badge>
            </div>

            {/* Contenido con padding exacto de 4px */}
            <CardContent className="p-1 flex-1 flex flex-col">
              <div className="flex-1 flex flex-col px-2">
                <h3 className="text-sm md:text-lg font-semibold text-white mb-1 line-clamp-2 min-h-[2rem] md:min-h-[2.5rem]">
                  {product.name}
                </h3>

                {/* Precio y botón con mínimo 4px del título y 4px del final */}
                <div className="flex items-center justify-between mt-1 mb-1">
                  <span className="text-lg md:text-2xl font-bold text-[#aff606]">{product.price}</span>
                  <Button
                    size="sm"
                    className="text-xs md:text-sm bg-[#aff606] text-black hover:bg-[#25d03f] hover:scale-105 transition-all duration-300 transform"
                    onClick={() => handleAddToCart(product)} // <-- LLAMADA AL NUEVO HOOK
                  >
                    <ShoppingCart className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                    Agregar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}