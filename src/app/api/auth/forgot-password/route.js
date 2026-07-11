import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const resend = new Resend(process.env.RESEND_API_KEY);

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request) {
  try {
    const { email } = await request.json();

    // Check if user exists
    const { data: user } = await supabase
      .from("users")
      .select("id, full_name, email")
      .eq("email", email)
      .maybeSingle();

    // Always return success even if user doesn't exist (security best practice)
    if (!user) {
      return Response.json({ success: true });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Save OTP to database
    await supabase
      .from("otps")
      .insert([{ email, otp, expires_at: expiresAt, type: "password_reset" }]);

    // Send reset email
    await resend.emails.send({
      from: "PataMtaani <onboarding@resend.dev>",
      to: email,
      subject: "Reset your PataMtaani password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; background: #0a0a0a; color: #ffffff; padding: 40px; border-radius: 16px;">
          <h1 style="color: #FF6B35; font-size: 28px; margin-bottom: 8px;">PataMtaani</h1>
          <p style="color: #888; font-size: 13px; margin-bottom: 32px;">Find it in the hood</p>
          <h2 style="font-size: 20px; margin-bottom: 16px;">Reset your password</h2>
          <p style="color: #888; margin-bottom: 24px;">Hi ${user.full_name}, use the code below to reset your password. This code expires in 10 minutes.</p>
          <div style="background: #111111; border: 1px solid #2a2a2a; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
            <p style="font-size: 40px; font-weight: bold; letter-spacing: 8px; color: #FF6B35; margin: 0;">${otp}</p>
          </div>
          <p style="color: #888; font-size: 13px;">If you did not request a password reset, please ignore this email.</p>
        </div>
      `,
    });

    return Response.json({ success: true });

  } catch (error) {
    console.error("Forgot password error:", error);
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}