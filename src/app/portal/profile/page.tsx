import { getStudent } from "@/lib/auth";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ProfileView from "./ProfileView";

export default async function ProfilePage() {
  const student = await getStudent();
  if (!student) return redirect("/portal");

  const [{ data: onboarding }, { data: gearCatalog }, { data: studentGear }] = await Promise.all([
    supabase.from("student_onboarding").select("*").eq("student_id", student.id).single(),
    supabase.from("gear_catalog").select("*").eq("archived", false).order("sort_order"),
    supabase.from("student_gear").select("*").eq("student_id", student.id),
  ]);

  return (
    <ProfileView
      student={{ id: student.id, email: student.email, first_name: student.first_name, last_name: student.last_name }}
      onboarding={onboarding}
      gearCatalog={gearCatalog || []}
      studentGear={studentGear || []}
    />
  );
}
