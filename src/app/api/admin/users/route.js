import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET() {
  try {
    const { data: users, error } = await supabase
      .from("users")
      .select("id, full_name, email, phone, role, is_verified, email_verified, created_at, last_login, verified_at")
      .order("created_at", { ascending: false });

    if (error) return Response.json({ error: error.message }, { status: 500 });

    const landlordIds = users.filter((u) => u.role === "landlord").map((u) => u.id);
    const tenantIds = users.filter((u) => u.role === "tenant").map((u) => u.id);

    const { data: listings } = await supabase
      .from("listings")
      .select("landlord_id")
      .in("landlord_id", landlordIds.length > 0 ? landlordIds : ["none"]);

    const { data: saved } = await supabase
      .from("saved_listings")
      .select("tenant_id")
      .in("tenant_id", tenantIds.length > 0 ? tenantIds : ["none"]);

    const listingCounts = {};
    (listings || []).forEach((l) => {
      listingCounts[l.landlord_id] = (listingCounts[l.landlord_id] || 0) + 1;
    });

    const savedCounts = {};
    (saved || []).forEach((s) => {
      savedCounts[s.tenant_id] = (savedCounts[s.tenant_id] || 0) + 1;
    });

    const merged = users.map((u) => ({
      ...u,
      listing_count: listingCounts[u.id] || 0,
      saved_count: savedCounts[u.id] || 0,
    }));

    return Response.json({ success: true, users: merged });

  } catch (error) {
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}