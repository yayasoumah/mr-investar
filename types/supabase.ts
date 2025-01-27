export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          first_name: string | null
          last_name: string | null
          date_of_birth: string | null
          nationality: string | null
          location: Json | null
          updated_at: string | null
        }
        Insert: {
          id: string
          first_name?: string | null
          last_name?: string | null
          date_of_birth?: string | null
          nationality?: string | null
          location?: Json | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          first_name?: string | null
          last_name?: string | null
          date_of_birth?: string | null
          nationality?: string | null
          location?: Json | null
          updated_at?: string | null
        }
      }
      user_to_user_type: {
        Row: {
          user_id: string
          user_type_id: number
        }
        Insert: {
          user_id: string
          user_type_id: number
        }
        Update: {
          user_id?: string
          user_type_id?: number
        }
      }
      user_types: {
        Row: {
          id: number
          name: string
          description: string | null
        }
        Insert: {
          id?: never // Auto-generated
          name: string
          description?: string | null
        }
        Update: {
          id?: never
          name?: string
          description?: string | null
        }
      }
      admin_profiles: {
        Row: {
          id: string
          first_name: string | null
          last_name: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          first_name?: string | null
          last_name?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          first_name?: string | null
          last_name?: string | null
          updated_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 