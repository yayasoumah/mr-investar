import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

interface SectionImage {
  image_url: string;
  caption?: string;
  details?: string;
  order_number: number;
}

interface Section {
  section_type: string;
  images?: SectionImage[];
  custom_title?: string;
  custom_content?: string;
  order_number: number;
}

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

    console.log("[GET] Fetching opportunities with sections and images...");

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
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[GET] Error fetching opportunities:", error);
      throw error;
    }

    console.log("[GET] Opportunities fetched successfully. Sample data:");
    opportunities?.slice(0, 2).forEach((opp, index) => {
      console.log(`\nOpportunity ${index + 1}:`, JSON.stringify({
        id: opp.id,
        title: opp.title,
        sections_count: opp.sections?.length,
        sections: opp.sections?.map((section: Section) => ({
          type: section.section_type,
          images_count: section.images?.length,
          sample_image: section.images?.[0] ? {
            url: section.images[0].image_url,
            caption: section.images[0].caption,
            details: section.images[0].details,
          } : null
        }))
      }, null, 2));
    });

    return NextResponse.json(opportunities);
  } catch (error) {
    console.error("[GET] Error in opportunities route:", error);
    return NextResponse.json(
      { error: "Error fetching opportunities" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
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

    const requestData = await request.json();
    console.log("[POST] Creating new opportunity with data:", {
      title: requestData.title,
      sections_count: requestData.sections?.length,
      sections: requestData.sections?.map((section: Section) => ({
        type: section.section_type,
        images_count: section.images?.length,
        sample_image: section.images?.[0] ? {
          url: section.images[0].image_url,
          caption: section.images[0].caption,
          details: section.images[0].details,
        } : null
      }))
    });

    const { sections, financial, ...opportunityData } = requestData;

    // Create opportunity and get its ID
    const { data: opportunity, error: opportunityError } = await supabaseAdmin
      .from("investment_opportunities")
      .insert([{ ...opportunityData, admin_id: user.id }])
      .select()
      .single();

    if (opportunityError) {
      console.error("[POST] Error creating opportunity:", opportunityError);
      throw opportunityError;
    }

    console.log("[POST] Opportunity created successfully, creating sections...");

    // Create sections and their images
    for (const section of sections as Section[]) {
      console.log(`[POST] Processing section of type: ${section.section_type}`);
      
      // If this is a financial section, structure the data properly
      const sectionData = section.section_type === 'financial' ? {
        ...section,
        custom_title: section.custom_title || 'Financial Information',
        custom_content: JSON.stringify(financial || {}),
      } : {
        ...section,
        custom_title: section.custom_title || '',
        custom_content: section.custom_content || '',
      };

      // Create section
      const { data: createdSection, error: sectionError } = await supabaseAdmin
        .from("sections")
        .insert([{
          opportunity_id: opportunity.id,
          section_type: sectionData.section_type,
          custom_title: sectionData.custom_title,
          custom_content: sectionData.custom_content,
          order_number: sectionData.order_number,
        }])
        .select()
        .single();

      if (sectionError) {
        console.error("[POST] Error creating section:", sectionError);
        // Rollback by deleting the opportunity
        await supabaseAdmin
          .from("investment_opportunities")
          .delete()
          .eq("id", opportunity.id);
        throw sectionError;
      }

      console.log(`[POST] Section created successfully, processing ${section.images?.length || 0} images...`);

      // Create images for this section if any
      if (section.images && section.images.length > 0) {
        const imageData = section.images.map((image: SectionImage) => ({
          section_id: createdSection.id,
          image_url: image.image_url,
          caption: image.caption || '',
          details: image.details || '',
          order_number: image.order_number,
        }));

        console.log("[POST] Inserting images with data:", imageData);

        const { error: imagesError } = await supabaseAdmin
          .from("images")
          .insert(imageData);

        if (imagesError) {
          console.error("[POST] Error creating images:", imagesError);
          // Rollback by deleting the opportunity
          await supabaseAdmin
            .from("investment_opportunities")
            .delete()
            .eq("id", opportunity.id);
          throw imagesError;
        }
      }
    }

    // Fetch the complete opportunity data
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
      .eq("id", opportunity.id)
      .single();

    if (fetchError) {
      console.error("[POST] Error fetching complete opportunity:", fetchError);
      throw fetchError;
    }

    console.log("[POST] Complete opportunity data:", JSON.stringify({
      id: completeOpportunity.id,
      title: completeOpportunity.title,
      sections_count: completeOpportunity.sections?.length,
      sections: completeOpportunity.sections?.map((section: Section) => ({
        type: section.section_type,
        images_count: section.images?.length,
        sample_image: section.images?.[0] ? {
          url: section.images[0].image_url,
          caption: section.images[0].caption,
          details: section.images[0].details,
        } : null
      }))
    }, null, 2));

    return NextResponse.json(completeOpportunity);
  } catch (error) {
    console.error("[POST] Error in opportunity creation:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error creating opportunity" },
      { status: 500 }
    );
  }
}