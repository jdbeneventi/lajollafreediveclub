import { NextResponse } from "next/server";
import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  if (secret !== "ljfc" && secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { email, name, course } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    if (!RESEND_API_KEY) {
      return NextResponse.json({ error: "RESEND_API_KEY not configured" }, { status: 500 });
    }

    const resend = new Resend(RESEND_API_KEY);
    const firstName = name?.split(" ")[0] || "there";
    const formsUrl = `https://lajollafreediveclub.com/forms/aida?email=${encodeURIComponent(email)}&course=${encodeURIComponent(course || "AIDA 2")}`;
    const medicalUrl = "https://lajollafreediveclub.com/documents/aida-medical-statement.pdf";
    const liabilityUrl = "https://lajollafreediveclub.com/documents/aida-liability-release.pdf";
    const waiverUrl = "https://lajollafreediveclub.com/waiver";

    const { error } = await resend.emails.send({
      from: "La Jolla Freedive Club <noreply@lajollafreediveclub.com>",
      to: [email],
      subject: `AIDA Course Forms — La Jolla Freedive Club`,
      html: `
        <div style="font-family:-apple-system,sans-serif;max-width:540px;padding:20px;">
          <h2 style="color:#0B1D2C;margin-bottom:8px;">Hi ${firstName},</h2>
          <p style="color:#5a6a7a;font-size:14px;line-height:1.6;">
            Here are the required forms for your ${course || "AIDA"} course. Please complete and return them before your first day.
          </p>

          <div style="background:#FAF3EC;border-radius:12px;padding:20px;margin:20px 0;">
            <p style="font-size:14px;font-weight:600;color:#0B1D2C;margin:0 0 8px 0;">Required AIDA Forms</p>
            <p style="font-size:13px;color:#5a6a7a;margin:0 0 16px 0;">Complete both forms online — takes about 5 minutes.</p>

            <div style="margin-bottom:16px;">
              <a href="${formsUrl}" style="display:inline-block;padding:14px 28px;background:#C75B3A;color:white;border-radius:50px;text-decoration:none;font-weight:600;font-size:14px;">
                Complete Forms Online →
              </a>
            </div>

            <p style="font-size:11px;color:#5a6a7a;margin:0;">
              Or download PDFs: <a href="${medicalUrl}" style="color:#1B6B6B;">Medical Statement</a> · <a href="${liabilityUrl}" style="color:#1B6B6B;">Liability Release</a>
            </p>
          </div>

          <div style="background:#F0F8FC;border-radius:12px;padding:16px;margin:20px 0;">
            <p style="font-size:13px;color:#5a6a7a;line-height:1.6;margin:0;">
              <strong style="color:#0B1D2C;">Also required:</strong>
              <a href="${waiverUrl}" style="color:#1B6B6B;">Sign your LJFC waiver online</a> — takes 2 minutes, one time only.
            </p>
          </div>

          <p style="color:#5a6a7a;font-size:13px;line-height:1.6;">
            You can fill out the PDFs digitally and email them back, or print, sign, and bring them on Day 1.
          </p>

          <p style="color:#5a6a7a;font-size:11px;margin-top:24px;">
            La Jolla Freedive Club · San Diego, CA · AIDA Certified · DAN Insured
          </p>
        </div>
      `,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed" },
      { status: 500 }
    );
  }
}
