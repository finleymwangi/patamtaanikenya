import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  try {
    const { email, otp } = await request.json();

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

    return Response.json({ success: true });

  } catch (error) {
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}