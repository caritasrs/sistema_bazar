"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CustomerForm } from "@/components/crm/customer-form"
import { CustomerList } from "@/components/crm/customer-list"
import { CustomerHistory } from "@/components/crm/customer-history"

type ViewMode = "list" | "create" | "edit" | "history"

export default function CRMPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSelectCustomer = (customer: any) => {
    setSelectedCustomer(customer)
    setViewMode("history")
  }

  const handleFormSubmit = async (formData: any) => {
    setLoading(true)
    try {
      const method = selectedCustomer ? "PUT" : "POST"
      const endpoint = selectedCustomer ? "/api/crm/update-customer" : "/api/crm/create-customer"

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedCustomer?.id,
          ...formData,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error)
      }

      const customer = await response.json()
      setMessage({
        type: "success",
        text: selectedCustomer ? "Cliente atualizado" : "Cliente criado com sucesso",
      })
      setViewMode("list")
      setSelectedCustomer(null)
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Erro ao salvar cliente",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-red-600">CRM Solidário</h1>
        <p className="text-gray-600">Gestão de Clientes e Relacionamento</p>
      </div>

      {message && (
        <Card className={message.type === "error" ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}>
          <CardContent className={`pt-6 ${message.type === "error" ? "text-red-800" : "text-green-800"}`}>
            {message.text}
          </CardContent>
        </Card>
      )}

      <div className="flex gap-2 mb-4">
        <Button
          variant={viewMode === "list" ? "default" : "outline"}
          onClick={() => setViewMode("list")}
          className={viewMode === "list" ? "bg-red-600" : ""}
        >
          Lista de Clientes
        </Button>
        <Button
          variant={viewMode === "create" ? "default" : "outline"}
          onClick={() => {
            setViewMode("create")
            setSelectedCustomer(null)
          }}
          className={viewMode === "create" ? "bg-red-600" : ""}
        >
          Novo Cliente
        </Button>
      </div>

      {viewMode === "list" && <CustomerList onSelectCustomer={handleSelectCustomer} />}

      {viewMode === "create" && <CustomerForm onSubmit={handleFormSubmit} loading={loading} />}

      {viewMode === "edit" && selectedCustomer && (
        <CustomerForm customer={selectedCustomer} onSubmit={handleFormSubmit} loading={loading} />
      )}

      {viewMode === "history" && selectedCustomer && (
        <CustomerHistory customerId={selectedCustomer.id} customerName={selectedCustomer.name} />
      )}
    </div>
  )
}
