import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  try {
    const { request_id, landlord_id, decision } = await request.json();

    if (!["approved", "rejected"].includes(decision)) {
      return Response.json({ error: "Invalid decision." }, { status: 400 });
    }

    const { error: updateError } = await supabase
      .from("verification_requests")
      .update({ status: decision, reviewed_at: new Date().toISOString() })
      .eq("id", request_id);

    if (updateError) return Response.json({ error: updateError.message }, { status: 500 });

    if (decision === "approved") {
      await supabase.from("notifications").insert([{
        landlord_id,
        type: "verification",
        message: "✅ Your ID has been approved! Go to your dashboard and pay Ksh 200 via M-Pesa to activate your verified badge.",
      }]);
    } else if (decision === "rejected") {
      await supabase.from("notifications").insert([{
        landlord_id,
        type: "verification",
        message: "❌ Your ID verification was unsuccessful. Please resubmit with a clearer photo of your National ID or Passport.",
      }]);
    }

    return Response.json({ success: true });

  } catch (error) {
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}