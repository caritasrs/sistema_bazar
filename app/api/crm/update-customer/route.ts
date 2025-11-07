import { createClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

export async function PUT(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: "Customer ID required" }, { status: 400 })
    }

    const { data: customer, error } = await supabase
      .from("users")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    // Log audit
    await supabase.from("audit_logs").insert([
      {
        user_id: id,
        action: "customer_updated",
        table_name: "users",
        record_id: id,
        changes: updates,
      },
    ])

    return NextResponse.json(customer)
  } catch (error) {
    console.error("Error updating customer:", error)
    return NextResponse.json({ error: "Failed to update customer" }, { status: 500 })
  }
}
