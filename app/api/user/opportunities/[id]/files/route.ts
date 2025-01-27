import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * GET /api/user/opportunities/[id]/files
 * Returns files for a given opportunity that the user can access,
 * enforced by RLS (public.get_user_file_access).
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const opportunityId = params.id;
    if (!opportunityId) {
      return NextResponse.json({ error: "Missing opportunityId" }, { status: 400 });
    }

    // 1) Use await so we get the actual cookies object
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("sb-access-token")?.value;
    const refreshToken = cookieStore.get("sb-refresh-token")?.value;

    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2) Create Supabase client with user session
    const supabase = createClient();
    await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken || "",
    });

    // 3) Check if user is logged in
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 4) Because of RLS, a normal user can only SELECT rows that pass the policy.
    //    So just query the 'files' table for that opportunity.
    const { data: files, error } = await supabase
      .from("files")
      .select("*")
      .eq("opportunity_id", opportunityId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching user-accessible files:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(files ?? []);
  } catch (err: unknown) {
    console.error("GET /api/user/opportunities/[id]/files error:", err);
    return NextResponse.json(
      { error: "Failed to get user-accessible files" },
      { status: 500 }
    );
  }
}
