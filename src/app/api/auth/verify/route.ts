import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";
import { randomBytes } from "crypto";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/portal?error=invalid", request.url));
  }

  // Look up token
  const { data: student } = await supabase
    .from("students")
    .select("*")
    .eq("magic_token", token)
    .single();

  if (!student) {
    return NextResponse.redirect(new URL("/portal?error=invalid", request.url));
  }

  // Check expiry
  if (new Date(student.magic_token_expires) < new Date()) {
    return NextResponse.redirect(new URL("/portal?error=expired", request.url));
  }

  // Create session token
  const sessionToken = randomBytes(32).toString("hex");

  // Clear magic token, set last login
  await supabase
    .from("students")
    .update({
      magic_token: sessionToken, // reuse field as session token
      magic_token_expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      last_login: new Date().toISOString(),
    })
    .eq("id", student.id);

  // Set cookie
  const cookieStore = await cookies();
  cookieStore.set("ljfc_session", sessionToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: "/",
  });

  return NextResponse.redirect(new URL("/portal", request.url));
}
