"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserPlus, Calendar } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

interface SelfRegisteredClient {
  id: string
  name: string
  email: string
  cpf: string
  phone: string
  created_at: string
}

export function SelfRegisteredClientsWidget() {
  const [clients, setClients] = useState<SelfRegisteredClient[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSelfRegisteredClients()
  }, [])

  const fetchSelfRegisteredClients = async () => {
    try {
      const response = await fetch("/api/crm/self-registered-clients")
      const data = await response.json()
      setClients(data.clients || [])
    } catch (error) {
      console.error("[v0] Error fetching self-registered clients:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card className="bg-red-900/25 backdrop-blur-md border-red-300/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Clientes Auto-Cadastrados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-white/70">Carregando...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-red-900/25 backdrop-blur-md border-red-300/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Clientes Auto-Cadastrados
        </CardTitle>
        <p className="text-white/70 text-sm mt-1">Clientes que criaram conta ao agendar visita</p>
      </CardHeader>
      <CardContent>
        {clients.length === 0 ? (
          <p className="text-white/60 text-sm">Nenhum cliente auto-cadastrado ainda</p>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {clients.map((client) => (
              <div
                key={client.id}
                className="bg-red-900/10 backdrop-blur-sm border border-red-300/10 rounded-lg p-3 hover:bg-red-900/20 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{client.name}</p>
                    <p className="text-white/70 text-sm truncate">{client.email}</p>
                    <p className="text-white/60 text-xs mt-1">{client.cpf}</p>
                  </div>
                  <div className="flex items-center gap-1 text-white/60 text-xs ml-2">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {formatDistanceToNow(new Date(client.created_at), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {clients.length > 0 && (
          <div className="mt-4 pt-4 border-t border-red-300/20">
            <a
              href="/dashboard/clientes"
              className="text-white/80 hover:text-white text-sm font-medium transition-colors"
            >
              Ver todos os clientes →
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
