"use client";

import { useState, useEffect, useRef, ReactNode } from "react";
import Link from "next/link";

/* ─── Scroll-reveal wrapper ─── */
function Fade({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setTimeout(() => el.classList.add("visible"), delay);
          obs.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  );
}

/* ─── Grain overlay ─── */
const grain = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
};

/* ─── Animated bar (scroll-triggered) ─── */
function AnimatedBar({
  label,
  pct,
  color,
  delay = 0,
}: {
  label: string;
  pct: number;
  color: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setTimeout(() => setWidth(pct), delay);
          obs.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [pct, delay]);
  return (
    <div ref={ref}>
      <div className="flex justify-between text-sm mb-2">
        <span className="text-white/70 font-medium">{label}</span>
        <span className="text-white/40 tabular-nums">{pct}%</span>
      </div>
      <div className="h-3 bg-white/[0.06] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-[1.8s] ease-out"
          style={{ width: `${width}%`, background: color }}
        />
      </div>
    </div>
  );
}

/* ─── Flip card ─── */
function FlipCard({
  front,
  back,
  frontSub,
  backSub,
}: {
  front: string;
  back: string;
  frontSub: string;
  backSub: string;
}) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div
      className="cursor-pointer group"
      style={{ perspective: "800px" }}
      onClick={() => setFlipped(!flipped)}
    >
      <div
        className="relative w-full aspect-[4/3] transition-transform duration-700"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0)",
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-ocean to-deep p-6 flex flex-col justify-between border border-white/[0.06]"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="text-[10px] text-seafoam/50 font-medium tracking-[0.2em] uppercase">
            Tap to reveal
          </div>
          <div>
            <div className="font-serif text-2xl md:text-3xl text-white leading-tight">
              {front}
            </div>
            <div className="text-white/40 text-sm mt-2">{frontSub}</div>
          </div>
        </div>
        {/* Back */}
        <div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-teal to-ocean p-6 flex flex-col justify-between border border-seafoam/20"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="text-[10px] text-white/40 font-medium tracking-[0.2em] uppercase">
            Cognitive layer
          </div>
          <div>
            <div className="font-serif text-2xl md:text-3xl text-white leading-tight">
              {back}
            </div>
            <div className="text-seafoam/70 text-sm mt-2 leading-relaxed">
              {backSub}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Boyle's / TM dual diagram ─── */
function DualDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const viewH = window.innerHeight;
      const start = viewH * 0.8;
      const end = -rect.height * 0.3;
      const raw = (start - rect.top) / (start - end);
      setProgress(Math.max(0, Math.min(1, raw)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const depths = [
    { ata: 1, ft: 0, vol: 100, label: "Surface" },
    { ata: 2, ft: 33, vol: 50, label: "33 ft" },
    { ata: 3, ft: 66, vol: 33, label: "66 ft" },
    { ata: 4, ft: 99, vol: 25, label: "99 ft" },
    { ata: 5, ft: 132, vol: 20, label: "132 ft" },
  ];

  const consciousness = [
    { label: "Conscious Mind", size: 100 },
    { label: "Active Thought", size: 70 },
    { label: "Subtle Thought", size: 45 },
    { label: "Quieter Levels", size: 25 },
    { label: "Pure Consciousness", size: 12 },
  ];

  return (
    <div ref={ref} className="relative">
      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        {/* Left: Boyle's Law */}
        <div className="bg-gradient-to-b from-[#1a4a6a]/40 to-deep/60 rounded-2xl p-6 md:p-8 border border-white/[0.06]">
          <div className="text-[11px] text-seafoam/60 font-medium tracking-[0.2em] uppercase mb-6">
            Boyle&apos;s Law
          </div>
          <div className="space-y-5">
            {depths.map((d, i) => {
              const animScale =
                i === 0 ? 1 : 1 - progress * (1 - d.vol / 100);
              const bubbleSize = Math.max(12, 48 * animScale);
              return (
                <div key={d.ata} className="flex items-center gap-4">
                  <div className="w-16 text-xs text-white/30 text-right tabular-nums shrink-0">
                    {d.ata} ATA
                  </div>
                  <div className="flex-1 flex items-center gap-3">
                    <div
                      className="rounded-full border-2 border-seafoam/40 bg-seafoam/10 transition-all duration-300 shrink-0"
                      style={{
                        width: bubbleSize,
                        height: bubbleSize,
                      }}
                    />
                    <div className="text-white/50 text-xs">
                      {d.label}{" "}
                      <span className="text-white/25">
                        &middot; {d.vol}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-6 pt-4 border-t border-white/[0.06] text-xs text-white/25 text-center">
            Gas bubble volume under pressure
          </div>
        </div>

        {/* Right: TM / Consciousness */}
        <div className="bg-gradient-to-b from-[#1a4a6a]/40 to-deep/60 rounded-2xl p-6 md:p-8 border border-white/[0.06]">
          <div className="text-[11px] text-seafoam/60 font-medium tracking-[0.2em] uppercase mb-6">
            Transcendental Meditation
          </div>
          <div className="space-y-5">
            {consciousness.map((c, i) => {
              const animScale =
                i === 0 ? 1 : 1 - progress * (1 - c.size / 100);
              const bubbleSize = Math.max(12, 48 * animScale);
              return (
                <div key={c.label} className="flex items-center gap-4">
                  <div className="w-16 shrink-0" />
                  <div className="flex-1 flex items-center gap-3">
                    <div
                      className="rounded-full border-2 border-sand/40 bg-sand/10 transition-all duration-300 shrink-0"
                      style={{
                        width: bubbleSize,
                        height: bubbleSize,
                      }}
                    />
                    <div className="text-white/50 text-xs">{c.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-6 pt-4 border-t border-white/[0.06] text-xs text-white/25 text-center">
            Thought refinement during meditation
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Three Pathways tabs ─── */
function PathwayTabs() {
  const [active, setActive] = useState(0);
  const tabs = [
    {
      id: "taught",
      label: "Taught",
      title: "Taught Anchors",
      desc: "Proven techniques with established effectiveness. Someone hands you the tool and you practice it.",
      items: [
        {
          name: "4-7-8 Breathing",
          detail: "Inhale 4 counts, hold 7, exhale 8. Activates parasympathetic response.",
        },
        {
          name: "Om Humming",
          detail: "Sustained humming stimulates the vagus nerve — the same pathway as the dive reflex.",
        },
        {
          name: "Body Scan",
          detail: "Progressive attention through each body part. Builds interoceptive awareness.",
        },
        {
          name: "Progressive Muscle Relaxation",
          detail: "Tense and release muscle groups systematically. Creates somatic contrast.",
        },
      ],
      note: "Similar to \u0101n\u0101p\u0101nasati used in monastery practice.",
    },
    {
      id: "personal",
      label: "Personal",
      title: "Personally Meaningful Anchors",
      desc: "Personal resonance is what makes these powerful. The anchor works because it means something to you that it can\u2019t mean to anyone else.",
      items: [
        {
          name: "Memory",
          detail: "The first time you felt truly calm in the ocean. A childhood moment of perfect stillness.",
        },
        {
          name: "Spirit / Totem",
          detail: "One diver visualizes an anaconda before every dive. That animal puts them in a state no breathing technique could reach.",
        },
        {
          name: "Creative",
          detail: "A poem line, song lyric, or personal mantra. The resonance is acoustic and emotional.",
        },
        {
          name: "Sensory",
          detail: "The smell of ocean air. The feeling of water moving across your skin. A specific quality of light.",
        },
      ],
      note: "Personal resonance matters.",
    },
    {
      id: "spontaneous",
      label: "Spontaneous",
      title: "Spontaneous Anchors",
      desc: "The most interesting and most potent. Images or sensations that arise naturally during deep states. You don\u2019t choose them. They choose you.",
      items: [
        {
          name: "Luminous shapes",
          detail: "Colors, geometric forms, or light patterns that appear behind closed eyes during deep relaxation.",
        },
        {
          name: "Expansion sensations",
          detail: "A felt sense of the body dissolving, expanding, or becoming weightless. Common at the bottom of the line.",
        },
        {
          name: "Pa\u1e6dibh\u0101ga-nimitta",
          detail: "\u201CNaturally arising signs\u201D \u2014 what Buddhist tradition calls the images that emerge from deep concentration practice.",
        },
      ],
      note: "Because they originate from your deepest accessed states, they carry a direct neural pathway back.",
    },
  ];

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-2 mb-8">
        {tabs.map((t, i) => (
          <button
            key={t.id}
            onClick={() => setActive(i)}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
              active === i
                ? "bg-seafoam text-deep"
                : "bg-white/[0.06] text-white/50 hover:bg-white/[0.1] hover:text-white/70"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Panel */}
      {tabs.map((t, i) => (
        <div
          key={t.id}
          className={`transition-all duration-500 ${
            active === i
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4 hidden"
          }`}
        >
          <div className="text-[11px] text-seafoam/60 font-medium tracking-[0.2em] uppercase mb-3">
            Pathway {i + 1}
          </div>
          <h4 className="font-serif text-2xl md:text-3xl text-white mb-3">
            {t.title}
          </h4>
          <p className="text-white/50 text-[0.95rem] leading-relaxed mb-8 max-w-[560px]">
            {t.desc}
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {t.items.map((item) => (
              <div
                key={item.name}
                className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-5 hover:bg-white/[0.07] transition-colors"
              >
                <div className="font-semibold text-white text-sm mb-1.5">
                  {item.name}
                </div>
                <div className="text-white/40 text-sm leading-relaxed">
                  {item.detail}
                </div>
              </div>
            ))}
          </div>
          <p className="text-seafoam/50 text-sm italic mt-6">{t.note}</p>
        </div>
      ))}
    </div>
  );
}

/* ─── Practice timeline ─── */
function PracticeTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const stages = [
    { label: "Week 1", time: "15 min", pct: 100, desc: "Full relaxation sequence needed" },
    { label: "Week 2\u20133", time: "8 min", pct: 53, desc: "Pathway strengthening" },
    { label: "Month 2", time: "5 min", pct: 33, desc: "Anchor begins to fire faster" },
    { label: "Month 3+", time: "30 sec", pct: 3, desc: "Shortcut becomes default" },
  ];

  return (
    <div ref={ref}>
      <div className="space-y-6">
        {stages.map((s, i) => (
          <div
            key={s.label}
            className="flex items-center gap-5 md:gap-8"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(-20px)",
              transition: `all 0.6s ease ${i * 0.2}s`,
            }}
          >
            <div className="w-20 md:w-24 shrink-0 text-right">
              <div className="text-white/70 text-sm font-medium">
                {s.label}
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="h-8 bg-white/[0.04] rounded-lg overflow-hidden">
                <div
                  className="h-full rounded-lg transition-all duration-[2s] ease-out flex items-center px-3"
                  style={{
                    width: visible ? `${Math.max(s.pct, 8)}%` : "0%",
                    background:
                      i === stages.length - 1
                        ? "linear-gradient(90deg, #3db8a4, #1B6B6B)"
                        : "rgba(255,255,255,0.08)",
                    transitionDelay: `${i * 0.25}s`,
                  }}
                >
                  <span
                    className={`text-xs font-semibold tabular-nums whitespace-nowrap ${
                      i === stages.length - 1 ? "text-deep" : "text-white/60"
                    }`}
                  >
                    {s.time}
                  </span>
                </div>
              </div>
              <div className="text-white/25 text-xs mt-1">{s.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Blockquote ─── */
function PullQuote({ children }: { children: ReactNode }) {
  return (
    <Fade>
      <blockquote className="relative my-16 md:my-24 py-10 md:py-14 px-6">
        <div className="absolute inset-0 bg-gradient-to-r from-teal/[0.06] via-transparent to-teal/[0.06] rounded-2xl" />
        <div className="absolute left-6 top-6 text-teal/20 text-6xl md:text-7xl font-serif leading-none select-none">
          &ldquo;
        </div>
        <p className="relative font-serif text-[clamp(1.3rem,3vw,2rem)] leading-[1.4] text-white/80 max-w-[680px] mx-auto text-center italic">
          {children}
        </p>
      </blockquote>
    </Fade>
  );
}

/* ═══════════════════════════════════════════════════════════ */
/*  PAGE                                                       */
/* ═══════════════════════════════════════════════════════════ */

export default function StateAnchorsPage() {
  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline:
              "State Anchors: What Buddhist Monasteries Taught Me About Freediving",
            description:
              "The cognitive tool that turned 30 minutes of relaxation into 30 seconds.",
            datePublished: "2026-03-22",
            author: {
              "@type": "Person",
              name: "Joshua Beneventi",
              url: "https://lajollafreediveclub.com/about",
            },
            publisher: {
              "@type": "Organization",
              name: "La Jolla Freedive Club",
              url: "https://lajollafreediveclub.com",
            },
            mainEntityOfPage:
              "https://lajollafreediveclub.com/blog/state-anchors",
            articleSection: "Training",
          }),
        }}
      />

      {/* ── HERO ── */}
      <section className="relative h-[85vh] min-h-[600px] flex items-end overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source
            src="/videos/joshua-blue-hole-monofin.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-deep via-deep/50 to-transparent" />
        <div className="absolute inset-0 opacity-[0.03]" style={grain} />

        <div className="relative z-10 w-full px-6 md:px-12 pb-16 md:pb-20 max-w-[1200px] mx-auto">
          <div className="text-sm text-white/30 mb-8">
            <Link
              href="/"
              className="text-white/40 no-underline hover:text-seafoam transition-colors"
            >
              Home
            </Link>
            {" / "}
            <Link
              href="/blog"
              className="text-white/40 no-underline hover:text-seafoam transition-colors"
            >
              Journal
            </Link>
            {" / "}
            Training
          </div>

          <span className="inline-block px-4 py-1.5 bg-seafoam/15 text-seafoam rounded-full text-xs font-semibold tracking-wide uppercase mb-6">
            Training
          </span>

          <h1 className="font-serif text-[clamp(2.8rem,7vw,5.5rem)] text-white font-normal leading-[1.05] tracking-tight max-w-[800px]">
            State Anchors
          </h1>
          <p className="font-serif text-[clamp(1.1rem,2.5vw,1.6rem)] text-white/50 italic mt-4 max-w-[600px] leading-snug">
            What Buddhist Monasteries Taught Me About Freediving
          </p>

          <div className="flex gap-8 text-white/30 text-sm mt-8">
            <span>March 22, 2026</span>
            <span>18 min read</span>
          </div>
        </div>
      </section>

      {/* ── LEDE ── */}
      <section className="bg-salt py-20 md:py-28 px-6 relative">
        <div className="absolute inset-0 opacity-[0.02]" style={grain} />
        <div className="max-w-[680px] mx-auto relative z-10">
          <Fade>
            <p className="font-serif text-[clamp(1.2rem,2.5vw,1.5rem)] text-deep leading-[1.7] mb-8">
              Before I ever held my breath underwater, I spent six months
              holding it on land.
            </p>
          </Fade>
          <Fade delay={60}>
            <p className="text-[1.05rem] leading-[1.85] text-[#2a2a2a] mb-7">
              Not literally. But in the Thai forest monasteries where I lived
              before I found freediving, the practice was structurally
              identical: sit still, focus on one thing, and watch what your
              mind does when the discomfort arrives. In the Theravada
              tradition, they call the focal object a{" "}
              <em className="text-teal">kamma&#7789;&#7789;h&#257;na</em>{" "}
              &mdash; literally &ldquo;place of work.&rdquo; It could be the
              breath, a body sensation, a color, a sound. The point
              wasn&apos;t the object itself. The point was what the object
              did to the architecture of your attention.
            </p>
          </Fade>
          <Fade delay={120}>
            <p className="text-[1.05rem] leading-[1.85] text-[#2a2a2a]">
              I didn&apos;t know it at the time, but I was training for
              freediving.
            </p>
          </Fade>
        </div>
      </section>

      {/* ── THE GAP ── */}
      <section className="bg-white py-20 md:py-28 px-6 relative">
        <div className="absolute inset-0 opacity-[0.015]" style={grain} />
        <div className="max-w-[680px] mx-auto relative z-10">
          <Fade>
            <div className="section-label">The gap nobody talks about</div>
            <h2 className="section-title">
              We say it&apos;s 80% mental.
              <br />
              We train 90% physical.
            </h2>
          </Fade>

          <Fade delay={40}>
            <p className="text-[1.05rem] leading-[1.85] text-[#2a2a2a] mb-7">
              Ask any freediver why they started and the answers cluster
              around the same territory: peace, quiet, transformation,
              escape. The water delivers. Every time. It&apos;s a perfect
              mirror &mdash; it shows you exactly what&apos;s happening in
              your body and your mind, whether you asked to see it or not.
            </p>
          </Fade>

          <Fade delay={60}>
            <p className="text-[1.05rem] leading-[1.85] text-[#2a2a2a] mb-7">
              But here&apos;s what most freediving education doesn&apos;t
              address directly: the states of consciousness that drew us to
              the sport &mdash; the calm, the dissociation from surface
              noise, the feeling of being fully present &mdash; those states
              are treated as byproducts of technique rather than skills to
              be trained.
            </p>
          </Fade>

          <Fade delay={80}>
            <p className="text-[1.05rem] leading-[1.85] text-[#2a2a2a] mb-7">
              In a typical 20+ hour AIDA course, we spend maybe one to two
              hours on the mental side. The rest is equalization mechanics,
              Boyle&apos;s Law, safety protocols, technique drills. All
              essential. But the ratio is inverted relative to what actually
              determines performance.
            </p>
          </Fade>

          <Fade delay={100}>
            <p className="text-[1.05rem] leading-[1.85] text-[#2a2a2a] mb-7">
              This creates a gap. Students finish certification with solid
              technique but without systematic tools for accessing the
              psychological states that make the technique work. So they
              have good days and bad days. They can&apos;t figure out why
              Tuesday&apos;s dive felt effortless and Thursday&apos;s felt
              like a fight.
            </p>
          </Fade>

          <Fade delay={120}>
            <p className="text-[1.05rem] leading-[1.85] text-[#2a2a2a]">
              People burn out not because their bodies failed them but
              because their minds did, and nobody gave them tools to address
              it.
            </p>
          </Fade>
        </div>
      </section>

      {/* ── TRAINING GAP VIZ ── */}
      <section className="bg-deep py-16 md:py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={grain} />
        <div className="max-w-[600px] mx-auto relative z-10">
          <Fade>
            <div className="text-[11px] text-seafoam/60 font-medium tracking-[0.2em] uppercase mb-4 text-center">
              The mental training gap
            </div>
            <h3 className="font-serif text-2xl md:text-3xl text-white text-center mb-10">
              Where the time goes in a 20-hour course
            </h3>
          </Fade>
          <Fade delay={100}>
            <div className="space-y-6">
              <AnimatedBar
                label="Equalization, technique, theory, safety"
                pct={90}
                color="rgba(255,255,255,0.15)"
                delay={200}
              />
              <AnimatedBar
                label="Mental training & state development"
                pct={10}
                color="#3db8a4"
                delay={500}
              />
            </div>
            <p className="text-white/25 text-sm text-center mt-8">
              The ratio is inverted relative to what determines performance.
            </p>
          </Fade>
        </div>
      </section>

      {/* ── 100% MENTAL ── */}
      <section className="bg-deep py-20 md:py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={grain} />
        <div className="max-w-[900px] mx-auto relative z-10">
          <Fade>
            <div className="text-center mb-12 md:mb-16">
              <div className="text-[11px] text-seafoam/60 font-medium tracking-[0.2em] uppercase mb-4">
                Reframing the sport
              </div>
              <h2 className="font-serif text-[clamp(2rem,5vw,3.5rem)] text-white leading-[1.1] tracking-tight">
                What if it&apos;s 100% mental?
              </h2>
              <p className="text-white/40 text-[0.95rem] mt-4 max-w-[500px] mx-auto">
                Every &ldquo;physical&rdquo; skill in freediving has a
                cognitive layer that determines whether it works.
              </p>
            </div>
          </Fade>

          <Fade delay={80}>
            <div className="grid sm:grid-cols-2 gap-4 md:gap-5">
              <FlipCard
                front="Equalization"
                frontSub="Learning to feel pressure changes"
                back="Interoception"
                backSub="Sensing internal body signals — a cognitive skill, not a mechanical one."
              />
              <FlipCard
                front="Technique"
                frontSub="Sensing body position without visual feedback"
                back="Proprioception"
                backSub="Knowing where your body is in space without seeing it — pure neural mapping."
              />
              <FlipCard
                front="Safety"
                frontSub="Monitoring internal state for warning signs"
                back="Metacognition"
                backSub="Awareness of your own awareness — thinking about what you're thinking."
              />
              <FlipCard
                front="Dive Response"
                frontSub="Your body recognizing the context"
                back="Context Recognition"
                backSub="Not a reflex — a response. It can be suppressed or enhanced by your brain."
              />
            </div>
          </Fade>

          <Fade delay={160}>
            <div className="max-w-[680px] mx-auto mt-16">
              <p className="text-white/60 text-[1.05rem] leading-[1.85] mb-7">
                Umberto Pelizzari admitted that early in his career, he
                focused intensely on physical training, only later realizing
                that the mental component was crucial. Research on elite
                freedivers shows a fivefold increase in sympathetic nerve
                activity during deep dives &mdash; the fight-or-flight
                system screaming &mdash; while maintaining stability that
                would overwhelm an untrained person.
              </p>
              <p className="text-white/60 text-[1.05rem] leading-[1.85]">
                That&apos;s not their bodies automatically handling the
                stress. That&apos;s a trained psychological capacity to
                coexist with signals that evolution designed to make you
                panic.
              </p>
            </div>
          </Fade>
        </div>
      </section>

      <div className="bg-deep px-6">
        <div className="max-w-[900px] mx-auto">
          <PullQuote>
            We&apos;re teaching people to override millions of years of
            survival instincts in a weekend course.
          </PullQuote>
        </div>
      </div>

      {/* ── THE SCIENCE ── */}
      <section className="bg-deep py-20 md:py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={grain} />
        <div className="max-w-[680px] mx-auto relative z-10">
          <Fade>
            <div className="section-label text-seafoam before:bg-seafoam">
              The science
            </div>
            <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] text-white leading-[1.15] tracking-tight mb-8">
              What happens in elite freedivers&apos; brains
            </h2>
          </Fade>

          <Fade delay={40}>
            <p className="text-white/60 text-[1.05rem] leading-[1.85] mb-7">
              Research during optimal breath-holds shows a sharp increase in{" "}
              <strong className="text-seafoam font-semibold">
                alpha wave activity
              </strong>{" "}
              &mdash; the frequency band associated with being
              simultaneously calm and alert. Some brain areas activate while
              others quiet down, in a pattern neuroimaging studies describe
              as bearing &ldquo;striking similarity with observations during
              mindfulness and Vipassana meditation.&rdquo;
            </p>
          </Fade>

          <Fade delay={60}>
            <p className="text-white/60 text-[1.05rem] leading-[1.85] mb-7">
              This is not a metaphor. Elite freedivers and advanced
              meditators are registering functionally similar brain states
              through different doorways.
            </p>
          </Fade>

          <Fade delay={80}>
            <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-6 md:p-8 my-10">
              <div className="text-[11px] text-seafoam/60 font-medium tracking-[0.2em] uppercase mb-3">
                Proof it&apos;s learnable
              </div>
              <p className="text-white/60 text-[0.95rem] leading-[1.8]">
                Swedish freediver{" "}
                <strong className="text-white font-semibold">
                  Ulf Dextegen
                </strong>{" "}
                achieved an 8:43 static breath-hold &mdash; a national
                record &mdash; using primarily mental techniques. He started
                at 40, from a desk job, with no athletic background. Within
                a year, his brain had learned the state pattern so well he
                didn&apos;t need the trigger cue anymore. The shortcut had
                become the default.
              </p>
            </div>
          </Fade>

          <Fade delay={100}>
            <p className="text-white/60 text-[1.05rem] leading-[1.85]">
              That&apos;s neuroplasticity. What wires together, fires
              together. And it works in both directions &mdash; you can
              train your brain toward performance states just as reliably as
              you can train your body toward physical ones.
            </p>
          </Fade>
        </div>
      </section>

      {/* ── BOYLE'S / TM DIAGRAM ── */}
      <section className="bg-deep py-20 md:py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={grain} />
        <div className="max-w-[900px] mx-auto relative z-10">
          <Fade>
            <div className="text-center mb-12 md:mb-16">
              <div className="text-[11px] text-seafoam/60 font-medium tracking-[0.2em] uppercase mb-4">
                The epiphany
              </div>
              <h2 className="font-serif text-[clamp(1.8rem,4vw,2.8rem)] text-white leading-[1.15] tracking-tight max-w-[600px] mx-auto">
                Boyle&apos;s Law and the Transcendental Meditation diagram
              </h2>
            </div>
          </Fade>

          <Fade delay={60}>
            <div className="max-w-[680px] mx-auto mb-12">
              <p className="text-white/60 text-[1.05rem] leading-[1.85]">
                I had an epiphany during my AIDA instructor course. Everyone
                knows the Boyle&apos;s Law diagram: depth, pressure, gas
                volume. In Transcendental Meditation, they use a nearly
                identical diagram for states of consciousness. At the
                surface, full-volume mental activity. As you settle deeper,
                thought becomes subtler. The mental &ldquo;bubble&rdquo;
                gets smaller and quieter.
              </p>
            </div>
          </Fade>

          <Fade delay={120}>
            <DualDiagram />
          </Fade>

          <Fade delay={180}>
            <div className="max-w-[680px] mx-auto mt-12">
              <p className="text-white/60 text-[1.05rem] leading-[1.85] mb-7">
                In one case, the medium is air and the mechanism is
                hydrostatic pressure. In the other, the medium is attention
                and the mechanism is focused repetition. But the shape is
                identical: descent compresses. The deeper you go &mdash;
                physically or psychologically &mdash; the more concentrated
                and refined the experience becomes.
              </p>
              <p className="text-white/60 text-[1.05rem] leading-[1.85]">
                In TM, the tool that carries you down is a mantra &mdash; a
                single repeated sound. It functions as an anchor. You
                don&apos;t analyze it. You repeat it, and the repetition
                itself creates the descent. The mantra is the weight on the
                line.
              </p>
            </div>
          </Fade>
        </div>
      </section>

      <div className="bg-deep px-6">
        <div className="max-w-[900px] mx-auto">
          <PullQuote>
            The water is the meditation hall. The descent is the mantra. The
            anchor is whatever brings you home.
          </PullQuote>
        </div>
      </div>

      {/* ── STATE ANCHORS DEFINED ── */}
      <section className="bg-ocean py-20 md:py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={grain} />
        <div className="max-w-[680px] mx-auto relative z-10">
          <Fade>
            <div className="section-label text-seafoam before:bg-seafoam">
              The framework
            </div>
            <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] text-white leading-[1.15] tracking-tight mb-8">
              State anchors: making the invisible visible
            </h2>
          </Fade>

          <Fade delay={40}>
            <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-6 md:p-8 mb-10">
              <p className="font-serif text-xl md:text-2xl text-white/90 leading-snug italic">
                A state anchor is a cognitive cue &mdash; auditory, visual,
                or somatic &mdash; that you train to reliably trigger a
                specific psychological state.
              </p>
            </div>
          </Fade>

          <Fade delay={60}>
            <p className="text-white/60 text-[1.05rem] leading-[1.85] mb-7">
              Through daily conditioning, you pair the cue with the desired
              state until the neural pathway becomes automatic. What might
              initially require 30 minutes of progressive relaxation
              becomes accessible in 30 seconds through a trained trigger.
            </p>
          </Fade>

          <Fade delay={80}>
            <p className="text-white/60 text-[1.05rem] leading-[1.85] mb-7">
              This isn&apos;t a new idea. It&apos;s the oldest idea. What I
              call state anchors, Buddhist practitioners have called
              kamma&#7789;&#7789;h&#257;na for 2,500 years. What sports
              psychologists call visualization cues, contemplative
              traditions call{" "}
              <em className="text-seafoam">up&#257;ya</em> &mdash; skillful
              means. The mechanism is neuroplasticity. The application is
              performance. The lineage is ancient.
            </p>
          </Fade>

          <Fade delay={100}>
            <p className="text-white/60 text-[1.05rem] leading-[1.85]">
              Traditional visualization focuses on{" "}
              <strong className="text-white font-semibold">
                what to do
              </strong>{" "}
              &mdash; rehearsing the dive. State anchoring focuses on{" "}
              <strong className="text-white font-semibold">
                who to be
              </strong>{" "}
              &mdash; accessing a quality of consciousness that makes the
              procedural stuff work better. It&apos;s the layer underneath.
            </p>
          </Fade>
        </div>
      </section>

      {/* ── THREE PATHWAYS ── */}
      <section className="bg-deep py-20 md:py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={grain} />
        <div className="max-w-[900px] mx-auto relative z-10">
          <Fade>
            <div className="text-center mb-12 md:mb-16">
              <div className="text-[11px] text-seafoam/60 font-medium tracking-[0.2em] uppercase mb-4">
                Finding yours
              </div>
              <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] text-white leading-[1.15] tracking-tight">
                Three pathways to anchor discovery
              </h2>
            </div>
          </Fade>

          <Fade delay={80}>
            <PathwayTabs />
          </Fade>
        </div>
      </section>

      {/* ── PRACTICAL PROMISE ── */}
      <section className="bg-salt py-20 md:py-28 px-6 relative">
        <div className="absolute inset-0 opacity-[0.02]" style={grain} />
        <div className="max-w-[680px] mx-auto relative z-10">
          <Fade>
            <div className="section-label">The practical promise</div>
            <h2 className="section-title">
              30 minutes of relaxation
              <br />
              &rarr; 30 seconds
            </h2>
          </Fade>
        </div>

        <div className="max-w-[700px] mx-auto relative z-10 mt-10">
          <Fade delay={80}>
            <div className="bg-deep rounded-2xl p-6 md:p-10">
              <PracticeTimeline />
            </div>
          </Fade>
        </div>

        <div className="max-w-[680px] mx-auto relative z-10 mt-12">
          <Fade delay={120}>
            <p className="text-[1.05rem] leading-[1.85] text-[#2a2a2a] mb-7">
              You identify an anchor that resonates. You begin a daily
              conditioning practice: five to ten minutes, same time each
              day. The neural pathway between the cue and the state gets
              stronger and faster with each repetition.
            </p>
          </Fade>

          <Fade delay={140}>
            <p className="text-[1.05rem] leading-[1.85] text-[#2a2a2a] mb-7">
              Now imagine you&apos;re at the beach on a Saturday morning.
              You didn&apos;t sleep well. Work stress is lingering. The
              conditions are marginal. Six months ago, this would have
              produced a bad dive day &mdash; anxiety at the surface,
              tension on the descent, fighting the urge to breathe instead
              of releasing into it.
            </p>
          </Fade>

          <Fade delay={160}>
            <p className="text-[1.05rem] leading-[1.85] text-[#2a2a2a]">
              But you&apos;ve spent the last year conditioning a state
              anchor. You close your eyes at the buoy, invoke your cue, and
              within 30 seconds you&apos;re in the same psychological state
              that used to require a perfect morning and 30 minutes of
              preparation. That&apos;s the practical promise: reliable
              access to your optimal performance state regardless of
              external conditions.
            </p>
          </Fade>
        </div>
      </section>

      {/* ── BEYOND THE WATER ── */}
      <section className="bg-white py-20 md:py-28 px-6 relative">
        <div className="absolute inset-0 opacity-[0.015]" style={grain} />
        <div className="max-w-[680px] mx-auto relative z-10">
          <Fade>
            <div className="section-label">Beyond the water</div>
            <h2 className="section-title">
              The anchor doesn&apos;t care about context
            </h2>
          </Fade>

          <Fade delay={40}>
            <p className="text-[1.05rem] leading-[1.85] text-[#2a2a2a] mb-7">
              State anchoring develops metacognition &mdash; awareness of
              your own mental states and the ability to modulate them. Once
              you can notice &ldquo;I&apos;m in an anxious state&rdquo; and
              have a trained tool to shift toward &ldquo;I&apos;m in an
              alert-but-calm state,&rdquo; you have something that applies
              to every stressful situation in your life. Job interviews,
              difficult conversations, medical procedures, parenting
              moments where you need to stay composed.
            </p>
          </Fade>

          <Fade delay={60}>
            <p className="text-[1.05rem] leading-[1.85] text-[#2a2a2a]">
              There&apos;s a healing dimension too. The dissociation during
              deep breath-holds is structurally similar to what happens
              during trauma &mdash; the mind creating space between
              awareness and sensation. But in freediving, you&apos;re
              training this dissociation consciously and voluntarily, in a
              controlled environment. Through state anchoring, you build
              positive neural entrainment patterns that gradually override
              destructive ones. You&apos;re not just training to dive
              better. You&apos;re restructuring how your nervous system
              responds to stress.
            </p>
          </Fade>
        </div>
      </section>

      {/* ── HOW WE TEACH ── */}
      <section className="bg-ocean py-20 md:py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={grain} />
        <div className="max-w-[680px] mx-auto relative z-10">
          <Fade>
            <div className="section-label text-seafoam before:bg-seafoam">
              Implications
            </div>
            <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] text-white leading-[1.15] tracking-tight mb-8">
              What this means for how we teach
            </h2>
          </Fade>

          <Fade delay={40}>
            <div className="space-y-4 mb-12">
              {[
                "Pre-course module on state anchoring sent two weeks before arrival",
                "Structured guided sessions for anchor discovery during certification",
                "Post-course practice framework students continue developing for life",
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex gap-4 items-start bg-white/[0.04] border border-white/[0.06] rounded-xl p-5"
                >
                  <div className="w-7 h-7 rounded-full bg-seafoam/20 text-seafoam flex items-center justify-center text-sm font-semibold shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-white/60 text-[0.95rem] leading-relaxed">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </Fade>
        </div>

        <div className="max-w-[900px] mx-auto relative z-10">
          <PullQuote>
            Freediving isn&apos;t an extreme sport. It&apos;s a
            consciousness conditioning practice that happens to take place
            in the ocean.
          </PullQuote>
        </div>
      </section>

      {/* ── START HERE ── */}
      <section className="bg-salt py-20 md:py-28 px-6 relative">
        <div className="absolute inset-0 opacity-[0.02]" style={grain} />
        <div className="max-w-[680px] mx-auto relative z-10">
          <Fade>
            <div className="section-label">Start here</div>
            <h2 className="section-title">Find your anchor</h2>
          </Fade>

          <Fade delay={40}>
            <p className="text-[1.05rem] leading-[1.85] text-[#2a2a2a] mb-7">
              Something auditory, visual, or somatic that personally
              resonates. Give yourself five to ten minutes a day, at a
              consistent time, for at least a week. Track what you notice
              &mdash; in the water and in your daily life. Share what you
              find with your dive partner, your instructor, your community.
            </p>
          </Fade>

          <Fade delay={60}>
            <p className="text-[1.05rem] leading-[1.85] text-[#2a2a2a] mb-10">
              The most powerful thing about this practice is that it honors
              individual differences. What works for me won&apos;t work for
              you. The anaconda that puts one diver into an altered state
              means nothing to someone else. The mantra that carried me
              through monastery sits and through breath-holds at the canyon
              rim is just a sound to anyone who hasn&apos;t lived inside
              it. That&apos;s the point. The anchor has to be yours.
            </p>
          </Fade>

          <Fade delay={80}>
            <p className="text-[1.05rem] leading-[1.85] text-[#2a2a2a]">
              But the method &mdash; the systematic conditioning, the daily
              practice, the neuroplastic pathway from cue to state &mdash;
              that&apos;s universal. And it&apos;s been universal for a
              very long time. Long before anyone called it freediving.
            </p>
          </Fade>
        </div>
      </section>

      {/* ── FOOTER NOTE + CTA ── */}
      <section className="bg-white py-16 md:py-20 px-6">
        <div className="max-w-[680px] mx-auto">
          <Fade>
            <div className="border-t border-deep/10 pt-10 mb-12">
              <p className="text-sm text-[#5a6a7a] leading-relaxed italic">
                This post is adapted from &ldquo;State Anchors: Cognitive
                Tools for Holistic Apnea Training,&rdquo; a presentation
                given during my AIDA Instructor Course in Dahab, Egypt,
                with my first teacher Stella Abbas and my instructor
                trainer Khaled El Gammal both in the room. The 40-page
                research paper behind it is available on request.
              </p>
              <p className="text-sm text-[#5a6a7a] leading-relaxed mt-4">
                <strong className="text-deep font-semibold">
                  Joshua Beneventi
                </strong>{" "}
                is the founder of La Jolla Freedive Club and San
                Diego&apos;s only AIDA-certified freediving instructor for
                adults and children. He is an AIDA 4 Freediver, UCSD
                alumnus, and spent six months living in Theravada Buddhist
                monasteries in Thailand before finding freediving. He
                teaches every Saturday at La Jolla Shores.
              </p>
            </div>
          </Fade>

          <Fade delay={60}>
            <div className="bg-gradient-to-br from-ocean to-teal rounded-2xl p-10 text-center">
              <h3 className="font-serif text-2xl text-white mb-3">
                Ready to go deeper?
              </h3>
              <p className="text-white/60 text-sm mb-6 leading-relaxed">
                Join the LJFC community for courses, dive schedules, and
                consciousness conditioning workshops.
              </p>
              <Link
                href="/contact"
                className="inline-flex px-8 py-3 bg-coral text-white rounded-full font-semibold no-underline hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(232,115,74,0.4)] transition-all"
              >
                Get on the List &rarr;
              </Link>
            </div>
          </Fade>
        </div>
      </section>
    </>
  );
}
