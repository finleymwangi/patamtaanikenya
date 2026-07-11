import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      return Response.json({ error: "Invalid email or password." }, { status: 400 });
    }

    if (!user.email_verified) {
      return Response.json({ error: "Please verify your email before logging in." }, { status: 400 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return Response.json({ error: "Invalid email or password." }, { status: 400 });
    }

    // Track last login
    await supabase
      .from("users")
      .update({ last_login: new Date().toISOString() })
      .eq("id", user.id);

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
    console.error("Login error:", error);
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}