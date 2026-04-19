import { NextRequest, NextResponse } from "next/server";
import { getStudent } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const student = await getStudent();
  if (!student) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { answers, medical_details, physician_required, signature } = await req.json();

  if (!answers || typeof answers !== "object") {
    return NextResponse.json({ error: "answers required" }, { status: 400 });
  }
  if (!signature) {
    return NextResponse.json({ error: "signature required" }, { status: 400 });
  }

  // Build medical answers object
  const medicalAnswers: Record<string, string> = {};
  for (const [key, val] of Object.entries(answers)) {
    medicalAnswers[key] = val as string;
  }

  const record = {
    email: student.email,
    full_name: [student.first_name, student.last_name].filter(Boolean).join(" ") || student.email,
    form_type: "medical_statement",
    course: "Universal", // applies to all course levels
    medical_answers: medicalAnswers,
    medical_details: medical_details || null,
    physician_required: !!physician_required,
    physician_cleared: false,
    signature_data: signature,
    signed_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("aida_forms").insert(record);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, physician_required: !!physician_required });
}
