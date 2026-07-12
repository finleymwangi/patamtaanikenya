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
      .order("created_at", { ascending: false });

    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ success: true, careers: careers || [] });
  } catch (error) {
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, department, location, type, description, requirements } = body;

    const { data, error } = await supabase
      .from("careers")
      .insert([{ title, department, location, type, description, requirements }])
      .select()
      .single();

    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ success: true, career: data });
  } catch (error) {
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { id, title, department, location, type, description, requirements, is_active } = await request.json();

    const { error } = await supabase
      .from("careers")
      .update({ title, department, location, type, description, requirements, is_active })
      .eq("id", id);

    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    const { error } = await supabase.from("careers").delete().eq("id", id);
    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}