import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/adminAuth";
import { enrichInquiry, type EnrichResult } from "@/lib/extractInquiryFacts";

/**
 * /api/admin/inquiries/intel — backfill LLM extraction over existing rows.
 *
 * New inquiries are extracted at insert time (course-inquiry route, after())
 * and the daily digest sweeps a few stragglers per run. This endpoint is for
 * working through the backlog on demand, from a signed-in browser:
 *
 *   GET /api/admin/inquiries/intel          → status only (how many missing)
 *   GET /api/admin/inquiries/intel?run=8    → process up to 8, newest first
 *
 * Repeat the ?run call until `missing` hits 0. Batches are sequential and
 * capped at 10 so a run fits comfortably inside the function timeout.
 *
 * Auth: admin cookie / x-admin-key / ?key= — same gate as the rest of
 * /api/admin. Read-only against Anthropic; writes only the intel columns.
 */

// Sequential LLM calls need headroom beyond the default timeout.
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  // ai_facts IS NULL = not yet extracted. Errors here usually mean the
  // migration hasn't been run — say so instead of a bare 500.
  const { count: missing, error: countError } = await supabase
    .from("course_inquiries")
    .select("id", { count: "exact", head: true })
    .eq("archived", false)
    .is("ai_facts", null);

  if (countError) {
    const hint = /ai_facts/.test(countError.message)
      ? " — has supabase/inquiry-intel.sql been run in the SQL editor?"
      : "";
    return NextResponse.json(
      { error: countError.message + hint },
      { status: 500 },
    );
  }

  const runParam = req.nextUrl.searchParams.get("run");
  if (!runParam) {
    return NextResponse.json({
      missing: missing ?? 0,
      configured: Boolean(process.env.ANTHROPIC_API_KEY),
      hint: "add ?run=8 to process a batch",
    });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY not configured" },
      { status: 500 },
    );
  }

  const batchSize = Math.min(Math.max(Number(runParam) || 8, 1), 10);

  const { data: rows, error } = await supabase
    .from("course_inquiries")
    .select(
      "id, created_at, course, experience, preferred_dates, group_size, message, parsed_start_date, parsed_end_date",
    )
    .eq("archived", false)
    .is("ai_facts", null)
    .order("created_at", { ascending: false })
    .limit(batchSize);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const results: Array<{ id: string; result: EnrichResult }> = [];
  for (const row of rows || []) {
    results.push({ id: row.id, result: await enrichInquiry(row, "backfill") });
  }

  const enriched = results.filter((r) => r.result === "enriched").length;
  return NextResponse.json({
    processed: results.length,
    enriched,
    failed: results.length - enriched,
    missing: Math.max((missing ?? 0) - enriched, 0),
    results,
  });
}
