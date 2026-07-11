import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get("user_id");

    if (!user_id) return Response.json({ error: "User ID required." }, { status: 400 });

    const { data: user } = await supabase
      .from("users")
      .select("id, full_name, email, phone, role, is_verified, email_verified, created_at, last_login, verified_at")
      .eq("id", user_id)
      .single();

    if (!user) return Response.json({ error: "User not found." }, { status: 404 });

    let listings = [];
    let savedListings = [];
    let recentlyViewed = [];
    let reports = [];
    let filedReports = [];

    if (user.role === "landlord") {
      const { data: l } = await supabase
        .from("listings")
        .select("*")
        .eq("landlord_id", user_id)
        .order("created_at", { ascending: false });
      listings = l || [];

      const listingIds = listings.map((x) => x.id);

      const { data: saves } = await supabase
        .from("saved_listings")
        .select("listing_id")
        .in("listing_id", listingIds.length > 0 ? listingIds : ["none"]);

      const saveCounts = {};
      (saves || []).forEach((s) => {
        saveCounts[s.listing_id] = (saveCounts[s.listing_id] || 0) + 1;
      });
      listings = listings.map((l) => ({ ...l, save_count: saveCounts[l.id] || 0 }));

      const { data: r } = await supabase
        .from("reports")
        .select("*, listings(location, house_type)")
        .in("listing_id", listingIds.length > 0 ? listingIds : ["none"])
        .order("created_at", { ascending: false });
      reports = r || [];
    }

    if (user.role === "tenant") {
      const { data: sl } = await supabase
        .from("saved_listings")
        .select("listing_id, created_at, listings(id, location, house_type, price, photos, status)")
        .eq("tenant_id", user_id)
        .order("created_at", { ascending: false });
      savedListings = sl || [];

      const { data: rv } = await supabase
        .from("viewed_listings")
        .select("listing_id, created_at, listings(id, location, house_type, price, photos)")
        .eq("viewer_key", user_id)
        .order("created_at", { ascending: false })
        .limit(10);
      recentlyViewed = rv || [];

      const { data: fr } = await supabase
        .from("reports")
        .select("*, listings(location, house_type)")
        .eq("reported_by", user_id)
        .order("created_at", { ascending: false });
      filedReports = fr || [];
    }

    return Response.json({
      success: true,
      user,
      listings,
      savedListings,
      recentlyViewed,
      reports,
      filedReports,
    });

  } catch (error) {
    console.error("Profile error:", error);
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}