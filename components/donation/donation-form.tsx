"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DonationItem {
  description: string
  category_id: string
  size: string
  condition: string
  symbolic_value: number
  origin: string
}

interface DonationFormProps {
  donorId: string
  onSubmit: (items: DonationItem[]) => void
}

export function DonationForm({ donorId, onSubmit }: DonationFormProps) {
  const [items, setItems] = useState<DonationItem[]>([
    {
      description: "",
      category_id: "",
      size: "",
      condition: "bom",
      symbolic_value: 0,
      origin: "Local",
    },
  ])
  const [loading, setLoading] = useState(false)

  const addItem = () => {
    setItems([
      ...items,
      {
        description: "",
        category_id: "",
        size: "",
        condition: "bom",
        symbolic_value: 0,
        origin: "Local",
      },
    ])
  }

  const updateItem = (index: number, field: string, value: any) => {
    const updated = [...items]
    updated[index] = { ...updated[index], [field]: value }
    setItems(updated)
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await onSubmit(items)
      setItems([
        {
          description: "",
          category_id: "",
          size: "",
          condition: "bom",
          symbolic_value: 0,
          origin: "Local",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <Card key={index} className="bg-white/80 border-red-200">
          <CardHeader>
            <CardTitle className="text-lg">Item {index + 1}</CardTitle>
            <CardDescription>Descrição e especificações do produto</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Descrição</Label>
                <Input
                  placeholder="Ex: Camisa Polo Masculina"
                  value={item.description}
                  onChange={(e) => updateItem(index, "description", e.target.value)}
                />
              </div>
              <div>
                <Label>Tamanho</Label>
                <Input
                  placeholder="Ex: P, M, G, GG"
                  value={item.size}
                  onChange={(e) => updateItem(index, "size", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Condição</Label>
                <Select value={item.condition} onValueChange={(value) => updateItem(index, "condition", value)}>
                  <SelectTrigger>
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
                <Label>Valor Simbólico (R$)</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={item.symbolic_value}
                  onChange={(e) => updateItem(index, "symbolic_value", Number.parseFloat(e.target.value))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Origem</Label>
                <Select value={item.origin} onValueChange={(value) => updateItem(index, "origin", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Renner">Renner</SelectItem>
                    <SelectItem value="Alemanha">Alemanha</SelectItem>
                    <SelectItem value="Local">Local</SelectItem>
                    <SelectItem value="Campanha">Campanha</SelectItem>
                    <SelectItem value="Doador">Doador Pessoa Física</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Categoria</Label>
                <Select value={item.category_id} onValueChange={(value) => updateItem(index, "category_id", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cat-1">Roupas</SelectItem>
                    <SelectItem value="cat-2">Calçados</SelectItem>
                    <SelectItem value="cat-3">Acessórios</SelectItem>
                    <SelectItem value="cat-4">Artigos Diversos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {items.length > 1 && (
              <Button variant="destructive" onClick={() => removeItem(index)} className="w-full">
                Remover Item
              </Button>
            )}
          </CardContent>
        </Card>
      ))}

      <Button onClick={addItem} variant="outline" className="w-full bg-transparent">
        + Adicionar Item
      </Button>

      <Button
        onClick={handleSubmit}
        disabled={loading || items.some((i) => !i.description || !i.category_id)}
        className="w-full bg-red-600 hover:bg-red-700"
      >
        {loading ? "Processando..." : "Registrar Lote de Doação"}
      </Button>
    </div>
  )
}
