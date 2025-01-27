import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "nodejs";

/**
 * POST /api/admin/files/upload
 * Handles file upload to Supabase Storage (any file type) and
 * inserts a row into the `files` table with metadata.
 */
export async function POST(request: Request) {
  try {
    // Use 'await' because in your environment cookies() might be returning a Promise
    const cookieStore = await cookies();
    const supabase = createClient();
    const supabaseAdmin = createClient(true);

    // Check user session from cookies
    const accessToken = cookieStore.get("sb-access-token")?.value;
    const refreshToken = cookieStore.get("sb-refresh-token")?.value;

    if (!accessToken) {
      return NextResponse.json({ error: "No access token found" }, { status: 401 });
    }

    // Set session in Supabase client
    await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken || "",
    });

    // Check if user is logged in
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if the user is an admin
    const { data: adminProfile } = await supabaseAdmin
      .from("admin_profiles")
      .select("id")
      .eq("id", user.id)
      .single();

    if (!adminProfile) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    // Parse the multipart form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const metadataStr = formData.get("metadata") as string | null;
    const metadata = metadataStr ? JSON.parse(metadataStr) : {};

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Prepare values from metadata or file
    const { name, size, visibility, opportunityId } = metadata;
    const originalName = (name as string) || file.name;
    const fileSize = (size as number) || file.size || 0;
    const fileVisibility = (visibility as string) || "all";
    const opportunity_id = (opportunityId as string) || null;

    // Convert the File to a Buffer so we can upload to Storage
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Construct a unique path in Storage
    const uniqueFileName = `${Date.now()}-${file.name}`;
    const storagePath = `files/${uniqueFileName}`;

    // Upload to your "opportunity-files" bucket (ensure it exists in Supabase)
    const { data: uploadData, error: storageError } = await supabaseAdmin.storage
      .from("opportunity-files")
      .upload(storagePath, buffer, {
        upsert: false,
        contentType: file.type || "application/octet-stream",
      });

    if (storageError) {
      console.error("Storage error:", storageError);
      return NextResponse.json(
        { error: "Failed to upload file: " + storageError.message },
        { status: 500 }
      );
    }

    // Construct a public URL
    const { data: publicUrlData } = supabaseAdmin.storage
      .from("opportunity-files")
      .getPublicUrl(uploadData.path);

    if (!publicUrlData?.publicUrl) {
      return NextResponse.json(
        { error: "Failed to generate public URL for file" },
        { status: 500 }
      );
    }

    // Insert the new file record into the `files` table
    const { data: newFile, error: dbError } = await supabaseAdmin
      .from("files")
      .insert({
        opportunity_id,
        name: originalName,
        size: fileSize,
        url: publicUrlData.publicUrl,
        visibility: fileVisibility, // 'all', 'opportunity_viewers', or 'specific_users'
        uploaded_by: adminProfile.id,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Error inserting file record:", dbError);
      return NextResponse.json(
        { error: "Failed to save file record to DB" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      publicUrl: newFile.url,
      filePath: uploadData.path,
      fileRecord: newFile,
    });
  } catch (error: unknown) {
    console.error("File upload error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
