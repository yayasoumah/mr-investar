import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "nodejs";

type FileVisibility = "all" | "opportunity_viewers" | "specific_users";

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string; fileId: string }> }
): Promise<NextResponse> {
  try {
    const params = await context.params;
    const { id: opportunityId, fileId } = params;
    if (!opportunityId || !fileId) {
      return NextResponse.json(
        { error: "Missing opportunityId or fileId" },
        { status: 400 }
      );
    }

    const { visibility } = (await request.json()) as {
      visibility: FileVisibility;
    };

    if (!visibility || !["all", "opportunity_viewers", "specific_users"].includes(visibility)) {
      return NextResponse.json(
        { error: "Invalid visibility value" },
        { status: 400 }
      );
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

    // Update visibility
    const { error: updateErr } = await supabaseAdmin
      .from("files")
      .update({ visibility })
      .eq("id", fileId);

    if (updateErr) {
      throw updateErr;
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PUT File Visibility error:", err);
    return NextResponse.json(
      { error: "Failed to update file visibility" },
      { status: 500 }
    );
  }
}
