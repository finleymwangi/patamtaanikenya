import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET() {
  try {
    const { data: payments, error } = await supabase
      .from("payments")
      .select("*, users(full_name, email)")
      .order("created_at", { ascending: false });

    if (error) return Response.json({ error: error.message }, { status: 500 });

    return Response.json({ success: true, payments: payments || [] });

  } catch (error) {
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}