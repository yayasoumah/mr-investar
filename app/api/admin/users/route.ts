import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createClient(true) // Use service role

    const { data: users, error } = await supabase
      .from("user_profiles")
      .select(`
        id,
        first_name,
        last_name,
        date_of_birth,
        nationality,
        location,
        updated_at,
        user_types:user_to_user_type(
          user_type:user_types(
            name
          )
        )
      `)
      .order("updated_at", { ascending: false })

    if (error) throw error

    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    )
  }
}
