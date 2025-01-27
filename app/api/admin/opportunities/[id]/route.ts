import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// For handling incoming image data from the form
interface ImageInput {
  image_url: string;
  caption?: string;
  details?: string;
  order_number: number;
}

interface ImageRecord extends ImageInput {
  id: string;
}

interface SectionWithImages {
  id: string;
  images?: ImageRecord[];
}

interface SectionData {
  section_type: string;
  custom_title?: string;
  custom_content?: string;
  order_number: number;
  images?: ImageInput[];
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const supabase = createClient();

    // Get access token from cookies
    const accessToken = cookieStore.get("sb-access-token")?.value;
    const refreshToken = cookieStore.get("sb-refresh-token")?.value;
    if (!accessToken) {
      return NextResponse.json({ error: "No access token found" }, { status: 401 });
    }

    // Set session manually
    await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken || "",
    });

    // Verify user is logged in
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Use service role client to confirm admin privileges
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

    // Fetch the opportunity with all sections & images
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
      .single();

    if (error) {
      console.error("Database error:", error);
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Opportunity not found" }, { status: 404 });
      }
      throw error;
    }

    if (!opportunity) {
      return NextResponse.json({ error: "Opportunity not found" }, { status: 404 });
    }

    return NextResponse.json(opportunity);
  } catch (error) {
    console.error("Error fetching opportunity:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error fetching opportunity" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const supabase = createClient();

    const accessToken = cookieStore.get("sb-access-token")?.value;
    const refreshToken = cookieStore.get("sb-refresh-token")?.value;
    if (!accessToken) {
      return NextResponse.json({ error: "No access token found" }, { status: 401 });
    }

    // Set session
    await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken || "",
    });

    // Parse the request body (including 'financial')
    const body = await request.json();
    const {
      title,
      location,
      visibility,
      external_url,
      external_platform,
      sections,
      financial,
    } = body;

    // Check user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify admin
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

    // 1) Update the main opportunity fields
    const { error: opportunityError } = await supabaseAdmin
      .from("investment_opportunities")
      .update({
        title,
        location,
        visibility,
        external_url,
        external_platform,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (opportunityError) throw opportunityError;

    // 2) Update sections, including handling of the 'financial' section data
    if (sections && Array.isArray(sections)) {
      for (const section of sections as SectionData[]) {
        // If this is the financial section, store the new financial object in custom_content
        if (section.section_type === "financial" && financial) {
          section.custom_content = JSON.stringify(financial);
        }

        // Check if this section already exists
        const { data: existingSection } = await supabaseAdmin
          .from("sections")
          .select(`id, images ( id, image_url )`)
          .eq("opportunity_id", id)
          .eq("section_type", section.section_type)
          .single();

        if (existingSection) {
          // Update the existing section row
          await supabaseAdmin
            .from("sections")
            .update({
              custom_title: section.custom_title,
              custom_content: section.custom_content,
              order_number: section.order_number,
              updated_at: new Date().toISOString(),
            })
            .eq("id", existingSection.id);

          // Manage images (inserts, deletes, updates)
          const typedExistingSection = existingSection as SectionWithImages;
          const existingImages = typedExistingSection.images || [];
          const existingImageUrls = existingImages.map((img) => img.image_url);
          const newImageUrls = (section.images || []).map((img) => img.image_url);

          // (a) Delete images that are no longer present
          const imagesToDelete = existingImages.filter(
            (img) => !newImageUrls.includes(img.image_url)
          );
          if (imagesToDelete.length > 0) {
            await supabaseAdmin
              .from("images")
              .delete()
              .in(
                "id",
                imagesToDelete.map((img) => img.id)
              );
          }

          // (b) Insert brand-new images
          const imagesToInsert = (section.images || []).filter(
            (img) => !existingImageUrls.includes(img.image_url)
          );
          if (imagesToInsert.length > 0) {
            await supabaseAdmin.from("images").insert(
              imagesToInsert.map((image: ImageInput) => ({
                section_id: existingSection.id,
                image_url: image.image_url,
                caption: image.caption,
                details: image.details,
                order_number: image.order_number,
              }))
            );
          }

          // (c) Update existing images (caption, details, order_number)
          const imagesToUpdate = (section.images || []).filter((img) =>
            existingImageUrls.includes(img.image_url)
          );
          for (const updatedImage of imagesToUpdate) {
            const oldImage = existingImages.find(
              (img) => img.image_url === updatedImage.image_url
            );
            if (!oldImage) continue;

            await supabaseAdmin
              .from("images")
              .update({
                caption: updatedImage.caption,
                details: updatedImage.details,
                order_number: updatedImage.order_number,
                updated_at: new Date().toISOString(),
              })
              .eq("id", oldImage.id);
          }
        } else {
          // This section doesn't exist yet; create a new one
          const { data: newSection, error: newSectionError } = await supabaseAdmin
            .from("sections")
            .insert({
              opportunity_id: id,
              section_type: section.section_type,
              custom_title: section.custom_title,
              custom_content: section.custom_content,
              order_number: section.order_number,
            })
            .select()
            .single();
          if (newSectionError) throw newSectionError;

          // If there are images, insert them
          if (newSection && section.images && section.images.length > 0) {
            await supabaseAdmin.from("images").insert(
              section.images.map((image: ImageInput) => ({
                section_id: newSection.id,
                image_url: image.image_url,
                caption: image.caption,
                details: image.details,
                order_number: image.order_number,
              }))
            );
          }
        }
      }
    }

    // 3) Return the complete updated opportunity record
    const { data: completeOpportunity, error: fetchError } = await supabaseAdmin
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
      .single();

    if (fetchError) throw fetchError;

    return NextResponse.json(completeOpportunity);
  } catch (error) {
    console.error("Error updating opportunity:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Error updating opportunity",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const supabase = createClient();

    const accessToken = cookieStore.get("sb-access-token")?.value;
    const refreshToken = cookieStore.get("sb-refresh-token")?.value;
    if (!accessToken) {
      return NextResponse.json({ error: "No access token found" }, { status: 401 });
    }
    await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken || "",
    });

    const json = await request.json();

    // Check current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Service role for admin
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

    // Update just the visibility (or any fields you allow via PATCH)
    const { data, error } = await supabaseAdmin
      .from("investment_opportunities")
      .update({
        visibility: json.visibility,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating opportunity:", error);
    return NextResponse.json(
      { error: "Error updating opportunity" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const supabase = createClient();

    const accessToken = cookieStore.get("sb-access-token")?.value;
    const refreshToken = cookieStore.get("sb-refresh-token")?.value;
    if (!accessToken) {
      return NextResponse.json({ error: "No access token found" }, { status: 401 });
    }
    await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken || "",
    });

    // Check current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Confirm admin
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

    // Delete the opportunity
    const { error } = await supabaseAdmin
      .from("investment_opportunities")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting opportunity:", error);
    return NextResponse.json(
      { error: "Error deleting opportunity" },
      { status: 500 }
    );
  }
}
