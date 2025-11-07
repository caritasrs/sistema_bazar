import { getAdminClient } from "@/lib/supabase-admin"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = getAdminClient()

    // Fetch clients who self-registered through public scheduling
    const { data: clients, error } = await supabase
      .from("users")
      .select("id, name, email, cpf, phone, created_at")
      .eq("registration_source", "self_registered")
      .order("created_at", { ascending: false })
      .limit(10)

    if (error) throw error

    return NextResponse.json({ clients: clients || [] })
  } catch (error) {
    console.error("[v0] Error fetching self-registered clients:", error)
    return NextResponse.json({ error: "Failed to fetch clients" }, { status: 500 })
  }
}
