import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { EmailCapture } from "@/components/EmailCapture";

/* ─── Data ─── */
const programs = [
  {
    id: "aida",
    tag: "Most Popular",
    title: "AIDA 2 Certification",
    desc: "The gold standard beginner certification. Pool and open water training over 2–3 days. Walk away certified to dive to 20m with a buddy.",
    meta: "2–3 days · All levels",
    gradient: "from-ocean to-teal",
  },
  {
    id: "discover",
    tag: "No Cert Needed",
    title: "Discover Freediving",
    desc: "Not ready to commit? Try a single session. Learn breathing technique, pool skills, and experience your first real breath hold.",
    meta: "Half day · Beginners",
    gradient: "from-[#14566a] to-seafoam",
  },
  {
    id: "group",
    tag: "Weekly",
    title: "Group Ocean Sessions",
    desc: "Weekly guided dives at La Jolla's best spots — the Cove, Canyon, and beyond. Structured training with safety divers.",
    meta: "Every Saturday · Members",
    gradient: "from-deep to-ocean",
  },
  {
    id: "coaching",
    tag: "1-on-1",
    title: "Private Coaching",
    desc: "Personalized training for specific goals — competition prep, equalization issues, depth anxiety, or accelerated certification.",
    meta: "Flexible schedule",
    gradient: "from-teal to-sun",
  },
  {
    id: "dry",
    tag: "Community",
    title: "Dry Training & Collabs",
    desc: "Breathing drills, stretching sessions, and cross-training with local yoga studios, surf crews, and fitness communities.",
    meta: "Various locations",
    gradient: "from-coral to-sun",
  },
  {
    id: "camp",
    tag: "Ages 8–16",
    title: "Camp Garibaldi",
    desc: "Our week-long ocean camp for kids. Freediving, surf survival, and water confidence — the ocean camp that starts from the inside out.",
    meta: "Summer sessions",
    gradient: "from-ocean to-coral",
  },
];

const testimonials = [
  {
    text: "I came in terrified of deep water and left my AIDA 2 course diving to 15 meters with a smile. The breathing work at the beginning changed everything — it gave me a calm I didn't know I had.",
    name: "Maria R.",
    role: "AIDA 2 Graduate",
    color: "bg-teal",
  },
  {
    text: "The Saturday group dives are the highlight of my week. Having a crew that takes safety seriously but still makes it fun — that's hard to find. These are my people now.",
    name: "David K.",
    role: "Club Member, 2 years",
    color: "bg-ocean",
  },
  {
    text: "My son did Camp Garibaldi last summer and came back a different kid in the water. He went from nervous about waves to body surfing and holding his breath underwater for fun.",
    name: "Jennifer T.",
    role: "Camp Garibaldi Parent",
    color: "bg-coral",
  },
];

const blogPosts = [
  {
    slug: "beginners-guide-freediving-la-jolla",
    category: "Beginner Guide",
    title: "The Complete Beginner's Guide to Freediving in La Jolla",
    excerpt:
      "Everything you need to know before your first dive — gear, spots, safety, and what to expect.",
    date: "March 2026",
    readTime: "12 min read",
    gradient: "from-ocean to-teal",
    image: "/images/photos/joshua-brooke-kristina.jpg",
  },
  {
    slug: "mammalian-dive-reflex-explained",
    category: "Science",
    title: "The Mammalian Dive Reflex: Your Body's Built-In Superpower",
    excerpt:
      "Your body has an ancient survival mechanism that activates the moment your face hits the water.",
    date: "March 2026",
    readTime: "14 min read",
    gradient: "from-deep to-ocean",
    image: "/images/photos/joshua-red-sea.jpg",
  },
  {
    slug: "best-freediving-spots-san-diego",
    category: "Local Guide",
    title: "5 Best Freediving Spots in San Diego",
    excerpt:
      "From La Jolla Cove to Point Loma kelp beds — a local's guide to San Diego's best freediving.",
    date: "March 2026",
    readTime: "10 min read",
    gradient: "from-deep to-teal",
    image: "/images/photos/joshua-lena-shores.jpg",
  },
];

/* ─── Arrow Icon ─── */
function Arrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function Check() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

/* ─── Page ─── */
export default function Home() {
  return (
    <>
      {/* ═══ HERO ═══ */}
      <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden">
        {/* BG */}
        <div className="absolute inset-0">
          <img src="/images/hero.jpg" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-deep/60" />
          <div className="absolute inset-0 bg-gradient-to-b from-deep/80 via-deep/40 to-ocean/80" />
        </div>

        {/* Waves */}
        <div className="absolute bottom-0 left-0 right-0 h-[120px] md:h-[200px] overflow-hidden">
          <svg className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-[200vw] h-[120px] md:h-[200px] animate-wave-1 opacity-[0.08]" viewBox="0 0 1440 200" fill="none" preserveAspectRatio="none">
            <path d="M0 80 C360 20, 540 140, 720 80 S1080 20, 1440 80 V200 H0Z" fill="white" />
          </svg>
          <svg className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-[200vw] h-[120px] md:h-[200px] animate-wave-2 opacity-[0.05]" viewBox="0 0 1440 200" fill="none" preserveAspectRatio="none">
            <path d="M0 100 C280 40, 460 160, 720 100 S1160 40, 1440 100 V200 H0Z" fill="white" />
          </svg>
        </div>

        {/* Bubbles */}
        {[
          { w: 8, left: "15%", dur: "12s", delay: "0s" },
          { w: 12, left: "35%", dur: "15s", delay: "3s" },
          { w: 6, left: "55%", dur: "10s", delay: "1s" },
          { w: 10, left: "75%", dur: "14s", delay: "5s" },
          { w: 7, left: "90%", dur: "11s", delay: "2s" },
        ].map((b, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/[0.04] animate-rise"
            style={{
              width: b.w,
              height: b.w,
              left: b.left,
              animationDuration: b.dur,
              animationDelay: b.delay,
            }}
          />
        ))}

        {/* Content */}
        <div className="relative z-10 max-w-[800px] px-6">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/[0.08] border border-white/[0.12] rounded-full text-seafoam text-xs font-medium tracking-[0.08em] uppercase mb-8 animate-fade-up [animation-delay:0.2s]">
            <span className="w-1.5 h-1.5 rounded-full bg-seafoam animate-pulse-slow" />
            La Jolla, California
          </div>

          <h1 className="font-serif text-[clamp(3rem,7vw,5.5rem)] font-normal text-white leading-[1.05] tracking-tight mb-6 animate-fade-up [animation-delay:0.4s]">
            Breathe. Dive.
            <br />
            <em className="italic text-seafoam">Belong.</em>
          </h1>

          <p className="text-lg text-white/65 leading-relaxed max-w-[560px] mx-auto mb-10 font-light animate-fade-up [animation-delay:0.6s]">
            San Diego&apos;s freediving community. Live dive conditions, seasonal species intel, AIDA certification, and a crew that dives La Jolla every week.
          </p>

          <div className="flex gap-4 justify-center flex-wrap animate-fade-up [animation-delay:0.8s]">
            <Link href="/conditions" className="btn btn-primary no-underline">
              Today&apos;s Conditions →
            </Link>
            <Link href="/programs" className="btn btn-ghost no-underline">
              View Courses
            </Link>
          </div>
        </div>

        {/* Scroll indicator — desktop only */}
        <div className="hidden md:flex absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30 text-[0.7rem] uppercase tracking-[0.15em] flex-col items-center gap-3 animate-fade-up [animation-delay:1.2s]">
          Scroll
          <span className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent animate-scroll-line" />
        </div>
      </section>

      {/* ═══ LIVE TOOLS ═══ */}
      <section className="bg-salt py-16 md:py-28 px-6">
        <div className="max-w-[1240px] mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <div className="section-label justify-center before:hidden">Know the Water</div>
              <h2 className="section-title">Tools we built for La Jolla divers</h2>
              <p className="section-desc max-w-[560px] mx-auto">
                Live ocean data, seasonal species tracking, and local knowledge
                compiled from thousands of dives — all free, updated daily.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                href: "/conditions",
                icon: "🌊",
                title: "Live Conditions",
                desc: "AI visibility analysis, swell, wind, water temp, and an overall dive grade. Updated every 10 minutes from Scripps Pier.",
                badge: "Live",
              },
              {
                href: "/map",
                icon: "🗺️",
                title: "Underwater Field Guide",
                desc: "10 dive sites, 8 depth zones, 50+ species, night diving intel, and seasonal patterns — all from local knowledge.",
                badge: null,
              },
              {
                href: "/tides",
                icon: "🌙",
                title: "Tides & Moon Phase",
                desc: "7-day tide calendar with best dive windows, moon phase, spring/neap detection, and grunion run alerts.",
                badge: null,
              },
              {
                href: "/gear",
                icon: "🤿",
                title: "Gear Guide",
                desc: "What to wear at every water temperature, plus our recommendations for masks, fins, weights, and safety gear.",
                badge: null,
              },
            ].map((tool, i) => (
              <Reveal key={tool.href} delay={i * 80}>
                <Link
                  href={tool.href}
                  className="block bg-white rounded-2xl p-7 no-underline text-deep hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(10,22,40,0.08)] transition-all group h-full"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{tool.icon}</span>
                    {tool.badge && (
                      <span className="px-2 py-0.5 bg-teal/10 text-teal text-[10px] font-semibold rounded-full flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-teal animate-pulse-slow" />
                        {tool.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif text-lg mb-2 tracking-tight group-hover:text-teal transition-colors">{tool.title}</h3>
                  <p className="text-xs text-[#5a6a7a] leading-relaxed">{tool.desc}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ INTRO ═══ */}
      <section className="bg-white py-16 md:py-28 px-6">
        <div className="max-w-[1240px] mx-auto grid md:grid-cols-2 gap-10 md:gap-20 items-center">
          <Reveal>
            <div className="relative h-[520px] rounded-2xl overflow-hidden">
              <img src="/images/photos/joshua-brooke-kristina.jpg" alt="Joshua with Brooke and Kristina after a dive session" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-deep/70 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <div className="font-serif text-6xl leading-none mb-2">70%</div>
                <p className="text-sm opacity-70">
                  of our members had never freedived before joining
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="section-label">Why We Exist</div>
            <h2 className="section-title">
              The ocean is better
              <br />
              with a crew
            </h2>
            <p className="section-desc mb-10">
              La Jolla Freedive Club is more than courses and certifications.
              We&apos;re a community of ocean people — from first-timers to experienced
              divers — who train together, dive together, and push each other to
              go deeper. Literally.
            </p>

            <div className="flex flex-col gap-6">
              {[
                {
                  title: "Breath-First Training",
                  desc: "Every program starts with building internal calm and breath control before we hit the water.",
                },
                {
                  title: "Real Community",
                  desc: "Weekly group sessions, buddy dive meetups, and a crew that actually shows up.",
                },
                {
                  title: "Progressive Development",
                  desc: "From pool sessions to open ocean, from 5 meters to 30+. Clear pathways at every level.",
                },
              ].map((f) => (
                <div key={f.title} className="flex gap-4 items-start">
                  <div className="w-11 h-11 rounded-xl bg-teal/[0.08] flex items-center justify-center flex-shrink-0 text-teal">
                    <Check />
                  </div>
                  <div>
                    <h4 className="text-[0.95rem] font-semibold mb-1">{f.title}</h4>
                    <p className="text-sm text-[#5a6a7a] leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ PROGRAMS ═══ */}
      <section id="programs" className="py-16 md:py-28 px-6 bg-salt">
        <div className="max-w-[1240px] mx-auto">
          <Reveal>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
              <div>
                <div className="section-label">Our Programs</div>
                <h2 className="section-title">Find your entry point</h2>
                <p className="section-desc">
                  Whether you&apos;re ocean-curious or chasing depth records, there&apos;s
                  a place for you here.
                </p>
              </div>
              <Link href="/programs" className="btn btn-primary no-underline shrink-0">
                View All →
              </Link>
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((p, i) => (
              <Reveal key={p.id} delay={i * 80}>
                <Link
                  href={p.id === "camp" ? "/camp-garibaldi" : `/programs#${p.id}`}
                  className="block bg-white rounded-2xl overflow-hidden no-underline text-deep hover:-translate-y-1.5 hover:shadow-[0_20px_60px_rgba(10,22,40,0.1)] transition-all duration-400 group"
                >
                  <div className={`h-[200px] relative overflow-hidden bg-gradient-to-br ${p.gradient}`}>
                    <span className="absolute top-4 left-4 px-3 py-1.5 bg-white/15 backdrop-blur-md rounded-full text-white text-[0.7rem] font-semibold tracking-wide uppercase">
                      {p.tag}
                    </span>
                  </div>
                  <div className="p-7">
                    <h3 className="font-serif text-xl mb-2 tracking-tight">{p.title}</h3>
                    <p className="text-sm text-[#5a6a7a] leading-relaxed mb-5">{p.desc}</p>
                    <div className="flex justify-between items-center pt-5 border-t border-black/[0.06]">
                      <span className="text-xs text-[#5a6a7a]">{p.meta}</span>
                      <div className="w-8 h-8 rounded-full bg-teal flex items-center justify-center text-white group-hover:translate-x-1 transition-transform">
                        <Arrow />
                      </div>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SEASONAL TEASER ═══ */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-[900px] mx-auto text-center">
          <Reveal>
            <div className="section-label justify-center before:hidden">This Month in La Jolla</div>
            <h2 className="section-title mb-6">What&apos;s in the water right now</h2>
            <p className="section-desc max-w-[560px] mx-auto mb-10">
              Our conditions page tracks seasonal species, moon phases, grunion runs,
              whale migrations, and everything else happening on the La Jolla coastline —
              updated automatically so you always know what you might see.
            </p>
            <Link
              href="/conditions"
              className="btn btn-outline no-underline"
            >
              Check Today&apos;s Conditions →
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ═══ CAMP GARIBALDI BANNER ═══ */}
      <section className="bg-deep py-16 md:py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_80%_50%,rgba(232,115,74,0.12)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_60%_at_20%_80%,rgba(61,184,164,0.08)_0%,transparent_50%)]" />

        <div className="max-w-[1240px] mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10">
          <Reveal>
            <div className="section-label text-coral before:bg-coral">Summer Program</div>
            <h2 className="section-title text-white">
              Camp <em className="italic text-coral">Garibaldi</em>
            </h2>
            <p className="section-desc text-white/60 mb-8">
              The ocean camp that starts from the inside out. We teach kids breath
              control, freediving fundamentals, and surf survival — building real
              water confidence through a breath-first methodology.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {[
                "Breath & composure training",
                "Freediving fundamentals",
                "Surf survival skills",
                "Ocean safety & rescue",
                "Small groups (8:1 ratio)",
                "Ages 8–16",
              ].map((feat) => (
                <div key={feat} className="flex items-center gap-2 text-white/75 text-sm">
                  <span className="text-seafoam"><Check /></span>
                  {feat}
                </div>
              ))}
            </div>

            <Link href="/camp-garibaldi" className="btn btn-primary no-underline">
              Reserve a Spot →
            </Link>
          </Reveal>

          <Reveal delay={100}>
            <div className="relative h-[440px] rounded-2xl overflow-hidden">
              <img src="/images/photos/joshua-teaching-kids.jpg" alt="Joshua teaching kids at poolside" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-deep/40 via-transparent to-transparent" />
              <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-md px-5 py-3 rounded-xl text-white text-center">
                <div className="font-serif text-2xl">8–16</div>
                <small className="text-[0.7rem] opacity-80">years old</small>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="bg-white py-16 md:py-28 px-6 text-center">
        <Reveal>
          <div className="max-w-[600px] mx-auto mb-16">
            <div className="section-label justify-center before:hidden">What People Say</div>
            <h2 className="section-title">From the community</h2>
          </div>
        </Reveal>

        <div className="max-w-[1240px] mx-auto grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <Reveal key={i} delay={i * 100}>
              <div className="text-left p-10 bg-salt rounded-2xl relative">
                <span className="absolute top-4 left-6 font-serif text-6xl text-teal/20 leading-none">
                  &ldquo;
                </span>
                <p className="text-[0.95rem] leading-relaxed mb-6 relative z-10">{t.text}</p>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-white font-semibold text-sm`}
                  >
                    {t.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <span className="block font-semibold text-sm">{t.name}</span>
                    <small className="text-[#5a6a7a] text-xs">{t.role}</small>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══ BLOG PREVIEW ═══ */}
      <section className="py-16 md:py-28 px-6 bg-salt">
        <div className="max-w-[1240px] mx-auto">
          <Reveal>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-14">
              <div>
                <div className="section-label">The Journal</div>
                <h2 className="section-title">Depth, knowledge &amp; stories</h2>
              </div>
              <Link href="/blog" className="btn btn-outline no-underline shrink-0">
                All Articles →
              </Link>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-[1.4fr_1fr_1fr] gap-6">
            {blogPosts.map((post, i) => (
              <Reveal key={post.slug} delay={i * 80}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="block bg-white rounded-2xl overflow-hidden no-underline text-deep hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(10,22,40,0.08)] transition-all group"
                >
                  <div className={`${i === 0 ? "h-[280px]" : "h-[200px]"} relative`}>
                    <img src={post.image} alt="" className="w-full h-full object-cover" />
                    <div className={`absolute inset-0 bg-gradient-to-br ${post.gradient} opacity-30`} />
                    <span className="absolute bottom-4 left-4 px-3 py-1.5 bg-white/15 backdrop-blur-md rounded-md text-white text-[0.7rem] font-semibold tracking-wide uppercase">
                      {post.category}
                    </span>
                  </div>
                  <div className="p-7">
                    <h3 className={`font-serif ${i === 0 ? "text-2xl" : "text-xl"} leading-tight mb-3 tracking-tight`}>
                      {post.title}
                    </h3>
                    <p className="text-sm text-[#5a6a7a] leading-relaxed mb-5">
                      {post.excerpt}
                    </p>
                    <div className="flex justify-between items-center text-xs text-[#5a6a7a]">
                      <span>{post.date}</span>
                      <span className="text-teal font-medium">{post.readTime}</span>
                    </div>
                  </div>
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
