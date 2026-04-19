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
          <span className="camp-nav-sub">La Jolla Freedive Club</span>
        </Link>
        <div className="camp-nav-right">
          <Link href="/" className="camp-nav-home">LJFC Home</Link>
          <a href="#sessions" className="camp-nav-cta">Reserve a Spot</a>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="camp-hero">
        <div className="camp-hero-fish camp-fish-swim" aria-hidden="true">
          <img src="/images/camp/gary-fancy.png" alt="" width={140} height={140} style={{ display: "block" }} />
        </div>
        <div className="camp-hero-content">
          <span className="eyebrow camp-fade-1">Ages 8–14 · La Jolla Shores · Summer 2026</span>
          <h1 className="camp-fade-2">The ocean camp that starts from the <em>inside out.</em></h1>
          <p className="camp-hero-sub camp-fade-3">Breath skills, ocean wonder, real freediving. Kids leave calmer, more curious, and more at home in the water.</p>
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
                Camp Garibaldi builds <em>competence</em> — the kind that lasts.
              </p>
              <p className="camp-gap-sub" style={{ marginTop: "1rem" }}>
                The difference: a child who&apos;s been near the ocean versus a child who knows how to <strong>read conditions, manage their breath, and make their own go/no-go call</strong>. That&apos;s a skill set for life. And along the way, kids have the summer of their lives.
              </p>
            </div>
            <div>
              <div className="camp-gap-stats">
                <div className="camp-gap-stat">
                  <div className="camp-gap-stat-num" style={{ color: "var(--garibaldi-lt)" }}>6:1</div>
                  <div className="camp-gap-stat-label">Max ratio<br />in the water</div>
                </div>
                <div className="camp-gap-stat">
                  <div className="camp-gap-stat-num" style={{ color: "#7DD8F0" }}>90+</div>
                  <div className="camp-gap-stat-label">Species documented<br />in the reserve</div>
                </div>
                <div className="camp-gap-stat">
                  <div className="camp-gap-stat-num" style={{ color: "var(--garibaldi-lt)" }}>10–35 ft</div>
                  <div className="camp-gap-stat-label">Supervised<br />depth range</div>
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
              <img src="/images/photos/joshua-teaching-kids.jpg" alt="Pre-dive briefing at the pool — breathing and equalization practice" />
            </div>
            <div className="camp-photo-cell">
              <img src="/images/photos/birch-child-pointing.jpg" alt="Spotting species at the Birch Aquarium" />
            </div>
            <div className="camp-photo-cell">
              <img src="/images/photos/joshua-two-kids-pool.jpg" alt="First equalization practice in the pool" />
            </div>
            <div className="camp-photo-cell">
              <img src="/images/photos/joshua-kid-beach.jpg" alt="Gearing up at La Jolla Shores" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── WHAT KIDS LOVE ─── */}
      <section className="camp-kids-love">
        <div className="camp-container-narrow">
          <p className="camp-kids-love-text">
            <em>Kids love the first time they equalize and feel the pressure click. The garibaldi that follows them around like a puppy. Finding a nudibranch no adult saw. Showing their parents a species they identified themselves. This is the stuff they&apos;ll still be telling stories about at Thanksgiving.</em>
          </p>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="camp-method camp-section" id="how-it-works">
        <div className="camp-container">
          <div className="camp-method-header">
            <span className="eyebrow">How It Works</span>
            <h2>Breath first. Water second. <em>Ocean after.</em></h2>
            <p>Every session starts on land — breathing, conditions briefings, dive reflex experiments. By the time kids enter the water, they already have the tools to handle what they find there.</p>
          </div>
          <div className="camp-method-cards">
            <div className="camp-method-card">
              <div className="camp-method-num">01</div>
              <h3>Breath &amp; composure</h3>
              <p>Diaphragmatic breathing, calm-body cues, the mammalian dive reflex — kids learn how to settle before they&apos;re asked to trust the water. On Day 1 they feel their own body respond to a cold cloth on the face — the same reflex seals and whales use.</p>
            </div>
            <div className="camp-method-card">
              <div className="camp-method-num">02</div>
              <h3>From pool to reserve</h3>
              <p>Pool to shallows to open water. Every step builds on demonstrated competence, not just courage. Mixed-age groups (8–14) work at their own depth — no one gets pushed past their edge.</p>
            </div>
            <div className="camp-method-card">
              <div className="camp-method-num">03</div>
              <h3>Read the ocean like a local</h3>
              <p>Students pull live Scripps buoy data every morning — wave height, tide, water temperature. By Day 5, they make the go/no-go call themselves and explain why.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── THE WEEK ─── */}
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
            All sessions 9am–3pm · Ages 8–14 · Field journal included<br />
            <span style={{ fontStyle: "italic", fontSize: "0.68rem" }}>Sample curriculum — actual content varies with conditions, group readiness, and site.</span>
          </p>
        </div>
      </section>

      {/* ─── SESSIONS / PRICING ─── */}
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
              <p>There&apos;s a difference between a child who&apos;s safe because someone&apos;s watching, and a child who&apos;s safe because she understands the ocean well enough to make good decisions in it for the rest of her life. Both matter. We do both.</p>
              <p>Students leave knowing how to read a marine forecast, how their body responds to cold water and depth, and how to assess conditions before they enter. That&apos;s a skill set — not a safety rule.</p>
              <div className="camp-creds">
                <span className="camp-cred">AIDA Instructor</span>
                <span className="camp-cred">AIDA Youth Instructor</span>
                <span className="camp-cred">DAN Professional Liability</span>
                <span className="camp-cred">ARC Pediatric First Aid/CPR/AED</span>
                <span className="camp-cred">6:1 Max Water Ratio</span>
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
              <p>Weekly open-water sessions at the canyon. Free with Ocean Flow, $25 drop-in. Camp alumni always welcome.</p>
            </div>
            <div className="camp-community-item">
              <h3>The Pipeline</h3>
              <p>Graduates aged 13–14 are eligible for Discover Freediving (AIDA 1). From ocean camp to international certification — one path deeper.</p>
            </div>
            <div className="camp-community-item">
              <h3>Citizen Science</h3>
              <p>Every species observed is logged to iNaturalist with GPS coordinates. Campers become published contributors to the La Jolla marine record.</p>
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
