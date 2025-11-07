import { createClient } from "@/lib/supabase-admin"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") || ""
    const role = searchParams.get("role")

    let dbQuery = supabase
      .from("users")
      .select("id, name, email, phone, cpf, role")
      .eq("status", "active")
      .or(`name.ilike.%${query}%,email.ilike.%${query}%,cpf.ilike.%${query}%`)
      .limit(10)

    if (role) {
      dbQuery = dbQuery.eq("role", role)
    }

    const { data: users, error } = await dbQuery

    if (error) throw error

    return NextResponse.json({ users })
  } catch (error) {
    console.error("Error searching users:", error)
    return NextResponse.json({ error: "Failed to search users" }, { status: 500 })
  }
}
