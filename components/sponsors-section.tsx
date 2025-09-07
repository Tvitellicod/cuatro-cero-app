"use client"

import { useEffect, useState } from "react"

export function SponsorsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const sponsors = [
    { name: "Nike", image: "/placeholder.svg?height=120&width=1000&text=Nike" },
    { name: "Adidas", image: "/placeholder.svg?height=120&width=1000&text=Adidas" },
    { name: "Puma", image: "/placeholder.svg?height=120&width=1000&text=Puma" },
    { name: "Under Armour", image: "/placeholder.svg?height=120&width=1000&text=Under+Armour" },
    { name: "New Balance", image: "/placeholder.svg?height=120&width=1000&text=New+Balance" },
    { name: "Umbro", image: "/placeholder.svg?height=120&width=1000&text=Umbro" },
    { name: "Kappa", image: "/placeholder.svg?height=120&width=1000&text=Kappa" },
    { name: "Joma", image: "/placeholder.svg?height=120&width=1000&text=Joma" },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % sponsors.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [sponsors.length])

  return (
    <section className="py-4 bg-[#213041]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="h-64 md:h-80 bg-[#305176] rounded-lg overflow-hidden relative w-full">
          <img
            src={sponsors[currentIndex].image || "/placeholder.svg"}
            alt={sponsors[currentIndex].name}
            className="w-full h-full object-cover transition-all duration-1000 ease-in-out"
          />
        </div>
        <div className="flex justify-center mt-3 space-x-2">
          {sponsors.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? "bg-[#aff606]" : "bg-[#305176]"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
