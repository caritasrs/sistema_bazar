import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-admin"

export async function GET() {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.from("categories").select("*").order("name")

    if (error) throw error

    return NextResponse.json(data || [])
  } catch (error: any) {
    console.error("[v0] Error listing categories:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
