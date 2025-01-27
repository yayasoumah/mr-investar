import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "nodejs"; // Or "edge" if needed. Ensure you match your environment.

/**
 * GET /api/admin/opportunities/[id]/access
 *   -> Returns a list of user_ids that have access to this opportunity (private_investment_access)
 *
 * PUT /api/admin/opportunities/[id]/access
 *   -> Receives JSON: { userIds: string[] }
 *      Replaces entire access list for this opportunity
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const opportunityId = params.id;
    if (!opportunityId) {
      return NextResponse.json({ error: "Missing opportunity ID" }, { status: 400 });
    }

    // In some setups, cookies() returns a Promise<ReadonlyRequestCookies>
    // so we await it to get the actual cookies object:
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("sb-access-token")?.value;
    const refreshToken = cookieStore.get("sb-refresh-token")?.value;

    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Auth
    const supabase = createClient();
    await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken || "",
    });

    // Confirm admin
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabaseAdmin = createClient(true);
    const { data: adminProfile } = await supabaseAdmin
      .from("admin_profiles")
      .select("id")
      .eq("id", user.id)
      .single();
    if (!adminProfile) {
      return NextResponse.json({ error: "Admin only" }, { status: 403 });
    }

    // Fetch user_ids with access
    const { data, error } = await supabaseAdmin
      .from("private_investment_access")
      .select("user_id")
      .eq("opportunity_id", opportunityId);
    if (error) {
      throw error;
    }

    const userIds = data.map((row) => row.user_id);
    return NextResponse.json(userIds);
  } catch (err) {
    console.error("GET Opportunity Access error:", err);
    return NextResponse.json({ error: "Failed to get access list" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const opportunityId = params.id;
    if (!opportunityId) {
      return NextResponse.json({ error: "Missing opportunity ID" }, { status: 400 });
    }

    const { userIds } = await request.json();
    if (!Array.isArray(userIds)) {
      return NextResponse.json({ error: "userIds must be an array" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("sb-access-token")?.value;
    const refreshToken = cookieStore.get("sb-refresh-token")?.value;

    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Auth
    const supabase = createClient();
    await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken || "",
    });

    // Confirm admin
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabaseAdmin = createClient(true);
    const { data: adminProfile } = await supabaseAdmin
      .from("admin_profiles")
      .select("id")
      .eq("id", user.id)
      .single();
    if (!adminProfile) {
      return NextResponse.json({ error: "Admin only" }, { status: 403 });
    }

    // Remove old access
    await supabaseAdmin
      .from("private_investment_access")
      .delete()
      .eq("opportunity_id", opportunityId);

    // Insert new
    const rowsToInsert = userIds.map((uid: string) => ({
      opportunity_id: opportunityId,
      user_id: uid,
    }));

    if (rowsToInsert.length > 0) {
      const { error: insertError } = await supabaseAdmin
        .from("private_investment_access")
        .insert(rowsToInsert);
      if (insertError) {
        throw insertError;
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PUT Opportunity Access error:", err);
    return NextResponse.json({ error: "Failed to update access" }, { status: 500 });
  }
}
