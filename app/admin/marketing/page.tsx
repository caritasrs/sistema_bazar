"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { CampaignForm } from "@/components/campaigns/campaign-form"
import { formatDate } from "@/lib/format-utils"

export default function MarketingPage() {
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null)
  const [view, setView] = useState<"list" | "create">("list")
  const [channel, setChannel] = useState("email")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null)

  useEffect(() => {
    loadCampaigns()
  }, [])

  const loadCampaigns = async () => {
    try {
      const response = await fetch("/api/campaigns/list")
      if (response.ok) {
        const data = await response.json()
        setCampaigns(data)
      }
    } catch (error) {
      console.error("Error loading campaigns:", error)
    }
  }

  const handleCreateCampaign = async (formData: any) => {
    setLoading(true)
    try {
      const response = await fetch("/api/campaigns/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setMessage({ type: "success", text: "Campanha criada com sucesso!" })
        loadCampaigns()
        setView("list")
      } else {
        throw new Error("Erro ao criar campanha")
      }
    } catch (error) {
      setMessage({ type: "error", text: "Erro ao criar campanha" })
    } finally {
      setLoading(false)
    }
  }

  const handleSendCommunication = async () => {
    if (!selectedCampaign) {
      setMessage({ type: "error", text: "Selecione uma campanha" })
      return
    }

    setLoading(true)
    try {
      // TODO: Implement audience selection
      const response = await fetch("/api/campaigns/send-communication", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaign_id: selectedCampaign.id,
          target_users: [], // Will be populated from audience selection
          channel,
          message_template: selectedCampaign.description,
        }),
      })

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Mensagens enviadas com sucesso!",
        })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Erro ao enviar mensagens" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-red-600">Marketing e Campanhas</h1>
        <p className="text-gray-600">Crie campanhas institucionais e envie comunicados solidários</p>
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
          variant={view === "list" ? "default" : "outline"}
          onClick={() => setView("list")}
          className={view === "list" ? "bg-red-600" : ""}
        >
          Campanhas
        </Button>
        <Button
          variant={view === "create" ? "default" : "outline"}
          onClick={() => setView("create")}
          className={view === "create" ? "bg-red-600" : ""}
        >
          Nova Campanha
        </Button>
      </div>

      {view === "create" && <CampaignForm onSubmit={handleCreateCampaign} loading={loading} />}

      {view === "list" && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-white/80 border-red-200">
            <CardHeader>
              <CardTitle>Campanhas Ativas</CardTitle>
              <CardDescription>{campaigns.length} campanha(s)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {campaigns.map((campaign) => (
                <Card
                  key={campaign.id}
                  className={`bg-red-50 border-red-100 p-3 cursor-pointer hover:bg-red-100 ${
                    selectedCampaign?.id === campaign.id ? "ring-2 ring-red-600" : ""
                  }`}
                  onClick={() => setSelectedCampaign(campaign)}
                >
                  <div className="font-semibold text-red-700">{campaign.title}</div>
                  <div className="text-xs text-gray-600">{campaign.description}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {formatDate(campaign.start_date)} - {formatDate(campaign.end_date)}
                  </div>
                </Card>
              ))}
            </CardContent>
          </Card>

          {selectedCampaign && (
            <Card className="bg-white/80 border-red-200">
              <CardHeader>
                <CardTitle>Enviar Comunicado</CardTitle>
                <CardDescription>{selectedCampaign.title}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Canal de Comunicação</Label>
                  <Select value={channel} onValueChange={setChannel}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">E-mail</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Público-Alvo</Label>
                  <div className="mt-2 p-3 bg-red-50 rounded-lg text-sm">
                    Segmento: <strong>{selectedCampaign.target_segment}</strong>
                  </div>
                </div>

                <div className="bg-red-50 p-3 rounded-lg">
                  <Label className="text-xs">Prévia da Mensagem</Label>
                  <div className="text-sm mt-2">{selectedCampaign.description}</div>
                </div>

                <Button
                  onClick={handleSendCommunication}
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {loading ? "Enviando..." : "Enviar Comunicado"}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
