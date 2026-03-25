import { NextResponse } from "next/server";

const STUDENTS_SHEET_URL = "https://script.google.com/macros/s/AKfycbxcEO1X0gVKrXUw44PbDf7KTskmJ3e1RE9M8Y1SBPo9zbftDX6NSbDRoXUJtZFNbtNb/exec";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const student = searchParams.get("student") || "";

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
    const res = await fetch(STUDENTS_SHEET_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      redirect: "follow",
    });
    const text = await res.text();
    return NextResponse.json({ status: "ok", response: text.substring(0, 200) });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to post" },
      { status: 500 }
    );
  }
}
