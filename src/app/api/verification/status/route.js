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

    const { data: requests, error } = await supabase
      .from("verification_requests")
      .select("*")
      .eq("landlord_id", landlord_id)
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) return Response.json({ error: error.message }, { status: 500 });

    return Response.json({ success: true, request: requests?.[0] || null });

  } catch (error) {
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}