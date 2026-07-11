import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  try {
    const { listing_id } = await request.json();

    const { data: listing } = await supabase
      .from("listings")
      .select("landlord_id, location")
      .eq("id", listing_id)
      .single();

    if (listing && listing.landlord_id) {
      await supabase.from("notifications").insert([{
        landlord_id: listing.landlord_id,
        listing_id: listing_id,
        type: "whatsapp_click",
        message: "Someone is interested in contacting you about your listing in " + (listing.location || "your area") + " via WhatsApp.",
      }]);
    }

    return Response.json({ success: true });

  } catch (error) {
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}