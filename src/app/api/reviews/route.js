import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("is_approved", true)
      .order("created_at", { ascending: false })
      .limit(6);

    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ success: true, reviews: data || [] });
  } catch (error) {
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name, role, location, review } = await request.json();

    if (!name || !role || !location || !review) {
      return Response.json({ error: "All fields are required." }, { status: 400 });
    }

    const { error } = await supabase
      .from("reviews")
      .insert([{ name, role, location, review }]);

    if (error) return Response.json({ error: error.message }, { status: 500 });

    return Response.json({ success: true, message: "Thank you for your review! It will appear after approval." });
  } catch (error) {
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}