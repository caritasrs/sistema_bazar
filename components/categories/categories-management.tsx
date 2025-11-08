"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Package, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface Category {
  id: string
  name: string
  description: string
  status: string
  products?: string[]
}

export function CategoriesManagement() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    products: "",
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories/list")
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error("[v0] Error fetching categories:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      ...formData,
      products: formData.products.split("\n").filter((p) => p.trim()),
    }

    try {
      const url = editingId ? `/api/categories/update/${editingId}` : "/api/categories/create"
      const method = editingId ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        fetchCategories()
        resetForm()
      }
    } catch (error) {
      console.error("[v0] Error saving category:", error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta categoria?")) return

    try {
      await fetch(`/api/categories/delete/${id}`, { method: "DELETE" })
      fetchCategories()
    } catch (error) {
      console.error("[v0] Error deleting category:", error)
    }
  }

  const handleEdit = (category: Category) => {
    setEditingId(category.id)
    setFormData({
      name: category.name,
      description: category.description || "",
      products: category.products?.join("\n") || "",
    })
    setIsAdding(true)
  }

  const resetForm = () => {
    setFormData({ name: "", description: "", products: "" })
    setIsAdding(false)
    setEditingId(null)
  }

  return (
    <div className="space-y-6">
      <div className="bg-red-900/25 backdrop-blur-md border border-red-300/20 rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Categorias Cadastradas</h2>
          <Button onClick={() => setIsAdding(!isAdding)} className="bg-red-600 hover:bg-red-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Nova Categoria
          </Button>
        </div>

        {isAdding && (
          <form
            onSubmit={handleSubmit}
            className="bg-white/10 backdrop-blur-sm border border-red-300/20 rounded-lg p-6 mb-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4">
              {editingId ? "Editar Categoria" : "Nova Categoria"}
            </h3>

            <div className="space-y-4">
              <div>
                <Label className="text-white font-semibold">Nome da Categoria</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-white/10 border-red-300/30 text-white placeholder:text-white/50"
                  placeholder="Ex: Roupas Femininas"
                  required
                />
              </div>

              <div>
                <Label className="text-white font-semibold">Descrição</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-white/10 border-red-300/30 text-white placeholder:text-white/50"
                  placeholder="Descreva a categoria"
                  rows={2}
                />
              </div>

              <div>
                <Label className="text-white font-semibold">Produtos Típicos (um por linha)</Label>
                <Textarea
                  value={formData.products}
                  onChange={(e) => setFormData({ ...formData, products: e.target.value })}
                  className="bg-white/10 border-red-300/30 text-white placeholder:text-white/50"
                  placeholder="Blusa&#10;Calça&#10;Vestido"
                  rows={6}
                />
                <p className="text-red-100 text-xs mt-1">Lista de produtos comuns nesta categoria para auto-complete</p>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white">
                  {editingId ? "Atualizar" : "Criar"} Categoria
                </Button>
                <Button
                  type="button"
                  onClick={resetForm}
                  variant="outline"
                  className="border-red-300/30 text-white hover:bg-white/10 bg-transparent"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </form>
        )}

        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="bg-white/10 backdrop-blur-sm border border-red-300/20 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <Package className="h-5 w-5 text-red-300" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{category.name}</h3>
                    {category.description && <p className="text-red-100 text-sm">{category.description}</p>}
                    {category.products && category.products.length > 0 && (
                      <p className="text-red-200 text-xs mt-1">{category.products.length} produtos cadastrados</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setExpandedId(expandedId === category.id ? null : category.id)}
                    className="text-white hover:bg-white/10"
                  >
                    {expandedId === category.id ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(category)}
                    className="text-white hover:bg-white/10"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(category.id)}
                    className="text-red-300 hover:bg-red-800/30"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {expandedId === category.id && category.products && category.products.length > 0 && (
                <div className="mt-4 pt-4 border-t border-red-300/20">
                  <h4 className="text-sm font-semibold text-white mb-2">Produtos desta categoria:</h4>
                  <div className="flex flex-wrap gap-2">
                    {category.products.map((product, idx) => (
                      <span key={idx} className="px-3 py-1 bg-red-800/30 text-red-100 text-xs rounded-full">
                        {product}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
