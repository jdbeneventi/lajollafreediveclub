import { NextResponse } from "next/server";
import { isAdmin, unauthorized } from "@/lib/adminAuth";

const STUDENTS_SHEET_URL = "https://script.google.com/macros/s/AKfycbxcEO1X0gVKrXUw44PbDf7KTskmJ3e1RE9M8Y1SBPo9zbftDX6NSbDRoXUJtZFNbtNb/exec";
const FORMSPREE_URL = "https://formspree.io/f/mojknqlk";

/**
 * Coach portal backend — proxies the student dive-log Google Sheet.
 *
 * This route previously had NO authentication of any kind: GET with no
 * parameters returned every student's logs to anyone who asked, and POST let
 * anyone write entries. The Apps Script URL below is server-side only and does
 * not reach the browser bundle, so gating here is the real boundary.
 *
 * Two access levels, matching the two roles the /students page offers:
 *
 *   coach    every student's logs. Requires ADMIN_KEY (same credential as the
 *            rest of the admin surface — no separate coach code).
 *   student  one student's own logs, via ?student=<name>. Requires the
 *            STUDENT_CODE env var, sent as the x-student-code header.
 *
 * Both fail closed. A shared student code is weak by design — it is what the
 * page already did — but it now lives in an env var instead of the JS bundle,
 * and it no longer unlocks everyone's logs at once.
 */
function studentCodeOk(req: Request): boolean {
  const expected = process.env.STUDENT_CODE;
  if (!expected) return false; // fail closed
  const provided = req.headers.get("x-student-code") || "";
  return provided.toLowerCase().trim() === expected.toLowerCase().trim();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const student = searchParams.get("student") || "";

  // No student parameter means "give me everything" — coach only.
  if (!student) {
    if (!isAdmin(request)) return unauthorized();
  } else if (!isAdmin(request) && !studentCodeOk(request)) {
    return unauthorized();
  }

  try {
    const url = student
      ? `${STUDENTS_SHEET_URL}?student=${encodeURIComponent(student)}`
      : STUDENTS_SHEET_URL;
    const res = await fetch(url, { redirect: "follow" });
    const text = await res.text();

    try {
      const data = JSON.parse(text);
      return NextResponse.json(data);
    } catch {
      return NextResponse.json({ error: "Invalid response", raw: text.substring(0, 200) }, { status: 500 });
    }
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Writing as the coach is an admin action; a student writing their own log
    // needs the student code. Anonymous writes are rejected either way.
    const asCoach = body.author === "Coach";
    if (asCoach) {
      if (!isAdmin(request)) return unauthorized();
    } else if (!isAdmin(request) && !studentCodeOk(request)) {
      return unauthorized();
    }

    // Save to sheet
    const res = await fetch(STUDENTS_SHEET_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      redirect: "follow",
    });
    const text = await res.text();

    // Notify coach when a student submits (not when coach submits)
    if (body.author && body.author !== "Coach") {
      try {
        await fetch(FORMSPREE_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            _form_type: "student_log",
            _subject: `Student Log: ${body.student} — ${body.type}`,
            student: body.student,
            type: body.type,
            date: body.date,
            note: body.note?.substring(0, 500) || "",
            depth: body.depth || "",
            time: body.time || "",
            bolt: body.bolt || "",
          }),
        });
      } catch {
        // Notification is non-critical
      }
    }

    return NextResponse.json({ status: "ok", response: text.substring(0, 200) });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to post" },
      { status: 500 }
    );
  }
}
