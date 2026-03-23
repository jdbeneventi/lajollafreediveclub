import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "La Jolla Ocean Human Performance Center",
  robots: { index: false, follow: false },
};

export default function OHPCPage() {
  return (
    <div className="partner-page bg-deep text-salt font-sans font-light leading-relaxed overflow-x-hidden">
      {/* Grain */}
      <div className="fixed inset-0 pointer-events-none z-[1000] opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")` }} />

      {/* ── Hero ── */}
      <section className="min-h-screen flex flex-col justify-end px-6 md:px-8 pt-12 pb-16 md:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 z-[1]" style={{ background: `radial-gradient(ellipse at 20% 80%, rgba(27,107,107,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(22,59,78,0.3) 0%, transparent 50%), linear-gradient(180deg, rgba(11,29,44,0.4) 0%, #0B1D2C 100%)` }} />
        <div className="relative z-[2] max-w-[900px]">
          <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-6 animate-[fadeUp_0.8s_ease_0.2s_forwards] opacity-0">La Jolla Freedive Club — March 2026</div>
          <h1 className="font-serif text-[clamp(2.4rem,5.5vw,4.5rem)] font-normal leading-[1.08] mb-6 animate-[fadeUp_0.8s_ease_0.4s_forwards] opacity-0">
            La Jolla Ocean<br />Human Performance <em className="italic text-sand">Center</em>
          </h1>
          <p className="text-[1.1rem] leading-[1.8] text-salt/60 max-w-[620px] mb-8 animate-[fadeUp_0.8s_ease_0.6s_forwards] opacity-0">
            A vision for research, competition, and training at the La Jolla Submarine Canyon — one of the only locations on the US mainland where world-class depth freediving, scientific research, and military water-competency training can converge in a single site.
          </p>
          <p className="text-salt/35 text-sm animate-[fadeUp_0.8s_ease_0.8s_forwards] opacity-0">
            The center&apos;s physical footprint is a single surface buoy. Its impact reaches from Camp Garibaldi&apos;s 8-year-old students to Naval Special Warfare candidates to AIDA athletes setting national depth records.
          </p>
        </div>
      </section>

      {/* ── Philosophy ── */}
      <div className="bg-ocean/15 border-t border-b border-seafoam/10 py-20 px-6 md:px-8">
        <div className="max-w-[700px] mx-auto text-center">
          <blockquote className="font-serif italic text-[clamp(1.3rem,3vw,1.8rem)] leading-[1.6] text-salt/80 mb-4">
            &ldquo;Performance in the ocean starts from the inside out. Breath first. Calm first. Then the water.&rdquo;
          </blockquote>
        </div>
      </div>

      {/* ── Why La Jolla ── */}
      <section className="py-24 px-6 md:px-8 max-w-[1000px] mx-auto">
        <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-4">Why La Jolla — and Why Nowhere Else</div>
        <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-normal leading-[1.2] mb-12">
          No other location in North America <em className="italic text-sand">offers this convergence.</em>
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              label: "Natural Infrastructure",
              items: [
                "La Jolla Submarine Canyon — rim at 35-50m, walls past 130m, true bottom exceeding 180m",
                "La Jolla Shores beach — gentlest, safest ocean entry in San Diego",
                "Fall season: 67-72°F water, visibility exceeding 40 feet",
                "Canyon merges with Scripps Canyon, continues to 1,600 feet",
              ],
            },
            {
              label: "Institutional Proximity",
              items: [
                "UCSD Lindholm Hyperbaric & Diving Medicine Research Lab — world's leading freediving physiology program",
                "Scripps Institution of Oceanography — 500 yards from the dive site",
                "Naval Special Warfare Center — BUD/S training 15 minutes away",
                "Birch Aquarium — 550,000+ annual visitors",
              ],
            },
            {
              label: "Historical Significance",
              items: [
                "First freediving club in the US founded in La Jolla, 1939",
                "Matlahuayl marine reserve protected since 1929",
                "PADI lists La Jolla Canyon as a freediving training location",
                "Kellogg Park bronze canyon map installed 2023",
              ],
            },
            {
              label: "Community Foundation",
              items: [
                "LJFC weekly Saturday training at the canyon mooring (year-round)",
                "Camp Garibaldi youth ocean program (ages 8-16)",
                "Real-time ocean conditions platform from Scripps instruments",
                "La Jolla Underwater Atlas — 10+ sites, 50+ species",
              ],
            },
          ].map((card) => (
            <div key={card.label} className="p-8 bg-ocean/25 border border-seafoam/10 rounded-sm">
              <h3 className="font-serif text-[1.3rem] font-normal text-seafoam mb-4">{card.label}</h3>
              <ul className="space-y-2">
                {card.items.map((item, i) => (
                  <li key={i} className="text-[0.9rem] text-salt/55 leading-[1.7] flex gap-2 items-start">
                    <span className="text-seafoam/40 mt-1 shrink-0">—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── Three Pillars ── */}
      <div className="bg-ocean/20 border-t border-b border-seafoam/10 py-20 px-6 md:px-8">
        <div className="max-w-[1000px] mx-auto">
          <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-4">Three Pillars</div>
          <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-normal leading-[1.2] mb-12">
            Research. Competition. <em className="italic text-sand">Training.</em>
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                num: "01",
                title: "Scientific Research",
                points: [
                  "Longitudinal studies on trained freedivers at a consistent site",
                  "Pre/post-dive assessment using UCSD Medical Center imaging",
                  "Real-time monitoring during competition dives to 60-100m+",
                  "Environmental data from Scripps for physiological correlation",
                  "SIPE, blackout, nitrogen narcosis investigation",
                ],
                partner: "Lindholm Hyperbaric & Diving Medicine Lab, UCSD",
              },
              {
                num: "02",
                title: "Competition",
                points: [
                  "First ocean-based AIDA depth competition in the US",
                  "100+ meter depth from sandy beach entry",
                  "CWT, CWTB, FIM, CNF disciplines",
                  "Embedded research during competition",
                  "NorCal/SoCal series with Fins and Foam Freediving",
                ],
                partner: "AIDA International, US Freediving",
              },
              {
                num: "03",
                title: "Training",
                points: [
                  "Naval Special Warfare — BUD/S breath-hold, SIPE prevention",
                  "Marine Recon / MARSOC — amphibious operations",
                  "Coast Guard rescue swimmers — 80% attrition rate",
                  "Big wave surfers — hold-down survival",
                  "Camp Garibaldi youth — ages 8-16",
                ],
                partner: "NSW, USCG, LJFC",
              },
            ].map((pillar) => (
              <div key={pillar.num} className="p-8 bg-deep/50 border border-seafoam/[0.08] rounded-sm">
                <div className="font-serif text-[2.5rem] text-sand/25 leading-none mb-4">{pillar.num}</div>
                <h3 className="font-serif text-[1.3rem] font-normal text-salt mb-4">{pillar.title}</h3>
                <ul className="space-y-2 mb-6">
                  {pillar.points.map((p, i) => (
                    <li key={i} className="text-[0.85rem] text-salt/45 leading-[1.6] flex gap-2 items-start">
                      <span className="text-seafoam/40 mt-0.5 shrink-0">—</span>
                      {p}
                    </li>
                  ))}
                </ul>
                <div className="text-[10px] tracking-[0.12em] uppercase text-seafoam/40">{pillar.partner}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Research Detail ── */}
      <section className="py-24 px-6 md:px-8 max-w-[1000px] mx-auto border-t border-seafoam/15">
        <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-4">Pillar 1</div>
        <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-normal leading-[1.2] mb-4">
          Scientific Research — <em className="italic text-sand">the Lindholm Lab connection.</em>
        </h2>
        <p className="text-salt/50 max-w-[700px] mb-12">
          A 2025 review in the European Journal of Applied Physiology identified critical knowledge gaps across cardiovascular regulation, pulmonary injury, and neurological effects of deep apnea — concluding that meaningful progress requires study during actual dives, not simulated dry apnea. The OHPC eliminates this bottleneck entirely.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { id: "Lindholm Lab", name: "UCSD Dept. of Emergency Medicine", detail: "Gurnee Endowed Chair in Hyperbaric and Diving Medicine. Funded by DAN. Landmark SIPE studies on Navy SEAL candidates. 800+ citation foundational review paper." },
            { id: "SIPE Research", name: "Swimming-Induced Pulmonary Edema", detail: "5% incidence in BUD/S candidates. Studied in collaboration with Naval Medical Center San Diego. The OHPC enables field replication with civilian and military populations." },
            { id: "Blackout Prevention", name: "Shallow Water Blackout Mechanisms", detail: "Investigation of hypoxic blackout, loss of motor control, and cerebral hypoperfusion during actual deep-water breath-holds — not dry lab simulations." },
            { id: "Imaging", name: "Pre/Post-Dive Assessment", detail: "UCSD Medical Center MRI, ultrasound, and CT available within minutes of actual 60-100m ocean dives. No other site offers this proximity." },
            { id: "Longitudinal", name: "Weekly Cohort", detail: "Trained freedivers who dive at the same site every week, with logged environmental conditions. The controlled field population most researchers spend months recruiting." },
            { id: "DAN Partnership", name: "Divers Alert Network", detail: "DAN funds the Lindholm Lab and insures LJFC. The same network that studies diving injuries worldwide provides the insurance and the research infrastructure." },
          ].map((src) => (
            <div key={src.id} className="p-6 bg-ocean/25 border border-seafoam/[0.08] rounded-sm">
              <div className="text-[11px] tracking-[0.15em] uppercase text-seafoam/60 mb-2">{src.id}</div>
              <div className="font-serif text-[1.05rem] mb-1">{src.name}</div>
              <div className="text-[0.85rem] text-salt/45 leading-[1.6]">{src.detail}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Training Populations ── */}
      <div className="bg-ocean/20 border-t border-b border-seafoam/10 py-20 px-6 md:px-8">
        <div className="max-w-[1000px] mx-auto">
          <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-4">Pillar 3 — Who It Serves</div>
          <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-normal leading-[1.2] mb-4">
            From 8-year-olds to <em className="italic text-sand">special operators.</em>
          </h2>
          <p className="text-salt/50 max-w-[650px] mb-12">The common thread: breath control, equalization, water composure, and the ability to manage physiological stress in an aquatic environment.</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { group: "Naval Special Warfare", detail: "BUD/S breath-hold, drown-proofing, SIPE prevention. 15 min from the site." },
              { group: "Marine Recon / MARSOC", detail: "Amphibious reconnaissance, beach recon, maritime interdiction. Camp Pendleton, 40 min." },
              { group: "Coast Guard Rescue Swimmers", detail: "80% attrition rate. Water composure is the core skill freediving teaches." },
              { group: "Ocean Lifeguards", detail: "Deep-water rescue, surf hold-downs. JG program (ages 9-17) feeds Camp Garibaldi." },
              { group: "Big Wave Surfers", detail: "Hold-down survival at Blacks, Todos Santos, Mavericks. Breath-hold under turbulence." },
              { group: "Scientific Divers", detail: "Bubble-free observation. Scripps grad students studying canyon ecosystems." },
              { group: "Spearfishermen", detail: "Statistically highest risk for fatal shallow water blackout outside military training." },
              { group: "Camp Garibaldi Youth", detail: "Ages 8-16. Breath-first methodology. The ocean camp that starts from the inside out." },
              { group: "Veterans", detail: "Mammalian dive reflex activates vagal tone — measurable parasympathetic regulation, not wellness culture." },
              { group: "Adaptive Athletes", detail: "Challenged Athletes Foundation based in San Diego. La Jolla Shores' gentle entry = most accessible." },
              { group: "Underserved Youth", detail: "ODI (City Heights) and Outdoor Outreach partnerships. Scholarship spots for Camp Garibaldi." },
              { group: "University Students", detail: "UCSD — 40,000 students, 5 minutes from the site. Discover Freediving → lifelong pipeline." },
            ].map((pop) => (
              <div key={pop.group} className="p-5 bg-deep/50 border border-seafoam/[0.06] rounded-sm">
                <div className="font-serif text-[1rem] text-salt mb-1">{pop.group}</div>
                <div className="text-[0.8rem] text-salt/40 leading-[1.6]">{pop.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── The Permanent Buoy ── */}
      <section className="py-24 px-6 md:px-8 max-w-[1000px] mx-auto border-t border-seafoam/15">
        <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-4">Infrastructure</div>
        <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-normal leading-[1.2] mb-4">
          The permanent buoy — <em className="italic text-sand">a single point on the canyon rim.</em>
        </h2>
        <p className="text-salt/50 max-w-[700px] mb-12">
          A single permanent surface marker buoy at 32.856746°N, 117.262603°W — anchored at approximately 50 meters depth, 500 meters offshore from La Jolla Shores. The buoy marks an existing subsurface freediving mooring line.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="p-8 bg-ocean/25 border border-seafoam/10 rounded-sm">
            <h3 className="font-serif text-[1.3rem] font-normal text-seafoam mb-4">What it enables</h3>
            <ul className="space-y-2">
              {[
                "Visible fixed reference point for diver safety",
                "Competition line rigging for AIDA depth events",
                "Research observation site for UCSD studies",
                "Navigation reference reducing vessel-diver conflict",
              ].map((item, i) => (
                <li key={i} className="text-[0.9rem] text-salt/55 leading-[1.7] flex gap-2 items-start">
                  <span className="text-seafoam/40 mt-1 shrink-0">—</span>{item}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-8 bg-ocean/25 border border-seafoam/10 rounded-sm">
            <h3 className="font-serif text-[1.3rem] font-normal text-seafoam mb-4">Regulatory pathway</h3>
            <ul className="space-y-2">
              {[
                "US Coast Guard — PATON authorization (33 CFR Part 66)",
                "Army Corps of Engineers — Section 10 permit",
                "CA State Lands Commission — Submerged lands lease",
                "CA Coastal Commission — CDP or exemption",
                "CDFW — Marine Protected Area compatibility",
                "City of San Diego / Marine Safety — Local coordination",
              ].map((item, i) => (
                <li key={i} className="text-[0.9rem] text-salt/55 leading-[1.7] flex gap-2 items-start">
                  <span className="text-seafoam/40 mt-1 shrink-0">—</span>{item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="p-8 bg-ocean/25 border border-seafoam/10 rounded-sm">
          <h3 className="font-serif text-[1.3rem] font-normal text-seafoam mb-4">Institutional support sought</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              "Letter of support — UCSD Dept. of Emergency Medicine / Lindholm Lab",
              "Letter of support — Naval Special Warfare medical research team",
              "Endorsement — Divers Alert Network",
              "Endorsement — US Freediving / AIDA International",
              "Acknowledgment — San Diego Marine Safety Division",
              "Endorsement — Scripps Institution of Oceanography",
            ].map((item, i) => (
              <div key={i} className="text-[0.85rem] text-salt/45 leading-[1.6] flex gap-2 items-start">
                <span className="text-seafoam/40 mt-0.5 shrink-0">—</span>{item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <div className="bg-ocean/15 border-t border-b border-seafoam/10 py-20 px-6 md:px-8">
        <div className="max-w-[900px] mx-auto">
          <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-4">Timeline</div>
          <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-normal leading-[1.2] mb-12">
            Four phases. <em className="italic text-sand">Starting now.</em>
          </h2>

          <div className="space-y-0">
            {[
              { phase: "Phase 1: Foundation", time: "Now — Summer 2026", items: ["Initiate regulatory conversations (USCG, Army Corps, State Lands, Coastal Commission, CDFW, City of SD)", "Contact Dr. Peter Lindholm at UCSD", "Connect with Fins and Foam Freediving for competition collaboration", "Establish SD Marine Safety relationship", "Formalize Scripps community partnership", "Run Camp Garibaldi first session — proof of concept"] },
              { phase: "Phase 2: Proof of Concept", time: "Fall 2026", items: ["Host first AIDA depth competition using temporary boat-based platform", "Embed research — pre/post-dive lung ultrasound with Lindholm Lab", "Collect media coverage and institutional documentation", "File permanent buoy permit applications", "Secure letters of support from UCSD, DAN, US Freediving, Marine Safety"] },
              { phase: "Phase 3: Establishment", time: "2027", items: ["Permanent buoy installation upon permit approval", "Annual AIDA depth competition established", "Formal research MOU with UCSD Dept. of Emergency Medicine", "Military training pilot program with NSW or Coast Guard", "Grant applications for Camp Garibaldi scholarships and adaptive freediving"] },
              { phase: "Phase 4: Growth", time: "2028+", items: ["International competition hosting (AIDA Continental/World Championship bid)", "Expanded multi-institution research program", "Military training integration as recognized supplemental program", "OHPC recognition as permanent La Jolla institution", "Documentary project — La Jolla as the birthplace and future of American freediving"] },
            ].map((phase) => (
              <div key={phase.phase} className="pl-8 pb-12 border-l border-seafoam/15 relative last:pb-0">
                <div className="absolute left-[-4px] top-1 w-[7px] h-[7px] rounded-full bg-seafoam" />
                <div className="text-sand/60 text-sm mb-1">{phase.time}</div>
                <h3 className="font-serif text-[1.2rem] font-normal text-salt mb-3">{phase.phase}</h3>
                <ul className="space-y-1.5">
                  {phase.items.map((item, i) => (
                    <li key={i} className="text-[0.85rem] text-salt/45 leading-[1.6]">{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── The Story ── */}
      <section className="py-24 px-6 md:px-8 max-w-[800px] mx-auto">
        <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-4">The Story</div>
        <div className="font-serif text-[clamp(1.3rem,3vw,1.7rem)] italic leading-[1.7] text-salt/70 space-y-6">
          <p>In 1939, the first freediving club in America was founded in La Jolla, California.</p>
          <p>Eighty-seven years later, the great-grandson of an Azorean whaler who settled in San Diego for tuna fishing is building something at the same spot on the same coastline: a permanent site where the science of how humans perform underwater is studied, where the training that keeps people alive in the ocean is developed and delivered, and where the sport that tests the limits of a single breath is advanced.</p>
          <p>The La Jolla Submarine Canyon drops from the sandy shallows of La Jolla Shores to depths that challenge the world&apos;s best freedivers — and it does so within walking distance of the world&apos;s leading freediving research lab, the world&apos;s most prestigious oceanographic institution, and the training grounds of the world&apos;s most elite military divers.</p>
          <p className="text-salt/90">No one has connected these pieces before. The Ocean Human Performance Center does.</p>
          <p className="text-sand">It starts from the inside out.</p>
        </div>
      </section>

      {/* ── Credentials ── */}
      <section className="py-16 px-6 md:px-8 max-w-[1000px] mx-auto border-t border-seafoam/15">
        <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-4">The Operator</div>
        <h2 className="font-serif text-[clamp(1.8rem,3vw,2.5rem)] font-normal leading-[1.2] mb-8">La Jolla Freedive Club</h2>
        <p className="text-salt/50 max-w-[700px] mb-8">
          Founded by Joshua Beneventi. Third-generation La Jolla ocean family. UCSD alumnus. San Diego&apos;s only AIDA-certified freediving instructor for adults and youth.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {[
            { value: "AIDA", label: "Instructor + Youth Instructor" },
            { value: "AIDA 4", label: "Advanced Freediver" },
            { value: "DAN", label: "Professional Liability Insured" },
            { value: "ARC", label: "First Aid / CPR / AED" },
            { value: "UCSD", label: "Alumnus" },
            { value: "1939", label: "First US freediving club\nfounded in La Jolla" },
          ].map((c) => (
            <div key={c.value} className="text-center py-6">
              <div className="font-serif text-[2rem] text-sand mb-1">{c.value}</div>
              <div className="text-[0.8rem] text-salt/40 leading-[1.4] whitespace-pre-line">{c.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="text-center py-24 px-6 md:px-8">
        <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-4">Contact</div>
        <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-normal leading-[1.2] mb-6">
          Let&apos;s build <em className="italic text-sand">this together.</em>
        </h2>
        <p className="text-[1.05rem] text-salt/50 mb-10 max-w-[520px] mx-auto leading-[1.8]">
          Whether you&apos;re a researcher, a military training officer, a competition organizer, or an institution that believes La Jolla deserves a permanent ocean performance center — I&apos;d like to talk.
        </p>
        <a
          href="mailto:joshuabeneventi@gmail.com?subject=La%20Jolla%20Ocean%20Human%20Performance%20Center"
          className="inline-block px-12 py-4 bg-transparent border border-sand text-sand font-medium text-sm tracking-[0.12em] uppercase no-underline hover:bg-sand hover:text-deep transition-all duration-300"
        >
          Start a conversation
        </a>
        <div className="mt-6 text-[0.85rem] text-salt/35">
          Joshua Beneventi · joshuabeneventi@gmail.com<br />
          <Link href="/conditions" className="text-seafoam/40 no-underline">lajollafreediveclub.com/conditions</Link>
          {" · "}
          <Link href="/programs" className="text-seafoam/40 no-underline">lajollafreediveclub.com/programs</Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-12 px-6 text-center border-t border-seafoam/[0.08]">
        <p className="text-[0.8rem] text-salt/25">
          La Jolla Ocean Human Performance Center — A Vision Document<br />
          <Link href="/" className="text-seafoam/40 no-underline">La Jolla Freedive Club</Link> · La Jolla Shores, California
        </p>
      </footer>
    </div>
  );
}
