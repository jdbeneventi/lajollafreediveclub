import { NextRequest, NextResponse } from "next/server";
import { getStudent } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

const VALID_GEAR = [
  "wetsuit",
  "hood",
  "mask",
  "snorkel",
  "fins",
  "booties",
  "gloves",
  "weight_belt",
  "weights",
] as const;

const VALID_SEX = ["male", "female", "other"] as const;

export async function GET() {
  const student = await getStudent();
  if (!student) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data } = await supabase
    .from("student_onboarding")
    .select("*")
    .eq("student_id", student.id)
    .single();

  return NextResponse.json({ onboarding: data || null });
}

export async function POST(req: NextRequest) {
  const student = await getStudent();
  if (!student) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    sex,
    height_ft,
    height_in,
    weight_lbs,
    gear_owned,
    theory_preference,
    notes,
  } = body;

  // Validate
  if (sex && !VALID_SEX.includes(sex)) {
    return NextResponse.json({ error: "Invalid sex value" }, { status: 400 });
  }
  if (gear_owned && !Array.isArray(gear_owned)) {
    return NextResponse.json({ error: "gear_owned must be array" }, { status: 400 });
  }
  if (gear_owned) {
    const invalid = gear_owned.filter((g: string) => !VALID_GEAR.includes(g as typeof VALID_GEAR[number]));
    if (invalid.length > 0) {
      return NextResponse.json({ error: `Invalid gear items: ${invalid.join(", ")}` }, { status: 400 });
    }
  }

  const record = {
    student_id: student.id,
    email: student.email,
    first_name: student.first_name || null,
    last_name: student.last_name || null,
    sex: sex || null,
    height_ft: height_ft ? parseInt(height_ft) : null,
    height_in: height_in ? parseInt(height_in) : null,
    weight_lbs: weight_lbs ? parseInt(weight_lbs) : null,
    gear_owned: gear_owned || [],
    theory_preference: theory_preference || null,
    notes: notes || null,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("student_onboarding")
    .upsert(record, { onConflict: "student_id" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
