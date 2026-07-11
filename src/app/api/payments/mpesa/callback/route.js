import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  try {
    const body = await request.json();
    console.log("M-Pesa callback received:", JSON.stringify(body, null, 2));

    const stk = body?.Body?.stkCallback;
    if (!stk) return Response.json({ ResultCode: 0, ResultDesc: "Accepted" });

    const checkoutRequestId = stk.CheckoutRequestID;
    const resultCode = stk.ResultCode;

    const { data: payment } = await supabase
      .from("payments")
      .select("*")
      .eq("checkout_request_id", checkoutRequestId)
      .single();

    if (!payment) {
      console.error("Payment not found:", checkoutRequestId);
      return Response.json({ ResultCode: 0, ResultDesc: "Accepted" });
    }

    if (resultCode === 0) {
      const items = stk.CallbackMetadata?.Item || [];
      const getItem = (name) => items.find((i) => i.Name === name)?.Value || null;
      const mpesaReceiptNumber = getItem("MpesaReceiptNumber");

      await supabase
        .from("payments")
        .update({ status: "completed", description: `M-Pesa Receipt: ${mpesaReceiptNumber}` })
        .eq("checkout_request_id", checkoutRequestId);

      // Mark verified and set verified_at timestamp
      const verifiedAt = new Date().toISOString();
      await supabase
        .from("users")
        .update({ is_verified: true, verified_at: verifiedAt })
        .eq("id", payment.landlord_id);

      await supabase
        .from("verification_requests")
        .update({ status: "approved", reviewed_at: verifiedAt })
        .eq("landlord_id", payment.landlord_id)
        .eq("status", "pending");

      await supabase.from("notifications").insert([{
        landlord_id: payment.landlord_id,
        type: "verification",
        message: `🎉 Payment of Ksh 200 received (${mpesaReceiptNumber}). Your account is now verified! Tenants can see your verified badge.`,
      }]);

    } else {
      await supabase
        .from("payments")
        .update({ status: "failed" })
        .eq("checkout_request_id", checkoutRequestId);

      await supabase.from("notifications").insert([{
        landlord_id: payment.landlord_id,
        type: "payment_failed",
        message: "Your M-Pesa payment was not completed. Please try again from your dashboard to get verified.",
      }]);
    }

    return Response.json({ ResultCode: 0, ResultDesc: "Accepted" });

  } catch (error) {
    console.error("Callback error:", error);
    return Response.json({ ResultCode: 0, ResultDesc: "Accepted" });
  }
}