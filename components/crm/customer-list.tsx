"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatDate } from "@/lib/format-utils"

interface Customer {
  id: string
  name: string
  email: string
  cpf: string
  phone?: string
  created_at: string
}

interface CustomerListProps {
  onSelectCustomer: (customer: Customer) => void
}

export function CustomerList({ onSelectCustomer }: CustomerListProps) {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)

  useEffect(() => {
    loadCustomers()
  }, [page])

  const loadCustomers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.append("search", search)
      params.append("page", page.toString())

      const response = await fetch(`/api/crm/list-customers?${params.toString()}`)
      const data = await response.json()
      setCustomers(data.customers || [])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  return (
    <Card className="bg-white/80 border-red-200">
      <CardHeader>
        <CardTitle>Lista de Clientes</CardTitle>
        <CardDescription>Clientes registrados no sistema</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Buscar Cliente</Label>
          <Input placeholder="Nome, email ou CPF" value={search} onChange={(e) => handleSearch(e.target.value)} />
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {customers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {loading ? "Carregando..." : "Nenhum cliente encontrado"}
            </div>
          ) : (
            customers.map((customer) => (
              <Card
                key={customer.id}
                className="bg-red-50 border-red-100 p-3 cursor-pointer hover:bg-red-100"
                onClick={() => onSelectCustomer(customer)}
              >
                <div className="font-semibold text-red-700">{customer.name}</div>
                <div className="text-xs text-gray-600">{customer.email}</div>
                <div className="text-xs text-gray-600">CPF: {customer.cpf}</div>
                <div className="text-xs text-gray-500">Cadastro: {formatDate(customer.created_at)}</div>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
