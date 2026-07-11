import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const MILESTONES = [100, 500, 1000, 5000, 10000];

async function checkMilestone(listingId, landlordId, type, count) {
  const hit = MILESTONES.find((m) => count === m);
  if (!hit) return;
  await supabase.from("notifications").insert([{
    landlord_id: landlordId,
    listing_id: listingId,
    type: "milestone",
    message: "🎉 Your listing just hit " + hit + " " + type + "!",
  }]);
}

export async function POST(request) {
  try {
    const { tenant_id, listing_id } = await request.json();

    const { data: listing } = await supabase
      .from("listings")
      .select("landlord_id, location")
      .eq("id", listing_id)
      .single();

    if (listing && listing.landlord_id === tenant_id) {
      return Response.json({ error: "You cannot save your own listing." }, { status: 400 });
    }

    const { data: existing, error: checkError } = await supabase
      .from("saved_listings")
      .select("id")
      .eq("tenant_id", tenant_id)
      .eq("listing_id", listing_id)
      .maybeSingle();

    if (checkError) {
      return Response.json({ error: checkError.message }, { status: 500 });
    }

    if (existing) {
      const { error: deleteError } = await supabase.from("saved_listings").delete().eq("id", existing.id);
      if (deleteError) {
        return Response.json({ error: deleteError.message }, { status: 500 });
      }
      return Response.json({ success: true, saved: false });
    }

    const { error: insertError } = await supabase
      .from("saved_listings")
      .insert([{ tenant_id, listing_id }]);

    if (insertError) {
      return Response.json({ error: insertError.message }, { status: 500 });
    }

    if (listing && listing.landlord_id) {
      await supabase.from("notifications").insert([{
        landlord_id: listing.landlord_id,
        listing_id: listing_id,
        type: "save",
        message: "Someone saved your listing in " + (listing.location || "your area") + "!",
      }]);

      const { count } = await supabase
        .from("saved_listings")
        .select("id", { count: "exact", head: true })
        .eq("listing_id", listing_id);

      await checkMilestone(listing_id, listing.landlord_id, "saves", count);
    }

    return Response.json({ success: true, saved: true });

  } catch (error) {
    return Response.json({ error: error.message || "Something went wrong." }, { status: 500 });
  }
}