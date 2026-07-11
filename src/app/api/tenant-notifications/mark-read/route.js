import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  try {
    const { tenant_id } = await request.json();

    const { error } = await supabase
      .from("tenant_notifications")
      .update({ is_read: true })
      .eq("tenant_id", tenant_id)
      .eq("is_read", false);

    if (error) return Response.json({ error: error.message }, { status: 500 });

    return Response.json({ success: true });

  } catch (error) {
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}