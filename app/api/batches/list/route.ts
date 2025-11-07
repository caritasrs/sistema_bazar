import { createClient } from "@/lib/supabase-admin"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createClient()

    const { data: batches, error } = await supabase
      .from("donation_batches")
      .select(`
        *,
        donor:donors(name, type)
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching batches:", error)
      throw error
    }

    return NextResponse.json({ batches })
  } catch (error) {
    console.error("[v0] Error in batches list:", error)
    return NextResponse.json({ error: "Failed to fetch batches" }, { status: 500 })
  }
}
