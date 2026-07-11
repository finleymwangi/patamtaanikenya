import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !subject || !message) {
      return Response.json({ error: "All fields are required." }, { status: 400 });
    }

    await supabase.from("contact_messages").insert([{ name, email, subject, message }]);

    await resend.emails.send({
      from: "PataMtaani Contact <onboarding@resend.dev>",
      to: "patamtaanikenya@gmail.com",
      subject: "[Contact] " + subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; background: #0a0a0a; color: #ffffff; padding: 40px; border-radius: 16px;">
          <h1 style="color: #FF6B35; font-size: 24px; margin-bottom: 24px;">New Contact Message</h1>
          <p style="color: #888; margin-bottom: 8px;">From: <span style="color: #fff;">${name} (${email})</span></p>
          <p style="color: #888; margin-bottom: 24px;">Subject: <span style="color: #fff;">${subject}</span></p>
          <div style="background: #111111; border: 1px solid #2a2a2a; border-radius: 12px; padding: 20px;">
            <p style="color: #f5f0eb; line-height: 1.6; margin: 0;">${message}</p>
          </div>
        </div>
      `,
    });

    return Response.json({ success: true });

  } catch (error) {
    console.error("Contact email error:", error);
    return Response.json({ error: "Failed to send message. Please try again." }, { status: 500 });
  }
}