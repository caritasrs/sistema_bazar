import { getAdminClient } from "@/lib/supabase-admin"
import { NextResponse } from "next/server"
import { validateCPF } from "@/lib/password-utils"

export async function POST(request: Request) {
  try {
    const supabase = getAdminClient()
    const body = await request.json()

    const { email, cpf, name, phone, address, registration_source = "operator_created" } = body

    // Validate CPF
    if (!validateCPF(cpf)) {
      return NextResponse.json({ error: "Invalid CPF" }, { status: 400 })
    }

    // Check if user already exists
    const { data: existingUser } = await supabase.from("users").select("id").eq("cpf", cpf).single()

    if (existingUser) {
      return NextResponse.json({ error: "Customer already exists", customer: existingUser }, { status: 409 })
    }

    const { data: customer, error } = await supabase
      .from("users")
      .insert([
        {
          email,
          cpf,
          name,
          phone,
          address,
          status: "active",
          email_verified: false,
          registration_source, // Track how the account was created
        },
      ])
      .select()
      .single()

    if (error) throw error

    console.log("[v0] Customer created:", { id: customer.id, registration_source })

    // Log audit
    await supabase.from("audit_logs").insert([
      {
        user_id: customer.id,
        action: "customer_created",
        table_name: "users",
        record_id: customer.id,
      },
    ])

    return NextResponse.json(customer)
  } catch (error) {
    console.error("Error creating customer:", error)
    return NextResponse.json({ error: "Failed to create customer" }, { status: 500 })
  }
}
