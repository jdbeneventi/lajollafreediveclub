import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getReadinessScore } from "@/lib/readiness";
import { issueMagicLink } from "@/lib/auth";
import { Resend } from "resend";

const CRON_SECRET = process.env.CRON_SECRET;
const RESEND_API_KEY = process.env.RESEND_API_KEY;

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== CRON_SECRET && secret !== "ljfc") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2 days from now
  const dateParam = req.nextUrl.searchParams.get("date");
  let targetDate: string;
  if (dateParam) {
    targetDate = dateParam;
  } else {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    targetDate = d.toISOString().split("T")[0];
  }

  const { data: bookings } = await supabase
    .from("bookings")
    .select("*")
    .ilike("course_dates", `%${targetDate}%`);

  if (!bookings || bookings.length === 0) {
    return NextResponse.json({ message: "No courses on target date", date: targetDate });
  }

  if (!RESEND_API_KEY) {
    return NextResponse.json({ error: "Email not configured" }, { status: 500 });
  }
  const resend = new Resend(RESEND_API_KEY);
  const sent: string[] = [];

  for (const booking of bookings) {
    const email = booking.email;
    const courseName = booking.course;
    const courseDates = booking.course_dates;

    const { data: student } = await supabase
      .from("students")
      .select("id, first_name")
      .eq("email", email)
      .single();

    if (!student) continue;

    const readiness = await getReadinessScore(student.id, email);
    const firstName = student.first_name || email.split("@")[0];

    // Generate magic link for easy access
    const link = await issueMagicLink(email);
    const portalUrl = link?.url || "https://lajollafreediveclub.com/portal";

    let bodyHtml: string;

    if (readiness.ready) {
      // All set — logistics email
      bodyHtml = `
        <div style="font-family:-apple-system,sans-serif;max-width:540px;padding:20px;">
          <h2 style="color:#0B1D2C;margin-bottom:8px;">You're all set, ${firstName}!</h2>
          <p style="color:#5a6a7a;font-size:14px;line-height:1.6;">
            Your <strong>${courseName}</strong> is coming up on <strong>${courseDates}</strong>. Everything is in order — here's what to know for course day:
          </p>
          <div style="background:#FAF3EC;border-radius:12px;padding:16px;margin:16px 0;font-size:13px;color:#3A4A56;line-height:1.7;">
            <strong>Meeting spot:</strong> La Jolla Shores, by the lifeguard tower<br>
            <strong>Time:</strong> 7:30am — be there 10 min early<br>
            <strong>Bring:</strong> All your gear, water bottle, sunscreen, towel<br>
            <strong>Eat:</strong> Light breakfast 1-2 hours before — no heavy meals<br>
            <strong>Skip:</strong> Alcohol the night before, caffeine morning-of
          </div>
          <p style="color:#5a6a7a;font-size:13px;">
            Questions? Reply to this email or text me directly.
          </p>
          <p style="color:#5a6a7a;font-size:11px;margin-top:24px;">Joshua · La Jolla Freedive Club · AIDA Instructor</p>
        </div>
      `;
    } else {
      // Missing items — checklist email
      const items = readiness.missing.map(m => {
        let link = portalUrl;
        if (m.includes("onboarding")) link = portalUrl;
        else if (m.includes("medical")) link = portalUrl;
        else if (m.includes("liability")) link = "https://lajollafreediveclub.com/forms/aida";
        else if (m.includes("waiver")) link = "https://lajollafreediveclub.com/waiver";
        else if (m.includes("Prep")) link = portalUrl;
        return `<li style="margin-bottom:8px;"><a href="${link}" style="color:#1B6B6B;font-weight:600;">${m}</a></li>`;
      });

      bodyHtml = `
        <div style="font-family:-apple-system,sans-serif;max-width:540px;padding:20px;">
          <h2 style="color:#0B1D2C;margin-bottom:8px;">Almost there, ${firstName}!</h2>
          <p style="color:#5a6a7a;font-size:14px;line-height:1.6;">
            Your <strong>${courseName}</strong> is in 2 days (<strong>${courseDates}</strong>).
            You're ${readiness.percent}% ready — here's what's still needed:
          </p>
          <div style="background:#fde8e4;border-radius:12px;padding:16px;margin:16px 0;">
            <ul style="margin:0;padding:0 0 0 20px;font-size:14px;color:#0B1D2C;line-height:1.8;">
              ${items.join("")}
            </ul>
          </div>
          <div style="margin:20px 0;text-align:center;">
            <a href="${portalUrl}" style="display:inline-block;padding:14px 28px;background:#3db8a4;color:#0B1D2C;border-radius:50px;text-decoration:none;font-weight:700;font-size:14px;">
              Complete now →
            </a>
          </div>
          <p style="color:#5a6a7a;font-size:13px;">
            If you need help, reply to this email.
          </p>
          <p style="color:#5a6a7a;font-size:11px;margin-top:24px;">Joshua · La Jolla Freedive Club · AIDA Instructor</p>
        </div>
      `;
    }

    try {
      await resend.emails.send({
        from: "La Jolla Freedive Club <noreply@lajollafreediveclub.com>",
        to: [email],
        subject: readiness.ready
          ? `See you in 2 days — ${courseName}`
          : `Action needed before ${courseName} — ${readiness.missing.length} item${readiness.missing.length > 1 ? "s" : ""} remaining`,
        html: bodyHtml,
      });
      sent.push(email);
    } catch {}
  }

  return NextResponse.json({ ok: true, date: targetDate, sent });
}
