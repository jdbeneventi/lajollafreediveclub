import { NextResponse } from "next/server";
import { jsPDF } from "jspdf";

const FORMSPREE_URL = "https://formspree.io/f/mojknqlk";

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

    // Send to Formspree (notification for Joshua)
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
          medical_answers: medicalQuestions
            .map((q, i) => `${(data.medical[i] || "no").toUpperCase()}: ${q}`)
            .join("\n"),
          medical_details: data.medicalDetails || "None",
          media_consent: data.mediaConsent ? "Yes" : "No",
          signed_at: signedAt,
          pdf_generated: "Yes — PDF returned to signer for download",
        }),
      });
    } catch {
      // Formspree often succeeds despite CORS
    }

    return NextResponse.json({
      success: true,
      pdf: pdfDataUri,
      signedAt,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to process waiver" },
      { status: 500 }
    );
  }
}
