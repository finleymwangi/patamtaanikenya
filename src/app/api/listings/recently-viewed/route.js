import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenant_id = searchParams.get("tenant_id");

    if (!tenant_id) {
      return Response.json({ error: "Tenant ID required." }, { status: 400 });
    }

    const { data: views, error } = await supabase
      .from("viewed_listings")
      .select("listing_id, created_at")
      .eq("viewer_key", tenant_id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) return Response.json({ error: error.message }, { status: 500 });

    if (!views || views.length === 0) {
      return Response.json({ success: true, viewed: [] });
    }

    const listingIds = [...new Set(views.map((v) => v.listing_id))];

    const { data: listings } = await supabase
      .from("listings")
      .select("*")
      .in("id", listingIds);

    const merged = views
      .map((v) => {
        const listing = (listings || []).find((l) => l.id === v.listing_id);
        return listing ? { ...listing, viewed_at: v.created_at } : null;
      })
      .filter(Boolean);

    return Response.json({ success: true, viewed: merged });

  } catch (error) {
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}