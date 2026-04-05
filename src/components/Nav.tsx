"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { Logo } from "./Logo";

const learnLinks = [
  { href: "/programs", label: "Programs & Courses" },
  { href: "/calendar", label: "Course Calendar" },
  { href: "/education", label: "Education" },
  { href: "/camp-garibaldi", label: "Camp Garibaldi" },
];

const navLinks = [
  { href: "/conditions", label: "Conditions" },
  { href: "/blog", label: "Journal" },
  { href: "/science", label: "Science" },
  { href: "/about", label: "About" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [learnOpen, setLearnOpen] = useState(false);
  const [mobileLearnOpen, setMobileLearnOpen] = useState(false);
  const learnRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close desktop dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (learnRef.current && !learnRef.current.contains(e.target as Node)) {
        setLearnOpen(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between transition-all duration-400 ${
        scrolled
          ? "bg-deep/[0.92] backdrop-blur-xl py-3 px-6 shadow-[0_4px_30px_rgba(0,0,0,0.2)]"
          : "py-5 px-6"
      }`}
    >
      <Link href="/" className="flex items-center gap-3 no-underline text-white">
        <Logo />
        <span className="font-serif text-xl tracking-tight whitespace-nowrap">
          La Jolla Freedive Club
        </span>
      </Link>

      {/* Desktop */}
      <ul className="hidden md:flex items-center gap-8 list-none">
        {/* Learn dropdown */}
        <li ref={learnRef} className="relative">
          <button
            onClick={() => setLearnOpen(!learnOpen)}
            onMouseEnter={() => setLearnOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setLearnOpen(true);
              } else if (e.key === "Escape") {
                setLearnOpen(false);
              }
            }}
            aria-expanded={learnOpen}
            aria-haspopup="true"
            className="flex items-center gap-1 text-white/80 text-sm tracking-wide hover:text-seafoam transition-colors bg-transparent border-none cursor-pointer p-0"
          >
            Learn
            <svg
              className={`w-3 h-3 transition-transform duration-200 ${
                learnOpen ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 12 12"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 4.5l3 3 3-3" />
            </svg>
          </button>

          {learnOpen && (
            <div
              className="absolute top-full left-1/2 -translate-x-1/2 pt-3"
              onMouseLeave={() => setLearnOpen(false)}
            >
              <div className="bg-deep/95 backdrop-blur-xl rounded-xl border border-white/10 shadow-[0_16px_48px_rgba(0,0,0,0.4)] py-2 min-w-[200px]">
                {learnLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setLearnOpen(false)}
                    className="block px-5 py-2.5 text-white/70 text-sm no-underline hover:text-seafoam hover:bg-white/[0.04] transition-colors"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </li>

        {navLinks.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-white/80 no-underline text-sm tracking-wide hover:text-seafoam transition-colors"
            >
              {l.label}
            </Link>
          </li>
        ))}
        <li>
          <Link
            href="/portal"
            className="text-white/50 text-sm font-medium hover:text-white transition-colors no-underline"
          >
            My Account
          </Link>
        </li>
        <li>
          <Link
            href="/contact"
            className="bg-coral text-white px-5 py-2.5 rounded-full text-sm font-medium hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(232,115,74,0.4)] transition-all no-underline"
          >
            Join the Club
          </Link>
        </li>
      </ul>

      {/* Mobile toggle */}
      <button
        className="md:hidden flex flex-col gap-[5px] bg-transparent border-none cursor-pointer p-2"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Menu"
      >
        <span
          className={`block w-6 h-[2px] bg-white transition-transform ${
            menuOpen ? "rotate-45 translate-y-[7px]" : ""
          }`}
        />
        <span
          className={`block w-6 h-[2px] bg-white transition-opacity ${
            menuOpen ? "opacity-0" : ""
          }`}
        />
        <span
          className={`block w-6 h-[2px] bg-white transition-transform ${
            menuOpen ? "-rotate-45 -translate-y-[7px]" : ""
          }`}
        />
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 bg-deep/95 backdrop-blur-xl md:hidden border-t border-white/10">
          <div className="flex flex-col p-6 gap-1">
            {/* Learn collapsible */}
            <button
              onClick={() => setMobileLearnOpen(!mobileLearnOpen)}
              className="flex items-center justify-between text-white/80 text-lg py-3 bg-transparent border-none cursor-pointer w-full text-left"
            >
              Learn
              <svg
                className={`w-4 h-4 text-white/30 transition-transform duration-200 ${
                  mobileLearnOpen ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 12 12"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 4.5l3 3 3-3" />
              </svg>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                mobileLearnOpen ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="pl-4 pb-2 flex flex-col gap-1 border-l border-white/10 ml-2">
                {learnLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setMenuOpen(false)}
                    className="text-white/50 no-underline text-base py-2 hover:text-seafoam transition-colors"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>

            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="text-white/80 no-underline text-lg py-3 hover:text-seafoam transition-colors"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setMenuOpen(false)}
              className="bg-coral text-white px-5 py-3 rounded-full text-center font-medium no-underline mt-3"
            >
              Join the Club
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
