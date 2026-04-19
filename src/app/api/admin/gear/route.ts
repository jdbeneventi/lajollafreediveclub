import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const SECRET = "ljfc";

// GET — full gear catalog + all student gear entries
export async function GET(req: NextRequest) {
  if (req.nextUrl.searchParams.get("key") !== SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [{ data: catalog }, { data: studentGear }] = await Promise.all([
    supabase.from("gear_catalog").select("*").order("sort_order"),
    supabase.from("student_gear").select("*, students(email, first_name, last_name)"),
  ]);

  return NextResponse.json({
    catalog: catalog || [],
    studentGear: studentGear || [],
  });
}

// POST — add/update/archive gear catalog items
export async function POST(req: NextRequest) {
  if (req.nextUrl.searchParams.get("key") !== SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { action } = body;

  if (action === "add") {
    const { name, slug, category, description, rental_available, rental_note, course_levels, sort_order } = body;
    if (!name || !slug) {
      return NextResponse.json({ error: "name and slug required" }, { status: 400 });
    }
    const { error } = await supabase.from("gear_catalog").insert({
      name,
      slug,
      category: category || "essential",
      description: description || null,
      rental_available: rental_available || false,
      rental_note: rental_note || null,
      course_levels: course_levels || ["aida1", "aida2", "aida3", "aida4"],
      sort_order: sort_order || 99,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  if (action === "update") {
    const { id, ...updates } = body;
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    delete updates.action;
    updates.updated_at = new Date().toISOString();
    const { error } = await supabase.from("gear_catalog").update(updates).eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  if (action === "archive") {
    const { id } = body;
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    const { error } = await supabase.from("gear_catalog").update({ archived: true, updated_at: new Date().toISOString() }).eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
