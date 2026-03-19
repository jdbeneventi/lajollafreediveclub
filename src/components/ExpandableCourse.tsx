"use client";

import { useState } from "react";
import Link from "next/link";

function Check() {
  return (
    <svg className="w-5 h-5 text-seafoam shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-5 h-5 text-[#5a6a7a] transition-transform duration-300 ${open ? "rotate-180" : ""}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

interface CourseData {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  priceNote: string;
  duration: string;
  level: string;
  maxDepth?: string;
  gradient: string;
  description: string;
  skills?: string[];
  includes?: string[];
  requirements?: {
    age: string;
    swim: string;
    prerequisites: string;
    certification: string;
  };
  format?: {
    duration: string;
    theory: string;
    water: string;
    ratios: string;
  };
}

export function ExpandableCourse({ course, isAida }: { course: CourseData; isAida: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <div id={course.id} className="bg-white rounded-2xl overflow-hidden shadow-sm scroll-mt-28">
      {isAida && <div className={`h-3 bg-gradient-to-r ${course.gradient}`} />}
      {!isAida && <div className={`h-2 bg-gradient-to-r ${course.gradient}`} />}

      {/* Collapsed header — always visible */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left p-6 md:p-8 cursor-pointer bg-transparent border-none flex flex-col md:flex-row md:items-center gap-4 md:gap-8 hover:bg-salt/50 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="px-2.5 py-0.5 bg-teal/10 text-teal rounded-full text-[10px] font-semibold">
              {course.duration}
            </span>
            <span className="px-2.5 py-0.5 bg-deep/[0.06] text-[#5a6a7a] rounded-full text-[10px] font-semibold">
              {course.level}
            </span>
            {course.maxDepth && (
              <span className="px-2.5 py-0.5 bg-coral/10 text-coral rounded-full text-[10px] font-semibold">
                Max depth: {course.maxDepth}
              </span>
            )}
          </div>
          <h2 className={`font-serif ${isAida ? "text-2xl md:text-3xl" : "text-xl md:text-2xl"} tracking-tight`}>{course.title}</h2>
          <p className="text-[#5a6a7a] text-sm mt-1">{course.subtitle}</p>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="text-right">
            <div className="font-serif text-2xl md:text-3xl text-deep tracking-tight">{course.price}</div>
            <div className="text-[10px] text-[#5a6a7a] max-w-[180px]">{course.priceNote}</div>
          </div>
          <ChevronDown open={open} />
        </div>
      </button>

      {/* Expanded details */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 md:px-8 pb-8 border-t border-deep/[0.06]">
          <p className="text-[0.95rem] leading-relaxed text-[#2a2a2a] mt-6 mb-8">{course.description}</p>

          {/* Two-column: Skills + Requirements (AIDA courses) */}
          {isAida && course.skills && course.requirements && (
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-teal mb-4">
                  What you&apos;ll learn
                </h3>
                <ul className="space-y-2.5">
                  {course.skills.map((skill) => (
                    <li key={skill} className="flex gap-3 items-start text-sm text-[#2a2a2a]">
                      <Check />
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-teal mb-4">
                  Requirements
                </h3>
                <div className="space-y-4">
                  {[
                    { label: "Age", value: course.requirements.age },
                    { label: "Swim test", value: course.requirements.swim },
                    { label: "Prerequisites", value: course.requirements.prerequisites },
                    { label: "Certification standards", value: course.requirements.certification },
                  ].map((req) => (
                    <div key={req.label}>
                      <div className="text-xs font-semibold text-[#5a6a7a] uppercase tracking-wide mb-1">
                        {req.label}
                      </div>
                      <div className="text-sm text-[#2a2a2a]">{req.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Includes list (non-AIDA programs) */}
          {!isAida && course.includes && (
            <ul className="space-y-2.5 mb-8">
              {course.includes.map((item) => (
                <li key={item} className="flex gap-3 items-start text-sm text-[#2a2a2a]">
                  <Check />
                  {item}
                </li>
              ))}
            </ul>
          )}

          {/* Course format (AIDA courses) */}
          {isAida && course.format && (
            <div className="bg-salt rounded-xl p-6 mb-8">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-teal mb-4">
                Course format
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Duration", value: course.format.duration },
                  { label: "Theory", value: course.format.theory },
                  { label: "Water sessions", value: course.format.water },
                  { label: "Ratios", value: course.format.ratios },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="text-xs font-semibold text-[#5a6a7a] uppercase tracking-wide mb-1">
                      {item.label}
                    </div>
                    <div className="text-sm text-[#2a2a2a] leading-relaxed">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Link href="/contact/courses" className="inline-flex items-center gap-2 px-7 py-3 bg-coral text-white rounded-full font-medium text-[0.9rem] no-underline hover:shadow-[0_8px_25px_rgba(199,91,58,0.4)] transition-all">
            Get started →
          </Link>
        </div>
      </div>
    </div>
  );
}
