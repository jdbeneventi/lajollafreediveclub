import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      "https://www.ndbc.noaa.gov/data/latest_obs/ljpc1.rss",
      {
        next: { revalidate: 900 }, // Cache for 15 minutes
        headers: {
          "User-Agent": "LaJollaFreediveClub/1.0 (conditions page)",
        },
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch buoy data" },
        { status: 502 }
      );
    }

    const xml = await res.text();
    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch buoy data" },
      { status: 502 }
    );
  }
}
