"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DonorSelectorProps {
  onDonorSelected: (donorId: string) => void
  onNewDonor?: (donor: any) => void
}

export function DonorSelector({ onDonorSelected, onNewDonor }: DonorSelectorProps) {
  const [mode, setMode] = useState<"select" | "create">("select")
  const [type, setType] = useState("pessoa_fisica")
  const [formData, setFormData] = useState({
    name: "",
    cpf_cnpj: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "Brasil",
  })
  const [loading, setLoading] = useState(false)

  const handleCreateDonor = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/donors/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, ...formData }),
      })
      const donor = await response.json()
      if (onNewDonor) onNewDonor(donor)
      onDonorSelected(donor.id)
      setFormData({
        name: "",
        cpf_cnpj: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        country: "Brasil",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-white/80 border-red-200">
      <CardHeader>
        <CardTitle>Doador</CardTitle>
        <CardDescription>Selecione ou cadastre um novo doador</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button
            variant={mode === "select" ? "default" : "outline"}
            onClick={() => setMode("select")}
            className={mode === "select" ? "bg-red-600" : ""}
          >
            Selecionar Doador
          </Button>
          <Button
            variant={mode === "create" ? "default" : "outline"}
            onClick={() => setMode("create")}
            className={mode === "create" ? "bg-red-600" : ""}
          >
            Novo Doador
          </Button>
        </div>

        {mode === "create" && (
          <div className="space-y-4">
            <div>
              <Label>Tipo de Doador</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pessoa_fisica">Pessoa Física</SelectItem>
                  <SelectItem value="pessoa_juridica">Pessoa Jurídica</SelectItem>
                  <SelectItem value="international">Internacional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nome/Razão Social</Label>
                <Input
                  placeholder="Ex: João Silva"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <Label>{type === "pessoa_fisica" ? "CPF" : "CNPJ"}</Label>
                <Input
                  placeholder="000.000.000-00"
                  value={formData.cpf_cnpj}
                  onChange={(e) => setFormData({ ...formData, cpf_cnpj: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>E-mail</Label>
                <Input
                  type="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <Label>Telefone</Label>
                <Input
                  placeholder="(51) 99999-9999"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label>Endereço</Label>
              <Input
                placeholder="Rua, número, complemento"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Cidade</Label>
                <Input
                  placeholder="Porto Alegre"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
              <div>
                <Label>Estado</Label>
                <Input
                  placeholder="RS"
                  value={formData.state}
                  maxLength={2}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                />
              </div>
              <div>
                <Label>País</Label>
                <Input
                  placeholder="Brasil"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                />
              </div>
            </div>

            <Button
              onClick={handleCreateDonor}
              disabled={loading || !formData.name || !formData.cpf_cnpj}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              {loading ? "Cadastrando..." : "Cadastrar Doador"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
