import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-admin"

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()

    const { error } = await supabase.from("categories").delete().eq("id", params.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[v0] Error deleting category:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
