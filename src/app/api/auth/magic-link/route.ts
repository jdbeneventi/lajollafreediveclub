import { NextResponse } from "next/server";
import { Resend } from "resend";
import { supabase } from "@/lib/supabase";
import { issueMagicLink } from "@/lib/auth";

const RESEND_API_KEY = process.env.RESEND_API_KEY;

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    // Check if student exists
    const { data: existing } = await supabase
      .from("students")
      .select("id")
      .eq("email", email.toLowerCase())
      .single();

    if (!existing) {
      return NextResponse.json(
        { error: "No account found for this email. If you've booked a course, use the same email you booked with. Otherwise, contact Joshua to get set up." },
        { status: 404 }
      );
    }

    const link = await issueMagicLink(email);
    if (!link) {
      return NextResponse.json({ error: "Failed to create login link" }, { status: 500 });
    }

    // Send magic link email
    if (!RESEND_API_KEY) {
      return NextResponse.json({ error: "Email not configured" }, { status: 500 });
    }

    const resend = new Resend(RESEND_API_KEY);

    await resend.emails.send({
      from: "La Jolla Freedive Club <noreply@lajollafreediveclub.com>",
      to: [email],
      subject: "Your login link — La Jolla Freedive Club",
      html: `
        <div style="font-family:-apple-system,sans-serif;max-width:540px;padding:20px;">
          <h2 style="color:#0B1D2C;margin-bottom:8px;">Sign in to your account</h2>
          <p style="color:#5a6a7a;font-size:14px;line-height:1.6;">
            Click the button below to access your La Jolla Freedive Club dashboard.
            This link expires in 24 hours.
          </p>
          <div style="margin:24px 0;">
            <a href="${link.url}" style="display:inline-block;padding:14px 28px;background:#1B6B6B;color:white;border-radius:50px;text-decoration:none;font-weight:600;font-size:14px;">
              Sign in →
            </a>
          </div>
          <p style="color:#5a6a7a;font-size:12px;">
            If you didn't request this link, you can safely ignore this email.
          </p>
          <p style="color:#5a6a7a;font-size:11px;margin-top:24px;">
            La Jolla Freedive Club · San Diego, CA
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed" },
      { status: 500 }
    );
  }
}
