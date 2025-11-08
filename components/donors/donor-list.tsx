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
      console.log("[v0] Fetching donors list...")
      const response = await fetch("/api/donors/list")
      const data = await response.json()
      console.log("[v0] Donors fetched:", data)
      setDonors(Array.isArray(data) ? data : [])
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
        <Card className="bg-red-900/25 backdrop-blur-md border-red-300/20">
          <CardContent className="py-8">
            <p className="text-red-50 text-center">Nenhum doador cadastrado</p>
          </CardContent>
        </Card>
      ) : (
        donors.map((donor: any) => (
          <Card
            key={donor.id}
            className="bg-red-900/25 backdrop-blur-md border-red-300/20 hover:bg-red-900/35 transition-colors"
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  {donor.type === "pessoa_juridica" ? (
                    <Building2 className="w-6 h-6 text-red-300" />
                  ) : (
                    <User className="w-6 h-6 text-red-300" />
                  )}
                  <div>
                    <CardTitle className="text-white">{donor.name}</CardTitle>
                    <p className="text-red-50/70 text-sm">{donor.cpf_cnpj}</p>
                  </div>
                </div>
                <Badge
                  className={
                    donor.status === "active"
                      ? "bg-green-600/80 backdrop-blur-sm"
                      : "bg-gray-600/80 backdrop-blur-sm text-white"
                  }
                >
                  {donor.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm text-red-50/90">
                <div>
                  <span className="text-red-50/60 font-semibold">Tipo:</span>{" "}
                  {donor.type === "pessoa_fisica"
                    ? "Pessoa Física"
                    : donor.type === "pessoa_juridica"
                      ? "Pessoa Jurídica"
                      : "Internacional"}
                </div>
                <div>
                  <span className="text-red-50/60 font-semibold">Cidade:</span> {donor.city || "N/A"}
                </div>
                <div>
                  <span className="text-red-50/60 font-semibold">Email:</span> {donor.email || "N/A"}
                </div>
                <div>
                  <span className="text-red-50/60 font-semibold">Telefone:</span> {donor.phone || "N/A"}
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
