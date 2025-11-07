"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, MessageSquare } from "lucide-react"

export function CampaignList() {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCampaigns()
  }, [])

  const fetchCampaigns = async () => {
    try {
      const response = await fetch("/api/campaigns/list")
      const data = await response.json()
      setCampaigns(data.campaigns || [])
    } catch (error) {
      console.error("[v0] Error fetching campaigns:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-white text-center py-8">Carregando campanhas...</div>
  }

  return (
    <div className="grid gap-4">
      {campaigns.length === 0 ? (
        <Card className="bg-red-900/10 backdrop-blur-md border-red-800/30">
          <CardContent className="py-8">
            <p className="text-white/70 text-center">Nenhuma campanha criada ainda</p>
          </CardContent>
        </Card>
      ) : (
        campaigns.map((campaign: any) => (
          <Card key={campaign.id} className="bg-red-900/10 backdrop-blur-md border-red-800/30">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-white">{campaign.title}</CardTitle>
                  <p className="text-white/70 text-sm mt-1">{campaign.description}</p>
                </div>
                <Badge className={campaign.status === "active" ? "bg-green-600" : "bg-gray-600"}>
                  {campaign.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm text-white/80 mb-4">
                <div>
                  <span className="text-white/60">Tipo:</span> {campaign.campaign_type}
                </div>
                <div>
                  <span className="text-white/60">Segmento:</span> {campaign.target_segment}
                </div>
                <div>
                  <span className="text-white/60">Início:</span>{" "}
                  {campaign.start_date ? new Date(campaign.start_date).toLocaleDateString("pt-BR") : "N/A"}
                </div>
                <div>
                  <span className="text-white/60">Fim:</span>{" "}
                  {campaign.end_date ? new Date(campaign.end_date).toLocaleDateString("pt-BR") : "N/A"}
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Mail className="w-4 h-4 mr-2" />
                  Enviar por Email
                </Button>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Enviar por WhatsApp
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
