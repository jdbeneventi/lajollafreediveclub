"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { CalendarEventLite, InquiryLite } from "@/lib/inquiryConflicts";

// Session lives in an httpOnly cookie set by /api/admin/login.
// Kept empty so the inter-page ?key= links below carry no secret.
const SECRET = "";

interface Props {
  inquiries: InquiryLite[];
  events: CalendarEventLite[];
  /** Number of weeks to render. Default 9 (~63 days). */
  weeks?: number;
  /** Earliest day to render. Default = current week's Sunday. */
  start?: Date;
}

// Stable color rotation for inquiry bars (matches palette tokens)
const INQUIRY_COLORS = [
  "bg-seafoam/40 border-seafoam",
  "bg-coral/40 border-coral",
  "bg-sun/40 border-sun",
  "bg-teal/50 border-teal",
  "bg-sand/40 border-sand",
];

const EVENT_CAT_COLORS: Record<string, string> = {
  course: "bg-coral/80 text-deep",
  camp: "bg-sand/80 text-deep",
  community: "bg-seafoam/80 text-deep",
  weekly: "bg-teal/80 text-salt",
  seasonal: "bg-ocean/80 text-salt",
  guest: "bg-sun/80 text-deep",
};

const MS_PER_DAY = 86_400_000;

function todayUTC(): Date {
  const d = new Date();
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
}

function startOfWeek(d: Date): Date {
  // Sunday-start. UTC.
  const day = d.getUTCDay();
  return new Date(d.getTime() - day * MS_PER_DAY);
}

function parseISO(d: string | null | undefined): Date | null {
  if (!d) return null;
  const [y, m, day] = d.split("-").map(Number);
  if (!y || !m || !day) return null;
  return new Date(Date.UTC(y, m - 1, day));
}

function toISO(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function inRange(day: Date, start: Date, end: Date): boolean {
  return day.getTime() >= start.getTime() && day.getTime() <= end.getTime();
}

// ─── Component ────────────────────────────────────────────────────────────

export default function CalendarPanel({ inquiries, events, weeks = 9, start }: Props) {
  const [selected, setSelected] = useState<Date | null>(null);
  const [selectionAnchor, setSelectionAnchor] = useState<Date | null>(null);
  const [selectionRange, setSelectionRange] = useState<{ start: Date; end: Date } | null>(null);

  const gridStart = useMemo(() => startOfWeek(start || todayUTC()), [start]);
  const days = useMemo(() => {
    const list: Date[] = [];
    for (let i = 0; i < weeks * 7; i++) {
      list.push(new Date(gridStart.getTime() + i * MS_PER_DAY));
    }
    return list;
  }, [gridStart, weeks]);

  // Map inquiry index → color (stable per session)
  const inquiryColor = useMemo(() => {
    const map = new Map<string, string>();
    let idx = 0;
    for (const inq of inquiries) {
      if (inq.parsed_start_date && inq.parsed_end_date) {
        map.set(inq.id, INQUIRY_COLORS[idx % INQUIRY_COLORS.length]);
        idx++;
      }
    }
    return map;
  }, [inquiries]);

  const parsedInquiries = useMemo(
    () =>
      inquiries
        .map((i) => ({
          ...i,
          start: parseISO(i.parsed_start_date),
          end: parseISO(i.parsed_end_date),
        }))
        .filter((i): i is typeof i & { start: Date; end: Date } => !!i.start && !!i.end),
    [inquiries],
  );

  const parsedEvents = useMemo(
    () =>
      events
        .map((e) => ({
          ...e,
          start: parseISO(e.date),
          end: parseISO(e.end_date) || parseISO(e.date),
        }))
        .filter((e): e is typeof e & { start: Date; end: Date } => !!e.start && !!e.end),
    [events],
  );

  const today = todayUTC();

  // Compute what's on a given day
  const dayContent = (day: Date) => {
    const dayInquiries = parsedInquiries.filter((i) => inRange(day, i.start, i.end));
    const dayEvents = parsedEvents.filter((e) => inRange(day, e.start, e.end));
    return { dayInquiries, dayEvents };
  };

  // Selection
  const handleDayClick = (day: Date, shiftKey: boolean) => {
    if (shiftKey && selectionAnchor) {
      const start = selectionAnchor < day ? selectionAnchor : day;
      const end = selectionAnchor < day ? day : selectionAnchor;
      setSelectionRange({ start, end });
      setSelected(null);
    } else {
      setSelectionAnchor(day);
      setSelectionRange(null);
      setSelected(day);
    }
  };

  const clearSelection = () => {
    setSelected(null);
    setSelectionAnchor(null);
    setSelectionRange(null);
  };

  const isInSelectionRange = (day: Date) => {
    if (!selectionRange) return false;
    return inRange(day, selectionRange.start, selectionRange.end);
  };

  // For the "Schedule course" deeplink — pass the range to /admin/calendar
  // which has the create UI. The calendar admin opens to the right date range.
  const scheduleHref = (() => {
    if (selectionRange) {
      return `/admin/calendar?key=${SECRET}&prefillDate=${toISO(selectionRange.start)}&prefillEndDate=${toISO(selectionRange.end)}`;
    }
    if (selected) {
      return `/admin/calendar?key=${SECRET}&prefillDate=${toISO(selected)}`;
    }
    return null;
  })();

  // Selected day(s) detail
  const detailContent = (() => {
    if (selectionRange) {
      const inquiriesInRange = parsedInquiries.filter(
        (i) => intersect(i.start, i.end, selectionRange.start, selectionRange.end) !== null,
      );
      const eventsInRange = parsedEvents.filter(
        (e) => intersect(e.start, e.end, selectionRange.start, selectionRange.end) !== null,
      );
      return { inquiriesInRange, eventsInRange };
    }
    if (selected) {
      const { dayInquiries, dayEvents } = dayContent(selected);
      return { inquiriesInRange: dayInquiries, eventsInRange: dayEvents };
    }
    return null;
  })();

  return (
    <div className="bg-deep/40 border border-teal/20 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-[11px] text-teal/70 font-medium tracking-[0.2em] uppercase">Calendar overlay</div>
          <div className="text-xs text-salt/40 mt-0.5">
            Next {weeks} weeks · click day, or click + shift-click for a range
          </div>
        </div>
        <Link
          href={`/admin/calendar?key=${SECRET}`}
          className="text-[11px] text-seafoam/60 hover:text-seafoam no-underline tracking-[0.1em] uppercase"
        >
          Open calendar manager →
        </Link>
      </div>

      {/* Day-of-week header */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="text-[9px] text-salt/30 text-center uppercase tracking-wider">
            {d}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const isToday = day.getTime() === today.getTime();
          const isPast = day.getTime() < today.getTime();
          const isSelected = selected && selected.getTime() === day.getTime();
          const inSelRange = isInSelectionRange(day);
          const { dayInquiries, dayEvents } = dayContent(day);
          const dom = day.getUTCDate();
          const isFirst = dom === 1;
          const monthLabel = day.toLocaleString("en-US", { month: "short", timeZone: "UTC" });

          // Border state
          const borderClass = isSelected
            ? "border-seafoam ring-1 ring-seafoam"
            : inSelRange
              ? "border-seafoam/60"
              : isToday
                ? "border-sun/70"
                : "border-teal/10";

          return (
            <button
              key={day.toISOString()}
              onClick={(e) => handleDayClick(day, e.shiftKey)}
              className={`relative aspect-square min-h-[52px] rounded-md border ${borderClass} text-left p-1 transition-colors ${
                isPast ? "bg-deep/30 opacity-60" : "bg-ocean/20 hover:bg-ocean/40"
              } ${inSelRange ? "bg-seafoam/15" : ""}`}
            >
              <div className="flex items-start justify-between">
                <span className={`text-[10px] ${isToday ? "text-sun font-semibold" : "text-salt/60"}`}>
                  {isFirst ? `${monthLabel} ${dom}` : dom}
                </span>
              </div>

              {/* Inquiry stripes — top */}
              <div className="absolute top-0 left-0 right-0 flex flex-col gap-[1px] pt-3.5 px-0.5">
                {dayInquiries.slice(0, 3).map((inq) => (
                  <div
                    key={inq.id}
                    className={`h-1 rounded-sm border ${inquiryColor.get(inq.id) || "bg-salt/30 border-salt"}`}
                    title={`${inq.first_name} ${inq.last_name || ""} · ${inq.course.split("—")[0].trim()}`}
                  />
                ))}
                {dayInquiries.length > 3 && (
                  <div className="text-[8px] text-salt/40 leading-none mt-0.5">+{dayInquiries.length - 3}</div>
                )}
              </div>

              {/* Event chips — bottom */}
              <div className="absolute bottom-0.5 left-0.5 right-0.5 flex flex-wrap gap-0.5">
                {dayEvents.slice(0, 2).map((ev) => (
                  <div
                    key={ev.id}
                    className={`h-1.5 flex-1 min-w-0 rounded-sm ${EVENT_CAT_COLORS[ev.category] || "bg-salt/40"}`}
                    title={`${ev.title} (${ev.category})`}
                  />
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3 text-[10px] text-salt/40">
        <span className="flex items-center gap-1">
          <span className="inline-block w-2 h-2 rounded-sm bg-coral/80"></span> course
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-2 h-2 rounded-sm bg-sand/80"></span> camp
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-2 h-2 rounded-sm bg-seafoam/80"></span> community
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-2 h-2 rounded-sm bg-teal/80"></span> weekly
        </span>
        <span className="flex items-center gap-1 ml-auto">
          <span className="inline-block w-2 h-0.5 rounded bg-seafoam"></span> inquiry windows on top edge
        </span>
      </div>

      {/* Selection detail */}
      {detailContent && (
        <div className="mt-4 bg-ocean/30 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[11px] text-seafoam font-medium tracking-[0.15em] uppercase">
              {selectionRange
                ? `Selected ${toISO(selectionRange.start)} → ${toISO(selectionRange.end)}`
                : selected
                  ? `Selected ${selected.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" })}`
                  : ""}
            </div>
            <button onClick={clearSelection} className="text-[10px] text-salt/40 hover:text-salt/70 uppercase tracking-wider">
              Clear
            </button>
          </div>

          {detailContent.inquiriesInRange.length > 0 && (
            <div className="mb-2">
              <div className="text-[10px] text-salt/40 uppercase tracking-wider mb-1">
                Inquiries with overlapping windows
              </div>
              <div className="space-y-1">
                {detailContent.inquiriesInRange.map((i) => (
                  <div key={i.id} className="text-xs text-salt/80">
                    <span className="text-salt">{i.first_name} {i.last_name || ""}</span>
                    <span className="text-salt/40"> · {i.course.split("—")[0].trim()}</span>
                    <span className="text-salt/40"> · {i.group_size || "—"}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {detailContent.eventsInRange.length > 0 && (
            <div className="mb-2">
              <div className="text-[10px] text-salt/40 uppercase tracking-wider mb-1">
                Already on the calendar
              </div>
              <div className="space-y-1">
                {detailContent.eventsInRange.map((e) => (
                  <div key={e.id} className="text-xs text-salt/80">
                    <span className="text-salt">{e.title}</span>
                    <span className="text-salt/40"> · {e.category}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {detailContent.inquiriesInRange.length === 0 && detailContent.eventsInRange.length === 0 && (
            <div className="text-xs text-salt/50 italic">Nothing scheduled or pending in this window.</div>
          )}

          {scheduleHref && (
            <Link
              href={scheduleHref}
              className="inline-block mt-2 text-xs px-3 py-1.5 rounded-full bg-seafoam text-deep font-semibold no-underline hover:bg-seafoam/80"
            >
              Schedule a course here →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

// Helper — intersect two date ranges, used in selection detail
function intersect(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) {
  const start = aStart > bStart ? aStart : bStart;
  const end = aEnd < bEnd ? aEnd : bEnd;
  return start > end ? null : { start, end };
}
