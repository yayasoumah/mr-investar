import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

let supabaseServerClient: ReturnType<typeof createSupabaseClient<Database>> | null = null
let supabaseServiceRoleClient: ReturnType<typeof createSupabaseClient<Database>> | null = null

export const createClient = (useServiceRole = false) => {
  if (useServiceRole) {
    if (!supabaseServiceRoleClient) {
      supabaseServiceRoleClient = createSupabaseClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false
          }
        }
      )
    }
    return supabaseServiceRoleClient
  }

  if (!supabaseServerClient) {
    supabaseServerClient = createSupabaseClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return supabaseServerClient
} 