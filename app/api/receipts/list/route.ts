import { getAdminClient } from "@/lib/supabase-admin"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    console.log("[v0] Fetching receipts with admin client")
    const supabase = getAdminClient()

    const { data: receipts, error } = await supabase
      .from("receipts")
      .select(`
        *,
        customer:users!receipts_customer_id_fkey(name, cpf)
      `)
      .order("created_at", { ascending: false })
      .limit(100)

    if (error) {
      console.error("[v0] Error fetching receipts:", error)
      return NextResponse.json([])
    }

    console.log("[v0] Receipts fetched successfully:", receipts?.length || 0)
    return NextResponse.json(receipts || [])
  } catch (error) {
    console.error("[v0] Exception fetching receipts:", error)
    return NextResponse.json([])
  }
}
