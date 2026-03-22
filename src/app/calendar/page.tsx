import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { EmailCapture } from "@/components/EmailCapture";
import {
  getUpcomingEvents,
  getRecurringEvents,
  getSeasonalHighlights,
  categoryLabels,
  categoryColors,
} from "@/lib/calendar";

export const metadata: Metadata = {
  title: "Calendar — Courses, Camp, & Events",
  description:
    "Upcoming AIDA certification courses, Camp Garibaldi sessions, Community Ocean Days, and weekly events at La Jolla Freedive Club.",
  openGraph: {
    title: "Calendar — La Jolla Freedive Club",
    description: "Upcoming courses, camp sessions, community events, and weekly dives.",
    url: "https://lajollafreediveclub.com/calendar",
  },
  alternates: { canonical: "/calendar" },
};

function formatDate(dateStr: string, endDate?: string): string {
  const d = new Date(dateStr + "T12:00:00");
  const month = d.toLocaleDateString("en-US", { month: "short" });
  const day = d.getDate();
  if (endDate) {
    const e = new Date(endDate + "T12:00:00");
    const eMonth = e.toLocaleDateString("en-US", { month: "short" });
    const eDay = e.getDate();
    if (month === eMonth) return `${month} ${day}–${eDay}`;
    return `${month} ${day} – ${eMonth} ${eDay}`;
  }
  return `${month} ${day}`;
}

function formatDayOfWeek(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short" });
}

export default function CalendarPage() {
  const upcoming = getUpcomingEvents();
  const recurring = getRecurringEvents();
  const seasonal = getSeasonalHighlights();

  // Group upcoming by month
  const byMonth: Record<string, typeof upcoming> = {};
  for (const event of upcoming) {
    const d = new Date(event.date + "T12:00:00");
    const key = d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    if (!byMonth[key]) byMonth[key] = [];
    byMonth[key].push(event);
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-deep to-ocean pt-36 pb-20 px-6 text-center">
        <Reveal>
          <div className="section-label text-seafoam before:bg-seafoam justify-center">
            Calendar
          </div>
          <h1 className="font-serif text-[clamp(2.5rem,5vw,4rem)] text-white font-normal leading-tight tracking-tight mb-6">
            What&apos;s coming up
          </h1>
          <p className="text-lg text-white/60 max-w-[560px] mx-auto leading-relaxed">
            Courses, camp sessions, community ocean days, and weekly events.
            Dates fill up fast — inquire early to reserve your spot.
          </p>
        </Reveal>
      </section>

      {/* Every Week */}
      <section className="bg-deep py-16 px-6">
        <div className="max-w-[900px] mx-auto">
          <Reveal>
            <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-4">Every Saturday</div>
            <h2 className="font-serif text-2xl text-white mb-8">The weekly rhythm</h2>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-4">
            {recurring.map((event) => (
              <Reveal key={event.id}>
                <div className="bg-white/[0.04] border border-white/10 rounded-xl p-6 h-full">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${categoryColors[event.category]}`}>
                      {categoryLabels[event.category]}
                    </span>
                    <span className="text-white/40 text-xs">{event.time}</span>
                  </div>
                  <h3 className="font-serif text-lg text-white mb-2">{event.title}</h3>
                  <p className="text-white/45 text-sm leading-relaxed mb-3">{event.description}</p>
                  <div className="text-seafoam text-sm font-medium">{event.price}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events by Month */}
      <section className="bg-salt py-20 px-6">
        <div className="max-w-[900px] mx-auto">
          <Reveal>
            <div className="section-label">Upcoming</div>
            <h2 className="section-title mb-12">Scheduled events</h2>
          </Reveal>

          {Object.entries(byMonth).map(([monthLabel, monthEvents]) => (
            <div key={monthLabel} className="mb-12 last:mb-0">
              <Reveal>
                <h3 className="font-serif text-xl text-deep mb-4 pb-2 border-b border-deep/10">{monthLabel}</h3>
              </Reveal>
              <div className="space-y-3">
                {monthEvents.map((event, i) => (
                  <Reveal key={event.id} delay={i * 40}>
                    <Link
                      href={event.href || "/contact/courses"}
                      className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 bg-white rounded-xl p-4 sm:p-5 no-underline text-deep hover:-translate-y-0.5 hover:shadow-md transition-all group"
                    >
                      {/* Date */}
                      <div className="flex items-center gap-3 sm:block sm:text-center shrink-0 sm:w-20">
                        <div className="text-[10px] text-[#5a6a7a] uppercase">{formatDayOfWeek(event.date)}</div>
                        <div className="font-serif text-lg text-deep leading-tight">{formatDate(event.date, event.endDate)}</div>
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${categoryColors[event.category]}`}>
                            {categoryLabels[event.category]}
                          </span>
                          {event.guestOrg && (
                            <span className="text-[10px] text-[#5a6a7a]">with {event.guestOrg}</span>
                          )}
                        </div>
                        <div className="text-sm font-semibold group-hover:text-teal transition-colors">{event.title}</div>
                        <div className="text-xs text-[#5a6a7a]">{event.description}</div>
                      </div>

                      {/* Price & Spots */}
                      <div className="flex items-center gap-3 sm:flex-col sm:items-end shrink-0">
                        {event.price && <div className="font-serif text-sm text-deep">{event.price}</div>}
                        {event.spots && (
                          <span className="px-2 py-1 bg-teal/10 text-teal text-[10px] font-semibold rounded-full">{event.spots}</span>
                        )}
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          ))}

          <Reveal>
            <div className="text-center mt-8">
              <p className="text-xs text-[#5a6a7a] mb-4">Don&apos;t see a date that works? We run courses on demand for groups of 2+.</p>
              <Link href="/contact/courses" className="btn btn-outline no-underline">
                Request custom dates →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Seasonal Highlights */}
      <section className="bg-deep py-16 px-6">
        <div className="max-w-[900px] mx-auto">
          <Reveal>
            <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-4">Seasonal</div>
            <h2 className="font-serif text-2xl text-white mb-8">What&apos;s in the water</h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 gap-4">
            {seasonal.map((event) => {
              const now = new Date().toISOString().split("T")[0];
              const isActive = event.date <= now && (event.endDate || "") >= now;
              return (
                <Reveal key={event.id}>
                  <div className={`bg-white/[0.04] border rounded-xl p-6 h-full ${isActive ? "border-seafoam/30" : "border-white/10"}`}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${categoryColors.seasonal}`}>
                        {isActive ? "Active Now" : "Season"}
                      </span>
                      <span className="text-white/30 text-xs">{formatDate(event.date, event.endDate)}</span>
                    </div>
                    <h3 className="font-serif text-lg text-white mb-2">{event.title}</h3>
                    <p className="text-white/45 text-sm leading-relaxed">{event.description}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-salt py-16 px-6 text-center">
        <Reveal>
          <div className="max-w-[500px] mx-auto">
            <h2 className="font-serif text-2xl text-deep mb-4">Ready to get in the water?</h2>
            <p className="text-[#5a6a7a] text-sm mb-6 leading-relaxed">
              Pick a course, sign up for a Community Ocean Day, or just show up
              on Saturday morning. We&apos;re at Kellogg Park every week.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link
                href="/contact/courses"
                className="inline-flex px-6 py-3 bg-coral text-white rounded-full font-semibold text-sm no-underline hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(199,91,58,0.4)] transition-all"
              >
                Book a course →
              </Link>
              <Link
                href="/conditions"
                className="inline-flex px-6 py-3 border border-deep/10 text-deep rounded-full font-semibold text-sm no-underline hover:bg-deep/5 transition-all"
              >
                Check conditions
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      <EmailCapture />
    </>
  );
}
