import { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { EmailCapture } from "@/components/EmailCapture";

export const metadata: Metadata = {
  title: "Freediving Gear Guide for La Jolla | La Jolla Freedive Club",
  description: "What to wear and bring for freediving in La Jolla at every water temperature. Wetsuit guide, fin recommendations, mask selection, and essential safety gear.",
};

const WETSUIT_GUIDE = [
  {
    range: "70°F+", season: "Late summer peak", months: "Aug–Sep",
    recommendation: "3mm full suit or shorty",
    detail: "The warmest La Jolla gets. A 3mm full suit is comfortable for extended sessions. Shorty works for shorter dives but you'll feel it after an hour.",
    color: "#1B6B6B",
  },
  {
    range: "65–70°F", season: "Summer", months: "Jun–Aug, Oct",
    recommendation: "3mm full suit",
    detail: "The sweet spot. A good 3mm suit keeps you comfortable for 2+ hour sessions. Open-cell interior dries faster and insulates better than lined neoprene.",
    color: "#1B6B6B",
  },
  {
    range: "60–65°F", season: "Spring / Fall transition", months: "Apr–May, Nov",
    recommendation: "5mm full suit",
    detail: "You'll want the extra thickness. A 5mm with smooth-skin exterior reduces wind chill on the surface. Hood optional but recommended for longer sessions.",
    color: "#D4A574",
  },
  {
    range: "56–60°F", season: "Winter / Early spring", months: "Dec–Mar",
    recommendation: "5mm + hood",
    detail: "Cold enough to significantly reduce breath hold capacity. Hood keeps your head warm and prevents brain freeze on duck dives. Consider 5mm gloves for deep dives.",
    color: "#163B4E",
  },
  {
    range: "Below 56°F", season: "Deep winter / Upwelling", months: "Jan–Feb (or upwelling events)",
    recommendation: "5mm + hood + gloves, or 7mm",
    detail: "Canyon water can drop to 49°F at depth in winter. Limit session length. A 7mm suit or adding a hooded vest under your 5mm makes a big difference. Cold water kills breath hold.",
    color: "#0B1D2C",
  },
];

const GEAR_SECTIONS = [
  {
    title: "Mask",
    items: [
      { name: "Low-volume frameless mask", why: "The single most important piece of freediving gear. Low internal volume means less air to equalize at depth. Frameless design sits closer to your face, improving field of view and reducing drag.", tip: "Look for masks under 100ml internal volume. Popular choices: Cressi Atom, Omer UP-M1, Molchanovs CORE. Black silicone skirt reduces glare." },
      { name: "Nose clip (optional)", why: "Some freedivers prefer a nose clip with goggles for depth training — eliminates mask equalization entirely. Not for ocean exploration dives, but great for line work.", tip: "Mouthfill equalization works with or without a mask. Train both." },
    ],
  },
  {
    title: "Fins",
    items: [
      { name: "Long-blade freediving fins", why: "Freediving fins are 2-3x longer than scuba fins. The longer blade converts each kick into more forward propulsion with less effort — critical for breath-hold diving where efficiency = survival.", tip: "Start with polymer/fiberglass blades. Carbon fiber is more efficient but more fragile and expensive. Foot pocket fit matters more than blade material." },
      { name: "Proper foot pockets", why: "The connection between your foot and the blade. A sloppy fit wastes energy. Too tight causes cramps. This is where most beginners go wrong.", tip: "Try on with 2-3mm neoprene socks (what you'll wear diving). Your heel should be locked in with no lift. Toes should not be crunched." },
    ],
  },
  {
    title: "Snorkel",
    items: [
      { name: "Simple J-tube snorkel", why: "Freediving snorkels have no purge valve, no splash guard, no flex tube. Just a simple tube. Less drag, less stuff to break, and you remove it from your mouth before every dive anyway.", tip: "Bright color helps your buddy spot you. Remove from mouth before duck diving — never freedive with a snorkel in your mouth." },
    ],
  },
  {
    title: "Weight",
    items: [
      { name: "Rubber weight belt", why: "Rubber belts grip your wetsuit and don't slide. Nylon buckle belts slip when you duck dive. A proper weight belt is the difference between streamlined diving and constantly adjusting.", tip: "You should be neutrally buoyant at ~10m (33ft) with empty lungs. This means you're slightly positive at the surface (safe) and slightly negative at depth (efficient). Overweighting is the most common beginner mistake." },
      { name: "Neck weight (optional)", why: "Moves weight off your hips and onto your chest/neck. Helps with trim — keeps you horizontal and streamlined instead of feet-heavy.", tip: "Start with a belt. Add a neck weight later once your technique is solid. 1-2 lbs on the neck replaces 2-3 lbs on the belt." },
    ],
  },
  {
    title: "Safety gear",
    items: [
      { name: "Float, flag, and line", why: "Required by law for beach diving in La Jolla. The float marks your position for boats. The flag signals divers below. The line is your descent/ascent reference.", tip: "Bright orange or red float. Dive flag must be visible from 200+ yards. The line also serves as your safety reference if you lose orientation." },
      { name: "Dive computer / watch", why: "Tracks your depth, dive time, surface interval, and number of dives. Essential for monitoring your diving and staying within safe limits.", tip: "Freediving mode is different from scuba mode — make sure your computer has it. Popular: Suunto D4f, Garmin Descent, Shearwater Peregrine." },
      { name: "Buddy", why: "Never freedive alone. Your buddy watches from the surface during your dive and is there to assist if you have a blackout or loss of motor control. This is non-negotiable.", tip: "One up, one down. Always. The #1 cause of freediving fatalities is diving alone." },
    ],
  },
  {
    title: "Nice to have",
    items: [
      { name: "Freediving wetsuit (open cell)", why: "Purpose-built freediving suits use open-cell neoprene on the inside — it creates suction against your skin for incredible insulation. The exterior is smooth (no zippers, minimal seams) for less drag.", tip: "Open-cell suits require lube to put on (conditioner + water). They're fragile — fingernails will tear them. But the warmth and flexibility difference vs a scuba suit is dramatic." },
      { name: "Lanyard", why: "Connects you to the dive line during depth training. If you black out, you stay on the line where your buddy can reach you.", tip: "Required for any line diving. Quick-release mechanism is essential — you must be able to detach in an emergency." },
      { name: "Dive light", why: "Even during the day, a light helps you peek into crevices on the canyon wall. At night, it's essential — the canyon comes alive after dark.", tip: "Compact, bright, with a wrist lanyard. 1000+ lumens for night dives. Lower output for day exploring." },
    ],
  },
];

export default function GearPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-deep to-ocean pt-36 pb-20 px-6 text-center">
        <Reveal>
          <div className="section-label text-seafoam before:bg-seafoam justify-center">
            Gear Guide
          </div>
          <h1 className="font-serif text-[clamp(2.5rem,5vw,4rem)] text-white font-normal leading-tight tracking-tight mb-6">
            What to wear, what to bring,<br className="hidden sm:block" /> what to rent.
          </h1>
          <p className="text-lg text-white/60 max-w-[560px] mx-auto leading-relaxed">
            La Jolla water ranges from 56°F in winter to 72°F in late summer.
            The right gear makes the difference between a 20-minute shiver and a 2-hour session.
          </p>
        </Reveal>
      </section>

      {/* Wetsuit guide by temperature */}
      <section className="bg-salt py-20 px-6">
        <Reveal>
          <div className="max-w-4xl mx-auto">
            <div className="section-label text-teal before:bg-teal">Wetsuit Guide</div>
            <h2 className="font-serif text-3xl text-deep mb-2">By water temperature</h2>
            <p className="text-sm text-[#5a6a7a] mb-8">Check today&apos;s water temp on our <Link href="/conditions" className="text-teal no-underline hover:underline">conditions page</Link></p>

            <div className="space-y-3">
              {WETSUIT_GUIDE.map((w) => (
                <div key={w.range} className="bg-white rounded-xl overflow-hidden">
                  <div className="flex">
                    <div className="w-2 shrink-0" style={{ background: w.color }} />
                    <div className="p-5 flex-1">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <span className="font-serif text-lg text-deep">{w.range}</span>
                          <span className="text-[10px] text-[#5a6a7a] ml-2">{w.season} · {w.months}</span>
                        </div>
                        <span className="px-3 py-1 bg-deep/5 rounded-full text-xs text-deep font-medium shrink-0">{w.recommendation}</span>
                      </div>
                      <p className="text-xs text-[#5a6a7a] leading-relaxed">{w.detail}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-4 bg-white rounded-xl">
              <p className="text-xs text-[#5a6a7a] leading-relaxed">
                <strong className="text-deep">Cold water tip:</strong> Water temperature drops 2-4°F per 30ft of depth in La Jolla Canyon.
                If the surface is 62°F, the canyon wall at 80ft might be 56°F.
                Winter canyon temps can hit 49°F at depth. Dress for the deepest water you plan to reach, not the surface temp.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Stats Strip */}
      <section className="bg-deep py-16 px-6">
        <Reveal>
          <div className="max-w-3xl mx-auto grid grid-cols-3 gap-8 text-center">
            {[
              { number: "55-72°F", label: "Water range" },
              { number: "3-7mm", label: "Wetsuit range" },
              { number: "5", label: "Essential items" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-serif text-2xl md:text-3xl text-white mb-1">{stat.number}</div>
                <div className="text-xs text-white/40 tracking-wide uppercase">{stat.label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Gear sections */}
      <section className="bg-white py-20 px-6">
        <Reveal>
          <div className="max-w-4xl mx-auto">
            <div className="section-label text-teal before:bg-teal">Equipment</div>
            <h2 className="font-serif text-3xl text-deep mb-10">What you need in the water</h2>

            <div className="space-y-12">
              {GEAR_SECTIONS.map((section) => (
                <div key={section.title}>
                  <h3 className="font-serif text-2xl text-deep mb-4">{section.title}</h3>
                  <div className="space-y-3">
                    {section.items.map((item) => (
                      <div key={item.name} className="bg-salt rounded-xl p-5">
                        <h4 className="text-sm font-medium text-deep mb-2">{item.name}</h4>
                        <p className="text-xs text-[#5a6a7a] leading-relaxed mb-3">{item.why}</p>
                        <div className="flex gap-2 items-start">
                          <span className="text-coral text-xs shrink-0 mt-0.5">*</span>
                          <p className="text-[10px] text-teal/80 italic leading-relaxed">{item.tip}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* Bottom CTA */}
      <section className="bg-salt py-20 px-6">
        <Reveal>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl text-deep mb-4">
              Questions about gear?
            </h2>
            <p className="text-[#5a6a7a] leading-relaxed mb-8">
              Our AIDA courses cover everything you need to know about equipment.
              If you&apos;re looking to buy your own kit, we&apos;ll help you get fitted properly.
            </p>
            <Link
              href="/contact"
              className="inline-block px-8 py-3.5 bg-coral text-white rounded-full font-medium text-sm no-underline hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(199,91,58,0.4)] transition-all"
            >
              Ask us about gear &rarr;
            </Link>
          </div>
        </Reveal>
      </section>

      {/* Email Capture */}
      <section className="bg-white py-20 px-6">
        <Reveal>
          <div className="max-w-xl mx-auto">
            <EmailCapture />
          </div>
        </Reveal>
      </section>
    </main>
  );
}
