import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";
import { randomBytes } from "crypto";

export default async function VerifyPage({ searchParams }: { searchParams: { token?: string } }) {
  const { token } = searchParams;

  if (!token) {
    redirect("/portal?error=invalid");
  }

  // Look up token
  const { data: student } = await supabase
    .from("students")
    .select("*")
    .eq("magic_token", token)
    .single();

  if (!student) {
    redirect("/portal?error=invalid");
  }

  // Check expiry
  if (new Date(student.magic_token_expires) < new Date()) {
    redirect("/portal?error=expired");
  }

  // Create session token
  const sessionToken = randomBytes(32).toString("hex");

  await supabase
    .from("students")
    .update({
      magic_token: sessionToken,
      magic_token_expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      last_login: new Date().toISOString(),
    })
    .eq("id", student.id);

  // Set cookie
  const cookieStore = await cookies();
  cookieStore.set("ljfc_session", sessionToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  });

  redirect("/portal");
}
