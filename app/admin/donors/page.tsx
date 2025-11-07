"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatDate } from "@/lib/format-utils"

export default function DonorsPage() {
  const [donors, setDonors] = useState<any[]>([])
  const [selectedDonor, setSelectedDonor] = useState<any>(null)
  const [traceability, setTraceability] = useState<any>(null)
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadDonors()
  }, [search])

  const loadDonors = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.append("search", search)

      const response = await fetch(`/api/donors/list?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setDonors(data)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSelectDonor = async (donor: any) => {
    setSelectedDonor(donor)
    setLoading(true)
    try {
      const response = await fetch(`/api/donors/get-traceability?id=${donor.id}`)
      if (response.ok) {
        setTraceability(await response.json())
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-red-600">Rastreabilidade de Doadores</h1>
        <p className="text-gray-600">Transparência completa na origem e destino das doações</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <Card className="bg-white/80 border-red-200">
            <CardHeader>
              <CardTitle>Buscar Doador</CardTitle>
            </CardHeader>
            <CardContent>
              <Input placeholder="Nome ou CPF/CNPJ" value={search} onChange={(e) => setSearch(e.target.value)} />
            </CardContent>
          </Card>

          <Card className="bg-white/80 border-red-200">
            <CardHeader>
              <CardTitle>Lista de Doadores</CardTitle>
              <CardDescription>{donors.length} doador(es)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {donors.map((donor) => (
                  <Card
                    key={donor.id}
                    className={`bg-red-50 border-red-100 p-3 cursor-pointer hover:bg-red-100 ${
                      selectedDonor?.id === donor.id ? "ring-2 ring-red-600" : ""
                    }`}
                    onClick={() => handleSelectDonor(donor)}
                  >
                    <div className="font-semibold text-red-700">{donor.name}</div>
                    <div className="text-xs text-gray-600">
                      {donor.type === "pessoa_fisica" ? "CPF" : "CNPJ"}: {donor.cpf_cnpj}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {donor.city}, {donor.state} {donor.country !== "Brasil" && `- ${donor.country}`}
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          {selectedDonor && traceability && (
            <Card className="bg-white/80 border-red-200 sticky top-4">
              <CardHeader>
                <CardTitle>{selectedDonor.name}</CardTitle>
                <CardDescription>Rastreabilidade Completa</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs text-gray-600">Tipo</Label>
                  <div className="font-semibold">
                    {selectedDonor.type === "pessoa_fisica" ? "Pessoa Física" : "Pessoa Jurídica"}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-gray-600">E-mail</Label>
                  <div className="text-sm">{selectedDonor.email || "N/A"}</div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-gray-600">Telefone</Label>
                  <div className="text-sm">{selectedDonor.phone || "N/A"}</div>
                </div>

                <div className="border-t border-red-200 pt-4">
                  <Label className="text-xs font-semibold">Estatísticas</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="bg-red-50 p-2 rounded">
                      <div className="text-xs text-gray-600">Total Itens</div>
                      <div className="font-bold text-red-600">{traceability.statistics.total_items}</div>
                    </div>
                    <div className="bg-green-50 p-2 rounded">
                      <div className="text-xs text-gray-600">Vendidos</div>
                      <div className="font-bold text-green-600">{traceability.statistics.sold_items}</div>
                    </div>
                  </div>
                  <div className="mt-2 bg-blue-50 p-2 rounded">
                    <div className="text-xs text-gray-600">Taxa de Venda</div>
                    <div className="font-bold text-blue-600">{traceability.statistics.sale_rate}%</div>
                  </div>
                </div>

                <div className="border-t border-red-200 pt-4">
                  <Label className="text-xs font-semibold">Lotes de Doação</Label>
                  <div className="space-y-1 mt-2">
                    {traceability.batches.map((batch: any) => (
                      <Card key={batch.id} className="bg-red-50 border-red-100 p-2">
                        <div className="text-xs font-semibold">{batch.batch_number}</div>
                        <div className="text-xs text-gray-600">
                          {batch.items.length} itens | {formatDate(batch.created_at)}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
