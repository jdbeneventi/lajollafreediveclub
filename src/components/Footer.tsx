import Link from "next/link";
import { Logo } from "./Logo";

const programLinks = [
  { href: "/programs", label: "All Programs" },
  { href: "/contact/courses?course=aida2", label: "AIDA 2 Course" },
  { href: "/contact/courses?course=discover", label: "Discover Freediving" },
  { href: "/contact/courses?course=group", label: "Group Sessions" },
  { href: "/contact/courses?course=private", label: "Private Coaching" },
  { href: "/camp-garibaldi", label: "Camp Garibaldi" },
];

const resourceLinks = [
  { href: "/conditions", label: "Live Conditions" },
  { href: "/map", label: "Underwater Field Guide" },
  { href: "/tides", label: "Tide Calendar" },
  { href: "/gear", label: "Gear Guide" },
  { href: "/blog", label: "The Journal" },
];

const infoLinks = [
  { href: "/about", label: "Our Story" },
  { href: "/contact", label: "Contact" },
  { href: "/contact/courses", label: "Course Inquiry" },
  { href: "/contact/camp", label: "Camp Inquiry" },
  { href: "/about#faq", label: "FAQ" },
];

export function Footer() {
  return (
    <footer className="bg-deep pt-20 pb-8 px-6 text-white/50">
      <div className="max-w-[1240px] mx-auto grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr] gap-8 md:gap-12 mb-16">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <Link href="/" className="flex items-center gap-3 no-underline text-white mb-5">
            <Logo />
            <span className="font-serif text-xl tracking-tight">La Jolla Freedive Club</span>
          </Link>
          <p className="text-sm leading-relaxed max-w-[280px] mb-4">
            San Diego&apos;s freediving community. AIDA courses, ocean training, live dive
            conditions, and Camp Garibaldi for kids — all based in La Jolla, California.
          </p>
          <p className="text-xs text-white/30">
            AIDA Instructor &amp; Youth Instructor · DAN Insured
          </p>
        </div>

        {/* Programs */}
        <div>
          <h4 className="text-white text-xs font-semibold tracking-[0.1em] uppercase mb-5">
            Programs
          </h4>
          <ul className="list-none flex flex-col gap-3">
            {programLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-white/50 no-underline text-sm hover:text-seafoam transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 className="text-white text-xs font-semibold tracking-[0.1em] uppercase mb-5">
            Resources
          </h4>
          <ul className="list-none flex flex-col gap-3">
            {resourceLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-white/50 no-underline text-sm hover:text-seafoam transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Info */}
        <div>
          <h4 className="text-white text-xs font-semibold tracking-[0.1em] uppercase mb-5">Info</h4>
          <ul className="list-none flex flex-col gap-3">
            {infoLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-white/50 no-underline text-sm hover:text-seafoam transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-[1240px] mx-auto pt-8 border-t border-white/[0.08] flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
        <span>&copy; {new Date().getFullYear()} La Jolla Freedive Club. All rights reserved.</span>
        <div className="flex gap-4">
          {[
            { label: "In", href: "#" },
            { label: "Yt", href: "#" },
            { label: "Tk", href: "#" },
          ].map((s) => (
            <a
              key={s.label}
              href={s.href}
              className="w-9 h-9 rounded-full bg-white/[0.06] flex items-center justify-center text-white/50 text-xs hover:bg-teal hover:text-white transition-all no-underline"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
