import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET() {
  try {
    const { data: listings, error } = await supabase
      .from("listings")
      .select("*, users(full_name, email, phone, is_verified)")
      .order("created_at", { ascending: false });

    if (error) return Response.json({ error: error.message }, { status: 500 });

    const listingIds = listings.map((l) => l.id);

    const { data: saves } = await supabase
      .from("saved_listings")
      .select("listing_id")
      .in("listing_id", listingIds.length > 0 ? listingIds : ["none"]);

    const saveCounts = {};
    (saves || []).forEach((s) => {
      saveCounts[s.listing_id] = (saveCounts[s.listing_id] || 0) + 1;
    });

    const merged = listings.map((l) => ({ ...l, save_count: saveCounts[l.id] || 0 }));

    return Response.json({ success: true, listings: merged });

  } catch (error) {
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}