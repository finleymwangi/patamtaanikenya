import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const checkout_request_id = searchParams.get("checkout_request_id");

    if (!checkout_request_id) {
      return Response.json({ error: "Checkout request ID required." }, { status: 400 });
    }

    const { data: payment } = await supabase
      .from("payments")
      .select("status, description")
      .eq("checkout_request_id", checkout_request_id)
      .single();

    if (!payment) {
      return Response.json({ error: "Payment not found." }, { status: 404 });
    }

    return Response.json({ success: true, status: payment.status, description: payment.description });

  } catch (error) {
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}