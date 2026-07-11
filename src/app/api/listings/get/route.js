import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const house_type = searchParams.get("house_type") || "";
    const min_price = searchParams.get("min_price") || "";
    const max_price = searchParams.get("max_price") || "";
    const verified_only = searchParams.get("verified_only") === "true";
    const landlord_id = searchParams.get("landlord_id") || "";

    let query = supabase
      .from("listings")
      .select("*, users(full_name, phone, is_verified)")
      .eq("status", "active")
      .order("is_boosted", { ascending: false })
      .order("created_at", { ascending: false });

    if (search) {
      query = query.or(`estate.ilike.%${search}%,location.ilike.%${search}%`);
    }

    if (house_type) {
      query = query.eq("house_type", house_type);
    }

    if (min_price) {
      query = query.gte("price", parseInt(min_price));
    }

    if (max_price) {
      query = query.lte("price", parseInt(max_price));
    }

    if (verified_only) {
      query = query.eq("is_verified", true);
    }

    if (landlord_id) {
      query = query.eq("landlord_id", landlord_id);
    }

    const { data: listings, error } = await query;

    if (error) {
      console.error("Get listings error:", error);
      return Response.json({ error: "Failed to fetch listings." }, { status: 500 });
    }

    return Response.json({ success: true, listings });

  } catch (error) {
    console.error("Listings error:", error);
    return Response.json({ error: error.message || "Something went wrong." }, { status: 500 });
  }
}