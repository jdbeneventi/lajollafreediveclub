"use client";

import { useState } from "react";

export default function CharterAccordion() {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-seafoam/10 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 sm:px-8 py-5 bg-ocean/15 cursor-pointer border-none text-left hover:bg-ocean/25 transition-colors"
      >
        <div>
          <span className="block text-[9px] uppercase tracking-[0.18em] text-seafoam/40 font-medium mb-1">
            Charter &amp; Homeschool Families
          </span>
          <span className="font-serif text-base sm:text-lg text-white">
            Using enrichment funds for Camp Garibaldi
          </span>
        </div>
        <svg
          width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2"
          className={`text-white/25 shrink-0 ml-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="px-6 sm:px-8 py-6 border-t border-seafoam/[0.06]">
          {/* Funding breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-seafoam/[0.06] mb-5">
            {[
              { label: "Charter covers (5-day)", value: "$400", color: "text-seafoam", sub: "16 hrs × $25/hr · invoiced NET30" },
              { label: "Family pays (5-day)", value: "$350", color: "text-[#E8682A]", sub: "14 hrs beyond the 16-hr cap" },
              { label: "Family pays (3-day)", value: "$50", color: "text-[#E8682A]", sub: "16 of 18 hrs funded · only 2 hrs OOP" },
            ].map((c) => (
              <div key={c.label} className="bg-ocean/15 p-5">
                <div className="text-[9px] uppercase tracking-[0.18em] text-white/20 font-medium mb-2">{c.label}</div>
                <div className={`font-serif text-xl ${c.color} mb-1`}>{c.value}</div>
                <div className="text-[11px] text-white/25 leading-relaxed">{c.sub}</div>
              </div>
            ))}
          </div>

          <div className="border-l-2 border-seafoam/15 pl-4 mb-4 text-[13px] text-white/40 leading-[1.8]">
            <strong className="text-white/60 font-medium">How it works:</strong> Ask your assigned charter teacher to submit a Suggested Vendor Form for La Jolla Freedive Club. Once approved, your enrichment funds cover the charter-fundable portion and LJFC invoices the school directly.
          </div>

          <div className="text-[11px] text-white/20 leading-relaxed mb-4">
            Hour caps and fund amounts vary by charter and are set annually by each school&apos;s board. Figures above reflect PCA&apos;s published 16-hour cap. Confirm with your assigned teacher.
          </div>

          <a
            href="/camp-garibaldi/charter-funding"
            className="text-seafoam/60 text-[13px] no-underline border-b border-seafoam/20 pb-px hover:text-seafoam transition-colors"
          >
            Full charter funding guide →
          </a>
        </div>
      )}
    </div>
  );
}
