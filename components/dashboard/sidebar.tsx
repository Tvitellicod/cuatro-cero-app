"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { X, Home, Users, Dumbbell, Trophy, ChevronDown, ChevronRight, BarChart3, Apple } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const [expandedSections, setExpandedSections] = useState<string[]>(["club", "entrenamiento", "torneos"])

  // Obtener el perfil del usuario
  const savedProfile = typeof window !== "undefined" ? localStorage.getItem("userProfile") : null
  const profileData = savedProfile ? JSON.parse(savedProfile) : null

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
  }

  const getMenuItems = () => {
    const profileType = profileData?.profileType

    const baseItems = [
      {
        id: "inicio",
        label: "INICIO",
        icon: Home,
        href: "/dashboard",
        items: [],
        show: true,
      },
      {
        id: "club",
        label: "CLUB",
        icon: Users,
        href: "/dashboard/club",
        items: [
          { label: "Mi Club", href: "/dashboard/club" },
          { label: "Categorías", href: "/dashboard/club/categorias" },
          { label: "Jugadores", href: "/dashboard/club/jugadores" },
        ],
        show: true,
      },
    ]

    // ENTRENAMIENTO - No aparece para NUTRICIONISTA
    if (profileType !== "NUTRICIONISTA") {
      const trainingItems = []

      if (profileType === "DIRECTOR TECNICO") {
        trainingItems.push({ label: "Ejercicios", href: "/dashboard/entrenamiento/ejercicios" })
      }
      if (profileType === "PREPARADOR FISICO") {
        trainingItems.push({ label: "Ejercicios Físicos", href: "/dashboard/entrenamiento/ejercicios-fisicos" })
        trainingItems.push({
          label: "Ejercicios Kinesiología",
          href: "/dashboard/entrenamiento/ejercicios-kinesiologia",
        })
      }
      if (profileType === "KINESIOLOGO") {
        trainingItems.push({
          label: "Ejercicios Kinesiología",
          href: "/dashboard/entrenamiento/ejercicios-kinesiologia",
        })
      }

      trainingItems.push({ label: "Planificar Entrenamiento", href: "/dashboard/entrenamiento/planificar" })

      baseItems.push({
        id: "entrenamiento",
        label: "ENTRENAMIENTO",
        icon: Dumbbell,
        href: "/dashboard/entrenamiento",
        items: trainingItems,
        show: true,
      })
    }

    // TORNEOS (ex-PARTIDOS)
    baseItems.push({
      id: "torneos",
      label: "TORNEOS",
      icon: Trophy,
      href: "/dashboard/torneos",
      items: [
        { label: "Partidos", href: "/dashboard/torneos/partidos" },
        { label: "Próximos Partidos", href: "/dashboard/torneos/proximos" },
      ],
      show: true,
    })

    // ESTADÍSTICAS - Solo para DIRECTOR TECNICO y DIRECTIVO
    if (profileType === "DIRECTOR TECNICO" || profileType === "DIRECTIVO") {
      baseItems.push({
        id: "estadisticas",
        label: "ESTADÍSTICAS",
        icon: BarChart3,
        href: "/dashboard/estadisticas",
        items: [],
        show: true,
      })
    }

    // NUTRICIÓN - Solo para NUTRICIONISTA
    if (profileType === "NUTRICIONISTA") {
      baseItems.push({
        id: "nutricion",
        label: "NUTRICIÓN",
        icon: Apple,
        href: "/dashboard/nutricion",
        items: [],
        show: true,
      })
    }

    return baseItems.filter((item) => item.show)
  }

  const menuItems = getMenuItems()

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#213041] border-r border-[#305176] transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between p-4 border-b border-[#305176]">
          <img src="/images/cuatro-cero-logo.png" alt="CUATRO CERO" className="h-8 w-auto" />
          <Button variant="ghost" size="icon" className="lg:hidden text-white hover:text-[#aff606]" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <div key={item.id}>
              <div className="flex items-center">
                <Link
                  href={item.href}
                  className={`flex items-center flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? "bg-[#aff606] text-black"
                      : "text-white hover:bg-[#305176] hover:text-[#aff606]"
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.label}
                </Link>
                {item.items.length > 0 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-white hover:text-[#aff606]"
                    onClick={() => toggleSection(item.id)}
                  >
                    {expandedSections.includes(item.id) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </div>

              {/* Submenu */}
              {item.items.length > 0 && expandedSections.includes(item.id) && (
                <div className="ml-8 mt-2 space-y-1">
                  {item.items.map((subItem) => (
                    <Link
                      key={subItem.href}
                      href={subItem.href}
                      className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                        pathname === subItem.href
                          ? "bg-[#aff606] text-black"
                          : "text-gray-300 hover:bg-[#305176] hover:text-[#aff606]"
                      }`}
                    >
                      {subItem.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </>
  )
}
