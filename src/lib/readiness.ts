import { supabase } from "./supabase";

export interface ReadinessResult {
  ready: boolean;
  percent: number;
  missing: string[];
}

export async function getReadinessScore(studentId: string, email: string): Promise<ReadinessResult> {
  const [
    { data: onboarding },
    { data: medical },
    { data: liability },
    { data: waiver },
    { data: progress },
    { data: bookings },
  ] = await Promise.all([
    supabase.from("student_onboarding").select("completed_at, sex, height_ft, weight_lbs, emergency_contact_name, emergency_contact_phone, swim_ability, freediving_experience").eq("student_id", studentId).single(),
    supabase.from("aida_forms").select("id, physician_required, physician_cleared").eq("email", email).eq("form_type", "medical_statement").order("signed_at", { ascending: false }).limit(1),
    supabase.from("aida_forms").select("id").eq("email", email).eq("form_type", "liability_release").limit(1),
    supabase.from("saturday_members").select("waiver_signed").eq("email", email).single(),
    supabase.from("student_progress").select("requirement_id").eq("student_id", studentId),
    supabase.from("bookings").select("course").eq("email", email).order("created_at", { ascending: false }).limit(1),
  ]);

  const missing: string[] = [];
  let total = 6; // onboarding, medical, physician (if needed), liability, waiver, prep
  let done = 0;

  // 1. Onboarding complete
  const onboardingDone = onboarding?.completed_at && onboarding.sex && onboarding.height_ft &&
    onboarding.weight_lbs && onboarding.emergency_contact_name && onboarding.emergency_contact_phone &&
    onboarding.swim_ability && onboarding.freediving_experience;
  if (onboardingDone) done++;
  else missing.push("Complete onboarding");

  // 2. Medical on file
  const hasMedical = medical && medical.length > 0;
  if (hasMedical) done++;
  else missing.push("AIDA medical statement");

  // 3. Physician clearance (only if required)
  const physicianRequired = hasMedical && (medical[0] as { physician_required: boolean }).physician_required;
  if (physicianRequired) {
    total++;
    const cleared = (medical[0] as { physician_cleared: boolean }).physician_cleared;
    if (cleared) done++;
    else missing.push("Physician clearance");
  }

  // 4. Liability release
  const hasLiability = liability && liability.length > 0;
  if (hasLiability) done++;
  else missing.push("AIDA liability release");

  // 5. LJFC waiver
  const hasWaiver = waiver?.waiver_signed || false;
  if (hasWaiver) done++;
  else missing.push("LJFC waiver");

  // 6. Prep guide ≥ 80%
  const completedReqs = (progress || []).map((p: { requirement_id: string }) => p.requirement_id);
  const course = bookings?.[0]?.course?.toLowerCase() || "";
  const isAida1 = course.includes("aida 1") || course.includes("aida1") || course.includes("discover");
  const prefix = isAida1 ? "prep-aida1-section-" : "prep-section-";
  const prepSections = completedReqs.filter((r: string) => r.startsWith(prefix));
  const prepPercent = prepSections.length / 10;
  if (prepPercent >= 0.8) done++;
  else missing.push(`Prep guide (${Math.round(prepPercent * 100)}% — need 80%)`);

  const percent = Math.round((done / total) * 100);
  return { ready: missing.length === 0, percent, missing };
}
