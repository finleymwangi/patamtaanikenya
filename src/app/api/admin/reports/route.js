import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET() {
  try {
    const { data: reports, error } = await supabase
      .from("reports")
      .select("*, listings(id, location, estate, house_type, landlord_id, photos, price, status)")
      .order("created_at", { ascending: false });

    if (error) return Response.json({ error: error.message }, { status: 500 });

    if (!reports || reports.length === 0) {
      return Response.json({ success: true, reports: [] });
    }

    const reporterIds = [...new Set(reports.map((r) => r.reported_by).filter(Boolean))];
    const landlordIds = [...new Set(reports.map((r) => r.listings?.landlord_id).filter(Boolean))];
    const listingIds = [...new Set(reports.map((r) => r.listing_id).filter(Boolean))];

    const { data: reporters } = await supabase
      .from("users")
      .select("id, full_name, email, phone")
      .in("id", reporterIds.length > 0 ? reporterIds : ["none"]);

    const { data: landlords } = await supabase
      .from("users")
      .select("id, full_name, email, phone")
      .in("id", landlordIds.length > 0 ? landlordIds : ["none"]);

    // Count how many times each listing has been reported
    const { data: allReports } = await supabase
      .from("reports")
      .select("listing_id")
      .in("listing_id", listingIds.length > 0 ? listingIds : ["none"]);

    const reportCounts = {};
    (allReports || []).forEach((r) => {
      reportCounts[r.listing_id] = (reportCounts[r.listing_id] || 0) + 1;
    });

    const merged = reports.map((r) => ({
      ...r,
      reporter: (reporters || []).find((u) => u.id === r.reported_by) || null,
      landlord: (landlords || []).find((u) => u.id === r.listings?.landlord_id) || null,
      report_count: reportCounts[r.listing_id] || 1,
    }));

    return Response.json({ success: true, reports: merged });

  } catch (error) {
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}