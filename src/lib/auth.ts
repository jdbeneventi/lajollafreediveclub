import { cookies } from "next/headers";
import { supabase } from "./supabase";

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
