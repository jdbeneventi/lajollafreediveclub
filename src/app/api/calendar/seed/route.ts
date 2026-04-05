import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { events } from "@/lib/calendar";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  if (secret !== "ljfc" && secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = events.map(e => ({
    title: e.title,
    category: e.category,
    date: e.recurring ? "2026-01-01" : e.date, // recurring events get a placeholder date
    end_date: e.endDate || null,
    time: e.time || null,
    description: e.description || null,
    price: e.price || null,
    spots: e.spots || null,
    href: e.href || null,
    recurring: e.recurring || null,
    guest_org: e.guestOrg || null,
    seasonal: e.seasonal || false,
  }));

  const { error } = await supabase
    .from("calendar_events")
    .insert(rows);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, count: rows.length });
}
