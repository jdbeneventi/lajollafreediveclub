"use client";

import { useState, useMemo, useEffect } from "react";

// ─── CONSTANTS ─────────────────────────────────────────────────────

const SECRET = "ljfc";

interface SessionConfig {
  label: string;
  price: number;
  unit: string;
  defaultHours: number;
}

const SESSION_TYPES: Record<string, SessionConfig> = {
  "5-day-full-week": {
    label: "5-Day Full Week",
    price: 750,
    unit: "per student",
    defaultHours: 22.5,
  },
  "3-day-immersion": {
    label: "3-Day Immersion",
    price: 450,
    unit: "per student",
    defaultHours: 13.5,
  },
  "1-day-field-trip": {
    label: "1-Day Field Trip",
    price: 50,
    unit: "per student",
    defaultHours: 3.5,
  },
  "ocean-explorers-monthly": {
    label: "Ocean Explorers Monthly",
    price: 30,
    unit: "per student",
    defaultHours: 3,
  },
  "canyon-crew-monthly": {
    label: "Canyon Crew Monthly",
    price: 40,
    unit: "per student",
    defaultHours: 3,
  },
  "semester-explorers": {
    label: "Semester Bundle (Explorers)",
    price: 160,
    unit: "per student",
    defaultHours: 24,
  },
  "semester-canyon": {
    label: "Semester Bundle (Canyon)",
    price: 220,
    unit: "per student",
    defaultHours: 24,
  },
};

interface StaffMember {
  id: string;
  role: string;
  rate: number;
  hours: number;
  enabled: boolean;
  isOwner?: boolean;
}

// ─── HELPERS ───────────────────────────────────────────────────────

function fmt(n: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function fmtDollar(n: number): string {
  return "$" + fmt(Math.round(n));
}

function fmtPct(n: number): string {
  return (n * 100).toFixed(1) + "%";
}

// ─── COMPONENTS ────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="bg-white/[0.04] border border-white/10 rounded-xl p-4 text-center">
      <div
        className="text-2xl md:text-3xl font-serif"
        style={{ color: accent || "#FAF3EC" }}
      >
        {value}
      </div>
      <div className="text-[10px] text-white/40 uppercase tracking-wider mt-1">
        {label}
      </div>
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  prefix,
  suffix,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase">
          {label}
        </label>
        <span className="text-white font-serif text-lg">
          {prefix}
          {value}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step || 1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-seafoam h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-seafoam [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
      />
      <div className="flex justify-between text-[10px] text-white/20 mt-0.5">
        <span>{prefix}{min}{suffix}</span>
        <span>{prefix}{max}{suffix}</span>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────

export default function EconomicsCalculatorPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");

  // Session params
  const [sessionType, setSessionType] = useState("5-day-full-week");
  const [enrolled, setEnrolled] = useState(6);
  const [charterHourCap, setCharterHourCap] = useState(16);
  const [charterRate, setCharterRate] = useState(25);

  // Staff
  const [staff, setStaff] = useState<StaffMember[]>([
    { id: "lead", role: "Lead Instructor (Owner)", rate: 50, hours: 0, enabled: true, isOwner: true },
    { id: "second", role: "Second Instructor", rate: 40, hours: 0, enabled: false },
  ]);

  // Annual projections
  const [campWeeks, setCampWeeks] = useState(4);
  const [fieldTrips, setFieldTrips] = useState(10);
  const [seriesSemesters, setSeriesSemesters] = useState(2);
  const [monthlyImmersions, setMonthlyImmersions] = useState(6);
  const [aidaCerts, setAidaCerts] = useState(8);
  const [avgStudentsAnnual, setAvgStudentsAnnual] = useState(6);

  // Auth
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("key") === SECRET) setAuthed(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === SECRET) setAuthed(true);
  };

  // ─── CALCULATIONS ────────────────────────────────────────────────

  const config = SESSION_TYPES[sessionType];

  // Update staff hours when session type changes
  useEffect(() => {
    setStaff((prev) =>
      prev.map((s) => ({ ...s, hours: config.defaultHours }))
    );
  }, [sessionType, config.defaultHours]);

  const calc = useMemo(() => {
    const grossRevenue = config.price * enrolled;
    const charterHours = Math.min(charterHourCap, config.defaultHours);
    const charterPerStudent = charterHours * charterRate;
    const charterTotal = charterPerStudent * enrolled;
    const familyPerStudent = Math.max(0, config.price - charterPerStudent);
    const familyTotal = familyPerStudent * enrolled;

    let totalStaffCost = 0;
    const staffBreakdown: { role: string; cost: number }[] = [];

    for (const s of staff) {
      if (!s.enabled) continue;
      const cost = s.isOwner ? 0 : s.rate * s.hours;
      totalStaffCost += cost;
      staffBreakdown.push({
        role: s.role,
        cost: s.isOwner ? s.rate * s.hours : cost,
      });
    }

    const netMargin = grossRevenue - totalStaffCost;
    const revenuePerStudentPerHour =
      config.defaultHours > 0 ? grossRevenue / enrolled / config.defaultHours : 0;

    // Enrollment scenarios 2-12
    const scenarios = [];
    for (let n = 2; n <= 12; n++) {
      const gross = config.price * n;
      const cHrs = Math.min(charterHourCap, config.defaultHours);
      const cPerS = cHrs * charterRate;
      const cTotal = cPerS * n;
      const fTotal = Math.max(0, config.price - cPerS) * n;
      const net = gross - totalStaffCost;
      const pct = gross > 0 ? net / gross : 0;
      scenarios.push({
        students: n,
        gross,
        charter: cTotal,
        families: fTotal,
        staffCost: totalStaffCost,
        net,
        pct,
      });
    }

    return {
      grossRevenue,
      charterPerStudent,
      charterTotal,
      familyPerStudent,
      familyTotal,
      totalStaffCost,
      netMargin,
      revenuePerStudentPerHour,
      staffBreakdown,
      scenarios,
      charterPct: grossRevenue > 0 ? charterTotal / grossRevenue : 0,
      familyPct: grossRevenue > 0 ? familyTotal / grossRevenue : 0,
    };
  }, [config, enrolled, charterHourCap, charterRate, staff]);

  // Annual projections
  const annual = useMemo(() => {
    const n = avgStudentsAnnual;
    const cr = charterRate;
    const chc = charterHourCap;

    // Staff cost estimate per session (use current staffing)
    let staffPerSession = 0;
    for (const s of staff) {
      if (!s.enabled || s.isOwner) continue;
      staffPerSession += s.rate * s.hours;
    }

    const lines: { label: string; count: number; pricePerStudent: number; hours: number; gross: number; charter: number; family: number; staff: number; net: number }[] = [];

    // Camp weeks
    if (campWeeks > 0) {
      const p = 750;
      const h = 22.5;
      const cHrs = Math.min(chc, h);
      const cPerS = cHrs * cr;
      const gross = p * n * campWeeks;
      const charter = cPerS * n * campWeeks;
      const family = Math.max(0, p - cPerS) * n * campWeeks;
      const sc = staffPerSession * campWeeks;
      lines.push({ label: "Camp Garibaldi Weeks", count: campWeeks, pricePerStudent: p, hours: h, gross, charter, family, staff: sc, net: gross - sc });
    }

    // Field trips
    if (fieldTrips > 0) {
      const p = 50;
      const h = 3.5;
      const cHrs = Math.min(chc, h);
      const cPerS = cHrs * cr;
      const gross = p * n * fieldTrips;
      const charter = cPerS * n * fieldTrips;
      const family = Math.max(0, p - cPerS) * n * fieldTrips;
      const ftStaff = staff.filter(s => s.enabled && !s.isOwner).reduce((sum, s) => sum + s.rate * h, 0);
      const sc = ftStaff * fieldTrips;
      lines.push({ label: "Field Trips", count: fieldTrips, pricePerStudent: p, hours: h, gross, charter, family, staff: sc, net: gross - sc });
    }

    // Series semesters
    if (seriesSemesters > 0) {
      const p = 160;
      const h = 24;
      const cHrs = Math.min(chc, h);
      const cPerS = cHrs * cr;
      const gross = p * n * seriesSemesters;
      const charter = cPerS * n * seriesSemesters;
      const family = Math.max(0, p - cPerS) * n * seriesSemesters;
      const sc = staffPerSession * seriesSemesters;
      lines.push({ label: "Ocean Science Semesters", count: seriesSemesters, pricePerStudent: p, hours: h, gross, charter, family, staff: sc, net: gross - sc });
    }

    // Monthly immersions
    if (monthlyImmersions > 0) {
      const p = 40;
      const h = 3;
      const cHrs = Math.min(chc, h);
      const cPerS = cHrs * cr;
      const gross = p * n * monthlyImmersions;
      const charter = cPerS * n * monthlyImmersions;
      const family = Math.max(0, p - cPerS) * n * monthlyImmersions;
      const miStaff = staff.filter(s => s.enabled && !s.isOwner).reduce((sum, s) => sum + s.rate * h, 0);
      const sc = miStaff * monthlyImmersions;
      lines.push({ label: "Monthly Immersions", count: monthlyImmersions, pricePerStudent: p, hours: h, gross, charter, family, staff: sc, net: gross - sc });
    }

    // AIDA 1 certs
    if (aidaCerts > 0) {
      const p = 200;
      const h = 4;
      const gross = p * aidaCerts; // 1 student per cert typically
      const charter = 0; // not charter eligible
      const family = gross;
      const sc = 0; // owner-taught
      lines.push({ label: "AIDA 1 Certifications", count: aidaCerts, pricePerStudent: p, hours: h, gross, charter, family, staff: sc, net: gross - sc });
    }

    const totalGross = lines.reduce((s, l) => s + l.gross, 0);
    const totalCharter = lines.reduce((s, l) => s + l.charter, 0);
    const totalFamily = lines.reduce((s, l) => s + l.family, 0);
    const totalStaff = lines.reduce((s, l) => s + l.staff, 0);
    const totalNet = lines.reduce((s, l) => s + l.net, 0);

    return { lines, totalGross, totalCharter, totalFamily, totalStaff, totalNet };
  }, [campWeeks, fieldTrips, seriesSemesters, monthlyImmersions, aidaCerts, avgStudentsAnnual, charterRate, charterHourCap, staff]);

  // Staff management
  const updateStaff = (id: string, patch: Partial<StaffMember>) => {
    setStaff((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  };

  const addSupport = () => {
    setStaff((prev) => [
      ...prev,
      {
        id: `support-${Date.now()}`,
        role: "Support Staff",
        rate: 22,
        hours: config.defaultHours,
        enabled: true,
      },
    ]);
  };

  const removeStaff = (id: string) => {
    setStaff((prev) => prev.filter((s) => s.id !== id));
  };

  // ─── PASSWORD GATE ─────────────────────────────────────────────

  if (!authed) {
    return (
      <div className="min-h-screen bg-deep flex items-center justify-center px-6">
        <form onSubmit={handleLogin} className="max-w-sm w-full">
          <h1 className="font-serif text-2xl text-white mb-6 text-center">
            Revenue Calculator
          </h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter access key"
            className="w-full px-5 py-3 rounded-lg bg-white/[0.08] border border-white/20 text-white placeholder:text-white/40 outline-none focus:border-seafoam mb-4"
          />
          <button
            type="submit"
            className="w-full px-5 py-3 rounded-lg bg-coral text-white font-medium border-none cursor-pointer hover:bg-coral/90 transition-colors"
          >
            Access Calculator
          </button>
        </form>
      </div>
    );
  }

  // ─── MAIN LAYOUT ───────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-deep pt-28 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl text-white mb-2">
            Revenue & Economics Calculator
          </h1>
          <p className="text-white/40 text-sm">
            LJFC session economics &middot; charter funding &middot; staffing &middot; margin modeling
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* ─── LEFT PANEL ─────────────────────────────────── */}
          <div className="lg:col-span-4 space-y-6">
            {/* Session Parameters */}
            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6">
              <h2 className="font-serif text-lg text-white mb-5">Session Parameters</h2>

              <div className="mb-5">
                <label className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase block mb-2">
                  Session Type
                </label>
                <select
                  value={sessionType}
                  onChange={(e) => setSessionType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-white/[0.08] border border-white/20 text-white outline-none focus:border-seafoam appearance-none text-sm"
                >
                  {Object.entries(SESSION_TYPES).map(([key, cfg]) => (
                    <option key={key} value={key} className="bg-deep">
                      {cfg.label} — ${cfg.price}
                    </option>
                  ))}
                </select>
                <div className="text-white/30 text-[10px] mt-1">
                  {config.defaultHours} hours &middot; {config.unit}
                </div>
              </div>

              <div className="space-y-5">
                <Slider
                  label="Enrolled Students"
                  value={enrolled}
                  min={2}
                  max={12}
                  onChange={setEnrolled}
                />
                <Slider
                  label="Charter Hour Cap"
                  value={charterHourCap}
                  min={8}
                  max={20}
                  onChange={setCharterHourCap}
                  suffix="h"
                />
                <Slider
                  label="Charter Hourly Rate"
                  value={charterRate}
                  min={15}
                  max={40}
                  onChange={setCharterRate}
                  prefix="$"
                />
              </div>
            </div>

            {/* Staffing */}
            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-serif text-lg text-white">Staffing</h2>
                <button
                  onClick={addSupport}
                  className="text-xs text-seafoam bg-seafoam/10 px-3 py-1.5 rounded-lg border border-seafoam/20 hover:bg-seafoam/20 transition-colors cursor-pointer"
                >
                  + Support
                </button>
              </div>

              <div className="space-y-4">
                {staff.map((s) => (
                  <div
                    key={s.id}
                    className={`border rounded-xl p-4 transition-colors ${
                      s.enabled
                        ? "bg-white/[0.04] border-white/10"
                        : "bg-white/[0.02] border-white/5 opacity-50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {!s.isOwner && (
                          <input
                            type="checkbox"
                            checked={s.enabled}
                            onChange={(e) =>
                              updateStaff(s.id, { enabled: e.target.checked })
                            }
                            className="accent-seafoam"
                          />
                        )}
                        <span className="text-white text-sm font-medium">
                          {s.role}
                        </span>
                        {s.isOwner && (
                          <span className="text-[9px] text-sun bg-sun/10 px-1.5 py-0.5 rounded font-medium">
                            OWNER DRAW
                          </span>
                        )}
                      </div>
                      {!s.isOwner && s.id !== "second" && (
                        <button
                          onClick={() => removeStaff(s.id)}
                          className="text-coral/50 hover:text-coral text-xs bg-transparent border-none cursor-pointer"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <Slider
                      label="Hourly Rate"
                      value={s.rate}
                      min={s.isOwner ? 30 : s.id === "second" ? 25 : 18}
                      max={s.isOwner ? 100 : s.id === "second" ? 75 : 40}
                      onChange={(v) => updateStaff(s.id, { rate: v })}
                      prefix="$"
                    />

                    <div className="flex items-center justify-between mt-2 text-xs">
                      <span className="text-white/30">
                        {s.hours}h @ ${s.rate}/hr
                      </span>
                      <span className={s.isOwner ? "text-sun" : "text-white/60"}>
                        {fmtDollar(s.rate * s.hours)}
                        {s.isOwner && (
                          <span className="text-white/20 ml-1">(info only)</span>
                        )}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ─── RIGHT PANEL ────────────────────────────────── */}
          <div className="lg:col-span-8 space-y-6">
            {/* Funding Split Bar */}
            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6">
              <h3 className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-3">
                Funding Split per Student
              </h3>
              <div className="flex rounded-lg overflow-hidden h-10 mb-2">
                <div
                  className="bg-seafoam/60 flex items-center justify-center text-deep text-xs font-semibold transition-all duration-300"
                  style={{ width: `${calc.charterPct * 100}%` }}
                >
                  {calc.charterPct > 0.1 && `Charter ${fmtDollar(calc.charterPerStudent)}`}
                </div>
                <div
                  className="bg-sand/60 flex items-center justify-center text-deep text-xs font-semibold transition-all duration-300"
                  style={{ width: `${calc.familyPct * 100}%` }}
                >
                  {calc.familyPct > 0.1 && `Family ${fmtDollar(calc.familyPerStudent)}`}
                </div>
              </div>
              <div className="flex justify-between text-[10px] text-white/30">
                <span>Charter: {fmtPct(calc.charterPct)}</span>
                <span>Family: {fmtPct(calc.familyPct)}</span>
              </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <StatCard label="Gross Revenue" value={fmtDollar(calc.grossRevenue)} />
              <StatCard
                label="Charter Invoiced"
                value={fmtDollar(calc.charterTotal)}
                accent="#3db8a4"
              />
              <StatCard
                label="Families Pay"
                value={fmtDollar(calc.familyTotal)}
                accent="#D4A574"
              />
              <StatCard
                label="Total Staff Cost"
                value={fmtDollar(calc.totalStaffCost)}
                accent="#C75B3A"
              />
              <StatCard
                label="Net Operating Margin"
                value={fmtDollar(calc.netMargin)}
                accent={calc.netMargin >= 0 ? "#22c55e" : "#C75B3A"}
              />
              <StatCard
                label="Rev / Student / Hour"
                value={fmtDollar(calc.revenuePerStudentPerHour)}
                accent="#f0b429"
              />
            </div>

            {/* Cost Breakdown */}
            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6">
              <h3 className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-4">
                Cost Breakdown
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">
                    Gross Revenue ({enrolled} students x {fmtDollar(config.price)})
                  </span>
                  <span className="text-white font-serif">
                    {fmtDollar(calc.grossRevenue)}
                  </span>
                </div>
                <div className="border-t border-white/5 my-2" />
                {calc.staffBreakdown.map((s, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-white/40">{s.role}</span>
                    <span className={staff[i]?.isOwner ? "text-sun/60 font-serif" : "text-coral/80 font-serif"}>
                      {staff[i]?.isOwner ? (
                        <span className="text-white/20">({fmtDollar(s.cost)} owner draw)</span>
                      ) : (
                        <>-{fmtDollar(s.cost)}</>
                      )}
                    </span>
                  </div>
                ))}
                <div className="border-t border-white/10 my-2" />
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-white">Net Operating</span>
                  <span
                    className="font-serif text-lg"
                    style={{
                      color: calc.netMargin >= 0 ? "#22c55e" : "#C75B3A",
                    }}
                  >
                    {fmtDollar(calc.netMargin)}
                  </span>
                </div>
              </div>
            </div>

            {/* Enrollment Scenarios Table */}
            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6">
              <h3 className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-4">
                Enrollment Scenarios — {config.label}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-white/40">
                      <th className="text-left p-2 font-medium">Students</th>
                      <th className="text-right p-2 font-medium">Gross</th>
                      <th className="text-right p-2 font-medium">Charter</th>
                      <th className="text-right p-2 font-medium">Families</th>
                      <th className="text-right p-2 font-medium">Staff</th>
                      <th className="text-right p-2 font-medium">Net</th>
                      <th className="text-right p-2 font-medium">Margin</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calc.scenarios.map((row) => (
                      <tr
                        key={row.students}
                        className={`border-t border-white/5 ${
                          row.students === enrolled
                            ? "bg-seafoam/[0.08]"
                            : ""
                        }`}
                      >
                        <td className="p-2 text-white/60">
                          {row.students}
                          {row.students === enrolled && (
                            <span className="text-seafoam ml-1 text-[9px]">current</span>
                          )}
                        </td>
                        <td className="p-2 text-right text-white/70 font-mono">
                          {fmtDollar(row.gross)}
                        </td>
                        <td className="p-2 text-right text-seafoam/70 font-mono">
                          {fmtDollar(row.charter)}
                        </td>
                        <td className="p-2 text-right text-sand/70 font-mono">
                          {fmtDollar(row.families)}
                        </td>
                        <td className="p-2 text-right text-coral/70 font-mono">
                          {fmtDollar(row.staffCost)}
                        </td>
                        <td
                          className="p-2 text-right font-mono font-medium"
                          style={{
                            color: row.net >= 0 ? "#22c55e" : "#C75B3A",
                          }}
                        >
                          {fmtDollar(row.net)}
                        </td>
                        <td
                          className="p-2 text-right font-mono"
                          style={{
                            color: row.pct >= 0.3 ? "#22c55e" : row.pct >= 0 ? "#f0b429" : "#C75B3A",
                          }}
                        >
                          {fmtPct(row.pct)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* ─── ANNUAL PROJECTIONS ───────────────────────────── */}
        <div className="mt-12">
          <h2 className="font-serif text-2xl text-white mb-2">
            Annual Projections
          </h2>
          <p className="text-white/40 text-sm mb-8">
            Model total annual revenue across all program types
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Annual Inputs */}
            <div className="lg:col-span-4">
              <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 space-y-5">
                <h3 className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-2">
                  Sessions Per Year
                </h3>
                <Slider
                  label="Camp Garibaldi Weeks"
                  value={campWeeks}
                  min={0}
                  max={16}
                  onChange={setCampWeeks}
                />
                <Slider
                  label="Field Trips"
                  value={fieldTrips}
                  min={0}
                  max={30}
                  onChange={setFieldTrips}
                />
                <Slider
                  label="Ocean Science Semesters"
                  value={seriesSemesters}
                  min={0}
                  max={8}
                  onChange={setSeriesSemesters}
                />
                <Slider
                  label="Monthly Immersions"
                  value={monthlyImmersions}
                  min={0}
                  max={12}
                  onChange={setMonthlyImmersions}
                />
                <Slider
                  label="AIDA 1 Certifications"
                  value={aidaCerts}
                  min={0}
                  max={30}
                  onChange={setAidaCerts}
                />
                <div className="border-t border-white/10 pt-4">
                  <Slider
                    label="Avg Students / Session"
                    value={avgStudentsAnnual}
                    min={2}
                    max={12}
                    onChange={setAvgStudentsAnnual}
                  />
                </div>
              </div>
            </div>

            {/* Annual Results */}
            <div className="lg:col-span-8 space-y-6">
              {/* Annual stat cards */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <StatCard
                  label="Annual Revenue"
                  value={fmtDollar(annual.totalGross)}
                />
                <StatCard
                  label="Charter-Funded"
                  value={fmtDollar(annual.totalCharter)}
                  accent="#3db8a4"
                />
                <StatCard
                  label="Family-Funded"
                  value={fmtDollar(annual.totalFamily)}
                  accent="#D4A574"
                />
                <StatCard
                  label="Staff Costs"
                  value={fmtDollar(annual.totalStaff)}
                  accent="#C75B3A"
                />
                <StatCard
                  label="Annual Net"
                  value={fmtDollar(annual.totalNet)}
                  accent={annual.totalNet >= 0 ? "#22c55e" : "#C75B3A"}
                />
              </div>

              {/* Annual breakdown table */}
              <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6">
                <h3 className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-4">
                  Annual Breakdown by Program
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-white/40">
                        <th className="text-left p-2 font-medium">Program</th>
                        <th className="text-right p-2 font-medium">Count</th>
                        <th className="text-right p-2 font-medium">Gross</th>
                        <th className="text-right p-2 font-medium">Charter</th>
                        <th className="text-right p-2 font-medium">Family</th>
                        <th className="text-right p-2 font-medium">Staff</th>
                        <th className="text-right p-2 font-medium">Net</th>
                      </tr>
                    </thead>
                    <tbody>
                      {annual.lines.map((line, i) => (
                        <tr key={i} className="border-t border-white/5">
                          <td className="p-2 text-white/70">{line.label}</td>
                          <td className="p-2 text-right text-white/50 font-mono">
                            {line.count}
                          </td>
                          <td className="p-2 text-right text-white/70 font-mono">
                            {fmtDollar(line.gross)}
                          </td>
                          <td className="p-2 text-right text-seafoam/70 font-mono">
                            {fmtDollar(line.charter)}
                          </td>
                          <td className="p-2 text-right text-sand/70 font-mono">
                            {fmtDollar(line.family)}
                          </td>
                          <td className="p-2 text-right text-coral/70 font-mono">
                            {fmtDollar(line.staff)}
                          </td>
                          <td
                            className="p-2 text-right font-mono font-medium"
                            style={{
                              color: line.net >= 0 ? "#22c55e" : "#C75B3A",
                            }}
                          >
                            {fmtDollar(line.net)}
                          </td>
                        </tr>
                      ))}
                      <tr className="border-t border-white/20">
                        <td className="p-2 text-white font-medium">Total</td>
                        <td className="p-2" />
                        <td className="p-2 text-right text-white font-serif font-medium">
                          {fmtDollar(annual.totalGross)}
                        </td>
                        <td className="p-2 text-right text-seafoam font-serif">
                          {fmtDollar(annual.totalCharter)}
                        </td>
                        <td className="p-2 text-right text-sand font-serif">
                          {fmtDollar(annual.totalFamily)}
                        </td>
                        <td className="p-2 text-right text-coral font-serif">
                          {fmtDollar(annual.totalStaff)}
                        </td>
                        <td
                          className="p-2 text-right font-serif text-base font-medium"
                          style={{
                            color: annual.totalNet >= 0 ? "#22c55e" : "#C75B3A",
                          }}
                        >
                          {fmtDollar(annual.totalNet)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Annual funding split bar */}
              <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6">
                <h3 className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-3">
                  Annual Revenue Mix
                </h3>
                {annual.totalGross > 0 && (
                  <>
                    <div className="flex rounded-lg overflow-hidden h-8 mb-2">
                      <div
                        className="bg-seafoam/60 flex items-center justify-center text-deep text-[10px] font-semibold transition-all duration-300"
                        style={{
                          width: `${(annual.totalCharter / annual.totalGross) * 100}%`,
                        }}
                      >
                        {(annual.totalCharter / annual.totalGross) > 0.15 && "Charter"}
                      </div>
                      <div
                        className="bg-sand/60 flex items-center justify-center text-deep text-[10px] font-semibold transition-all duration-300"
                        style={{
                          width: `${(annual.totalFamily / annual.totalGross) * 100}%`,
                        }}
                      >
                        {(annual.totalFamily / annual.totalGross) > 0.15 && "Family"}
                      </div>
                    </div>
                    <div className="flex justify-between text-[10px] text-white/30">
                      <span>
                        Charter: {fmtPct(annual.totalCharter / annual.totalGross)}
                      </span>
                      <span>
                        Family: {fmtPct(annual.totalFamily / annual.totalGross)}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
