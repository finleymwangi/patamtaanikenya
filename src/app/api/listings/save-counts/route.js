import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const landlord_id = searchParams.get("landlord_id");

    if (!landlord_id) {
      return Response.json({ error: "Landlord ID required." }, { status: 400 });
    }

    // Get all listing IDs for this landlord
    const { data: listings } = await supabase
      .from("listings")
      .select("id")
      .eq("landlord_id", landlord_id);

    if (!listings || listings.length === 0) {
      return Response.json({ success: true, counts: {} });
    }

    const listingIds = listings.map((l) => l.id);

    // Count saves for each listing
    const { data: saves } = await supabase
      .from("saved_listings")
      .select("listing_id")
      .in("listing_id", listingIds);

    const counts = {};
    (saves || []).forEach((save) => {
      counts[save.listing_id] = (counts[save.listing_id] || 0) + 1;
    });

    return Response.json({ success: true, counts });

  } catch (error) {
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}