import { NextResponse } from "next/server";

const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbxwslRAmNpm86dh7F8bKvSAo2T0fUs5A02KkkbEzi4SnFTOOR-5sdwPsTYW1Urddvqs/exec";

export async function GET() {
  try {
    const res = await fetch(GOOGLE_SHEET_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Vercel Test",
        email: "vercel@test.com",
        phone: "",
        dateSigned: new Date().toISOString(),
        emergencyContact: "Test",
        medicalFlags: "Clear",
      }),
      redirect: "follow",
    });

    const text = await res.text();
    return NextResponse.json({
      status: res.status,
      redirected: res.redirected,
      url: res.url,
      body: text.substring(0, 500),
    });
  } catch (err) {
    return NextResponse.json({
      error: err instanceof Error ? err.message : "Unknown error",
      stack: err instanceof Error ? err.stack : undefined,
    }, { status: 500 });
  }
}
