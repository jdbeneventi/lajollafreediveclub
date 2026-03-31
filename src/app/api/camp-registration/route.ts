import { NextResponse } from "next/server";
import { Resend } from "resend";
import { supabase } from "@/lib/supabase";

const FORMSPREE_URL = "https://formspree.io/f/mojknqlk";
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const OWNER_EMAIL = "joshuabeneventi@gmail.com";

const SESSION_MAP: Record<string, { name: string; dates: string; price: number }> = {
  "session-1": { name: "Session I", dates: "June 15–17", price: 450 },
  "session-2": { name: "Session II", dates: "July 13–17", price: 750 },
  "session-3": { name: "Session III", dates: "August 10–12", price: 450 },
};

interface FormData {
  studentFirstName: string;
  studentLastName: string;
  age: string;
  grade: string;
  swimmingAbility: string;
  sessionId: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  emergencyName: string;
  emergencyPhone: string;
  emergencyRelation: string;
  allergies: string;
  medications: string;
  medicalConditions: string;
  dietaryRestrictions: string;
  isCharterFamily: boolean;
  charterSchoolName: string;
  charterTeacherName: string;
  charterTeacherEmail: string;
  hearAbout: string;
  agreeTerms: boolean;
}

export async function POST(request: Request) {
  try {
    const data: FormData = await request.json();
    const registrationId = `camp-${Date.now().toString(36)}`;
    const session = SESSION_MAP[data.sessionId];
    const studentName = `${data.studentFirstName} ${data.studentLastName}`;
    const sessionDisplay = session ? `${session.name} · ${session.dates}` : "TBD";
    const priceDisplay = session ? `$${session.price}` : "TBD";

    // Store in Supabase
    const { error: dbError } = await supabase
      .from("camp_registrations")
      .insert({
        registration_id: registrationId,
        student_first_name: data.studentFirstName,
        student_last_name: data.studentLastName,
        student_age: data.age ? parseInt(data.age) : null,
        student_grade: data.grade,
        swimming_ability: data.swimmingAbility,
        session_id: data.sessionId,
        session_name: session?.name,
        session_dates: session?.dates,
        session_price: session?.price,
        parent_name: data.parentName,
        parent_email: data.parentEmail,
        parent_phone: data.parentPhone,
        emergency_name: data.emergencyName,
        emergency_phone: data.emergencyPhone,
        emergency_relation: data.emergencyRelation,
        allergies: data.allergies || null,
        medications: data.medications || null,
        medical_conditions: data.medicalConditions || null,
        dietary_restrictions: data.dietaryRestrictions || null,
        is_charter_family: data.isCharterFamily,
        charter_school_name: data.isCharterFamily ? data.charterSchoolName : null,
        charter_teacher_name: data.isCharterFamily ? data.charterTeacherName : null,
        charter_teacher_email: data.isCharterFamily ? data.charterTeacherEmail : null,
        hear_about: data.hearAbout || null,
      });

    if (dbError) {
      console.error("Supabase insert error:", dbError);
    }

    const waiverLink = `https://lajollafreediveclub.com/camp-garibaldi/waiver?student=${encodeURIComponent(studentName)}&parent=${encodeURIComponent(data.parentEmail)}&reg=${registrationId}`;

    // Send emails via Resend
    if (RESEND_API_KEY) {
      const resend = new Resend(RESEND_API_KEY);
      const fromAddress = "Camp Garibaldi <noreply@lajollafreediveclub.com>";

      // Email #1: Confirmation to parent
      try {
        await resend.emails.send({
          from: fromAddress,
          to: [data.parentEmail],
          subject: `Camp Garibaldi Registration Confirmed — ${studentName}`,
          html: `
            <div style="font-family:-apple-system,sans-serif;max-width:540px;padding:20px;">
              <h2 style="color:#0B1D2C;margin-bottom:8px;">Registration Confirmed</h2>
              <p style="color:#5a6a7a;font-size:14px;line-height:1.6;">
                Hi ${data.parentName.split(" ")[0]},<br><br>
                ${studentName} is registered for Camp Garibaldi!
              </p>
              <table style="width:100%;font-size:14px;border-collapse:collapse;margin:16px 0;">
                <tr><td style="padding:8px 0;color:#5a6a7a;width:120px;">Session</td><td style="padding:8px 0;font-weight:600;">${sessionDisplay}</td></tr>
                <tr><td style="padding:8px 0;color:#5a6a7a;">Camper</td><td style="padding:8px 0;">${studentName} (age ${data.age})</td></tr>
                <tr><td style="padding:8px 0;color:#5a6a7a;">Price</td><td style="padding:8px 0;font-weight:600;">${priceDisplay}</td></tr>
                ${data.isCharterFamily ? `<tr><td style="padding:8px 0;color:#5a6a7a;">Charter</td><td style="padding:8px 0;color:#C75B3A;font-weight:600;">Yes — ${data.charterSchoolName || "details TBD"}</td></tr>` : ""}
              </table>
              <div style="background:#FAF3EC;border-radius:12px;padding:16px;margin:20px 0;">
                <p style="font-size:14px;font-weight:600;color:#0B1D2C;margin:0 0 8px 0;">Next Steps</p>
                <ol style="font-size:13px;color:#5a6a7a;line-height:1.8;margin:0;padding-left:20px;">
                  <li><strong>Complete the waiver</strong> — <a href="${waiverLink}" style="color:#1B6B6B;">Sign youth waiver here</a></li>
                  <li><strong>Payment</strong> — We'll send payment instructions separately</li>
                  <li><strong>What to bring</strong> — Swimsuit, towel, reef-safe sunscreen, water bottle, snack. All gear provided.</li>
                </ol>
              </div>
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
        // Non-critical
      }

      // Email #2: Notification to Joshua
      try {
        const hasMedical = [data.allergies, data.medications, data.medicalConditions].some(v => v && v.trim().length > 0 && v.toLowerCase() !== "none");
        const medicalSummary = [
          data.allergies && `Allergies: ${data.allergies}`,
          data.medications && `Meds: ${data.medications}`,
          data.medicalConditions && `Conditions: ${data.medicalConditions}`,
          data.dietaryRestrictions && `Dietary: ${data.dietaryRestrictions}`,
        ].filter(Boolean).join(" · ") || "None noted";

        await resend.emails.send({
          from: fromAddress,
          to: [OWNER_EMAIL],
          subject: `New Camp Registration: ${studentName} — ${sessionDisplay}`,
          html: `
            <div style="font-family:-apple-system,sans-serif;max-width:540px;padding:20px;">
              <h2 style="color:#0B1D2C;margin-bottom:16px;">New Camp Registration</h2>
              <table style="width:100%;font-size:14px;border-collapse:collapse;">
                <tr><td style="padding:6px 0;color:#5a6a7a;width:130px;">Student</td><td style="padding:6px 0;font-weight:600;">${studentName}</td></tr>
                <tr><td style="padding:6px 0;color:#5a6a7a;">Age / Grade</td><td style="padding:6px 0;">${data.age} / ${data.grade}</td></tr>
                <tr><td style="padding:6px 0;color:#5a6a7a;">Swimming</td><td style="padding:6px 0;">${data.swimmingAbility}</td></tr>
                <tr><td style="padding:6px 0;color:#5a6a7a;">Session</td><td style="padding:6px 0;font-weight:600;">${sessionDisplay} · ${priceDisplay}</td></tr>
                <tr><td style="padding:6px 0;color:#5a6a7a;">Parent</td><td style="padding:6px 0;">${data.parentName}</td></tr>
                <tr><td style="padding:6px 0;color:#5a6a7a;">Email</td><td style="padding:6px 0;">${data.parentEmail}</td></tr>
                <tr><td style="padding:6px 0;color:#5a6a7a;">Phone</td><td style="padding:6px 0;">${data.parentPhone}</td></tr>
                <tr><td style="padding:6px 0;color:#5a6a7a;">Emergency</td><td style="padding:6px 0;">${data.emergencyName} · ${data.emergencyPhone} · ${data.emergencyRelation}</td></tr>
                <tr><td style="padding:6px 0;color:#5a6a7a;">Charter</td><td style="padding:6px 0;${data.isCharterFamily ? "color:#C75B3A;font-weight:600;" : ""}">${data.isCharterFamily ? `YES — ${data.charterSchoolName} / ${data.charterTeacherName} / ${data.charterTeacherEmail}` : "No"}</td></tr>
                <tr><td style="padding:6px 0;color:#5a6a7a;">Medical</td><td style="padding:6px 0;${hasMedical ? "color:#C75B3A;font-weight:600;" : ""}">${medicalSummary}</td></tr>
                <tr><td style="padding:6px 0;color:#5a6a7a;">How Heard</td><td style="padding:6px 0;">${data.hearAbout || "Not specified"}</td></tr>
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
          student_name: studentName,
          student_age: data.age,
          student_grade: data.grade,
          swimming_ability: data.swimmingAbility,
          session: sessionDisplay,
          price: priceDisplay,
          parent_name: data.parentName,
          parent_email: data.parentEmail,
          parent_phone: data.parentPhone,
          emergency: `${data.emergencyName} · ${data.emergencyPhone} · ${data.emergencyRelation}`,
          charter: data.isCharterFamily ? `Yes — ${data.charterSchoolName}` : "No",
          medical: [data.allergies, data.medications, data.medicalConditions, data.dietaryRestrictions].filter(Boolean).join(" · ") || "None",
          how_heard: data.hearAbout,
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
  try {
    const { data, error } = await supabase
      .from("camp_registrations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ registrations: data });
  } catch {
    return NextResponse.json({ registrations: [] });
  }
}
