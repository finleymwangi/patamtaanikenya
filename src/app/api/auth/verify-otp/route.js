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
      return Response.json({ error: "Invalid verification code. Please check and try again." }, { status: 400 });
    }

    if (new Date() > new Date(otpRecord.expires_at)) {
      return Response.json({ error: "This code has expired. Please request a new one." }, { status: 400 });
    }

    await supabase.from("otps").update({ used: true }).eq("id", otpRecord.id);
    await supabase.from("users").update({ email_verified: true }).eq("email", email);

    const { data: user } = await supabase
      .from("users")
      .select("id, full_name, email, phone, role, is_verified")
      .eq("email", email)
      .single();

    if (!user) {
      return Response.json({ error: "Account not found." }, { status: 404 });
    }

    return Response.json({
      success: true,
      role: user.role,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        is_verified: user.is_verified,
      }
    });

  } catch (error) {
    console.error("Verify OTP error:", error);
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}