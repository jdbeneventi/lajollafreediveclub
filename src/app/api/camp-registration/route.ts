import { NextResponse } from "next/server";
import { Resend } from "resend";

const FORMSPREE_URL = "https://formspree.io/f/mojknqlk";
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const OWNER_EMAIL = "joshuabeneventi@gmail.com";

interface RegistrationData {
  studentName: string;
  studentAge: number;
  studentDob: string;
  session: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  emergencyContact: string;
  emergencyPhone: string;
  emergencyRelation: string;
  medicalNotes: string;
  swimLevel: string;
  charter: boolean;
  charterDetails: string;
  howHeard: string;
  notes: string;
}

export async function POST(request: Request) {
  try {
    const data: RegistrationData = await request.json();
    const registrationId = `camp-${Date.now().toString(36)}`;

    const sessionDisplay = data.session || "TBD";
    const waiverLink = `https://lajollafreediveclub.com/camp-garibaldi/waiver?student=${encodeURIComponent(data.studentName)}&parent=${encodeURIComponent(data.parentEmail)}&reg=${registrationId}`;

    // Send emails via Resend
    if (RESEND_API_KEY) {
      const resend = new Resend(RESEND_API_KEY);
      const fromAddress = "Camp Garibaldi <noreply@lajollafreediveclub.com>";

      // Email #1: Confirmation to parent
      try {
        await resend.emails.send({
          from: fromAddress,
          to: [data.parentEmail],
          subject: `Camp Garibaldi Registration Confirmed — ${data.studentName}`,
          html: `
            <div style="font-family:-apple-system,sans-serif;max-width:540px;padding:20px;">
              <h2 style="color:#0B1D2C;margin-bottom:8px;">Registration Confirmed</h2>
              <p style="color:#5a6a7a;font-size:14px;line-height:1.6;">
                Hi ${data.parentName.split(" ")[0]},<br><br>
                ${data.studentName} is registered for Camp Garibaldi!
              </p>
              <table style="width:100%;font-size:14px;border-collapse:collapse;margin:16px 0;">
                <tr><td style="padding:8px 0;color:#5a6a7a;width:120px;">Session</td><td style="padding:8px 0;font-weight:600;">${sessionDisplay}</td></tr>
                <tr><td style="padding:8px 0;color:#5a6a7a;">Camper</td><td style="padding:8px 0;">${data.studentName} (age ${data.studentAge})</td></tr>
                <tr><td style="padding:8px 0;color:#5a6a7a;">Price</td><td style="padding:8px 0;font-weight:600;">$750</td></tr>
                ${data.charter ? `<tr><td style="padding:8px 0;color:#5a6a7a;">Charter</td><td style="padding:8px 0;color:#C75B3A;font-weight:600;">Requested — ${data.charterDetails || "details TBD"}</td></tr>` : ""}
              </table>
              <div style="background:#FAF3EC;border-radius:12px;padding:16px;margin:20px 0;">
                <p style="font-size:14px;font-weight:600;color:#0B1D2C;margin:0 0 8px 0;">Next Steps</p>
                <ol style="font-size:13px;color:#5a6a7a;line-height:1.8;margin:0;padding-left:20px;">
                  <li><strong>Complete the waiver</strong> — <a href="${waiverLink}" style="color:#1B6B6B;">Sign youth waiver here</a></li>
                  <li><strong>Payment</strong> — We'll send payment instructions separately</li>
                  <li><strong>What to bring</strong> — Swimsuit, towel, reef-safe sunscreen, water bottle, snack. All gear provided.</li>
                </ol>
              </div>
              ${data.charter ? `
              <div style="background:#FFF3EE;border:1px solid rgba(199,91,58,0.2);border-radius:12px;padding:16px;margin:20px 0;">
                <p style="font-size:13px;color:#C75B3A;font-weight:600;margin:0 0 4px 0;">Charter Boat Request</p>
                <p style="font-size:12px;color:#5a6a7a;margin:0;">You've indicated interest in the charter boat experience. Joshua will follow up with details and availability.</p>
              </div>
              ` : ""}
              <p style="color:#5a6a7a;font-size:12px;margin-top:24px;">
                Questions? Reply to this email or visit <a href="https://lajollafreediveclub.com/camp-garibaldi" style="color:#1B6B6B;">lajollafreediveclub.com/camp-garibaldi</a>
              </p>
              <p style="color:#5a6a7a;font-size:11px;margin-top:16px;">
                La Jolla Freedive Club · San Diego, CA<br>
                AIDA Certified · DAN Insured · Red Cross First Aid/CPR/AED
              </p>
            </div>
          `,
        });
      } catch {
        // Non-critical — registration still saved
      }

      // Email #2: Notification to Joshua
      try {
        const hasMedical = data.medicalNotes && data.medicalNotes.trim().length > 0;
        await resend.emails.send({
          from: fromAddress,
          to: [OWNER_EMAIL],
          subject: `New Camp Registration: ${data.studentName} — ${sessionDisplay}`,
          html: `
            <div style="font-family:-apple-system,sans-serif;max-width:540px;padding:20px;">
              <h2 style="color:#0B1D2C;margin-bottom:16px;">New Camp Registration</h2>
              <table style="width:100%;font-size:14px;border-collapse:collapse;">
                <tr><td style="padding:6px 0;color:#5a6a7a;width:130px;">Student</td><td style="padding:6px 0;font-weight:600;">${data.studentName}</td></tr>
                <tr><td style="padding:6px 0;color:#5a6a7a;">Age / DOB</td><td style="padding:6px 0;">${data.studentAge} / ${data.studentDob}</td></tr>
                <tr><td style="padding:6px 0;color:#5a6a7a;">Session</td><td style="padding:6px 0;font-weight:600;">${sessionDisplay}</td></tr>
                <tr><td style="padding:6px 0;color:#5a6a7a;">Parent</td><td style="padding:6px 0;">${data.parentName}</td></tr>
                <tr><td style="padding:6px 0;color:#5a6a7a;">Email</td><td style="padding:6px 0;">${data.parentEmail}</td></tr>
                <tr><td style="padding:6px 0;color:#5a6a7a;">Phone</td><td style="padding:6px 0;">${data.parentPhone}</td></tr>
                <tr><td style="padding:6px 0;color:#5a6a7a;">Emergency</td><td style="padding:6px 0;">${data.emergencyContact} · ${data.emergencyPhone} · ${data.emergencyRelation}</td></tr>
                <tr><td style="padding:6px 0;color:#5a6a7a;">Swim Level</td><td style="padding:6px 0;">${data.swimLevel || "Not specified"}</td></tr>
                <tr><td style="padding:6px 0;color:#5a6a7a;">How Heard</td><td style="padding:6px 0;">${data.howHeard || "Not specified"}</td></tr>
                <tr><td style="padding:6px 0;color:#5a6a7a;">Charter</td><td style="padding:6px 0;${data.charter ? "color:#C75B3A;font-weight:600;" : ""}">${data.charter ? `YES — ${data.charterDetails || "no details"}` : "No"}</td></tr>
                <tr><td style="padding:6px 0;color:#5a6a7a;">Medical</td><td style="padding:6px 0;${hasMedical ? "color:#C75B3A;font-weight:600;" : ""}">${hasMedical ? data.medicalNotes : "None noted"}</td></tr>
                ${data.notes ? `<tr><td style="padding:6px 0;color:#5a6a7a;">Notes</td><td style="padding:6px 0;">${data.notes}</td></tr>` : ""}
              </table>
              <p style="font-size:12px;color:#5a6a7a;margin-top:16px;">Registration ID: ${registrationId}</p>
            </div>
          `,
        });
      } catch {
        // Non-critical
      }
    }

    // Formspree backup
    try {
      await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _form_type: "camp-registration",
          registration_id: registrationId,
          student_name: data.studentName,
          student_age: data.studentAge,
          student_dob: data.studentDob,
          session: data.session,
          parent_name: data.parentName,
          parent_email: data.parentEmail,
          parent_phone: data.parentPhone,
          emergency_contact: `${data.emergencyContact} · ${data.emergencyPhone} · ${data.emergencyRelation}`,
          swim_level: data.swimLevel,
          charter: data.charter ? `Yes — ${data.charterDetails}` : "No",
          medical_notes: data.medicalNotes || "None",
          how_heard: data.howHeard,
          notes: data.notes,
        }),
      });
    } catch {
      // Formspree backup is non-critical
    }

    return NextResponse.json({
      success: true,
      registrationId,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to process registration" },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Placeholder — Google Sheet integration needed for persistent storage.
  // For now, the admin page at /admin/registrations uses localStorage.
  return NextResponse.json({
    registrations: [],
    note: "Google Sheet integration pending. Use /admin/registrations for manual tracking.",
  });
}
