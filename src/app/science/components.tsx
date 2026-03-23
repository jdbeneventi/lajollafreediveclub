"use client";

import { useState, useEffect, useRef, ReactNode } from "react";

/* ─── Scroll-reveal ─── */
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

/* ─── Pull quote ─── */
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

/* ─── Animated comparison bars ─── */
export function ComparisonRow({
  label,
  left,
  right,
  leftPct,
  rightPct,
  delay = 0,
}: {
  label: string;
  left: string;
  right: string;
  leftPct: number;
  rightPct: number;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          obs.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className="mb-6">
      <div className="text-xs text-white/30 font-medium tracking-wide uppercase mb-3">
        {label}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="h-2.5 bg-white/[0.04] rounded-full overflow-hidden mb-1.5">
            <div
              className="h-full rounded-full bg-coral/60 transition-all duration-[1.5s] ease-out"
              style={{ width: visible ? `${leftPct}%` : "0%" }}
            />
          </div>
          <div className="text-xs text-white/40">{left}</div>
        </div>
        <div>
          <div className="h-2.5 bg-white/[0.04] rounded-full overflow-hidden mb-1.5">
            <div
              className="h-full rounded-full bg-seafoam/70 transition-all duration-[1.5s] ease-out"
              style={{
                width: visible ? `${rightPct}%` : "0%",
                transitionDelay: "0.3s",
              }}
            />
          </div>
          <div className="text-xs text-seafoam/60">{right}</div>
        </div>
      </div>
    </div>
  );
}

/* ─── Element cards (CO₂, NO, H₂O) ─── */
export function ElementCard({
  symbol,
  name,
  role,
  description,
  delay = 0,
}: {
  symbol: string;
  name: string;
  role: string;
  description: string;
  delay?: number;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <Fade delay={delay}>
      <div
        className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 md:p-8 cursor-pointer hover:bg-white/[0.05] transition-all group"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="font-serif text-4xl md:text-5xl text-sand/60 leading-none">
              {symbol}
            </div>
            <div className="text-white/70 font-medium text-sm mt-2">
              {name}
            </div>
            <div className="text-[10px] text-seafoam/50 font-medium tracking-[0.15em] uppercase mt-1">
              {role}
            </div>
          </div>
          <div
            className={`text-white/20 text-xl transition-transform duration-300 ${
              expanded ? "rotate-45" : ""
            }`}
          >
            +
          </div>
        </div>
        <div
          className={`overflow-hidden transition-all duration-500 ${
            expanded ? "max-h-[300px] opacity-100 mt-4" : "max-h-0 opacity-0"
          }`}
        >
          <div className="border-t border-white/[0.06] pt-4">
            <p className="text-white/50 text-sm leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </div>
    </Fade>
  );
}

/* ─── Protocol phase timeline ─── */
export function ProtocolTimeline() {
  const phases = [
    {
      num: "1",
      name: "The Field",
      sub: "Nervous system priming",
      time: "5\u20137 min",
      body: "Qi Gong-inspired movement \u2014 bouncing, swinging, shaking \u2014 to discharge stored tension and activate energy flow. Followed by nasal humming cycles to increase nitric oxide, and extended exhale patterns to activate vagal tone. The goal is to shift from sympathetic to parasympathetic dominance before CO\u2082 loading begins.",
      color: "from-teal/20 to-teal/5",
    },
    {
      num: "2",
      name: "The Forge",
      sub: "CO\u2082 tolerance protocol",
      time: "15\u201320 min",
      body: "Progressive breath holds at 50\u201370% lung capacity. Each cycle: partial inhale \u2192 hold to moderate CO\u2082 urge \u2192 partial exhale \u2192 hold to moderate CO\u2082 urge \u2192 incomplete recovery breath. Typical session: 6\u201310 cycles. BOLT score guides intensity and progression. This is the core mechanism \u2014 controlled hypercapnia that activates ASIC1a channels and opens the neuroplastic window.",
      color: "from-ocean/30 to-ocean/10",
    },
    {
      num: "3",
      name: "The Origin State",
      sub: "Neuroplastic window",
      time: "30\u201390 min",
      body: "The window is open. Heightened receptivity, reduced amygdalar reactivity, enhanced consolidation. This is where the integration work happens \u2014 coaching dialogue, community sharing, somatic processing, skill acquisition, or water practice. The protocol doesn\u2019t do the transformation. It opens the door. What you bring through the door is what changes.",
      color: "from-seafoam/20 to-seafoam/5",
    },
    {
      num: "4",
      name: "The Seal",
      sub: "Consolidation protection",
      time: "1\u20134 hrs",
      body: "Avoid high-stress activities during the consolidation period. Low-demand environment, light movement, minimal cognitive load. Memory consolidation research suggests this window is critical for durable encoding. The patterns you formed in the Origin State need time to set.",
      color: "from-sand/15 to-sand/5",
    },
  ];

  const [activePhase, setActivePhase] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {phases.map((p, i) => (
        <Fade key={p.num} delay={i * 60}>
          <div
            className={`bg-gradient-to-r ${p.color} border border-white/[0.06] rounded-2xl overflow-hidden cursor-pointer transition-all hover:border-white/[0.1]`}
            onClick={() => setActivePhase(activePhase === i ? null : i)}
          >
            <div className="p-6 md:p-8 flex items-start gap-5 md:gap-8">
              <div className="font-serif text-4xl md:text-5xl text-sand/30 leading-none shrink-0 w-12">
                {p.num}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-4">
                  <div>
                    <div className="font-serif text-xl md:text-2xl text-white">
                      {p.name}
                    </div>
                    <div className="text-[11px] text-seafoam/50 font-medium tracking-[0.15em] uppercase mt-1">
                      {p.sub}
                    </div>
                  </div>
                  <div className="text-white/30 text-sm tabular-nums shrink-0">
                    {p.time}
                  </div>
                </div>
                <div
                  className={`overflow-hidden transition-all duration-500 ${
                    activePhase === i
                      ? "max-h-[400px] opacity-100 mt-5"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-white/50 text-[0.95rem] leading-[1.8]">
                    {p.body}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Fade>
      ))}
    </div>
  );
}

/* ─── Expandable citation block ─── */
export function CitationBlock({
  category,
  citations,
}: {
  category: string;
  citations: { text: string; links: { label: string; url: string }[] }[];
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-white/[0.06] rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/[0.02] transition-colors"
      >
        <span className="text-[11px] text-seafoam/60 font-medium tracking-[0.15em] uppercase">
          {category}
        </span>
        <span
          className={`text-white/20 text-sm transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        >
          &#9662;
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-500 ${
          open ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-5 pb-5 space-y-4">
          {citations.map((c, i) => (
            <div
              key={i}
              className="text-white/30 text-[0.8rem] leading-[1.7] pl-4 border-l-2 border-teal/10"
            >
              <span dangerouslySetInnerHTML={{ __html: c.text }} />
              <br />
              <span className="inline-flex gap-3 mt-1">
                {c.links.map((l) => (
                  <a
                    key={l.label}
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-seafoam/40 hover:text-seafoam/70 no-underline transition-colors text-xs"
                  >
                    {l.label}
                  </a>
                ))}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
