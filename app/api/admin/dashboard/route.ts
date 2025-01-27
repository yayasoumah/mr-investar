import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createClient(true)

    // Fetch counts
    const [
      { count: totalOpportunities },
      { count: totalUsers },
      { count: activeOpportunities },
    ] = await Promise.all([
      supabase.from("investment_opportunities").select("*", { count: "exact" }),
      supabase.from("user_profiles").select("*", { count: "exact" }),
      supabase
        .from("investment_opportunities")
        .select("*", { count: "exact" })
        .eq("visibility", "active"),
    ])

    // Fetch recent opportunities
    const { data: recentOpportunities } = await supabase
      .from("investment_opportunities")
      .select(`
        id,
        title,
        visibility,
        location,
        updated_at
      `)
      .order("updated_at", { ascending: false })
      .limit(5)

    // Fetch recent users
    const { data: recentUsers } = await supabase
      .from("user_profiles")
      .select(`
        id,
        first_name,
        last_name,
        nationality,
        updated_at,
        user_types:user_to_user_type(
          user_type:user_types(
            name
          )
        )
      `)
      .order("updated_at", { ascending: false })
      .limit(5)

    return NextResponse.json({
      stats: {
        totalOpportunities: totalOpportunities || 0,
        totalUsers: totalUsers || 0,
        activeOpportunities: activeOpportunities || 0,
      },
      recentOpportunities: recentOpportunities || [],
      recentUsers: recentUsers || [],
    })
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    )
  }
}
