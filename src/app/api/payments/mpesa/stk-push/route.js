import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function getMpesaToken() {
  const key = process.env.MPESA_CONSUMER_KEY;
  const secret = process.env.MPESA_CONSUMER_SECRET;
  const credentials = Buffer.from(`${key}:${secret}`).toString("base64");

  const res = await fetch(
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    {
      method: "GET",
      headers: { Authorization: `Basic ${credentials}` },
    }
  );
  const data = await res.json();
  return data.access_token;
}

export async function POST(request) {
  try {
    const { landlord_id, phone } = await request.json();

    if (!landlord_id || !phone) {
      return Response.json({ error: "Landlord ID and phone number are required." }, { status: 400 });
    }

    // Format phone number to 254 format
    let formattedPhone = phone.replace(/[^0-9]/g, "");
    if (formattedPhone.startsWith("0")) {
      formattedPhone = "254" + formattedPhone.slice(1);
    }
    if (formattedPhone.startsWith("+254")) {
      formattedPhone = formattedPhone.slice(1);
    }

    const shortCode = process.env.MPESA_SHORTCODE;
    const passkey = process.env.MPESA_PASSKEY;
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:T.Z]/g, "")
      .slice(0, 14);
    const password = Buffer.from(`${shortCode}${passkey}${timestamp}`).toString("base64");

    const token = await getMpesaToken();

    const stkBody = {
      BusinessShortCode: shortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerBuyGoodsOnline",
      Amount: 200,
      PartyA: formattedPhone,
      PartyB: shortCode,
      PhoneNumber: formattedPhone,
      CallBackURL: process.env.MPESA_CALLBACK_URL,
      AccountReference: "PataMtaani",
      TransactionDesc: "PataMtaani Verification Fee",
    };

    const stkRes = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(stkBody),
      }
    );

    const stkData = await stkRes.json();
    console.log("STK Push response:", stkData);

    if (stkData.ResponseCode !== "0") {
      return Response.json({
        error: stkData.CustomerMessage || stkData.errorMessage || "Failed to initiate payment.",
      }, { status: 400 });
    }

    // Save pending payment to database
    await supabase.from("payments").insert([{
      landlord_id,
      phone: formattedPhone,
      amount: 200,
      status: "pending",
      payment_type: "verification",
      checkout_request_id: stkData.CheckoutRequestID,
      description: "PataMtaani Verification Fee",
    }]);

    return Response.json({
      success: true,
      checkout_request_id: stkData.CheckoutRequestID,
      message: "Payment prompt sent to your phone. Enter your M-Pesa PIN to complete.",
    });

  } catch (error) {
    console.error("STK Push error:", error);
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}