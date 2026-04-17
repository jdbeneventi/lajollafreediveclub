import { getStudent } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { redirect } from "next/navigation";
import PrepContent from "./PrepContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AIDA1 Course Prep — Student Portal",
  description: "Interactive course preparation guide for your AIDA 1 Introduction to Freediving with La Jolla Freedive Club.",
};

export default async function Aida1PrepPage() {
  const student = await getStudent();
  if (!student) return redirect("/portal");

  // Fetch existing progress
  const { data: progress } = await supabase
    .from("student_progress")
    .select("requirement_id")
    .eq("student_id", student.id)
    .like("requirement_id", "prep-aida1-section-%");

  const completedSections = (progress || []).map(
    (p: { requirement_id: string }) => p.requirement_id.replace("prep-aida1-section-", "")
  );

  return <PrepContent studentEmail={student.email} initialCompleted={completedSections} />;
}
