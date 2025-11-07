import { getAdminClient } from "@/lib/supabase-admin"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = getAdminClient()
    const body = await request.json()
    const { cpf, email, id } = body

    let query = supabase.from("users").select("*")

    if (cpf) {
      query = query.eq("cpf", cpf)
    } else if (email) {
      query = query.eq("email", email)
    } else if (id) {
      query = query.eq("id", id)
    } else {
      return NextResponse.json({ error: "CPF, email or ID required" }, { status: 400 })
    }

    const { data: customer, error } = await query.single()

    if (error || !customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }

    return NextResponse.json(customer)
  } catch (error) {
    console.error("Error fetching customer:", error)
    return NextResponse.json({ error: "Failed to fetch customer" }, { status: 500 })
  }
}
