import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { Resend } from "resend";

const SECRET = "ljfc";

function formatDateReadable(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

function formatCourseDates(dates: string): string {
  // Handle "2026-04-29" or "2026-04-29 – 2026-05-01"
  const parts = dates.split(/\s*[–-]\s*/);
  if (parts.length === 2 && parts[0].match(/^\d{4}-/)) {
    return `${formatDateReadable(parts[0])} – ${formatDateReadable(parts[1])}`;
  }
  if (parts[0].match(/^\d{4}-/)) {
    return formatDateReadable(parts[0]);
  }
  return dates; // Already formatted
}

function getCourseLevel(courseName: string): "aida1" | "aida2" | "aida3" | "other" {
  const lower = courseName.toLowerCase();
  if (lower.includes("aida 3") || lower.includes("aida3")) return "aida3";
  if (lower.includes("aida 2") || lower.includes("aida2")) return "aida2";
  if (lower.includes("aida 1") || lower.includes("aida1") || lower.includes("discover")) return "aida1";
  return "other";
}

const MANUAL_MAP: Record<string, { label: string; file: string }> = {
  aida1: { label: "AIDA1 Discover Freediving Manual", file: "aida1-manual.pdf" },
  aida2: { label: "AIDA2 Freediver Course Manual", file: "aida2-manual.pdf" },
  aida3: { label: "AIDA2 Freediver Course Manual", file: "aida2-manual.pdf" }, // AIDA3 students should already have AIDA2
};

function enrollmentEmailHtml(studentName: string, courseName: string, courseDates: string, email: string) {
  const formattedDates = courseDates ? formatCourseDates(courseDates) : "";
  const level = getCourseLevel(courseName);
  const showPrepGuide = level === "aida2" || level === "aida3";
  const manual = MANUAL_MAP[level];

  let stepNum = 1;
  const steps: string[] = [];

  if (showPrepGuide) {
    steps.push(`<strong style="color:#0B1D2C;">${stepNum}. Complete the Course Prep Guide</strong><br/>
          Interactive guide covering physiology, equalization, safety, and technique. Students who complete it arrive ready.`);
    stepNum++;
  }

  if (manual) {
    steps.push(`<strong style="color:#0B1D2C;">${stepNum}. Download the ${manual.label}</strong><br/>
          <a href="https://lajollafreediveclub.com/documents/${manual.file}" style="color:#1B6B6B;text-decoration:underline;">${manual.label} (PDF)</a> — the official reference material for your course.`);
    stepNum++;
  }

  steps.push(`<strong style="color:#0B1D2C;">${stepNum}. Complete Your Forms</strong><br/>
          <a href="https://lajollafreediveclub.com/forms/aida" style="color:#1B6B6B;text-decoration:underline;">AIDA Medical Statement & Liability Release</a><br/>
          <a href="https://lajollafreediveclub.com/waiver" style="color:#1B6B6B;text-decoration:underline;">LJFC Waiver</a>`);

  return `
    <div style="font-family:-apple-system,'DM Sans',sans-serif;max-width:540px;padding:20px;">
      <div style="font-size:11px;color:#3db8a4;text-transform:uppercase;letter-spacing:2px;margin-bottom:16px;">La Jolla Freedive Club</div>
      <h1 style="font-family:Georgia,serif;font-size:24px;color:#0B1D2C;font-weight:normal;margin:0 0 8px;">Hey ${studentName},</h1>
      <p style="font-size:15px;color:#3A4A56;line-height:1.7;">
        You're enrolled in <strong style="color:#0B1D2C;">${courseName}</strong>${formattedDates ? ` — ${formattedDates}` : ""}. Here's how to get ready.
      </p>
      <div style="background:#F5F0E6;border-radius:12px;padding:20px;margin:20px 0;">
        <div style="font-size:11px;color:#1B6B6B;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:12px;font-weight:700;">Before Day 1</div>
        <div style="margin-bottom:16px;">
          <a href="https://lajollafreediveclub.com/portal" style="display:inline-block;padding:12px 24px;background:#1B6B6B;color:white;border-radius:50px;text-decoration:none;font-weight:600;font-size:14px;">
            Open Your Student Portal →
          </a>
        </div>
        <div style="font-size:13px;color:#3A4A56;line-height:1.8;">
          ${steps.join("<br/><br/>")}
        </div>
      </div>
      <p style="font-size:13px;color:#3A4A56;line-height:1.7;">
        Log in to your portal using this email address (<strong>${email}</strong>). I'll send meeting location and time details separately before your course date.
      </p>
      <p style="font-size:13px;color:#3A4A56;line-height:1.7;">Questions? Just reply to this email or text me anytime.</p>
      <p style="font-size:14px;color:#0B1D2C;margin-top:20px;">
        — Joshua<br/>
        <span style="font-size:12px;color:#999;">AIDA Instructor · La Jolla Freedive Club</span>
      </p>
      <div style="margin-top:24px;padding-top:16px;border-top:1px solid #eee;font-size:11px;color:#999;">
        La Jolla Freedive Club · La Jolla Shores, San Diego, CA
      </div>
    </div>
  `;
}

export async function GET(req: NextRequest) {
  if (req.nextUrl.searchParams.get("key") !== SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date().toISOString().split("T")[0];

  const [
    { data: events },
    { data: bookings },
    { data: students },
  ] = await Promise.all([
    supabase
      .from("calendar_events")
      .select("*")
      .in("category", ["course", "camp"])
      .gte("date", today)
      .eq("active", true)
      .order("date", { ascending: true }),
    supabase
      .from("bookings")
      .select("id, student_id, email, course, course_dates, status, payment_status, payment_amount, deposit_paid, event_id"),
    supabase
      .from("students")
      .select("id, email, first_name, last_name"),
  ]);

  return NextResponse.json({
    events: events || [],
    bookings: bookings || [],
    students: students || [],
  });
}

export async function POST(req: NextRequest) {
  if (req.nextUrl.searchParams.get("key") !== SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { action } = body as { action: string };

  if (action === "enroll") {
    const { eventId, email, firstName, lastName } = body as {
      eventId: string; email: string; firstName?: string; lastName?: string;
    };

    if (!eventId || !email) {
      return NextResponse.json({ error: "eventId and email required" }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Upsert student
    const { data: student, error: studentErr } = await supabase
      .from("students")
      .upsert({
        email: cleanEmail,
        first_name: firstName?.trim() || null,
        last_name: lastName?.trim() || null,
      }, { onConflict: "email" })
      .select("id")
      .single();

    if (studentErr) {
      return NextResponse.json({ error: studentErr.message }, { status: 500 });
    }

    // Get event details for booking record
    const { data: event } = await supabase
      .from("calendar_events")
      .select("title, date, end_date")
      .eq("id", eventId)
      .single();

    const courseDates = event?.end_date
      ? `${event.date} – ${event.end_date}`
      : event?.date || "";

    // Create booking linked to event
    const { error: bookErr } = await supabase
      .from("bookings")
      .insert({
        student_id: student.id,
        email: cleanEmail,
        course: event?.title || "Course",
        course_dates: courseDates,
        event_id: eventId,
        status: "confirmed",
        payment_status: "pending",
      });

    if (bookErr) {
      return NextResponse.json({ error: bookErr.message }, { status: 500 });
    }

    // Send enrollment invite email
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    if (RESEND_API_KEY) {
      const resend = new Resend(RESEND_API_KEY);
      const studentName = firstName?.trim() || cleanEmail.split("@")[0];
      const courseName = event?.title || "your freediving course";
      try {
        await resend.emails.send({
          from: "La Jolla Freedive Club <noreply@lajollafreediveclub.com>",
          to: [cleanEmail],
          subject: `You're enrolled — ${courseName}`,
          html: enrollmentEmailHtml(studentName, courseName, courseDates, cleanEmail),
        });
      } catch {
        // Don't fail the enrollment if email fails
      }
    }

    return NextResponse.json({ ok: true });
  }

  if (action === "remove_enrollment") {
    const { bookingId } = body as { bookingId: string };

    const { error } = await supabase
      .from("bookings")
      .delete()
      .eq("id", bookingId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  }

  if (action === "resend_invite") {
    const { bookingId } = body as { bookingId: string };

    // Get booking + student + event
    const { data: booking } = await supabase
      .from("bookings")
      .select("email, student_id, course, course_dates, event_id")
      .eq("id", bookingId)
      .single();

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const { data: student } = await supabase
      .from("students")
      .select("first_name")
      .eq("id", booking.student_id)
      .single();

    const studentName = student?.first_name || booking.email.split("@")[0];
    const courseName = booking.course || "your freediving course";
    const courseDates = booking.course_dates || "";

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    if (!RESEND_API_KEY) {
      return NextResponse.json({ error: "Email not configured" }, { status: 500 });
    }

    const resend = new Resend(RESEND_API_KEY);
    await resend.emails.send({
      from: "La Jolla Freedive Club <noreply@lajollafreediveclub.com>",
      to: [booking.email],
      subject: `Reminder: ${courseName} — get ready`,
      html: enrollmentEmailHtml(studentName, courseName, courseDates, booking.email),
    });

    return NextResponse.json({ ok: true });
  }

  if (action === "blast_email") {
    const { eventId, subject, message } = body as {
      eventId: string; subject: string; message: string;
    };

    if (!eventId || !subject || !message) {
      return NextResponse.json({ error: "eventId, subject, and message required" }, { status: 400 });
    }

    // Get participants
    const { data: bookings } = await supabase
      .from("bookings")
      .select("email")
      .eq("event_id", eventId);

    if (!bookings || bookings.length === 0) {
      return NextResponse.json({ error: "No participants to email" }, { status: 400 });
    }

    const emails = Array.from(new Set(bookings.map((b: { email: string }) => b.email)));

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    if (!RESEND_API_KEY) {
      return NextResponse.json({ error: "Email not configured" }, { status: 500 });
    }

    const resend = new Resend(RESEND_API_KEY);
    let sent = 0;

    for (const email of emails) {
      try {
        await resend.emails.send({
          from: "La Jolla Freedive Club <noreply@lajollafreediveclub.com>",
          to: [email],
          subject,
          html: `
            <div style="font-family:-apple-system,sans-serif;max-width:540px;padding:20px;">
              <div style="font-size:11px;color:#3db8a4;text-transform:uppercase;letter-spacing:2px;margin-bottom:12px;">La Jolla Freedive Club</div>
              <div style="font-size:15px;color:#0B1D2C;line-height:1.7;white-space:pre-wrap;">${message}</div>
              <div style="margin-top:24px;padding-top:16px;border-top:1px solid #eee;font-size:11px;color:#999;">
                La Jolla Freedive Club · San Diego, CA
              </div>
            </div>
          `,
        });
        sent++;
      } catch {
        // Continue sending to others
      }
    }

    return NextResponse.json({ ok: true, sent, total: emails.length });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
