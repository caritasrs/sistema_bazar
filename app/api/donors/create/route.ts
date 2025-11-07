import { createClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { type, name, cpf_cnpj, email, phone, address, city, state, country } = body

    const { data: donor, error } = await supabase
      .from("donors")
      .insert([
        {
          type,
          name,
          cpf_cnpj,
          email,
          phone,
          address,
          city,
          state,
          country,
          status: "active",
        },
      ])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(donor)
  } catch (error) {
    console.error("Error creating donor:", error)
    return NextResponse.json({ error: "Failed to create donor" }, { status: 500 })
  }
}
