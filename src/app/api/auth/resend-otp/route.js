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

    const { data: user } = await supabase
      .from("users")
      .select("id, full_name, email_verified")
      .eq("email", email)
      .maybeSingle();

    if (!user) {
      return Response.json({ error: "No account found with this email." }, { status: 400 });
    }

    if (user.email_verified) {
      return Response.json({ error: "This account is already verified." }, { status: 400 });
    }

    // Invalidate old OTPs
    await supabase.from("otps").update({ used: true }).eq("email", email).eq("used", false);

    // Generate new OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await supabase.from("otps").insert([{ email, otp, expires_at: expiresAt }]);

    await resend.emails.send({
      from: "PataMtaani <noreply@patamtaani.co.ke>",
      to: email,
      subject: "Your new PataMtaani verification code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; background: #0a0a0a; color: #ffffff; padding: 40px; border-radius: 16px;">
          <h1 style="color: #FF6B35; font-size: 28px; margin-bottom: 8px;">PataMtaani</h1>
          <p style="color: #888; font-size: 13px; margin-bottom: 32px;">Find it in the hood</p>
          <h2 style="font-size: 20px; margin-bottom: 16px;">New verification code</h2>
          <p style="color: #888; margin-bottom: 24px;">Here is your new verification code. It expires in 10 minutes.</p>
          <div style="background: #111111; border: 1px solid #2a2a2a; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
            <p style="font-size: 40px; font-weight: bold; letter-spacing: 8px; color: #FF6B35; margin: 0;">${otp}</p>
          </div>
          <p style="color: #888; font-size: 13px;">If you did not request this code, please ignore this email.</p>
        </div>
      `,
    });

    return Response.json({ success: true, message: "New code sent to your email." });

  } catch (error) {
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}