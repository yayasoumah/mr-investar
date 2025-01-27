import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Wait for params to be available
    const { id } = await context.params;

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

    console.log(`[GET] Fetching opportunity details for ID: ${id}`);

    const { data: opportunity, error } = await supabaseAdmin
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
      .eq("id", id)
      .in("visibility", ["active", "concluded"])
      .single();

    if (error) {
      console.error("[GET] Error fetching opportunity:", error);
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Opportunity not found" }, { status: 404 });
      }
      return NextResponse.json({ error: "Failed to fetch opportunity" }, { status: 500 });
    }

    console.log("[GET] Opportunity details fetched successfully");
    return NextResponse.json(opportunity);
  } catch (error) {
    console.error("[GET] Error in preview opportunity detail route:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
