import { NextResponse } from "next/server";
import { Resend } from "resend";
import { supabase } from "@/lib/supabase";
import { getNextSaturday } from "@/lib/saturday";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const OWNER_EMAIL = "joshuabeneventi@gmail.com";

export async function POST(request: Request) {
  try {
    const { email, lineDiving } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const isDiving = lineDiving === true;
    const saturdayDate = getNextSaturday();

    // Look up member
    let memberId: string | null = null;
    try {
      const { data: member } = await supabase
        .from("saturday_members")
        .select("id")
        .eq("email", email)
        .single();
      memberId = member?.id || null;
    } catch {}

    // Upsert confirmation
    try {
      await supabase
        .from("saturday_confirmations")
        .upsert({
          member_id: memberId,
          email,
          saturday_date: saturdayDate,
          line_diving: isDiving,
        }, { onConflict: "email,saturday_date" });
    } catch {}

    // Notify Joshua with the confirmation
    if (RESEND_API_KEY) {
      const resend = new Resend(RESEND_API_KEY);
      try {
        await resend.emails.send({
          from: "La Jolla Freedive Club <noreply@lajollafreediveclub.com>",
          to: [OWNER_EMAIL],
          subject: `Saturday confirmed: ${email}${isDiving ? " — DIVING" : " — beach"}`,
          html: `
            <div style="font-family:-apple-system,sans-serif;padding:20px;">
              <p style="font-size:14px;color:#0B1D2C;"><strong>${email}</strong> confirmed for Saturday.</p>
              <p style="font-size:14px;color:#5a6a7a;">Activity: ${isDiving ? "Line diving" : "Beach only"}</p>
            </div>
          `,
        });
      } catch {
        // Non-critical
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
