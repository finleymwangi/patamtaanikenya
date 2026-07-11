import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function daysAgo(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

export async function GET() {
  try {
    // Run all independent queries in parallel
    const [
      { count: totalUsers },
      { count: totalLandlords },
      { count: totalTenants },
      { count: newUsers1d },
      { count: newUsers7d },
      { count: newUsers30d },
      { count: newTenants1d },
      { count: newTenants7d },
      { count: newTenants30d },
      { count: newLandlords1d },
      { count: newLandlords7d },
      { count: newLandlords30d },
      { count: totalListings },
      { count: activeListings },
      { count: newListings7d },
      { count: pendingVerifications },
      { count: pendingReports },
      { count: totalReports },
      { count: unreadMessages },
      { count: deadListings },
      { data: allPayments },
      { data: savedData },
      { data: allListings },
      { data: estateListings },
      { data: mostViewedData },
    ] = await Promise.all([
      supabase.from("users").select("id", { count: "exact", head: true }),
      supabase.from("users").select("id", { count: "exact", head: true }).eq("role", "landlord"),
      supabase.from("users").select("id", { count: "exact", head: true }).eq("role", "tenant"),
      supabase.from("users").select("id", { count: "exact", head: true }).gte("created_at", daysAgo(1)),
      supabase.from("users").select("id", { count: "exact", head: true }).gte("created_at", daysAgo(7)),
      supabase.from("users").select("id", { count: "exact", head: true }).gte("created_at", daysAgo(30)),
      supabase.from("users").select("id", { count: "exact", head: true }).eq("role", "tenant").gte("created_at", daysAgo(1)),
      supabase.from("users").select("id", { count: "exact", head: true }).eq("role", "tenant").gte("created_at", daysAgo(7)),
      supabase.from("users").select("id", { count: "exact", head: true }).eq("role", "tenant").gte("created_at", daysAgo(30)),
      supabase.from("users").select("id", { count: "exact", head: true }).eq("role", "landlord").gte("created_at", daysAgo(1)),
      supabase.from("users").select("id", { count: "exact", head: true }).eq("role", "landlord").gte("created_at", daysAgo(7)),
      supabase.from("users").select("id", { count: "exact", head: true }).eq("role", "landlord").gte("created_at", daysAgo(30)),
      supabase.from("listings").select("id", { count: "exact", head: true }),
      supabase.from("listings").select("id", { count: "exact", head: true }).eq("status", "active"),
      supabase.from("listings").select("id", { count: "exact", head: true }).gte("created_at", daysAgo(7)),
      supabase.from("verification_requests").select("id", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("reports").select("id", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("reports").select("id", { count: "exact", head: true }),
      supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("is_read", false),
      supabase.from("listings").select("id", { count: "exact", head: true }).eq("views", 0),
      supabase.from("payments").select("amount, created_at").eq("status", "completed"),
      supabase.from("saved_listings").select("listing_id"),
      supabase.from("listings").select("landlord_id"),
      supabase.from("listings").select("estate"),
      supabase.from("listings").select("id, location, apartment_name, house_type, views, photos").order("views", { ascending: false }).limit(1),
    ]);

    // Revenue calculations
    const totalRevenue = (allPayments || []).reduce((sum, p) => sum + (p.amount || 0), 0);
    const revenue1d = (allPayments || []).filter(p => new Date(p.created_at) >= new Date(daysAgo(1))).reduce((sum, p) => sum + (p.amount || 0), 0);
    const revenue7d = (allPayments || []).filter(p => new Date(p.created_at) >= new Date(daysAgo(7))).reduce((sum, p) => sum + (p.amount || 0), 0);
    const revenue30d = (allPayments || []).filter(p => new Date(p.created_at) >= new Date(daysAgo(30))).reduce((sum, p) => sum + (p.amount || 0), 0);

    // Most viewed listing
    const mostViewedListing = mostViewedData?.[0] || null;

    // Most saved listing (depends on savedData)
    const savedCounts = {};
    (savedData || []).forEach((s) => { savedCounts[s.listing_id] = (savedCounts[s.listing_id] || 0) + 1; });
    const mostSavedId = Object.keys(savedCounts).sort((a, b) => savedCounts[b] - savedCounts[a])[0];
    let mostSavedListing = null;
    if (mostSavedId) {
      const { data: msl } = await supabase.from("listings").select("id, location, apartment_name, house_type, views, photos").eq("id", mostSavedId).single();
      mostSavedListing = msl ? { ...msl, save_count: savedCounts[mostSavedId] } : null;
    }

    // Top landlord (depends on allListings)
    const landlordCounts = {};
    (allListings || []).forEach((l) => { landlordCounts[l.landlord_id] = (landlordCounts[l.landlord_id] || 0) + 1; });
    const topLandlordId = Object.keys(landlordCounts).sort((a, b) => landlordCounts[b] - landlordCounts[a])[0];
    let topLandlord = null;
    if (topLandlordId) {
      const { data: tl } = await supabase.from("users").select("id, full_name, email, phone").eq("id", topLandlordId).single();
      topLandlord = tl ? { ...tl, listing_count: landlordCounts[topLandlordId] } : null;
    }

    // Top estate
    const estateCounts = {};
    (estateListings || []).forEach((l) => { if (l.estate) estateCounts[l.estate] = (estateCounts[l.estate] || 0) + 1; });
    const topEstate = Object.keys(estateCounts).sort((a, b) => estateCounts[b] - estateCounts[a])[0] || null;
    const topEstateCount = topEstate ? estateCounts[topEstate] : 0;

    return Response.json({
      success: true,
      stats: {
        totalUsers: totalUsers || 0,
        totalLandlords: totalLandlords || 0,
        totalTenants: totalTenants || 0,
        newUsers1d: newUsers1d || 0,
        newUsers7d: newUsers7d || 0,
        newUsers30d: newUsers30d || 0,
        newTenants1d: newTenants1d || 0,
        newTenants7d: newTenants7d || 0,
        newTenants30d: newTenants30d || 0,
        newLandlords1d: newLandlords1d || 0,
        newLandlords7d: newLandlords7d || 0,
        newLandlords30d: newLandlords30d || 0,
        totalListings: totalListings || 0,
        activeListings: activeListings || 0,
        newListings7d: newListings7d || 0,
        pendingVerifications: pendingVerifications || 0,
        pendingReports: pendingReports || 0,
        totalReports: totalReports || 0,
        unreadMessages: unreadMessages || 0,
        totalRevenue,
        revenue1d,
        revenue7d,
        revenue30d,
        mostViewedListing,
        mostSavedListing,
        topLandlord,
        topEstate,
        topEstateCount,
        deadListings: deadListings || 0,
      },
    });

  } catch (error) {
    console.error("Stats error:", error);
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}