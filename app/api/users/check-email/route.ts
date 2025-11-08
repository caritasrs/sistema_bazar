import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-admin"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const email = searchParams.get("email")

    if (!email) {
      return NextResponse.json({ error: "Email é obrigatório" }, { status: 400 })
    }

    const supabase = createClient()

    const { data: existingUser, error } = await supabase
      .from("users")
      .select("id, name, email")
      .eq("email", email)
      .maybeSingle()

    if (error) {
      console.error("[v0] Error checking email:", error)
      return NextResponse.json({ error: "Erro ao verificar email" }, { status: 500 })
    }

    if (existingUser) {
      return NextResponse.json({
        exists: true,
        userName: existingUser.name,
        userEmail: existingUser.email,
      })
    }

    return NextResponse.json({ exists: false })
  } catch (error) {
    console.error("[v0] Exception checking email:", error)
    return NextResponse.json({ error: "Erro ao verificar email" }, { status: 500 })
  }
}
