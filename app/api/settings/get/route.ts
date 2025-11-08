import { type NextRequest, NextResponse } from "next/server"
import { getAdminClient } from "@/lib/supabase-admin"

export async function GET(request: NextRequest) {
  try {
    const supabase = getAdminClient()

    const { data: settings, error } = await supabase.from("settings").select("*").order("key")

    if (error) {
      console.error("[v0] Error fetching settings:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Convert array to object for easier access
    const settingsObj =
      settings?.reduce((acc: any, setting: any) => {
        acc[setting.key] = setting.value
        return acc
      }, {}) || {}

    return NextResponse.json({ settings: settingsObj })
  } catch (error: any) {
    console.error("[v0] Settings fetch error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
