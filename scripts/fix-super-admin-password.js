import bcrypt from "bcryptjs"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function fixSuperAdmin() {
  const email = "sistema@caritasrs.org.br"
  const password = "Caritas@2025Admin!"

  console.log("Generating password hash...")
  const passwordHash = await bcrypt.hash(password, 10)
  console.log("Hash generated:", passwordHash)

  console.log("\nUpdating super admin in database...")
  const { data, error } = await supabase
    .from("users")
    .upsert(
      {
        email: email,
        password_hash: passwordHash,
        name: "Sistema Caritas RS",
        cpf: "11111111111",
        phone: "51999999999",
        role: "super_admin",
        status: "active",
      },
      {
        onConflict: "email",
      },
    )
    .select()

  if (error) {
    console.error("Error updating user:", error)
    return
  }

  console.log("✅ Super admin updated successfully!")
  console.log("Email:", email)
  console.log("Password:", password)
  console.log("\nYou can now login with these credentials.")
}

fixSuperAdmin()
