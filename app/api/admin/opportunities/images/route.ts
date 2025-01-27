import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import sharp from "sharp";

// Force Node.js runtime for sharp
export const runtime = "nodejs";

/**
 * POST /api/admin/opportunities/images
 * Handles file upload to Supabase Storage with image optimization.
 */
export async function POST(request: Request) {
  try {
    // Use service role client for storage ops
    const supabaseAdmin = createClient(true);

    // Parse the multipart/form-data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const metadataStr = formData.get("metadata") as string | null;
    const metadata = metadataStr ? JSON.parse(metadataStr) : {};

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert File to Buffer for sharp
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Optimize image with sharp
    const optimizedBuffer = await sharp(buffer)
      .jpeg({ quality: 80, progressive: true }) // Convert to progressive JPEG
      .resize(2000, 2000, { // Max dimensions
        fit: 'inside',
        withoutEnlargement: true
      })
      .toBuffer();

    // Construct a unique path in Storage
    const timeStamp = Date.now();
    const randomPart = Math.random().toString(36).slice(2, 8);
    const uniquePath = `uploads/${timeStamp}-${randomPart}.jpg`;

    // Upload optimized image to Supabase Storage
    const { data: uploadData, error: storageError } = await supabaseAdmin.storage
      .from("opportunity-images")
      .upload(uniquePath, optimizedBuffer, {
        contentType: "image/jpeg",
        upsert: false
      });

    if (storageError) {
      console.error("Storage error:", storageError);
      return NextResponse.json(
        { error: "Failed to upload image: " + storageError.message },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: publicUrlData } = supabaseAdmin.storage
      .from("opportunity-images")
      .getPublicUrl(uploadData.path);

    if (!publicUrlData?.publicUrl) {
      return NextResponse.json(
        { error: "Failed to generate public URL" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      publicUrl: publicUrlData.publicUrl,
      id: uploadData.path,
      ...metadata
    });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to process image upload" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/opportunities/images
 * Optional: if you also create a DB record for the uploaded image. 
 * Currently inserts a row into the "images" table with provided fields.
 */
export async function PUT(request: Request) {
  try {
    // Auth client for user check
    const supabase = createClient();
    // Service role client for DB ops
    const supabaseAdmin = createClient(true);

    const { section_id, image_url, caption, details, order_number } =
      await request.json();

    // Check user auth
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!section_id || !image_url) {
      return NextResponse.json(
        { error: "Missing required fields: section_id, image_url." },
        { status: 400 }
      );
    }

    // Insert a new row in "images"
    const { data: image, error: dbError } = await supabaseAdmin
      .from("images")
      .insert({
        section_id,
        image_url,
        caption,
        details,
        order_number,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        { error: "Failed to save image record to DB." },
        { status: 500 }
      );
    }

    return NextResponse.json(image);
  } catch (error) {
    console.error("Error saving image to DB:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
