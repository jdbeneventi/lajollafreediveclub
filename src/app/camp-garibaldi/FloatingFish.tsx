"use client";

import { useState } from "react";
import Link from "next/link";

export default function FloatingFish() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Contact menu */}
      {open && (
        <div className="bg-deep border border-seafoam/15 rounded-xl shadow-2xl shadow-black/30 p-4 w-56 animate-[fadeInUp_0.2s_ease-out]">
          <p className="text-white/40 text-[10px] uppercase tracking-widest font-medium mb-3">Get in touch</p>
          <div className="flex flex-col gap-1.5">
            <Link
              href="/camp-garibaldi/register"
              className="block px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/[0.04] rounded-lg no-underline transition-colors"
            >
              Reserve a Spot →
            </Link>
            <Link
              href="/contact"
              className="block px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/[0.04] rounded-lg no-underline transition-colors"
            >
              Ask a Question
            </Link>
            <a
              href="mailto:joshuabeneventi@gmail.com?subject=Camp Garibaldi Inquiry"
              className="block px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/[0.04] rounded-lg no-underline transition-colors"
            >
              Email Us
            </a>
          </div>
        </div>
      )}

      {/* Fish button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-16 h-16 flex items-center justify-center cursor-pointer border-none bg-transparent p-0 group"
        aria-label={open ? "Close contact menu" : "Contact us"}
        style={{ filter: "drop-shadow(0 4px 12px rgba(249,115,22,0.4))" }}
      >
        <svg
          viewBox="0 0 100 80"
          fill="none"
          className={`w-14 h-11 transition-transform duration-300 ${open ? "scale-110 rotate-12" : "camp-fish-bob"}`}
        >
          <ellipse cx="45" cy="40" rx="35" ry="28" fill="#F97316" />
          <ellipse cx="45" cy="40" rx="30" ry="23" fill="#FB923C" />
          <circle cx="25" cy="35" r="5" fill="#1E293B" />
          <circle cx="24" cy="34" r="2" fill="white" />
          <path d="M75 40 Q95 25 85 40 Q95 55 75 40" fill="#F97316" />
          <path d="M45 15 Q55 5 50 20 Q60 10 55 22 Q65 15 58 25" fill="#F97316" />
          <path d="M30 65 Q35 75 40 65" fill="#F97316" />
          <path d="M50 65 Q55 72 60 65" fill="#F97316" />
        </svg>
      </button>
    </div>
  );
}
