import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import bcrypt from "bcryptjs";

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
    const { full_name, email, phone, password, role } = await request.json();

    // Check if email already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("id, email_verified")
      .eq("email", email)
      .maybeSingle();

    if (existingUser) {
      if (existingUser.email_verified) {
        // Fully verified — tell them to log in
        return Response.json({ error: "An account with this email already exists. Please log in instead." }, { status: 400 });
      } else {
        // Exists but never verified — wipe it and start fresh
        await supabase.from("otps").delete().eq("email", email);
        await supabase.from("users").delete().eq("id", existingUser.id);
      }
    }

    // Check if phone already exists
    const { data: existingPhone } = await supabase
      .from("users")
      .select("id")
      .eq("phone", phone)
      .maybeSingle();

    if (existingPhone) {
      return Response.json({ error: "An account with this phone number already exists." }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const { data: newUser, error: createError } = await supabase
      .from("users")
      .insert([{ full_name, email, phone, password: hashedPassword, role }])
      .select()
      .single();

    if (createError) {
      console.error("Create user error:", createError);
      return Response.json({ error: "Failed to create account. Please try again." }, { status: 500 });
    }

    // Generate and save OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const { error: otpError } = await supabase
      .from("otps")
      .insert([{ email, otp, expires_at: expiresAt }]);

    if (otpError) {
      console.error("OTP insert error:", otpError);
    }

    // Send OTP email
    const { error: emailError } = await resend.emails.send({
      from: "PataMtaani <noreply@patamtaani.co.ke>",
      to: email,
      subject: "Verify your PataMtaani account",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; background: #0a0a0a; color: #ffffff; padding: 40px; border-radius: 16px;">
          <h1 style="color: #FF6B35; font-size: 28px; margin-bottom: 8px;">PataMtaani</h1>
          <p style="color: #888; font-size: 13px; margin-bottom: 32px;">Find it in the hood</p>
          <h2 style="font-size: 20px; margin-bottom: 16px;">Verify your account</h2>
          <p style="color: #888; margin-bottom: 24px;">Hi ${full_name}, use the code below to verify your PataMtaani account. This code expires in 10 minutes.</p>
          <div style="background: #111111; border: 1px solid #2a2a2a; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
            <p style="font-size: 40px; font-weight: bold; letter-spacing: 8px; color: #FF6B35; margin: 0;">${otp}</p>
          </div>
          <p style="color: #888; font-size: 13px;">If you did not create a PataMtaani account, please ignore this email.</p>
        </div>
      `,
    });

    if (emailError) {
      console.error("Email send error:", emailError);
    }

    return Response.json({ success: true, message: "Account created. Check your email for the verification code." });

  } catch (error) {
    console.error("Signup error:", error);
    return Response.json({ error: error.message || "Something went wrong. Please try again." }, { status: 500 });
  }
}