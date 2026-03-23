import Link from "next/link";
import {
  Fade,
  AnimatedBar,
  FlipCard,
  DualDiagram,
  PathwayTabs,
  PracticeTimeline,
  PullQuote,
} from "./components";

/* ─── Grain overlay ─── */
const grain = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
};

/* ═══════════════════════════════════════════════════════════ */
/*  PAGE (Server Component)                                    */
/* ═══════════════════════════════════════════════════════════ */

export default function StateAnchorsPage() {
  return (
    <>
      {/* ── HERO ── */}
      <section className="relative h-[85vh] min-h-[600px] flex items-end overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source
            src="/videos/joshua-blue-hole-monofin.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-deep via-deep/50 to-transparent" />
        <div className="absolute inset-0 opacity-[0.03]" style={grain} />

        <div className="relative z-10 w-full px-6 md:px-12 pb-16 md:pb-20 max-w-[1200px] mx-auto">
          <div className="text-sm text-white/30 mb-8">
            <Link
              href="/"
              className="text-white/40 no-underline hover:text-seafoam transition-colors"
            >
              Home
            </Link>
            {" / "}
            <Link
              href="/blog"
              className="text-white/40 no-underline hover:text-seafoam transition-colors"
            >
              Journal
            </Link>
            {" / "}
            Training
          </div>

          <span className="inline-block px-4 py-1.5 bg-seafoam/15 text-seafoam rounded-full text-xs font-semibold tracking-wide uppercase mb-6">
            Training
          </span>

          <h1 className="font-serif text-[clamp(2.8rem,7vw,5.5rem)] text-white font-normal leading-[1.05] tracking-tight max-w-[800px]">
            State Anchors
          </h1>
          <p className="font-serif text-[clamp(1.1rem,2.5vw,1.6rem)] text-white/50 italic mt-4 max-w-[600px] leading-snug">
            What Buddhist Monasteries Taught Me About Freediving
          </p>

          <div className="flex gap-8 text-white/30 text-sm mt-8">
            <span>March 22, 2026</span>
            <span>18 min read</span>
          </div>
        </div>
      </section>

      {/* ── LEDE ── */}
      <section className="bg-salt py-20 md:py-28 px-6 relative">
        <div className="absolute inset-0 opacity-[0.02]" style={grain} />
        <div className="max-w-[680px] mx-auto relative z-10">
          <Fade>
            <p className="font-serif text-[clamp(1.2rem,2.5vw,1.5rem)] text-deep leading-[1.7] mb-8">
              Before I ever held my breath underwater, I spent six months
              holding it on land.
            </p>
          </Fade>
          <Fade delay={60}>
            <p className="text-[1.05rem] leading-[1.85] text-[#2a2a2a] mb-7">
              Not literally. But in the Thai forest monasteries where I lived
              before I found freediving, the practice was structurally
              identical: sit still, focus on one thing, and watch what your
              mind does when the discomfort arrives. In the Theravada
              tradition, they call the focal object a{" "}
              <em className="text-teal">kamma&#7789;&#7789;h&#257;na</em>{" "}
              &mdash; literally &ldquo;place of work.&rdquo; It could be the
              breath, a body sensation, a color, a sound. The point
              wasn&apos;t the object itself. The point was what the object
              did to the architecture of your attention.
            </p>
          </Fade>
          <Fade delay={120}>
            <p className="text-[1.05rem] leading-[1.85] text-[#2a2a2a]">
              I didn&apos;t know it at the time, but I was training for
              freediving.
            </p>
          </Fade>
        </div>
      </section>

      {/* ── THE GAP ── */}
      <section className="bg-white py-20 md:py-28 px-6 relative">
        <div className="absolute inset-0 opacity-[0.015]" style={grain} />
        <div className="max-w-[680px] mx-auto relative z-10">
          <Fade>
            <div className="section-label">The gap nobody talks about</div>
            <h2 className="section-title">
              We say it&apos;s 80% mental.
              <br />
              We train 90% physical.
            </h2>
          </Fade>

          <Fade delay={40}>
            <p className="text-[1.05rem] leading-[1.85] text-[#2a2a2a] mb-7">
              Ask any freediver why they started and the answers cluster
              around the same territory: peace, quiet, transformation,
              escape. The water delivers. Every time. It&apos;s a perfect
              mirror &mdash; it shows you exactly what&apos;s happening in
              your body and your mind, whether you asked to see it or not.
            </p>
          </Fade>

          <Fade delay={60}>
            <p className="text-[1.05rem] leading-[1.85] text-[#2a2a2a] mb-7">
              But here&apos;s what most freediving education doesn&apos;t
              address directly: the states of consciousness that drew us to
              the sport &mdash; the calm, the dissociation from surface
              noise, the feeling of being fully present &mdash; those states
              are treated as byproducts of technique rather than skills to
              be trained.
            </p>
          </Fade>

          <Fade delay={80}>
            <p className="text-[1.05rem] leading-[1.85] text-[#2a2a2a] mb-7">
              In a typical 20+ hour AIDA course, we spend maybe one to two
              hours on the mental side. The rest is equalization mechanics,
              Boyle&apos;s Law, safety protocols, technique drills. All
              essential. But the ratio is inverted relative to what actually
              determines performance.
            </p>
          </Fade>

          <Fade delay={100}>
            <p className="text-[1.05rem] leading-[1.85] text-[#2a2a2a] mb-7">
              This creates a gap. Students finish certification with solid
              technique but without systematic tools for accessing the
              psychological states that make the technique work. So they
              have good days and bad days. They can&apos;t figure out why
              Tuesday&apos;s dive felt effortless and Thursday&apos;s felt
              like a fight.
            </p>
          </Fade>

          <Fade delay={120}>
            <p className="text-[1.05rem] leading-[1.85] text-[#2a2a2a]">
              People burn out not because their bodies failed them but
              because their minds did, and nobody gave them tools to address
              it.
            </p>
          </Fade>
        </div>
      </section>

      {/* ── TRAINING GAP VIZ ── */}
      <section className="bg-deep py-16 md:py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={grain} />
        <div className="max-w-[600px] mx-auto relative z-10">
          <Fade>
            <div className="text-[11px] text-seafoam/60 font-medium tracking-[0.2em] uppercase mb-4 text-center">
              The mental training gap
            </div>
            <h3 className="font-serif text-2xl md:text-3xl text-white text-center mb-10">
              Where the time goes in a 20-hour course
            </h3>
          </Fade>
          <Fade delay={100}>
            <div className="space-y-6">
              <AnimatedBar
                label="Equalization, technique, theory, safety"
                pct={90}
                color="rgba(255,255,255,0.15)"
                delay={200}
              />
              <AnimatedBar
                label="Mental training & state development"
                pct={10}
                color="#3db8a4"
                delay={500}
              />
            </div>
            <p className="text-white/25 text-sm text-center mt-8">
              The ratio is inverted relative to what determines performance.
            </p>
          </Fade>
        </div>
      </section>

      {/* ── 100% MENTAL ── */}
      <section className="bg-deep py-20 md:py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={grain} />
        <div className="max-w-[900px] mx-auto relative z-10">
          <Fade>
            <div className="text-center mb-12 md:mb-16">
              <div className="text-[11px] text-seafoam/60 font-medium tracking-[0.2em] uppercase mb-4">
                Reframing the sport
              </div>
              <h2 className="font-serif text-[clamp(2rem,5vw,3.5rem)] text-white leading-[1.1] tracking-tight">
                What if it&apos;s 100% mental?
              </h2>
              <p className="text-white/40 text-[0.95rem] mt-4 max-w-[500px] mx-auto">
                Every &ldquo;physical&rdquo; skill in freediving has a
                cognitive layer that determines whether it works.
              </p>
            </div>
          </Fade>

          <Fade delay={80}>
            <div className="grid sm:grid-cols-2 gap-4 md:gap-5">
              <FlipCard
                front="Equalization"
                frontSub="Learning to feel pressure changes"
                back="Interoception"
                backSub="Sensing internal body signals — a cognitive skill, not a mechanical one."
              />
              <FlipCard
                front="Technique"
                frontSub="Sensing body position without visual feedback"
                back="Proprioception"
                backSub="Knowing where your body is in space without seeing it — pure neural mapping."
              />
              <FlipCard
                front="Safety"
                frontSub="Monitoring internal state for warning signs"
                back="Metacognition"
                backSub="Awareness of your own awareness — thinking about what you're thinking."
              />
              <FlipCard
                front="Dive Response"
                frontSub="Your body recognizing the context"
                back="Context Recognition"
                backSub="Not a reflex — a response. It can be suppressed or enhanced by your brain."
              />
            </div>
          </Fade>

          <Fade delay={160}>
            <div className="max-w-[680px] mx-auto mt-16">
              <p className="text-white/60 text-[1.05rem] leading-[1.85] mb-7">
                Umberto Pelizzari admitted that early in his career, he
                focused intensely on physical training, only later realizing
                that the mental component was crucial. Research on elite
                freedivers shows a fivefold increase in sympathetic nerve
                activity during deep dives &mdash; the fight-or-flight
                system screaming &mdash; while maintaining stability that
                would overwhelm an untrained person.
              </p>
              <p className="text-white/60 text-[1.05rem] leading-[1.85]">
                That&apos;s not their bodies automatically handling the
                stress. That&apos;s a trained psychological capacity to
                coexist with signals that evolution designed to make you
                panic.
              </p>
            </div>
          </Fade>
        </div>
      </section>

      <div className="bg-deep px-6">
        <div className="max-w-[900px] mx-auto">
          <PullQuote>
            We&apos;re teaching people to override millions of years of
            survival instincts in a weekend course.
          </PullQuote>
        </div>
      </div>

      {/* ── THE SCIENCE ── */}
      <section className="bg-deep py-20 md:py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={grain} />
        <div className="max-w-[680px] mx-auto relative z-10">
          <Fade>
            <div className="section-label text-seafoam before:bg-seafoam">
              The science
            </div>
            <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] text-white leading-[1.15] tracking-tight mb-8">
              What happens in elite freedivers&apos; brains
            </h2>
          </Fade>

          <Fade delay={40}>
            <p className="text-white/60 text-[1.05rem] leading-[1.85] mb-7">
              Research during optimal breath-holds shows a sharp increase in{" "}
              <strong className="text-seafoam font-semibold">
                alpha wave activity
              </strong>{" "}
              &mdash; the frequency band associated with being
              simultaneously calm and alert. Some brain areas activate while
              others quiet down, in a pattern neuroimaging studies describe
              as bearing &ldquo;striking similarity with observations during
              mindfulness and Vipassana meditation.&rdquo;
            </p>
          </Fade>

          <Fade delay={60}>
            <p className="text-white/60 text-[1.05rem] leading-[1.85] mb-7">
              This is not a metaphor. Elite freedivers and advanced
              meditators are registering functionally similar brain states
              through different doorways.
            </p>
          </Fade>

          <Fade delay={80}>
            <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-6 md:p-8 my-10">
              <div className="text-[11px] text-seafoam/60 font-medium tracking-[0.2em] uppercase mb-3">
                Proof it&apos;s learnable
              </div>
              <p className="text-white/60 text-[0.95rem] leading-[1.8]">
                Swedish freediver{" "}
                <strong className="text-white font-semibold">
                  Ulf Dextegen
                </strong>{" "}
                achieved an 8:43 static breath-hold &mdash; a national
                record &mdash; using primarily mental techniques. He started
                at 40, from a desk job, with no athletic background. Within
                a year, his brain had learned the state pattern so well he
                didn&apos;t need the trigger cue anymore. The shortcut had
                become the default.
              </p>
            </div>
          </Fade>

          <Fade delay={100}>
            <p className="text-white/60 text-[1.05rem] leading-[1.85]">
              That&apos;s neuroplasticity. What wires together, fires
              together. And it works in both directions &mdash; you can
              train your brain toward performance states just as reliably as
              you can train your body toward physical ones.
            </p>
          </Fade>
        </div>
      </section>

      {/* ── BOYLE'S / TM DIAGRAM ── */}
      <section className="bg-deep py-20 md:py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={grain} />
        <div className="max-w-[900px] mx-auto relative z-10">
          <Fade>
            <div className="text-center mb-12 md:mb-16">
              <div className="text-[11px] text-seafoam/60 font-medium tracking-[0.2em] uppercase mb-4">
                The epiphany
              </div>
              <h2 className="font-serif text-[clamp(1.8rem,4vw,2.8rem)] text-white leading-[1.15] tracking-tight max-w-[600px] mx-auto">
                Boyle&apos;s Law and the Transcendental Meditation diagram
              </h2>
            </div>
          </Fade>

          <Fade delay={60}>
            <div className="max-w-[680px] mx-auto mb-12">
              <p className="text-white/60 text-[1.05rem] leading-[1.85]">
                I had an epiphany during my AIDA instructor course. Everyone
                knows the Boyle&apos;s Law diagram: depth, pressure, gas
                volume. In Transcendental Meditation, they use a nearly
                identical diagram for states of consciousness. At the
                surface, full-volume mental activity. As you settle deeper,
                thought becomes subtler. The mental &ldquo;bubble&rdquo;
                gets smaller and quieter.
              </p>
            </div>
          </Fade>

          <Fade delay={120}>
            <DualDiagram />
          </Fade>

          <Fade delay={180}>
            <div className="max-w-[680px] mx-auto mt-12">
              <p className="text-white/60 text-[1.05rem] leading-[1.85] mb-7">
                In one case, the medium is air and the mechanism is
                hydrostatic pressure. In the other, the medium is attention
                and the mechanism is focused repetition. But the shape is
                identical: descent compresses. The deeper you go &mdash;
                physically or psychologically &mdash; the more concentrated
                and refined the experience becomes.
              </p>
              <p className="text-white/60 text-[1.05rem] leading-[1.85]">
                In TM, the tool that carries you down is a mantra &mdash; a
                single repeated sound. It functions as an anchor. You
                don&apos;t analyze it. You repeat it, and the repetition
                itself creates the descent. The mantra is the weight on the
                line.
              </p>
            </div>
          </Fade>
        </div>
      </section>

      <div className="bg-deep px-6">
        <div className="max-w-[900px] mx-auto">
          <PullQuote>
            The water is the meditation hall. The descent is the mantra. The
            anchor is whatever brings you home.
          </PullQuote>
        </div>
      </div>

      {/* ── STATE ANCHORS DEFINED ── */}
      <section className="bg-ocean py-20 md:py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={grain} />
        <div className="max-w-[680px] mx-auto relative z-10">
          <Fade>
            <div className="section-label text-seafoam before:bg-seafoam">
              The framework
            </div>
            <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] text-white leading-[1.15] tracking-tight mb-8">
              State anchors: making the invisible visible
            </h2>
          </Fade>

          <Fade delay={40}>
            <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-6 md:p-8 mb-10">
              <p className="font-serif text-xl md:text-2xl text-white/90 leading-snug italic">
                A state anchor is a cognitive cue &mdash; auditory, visual,
                or somatic &mdash; that you train to reliably trigger a
                specific psychological state.
              </p>
            </div>
          </Fade>

          <Fade delay={60}>
            <p className="text-white/60 text-[1.05rem] leading-[1.85] mb-7">
              Through daily conditioning, you pair the cue with the desired
              state until the neural pathway becomes automatic. What might
              initially require 30 minutes of progressive relaxation
              becomes accessible in 30 seconds through a trained trigger.
            </p>
          </Fade>

          <Fade delay={80}>
            <p className="text-white/60 text-[1.05rem] leading-[1.85] mb-7">
              This isn&apos;t a new idea. It&apos;s the oldest idea. What I
              call state anchors, Buddhist practitioners have called
              kamma&#7789;&#7789;h&#257;na for 2,500 years. What sports
              psychologists call visualization cues, contemplative
              traditions call{" "}
              <em className="text-seafoam">up&#257;ya</em> &mdash; skillful
              means. The mechanism is neuroplasticity. The application is
              performance. The lineage is ancient.
            </p>
          </Fade>

          <Fade delay={100}>
            <p className="text-white/60 text-[1.05rem] leading-[1.85]">
              Traditional visualization focuses on{" "}
              <strong className="text-white font-semibold">
                what to do
              </strong>{" "}
              &mdash; rehearsing the dive. State anchoring focuses on{" "}
              <strong className="text-white font-semibold">
                who to be
              </strong>{" "}
              &mdash; accessing a quality of consciousness that makes the
              procedural stuff work better. It&apos;s the layer underneath.
            </p>
          </Fade>
        </div>
      </section>

      {/* ── THREE PATHWAYS ── */}
      <section className="bg-deep py-20 md:py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={grain} />
        <div className="max-w-[900px] mx-auto relative z-10">
          <Fade>
            <div className="text-center mb-12 md:mb-16">
              <div className="text-[11px] text-seafoam/60 font-medium tracking-[0.2em] uppercase mb-4">
                Finding yours
              </div>
              <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] text-white leading-[1.15] tracking-tight">
                Three pathways to anchor discovery
              </h2>
            </div>
          </Fade>

          <Fade delay={80}>
            <PathwayTabs />
          </Fade>
        </div>
      </section>

      {/* ── PRACTICAL PROMISE ── */}
      <section className="bg-salt py-20 md:py-28 px-6 relative">
        <div className="absolute inset-0 opacity-[0.02]" style={grain} />
        <div className="max-w-[680px] mx-auto relative z-10">
          <Fade>
            <div className="section-label">The practical promise</div>
            <h2 className="section-title">
              30 minutes of relaxation
              <br />
              &rarr; 30 seconds
            </h2>
          </Fade>
        </div>

        <div className="max-w-[700px] mx-auto relative z-10 mt-10">
          <Fade delay={80}>
            <div className="bg-deep rounded-2xl p-6 md:p-10">
              <PracticeTimeline />
            </div>
          </Fade>
        </div>

        <div className="max-w-[680px] mx-auto relative z-10 mt-12">
          <Fade delay={120}>
            <p className="text-[1.05rem] leading-[1.85] text-[#2a2a2a] mb-7">
              You identify an anchor that resonates. You begin a daily
              conditioning practice: five to ten minutes, same time each
              day. The neural pathway between the cue and the state gets
              stronger and faster with each repetition.
            </p>
          </Fade>

          <Fade delay={140}>
            <p className="text-[1.05rem] leading-[1.85] text-[#2a2a2a] mb-7">
              Now imagine you&apos;re at the beach on a Saturday morning.
              You didn&apos;t sleep well. Work stress is lingering. The
              conditions are marginal. Six months ago, this would have
              produced a bad dive day &mdash; anxiety at the surface,
              tension on the descent, fighting the urge to breathe instead
              of releasing into it.
            </p>
          </Fade>

          <Fade delay={160}>
            <p className="text-[1.05rem] leading-[1.85] text-[#2a2a2a]">
              But you&apos;ve spent the last year conditioning a state
              anchor. You close your eyes at the buoy, invoke your cue, and
              within 30 seconds you&apos;re in the same psychological state
              that used to require a perfect morning and 30 minutes of
              preparation. That&apos;s the practical promise: reliable
              access to your optimal performance state regardless of
              external conditions.
            </p>
          </Fade>
        </div>
      </section>

      {/* ── BEYOND THE WATER ── */}
      <section className="bg-white py-20 md:py-28 px-6 relative">
        <div className="absolute inset-0 opacity-[0.015]" style={grain} />
        <div className="max-w-[680px] mx-auto relative z-10">
          <Fade>
            <div className="section-label">Beyond the water</div>
            <h2 className="section-title">
              The anchor doesn&apos;t care about context
            </h2>
          </Fade>

          <Fade delay={40}>
            <p className="text-[1.05rem] leading-[1.85] text-[#2a2a2a] mb-7">
              State anchoring develops metacognition &mdash; awareness of
              your own mental states and the ability to modulate them. Once
              you can notice &ldquo;I&apos;m in an anxious state&rdquo; and
              have a trained tool to shift toward &ldquo;I&apos;m in an
              alert-but-calm state,&rdquo; you have something that applies
              to every stressful situation in your life. Job interviews,
              difficult conversations, medical procedures, parenting
              moments where you need to stay composed.
            </p>
          </Fade>

          <Fade delay={60}>
            <p className="text-[1.05rem] leading-[1.85] text-[#2a2a2a]">
              There&apos;s a healing dimension too. The dissociation during
              deep breath-holds is structurally similar to what happens
              during trauma &mdash; the mind creating space between
              awareness and sensation. But in freediving, you&apos;re
              training this dissociation consciously and voluntarily, in a
              controlled environment. Through state anchoring, you build
              positive neural entrainment patterns that gradually override
              destructive ones. You&apos;re not just training to dive
              better. You&apos;re restructuring how your nervous system
              responds to stress.
            </p>
          </Fade>
        </div>
      </section>

      {/* ── HOW WE TEACH ── */}
      <section className="bg-ocean py-20 md:py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={grain} />
        <div className="max-w-[680px] mx-auto relative z-10">
          <Fade>
            <div className="section-label text-seafoam before:bg-seafoam">
              Implications
            </div>
            <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] text-white leading-[1.15] tracking-tight mb-8">
              What this means for how we teach
            </h2>
          </Fade>

          <Fade delay={40}>
            <div className="space-y-4 mb-12">
              {[
                "Pre-course module on state anchoring sent two weeks before arrival",
                "Structured guided sessions for anchor discovery during certification",
                "Post-course practice framework students continue developing for life",
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex gap-4 items-start bg-white/[0.04] border border-white/[0.06] rounded-xl p-5"
                >
                  <div className="w-7 h-7 rounded-full bg-seafoam/20 text-seafoam flex items-center justify-center text-sm font-semibold shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-white/60 text-[0.95rem] leading-relaxed">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </Fade>
        </div>

        <div className="max-w-[900px] mx-auto relative z-10">
          <PullQuote>
            Freediving isn&apos;t an extreme sport. It&apos;s a
            consciousness conditioning practice that happens to take place
            in the ocean.
          </PullQuote>
        </div>
      </section>

      {/* ── START HERE ── */}
      <section className="bg-salt py-20 md:py-28 px-6 relative">
        <div className="absolute inset-0 opacity-[0.02]" style={grain} />
        <div className="max-w-[680px] mx-auto relative z-10">
          <Fade>
            <div className="section-label">Start here</div>
            <h2 className="section-title">Find your anchor</h2>
          </Fade>

          <Fade delay={40}>
            <p className="text-[1.05rem] leading-[1.85] text-[#2a2a2a] mb-7">
              Something auditory, visual, or somatic that personally
              resonates. Give yourself five to ten minutes a day, at a
              consistent time, for at least a week. Track what you notice
              &mdash; in the water and in your daily life. Share what you
              find with your dive partner, your instructor, your community.
            </p>
          </Fade>

          <Fade delay={60}>
            <p className="text-[1.05rem] leading-[1.85] text-[#2a2a2a] mb-10">
              The most powerful thing about this practice is that it honors
              individual differences. What works for me won&apos;t work for
              you. The anaconda that puts one diver into an altered state
              means nothing to someone else. The mantra that carried me
              through monastery sits and through breath-holds at the canyon
              rim is just a sound to anyone who hasn&apos;t lived inside
              it. That&apos;s the point. The anchor has to be yours.
            </p>
          </Fade>

          <Fade delay={80}>
            <p className="text-[1.05rem] leading-[1.85] text-[#2a2a2a]">
              But the method &mdash; the systematic conditioning, the daily
              practice, the neuroplastic pathway from cue to state &mdash;
              that&apos;s universal. And it&apos;s been universal for a
              very long time. Long before anyone called it freediving.
            </p>
          </Fade>
        </div>
      </section>

      {/* ── FOOTER NOTE + CTA ── */}
      <section className="bg-white py-16 md:py-20 px-6">
        <div className="max-w-[680px] mx-auto">
          <Fade>
            <div className="border-t border-deep/10 pt-10 mb-12">
              <p className="text-sm text-[#5a6a7a] leading-relaxed italic">
                This post is adapted from &ldquo;State Anchors: Cognitive
                Tools for Holistic Apnea Training,&rdquo; a presentation
                given during my AIDA Instructor Course in Dahab, Egypt,
                with my first teacher Stella Abbas and my instructor
                trainer Khaled El Gammal both in the room. The 40-page
                research paper behind it is available on request.
              </p>
              <p className="text-sm text-[#5a6a7a] leading-relaxed mt-4">
                <strong className="text-deep font-semibold">
                  Joshua Beneventi
                </strong>{" "}
                is the founder of La Jolla Freedive Club and San
                Diego&apos;s only AIDA-certified freediving instructor for
                adults and children. He is an AIDA 4 Freediver, UCSD
                alumnus, and spent six months living in Theravada Buddhist
                monasteries in Thailand before finding freediving. He
                teaches every Saturday at La Jolla Shores.
              </p>
            </div>
          </Fade>

          <Fade delay={60}>
            <div className="bg-gradient-to-br from-ocean to-teal rounded-2xl p-10 text-center">
              <h3 className="font-serif text-2xl text-white mb-3">
                Ready to go deeper?
              </h3>
              <p className="text-white/60 text-sm mb-6 leading-relaxed">
                Join the LJFC community for courses, dive schedules, and
                consciousness conditioning workshops.
              </p>
              <Link
                href="/contact"
                className="inline-flex px-8 py-3 bg-coral text-white rounded-full font-semibold no-underline hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(232,115,74,0.4)] transition-all"
              >
                Get on the List &rarr;
              </Link>
            </div>
          </Fade>
        </div>
      </section>
    </>
  );
}
