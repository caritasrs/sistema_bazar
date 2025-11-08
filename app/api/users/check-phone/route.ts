import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-admin"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const phone = searchParams.get("phone")

    if (!phone) {
      return NextResponse.json({ error: "Telefone é obrigatório" }, { status: 400 })
    }

    const cleanPhone = phone.replace(/\D/g, "")
    const supabase = createClient()

    const { data: existingUser, error } = await supabase
      .from("users")
      .select("id, name, phone")
      .ilike("phone", `%${cleanPhone}%`)
      .maybeSingle()

    if (error) {
      console.error("[v0] Error checking phone:", error)
      return NextResponse.json({ error: "Erro ao verificar telefone" }, { status: 500 })
    }

    if (existingUser) {
      return NextResponse.json({
        exists: true,
        userName: existingUser.name,
        userPhone: existingUser.phone,
      })
    }

    return NextResponse.json({ exists: false })
  } catch (error) {
    console.error("[v0] Exception checking phone:", error)
    return NextResponse.json({ error: "Erro ao verificar telefone" }, { status: 500 })
  }
}
