"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { formatCPF } from "@/lib/format-utils"

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
    address: customer?.address || "",
  })

  const handleChange = (field: string, value: string) => {
    if (field === "cpf") {
      value = formatCPF(value.replace(/\D/g, ""))
    }
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    onSubmit(formData)
  }

  const isFormValid = formData.name && formData.email && formData.cpf

  return (
    <Card className="bg-white/80 border-red-200">
      <CardHeader>
        <CardTitle>{customer ? "Editar Cliente" : "Novo Cliente"}</CardTitle>
        <CardDescription>Informações pessoais e de contato</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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

        <div>
          <Label>Endereço</Label>
          <Textarea
            placeholder="Rua, número, complemento, cidade, estado"
            value={formData.address}
            onChange={(e) => handleChange("address", e.target.value)}
            disabled={loading}
            rows={3}
          />
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
