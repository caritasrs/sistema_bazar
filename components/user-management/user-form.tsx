"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface UserFormProps {
  roleToCreate: "admin" | "operator" | "client"
  onSuccess: () => void
  onCancel: () => void
}

export function UserForm({ roleToCreate, onSuccess, onCancel }: UserFormProps) {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    cpf: "",
    password: "",
    phone: "",
    address: "",
    cep: "",
    street: "",
    neighborhood: "",
    city: "",
    state: "",
  })
  const [loading, setLoading] = useState(false)
  const [loadingCep, setLoadingCep] = useState(false)
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleCepBlur = async () => {
    const cep = formData.cep.replace(/\D/g, "")
    if (cep.length !== 8) return

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
          address: `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`,
        })
      } else {
        setMessage({ type: "error", text: "CEP não encontrado" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Erro ao buscar CEP" })
    } finally {
      setLoadingCep(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch("/api/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, role: roleToCreate }),
      })

      const data = await response.json()

      if (response.ok) {
        const roleLabel =
          roleToCreate === "admin" ? "Administrador" : roleToCreate === "operator" ? "Operador" : "Cliente"
        setMessage({
          type: "success",
          text: `${roleLabel} criado com sucesso!`,
        })
        setTimeout(() => {
          onSuccess()
        }, 1500)
      } else {
        const roleLabel =
          roleToCreate === "admin" ? "administrador" : roleToCreate === "operator" ? "operador" : "cliente"
        setMessage({
          type: "error",
          text: data.error || `Erro ao criar ${roleLabel}`,
        })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Erro ao conectar ao servidor" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && (
        <Alert className={message.type === "error" ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}>
          <AlertDescription className={message.type === "error" ? "text-red-800" : "text-green-800"}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nome Completo</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="João Silva"
            required
          />
        </div>
        <div>
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="joao@caritas.org.br"
            required
          />
        </div>
        <div>
          <Label htmlFor="cpf">CPF</Label>
          <Input
            id="cpf"
            name="cpf"
            value={formData.cpf}
            onChange={handleChange}
            placeholder="123.456.789-00"
            required
          />
        </div>
        <div>
          <Label htmlFor="phone">Telefone</Label>
          <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="(51) 98765-4321" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="cep">CEP</Label>
          <Input
            id="cep"
            name="cep"
            value={formData.cep}
            onChange={handleChange}
            onBlur={handleCepBlur}
            placeholder="00000-000"
            maxLength={9}
          />
          {loadingCep && <p className="text-xs text-gray-500 mt-1">Buscando endereço...</p>}
        </div>
        <div className="col-span-2">
          <Label htmlFor="street">Rua</Label>
          <Input
            id="street"
            name="street"
            value={formData.street}
            onChange={handleChange}
            placeholder="Rua das Flores"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="neighborhood">Bairro</Label>
          <Input
            id="neighborhood"
            name="neighborhood"
            value={formData.neighborhood}
            onChange={handleChange}
            placeholder="Centro"
          />
        </div>
        <div>
          <Label htmlFor="city">Cidade</Label>
          <Input id="city" name="city" value={formData.city} onChange={handleChange} placeholder="Porto Alegre" />
        </div>
        <div>
          <Label htmlFor="state">Estado</Label>
          <Input
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="RS"
            maxLength={2}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="password">Senha (12+ caracteres, maiúscula, minúscula, número e caractere especial)</Label>
        <Input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Caritas@2025Admin!"
          required
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={loading} className="flex-1 bg-red-600 hover:bg-red-700">
          {loading
            ? "Criando..."
            : `Criar ${roleToCreate === "admin" ? "Administrador" : roleToCreate === "operator" ? "Operador" : "Cliente"}`}
        </Button>
        <Button type="button" onClick={onCancel} variant="outline" className="flex-1 bg-transparent">
          Cancelar
        </Button>
      </div>
    </form>
  )
}
