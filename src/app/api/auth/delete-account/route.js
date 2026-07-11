import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function DELETE(request) {
  try {
    const { user_id } = await request.json();

    if (!user_id) {
      return Response.json({ error: "User ID required." }, { status: 400 });
    }

    await supabase.from("listings").delete().eq("landlord_id", user_id);
    await supabase.from("saved_listings").delete().eq("tenant_id", user_id);
    await supabase.from("notifications").delete().eq("landlord_id", user_id);

    const { error } = await supabase.from("users").delete().eq("id", user_id);

    if (error) return Response.json({ error: error.message }, { status: 500 });

    return Response.json({ success: true });

  } catch (error) {
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}