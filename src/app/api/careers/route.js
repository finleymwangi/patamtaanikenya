import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET() {
  try {
    const { data: careers, error } = await supabase
      .from("careers")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ success: true, careers: careers || [] });
  } catch (error) {
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}