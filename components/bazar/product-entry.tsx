"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"

export function ProductEntry() {
  const [batches, setBatches] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [formData, setFormData] = useState({
    batch_id: "",
    category_id: "",
    description: "",
    size: "",
    condition: "bom",
    symbolic_value: "",
    origin: "",
  })

  useEffect(() => {
    fetchBatches()
    fetchCategories()
  }, [])

  const fetchBatches = async () => {
    const response = await fetch("/api/bazar/batches?status=open")
    const data = await response.json()
    setBatches(data)
  }

  const fetchCategories = async () => {
    const response = await fetch("/api/bazar/categories")
    const data = await response.json()
    setCategories(data)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch("/api/bazar/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const result = await response.json()
      if (result.success) {
        alert(`Item cadastrado! QR Code: ${result.qr_code}`)
        // Imprimir etiqueta
        window.open(`/labels/${result.qr_code}`, "_blank")
        // Resetar formulário
        setFormData({
          batch_id: formData.batch_id,
          category_id: "",
          description: "",
          size: "",
          condition: "bom",
          symbolic_value: "",
          origin: "",
        })
      }
    } catch (error) {
      alert("Erro ao cadastrar item")
    }
  }

  return (
    <Card className="p-6 bg-red-900/10 backdrop-blur-md border-red-300/20">
      <h2 className="text-2xl font-bold text-white mb-6">Entrada de Mercadorias</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="batch" className="text-white">
              Lote de Doação *
            </Label>
            <Select
              value={formData.batch_id}
              onValueChange={(value) => setFormData({ ...formData, batch_id: value })}
              required
            >
              <SelectTrigger className="bg-white/90 text-gray-900">
                <SelectValue placeholder="Selecione um lote" />
              </SelectTrigger>
              <SelectContent>
                {batches.map((batch) => (
                  <SelectItem key={batch.id} value={batch.id}>
                    {batch.batch_number} - {batch.donor_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="category" className="text-white">
              Categoria *
            </Label>
            <Select
              value={formData.category_id}
              onValueChange={(value) => setFormData({ ...formData, category_id: value })}
              required
            >
              <SelectTrigger className="bg-white/90 text-gray-900">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="description" className="text-white">
              Descrição *
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Ex: Camisa polo azul marinho"
              className="bg-white/90 text-gray-900"
              required
            />
          </div>

          <div>
            <Label htmlFor="size" className="text-white">
              Tamanho
            </Label>
            <Input
              id="size"
              value={formData.size}
              onChange={(e) => setFormData({ ...formData, size: e.target.value })}
              placeholder="Ex: M, GG, 42"
              className="bg-white/90 text-gray-900"
            />
          </div>

          <div>
            <Label htmlFor="condition" className="text-white">
              Condição *
            </Label>
            <Select
              value={formData.condition}
              onValueChange={(value) => setFormData({ ...formData, condition: value })}
              required
            >
              <SelectTrigger className="bg-white/90 text-gray-900">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="novo">Novo</SelectItem>
                <SelectItem value="muito_bom">Muito Bom</SelectItem>
                <SelectItem value="bom">Bom</SelectItem>
                <SelectItem value="usado">Usado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="value" className="text-white">
              Valor Simbólico (R$) *
            </Label>
            <Input
              id="value"
              type="number"
              step="0.01"
              value={formData.symbolic_value}
              onChange={(e) => setFormData({ ...formData, symbolic_value: e.target.value })}
              placeholder="0.00"
              className="bg-white/90 text-gray-900"
              required
            />
          </div>

          <div>
            <Label htmlFor="origin" className="text-white">
              Origem
            </Label>
            <Input
              id="origin"
              value={formData.origin}
              onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
              placeholder="Ex: Renner, Alemanha, Local"
              className="bg-white/90 text-gray-900"
            />
          </div>
        </div>

        <Button type="submit" className="w-full bg-red-700 hover:bg-red-800 text-white py-6 text-lg">
          <Plus className="h-5 w-5 mr-2" />
          Cadastrar e Gerar QR Code
        </Button>
      </form>
    </Card>
  )
}
