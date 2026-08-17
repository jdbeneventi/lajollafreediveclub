import { NextResponse, after } from "next/server";
import { Resend } from "resend";
import { supabase } from "@/lib/supabase";
import { enrichInquiry } from "@/lib/extractInquiryFacts";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const OWNER_EMAIL = "joshuabeneventi@gmail.com";
// The business mailbox (lajollafreediveclub@gmail.com). When set, inquiry
// traffic routes there instead of Joshua's personal account, and the Gmail
// sync watches it — the personal inbox stays personal.
const INQUIRY_INBOX = process.env.BUSINESS_EMAIL?.trim() || OWNER_EMAIL;

// Form values render into email HTML — escape so typed markup stays text.
const esc = (v: unknown): string =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { firstName, lastName, email, phone, course, experience, dates, groupSize, message } = data;

    if (!firstName || !email || !course) {
      return NextResponse.json({ error: "Name, email, and course required" }, { status: 400 });
    }

    const name = `${firstName} ${lastName}`.trim();
    const isAIDA = course.includes("AIDA");
    const formsUrl = `https://lajollafreediveclub.com/forms/aida?email=${encodeURIComponent(email)}&course=${encodeURIComponent(course.split("—")[0].trim())}`;
    const medicalUrl = "https://lajollafreediveclub.com/documents/aida-medical-statement.pdf";
    const liabilityUrl = "https://lajollafreediveclub.com/documents/aida-liability-release.pdf";
    const waiverUrl = "https://lajollafreediveclub.com/waiver";
    const calendarUrl = "https://lajollafreediveclub.com/calendar";

    // Store in Supabase
    try {
      const { data: inserted, error: insertError } = await supabase
        .from("course_inquiries")
        .insert({
          first_name: firstName,
          last_name: lastName || "",
          email,
          phone: phone || null,
          course,
          experience: experience || null,
          preferred_dates: dates || null,
          group_size: groupSize || null,
          message: message || null,
        })
        .select("id, created_at")
        .single();
      if (insertError) {
        console.error("[course-inquiry] Supabase insert failed:", insertError.message);
      }

      // LLM fact extraction (headcount, date window) runs after the response
      // is sent — zero added latency for the student, and a failure there
      // can't touch this route. The digest sweep re-tries any row it misses.
      if (inserted?.id) {
        after(() =>
          enrichInquiry(
            {
              id: inserted.id,
              created_at: inserted.created_at,
              course,
              experience: experience || null,
              preferred_dates: dates || null,
              group_size: groupSize || null,
              message: message || null,
            },
            "insert",
          ),
        );
      }
    } catch (e) {
      console.error("[course-inquiry] Supabase insert failed:", e);
    }

    // Send confirmation email to student
    if (RESEND_API_KEY) {
      const resend = new Resend(RESEND_API_KEY);
      const fromAddress = "La Jolla Freedive Club <noreply@lajollafreediveclub.com>";

      try {
        await resend.emails.send({
          from: fromAddress,
          to: [email],
          // The confirmation says "reply to this email" — make that land in
          // Joshua's inbox instead of noreply@'s forwarding limbo.
          replyTo: INQUIRY_INBOX,
          subject: `Course inquiry received — ${course.split("—")[0].trim()}`,
          html: `
            <div style="font-family:-apple-system,sans-serif;max-width:540px;padding:20px;">
              <h2 style="color:#0B1D2C;margin-bottom:8px;">Thanks, ${esc(firstName)}!</h2>
              <p style="color:#5a6a7a;font-size:14px;line-height:1.6;">
                We received your inquiry for <strong>${esc(course)}</strong>.
                Joshua will get back to you within 24 hours with available dates and next steps.
              </p>

              ${isAIDA ? `
              <div style="background:#FAF3EC;border-radius:12px;padding:16px;margin:20px 0;">
                <p style="font-size:14px;font-weight:600;color:#0B1D2C;margin:0 0 8px 0;">Get a head start — complete these before your course</p>
                <p style="font-size:13px;color:#5a6a7a;line-height:1.6;margin:0 0 12px 0;">
                  AIDA requires a Medical Statement and Liability Release from every student. Complete them online — takes about 5 minutes.
                </p>
                <div style="margin-bottom:12px;">
                  <a href="${formsUrl}" style="display:inline-block;padding:12px 24px;background:#C75B3A;color:white;border-radius:50px;text-decoration:none;font-weight:600;font-size:14px;">
                    Complete AIDA Forms Online →
                  </a>
                </div>
                <p style="font-size:11px;color:#5a6a7a;margin:0;">
                  Or download PDFs: <a href="${medicalUrl}" style="color:#1B6B6B;">Medical Statement</a> · <a href="${liabilityUrl}" style="color:#1B6B6B;">Liability Release</a>
                </p>
              </div>
              ` : ""}

              <div style="background:#F0F8FC;border-radius:12px;padding:16px;margin:20px 0;">
                <p style="font-size:14px;font-weight:600;color:#0B1D2C;margin:0 0 8px 0;">Also recommended</p>
                <ul style="font-size:13px;color:#5a6a7a;line-height:1.8;margin:0;padding-left:20px;">
                  <li><a href="${waiverUrl}" style="color:#1B6B6B;">Sign your LJFC waiver</a> — required for all in-water activities</li>
                  <li><a href="${calendarUrl}" style="color:#1B6B6B;">View the course calendar</a> — see all upcoming dates</li>
                </ul>
              </div>

              <p style="color:#5a6a7a;font-size:12px;margin-top:24px;">
                Questions? Reply to this email or visit <a href="https://lajollafreediveclub.com" style="color:#1B6B6B;">lajollafreediveclub.com</a>
              </p>
              <p style="color:#5a6a7a;font-size:11px;margin-top:16px;">
                La Jolla Freedive Club · San Diego, CA<br>
                AIDA Certified · DAN Insured · Red Cross First Aid/CPR/AED
              </p>
            </div>
          `,
        });
      } catch {
        // Non-critical
      }

      // Notify Joshua
      try {
        await resend.emails.send({
          from: fromAddress,
          to: [INQUIRY_INBOX],
          // Hitting "reply" on this notification in Gmail now addresses the
          // STUDENT — matching how Joshua actually answers inquiries (from
          // his personal account), instead of composing to noreply@.
          replyTo: email,
          subject: `Course inquiry: ${name} — ${course.split("—")[0].trim()}`,
          html: `
            <div style="font-family:-apple-system,sans-serif;max-width:540px;padding:20px;">
              <h3 style="color:#0B1D2C;">New course inquiry</h3>
              <table style="font-size:14px;border-collapse:collapse;">
                <tr><td style="padding:4px 12px 4px 0;color:#5a6a7a;">Name</td><td style="font-weight:600;">${esc(name)}</td></tr>
                <tr><td style="padding:4px 12px 4px 0;color:#5a6a7a;">Email</td><td>${esc(email)}</td></tr>
                ${phone ? `<tr><td style="padding:4px 12px 4px 0;color:#5a6a7a;">Phone</td><td>${esc(phone)}</td></tr>` : ""}
                <tr><td style="padding:4px 12px 4px 0;color:#5a6a7a;">Course</td><td style="font-weight:600;">${esc(course)}</td></tr>
                <tr><td style="padding:4px 12px 4px 0;color:#5a6a7a;">Experience</td><td>${esc(experience || "Not specified")}</td></tr>
                <tr><td style="padding:4px 12px 4px 0;color:#5a6a7a;">Dates</td><td>${esc(dates || "Flexible")}</td></tr>
                <tr><td style="padding:4px 12px 4px 0;color:#5a6a7a;">Group</td><td>${esc(groupSize || "Just me")}</td></tr>
                ${message ? `<tr><td style="padding:4px 12px 4px 0;color:#5a6a7a;">Message</td><td>${esc(message)}</td></tr>` : ""}
              </table>
              <p style="font-size:12px;color:#5a6a7a;margin-top:12px;">
                ${isAIDA ? "AIDA forms were included in their confirmation email." : "Non-AIDA inquiry — no forms sent."}
              </p>
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
