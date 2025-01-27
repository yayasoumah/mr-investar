import { createClient } from '@supabase/supabase-js';
import { NextResponse } from "next/server";

// Initialize Supabase client with public anon key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    console.log("[GET] Fetching featured opportunities...");
    
    // Fetch only active opportunities, limited to 6 for the landing page
    const { data: opportunities, error } = await supabase
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
      .in("visibility", ["active", "coming_soon"])
      .order("created_at", { ascending: false })
      .limit(6);

    if (error) {
      console.error("[GET] Error fetching opportunities:", error);
      return NextResponse.json({ error: "Failed to fetch opportunities" }, { status: 500 });
    }

    if (!opportunities) {
      console.log("[GET] No opportunities found");
      return NextResponse.json({ error: "No opportunities found" }, { status: 404 });
    }

    console.log("[GET] Featured opportunities fetched successfully");
    return NextResponse.json(opportunities);
  } catch (error) {
    console.error("[GET] Error in featured opportunities route:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
