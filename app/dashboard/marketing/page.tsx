"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CampaignList } from "@/components/marketing/campaign-list"
import { CampaignCreate } from "@/components/marketing/campaign-create"

export default function MarketingPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="bg-red-900/25 backdrop-blur-md rounded-lg p-6 border border-red-800/30 shadow-lg">
        <h1 className="text-3xl font-bold text-white mb-2">Marketing e Promoções</h1>
        <p className="text-white/90">Crie campanhas institucionais e promocionais</p>
      </div>

      <Tabs defaultValue="campaigns" className="w-full">
        <TabsList className="bg-red-900/25 backdrop-blur-md border border-red-800/30">
          <TabsTrigger value="campaigns" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            Campanhas
          </TabsTrigger>
          <TabsTrigger value="create" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            Nova Campanha
          </TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns">
          <CampaignList />
        </TabsContent>

        <TabsContent value="create">
          <CampaignCreate />
        </TabsContent>
      </Tabs>
    </div>
  )
}
