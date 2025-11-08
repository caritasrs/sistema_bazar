"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Package } from "lucide-react"

interface Batch {
  id: string
  batch_code: string
  description: string
  received_date: string
  status: string
}

export default function BatchManagement() {
  const [batches, setBatches] = useState<Batch[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    batch_code: "",
    description: "",
    received_date: new Date().toISOString().split("T")[0],
    status: "active",
  })

  useEffect(() => {
    fetchBatches()
  }, [])

  const fetchBatches = async () => {
    try {
      const response = await fetch("/api/batches/list")
      const data = await response.json()
      setBatches(data.batches || [])
    } catch (error) {
      console.error("[v0] Error fetching batches:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/batches/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setIsCreating(false)
        setFormData({
          batch_code: "",
          description: "",
          received_date: new Date().toISOString().split("T")[0],
          status: "active",
        })
        fetchBatches()
      }
    } catch (error) {
      console.error("[v0] Error creating batch:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Lotes de Doação</h2>
        <Button onClick={() => setIsCreating(!isCreating)} className="bg-red-600 hover:bg-red-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Novo Lote
        </Button>
      </div>

      {isCreating && (
        <form
          onSubmit={handleSubmit}
          className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-red-300/20 space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-white">Código do Lote</Label>
              <Input
                value={formData.batch_code}
                onChange={(e) => setFormData({ ...formData, batch_code: e.target.value })}
                className="bg-white/10 border-red-300/20 text-white"
                placeholder="Ex: LOTE-2025-001"
                required
              />
            </div>
            <div>
              <Label className="text-white">Data de Recebimento</Label>
              <Input
                type="date"
                value={formData.received_date}
                onChange={(e) => setFormData({ ...formData, received_date: e.target.value })}
                className="bg-white/10 border-red-300/20 text-white"
                required
              />
            </div>
          </div>
          <div>
            <Label className="text-white">Descrição</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-white/10 border-red-300/20 text-white"
              placeholder="Descreva o conteúdo deste lote..."
              rows={3}
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white">
              Criar Lote
            </Button>
            <Button
              type="button"
              onClick={() => setIsCreating(false)}
              variant="outline"
              className="border-red-300/20 text-white hover:bg-white/10"
            >
              Cancelar
            </Button>
          </div>
        </form>
      )}

      <div className="grid gap-4">
        {batches.map((batch) => (
          <div
            key={batch.id}
            className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-red-300/20 hover:border-red-300/40 transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-red-600/20 rounded-lg">
                  <Package className="h-5 w-5 text-red-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{batch.batch_code}</h3>
                  <p className="text-sm text-red-100">{batch.description}</p>
                  <p className="text-xs text-red-200 mt-1">
                    Recebido em: {new Date(batch.received_date).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-green-500/20 text-green-300 text-xs rounded-full">
                  {batch.status === "active" ? "Ativo" : "Inativo"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
