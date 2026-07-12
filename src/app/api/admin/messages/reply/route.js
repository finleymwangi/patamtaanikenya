import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  try {
    const { message_id, to_email, to_name, reply_text } = await request.json();

    if (!reply_text || !to_email) {
      return Response.json({ error: "Reply text and recipient email are required." }, { status: 400 });
    }

    const sendResult = await resend.emails.send({
      from: "PataMtaani <noreply@patamtaani.co.ke>",
      to: to_email,
      subject: "Re: Your message to PataMtaani",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; background: #0a0a0a; color: #ffffff; padding: 40px; border-radius: 16px;">
          <h1 style="color: #FF6B35; font-size: 24px; margin-bottom: 8px;">PataMtaani</h1>
          <p style="color: #888; font-size: 13px; margin-bottom: 24px;">Find it in the hood</p>
          <p style="color: #888; margin-bottom: 16px;">Hi ${to_name || "there"},</p>
          <div style="background: #111111; border: 1px solid #2a2a2a; border-radius: 12px; padding: 20px;">
            <p style="color: #f5f0eb; line-height: 1.6; margin: 0; white-space: pre-wrap;">${reply_text}</p>
          </div>
          <p style="color: #888; font-size: 13px; margin-top: 24px;">— The PataMtaani Team</p>
        </div>
      `,
    });

    console.log("Resend result:", JSON.stringify(sendResult));

    if (message_id) {
      await supabase.from("contact_messages").update({ is_read: true }).eq("id", message_id);
    }

    return Response.json({ success: true });

  } catch (error) {
    console.error("Reply error:", error);
    return Response.json({ error: "Failed to send reply." }, { status: 500 });
  }
}