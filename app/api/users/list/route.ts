import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-admin"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
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

    const supabase = createClient()

    const { data, error } = await supabase
      .from("users")
      .select("id, email, name, cpf, role, status, phone, created_at, updated_at")
      .in("role", ["admin", "operator", "client"])
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching users:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    console.log("[v0] Users fetched successfully:", data?.length || 0)
    return NextResponse.json({ success: true, users: data || [] })
  } catch (error) {
    console.error("[v0] Unexpected error in users list:", error)
    return NextResponse.json({ error: "Erro ao listar usuários" }, { status: 500 })
  }
}
