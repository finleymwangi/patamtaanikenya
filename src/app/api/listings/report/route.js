import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  try {
    const { listing_id, reported_by, reason, details } = await request.json();

    if (!listing_id || !reason) {
      return Response.json({ error: "Listing and reason are required." }, { status: 400 });
    }

    const { error } = await supabase
      .from("reports")
      .insert([{ listing_id, reported_by, reason, details, status: "pending" }]);

    if (error) return Response.json({ error: error.message }, { status: 500 });

    return Response.json({ success: true });

  } catch (error) {
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}