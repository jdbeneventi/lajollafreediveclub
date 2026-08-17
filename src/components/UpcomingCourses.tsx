import Link from "next/link";
import { getScheduledCourses } from "@/lib/schedule";

/**
 * Live "Upcoming courses" strip for the homepage — same data the /calendar
 * page, digest, and Telegram bot read (calendar_events + bookings via
 * getScheduledCourses), so course dates are published once in the admin
 * and appear everywhere. Renders nothing on error or an empty schedule.
 */

function formatRange(date: string, end: string | null): string {
  const d = new Date(date + "T12:00:00");
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  const startStr = d.toLocaleDateString("en-US", opts);
  if (!end || end === date) return startStr;
  const e = new Date(end + "T12:00:00");
  const sameMonth = d.getMonth() === e.getMonth();
  return sameMonth
    ? `${startStr}–${e.getDate()}`
    : `${startStr} – ${e.toLocaleDateString("en-US", opts)}`;
}

function weekday(date: string): string {
  return new Date(date + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "short",
  });
}

export async function UpcomingCourses() {
  let courses;
  try {
    courses = await getScheduledCourses(120);
  } catch {
    return null;
  }
  const upcoming = courses.filter((c) => c.category === "course").slice(0, 4);
  if (upcoming.length === 0) return null;

  return (
    <section className="bg-white py-14 md:py-20 px-6 md:px-12 border-b border-deep/[0.06]">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
          <div>
            <div className="text-[11px] text-teal font-medium tracking-[0.2em] uppercase mb-3">
              Next in the water
            </div>
            <h2 className="font-serif text-[clamp(1.6rem,3vw,2.4rem)] leading-[1.1] tracking-tight">
              Upcoming courses
            </h2>
          </div>
          <Link
            href="/calendar"
            className="text-sm text-teal no-underline hover:underline shrink-0"
          >
            Full calendar →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {upcoming.map((c) => {
            const full = c.seatsLeft !== null && c.seatsLeft <= 0;
            return (
              <Link
                key={c.id}
                href="/contact/courses"
                className="group block border border-deep/[0.08] rounded-xl p-5 no-underline hover:border-teal/40 hover:shadow-sm transition-all"
              >
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-[11px] text-deep/40 font-medium uppercase tracking-wider">
                    {weekday(c.date)}
                  </span>
                  <span className="text-lg font-semibold text-deep">
                    {formatRange(c.date, c.end_date)}
                  </span>
                </div>
                <div className="text-sm text-deep/80 font-medium mb-3 group-hover:text-teal transition-colors">
                  {c.title}
                </div>
                {full ? (
                  <span className="inline-block text-[11px] font-semibold text-deep/40 bg-deep/[0.05] rounded-full px-2.5 py-1">
                    Full — join the waitlist
                  </span>
                ) : (
                  <span className="inline-block text-[11px] font-semibold text-teal bg-teal/[0.08] rounded-full px-2.5 py-1">
                    {c.seatsLeft !== null
                      ? `${c.seatsLeft} spot${c.seatsLeft === 1 ? "" : "s"} left · Reserve →`
                      : "Reserve →"}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
