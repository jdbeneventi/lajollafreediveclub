import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { EmailCapture } from "@/components/EmailCapture";
import { WeekendEmailForm } from "@/components/WeekendEmailForm";

/* ─── Data ─── */
const programs = [
  { id: "aida", title: "AIDA 2 Certification", meta: "2–3 days", desc: "The gold standard. Pool and open water training. Walk away certified to dive to 20m.", href: "/programs#aida2" },
  { id: "aida1", title: "AIDA 1 — Introduction", meta: "1 day", desc: "Your first day in freediving. Breathing, pool skills, your first real breath hold. Walk away certified.", href: "/programs#aida1" },
  { id: "group", title: "Group Ocean Sessions", meta: "Every Saturday", desc: "Weekly guided dives at La Jolla's best spots. Structured training with safety divers.", href: "/programs" },
  { id: "coaching", title: "Private Coaching", meta: "Flexible", desc: "Personalized training — competition prep, equalization, depth anxiety, accelerated cert.", href: "/programs" },
  { id: "camp", title: "Camp Garibaldi", meta: "Ages 8–16", desc: "Week-long ocean camp for kids. Freediving, surf survival, water confidence.", href: "/camp-garibaldi" },
];

const tools = [
  { href: "/conditions", icon: "🌊", title: "Live Conditions", desc: "AI visibility, swell, wind, water temp, dive grade. Updated every 10 min.", live: true },
  { href: "/map", icon: "🗺️", title: "Field Guide", desc: "10 dive sites, 50+ species, depth zones, night diving intel.", live: false },
  { href: "/tides", icon: "🌙", title: "Tides & Moon", desc: "7-day tides, best dive windows, moon phase, grunion alerts.", live: false },
  { href: "/gear", icon: "🤿", title: "Gear Guide", desc: "What to wear at every water temp. Masks, fins, weights, safety.", live: false },
];

const testimonials = [
  { text: "I came in terrified of deep water and left diving to 15 meters with a smile. The breathing work changed everything.", name: "Maria R.", role: "AIDA 2 Graduate" },
  { text: "The Saturday group dives are the highlight of my week. A crew that takes safety seriously but still makes it fun.", name: "David K.", role: "Club Member" },
  { text: "My son came back a different kid in the water. From nervous about waves to duck diving on his own.", name: "Jennifer T.", role: "Camp Garibaldi Parent" },
];

const blogPosts = [
  { slug: "beginners-guide-freediving-la-jolla", title: "The Complete Beginner's Guide to Freediving in La Jolla", category: "Guide", image: "/images/photos/joshua-brooke-kristina.jpg" },
  { slug: "mammalian-dive-reflex-explained", title: "The Mammalian Dive Reflex: Your Body's Built-In Superpower", category: "Science", image: "/images/photos/joshua-red-sea.jpg" },
  { slug: "best-freediving-spots-san-diego", title: "5 Best Freediving Spots in San Diego", category: "Local", image: "/images/photos/joshua-lena-shores.jpg" },
];

/* ─── Page ─── */
export default function Home() {
  return (
    <>
      {/* ═══ HERO — Full viewport, immersive ═══ */}
      <section className="relative min-h-[85vh] md:min-h-screen flex items-center md:items-end overflow-hidden">
        {/* BG layers */}
        <div className="absolute inset-0">
          <img src="/images/hero.jpg" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-deep via-deep/60 to-deep/30" />
        </div>

        {/* Grain overlay */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")" }} />

        {/* Content — bottom-aligned, left-heavy */}
        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-12 pt-24 md:pt-0 pb-10 md:pb-24">
          <div className="max-w-[720px] text-center md:text-left">
            <div className="flex items-center gap-3 mb-4 md:mb-6 animate-fade-up [animation-delay:0.2s]">
              <span className="w-2 h-2 rounded-full bg-seafoam animate-pulse-slow" />
              <span className="text-[11px] text-white/50 font-medium tracking-[0.2em] uppercase">La Jolla, California</span>
            </div>

            <h1 className="font-serif text-[clamp(2.4rem,6vw,5rem)] font-normal text-white leading-[1.02] tracking-[-0.02em] mb-4 md:mb-6 animate-fade-up [animation-delay:0.4s]">
              Breathe. Dive.<br />
              <span className="text-seafoam italic">Belong.</span>
            </h1>

            <p className="text-white/50 text-base md:text-xl leading-relaxed max-w-[520px] mb-6 md:mb-10 animate-fade-up [animation-delay:0.6s] mx-auto md:mx-0">
              San Diego&apos;s freediving community. AIDA certification, live ocean data, and a crew that dives every week.
            </p>

            <div className="flex gap-3 md:gap-4 flex-wrap justify-center md:justify-start animate-fade-up [animation-delay:0.8s]">
              <Link href="/programs" className="group inline-flex items-center gap-3 px-6 md:px-7 py-3 md:py-3.5 bg-coral text-white rounded-full font-medium text-[0.85rem] md:text-[0.9rem] no-underline hover:shadow-[0_8px_30px_rgba(199,91,58,0.5)] transition-all">
                View Courses
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link href="/conditions" className="inline-flex items-center gap-2 px-6 md:px-7 py-3 md:py-3.5 bg-white/[0.08] backdrop-blur-sm border border-white/[0.15] text-white rounded-full font-medium text-[0.85rem] md:text-[0.9rem] no-underline hover:bg-white/[0.15] transition-all">
                Today&apos;s Conditions
              </Link>
            </div>
          </div>

          {/* Stats strip */}
          <div className="hidden md:flex items-center gap-12 mt-16 pt-8 border-t border-white/[0.08] animate-fade-up [animation-delay:1s]">
            {[
              { value: "2026", label: "Founded" },
              { value: "AIDA", label: "Certified Instructor" },
              { value: "DAN", label: "Insured" },
              { value: "8–65+", label: "Ages we teach" },
            ].map((s) => (
              <div key={s.label}>
                <div className="font-serif text-2xl text-white/90 tracking-tight">{s.value}</div>
                <div className="text-[10px] text-white/30 tracking-[0.1em] uppercase mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Scroll indicator — mobile only */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 md:hidden">
          <div className="w-[1px] h-8 bg-white/20 animate-scroll-line" />
        </div>
      </section>
      <section className="bg-deep py-16 md:py-24 px-6 md:px-12 relative">
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")" }} />
        <div className="max-w-[1400px] mx-auto relative z-10">
          <Reveal>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-12">
              <div>
                <div className="text-[11px] text-seafoam/60 font-medium tracking-[0.2em] uppercase mb-3">Know the Water</div>
                <h2 className="font-serif text-[clamp(1.8rem,3.5vw,2.8rem)] text-white leading-[1.1] tracking-tight">
                  Tools we built for<br className="hidden md:block" /> La Jolla divers
                </h2>
              </div>
              <p className="text-white/35 text-sm max-w-[320px] leading-relaxed">
                Live ocean data, seasonal species tracking, and local knowledge — all free, updated daily.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {tools.map((tool, i) => (
              <Reveal key={tool.href} delay={i * 60}>
                <Link
                  href={tool.href}
                  className="group block bg-white/[0.04] border border-white/[0.06] rounded-xl p-5 md:p-6 no-underline hover:bg-white/[0.08] hover:border-white/[0.12] transition-all h-full"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">{tool.icon}</span>
                    {tool.live && (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-seafoam/10 rounded-full">
                        <span className="w-1 h-1 rounded-full bg-seafoam animate-pulse-slow" />
                        <span className="text-[9px] text-seafoam font-semibold">LIVE</span>
                      </span>
                    )}
                  </div>
                  <h3 className="text-white font-medium text-sm mb-1.5 group-hover:text-seafoam transition-colors">{tool.title}</h3>
                  <p className="text-white/30 text-xs leading-relaxed">{tool.desc}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ INTRO — Asymmetric, photo-heavy ═══ */}
      <section className="bg-salt py-16 md:py-28 px-6 md:px-12 relative overflow-hidden">
        {/* Grain */}
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")" }} />

        <div className="max-w-[1400px] mx-auto relative z-10">
          <div className="grid md:grid-cols-[1.1fr_1fr] gap-10 md:gap-20 items-center">
            <Reveal>
              <div className="relative">
                <div className="rounded-2xl overflow-hidden aspect-[4/5] md:aspect-[3/4]">
                  <img src="/images/photos/ljfc-crew-lunch.jpg" alt="La Jolla Freedive Club crew after a Saturday session" className="w-full h-full object-cover" />
                </div>
                {/* Overlapping stat card */}
                <div className="absolute -bottom-6 -right-4 md:-right-8 bg-deep text-white px-6 py-4 rounded-xl shadow-[0_20px_60px_rgba(11,29,44,0.3)]">
                  <div className="font-serif text-3xl md:text-4xl leading-none">70%</div>
                  <div className="text-[10px] text-white/50 mt-1 tracking-wide">had never freedived<br />before joining</div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <div className="md:py-8">
                <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-4">Why We Exist</div>
                <h2 className="font-serif text-[clamp(2rem,3.5vw,3rem)] leading-[1.1] tracking-tight mb-6">
                  The ocean is better<br />with a crew
                </h2>
                <p className="text-[#5a6a7a] text-[0.95rem] leading-[1.8] mb-8">
                  La Jolla Freedive Club is more than courses and certifications. We&apos;re a community
                  of ocean people — from first-timers to experienced divers — who train together,
                  dive together, and push each other to go deeper. Literally.
                </p>

                <div className="space-y-5">
                  {[
                    { title: "Breath-First Training", desc: "Every program starts with building internal calm and breath control before we hit the water." },
                    { title: "Real Community", desc: "Saturday ocean sessions, buddy dive meetups, and a crew that actually shows up." },
                    { title: "Progressive Development", desc: "From pool sessions to open ocean, from 5 meters to 30+. Clear pathways at every level." },
                  ].map((f) => (
                    <div key={f.title} className="flex gap-4 items-start">
                      <div className="w-1 h-8 bg-teal/30 rounded-full shrink-0 mt-1" />
                      <div>
                        <h4 className="text-[0.9rem] font-semibold text-deep mb-0.5">{f.title}</h4>
                        <p className="text-sm text-[#5a6a7a] leading-relaxed">{f.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ PROGRAMS — Horizontal scroll on mobile, grid on desktop ═══ */}
      <section className="bg-white py-16 md:py-28 px-6 md:px-12">
        <div className="max-w-[1400px] mx-auto">
          <Reveal>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-12">
              <div>
                <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-3">Programs</div>
                <h2 className="font-serif text-[clamp(2rem,3.5vw,3rem)] leading-[1.1] tracking-tight">
                  Find your entry point
                </h2>
              </div>
              <Link href="/programs" className="text-sm text-teal font-medium no-underline hover:text-deep transition-colors">
                All programs & details →
              </Link>
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {programs.map((p, i) => (
              <Reveal key={p.id} delay={i * 60}>
                <Link
                  href={p.href}
                  className="group block border border-deep/[0.06] rounded-xl p-6 no-underline text-deep hover:border-teal/30 hover:shadow-[0_8px_40px_rgba(27,107,107,0.06)] transition-all h-full"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] text-[#5a6a7a] font-medium tracking-[0.1em] uppercase">{p.meta}</span>
                    <div className="w-7 h-7 rounded-full border border-deep/[0.08] flex items-center justify-center text-[#5a6a7a] group-hover:bg-teal group-hover:border-teal group-hover:text-white transition-all">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </div>
                  </div>
                  <h3 className="font-serif text-xl tracking-tight mb-2">{p.title}</h3>
                  <p className="text-xs text-[#5a6a7a] leading-relaxed">{p.desc}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ THIS WEEKEND — Tight, punchy, email magnet ═══ */}
      <section className="bg-deep py-14 md:py-20 px-6 md:px-12 relative">
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")" }} />
        <div className="max-w-[900px] mx-auto relative z-10">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-16">
              {/* Schedule */}
              <div className="flex-1">
                <div className="text-[11px] text-seafoam/60 font-medium tracking-[0.2em] uppercase mb-3">Every Weekend</div>
                <h2 className="font-serif text-[clamp(1.6rem,3vw,2.2rem)] text-white leading-[1.15] tracking-tight mb-6">
                  This week at La Jolla Shores
                </h2>
                <div className="space-y-4">
                  <div className="flex gap-4 items-start">
                    <div className="text-right shrink-0 w-14">
                      <div className="text-white/80 text-sm font-medium">7:00am</div>
                      <div className="text-white/30 text-[10px]">SAT</div>
                    </div>
                    <div className="w-[1px] bg-white/10 self-stretch shrink-0" />
                    <div>
                      <div className="text-white text-sm font-medium">Ocean Flow with Lena</div>
                      <div className="text-white/35 text-xs">Pre-dive stretching &amp; breathing exercises on the beach</div>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="text-right shrink-0 w-14">
                      <div className="text-white/80 text-sm font-medium">8:30am</div>
                      <div className="text-white/30 text-[10px]">SAT</div>
                    </div>
                    <div className="w-[1px] bg-white/10 self-stretch shrink-0" />
                    <div>
                      <div className="text-white text-sm font-medium">Group Ocean Session</div>
                      <div className="text-white/35 text-xs">Guided freedive from the canyon mooring line. All levels.</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="md:w-[280px] shrink-0 bg-white/[0.04] border border-white/[0.08] rounded-xl p-6">
                <p className="text-white/50 text-sm leading-relaxed mb-4">
                  We go out every weekend — conditions permitting. Join the list and we&apos;ll confirm the night before.
                </p>
                <WeekendEmailForm />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ CAMP GARIBALDI — Full-bleed image, editorial overlap ═══ */}
      <section className="relative overflow-hidden">
        <div className="grid md:grid-cols-2 min-h-[600px]">
          {/* Image half */}
          <div className="relative h-[400px] md:h-auto">
            <img src="/images/photos/joshua-teaching-kids.jpg" alt="Joshua teaching kids poolside" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-deep/20 hidden md:block" />
          </div>

          {/* Content half */}
          <div className="bg-deep flex items-center px-8 md:px-16 py-16 md:py-24 relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_80%_50%,rgba(199,91,58,0.08)_0%,transparent_60%)]" />
            <div className="relative z-10 max-w-[480px]">
              <Reveal>
                <div className="text-[11px] text-coral/60 font-medium tracking-[0.2em] uppercase mb-4">Summer Program</div>
                <h2 className="font-serif text-[clamp(2.2rem,4vw,3.2rem)] text-white leading-[1.08] tracking-tight mb-6">
                  Camp<br /><span className="italic text-coral">Garibaldi</span>
                </h2>
                <p className="text-white/50 leading-relaxed mb-8">
                  The ocean camp that starts from the inside out. Breath control,
                  freediving fundamentals, and surf survival for kids ages 8–16.
                  Small groups. Real skills. Genuine confidence.
                </p>

                <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-10">
                  {["Breath & composure", "Freediving fundamentals", "Surf survival", "Ocean safety", "8:1 ratio", "Ages 8–16"].map((feat) => (
                    <div key={feat} className="flex items-center gap-2 text-white/60 text-[13px]">
                      <span className="w-1 h-1 rounded-full bg-coral" />
                      {feat}
                    </div>
                  ))}
                </div>

                <Link href="/contact/camp" className="group inline-flex items-center gap-3 px-7 py-3.5 bg-coral text-white rounded-full font-medium text-[0.9rem] no-underline hover:shadow-[0_8px_30px_rgba(199,91,58,0.5)] transition-all">
                  Reserve a Spot
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS — Staggered cards ═══ */}
      <section className="bg-salt py-16 md:py-28 px-6 md:px-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")" }} />

        <div className="max-w-[1400px] mx-auto relative z-10">
          <Reveal>
            <div className="max-w-[600px] mb-14">
              <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-3">Community</div>
              <h2 className="font-serif text-[clamp(2rem,3.5vw,3rem)] leading-[1.1] tracking-tight">
                From the people<br />who show up
              </h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className={`bg-white rounded-xl p-8 relative ${i === 1 ? "md:translate-y-8" : ""}`}>
                  <span className="font-serif text-5xl text-teal/10 leading-none absolute top-4 left-6">&ldquo;</span>
                  <p className="text-[0.9rem] leading-[1.7] mb-6 relative z-10 text-deep/80">{t.text}</p>
                  <div>
                    <span className="block text-sm font-semibold text-deep">{t.name}</span>
                    <span className="text-[11px] text-[#5a6a7a]">{t.role}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ JOURNAL — Magazine layout ═══ */}
      <section className="bg-white py-16 md:py-28 px-6 md:px-12">
        <div className="max-w-[1400px] mx-auto">
          <Reveal>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-12">
              <div>
                <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-3">The Journal</div>
                <h2 className="font-serif text-[clamp(2rem,3.5vw,3rem)] leading-[1.1] tracking-tight">
                  Depth, knowledge<br />&amp; stories
                </h2>
              </div>
              <Link href="/blog" className="text-sm text-teal font-medium no-underline hover:text-deep transition-colors">
                All articles →
              </Link>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-5">
            {blogPosts.map((post, i) => (
              <Reveal key={post.slug} delay={i * 60}>
                <Link href={`/blog/${post.slug}`} className="group block no-underline text-deep">
                  <div className="aspect-[16/10] rounded-xl overflow-hidden mb-4">
                    <img
                      src={post.image}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    />
                  </div>
                  <span className="text-[10px] text-teal font-semibold tracking-[0.15em] uppercase">{post.category}</span>
                  <h3 className="font-serif text-lg leading-snug tracking-tight mt-1 group-hover:text-teal transition-colors">{post.title}</h3>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ EMAIL CAPTURE ═══ */}
      <EmailCapture />
    </>
  );
}
