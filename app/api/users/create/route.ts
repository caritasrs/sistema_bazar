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

    if (currentUser.role !== "super_admin" && currentUser.role !== "admin") {
      return NextResponse.json({ error: "Permissão negada" }, { status: 403 })
    }

    const { email, name, cpf, password, role, phone, address } = await request.json()

    if (currentUser.role === "super_admin" && role !== "admin" && role !== "operator") {
      return NextResponse.json({ error: "Super admin pode criar apenas admins e operadores" }, { status: 400 })
    }

    if (currentUser.role === "admin" && role !== "operator") {
      return NextResponse.json({ error: "Admin pode criar apenas operadores" }, { status: 400 })
    }

    const result = await createUser(email, name, cpf, password, role, phone, address)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({ success: true, user: result.user })
  } catch (error) {
    return NextResponse.json({ error: "Erro ao criar usuário" }, { status: 500 })
  }
}
