import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function PUT(request) {
  try {
    const { user_id, full_name, email, phone, new_password } = await request.json();

    if (!user_id) {
      return Response.json({ error: "User ID required." }, { status: 400 });
    }

    // Check if email is already taken by someone else
    if (email) {
      const { data: existingEmail } = await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .neq("id", user_id)
        .maybeSingle();
      if (existingEmail) {
        return Response.json({ error: "This email address is already in use by another account." }, { status: 400 });
      }
    }

    // Check if phone is already taken by someone else
    if (phone) {
      const { data: existingPhone } = await supabase
        .from("users")
        .select("id")
        .eq("phone", phone)
        .neq("id", user_id)
        .maybeSingle();
      if (existingPhone) {
        return Response.json({ error: "This phone number is already registered to another account." }, { status: 400 });
      }
    }

    // Clean and validate phone
const cleanPhone = phone.replace(/[^0-9]/g, "");
if (cleanPhone.length < 9 || cleanPhone.length > 12) {
  return Response.json({ error: "Please enter a valid phone number." }, { status: 400 });
}

    const updates = { full_name, email, phone };

    if (new_password && new_password.trim() !== "") {
      if (new_password.length < 6) {
        return Response.json({ error: "Password must be at least 6 characters." }, { status: 400 });
      }
      updates.password = await bcrypt.hash(new_password, 12);
    }

    const { data: updatedUser, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", user_id)
      .select("id, full_name, email, phone, role, is_verified")
      .single();

    if (error) return Response.json({ error: error.message }, { status: 500 });

    return Response.json({ success: true, user: updatedUser });

  } catch (error) {
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}