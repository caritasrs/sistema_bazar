import { type NextRequest, NextResponse } from "next/server"
import { createUser } from "@/lib/auth-service"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const authToken = cookieStore.get("auth_token")

    if (!authToken) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const currentUser = JSON.parse(authToken.value)

    if (currentUser.role !== "super_admin" && currentUser.role !== "admin" && currentUser.role !== "operator") {
      return NextResponse.json({ error: "Permissão negada" }, { status: 403 })
    }

    const { email, name, cpf, password, role, phone, address } = await request.json()

    if (currentUser.role === "super_admin") {
      if (role !== "admin" && role !== "operator" && role !== "client") {
        return NextResponse.json({ error: "Role inválida" }, { status: 400 })
      }
    }

    if (currentUser.role === "admin") {
      if (role !== "operator" && role !== "client") {
        return NextResponse.json({ error: "Admin pode criar apenas operadores e clientes" }, { status: 400 })
      }
    }

    if (currentUser.role === "operator") {
      if (role !== "client") {
        return NextResponse.json({ error: "Operador pode criar apenas clientes" }, { status: 400 })
      }
    }

    const result = await createUser(email, name, cpf, password, role, phone, address)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({ success: true, user: result.user })
  } catch (error) {
    console.error("[v0] Error creating user:", error)
    return NextResponse.json({ error: "Erro ao criar usuário" }, { status: 500 })
  }
}
