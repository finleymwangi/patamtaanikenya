import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET() {
  try {
    const { data: newUsers } = await supabase
      .from("users")
      .select("id, full_name, role, created_at")
      .order("created_at", { ascending: false })
      .limit(10);

    const { data: newListings } = await supabase
      .from("listings")
      .select("id, location, house_type, apartment_name, created_at, users(full_name)")
      .order("created_at", { ascending: false })
      .limit(10);

    const { data: newReports } = await supabase
      .from("reports")
      .select("id, reason, created_at, listings(location)")
      .order("created_at", { ascending: false })
      .limit(10);

    const { data: newVerifications } = await supabase
      .from("verification_requests")
      .select("id, status, created_at, users(full_name)")
      .order("created_at", { ascending: false })
      .limit(10);

    const { data: newMessages } = await supabase
      .from("contact_messages")
      .select("id, name, subject, created_at")
      .order("created_at", { ascending: false })
      .limit(10);

    const activities = [
      ...(newUsers || []).map((u) => ({
        type: "new_user",
        message: u.full_name + " joined as a " + u.role,
        time: u.created_at,
        icon: "👤",
      })),
      ...(newListings || []).map((l) => ({
        type: "new_listing",
        message: (l.users?.full_name || "A landlord") + " posted a new listing in " + (l.location || "unknown"),
        time: l.created_at,
        icon: "🏠",
      })),
      ...(newReports || []).map((r) => ({
        type: "new_report",
        message: "A listing in " + (r.listings?.location || "unknown") + " was reported for " + (r.reason || "").replace(/_/g, " "),
        time: r.created_at,
        icon: "🚩",
      })),
      ...(newVerifications || []).map((v) => ({
        type: "verification",
        message: (v.users?.full_name || "A landlord") + " submitted a verification request",
        time: v.created_at,
        icon: "🪪",
      })),
      ...(newMessages || []).map((m) => ({
        type: "message",
        message: m.name + " sent a message: " + m.subject,
        time: m.created_at,
        icon: "✉️",
      })),
    ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 30);

    return Response.json({ success: true, activities });

  } catch (error) {
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}