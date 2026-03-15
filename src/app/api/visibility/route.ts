import { NextResponse } from "next/server";

const VISIBILITY_PROMPT = `You are analyzing an underwater camera image from Scripps Pier in La Jolla, CA to estimate underwater visibility for freedivers.

The camera is mounted on a pier piling at approximately 13 feet (4 meters) depth. There are reference pilings at known distances:
- Nearest piling: ~4 feet from camera (right side of frame)
- Middle pilings: ~11 feet and ~14 feet from camera
- Far piling: ~30 feet from camera (left/back of frame)

Analyze the image and determine:

1. VISIBILITY ESTIMATE: Based on which pilings are visible and how sharp/clear they appear:
   - If only the 4ft piling is visible: 4-6ft visibility
   - If 4ft is clear and 11ft is hazy: 8-12ft visibility  
   - If 4ft and 11ft are clear, 14ft is hazy: 12-18ft visibility
   - If all pilings including 14ft are clear, 30ft is hazy: 18-25ft visibility
   - If 30ft back piling is clearly visible: 25-35ft+ visibility

2. WATER COLOR: Describe the color (blue, green, blue-green, murky green, brown, etc.)

3. PARTICULATES: Are there visible particles, sediment, or plankton in the water?

4. MARINE LIFE: Note any visible fish, sharks, rays, or other marine life.

5. OVERALL GRADE on this scale:
   - A+: 30ft+, crystal blue, exceptional
   - A: 25-30ft, blue/blue-green, excellent
   - B+: 20-25ft, good clarity, very good
   - B: 15-20ft, decent clarity, good
   - B-: 12-15ft, moderate clarity, acceptable  
   - C+: 10-12ft, somewhat hazy, fair
   - C: 8-10ft, hazy, below average
   - C-: 6-8ft, quite hazy, poor
   - D: 4-6ft, very hazy, bad
   - F: <4ft, nearly zero vis, terrible

Respond ONLY in this exact JSON format with no other text:
{
  "visibility_ft_low": 10,
  "visibility_ft_high": 15,
  "grade": "B-",
  "water_color": "blue-green with slight haze",
  "particulates": "moderate suspended particles visible",
  "marine_life": "no marine life visible in frame",
  "summary": "One sentence natural language summary of conditions",
  "confidence": "high"
}

If the image is not an underwater camera view, is black/unavailable, or you cannot determine visibility, respond with:
{
  "visibility_ft_low": null,
  "visibility_ft_high": null,
  "grade": "N/A",
  "water_color": "unknown",
  "particulates": "unknown",
  "marine_life": "unknown",
  "summary": "Camera feed unavailable or unreadable",
  "confidence": "none"
}`;

// Capture a screenshot of the underwater pier cam
async function captureUnderwaterCam(): Promise<string | null> {
  try {
    // The pier cam live stream page - we'll try to get a still frame
    // Option 1: Try the direct stream snapshot endpoint
    const snapshotUrls = [
      "https://coollab.ucsd.edu/pierviz/snapshot.jpg",
      "https://coollab.ucsd.edu/pierviz/latest.jpg",
    ];

    for (const url of snapshotUrls) {
      try {
        const res = await fetch(url, {
          headers: { "User-Agent": "LaJollaFreediveClub/1.0" },
          signal: AbortSignal.timeout(5000),
        });
        if (res.ok) {
          const buffer = await res.arrayBuffer();
          return Buffer.from(buffer).toString("base64");
        }
      } catch {
        continue;
      }
    }

    return null;
  } catch {
    return null;
  }
}

// Analyze the image with Claude Vision
async function analyzeVisibility(imageBase64: string) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY || "",
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
              source: {
                type: "base64",
                media_type: "image/jpeg",
                data: imageBase64,
              },
            },
            {
              type: "text",
              text: VISIBILITY_PROMPT,
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.status}`);
  }

  const data = await response.json();
  const text = data.content?.[0]?.text || "";

  try {
    // Strip any markdown code fences
    const clean = text.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    // Check for cached result (cache for 30 minutes)
    const cacheKey = `vis-${new Date().toISOString().slice(0, 13)}-${Math.floor(new Date().getMinutes() / 30)}`;

    // Try to capture the underwater cam
    const imageBase64 = await captureUnderwaterCam();

    if (!imageBase64) {
      return NextResponse.json(
        {
          visibility_ft_low: null,
          visibility_ft_high: null,
          grade: "N/A",
          summary: "Underwater camera feed currently unavailable. Check the live cam directly.",
          cam_url: "https://coollab.ucsd.edu/pierviz/",
          updated: new Date().toISOString(),
          source: "scripps_piercam",
          method: "ai_vision",
        },
        {
          headers: {
            "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800",
          },
        }
      );
    }

    // Analyze with Claude Vision
    const analysis = await analyzeVisibility(imageBase64);

    if (!analysis) {
      return NextResponse.json(
        {
          visibility_ft_low: null,
          visibility_ft_high: null,
          grade: "N/A",
          summary: "Unable to analyze camera feed at this time.",
          cam_url: "https://coollab.ucsd.edu/pierviz/",
          updated: new Date().toISOString(),
          source: "scripps_piercam",
          method: "ai_vision",
        },
        {
          headers: {
            "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
          },
        }
      );
    }

    return NextResponse.json(
      {
        ...analysis,
        cam_url: "https://coollab.ucsd.edu/pierviz/",
        updated: new Date().toISOString(),
        source: "scripps_piercam",
        method: "ai_vision",
        cache_key: cacheKey,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
        },
      }
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
