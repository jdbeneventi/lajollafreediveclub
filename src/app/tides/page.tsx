import { Metadata } from "next";
import { TideCalendar } from "./TideCalendar";

export const metadata: Metadata = {
  title: "La Jolla Tide Calendar | La Jolla Freedive Club",
  description: "7-day tide calendar for La Jolla with best dive windows, tide heights, and freediving tips. Updated daily from NOAA.",
};

export default function TidesPage() {
  return (
    <main className="min-h-screen bg-salt">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="section-label">Tides</div>
        <h1 className="font-serif text-4xl md:text-5xl tracking-tight text-deep mb-4">
          La Jolla tide calendar
        </h1>
        <p className="text-[#5a6a7a] text-lg leading-relaxed max-w-2xl mb-12">
          Plan your dives around the tides. Incoming tide generally brings cleaner water and better visibility.
          The best freediving window is typically 1–3 hours after a low tide, as fresh ocean water pushes in.
        </p>
        <TideCalendar />
      </div>
    </main>
  );
}
