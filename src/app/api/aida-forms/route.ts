import { NextResponse } from "next/server";
import { jsPDF } from "jspdf";
import { Resend } from "resend";
import { supabase } from "@/lib/supabase";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const OWNER_EMAIL = "joshuabeneventi@gmail.com";

const MEDICAL_QUESTIONS = [
  "Medication: Any medication taken on a regular basis?",
  "Mental and Mood Conditions: Current or history of mental illness or mood disorder?",
  "Neurological Conditions: Seizure disorder, stroke, brain surgery, blackouts, severe migraines?",
  "Cardiovascular Conditions: Heart attack, heart surgery, irregular heartbeat, pacemaker, elevated blood pressure?",
  "Pulmonary Conditions: Asthma, collapsed lung, lung damage, emphysema, breathing problems?",
  "Ear, nose and throat: Sinus surgery, ruptured eardrum, hearing loss, ear surgery?",
  "Eye Condition: Severe myopia, retinal detachment, eye surgery?",
  "Diabetes Mellitus: Type I or Type II requiring medication?",
  "Freediving/Scuba History: Previous diving accident, blackout, DCS, lung squeeze?",
  "General Medical Problems: Any condition affecting underwater safety or judgment?",
  "Pregnancy: If presently pregnant?",
];

function generateMedicalPDF(
  fullName: string, dob: string, email: string, course: string,
  answers: Record<string, string>, details: string, physicianRequired: boolean,
  isMinor: boolean, guardianName: string, signatureData: string, signedAt: string
): string {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const pw = doc.internal.pageSize.getWidth();
  const margin = 50;
  const cw = pw - margin * 2;
  let y = 50;

  const addText = (text: string, size: number, style: string = "normal", color: [number, number, number] = [10, 10, 10]) => {
    doc.setFontSize(size);
    doc.setFont("helvetica", style);
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(text, cw);
    if (y + lines.length * size * 1.2 > 740) { doc.addPage(); y = 50; }
    doc.text(lines, margin, y);
    y += lines.length * size * 1.3 + 4;
  };

  const addLine = () => { doc.setDrawColor(200, 200, 200); doc.line(margin, y, pw - margin, y); y += 12; };

  // Header
  doc.setFontSize(16); doc.setFont("helvetica", "bold"); doc.setTextColor(11, 29, 44);
  doc.text("AIDA MEDICAL STATEMENT", pw / 2, y, { align: "center" }); y += 20;
  doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.setTextColor(100, 100, 100);
  doc.text("La Jolla Freedive Club — Digital Submission", pw / 2, y, { align: "center" }); y += 8;
  doc.text(`Signed digitally on ${signedAt}`, pw / 2, y, { align: "center" }); y += 16;
  addLine();

  // Participant info
  addText("PARTICIPANT INFORMATION", 10, "bold", [11, 29, 44]); y += 2;
  addText(`Name: ${fullName}`, 9);
  addText(`Date of Birth: ${dob}`, 9);
  addText(`Email: ${email}`, 9);
  addText(`Course: ${course}`, 9);
  if (isMinor) addText(`Parent/Guardian: ${guardianName}`, 9);
  y += 6; addLine();

  // Medical questions
  addText("MEDICAL QUESTIONNAIRE", 10, "bold", [11, 29, 44]); y += 4;

  MEDICAL_QUESTIONS.forEach((q, i) => {
    const answer = answers[String(i + 1)] || "—";
    const isYes = answer === "yes";
    if (y > 700) { doc.addPage(); y = 50; }
    doc.setFontSize(8); doc.setFont("helvetica", "normal"); doc.setTextColor(100, 100, 100);
    doc.text(`${i + 1}.`, margin, y);
    doc.setTextColor(10, 10, 10);
    const lines = doc.splitTextToSize(q, cw - 60);
    doc.text(lines, margin + 18, y);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(isYes ? 199 : 27, isYes ? 91 : 107, isYes ? 58 : 107);
    doc.text(answer.toUpperCase(), pw - margin, y, { align: "right" });
    y += lines.length * 11 + 6;
  });

  if (physicianRequired && details) {
    y += 6;
    addText("DETAILS FOR YES ANSWERS:", 9, "bold", [199, 91, 58]);
    addText(details, 9, "normal", [80, 80, 80]);
  }

  y += 8; addLine();

  // Status
  if (physicianRequired) {
    addText("⚠ PHYSICIAN CLEARANCE REQUIRED", 10, "bold", [199, 91, 58]);
    addText("One or more questions were answered YES. A physician must review and sign the official AIDA Medical Statement form before the course begins.", 8, "normal", [100, 100, 100]);
  } else {
    addText("✓ ALL CLEAR — No physician clearance required", 10, "bold", [27, 107, 107]);
  }

  y += 8; addLine();

  // Certification
  addText("I certify that I have answered the above questions accurately and honestly. I am responsible for omission regarding my failure to disclose any current or past health condition.", 8, "normal", [80, 80, 80]);
  y += 12;

  // Signature
  if (signatureData) {
    try {
      doc.addImage(signatureData, "PNG", margin, y, 200, 60);
      y += 68;
    } catch {
      addText("[Signature on file]", 9, "italic", [100, 100, 100]);
    }
  }
  addText(`${fullName} — ${signedAt}`, 8, "normal", [100, 100, 100]);
  if (isMinor) { y += 4; addText(`Parent/Guardian: ${guardianName}`, 8, "normal", [100, 100, 100]); }

  // Footer
  y += 16;
  doc.setFontSize(7); doc.setTextColor(150, 150, 150);
  doc.text("La Jolla Freedive Club · AIDA Instructor & Youth Instructor · DAN Insured · lajollafreediveclub.com", pw / 2, y, { align: "center" });

  return doc.output("datauristring");
}

function generateLiabilityPDF(
  fullName: string, dob: string, email: string, course: string,
  isMinor: boolean, guardianName: string, signatureData: string, signedAt: string
): string {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const pw = doc.internal.pageSize.getWidth();
  const margin = 50;
  const cw = pw - margin * 2;
  let y = 50;

  const addText = (text: string, size: number, style: string = "normal", color: [number, number, number] = [10, 10, 10]) => {
    doc.setFontSize(size);
    doc.setFont("helvetica", style);
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(text, cw);
    if (y + lines.length * size * 1.2 > 740) { doc.addPage(); y = 50; }
    doc.text(lines, margin, y);
    y += lines.length * size * 1.3 + 4;
  };

  const addLine = () => { doc.setDrawColor(200, 200, 200); doc.line(margin, y, pw - margin, y); y += 12; };

  // Header
  doc.setFontSize(16); doc.setFont("helvetica", "bold"); doc.setTextColor(11, 29, 44);
  doc.text("AIDA LIABILITY RELEASE", pw / 2, y, { align: "center" }); y += 16;
  doc.setFontSize(10);
  doc.text("AND ASSUMPTION OF RISK", pw / 2, y, { align: "center" }); y += 20;
  doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.setTextColor(100, 100, 100);
  doc.text("La Jolla Freedive Club — Digital Submission", pw / 2, y, { align: "center" }); y += 8;
  doc.text(`Signed digitally on ${signedAt}`, pw / 2, y, { align: "center" }); y += 16;
  addLine();

  // Participant info
  addText(`Name: ${fullName}    DOB: ${dob}    Course: ${course}`, 9);
  y += 4; addLine();

  // Liability text
  addText("TO AIDA INTERNATIONAL AND AIDA INSTRUCTOR", 10, "bold", [11, 29, 44]); y += 6;

  addText(`I, ${fullName}, hereby declare that I am aware that freediving has inherent risks, which may result in serious injury or death. I still choose to participate in the freediving activities with La Jolla Freedive Club / AIDA International.`, 9);
  y += 4;
  addText("I understand and agree that neither my instructor nor AIDA International, nor any of their respective employees, officers, agents, contractors or assigns (herein after referred to as the \"Released Parties\") may be held liable or responsible in any way for any injury, death or other damages to me, my family, estate, heirs or assigns that may occur as a result of my participation in freediving activity with AIDA International or as a result of the negligence of any party, including the Released Parties whether passive or active.", 9);
  y += 4;
  addText(`In consideration of AIDA International allowing me to participate in the freediving activity, I hereby personally assume all risks of the experience, whether foreseen or unforeseen, that may befall me while I am freediving with La Jolla Freedive Club.`, 9);
  y += 4;
  addText("I declare that I am in good mental and physical fitness for freediving and that I am not under the influence of alcohol, nor am I under the influence of any drugs that are contraindicatory to freediving. I declare that if requested as a result of completion of the AIDA Medical Statement, I have seen a physician and have approval to freedive.", 9);
  y += 4;
  addText("I further declare that I am of lawful age and legally competent to sign this liability release. I understand that the terms herein are contractual and not a mere recital, and that I have signed this document of my own free act and with the knowledge that I hereby agree to waive my legal rights.", 9);

  y += 12; addLine();

  // Signature
  if (signatureData) {
    try {
      doc.addImage(signatureData, "PNG", margin, y, 200, 60);
      y += 68;
    } catch {
      addText("[Signature on file]", 9, "italic", [100, 100, 100]);
    }
  }
  addText(`${fullName} — ${signedAt}`, 8, "normal", [100, 100, 100]);
  if (isMinor) { y += 4; addText(`Parent/Guardian: ${guardianName}`, 8, "normal", [100, 100, 100]); }

  // Footer
  y += 16;
  doc.setFontSize(7); doc.setTextColor(150, 150, 150);
  doc.text("La Jolla Freedive Club · AIDA Instructor & Youth Instructor · DAN Insured · lajollafreediveclub.com", pw / 2, y, { align: "center" });

  return doc.output("datauristring");
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { fullName, dob, email, phone, course, isMinor, guardianName, medicalAnswers, medicalDetails, physicianRequired, signatureData } = data;

    if (!fullName || !email) {
      return NextResponse.json({ error: "Name and email required" }, { status: 400 });
    }

    const signedAt = new Date().toLocaleString("en-US", {
      timeZone: "America/Los_Angeles",
      year: "numeric", month: "long", day: "numeric",
      hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true,
    });

    // Generate PDFs
    const medicalPDF = generateMedicalPDF(fullName, dob, email, course || "AIDA", medicalAnswers || {}, medicalDetails || "", physicianRequired || false, isMinor || false, guardianName || "", signatureData || "", signedAt);
    const liabilityPDF = generateLiabilityPDF(fullName, dob, email, course || "AIDA", isMinor || false, guardianName || "", signatureData || "", signedAt);

    // Convert data URIs to base64 for email attachments
    const medicalBase64 = medicalPDF.split(",")[1];
    const liabilityBase64 = liabilityPDF.split(",")[1];

    // Store medical statement
    try {
      await supabase.from("aida_forms").insert({
        email, full_name: fullName, date_of_birth: dob, phone: phone || null,
        form_type: "medical_statement", course: course || null,
        medical_answers: medicalAnswers, medical_details: medicalDetails || null,
        physician_required: physicianRequired || false,
        is_minor: isMinor || false, guardian_name: isMinor ? guardianName : null,
        signed_at: new Date().toISOString(), signature_data: signatureData || null,
      });
    } catch {}

    // Store liability release
    try {
      await supabase.from("aida_forms").insert({
        email, full_name: fullName, date_of_birth: dob, phone: phone || null,
        form_type: "liability_release", course: course || null,
        is_minor: isMinor || false, guardian_name: isMinor ? guardianName : null,
        signed_at: new Date().toISOString(), signature_data: signatureData || null,
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

    // Emails
    if (RESEND_API_KEY) {
      const resend = new Resend(RESEND_API_KEY);
      const fromAddress = "La Jolla Freedive Club <noreply@lajollafreediveclub.com>";
      const firstName = fullName.split(" ")[0];

      const attachments = [
        { filename: `AIDA_Medical_Statement_${fullName.replace(/\s+/g, "_")}.pdf`, content: medicalBase64 },
        { filename: `AIDA_Liability_Release_${fullName.replace(/\s+/g, "_")}.pdf`, content: liabilityBase64 },
      ];

      // Email to student with PDFs
      try {
        await resend.emails.send({
          from: fromAddress,
          to: [email],
          subject: `AIDA Forms Submitted — ${course || "Course"}`,
          attachments,
          html: `
            <div style="font-family:-apple-system,sans-serif;max-width:540px;padding:20px;">
              <h2 style="color:#0B1D2C;margin-bottom:8px;">Forms received, ${firstName}!</h2>
              <p style="color:#5a6a7a;font-size:14px;line-height:1.6;">
                Your AIDA Medical Statement and Liability Release have been submitted for your <strong>${course || "AIDA"}</strong> course. Signed copies are attached as PDFs.
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
                <p style="font-size:13px;color:#5a6a7a;margin:0;">
                  Download the attached Medical Statement PDF, take it to your doctor for review and signature, and bring the signed copy to Day 1 of your course.
                </p>
              </div>
              ` : ""}
              <p style="color:#5a6a7a;font-size:13px;margin-top:16px;">
                <strong>Don't forget:</strong> <a href="https://lajollafreediveclub.com/waiver" style="color:#1B6B6B;">Sign your LJFC waiver</a> if you haven't already.
              </p>
              <p style="color:#5a6a7a;font-size:11px;margin-top:24px;">
                La Jolla Freedive Club · San Diego, CA · AIDA Certified · DAN Insured
              </p>
            </div>
          `,
        });
      } catch {}

      // Email to Joshua with PDFs
      try {
        await resend.emails.send({
          from: fromAddress,
          to: [OWNER_EMAIL],
          subject: `AIDA Forms: ${fullName} — ${course}${physicianRequired ? " ⚠️ PHYSICIAN REQUIRED" : ""}`,
          attachments,
          html: `
            <div style="font-family:-apple-system,sans-serif;max-width:540px;padding:20px;">
              <h3 style="color:#0B1D2C;">${fullName} submitted AIDA forms</h3>
              <p style="color:#5a6a7a;font-size:13px;">Signed PDFs attached.</p>
              <table style="font-size:14px;border-collapse:collapse;margin-top:12px;">
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

    return NextResponse.json({
      success: true,
      physicianRequired: physicianRequired || false,
      medicalPDF,
      liabilityPDF,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed" },
      { status: 500 }
    );
  }
}

// GET: admin endpoint
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
