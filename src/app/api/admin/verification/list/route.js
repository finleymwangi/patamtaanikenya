import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET() {
  try {
    const { data: requests, error } = await supabase
      .from("verification_requests")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Verification list error:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    if (!requests || requests.length === 0) {
      return Response.json({ success: true, requests: [] });
    }

    const landlordIds = requests.map((r) => r.landlord_id);

    const { data: users } = await supabase
      .from("users")
      .select("id, full_name, email, phone, created_at")
      .in("id", landlordIds);

    const { data: listingCounts } = await supabase
      .from("listings")
      .select("landlord_id")
      .in("landlord_id", landlordIds);

    const merged = await Promise.all(
      requests.map(async (req) => {
        const getSignedUrl = async (url) => {
          if (!url) return null;
          const urlParts = url.split("/verification-docs/");
          const filePath = urlParts[1] || "";
          if (!filePath) return url;
          const { data: signedData } = await supabase.storage
            .from("verification-docs")
            .createSignedUrl(filePath, 3600);
          return signedData ? signedData.signedUrl : url;
        };

        const frontUrl = await getSignedUrl(req.id_photo_url);
        const backUrl = await getSignedUrl(req.id_photo_back_url);

        const listingCount = (listingCounts || []).filter((l) => l.landlord_id === req.landlord_id).length;

        return {
          ...req,
          id_photo_signed_url: frontUrl,
          id_photo_back_signed_url: backUrl,
          users: (users || []).find((u) => u.id === req.landlord_id) || null,
          listing_count: listingCount,
        };
      })
    );

    return Response.json({ success: true, requests: merged });

  } catch (error) {
    console.error("Verification list exception:", error);
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}