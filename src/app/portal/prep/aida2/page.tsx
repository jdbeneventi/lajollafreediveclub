import { getStudent } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { redirect } from "next/navigation";
import PrepContent from "./PrepContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AIDA2 Course Prep — Student Portal",
  description: "Interactive course preparation guide for your AIDA 2 freediving certification with La Jolla Freedive Club.",
};

export default async function Aida2PrepPage() {
  const student = await getStudent();
  if (!student) redirect("/portal?redirect=/portal/prep/aida2");

  // Fetch existing progress
  const { data: progress } = await supabase
    .from("student_progress")
    .select("requirement_id")
    .eq("student_id", student.id)
    .like("requirement_id", "prep-section-%");

  const completedSections = (progress || []).map(
    (p: { requirement_id: string }) => p.requirement_id.replace("prep-section-", "")
  );

  return <PrepContent studentEmail={student.email} initialCompleted={completedSections} />;
}
