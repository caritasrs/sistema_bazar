"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Client {
  id: string
  email: string
  name: string
  cpf: string
  role: string
  status: string
  phone?: string
  created_at: string
}

export function ClientList() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch("/api/clients/list")
        const data = await response.json()

        if (response.ok) {
          setClients(data.clients || [])
        } else {
          setError(data.error || "Erro ao carregar clientes")
        }
      } catch (error) {
        setError("Erro ao conectar ao servidor")
      } finally {
        setLoading(false)
      }
    }

    fetchClients()
  }, [])

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertDescription className="text-red-800">{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <Card className="border-red-200/30 bg-red-900/10 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-white">Clientes do Sistema ({clients.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {clients.length === 0 ? (
          <p className="text-white/70 text-center py-8">Nenhum cliente cadastrado</p>
        ) : (
          <div className="space-y-3">
            {clients.map((client) => (
              <div
                key={client.id}
                className="flex items-center justify-between p-4 border border-red-200/30 rounded-lg hover:bg-red-900/20 bg-red-900/5 backdrop-blur-sm"
              >
                <div className="flex-1">
                  <p className="font-semibold text-white">{client.name}</p>
                  <p className="text-sm text-white/80">{client.email}</p>
                  <p className="text-xs text-white/60">CPF: {client.cpf}</p>
                </div>
                <div className="text-right">
                  <p
                    className={`text-xs px-2 py-1 rounded ${client.status === "active" ? "bg-green-500/20 text-green-200" : "bg-red-500/20 text-red-200"}`}
                  >
                    {client.status === "active" ? "Ativo" : "Inativo"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
