import { createClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") || "active"

    const { data: campaigns, error } = await supabase
      .from("campaigns")
      .select(`
        *,
        communications:campaign_communications(count)
      `)
      .eq("status", status)
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json(campaigns)
  } catch (error) {
    console.error("Error fetching campaigns:", error)
    return NextResponse.json({ error: "Failed to fetch campaigns" }, { status: 500 })
  }
}
