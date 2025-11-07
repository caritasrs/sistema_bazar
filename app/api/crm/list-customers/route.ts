import { getAdminClient } from "@/lib/supabase-admin"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = getAdminClient()
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || "active"
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = 20

    let query = supabase.from("users").select("*").eq("status", status).order("created_at", { ascending: false })

    if (search) {
      // Search by name, email or CPF
      const searchTerm = `%${search}%`
      query = query.or(`name.ilike.${searchTerm},email.ilike.${searchTerm},cpf.ilike.${searchTerm}`)
    }

    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data: customers, error, count } = await query.range(from, to)

    if (error) throw error

    return NextResponse.json({
      customers,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching customers:", error)
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 })
  }
}
