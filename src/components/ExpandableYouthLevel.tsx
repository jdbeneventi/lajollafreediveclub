"use client";

import { useState } from "react";

interface YouthLevel {
  level: string;
  emoji: string;
  age: string;
  maxDepth: string;
  description: string;
  skills: string[];
}

export function ExpandableYouthLevel({ course }: { course: YouthLevel }) {
  const [open, setOpen] = useState(false);

  return (
    <button
      onClick={() => setOpen(!open)}
      className="w-full text-left bg-salt rounded-2xl p-5 md:p-6 cursor-pointer border-none hover:bg-salt/80 transition-colors"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{course.emoji}</span>
          <h3 className="font-serif text-lg md:text-xl tracking-tight">{course.level}</h3>
        </div>
        <svg
          className={`w-5 h-5 text-[#5a6a7a] transition-transform duration-300 shrink-0 mt-1 ${open ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
      <div className="flex gap-2 mt-2">
        <span className="px-2 py-0.5 bg-coral/10 text-coral rounded-full text-[10px] font-semibold">{course.age}</span>
        <span className="px-2 py-0.5 bg-teal/10 text-teal rounded-full text-[10px] font-semibold">{course.maxDepth}</span>
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-[500px] opacity-100 mt-4" : "max-h-0 opacity-0"
        }`}
      >
        <p className="text-xs text-[#5a6a7a] leading-relaxed mb-3">{course.description}</p>
        <ul className="space-y-1.5">
          {course.skills.map((skill) => (
            <li key={skill} className="flex gap-2 items-start text-xs text-[#2a2a2a]">
              <svg className="w-3.5 h-3.5 text-seafoam shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
              {skill}
            </li>
          ))}
        </ul>
      </div>
    </button>
  );
}
