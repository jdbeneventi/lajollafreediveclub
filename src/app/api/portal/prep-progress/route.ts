import { NextRequest, NextResponse } from "next/server";
import { getStudent } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

const VALID_SECTIONS: Record<string, string[]> = {
  aida1: [
    "welcome", "nerves", "physiology", "breathing", "equalization",
    "safety", "risk", "equipment", "swim", "logistics",
  ],
  aida2: [
    "welcome", "nerves", "physiology", "breathing", "equalization",
    "technique", "safety", "risk", "equipment", "logistics",
  ],
};

export async function POST(req: NextRequest) {
  const student = await getStudent();
  if (!student) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { course, sections } = await req.json() as { course?: string; sections: string[] };
  if (!Array.isArray(sections) || sections.length === 0) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  // Default to aida2 for backwards compat
  const certLevel = course === "aida1" ? "aida1" : "aida2";
  const validSections = VALID_SECTIONS[certLevel];
  const prefix = certLevel === "aida1" ? "prep-aida1-section-" : "prep-section-";
  const completionReqId = certLevel === "aida1" ? "a1-prep" : "a2-prep";

  const filtered = sections.filter((s) => validSections.includes(s));
  if (filtered.length === 0) {
    return NextResponse.json({ error: "No valid sections" }, { status: 400 });
  }

  // Upsert each completed section as a progress record
  const records = filtered.map((sectionId: string) => ({
    student_id: student.id,
    requirement_id: `${prefix}${sectionId}`,
    cert_level: certLevel,
    completed_at: new Date().toISOString(),
  }));

  const { error } = await supabase
    .from("student_progress")
    .upsert(records, { onConflict: "student_id,requirement_id" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Check if all sections completed → mark the prep requirement
  if (filtered.length >= validSections.length) {
    await supabase
      .from("student_progress")
      .upsert(
        { student_id: student.id, requirement_id: completionReqId, cert_level: certLevel, completed_at: new Date().toISOString() },
        { onConflict: "student_id,requirement_id" }
      );
  }

  return NextResponse.json({ ok: true, count: filtered.length });
}
