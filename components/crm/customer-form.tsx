"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { formatCPF, formatPhone, formatCEP } from "@/lib/format-utils"
import { Search, CheckCircle } from "lucide-react"

interface CustomerFormProps {
  customer?: any
  onSubmit: (data: any) => void
  loading?: boolean
}

export function CustomerForm({ customer, onSubmit, loading }: CustomerFormProps) {
  const [formData, setFormData] = useState({
    email: customer?.email || "",
    cpf: customer?.cpf || "",
    name: customer?.name || "",
    phone: customer?.phone || "",
    cep: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
  })

  const [loadingCep, setLoadingCep] = useState(false)
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null)

  const handleChange = (field: string, value: string) => {
    if (field === "cpf") {
      value = formatCPF(value.replace(/\D/g, ""))
    } else if (field === "phone") {
      value = formatPhone(value.replace(/\D/g, ""))
    } else if (field === "cep") {
      value = formatCEP(value.replace(/\D/g, ""))
    }
    setFormData((prev) => ({ ...prev, [field]: value }))
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

  const handleSubmit = () => {
    const fullAddress = `${formData.street}${formData.number ? `, ${formData.number}` : ""}${formData.complement ? ` - ${formData.complement}` : ""}, ${formData.neighborhood}, ${formData.city} - ${formData.state}, CEP: ${formData.cep}`

    onSubmit({
      ...formData,
      address: fullAddress,
    })
  }

  const isFormValid = formData.name && formData.email && formData.cpf

  return (
    <Card className="bg-white/80 border-red-200">
      <CardHeader>
        <CardTitle>{customer ? "Editar Cliente" : "Novo Cliente"}</CardTitle>
        <CardDescription>Informações pessoais e de contato</CardDescription>
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Nome Completo</Label>
            <Input
              placeholder="João da Silva"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              disabled={loading}
            />
          </div>
          <div>
            <Label>E-mail</Label>
            <Input
              type="email"
              placeholder="joao@email.com"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>CPF</Label>
            <Input
              placeholder="123.456.789-00"
              value={formData.cpf}
              onChange={(e) => handleChange("cpf", e.target.value)}
              disabled={loading || !!customer}
            />
          </div>
          <div>
            <Label>Telefone</Label>
            <Input
              placeholder="(51) 99999-9999"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              disabled={loading}
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
                disabled={loading}
              />
            </div>
            <div className="flex items-end">
              <Button type="button" onClick={handleSearchCep} disabled={loadingCep || loading} variant="outline">
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
                disabled={loading}
              />
            </div>
            <div>
              <Label htmlFor="number">Número</Label>
              <Input
                id="number"
                name="number"
                value={formData.number}
                onChange={(e) => handleChange("number", e.target.value)}
                disabled={loading}
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
                disabled={loading}
              />
            </div>
            <div>
              <Label htmlFor="neighborhood">Bairro</Label>
              <Input
                id="neighborhood"
                name="neighborhood"
                value={formData.neighborhood}
                onChange={(e) => handleChange("neighborhood", e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={(e) => handleChange("city", e.target.value)}
                disabled={loading}
              />
            </div>
            <div>
              <Label htmlFor="state">Estado</Label>
              <Input
                id="state"
                name="state"
                value={formData.state}
                onChange={(e) => handleChange("state", e.target.value)}
                maxLength={2}
                disabled={loading}
              />
            </div>
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={loading || !isFormValid}
          className="w-full bg-red-600 hover:bg-red-700"
        >
          {loading ? "Salvando..." : customer ? "Atualizar Cliente" : "Cadastrar Cliente"}
        </Button>
      </CardContent>
    </Card>
  )
}
