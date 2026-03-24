import Link from "next/link";
import { PasswordGate } from "@/components/PasswordGate";

const grain = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
};

const phase1 = [
  { week: "Week 1", items: [
    { done: false, text: "Introduce yourself to La Jolla Shores lifeguards (in person, Saturday)" },
    { done: false, text: "Email Dr. Elaine Yu at UCSD — freediving lung ultrasound researcher" },
    { done: false, text: "Email John Prins at Fins and Foam — Go Deep California organizer" },
  ]},
  { week: "Weeks 2–3", items: [
    { done: false, text: "Call CA State Lands Commission (916-574-1940) — sovereign lands lease" },
    { done: false, text: "Call USCG Sector San Diego — PATON coordinator" },
    { done: false, text: "Call Army Corps, LA District (213-452-3425) — Section 10 permit" },
    { done: false, text: "Call CDFW San Diego (858-467-4201) — MPA compatibility" },
    { done: false, text: "Call CA Coastal Commission SD (619-767-2370) — CDP/exemption" },
    { done: false, text: "Contact SD Mooring Co (619-291-0916) — buoy hardware quotes" },
  ]},
  { week: "Week 4", items: [
    { done: false, text: "Attend La Jolla Shores Association meeting — be known, don't pitch" },
    { done: false, text: "Contact DAN Research (research@dan.org) — endorsement letter" },
    { done: false, text: "Contact US Freediving — sanctioning and endorsement" },
  ]},
];

const phase2 = [
  { done: false, text: "Run Camp Garibaldi first session — document everything" },
  { done: false, text: "Plan fall 2026 competition event with Prins (boat-based platform)" },
  { done: false, text: "Collect letters of support: UCSD, DAN, US Freediving, Lifeguards, Scripps" },
];

const phase3 = [
  { done: false, text: "File USCG PATON Application (Form CG-2554)" },
  { done: false, text: "File CA State Lands Commission lease application" },
  { done: false, text: "File Army Corps Section 10 notification" },
  { done: false, text: "Submit CDFW MPA compatibility review" },
  { done: false, text: "File Coastal Commission CDP or exemption request" },
];

const phase4 = [
  { done: false, text: "Host first competition event (fall 2026) — temporary platform" },
  { done: false, text: "Formalize UCSD partnership (MOU with Div. of Hyperbaric Medicine)" },
  { done: false, text: "Build military connection via UCSD researchers → NSW medical" },
  { done: false, text: "Apply for grants: SD Foundation, SD Oceans Foundation, DAN" },
  { done: false, text: "Pitch media: La Jolla Light → Union-Tribune → TV → DeeperBlue" },
];

const contacts = [
  { category: "UCSD Hyperbaric Medicine", people: [
    { name: "Dr. Elaine Yu", role: "Freediving field researcher, lung ultrasound", contact: "UCSD emergency medicine dept" },
    { name: "Dr. Charlotte Sadler", role: "Fellowship director", contact: "csadler@ucsd.edu" },
    { name: "Dr. Ian Grover", role: "Medical Director", contact: "UCSD emergency medicine dept" },
  ]},
  { category: "Competition", people: [
    { name: "John Prins", role: "Fins and Foam / Go Deep California", contact: "john@finsandfoamfreediving.com" },
    { name: "US Freediving", role: "National governing body", contact: "usafreediving.com" },
  ]},
  { category: "Research & Safety", people: [
    { name: "DAN Research", role: "Grants, endorsement", contact: "research@dan.org" },
    { name: "Scripps Oceanography", role: "Institutional partner", contact: "scrippsnews@ucsd.edu" },
  ]},
  { category: "Regulatory", people: [
    { name: "CA State Lands Commission", role: "Sovereign lands lease", contact: "916-574-1940" },
    { name: "USCG San Diego", role: "PATON authorization", contact: "Sector main line" },
    { name: "Army Corps LA District", role: "Section 10 permit", contact: "213-452-3425" },
    { name: "CDFW San Diego", role: "MPA review", contact: "858-467-4201" },
    { name: "CA Coastal Commission SD", role: "CDP/exemption", contact: "619-767-2370" },
  ]},
];

const milestones = [
  { time: "6 months", text: "Lifeguards know your name. UCSD researchers have visited. Fall competition on calendar. Permits filed. Camp Garibaldi has run." },
  { time: "12 months", text: "First ocean-based AIDA depth competition in the US. Media coverage. Permits progressing with institutional support." },
  { time: "18 months", text: "Permanent buoy installed. Annual competition established. UCSD MOU formalized. Military conversations underway." },
  { time: "3 years", text: "OHPC is a recognized institution — international competition, published research, military training, Camp Garibaldi scholarships." },
];

function Checklist({ items }: { items: { done: boolean; text: string }[] }) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="flex gap-3 items-start">
          <div className={`w-5 h-5 rounded border shrink-0 mt-0.5 flex items-center justify-center ${item.done ? "bg-seafoam border-seafoam" : "border-white/15"}`}>
            {item.done && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0B1D2C" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
          </div>
          <span className={`text-sm leading-relaxed ${item.done ? "text-white/30 line-through" : "text-white/60"}`}>{item.text}</span>
        </div>
      ))}
    </div>
  );
}

export default function OHPCPlanPage() {
  return (
    <PasswordGate>
      <div className="bg-deep min-h-screen text-salt">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={grain} />

        {/* Header */}
        <div className="pt-32 pb-16 px-6 md:px-12 max-w-[900px] mx-auto relative z-10">
          <div className="text-[11px] text-seafoam/50 font-medium tracking-[0.2em] uppercase mb-4">
            Internal · Action Plan
          </div>
          <h1 className="font-serif text-[clamp(2.2rem,5vw,3.5rem)] text-white font-normal leading-[1.1] tracking-tight mb-4">
            OHPC — The Permanent Buoy<br />&amp; Everything It Unlocks
          </h1>
          <p className="text-white/40 text-sm mb-6">
            32.856746°N, 117.262603°W · Canyon rim · 50m depth · 500m offshore
          </p>
          <div className="flex gap-3">
            <Link href="/ohpc" className="text-xs text-seafoam/50 hover:text-seafoam transition-colors no-underline border border-seafoam/15 rounded-full px-4 py-2 hover:border-seafoam/30">
              Vision Document &rarr;
            </Link>
          </div>
        </div>

        {/* Phase 1 */}
        <section className="px-6 md:px-12 pb-16 max-w-[900px] mx-auto relative z-10">
          <div className="border-t border-white/[0.06] pt-12">
            <h2 className="font-serif text-2xl text-white mb-2">Phase 1: Foundation</h2>
            <p className="text-white/30 text-sm mb-8">Weeks 1–4</p>
            <div className="space-y-10">
              {phase1.map((week) => (
                <div key={week.week}>
                  <div className="text-[11px] text-seafoam/50 font-medium tracking-[0.15em] uppercase mb-4">{week.week}</div>
                  <Checklist items={week.items} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Phase 2 */}
        <section className="px-6 md:px-12 pb-16 max-w-[900px] mx-auto relative z-10">
          <div className="border-t border-white/[0.06] pt-12">
            <h2 className="font-serif text-2xl text-white mb-2">Phase 2: Proof of Concept</h2>
            <p className="text-white/30 text-sm mb-8">Months 2–4</p>
            <Checklist items={phase2} />
          </div>
        </section>

        {/* Phase 3 */}
        <section className="px-6 md:px-12 pb-16 max-w-[900px] mx-auto relative z-10">
          <div className="border-t border-white/[0.06] pt-12">
            <h2 className="font-serif text-2xl text-white mb-2">Phase 3: File Applications</h2>
            <p className="text-white/30 text-sm mb-8">Months 3–5</p>
            <Checklist items={phase3} />
          </div>
        </section>

        {/* Phase 4 */}
        <section className="px-6 md:px-12 pb-16 max-w-[900px] mx-auto relative z-10">
          <div className="border-t border-white/[0.06] pt-12">
            <h2 className="font-serif text-2xl text-white mb-2">Phase 4: While Permits Process</h2>
            <p className="text-white/30 text-sm mb-8">Months 5–12</p>
            <Checklist items={phase4} />
          </div>
        </section>

        {/* Contacts */}
        <section className="px-6 md:px-12 pb-16 max-w-[900px] mx-auto relative z-10">
          <div className="border-t border-white/[0.06] pt-12">
            <h2 className="font-serif text-2xl text-white mb-8">Key Contacts</h2>
            <div className="space-y-8">
              {contacts.map((cat) => (
                <div key={cat.category}>
                  <div className="text-[11px] text-seafoam/50 font-medium tracking-[0.15em] uppercase mb-4">{cat.category}</div>
                  <div className="space-y-3">
                    {cat.people.map((p) => (
                      <div key={p.name} className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-5 py-4 flex flex-col md:flex-row md:items-center gap-1 md:gap-6">
                        <div className="text-white/80 text-sm font-medium min-w-[180px]">{p.name}</div>
                        <div className="text-white/35 text-xs flex-1">{p.role}</div>
                        <div className="text-seafoam/50 text-xs font-mono">{p.contact}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Milestones */}
        <section className="px-6 md:px-12 pb-16 max-w-[900px] mx-auto relative z-10">
          <div className="border-t border-white/[0.06] pt-12">
            <h2 className="font-serif text-2xl text-white mb-8">What Success Looks Like</h2>
            <div className="space-y-6">
              {milestones.map((m) => (
                <div key={m.time} className="flex gap-6 items-start">
                  <div className="text-sand/50 font-serif text-lg min-w-[100px] shrink-0">{m.time}</div>
                  <div className="text-white/50 text-sm leading-relaxed">{m.text}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Emergency chain */}
        <section className="px-6 md:px-12 pb-16 max-w-[900px] mx-auto relative z-10">
          <div className="border-t border-white/[0.06] pt-12">
            <h2 className="font-serif text-2xl text-white mb-8">Emergency Medical Chain</h2>
            <div className="space-y-3">
              {[
                "On-site: Emergency O₂, ACLS medic, safety freedivers, evacuation boat",
                "UCSD Hyperbaric Medicine Center, Hillcrest — 15 min. 24/7 diving emergency. Only civilian facility Mexico → LA County.",
                "UCSD Hyperbaric, Encinitas — additional multiplace chamber",
                "Sharp Grossmont Hospital — DAN-affiliated hyperbaric",
                "Naval Medical Center San Diego — military hyperbaric",
                "DAN Emergency Hotline: +1-919-684-9111 (24/7)",
              ].map((item, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-coral/15 text-coral flex items-center justify-center text-xs font-semibold shrink-0">{i + 1}</div>
                  <span className="text-white/50 text-sm leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="px-6 md:px-12 pb-20 max-w-[900px] mx-auto relative z-10">
          <div className="border-t border-white/[0.06] pt-8 text-center">
            <p className="text-white/15 text-xs">
              La Jolla Freedive Club · Internal Document · March 2026
            </p>
            <p className="text-white/10 text-xs mt-2 italic">
              It starts from the inside out.
            </p>
          </div>
        </div>
      </div>
    </PasswordGate>
  );
}
