import Link from "next/link";
import { PasswordGate } from "@/components/PasswordGate";
import {
  Fade,
  PullQuote,
  ComparisonRow,
  ElementCard,
  ProtocolTimeline,
  CitationBlock,
} from "./components";

const grain = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
};

export default function SciencePage() {
  return (
    <PasswordGate>
      {/* ── HERO ── */}
      <section className="relative min-h-[80vh] flex items-end overflow-hidden">
        <div className="absolute inset-0 bg-deep" />
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background:
              "radial-gradient(ellipse at 30% 70%, rgba(27,107,107,0.12) 0%, transparent 60%), radial-gradient(ellipse at 80% 30%, rgba(22,59,78,0.25) 0%, transparent 50%)",
          }}
        />
        <div className="absolute inset-0 opacity-[0.03]" style={grain} />

        <div className="relative z-10 w-full px-6 md:px-12 pb-16 md:pb-24 max-w-[1200px] mx-auto">
          <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-6">
            The Method
          </div>

          <h1 className="font-serif text-[clamp(3rem,8vw,6rem)] text-white font-normal leading-[1.02] tracking-tight max-w-[700px]">
            ORIGIN
          </h1>
          <p className="text-[1.1rem] text-white/45 mt-6 max-w-[600px] leading-[1.8]">
            A CO&#8322;-based protocol for induced neuroplasticity. Developed
            from freediving physiology, contemplative training, and memory
            reconsolidation research. The method behind everything LJFC
            teaches.
          </p>

          <div className="flex gap-4 mt-10">
            <Link
              href="/blog/state-anchors"
              className="text-xs text-seafoam/50 hover:text-seafoam transition-colors no-underline border border-seafoam/15 rounded-full px-4 py-2 hover:border-seafoam/30"
            >
              State Anchors &rarr;
            </Link>
            <Link
              href="/ohpc"
              className="text-xs text-seafoam/50 hover:text-seafoam transition-colors no-underline border border-seafoam/15 rounded-full px-4 py-2 hover:border-seafoam/30"
            >
              OHPC Vision &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ── THESIS ── */}
      <section className="bg-deep py-20 md:py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={grain} />
        <div className="max-w-[680px] mx-auto relative z-10">
          <Fade>
            <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] text-white leading-[1.15] tracking-tight mb-8">
              The <em className="italic text-sand">thesis.</em>
            </h2>
          </Fade>

          <Fade delay={40}>
            <p className="text-white/55 text-[1.05rem] leading-[1.85] mb-7">
              Most breathwork methods use hyperventilation &mdash; rapid
              breathing that lowers CO&#8322;, constricts blood vessels,
              reduces cerebral blood flow by 30&ndash;40%, and activates the
              sympathetic nervous system. This produces the
              &ldquo;high&rdquo; of Holotropic, Wim Hof, and similar
              modalities. Useful for catharsis. Limited for lasting change.
            </p>
          </Fade>

          <Fade delay={60}>
            <p className="text-white/55 text-[1.05rem] leading-[1.85] mb-7">
              ORIGIN does the opposite. It uses controlled breath holds at
              partial lung capacity to mildly elevate CO&#8322; &mdash; a
              state called{" "}
              <strong className="text-white font-semibold">
                hypercapnia
              </strong>
              . This produces vasodilation, increases cerebral blood flow by
              50&ndash;100%+, and shifts the autonomic nervous system toward
              parasympathetic dominance.
            </p>
          </Fade>

          <Fade delay={80}>
            <p className="text-white/55 text-[1.05rem] leading-[1.85]">
              The result is a{" "}
              <strong className="text-seafoam font-semibold">
                30&ndash;90 minute window of enhanced neuroplasticity
              </strong>{" "}
              &mdash; a state where memory reconsolidation is possible, fear
              responses can be updated, and new patterns consolidate more
              efficiently than under baseline conditions. We didn&apos;t
              invent this window. We found a reliable, endogenous way to
              open it using the body&apos;s own CO&#8322; sensitivity.
            </p>
          </Fade>
        </div>
      </section>

      {/* ── COMPARISON ── */}
      <section className="bg-ocean/20 py-16 md:py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-deep" />
        <div className="absolute inset-0 opacity-[0.03]" style={grain} />
        <div className="max-w-[700px] mx-auto relative z-10">
          <Fade>
            <div className="flex justify-between text-xs font-medium tracking-wide uppercase mb-8">
              <span className="text-coral/60">
                Hyperventilation (&darr; CO&#8322;)
              </span>
              <span className="text-seafoam/60">
                ORIGIN (&uarr; CO&#8322;)
              </span>
            </div>
          </Fade>
          <Fade delay={60}>
            <ComparisonRow
              label="Cerebral blood flow"
              left="Decreased 30\u201340%"
              right="Increased 50\u2013100%+"
              leftPct={35}
              rightPct={85}
              delay={0}
            />
          </Fade>
          <Fade delay={120}>
            <ComparisonRow
              label="Autonomic state"
              left="Sympathetic dominant"
              right="Parasympathetic shift"
              leftPct={75}
              rightPct={75}
              delay={100}
            />
          </Fade>
          <Fade delay={180}>
            <ComparisonRow
              label="Amygdala response"
              left="Heightened reactivity"
              right="ASIC1a reconsolidation"
              leftPct={80}
              rightPct={65}
              delay={200}
            />
          </Fade>
          <Fade delay={240}>
            <ComparisonRow
              label="Post-session"
              left="State rebounds to baseline"
              right="Consolidation window (30\u201390 min)"
              leftPct={20}
              rightPct={90}
              delay={300}
            />
          </Fade>
        </div>
      </section>

      {/* ── MECHANISM ── */}
      <section className="bg-deep py-20 md:py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={grain} />
        <div className="max-w-[680px] mx-auto relative z-10">
          <Fade>
            <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] text-white leading-[1.15] tracking-tight mb-3">
              The <em className="italic text-sand">mechanism.</em>
            </h2>
            <div className="text-[11px] text-seafoam/60 font-medium tracking-[0.2em] uppercase mb-8">
              CO&#8322; &rarr; ASIC1a &rarr; neuroplastic window
            </div>
          </Fade>

          <Fade delay={40}>
            <p className="text-white/55 text-[1.05rem] leading-[1.85] mb-7">
              In 2009, Ziemann et al. published a landmark paper in{" "}
              <em>Cell</em> demonstrating that the amygdala functions as a{" "}
              <strong className="text-white font-semibold">
                chemosensor
              </strong>{" "}
              &mdash; detecting CO&#8322; through acid-sensing ion channels
              called ASIC1a. When CO&#8322; rises, pH drops, and these
              channels activate, triggering fear memory reconsolidation
              pathways.
            </p>
          </Fade>

          <Fade delay={60}>
            <p className="text-white/55 text-[1.05rem] leading-[1.85] mb-7">
              Subsequent research by Taugher et al. (2021) confirmed that
              CO&#8322; exposure enhances fear memory consolidation when
              administered 1&ndash;4 hours post-learning &mdash; and that
              this depends on ASIC1a colocalization with NMDA receptors in
              amygdalar circuits. The effect is fear memory-specific.
            </p>
          </Fade>

          <Fade delay={80}>
            <p className="text-white/55 text-[1.05rem] leading-[1.85] mb-7">
              Simultaneously, hypercapnia produces robust cerebral
              vasodilation. Bain et al. (2017) demonstrated that
              hypercapnia &mdash; not hypoxia &mdash; is the essential
              mechanism reducing cerebral oxidative metabolism during apnea.
              When hypercapnia was eliminated through hyperventilation, the
              metabolic reduction disappeared entirely.
            </p>
          </Fade>

          <Fade delay={100}>
            <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-6 md:p-8 my-10">
              <p className="text-white/60 text-[0.95rem] leading-[1.8]">
                The combined effect: a window of 30&ndash;90 minutes where
                memory consolidation is enhanced, defensive processing is
                reduced, and the brain is more receptive to pattern updating
                than at baseline.{" "}
                <strong className="text-white font-semibold">
                  This is not a theory. It&apos;s a measurable
                  neurobiological state with published mechanism research.
                </strong>
              </p>
            </div>
          </Fade>

          <Fade delay={120}>
            <h3 className="font-serif text-xl text-white mb-4 mt-12">
              Amplifiers: nitric oxide, vagal activation, interoceptive
              focus
            </h3>
            <p className="text-white/55 text-[1.05rem] leading-[1.85] mb-5">
              <strong className="text-white font-semibold">
                Nitric oxide (humming):
              </strong>{" "}
              Nasal humming increases NO production 15-fold. NO is a
              vasodilator and neurotransmitter precursor. It enhances the
              cerebral perfusion that CO&#8322; elevation already produces.
            </p>
            <p className="text-white/55 text-[1.05rem] leading-[1.85] mb-5">
              <strong className="text-white font-semibold">
                Vagal activation:
              </strong>{" "}
              Extended exhales and vocalization stimulate vagal efferents,
              shifting autonomic balance toward parasympathetic dominance
              before the CO&#8322; loading phase begins.
            </p>
            <p className="text-white/55 text-[1.05rem] leading-[1.85]">
              <strong className="text-white font-semibold">
                Interoceptive focus:
              </strong>{" "}
              Attention to internal sensation during the protocol. Enhanced
              bodily awareness correlates with improved emotional
              regulation &mdash; the mechanism through which the freediving
              skill of equalization becomes a training ground for
              metacognition.
            </p>
          </Fade>
        </div>
      </section>

      {/* ── THREE ELEMENTS ── */}
      <section className="bg-deep py-20 md:py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={grain} />
        <div className="max-w-[900px] mx-auto relative z-10">
          <Fade>
            <div className="text-center mb-12 md:mb-16">
              <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] text-white leading-[1.15] tracking-tight">
                The three{" "}
                <em className="italic text-sand">elements.</em>
              </h2>
            </div>
          </Fade>

          <div className="grid md:grid-cols-3 gap-4 md:gap-5">
            <ElementCard
              symbol="CO&#8322;"
              name="Carbon dioxide"
              role="Primary lever"
              description="Controlled breath holds build tolerance and activate the ASIC1a-mediated reconsolidation pathway. This is the piece that opens the neuroplastic window. The molecule that connects contemplative practice, freediving physiology, and memory reconsolidation research."
              delay={0}
            />
            <ElementCard
              symbol="NO"
              name="Nitric oxide"
              role="Amplifier"
              description="Strategic humming and nasal breathing techniques enhance oxygen delivery and neural plasticity, supporting the CO&#8322; work through vasodilation. Nasal humming increases NO production 15-fold (Weitzberg &amp; Lundberg, 2002)."
              delay={80}
            />
            <ElementCard
              symbol="H&#8322;O"
              name="Water"
              role="Integration environment"
              description="Pool and ocean-based training activates the mammalian dive reflex &mdash; the most powerful autonomic reflex in the human body. At depth: heart rate drops to 20&ndash;24 bpm, brain oxygen falls to 25&ndash;50%, but cerebral blood flow increases 93&ndash;165%. You don&apos;t need water for the transformation, but water accelerates the process."
              delay={160}
            />
          </div>
        </div>
      </section>

      {/* ── PROTOCOL ── */}
      <section className="bg-ocean/15 py-20 md:py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-deep" />
        <div className="absolute inset-0 opacity-[0.03]" style={grain} />
        <div className="max-w-[800px] mx-auto relative z-10">
          <Fade>
            <div className="text-center mb-12 md:mb-16">
              <div className="text-[11px] text-seafoam/60 font-medium tracking-[0.2em] uppercase mb-4">
                Four phases
              </div>
              <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] text-white leading-[1.15] tracking-tight">
                The <em className="italic text-sand">protocol.</em>
              </h2>
              <p className="text-white/35 text-sm mt-3">
                Tap each phase to expand
              </p>
            </div>
          </Fade>

          <ProtocolTimeline />
        </div>
      </section>

      <div className="bg-deep px-6">
        <div className="max-w-[900px] mx-auto">
          <PullQuote>
            The protocol doesn&apos;t do the transformation. It opens the
            door. What you bring through the door is what changes.
          </PullQuote>
        </div>
      </div>

      {/* ── LINEAGE ── */}
      <section className="bg-ocean py-20 md:py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={grain} />
        <div className="max-w-[680px] mx-auto relative z-10">
          <Fade>
            <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] text-white leading-[1.15] tracking-tight mb-8">
              The <em className="italic text-sand">lineage.</em>
            </h2>
          </Fade>

          <Fade delay={40}>
            <p className="text-white/55 text-[1.05rem] leading-[1.85] mb-7">
              Before I ever held my breath underwater, I spent six months in
              Theravada Thai forest monasteries. In that tradition,
              practitioners establish a{" "}
              <em className="text-seafoam">
                kamma&#7789;&#7789;h&#257;na
              </em>{" "}
              &mdash; literally &ldquo;place of work&rdquo; &mdash; a
              specific focal point that occupies the mind during meditation.
              Through daily conditioning, the practitioner builds a
              neuroplastic pathway between the cue and the desired state.
              They call the method{" "}
              <em className="text-seafoam">up&#257;ya</em> &mdash; skillful
              means.
            </p>
          </Fade>

          <Fade delay={60}>
            <p className="text-white/55 text-[1.05rem] leading-[1.85] mb-7">
              When I found freediving &mdash; first with Stella Abbas in
              Tioman, then AIDA 3 with Pieter Van Veen in Dahab, then
              instructor training with Khaled El Gammal &mdash; I recognized
              the same process. The descent down the line mirrors the
              descent into meditation. Boyle&apos;s Law and the
              Transcendental Meditation consciousness diagram describe the
              same shape: compression deepens as you go down.
            </p>
          </Fade>

          <Fade delay={80}>
            <p className="text-white/55 text-[1.05rem] leading-[1.85] mb-7">
              The ORIGIN protocol didn&apos;t come from a laboratory. It
              came from recognizing that contemplative traditions, freediving
              physiology, and memory reconsolidation research are all
              describing the same mechanism from different angles.
              CO&#8322; is the molecule that connects them.
            </p>
          </Fade>

          <Fade delay={100}>
            <p className="text-white/55 text-[1.05rem] leading-[1.85]">
              What I call{" "}
              <Link
                href="/blog/state-anchors"
                className="text-seafoam hover:text-seafoam/80 transition-colors"
              >
                &ldquo;state anchors&rdquo;
              </Link>{" "}
              &mdash; cognitive cues that reliably trigger specific
              psychological states &mdash; are kamma&#7789;&#7789;h&#257;na
              by another name. The language changes depending on who
              I&apos;m talking to. The method doesn&apos;t.
            </p>
          </Fade>
        </div>
      </section>

      {/* ── HYPOTHESIS ── */}
      <section className="bg-deep py-20 md:py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={grain} />
        <div className="max-w-[680px] mx-auto relative z-10">
          <Fade>
            <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] text-white leading-[1.15] tracking-tight mb-8">
              The <em className="italic text-sand">hypothesis.</em>
            </h2>
          </Fade>

          <Fade delay={40}>
            <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-6 md:p-8 mb-10">
              <div className="text-[10px] text-seafoam/50 font-medium tracking-[0.15em] uppercase mb-3">
                Citizen science
              </div>
              <p className="text-white/60 text-[0.95rem] leading-[1.8] mb-4">
                Controlled CO&#8322; exposure during specific psychological
                states can accelerate belief restructuring and mental
                pattern dissolution. When we build CO&#8322; through breath
                holds, we create a controlled stress that opens
                neuroplasticity windows, challenges fear responses, enables
                rapid belief updating, and builds stress resilience.
              </p>
              <p className="text-white/45 text-sm leading-relaxed">
                We are tracking BOLT scores, anxiety scales, performance
                metrics, and subjective wellbeing across all participants.
                This is not a clinical trial. It&apos;s a systematic
                observation with the goal of generating hypotheses worthy of
                formal research.
              </p>
            </div>
          </Fade>

          <Fade delay={60}>
            <p className="text-white/55 text-[1.05rem] leading-[1.85]">
              The research partnership we&apos;re pursuing with UCSD &mdash;
              through the{" "}
              <Link
                href="/ohpc"
                className="text-seafoam hover:text-seafoam/80 transition-colors"
              >
                Ocean Human Performance Center
              </Link>{" "}
              &mdash; would formalize this. Longitudinal studies on a local
              population of trained freedivers who dive weekly at the same
              site, with pre-dive and post-dive assessment. The La Jolla
              Submarine Canyon provides the natural laboratory. The
              community provides the subjects. The protocol provides the
              intervention. The question is whether what we observe
              informally can be measured formally.
            </p>
          </Fade>
        </div>
      </section>

      {/* ── SAFETY ── */}
      <section className="bg-deep py-16 md:py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={grain} />
        <div className="max-w-[680px] mx-auto relative z-10">
          <Fade>
            <div className="bg-coral/[0.06] border border-coral/15 rounded-2xl p-6 md:p-8">
              <h3 className="font-serif text-xl text-coral mb-4">Safety</h3>
              <p className="text-white/50 text-sm leading-relaxed mb-4">
                <strong className="text-white/70 font-semibold">
                  Absolute contraindications:
                </strong>{" "}
                Cardiovascular disease, uncontrolled hypertension, history
                of stroke or TIA, epilepsy, pregnancy, severe respiratory
                conditions, recent surgery, acute psychiatric crisis.
              </p>
              <p className="text-white/50 text-sm leading-relaxed mb-4">
                <strong className="text-white/70 font-semibold">
                  Protocol principles:
                </strong>{" "}
                No water during CO&#8322; loading phases &mdash; land-based
                only. No hyperventilation at any point. Graduated
                progression guided by BOLT score. Supine position only
                during CO&#8322; loading.
              </p>
              <p className="text-white/35 text-xs leading-relaxed">
                LJFC instructors are AIDA certified, DAN insured, and
                American Red Cross First Aid/CPR/AED certified. Medical
                screening forms are required before any participant engages
                with the protocol.
              </p>
            </div>
          </Fade>
        </div>
      </section>

      {/* ── WHERE IT LIVES ── */}
      <section className="bg-ocean py-20 md:py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={grain} />
        <div className="max-w-[680px] mx-auto relative z-10">
          <Fade>
            <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] text-white leading-[1.15] tracking-tight mb-8">
              Where this <em className="italic text-sand">lives.</em>
            </h2>
          </Fade>

          <div className="space-y-5">
            {[
              {
                label: "Camp Garibaldi",
                body: "The Day 1 breath-hold experiment where an 8-year-old measures their own dive reflex. Composure before skill. Breath before depth. The \u201Cinside out\u201D philosophy.",
                href: "/camp-garibaldi",
              },
              {
                label: "AIDA Courses",
                body: "CO\u2082 tolerance tables and state anchoring that turns 30-minute relaxation into a 30-second reliable state shift. The reason LJFC students improve faster than technique alone predicts.",
                href: "/programs",
              },
              {
                label: "Saturday Sessions",
                body: "The community training composure under real ocean conditions every week \u2014 building the dataset that will eventually become formal research.",
                href: "/programs",
              },
              {
                label: "Ocean Human Performance Center",
                body: "The vision connecting Camp Garibaldi\u2019s youngest students to AIDA competition athletes to UCSD researchers \u2014 all training the same capacity through different expressions.",
                href: "/ohpc",
              },
            ].map((item, i) => (
              <Fade key={item.label} delay={i * 60}>
                <Link
                  href={item.href}
                  className="block bg-white/[0.04] border border-white/[0.06] rounded-xl p-6 hover:bg-white/[0.07] transition-all no-underline group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-semibold text-white text-sm mb-1.5 group-hover:text-seafoam transition-colors">
                        {item.label}
                      </div>
                      <div className="text-white/40 text-sm leading-relaxed">
                        {item.body}
                      </div>
                    </div>
                    <span className="text-white/15 group-hover:text-seafoam/40 transition-colors shrink-0">
                      &rarr;
                    </span>
                  </div>
                </Link>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      <div className="bg-deep px-6">
        <div className="max-w-[900px] mx-auto">
          <PullQuote>
            The ocean camp that starts from the inside out starts here.
          </PullQuote>
        </div>
      </div>

      {/* ── CITATIONS ── */}
      <section className="bg-deep py-16 md:py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={grain} />
        <div className="max-w-[700px] mx-auto relative z-10">
          <Fade>
            <div className="text-[11px] text-seafoam/60 font-medium tracking-[0.2em] uppercase mb-6">
              References
            </div>
          </Fade>
          <Fade delay={40}>
            <div className="space-y-3">
              <CitationBlock
                category="Core Mechanism &mdash; CO&#8322; as Neuromodulator"
                citations={[
                  {
                    text: 'Ziemann AE, et al. "The amygdala is a chemosensor that detects carbon dioxide and acidosis to elicit fear behavior." <em>Cell</em>, 139(5):1012-1021, 2009.',
                    links: [
                      { label: "PMC", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC2808123/" },
                      { label: "PubMed", url: "https://pubmed.ncbi.nlm.nih.gov/19945383/" },
                    ],
                  },
                  {
                    text: 'Taugher RJ, et al. "Post-acquisition CO\u2082 inhalation enhances fear memory and depends on ASIC1A." <em>Frontiers in Behavioral Neuroscience</em>, 15:767426, 2021.',
                    links: [
                      { label: "PMC", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8585996/" },
                      { label: "PubMed", url: "https://pubmed.ncbi.nlm.nih.gov/34776896/" },
                    ],
                  },
                  {
                    text: 'Bain AR, et al. "Hypercapnia is essential to reduce the cerebral oxidative metabolism during extreme apnea in humans." <em>JCBFM</em>, 37(9):3231-3242, 2017.',
                    links: [
                      { label: "PMC", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5584699/" },
                      { label: "PubMed", url: "https://pubmed.ncbi.nlm.nih.gov/28071964/" },
                    ],
                  },
                ]}
              />
              <CitationBlock
                category="Memory Reconsolidation"
                citations={[
                  {
                    text: 'Nader K, Schafe GE, LeDoux JE. "Fear memories require protein synthesis in the amygdala for reconsolidation after retrieval." <em>Nature</em>, 406:722-726, 2000.',
                    links: [{ label: "PubMed", url: "https://pubmed.ncbi.nlm.nih.gov/10963596/" }],
                  },
                  {
                    text: 'Monfils MH, et al. "Extinction-reconsolidation boundaries: key to persistent attenuation of fear memories." <em>Science</em>, 324(5929):951-955, 2009.',
                    links: [{ label: "PubMed", url: "https://pubmed.ncbi.nlm.nih.gov/19342552/" }],
                  },
                ]}
              />
              <CitationBlock
                category="Freediver Neuroimaging &amp; Cerebral Physiology"
                citations={[
                  {
                    text: 'Annen J, et al. "Mapping the functional brain state of a world champion freediver in static dry apnea." <em>Brain Structure and Function</em>, 226:2675-2688, 2021.',
                    links: [
                      { label: "PubMed", url: "https://pubmed.ncbi.nlm.nih.gov/34420066/" },
                      { label: "Springer", url: "https://link.springer.com/article/10.1007/s00429-021-02361-1" },
                    ],
                  },
                  {
                    text: 'Bailey DM, et al. "Hypoxemia increases blood-brain barrier permeability during extreme apnea in humans." <em>JCBFM</em>, 42(6):1120-1135, 2022.',
                    links: [{ label: "PubMed", url: "https://pubmed.ncbi.nlm.nih.gov/35061562/" }],
                  },
                ]}
              />
              <CitationBlock
                category="Nitric Oxide &amp; Diving Response"
                citations={[
                  {
                    text: 'Weitzberg E, Lundberg JON. "Humming greatly increases nasal nitric oxide." <em>AJRCCM</em>, 166(2):144-145, 2002.',
                    links: [{ label: "PubMed", url: "https://pubmed.ncbi.nlm.nih.gov/12119224/" }],
                  },
                  {
                    text: 'Bakovi\u0107 D, et al. "Spleen volume and blood flow response to repeated breath-hold apneas." <em>J Appl Physiol</em>, 95(4):1460-1466, 2003.',
                    links: [{ label: "PubMed", url: "https://pubmed.ncbi.nlm.nih.gov/12819225/" }],
                  },
                ]}
              />
              <CitationBlock
                category="Intermittent Hypoxia &amp; Anthropological Context"
                citations={[
                  {
                    text: 'Serebrovska ZO, et al. "Intermittent hypoxic training as an effective tool for increasing the adaptive potential of the brain." <em>Frontiers in Neuroscience</em>, 16:941740, 2022.',
                    links: [{ label: "PMC", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9254677/" }],
                  },
                  {
                    text: 'Kedar Y, et al. "Hypoxia in Paleolithic decorated caves: artificial light reduces oxygen and induces altered states of consciousness." <em>Time and Mind</em>, 14(2):181-216, 2021.',
                    links: [{ label: "Taylor & Francis", url: "https://www.tandfonline.com/doi/full/10.1080/1751696X.2021.1903177" }],
                  },
                ]}
              />
            </div>
          </Fade>
        </div>
      </section>

      {/* ── FOOTER CTA ── */}
      <section className="bg-deep py-16 md:py-20 px-6 relative">
        <div className="absolute inset-0 opacity-[0.03]" style={grain} />
        <div className="max-w-[680px] mx-auto relative z-10">
          <Fade>
            <div className="border-t border-white/[0.06] pt-10 mb-12">
              <p className="text-sm text-white/25 leading-relaxed">
                <strong className="text-white/50 font-semibold">
                  Joshua Beneventi
                </strong>{" "}
                &middot; AIDA Instructor &middot; AIDA Youth Instructor
                &middot; AIDA 4 Freediver &middot; UCSD Alumnus &middot;
                DAN Insured &middot; ARC First Aid/CPR/AED
              </p>
            </div>
          </Fade>

          <Fade delay={40}>
            <div className="bg-gradient-to-br from-ocean to-teal rounded-2xl p-10 text-center">
              <h3 className="font-serif text-2xl text-white mb-3">
                Experience the method
              </h3>
              <p className="text-white/60 text-sm mb-6 leading-relaxed">
                ORIGIN is integrated into every LJFC course and community
                session. Start with a Saturday at the Shores.
              </p>
              <Link
                href="/contact"
                className="inline-flex px-8 py-3 bg-coral text-white rounded-full font-semibold no-underline hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(232,115,74,0.4)] transition-all"
              >
                Get Started &rarr;
              </Link>
            </div>
          </Fade>
        </div>
      </section>
    </PasswordGate>
  );
}
