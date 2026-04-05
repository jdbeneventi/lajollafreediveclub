import { NextResponse } from "next/server";
import { Resend } from "resend";
import { supabase } from "@/lib/supabase";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const OWNER_EMAIL = "joshuabeneventi@gmail.com";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { firstName, lastName, email, phone, course, experience, dates, groupSize, message } = data;

    if (!firstName || !email || !course) {
      return NextResponse.json({ error: "Name, email, and course required" }, { status: 400 });
    }

    const name = `${firstName} ${lastName}`.trim();
    const isAIDA = course.includes("AIDA");
    const medicalUrl = "https://lajollafreediveclub.com/documents/aida-medical-statement.pdf";
    const liabilityUrl = "https://lajollafreediveclub.com/documents/aida-liability-release.pdf";
    const waiverUrl = "https://lajollafreediveclub.com/waiver";
    const calendarUrl = "https://lajollafreediveclub.com/calendar";

    // Store in Supabase
    try {
      await supabase.from("course_inquiries").insert({
        first_name: firstName,
        last_name: lastName || "",
        email,
        phone: phone || null,
        course,
        experience: experience || null,
        preferred_dates: dates || null,
        group_size: groupSize || null,
        message: message || null,
      });
    } catch {
      // Non-critical
    }

    // Send confirmation email to student
    if (RESEND_API_KEY) {
      const resend = new Resend(RESEND_API_KEY);
      const fromAddress = "La Jolla Freedive Club <noreply@lajollafreediveclub.com>";

      try {
        await resend.emails.send({
          from: fromAddress,
          to: [email],
          subject: `Course inquiry received — ${course.split("—")[0].trim()}`,
          html: `
            <div style="font-family:-apple-system,sans-serif;max-width:540px;padding:20px;">
              <h2 style="color:#0B1D2C;margin-bottom:8px;">Thanks, ${firstName}!</h2>
              <p style="color:#5a6a7a;font-size:14px;line-height:1.6;">
                We received your inquiry for <strong>${course}</strong>.
                Joshua will get back to you within 24 hours with available dates and next steps.
              </p>

              ${isAIDA ? `
              <div style="background:#FAF3EC;border-radius:12px;padding:16px;margin:20px 0;">
                <p style="font-size:14px;font-weight:600;color:#0B1D2C;margin:0 0 8px 0;">Get a head start — complete these before your course</p>
                <p style="font-size:13px;color:#5a6a7a;line-height:1.6;margin:0 0 12px 0;">
                  AIDA requires two forms from every student. Download, fill out, and bring them to your first day (or email them back to us).
                </p>
                <div style="margin-bottom:8px;">
                  <a href="${medicalUrl}" style="display:inline-block;padding:10px 20px;background:#1B6B6B;color:white;border-radius:50px;text-decoration:none;font-weight:600;font-size:13px;margin-right:8px;">
                    Medical Statement (PDF)
                  </a>
                </div>
                <div style="margin-bottom:8px;">
                  <a href="${liabilityUrl}" style="display:inline-block;padding:10px 20px;background:#1B6B6B;color:white;border-radius:50px;text-decoration:none;font-weight:600;font-size:13px;">
                    Liability Release (PDF)
                  </a>
                </div>
                <p style="font-size:11px;color:#5a6a7a;margin:8px 0 0 0;">
                  If any medical questions are marked YES, you'll need a physician's signature on the medical form before the course.
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
          to: [OWNER_EMAIL],
          subject: `Course inquiry: ${name} — ${course.split("—")[0].trim()}`,
          html: `
            <div style="font-family:-apple-system,sans-serif;max-width:540px;padding:20px;">
              <h3 style="color:#0B1D2C;">New course inquiry</h3>
              <table style="font-size:14px;border-collapse:collapse;">
                <tr><td style="padding:4px 12px 4px 0;color:#5a6a7a;">Name</td><td style="font-weight:600;">${name}</td></tr>
                <tr><td style="padding:4px 12px 4px 0;color:#5a6a7a;">Email</td><td>${email}</td></tr>
                ${phone ? `<tr><td style="padding:4px 12px 4px 0;color:#5a6a7a;">Phone</td><td>${phone}</td></tr>` : ""}
                <tr><td style="padding:4px 12px 4px 0;color:#5a6a7a;">Course</td><td style="font-weight:600;">${course}</td></tr>
                <tr><td style="padding:4px 12px 4px 0;color:#5a6a7a;">Experience</td><td>${experience || "Not specified"}</td></tr>
                <tr><td style="padding:4px 12px 4px 0;color:#5a6a7a;">Dates</td><td>${dates || "Flexible"}</td></tr>
                <tr><td style="padding:4px 12px 4px 0;color:#5a6a7a;">Group</td><td>${groupSize || "Just me"}</td></tr>
                ${message ? `<tr><td style="padding:4px 12px 4px 0;color:#5a6a7a;">Message</td><td>${message}</td></tr>` : ""}
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
