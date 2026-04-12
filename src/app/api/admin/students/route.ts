import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const SECRET = "ljfc";

export async function GET(req: NextRequest) {
  if (req.nextUrl.searchParams.get("key") !== SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch all students with their progress and certifications
  const [
    { data: students },
    { data: progress },
    { data: certs },
    { data: aidaForms },
    { data: waiverMembers },
    { data: bookings },
  ] = await Promise.all([
    supabase.from("students").select("id, email, first_name, last_name, last_login").order("last_login", { ascending: false, nullsFirst: false }),
    supabase.from("student_progress").select("student_id, requirement_id, cert_level, completed_at, completed_by"),
    supabase.from("student_certifications").select("student_id, cert_level, certified_at, aida_card_number"),
    supabase.from("aida_forms").select("email, form_type, signed_at"),
    supabase.from("saturday_members").select("email, waiver_signed"),
    supabase.from("bookings").select("email, course, payment_status, status"),
  ]);

  return NextResponse.json({
    students: students || [],
    progress: progress || [],
    certs: certs || [],
    aidaForms: aidaForms || [],
    waiverMembers: waiverMembers || [],
    bookings: bookings || [],
  });
}

// Mark requirements complete or grant certifications
export async function POST(req: NextRequest) {
  if (req.nextUrl.searchParams.get("key") !== SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { action } = body as { action: string };

  if (action === "toggle_requirement") {
    const { studentId, requirementId, certLevel, completed } = body as {
      studentId: string; requirementId: string; certLevel: string; completed: boolean;
    };

    if (completed) {
      // Remove
      await supabase
        .from("student_progress")
        .delete()
        .eq("student_id", studentId)
        .eq("requirement_id", requirementId);
    } else {
      // Add
      await supabase
        .from("student_progress")
        .upsert({
          student_id: studentId,
          requirement_id: requirementId,
          cert_level: certLevel,
          completed_at: new Date().toISOString(),
          completed_by: "instructor",
        }, { onConflict: "student_id,requirement_id" });
    }

    return NextResponse.json({ ok: true });
  }

  if (action === "grant_cert") {
    const { studentId, certLevel, cardNumber } = body as {
      studentId: string; certLevel: string; cardNumber?: string;
    };

    await supabase
      .from("student_certifications")
      .upsert({
        student_id: studentId,
        cert_level: certLevel,
        certified_at: new Date().toISOString(),
        aida_card_number: cardNumber || null,
      }, { onConflict: "student_id,cert_level" });

    return NextResponse.json({ ok: true });
  }

  if (action === "revoke_cert") {
    const { studentId, certLevel } = body as { studentId: string; certLevel: string };

    await supabase
      .from("student_certifications")
      .delete()
      .eq("student_id", studentId)
      .eq("cert_level", certLevel);

    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
