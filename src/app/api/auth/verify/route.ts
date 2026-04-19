import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { isOnboardingComplete } from "@/lib/auth";
import { randomBytes } from "crypto";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/portal?error=invalid", req.url));
  }

  // Look up token
  const { data: student } = await supabase
    .from("students")
    .select("*")
    .eq("magic_token", token)
    .single();

  if (!student) {
    return NextResponse.redirect(new URL("/portal?error=invalid", req.url));
  }

  // Check expiry
  if (new Date(student.magic_token_expires) < new Date()) {
    return NextResponse.redirect(new URL("/portal?error=expired", req.url));
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

  // Check if onboarding is complete — redirect accordingly
  const complete = await isOnboardingComplete(student.id, student.email);
  const destination = complete ? "/portal" : "/portal/onboarding";

  const response = NextResponse.redirect(new URL(destination, req.url));
  response.cookies.set("ljfc_session", sessionToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  });

  return response;
}
