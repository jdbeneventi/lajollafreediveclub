import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { issueMagicLink } from "@/lib/auth";
import { Resend } from "resend";

const SECRET = "ljfc";
const RESEND_API_KEY = process.env.RESEND_API_KEY;

export async function POST(req: NextRequest) {
  if (req.nextUrl.searchParams.get("key") !== SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { emails } = await req.json();
  if (!Array.isArray(emails) || emails.length === 0) {
    return NextResponse.json({ error: "emails array required" }, { status: 400 });
  }

  if (!RESEND_API_KEY) {
    return NextResponse.json({ error: "Email not configured" }, { status: 500 });
  }

  const resend = new Resend(RESEND_API_KEY);
  const results: { email: string; status: string; error?: string }[] = [];

  for (const rawEmail of emails) {
    const email = rawEmail.trim().toLowerCase();
    if (!email || !email.includes("@")) {
      results.push({ email, status: "skipped", error: "Invalid email" });
      continue;
    }

    // Ensure student record exists — create if not
    const { data: existing } = await supabase
      .from("students")
      .select("id")
      .eq("email", email)
      .single();

    if (!existing) {
      const { error: insertErr } = await supabase
        .from("students")
        .insert({ email });

      if (insertErr) {
        results.push({ email, status: "error", error: insertErr.message });
        continue;
      }
    }

    // Issue magic link
    const link = await issueMagicLink(email);
    if (!link) {
      results.push({ email, status: "error", error: "Failed to generate link" });
      continue;
    }

    // Send email
    try {
      await resend.emails.send({
        from: "La Jolla Freedive Club <noreply@lajollafreediveclub.com>",
        to: [email],
        subject: "Welcome — complete your pre-course onboarding",
        html: `
          <div style="font-family:-apple-system,sans-serif;max-width:540px;padding:20px;">
            <h2 style="color:#0B1D2C;margin-bottom:8px;">Welcome to La Jolla Freedive Club!</h2>
            <p style="color:#5a6a7a;font-size:14px;line-height:1.6;">
              I'm looking forward to having you out on the water. Before course day, I need a few things from you — medical info, emergency contact, swim experience, and gear sizing.
            </p>
            <p style="color:#5a6a7a;font-size:14px;line-height:1.6;">
              It takes about 5 minutes. Click below to get started:
            </p>
            <div style="margin:24px 0;text-align:center;">
              <a href="${link.url}" style="display:inline-block;padding:14px 32px;background:#3db8a4;color:#0B1D2C;border-radius:50px;text-decoration:none;font-weight:700;font-size:14px;">
                Start onboarding →
              </a>
            </div>
            <p style="color:#5a6a7a;font-size:12px;line-height:1.6;">
              This link is valid for 24 hours. If it expires, you can request a new one at
              <a href="https://lajollafreediveclub.com/portal" style="color:#1B6B6B;">lajollafreediveclub.com/portal</a>
            </p>
            <p style="color:#5a6a7a;font-size:12px;margin-top:16px;">
              Questions? Just reply to this email.
            </p>
            <p style="color:#5a6a7a;font-size:11px;margin-top:24px;">
              Joshua · La Jolla Freedive Club · AIDA Instructor · DAN Insured
            </p>
          </div>
        `,
      });
      results.push({ email, status: "sent" });
    } catch (err) {
      results.push({ email, status: "error", error: err instanceof Error ? err.message : "Send failed" });
    }
  }

  return NextResponse.json({ ok: true, results });
}
