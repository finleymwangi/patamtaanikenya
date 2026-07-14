import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  try {
    const body = await request.json();

    // Admin approval update
    if (body.id && body.is_approved !== undefined) {
      const { error } = await supabase
        .from("reviews")
        .update({ is_approved: body.is_approved })
        .eq("id", body.id);

      if (error) {
        return Response.json({ error: error.message }, { status: 500 });
      }

      return Response.json({ success: true });
    }

    // New user review submission
    const { name, role, location, review } = body;

    const { error } = await supabase
      .from("reviews")
      .insert([
        {
          name,
          role,
          location,
          review,
          is_approved: false,
        },
      ]);

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({
      success: true,
      message: "Review submitted successfully. Thank you!",
    });

  } catch (error) {
    return Response.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}