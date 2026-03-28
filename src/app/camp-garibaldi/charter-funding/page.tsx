import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { EmailCapture } from "@/components/EmailCapture";

export const metadata: Metadata = {
  title: "Charter School Funding — Camp Garibaldi",
  description:
    "How to use homeschool charter enrichment funds for Camp Garibaldi. Most families pay $50 or less out of pocket.",
};

const steps = [
  {
    num: 1,
    title: "Register for Camp Garibaldi",
    desc: "Fill out the registration form and secure your child\u2019s spot. Pricing: $450 (3-day) or $750 (5-day).",
  },
  {
    num: 2,
    title: "Tell your charter school",
    desc: "Contact your assigned teacher or enrichment coordinator. Tell them you want to use enrichment funds for an NGSS-aligned ocean science program.",
  },
  {
    num: 3,
    title: "We provide documentation",
    desc: "LJFC sends your charter: NGSS alignment matrix, vendor application package, W-9, certificate of insurance, program description with learning objectives.",
  },
  {
    num: 4,
    title: "Charter approves and pays directly",
    desc: "Your charter issues a purchase order. LJFC invoices the charter directly. NET30 payment terms.",
  },
  {
    num: 5,
    title: "Your child attends camp",
    desc: "Depending on the session and charter hour cap, most of the cost is covered. You pay only the remaining balance at registration.",
  },
];

const charters = [
  {
    name: "Pacific Coast Academy (PCA)",
    note: "Largest in SD County, no LiveScan required",
  },
  {
    name: "Sage Oak Charter School",
    note: "Statewide, LiveScan required, July 1 application window",
  },
  { name: "Suncoast Prep Academy", note: null },
  { name: "iLEAD Exploration", note: null },
  { name: "Sky Mountain Charter", note: null },
  { name: "River Springs Charter", note: null },
];

const faqs = [
  {
    q: "How much of camp is covered?",
    a: "Depends on your charter\u2019s hour cap and hourly rate. Most PCA families get ~$400 covered per session.",
  },
  {
    q: "Can I use funds for monthly programs too?",
    a: "Yes. Ocean Explorers and Canyon Crew monthly sessions are 3 hours each \u2014 fully within charter caps, often $0 out of pocket.",
  },
  {
    q: "Does my child need to be enrolled in a charter?",
    a: "No. Charter funding is a bonus. Any family can register and pay directly.",
  },
  {
    q: "How long does charter approval take?",
    a: "Typically 1\u20132 weeks. Apply as early as possible \u2014 don\u2019t wait until the week before camp.",
  },
  {
    q: "What if my charter hasn\u2019t heard of LJFC?",
    a: "We\u2019ll provide everything they need. Most charters approve quickly once they see the NGSS documentation.",
  },
];

const provisions = [
  "NGSS-aligned curriculum documentation (Grades 3-5 and 6-8)",
  "Vendor registration package (W-9, business license, insurance)",
  "Invoice addressed to charter for approved hours",
  "Attendance records and completion documentation",
  "California Environmental Principles & Concepts alignment",
];

export default function CharterFundingPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-deep pt-36 pb-20 px-6">
        <div className="max-w-[700px] mx-auto text-center">
          <Reveal>
            <div className="section-label text-seafoam before:bg-seafoam justify-center">
              Charter School Families
            </div>
            <h1 className="font-serif text-[clamp(2rem,5vw,3.5rem)] text-white leading-tight tracking-tight mb-6">
              How to use enrichment funds for Camp Garibaldi
            </h1>
            <p className="text-lg text-white/60 max-w-[500px] mx-auto leading-relaxed">
              Most families pay $50 or less out of pocket.
            </p>
          </Reveal>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-salt py-24 px-6">
        <div className="max-w-[800px] mx-auto">
          <Reveal>
            <div className="section-label">Step by Step</div>
            <h2 className="section-title mb-12">How it works</h2>
          </Reveal>

          <div className="space-y-4">
            {steps.map((s, i) => (
              <Reveal key={s.num} delay={i * 60}>
                <div className="bg-white rounded-xl p-6 md:p-8 flex gap-5 items-start">
                  <span className="w-10 h-10 rounded-full bg-gradient-to-br from-teal to-seafoam flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {s.num}
                  </span>
                  <div>
                    <h3 className="font-semibold text-deep mb-1">{s.title}</h3>
                    <p className="text-sm text-[#5a6a7a] leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Funding Breakdown */}
      <section className="bg-white py-24 px-6">
        <div className="max-w-[800px] mx-auto">
          <Reveal>
            <div className="section-label text-coral before:bg-coral">Funding Breakdown</div>
            <h2 className="section-title mb-12">What your charter covers</h2>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-6">
            <Reveal>
              <div className="border border-deep/10 rounded-2xl p-8">
                <div className="text-xs text-teal font-semibold uppercase tracking-wide mb-2">
                  5-Day Full Week
                </div>
                <div className="font-serif text-3xl text-deep mb-4">$750</div>
                <div className="space-y-3 text-sm text-[#5a6a7a]">
                  <div className="flex justify-between">
                    <span>Instructional hours</span>
                    <span className="text-deep font-medium">30 hrs</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Charter-fundable (PCA cap)</span>
                    <span className="text-deep font-medium">16 of 30 hrs</span>
                  </div>
                  <div className="h-[1px] bg-deep/[0.06]" />
                  <div className="flex justify-between">
                    <span>Charter pays (~$25/hr x 16 hrs)</span>
                    <span className="text-teal font-semibold">~$400</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Family pays</span>
                    <span className="text-coral font-semibold">~$350</span>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <div className="border border-deep/10 rounded-2xl p-8">
                <div className="text-xs text-teal font-semibold uppercase tracking-wide mb-2">
                  3-Day Immersion
                </div>
                <div className="font-serif text-3xl text-deep mb-4">$450</div>
                <div className="space-y-3 text-sm text-[#5a6a7a]">
                  <div className="flex justify-between">
                    <span>Instructional hours</span>
                    <span className="text-deep font-medium">18 hrs</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Charter-fundable</span>
                    <span className="text-deep font-medium">16 of 18 hrs</span>
                  </div>
                  <div className="h-[1px] bg-deep/[0.06]" />
                  <div className="flex justify-between">
                    <span>Charter pays (~$25/hr x 16 hrs)</span>
                    <span className="text-teal font-semibold">~$400</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Family pays</span>
                    <span className="text-coral font-semibold">~$50</span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal>
            <p className="text-xs text-[#5a6a7a] text-center mt-6 max-w-[600px] mx-auto">
              Hour caps and fund amounts vary by charter school. Confirm with your assigned teacher before relying on these estimates.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Compatible Charters */}
      <section className="bg-salt py-24 px-6">
        <div className="max-w-[800px] mx-auto">
          <Reveal>
            <div className="section-label">Compatible Charters</div>
            <h2 className="section-title mb-12">Schools we work with</h2>
          </Reveal>

          <div className="space-y-3">
            {charters.map((c, i) => (
              <Reveal key={c.name} delay={i * 40}>
                <div className="bg-white rounded-xl p-5 flex items-center justify-between gap-4">
                  <span className="text-sm font-medium text-deep">{c.name}</span>
                  {c.note && (
                    <span className="text-xs text-[#5a6a7a] text-right">{c.note}</span>
                  )}
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="bg-teal/5 border border-teal/20 rounded-xl p-6 mt-6 text-center">
              <p className="text-sm text-[#5a6a7a]">
                Don&apos;t see your charter?{" "}
                <Link href="/contact" className="text-teal font-semibold no-underline hover:underline">
                  Contact us
                </Link>{" "}
                &mdash; most California homeschool charters work with enrichment vendors.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* What LJFC Provides */}
      <section className="bg-white py-24 px-6">
        <div className="max-w-[800px] mx-auto">
          <Reveal>
            <div className="section-label">Documentation</div>
            <h2 className="section-title mb-8">What LJFC provides to your charter</h2>
          </Reveal>

          <Reveal>
            <div className="bg-salt rounded-2xl p-8">
              <ul className="space-y-4">
                {provisions.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-teal/10 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-teal" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <span className="text-sm text-deep leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-salt py-24 px-6">
        <div className="max-w-[800px] mx-auto">
          <Reveal>
            <div className="section-label">FAQ</div>
            <h2 className="section-title mb-12">Common questions</h2>
          </Reveal>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <Reveal key={i} delay={i * 40}>
                <details className="bg-white rounded-xl group">
                  <summary className="p-6 cursor-pointer text-sm font-semibold text-deep list-none flex items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                    {faq.q}
                    <svg
                      className="w-4 h-4 text-[#5a6a7a] shrink-0 transition-transform group-open:rotate-180"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </summary>
                  <div className="px-6 pb-6 -mt-2">
                    <p className="text-sm text-[#5a6a7a] leading-relaxed">{faq.a}</p>
                  </div>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-deep py-20 px-6">
        <div className="max-w-[600px] mx-auto text-center">
          <Reveal>
            <h2 className="font-serif text-3xl text-white font-normal mb-4">
              Ready to get started?
            </h2>
            <p className="text-white/50 text-sm mb-8 leading-relaxed">
              Register your child for Camp Garibaldi, then let your charter school know. We handle the rest.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/camp-garibaldi/register"
                className="btn btn-primary no-underline"
              >
                Register for Camp &rarr;
              </Link>
              <Link
                href="/contact"
                className="btn btn-ghost no-underline"
              >
                Questions? Contact Us
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <EmailCapture />
    </>
  );
}
