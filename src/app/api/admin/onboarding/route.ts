import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const SECRET = "ljfc";

export async function GET(req: NextRequest) {
  if (req.nextUrl.searchParams.get("key") !== SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [{ data: onboarding }, { data: medicals }] = await Promise.all([
    supabase.from("student_onboarding").select("*").order("updated_at", { ascending: false }),
    supabase.from("aida_forms").select("email, form_type, physician_required, physician_cleared, physician_clearance_file_url, signed_at").eq("form_type", "medical_statement").order("signed_at", { ascending: false }),
  ]);

  return NextResponse.json({
    records: onboarding || [],
    medicals: medicals || [],
  });
}

export async function POST(req: NextRequest) {
  if (req.nextUrl.searchParams.get("key") !== SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { action, email, form_id } = await req.json();

  if (action === "clear_physician") {
    if (!form_id) {
      return NextResponse.json({ error: "form_id required" }, { status: 400 });
    }
    const { error } = await supabase
      .from("aida_forms")
      .update({ physician_cleared: true })
      .eq("id", form_id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  }

  if (action === "unclear_physician") {
    if (!form_id) {
      return NextResponse.json({ error: "form_id required" }, { status: 400 });
    }
    const { error } = await supabase
      .from("aida_forms")
      .update({ physician_cleared: false })
      .eq("id", form_id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: `Unknown action: ${action}, email: ${email}` }, { status: 400 });
}
