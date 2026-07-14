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

function formatPhone(phone) {
  const clean = phone.replace(/[^0-9]/g, "");
  if (clean.startsWith("0")) return "+254" + clean.slice(1);
  if (clean.startsWith("254")) return "+" + clean;
  return "+" + clean;
}

async function sendEmailOTP(email, full_name, otp) {
  const { error } = await resend.emails.send({
    from: "PataMtaani <noreply@patamtaani.co.ke>",
    to: email,
    subject: "Verify your PataMtaani account",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; background: #0a0a0a; color: #ffffff; padding: 40px; border-radius: 16px;">
        <h1 style="color: #FF6B35; font-size: 28px; margin-bottom: 8px;">PataMtaani</h1>
        <p style="color: #888; font-size: 13px; margin-bottom: 32px;">Find it in the hood</p>
        <h2 style="font-size: 20px; margin-bottom: 16px;">Verify your account</h2>
        <p style="color: #888; margin-bottom: 24px;">Hi ${full_name}, use the code below to verify your account. Expires in 10 minutes.</p>
        <div style="background: #111111; border: 1px solid #2a2a2a; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
          <p style="font-size: 40px; font-weight: bold; letter-spacing: 8px; color: #FF6B35; margin: 0;">${otp}</p>
        </div>
        <p style="color: #888; font-size: 13px;">If you did not create a PataMtaani account, ignore this email.</p>
      </div>
    `,
  });
  if (error) console.error("Email OTP error:", error);
}

async function sendSMSOTP(phone, otp) {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "https://patamtaani.co.ke"}/api/auth/send-sms-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, email: "_sms_", otp, type: "verify" }),
    });
  } catch (err) {
    console.error("SMS send error:", err);
  }
}

export async function POST(request) {
  try {
    const { full_name, email, phone, password, role } = await request.json();

    const { data: existingUser } = await supabase
      .from("users")
      .select("id, email_verified")
      .eq("email", email)
      .maybeSingle();

    if (existingUser) {
      if (existingUser.email_verified) {
        return Response.json({ error: "An account with this email already exists. Please log in instead." }, { status: 400 });
      } else {
        await supabase.from("otps").delete().eq("email", email);
        await supabase.from("users").delete().eq("id", existingUser.id);
      }
    }

    const { data: existingPhone } = await supabase
      .from("users").select("id").eq("phone", phone).maybeSingle();

    if (existingPhone) {
      return Response.json({ error: "An account with this phone number already exists." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const { data: newUser, error: createError } = await supabase
      .from("users")
      .insert([{ full_name, email, phone, password: hashedPassword, role }])
      .select().single();

    if (createError) {
      return Response.json({ error: "Failed to create account. Please try again." }, { status: 500 });
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await supabase.from("otps").insert([{ email, otp, expires_at: expiresAt }]);

    const method = process.env.VERIFICATION_METHOD || "email";

    if (method === "sms" || method === "both") {
      const formatted = formatPhone(phone);
      const { default: AfricasTalking } = await import("africastalking");
      const AT = AfricasTalking({ apiKey: process.env.AT_API_KEY, username: process.env.AT_USERNAME });
      const smsResult = await AT.SMS.send({
        to: [formatted],
        message: `Your PataMtaani verification code is: ${otp}. Valid for 10 minutes.`,
        from: process.env.AT_SENDER_ID || "PataMtaani",
      }).catch((e) => console.error("SMS error:", e));
    }

    if (method === "email" || method === "both") {
      await sendEmailOTP(email, full_name, otp);
    }

    const deliveryMethod = method === "sms" ? "phone number" : method === "both" ? "email and phone" : "email";

    return Response.json({
      success: true,
      message: `Account created. Check your ${deliveryMethod} for the verification code.`,
      delivery: method,
    });

  } catch (error) {
    console.error("Signup error:", error);
    return Response.json({ error: error.message || "Something went wrong." }, { status: 500 });
  }
}