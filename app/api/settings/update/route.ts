import { type NextRequest, NextResponse } from "next/server"
import { getAdminClient } from "@/lib/supabase-admin"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Settings update request received")
    const body = await request.json()
    console.log("[v0] Request body:", JSON.stringify(body))
    const { settings } = body

    if (!settings) {
      console.log("[v0] No settings data provided")
      return NextResponse.json({ error: "Settings data is required" }, { status: 400 })
    }

    console.log("[v0] Settings to update:", settings)
    const supabase = getAdminClient()

    for (const [key, value] of Object.entries(settings)) {
      console.log(`[v0] Updating setting: ${key} = ${value}`)

      const { data, error } = await supabase
        .from("settings")
        .upsert({ key, value: value as string, updated_at: new Date().toISOString() }, { onConflict: "key" })
        .select()

      if (error) {
        console.error(`[v0] Error updating setting ${key}:`, error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      console.log(`[v0] Setting ${key} updated successfully:`, data)
    }

    console.log("[v0] All settings updated successfully")
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[v0] Settings update error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
