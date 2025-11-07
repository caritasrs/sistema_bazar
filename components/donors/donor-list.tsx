"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, User } from "lucide-react"

export function DonorList() {
  const [donors, setDonors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDonors()
  }, [])

  const fetchDonors = async () => {
    try {
      const response = await fetch("/api/donors/list")
      const data = await response.json()
      setDonors(data.donors || [])
    } catch (error) {
      console.error("[v0] Error fetching donors:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-white text-center py-8">Carregando doadores...</div>
  }

  return (
    <div className="grid gap-4">
      {donors.length === 0 ? (
        <Card className="bg-red-900/10 backdrop-blur-md border-red-800/30">
          <CardContent className="py-8">
            <p className="text-white/70 text-center">Nenhum doador cadastrado</p>
          </CardContent>
        </Card>
      ) : (
        donors.map((donor: any) => (
          <Card key={donor.id} className="bg-red-900/10 backdrop-blur-md border-red-800/30">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  {donor.type === "pessoa_juridica" ? (
                    <Building2 className="w-6 h-6 text-red-400" />
                  ) : (
                    <User className="w-6 h-6 text-red-400" />
                  )}
                  <div>
                    <CardTitle className="text-white">{donor.name}</CardTitle>
                    <p className="text-white/70 text-sm">{donor.cpf_cnpj}</p>
                  </div>
                </div>
                <Badge className={donor.status === "active" ? "bg-green-600" : "bg-gray-600"}>{donor.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm text-white/80">
                <div>
                  <span className="text-white/60">Tipo:</span>{" "}
                  {donor.type === "pessoa_fisica"
                    ? "Pessoa Física"
                    : donor.type === "pessoa_juridica"
                      ? "Pessoa Jurídica"
                      : "Internacional"}
                </div>
                <div>
                  <span className="text-white/60">Cidade:</span> {donor.city || "N/A"}
                </div>
                <div>
                  <span className="text-white/60">Email:</span> {donor.email || "N/A"}
                </div>
                <div>
                  <span className="text-white/60">Telefone:</span> {donor.phone || "N/A"}
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
