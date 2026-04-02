import { NextResponse } from "next/server";
import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const OWNER_EMAIL = "joshuabeneventi@gmail.com";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  const validSecret =
    secret === "ljfc-friday-2026" ||
    (process.env.CRON_SECRET && secret === process.env.CRON_SECRET);

  if (!validSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Only run on Fridays
  const now = new Date();
  const day = new Date(now.toLocaleString("en-US", { timeZone: "America/Los_Angeles" })).getDay();
  if (day !== 5) {
    return NextResponse.json({ status: "skipped", reason: "Not Friday" });
  }

  if (!RESEND_API_KEY) {
    return NextResponse.json({ status: "error", message: "RESEND_API_KEY not set" }, { status: 500 });
  }

  const resend = new Resend(RESEND_API_KEY);
  const goLink = `https://lajollafreediveclub.com/api/saturday-blast?preview=true&type=go&secret=ljfc-saturday-2026`;
  const nogoLink = `https://lajollafreediveclub.com/api/saturday-blast?preview=true&type=nogo&secret=ljfc-saturday-2026`;
  const conditionsLink = "https://lajollafreediveclub.com/conditions";

  try {
    await resend.emails.send({
      from: "La Jolla Freedive Club <noreply@lajollafreediveclub.com>",
      to: [OWNER_EMAIL],
      subject: "Friday reminder: Send the Saturday go/no-go",
      html: `
        <div style="font-family:-apple-system,sans-serif;max-width:540px;padding:20px;">
          <h2 style="color:#0B1D2C;margin-bottom:12px;">Time to send the Saturday blast</h2>
          <p style="color:#5a6a7a;font-size:14px;line-height:1.6;">
            Check conditions and send the go/no-go email to the Saturday Crew.
          </p>
          <div style="margin:20px 0;">
            <p style="font-size:13px;color:#5a6a7a;margin-bottom:12px;">
              <strong>1.</strong> <a href="${conditionsLink}" style="color:#1B6B6B;">Check live conditions →</a>
            </p>
            <p style="font-size:13px;color:#5a6a7a;margin-bottom:12px;">
              <strong>2.</strong> Preview emails:
              <a href="${goLink}" style="color:#1B6B6B;margin-left:8px;">GO preview</a> ·
              <a href="${nogoLink}" style="color:#1B6B6B;">NO-GO preview</a>
            </p>
            <p style="font-size:13px;color:#5a6a7a;margin-bottom:12px;">
              <strong>3.</strong> Send from the <a href="https://lajollafreediveclub.com/saturday" style="color:#1B6B6B;">Saturday dashboard</a>
            </p>
          </div>
          <p style="font-size:11px;color:#5a6a7a;margin-top:24px;">
            This is an automated Friday reminder. The blast itself is still manual — you make the call.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ status: "sent" });
  } catch (error) {
    return NextResponse.json({
      status: "error",
      message: error instanceof Error ? error.message : "Failed",
    }, { status: 500 });
  }
}
