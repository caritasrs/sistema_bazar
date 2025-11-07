import { createClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { customer_id, items, payment_method, operator_name } = body

    if (!customer_id || !items || items.length === 0) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 })
    }

    // Calculate total
    const total_amount = items.reduce((sum: number, item: any) => sum + (item.unit_price || 0), 0)

    // Create receipt
    const receiptNumber = `RCP-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    const { data: receipt, error: receiptError } = await supabase
      .from("receipts")
      .insert([
        {
          receipt_number: receiptNumber,
          customer_id,
          payment_method,
          total_amount,
          status: "paid",
          operator_name,
        },
      ])
      .select()
      .single()

    if (receiptError) throw receiptError

    // Create receipt items and update item status
    const receiptItems: any[] = []
    for (const item of items) {
      const { data: receiptItem, error: itemError } = await supabase
        .from("receipt_items")
        .insert([
          {
            receipt_id: receipt.id,
            item_id: item.item_id,
            description: item.description,
            quantity: item.quantity,
            unit_price: item.unit_price,
          },
        ])
        .select()
        .single()

      if (itemError) throw itemError
      receiptItems.push(receiptItem)

      // Update item status
      await supabase.from("items").update({ status: "sold", sold_at: new Date().toISOString() }).eq("id", item.item_id)
    }

    // Create transaction record
    const { data: transaction, error: transError } = await supabase
      .from("transactions")
      .insert([
        {
          receipt_id: receipt.id,
          user_id: customer_id,
          transaction_type: "purchase",
          amount: total_amount,
          payment_method,
          status: "completed",
        },
      ])
      .select()
      .single()

    if (transError) throw transError

    // Log audit
    await supabase.from("audit_logs").insert([
      {
        user_id: customer_id,
        action: "checkout_completed",
        table_name: "receipts",
        record_id: receipt.id,
      },
    ])

    return NextResponse.json({
      receipt,
      items: receiptItems,
      transaction,
    })
  } catch (error) {
    console.error("Error processing checkout:", error)
    return NextResponse.json({ error: "Failed to process checkout" }, { status: 500 })
  }
}
