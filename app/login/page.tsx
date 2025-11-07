"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: "success", text: "Login bem-sucedido! Redirecionando..." })
        setTimeout(() => {
          router.push("/dashboard")
        }, 1500)
      } else {
        setMessage({ type: "error", text: data.error || "Erro ao fazer login" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Erro ao conectar ao servidor" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-red-600 mb-2">Cáritas RS</h1>
          <p className="text-gray-600">Sistema de Gestão Solidária 3.5</p>
        </div>

        {message && (
          <Alert className={message.type === "error" ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}>
            <AlertDescription className={message.type === "error" ? "text-red-800" : "text-green-800"}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        <Card className="bg-white/95 border-red-200 shadow-lg">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Acesse o sistema administrativo</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700">
                {loading ? "Conectando..." : "Entrar"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-gray-600 space-y-2">
          <p>Credenciais de teste (Super Admin):</p>
          <div className="bg-blue-50 border border-blue-200 rounded p-3 text-xs">
            <p>
              <strong>Email:</strong> sistema@caritasrs.org.br
            </p>
            <p>
              <strong>Senha:</strong> Caritas@2025Admin!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
