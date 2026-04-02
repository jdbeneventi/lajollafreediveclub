import { NextResponse } from "next/server";
import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const OWNER_EMAIL = "joshuabeneventi@gmail.com";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { firstName, lastName, email, lineDiving, certLevel, firstTime } = data;

    if (!firstName || !email) {
      return NextResponse.json({ error: "Name and email required" }, { status: 400 });
    }

    const name = `${firstName} ${lastName}`.trim();
    const isDiving = lineDiving === true || lineDiving === "yes";
    const isFirst = firstTime === true || firstTime === "yes";

    // Send confirmation email to user
    if (RESEND_API_KEY) {
      const resend = new Resend(RESEND_API_KEY);
      const fromAddress = "La Jolla Freedive Club <noreply@lajollafreediveclub.com>";

      const waiverLink = "https://lajollafreediveclub.com/waiver";
      const conditionsLink = "https://lajollafreediveclub.com/conditions";
      const gearLink = "https://lajollafreediveclub.com/gear";

      const gearList = isDiving
        ? "Wetsuit, mask + snorkel, fins, weight belt, lanyard, towel, water"
        : "Towel, water, sunscreen, yoga mat, comfortable clothes";

      try {
        await resend.emails.send({
          from: fromAddress,
          to: [email],
          subject: `You're registered for Saturday — La Jolla Freedive Club`,
          html: `
            <div style="font-family:-apple-system,sans-serif;max-width:540px;padding:20px;">
              <h2 style="color:#0B1D2C;margin-bottom:8px;">You're in, ${firstName}!</h2>
              <p style="color:#5a6a7a;font-size:14px;line-height:1.6;">
                You're registered for this Saturday at La Jolla Shores.
                We'll send a go/no-go confirmation Friday based on conditions.
              </p>

              <div style="background:#FAF3EC;border-radius:12px;padding:16px;margin:16px 0;">
                <table style="width:100%;font-size:14px;border-collapse:collapse;">
                  <tr><td style="padding:6px 0;color:#5a6a7a;width:120px;">Schedule</td><td style="padding:6px 0;font-weight:600;">7:00–8:15 Beach · 8:30–10:00 Dive</td></tr>
                  <tr><td style="padding:6px 0;color:#5a6a7a;">Diving</td><td style="padding:6px 0;font-weight:600;">${isDiving ? `Yes — ${certLevel || "certified"}` : "Beach only"}</td></tr>
                  <tr><td style="padding:6px 0;color:#5a6a7a;">Location</td><td style="padding:6px 0;">Kellogg Park, La Jolla Shores</td></tr>
                </table>
              </div>

              ${isFirst ? `
              <div style="background:#FFF3EE;border:1px solid rgba(199,91,58,0.2);border-radius:12px;padding:16px;margin:16px 0;">
                <p style="font-size:14px;font-weight:600;color:#C75B3A;margin:0 0 8px 0;">First time? Sign your waiver</p>
                <p style="font-size:13px;color:#5a6a7a;margin:0 0 8px 0;">Required before your first session. Takes 2 minutes.</p>
                <a href="${waiverLink}" style="display:inline-block;padding:8px 20px;background:#C75B3A;color:white;border-radius:50px;text-decoration:none;font-weight:600;font-size:13px;">Sign waiver →</a>
              </div>
              ` : ""}

              <div style="margin:16px 0;">
                <p style="font-size:13px;font-weight:600;color:#0B1D2C;margin:0 0 6px 0;">What to bring</p>
                <p style="font-size:13px;color:#5a6a7a;margin:0;">${gearList}</p>
              </div>

              <div style="margin:16px 0;">
                <p style="font-size:13px;font-weight:600;color:#0B1D2C;margin:0 0 6px 0;">Before Saturday</p>
                <p style="font-size:13px;color:#5a6a7a;margin:0;">
                  <a href="${conditionsLink}" style="color:#1B6B6B;">Check conditions</a> ·
                  <a href="${gearLink}" style="color:#1B6B6B;">Gear guide</a> ·
                  Parking tip: summer lot fills by 7:30am — arrive early or park on Camino del Oro.
                </p>
              </div>

              <p style="color:#5a6a7a;font-size:11px;margin-top:24px;">
                La Jolla Freedive Club · San Diego, CA · AIDA Certified · DAN Insured
              </p>
            </div>
          `,
        });
      } catch {
        // Non-critical
      }

      // Notify Joshua with headcount info
      try {
        await resend.emails.send({
          from: fromAddress,
          to: [OWNER_EMAIL],
          subject: `Saturday RSVP: ${name}${isDiving ? " — DIVING" : " — beach only"}`,
          html: `
            <div style="font-family:-apple-system,sans-serif;max-width:540px;padding:20px;">
              <h3 style="color:#0B1D2C;">${name} registered for Saturday</h3>
              <table style="font-size:14px;border-collapse:collapse;">
                <tr><td style="padding:4px 12px 4px 0;color:#5a6a7a;">Email</td><td>${email}</td></tr>
                <tr><td style="padding:4px 12px 4px 0;color:#5a6a7a;">Diving</td><td style="font-weight:600;${isDiving ? "color:#1B6B6B;" : ""}">${isDiving ? `Yes — ${certLevel}` : "Beach only"}</td></tr>
                <tr><td style="padding:4px 12px 4px 0;color:#5a6a7a;">First time</td><td>${isFirst ? "Yes" : "No"}</td></tr>
              </table>
            </div>
          `,
        });
      } catch {
        // Non-critical
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed" },
      { status: 500 }
    );
  }
}
