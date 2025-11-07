"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface UserFormProps {
  roleToCreate: "admin" | "operator"
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
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
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
        setMessage({
          type: "success",
          text: `${roleToCreate === "admin" ? "Administrador" : "Operador"} criado com sucesso!`,
        })
        setTimeout(() => {
          onSuccess()
        }, 1500)
      } else {
        setMessage({
          type: "error",
          text: data.error || `Erro ao criar ${roleToCreate === "admin" ? "administrador" : "operador"}`,
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

      <div>
        <Label htmlFor="address">Endereço</Label>
        <Input
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Rua das Flores, 123"
        />
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
          {loading ? "Criando..." : `Criar ${roleToCreate === "admin" ? "Administrador" : "Operador"}`}
        </Button>
        <Button type="button" onClick={onCancel} variant="outline" className="flex-1 bg-transparent">
          Cancelar
        </Button>
      </div>
    </form>
  )
}
