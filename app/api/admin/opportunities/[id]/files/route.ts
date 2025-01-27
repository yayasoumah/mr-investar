import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * GET /api/admin/opportunities/[id]/files
 *  - Lists all files associated with the specified opportunity ID.
 *
 * DELETE /api/admin/opportunities/[id]/files?fileId=XYZ
 *  - Deletes the specified file from DB + Storage.
 */
export async function GET(
  request: NextRequest,
  // Note the signature: we're telling Next.js that "params" is a Promise
  // so we need to await it inside the function
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Actually await the params
    const { id } = await context.params;

    const cookieStore = await cookies();
    const supabase = createClient();
    const supabaseAdmin = createClient(true);

    // Check auth
    const accessToken = cookieStore.get("sb-access-token")?.value;
    const refreshToken = cookieStore.get("sb-refresh-token")?.value;
    if (!accessToken) {
      return NextResponse.json({ error: "No access token found" }, { status: 401 });
    }
    await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken || "",
    });

    // Make sure user is admin
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: adminProfile } = await supabaseAdmin
      .from("admin_profiles")
      .select("id")
      .eq("id", user.id)
      .single();
    if (!adminProfile) {
      return NextResponse.json({ error: "Admin required" }, { status: 403 });
    }

    // Fetch files for this opportunity
    const { data: files, error } = await supabaseAdmin
      .from("files")
      .select("*")
      .eq("opportunity_id", id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching files:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(files ?? []);
  } catch (error: unknown) {
    console.error("Error in GET files:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  // If you don't need to read `id` from the route for the DELETE logic,
  // you can omit the second parameter or specify but not destructure it.
  // Here, we omit it since we only use fileId from query string:
  //   context: { params: Promise<{ id: string }> }
) {
  try {
    // Grab fileId from query params
    const url = new URL(request.url);
    const fileId = url.searchParams.get("fileId");
    if (!fileId) {
      return NextResponse.json({ error: "fileId is required" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const supabase = createClient();
    const supabaseAdmin = createClient(true);

    const accessToken = cookieStore.get("sb-access-token")?.value;
    const refreshToken = cookieStore.get("sb-refresh-token")?.value;
    if (!accessToken) {
      return NextResponse.json({ error: "No access token found" }, { status: 401 });
    }
    await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken || "",
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: adminProfile } = await supabaseAdmin
      .from("admin_profiles")
      .select("id")
      .eq("id", user.id)
      .single();

    if (!adminProfile) {
      return NextResponse.json({ error: "Admin required" }, { status: 403 });
    }

    // Fetch file record
    const { data: existingFile, error: fetchError } = await supabaseAdmin
      .from("files")
      .select("*")
      .eq("id", fileId)
      .single();

    if (fetchError || !existingFile) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Remove from Storage
    const publicUrl = existingFile.url as string;
    const prefix = "/storage/v1/object/public/opportunity-files/";
    const index = publicUrl.indexOf(prefix);
    let storagePath = "";
    if (index > -1) {
      storagePath = publicUrl.substring(index + prefix.length);
    }

    if (storagePath) {
      const { error: removeError } = await supabaseAdmin.storage
        .from("opportunity-files")
        .remove([storagePath]);
      if (removeError) {
        console.error("Error removing file from storage:", removeError);
      }
    }

    // Delete DB record
    const { error: deleteError } = await supabaseAdmin
      .from("files")
      .delete()
      .eq("id", fileId);

    if (deleteError) {
      throw deleteError;
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Error deleting file:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
