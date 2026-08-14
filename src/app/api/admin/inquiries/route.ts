import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { parseDateRange } from "@/lib/parseDateRange";
import { requireAdmin } from "@/lib/adminAuth";


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
  const denied = requireAdmin(req);
  if (denied) return denied;

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

  // Lazily fill parsed_start_date / parsed_end_date for any rows that have a
  // preferred_dates string but no parsed range yet. Cheap, and means the
  // conflict detector has data immediately without a separate backfill job.
  const toPersist: Array<{ id: string; start: string; end: string }> = [];
  for (const inq of inquiries || []) {
    if (inq.parsed_start_date && inq.parsed_end_date) continue;
    if (!inq.preferred_dates) continue;
    const range = parseDateRange(inq.preferred_dates);
    if (range) {
      inq.parsed_start_date = range.start.toISOString().slice(0, 10);
      inq.parsed_end_date = range.end.toISOString().slice(0, 10);
      toPersist.push({ id: inq.id, start: inq.parsed_start_date, end: inq.parsed_end_date });
    }
  }
  // Fire-and-forget persistence — don't block the response
  if (toPersist.length > 0) {
    Promise.all(
      toPersist.map((p) =>
        supabase
          .from("course_inquiries")
          .update({ parsed_start_date: p.start, parsed_end_date: p.end })
          .eq("id", p.id),
      ),
    ).catch(() => {});
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

// ─── POST — manually add an inquiry ───────────────────────────────────────
// Body: { first_name, email, course, last_name?, phone?, experience?,
//         preferred_dates?, group_size?, message?, status? }
export async function POST(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const body = await req.json();
  const { first_name, email, course } = body;
  if (!first_name || !email || !course) {
    return NextResponse.json({ error: "first_name, email, and course are required" }, { status: 400 });
  }

  const row: Record<string, unknown> = {
    first_name,
    email: email.toLowerCase(),
    course,
    last_name: body.last_name || "",
    phone: body.phone || null,
    experience: body.experience || null,
    preferred_dates: body.preferred_dates || null,
    group_size: body.group_size || null,
    message: body.message || null,
    status: body.status || "new",
    admin_notes: body.admin_notes || null,
  };

  if (body.preferred_dates) {
    const range = parseDateRange(body.preferred_dates);
    if (range) {
      row.parsed_start_date = range.start.toISOString().slice(0, 10);
      row.parsed_end_date = range.end.toISOString().slice(0, 10);
    }
  }

  const { data, error } = await supabase
    .from("course_inquiries")
    .insert(row)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ inquiry: data }, { status: 201 });
}

// ─── PATCH — update a single inquiry ──────────────────────────────────────
// Body: { id, status?, admin_notes?, parsed_start_date?, parsed_end_date?, archived?, linked_booking_id? }
export async function PATCH(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

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
