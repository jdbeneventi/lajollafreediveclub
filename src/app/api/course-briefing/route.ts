import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getReadinessScore } from "@/lib/readiness";
import { Resend } from "resend";

const CRON_SECRET = process.env.CRON_SECRET;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const OWNER_EMAIL = "joshuabeneventi@gmail.com";

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== CRON_SECRET && secret !== "ljfc") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Default to 2 days from now
  const dateParam = req.nextUrl.searchParams.get("date");
  let targetDate: string;
  if (dateParam) {
    targetDate = dateParam;
  } else {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    targetDate = d.toISOString().split("T")[0];
  }

  // Find bookings with matching course_dates
  const { data: bookings } = await supabase
    .from("bookings")
    .select("*")
    .ilike("course_dates", `%${targetDate}%`);

  if (!bookings || bookings.length === 0) {
    return NextResponse.json({ message: "No courses on target date", date: targetDate });
  }

  // Group by course + dates
  const courses = new Map<string, typeof bookings>();
  for (const b of bookings) {
    const key = `${b.course}|${b.course_dates}`;
    if (!courses.has(key)) courses.set(key, []);
    courses.get(key)!.push(b);
  }

  if (!RESEND_API_KEY) {
    return NextResponse.json({ error: "Email not configured" }, { status: 500 });
  }
  const resend = new Resend(RESEND_API_KEY);

  const results: string[] = [];

  for (const [key, roster] of Array.from(courses.entries())) {
    const [courseName, courseDates] = key.split("|");

    // Build student details
    const studentRows: string[] = [];
    for (const booking of roster) {
      const email = booking.email;

      // Fetch student data
      const { data: student } = await supabase.from("students").select("id, first_name, last_name").eq("email", email).single();

      const [
        { data: onboarding },
        { data: medical },
        { data: gearEntries },
      ] = await Promise.all([
        supabase.from("student_onboarding").select("*").eq("email", email).single(),
        supabase.from("aida_forms").select("*").eq("email", email).eq("form_type", "medical_statement").order("signed_at", { ascending: false }).limit(1),
        supabase.from("student_gear").select("*, gear_catalog(name)").eq("student_id", student?.id || "").eq("status", "need"),
      ]);

      const readiness = student ? await getReadinessScore(student.id, email) : { ready: false, percent: 0, missing: ["No student record"] };
      const name = [student?.first_name, student?.last_name].filter(Boolean).join(" ") || email;
      const hasMedical = medical && medical.length > 0;
      const physicianFlag = hasMedical && (medical[0] as { physician_required: boolean; physician_cleared: boolean }).physician_required && !(medical[0] as { physician_cleared: boolean }).physician_cleared;

      const gearNeeded = (gearEntries || []).map((g: { gear_catalog: { name: string } | null }) => g.gear_catalog?.name).filter(Boolean);

      studentRows.push(`
        <tr style="border-bottom:1px solid #eee;">
          <td style="padding:12px 8px;vertical-align:top;">
            <strong style="color:#0B1D2C;">${name}</strong><br>
            <span style="font-size:11px;color:#5a6a7a;">${email}</span>
            ${onboarding?.emergency_contact_name ? `<br><span style="font-size:11px;color:#5a6a7a;">EC: ${onboarding.emergency_contact_name} ${onboarding.emergency_contact_phone || ""}</span>` : ""}
          </td>
          <td style="padding:12px 8px;vertical-align:top;">
            <span style="display:inline-block;padding:2px 8px;border-radius:50px;font-size:11px;font-weight:600;${readiness.ready ? "background:#e6f7f4;color:#1B6B6B;" : "background:#fde8e4;color:#C75B3A;"}">
              ${readiness.ready ? "Ready ✓" : `${readiness.percent}%`}
            </span>
            ${!readiness.ready ? `<div style="font-size:10px;color:#C75B3A;margin-top:4px;">${readiness.missing.join("<br>")}</div>` : ""}
          </td>
          <td style="padding:12px 8px;vertical-align:top;font-size:12px;">
            ${physicianFlag ? '<span style="color:#C75B3A;font-weight:600;">⚠ Physician clearance needed</span><br>' : ""}
            ${onboarding?.swim_ability ? `Swim: ${onboarding.swim_ability}<br>` : ""}
            ${onboarding?.freediving_experience ? `Experience: ${onboarding.freediving_experience}<br>` : ""}
            ${onboarding?.theory_preference ? `Theory: ${onboarding.theory_preference}<br>` : ""}
            ${gearNeeded.length > 0 ? `<span style="color:#C75B3A;">Needs: ${gearNeeded.join(", ")}</span><br>` : ""}
            ${onboarding?.height_ft ? `${onboarding.height_ft}'${onboarding.height_in || 0}" / ${onboarding.weight_lbs || "?"}lbs / ${onboarding.sex || "?"}` : "No sizing"}
          </td>
          <td style="padding:12px 8px;vertical-align:top;font-size:12px;color:#5a6a7a;">
            ${onboarding?.notes || "—"}
          </td>
        </tr>
      `);
    }

    const html = `
      <div style="font-family:-apple-system,sans-serif;max-width:700px;padding:20px;">
        <h2 style="color:#0B1D2C;margin-bottom:4px;">Course Briefing: ${courseName}</h2>
        <p style="color:#5a6a7a;font-size:14px;margin-bottom:16px;">${courseDates} · ${roster.length} student${roster.length !== 1 ? "s" : ""}</p>
        <table style="width:100%;border-collapse:collapse;font-size:13px;">
          <thead>
            <tr style="border-bottom:2px solid #0B1D2C;">
              <th style="text-align:left;padding:8px;color:#5a6a7a;font-size:10px;text-transform:uppercase;letter-spacing:1px;">Student</th>
              <th style="text-align:left;padding:8px;color:#5a6a7a;font-size:10px;text-transform:uppercase;letter-spacing:1px;">Ready</th>
              <th style="text-align:left;padding:8px;color:#5a6a7a;font-size:10px;text-transform:uppercase;letter-spacing:1px;">Details</th>
              <th style="text-align:left;padding:8px;color:#5a6a7a;font-size:10px;text-transform:uppercase;letter-spacing:1px;">Notes</th>
            </tr>
          </thead>
          <tbody>${studentRows.join("")}</tbody>
        </table>
        <p style="color:#5a6a7a;font-size:11px;margin-top:24px;">
          <a href="https://lajollafreediveclub.com/admin/onboarding?key=ljfc" style="color:#1B6B6B;">View full onboarding data →</a> ·
          <a href="https://lajollafreediveclub.com/admin/students?key=ljfc" style="color:#1B6B6B;">Student progress →</a>
        </p>
      </div>
    `;

    await resend.emails.send({
      from: "La Jolla Freedive Club <noreply@lajollafreediveclub.com>",
      to: [OWNER_EMAIL],
      subject: `Course Briefing: ${courseName} — ${courseDates} (${roster.length} students)`,
      html,
    });

    results.push(`${courseName} (${roster.length} students) — sent`);
  }

  return NextResponse.json({ ok: true, date: targetDate, courses: results });
}
