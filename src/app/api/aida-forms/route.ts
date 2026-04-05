import { NextResponse } from "next/server";
import { Resend } from "resend";
import { supabase } from "@/lib/supabase";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const OWNER_EMAIL = "joshuabeneventi@gmail.com";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { fullName, dob, email, phone, course, isMinor, guardianName, medicalAnswers, medicalDetails, physicianRequired, signatureData } = data;

    if (!fullName || !email) {
      return NextResponse.json({ error: "Name and email required" }, { status: 400 });
    }

    // Store medical statement
    try {
      await supabase.from("aida_forms").insert({
        email,
        full_name: fullName,
        date_of_birth: dob,
        phone: phone || null,
        form_type: "medical_statement",
        course: course || null,
        medical_answers: medicalAnswers,
        medical_details: medicalDetails || null,
        physician_required: physicianRequired || false,
        is_minor: isMinor || false,
        guardian_name: isMinor ? guardianName : null,
        signed_at: new Date().toISOString(),
        signature_data: signatureData || null,
      });
    } catch {}

    // Store liability release
    try {
      await supabase.from("aida_forms").insert({
        email,
        full_name: fullName,
        date_of_birth: dob,
        phone: phone || null,
        form_type: "liability_release",
        course: course || null,
        is_minor: isMinor || false,
        guardian_name: isMinor ? guardianName : null,
        signed_at: new Date().toISOString(),
        signature_data: signatureData || null,
      });
    } catch {}

    // Build medical summary
    const yesQuestions = Object.entries(medicalAnswers || {})
      .filter(([, v]) => v === "yes")
      .map(([k]) => `Q${k}`)
      .join(", ");

    const medicalStatus = physicianRequired
      ? `FLAGGED (${yesQuestions})${medicalDetails ? ` — ${medicalDetails}` : ""}`
      : "All clear";

    // Email confirmation to student
    if (RESEND_API_KEY) {
      const resend = new Resend(RESEND_API_KEY);
      const fromAddress = "La Jolla Freedive Club <noreply@lajollafreediveclub.com>";
      const firstName = fullName.split(" ")[0];

      try {
        await resend.emails.send({
          from: fromAddress,
          to: [email],
          subject: `AIDA Forms Submitted — ${course || "Course"}`,
          html: `
            <div style="font-family:-apple-system,sans-serif;max-width:540px;padding:20px;">
              <h2 style="color:#0B1D2C;margin-bottom:8px;">Forms received, ${firstName}!</h2>
              <p style="color:#5a6a7a;font-size:14px;line-height:1.6;">
                Your AIDA Medical Statement and Liability Release have been submitted for your <strong>${course || "AIDA"}</strong> course.
              </p>

              <div style="background:#FAF3EC;border-radius:12px;padding:16px;margin:16px 0;">
                <table style="width:100%;font-size:13px;border-collapse:collapse;">
                  <tr><td style="padding:4px 0;color:#5a6a7a;">Medical status</td><td style="padding:4px 0;font-weight:600;${physicianRequired ? "color:#C75B3A;" : "color:#1B6B6B;"}">${physicianRequired ? "Physician clearance required" : "All clear"}</td></tr>
                  <tr><td style="padding:4px 0;color:#5a6a7a;">Liability release</td><td style="padding:4px 0;color:#1B6B6B;font-weight:600;">Signed</td></tr>
                </table>
              </div>

              ${physicianRequired ? `
              <div style="background:#FFF3EE;border:1px solid rgba(199,91,58,0.2);border-radius:12px;padding:16px;margin:16px 0;">
                <p style="font-size:14px;font-weight:600;color:#C75B3A;margin:0 0 8px 0;">Physician sign-off needed</p>
                <p style="font-size:13px;color:#5a6a7a;margin:0 0 8px 0;">
                  Download the PDF, take it to your doctor, and bring the signed copy to Day 1 of your course.
                </p>
                <a href="https://lajollafreediveclub.com/documents/aida-medical-statement.pdf" style="display:inline-block;padding:8px 20px;background:#C75B3A;color:white;border-radius:50px;text-decoration:none;font-weight:600;font-size:13px;">Download Medical Form PDF →</a>
              </div>
              ` : ""}

              <div style="margin:16px 0;">
                <p style="font-size:13px;color:#5a6a7a;">
                  <strong>Don't forget:</strong> <a href="https://lajollafreediveclub.com/waiver" style="color:#1B6B6B;">Sign your LJFC waiver</a> if you haven't already.
                </p>
              </div>

              <p style="color:#5a6a7a;font-size:11px;margin-top:24px;">
                La Jolla Freedive Club · San Diego, CA · AIDA Certified · DAN Insured
              </p>
            </div>
          `,
        });
      } catch {}

      // Notify Joshua
      try {
        await resend.emails.send({
          from: fromAddress,
          to: [OWNER_EMAIL],
          subject: `AIDA Forms: ${fullName} — ${course}${physicianRequired ? " ⚠️ PHYSICIAN REQUIRED" : ""}`,
          html: `
            <div style="font-family:-apple-system,sans-serif;max-width:540px;padding:20px;">
              <h3 style="color:#0B1D2C;">${fullName} submitted AIDA forms</h3>
              <table style="font-size:14px;border-collapse:collapse;">
                <tr><td style="padding:4px 12px 4px 0;color:#5a6a7a;">Email</td><td>${email}</td></tr>
                <tr><td style="padding:4px 12px 4px 0;color:#5a6a7a;">DOB</td><td>${dob}</td></tr>
                <tr><td style="padding:4px 12px 4px 0;color:#5a6a7a;">Course</td><td style="font-weight:600;">${course}</td></tr>
                <tr><td style="padding:4px 12px 4px 0;color:#5a6a7a;">Medical</td><td style="${physicianRequired ? "color:#C75B3A;font-weight:600;" : "color:#1B6B6B;"}">${medicalStatus}</td></tr>
                <tr><td style="padding:4px 12px 4px 0;color:#5a6a7a;">Liability</td><td style="color:#1B6B6B;">Signed</td></tr>
                <tr><td style="padding:4px 12px 4px 0;color:#5a6a7a;">Minor</td><td>${isMinor ? `Yes — guardian: ${guardianName}` : "No"}</td></tr>
              </table>
            </div>
          `,
        });
      } catch {}
    }

    return NextResponse.json({ success: true, physicianRequired: physicianRequired || false });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed" },
      { status: 500 }
    );
  }
}

// GET: admin endpoint to view submissions
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  if (secret !== "ljfc" && secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("aida_forms")
    .select("id, email, full_name, form_type, course, physician_required, physician_cleared, signed_at, created_at")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ forms: data });
}
