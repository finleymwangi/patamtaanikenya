import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenant_id = searchParams.get("tenant_id");

    if (!tenant_id) {
      return Response.json({ error: "Tenant ID required." }, { status: 400 });
    }

    const { data: notifications, error } = await supabase
      .from("tenant_notifications")
      .select("*")
      .eq("tenant_id", tenant_id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) return Response.json({ error: error.message }, { status: 500 });

    return Response.json({ success: true, notifications });

  } catch (error) {
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}