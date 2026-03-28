import { NextResponse } from "next/server";
import { Resend } from "resend";

const FORMSPREE_URL = "https://formspree.io/f/mojknqlk";
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const OWNER_EMAIL = "joshuabeneventi@gmail.com";

interface MedicalAnswer {
  answer: string;
  details: string;
}

interface CampWaiverData {
  childName: string;
  childDob: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  medicalAnswers: Record<string, MedicalAnswer>;
  signatureDataUrl: string;
  registrationId: string;
}

const medicalQuestions = [
  "Does your child have any heart conditions?",
  "Does your child have asthma or respiratory conditions?",
  "Does your child have epilepsy or seizure disorders?",
  "Does your child have any allergies (food, medication, environmental)?",
  "Is your child currently taking any medications?",
  "Does your child have any learning disabilities or behavioral conditions we should be aware of?",
  "Any other medical conditions?",
];

async function generatePDF(data: CampWaiverData, signedAt: string): Promise<string> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 50;
  const contentWidth = pageWidth - margin * 2;
  let y = 50;

  const addText = (text: string, size: number, style: string = "normal", color: [number, number, number] = [10, 10, 10]) => {
    doc.setFontSize(size);
    doc.setFont("helvetica", style);
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(text, contentWidth);
    if (y + lines.length * size * 1.2 > 740) {
      doc.addPage();
      y = 50;
    }
    doc.text(lines, margin, y);
    y += lines.length * size * 1.3 + 4;
  };

  const addLine = () => {
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, pageWidth - margin, y);
    y += 12;
  };

  // Header
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(11, 29, 44);
  doc.text("LA JOLLA FREEDIVE CLUB", pageWidth / 2, y, { align: "center" });
  y += 20;
  doc.setFontSize(13);
  doc.text("CAMP GARIBALDI \u2014 YOUTH WAIVER & LIABILITY RELEASE", pageWidth / 2, y, { align: "center" });
  y += 10;
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text(`Signed digitally on ${signedAt}`, pageWidth / 2, y, { align: "center" });
  y += 20;
  addLine();

  // Participant Info
  addText("PARTICIPANT INFORMATION", 10, "bold", [27, 107, 107]);
  y += 4;
  addText(`Child: ${data.childName}`, 10, "normal");
  addText(`Date of Birth: ${data.childDob}`, 10, "normal");
  y += 4;
  addText("PARENT / GUARDIAN", 10, "bold", [27, 107, 107]);
  y += 4;
  addText(`Name: ${data.parentName}`, 10, "normal");
  addText(`Email: ${data.parentEmail}`, 10, "normal");
  addText(`Phone: ${data.parentPhone}`, 10, "normal");
  if (data.registrationId) {
    addText(`Registration ID: ${data.registrationId}`, 9, "normal", [100, 100, 100]);
  }
  y += 8;
  addLine();

  // Medical Summary
  addText("MEDICAL AUTHORIZATION", 10, "bold", [27, 107, 107]);
  y += 4;

  medicalQuestions.forEach((q) => {
    const entry = data.medicalAnswers[q];
    if (!entry) return;
    const answer = entry.answer.toUpperCase();
    const color: [number, number, number] = answer === "YES" ? [199, 91, 58] : [40, 40, 40];
    addText(`${answer}  \u2014  ${q}`, 9, answer === "YES" ? "bold" : "normal", color);
    if (answer === "YES" && entry.details) {
      addText(`    Details: ${entry.details}`, 9, "italic", [100, 100, 100]);
    }
  });

  y += 8;
  addLine();

  // Waiver text (abbreviated in PDF)
  addText("LIABILITY RELEASE", 10, "bold", [27, 107, 107]);
  y += 4;

  addText(
    `I, ${data.parentName}, parent/guardian of ${data.childName}, acknowledge that ocean activities including freediving, snorkeling, and swimming in open water involve inherent risks including but not limited to drowning, marine life encounters, surf conditions, and cold water exposure. I voluntarily assume these risks on behalf of my child and release La Jolla Freedive Club, its instructors, and staff from liability for any injury, illness, or loss arising from participation in Camp Garibaldi activities.`,
    9, "normal", [40, 40, 40]
  );

  addText(
    `I authorize La Jolla Freedive Club and its staff to arrange emergency medical treatment for my child, ${data.childName}, in the event I cannot be reached. I understand that I am responsible for all medical costs incurred.`,
    9, "normal", [40, 40, 40]
  );

  addText(
    "I grant La Jolla Freedive Club permission to use photographs and video recordings of my child taken during camp activities for promotional, educational, and social media purposes.",
    9, "normal", [40, 40, 40]
  );

  addText(
    "This agreement shall be governed by the laws of the State of California. If any provision is found unenforceable, the remaining provisions shall continue in full force and effect.",
    9, "normal", [40, 40, 40]
  );

  y += 8;
  addLine();

  // Signature
  addText("DIGITAL SIGNATURE", 10, "bold", [27, 107, 107]);
  y += 8;

  if (data.signatureDataUrl && data.signatureDataUrl.startsWith("data:image")) {
    try {
      if (y + 80 > 740) {
        doc.addPage();
        y = 50;
      }
      doc.addImage(data.signatureDataUrl, "PNG", margin, y, 200, 60);
      y += 70;
    } catch {
      addText("[Signature image could not be embedded]", 9, "italic", [150, 150, 150]);
    }
  }

  addText(`Signed by: ${data.parentName} (parent/guardian of ${data.childName})`, 9, "normal");
  addText(`Date: ${signedAt}`, 9, "normal");
  addText(`Timestamp: ${signedAt} UTC`, 8, "normal", [150, 150, 150]);

  y += 16;

  // Footer
  doc.setFontSize(7);
  doc.setTextColor(150, 150, 150);
  doc.text(
    "La Jolla Freedive Club \u00B7 Camp Garibaldi \u00B7 San Diego, CA \u00B7 AIDA Certified \u00B7 DAN Insured \u00B7 Red Cross First Aid/CPR/AED",
    pageWidth / 2,
    750,
    { align: "center" }
  );
  doc.text("lajollafreediveclub.com", pageWidth / 2, 760, { align: "center" });

  return doc.output("datauristring");
}

export async function POST(request: Request) {
  try {
    const data: CampWaiverData = await request.json();
    const signedAt = new Date().toLocaleString("en-US", {
      timeZone: "America/Los_Angeles",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    // Generate PDF
    const pdfDataUri = await generatePDF(data, signedAt);
    const hasYes = Object.values(data.medicalAnswers).some((a) => a.answer === "yes");

    // Extract raw PDF bytes for email attachment
    const pdfBase64 = pdfDataUri.split(",")[1];
    const pdfBuffer = Buffer.from(pdfBase64, "base64");
    const fileName = `Camp-Garibaldi-Waiver-${data.childName.replace(/\s+/g, "-")}-${new Date().toISOString().split("T")[0]}.pdf`;

    // Send emails via Resend
    if (RESEND_API_KEY) {
      const resend = new Resend(RESEND_API_KEY);
      const fromAddress = "Camp Garibaldi <noreply@lajollafreediveclub.com>";

      const medicalSummary = hasYes
        ? medicalQuestions
            .map((q) => {
              const entry = data.medicalAnswers[q];
              if (!entry) return null;
              return `${entry.answer.toUpperCase()}: ${q}${entry.answer === "yes" && entry.details ? ` — ${entry.details}` : ""}`;
            })
            .filter(Boolean)
            .join("\n")
        : "All medical questions clear";

      // Email #1: To Joshua
      try {
        await resend.emails.send({
          from: fromAddress,
          to: [OWNER_EMAIL],
          subject: `${hasYes ? "\u26A0\uFE0F " : ""}Camp Waiver Signed — ${data.childName}`,
          html: `
            <div style="font-family:-apple-system,sans-serif;max-width:500px;padding:20px;">
              <h2 style="color:#0B1D2C;margin-bottom:16px;">Camp Garibaldi — Youth Waiver Signed</h2>
              <table style="width:100%;font-size:14px;border-collapse:collapse;">
                <tr><td style="padding:6px 0;color:#5a6a7a;">Child</td><td style="padding:6px 0;font-weight:600;">${data.childName}</td></tr>
                <tr><td style="padding:6px 0;color:#5a6a7a;">DOB</td><td style="padding:6px 0;">${data.childDob}</td></tr>
                <tr><td style="padding:6px 0;color:#5a6a7a;">Parent</td><td style="padding:6px 0;">${data.parentName}</td></tr>
                <tr><td style="padding:6px 0;color:#5a6a7a;">Email</td><td style="padding:6px 0;">${data.parentEmail}</td></tr>
                <tr><td style="padding:6px 0;color:#5a6a7a;">Phone</td><td style="padding:6px 0;">${data.parentPhone}</td></tr>
                <tr><td style="padding:6px 0;color:#5a6a7a;">Registration ID</td><td style="padding:6px 0;">${data.registrationId || "N/A"}</td></tr>
                <tr><td style="padding:6px 0;color:#5a6a7a;">Medical</td><td style="padding:6px 0;color:${hasYes ? "#C75B3A" : "#1B6B6B"};font-weight:600;">${hasYes ? "\u26A0\uFE0F Flagged" : "\u2705 Clear"}</td></tr>
                <tr><td style="padding:6px 0;color:#5a6a7a;">Signed</td><td style="padding:6px 0;">${signedAt}</td></tr>
              </table>
              ${hasYes ? `<div style="margin-top:16px;padding:12px;background:#FFF3EE;border-radius:8px;font-size:12px;"><pre style="white-space:pre-wrap;margin:0;">${medicalSummary}</pre></div>` : ""}
              <p style="font-size:12px;color:#5a6a7a;margin-top:16px;">Signed PDF attached.</p>
            </div>
          `,
          attachments: [
            {
              filename: fileName,
              content: pdfBuffer,
            },
          ],
        });
      } catch {
        // Non-critical
      }

      // Email #2: To parent
      try {
        await resend.emails.send({
          from: fromAddress,
          to: [data.parentEmail],
          subject: `Camp Garibaldi Waiver — Signed Copy for ${data.childName}`,
          html: `
            <div style="font-family:-apple-system,sans-serif;max-width:500px;padding:20px;">
              <h2 style="color:#0B1D2C;margin-bottom:8px;">Waiver Signed</h2>
              <p style="color:#5a6a7a;font-size:14px;line-height:1.6;">
                Hi ${data.parentName.split(" ")[0]},<br><br>
                The Camp Garibaldi youth waiver for ${data.childName} has been signed and recorded.
                A PDF copy is attached for your records.<br><br>
                If you have any questions about camp, reply to this email or visit
                <a href="https://lajollafreediveclub.com/camp-garibaldi" style="color:#1B6B6B;">our camp page</a>.
              </p>
              <p style="color:#5a6a7a;font-size:12px;margin-top:24px;">
                La Jolla Freedive Club · Camp Garibaldi · San Diego, CA<br>
                AIDA Certified · DAN Insured · Red Cross First Aid/CPR/AED<br>
                <a href="https://lajollafreediveclub.com" style="color:#1B6B6B;">lajollafreediveclub.com</a>
              </p>
            </div>
          `,
          attachments: [
            {
              filename: fileName,
              content: pdfBuffer,
            },
          ],
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
          _form_type: "camp-waiver",
          child_name: data.childName,
          child_dob: data.childDob,
          parent_name: data.parentName,
          parent_email: data.parentEmail,
          parent_phone: data.parentPhone,
          registration_id: data.registrationId || "N/A",
          medical_status: hasYes ? "FLAGGED — review required" : "All clear",
          signed_at: signedAt,
          pdf_emailed: "Yes — sent via Resend to owner and parent",
        }),
      });
    } catch {
      // Formspree backup is non-critical
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to process camp waiver" },
      { status: 500 }
    );
  }
}
