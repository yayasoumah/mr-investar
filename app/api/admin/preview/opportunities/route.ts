import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const supabase = createClient();
    
    // Get access token from cookie
    const accessToken = cookieStore.get('sb-access-token')?.value;
    const refreshToken = cookieStore.get('sb-refresh-token')?.value;
    
    if (!accessToken) {
      return NextResponse.json({ error: "No access token found" }, { status: 401 });
    }

    // Set session manually
    await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken || "",
    });

    // Check authentication
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Use service role client for admin operations
    const supabaseAdmin = createClient(true);

    const { data: adminProfile } = await supabaseAdmin
      .from("admin_profiles")
      .select("id")
      .eq("id", user.id)
      .single();

    if (!adminProfile) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    console.log("[GET] Fetching opportunities for preview...");

    const { data: opportunities, error } = await supabaseAdmin
      .from("investment_opportunities")
      .select(`
        *,
        sections (
          id,
          section_type,
          custom_title,
          custom_content,
          order_number,
          images (
            id,
            image_url,
            caption,
            details,
            order_number
          )
        )
      `)
      .in("visibility", ["active", "concluded"])
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[GET] Error fetching opportunities:", error);
      return NextResponse.json({ error: "Failed to fetch opportunities" }, { status: 500 });
    }

    console.log("[GET] Preview opportunities fetched successfully");
    return NextResponse.json(opportunities);
  } catch (error) {
    console.error("[GET] Error in preview opportunities route:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
