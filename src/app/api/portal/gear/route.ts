import { NextRequest, NextResponse } from "next/server";
import { getStudent } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

// GET — fetch gear catalog + student's gear entries
export async function GET() {
  const student = await getStudent();
  if (!student) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [{ data: catalog }, { data: studentGear }] = await Promise.all([
    supabase
      .from("gear_catalog")
      .select("*")
      .eq("archived", false)
      .order("sort_order"),
    supabase
      .from("student_gear")
      .select("*")
      .eq("student_id", student.id),
  ]);

  return NextResponse.json({
    catalog: catalog || [],
    studentGear: studentGear || [],
  });
}

// POST — upsert a single gear entry for the student
export async function POST(req: NextRequest) {
  const student = await getStudent();
  if (!student) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { gear_id, status, brand, size, condition, notes } = body;

  if (!gear_id) {
    return NextResponse.json({ error: "gear_id required" }, { status: 400 });
  }

  const validStatuses = ["own", "need", "renting"];
  if (status && !validStatuses.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const validConditions = ["new", "good", "fair", "worn", null];
  if (condition !== undefined && !validConditions.includes(condition)) {
    return NextResponse.json({ error: "Invalid condition" }, { status: 400 });
  }

  // Verify gear_id exists in catalog
  const { data: gearItem } = await supabase
    .from("gear_catalog")
    .select("id")
    .eq("id", gear_id)
    .single();

  if (!gearItem) {
    return NextResponse.json({ error: "Gear item not found" }, { status: 404 });
  }

  const record = {
    student_id: student.id,
    gear_id,
    status: status || "need",
    brand: brand || null,
    size: size || null,
    condition: condition || null,
    notes: notes || null,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("student_gear")
    .upsert(record, { onConflict: "student_id,gear_id" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
