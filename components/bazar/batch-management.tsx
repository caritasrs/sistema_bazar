"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"

export function BatchManagement() {
  const [batches, setBatches] = useState<any[]>([])
  const [donors, setDonors] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    donor_id: "",
    notes_url: "",
  })

  useEffect(() => {
    fetchBatches()
    fetchDonors()
  }, [])

  const fetchBatches = async () => {
    const response = await fetch("/api/bazar/batches")
    const data = await response.json()
    setBatches(data)
  }

  const fetchDonors = async () => {
    const response = await fetch("/api/bazar/donors")
    const data = await response.json()
    setDonors(data)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch("/api/bazar/batches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const result = await response.json()
      if (result.success) {
        alert("Lote criado com sucesso!")
        setShowForm(false)
        fetchBatches()
        setFormData({ donor_id: "", notes_url: "" })
      }
    } catch (error) {
      alert("Erro ao criar lote")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Lotes de Doações</h2>
        <Button onClick={() => setShowForm(!showForm)} className="bg-red-700 hover:bg-red-800 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Novo Lote
        </Button>
      </div>

      {showForm && (
        <Card className="p-6 bg-red-900/10 backdrop-blur-md border-red-300/20">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="donor" className="text-white">
                Doador *
              </Label>
              <select
                id="donor"
                value={formData.donor_id}
                onChange={(e) => setFormData({ ...formData, donor_id: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-white/90 text-gray-900 border border-gray-300"
                required
              >
                <option value="">Selecione um doador</option>
                {donors.map((donor) => (
                  <option key={donor.id} value={donor.id}>
                    {donor.name} - {donor.type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="notes" className="text-white">
                URL da Nota Fiscal / Documentos
              </Label>
              <Input
                id="notes"
                type="url"
                value={formData.notes_url}
                onChange={(e) => setFormData({ ...formData, notes_url: e.target.value })}
                placeholder="https://..."
                className="bg-white/90 text-gray-900"
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="bg-red-700 hover:bg-red-800 text-white">
                Criar Lote
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
                className="border-red-300/30 text-white hover:bg-red-900/30"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {batches.map((batch) => (
          <Card key={batch.id} className="p-4 bg-red-900/10 backdrop-blur-md border-red-300/20">
            <div className="flex justify-between items-start mb-3">
              <Badge className={batch.status === "open" ? "bg-green-500" : "bg-gray-500"}>
                {batch.status === "open" ? "Aberto" : "Fechado"}
              </Badge>
              <span className="text-white/70 text-sm">{batch.batch_number}</span>
            </div>

            <h3 className="text-white font-medium mb-2">{batch.donor_name}</h3>

            <div className="space-y-1 text-sm text-white/80">
              <p>Itens: {batch.total_items || 0}</p>
              <p>Valor Total: R$ {Number.parseFloat(batch.total_value || 0).toFixed(2)}</p>
              <p className="text-xs text-white/60">Criado em: {new Date(batch.created_at).toLocaleDateString()}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
