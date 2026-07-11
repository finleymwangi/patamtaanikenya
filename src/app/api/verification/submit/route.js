import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  try {
    const { landlord_id, id_photo_url, id_photo_back_url } = await request.json();

    if (!landlord_id || !id_photo_url || !id_photo_back_url) {
      return Response.json({ error: "Both front and back ID photos are required." }, { status: 400 });
    }

    const { data: existing } = await supabase
      .from("verification_requests")
      .select("id")
      .eq("landlord_id", landlord_id)
      .eq("status", "pending")
      .maybeSingle();

    if (existing) {
      return Response.json({ error: "You already have a pending verification request." }, { status: 400 });
    }

    const { error } = await supabase
      .from("verification_requests")
      .insert([{ landlord_id, id_photo_url, id_photo_back_url, status: "pending" }]);

    if (error) return Response.json({ error: error.message }, { status: 500 });

    return Response.json({ success: true });

  } catch (error) {
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}