"use client"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DonorList } from "@/components/donors/donor-list"
import { DonorForm } from "@/components/donors/donor-form"
import { UserPlus, List } from "lucide-react"

export default function DoadoresPage() {
  const [activeTab, setActiveTab] = useState("list")
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleDonorCreated = () => {
    console.log("[v0] Donor created, refreshing list...")
    setRefreshTrigger((prev) => prev + 1)
    setActiveTab("list")
  }

  return (
    <div className="space-y-6">
      <div className="bg-red-900/25 backdrop-blur-md rounded-2xl p-6 border border-red-300/20">
        <h1 className="text-3xl font-bold text-white">Rastreabilidade de Doadores</h1>
        <p className="text-red-50 mt-2">Gerencie doadores e acompanhe suas contribuições</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-red-900/25 backdrop-blur-md border border-red-300/20 p-1">
          <TabsTrigger
            value="list"
            className="data-[state=active]:bg-red-700/60 data-[state=active]:text-white text-white/80 font-semibold flex items-center gap-2"
          >
            <List className="w-4 h-4" />
            Lista de Doadores
          </TabsTrigger>
          <TabsTrigger
            value="create"
            className="data-[state=active]:bg-red-700/60 data-[state=active]:text-white text-white/80 font-semibold flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Cadastrar Doador
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <DonorList key={refreshTrigger} />
        </TabsContent>

        <TabsContent value="create">
          <DonorForm onSuccess={handleDonorCreated} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
