import { createClient } from "@/lib/supabase-admin"
import { NextResponse } from "next/server"

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()
    const { id } = params

    const { error } = await supabase.from("schedules").update({ status: "cancelled" }).eq("id", id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error cancelling schedule:", error)
    return NextResponse.json({ error: "Failed to cancel schedule" }, { status: 500 })
  }
}
