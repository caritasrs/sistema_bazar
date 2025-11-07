"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DonorList } from "@/components/donors/donor-list"
import { DonorForm } from "@/components/donors/donor-form"

export default function DoadoresPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="bg-red-900/25 backdrop-blur-md rounded-lg p-6 border border-red-800/30 shadow-lg">
        <h1 className="text-3xl font-bold text-white mb-2">Rastreabilidade de Doadores</h1>
        <p className="text-white/90">Gerencie doadores e acompanhe suas contribuições</p>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="bg-red-900/25 backdrop-blur-md border border-red-800/30">
          <TabsTrigger value="list" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            Lista de Doadores
          </TabsTrigger>
          <TabsTrigger value="create" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            Cadastrar Doador
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <DonorList />
        </TabsContent>

        <TabsContent value="create">
          <DonorForm />
        </TabsContent>
      </Tabs>
    </div>
  )
}
