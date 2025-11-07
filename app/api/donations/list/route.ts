import { createClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") || "open"

    const { data: batches, error } = await supabase
      .from("donation_batches")
      .select(`
        *,
        donor:donors(*),
        items(*)
      `)
      .eq("status", status)
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json(batches)
  } catch (error) {
    console.error("Error fetching donations:", error)
    return NextResponse.json({ error: "Failed to fetch donations" }, { status: 500 })
  }
}
