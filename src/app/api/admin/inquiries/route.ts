import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const SECRET = "ljfc";

// ─── GET — list all inquiries with enrichment ─────────────────────────────
// Joins course_inquiries to bookings (by email) and student_onboarding (by email)
// so the pipeline UI can show paid/onboarded status per row.
//
// Query params:
//   ?key=ljfc                 (required)
//   ?status=new,replied       (optional, comma-separated filter)
//   ?archived=true|false      (default false — hide archived)
//   ?limit=100                (default 200)
export async function GET(req: NextRequest) {
  if (req.nextUrl.searchParams.get("key") !== SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const statusFilter = req.nextUrl.searchParams.get("status");
  const includeArchived = req.nextUrl.searchParams.get("archived") === "true";
  const limit = Number(req.nextUrl.searchParams.get("limit") || 200);

  let query = supabase
    .from("course_inquiries")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (!includeArchived) query = query.eq("archived", false);
  if (statusFilter) query = query.in("status", statusFilter.split(","));

  const { data: inquiries, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Enrich: pull bookings + onboarding completion in two batched queries
  const emails = Array.from(new Set((inquiries || []).map((i) => i.email).filter(Boolean)));
  if (emails.length === 0) {
    return NextResponse.json({ inquiries: [] });
  }

  const [{ data: bookings }, { data: onboarding }] = await Promise.all([
    supabase
      .from("bookings")
      .select("id, email, course, course_dates, status, payment_status, payment_amount, deposit_paid, created_at")
      .in("email", emails)
      .order("created_at", { ascending: false }),
    supabase
      .from("student_onboarding")
      .select("email, completed_at, updated_at")
      .in("email", emails),
  ]);

  const bookingsByEmail = new Map<string, typeof bookings>();
  for (const b of bookings || []) {
    if (!bookingsByEmail.has(b.email)) bookingsByEmail.set(b.email, []);
    bookingsByEmail.get(b.email)!.push(b);
  }
  const onboardingByEmail = new Map<string, typeof onboarding extends (infer T)[] | null ? T : never>();
  for (const o of onboarding || []) {
    if (o.email) onboardingByEmail.set(o.email, o);
  }

  const enriched = (inquiries || []).map((inq) => {
    const studentBookings = bookingsByEmail.get(inq.email) || [];
    const latestBooking = studentBookings[0] || null;
    const studentOnboarding = onboardingByEmail.get(inq.email) || null;
    return {
      ...inq,
      bookings: studentBookings,
      latest_booking: latestBooking,
      has_paid: studentBookings.some((b) => b.payment_status === "paid" || b.payment_status === "partial"),
      onboarding_completed_at: studentOnboarding?.completed_at || null,
      onboarding_updated_at: studentOnboarding?.updated_at || null,
    };
  });

  return NextResponse.json({ inquiries: enriched });
}

// ─── PATCH — update a single inquiry ──────────────────────────────────────
// Body: { id, status?, admin_notes?, parsed_start_date?, parsed_end_date?, archived?, linked_booking_id? }
export async function PATCH(req: NextRequest) {
  if (req.nextUrl.searchParams.get("key") !== SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { id, ...updates } = body;
  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  // Whitelist updatable fields
  const allowed: Record<string, unknown> = {};
  for (const key of [
    "status",
    "admin_notes",
    "parsed_start_date",
    "parsed_end_date",
    "archived",
    "linked_booking_id",
  ]) {
    if (key in updates) allowed[key] = updates[key];
  }

  if (Object.keys(allowed).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("course_inquiries")
    .update(allowed)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ inquiry: data });
}
