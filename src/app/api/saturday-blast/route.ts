import { NextResponse } from "next/server";

const KIT_API_SECRET = process.env.KIT_API_SECRET;
const KIT_API_KEY = process.env.KIT_API_KEY;
const SATURDAY_CREW_TAG_ID = "17781468";

interface ConditionsData {
  waveHeight?: string;
  wavePeriod?: string;
  windSpeed?: string;
  windDir?: string;
  windGust?: string;
  waterTemp?: number;
}

// ─── Fetch directly from NDBC 46254 realtime text file ───
async function fetchBuoyDirect(): Promise<Partial<ConditionsData>> {
  const data: Partial<ConditionsData> = {};
  try {
    const res = await fetch("https://www.ndbc.noaa.gov/data/realtime2/46254.txt", {
      headers: { "User-Agent": "LaJollaFreediveClub/1.0" },
    });
    if (!res.ok) return data;
    const text = await res.text();
    const lines = text.split("\n");
    if (lines.length < 3) return data;

    const headers = lines[0].trim().split(/\s+/);
    const values = lines[2].trim().split(/\s+/);

    const get = (col: string) => {
      const idx = headers.indexOf(col);
      if (idx === -1) return undefined;
      const val = values[idx];
      return val === "MM" || val === "99.00" || val === "999" || val === "9999.0" ? undefined : val;
    };

    const wvht = get("WVHT");
    if (wvht) {
      const meters = parseFloat(wvht);
      data.waveHeight = (meters * 3.281).toFixed(1) + "ft";
    }
    const dpd = get("DPD");
    if (dpd) data.wavePeriod = parseFloat(dpd).toFixed(0) + "s";

    const wtmp = get("WTMP");
    if (wtmp) {
      const c = parseFloat(wtmp);
      data.waterTemp = Math.round(c * 9 / 5 + 32);
    }
  } catch {}
  return data;
}

// ─── Fetch wind from LJPC1 RSS ───
async function fetchWindDirect(): Promise<Partial<ConditionsData>> {
  const data: Partial<ConditionsData> = {};
  try {
    const res = await fetch("https://www.ndbc.noaa.gov/data/latest_obs/ljpc1.rss", {
      headers: { "User-Agent": "LaJollaFreediveClub/1.0" },
    });
    if (!res.ok) return data;
    const xml = await res.text();

    const extract = (label: string) => {
      const re = new RegExp(`<strong>${label}:</strong>\\s*([^<]+)`, "i");
      const descs = xml.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/g);
      if (!descs || descs.length < 2) return undefined;
      const m = descs[1].match(re);
      return m ? m[1].trim() : undefined;
    };

    data.windSpeed = extract("Wind Speed");
    data.windDir = extract("Wind Direction");
    data.windGust = extract("Wind Gust");
  } catch {}
  return data;
}

// ─── Fetch tide predictions from NOAA for tomorrow (Saturday) ───
async function fetchTideNote(): Promise<string> {
  try {
    const tomorrow = new Date(Date.now() + 86400_000);
    const dateStr = tomorrow.toLocaleDateString("en-CA", { timeZone: "America/Los_Angeles" });
    const res = await fetch(
      `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?begin_date=${dateStr.replace(/-/g, "")}&range=24&station=9410230&product=predictions&datum=MLLW&time_zone=lst_ldt&interval=hilo&units=english&format=json`
    );
    if (!res.ok) return "Check tides page";
    const data = await res.json();
    if (!data.predictions || data.predictions.length === 0) return "Check tides page";

    return data.predictions
      .map((p: { t: string; v: string; type: string }) => {
        const time = p.t.split(" ")[1];
        const [h, m] = time.split(":").map(Number);
        const ampm = h >= 12 ? "PM" : "AM";
        const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
        const label = p.type === "H" ? "High" : "Low";
        return `${label} ${parseFloat(p.v).toFixed(1)}ft @ ${h12}:${m.toString().padStart(2, "0")} ${ampm}`;
      })
      .join(" · ");
  } catch {
    return "Check tides page";
  }
}

// ─── GO Email HTML ───
function buildGoEmailHtml(
  conditions: ConditionsData,
  tideNote: string,
  note?: string,
): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#FAF3EC;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="max-width:560px;margin:0 auto;padding:32px 20px;">

  <!-- Header -->
  <div style="text-align:center;margin-bottom:24px;">
    <div style="font-size:11px;color:#5a6a7a;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px;">La Jolla Freedive Club</div>
    <div style="font-size:11px;color:#5a6a7a;text-transform:uppercase;letter-spacing:1.5px;">Saturday Blast</div>
  </div>

  <!-- Hero -->
  <div style="background:#1B6B6B;border-radius:16px;padding:28px 24px;text-align:center;margin-bottom:16px;color:white;">
    <div style="font-size:28px;font-weight:bold;margin-bottom:8px;">We're on for tomorrow</div>
    <div style="font-size:16px;opacity:0.9;">Saturday at the Shores</div>
  </div>

  <!-- Conditions Snapshot -->
  <div style="background:white;border-radius:16px;padding:20px;margin-bottom:16px;">
    <div style="font-size:11px;color:#5a6a7a;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:12px;">Conditions Snapshot</div>
    <table style="width:100%;border-collapse:collapse;">
      <tr>
        <td style="padding:6px 0;font-size:12px;color:#5a6a7a;">Swell</td>
        <td style="padding:6px 0;font-size:13px;color:#0B1D2C;text-align:right;font-weight:500;">${conditions.waveHeight || "—"} @ ${conditions.wavePeriod || "—"}</td>
      </tr>
      <tr>
        <td style="padding:6px 0;font-size:12px;color:#5a6a7a;">Wind</td>
        <td style="padding:6px 0;font-size:13px;color:#0B1D2C;text-align:right;font-weight:500;">${conditions.windSpeed || "—"} ${conditions.windDir || ""}</td>
      </tr>
      <tr>
        <td style="padding:6px 0;font-size:12px;color:#5a6a7a;">Water temp</td>
        <td style="padding:6px 0;font-size:13px;color:#0B1D2C;text-align:right;font-weight:500;">${conditions.waterTemp ? conditions.waterTemp + "\u00B0F" : "—"}</td>
      </tr>
      <tr>
        <td style="padding:6px 0;font-size:12px;color:#5a6a7a;">Tides</td>
        <td style="padding:6px 0;font-size:13px;color:#0B1D2C;text-align:right;font-weight:500;">${tideNote}</td>
      </tr>
    </table>
  </div>

  <!-- Schedule -->
  <div style="background:white;border-radius:16px;padding:20px;margin-bottom:16px;">
    <div style="font-size:11px;color:#5a6a7a;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:12px;">Schedule</div>
    <table style="width:100%;border-collapse:collapse;">
      <tr>
        <td style="padding:8px 0;font-size:14px;font-weight:600;color:#1B6B6B;width:70px;">7:00 AM</td>
        <td style="padding:8px 0;font-size:14px;color:#0B1D2C;">Ocean Flow with Lena</td>
      </tr>
      <tr>
        <td style="padding:8px 0;font-size:14px;font-weight:600;color:#1B6B6B;">7:30 AM</td>
        <td style="padding:8px 0;font-size:14px;color:#0B1D2C;">ORIGIN Protocol</td>
      </tr>
      <tr>
        <td style="padding:8px 0;font-size:14px;font-weight:600;color:#1B6B6B;">8:30 AM</td>
        <td style="padding:8px 0;font-size:14px;color:#0B1D2C;">Group Dive</td>
      </tr>
    </table>
    <div style="margin-top:12px;padding-top:12px;border-top:1px solid rgba(11,29,44,0.06);font-size:12px;color:#1B6B6B;line-height:1.5;">
      Join for Ocean Flow + ORIGIN Protocol and line diving is free. Drop-in for diving only is $25.
    </div>
  </div>

  <!-- Meeting Spot -->
  <div style="background:#163B4E;border-radius:16px;padding:18px 20px;margin-bottom:16px;color:white;">
    <div style="font-size:11px;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:8px;opacity:0.7;">Meeting Spot</div>
    <div style="font-size:14px;font-weight:600;">Kellogg Park — near the picnic tables</div>
  </div>

  <!-- Parking Warning -->
  <div style="background:#C75B3A;border-radius:16px;padding:18px 20px;margin-bottom:16px;color:white;">
    <div style="font-size:13px;font-weight:700;margin-bottom:6px;">PARKING</div>
    <div style="font-size:13px;line-height:1.5;">Summer parking fills by 7:30am. Arrive early or park on Camino del Oro / Vallecitos.</div>
  </div>

  <!-- Gear Checklist -->
  <div style="background:white;border-radius:16px;padding:20px;margin-bottom:16px;">
    <div style="font-size:11px;color:#5a6a7a;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:12px;">Gear Checklist</div>
    <table style="width:100%;border-collapse:collapse;">
      <tr><td style="padding:4px 8px 4px 0;font-size:13px;color:#1B6B6B;">&#9744;</td><td style="padding:4px 0;font-size:13px;color:#0B1D2C;">Wetsuit</td></tr>
      <tr><td style="padding:4px 8px 4px 0;font-size:13px;color:#1B6B6B;">&#9744;</td><td style="padding:4px 0;font-size:13px;color:#0B1D2C;">Mask</td></tr>
      <tr><td style="padding:4px 8px 4px 0;font-size:13px;color:#1B6B6B;">&#9744;</td><td style="padding:4px 0;font-size:13px;color:#0B1D2C;">Snorkel</td></tr>
      <tr><td style="padding:4px 8px 4px 0;font-size:13px;color:#1B6B6B;">&#9744;</td><td style="padding:4px 0;font-size:13px;color:#0B1D2C;">Fins</td></tr>
      <tr><td style="padding:4px 8px 4px 0;font-size:13px;color:#1B6B6B;">&#9744;</td><td style="padding:4px 0;font-size:13px;color:#0B1D2C;">Weight belt</td></tr>
      <tr><td style="padding:4px 8px 4px 0;font-size:13px;color:#1B6B6B;">&#9744;</td><td style="padding:4px 0;font-size:13px;color:#0B1D2C;">Lanyard</td></tr>
      <tr><td style="padding:4px 8px 4px 0;font-size:13px;color:#1B6B6B;">&#9744;</td><td style="padding:4px 0;font-size:13px;color:#0B1D2C;">Dive computer <span style="font-size:11px;color:#5a6a7a;">(certified divers)</span></td></tr>
    </table>
  </div>

  <!-- Waiver Reminder -->
  <div style="background:#FAF3EC;border:2px solid #D4A574;border-radius:16px;padding:18px 20px;margin-bottom:16px;text-align:center;">
    <div style="font-size:13px;color:#0B1D2C;font-weight:600;margin-bottom:8px;">First time?</div>
    <div style="font-size:13px;color:#5a6a7a;margin-bottom:12px;">Sign your waiver before you show up.</div>
    <a href="https://lajollafreediveclub.com/waiver" style="display:inline-block;background:#1B6B6B;color:white;padding:10px 24px;border-radius:50px;text-decoration:none;font-weight:600;font-size:13px;">Sign Waiver</a>
  </div>

  <!-- Requirements -->
  <div style="background:white;border-radius:16px;padding:20px;margin-bottom:16px;">
    <div style="font-size:11px;color:#5a6a7a;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:12px;">Requirements</div>
    <div style="font-size:13px;color:#0B1D2C;line-height:1.8;">
      &bull; Valid freediving certification (any agency)<br>
      &bull; Own gear (wetsuit, fins, mask, snorkel, weight belt, lanyard)<br>
      &bull; Signed LJFC waiver
    </div>
  </div>

  ${note ? `
  <!-- Note from Joshua -->
  <div style="background:white;border-radius:16px;padding:20px;margin-bottom:16px;border-left:4px solid #3db8a4;">
    <div style="font-size:11px;color:#5a6a7a;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:8px;">Note from Joshua</div>
    <div style="font-size:14px;color:#0B1D2C;line-height:1.6;">${note}</div>
  </div>
  ` : ""}

  <!-- CTA -->
  <div style="text-align:center;margin-bottom:24px;">
    <a href="https://lajollafreediveclub.com/conditions" style="display:inline-block;background:#C75B3A;color:white;padding:12px 28px;border-radius:50px;text-decoration:none;font-weight:600;font-size:14px;">
      Full conditions dashboard &rarr;
    </a>
  </div>

  <!-- Footer -->
  <div style="text-align:center;font-size:11px;color:#5a6a7a;line-height:1.8;">
    <a href="https://lajollafreediveclub.com" style="color:#1B6B6B;text-decoration:none;">lajollafreediveclub.com</a><br>
    La Jolla Freedive Club &middot; San Diego, CA<br>
    AIDA Certified &middot; DAN Insured<br>
    <a href="{{ unsubscribe_url }}" style="color:#5a6a7a;">Unsubscribe</a>
  </div>

</div>
</body>
</html>`;
}

// ─── NO-GO Email HTML ───
function buildNogoEmailHtml(note?: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#FAF3EC;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="max-width:560px;margin:0 auto;padding:32px 20px;">

  <!-- Header -->
  <div style="text-align:center;margin-bottom:24px;">
    <div style="font-size:11px;color:#5a6a7a;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px;">La Jolla Freedive Club</div>
    <div style="font-size:11px;color:#5a6a7a;text-transform:uppercase;letter-spacing:1.5px;">Saturday Blast</div>
  </div>

  <!-- Hero -->
  <div style="background:#163B4E;border-radius:16px;padding:32px 24px;text-align:center;margin-bottom:16px;color:white;">
    <div style="font-size:24px;font-weight:bold;margin-bottom:10px;">Saturday session called off</div>
    <div style="font-size:14px;opacity:0.8;">Conditions aren't right or instructor unavailable this week.</div>
  </div>

  ${note ? `
  <!-- Note from Joshua -->
  <div style="background:white;border-radius:16px;padding:20px;margin-bottom:16px;border-left:4px solid #C75B3A;">
    <div style="font-size:11px;color:#5a6a7a;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:8px;">Note from Joshua</div>
    <div style="font-size:14px;color:#0B1D2C;line-height:1.6;">${note}</div>
  </div>
  ` : ""}

  <!-- See you next week -->
  <div style="background:white;border-radius:16px;padding:24px;text-align:center;margin-bottom:16px;">
    <div style="font-size:16px;color:#0B1D2C;font-weight:600;margin-bottom:8px;">See you next week.</div>
    <div style="font-size:13px;color:#5a6a7a;line-height:1.6;">Keep an eye on the conditions dashboard and your inbox for next Friday's update.</div>
    <div style="margin-top:16px;">
      <a href="https://lajollafreediveclub.com/conditions" style="display:inline-block;background:#1B6B6B;color:white;padding:10px 24px;border-radius:50px;text-decoration:none;font-weight:600;font-size:13px;">
        Check conditions &rarr;
      </a>
    </div>
  </div>

  <!-- Footer -->
  <div style="text-align:center;font-size:11px;color:#5a6a7a;line-height:1.8;">
    <a href="https://lajollafreediveclub.com" style="color:#1B6B6B;text-decoration:none;">lajollafreediveclub.com</a><br>
    La Jolla Freedive Club &middot; San Diego, CA<br>
    AIDA Certified &middot; DAN Insured<br>
    <a href="{{ unsubscribe_url }}" style="color:#5a6a7a;">Unsubscribe</a>
  </div>

</div>
</body>
</html>`;
}

// ─── Send broadcast via Kit ───
async function sendViaKit(subject: string, html: string): Promise<NextResponse> {
  const description = `Saturday blast — ${new Date().toLocaleDateString("en-US", { timeZone: "America/Los_Angeles", weekday: "short", month: "short", day: "numeric" })}`;

  // Try V4 first
  if (KIT_API_KEY) {
    const createRes = await fetch("https://api.kit.com/v4/broadcasts", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Kit-Api-Key": KIT_API_KEY },
      body: JSON.stringify({ subject, content: html, description }),
    });

    if (!createRes.ok) {
      const err = await createRes.text();
      return NextResponse.json({ status: "error", message: "Failed to create Kit broadcast (v4)", detail: err }, { status: 502 });
    }

    const createData = await createRes.json();
    const broadcastId = createData.broadcast?.id;

    if (!broadcastId) {
      return NextResponse.json({ status: "error", message: "No broadcast ID returned", detail: JSON.stringify(createData) }, { status: 502 });
    }

    // Set tag filter
    const filterRes = await fetch(`https://api.kit.com/v4/broadcasts/${broadcastId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "X-Kit-Api-Key": KIT_API_KEY },
      body: JSON.stringify({
        subscriber_filter: [{ all: [{ type: "tag", ids: [SATURDAY_CREW_TAG_ID] }] }],
      }),
    });

    if (!filterRes.ok) {
      const err = await filterRes.text();
      return NextResponse.json({ status: "error", message: "Failed to set tag filter", broadcast_id: broadcastId, detail: err }, { status: 502 });
    }

    // Schedule to send
    const sendAt = new Date(Date.now() + 60_000).toISOString();
    const updateRes = await fetch(`https://api.kit.com/v4/broadcasts/${broadcastId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "X-Kit-Api-Key": KIT_API_KEY },
      body: JSON.stringify({ public: true, send_at: sendAt }),
    });

    if (!updateRes.ok) {
      const err = await updateRes.text();
      return NextResponse.json({ status: "error", message: "Broadcast filtered but failed to schedule", broadcast_id: broadcastId, detail: err }, { status: 502 });
    }

    return NextResponse.json({ status: "scheduled", broadcast_id: broadcastId, send_at: sendAt, tag: "Saturday Crew" });
  }

  // Fallback to V3
  if (KIT_API_SECRET) {
    const createRes = await fetch("https://api.convertkit.com/v3/broadcasts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api_secret: KIT_API_SECRET, subject, content: html, description }),
    });

    if (!createRes.ok) {
      const err = await createRes.text();
      return NextResponse.json({ status: "error", message: "Failed to create Kit broadcast (v3)", detail: err }, { status: 502 });
    }

    const createData = await createRes.json();
    const broadcastId = createData.broadcast?.id;

    if (!broadcastId) {
      return NextResponse.json({ status: "error", message: "No broadcast ID returned", detail: JSON.stringify(createData) }, { status: 502 });
    }

    const sendAt = new Date(Date.now() + 60_000).toISOString();
    const updateRes = await fetch(`https://api.convertkit.com/v3/broadcasts/${broadcastId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api_secret: KIT_API_SECRET, published: true, send_at: sendAt }),
    });

    if (!updateRes.ok) {
      const err = await updateRes.text();
      return NextResponse.json({ status: "error", message: "Broadcast created but failed to schedule", broadcast_id: broadcastId, detail: err }, { status: 502 });
    }

    return NextResponse.json({ status: "scheduled", broadcast_id: broadcastId, send_at: sendAt });
  }

  // No Kit configured — return HTML
  return new NextResponse(html, { headers: { "Content-Type": "text/html" } });
}

// ─── GET handler (preview mode) ───
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const preview = searchParams.get("preview") === "true";
  const type = searchParams.get("type") || "go";

  if (!preview) {
    return NextResponse.json({ error: "Use ?preview=true&type=go or ?preview=true&type=nogo" }, { status: 400 });
  }

  try {
    if (type === "nogo") {
      const html = buildNogoEmailHtml("Example note: Big south swell rolling in, conditions unsafe for group diving. Stay dry and we'll regroup next Saturday.");
      return new NextResponse(html, { headers: { "Content-Type": "text/html" } });
    }

    // GO preview — fetch live conditions
    const [buoyData, windData, tideNote] = await Promise.all([
      fetchBuoyDirect(),
      fetchWindDirect(),
      fetchTideNote(),
    ]);

    const conditions: ConditionsData = { ...buoyData, ...windData };
    const html = buildGoEmailHtml(conditions, tideNote, "Example note: Visibility looking great this week. Expect leopard sharks near the canyon.");
    return new NextResponse(html, { headers: { "Content-Type": "text/html" } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to generate preview" }, { status: 500 });
  }
}

// ─── POST handler (send blast) ───
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, note, secret } = body as { type: string; note?: string; secret: string };

    // Validate secret
    const validSecret = secret === "ljfc-saturday-2026" || (process.env.CRON_SECRET && secret === process.env.CRON_SECRET);
    if (!validSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (type !== "go" && type !== "nogo") {
      return NextResponse.json({ error: "Invalid type. Use 'go' or 'nogo'." }, { status: 400 });
    }

    if (type === "nogo") {
      const html = buildNogoEmailHtml(note);
      const subject = "Saturday session called off this week";
      return sendViaKit(subject, html);
    }

    // GO — fetch live conditions
    const [buoyData, windData, tideNote] = await Promise.all([
      fetchBuoyDirect(),
      fetchWindDirect(),
      fetchTideNote(),
    ]);

    const conditions: ConditionsData = { ...buoyData, ...windData };
    const html = buildGoEmailHtml(conditions, tideNote, note);
    const subject = "We're on for tomorrow — Saturday at the Shores";
    return sendViaKit(subject, html);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to send blast" }, { status: 500 });
  }
}
