import { NextResponse } from "next/server";

// Possible thumbnail URLs for the Scripps Pier underwater camera
// HDOnTap uses Wowza streaming with auto-updating thumbnails
const SNAPSHOT_URLS = [
  // HDOnTap Wowza thumbnail (auto-updates every few seconds)
  "https://storage.hdontap.com/wowza_stream_thumbnails/snapshot_hosb1_scripps_underwater-cam.stream.jpg",
  // Alternate naming patterns
  "https://storage.hdontap.com/wowza_stream_thumbnails/snapshot_hosb1_scripps_underwater.stream.jpg",
  "https://storage.hdontap.com/wowza_stream_thumbnails/snapshot_018408.jpg",
];

const VISION_PROMPT = `You are analyzing an underwater camera image from Scripps Pier in La Jolla, CA to estimate underwater visibility for freedivers.

The camera is mounted on a pier piling at approximately 4 meters (13 feet) depth. There are reference pilings at known distances:
- Nearest piling (right side): ~1.2m (4 ft) from camera
- Right back piling: ~3.4m (11 ft) from camera
- Back left piling: ~4.3m (14 ft) from camera — only visible when water is calm and clear
- Far left piling: ~9m (30 ft) from camera — rarely visible, only in exceptional conditions

Analyze the image and determine:

1. VISIBILITY ESTIMATE based on which pilings are visible and how sharp they appear:
   - Only nearest (4ft) piling visible: 4-6ft visibility
   - 4ft clear, 11ft piling hazy: 8-12ft visibility
   - 4ft and 11ft clear, 14ft hazy: 12-18ft visibility
   - All pilings to 14ft clear, can see toward 30ft: 18-25ft visibility
   - 30ft piling clearly visible: 25-35ft+ visibility

2. WATER COLOR (blue, green, blue-green, murky green, brown, dark)

3. PARTICULATES (heavy particles/sediment, moderate, light, minimal)

4. MARINE LIFE visible (fish, lobsters, rays, sharks, etc.)

5. OVERALL GRADE:
   A+: 30ft+, crystal blue | A: 25-30ft, excellent | B+: 20-25ft, very good
   B: 15-20ft, good | B-: 12-15ft, acceptable | C+: 10-12ft, fair
   C: 8-10ft, below average | C-: 6-8ft, poor | D: 4-6ft, bad | F: <4ft, terrible

If the image is dark/black (nighttime), heavily obscured, or not an underwater view, note that.

Respond ONLY in this exact JSON format:
{
  "visibility_ft_low": 10,
  "visibility_ft_high": 15,
  "grade": "B-",
  "water_color": "blue-green with slight haze",
  "particulates": "moderate suspended particles",
  "marine_life": "school of smelt visible near pilings",
  "summary": "One sentence natural language summary",
  "confidence": "high",
  "is_dark": false
}`;

async function captureSnapshot(): Promise<{ base64: string; sourceUrl: string } | null> {
  for (const url of SNAPSHOT_URLS) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; LaJollaFreediveClub/1.0)" },
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) continue;

      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("image")) continue;

      const buffer = await res.arrayBuffer();
      if (buffer.byteLength < 1000) continue; // Too small to be a real image

      const base64 = Buffer.from(buffer).toString("base64");
      return { base64, sourceUrl: url };
    } catch {
      continue;
    }
  }
  return null;
}

async function analyzeWithVision(imageBase64: string): Promise<Record<string, unknown> | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 500,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: { type: "base64", media_type: "image/jpeg", data: imageBase64 },
              },
              { type: "text", text: VISION_PROMPT },
            ],
          },
        ],
      }),
    });

    if (!response.ok) return null;
    const data = await response.json();
    const text = data.content?.[0]?.text || "";
    const clean = text.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const snapshot = await captureSnapshot();

    if (!snapshot) {
      return NextResponse.json(
        {
          visibility_ft_low: null,
          visibility_ft_high: null,
          grade: "N/A",
          summary: "Underwater camera snapshot unavailable. Check the live cam directly.",
          cam_url: "https://coollab.ucsd.edu/pierviz/",
          source_url: null,
          method: "ai_vision",
          updated: new Date().toISOString(),
        },
        { headers: { "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800" } }
      );
    }

    const analysis = await analyzeWithVision(snapshot.base64);

    if (!analysis) {
      return NextResponse.json(
        {
          visibility_ft_low: null,
          visibility_ft_high: null,
          grade: "N/A",
          summary: "Unable to analyze camera feed. API key may not be configured.",
          cam_url: "https://coollab.ucsd.edu/pierviz/",
          source_url: snapshot.sourceUrl,
          method: "ai_vision",
          updated: new Date().toISOString(),
        },
        { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } }
      );
    }

    // If the camera shows nighttime / dark image
    if (analysis.is_dark) {
      return NextResponse.json(
        {
          visibility_ft_low: null,
          visibility_ft_high: null,
          grade: "N/A",
          summary: "Camera feed is dark — check back after sunrise for visibility analysis.",
          water_color: "dark",
          cam_url: "https://coollab.ucsd.edu/pierviz/",
          source_url: snapshot.sourceUrl,
          method: "ai_vision",
          is_dark: true,
          updated: new Date().toISOString(),
        },
        { headers: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600" } }
      );
    }

    return NextResponse.json(
      {
        ...analysis,
        cam_url: "https://coollab.ucsd.edu/pierviz/",
        source_url: snapshot.sourceUrl,
        method: "ai_vision",
        updated: new Date().toISOString(),
      },
      { headers: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600" } }
    );
  } catch (error) {
    return NextResponse.json(
      {
        visibility_ft_low: null,
        visibility_ft_high: null,
        grade: "N/A",
        summary: "Visibility analysis temporarily unavailable.",
        error: error instanceof Error ? error.message : "Unknown error",
        cam_url: "https://coollab.ucsd.edu/pierviz/",
        updated: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
