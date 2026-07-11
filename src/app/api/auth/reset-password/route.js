import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  try {
    const { email, otp, password } = await request.json();

    // Verify OTP one more time
    const { data: otpRecord, error } = await supabase
      .from("otps")
      .select("*")
      .eq("email", email)
      .eq("otp", otp)
      .eq("used", false)
      .single();

    if (error || !otpRecord) {
      return Response.json({ error: "Invalid or expired code." }, { status: 400 });
    }

    if (new Date() > new Date(otpRecord.expires_at)) {
      return Response.json({ error: "Code has expired. Please request a new one." }, { status: 400 });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update user password
    await supabase
      .from("users")
      .update({ password: hashedPassword })
      .eq("email", email);

    // Mark OTP as used
    await supabase
      .from("otps")
      .update({ used: true })
      .eq("id", otpRecord.id);

    return Response.json({ success: true });

  } catch (error) {
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}