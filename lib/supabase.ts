// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl!, supabaseAnonKey!)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          partner_id: string | null
          created_at: string
        }
      }
      date_ideas: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          category: string | null
          cost_level: string | null
          created_at: string
        }
      }
      todos: {
        Row: {
          id: string
          user_id: string
          title: string
          is_shared: boolean
          assigned_to: string | null
          is_completed: boolean
          created_at: string
        }
      }
      events: {
        Row: {
          id: string
          user_id: string
          title: string
          date: string | null
          location: string | null
          created_at: string
        }
      }
      packing_items: {
        Row: {
          id: string
          event_id: string
          item_name: string
          assigned_to: string | null
          is_packed: boolean
          created_at: string
        }
      }
    }
  }
}
