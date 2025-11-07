import { createClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = await createClient()

    const { data: receipts, error } = await supabase
      .from("receipts")
      .select(`
        *,
        customer:users(name, cpf)
      `)
      .order("created_at", { ascending: false })
      .limit(100)

    if (error) throw error

    return NextResponse.json(receipts)
  } catch (error) {
    console.error("Error fetching receipts:", error)
    return NextResponse.json({ error: "Failed to fetch receipts" }, { status: 500 })
  }
}
