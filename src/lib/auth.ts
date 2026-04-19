import { cookies } from "next/headers";
import { supabase } from "./supabase";
import { randomBytes } from "crypto";

export async function getStudent() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("ljfc_session")?.value;

  if (!sessionToken) return null;

  const { data: student } = await supabase
    .from("students")
    .select("*")
    .eq("magic_token", sessionToken)
    .single();

  if (!student) return null;

  // Check session expiry
  if (new Date(student.magic_token_expires) < new Date()) return null;

  return student;
}

/**
 * Issue a magic link for a student. Creates/updates the token and returns the URL.
 * Used by both the manual login flow and auto-issue on Stripe payment.
 */
export async function issueMagicLink(email: string): Promise<{ token: string; url: string } | null> {
  const normalizedEmail = email.toLowerCase();

  // Ensure student exists
  const { data: student } = await supabase
    .from("students")
    .select("id")
    .eq("email", normalizedEmail)
    .single();

  if (!student) return null;

  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours for payment links

  const { error } = await supabase
    .from("students")
    .update({
      magic_token: token,
      magic_token_expires: expires.toISOString(),
    })
    .eq("email", normalizedEmail);

  if (error) return null;

  const url = `https://lajollafreediveclub.com/portal/verify?token=${token}`;
  return { token, url };
}

/**
 * Check if a student has completed onboarding (all required fields filled + medical on file).
 */
export async function isOnboardingComplete(studentId: string, email: string): Promise<boolean> {
  const [{ data: onboarding }, { data: medical }] = await Promise.all([
    supabase.from("student_onboarding").select("sex, height_ft, weight_lbs, emergency_contact_name, emergency_contact_phone, swim_ability, freediving_experience, completed_at").eq("student_id", studentId).single(),
    supabase.from("aida_forms").select("id, physician_required, physician_cleared").eq("email", email).eq("form_type", "medical_statement").order("signed_at", { ascending: false }).limit(1),
  ]);

  if (!onboarding) return false;

  const requiredFields = onboarding.sex && onboarding.height_ft && onboarding.weight_lbs &&
    onboarding.emergency_contact_name && onboarding.emergency_contact_phone &&
    onboarding.swim_ability && onboarding.freediving_experience;

  if (!requiredFields) return false;

  // Medical must be on file
  if (!medical || medical.length === 0) return false;

  // If physician required, must be cleared
  const latestMedical = medical[0] as { physician_required: boolean; physician_cleared: boolean };
  if (latestMedical.physician_required && !latestMedical.physician_cleared) return false;

  return true;
}
