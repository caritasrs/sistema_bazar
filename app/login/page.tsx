"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRouter } from "next/navigation"
import { CaritasLogo } from "@/components/caritas-logo"

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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center mb-8 bg-red-900/25 backdrop-blur-md rounded-2xl p-6 border border-red-300/20">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative h-16 w-16 rounded-xl bg-white p-3 shadow-lg">
              <CaritasLogo className="h-full w-full" />
            </div>
            {/* */}
          </div>
          <h1 className="text-3xl font-bold text-white mb-1 drop-shadow-lg">CÁRITAS BRASILEIRA</h1>
          <p className="text-lg text-red-100 font-medium">Rio Grande do Sul</p>
          <p className="text-sm text-red-50 mt-2">Sistema de Gestão Solidária 3.5</p>
        </div>

        {message && (
          <Alert
            className={
              message.type === "error"
                ? "border-red-300/30 bg-red-900/30 backdrop-blur-md"
                : "border-green-300/30 bg-green-900/30 backdrop-blur-md"
            }
          >
            <AlertDescription className="text-white font-medium">{message.text}</AlertDescription>
          </Alert>
        )}

        <Card className="bg-red-900/25 backdrop-blur-md border-red-300/20 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white">Login</CardTitle>
            <CardDescription className="text-red-50">Acesse o sistema administrativo</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-white">
                  E-mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                  className="bg-white/10 border-red-300/30 text-white placeholder:text-red-200/50"
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-white">
                  Senha
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                  className="bg-white/10 border-red-300/30 text-white placeholder:text-red-200/50"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white shadow-lg"
              >
                {loading ? "Conectando..." : "Entrar"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
