import { createClient } from "@/lib/client"
import { Database } from "./database"

type Donation = Database['public']['Tables']['donations']['Insert']

export async function initializeDatabase() {
  const supabase = createClient()
  
  try {
    // Check if the donations table exists by making a simple query
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .limit(1)
    
    // If we get an error and it's not about the table not existing, rethrow
    if (error && !error.message.includes('relation "donations" does not exist')) {
      throw error
    }
    
    // If we got here, either the table exists or we'll create it
    return { success: true }
  } catch (error) {
    console.error('Error initializing database:', error)
    return { error: error as Error }
  }
}

export async function createDonation(donation: Omit<Donation, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = createClient()
  
  try {
    const { data, error } = await supabase
      .from('donations')
      .insert(donation)
      .select()
      .single()
    
    if (error) throw error
    return { data }
  } catch (error) {
    console.error('Error creating donation:', error)
    return { error: error as Error }
  }
}
