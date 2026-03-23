"use client";

import { useState, useEffect, useRef, ReactNode } from "react";

/* ─── Scroll-reveal wrapper ─── */
export function Fade({
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

/* ─── Animated bar (scroll-triggered) ─── */
export function AnimatedBar({
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
export function FlipCard({
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
export function DualDiagram() {
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
export function PathwayTabs() {
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
          detail: "Sustained humming stimulates the vagus nerve \u2014 the same pathway as the dive reflex.",
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
          name: "Pa\u1E6Dibh\u0101ga-nimitta",
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
export function PracticeTimeline() {
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
export function PullQuote({ children }: { children: ReactNode }) {
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
