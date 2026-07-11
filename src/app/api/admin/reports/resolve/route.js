import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  try {
    const { report_id, status } = await request.json();

    const { data: report } = await supabase
      .from("reports")
      .select("reported_by, listing_id, listings(location, house_type)")
      .eq("id", report_id)
      .single();

    const { error } = await supabase
      .from("reports")
      .update({ status })
      .eq("id", report_id);

    if (error) return Response.json({ error: error.message }, { status: 500 });

    // Notify the tenant who filed the report
    if (report?.reported_by) {
      const location = report.listings?.location || "a listing";
      const houseType = (report.listings?.house_type || "listing").replace(/_/g, " ");

      let message = "";
      if (status === "resolved") {
        message = `Your report about a ${houseType} in ${location} has been reviewed and resolved. Thank you for helping keep PataMtaani safe.`;
      } else if (status === "dismissed") {
        message = `Your report about a ${houseType} in ${location} has been reviewed. After investigation, our team determined that no action was necessary at this time.`;
      }

      if (message) {
        await supabase.from("tenant_notifications").insert([{
          tenant_id: report.reported_by,
          type: "report_update",
          listing_id: report.listing_id,
          message,
        }]);
      }
    }

    return Response.json({ success: true });

  } catch (error) {
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}