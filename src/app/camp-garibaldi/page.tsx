import type { Metadata } from "next";
import Link from "next/link";
import CampScheduleTabsLight from "./CampScheduleTabsLight";
import CampDayRhythm from "./CampDayRhythm";
import CampFAQ from "./CampFAQ";
import FloatingFish from "./FloatingFish";
import "./camp-styles.css";

export const metadata: Metadata = {
  title: "Camp Garibaldi — Ocean Camp for Kids | La Jolla Freedive Club",
  description:
    "A week-long ocean camp at La Jolla Shores teaching kids ages 8–14 real water skills — freediving, surf survival, and ocean confidence — through breath-first training.",
};

export default function CampGaribaldiPage() {
  return (
    <div className="camp-page">
      {/* ─── NAV ─── */}
      <nav className="camp-nav">
        <Link href="/camp-garibaldi" className="camp-nav-brand">
          <img src="/images/camp/cg-logo.svg" alt="Camp Garibaldi" className="camp-nav-logo" />
        </Link>
        <a href="#sessions" className="camp-nav-cta">Reserve a Spot</a>
      </nav>

      {/* ─── HERO ─── */}
      <section className="camp-hero">
        <div className="camp-hero-fish camp-fish-swim" aria-hidden="true">
          <img src="/images/camp/gary-fancy.png" alt="" width={140} height={140} style={{ display: "block" }} />
        </div>
        <div className="camp-hero-content">
          <span className="eyebrow camp-fade-1">Ages 8–14 · La Jolla Shores · Summer 2026</span>
          <h1 className="camp-fade-2">The ocean camp that starts from the <em>inside out.</em></h1>
          <p className="camp-hero-sub camp-fade-3">Breath skills, ocean reading, real freediving. Small groups at the marine reserve with an internationally certified instructor.</p>
          <div className="camp-pills camp-fade-3">
            <span className="camp-pill"><span className="camp-pill-dot" />Small groups</span>
            <span className="camp-pill"><span className="camp-pill-dot" />Ages 8–14</span>
            <span className="camp-pill"><span className="camp-pill-dot" />La Jolla Shores</span>
          </div>
          <div className="camp-hero-actions camp-fade-4">
            <a href="#sessions" className="camp-btn-primary camp-glow">See Dates &amp; Pricing →</a>
            <a href="#the-week" className="camp-btn-ghost">See the week</a>
          </div>
        </div>
      </section>

      {/* ─── TRUST STRIP ─── */}
      <div className="camp-trust">
        <div className="camp-trust-items">
          <span className="camp-trust-item"><span className="camp-trust-dot" />AIDA Instructor &amp; Youth Instructor</span>
          <span className="camp-trust-item"><span className="camp-trust-dot" />DAN Insured</span>
          <span className="camp-trust-item"><span className="camp-trust-dot" />Red Cross First Aid / CPR / AED</span>
          <span className="camp-trust-item"><span className="camp-trust-dot" />DOJ Background Checked</span>
          <span className="camp-trust-item"><span className="camp-trust-dot" />Inside the Matlahuayl Marine Reserve</span>
        </div>
      </div>

      {/* ─── GAP ─── */}
      <section className="camp-gap">
        <div className="camp-container">
          <div className="camp-gap-grid">
            <div>
              <p className="camp-gap-statement">
                Most ocean programs give kids <em>exposure.</em><br />
                Camp Garibaldi gives kids <em>competence.</em>
              </p>
              <p className="camp-gap-sub" style={{ marginTop: "1rem" }}>
                The difference: a child who&apos;s been near the ocean versus a child who knows how to <strong>read conditions, manage their breath, and make their own go/no-go call</strong>. That&apos;s a skill set for life — not a summer memory.
              </p>
            </div>
            <div>
              <div className="camp-gap-stats">
                <div className="camp-gap-stat">
                  <div className="camp-gap-stat-num" style={{ color: "var(--garibaldi-lt)" }}>25%</div>
                  <div className="camp-gap-stat-label">Heart rate drop<br />from dive reflex</div>
                </div>
                <div className="camp-gap-stat">
                  <div className="camp-gap-stat-num" style={{ color: "#7DD8F0" }}>15+</div>
                  <div className="camp-gap-stat-label">Marine species<br />observed per session</div>
                </div>
                <div className="camp-gap-stat">
                  <div className="camp-gap-stat-num" style={{ color: "var(--garibaldi-lt)" }}>50+</div>
                  <div className="camp-gap-stat-label">Species in the<br />La Jolla reserve</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PHOTO GRID ─── */}
      <section className="camp-photos">
        <div className="camp-container">
          <div className="camp-photo-grid">
            <div className="camp-photo-cell">
              <img src="/images/photos/joshua-teaching-kids.jpg" alt="Joshua briefing two students poolside before a training session" />
            </div>
            <div className="camp-photo-cell">
              <img src="/images/photos/birch-child-pointing.jpg" alt="Child pointing at fish in the Birch Aquarium tank" />
            </div>
            <div className="camp-photo-cell">
              <img src="/images/photos/joshua-two-kids-pool.jpg" alt="Poolside briefing with students in wetsuits" />
            </div>
            <div className="camp-photo-cell">
              <img src="/images/photos/joshua-kid-beach.jpg" alt="Student in full gear ready for the ocean with instructor" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="camp-method camp-section" id="how-it-works">
        <div className="camp-container">
          <div className="camp-method-header">
            <span className="eyebrow">How It Works</span>
            <h2>Breath first. Water second. <em>Ocean after.</em></h2>
            <p>Every session starts on land — breathing drills, conditions briefings, dive reflex experiments. By the time kids enter the water, they already have the tools to handle what they find there.</p>
          </div>
          <div className="camp-method-cards">
            <div className="camp-method-card">
              <div className="camp-method-num">01</div>
              <h3>Breath &amp; composure</h3>
              <p>Diaphragmatic breathing, CO₂ tolerance, the mammalian dive reflex — kids learn to manage their nervous system before they&apos;re asked to trust the ocean. They measure their own heart rate response on Day 1.</p>
            </div>
            <div className="camp-method-card">
              <div className="camp-method-num">02</div>
              <h3>Progressive water entry</h3>
              <p>Pool to shallows to open water. Every step builds on demonstrated competence, not just courage. Mixed-age groups (8–14) work at their own depth with differentiated instruction — no one gets pushed past their edge.</p>
            </div>
            <div className="camp-method-card">
              <div className="camp-method-num">03</div>
              <h3>Read the ocean like a local</h3>
              <p>Students pull live Scripps buoy data every morning — wave height, tide, water temperature. By Day 5, they make the go/no-go call themselves and justify it in their observation journal.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── THE WEEK (moved before Sessions) ─── */}
      <section className="camp-week camp-section" id="the-week">
        <div className="camp-container">
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.75rem", flexWrap: "wrap" }}>
            <span className="eyebrow" style={{ marginBottom: 0 }}>The Program</span>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(1.4rem, 2.2vw, 1.9rem)", color: "var(--ink)", margin: 0 }}>What a week looks like.</h2>
            <span style={{ padding: "0.25rem 0.7rem", background: "rgba(26,127,168,0.08)", border: "1px solid rgba(26,127,168,0.14)", borderRadius: "99px", fontSize: "0.68rem", fontWeight: 500, color: "var(--ink-light)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Sample Curriculum</span>
          </div>
          <CampScheduleTabsLight />
          <CampDayRhythm />
          <p style={{ fontSize: "0.74rem", color: "var(--ink-faint)", marginTop: "1.25rem", lineHeight: 1.6, textAlign: "center" }}>
            All sessions 9am–3pm · Ages 8–14 · Student observation journal included<br />
            <span style={{ fontStyle: "italic", fontSize: "0.68rem" }}>Sample curriculum — actual content varies with conditions, group readiness, and site.</span>
          </p>
        </div>
      </section>

      {/* ─── SESSIONS / PRICING (moved after The Week) ─── */}
      <section className="camp-sessions camp-section" id="sessions">
        <div className="camp-container">
          <div className="camp-sessions-header">
            <span className="eyebrow">Summer 2026</span>
            <h2>Camp Dates &amp; Pricing</h2>
            <p>Small groups by design. Reserve early — spots are limited.</p>
          </div>
          <div className="camp-sessions-grid">
            <div className="camp-session-card">
              <div className="camp-session-tag">Session I · June</div>
              <div className="camp-session-date">Jun 15–17</div>
              <div className="camp-session-type">3-day immersion · Mon–Wed</div>
              <div className="camp-session-price">$450</div>
              <Link href="/camp-garibaldi/register?session=june" className="camp-session-cta outline">Reserve →</Link>
            </div>
            <div className="camp-session-card featured">
              <div className="camp-session-tag">Session II · July · Peak Season</div>
              <div className="camp-session-date">Jul 13–17</div>
              <div className="camp-session-type">5-day full week · Mon–Fri</div>
              <div className="camp-session-price">$750</div>
              <Link href="/camp-garibaldi/register?session=july" className="camp-session-cta">Reserve →</Link>
            </div>
            <div className="camp-session-card">
              <div className="camp-session-tag">Session III · August</div>
              <div className="camp-session-date">Aug 10–12</div>
              <div className="camp-session-type">3-day immersion · Mon–Wed</div>
              <div className="camp-session-price">$450</div>
              <Link href="/camp-garibaldi/register?session=august" className="camp-session-cta outline">Reserve →</Link>
            </div>
          </div>
          <p style={{ fontSize: "0.76rem", color: "var(--ink-faint)", textAlign: "center", lineHeight: 1.6 }}>
            All sessions 9am–3pm · Ages 8–14 · Small groups · La Jolla Shores
          </p>
        </div>
      </section>

      {/* ─── SAFETY ─── */}
      <section className="camp-safety camp-section">
        <div className="camp-container">
          <div className="camp-safety-grid">
            <div>
              <span className="eyebrow" style={{ color: "rgba(125,216,240,0.5)" }}>Safety</span>
              <h2>Safety isn&apos;t supervision. It&apos;s <em>knowledge.</em></h2>
              <p>There&apos;s a difference between a child who won&apos;t drown today and a child who understands the ocean well enough to make good decisions in it for the rest of their life.</p>
              <p>Students leave knowing how to read a marine forecast, how their body responds to cold water and depth, and how to assess conditions before they enter. That&apos;s a skill set — not a safety rule.</p>
              <div className="camp-creds">
                <span className="camp-cred">AIDA Instructor</span>
                <span className="camp-cred">AIDA Youth Instructor</span>
                <span className="camp-cred">DAN Professional Liability</span>
                <span className="camp-cred">ARC Pediatric First Aid/CPR/AED</span>
                <span className="camp-cred">Small Groups</span>
                <span className="camp-cred">DOJ Background Checked</span>
              </div>
            </div>
            <div className="camp-safety-cards">
              <div className="camp-safety-card">
                <div className="val">AIDA certified</div>
                <div className="lbl">International freediving instruction — adult &amp; youth specializations</div>
              </div>
              <div className="camp-safety-card">
                <div className="val">DAN insured</div>
                <div className="lbl">Divers Alert Network professional liability coverage</div>
              </div>
              <div className="camp-safety-card">
                <div className="val">La Jolla Shores</div>
                <div className="lbl">Sandy entry, gradual slope, lifeguard coverage year-round</div>
              </div>
              <div className="camp-safety-card">
                <div className="val">Known site</div>
                <div className="lbl">Weekly sessions at the same location — we know every depth zone and current pattern</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── INSTRUCTOR ─── */}
      <section className="camp-instructor">
        <div className="camp-instructor-card">
          <div className="camp-instructor-avatar">
            <img src="/images/photos/joshua-red-sea.jpg" alt="Joshua Beneventi" />
          </div>
          <div>
            <span className="eyebrow">Lead Instructor</span>
            <div className="camp-instructor-name">Joshua Beneventi</div>
            <div className="camp-instructor-roles">AIDA Instructor · AIDA Youth Instructor · AIDA 4 Freediver · UCSD Alumnus</div>
            <p className="camp-instructor-body">
              Joshua&apos;s great-grandfather was an Azorean whaler who settled in San Diego for tuna fishing. His grandfather freedived for abalone in La Jolla. He&apos;s the founder of La Jolla Freedive Club and San Diego&apos;s only AIDA-certified freediving instructor for both adults and kids.
            </p>
            <p className="camp-instructor-body">
              He trained across four countries — Malaysia, Egypt, Mexico, and the US — before bringing the certification home to the same coastline his family has worked for three generations. Camp Garibaldi is the youth expression of that lineage.
            </p>
          </div>
        </div>
        <div className="camp-instructor-card" style={{ marginTop: "2.5rem" }}>
          <div className="camp-instructor-avatar" style={{ borderColor: "rgba(42,168,154,0.2)" }}>
            <img src="/images/photos/joshua-lena-shores.jpg" alt="Lena at La Jolla Shores" />
          </div>
          <div>
            <span className="eyebrow" style={{ color: "var(--teal)" }}>Ocean Flow Instructor &amp; Camp Liaison</span>
            <div className="camp-instructor-name">Lena</div>
            <div className="camp-instructor-roles">RYT Yoga Teacher · Freediver · LJFC Community Member · Homeschool Parent</div>
            <p className="camp-instructor-body">
              Lena runs Ocean Flow — the Saturday morning session at La Jolla Shores that anchors the LJFC community. She&apos;s been diving at the canyon long enough that she didn&apos;t just join the program, she helped shape it. Her son trained with Camp Garibaldi before the first session launched.
            </p>
            <p className="camp-instructor-body">
              As a homeschool parent, she&apos;s the first call for families with questions about the camp — what to expect, what kids need to bring, and what the week actually looks like day to day. <a href="/contact/camp" style={{ color: "var(--teal)", textDecoration: "none", borderBottom: "1px solid rgba(42,168,154,0.3)", fontWeight: 500 }}>Message Lena →</a>
            </p>
          </div>
        </div>
      </section>

      {/* ─── COMMUNITY ─── */}
      <section className="camp-community">
        <div className="camp-container">
          <div className="camp-community-header">
            <span className="eyebrow">Beyond the Week</span>
            <h2>Camp ends. The <em>community</em> doesn&apos;t.</h2>
            <p>Camp Garibaldi is a door into the La Jolla ocean community. Same kids show up Saturdays. Parents find each other. La Jolla Shores becomes theirs.</p>
          </div>
          <div className="camp-community-strip">
            <div className="camp-community-item">
              <h3>Saturday Sessions</h3>
              <p>Weekly open-water training at the canyon. Free with Ocean Flow, $25 drop-in. Camp alumni always welcome.</p>
            </div>
            <div className="camp-community-item">
              <h3>The Pipeline</h3>
              <p>Graduates aged 13–14 are eligible for Discover Freediving (AIDA 1). From ocean camp to international certification — one path deeper.</p>
            </div>
            <div className="camp-community-item">
              <h3>Citizen Science</h3>
              <p>Every species observed is logged to iNaturalist with GPS coordinates. Students become published citizen scientists.</p>
            </div>
            <div className="camp-community-item">
              <h3>Scholarship Access</h3>
              <p>We operate scholarship spots for families who live near the coast but haven&apos;t had access to what it offers.</p>
            </div>
          </div>
          <div className="camp-community-teaser">
            <p><strong>Coming Fall 2026:</strong> Monthly ocean immersions — sea lion pups in October, squid runs in November, gray whales in February. Every season teaches something different.</p>
            <Link href="/contact/camp?re=fall">Get notified →</Link>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <CampFAQ />

      {/* ─── FOOTER CTA ─── */}
      <section className="camp-footer-cta">
        <div className="camp-container-narrow">
          <div className="camp-fish-swim" style={{ display: "inline-block", marginBottom: "1.25rem", filter: "drop-shadow(0 4px 10px rgba(232,104,42,0.18))" }}>
            <img src="/images/camp/gary-fancy.png" alt="Gary the Garibaldi" width={80} height={80} />
          </div>
          <h2>Ready to go <em>deeper?</em></h2>
          <p>Small groups fill quickly. Reserve your student&apos;s spot — or reach out with questions.</p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/camp-garibaldi/register" className="camp-btn-primary">Reserve a Spot →</Link>
            <Link href="/contact/camp" className="camp-btn-ghost">Ask a question</Link>
            <Link href="/contact/camp" className="camp-btn-ghost">Talk to a parent</Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="camp-footer">
        <div className="camp-footer-inner">
          <span>Camp Garibaldi · a program of <Link href="/">La Jolla Freedive Club</Link> · La Jolla Shores, San Diego</span>
          <div className="camp-footer-links">
            <Link href="/programs">Programs</Link>
            <Link href="/conditions">Conditions</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
      </footer>

      <FloatingFish />
    </div>
  );
}
