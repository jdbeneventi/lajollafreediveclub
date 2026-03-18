"use client";

import { useEffect, useRef } from "react";


export function HeroScene() {
  const sceneRef = useRef<HTMLDivElement>(null);

  /* Parallax on mouse move (desktop only, subtle) */
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let rafId: number;
    const handleMove = (e: MouseEvent) => {
      rafId = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        scene.style.setProperty("--mx", `${x}`);
        scene.style.setProperty("--my", `${y}`);
      });
    };

    window.addEventListener("mousemove", handleMove);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div ref={sceneRef} className="hero-scene" style={{ "--mx": "0", "--my": "0" } as React.CSSProperties}>
      {/* ── Base image ── */}
      <div className="absolute inset-0 hero-img-wrap">
        <img
          src="/images/hero.jpg"
          alt=""
          className="w-full h-full object-cover scale-[1.05]"
          style={{ transform: "scale(1.05) translate(calc(var(--mx) * -8px), calc(var(--my) * -5px))" }}
        />
      </div>

      {/* ── Depth layers ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-deep/90 via-deep/30 to-ocean/90" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_40%,transparent_0%,rgba(11,29,44,0.7)_100%)]" />

      {/* ── (caustics & light rays removed — too distracting) ── */}

      {/* ── (bubbles/particles removed — too distracting) ── */}

      {/* ── Bottom fade ── */}
      <div className="absolute bottom-0 left-0 right-0 h-[120px] bg-gradient-to-t from-salt via-salt/40 to-transparent" />

      {/* ── Vignette ── */}
      <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(11,29,44,0.5)]" />

      {/* ── Depth indicator (decorative, desktop) ── */}
      <div className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 flex-col items-center gap-1 z-20 hero-depth-indicator">
        <span className="text-white/20 text-[9px] tracking-[0.2em] uppercase font-medium rotate-180 [writing-mode:vertical-lr]">
          Surface
        </span>
        <div className="w-px h-24 bg-gradient-to-b from-white/25 via-white/10 to-transparent relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-seafoam/60 hero-depth-dot" />
        </div>
        <span className="text-white/15 text-[9px] tracking-[0.2em] uppercase font-medium rotate-180 [writing-mode:vertical-lr]">
          Depth
        </span>
      </div>

      {/* ── Grain overlay ── */}
      <div className="absolute inset-0 hero-grain opacity-[0.03] pointer-events-none" />
    </div>
  );
}
