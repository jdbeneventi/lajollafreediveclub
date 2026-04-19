import { NextRequest, NextResponse } from "next/server";
import { getStudent } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

const VALID_SEX = ["male", "female", "other"];
const VALID_SWIM = ["non_swimmer", "basic", "comfortable", "strong", "competitive"];
const VALID_SWIM_200M = ["yes", "with_difficulty", "no", "havent_tried"];
const VALID_EXPERIENCE = ["none", "recreational", "trained_other_agency", "aida_certified"];
const VALID_BREATH_HOLD = ["under_30s", "30_60s", "1_2min", "2_plus_min", "unknown"];
const VALID_DIVE_BUCKET = ["surface_only", "under_5m", "5_10m", "10_20m", "20m_plus"];
const VALID_SHIRT = ["XS", "S", "M", "L", "XL", "XXL"];

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

  // Validate enums
  if (body.sex && !VALID_SEX.includes(body.sex)) {
    return NextResponse.json({ error: "Invalid sex value" }, { status: 400 });
  }
  if (body.swim_ability && !VALID_SWIM.includes(body.swim_ability)) {
    return NextResponse.json({ error: "Invalid swim_ability" }, { status: 400 });
  }
  if (body.swim_200m_no_fins && !VALID_SWIM_200M.includes(body.swim_200m_no_fins)) {
    return NextResponse.json({ error: "Invalid swim_200m_no_fins" }, { status: 400 });
  }
  if (body.freediving_experience && !VALID_EXPERIENCE.includes(body.freediving_experience)) {
    return NextResponse.json({ error: "Invalid freediving_experience" }, { status: 400 });
  }
  if (body.breath_hold_bucket && !VALID_BREATH_HOLD.includes(body.breath_hold_bucket)) {
    return NextResponse.json({ error: "Invalid breath_hold_bucket" }, { status: 400 });
  }
  if (body.deepest_dive_bucket && !VALID_DIVE_BUCKET.includes(body.deepest_dive_bucket)) {
    return NextResponse.json({ error: "Invalid deepest_dive_bucket" }, { status: 400 });
  }
  if (body.shirt_size && !VALID_SHIRT.includes(body.shirt_size)) {
    return NextResponse.json({ error: "Invalid shirt_size" }, { status: 400 });
  }

  // Server-side validation for measurements
  const heightFt = body.height_ft ? parseInt(body.height_ft) : null;
  const heightIn = body.height_in ? parseInt(body.height_in) : null;
  const weightLbs = body.weight_lbs ? parseInt(body.weight_lbs) : null;

  if (heightFt !== null && (heightFt < 3 || heightFt > 8)) {
    return NextResponse.json({ error: "height_ft must be 3-8" }, { status: 400 });
  }
  if (heightIn !== null && (heightIn < 0 || heightIn > 11)) {
    return NextResponse.json({ error: "height_in must be 0-11" }, { status: 400 });
  }
  if (weightLbs !== null && (weightLbs < 50 || weightLbs > 450)) {
    return NextResponse.json({ error: "weight_lbs must be 50-450" }, { status: 400 });
  }

  // Check if this submission completes onboarding
  const isComplete = body.sex && heightFt && weightLbs &&
    body.emergency_contact_name && body.emergency_contact_phone &&
    body.swim_ability && body.freediving_experience;

  // Also update the student's name if provided
  if (body.first_name || body.last_name) {
    const nameUpdate: Record<string, string> = {};
    if (body.first_name) nameUpdate.first_name = body.first_name;
    if (body.last_name) nameUpdate.last_name = body.last_name;
    await supabase.from("students").update(nameUpdate).eq("id", student.id);
  }

  const record = {
    student_id: student.id,
    email: student.email,
    first_name: body.first_name || student.first_name || null,
    last_name: body.last_name || student.last_name || null,
    sex: body.sex || null,
    date_of_birth: body.date_of_birth || null,
    pronouns: body.pronouns || null,
    height_ft: heightFt,
    height_in: heightIn,
    weight_lbs: weightLbs,
    emergency_contact_name: body.emergency_contact_name || null,
    emergency_contact_phone: body.emergency_contact_phone || null,
    emergency_contact_relationship: body.emergency_contact_relationship || null,
    swim_ability: body.swim_ability || null,
    swim_200m_no_fins: body.swim_200m_no_fins || null,
    freediving_experience: body.freediving_experience || null,
    breath_hold_bucket: body.breath_hold_bucket || null,
    deepest_dive_bucket: body.deepest_dive_bucket || null,
    shoe_size_us: body.shoe_size_us ? parseFloat(body.shoe_size_us) : null,
    shirt_size: body.shirt_size || null,
    fears: body.fears || null,
    goals: body.goals || null,
    gear_owned: body.gear_owned || [],
    theory_preference: body.theory_preference || null,
    notes: body.notes || null,
    completed_at: isComplete ? (body.completed_at || new Date().toISOString()) : null,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("student_onboarding")
    .upsert(record, { onConflict: "student_id" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, complete: !!isComplete });
}
