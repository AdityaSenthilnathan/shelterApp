import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import type { Database } from "./database"

// Create a server-side supabase client
export const createClient = () => {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
