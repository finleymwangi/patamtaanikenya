import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return Response.json({ error: "Email and code are required." }, { status: 400 });
    }

    const { data: otpRecord } = await supabase
      .from("otps")
      .select("*")
      .eq("email", email)
      .eq("otp", otp)
      .eq("used", false)
      .maybeSingle();

    if (!otpRecord) {
      return Response.json({ error: "Invalid reset code. Please check and try again." }, { status: 400 });
    }

    if (new Date() > new Date(otpRecord.expires_at)) {
      return Response.json({ error: "This code has expired. Please request a new one." }, { status: 400 });
    }

    return Response.json({ success: true });

  } catch (error) {
    console.error("Verify reset OTP error:", error);
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}