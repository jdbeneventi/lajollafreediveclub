import { NextResponse } from "next/server";
import { PDFDocument, rgb } from "pdf-lib";
import { Resend } from "resend";
import { supabase } from "@/lib/supabase";
import { readFile } from "fs/promises";
import { join } from "path";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const OWNER_EMAIL = "joshuabeneventi@gmail.com";

// YES checkbox = even number, NO = odd number
const MEDICAL_CHECKBOX_MAP: Record<number, { yes: string; no: string }> = {
  1: { yes: "Check Box12", no: "Check Box13" },
  2: { yes: "Check Box14", no: "Check Box15" },
  3: { yes: "Check Box16", no: "Check Box17" },
  4: { yes: "Check Box18", no: "Check Box19" },
  5: { yes: "Check Box20", no: "Check Box21" },
  6: { yes: "Check Box22", no: "Check Box23" },
  7: { yes: "Check Box24", no: "Check Box25" },
  8: { yes: "Check Box26", no: "Check Box27" },
  9: { yes: "Check Box28", no: "Check Box29" },
  10: { yes: "Check Box30", no: "Check Box31" },
  11: { yes: "Check Box32", no: "Check Box33" },
};

async function fillMedicalPDF(
  fullName: string, dob: string, answers: Record<string, string>,
  signatureData: string
): Promise<Uint8Array> {
  const pdfPath = join(process.cwd(), "public/documents/aida-medical-statement.pdf");
  const pdfBytes = await readFile(pdfPath);
  const doc = await PDFDocument.load(pdfBytes);
  const form = doc.getForm();

  // Page 1: Fill freediver name at top
  try { form.getTextField("NAME OF FREEDIVER").setText(fullName); } catch {}

  // Fill checkboxes
  for (const [qNum, mapping] of Object.entries(MEDICAL_CHECKBOX_MAP)) {
    const answer = answers[qNum];
    try {
      if (answer === "yes") {
        form.getCheckBox(mapping.yes).check();
      } else if (answer === "no") {
        form.getCheckBox(mapping.no).check();
      }
    } catch {}
  }

  // Page 2: DOB field
  if (dob) {
    try {
      const d = new Date(dob + "T12:00:00");
      const formatted = d.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" });
      form.getTextField("Date5_af_date").setText(formatted);
    } catch {}
  }

  // Page 2: "Date" field = signing date
  const dateStr = new Date().toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" });
  try { form.getTextField("Date").setText(dateStr); } catch {}

  // Page 2: "Name of Freediver" has no fillable field — draw text directly
  const page2 = doc.getPage(1);
  page2.drawText(fullName, { x: 85, y: 510, size: 11, color: rgb(0.04, 0.11, 0.17) });

  // Page 2: Embed signature on the "Signed:" line
  if (signatureData) {
    try {
      const base64 = signatureData.split(",")[1];
      const sigBytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
      const sigImage = await doc.embedPng(sigBytes);
      page2.drawImage(sigImage, { x: 85, y: 478, width: 200, height: 24 });
    } catch {}
  }

  // Physician section: Name of Freediver (for physician reference)
  try { form.getTextField("Text6").setText(fullName); } catch {}

  // Guardian name if minor — no dedicated field, but Text6 is physician section
  // Minor guardian goes on the "Signature of participant's parent or guardian" line
  // which has no fillable field, so we skip unless needed

  // Flatten so fields are no longer editable
  form.flatten();

  return doc.save();
}

async function fillLiabilityPDF(
  fullName: string, signatureData: string
): Promise<Uint8Array> {
  const pdfPath = join(process.cwd(), "public/documents/aida-liability-release.pdf");
  const pdfBytes = await readFile(pdfPath);
  const doc = await PDFDocument.load(pdfBytes);
  const form = doc.getForm();

  // Fill student name
  try { form.getTextField("name").setText(fullName); } catch {}

  // Fill instructor/org name (appears in 3 blanks in the legal text)
  try { form.getTextField("Joshua Beneventi").setText("Joshua Beneventi / La Jolla Freedive Club"); } catch {}

  // Fill date
  const dateStr = new Date().toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" });
  try { form.getTextField("Date4_af_date").setText(dateStr); } catch {}

  // Embed signature on the participant signature line (y=173)
  if (signatureData) {
    try {
      const base64 = signatureData.split(",")[1];
      const sigBytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
      const sigImage = await doc.embedPng(sigBytes);
      const page = doc.getPage(0);
      page.drawImage(sigImage, { x: 162, y: 173, width: 150, height: 30 });
    } catch {}
  }

  form.flatten();
  return doc.save();
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { fullName, dob, email, phone, course, isMinor, guardianName, medicalAnswers, medicalDetails, physicianRequired, signatureData } = data;

    if (!fullName || !email) {
      return NextResponse.json({ error: "Name and email required" }, { status: 400 });
    }

    // Fill the actual AIDA PDFs
    const medicalPdfBytes = await fillMedicalPDF(fullName, dob || "", medicalAnswers || {}, signatureData || "");
    const liabilityPdfBytes = await fillLiabilityPDF(fullName, signatureData || "");

    const medicalBase64 = Buffer.from(medicalPdfBytes).toString("base64");
    const liabilityBase64 = Buffer.from(liabilityPdfBytes).toString("base64");

    // Store in Supabase
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

      // Email to student
      try {
        await resend.emails.send({
          from: fromAddress, to: [email],
          subject: `AIDA Forms Submitted — ${course || "Course"}`,
          attachments,
          html: `
            <div style="font-family:-apple-system,sans-serif;max-width:540px;padding:20px;">
              <h2 style="color:#0B1D2C;margin-bottom:8px;">Forms received, ${firstName}!</h2>
              <p style="color:#5a6a7a;font-size:14px;line-height:1.6;">
                Your signed AIDA Medical Statement and Liability Release are attached as PDFs. Keep these for your records.
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
                  Print the attached Medical Statement, take it to your doctor for review and signature on page 2, and bring the signed copy to Day 1 of your course.
                </p>
              </div>
              ` : ""}
              <p style="color:#5a6a7a;font-size:13px;margin-top:16px;">
                <strong>Also required:</strong> <a href="https://lajollafreediveclub.com/waiver" style="color:#1B6B6B;">Sign your LJFC waiver</a> if you haven't already.
              </p>
              <p style="color:#5a6a7a;font-size:11px;margin-top:24px;">La Jolla Freedive Club · San Diego, CA · AIDA Certified · DAN Insured</p>
            </div>
          `,
        });
      } catch {}

      // Email to Joshua
      try {
        await resend.emails.send({
          from: fromAddress, to: [OWNER_EMAIL],
          subject: `AIDA Forms: ${fullName} — ${course}${physicianRequired ? " ⚠️ PHYSICIAN REQUIRED" : ""}`,
          attachments,
          html: `
            <div style="font-family:-apple-system,sans-serif;max-width:540px;padding:20px;">
              <h3 style="color:#0B1D2C;">${fullName} — AIDA forms submitted</h3>
              <p style="color:#5a6a7a;font-size:13px;">Filled official AIDA PDFs attached.</p>
              <table style="font-size:14px;border-collapse:collapse;margin-top:12px;">
                <tr><td style="padding:4px 12px 4px 0;color:#5a6a7a;">Email</td><td>${email}</td></tr>
                <tr><td style="padding:4px 12px 4px 0;color:#5a6a7a;">DOB</td><td>${dob}</td></tr>
                <tr><td style="padding:4px 12px 4px 0;color:#5a6a7a;">Course</td><td style="font-weight:600;">${course}</td></tr>
                <tr><td style="padding:4px 12px 4px 0;color:#5a6a7a;">Medical</td><td style="${physicianRequired ? "color:#C75B3A;font-weight:600;" : "color:#1B6B6B;"}">${medicalStatus}</td></tr>
                <tr><td style="padding:4px 12px 4px 0;color:#5a6a7a;">Minor</td><td>${isMinor ? `Yes — ${guardianName}` : "No"}</td></tr>
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
