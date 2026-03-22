"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";

const links = [
  { href: "/programs", label: "Programs" },
  { href: "/education", label: "Education" },
  { href: "/conditions", label: "Conditions" },
  { href: "/map", label: "Field Guide" },
  { href: "/blog", label: "Journal" },
  { href: "/community", label: "Community" },
  { href: "/about", label: "About" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
        {links.map((l) => (
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
          <div className="flex flex-col p-6 gap-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="text-white/80 no-underline text-lg py-2 hover:text-seafoam transition-colors"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setMenuOpen(false)}
              className="bg-coral text-white px-5 py-3 rounded-full text-center font-medium no-underline mt-2"
            >
              Join the Club
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
