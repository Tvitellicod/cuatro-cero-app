"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2 } from "lucide-react"

export function CategoriesManagement() {
  const [categories, setCategories] = useState([
    { id: 1, name: "Primera División", playerCount: 25, color: "#aff606" },
    { id: 2, name: "Tercera División", playerCount: 18, color: "#33d9f6" },
    { id: 3, name: "Juveniles", playerCount: 22, color: "#f4c11a" },
  ])

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newCategory, setNewCategory] = useState({ name: "", color: "#aff606" })

  const colors = [
    "#aff606",
    "#33d9f6",
    "#f4c11a",
    "#ea3498",
    "#25d03f",
    "#8a46c5",
    "#ff6b35",
    "#4ecdc4",
    "#45b7d1",
    "#96ceb4",
  ]

  const handleCreateCategory = () => {
    if (newCategory.name.trim()) {
      const newCat = {
        id: categories.length + 1,
        name: newCategory.name,
        playerCount: 0,
        color: newCategory.color,
      }
      setCategories([...categories, newCat])
      setNewCategory({ name: "", color: "#aff606" })
      setShowCreateForm(false)
    }
  }

  const handleDeleteCategory = (id: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta categoría?")) {
      setCategories(categories.filter((cat) => cat.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Categorías</h2>
          <p className="text-gray-400">Gestiona las categorías del club</p>
        </div>
        <Button
          className="bg-[#aff606] text-black hover:bg-[#25d03f]"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nueva Categoría
        </Button>
      </div>

      {/* Create Category Form */}
      {showCreateForm && (
        <Card className="bg-[#213041] border-[#305176]">
          <CardHeader>
            <CardTitle className="text-white">Nueva Categoría</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category-name" className="text-white">
                Nombre de la Categoría
              </Label>
              <Input
                id="category-name"
                placeholder="Ej: Cuarta División"
                className="bg-[#1d2834] border-[#305176] text-white"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Color de la Categoría</Label>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded-full border-2 ${
                      newCategory.color === color ? "border-white" : "border-gray-500"
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setNewCategory({ ...newCategory, color })}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                className="border-[#305176] text-white hover:bg-[#305176] bg-transparent"
                onClick={() => setShowCreateForm(false)}
              >
                Cancelar
              </Button>
              <Button className="bg-[#aff606] text-black hover:bg-[#25d03f]" onClick={handleCreateCategory}>
                Crear Categoría
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Categories List */}
      <Card className="bg-[#213041] border-[#305176]">
        <CardHeader>
          <CardTitle className="text-white">Categorías del Club</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between p-4 bg-[#1d2834] rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-6 h-6 rounded-full" style={{ backgroundColor: category.color }}></div>
                  <div>
                    <h3 className="text-white font-medium">{category.name}</h3>
                    <p className="text-gray-400 text-sm">{category.playerCount} jugadores</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-[#aff606] text-black">
                    Activa
                  </Badge>
                  <Button variant="ghost" size="icon" className="text-white hover:text-[#aff606]">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:text-red-400"
                    onClick={() => handleDeleteCategory(category.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
