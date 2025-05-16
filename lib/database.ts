export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          created_at: string
          updated_at: string
          avatar_url: string | null
        }
        Insert: {
          id?: string
          email: string
          full_name: string
          created_at?: string
          updated_at?: string
          avatar_url?: string | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          created_at?: string
          updated_at?: string
          avatar_url?: string | null
        }
      }
      shelters: {
        Row: {
          id: string
          name: string
          description: string | null
          address: string
          city: string
          state: string
          zip_code: string
          phone: string | null
          email: string | null
          website: string | null
          latitude: number
          longitude: number
          created_at: string
          updated_at: string
          image_url: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          address: string
          city: string
          state: string
          zip_code: string
          phone?: string | null
          email?: string | null
          website?: string | null
          latitude: number
          longitude: number
          created_at?: string
          updated_at?: string
          image_url?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          address?: string
          state?: string
          city?: string
          zip_code?: string
          phone?: string | null
          email?: string | null
          website?: string | null
          latitude?: number
          longitude?: number
          created_at?: string
          updated_at?: string
          image_url?: string | null
        }
      }
      needs: {
        Row: {
          id: string
          shelter_id: string
          title: string
          description: string
          category: string
          quantity: number | null
          is_fulfilled: boolean
          priority: "low" | "medium" | "high" | "urgent" | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          shelter_id: string
          title: string
          description: string
          category: string
          quantity?: number | null
          is_fulfilled?: boolean
          priority?: "low" | "medium" | "high" | "urgent" | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          shelter_id?: string
          title?: string
          description?: string
          category?: string
          quantity?: number | null
          is_fulfilled?: boolean
          priority?: "low" | "medium" | "high" | "urgent" | null
          created_at?: string
          updated_at?: string
        }
      }
      donations: {
        Row: {
          id: string
          user_id: string | null
          need_id: string | null
          shelter_id: string
          donation_type: "item" | "money"
          amount: number | null
          item_description: string | null
          quantity: number | null
          status: "pending" | "confirmed" | "completed" | "cancelled"
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          need_id?: string | null
          shelter_id: string
          donation_type: "item" | "money"
          amount?: number | null
          item_description?: string | null
          quantity?: number | null
          status: "pending" | "confirmed" | "completed" | "cancelled"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          need_id?: string | null
          shelter_id?: string
          donation_type?: "item" | "money"
          amount?: number | null
          item_description?: string | null
          quantity?: number | null
          status?: "pending" | "confirmed" | "completed" | "cancelled"
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
