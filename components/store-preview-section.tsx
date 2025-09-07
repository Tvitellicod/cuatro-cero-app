"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, BookOpen } from "lucide-react"

export function StorePreviewSection() {
  const [currentPlantilla, setCurrentPlantilla] = useState(0)
  const [currentEbook, setCurrentEbook] = useState(0)

  const plantillas = [
    { name: "Ejercicios de Ataque Posicional", image: "/placeholder.svg?height=200&width=300&text=Ataque+Posicional" },
    { name: "Defensa en Zona", image: "/placeholder.svg?height=200&width=300&text=Defensa+Zona" },
    { name: "Transiciones Ofensivas", image: "/placeholder.svg?height=200&width=300&text=Transiciones" },
    { name: "Jugadas a Balón Parado", image: "/placeholder.svg?height=200&width=300&text=Balón+Parado" },
  ]

  const ebooks = [
    { name: "Metodología de Entrenamiento Moderno", image: "/placeholder.svg?height=200&width=300&text=Metodología" },
    { name: "Táctica y Estrategia Futbolística", image: "/placeholder.svg?height=200&width=300&text=Táctica" },
    { name: "Preparación Física en el Fútbol", image: "/placeholder.svg?height=200&width=300&text=Preparación+Física" },
    { name: "Psicología Deportiva Aplicada", image: "/placeholder.svg?height=200&width=300&text=Psicología" },
  ]

  useEffect(() => {
    const plantillaInterval = setInterval(() => {
      setCurrentPlantilla((prev) => (prev + 1) % plantillas.length)
    }, 5000)

    const ebookInterval = setInterval(() => {
      setCurrentEbook((prev) => (prev + 1) % ebooks.length)
    }, 5000)

    return () => {
      clearInterval(plantillaInterval)
      clearInterval(ebookInterval)
    }
  }, [plantillas.length, ebooks.length])

  return (
    <section className="px-4 bg-[#213041] py-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 mt-2.5">Visita Nuestra Tienda</h2>
          <p className="text-lg md:text-xl text-gray-300 px-2 mb-0">
            Plantillas y eBooks para mejorar tu metodología de entrenamiento
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
          <Card className="bg-[#1d2834] border-[#305176] mb-0 mt-2.5">
  <CardContent className="p-4 text-center py-4">
    <FileText className="h-12 w-12 md:h-16 md:w-16 text-[#aff606] mx-auto mb-2" />
    <h3 className="text-xl md:text-2xl font-bold text-white mb-3">Plantillas</h3>
    <p className="text-gray-400 mb-3">Pizarras y ejercicios prediseñados</p>

    <div className="mb-3 relative">
      {/* Contenedor con formato rotado, más alto y border radius 10px */}
      <div className="h-[258px] md:h-[313px] rounded-[10px] overflow-hidden flex items-center justify-center">
        <div className="w-full h-full rotate-90 bg-[#305176] flex items-center justify-center">
          {/* Imagen contrarotada para que se vea normal */}
          <img
            src={plantillas[currentPlantilla].image || "/placeholder.svg"}
            alt={plantillas[currentPlantilla].name}
            className="-rotate-90 max-w-full max-h-full object-contain"
          />
        </div>
      </div>

      <p className="text-white font-medium mt-2 min-h-[3rem] flex items-center justify-center">
        {plantillas[currentPlantilla].name}
      </p>
      <div className="flex justify-center mt-2 space-x-1">
        {plantillas.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentPlantilla ? "bg-[#aff606]" : "bg-[#305176]"
            }`}
          />
        ))}
      </div>
    </div>

    <Link href="/tienda">
      <Button className="bg-[#aff606] text-black hover:bg-[#25d03f] w-full sm:w-auto mx-0 mt-4">
        Ver Plantillas
      </Button>
    </Link>
  </CardContent>
</Card>


          <Card className="bg-[#1d2834] border-[#305176] mt-2.5">
  <CardContent className="p-4 text-center">
    <BookOpen className="h-12 w-12 md:h-16 md:w-16 text-[#aff606] mx-auto mb-2" />
    <h3 className="text-xl md:text-2xl font-bold text-white mb-3">eBooks</h3>
    <p className="text-gray-400 mb-3">
      Guías completas sobre metodología y táctica futbolística
    </p>

    <div className="mb-3 relative">
      {/* Contenedor con formato rotado, más alto y border radius 10px */}
      <div className="h-[258px] md:h-[313px] rounded-[10px] overflow-hidden flex items-center justify-center">
        <div className="w-full h-full rotate-90 bg-[#305176] flex items-center justify-center">
          {/* Imagen contrarotada para que se vea normal */}
          <img
            src={ebooks[currentEbook].image || "/placeholder.svg"}
            alt={ebooks[currentEbook].name}
            className="-rotate-90 max-w-full max-h-full object-contain"
          />
        </div>
      </div>

      <p className="text-white font-medium mt-2 min-h-[3rem] flex items-center justify-center">
        {ebooks[currentEbook].name}
      </p>
      <div className="flex justify-center mt-2 space-x-1">
        {ebooks.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentEbook ? "bg-[#aff606]" : "bg-[#305176]"
            }`}
          />
        ))}
      </div>
    </div>

    <Link href="/tienda">
      <Button className="bg-[#aff606] text-black hover:bg-[#25d03f] w-full sm:w-auto mt-4">
        Ver eBooks
      </Button>
    </Link>
  </CardContent>
</Card>

        </div>
      </div>
    </section>
  )
}
