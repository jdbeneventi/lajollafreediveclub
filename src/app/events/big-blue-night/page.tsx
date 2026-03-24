import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { EmailCapture } from "@/components/EmailCapture";

const grain = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
};

export default function BigBlueNightPage() {
  return (
    <>
      {/* ── HERO ── */}
      <section className="relative min-h-[90vh] flex items-end overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/group-freedive.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-deep via-deep/70 to-deep/30" />
        <div className="absolute inset-0 bg-deep/20" />
        <div className="absolute inset-0 opacity-[0.04]" style={grain} />

        <div className="relative z-10 w-full px-6 md:px-12 pb-16 md:pb-24 max-w-[1200px] mx-auto">
          <Reveal>
            <span className="inline-block px-4 py-1.5 bg-seafoam/15 border border-seafoam/25 rounded-full text-seafoam text-[11px] font-medium tracking-[0.15em] uppercase mb-6">
              Free Event
            </span>
            <h1 className="font-serif text-[clamp(3rem,8vw,5.5rem)] text-white font-normal leading-[1] tracking-tight max-w-[700px]">
              <em className="italic text-seafoam">&ldquo;The Big Blue&rdquo;</em>
            </h1>
            <p className="text-white/60 text-xl md:text-2xl mt-3 max-w-[520px] leading-snug font-light">
              Movie night at the beach.
            </p>
            <p className="text-white/35 text-sm mt-5 tracking-wide">
              Late April 2026 &middot; Kellogg Park &middot; La Jolla Shores
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── THE FILM ── */}
      <section className="bg-deep py-20 md:py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={grain} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(27,107,107,0.12)_0%,transparent_50%)]" />

        <div className="max-w-[960px] mx-auto relative z-10">
          <Reveal>
            <div className="grid md:grid-cols-[1.1fr_1fr] gap-10 md:gap-16 items-center">
              <div className="rounded-2xl overflow-hidden aspect-[16/10] shadow-2xl shadow-black/40">
                <img
                  src="/images/blog/big-blue-still.jpg"
                  alt="Still from The Big Blue (1988) by Luc Besson"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="text-[11px] text-seafoam/60 font-medium tracking-[0.2em] uppercase mb-4">
                  The Film
                </div>
                <h2 className="font-serif text-[clamp(1.6rem,3.5vw,2.4rem)] text-white tracking-tight leading-snug mb-5">
                  The film that made a generation want to freedive.
                </h2>
                <p className="text-white/50 text-[0.95rem] leading-relaxed mb-5">
                  Jacques Mayol. Enzo Molinari. The Mediterranean. Luc
                  Besson&apos;s 1988 meditation on depth, obsession, and the
                  pull of the ocean &mdash; a film that quietly reshaped what
                  people thought was possible on a single breath.
                </p>
                <Link
                  href="/blog/the-big-blue-freediving-cult-classic"
                  className="text-seafoam text-sm font-medium no-underline hover:text-white transition-colors"
                >
                  Read the full story &rarr;
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── THE EVENING ── */}
      <section className="bg-ocean py-20 md:py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={grain} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(61,184,164,0.08)_0%,transparent_45%)]" />

        <div className="max-w-[700px] mx-auto relative z-10">
          <Reveal>
            <div className="text-[11px] text-seafoam/60 font-medium tracking-[0.2em] uppercase mb-4">
              The Evening
            </div>
            <h2 className="font-serif text-[clamp(1.8rem,4vw,2.6rem)] text-white tracking-tight leading-snug mb-14">
              Sunset to credits.
            </h2>
          </Reveal>

          <div className="space-y-0">
            {/* Timeline: Arrive */}
            <Reveal>
              <div className="grid grid-cols-[80px_1fr] md:grid-cols-[120px_1fr] gap-4 md:gap-6 pb-10 border-l border-white/[0.08] ml-2 pl-6 relative">
                <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-sand/60" />
                <div className="text-sand/70 text-sm font-medium pt-0.5">Sunset</div>
                <div>
                  <h3 className="text-white font-medium text-[1.02rem] mb-1">
                    Arrive
                  </h3>
                  <p className="text-white/40 text-sm leading-relaxed">
                    Blankets, good company, and the last light over La Jolla
                    Shores. Claim your spot at Kellogg Park.
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Timeline: Ocean Flow */}
            <Reveal delay={40}>
              <div className="grid grid-cols-[80px_1fr] md:grid-cols-[120px_1fr] gap-4 md:gap-6 pb-10 border-l border-white/[0.08] ml-2 pl-6 relative">
                <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-seafoam/60" />
                <div className="text-seafoam/70 text-sm font-medium pt-0.5">~6:30 PM</div>
                <div>
                  <h3 className="text-white font-medium text-[1.02rem] mb-1">
                    Ocean Flow
                  </h3>
                  <p className="text-white/40 text-sm leading-relaxed">
                    Sunset session on the beach. Stretching and breathing
                    exercises as the sun drops into the Pacific.
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Timeline: ORIGIN Protocol */}
            <Reveal delay={80}>
              <div className="grid grid-cols-[80px_1fr] md:grid-cols-[120px_1fr] gap-4 md:gap-6 pb-10 border-l border-white/[0.08] ml-2 pl-6 relative">
                <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-teal/80" />
                <div className="text-teal/70 text-sm font-medium pt-0.5">~7:00 PM</div>
                <div>
                  <h3 className="text-white font-medium text-[1.02rem] mb-1">
                    ORIGIN Protocol
                  </h3>
                  <p className="text-white/40 text-sm leading-relaxed">
                    Dry training as the light fades. Controlled breath holds and
                    state work on the sand.
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Timeline: Film */}
            <Reveal delay={120}>
              <div className="grid grid-cols-[80px_1fr] md:grid-cols-[120px_1fr] gap-4 md:gap-6 ml-2 pl-6 relative">
                <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-coral/80" />
                <div className="text-coral/70 text-sm font-medium pt-0.5">~8:00 PM</div>
                <div>
                  <h3 className="text-white font-medium text-[1.02rem] mb-1">
                    The Big Blue
                  </h3>
                  <p className="text-white/40 text-sm leading-relaxed">
                    Projector and screen on the beach. The film starts when the
                    sky goes dark.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* What to bring */}
          <Reveal delay={160}>
            <div className="mt-14 pt-8 border-t border-white/[0.06]">
              <div className="text-[11px] text-sand/50 font-medium tracking-[0.15em] uppercase mb-4">
                What to Bring
              </div>
              <div className="flex flex-wrap gap-3">
                {["Blanket", "Layers", "Snacks", "Friends"].map((item) => (
                  <span
                    key={item}
                    className="px-4 py-2 bg-white/[0.05] border border-white/[0.08] rounded-full text-white/50 text-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <p className="text-white/30 text-xs mt-4">
                We&apos;ll have the screen and sound. You bring the vibe.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── RSVP / EMAIL CAPTURE ── */}
      <EmailCapture
        headline={
          <>
            Save your{" "}
            <em className="italic text-seafoam">spot</em>
          </>
        }
        subtext="You're on the list. We'll send details as the date gets closer."
      />

      {/* ── COMMUNITY CALLOUT ── */}
      <section className="bg-deep py-20 md:py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={grain} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(61,184,164,0.06)_0%,transparent_50%)]" />

        <div className="max-w-[640px] mx-auto relative z-10 text-center">
          <Reveal>
            <div className="text-[11px] text-seafoam/50 font-medium tracking-[0.2em] uppercase mb-5">
              Inaugural Community Event
            </div>
            <p className="font-serif text-[clamp(1.3rem,3vw,1.8rem)] text-white/80 leading-relaxed tracking-tight italic">
              &ldquo;This is the inaugural La Jolla Freedive Club community
              event. Whether you&apos;ve been diving with us since day one or
              you&apos;ve never held your breath underwater &mdash; this night
              is for you.&rdquo;
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER LINKS ── */}
      <section className="bg-ocean py-14 md:py-18 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={grain} />
        <div className="max-w-[700px] mx-auto relative z-10">
          <Reveal>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
              <Link
                href="/saturday-sessions"
                className="text-white/50 text-sm font-medium no-underline hover:text-seafoam transition-colors"
              >
                Saturday Sessions &rarr;
              </Link>
              <Link
                href="/programs"
                className="text-white/50 text-sm font-medium no-underline hover:text-seafoam transition-colors"
              >
                Programs &rarr;
              </Link>
              <Link
                href="/blog/the-big-blue-freediving-cult-classic"
                className="text-white/50 text-sm font-medium no-underline hover:text-seafoam transition-colors"
              >
                Read: The Big Blue &rarr;
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
