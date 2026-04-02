import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getNextSaturday } from "@/lib/saturday";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  const validSecret =
    secret === "ljfc-saturday-2026" ||
    secret === "ljfc" ||
    (process.env.CRON_SECRET && secret === process.env.CRON_SECRET);

  if (!validSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const saturdayDate = getNextSaturday();

  try {
    // This week's RSVPs with member info
    const { data: rsvps } = await supabase
      .from("saturday_rsvps")
      .select("*, member:saturday_members(id, first_name, last_name, waiver_signed, cert_level)")
      .eq("saturday_date", saturdayDate)
      .order("created_at", { ascending: false });

    // This week's confirmations
    const { data: confirmations } = await supabase
      .from("saturday_confirmations")
      .select("*")
      .eq("saturday_date", saturdayDate)
      .order("created_at", { ascending: false });

    // All members
    const { data: members } = await supabase
      .from("saturday_members")
      .select("*")
      .order("created_at", { ascending: false });

    const rsvpList = rsvps || [];
    const confirmList = confirmations || [];
    const memberList = members || [];

    const stats = {
      registered: rsvpList.length,
      confirmed: confirmList.length,
      diving_registered: rsvpList.filter(r => r.line_diving).length,
      beach_registered: rsvpList.filter(r => !r.line_diving).length,
      diving_confirmed: confirmList.filter(c => c.line_diving).length,
      beach_confirmed: confirmList.filter(c => !c.line_diving).length,
      total_members: memberList.length,
      waivers_signed: memberList.filter(m => m.waiver_signed).length,
      waivers_unsigned: memberList.filter(m => !m.waiver_signed).length,
      // RSVPs this week missing waiver
      rsvps_without_waiver: rsvpList.filter(r => r.member && !r.member.waiver_signed).length,
    };

    return NextResponse.json({
      saturday_date: saturdayDate,
      rsvps: rsvpList,
      confirmations: confirmList,
      members: memberList,
      stats,
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Failed to load dashboard data",
    }, { status: 500 });
  }
}
