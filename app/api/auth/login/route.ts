import { type NextRequest, NextResponse } from "next/server"
import { authenticateUser } from "@/lib/auth-service"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    console.log("[v0] Login attempt for:", email)

    if (!email || !password) {
      return NextResponse.json({ error: "Email e senha são obrigatórios" }, { status: 400 })
    }

    const result = await authenticateUser({ email, password })

    console.log("[v0] Authentication result:", {
      success: result.success,
      error: result.error,
      role: result.user?.role,
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 401 })
    }

    const cookieStore = await cookies()
    cookieStore.set("auth_token", JSON.stringify(result.user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    })

    console.log("[v0] Login successful, cookie set for:", result.user.email)

    return NextResponse.json({ success: true, user: result.user })
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ error: "Erro ao fazer login" }, { status: 500 })
  }
}
