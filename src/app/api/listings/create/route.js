import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  try {
    const body = await request.json();
    console.log("Listing body received:", body);

    const { landlord_id, apartment_name, house_type, location, estate, price, description, amenities } = body;

    console.log("landlord_id:", landlord_id);

    if (!house_type || !location || !estate || !price) {
      return Response.json({ error: "Please fill in all required fields." }, { status: 400 });
    }

    const { data: listing, error } = await supabase
      .from("listings")
      .insert([{
        landlord_id: landlord_id || null,
        apartment_name,
        house_type,
        location,
        estate,
        price: parseInt(price),
        description,
        amenities,
        status: "active",
      }])
      .select()
      .single();

    if (error) {
      console.error("Create listing error:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true, listing });

  } catch (error) {
    console.error("Listing error:", error);
    return Response.json({ error: error.message || "Something went wrong." }, { status: 500 });
  }
}