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

    if (currentUser.role !== "super_admin") {
      return NextResponse.json({ error: "Permissão negada" }, { status: 403 })
    }

    const supabase = createClient()

    const { data, error } = await supabase
      .from("users")
      .select("id, email, name, cpf, role, status, phone, created_at, updated_at")
      .eq("role", "operator")

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, users: data || [] })
  } catch (error) {
    return NextResponse.json({ error: "Erro ao listar usuários" }, { status: 500 })
  }
}
