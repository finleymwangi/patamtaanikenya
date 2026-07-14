import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  try {
    const { email, otp, new_password } = await request.json();

    if (!email || !otp || !new_password) {
      return Response.json({ error: "All fields are required." }, { status: 400 });
    }

    if (new_password.length < 6) {
      return Response.json({ error: "Password must be at least 6 characters." }, { status: 400 });
    }

    // Verify OTP one more time before resetting
    const { data: otpRecord } = await supabase
      .from("otps")
      .select("*")
      .eq("email", email)
      .eq("otp", otp)
      .eq("used", false)
      .single();

    if (!otpRecord || new Date() > new Date(otpRecord.expires_at)) {
      return Response.json({ error: "Your reset code has expired. Please request a new one." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(new_password, 12);

    await supabase.from("users").update({ password: hashedPassword }).eq("email", email);

    // Mark OTP as used
    await supabase.from("otps").update({ used: true }).eq("id", otpRecord.id);

    return Response.json({ success: true });

  } catch (error) {
    console.error("Reset password error:", error);
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}