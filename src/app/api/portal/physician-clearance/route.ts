import { NextRequest, NextResponse } from "next/server";
import { getStudent } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(req: NextRequest) {
  const student = await getStudent();
  if (!student) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (file.type !== "application/pdf") {
    return NextResponse.json({ error: "Only PDF files accepted" }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
  }

  // Upload to Supabase Storage
  const fileName = `${student.id}-${Date.now()}.pdf`;
  const { error: uploadError } = await supabase.storage
    .from("physician-clearances")
    .upload(fileName, file, {
      contentType: "application/pdf",
      upsert: true,
    });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from("physician-clearances")
    .getPublicUrl(fileName);

  // Update the most recent medical form with the file URL
  const { data: medicalForm } = await supabase
    .from("aida_forms")
    .select("id")
    .eq("email", student.email)
    .eq("form_type", "medical_statement")
    .order("signed_at", { ascending: false })
    .limit(1)
    .single();

  if (medicalForm) {
    await supabase
      .from("aida_forms")
      .update({ physician_clearance_file_url: urlData.publicUrl })
      .eq("id", medicalForm.id);
  }

  return NextResponse.json({ ok: true, url: urlData.publicUrl });
}
