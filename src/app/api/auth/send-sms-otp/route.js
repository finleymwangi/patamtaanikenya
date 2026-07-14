import AfricasTalking from "africastalking";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const AT = AfricasTalking({
  apiKey: process.env.AT_API_KEY,
  username: process.env.AT_USERNAME,
});

const sms = AT.SMS;

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function formatPhone(phone) {
  const clean = phone.replace(/[^0-9]/g, "");
  if (clean.startsWith("0")) return "+254" + clean.slice(1);
  if (clean.startsWith("254")) return "+" + clean;
  return "+" + clean;
}

export async function POST(request) {
  try {
    const { phone, email, type } = await request.json();

    if (!phone) {
      return Response.json({ error: "Phone number required." }, { status: 400 });
    }

    // Invalidate old OTPs
    await supabase.from("otps").update({ used: true }).eq("email", email).eq("used", false);

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await supabase.from("otps").insert([{ email, otp, expires_at: expiresAt }]);

    const messageText = type === "reset"
      ? `Your PataMtaani password reset code is: ${otp}. Valid for 10 minutes. Do not share this code.`
      : `Your PataMtaani verification code is: ${otp}. Valid for 10 minutes. Do not share this code.`;

    const formattedPhone = formatPhone(phone);

    await sms.send({
      to: [formattedPhone],
      message: messageText,
      from: process.env.AT_SENDER_ID || "PataMtaani",
    });

    return Response.json({ success: true, message: "Code sent to your phone number." });

  } catch (error) {
    console.error("SMS OTP error:", error);
    return Response.json({ error: "Failed to send SMS. Please try again." }, { status: 500 });
  }
}