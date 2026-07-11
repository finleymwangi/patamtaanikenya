import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function DELETE(request) {
  try {
    const { listing_id, landlord_id } = await request.json();

    const { error } = await supabase
      .from("listings")
      .delete()
      .eq("id", listing_id)
      .eq("landlord_id", landlord_id);

    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}