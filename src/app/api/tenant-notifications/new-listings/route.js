import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  try {
    const { tenant_id } = await request.json();

    if (!tenant_id) {
      return Response.json({ error: "Tenant ID required." }, { status: 400 });
    }

    // Get all listings the tenant has viewed
    const { data: viewed } = await supabase
      .from("viewed_listings")
      .select("listing_id")
      .eq("viewer_key", tenant_id);

    if (!viewed || viewed.length === 0) {
      return Response.json({ success: true, notified: 0 });
    }

    const viewedIds = [...new Set(viewed.map((v) => v.listing_id))];

    // Get details of those listings to find estates/locations
    const { data: viewedListings } = await supabase
      .from("listings")
      .select("id, estate, location")
      .in("id", viewedIds);

    if (!viewedListings || viewedListings.length === 0) {
      return Response.json({ success: true, notified: 0 });
    }

    const estates = [...new Set(viewedListings.map((l) => l.estate).filter(Boolean))];
    const locations = [...new Set(viewedListings.map((l) => l.location).filter(Boolean))];

    // Get notifications already sent to this tenant to avoid duplicates
    const { data: existingNotifs } = await supabase
      .from("tenant_notifications")
      .select("listing_id")
      .eq("tenant_id", tenant_id)
      .eq("type", "new_listing_in_area");

    const alreadyNotifiedIds = new Set((existingNotifs || []).map((n) => n.listing_id));

    // Find new listings in those estates (posted in the last 7 days, not already seen)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: newListings } = await supabase
      .from("listings")
      .select("id, estate, location, house_type, price, apartment_name")
      .in("estate", estates.length > 0 ? estates : ["none"])
      .eq("status", "active")
      .gte("created_at", sevenDaysAgo.toISOString())
      .not("id", "in", `(${viewedIds.join(",")})`);

    const toNotify = (newListings || []).filter((l) => !alreadyNotifiedIds.has(l.id));

    if (toNotify.length === 0) {
      return Response.json({ success: true, notified: 0 });
    }

    // Create notifications
    const notifications = toNotify.map((l) => ({
      tenant_id,
      type: "new_listing_in_area",
      listing_id: l.id,
      message: `New ${(l.house_type || "listing").replace(/_/g, " ")} posted in ${l.estate || l.location} — Ksh ${(l.price || 0).toLocaleString()}/mo. Check it out!`,
    }));

    await supabase.from("tenant_notifications").insert(notifications);

    return Response.json({ success: true, notified: notifications.length });

  } catch (error) {
    console.error("New listings notification error:", error);
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}