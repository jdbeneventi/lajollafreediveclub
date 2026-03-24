"use client";

import { useState, useEffect, useCallback } from "react";

interface Conditions {
  waveHeight: string | null;
  wavePeriod: string | null;
  windSpeed: string | null;
  windDir: string | null;
  windGust: string | null;
  waterTemp: number | null;
}

export default function SaturdayAdmin() {
  const [secret, setSecret] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [conditions, setConditions] = useState<Conditions | null>(null);
  const [conditionsLoading, setConditionsLoading] = useState(false);
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [confirmType, setConfirmType] = useState<"go" | "nogo" | null>(null);

  const fetchConditions = useCallback(async () => {
    setConditionsLoading(true);
    try {
      const res = await fetch("/api/conditions");
      if (res.ok) {
        const data = await res.json();
        setConditions({
          waveHeight: data.waveHeight ? `${(data.waveHeight * 3.281).toFixed(1)}ft` : null,
          wavePeriod: data.wavePeriod ? `${data.wavePeriod.toFixed(0)}s` : null,
          windSpeed: data.windSpeed ?? null,
          windDir: data.windDirection ?? null,
          windGust: data.windGust ?? null,
          waterTemp: data.waterTemp ? Math.round(data.waterTemp) : null,
        });
      }
    } catch {
      // Conditions fetch failed silently
    }
    setConditionsLoading(false);
  }, []);

  useEffect(() => {
    if (authenticated) {
      fetchConditions();
    }
  }, [authenticated, fetchConditions]);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (secret.trim()) {
      setAuthenticated(true);
    }
  };

  const handleSend = async (type: "go" | "nogo") => {
    setConfirmType(null);
    setSending(true);
    setStatus(null);

    try {
      const res = await fetch("/api/saturday-blast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, note: note.trim() || undefined, secret }),
      });

      const data = await res.json();

      if (res.ok && data.status === "scheduled") {
        setStatus({
          type: "success",
          message: `${type === "go" ? "GO" : "NO-GO"} email scheduled. Broadcast ID: ${data.broadcast_id}`,
        });
      } else if (res.ok && !data.error) {
        setStatus({ type: "success", message: "Email sent (preview mode — no Kit configured)." });
      } else {
        setStatus({
          type: "error",
          message: data.error || data.message || "Something went wrong.",
        });
      }
    } catch (err) {
      setStatus({
        type: "error",
        message: err instanceof Error ? err.message : "Network error.",
      });
    }

    setSending(false);
  };

  // ─── Auth screen ───
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-deep flex items-center justify-center px-4">
        <form onSubmit={handleAuth} className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-2">
              La Jolla Freedive Club
            </div>
            <h1 className="text-2xl font-serif text-salt">Saturday Blast</h1>
            <p className="text-sm text-salt/50 mt-2">Admin access required</p>
          </div>
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="Enter secret"
            className="w-full px-4 py-3 bg-ocean/50 border border-teal/20 rounded-lg text-salt placeholder:text-salt/30 focus:outline-none focus:border-teal/50 mb-4"
          />
          <button
            type="submit"
            className="w-full py-3 bg-teal text-salt font-semibold rounded-lg hover:bg-teal/80 transition-colors"
          >
            Authenticate
          </button>
        </form>
      </div>
    );
  }

  // ─── Dashboard ───
  return (
    <div className="min-h-screen bg-deep px-4 py-8">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-2">
            La Jolla Freedive Club
          </div>
          <h1 className="text-2xl font-serif text-salt">Saturday Blast</h1>
          <p className="text-sm text-salt/50 mt-1">Send the weekly Saturday email</p>
        </div>

        {/* Conditions */}
        <div className="bg-ocean/30 border border-teal/15 rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase">
              Live Conditions
            </div>
            <button
              onClick={fetchConditions}
              disabled={conditionsLoading}
              className="text-xs text-teal/60 hover:text-teal transition-colors"
            >
              {conditionsLoading ? "Loading..." : "Refresh"}
            </button>
          </div>
          {conditions ? (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-salt/40 mb-1">Swell</div>
                <div className="text-sm text-salt font-medium">
                  {conditions.waveHeight || "—"} @ {conditions.wavePeriod || "—"}
                </div>
              </div>
              <div>
                <div className="text-xs text-salt/40 mb-1">Wind</div>
                <div className="text-sm text-salt font-medium">
                  {conditions.windSpeed || "—"} {conditions.windDir || ""}
                  {conditions.windGust ? ` (G ${conditions.windGust})` : ""}
                </div>
              </div>
              <div>
                <div className="text-xs text-salt/40 mb-1">Water Temp</div>
                <div className="text-sm text-salt font-medium">
                  {conditions.waterTemp ? `${conditions.waterTemp}\u00B0F` : "—"}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-salt/40">
              {conditionsLoading ? "Fetching conditions..." : "No data available"}
            </div>
          )}
        </div>

        {/* Note */}
        <div className="mb-6">
          <label className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase block mb-2">
            Custom Note (optional)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a personal note from Joshua..."
            rows={3}
            className="w-full px-4 py-3 bg-ocean/30 border border-teal/15 rounded-xl text-salt placeholder:text-salt/30 focus:outline-none focus:border-teal/40 resize-none text-sm"
          />
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => setConfirmType("go")}
            disabled={sending}
            className="py-4 bg-seafoam text-deep font-bold rounded-xl text-lg hover:bg-seafoam/80 transition-colors disabled:opacity-50"
          >
            Send GO
          </button>
          <button
            onClick={() => setConfirmType("nogo")}
            disabled={sending}
            className="py-4 bg-coral text-salt font-bold rounded-xl text-lg hover:bg-coral/80 transition-colors disabled:opacity-50"
          >
            Send NO-GO
          </button>
        </div>

        {/* Waiver Lookup */}
        <div className="bg-ocean/30 border border-teal/15 rounded-2xl p-5 mb-6">
          <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-3">
            Waiver Check
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              id="waiver-search"
              placeholder="Search by name..."
              className="flex-1 px-4 py-2.5 bg-ocean/30 border border-teal/15 rounded-lg text-salt placeholder:text-salt/30 focus:outline-none focus:border-teal/40 text-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const input = document.getElementById("waiver-search") as HTMLInputElement;
                  if (input.value.trim()) {
                    window.open(
                      `https://docs.google.com/spreadsheets/d/1B9-yB-kUS4qDrUFlyP_JrTvRxhFFDCVVx01RsV5GRyo/edit#gid=0&fvid=&q=${encodeURIComponent(input.value.trim())}`,
                      "_blank"
                    );
                  }
                }
              }}
            />
            <a
              href="https://docs.google.com/spreadsheets/d/1B9-yB-kUS4qDrUFlyP_JrTvRxhFFDCVVx01RsV5GRyo/edit"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-teal/20 text-teal text-xs font-medium rounded-lg hover:bg-teal/30 transition-colors flex items-center no-underline"
            >
              Open Sheet
            </a>
          </div>
          <p className="text-salt/25 text-[11px] mt-2">All signed waivers are logged automatically</p>
        </div>

        {/* Conditions Card */}
        <div className="flex justify-center mb-6">
          <a
            href="/api/conditions-card"
            target="_blank"
            className="text-xs text-teal/50 hover:text-teal underline underline-offset-2"
          >
            Download conditions card for IG Story
          </a>
        </div>

        {/* Preview links */}
        <div className="flex justify-center gap-6 mb-6">
          <a
            href="/api/saturday-blast?preview=true&type=go"
            target="_blank"
            className="text-xs text-teal/50 hover:text-teal underline underline-offset-2"
          >
            Preview GO email
          </a>
          <a
            href="/api/saturday-blast?preview=true&type=nogo"
            target="_blank"
            className="text-xs text-teal/50 hover:text-teal underline underline-offset-2"
          >
            Preview NO-GO email
          </a>
        </div>

        {/* Confirmation Dialog */}
        {confirmType && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
            <div className="bg-deep border border-teal/20 rounded-2xl p-6 max-w-sm w-full">
              <h2 className="text-lg font-serif text-salt mb-3">
                {confirmType === "go" ? "Send GO email?" : "Send NO-GO email?"}
              </h2>
              <p className="text-sm text-salt/60 mb-6 leading-relaxed">
                {confirmType === "go"
                  ? "This will send the Saturday GO blast with live conditions to all tagged subscribers."
                  : "This will notify all tagged subscribers that Saturday is called off."}
                {note.trim() ? ` Your note will be included.` : ""}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmType(null)}
                  className="flex-1 py-3 border border-teal/20 text-salt/60 rounded-xl hover:bg-ocean/20 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSend(confirmType)}
                  className={`flex-1 py-3 font-semibold rounded-xl transition-colors text-sm ${
                    confirmType === "go"
                      ? "bg-seafoam text-deep hover:bg-seafoam/80"
                      : "bg-coral text-salt hover:bg-coral/80"
                  }`}
                >
                  {confirmType === "go" ? "Confirm GO" : "Confirm NO-GO"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sending state */}
        {sending && (
          <div className="text-center py-4">
            <div className="text-sm text-salt/60">Sending blast...</div>
          </div>
        )}

        {/* Status */}
        {status && (
          <div
            className={`rounded-xl p-4 text-sm ${
              status.type === "success"
                ? "bg-seafoam/15 border border-seafoam/30 text-seafoam"
                : "bg-coral/15 border border-coral/30 text-coral"
            }`}
          >
            {status.message}
          </div>
        )}
      </div>
    </div>
  );
}
