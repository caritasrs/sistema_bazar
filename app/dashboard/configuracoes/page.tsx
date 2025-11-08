"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sidebar } from "@/components/dashboard/sidebar"
import { toast } from "@/hooks/use-toast"

export default function ConfiguracoesPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState({
    pix_key: "",
    pix_key_type: "cnpj",
    institution_name: "Cáritas RS",
    institution_city: "Porto Alegre",
    merchant_name: "Cáritas Brasileira RS",
    merchant_city: "Porto Alegre",
  })

  useEffect(() => {
    checkAuth()
    loadSettings()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/verify-session")
      if (!response.ok) {
        router.push("/login")
        return
      }
      const data = await response.json()

      if (data.user.role !== "admin" && data.user.role !== "super_admin") {
        toast({
          title: "Acesso negado",
          description: "Você não tem permissão para acessar esta página.",
          variant: "destructive",
        })
        router.push("/dashboard")
        return
      }

      setUser(data.user)
    } catch (error) {
      console.error("[v0] Auth error:", error)
      router.push("/login")
    } finally {
      setLoading(false)
    }
  }

  const loadSettings = async () => {
    try {
      const response = await fetch("/api/settings/get")
      if (response.ok) {
        const data = await response.json()
        setSettings((prev) => ({ ...prev, ...data.settings }))
      }
    } catch (error) {
      console.error("[v0] Error loading settings:", error)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      console.log("[v0] Saving settings:", settings)

      const response = await fetch("/api/settings/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      })

      console.log("[v0] Save response status:", response.status)

      const responseData = await response.json()
      console.log("[v0] Save response data:", responseData)

      if (response.ok) {
        toast({
          title: "Configurações salvas",
          description: "As configurações PIX foram atualizadas com sucesso.",
        })
      } else {
        throw new Error(responseData.error || "Erro ao salvar configurações")
      }
    } catch (error: any) {
      console.error("[v0] Save error:", error)
      toast({
        title: "Erro ao salvar",
        description: error.message || "Não foi possível salvar as configurações.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-900 mx-auto"></div>
          <p className="mt-4 text-red-900">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="flex h-screen bg-red-50">
      <Sidebar user={user} />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-red-900">Configurações PIX</h1>
            <p className="text-red-700">Configure a chave PIX da Caritas para receber pagamentos</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Dados PIX da Instituição</CardTitle>
              <CardDescription>Configure a chave PIX que será usada para gerar QR Codes de pagamento</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="pix_key_type">Tipo de Chave PIX</Label>
                  <Select
                    value={settings.pix_key_type}
                    onValueChange={(value) => setSettings({ ...settings, pix_key_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cpf">CPF</SelectItem>
                      <SelectItem value="cnpj">CNPJ</SelectItem>
                      <SelectItem value="email">E-mail</SelectItem>
                      <SelectItem value="phone">Telefone</SelectItem>
                      <SelectItem value="random">Chave Aleatória</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pix_key">Chave PIX</Label>
                  <Input
                    id="pix_key"
                    placeholder={
                      settings.pix_key_type === "cpf"
                        ? "000.000.000-00"
                        : settings.pix_key_type === "cnpj"
                          ? "00.000.000/0000-00"
                          : settings.pix_key_type === "email"
                            ? "contato@caritas.org.br"
                            : settings.pix_key_type === "phone"
                              ? "+55 51 99999-9999"
                              : "chave-aleatoria-uuid"
                    }
                    value={settings.pix_key}
                    onChange={(e) => setSettings({ ...settings, pix_key: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="institution_name">Nome da Instituição</Label>
                  <Input
                    id="institution_name"
                    value={settings.institution_name}
                    onChange={(e) => setSettings({ ...settings, institution_name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="institution_city">Cidade</Label>
                  <Input
                    id="institution_city"
                    value={settings.institution_city}
                    onChange={(e) => setSettings({ ...settings, institution_city: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="merchant_name">Nome do Estabelecimento (PIX)</Label>
                  <Input
                    id="merchant_name"
                    value={settings.merchant_name}
                    onChange={(e) => setSettings({ ...settings, merchant_name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="merchant_city">Cidade do Estabelecimento (PIX)</Label>
                  <Input
                    id="merchant_city"
                    value={settings.merchant_city}
                    onChange={(e) => setSettings({ ...settings, merchant_city: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleSave} disabled={saving || !settings.pix_key}>
                  {saving ? "Salvando..." : "Salvar Configurações"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
