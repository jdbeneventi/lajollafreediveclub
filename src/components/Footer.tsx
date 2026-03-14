import Link from "next/link";
import { Logo } from "./Logo";

const programLinks = [
  { href: "/programs#aida", label: "AIDA Certification" },
  { href: "/programs#discover", label: "Discover Freediving" },
  { href: "/programs#group", label: "Group Sessions" },
  { href: "/programs#coaching", label: "Private Coaching" },
  { href: "/programs#dry", label: "Dry Training" },
];

const communityLinks = [
  { href: "/camp-garibaldi", label: "Camp Garibaldi" },
  { href: "/blog", label: "The Journal" },
  { href: "/contact", label: "Events" },
];

const infoLinks = [
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
  { href: "/about#faq", label: "FAQ" },
];

export function Footer() {
  return (
    <footer className="bg-deep pt-20 pb-8 px-6 text-white/50">
      <div className="max-w-[1240px] mx-auto grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-12 mb-16">
        {/* Brand */}
        <div>
          <Link href="/" className="flex items-center gap-3 no-underline text-white mb-5">
            <Logo />
            <span className="font-serif text-xl tracking-tight">La Jolla Freedive Club</span>
          </Link>
          <p className="text-sm leading-relaxed max-w-[280px]">
            San Diego&apos;s freediving community. Courses, community dives, and ocean training in
            La Jolla, California.
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

        {/* Community */}
        <div>
          <h4 className="text-white text-xs font-semibold tracking-[0.1em] uppercase mb-5">
            Community
          </h4>
          <ul className="list-none flex flex-col gap-3">
            {communityLinks.map((l) => (
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
          {["Instagram", "YouTube", "TikTok"].map((s) => (
            <a
              key={s}
              href="#"
              className="w-9 h-9 rounded-full bg-white/[0.06] flex items-center justify-center text-white/50 text-xs hover:bg-teal hover:text-white transition-all no-underline"
            >
              {s.slice(0, 2)}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
