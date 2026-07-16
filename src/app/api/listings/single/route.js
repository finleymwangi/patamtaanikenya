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

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const viewer_id = searchParams.get("viewer_id");

    if (!id) {
      return Response.json({ error: "Listing ID is required." }, { status: 400 });
    }

    const { data: listing, error } = await supabase
      .from("listings")
      .select("*, users(full_name, phone, email, is_verified)")
      .eq("id", id)
      .single();

    if (error || !listing) {
      return Response.json({ error: "Listing not found." }, { status: 404 });
    }

    const isOwner = viewer_id && listing.landlord_id === viewer_id;

    if (!isOwner) {
      const viewerKey = viewer_id || request.headers.get("x-forwarded-for") || "anonymous";

      const { data: alreadyViewed } = await supabase
        .from("viewed_listings")
        .select("id")
        .eq("listing_id", id)
        .eq("viewer_key", viewerKey)
        .eq("viewed_date", new Date().toISOString().split("T")[0])
        .maybeSingle();

      if (!alreadyViewed) {
        await supabase.from("viewed_listings").insert([{ listing_id: id, viewer_key: viewerKey }]);

        const newViews = (listing.views || 0) + 1;
        await supabase.from("listings").update({ views: newViews }).eq("id", id);
        listing.views = newViews;

        if (listing.landlord_id) {
          await supabase.from("notifications").insert([{
            landlord_id: listing.landlord_id,
            listing_id: id,
            type: "view",
            message: "Your listing in " + (listing.location || "your area") + " was viewed.",
          }]);
          await checkMilestone(id, listing.landlord_id, "views", newViews);
        }
      }
    }

    // Resolve display contact — use override if set, fall back to account owner
    const displayPhone = listing.contact_phone || listing.users?.phone || null;
    const displayName = listing.contact_name || listing.users?.full_name || "Landlord";

    return Response.json({
      success: true,
      listing: {
        ...listing,
        display_phone: displayPhone,
        display_name: displayName,
      },
      isOwner
    });

  } catch (error) {
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}