import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { EmailCapture } from "@/components/EmailCapture";
import { getAllPrograms, getSeasonalThemes, getMonthlyEvents } from "@/lib/education";

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

// Card subtitles and editorial descriptions that differ from the data file
const programMeta: Record<string, { subtitle: string; editorial: string }> = {
  "camp-garibaldi": {
    subtitle: "Flagship Program",
    editorial:
      "The original ocean camp. Five days of freediving, marine science, surf survival, and water confidence \u2014 built on a breath-first methodology. Kids learn to read real Scripps ocean data before every session, identify species in the field, and develop the internal calm that makes everything else possible.",
  },
  "field-trip": {
    subtitle: "Schools & Groups",
    editorial:
      "A single-day, NGSS-aligned field experience for school groups and homeschool co-ops. Students read live buoy data, conduct a beach survey, enter the marine reserve with snorkel gear, and complete a species identification field journal. Tide pool option available for younger groups (ages 5\u201310).",
  },
  series: {
    subtitle: "After-School & Enrichment",
    editorial:
      "A recurring program for families and homeschool groups who want sustained ocean immersion. Monthly or biweekly sessions build cumulative knowledge \u2014 species identification skills, data literacy, breath-hold progression, and seasonal ocean awareness. Each session features a different guest educator or field focus.",
  },
  "community-day": {
    subtitle: "Open to Everyone",
    editorial:
      "One Saturday a month, we open the program to families. Parents and kids explore the marine reserve together \u2014 guided snorkel tour, species ID, beach science station, and a guest educator talk. No experience needed. All gear provided.",
  },
};

// Seasonal calendar editorial descriptions (richer than data file)
const seasonalEditorial: Record<string, string> = {
  Summer:
    "Leopard sharks arrive in large aggregations. Warm water (68\u201372\u00b0F). Best visibility of the year (15\u201330ft). Garibaldi nesting. Bat rays in the shallows. Grunion runs. Peak camp season.",
  Fall:
    "Warmest water of the year (70\u201374\u00b0F). Lobster season opens. Bioluminescence events. Giant black sea bass sightings. Yellowtail and barracuda passing through. Reduced crowds.",
  Winter:
    "Gray whale migration. Harbor seals pupping at Children\u2019s Pool. Big swells reshape the sand. Cool water (56\u201362\u00b0F). Storm surge ecology. Best tide pool exposures of the year.",
  Spring:
    "Kelp forest regrowth. Horn shark egg cases. Sea hare aggregations. Plankton blooms and food chain ecology. Water warming (60\u201366\u00b0F). Grunion runs begin.",
};

function buildDetails(program: ReturnType<typeof getAllPrograms>[number]) {
  const details: { label: string; value: string }[] = [];
  details.push({ label: "Ages", value: program.ages });
  if (program.duration && program.id !== "camp-garibaldi")
    details.push({ label: "Duration", value: program.duration });
  if (program.id === "camp-garibaldi")
    details.push({ label: "Schedule", value: "Mon\u2013Fri, 8am\u201312:30pm" });
  if (program.schedule && program.id === "series")
    details.push({ label: "Frequency", value: "Monthly or biweekly" });
  if (program.schedule && program.id === "community-day")
    details.push({ label: "Schedule", value: "One Saturday/month, 8:30\u201311:30am" });
  details.push({ label: program.id === "community-day" ? "Capacity" : "Group Size", value: program.groupSize });
  if (program.id === "series")
    details.push({ label: "Sessions", value: "8 sessions typical" });
  if (program.dropInRate)
    details.push({ label: "Drop-In", value: "$50/session" });
  details.push({ label: "Includes", value: program.id === "camp-garibaldi" ? "All gear, field journal, snacks" : program.id === "field-trip" ? "Gear, field journal, data sheets" : program.id === "series" ? "Gear, journal, guest educators" : "Gear, guide, guest educator" });
  details.push({ label: "Location", value: program.location.replace(", Kellogg Park", "") });
  if (program.militaryRate)
    details.push({ label: "Military Rate", value: `$${program.militaryRate}/week` });
  if (program.smallGroupRate)
    details.push({ label: "Small Group Rate", value: "$75/student (under 6)" });
  if (program.subscriberRate)
    details.push({ label: "Subscriber Rate", value: `$${program.subscriberRate}/person` });
  return details;
}

export default function EducationPage() {
  const programs = getAllPrograms();
  const seasonalThemes = getSeasonalThemes();
  const _monthlyEvents = getMonthlyEvents();

  return (
    <>
      {/* ── Hero ── */}
      <section className="bg-gradient-to-b from-deep to-ocean pt-36 pb-24 px-6 text-center">
        <Reveal>
          <div className="section-label text-seafoam before:bg-seafoam justify-center">
            Ocean Education
          </div>
          <h1 className="font-serif text-[clamp(2.5rem,5vw,4rem)] text-white font-normal leading-tight tracking-tight mb-6">
            Other programs teach your kids about the ocean.{" "}
            <em className="italic text-sand">We teach them in it.</em>
          </h1>
          <p className="text-lg text-white/60 max-w-[640px] mx-auto leading-relaxed">
            Field-based ocean science for ages 5&ndash;16. La Jolla Shores sits inside a federally protected marine reserve with a submarine canyon, kelp forests, and 50+ identifiable species within 200 yards of shore. We use it as a classroom &mdash; with guest educators from Scripps, Birch Aquarium, and San Diego&apos;s marine science community.
          </p>
        </Reveal>
      </section>

      {/* ── What Makes This Different ── */}
      <section className="bg-salt py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="section-label">What Makes This Different</div>
            <h2 className="font-serif text-[clamp(1.8rem,3.5vw,2.5rem)] text-deep font-normal leading-tight tracking-tight mb-4">
              Not a lecture. <em className="italic text-coral">Not a lab.</em>
            </h2>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-6 mt-12">
            <Reveal>
              <div className="bg-white border border-deep/10 rounded-xl p-8 h-full">
                <h3 className="font-serif text-xl text-deep mb-4">We put kids in the marine reserve on a breath hold</h3>
                <p className="text-[#5a6a7a] text-sm leading-relaxed">
                  La Jolla Shores sits inside the Matlahuayl State Marine Conservation Area &mdash; a federally protected reserve with a submarine canyon, kelp forests, leopard sharks, bat rays, and 50+ identifiable species within 200 yards of shore. Most ocean education programs talk about this ecosystem. We take kids into it. On a breath hold. With mask, fins, and a field journal.
                </p>
                <p className="text-[#5a6a7a] text-sm leading-relaxed mt-4">
                  Before anyone enters the water, they learn breathing drills, relaxation techniques, equalization, and buddy safety. Then they practice species identification, current reading, and marine ecology &mdash; not from a textbook, but from inside the environment.
                </p>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="bg-white border border-deep/10 rounded-xl p-8 h-full">
                <h3 className="font-serif text-xl text-deep mb-4">A different expert every week</h3>
                <p className="text-[#5a6a7a] text-sm leading-relaxed">
                  Our guest educator model brings in specialists from Scripps Institution of Oceanography, Birch Aquarium, San Diego Lifeguards, SeaWorld Rescue, San Diego Coastkeeper, and the local community &mdash; each leading a session in their area of expertise.
                </p>
                <p className="text-[#5a6a7a] text-sm leading-relaxed mt-4">
                  Kids don&apos;t just learn from one instructor. They meet the people who actually study, protect, and work in the ocean &mdash; and they learn from them in the field, not in a classroom.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── By The Numbers ── */}
      <Reveal>
        <section className="bg-deep py-16 px-6">
          <div className="max-w-5xl mx-auto">
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
                  <div className="text-[0.85rem] text-white/45 leading-[1.5]">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── Programs ── */}
      <section className="bg-salt py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="section-label">Programs</div>
            <h2 className="font-serif text-[clamp(1.8rem,3.5vw,2.5rem)] text-deep font-normal leading-tight tracking-tight mb-4">
              Four ways in. <em className="italic text-coral">One ocean.</em>
            </h2>
            <p className="text-[#5a6a7a] max-w-[700px] mb-16">
              From week-long camps to single-day community events. Every program puts kids in the marine reserve with real data, real equipment, and real scientists.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-6">
            {programs.map((program, i) => {
              const meta = programMeta[program.id];
              const details = buildDetails(program);
              return (
                <Reveal key={program.id} delay={i % 2 === 1 ? 100 : 0}>
                  <div
                    id={program.id === "camp-garibaldi" ? "camp-garibaldi" : undefined}
                    className={`bg-white border border-deep/10 rounded-xl p-8 h-full${program.charterEligible ? " relative" : ""}`}
                  >
                    {program.charterEligible && (
                      <div className="absolute top-4 right-4 flex gap-2">
                        <span className="text-[10px] tracking-[0.15em] uppercase bg-sand/20 text-sand px-3 py-1 rounded-full">Charter Eligible</span>
                      </div>
                    )}
                    <div className="text-[11px] tracking-[0.15em] uppercase text-teal/60 mb-3">{meta?.subtitle}</div>
                    <h3 className="font-serif text-xl text-deep mb-2">{program.name}</h3>
                    <div className="font-serif text-[1.8rem] text-coral mb-4">
                      ${program.price}<span className="text-[0.9rem] text-[#5a6a7a]">/{program.priceUnit}</span>
                    </div>
                    <p className="text-[#5a6a7a] text-sm leading-relaxed mb-6">
                      {meta?.editorial}
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-[0.85rem]">
                      {details.map((d) => (
                        <div key={d.label}>
                          <span className="text-deep/35 block mb-1">{d.label}</span>
                          <span className="text-[#5a6a7a]">{d.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Guest Educators ── */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="section-label">Guest Educators</div>
            <h2 className="font-serif text-[clamp(1.8rem,3.5vw,2.5rem)] text-deep font-normal leading-tight tracking-tight mb-4">
              The people who study, protect, and work in <em className="italic text-coral">this ocean.</em>
            </h2>
            <p className="text-[#5a6a7a] max-w-[700px] mb-12">
              Our rotating guest educator model brings real experts into the field with your kids. Each partner leads a hands-on module in their area of specialization.
            </p>
          </Reveal>
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
              <Reveal key={educator.org}>
                <div className="bg-salt border border-deep/10 rounded-xl p-6 h-full hover:border-teal/30 transition-colors">
                  <div className="text-[11px] tracking-[0.15em] uppercase text-teal/60 mb-2">{educator.org}</div>
                  <div className="font-serif text-lg text-deep mb-2">{educator.module}</div>
                  <div className="text-[#5a6a7a] text-sm leading-relaxed">{educator.detail}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── What Kids Take Home ── */}
      <section className="bg-salt py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="section-label">What Kids Take Home</div>
            <h2 className="font-serif text-[clamp(1.8rem,3.5vw,2.5rem)] text-deep font-normal leading-tight tracking-tight mb-12">
              Not a participation trophy. <em className="italic text-coral">A field journal.</em>
            </h2>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-6">
            <Reveal>
              <div className="bg-white border border-deep/10 rounded-xl p-8 h-full">
                <h3 className="font-serif text-xl text-deep mb-4">The observation journal</h3>
                <p className="text-[#5a6a7a] text-sm leading-relaxed">
                  Every student keeps a field journal with species sketches, data readings, tide predictions, and personal observations. By the end of a camp week, they have a real scientific document &mdash; not a worksheet. Something they made by being in the water and paying attention.
                </p>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="bg-white border border-deep/10 rounded-xl p-8 h-full">
                <h3 className="font-serif text-xl text-deep mb-4">The skills</h3>
                <p className="text-[#5a6a7a] text-sm leading-relaxed">
                  Breath-hold technique. Equalization. Efficient finning. Duck dives. Buddy safety protocols. Rip current identification. Species identification. Data literacy. Surf zone awareness. These are real, transferable skills &mdash; not abstract concepts. Kids leave knowing how to be in the ocean, not just near it.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Seasonal Calendar ── */}
      <section className="bg-deep py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="section-label text-seafoam before:bg-seafoam">Seasonal Calendar</div>
            <h2 className="font-serif text-[clamp(1.8rem,3.5vw,2.5rem)] text-white font-normal leading-tight tracking-tight mb-4">
              The ocean changes. <em className="italic text-sand">So does the curriculum.</em>
            </h2>
            <p className="text-white/50 max-w-[700px] mb-12">
              La Jolla&apos;s marine reserve is a different classroom every season. We build the curriculum around what&apos;s actually happening in the water.
            </p>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {seasonalThemes.map((s) => (
              <Reveal key={s.month}>
                <div className="bg-white/[0.04] border border-white/10 rounded-xl p-6 hover:border-seafoam/30 transition-colors h-full">
                  <div className="font-serif text-[1.3rem] text-sand mb-1">{s.month}</div>
                  <div className="text-[11px] tracking-[0.15em] uppercase text-seafoam/60 mb-3">{s.months}</div>
                  <div className="text-white/40 text-sm leading-relaxed">{seasonalEditorial[s.month] || s.description}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Monthly Themes ── */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="section-label">Monthly Themes</div>
            <h2 className="font-serif text-[clamp(1.8rem,3.5vw,2.5rem)] text-deep font-normal leading-tight tracking-tight mb-4">
              Twelve months. <em className="italic text-coral">Twelve themes.</em>
            </h2>
            <p className="text-[#5a6a7a] max-w-[700px] mb-16">
              Each month features a different topic and guest organization, tied to what&apos;s actually happening in the water.
            </p>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {_monthlyEvents.map((event, i) => (
              <Reveal key={event.month} delay={(i % 3) * 60}>
                <div className="bg-salt border border-deep/10 rounded-xl p-6 h-full">
                  <div className="text-[11px] tracking-[0.15em] uppercase text-teal/60 mb-2">{event.month}</div>
                  <div className="font-serif text-lg text-deep mb-1">{event.theme}</div>
                  <div className="text-coral/70 text-sm mb-2">{event.guestOrg}</div>
                  <div className="text-[#5a6a7a] text-sm leading-relaxed">{event.description}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Charter Funding ── */}
      <section className="bg-salt py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="section-label">Charter Funding</div>
            <h2 className="font-serif text-[clamp(1.8rem,3.5vw,2.5rem)] text-deep font-normal leading-tight tracking-tight mb-12">
              Your charter school funds <em className="italic text-coral">can pay for this.</em>
            </h2>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-6">
            <Reveal>
              <div className="bg-white border border-deep/10 rounded-xl p-8 h-full">
                <h3 className="font-serif text-xl text-deep mb-4">Charter school enrichment</h3>
                <p className="text-[#5a6a7a] text-sm leading-relaxed">
                  California charter school families receive instructional funds for enrichment activities. Our programs &mdash; Camp Garibaldi and Ocean Science Field Trips &mdash; are designed to qualify as NGSS-aligned science enrichment. We provide the documentation, invoicing, and curriculum descriptions your charter school needs to approve the expense.
                </p>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="bg-white border border-deep/10 rounded-xl p-8 h-full">
                <h3 className="font-serif text-xl text-deep mb-4">NGSS-aligned curriculum</h3>
                <p className="text-[#5a6a7a] text-sm leading-relaxed">
                  Every program maps to Next Generation Science Standards for middle school Earth &amp; Space Science, Life Science, and Engineering practices. We provide a curriculum overview, daily learning objectives, and standards alignment documentation that charter coordinators can submit directly for enrichment fund approval.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Credentials ── */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="section-label">Credentials</div>
            <h2 className="font-serif text-[clamp(1.8rem,3.5vw,2.5rem)] text-deep font-normal leading-tight tracking-tight mb-12">
              Who&apos;s teaching your kids. <em className="italic text-coral">And where.</em>
            </h2>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-6">
            <Reveal>
              <div className="bg-salt border border-deep/10 rounded-xl p-8 h-full">
                <h3 className="font-serif text-xl text-deep mb-4">Our team</h3>
                <p className="text-[#5a6a7a] text-sm leading-relaxed">
                  AIDA Instructor. AIDA Youth Instructor. AIDA 4 Freediver. DAN insured. American Red Cross First Aid/CPR/AED certified. All youth programs maintain a maximum 1:4 instructor-to-student ratio in the water. Guest educators are vetted professionals from established San Diego institutions.
                </p>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="bg-salt border border-deep/10 rounded-xl p-8 h-full">
                <h3 className="font-serif text-xl text-deep mb-4">The location</h3>
                <p className="text-[#5a6a7a] text-sm leading-relaxed">
                  La Jolla Shores is a lifeguard-protected beach with gentle surf, sandy bottom entry, and direct access to the Matlahuayl Marine Reserve. It&apos;s where Scripps Institution of Oceanography has conducted research since 1903. Year-round lifeguard coverage. Bathrooms, showers, and parking on site. The safest and most biodiverse entry point on the San Diego coast.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-salt py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <Reveal>
            <div className="section-label justify-center">Get Started</div>
            <h2 className="font-serif text-[clamp(1.8rem,3.5vw,2.5rem)] text-deep font-normal leading-tight tracking-tight mb-6">
              The ocean is <em className="italic text-coral">right there.</em>
            </h2>
            <p className="text-[#5a6a7a] max-w-[500px] mx-auto mb-12">
              Enroll in a camp, book a field trip, or just come see what we do.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact/camp"
                className="inline-block bg-coral text-white px-8 py-4 rounded-full font-medium text-[0.95rem] no-underline hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(199,91,58,0.4)] transition-all"
              >
                Enroll in Camp Garibaldi
              </Link>
              <Link
                href="/contact/courses"
                className="inline-block bg-white border border-deep/15 text-deep px-8 py-4 rounded-full font-medium text-[0.95rem] no-underline hover:-translate-y-0.5 hover:shadow-lg transition-all"
              >
                Book a Field Trip
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <EmailCapture />
    </>
  );
}
