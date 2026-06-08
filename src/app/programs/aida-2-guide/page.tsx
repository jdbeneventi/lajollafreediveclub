import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "AIDA 2 Freediver — What to Expect | La Jolla Freedive Club",
  description:
    "A complete guide to the AIDA 2 Freediver course at LJFC — performance standards, course structure, prerequisites, pricing, and how to prepare. The world's most widely recognized entry-level freediving certification.",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://lajollafreediveclub.com/programs/aida-2-guide" },
};

// ─── Small presentational pieces ──────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase">{children}</p>
  );
}

function StatCard({
  label,
  value,
  desc,
  accent = "teal",
}: {
  label: string;
  value: string;
  desc: string;
  accent?: "teal" | "coral";
}) {
  const accentClass = accent === "coral" ? "text-coral" : "text-teal/70";
  return (
    <div className="bg-ocean/40 border border-teal/15 rounded-2xl p-5">
      <p className={`text-[10px] ${accentClass} font-medium tracking-[0.15em] uppercase mb-2`}>
        {label}
      </p>
      <p className="font-serif text-3xl text-salt mb-1">{value}</p>
      <p className="text-xs text-salt/50 leading-snug">{desc}</p>
    </div>
  );
}

function DayCard({
  label,
  title,
  desc,
  cert = false,
}: {
  label: string;
  title: string;
  desc: string;
  cert?: boolean;
}) {
  const borderColor = cert ? "border-t-coral" : "border-t-teal";
  const labelColor = cert ? "text-coral" : "text-teal/70";
  return (
    <div className={`border-t-2 ${borderColor} pt-4`}>
      <p className={`text-[10px] ${labelColor} font-medium tracking-[0.15em] uppercase mb-2`}>
        {label}
      </p>
      <p className="font-serif text-lg text-salt mb-2">{title}</p>
      <p className="text-sm text-salt/60 leading-relaxed">{desc}</p>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <div className="border-b border-teal/10 pb-5">
      <p className="text-sm font-medium text-salt mb-2">{q}</p>
      <p className="text-sm text-salt/60 leading-relaxed">{a}</p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────

export default function Aida2GuidePage() {
  return (
    <div className="bg-deep text-salt min-h-screen">
      <Nav />

      <main>
        {/* ── Hero ── */}
        <section className="px-6 pt-28 pb-20 md:pt-36 md:pb-28 bg-gradient-to-b from-ocean/30 to-deep">
          <div className="max-w-5xl mx-auto">
            <Reveal>
              <SectionLabel>AIDA 2 Freediver · Course Guide</SectionLabel>
            </Reveal>
            <Reveal delay={100}>
              <h1 className="font-serif text-5xl md:text-7xl text-salt leading-[1.05] mt-6 mb-8">
                What you&apos;re
                <br />
                getting into.
              </h1>
            </Reveal>
            <Reveal delay={200}>
              <p className="text-lg md:text-xl text-salt/70 leading-relaxed max-w-2xl mb-10">
                The world&apos;s most widely recognized entry-level freediving certification, taught
                over <span className="text-salt">2.5 to 3 days</span> at La Jolla Shores. You&apos;ll hold
                your breath for two minutes, swim 40 meters underwater on one breath, descend to 12
                meters on a vertical line, and know how to rescue a buddy from depth.
              </p>
            </Reveal>
            <Reveal delay={300}>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/contact/courses?course=aida-2"
                  className="inline-block px-7 py-3 bg-coral text-salt rounded-full font-medium text-sm hover:bg-coral/90 transition-colors no-underline"
                >
                  Inquire about dates →
                </Link>
                <a
                  href="/api/guide-pdf?course=aida-2"
                  className="inline-block px-7 py-3 bg-transparent text-salt border border-salt/30 rounded-full font-medium text-sm hover:border-salt/60 transition-colors no-underline"
                >
                  Download as PDF
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── What is AIDA 2 ── */}
        <section className="px-6 py-20 md:py-28">
          <div className="max-w-5xl mx-auto">
            <Reveal>
              <SectionLabel>What this is</SectionLabel>
            </Reveal>
            <Reveal delay={100}>
              <h2 className="font-serif text-3xl md:text-5xl text-salt mt-4 mb-8 max-w-3xl leading-[1.1]">
                The foundation certification for recreational freediving.
              </h2>
            </Reveal>
            <Reveal delay={200}>
              <div className="grid md:grid-cols-2 gap-10 text-salt/70 text-base leading-relaxed">
                <p>
                  <a
                    href="https://www.aidainternational.org/"
                    target="_blank"
                    rel="noopener"
                    className="text-seafoam underline-offset-2"
                  >
                    AIDA International
                  </a>{" "}
                  is the oldest international standards body for freediving — founded in 1992,
                  governs the world championships, and sets the credentialing standards every
                  serious freediving school uses or maps to.
                </p>
                <p>
                  AIDA 2 is the level at which you become a competent, autonomous freediver:
                  comfortable with breath-hold physiology, capable of recognizing and responding to
                  safety issues in your buddy, and trained to descend on a vertical line under your
                  own control. Most students at LJFC are first-time freedivers — no prior
                  certification required.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── Performance Standards ── */}
        <section className="px-6 py-20 md:py-28 bg-ocean/20">
          <div className="max-w-5xl mx-auto">
            <Reveal>
              <SectionLabel>Performance Standards</SectionLabel>
              <h2 className="font-serif text-3xl md:text-5xl text-salt mt-4 mb-3">
                What you&apos;ll need to do.
              </h2>
              <p className="text-salt/50 text-sm max-w-xl mb-10">
                Four requirements, verified against the{" "}
                <a
                  href="https://www.aidainternational.org/Education/AIDAFreedivingCourses#aida2"
                  target="_blank"
                  rel="noopener"
                  className="text-seafoam underline-offset-2"
                >
                  current AIDA International standards
                </a>
                .
              </p>
            </Reveal>
            <Reveal delay={100}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatCard label="Static" value="2:00" desc="Breath hold in confined water, with buddy" />
                <StatCard label="Dynamic" value="40m" desc="Underwater swim with bi-fins" />
                <StatCard label="Depth" value="12m" desc="Constant Weight on the line" accent="coral" />
                <StatCard label="Exam" value="75%" desc="Written theoretical exam" />
              </div>
            </Reveal>
            <Reveal delay={200}>
              <p className="text-sm text-salt/60 leading-relaxed max-w-2xl mt-8">
                These numbers look bigger on paper than they feel in practice. Most students hit the
                confined-water requirements — the 2-minute static and 40m dynamic — on their first
                or second try during the course. Depth is more variable, but with proper Frenzel
                technique and relaxation, 12 meters is well within reach for almost any healthy
                adult. It looks daunting from outside the water. Inside, it&apos;s doable.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ── Course Structure ── */}
        <section className="px-6 py-20 md:py-28">
          <div className="max-w-5xl mx-auto">
            <Reveal>
              <SectionLabel>Course Structure</SectionLabel>
              <h2 className="font-serif text-3xl md:text-5xl text-salt mt-4 mb-10">
                2.5 to 3 days, structured.
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <div className="grid md:grid-cols-3 gap-6 md:gap-10">
                <DayCard
                  label="Day 1 · Evening"
                  title="Classroom theory"
                  desc="~3 hours covering physiology, equalization, safety protocols, equipment, and the freediving disciplines. In person or Zoom. The full AIDA 2 Manual is provided in advance for self-study."
                />
                <DayCard
                  label="Day 2 · Full day"
                  title="Confined water + ocean"
                  desc="Morning static and dynamic apnea with rescue scenarios — at calm shallow water at the Shores when conditions allow, in a pool otherwise. Afternoon open-water session — first depth dives at 5–8m on the LJFC mooring line."
                />
                <DayCard
                  label="Day 3 · Cert"
                  title="Cert dives + exam"
                  desc="Morning 12m cert dives in peak-tide calm conditions. Written exam on the beach. Logbook stamps. Cards processed in AIDA EOS within 24h of course end."
                  cert
                />
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── Curriculum ── */}
        <section className="px-6 py-20 md:py-28 bg-ocean/20">
          <div className="max-w-5xl mx-auto">
            <Reveal>
              <SectionLabel>What you&apos;ll learn</SectionLabel>
              <h2 className="font-serif text-3xl md:text-5xl text-salt mt-4 mb-10">
                Ten subject areas across theory, confined water, and open water.
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <div className="grid md:grid-cols-3 gap-10 text-salt/70 leading-relaxed">
                <div>
                  <p className="text-[11px] text-teal/70 font-medium tracking-[0.15em] uppercase mb-4">
                    Theory · the why
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li>Basic physiology of freediving</li>
                    <li>The freedive breathing cycle</li>
                    <li>Equalization (Frenzel introduction)</li>
                    <li>Safety, LMC, blackout, rescue</li>
                    <li>Freediving equipment</li>
                    <li>The disciplines (STA, DYN, FIM, CWT)</li>
                    <li>AIDA Green — environmental responsibility</li>
                  </ul>
                </div>
                <div>
                  <p className="text-[11px] text-teal/70 font-medium tracking-[0.15em] uppercase mb-4">
                    Confined water · the mechanics
                  </p>
                  <p className="text-xs text-salt/40 mb-3 italic">Pool, or calm shallow water at the Shores.</p>
                  <ul className="space-y-2 text-sm">
                    <li>2-minute static apnea with a buddy</li>
                    <li>40m dynamic with bi-fins</li>
                    <li>Surface LMC recovery</li>
                    <li>Blackout response with weight-removal protocol</li>
                  </ul>
                </div>
                <div>
                  <p className="text-[11px] text-coral/80 font-medium tracking-[0.15em] uppercase mb-4">
                    Open water · the application
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li>Equipment setup and weighting</li>
                    <li>Equalization on the line, head-down</li>
                    <li>Duck dives, vertical finning, controlled turns</li>
                    <li>Buddy supervision from the surface</li>
                    <li>Rescue from depth — blow-tap-talk protocol</li>
                    <li>The 12-meter Constant Weight cert dive</li>
                  </ul>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── Pricing ── */}
        <section className="px-6 py-20 md:py-28">
          <div className="max-w-5xl mx-auto">
            <Reveal>
              <SectionLabel>Pricing</SectionLabel>
              <h2 className="font-serif text-3xl md:text-5xl text-salt mt-4 mb-10">
                Two ways to take it.
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-teal/10 border-2 border-teal/40 rounded-2xl p-7">
                  <p className="text-[11px] text-teal font-medium tracking-[0.15em] uppercase mb-3">
                    Group · 2+ students
                  </p>
                  <p className="font-serif text-5xl text-salt mb-1">$575</p>
                  <p className="text-sm text-salt/50 mb-5">per person</p>
                  <p className="text-sm text-salt/80 leading-relaxed">
                    Group rate kicks in at 2 students. If you book solo and another student locks in
                    your dates, you both pay group.
                  </p>
                </div>
                <div className="bg-ocean/40 border border-teal/20 rounded-2xl p-7">
                  <p className="text-[11px] text-salt/50 font-medium tracking-[0.15em] uppercase mb-3">
                    Private · solo
                  </p>
                  <p className="font-serif text-5xl text-salt mb-1">$800</p>
                  <p className="text-sm text-salt/50 mb-5">one-on-one</p>
                  <p className="text-sm text-salt/80 leading-relaxed">
                    Same curriculum, taught one-on-one with flexible scheduling around your week.
                  </p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={200}>
              <p className="text-xs text-salt/40 mt-6 max-w-2xl leading-relaxed">
                Includes: AIDA certification card, full course, digital manual, instructor time,
                LJFC mooring line access. Not included: personal gear (rentals available), AIDA
                membership (first year free with certification), optional extra ocean training days
                ($150/day if needed).
              </p>
            </Reveal>
          </div>
        </section>

        {/* ── Modular skill completion ── */}
        <section className="px-6 py-20 md:py-24 bg-ocean/20">
          <div className="max-w-3xl mx-auto">
            <Reveal>
              <SectionLabel>How the cert actually works</SectionLabel>
              <h2 className="font-serif text-3xl md:text-4xl text-salt mt-4 mb-8">
                Skills are recorded individually. You can always come back.
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <p className="text-base text-salt/75 leading-relaxed mb-6">
                AIDA 2 isn&apos;t a pass-or-fail exam — it&apos;s four separate performance standards
                (static, dynamic, depth, written) that are evaluated independently. Your logbook
                records exactly which skills you&apos;ve met and which you haven&apos;t. If you
                complete three of the four during your course, that progress stays with you. You
                come back to finish the fourth on a follow-up day, with us or with any AIDA
                instructor worldwide.
              </p>
              <p className="text-base text-salt/75 leading-relaxed mb-6">
                The AIDA standard gives you up to{" "}
                <strong className="text-salt font-medium">12 months</strong> from your last signed
                skill to complete the remaining requirements — with us or with any AIDA instructor
                worldwide, no redoing what you&apos;ve already passed. Most students who need a
                follow-up finish within a few weeks. The year window gives breathing room for life,
                travel, weather, schedule shifts.
              </p>
              <p className="text-base text-salt/75 leading-relaxed mb-8">
                Most students get everything in the standard 2.5 to 3 days. Some don&apos;t — and
                that&apos;s normal. There&apos;s no pressure to force a skill that isn&apos;t ready,
                no penalty for needing one more session, no expectation that you&apos;ll certify in a
                single weekend just because the schedule suggests you might.
              </p>
            </Reveal>
            <Reveal delay={200}>
              <div className="bg-sand/10 border-l-2 border-sand rounded-r-xl p-6 md:p-8">
                <p className="text-[11px] text-sand font-medium tracking-[0.15em] uppercase mb-3">
                  Three certification variants
                </p>
                <p className="text-sm text-salt/85 mb-3 leading-relaxed">
                  AIDA officially recognizes three AIDA 2 certifications based on what you complete:
                </p>
                <ul className="text-sm text-salt/85 mb-4 space-y-2 leading-relaxed list-disc list-inside">
                  <li>
                    <strong className="text-salt font-medium">AIDA 2 Freediver</strong> — the full
                    cert, both confined-water and depth requirements met
                  </li>
                  <li>
                    <strong className="text-salt font-medium">AIDA 2 Pool Freediver</strong> —
                    confined-water requirements met, depth not yet completed
                  </li>
                  <li>
                    <strong className="text-salt font-medium">AIDA 2 Depth Freediver</strong> —
                    depth requirement met, confined-water portion not yet complete
                  </li>
                </ul>
                <p className="text-sm text-salt/70 leading-relaxed">
                  Whichever partial cert you receive, you complete the remaining portion within 12
                  months and upgrade to the full AIDA 2 card. Most students who don&apos;t hit depth
                  on cert day get there within one or two additional sessions. Follow-up days are
                  $150 each, or join our Saturday Sessions once you have the partial cert and your
                  own gear. (The certs are named &quot;Pool&quot; and &quot;Depth&quot; in the AIDA
                  system — confined water can happen at the Shores when conditions allow.)
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── What this lets you do ── */}
        <section className="px-6 py-20 md:py-28">
          <div className="max-w-5xl mx-auto">
            <Reveal>
              <SectionLabel>After certification</SectionLabel>
              <h2 className="font-serif text-3xl md:text-5xl text-salt mt-4 mb-10">
                What the card lets you do.
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <div className="grid md:grid-cols-2 gap-x-12 gap-y-8 text-salt/70 leading-relaxed">
                <div>
                  <p className="font-serif text-xl text-salt mb-2">Globally recognized</p>
                  <p className="text-sm">
                    Honored by every AIDA-affiliated dive shop, club, and instructor in the world.
                    Line dives, dive shop rentals, group dives — wherever you travel.
                  </p>
                </div>
                <div>
                  <p className="font-serif text-xl text-salt mb-2">Eligible for AIDA 3</p>
                  <p className="text-sm">
                    The next step — depth to 24m, more sophisticated equalization, longer
                    performances. AIDA 2 is the prerequisite.
                  </p>
                </div>
                <div>
                  <p className="font-serif text-xl text-salt mb-2">Saturday Sessions</p>
                  <p className="text-sm">
                    Open to AIDA 2 Freedivers with their own gear, lanyard, and dive computer. The
                    LJFC weekly ocean session at La Jolla Shores.
                  </p>
                </div>
                <div>
                  <p className="font-serif text-xl text-salt mb-2">Spearfishing, safer</p>
                  <p className="text-sm">
                    The safety curriculum is the missing piece for most self-taught spearos — buddy
                    protocols, surface intervals, breath-hold management.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── Prerequisites & Bring ── */}
        <section className="px-6 py-20 md:py-28 bg-ocean/20">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
            <Reveal>
              <SectionLabel>Prerequisites</SectionLabel>
              <h2 className="font-serif text-2xl md:text-3xl text-salt mt-4 mb-6">Is this for you?</h2>
              <ul className="space-y-3 text-sm text-salt/70 leading-relaxed">
                <li>
                  <strong className="text-salt font-medium">Swim 200m</strong> non-stop without fins,
                  or 300m with mask/fins/snorkel
                </li>
                <li>
                  <strong className="text-salt font-medium">18 or older</strong> (16 or 17 with
                  written parent/guardian consent)
                </li>
                <li>
                  <strong className="text-salt font-medium">No serious medical contraindications</strong>{" "}
                  — full AIDA Medical Statement completed before course day
                </li>
                <li>No prior freediving experience required</li>
              </ul>
            </Reveal>

            <Reveal delay={100}>
              <SectionLabel>What you bring</SectionLabel>
              <h2 className="font-serif text-2xl md:text-3xl text-salt mt-4 mb-6">
                Gear and the practical kit.
              </h2>
              <p className="text-sm text-salt/70 leading-relaxed mb-4">
                Your own mask, snorkel, and fins if you have them. Wetsuit, weight belt, and lanyard
                rentals available — sized to you and coordinated by email after booking.
              </p>
              <p className="text-sm text-salt/70 leading-relaxed">
                Towels, warm layers, sun protection, hydration, snacks. Notebook for theory. Photo
                ID for cert paperwork.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ── Medical screening ── */}
        <section className="px-6 py-20 md:py-28">
          <div className="max-w-4xl mx-auto">
            <Reveal>
              <SectionLabel>Medical Screening</SectionLabel>
              <h2 className="font-serif text-3xl md:text-5xl text-salt mt-4 mb-6">
                How we screen for medical safety.
              </h2>
              <p className="text-base text-salt/70 leading-relaxed max-w-3xl mb-10">
                Freediving puts real demands on your cardiovascular, respiratory, and ear/sinus
                systems. AIDA&apos;s job — and ours — is to make sure those demands are safe for you
                specifically. The standard tool is the{" "}
                <a
                  href="https://aida.medical.tilda.ws/"
                  target="_blank"
                  rel="noopener"
                  className="text-seafoam underline-offset-2"
                >
                  AIDA Medical Statement
                </a>{" "}
                — 11 questions you answer honestly before any in-water training. We send it in your
                booking confirmation; you complete it before course day.
              </p>
            </Reveal>

            <Reveal delay={100}>
              <div className="bg-ocean/30 border border-teal/15 rounded-2xl p-6 md:p-8 mb-10">
                <p className="text-[11px] text-teal/70 font-medium tracking-[0.15em] uppercase mb-4">
                  What we ask about
                </p>
                <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2 text-sm text-salt/75">
                  <ul className="space-y-1.5">
                    <li>1. Regular medications</li>
                    <li>2. Mental and mood conditions</li>
                    <li>3. Neurological — seizures, blackouts, migraines</li>
                    <li>4. Cardiovascular — heart, blood pressure, pacemaker</li>
                    <li>5. Pulmonary — asthma, lung function</li>
                    <li>6. Ear, nose, throat — sinuses, eardrums, hearing</li>
                  </ul>
                  <ul className="space-y-1.5">
                    <li>7. Eye conditions, eye surgery</li>
                    <li>8. Diabetes</li>
                    <li>9. Prior diving accidents</li>
                    <li>
                      10. General conditions affecting judgment under physical or emotional stress
                    </li>
                    <li>11. Pregnancy</li>
                  </ul>
                </div>
              </div>
            </Reveal>

            <Reveal delay={150}>
              <div className="bg-sand/10 border-l-2 border-sand rounded-r-xl p-6 mb-10">
                <p className="text-[11px] text-sand font-medium tracking-[0.15em] uppercase mb-3">
                  &quot;Yes&quot; doesn&apos;t mean disqualified
                </p>
                <p className="text-base text-salt mb-3 leading-relaxed">
                  A YES to any question triggers a physician review — not an automatic
                  disqualification.
                </p>
                <p className="text-sm text-salt/70 leading-relaxed">
                  Your doctor signs the form stating they find no medical conditions incompatible
                  with freediving, or they decline to recommend you. Most students with mild,
                  controlled, or seasonal conditions get cleared without difficulty.
                </p>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="grid md:grid-cols-2 gap-10 mb-10">
                <div>
                  <p className="text-[11px] text-seafoam/80 font-medium tracking-[0.15em] uppercase mb-4">
                    Usually workable with planning
                  </p>
                  <ul className="space-y-2 text-sm text-salt/75 leading-relaxed">
                    <li>· Seasonal allergies (pre-treat in the days before)</li>
                    <li>· Mild, controlled asthma (with physician sign-off)</li>
                    <li>· Sinus issues — time the dive day, plan equalization</li>
                    <li>· Past ear infections, fully resolved</li>
                    <li>· Most routine prescriptions</li>
                    <li>· Mild, controlled hypertension</li>
                    <li>· Corrected vision (contacts/glasses; LASIK with clearance)</li>
                  </ul>
                </div>
                <div>
                  <p className="text-[11px] text-coral/80 font-medium tracking-[0.15em] uppercase mb-4">
                    Generally incompatible with breath-hold diving
                  </p>
                  <ul className="space-y-2 text-sm text-salt/75 leading-relaxed">
                    <li>· Severe, uncontrolled asthma or COPD</li>
                    <li>· Recent heart attack, unstable arrhythmia, BP &gt; 160/90</li>
                    <li>· Active seizure disorder</li>
                    <li>· History of significant blackout or diving accident</li>
                    <li>· Pregnancy</li>
                    <li>· Recent ear or sinus surgery without specialist clearance</li>
                    <li>· Type 1 diabetes without stable control</li>
                    <li>· Perforated eardrum, untreated</li>
                  </ul>
                </div>
              </div>
            </Reveal>

            <Reveal delay={250}>
              <p className="text-sm text-salt/60 leading-relaxed max-w-3xl">
                <strong className="text-salt font-medium">If you&apos;re unsure</strong>, reach out
                before you book. A short conversation upfront saves the surprise of finding out the
                day before the course. Most concerns resolve with a physician note. For complex
                cases, DAN maintains a network of physicians familiar with diving medicine —{" "}
                <a
                  href="https://dan.org/find-a-doctor/"
                  target="_blank"
                  rel="noopener"
                  className="text-seafoam underline-offset-2"
                >
                  dan.org/find-a-doctor
                </a>
                .
              </p>
            </Reveal>
          </div>
        </section>

        {/* ── How to prepare ── */}
        <section className="px-6 py-20 md:py-28">
          <div className="max-w-3xl mx-auto">
            <Reveal>
              <SectionLabel>How to prepare</SectionLabel>
              <h2 className="font-serif text-3xl md:text-5xl text-salt mt-4 mb-8">
                Four weeks of low-volume prep makes everything easier.
              </h2>
              <p className="text-base text-salt/70 leading-relaxed mb-6">
                The single biggest predictor of how well you do on AIDA 2 isn&apos;t fitness. It&apos;s
                arriving rested and comfortable with Frenzel equalization. Those two things compound.
              </p>
              <p className="text-base text-salt/70 leading-relaxed mb-8">
                The full plan is in our{" "}
                <Link
                  href="/blog/how-to-prepare-for-aida-2-san-diego-4-week-plan"
                  className="text-seafoam underline-offset-2"
                >
                  4-Week AIDA 2 Prep Guide
                </Link>
                , but the headlines:
              </p>
              <ol className="space-y-3 text-sm text-salt/70 leading-relaxed list-decimal list-inside">
                <li>
                  <strong className="text-salt font-medium">Week 1:</strong> get comfortable with the
                  200m swim
                </li>
                <li>
                  <strong className="text-salt font-medium">Week 2:</strong> learn Frenzel
                  equalization on land + practice diaphragmatic breathing
                </li>
                <li>
                  <strong className="text-salt font-medium">Week 3:</strong> build a 90s–2:00 static
                  hold lying down (never near water alone)
                </li>
                <li>
                  <strong className="text-salt font-medium">Week 4:</strong> taper, rest, arrive
                  fresh
                </li>
              </ol>
            </Reveal>
          </div>
        </section>

        {/* ── About instructor + Safety ── */}
        <section className="px-6 py-20 md:py-28 bg-ocean/20">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
            <Reveal>
              <SectionLabel>Your instructor</SectionLabel>
              <h2 className="font-serif text-2xl md:text-3xl text-salt mt-4 mb-6">
                Joshua Beneventi
              </h2>
              <p className="text-sm text-salt/70 leading-relaxed mb-4">
                AIDA Instructor · AIDA Youth Instructor · AIDA 4 Master Freediver. San Diego&apos;s only
                AIDA-certified instructor for both adults and youth.{" "}
                <a
                  href="https://dan.org/"
                  target="_blank"
                  rel="noopener"
                  className="text-seafoam underline-offset-2"
                >
                  DAN
                </a>{" "}
                Professionally Insured. Current{" "}
                <a
                  href="https://www.redcross.org/take-a-class/cpr"
                  target="_blank"
                  rel="noopener"
                  className="text-seafoam underline-offset-2"
                >
                  Red Cross
                </a>{" "}
                Adult &amp; Pediatric First Aid/CPR/AED.
              </p>
              <p className="text-sm text-salt/70 leading-relaxed mb-4">
                Training lineage: Stella Abbas (Freedive Tioman, Malaysia) → Pieter Van Veen (Dahab,
                Egypt) → Harry Chamas (Freedive Passion, La Ventana, Mexico) → Khaled El Gammal
                (Dahab, Egypt) for AIDA 4 and the Instructor + Youth Instructor courses.
              </p>
              <Link href="/about" className="text-sm text-seafoam underline-offset-2">
                More about Joshua →
              </Link>
            </Reveal>

            <Reveal delay={100}>
              <SectionLabel>Safety</SectionLabel>
              <h2 className="font-serif text-2xl md:text-3xl text-salt mt-4 mb-6">
                How the course is run.
              </h2>
              <ul className="space-y-3 text-sm text-salt/70 leading-relaxed">
                <li>
                  <strong className="text-salt font-medium">Tighter than required ratios</strong> — AIDA
                  mandates 4:1 in open water; we run closer to 2:1
                </li>
                <li>
                  <strong className="text-salt font-medium">No hyperventilation, ever</strong> — the
                  single most dangerous habit in freediving
                </li>
                <li>
                  <strong className="text-salt font-medium">Buddy protocols on every dive</strong> —
                  one up, one down, surface watch
                </li>
                <li>
                  <strong className="text-salt font-medium">DAN-stocked O2 + first aid kit</strong> on
                  site for every water day
                </li>
                <li>
                  <strong className="text-salt font-medium">Written Emergency Action Plan</strong> — AIDA-mandated; locations of nearest hospital (UCSD), nearest hyperbaric facility, lifeguard tower contact, evacuation route
                </li>
                <li>
                  <strong className="text-salt font-medium">Medical screening upfront</strong> —
                  conditions get a conversation, sometimes a physician sign-off
                </li>
              </ul>
            </Reveal>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="px-6 py-20 md:py-28">
          <div className="max-w-3xl mx-auto">
            <Reveal>
              <SectionLabel>Common Questions</SectionLabel>
              <h2 className="font-serif text-3xl md:text-5xl text-salt mt-4 mb-10">
                What students usually ask.
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <div className="space-y-6">
                <FaqItem
                  q="Do I need to know how to freedive already?"
                  a="No. AIDA 2 is the typical entry-level cert. You don't need AIDA 1 or any prior certification. The course assumes you're starting from scratch."
                />
                <FaqItem
                  q="Does the confined-water portion have to be in a pool?"
                  a="No. AIDA's standard is 'confined water,' which includes calm shallow ocean. When La Jolla Shores has small surf and light wind, we run the confined-water sessions in chest-deep water at the beach instead of driving to a pool. Pool fallback is used when surf or wind makes the Shores impractical."
                />
                <FaqItem
                  q="What if I'm a strong swimmer but I've never freedived?"
                  a="Perfect candidate. Most students arrive in exactly that profile."
                />
                <FaqItem
                  q="How cold is the water?"
                  a="La Jolla Shores runs about 60°F in winter and 70°F in summer. A 5mm wetsuit handles year-round comfortably."
                />
                <FaqItem
                  q="Do you have rentals?"
                  a="Yes. Fins, wetsuit, weight belt, and lanyard are available as rentals. Coordinated by email after booking, sized to you."
                />
                <FaqItem
                  q="What if I have allergies or sinus issues on course day?"
                  a="Plan ahead — pre-treat with your usual nasal spray or antihistamine in the days leading up. Many students with seasonal allergies certify without difficulty."
                />
                <FaqItem
                  q="What if I have to cancel or reschedule?"
                  a="48-hour notice for reschedule (no penalty). Cancellations with less than 48 hours' notice forfeit the deposit. Cancellations with more than 7 days' notice receive a full refund."
                />
                <FaqItem
                  q="Is freediving safe?"
                  a="Done with proper AIDA training, buddy protocols, direct supervision, and surface support — yes. Risk comes from diving alone, exceeding training, hyperventilating, or skipping safety protocols. Your AIDA 2 course is specifically designed to give you the tools to manage these risks."
                />
                <FaqItem
                  q="Does the certification expire?"
                  a="No. AIDA certifications never expire. Your card is registered permanently in the AIDA EOS system."
                />
                <FaqItem
                  q="What's the next step after AIDA 2?"
                  a="AIDA 3 Advanced Freediver — depth to 24m, more sophisticated equalization, longer confined-water performances, and the introduction of free-fall. The natural progression for anyone who finds AIDA 2 captures their interest."
                />
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="px-6 py-20 md:py-28 bg-ocean/30">
          <div className="max-w-3xl mx-auto text-center">
            <Reveal>
              <SectionLabel>Ready when you are</SectionLabel>
              <h2 className="font-serif text-3xl md:text-5xl text-salt mt-4 mb-10 leading-[1.1]">
                Let&apos;s find a window that works.
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link
                  href="/contact/courses?course=aida-2"
                  className="inline-block px-8 py-3 bg-coral text-salt rounded-full font-medium text-sm hover:bg-coral/90 transition-colors no-underline"
                >
                  Inquire about course dates →
                </Link>
                <a
                  href="/api/guide-pdf?course=aida-2"
                  className="inline-block px-8 py-3 bg-transparent text-salt border border-salt/30 rounded-full font-medium text-sm hover:border-salt/60 transition-colors no-underline"
                >
                  Download as PDF
                </a>
                <Link
                  href="/calendar"
                  className="inline-block px-8 py-3 bg-transparent text-salt/60 border border-salt/15 rounded-full font-medium text-sm hover:text-salt transition-colors no-underline"
                >
                  See course calendar
                </Link>
              </div>
            </Reveal>
            <Reveal delay={200}>
              <p className="text-[10px] text-salt/30 mt-10 tracking-[0.15em] uppercase">
                Standards verified against aidainternational.org · Manual: AIDA 2 v2.0 (2025)
              </p>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
