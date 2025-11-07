"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DonorSelector } from "@/components/donation/donor-selector"
import { DonationForm } from "@/components/donation/donation-form"
import { formatCurrency, formatDate } from "@/lib/format-utils"

export default function DonationsPage() {
  const [selectedDonor, setSelectedDonor] = useState<string | null>(null)
  const [donations, setDonations] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadDonations()
  }, [])

  const loadDonations = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/donations/list")
      const data = await response.json()
      setDonations(data)
    } finally {
      setLoading(false)
    }
  }

  const handleDonationSubmit = async (items: any[]) => {
    if (!selectedDonor) return

    try {
      const response = await fetch("/api/donations/create-batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donor_id: selectedDonor,
          items,
        }),
      })
      const batch = await response.json()
      alert(`Lote criado com sucesso! Lote: ${batch.batch.batch_number}`)
      setSelectedDonor(null)
      loadDonations()
    } catch (error) {
      alert("Erro ao criar lote de doação")
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-red-600">Gestão de Doações</h1>
        <p className="text-gray-600">Entrada de Mercadorias - Triagem e Rastreabilidade</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <DonorSelector onDonorSelected={setSelectedDonor} />
          {selectedDonor && <DonationForm donorId={selectedDonor} onSubmit={handleDonationSubmit} />}
        </div>

        <div>
          <Card className="bg-white/80 border-red-200">
            <CardHeader>
              <CardTitle>Lotes Recentes</CardTitle>
              <CardDescription>Histórico de doações recebidas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {donations.slice(0, 5).map((batch) => (
                  <Card key={batch.id} className="bg-red-50 border-red-100 p-3">
                    <div className="text-sm font-semibold text-red-700">{batch.batch_number}</div>
                    <div className="text-xs text-gray-600">{formatDate(batch.created_at)}</div>
                    <div className="text-xs text-gray-600">{batch.total_items} itens</div>
                    <div className="text-xs font-semibold mt-1 text-red-600">
                      Total: {formatCurrency(batch.total_value || 0)}
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
