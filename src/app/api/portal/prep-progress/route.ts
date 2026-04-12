import { NextRequest, NextResponse } from "next/server";
import { getStudent } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const student = await getStudent();
  if (!student) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { sections } = await req.json() as { sections: string[] };
  if (!Array.isArray(sections) || sections.length === 0) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  // Validate section IDs — only allow known section names
  const validSections = [
    "welcome", "nerves", "physiology", "breathing", "equalization",
    "technique", "safety", "risk", "equipment", "logistics",
  ];
  const filtered = sections.filter((s) => validSections.includes(s));
  if (filtered.length === 0) {
    return NextResponse.json({ error: "No valid sections" }, { status: 400 });
  }

  // Upsert each completed section as a progress record
  const records = filtered.map((sectionId: string) => ({
    student_id: student.id,
    requirement_id: `prep-section-${sectionId}`,
    cert_level: "aida2",
    completed_at: new Date().toISOString(),
  }));

  const { error } = await supabase
    .from("student_progress")
    .upsert(records, { onConflict: "student_id,requirement_id" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Check if all 10 sections completed → also mark the a2-prep requirement
  if (filtered.length >= validSections.length) {
    await supabase
      .from("student_progress")
      .upsert(
        { student_id: student.id, requirement_id: "a2-prep", cert_level: "aida2", completed_at: new Date().toISOString() },
        { onConflict: "student_id,requirement_id" }
      );
  }

  return NextResponse.json({ ok: true, count: sections.length });
}
