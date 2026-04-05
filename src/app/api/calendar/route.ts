import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET: public endpoint — returns active events
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("calendar_events")
      .select("*")
      .eq("active", true)
      .order("date", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ events: data || [] });
  } catch {
    return NextResponse.json({ events: [] });
  }
}

// POST: admin endpoint — create/update/delete events
export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  const validSecret =
    secret === "ljfc" ||
    (process.env.CRON_SECRET && secret === process.env.CRON_SECRET);

  if (!validSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action } = body;

    if (action === "create") {
      const { data, error } = await supabase
        .from("calendar_events")
        .insert({
          title: body.title,
          category: body.category || "course",
          date: body.date,
          end_date: body.end_date || null,
          time: body.time || null,
          description: body.description || null,
          price: body.price || null,
          spots: body.spots || null,
          href: body.href || null,
          recurring: body.recurring || null,
          guest_org: body.guest_org || null,
          seasonal: body.seasonal || false,
        })
        .select()
        .single();

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ event: data });
    }

    if (action === "update") {
      const { id, ...updates } = body;
      delete updates.action;
      updates.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from("calendar_events")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ event: data });
    }

    if (action === "delete") {
      const { error } = await supabase
        .from("calendar_events")
        .delete()
        .eq("id", body.id);

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true });
    }

    if (action === "seed") {
      // One-time seed from existing calendar data
      const { events } = body;
      const { error } = await supabase
        .from("calendar_events")
        .insert(events);

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true, count: events.length });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed" },
      { status: 500 }
    );
  }
}
