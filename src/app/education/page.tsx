import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Ocean Education — Field-Based Marine Science for Kids",
  description:
    "Field-based ocean science programs for ages 5-16 in La Jolla's Matlahuayl Marine Reserve. Camp Garibaldi, school field trips, after-school series, and community ocean days. NGSS-aligned, AIDA-certified instruction.",
  keywords: [
    "ocean education La Jolla",
    "marine science kids San Diego",
    "ocean camp La Jolla",
    "Camp Garibaldi",
    "field trip La Jolla Shores",
    "NGSS ocean science",
    "youth freediving San Diego",
    "marine reserve education",
  ],
  openGraph: {
    title: "Ocean Education — La Jolla Freedive Club",
    description:
      "Field-based ocean science programs for ages 5-16 in La Jolla's marine reserve. Camp, field trips, after-school series, and community days.",
    url: "https://lajollafreediveclub.com/education",
  },
};

export default function EducationPage() {
  return (
    <div className="bg-deep text-salt font-sans font-light leading-relaxed overflow-x-hidden">
      {/* Grain overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-[1000] opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ── Hero ── */}
      <section className="min-h-screen flex flex-col justify-end px-6 md:px-8 pt-12 pb-16 md:pb-24 relative overflow-hidden">
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background: `
              radial-gradient(ellipse at 20% 80%, rgba(27, 107, 107, 0.15) 0%, transparent 60%),
              radial-gradient(ellipse at 80% 20%, rgba(22, 59, 78, 0.3) 0%, transparent 50%),
              linear-gradient(180deg, rgba(11, 29, 44, 0.3) 0%, #0B1D2C 100%)
            `,
          }}
        />
        <div className="relative z-[2] max-w-[900px]">
          <Reveal>
            <div className="flex items-center gap-6 mb-12">
              <span className="text-seafoam font-medium text-sm tracking-[0.08em] uppercase">Ocean Education</span>
            </div>
          </Reveal>
          <Reveal delay={200}>
            <h1 className="font-serif text-[clamp(2.8rem,6vw,5rem)] font-normal leading-[1.1] mb-8">
              Other programs teach your kids about the ocean.{" "}
              <em className="italic text-sand">We teach them in it.</em>
            </h1>
          </Reveal>
          <Reveal delay={400}>
            <p className="text-[1.15rem] leading-[1.8] text-salt/70 max-w-[600px]">
              Field-based ocean science for ages 5&ndash;16. La Jolla Shores sits inside a federally protected marine reserve with a submarine canyon, kelp forests, and 50+ identifiable species within 200 yards of shore. We use it as a classroom &mdash; with guest educators from Scripps, Birch Aquarium, and San Diego&apos;s marine science community.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── What Makes This Different ── */}
      <section className="py-24 px-6 md:px-8 max-w-[1000px] mx-auto border-t border-seafoam/15">
        <Reveal>
          <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-4">What Makes This Different</div>
          <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-normal leading-[1.2] mb-12">
            Not a lecture. <em className="italic text-sand">Not a lab.</em>
          </h2>
        </Reveal>
        <div className="grid md:grid-cols-2 gap-8 md:gap-16">
          <Reveal>
            <div className="p-8 md:p-10 bg-ocean/25 border border-seafoam/10 rounded-sm">
              <h3 className="font-serif text-[1.4rem] font-normal text-seafoam mb-4">We put kids in the marine reserve on a breath hold</h3>
              <p className="text-[0.95rem] text-salt/65 leading-[1.8]">
                La Jolla Shores sits inside the Matlahuayl State Marine Conservation Area &mdash; a federally protected reserve with a submarine canyon, kelp forests, leopard sharks, bat rays, and 50+ identifiable species within 200 yards of shore. Most ocean education programs talk about this ecosystem. We take kids into it. On a breath hold. With mask, fins, and a field journal.
              </p>
              <p className="text-[0.95rem] text-salt/65 leading-[1.8] mt-4">
                Before anyone enters the water, they learn breathing drills, relaxation techniques, equalization, and buddy safety. Then they practice species identification, current reading, and marine ecology &mdash; not from a textbook, but from inside the environment.
              </p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="p-8 md:p-10 bg-ocean/25 border border-seafoam/10 rounded-sm">
              <h3 className="font-serif text-[1.4rem] font-normal text-seafoam mb-4">A different expert every week</h3>
              <p className="text-[0.95rem] text-salt/65 leading-[1.8]">
                Our guest educator model brings in specialists from Scripps Institution of Oceanography, Birch Aquarium, San Diego Lifeguards, SeaWorld Rescue, San Diego Coastkeeper, and the local community &mdash; each leading a session in their area of expertise.
              </p>
              <p className="text-[0.95rem] text-salt/65 leading-[1.8] mt-4">
                Kids don&apos;t just learn from one instructor. They meet the people who actually study, protect, and work in the ocean &mdash; and they learn from them in the field, not in a classroom.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── By The Numbers ── */}
      <Reveal>
        <div className="bg-ocean/20 border-t border-b border-seafoam/10 py-16 px-6 md:px-8">
          <div className="max-w-[1000px] mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
              {[
                { value: "50+", label: "Species in the reserve" },
                { value: "1929", label: "Reserve established" },
                { value: "6", label: "Scripps data sources" },
                { value: "15+", label: "Species ID'd per week" },
                { value: "NGSS", label: "Standards aligned" },
                { value: "AIDA", label: "Certified instruction" },
              ].map((stat) => (
                <div key={stat.label} className="text-center py-4">
                  <div className="font-serif text-[2.2rem] text-sand mb-1">{stat.value}</div>
                  <div className="text-[0.85rem] text-salt/45 leading-[1.5]">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      {/* ── Programs ── */}
      <section className="py-24 px-6 md:px-8 max-w-[1200px] mx-auto">
        <Reveal>
          <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-4">Programs</div>
          <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-normal leading-[1.2] mb-4">
            Four ways in. <em className="italic text-sand">One ocean.</em>
          </h2>
          <p className="text-salt/55 max-w-[700px] mb-16">
            From week-long camps to single-day community events. Every program puts kids in the marine reserve with real data, real equipment, and real scientists.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Camp Garibaldi */}
          <Reveal>
            <div className="p-8 md:p-10 bg-ocean/25 border border-seafoam/10 rounded-sm relative">
              <div className="absolute top-4 right-4 flex gap-2">
                <span className="text-[10px] tracking-[0.15em] uppercase bg-sand/20 text-sand px-3 py-1 rounded-full">Charter Eligible</span>
              </div>
              <div className="text-[11px] tracking-[0.15em] uppercase text-seafoam/60 mb-3">Flagship Program</div>
              <h3 className="font-serif text-[1.6rem] font-normal text-salt mb-2">Camp Garibaldi</h3>
              <div className="font-serif text-[1.8rem] text-sand mb-4">$750<span className="text-[0.9rem] text-salt/40">/week</span></div>
              <p className="text-[0.95rem] text-salt/65 leading-[1.8] mb-6">
                The original ocean camp. Five days of freediving, marine science, surf survival, and water confidence &mdash; built on a breath-first methodology. Kids learn to read real Scripps ocean data before every session, identify species in the field, and develop the internal calm that makes everything else possible.
              </p>
              <div className="grid grid-cols-2 gap-4 text-[0.85rem]">
                <div>
                  <span className="text-salt/35 block mb-1">Ages</span>
                  <span className="text-salt/70">8&ndash;16</span>
                </div>
                <div>
                  <span className="text-salt/35 block mb-1">Schedule</span>
                  <span className="text-salt/70">Mon&ndash;Fri, 8am&ndash;12:30pm</span>
                </div>
                <div>
                  <span className="text-salt/35 block mb-1">Group Size</span>
                  <span className="text-salt/70">Max 8&ndash;10</span>
                </div>
                <div>
                  <span className="text-salt/35 block mb-1">Includes</span>
                  <span className="text-salt/70">All gear, field journal, snacks</span>
                </div>
                <div>
                  <span className="text-salt/35 block mb-1">Location</span>
                  <span className="text-salt/70">La Jolla Shores</span>
                </div>
                <div>
                  <span className="text-salt/35 block mb-1">Military Rate</span>
                  <span className="text-salt/70">$625/week</span>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Ocean Science Field Trip */}
          <Reveal delay={100}>
            <div className="p-8 md:p-10 bg-ocean/25 border border-seafoam/10 rounded-sm relative">
              <div className="absolute top-4 right-4 flex gap-2">
                <span className="text-[10px] tracking-[0.15em] uppercase bg-sand/20 text-sand px-3 py-1 rounded-full">Charter Eligible</span>
              </div>
              <div className="text-[11px] tracking-[0.15em] uppercase text-seafoam/60 mb-3">Schools & Groups</div>
              <h3 className="font-serif text-[1.6rem] font-normal text-salt mb-2">Ocean Science Field Trip</h3>
              <div className="font-serif text-[1.8rem] text-sand mb-4">$50<span className="text-[0.9rem] text-salt/40">/student</span></div>
              <p className="text-[0.95rem] text-salt/65 leading-[1.8] mb-6">
                A single-day, NGSS-aligned field experience for school groups and homeschool co-ops. Students read live buoy data, conduct a beach survey, enter the marine reserve with snorkel gear, and complete a species identification field journal. Tide pool option available for younger groups (ages 5&ndash;10).
              </p>
              <div className="grid grid-cols-2 gap-4 text-[0.85rem]">
                <div>
                  <span className="text-salt/35 block mb-1">Ages</span>
                  <span className="text-salt/70">8&ndash;16 (tide pool: 5&ndash;10)</span>
                </div>
                <div>
                  <span className="text-salt/35 block mb-1">Duration</span>
                  <span className="text-salt/70">3&ndash;4 hours</span>
                </div>
                <div>
                  <span className="text-salt/35 block mb-1">Group Size</span>
                  <span className="text-salt/70">6&ndash;12 students</span>
                </div>
                <div>
                  <span className="text-salt/35 block mb-1">Includes</span>
                  <span className="text-salt/70">Gear, field journal, data sheets</span>
                </div>
                <div>
                  <span className="text-salt/35 block mb-1">Location</span>
                  <span className="text-salt/70">La Jolla Shores</span>
                </div>
                <div>
                  <span className="text-salt/35 block mb-1">Small Group Rate</span>
                  <span className="text-salt/70">$75/student (under 6)</span>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Ocean Science Series */}
          <Reveal>
            <div className="p-8 md:p-10 bg-ocean/25 border border-seafoam/10 rounded-sm">
              <div className="text-[11px] tracking-[0.15em] uppercase text-seafoam/60 mb-3">After-School & Enrichment</div>
              <h3 className="font-serif text-[1.6rem] font-normal text-salt mb-2">Ocean Science Series</h3>
              <div className="font-serif text-[1.8rem] text-sand mb-4">$400<span className="text-[0.9rem] text-salt/40">/student/semester</span></div>
              <p className="text-[0.95rem] text-salt/65 leading-[1.8] mb-6">
                A recurring program for families and homeschool groups who want sustained ocean immersion. Monthly or biweekly sessions build cumulative knowledge &mdash; species identification skills, data literacy, breath-hold progression, and seasonal ocean awareness. Each session features a different guest educator or field focus.
              </p>
              <div className="grid grid-cols-2 gap-4 text-[0.85rem]">
                <div>
                  <span className="text-salt/35 block mb-1">Ages</span>
                  <span className="text-salt/70">8&ndash;16</span>
                </div>
                <div>
                  <span className="text-salt/35 block mb-1">Frequency</span>
                  <span className="text-salt/70">Monthly or biweekly</span>
                </div>
                <div>
                  <span className="text-salt/35 block mb-1">Sessions</span>
                  <span className="text-salt/70">8 sessions typical</span>
                </div>
                <div>
                  <span className="text-salt/35 block mb-1">Drop-In</span>
                  <span className="text-salt/70">$50/session</span>
                </div>
                <div>
                  <span className="text-salt/35 block mb-1">Includes</span>
                  <span className="text-salt/70">Gear, journal, guest educators</span>
                </div>
                <div>
                  <span className="text-salt/35 block mb-1">Location</span>
                  <span className="text-salt/70">La Jolla Shores</span>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Community Ocean Day */}
          <Reveal delay={100}>
            <div className="p-8 md:p-10 bg-ocean/25 border border-seafoam/10 rounded-sm">
              <div className="text-[11px] tracking-[0.15em] uppercase text-seafoam/60 mb-3">Open to Everyone</div>
              <h3 className="font-serif text-[1.6rem] font-normal text-salt mb-2">Community Ocean Day</h3>
              <div className="font-serif text-[1.8rem] text-sand mb-4">$35<span className="text-[0.9rem] text-salt/40">/person</span></div>
              <p className="text-[0.95rem] text-salt/65 leading-[1.8] mb-6">
                One Saturday a month, we open the program to families. Parents and kids explore the marine reserve together &mdash; guided snorkel tour, species ID, beach science station, and a guest educator talk. No experience needed. All gear provided.
              </p>
              <div className="grid grid-cols-2 gap-4 text-[0.85rem]">
                <div>
                  <span className="text-salt/35 block mb-1">Ages</span>
                  <span className="text-salt/70">All ages (kids + parents)</span>
                </div>
                <div>
                  <span className="text-salt/35 block mb-1">Schedule</span>
                  <span className="text-salt/70">One Saturday/month, 8:30&ndash;11:30am</span>
                </div>
                <div>
                  <span className="text-salt/35 block mb-1">Capacity</span>
                  <span className="text-salt/70">16&ndash;20 people</span>
                </div>
                <div>
                  <span className="text-salt/35 block mb-1">Includes</span>
                  <span className="text-salt/70">Gear, guide, guest educator</span>
                </div>
                <div>
                  <span className="text-salt/35 block mb-1">Location</span>
                  <span className="text-salt/70">La Jolla Shores</span>
                </div>
                <div>
                  <span className="text-salt/35 block mb-1">Subscriber Rate</span>
                  <span className="text-salt/70">$25/person</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Guest Educators ── */}
      <Reveal>
        <div className="bg-ocean/20 border-t border-b border-seafoam/10 py-20 px-6 md:px-8">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-4">Guest Educators</div>
            <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-normal leading-[1.2] mb-4">
              The people who study, protect, and work in <em className="italic text-sand">this ocean.</em>
            </h2>
            <p className="text-salt/55 max-w-[700px] mb-12">
              Our rotating guest educator model brings real experts into the field with your kids. Each partner leads a hands-on module in their area of specialization.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  org: "Scripps Institution of Oceanography",
                  module: "Pier Tour & Ocean Instruments",
                  detail: "Walk the research pier. Learn how oceanographers collect real-time wave, temperature, and current data. See the instruments that feed our daily conditions report.",
                },
                {
                  org: "Birch Aquarium",
                  module: "Behind the Scenes Tour",
                  detail: "Go behind the public exhibits into the research labs. See how Scripps scientists study coral, raise seahorses, and monitor kelp forest health.",
                },
                {
                  org: "San Diego Lifeguards",
                  module: "Ocean Safety & Rescue",
                  detail: "Learn rip current identification, rescue signals, surf zone awareness, and basic water rescue from the professionals who patrol La Jolla Shores every day.",
                },
                {
                  org: "SeaWorld Rescue",
                  module: "Marine Animal Rescue Protocol",
                  detail: "Learn how stranded marine animals are identified, stabilized, transported, and rehabilitated. Understand reporting protocols and when to intervene vs. observe.",
                },
                {
                  org: "San Diego Coastkeeper",
                  module: "Water Quality & Underwater Cleanup",
                  detail: "Test water samples for bacteria, pH, turbidity, and dissolved oxygen. Conduct an underwater debris survey and cleanup. Connect water quality to ecosystem health.",
                },
                {
                  org: "Local Community",
                  module: "Surf, Art, Spearfishing & More",
                  detail: "Rotating sessions with local surfers, ocean artists, sustainable spearfishers, and citizen scientists. The broader La Jolla ocean community shares their craft.",
                },
              ].map((educator) => (
                <div key={educator.org} className="p-6 bg-deep/50 border border-seafoam/[0.08] rounded-sm">
                  <div className="text-[11px] tracking-[0.15em] uppercase text-seafoam/60 mb-2">{educator.org}</div>
                  <div className="font-serif text-[1.1rem] mb-2">{educator.module}</div>
                  <div className="text-[0.85rem] text-salt/45 leading-[1.6]">{educator.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      {/* ── What Kids Take Home ── */}
      <section className="py-24 px-6 md:px-8 max-w-[1000px] mx-auto border-t border-seafoam/15">
        <Reveal>
          <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-4">What Kids Take Home</div>
          <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-normal leading-[1.2] mb-12">
            Not a participation trophy. <em className="italic text-sand">A field journal.</em>
          </h2>
        </Reveal>
        <div className="grid md:grid-cols-2 gap-8 md:gap-16">
          <Reveal>
            <div className="p-8 md:p-10 bg-ocean/25 border border-seafoam/10 rounded-sm">
              <h3 className="font-serif text-[1.4rem] font-normal text-seafoam mb-4">The observation journal</h3>
              <p className="text-[0.95rem] text-salt/65 leading-[1.8]">
                Every student keeps a field journal with species sketches, data readings, tide predictions, and personal observations. By the end of a camp week, they have a real scientific document &mdash; not a worksheet. Something they made by being in the water and paying attention.
              </p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="p-8 md:p-10 bg-ocean/25 border border-seafoam/10 rounded-sm">
              <h3 className="font-serif text-[1.4rem] font-normal text-seafoam mb-4">The skills</h3>
              <p className="text-[0.95rem] text-salt/65 leading-[1.8]">
                Breath-hold technique. Equalization. Efficient finning. Duck dives. Buddy safety protocols. Rip current identification. Species identification. Data literacy. Surf zone awareness. These are real, transferable skills &mdash; not abstract concepts. Kids leave knowing how to be in the ocean, not just near it.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Seasonal Calendar ── */}
      <Reveal>
        <div className="bg-ocean/20 border-t border-b border-seafoam/10 py-20 px-6 md:px-8">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-4">Seasonal Calendar</div>
            <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-normal leading-[1.2] mb-4">
              The ocean changes. <em className="italic text-sand">So does the curriculum.</em>
            </h2>
            <p className="text-salt/55 max-w-[700px] mb-12">
              La Jolla&apos;s marine reserve is a different classroom every season. We build the curriculum around what&apos;s actually happening in the water.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  season: "Summer",
                  months: "Jun \u2013 Aug",
                  highlights: "Leopard sharks arrive in large aggregations. Warm water (68\u201372\u00b0F). Best visibility of the year (15\u201330ft). Garibaldi nesting. Bat rays in the shallows. Grunion runs. Peak camp season.",
                },
                {
                  season: "Fall",
                  months: "Sep \u2013 Nov",
                  highlights: "Warmest water of the year (70\u201374\u00b0F). Lobster season opens. Bioluminescence events. Giant black sea bass sightings. Yellowtail and barracuda passing through. Reduced crowds.",
                },
                {
                  season: "Winter",
                  months: "Dec \u2013 Feb",
                  highlights: "Gray whale migration. Harbor seals pupping at Children\u2019s Pool. Big swells reshape the sand. Cool water (56\u201362\u00b0F). Storm surge ecology. Best tide pool exposures of the year.",
                },
                {
                  season: "Spring",
                  months: "Mar \u2013 May",
                  highlights: "Kelp forest regrowth. Horn shark egg cases. Sea hare aggregations. Plankton blooms and food chain ecology. Water warming (60\u201366\u00b0F). Grunion runs begin.",
                },
              ].map((s) => (
                <div key={s.season} className="p-6 bg-deep/50 border border-seafoam/[0.08] rounded-sm">
                  <div className="font-serif text-[1.3rem] text-sand mb-1">{s.season}</div>
                  <div className="text-[11px] tracking-[0.15em] uppercase text-seafoam/60 mb-3">{s.months}</div>
                  <div className="text-[0.85rem] text-salt/45 leading-[1.6]">{s.highlights}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      {/* ── Charter Funding ── */}
      <section className="py-24 px-6 md:px-8 max-w-[1000px] mx-auto border-t border-seafoam/15">
        <Reveal>
          <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-4">Charter Funding</div>
          <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-normal leading-[1.2] mb-12">
            Your charter school funds <em className="italic text-sand">can pay for this.</em>
          </h2>
        </Reveal>
        <div className="grid md:grid-cols-2 gap-8 md:gap-16">
          <Reveal>
            <div className="p-8 md:p-10 bg-ocean/25 border border-seafoam/10 rounded-sm">
              <h3 className="font-serif text-[1.4rem] font-normal text-seafoam mb-4">Charter school enrichment</h3>
              <p className="text-[0.95rem] text-salt/65 leading-[1.8]">
                California charter school families receive instructional funds for enrichment activities. Our programs &mdash; Camp Garibaldi and Ocean Science Field Trips &mdash; are designed to qualify as NGSS-aligned science enrichment. We provide the documentation, invoicing, and curriculum descriptions your charter school needs to approve the expense.
              </p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="p-8 md:p-10 bg-ocean/25 border border-seafoam/10 rounded-sm">
              <h3 className="font-serif text-[1.4rem] font-normal text-seafoam mb-4">NGSS-aligned curriculum</h3>
              <p className="text-[0.95rem] text-salt/65 leading-[1.8]">
                Every program maps to Next Generation Science Standards for middle school Earth &amp; Space Science, Life Science, and Engineering practices. We provide a curriculum overview, daily learning objectives, and standards alignment documentation that charter coordinators can submit directly for enrichment fund approval.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Credentials ── */}
      <section className="py-24 px-6 md:px-8 max-w-[1000px] mx-auto border-t border-seafoam/15">
        <Reveal>
          <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-4">Credentials</div>
          <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-normal leading-[1.2] mb-12">
            Who&apos;s teaching your kids. <em className="italic text-sand">And where.</em>
          </h2>
        </Reveal>
        <div className="grid md:grid-cols-2 gap-8 md:gap-16">
          <Reveal>
            <div className="p-8 md:p-10 bg-ocean/25 border border-seafoam/10 rounded-sm">
              <h3 className="font-serif text-[1.4rem] font-normal text-seafoam mb-4">Our team</h3>
              <p className="text-[0.95rem] text-salt/65 leading-[1.8]">
                AIDA Instructor. AIDA Youth Instructor. AIDA 4 Freediver. DAN insured. American Red Cross First Aid/CPR/AED certified. All youth programs maintain a maximum 1:4 instructor-to-student ratio in the water. Guest educators are vetted professionals from established San Diego institutions.
              </p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="p-8 md:p-10 bg-ocean/25 border border-seafoam/10 rounded-sm">
              <h3 className="font-serif text-[1.4rem] font-normal text-seafoam mb-4">The location</h3>
              <p className="text-[0.95rem] text-salt/65 leading-[1.8]">
                La Jolla Shores is a lifeguard-protected beach with gentle surf, sandy bottom entry, and direct access to the Matlahuayl Marine Reserve. It&apos;s where Scripps Institution of Oceanography has conducted research since 1903. Year-round lifeguard coverage. Bathrooms, showers, and parking on site. The safest and most biodiverse entry point on the San Diego coast.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="text-center py-32 px-6 md:px-8">
        <Reveal>
          <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-4">Get Started</div>
          <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-normal leading-[1.2] mb-6">
            The ocean is <em className="italic text-sand">right there.</em>
          </h2>
          <p className="text-[1.1rem] text-salt/60 mb-12 max-w-[500px] mx-auto">
            Enroll in a camp, book a field trip, or just come see what we do.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact/camp"
              className="inline-block px-12 py-4 bg-transparent border border-sand text-sand font-medium text-sm tracking-[0.12em] uppercase no-underline hover:bg-sand hover:text-deep transition-all duration-300"
            >
              Enroll in Camp Garibaldi
            </Link>
            <Link
              href="/contact/courses"
              className="inline-block px-12 py-4 bg-transparent border border-seafoam/30 text-seafoam font-medium text-sm tracking-[0.12em] uppercase no-underline hover:bg-seafoam hover:text-deep transition-all duration-300"
            >
              Book a Field Trip
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ── Footer ── */}
      <footer className="py-12 px-6 text-center border-t border-seafoam/[0.08]">
        <p className="text-[0.8rem] text-salt/25">
          <a href="https://lajollafreediveclub.com" className="text-seafoam/40 no-underline">La Jolla Freedive Club</a> &middot; La Jolla, California
        </p>
      </footer>
    </div>
  );
}
