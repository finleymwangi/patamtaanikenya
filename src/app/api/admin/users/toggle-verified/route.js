import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  try {
    const { user_id, is_verified } = await request.json();

    const { error } = await supabase
      .from("users")
      .update({ is_verified })
      .eq("id", user_id);

    if (error) return Response.json({ error: error.message }, { status: 500 });

    return Response.json({ success: true });

  } catch (error) {
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}