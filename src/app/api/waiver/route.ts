import { NextResponse } from "next/server";
import { jsPDF } from "jspdf";
import { Resend } from "resend";
import { supabase } from "@/lib/supabase";

const FORMSPREE_URL = "https://formspree.io/f/mojknqlk";
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const OWNER_EMAIL = "joshuabeneventi@gmail.com";
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbxwslRAmNpm86dh7F8bKvSAo2T0fUs5A02KkkbEzi4SnFTOOR-5sdwPsTYW1Urddvqs/exec";

interface WaiverData {
  fullName: string;
  dob: string;
  email: string;
  phone: string;
  emergencyName: string;
  emergencyPhone: string;
  emergencyRelation: string;
  medical: string[];
  medicalDetails: string;
  isMinor: boolean;
  guardianName: string;
  mediaConsent: boolean;
  signatureData: string; // base64 PNG
}

const medicalQuestions = [
  "Heart or cardiovascular condition?",
  "Asthma or respiratory condition?",
  "Seizure disorder or history of blackouts?",
  "Ear, nose, or sinus condition affecting equalization?",
  "Currently taking prescription medication?",
  "Previous freediving/diving-related injury?",
  "Condition affecting water safety or judgment under stress?",
  "Currently pregnant?",
];

function generatePDF(data: WaiverData, signedAt: string): string {
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
    // Check if we need a new page
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
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(11, 29, 44);
  doc.text("LA JOLLA FREEDIVE CLUB", pageWidth / 2, y, { align: "center" });
  y += 24;
  doc.setFontSize(14);
  doc.text("LIABILITY WAIVER & ASSUMPTION OF RISK", pageWidth / 2, y, { align: "center" });
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
  addText(`Name: ${data.fullName}`, 10, "normal");
  addText(`Date of Birth: ${data.dob}`, 10, "normal");
  addText(`Email: ${data.email}`, 10, "normal");
  addText(`Phone: ${data.phone || "Not provided"}`, 10, "normal");
  y += 4;
  addText(`Emergency Contact: ${data.emergencyName} · ${data.emergencyPhone} · ${data.emergencyRelation || "N/A"}`, 10, "normal");
  if (data.isMinor) {
    addText(`Minor Participant — Parent/Guardian: ${data.guardianName}`, 10, "bold", [199, 91, 58]);
  }
  y += 8;
  addLine();

  // Waiver Text
  addText("ASSUMPTION OF RISK & LIABILITY RELEASE", 10, "bold", [27, 107, 107]);
  y += 4;

  addText(
    "I understand that La Jolla Freedive Club (\"LJFC\") activities — including but not limited to group ocean sessions, guided freediving, breath-hold training, stretching and breathing exercises, open water swimming, and related ocean-based activities — involve inherent risks that cannot be eliminated regardless of the care taken to avoid them.",
    9, "normal", [40, 40, 40]
  );

  addText(
    "I understand that these risks include but are not limited to: drowning or near-drowning, shallow water blackout or loss of motor control during or after a breath hold, barotrauma to ears/sinuses/lungs, injuries from marine life, hypothermia or cold water shock, physical injury from surf/currents/rocks/underwater hazards, equipment failure or misuse, exhaustion, dehydration, overexertion, other participants' actions or negligence, and injury during travel to or from dive sites.",
    9, "normal", [40, 40, 40]
  );

  addText(
    "I voluntarily choose to participate in LJFC activities with full knowledge of the inherent risks. I accept and assume all risks of injury, illness, disability, or death that may arise from my participation.",
    9, "normal", [40, 40, 40]
  );

  addText(
    "I hereby release, discharge, and hold harmless La Jolla Freedive Club, Joshua Beneventi, and any of their respective employees, agents, contractors, volunteers, or assigns (the \"Released Parties\") from any and all liability, claims, demands, actions, or causes of action arising out of or related to any loss, damage, or injury — including death — that may be sustained by me or my property as a result of participation in LJFC activities, whether caused by the negligence of the Released Parties or otherwise.",
    9, "normal", [40, 40, 40]
  );

  addText(
    "I declare that I am in good physical and mental health and capable of participating in the described activities, am not under the influence of alcohol or any impairing substance, have disclosed any relevant medical condition, and am a competent swimmer capable of swimming at least 200 meters non-stop without assistance. In the event of an emergency, I authorize LJFC staff to arrange for emergency medical treatment on my behalf. Medical costs incurred are my responsibility.",
    9, "normal", [40, 40, 40]
  );

  addText(
    `Media consent: ${data.mediaConsent ? "GRANTED — I grant LJFC permission to use photographs or video taken during activities for promotional purposes." : "DECLINED — I do not consent to use of my image for promotional purposes."}`,
    9, "normal", [40, 40, 40]
  );

  addText(
    "This agreement shall be governed by the laws of the State of California. If any provision is found unenforceable, the remaining provisions shall continue in full force and effect.",
    9, "normal", [40, 40, 40]
  );

  y += 8;
  addLine();

  // Medical
  addText("MEDICAL QUESTIONNAIRE", 10, "bold", [27, 107, 107]);
  y += 4;

  medicalQuestions.forEach((q, i) => {
    const answer = data.medical[i]?.toUpperCase() || "NO";
    const color: [number, number, number] = answer === "YES" ? [199, 91, 58] : [40, 40, 40];
    addText(`${answer}  —  ${q}`, 9, answer === "YES" ? "bold" : "normal", color);
  });

  if (data.medicalDetails) {
    y += 4;
    addText(`Details: ${data.medicalDetails}`, 9, "italic", [100, 100, 100]);
  }

  y += 8;
  addLine();

  // Signature
  addText("DIGITAL SIGNATURE", 10, "bold", [27, 107, 107]);
  y += 8;

  // Embed signature image
  if (data.signatureData && data.signatureData.startsWith("data:image")) {
    try {
      if (y + 80 > 740) {
        doc.addPage();
        y = 50;
      }
      doc.addImage(data.signatureData, "PNG", margin, y, 200, 60);
      y += 70;
    } catch {
      addText("[Signature image could not be embedded]", 9, "italic", [150, 150, 150]);
    }
  }

  addText(`Signed by: ${data.isMinor ? data.guardianName + " (parent/guardian of " + data.fullName + ")" : data.fullName}`, 9, "normal");
  addText(`Date: ${signedAt}`, 9, "normal");
  addText(`IP timestamp: ${signedAt} UTC`, 8, "normal", [150, 150, 150]);

  y += 16;

  // Footer
  doc.setFontSize(7);
  doc.setTextColor(150, 150, 150);
  doc.text(
    "La Jolla Freedive Club · San Diego, CA · AIDA Certified · DAN Insured · Red Cross First Aid/CPR/AED",
    pageWidth / 2,
    750,
    { align: "center" }
  );
  doc.text("lajollafreediveclub.com", pageWidth / 2, 760, { align: "center" });

  return doc.output("datauristring");
}

export async function POST(request: Request) {
  try {
    const data: WaiverData = await request.json();
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
    const pdfDataUri = generatePDF(data, signedAt);
    const hasYes = data.medical.some((a) => a === "yes");

    // Extract raw PDF bytes from data URI for email attachment
    const pdfBase64 = pdfDataUri.split(",")[1];
    const pdfBuffer = Buffer.from(pdfBase64, "base64");
    const fileName = `LJFC-Waiver-${data.fullName.replace(/\s+/g, "-")}-${new Date().toISOString().split("T")[0]}.pdf`;

    // Log to Google Sheet FIRST (before emails which may timeout)
    // PDF archiving skipped — too large for Apps Script payload
    try {
      const medicalStatus = data.medical.some(a => a === "yes")
        ? "FLAGGED"
        : "Clear";
      await fetch(GOOGLE_SHEET_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.fullName,
          email: data.email,
          phone: data.phone || "",
          dateSigned: signedAt,
          emergencyContact: `${data.emergencyName} · ${data.emergencyPhone}`,
          medicalFlags: medicalStatus + (data.medicalDetails ? ` — ${data.medicalDetails}` : ""),
        }),
        redirect: "follow",
      });
    } catch {
      // Sheet logging is non-critical
    }

    // Mark waiver signed in Saturday members
    try {
      const nameParts = data.fullName.trim().split(" ");
      const waiverFirst = nameParts[0] || "";
      const waiverLast = nameParts.slice(1).join(" ") || "";
      await supabase
        .from("saturday_members")
        .upsert({
          first_name: waiverFirst,
          last_name: waiverLast,
          email: data.email,
          phone: data.phone || null,
          waiver_signed: true,
          waiver_signed_at: new Date().toISOString(),
        }, { onConflict: "email", ignoreDuplicates: false });
    } catch {
      // Non-critical
    }

    // Send emails via Resend
    const emailErrors: string[] = [];
    if (RESEND_API_KEY) {
      const resend = new Resend(RESEND_API_KEY);
      const fromAddress = "La Jolla Freedive Club <noreply@lajollafreediveclub.com>";

      const medicalSummary = hasYes
        ? `⚠️ MEDICAL FLAG — Review required\n${medicalQuestions.map((q, i) => `${(data.medical[i] || "no").toUpperCase()}: ${q}`).join("\n")}${data.medicalDetails ? `\nDetails: ${data.medicalDetails}` : ""}`
        : "✅ All medical questions clear";

      // Email #1: To Joshua — with PDF attached
      try {
        const { error: ownerErr } = await resend.emails.send({
          from: fromAddress,
          to: [OWNER_EMAIL],
          subject: `${hasYes ? "⚠️ " : ""}Signed Waiver — ${data.fullName}`,
          html: `
            <div style="font-family:-apple-system,sans-serif;max-width:500px;padding:20px;">
              <h2 style="color:#0B1D2C;margin-bottom:16px;">New Waiver Signed</h2>
              <table style="width:100%;font-size:14px;border-collapse:collapse;">
                <tr><td style="padding:6px 0;color:#5a6a7a;">Name</td><td style="padding:6px 0;font-weight:600;">${data.fullName}</td></tr>
                <tr><td style="padding:6px 0;color:#5a6a7a;">Email</td><td style="padding:6px 0;">${data.email}</td></tr>
                <tr><td style="padding:6px 0;color:#5a6a7a;">Phone</td><td style="padding:6px 0;">${data.phone || "Not provided"}</td></tr>
                <tr><td style="padding:6px 0;color:#5a6a7a;">DOB</td><td style="padding:6px 0;">${data.dob}</td></tr>
                <tr><td style="padding:6px 0;color:#5a6a7a;">Emergency</td><td style="padding:6px 0;">${data.emergencyName} · ${data.emergencyPhone}</td></tr>
                <tr><td style="padding:6px 0;color:#5a6a7a;">Minor</td><td style="padding:6px 0;">${data.isMinor ? `Yes — Guardian: ${data.guardianName}` : "No"}</td></tr>
                <tr><td style="padding:6px 0;color:#5a6a7a;">Medical</td><td style="padding:6px 0;color:${hasYes ? "#C75B3A" : "#1B6B6B"};font-weight:600;">${hasYes ? "⚠️ Flagged" : "✅ Clear"}</td></tr>
                <tr><td style="padding:6px 0;color:#5a6a7a;">Media consent</td><td style="padding:6px 0;">${data.mediaConsent ? "Yes" : "No"}</td></tr>
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
        if (ownerErr) emailErrors.push(`Owner email: ${ownerErr.message}`);
      } catch (emailErr) {
        emailErrors.push(`Owner email exception: ${emailErr instanceof Error ? emailErr.message : "unknown"}`);
      }

      // Email #2: To signer — with PDF attached
      try {
        const { error: signerErr } = await resend.emails.send({
          from: fromAddress,
          to: [data.email],
          subject: "Your LJFC Waiver — Signed Copy",
          html: `
            <div style="font-family:-apple-system,sans-serif;max-width:500px;padding:20px;">
              <h2 style="color:#0B1D2C;margin-bottom:8px;">Waiver Signed</h2>
              <p style="color:#5a6a7a;font-size:14px;line-height:1.6;">
                Hi ${data.fullName.split(" ")[0]},<br><br>
                Your La Jolla Freedive Club liability waiver has been signed and recorded.
                A PDF copy is attached for your records.<br><br>
                You're cleared to participate in LJFC activities. If you have any questions,
                reply to this email or visit <a href="https://lajollafreediveclub.com/programs" style="color:#1B6B6B;">our programs page</a>.
              </p>
              <p style="color:#5a6a7a;font-size:12px;margin-top:24px;">
                La Jolla Freedive Club · San Diego, CA<br>
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
        if (signerErr) emailErrors.push(`Signer email: ${signerErr.message}`);
      } catch (emailErr) {
        emailErrors.push(`Signer email exception: ${emailErr instanceof Error ? emailErr.message : "unknown"}`);
      }
    }

    // Also send to Formspree as backup notification
    try {
      await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _form_type: "signed_waiver",
          name: data.fullName,
          email: data.email,
          date_of_birth: data.dob,
          phone: data.phone || "Not provided",
          emergency_contact: `${data.emergencyName} · ${data.emergencyPhone} · ${data.emergencyRelation}`,
          is_minor: data.isMinor ? `Yes — Guardian: ${data.guardianName}` : "No",
          medical_status: hasYes ? "⚠️ FLAGGED — review required" : "✅ All clear",
          signed_at: signedAt,
          pdf_emailed: "Yes — sent via Resend to owner and signer",
        }),
      });
    } catch {
      // Formspree backup
    }

    return NextResponse.json({
      success: true,
      pdf: pdfDataUri,
      signedAt,
      emailErrors: emailErrors.length > 0 ? emailErrors : undefined,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to process waiver" },
      { status: 500 }
    );
  }
}
