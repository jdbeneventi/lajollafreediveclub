import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Booking & Cancellation Policy — La Jolla Freedive Club",
  description:
    "Deposit, cancellation, rescheduling, and weather policies for AIDA courses, private coaching, and Camp Garibaldi at La Jolla Freedive Club.",
  alternates: { canonical: "/policies" },
};

export default function PoliciesPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-deep to-ocean pt-36 pb-16 px-6 text-center">
        <Reveal>
          <div className="section-label text-seafoam before:bg-seafoam justify-center">Policies</div>
          <h1 className="font-serif text-[clamp(2rem,4vw,3rem)] text-white leading-tight tracking-tight mb-4">
            Booking &amp; Cancellation Policy
          </h1>
          <p className="text-white/50 text-sm max-w-[500px] mx-auto">
            Clear terms so there are no surprises. We want this to work for everyone.
          </p>
        </Reveal>
      </section>

      <section className="bg-salt py-16 px-6">
        <div className="max-w-[680px] mx-auto space-y-10">

          {/* Deposits & Payment */}
          <Reveal>
            <div className="bg-white rounded-2xl p-8">
              <h2 className="font-serif text-xl mb-4">Deposits &amp; Payment</h2>
              <ul className="space-y-3 text-sm text-[#5a6a7a] leading-relaxed">
                <li className="flex gap-3">
                  <span className="text-teal shrink-0 mt-0.5">•</span>
                  <span>A <strong className="text-deep">50% deposit</strong> is required to reserve your spot in any course.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-teal shrink-0 mt-0.5">•</span>
                  <span>The <strong className="text-deep">remaining balance is due before the course starts</strong>. You&apos;ll receive a payment link for the balance ahead of your course date.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-teal shrink-0 mt-0.5">•</span>
                  <span>Full payment upfront is also accepted and appreciated.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-teal shrink-0 mt-0.5">•</span>
                  <span>Payments are processed securely via Stripe. A small processing fee is added at checkout.</span>
                </li>
              </ul>
            </div>
          </Reveal>

          {/* Cancellation */}
          <Reveal>
            <div className="bg-white rounded-2xl p-8">
              <h2 className="font-serif text-xl mb-4">Cancellation</h2>
              <div className="space-y-4">
                <div className="flex gap-4 items-start p-4 bg-teal/5 rounded-xl">
                  <div className="text-teal font-serif text-lg shrink-0 w-16 text-center">14+<br /><span className="text-[10px] uppercase tracking-wider">days</span></div>
                  <div>
                    <div className="text-sm font-semibold text-deep">Full deposit refund</div>
                    <div className="text-xs text-[#5a6a7a]">Cancel 2 or more weeks before the course start date for a 100% refund of your deposit.</div>
                  </div>
                </div>
                <div className="flex gap-4 items-start p-4 bg-sun/5 rounded-xl">
                  <div className="text-sun font-serif text-lg shrink-0 w-16 text-center">48hr–<br />14 days</div>
                  <div>
                    <div className="text-sm font-semibold text-deep">50% deposit refund</div>
                    <div className="text-xs text-[#5a6a7a]">Cancel between 48 hours and 2 weeks before the course for a 50% refund of your deposit.</div>
                  </div>
                </div>
                <div className="flex gap-4 items-start p-4 bg-coral/5 rounded-xl">
                  <div className="text-coral font-serif text-lg shrink-0 w-16 text-center">&lt;48<br /><span className="text-[10px] uppercase tracking-wider">hours</span></div>
                  <div>
                    <div className="text-sm font-semibold text-deep">No refund</div>
                    <div className="text-xs text-[#5a6a7a]">Cancellations within 48 hours of the course start are non-refundable.</div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* No-Shows */}
          <Reveal>
            <div className="bg-white rounded-2xl p-8">
              <h2 className="font-serif text-xl mb-4">No-Shows</h2>
              <p className="text-sm text-[#5a6a7a] leading-relaxed">
                If you don&apos;t show up for your course without notice, the <strong className="text-deep">full payment is forfeited</strong>. If something comes up, please let us know as early as possible — we&apos;ll always try to work with you.
              </p>
            </div>
          </Reveal>

          {/* Rescheduling */}
          <Reveal>
            <div className="bg-white rounded-2xl p-8">
              <h2 className="font-serif text-xl mb-4">Rescheduling</h2>
              <p className="text-sm text-[#5a6a7a] leading-relaxed">
                We&apos;re happy to reschedule if we have spots available on another date. Rescheduling is <strong className="text-deep">subject to availability</strong> and not guaranteed. Contact us as early as possible to move your booking.
              </p>
            </div>
          </Reveal>

          {/* Weather */}
          <Reveal>
            <div className="bg-white rounded-2xl p-8">
              <h2 className="font-serif text-xl mb-4">Weather &amp; Ocean Conditions</h2>
              <p className="text-sm text-[#5a6a7a] leading-relaxed mb-4">
                Freediving is an ocean sport. Conditions are outside our control, and safety always comes first.
              </p>
              <ul className="space-y-3 text-sm text-[#5a6a7a] leading-relaxed">
                <li className="flex gap-3">
                  <span className="text-teal shrink-0 mt-0.5">•</span>
                  <span>If we cancel the entire course due to conditions: <strong className="text-deep">full refund</strong>.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-teal shrink-0 mt-0.5">•</span>
                  <span>If only part of the course can be completed: <strong className="text-deep">partial refund</strong> proportional to what was missed.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-teal shrink-0 mt-0.5">•</span>
                  <span>We&apos;ll always try to <strong className="text-deep">reschedule</strong> affected days before issuing a refund.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-teal shrink-0 mt-0.5">•</span>
                  <span>Conditions are assessed using live data from the <Link href="/conditions" className="text-teal no-underline hover:underline">Scripps buoy, NOAA, and our own forecasting tools</Link>.</span>
                </li>
              </ul>
            </div>
          </Reveal>

          {/* Contact */}
          <Reveal>
            <div className="bg-deep rounded-2xl p-8 text-center">
              <p className="text-white/60 text-sm mb-4">
                Questions about a booking? Need to cancel or reschedule?
              </p>
              <Link href="/contact" className="inline-flex px-6 py-3 bg-coral text-white rounded-full font-semibold text-sm no-underline hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(199,91,58,0.4)] transition-all">
                Contact us →
              </Link>
            </div>
          </Reveal>

        </div>
      </section>
    </>
  );
}
