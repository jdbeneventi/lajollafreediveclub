import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { supabase } from "@/lib/supabase";

/**
 * /api/admin/roster — attach students to course events so seat counts and
 * course rosters compute themselves.
 *
 *   GET  → course events (past 14d → next 120d) with their rosters, plus
 *          active inquiries available to roster.
 *   POST { inquiryId, eventId }            → create the booking link
 *   POST { action: "unroster", bookingId } → remove a roster link (refuses
 *          to touch real Stripe-checkout bookings)
 *   POST { action: "complete", eventId }   → after a course runs, mark all
 *          rostered students' inquiries completed
 *
 * Seat counts everywhere (homepage strip, /programs, /calendar, digest,
 * Telegram) come from bookings linked by event_id — this endpoint is what
 * creates those links for students who confirm over email.
 */

export async function GET(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const today = new Date();
  const past = new Date(today.getTime() - 14 * 86_400_000)
    .toISOString()
    .slice(0, 10);
  const future = new Date(today.getTime() + 120 * 86_400_000)
    .toISOString()
    .slice(0, 10);

  const [{ data: events }, { data: bookings }, { data: inquiries }] =
    await Promise.all([
      supabase
        .from("calendar_events")
        .select("id, title, date, end_date, spots, category")
        .eq("active", true)
        .in("category", ["course", "camp"])
        .gte("date", past)
        .lte("date", future)
        .order("date", { ascending: true }),
      supabase
        .from("bookings")
        .select(
          "id, email, course, status, payment_status, event_id, stripe_session_id, created_at",
        )
        .not("event_id", "is", null),
      supabase
        .from("course_inquiries")
        .select("id, first_name, last_name, email, course, status, linked_booking_id")
        .eq("archived", false)
        .in("status", ["new", "replied", "quoted", "deposit_sent", "paid"]),
    ]);

  const byEvent = new Map<string, unknown[]>();
  for (const b of bookings || []) {
    if (b.status === "cancelled") continue;
    const inq = (inquiries || []).find(
      (i) =>
        i.linked_booking_id === b.id ||
        i.email.toLowerCase() === b.email.toLowerCase(),
    );
    const list = byEvent.get(b.event_id) || [];
    list.push({
      bookingId: b.id,
      email: b.email,
      name: inq ? `${inq.first_name} ${inq.last_name || ""}`.trim() : b.email,
      inquiryStatus: inq?.status || null,
      paymentStatus: b.payment_status,
      fromStripe: Boolean(b.stripe_session_id),
    });
    byEvent.set(b.event_id, list);
  }

  const rosteredEmails = new Set(
    (bookings || [])
      .filter((b) => b.status !== "cancelled")
      .map((b) => b.email.toLowerCase()),
  );

  return NextResponse.json({
    events: (events || []).map((e) => {
      const capMatch = String(e.spots || "").match(/\d+/);
      return {
        ...e,
        capacity: capMatch ? Number(capMatch[0]) : null,
        roster: byEvent.get(e.id) || [],
        past: (e.end_date || e.date) < today.toISOString().slice(0, 10),
      };
    }),
    available: (inquiries || [])
      .filter((i) => !rosteredEmails.has(i.email.toLowerCase()))
      .map((i) => ({
        id: i.id,
        name: `${i.first_name} ${i.last_name || ""}`.trim(),
        email: i.email,
        course: i.course,
        status: i.status,
      })),
  });
}

export async function POST(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }

  if (body.action === "unroster" && body.bookingId) {
    const { data: bk } = await supabase
      .from("bookings")
      .select("id, stripe_session_id")
      .eq("id", body.bookingId)
      .single();
    if (!bk) {
      return NextResponse.json({ error: "booking not found" }, { status: 404 });
    }
    if (bk.stripe_session_id) {
      return NextResponse.json(
        { error: "refusing to delete a Stripe-checkout booking" },
        { status: 400 },
      );
    }
    await supabase
      .from("course_inquiries")
      .update({ linked_booking_id: null })
      .eq("linked_booking_id", bk.id);
    await supabase.from("bookings").delete().eq("id", bk.id);
    return NextResponse.json({ ok: true, removed: bk.id });
  }

  if (body.action === "complete" && body.eventId) {
    const { data: ev } = await supabase
      .from("calendar_events")
      .select("id, title, date, end_date")
      .eq("id", body.eventId)
      .single();
    if (!ev) {
      return NextResponse.json({ error: "event not found" }, { status: 404 });
    }
    if ((ev.end_date || ev.date) > new Date().toISOString().slice(0, 10)) {
      return NextResponse.json(
        { error: "course hasn't run yet" },
        { status: 400 },
      );
    }
    const { data: evBookings } = await supabase
      .from("bookings")
      .select("id, email")
      .eq("event_id", ev.id)
      .neq("status", "cancelled");
    let completed = 0;
    for (const b of evBookings || []) {
      const { data: rows } = await supabase
        .from("course_inquiries")
        .update({ status: "completed" })
        .eq("archived", false)
        .not("status", "in", "(completed,declined,expired)")
        .or(`linked_booking_id.eq.${b.id},email.ilike.${b.email}`)
        .select("id");
      completed += rows?.length || 0;
    }
    return NextResponse.json({ ok: true, completed });
  }

  if (body.inquiryId && body.eventId) {
    const [{ data: inq }, { data: ev }] = await Promise.all([
      supabase
        .from("course_inquiries")
        .select("id, first_name, last_name, email, course, status, admin_notes")
        .eq("id", body.inquiryId)
        .single(),
      supabase
        .from("calendar_events")
        .select("id, title, date, end_date")
        .eq("id", body.eventId)
        .single(),
    ]);
    if (!inq || !ev) {
      return NextResponse.json(
        { error: "inquiry or event not found" },
        { status: 404 },
      );
    }
    const dates =
      ev.end_date && ev.end_date !== ev.date
        ? `${ev.date} – ${ev.end_date}`
        : ev.date;
    const { data: booking, error } = await supabase
      .from("bookings")
      .insert({
        email: inq.email,
        course: ev.title,
        course_dates: dates,
        status: "confirmed",
        payment_status: inq.status === "paid" ? "paid" : "unpaid",
        notes: `rostered from inquiry ${inq.id}`,
        event_id: ev.id,
      })
      .select("id")
      .single();
    if (error || !booking) {
      return NextResponse.json(
        { error: error?.message || "insert failed" },
        { status: 500 },
      );
    }
    const note = `rostered to ${ev.title} (${dates})`;
    await supabase
      .from("course_inquiries")
      .update({
        linked_booking_id: booking.id,
        admin_notes: inq.admin_notes ? `${inq.admin_notes} | ${note}` : note,
      })
      .eq("id", inq.id);
    return NextResponse.json({ ok: true, bookingId: booking.id });
  }

  return NextResponse.json(
    { error: "expected {inquiryId,eventId} or an action" },
    { status: 400 },
  );
}
