import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "nodejs"; // Or "edge", matching your environment.

/**
 * GET /api/admin/opportunities/[id]/files/[fileId]/access
 *   -> Returns an array of user_ids with access to this file
 *
 * PUT /api/admin/opportunities/[id]/files/[fileId]/access
 *   -> JSON body: { userIds: string[] }
 *      Rewrites entire `file_user_access` for this file
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string; fileId: string }> }
): Promise<NextResponse> {
  try {
    const params = await context.params;
    const { id: opportunityId, fileId } = params;
    if (!opportunityId || !fileId) {
      return NextResponse.json({ error: "Missing opportunityId or fileId" }, { status: 400 });
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

    // Check admin
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

    // Validate file belongs to given opportunity
    const { data: fileRecord, error: fileErr } = await supabaseAdmin
      .from("files")
      .select("id, opportunity_id")
      .eq("id", fileId)
      .single();
    if (fileErr || !fileRecord) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }
    if (fileRecord.opportunity_id !== opportunityId) {
      return NextResponse.json(
        { error: "File does not belong to this opportunity" },
        { status: 400 }
      );
    }

    // Fetch current access
    const { data, error: accessErr } = await supabaseAdmin
      .from("file_user_access")
      .select("user_id")
      .eq("file_id", fileId);
    if (accessErr) {
      throw accessErr;
    }

    const userIds = data.map((row) => row.user_id);
    return NextResponse.json(userIds);
  } catch (err) {
    console.error("GET File Access error:", err);
    return NextResponse.json({ error: "Failed to get file access" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string; fileId: string }> }
): Promise<NextResponse> {
  try {
    const params = await context.params;
    const { id: opportunityId, fileId } = params;
    if (!opportunityId || !fileId) {
      return NextResponse.json({ error: "Missing opportunityId or fileId" }, { status: 400 });
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

    // Check admin
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

    // Validate file's opportunity
    const { data: fileRecord, error: fileErr } = await supabaseAdmin
      .from("files")
      .select("id, opportunity_id")
      .eq("id", fileId)
      .single();
    if (fileErr || !fileRecord) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }
    if (fileRecord.opportunity_id !== opportunityId) {
      return NextResponse.json(
        { error: "File does not belong to this opportunity" },
        { status: 400 }
      );
    }

    // Remove old access
    await supabaseAdmin
      .from("file_user_access")
      .delete()
      .eq("file_id", fileId);

    // Insert new
    const rowsToInsert = userIds.map((uid: string) => ({
      file_id: fileId,
      user_id: uid,
    }));

    if (rowsToInsert.length > 0) {
      const { error: insertError } = await supabaseAdmin
        .from("file_user_access")
        .insert(rowsToInsert);
      if (insertError) {
        throw insertError;
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PUT File Access error:", err);
    return NextResponse.json({ error: "Failed to update file access" }, { status: 500 });
  }
}
