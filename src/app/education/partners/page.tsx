import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Education Partners — La Jolla Freedive Club",
  description:
    "Partner with LJFC to deliver field-based ocean science education in La Jolla's marine reserve. Guest educator model for Scripps, Birch Aquarium, lifeguards, and conservation organizations.",
  robots: { index: false, follow: false },
};

export default function EducationPartnersPage() {
  return (
    <div className="partner-page bg-deep text-salt font-sans font-light leading-relaxed overflow-x-hidden">
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
          <div className="flex items-center gap-6 mb-12 animate-[fadeUp_0.8s_ease_0.2s_forwards] opacity-0">
            <span className="text-seafoam font-medium text-sm tracking-[0.08em] uppercase">Education Partners</span>
          </div>
          <h1 className="font-serif text-[clamp(2.8rem,6vw,5rem)] font-normal leading-[1.1] mb-8 animate-[fadeUp_0.8s_ease_0.4s_forwards] opacity-0">
            We built the classroom.{" "}
            <em className="italic text-sand">We need the faculty.</em>
          </h1>
          <p className="text-[1.15rem] leading-[1.8] text-salt/70 max-w-[600px] animate-[fadeUp_0.8s_ease_0.6s_forwards] opacity-0">
            LJFC runs field-based ocean science programs for kids ages 5&ndash;16 in the Matlahuayl State Marine Conservation Area at La Jolla Shores. We handle safety, logistics, gear, and water instruction. Our guest educator model brings in rotating experts to lead specialized modules &mdash; so kids learn from the people who actually do the work.
          </p>
        </div>
      </section>

      {/* ── The Model ── */}
      <section className="py-24 px-6 md:px-8 max-w-[1000px] mx-auto border-t border-seafoam/15">
        <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-4">The Model</div>
        <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-normal leading-[1.2] mb-12">
          You bring the expertise. <em className="italic text-sand">We bring everything else.</em>
        </h2>
        <div className="grid md:grid-cols-2 gap-8 md:gap-16">
          <div className="p-8 md:p-10 bg-ocean/25 border border-seafoam/10 rounded-sm">
            <h3 className="font-serif text-[1.4rem] font-normal text-seafoam mb-4">What LJFC delivers (every session)</h3>
            <p className="text-[0.95rem] text-salt/65 leading-[1.8]">
              Water safety instruction and supervision. All snorkel and freediving gear. Wetsuits, masks, fins for every student. 1:4 instructor-to-student ratio in the water. Liability insurance and signed waivers. Beach setup, logistics, and parent communication. Pre-session ocean data briefing (buoy readings, tide, visibility, temperature). Field journals and species ID materials.
            </p>
          </div>
          <div className="p-8 md:p-10 bg-ocean/25 border border-seafoam/10 rounded-sm">
            <h3 className="font-serif text-[1.4rem] font-normal text-seafoam mb-4">What guest educators deliver (rotating)</h3>
            <p className="text-[0.95rem] text-salt/65 leading-[1.8]">
              A 60&ndash;90 minute module in your area of expertise. It can be a guided tour (Scripps Pier, Birch Aquarium), a field demonstration (water quality testing, rescue protocols), a hands-on workshop (art, citizen science), or a talk and Q&amp;A at the beach. We handle all the logistics &mdash; you just show up and teach what you know.
            </p>
          </div>
        </div>
      </section>

      {/* ── Guest Educator Modules ── */}
      <div className="bg-ocean/20 border-t border-b border-seafoam/10 py-20 px-6 md:px-8">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-4">Guest Educator Modules</div>
          <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-normal leading-[1.2] mb-4">
            Seven modules. <em className="italic text-sand">Your name on one.</em>
          </h2>
          <p className="text-salt/55 max-w-[700px] mb-12">
            Each module is designed to fit within a camp day or field trip. We provide the students, the setting, and the context. You provide the knowledge.
          </p>

          <div className="flex flex-col gap-6">
            {/* Module 1: Scripps */}
            <div className="p-6 md:p-8 bg-deep/50 border border-seafoam/[0.08] rounded-sm">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                <div>
                  <div className="text-[11px] tracking-[0.15em] uppercase text-seafoam/60 mb-2">Scripps Institution of Oceanography</div>
                  <div className="font-serif text-[1.2rem]">Pier Tour &amp; Ocean Instruments</div>
                </div>
                <div className="flex gap-6 text-[0.85rem] text-salt/45 shrink-0">
                  <div><span className="text-salt/30">Duration:</span> 90 min</div>
                  <div><span className="text-salt/30">NGSS:</span> MS-ESS2-6, MS-ESS3-2</div>
                </div>
              </div>
              <p className="text-[0.9rem] text-salt/50 leading-[1.7]">
                Walk the research pier. See the wave sensors, thermistors, and current meters that feed our daily conditions data. Students learn how oceanographers collect, transmit, and interpret real-time ocean data &mdash; and they connect it to the buoy readings they review before every camp session.
              </p>
            </div>

            {/* Module 2: Birch */}
            <div className="p-6 md:p-8 bg-deep/50 border border-seafoam/[0.08] rounded-sm">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                <div>
                  <div className="text-[11px] tracking-[0.15em] uppercase text-seafoam/60 mb-2">Birch Aquarium at Scripps</div>
                  <div className="font-serif text-[1.2rem]">Behind the Scenes Tour</div>
                </div>
                <div className="flex gap-6 text-[0.85rem] text-salt/45 shrink-0">
                  <div><span className="text-salt/30">Duration:</span> 90 min</div>
                  <div><span className="text-salt/30">NGSS:</span> MS-LS2-1, MS-LS2-4</div>
                </div>
              </div>
              <p className="text-[0.9rem] text-salt/50 leading-[1.7]">
                Go behind the public exhibits into the research side of the aquarium. Students see how Scripps scientists study coral resilience, raise seahorses, monitor kelp forest health, and develop conservation strategies &mdash; then they go see the same species in the wild at La Jolla Shores.
              </p>
            </div>

            {/* Module 3: Lifeguards */}
            <div className="p-6 md:p-8 bg-deep/50 border border-seafoam/[0.08] rounded-sm">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                <div>
                  <div className="text-[11px] tracking-[0.15em] uppercase text-seafoam/60 mb-2">San Diego Marine Safety</div>
                  <div className="font-serif text-[1.2rem]">Ocean Safety &amp; Rescue</div>
                </div>
                <div className="flex gap-6 text-[0.85rem] text-salt/45 shrink-0">
                  <div><span className="text-salt/30">Duration:</span> 60 min</div>
                  <div><span className="text-salt/30">NGSS:</span> Crosscutting &mdash; Cause &amp; Effect</div>
                </div>
              </div>
              <p className="text-[0.9rem] text-salt/50 leading-[1.7]">
                Learn rip current identification, rescue signals, surf zone dynamics, and basic water rescue from the professionals who patrol La Jolla Shores every day. Students learn to read the water the way lifeguards do &mdash; identifying hazards before they become emergencies.
              </p>
            </div>

            {/* Module 4: SeaWorld */}
            <div className="p-6 md:p-8 bg-deep/50 border border-seafoam/[0.08] rounded-sm">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                <div>
                  <div className="text-[11px] tracking-[0.15em] uppercase text-seafoam/60 mb-2">SeaWorld Rescue</div>
                  <div className="font-serif text-[1.2rem]">Marine Animal Rescue Protocol</div>
                </div>
                <div className="flex gap-6 text-[0.85rem] text-salt/45 shrink-0">
                  <div><span className="text-salt/30">Duration:</span> 60 min</div>
                  <div><span className="text-salt/30">NGSS:</span> MS-LS2-4, MS-ESS3-3</div>
                </div>
              </div>
              <p className="text-[0.9rem] text-salt/50 leading-[1.7]">
                Learn how stranded marine animals are identified, stabilized, transported, and rehabilitated. Students understand reporting protocols, the difference between intervention and observation, and how human activity affects marine mammal and sea turtle populations along the San Diego coast.
              </p>
            </div>

            {/* Module 5: Coastkeeper */}
            <div className="p-6 md:p-8 bg-deep/50 border border-seafoam/[0.08] rounded-sm">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                <div>
                  <div className="text-[11px] tracking-[0.15em] uppercase text-seafoam/60 mb-2">San Diego Coastkeeper</div>
                  <div className="font-serif text-[1.2rem]">Water Quality Survey &amp; Underwater Cleanup</div>
                </div>
                <div className="flex gap-6 text-[0.85rem] text-salt/45 shrink-0">
                  <div><span className="text-salt/30">Duration:</span> 90 min</div>
                  <div><span className="text-salt/30">NGSS:</span> MS-ESS3-3, MS-LS2-4</div>
                </div>
              </div>
              <p className="text-[0.9rem] text-salt/50 leading-[1.7]">
                Test water samples for bacteria, pH, turbidity, and dissolved oxygen. Conduct an underwater debris survey and cleanup in the marine reserve. Students connect water quality data to ecosystem health &mdash; understanding how runoff, development, and climate affect the organisms they&apos;ve been identifying all week.
              </p>
            </div>

            {/* Module 6: Natural History Museum */}
            <div className="p-6 md:p-8 bg-deep/50 border border-seafoam/[0.08] rounded-sm">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                <div>
                  <div className="text-[11px] tracking-[0.15em] uppercase text-seafoam/60 mb-2">San Diego Natural History Museum</div>
                  <div className="font-serif text-[1.2rem]">Canyon Geology &amp; Paleontology</div>
                </div>
                <div className="flex gap-6 text-[0.85rem] text-salt/45 shrink-0">
                  <div><span className="text-salt/30">Duration:</span> 60 min</div>
                  <div><span className="text-salt/30">NGSS:</span> MS-ESS1-4, MS-ESS2-3</div>
                </div>
              </div>
              <p className="text-[0.9rem] text-salt/50 leading-[1.7]">
                La Jolla sits on the edge of a submarine canyon that drops to 900+ feet. Students learn how the canyon was formed, what geological forces shaped the coastline, and what the fossil record tells us about this area&apos;s marine history. Connects deep time to the living ecosystem they explore at the surface.
              </p>
            </div>

            {/* Module 7: Local Community */}
            <div className="p-6 md:p-8 bg-deep/50 border border-seafoam/[0.08] rounded-sm">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                <div>
                  <div className="text-[11px] tracking-[0.15em] uppercase text-seafoam/60 mb-2">Local Community</div>
                  <div className="font-serif text-[1.2rem]">Surf &middot; Art &middot; Spearfishing &middot; Citizen Science</div>
                </div>
                <div className="flex gap-6 text-[0.85rem] text-salt/45 shrink-0">
                  <div><span className="text-salt/30">Duration:</span> 60&ndash;90 min</div>
                </div>
              </div>
              <p className="text-[0.9rem] text-salt/50 leading-[1.7]">
                Rotating sessions with local surfers, ocean artists, sustainable spearfishers, and citizen scientists. The broader La Jolla ocean community shares their craft &mdash; from wave reading to marine illustration to ethical harvesting to iNaturalist biodiversity surveys.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── NGSS Alignment ── */}
      <section className="py-24 px-6 md:px-8 max-w-[1200px] mx-auto border-t border-seafoam/15">
        <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-4">Standards Alignment</div>
        <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-normal leading-[1.2] mb-4">
          NGSS <em className="italic text-sand">in the field.</em>
        </h2>
        <p className="text-salt/55 max-w-[700px] mb-12">
          Every module maps to Next Generation Science Standards. Here&apos;s how the standards come alive in a marine reserve instead of a classroom.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-[0.85rem] text-left">
            <thead>
              <tr className="border-b border-seafoam/15">
                <th className="py-4 pr-4 text-seafoam/60 font-medium tracking-[0.1em] uppercase text-[11px]">Standard</th>
                <th className="py-4 pr-4 text-seafoam/60 font-medium tracking-[0.1em] uppercase text-[11px]">How It&apos;s Taught</th>
                <th className="py-4 text-seafoam/60 font-medium tracking-[0.1em] uppercase text-[11px]">Camp Day</th>
              </tr>
            </thead>
            <tbody className="text-salt/55">
              {[
                {
                  standard: "MS-ESS2-6",
                  description: "Develop and use a model to describe how unequal heating and rotation of the Earth cause patterns of atmospheric and oceanic circulation",
                  how: "Daily buoy data briefing. Students read real wave, wind, and current data from NDBC 46254 and LJPC1. They track how onshore/offshore winds affect conditions and predict afternoon sea breezes.",
                  day: "Day 1 & Daily",
                },
                {
                  standard: "MS-ESS3-2",
                  description: "Analyze and interpret data on natural hazards to forecast future catastrophic events and inform the development of technologies to mitigate their effects",
                  how: "NWS marine forecast analysis. Students read swell forecasts, interpret tide charts, and assess conditions for safe water entry. Lifeguard module covers rip current mechanics.",
                  day: "Day 1 & Daily",
                },
                {
                  standard: "MS-LS2-1",
                  description: "Analyze and interpret data to provide evidence for the effects of resource availability on organisms and populations in an ecosystem",
                  how: "Kelp forest survey. Students observe how kelp density affects species distribution, food availability, and shelter. They compare reef vs. sand habitats within the same dive.",
                  day: "Day 2",
                },
                {
                  standard: "MS-LS2-4",
                  description: "Construct an argument supported by empirical evidence that changes to physical or biological components of an ecosystem affect populations",
                  how: "Seasonal species tracking. Students compare their observations to historical iNaturalist data. They document what\u2019s present, what\u2019s missing, and why \u2014 connecting temperature, visibility, and season to biodiversity.",
                  day: "Day 3",
                },
                {
                  standard: "MS-ESS3-3",
                  description: "Apply scientific principles to design a method for monitoring and minimizing a human impact on the environment",
                  how: "Coastkeeper water quality module. Students test pH, turbidity, dissolved oxygen, and bacteria levels. They conduct an underwater debris survey and connect pollution sources to ecosystem impact.",
                  day: "Day 4",
                },
                {
                  standard: "MS-ESS1-4",
                  description: "Construct a scientific explanation based on evidence from rock strata for how the geologic time scale is used to organize Earth\u2019s history",
                  how: "Canyon geology module. Students learn how the La Jolla submarine canyon formed, what the cliff strata reveal, and how the fossil record connects to the living species they observe.",
                  day: "Day 4",
                },
                {
                  standard: "MS-ESS2-3",
                  description: "Analyze and interpret data on the distribution of fossils and rocks, continental shapes, and seafloor structures to provide evidence of past plate motions",
                  how: "Tide pool geology walk. Students examine exposed rock formations, identify fossilized shell beds, and connect the physical coastline to tectonic history.",
                  day: "Day 5",
                },
                {
                  standard: "Crosscutting: Cause & Effect",
                  description: "Mechanism and explanation \u2014 events have causes, sometimes simple, sometimes multifaceted",
                  how: "Lifeguard ocean safety module. Students learn how swell direction, tide state, and bathymetry create rip currents. They identify cause-and-effect relationships in real-time surf zone conditions.",
                  day: "Day 3",
                },
              ].map((row) => (
                <tr key={row.standard} className="border-b border-seafoam/[0.06]">
                  <td className="py-4 pr-4 align-top whitespace-nowrap font-medium text-sand/70">{row.standard}</td>
                  <td className="py-4 pr-4 align-top leading-[1.6]">{row.how}</td>
                  <td className="py-4 align-top whitespace-nowrap text-salt/40">{row.day}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Charter Funding for Coordinators ── */}
      <section className="py-24 px-6 md:px-8 max-w-[1000px] mx-auto border-t border-seafoam/15">
        <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-4">Charter Funding</div>
        <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-normal leading-[1.2] mb-12">
          For charter coordinators: <em className="italic text-sand">how funding works.</em>
        </h2>
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 mb-16">
          <div className="p-8 md:p-10 bg-ocean/25 border border-seafoam/10 rounded-sm">
            <h3 className="font-serif text-[1.4rem] font-normal text-seafoam mb-4">Documentation we provide</h3>
            <p className="text-[0.95rem] text-salt/65 leading-[1.8]">
              NGSS-aligned curriculum overview with daily learning objectives. Standards alignment matrix mapping each activity to specific NGSS standards. Instructor credentials and certifications. Liability insurance documentation. W-9 and vendor registration forms. Post-program summary with attendance and learning outcomes.
            </p>
          </div>
          <div className="p-8 md:p-10 bg-ocean/25 border border-seafoam/10 rounded-sm">
            <h3 className="font-serif text-[1.4rem] font-normal text-seafoam mb-4">Programs eligible for charter funding</h3>
            <p className="text-[0.95rem] text-salt/65 leading-[1.8]">
              Camp Garibaldi ($750/week) &mdash; qualifies as intensive STEM enrichment. Ocean Science Field Trip ($50/student) &mdash; qualifies as curriculum-aligned field experience. Ocean Science Series ($400/semester) &mdash; qualifies as ongoing enrichment program. All programs include materials, gear, and instruction.
            </p>
          </div>
        </div>

        <div className="p-8 md:p-10 bg-ocean/15 border border-seafoam/[0.08] rounded-sm">
          <h3 className="font-serif text-[1.2rem] font-normal text-seafoam mb-4">Charter approval process</h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            {[
              { step: "01", label: "Request", detail: "Parent or coordinator contacts LJFC" },
              { step: "02", label: "Documentation", detail: "We send curriculum package + vendor forms" },
              { step: "03", label: "Approval", detail: "Charter school reviews and approves enrichment funds" },
              { step: "04", label: "Enrollment", detail: "Student is enrolled, funding is applied" },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="font-serif text-[2rem] text-sand/30 mb-2">{s.step}</div>
                <div className="font-serif text-[1rem] mb-1">{s.label}</div>
                <div className="text-[0.8rem] text-salt/40 leading-[1.5]">{s.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What Partners Get ── */}
      <div className="bg-ocean/20 border-t border-b border-seafoam/10 py-20 px-6 md:px-8">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-4">What Partners Get</div>
          <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-normal leading-[1.2] mb-12">
            This isn&apos;t volunteer work. <em className="italic text-sand">It&apos;s a platform.</em>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            {[
              {
                label: "Audience",
                value: "8\u201316 engaged kids",
                detail: "Per session. Kids who chose to be here. Parents who are paying attention. Not a captive classroom \u2014 an active, motivated group in the field.",
              },
              {
                label: "Content",
                value: "Your module, your way",
                detail: "60\u201390 minutes to teach what you know, how you want. We handle logistics, gear, safety, and context. You show up and share your expertise.",
              },
              {
                label: "Listing",
                value: "Featured on LJFC",
                detail: "Your name, organization, and module description on our education page, community page, and camp materials. Attribution and cross-promotion to our audience.",
              },
            ].map((card) => (
              <div key={card.label} className="p-6 md:p-8 bg-deep/50 border border-seafoam/[0.08] rounded-sm text-center">
                <div className="text-[11px] tracking-[0.15em] uppercase text-seafoam/60 mb-3">{card.label}</div>
                <div className="font-serif text-[1.6rem] text-sand mb-3">{card.value}</div>
                <p className="text-[0.85rem] text-salt/45 leading-[1.6]">{card.detail}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-16">
            <div className="p-8 md:p-10 bg-deep/50 border border-seafoam/[0.08] rounded-sm">
              <h3 className="font-serif text-[1.4rem] font-normal text-seafoam mb-4">For guest educators</h3>
              <p className="text-[0.95rem] text-salt/65 leading-[1.8]">
                No logistics to manage. No gear to provide. No liability to carry. Just show up at La Jolla Shores and teach what you know to a small group of kids who are already comfortable in the water and familiar with the ecosystem. We prep them before you arrive &mdash; you get an engaged audience from minute one.
              </p>
            </div>
            <div className="p-8 md:p-10 bg-deep/50 border border-seafoam/[0.08] rounded-sm">
              <h3 className="font-serif text-[1.4rem] font-normal text-seafoam mb-4">For institutions</h3>
              <p className="text-[0.95rem] text-salt/65 leading-[1.8]">
                Community outreach with zero overhead. Your educators get field time with motivated students. Your institution gets credited in our NGSS-aligned curriculum package, on our website, and in our marketing materials. We document everything &mdash; photos, outcomes, testimonials &mdash; that you can use for your own reporting.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── The Platform ── */}
      <section className="py-24 px-6 md:px-8 max-w-[1000px] mx-auto border-t border-seafoam/15">
        <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-4">The Platform</div>
        <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-normal leading-[1.2] mb-4">
          Built on <em className="italic text-sand">real data.</em>
        </h2>
        <p className="text-salt/55 max-w-[700px] mb-12">
          Every session starts with a live data briefing. Students read the same instruments that Scripps researchers and San Diego lifeguards use. These are the six sources that power our conditions tools and curriculum.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { id: "NDBC 46254", name: "Scripps Nearshore Buoy", detail: "Wave height, period, direction, water temperature. The primary buoy for La Jolla Shores conditions." },
            { id: "LJPC1", name: "Scripps Pier Station", detail: "Wind speed, direction, and gusts. Real-time atmospheric data from the pier." },
            { id: "NOAA 9410230", name: "La Jolla Tide Station", detail: "Tide predictions and verified water levels. Students learn to read tide charts before every session." },
            { id: "Scripps Cam", name: "Underwater Camera", detail: "Live underwater camera feed from Scripps Pier. Our AI analyzes visibility conditions in real time." },
            { id: "NWS PZZ740", name: "Marine Forecast", detail: "Inner coastal zone forecast. Students learn to interpret weather service bulletins and plan around conditions." },
            { id: "iNaturalist", name: "Species Observations", detail: "Community biodiversity data within 5km of La Jolla. Students contribute sightings and compare to historical records." },
          ].map((src) => (
            <div key={src.id} className="p-6 bg-deep/50 border border-seafoam/[0.08] rounded-sm">
              <div className="text-[11px] tracking-[0.15em] uppercase text-seafoam/60 mb-2">{src.id}</div>
              <div className="font-serif text-[1.1rem] mb-1">{src.name}</div>
              <div className="text-[0.85rem] text-salt/45 leading-[1.6]">{src.detail}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Credentials ── */}
      <div className="bg-ocean/20 border-t border-b border-seafoam/10 py-16 px-6 md:px-8">
        <div className="max-w-[1000px] mx-auto">
          <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-4">Credentials</div>
          <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-normal leading-[1.2] mb-12">Who we are.</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {[
              { value: "AIDA Instructor", label: "International freediving\ncertification authority" },
              { value: "AIDA Youth", label: "Certified youth\nfreediving instructor" },
              { value: "AIDA 4", label: "Advanced freediver\ncertification" },
              { value: "DAN Insured", label: "Divers Alert Network\nprofessional liability" },
              { value: "ARC Certified", label: "Adult & pediatric\nFirst Aid/CPR/AED" },
              { value: "UCSD Alumnus", label: "University of California\nSan Diego" },
            ].map((c) => (
              <div key={c.value} className="text-center py-8">
                <div className="font-serif text-[1.5rem] text-sand mb-1">{c.value}</div>
                <div className="text-[0.85rem] text-salt/45 leading-[1.5] whitespace-pre-line">{c.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Timeline ── */}
      <section className="py-24 px-6 md:px-8 max-w-[1000px] mx-auto border-t border-seafoam/15">
        <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-4">Timeline</div>
        <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-normal leading-[1.2] mb-12">
          Where we are. <em className="italic text-sand">Where we&apos;re going.</em>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              period: "Now",
              label: "Spring 2026",
              detail: "Building the guest educator network. Finalizing module content with each partner. Piloting Community Ocean Days. Securing charter school documentation.",
            },
            {
              period: "Summer 2026",
              label: "Camp Season",
              detail: "First full Camp Garibaldi season with integrated guest educator modules. Field trips available for summer school programs. Community Ocean Days monthly.",
            },
            {
              period: "Fall 2026",
              label: "School Year",
              detail: "Ocean Science Series launches for homeschool and after-school groups. Charter school enrichment partnerships formalized. Monthly community events continue.",
            },
            {
              period: "2027",
              label: "Expansion",
              detail: "Second instructor added. Multiple concurrent camp sessions. Expanded field trip capacity. Guest educator network fully operational across all seven modules.",
            },
          ].map((t) => (
            <div key={t.period} className="p-6 bg-ocean/25 border border-seafoam/10 rounded-sm">
              <div className="font-serif text-[1.6rem] text-sand mb-1">{t.period}</div>
              <div className="text-[11px] tracking-[0.15em] uppercase text-seafoam/60 mb-3">{t.label}</div>
              <div className="text-[0.85rem] text-salt/45 leading-[1.6]">{t.detail}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="text-center py-32 px-6 md:px-8">
        <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-4">Next Step</div>
        <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-normal leading-[1.2] mb-6">
          One conversation <em className="italic text-sand">starts it.</em>
        </h2>
        <p className="text-[1.1rem] text-salt/60 mb-12 max-w-[500px] mx-auto">
          If your organization works in marine science, ocean safety, conservation, or education &mdash; and you want to put your knowledge in front of kids who are actually in the water &mdash; let&apos;s talk.
        </p>
        <a
          href="mailto:joshuabeneventi@gmail.com?subject=Education%20Partnership%20%E2%80%94%20LJFC&body=Hi%20Joshua%2C%0A%0AI%20saw%20the%20education%20partners%20page%20and"
          className="inline-block px-12 py-4 bg-transparent border border-sand text-sand font-medium text-sm tracking-[0.12em] uppercase no-underline hover:bg-sand hover:text-deep transition-all duration-300"
        >
          Start a Conversation
        </a>
        <div className="mt-6 text-[0.85rem] text-salt/35">
          Or explore what we&apos;ve built:<br />
          <Link href="/education" className="text-seafoam/40 no-underline">lajollafreediveclub.com/education</Link>
          {" "}&middot;{" "}
          <Link href="/conditions" className="text-seafoam/40 no-underline">lajollafreediveclub.com/conditions</Link>
          {" "}&middot;{" "}
          <Link href="/community" className="text-seafoam/40 no-underline">lajollafreediveclub.com/community</Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-12 px-6 text-center border-t border-seafoam/[0.08]">
        <p className="text-[0.8rem] text-salt/25">
          This page was created for potential education partners.<br />
          <a href="https://lajollafreediveclub.com" className="text-seafoam/40 no-underline">La Jolla Freedive Club</a> &middot; La Jolla, California
        </p>
      </footer>
    </div>
  );
}
