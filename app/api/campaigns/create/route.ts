import { createClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { title, description, campaign_type, start_date, end_date, target_segment } = body

    const { data: campaign, error } = await supabase
      .from("campaigns")
      .insert([
        {
          title,
          description,
          campaign_type,
          start_date,
          end_date,
          target_segment,
          status: "active",
        },
      ])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(campaign)
  } catch (error) {
    console.error("Error creating campaign:", error)
    return NextResponse.json({ error: "Failed to create campaign" }, { status: 500 })
  }
}
