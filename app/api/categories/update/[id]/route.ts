import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-admin"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()
    const body = await request.json()
    const { name, description, products } = body

    const { data, error } = await supabase
      .from("categories")
      .update({
        name,
        description,
        products: products || [],
      })
      .eq("id", params.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("[v0] Error updating category:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
