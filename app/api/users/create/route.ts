import { type NextRequest, NextResponse } from "next/server"
import { createUser } from "@/lib/auth-service"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const authToken = cookieStore.get("auth_token")

    console.log("[v0] Create user request received")

    if (!authToken) {
      console.log("[v0] No auth token found")
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const currentUser = JSON.parse(authToken.value)
    console.log("[v0] Current user role:", currentUser.role)

    if (currentUser.role !== "super_admin" && currentUser.role !== "admin" && currentUser.role !== "operator") {
      console.log("[v0] Permission denied for role:", currentUser.role)
      return NextResponse.json({ error: "Permissão negada" }, { status: 403 })
    }

    const { email, name, cpf, password, role, phone, address } = await request.json()
    console.log("[v0] Requested role to create:", role)
    console.log("[v0] Created by user role:", currentUser.role)

    if (currentUser.role === "super_admin") {
      if (role !== "admin" && role !== "operator" && role !== "client") {
        console.log("[v0] Super admin validation failed - invalid role:", role)
        return NextResponse.json({ error: "Role inválida" }, { status: 400 })
      }
      console.log("[v0] Super admin can create:", role)
    }

    if (currentUser.role === "admin") {
      console.log("[v0] Admin attempting to create role:", role)
      if (role !== "operator" && role !== "client") {
        console.log("[v0] Admin validation failed - can only create operator or client, attempted:", role)
        return NextResponse.json({ error: "Admin pode criar apenas operadores e clientes" }, { status: 400 })
      }
      console.log("[v0] Admin validation passed for role:", role)
    }

    if (currentUser.role === "operator") {
      if (role !== "client") {
        console.log("[v0] Operator validation failed - can only create client")
        return NextResponse.json({ error: "Operador pode criar apenas clientes" }, { status: 400 })
      }
      console.log("[v0] Operator validation passed")
    }
    // </CHANGE>

    console.log(`[v0] Creating user with role: ${role} by ${currentUser.role}`)

    const result = await createUser(email, name, cpf, password, role, phone, address)

    if (!result.success) {
      console.log("[v0] User creation failed:", result.error)
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    console.log("[v0] User created successfully:", result.user?.email)
    return NextResponse.json({ success: true, user: result.user })
  } catch (error) {
    console.error("[v0] Error creating user:", error)
    return NextResponse.json({ error: "Erro ao criar usuário" }, { status: 500 })
  }
}
