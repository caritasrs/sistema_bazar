import { getAdminClient } from "@/lib/supabase-admin"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = getAdminClient()
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""

    let query = supabase
      .from("donors")
      .select(`
        *,
        batches:donation_batches(count)
      `)
      .eq("status", "active")
      .order("created_at", { ascending: false })

    if (search) {
      query = query.or(`name.ilike.%${search}%,cpf_cnpj.ilike.%${search}%`)
    }

    const { data: donors, error } = await query

    if (error) throw error

    return NextResponse.json(donors)
  } catch (error) {
    console.error("Error fetching donors:", error)
    return NextResponse.json({ error: "Failed to fetch donors" }, { status: 500 })
  }
}
