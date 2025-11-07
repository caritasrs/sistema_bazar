import { createClient as createSupabaseClient } from "@supabase/supabase-js"

let adminClient: ReturnType<typeof createSupabaseClient> | null = null

export function getAdminClient() {
  if (!adminClient) {
    adminClient = createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  }
  return adminClient
}

export function createClient() {
  return getAdminClient()
}

export function getSupabaseClient() {
  return getAdminClient()
}
