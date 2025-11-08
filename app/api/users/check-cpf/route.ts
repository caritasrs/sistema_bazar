import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-admin"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const cpf = searchParams.get("cpf")

    if (!cpf) {
      return NextResponse.json({ error: "CPF não fornecido" }, { status: 400 })
    }

    const supabase = createClient()

    const { data, error } = await supabase.from("users").select("name, email").eq("cpf", cpf).maybeSingle()

    if (error) {
      console.error("[v0] Error checking CPF:", error)
      return NextResponse.json({ exists: false })
    }

    if (data) {
      return NextResponse.json({
        exists: true,
        userName: data.name,
        userEmail: data.email,
      })
    }

    return NextResponse.json({ exists: false })
  } catch (error) {
    console.error("[v0] Exception in check-cpf:", error)
    return NextResponse.json({ exists: false })
  }
}
