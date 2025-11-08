"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { formatCPF, formatCNPJ, formatPhone, formatCEP, validateCPF, validateCNPJ } from "@/lib/format-utils"
import { Search, CheckCircle } from "lucide-react"

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
    cep: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    country: "Brasil",
  })
  const [loading, setLoading] = useState(false)
  const [loadingCep, setLoadingCep] = useState(false)
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null)

  const handleChange = (name: string, value: string) => {
    if (name === "cpf_cnpj") {
      const numbers = value.replace(/\D/g, "")
      if (type === "pessoa_fisica") {
        value = formatCPF(numbers)
      } else if (type === "pessoa_juridica") {
        value = formatCNPJ(numbers)
      }
    } else if (name === "phone") {
      value = formatPhone(value.replace(/\D/g, ""))
    } else if (name === "cep") {
      value = formatCEP(value.replace(/\D/g, ""))
    }
    setFormData({ ...formData, [name]: value })
  }

  const handleSearchCep = async () => {
    const cep = formData.cep.replace(/\D/g, "")
    if (cep.length !== 8) {
      setMessage({ type: "error", text: "CEP deve ter 8 dígitos" })
      return
    }

    setLoadingCep(true)
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
      const data = await response.json()

      if (!data.erro) {
        setFormData({
          ...formData,
          street: data.logradouro || "",
          neighborhood: data.bairro || "",
          city: data.localidade || "",
          state: data.uf || "",
        })
        setMessage({ type: "success", text: "CEP encontrado!" })
      } else {
        setMessage({ type: "error", text: "CEP não encontrado" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Erro ao buscar CEP" })
    } finally {
      setLoadingCep(false)
    }
  }

  const handleCreateDonor = async () => {
    if (type === "pessoa_fisica" && formData.cpf_cnpj && !validateCPF(formData.cpf_cnpj)) {
      setMessage({ type: "error", text: "CPF inválido" })
      return
    }
    if (type === "pessoa_juridica" && formData.cpf_cnpj && !validateCNPJ(formData.cpf_cnpj)) {
      setMessage({ type: "error", text: "CNPJ inválido" })
      return
    }

    setLoading(true)
    try {
      const fullAddress = `${formData.street}${formData.number ? `, ${formData.number}` : ""}${formData.complement ? ` - ${formData.complement}` : ""}, ${formData.neighborhood}, ${formData.city} - ${formData.state}, CEP: ${formData.cep}`

      const response = await fetch("/api/donors/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          name: formData.name,
          cpf_cnpj: formData.cpf_cnpj.replace(/\D/g, ""),
          email: formData.email,
          phone: formData.phone.replace(/\D/g, ""),
          address: fullAddress,
          city: formData.city,
          state: formData.state,
          country: formData.country,
        }),
      })
      const donor = await response.json()
      if (onNewDonor) onNewDonor(donor)
      onDonorSelected(donor.id)
      setFormData({
        name: "",
        cpf_cnpj: "",
        email: "",
        phone: "",
        cep: "",
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
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
        {message && (
          <Alert
            className={`border-2 ${
              message.type === "error" ? "border-red-500 bg-red-50" : "border-green-500 bg-green-50"
            }`}
          >
            <AlertDescription
              className={`font-medium flex items-center gap-2 ${
                message.type === "error" ? "text-red-900" : "text-green-900"
              }`}
            >
              {message.type === "success" && <CheckCircle className="w-5 h-5" />}
              {message.text}
            </AlertDescription>
          </Alert>
        )}

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
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              </div>
              <div>
                <Label>{type === "pessoa_fisica" ? "CPF" : "CNPJ"}</Label>
                <Input
                  placeholder={type === "pessoa_fisica" ? "000.000.000-00" : "00.000.000/0000-00"}
                  value={formData.cpf_cnpj}
                  onChange={(e) => handleChange("cpf_cnpj", e.target.value)}
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
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </div>
              <div>
                <Label>Telefone</Label>
                <Input
                  placeholder="(51) 99999-9999"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4 border-t pt-4">
              <h4 className="font-medium">Endereço</h4>

              <div className="flex gap-2">
                <div className="flex-1">
                  <Label htmlFor="cep">CEP</Label>
                  <Input
                    id="cep"
                    name="cep"
                    value={formData.cep}
                    onChange={(e) => handleChange("cep", e.target.value)}
                    placeholder="00000-000"
                    maxLength={9}
                  />
                </div>
                <div className="flex items-end">
                  <Button type="button" onClick={handleSearchCep} disabled={loadingCep} variant="outline">
                    <Search className="w-4 h-4 mr-2" />
                    {loadingCep ? "Buscando..." : "Buscar"}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-[1fr_120px] gap-4">
                <div>
                  <Label htmlFor="street">Rua</Label>
                  <Input
                    id="street"
                    name="street"
                    value={formData.street}
                    onChange={(e) => handleChange("street", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="number">Número</Label>
                  <Input
                    id="number"
                    name="number"
                    value={formData.number}
                    onChange={(e) => handleChange("number", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="complement">Complemento</Label>
                  <Input
                    id="complement"
                    name="complement"
                    value={formData.complement}
                    onChange={(e) => handleChange("complement", e.target.value)}
                    placeholder="Apto, sala, etc."
                  />
                </div>
                <div>
                  <Label htmlFor="neighborhood">Bairro</Label>
                  <Input
                    id="neighborhood"
                    name="neighborhood"
                    value={formData.neighborhood}
                    onChange={(e) => handleChange("neighborhood", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="state">Estado</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    maxLength={2}
                    onChange={(e) => handleChange("state", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="country">País</Label>
                  <Input
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={(e) => handleChange("country", e.target.value)}
                  />
                </div>
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
