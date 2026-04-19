import { getStudent } from "@/lib/auth";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import OnboardingFlow from "./OnboardingFlow";

export default async function OnboardingPage() {
  const student = await getStudent();
  if (!student) return redirect("/portal");

  // Fetch existing data to prefill
  const [{ data: onboarding }, { data: aidaForms }, { data: waiverMember }, { data: bookings }] = await Promise.all([
    supabase.from("student_onboarding").select("*").eq("student_id", student.id).single(),
    supabase.from("aida_forms").select("id, form_type, physician_required, physician_cleared").eq("email", student.email).eq("form_type", "medical_statement").order("signed_at", { ascending: false }).limit(1),
    supabase.from("saturday_members").select("emergency_contact_name, emergency_contact_phone, emergency_contact_relationship").eq("email", student.email).single(),
    supabase.from("bookings").select("course").eq("email", student.email).order("created_at", { ascending: false }).limit(1),
  ]);

  // Determine booked course level
  const latestCourse = bookings?.[0]?.course?.toLowerCase() || "";
  const isAida2Plus = latestCourse.includes("aida 2") || latestCourse.includes("aida2") ||
    latestCourse.includes("aida 3") || latestCourse.includes("aida3");

  const hasMedical = aidaForms && aidaForms.length > 0;

  return (
    <OnboardingFlow
      student={{ id: student.id, email: student.email, first_name: student.first_name, last_name: student.last_name }}
      initial={onboarding}
      hasMedical={!!hasMedical}
      physicianRequired={hasMedical ? (aidaForms[0] as { physician_required: boolean }).physician_required : false}
      physicianCleared={hasMedical ? (aidaForms[0] as { physician_cleared: boolean }).physician_cleared : false}
      waiverEmergency={waiverMember ? { name: waiverMember.emergency_contact_name, phone: waiverMember.emergency_contact_phone, relationship: waiverMember.emergency_contact_relationship } : null}
      isAida2Plus={isAida2Plus}
    />
  );
}
