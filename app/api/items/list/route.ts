import { createClient } from "@/lib/supabase-admin"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const search = searchParams.get("search")

    const supabase = createClient()

    let query = supabase
      .from("items")
      .select(`
        *,
        batch:donation_batches(batch_number, donor:donors(name)),
        category:categories(name)
      `)
      .order("created_at", { ascending: false })

    if (status) {
      query = query.eq("status", status)
    }

    if (search) {
      query = query.or(`description.ilike.%${search}%,qr_code.ilike.%${search}%`)
    }

    const { data: items, error } = await query

    if (error) {
      console.error("[v0] Error fetching items:", error)
      throw error
    }

    return NextResponse.json({ items })
  } catch (error) {
    console.error("[v0] Error in items list:", error)
    return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 })
  }
}
