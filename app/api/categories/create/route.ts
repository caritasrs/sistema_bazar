import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-admin"

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const body = await request.json()
    const { name, description, products } = body

    const { data, error } = await supabase
      .from("categories")
      .insert({
        name,
        description,
        products: products || [],
        status: "active",
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("[v0] Error creating category:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
