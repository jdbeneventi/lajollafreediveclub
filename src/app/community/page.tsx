import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { EmailCapture } from "@/components/EmailCapture";
import {
  getPublicPartners,
  getAllGuestModules,
} from "@/lib/partner-network";

export const metadata: Metadata = {
  title: "Community — La Jolla Freedive Club",
  description:
    "The partners, researchers, educators, and organizations behind La Jolla Freedive Club. Science, safety, conservation, and ocean community in La Jolla, San Diego.",
  openGraph: {
    title: "Community — La Jolla Freedive Club",
    description:
      "The partners, researchers, educators, and organizations behind La Jolla Freedive Club.",
    url: "https://lajollafreediveclub.com/community",
  },
};

const dataSources = [
  { name: "NDBC 46254", detail: "Scripps Nearshore Buoy — wave height, period, water temp" },
  { name: "LJPC1", detail: "Scripps Pier — wind speed, direction, gusts" },
  { name: "NOAA 9410230", detail: "La Jolla tide predictions" },
  { name: "Scripps Cam", detail: "Underwater camera — AI visibility analysis" },
  { name: "NWS PZZ740", detail: "Marine forecast — inner coastal zone" },
  { name: "sdbeachinfo", detail: "Beach water quality monitoring" },
];

export default function CommunityPage() {
  const publicPartners = getPublicPartners();
  const guestModules = getAllGuestModules();

  const science = publicPartners.filter((p) => p.category === "science");
  const government = publicPartners.filter((p) => p.category === "government");
  const conservation = publicPartners.filter((p) => p.category === "conservation");

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-deep to-ocean pt-36 pb-24 px-6 text-center">
        <Reveal>
          <div className="section-label text-seafoam before:bg-seafoam justify-center">
            Community
          </div>
          <h1 className="font-serif text-[clamp(2.5rem,5vw,4rem)] text-white font-normal leading-tight tracking-tight mb-6">
            It takes a village to raise a diver
          </h1>
          <p className="text-lg text-white/60 max-w-[640px] mx-auto leading-relaxed">
            Freediving doesn&apos;t happen in isolation. Behind every dive is a network
            of researchers, educators, lifeguards, and conservationists who make
            La Jolla one of the best places in the world to go underwater.
          </p>
        </Reveal>
      </section>

      {/* Video strip */}
      <div className="bg-deep">
        <div className="max-w-[1200px] mx-auto">
          <video autoPlay muted loop playsInline className="w-full h-[200px] md:h-[300px] object-cover">
            <source src="/videos/large-group.mp4" type="video/mp4" />
          </video>
        </div>
      </div>

      {/* Science & Research */}
      <section className="bg-salt py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="section-label">Science &amp; Research</div>
            <h2 className="font-serif text-[clamp(1.8rem,3.5vw,2.5rem)] text-deep font-normal leading-tight tracking-tight mb-4">
              Built on real data
            </h2>
            <p className="text-[#5a6a7a] max-w-[600px] mb-12 leading-relaxed">
              Our conditions tools, species guides, and educational programs are
              informed by the world-class research institutions in our backyard.
            </p>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-6">
            {science.map((p) => (
              <Reveal key={p.id}>
                <div className="bg-white border border-deep/10 rounded-xl p-6 hover:border-teal/30 transition-colors h-full">
                  <h3 className="font-serif text-xl text-deep mb-2">
                    {p.name}
                  </h3>
                  {p.publicDescription && (
                    <p className="text-[#5a6a7a] text-sm leading-relaxed mb-4">
                      {p.publicDescription}
                    </p>
                  )}
                  {p.partnerPageUrl && (
                    <Link
                      href={p.partnerPageUrl}
                      className="text-teal text-sm no-underline hover:underline"
                    >
                      Learn more &rarr;
                    </Link>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Ocean Safety */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="section-label">Ocean Safety</div>
            <h2 className="font-serif text-[clamp(1.8rem,3.5vw,2.5rem)] text-deep font-normal leading-tight tracking-tight mb-4">
              Safety is the foundation
            </h2>
            <p className="text-[#5a6a7a] max-w-[600px] mb-12 leading-relaxed">
              We coordinate with San Diego&apos;s lifeguard services and city
              agencies to ensure every session operates with proper safety
              protocols and beach awareness.
            </p>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-6">
            {government.map((p) => (
              <Reveal key={p.id}>
                <div className="bg-salt border border-deep/10 rounded-xl p-6 hover:border-teal/30 transition-colors h-full">
                  <h3 className="font-serif text-xl text-deep mb-2">
                    {p.name}
                  </h3>
                  {p.publicDescription && (
                    <p className="text-[#5a6a7a] text-sm leading-relaxed mb-4">
                      {p.publicDescription}
                    </p>
                  )}
                  {p.partnerPageUrl && (
                    <Link
                      href={p.partnerPageUrl}
                      className="text-teal text-sm no-underline hover:underline"
                    >
                      Learn more &rarr;
                    </Link>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Conservation */}
      <section className="bg-salt py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="section-label">Conservation</div>
            <h2 className="font-serif text-[clamp(1.8rem,3.5vw,2.5rem)] text-deep font-normal leading-tight tracking-tight mb-4">
              Protecting what we dive
            </h2>
            <p className="text-[#5a6a7a] max-w-[600px] mb-12 leading-relaxed">
              Freediving creates a direct, personal connection to the ocean.
              We partner with conservation organizations to turn that connection
              into action.
            </p>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-6">
            {conservation.map((p) => (
              <Reveal key={p.id}>
                <div className="bg-white border border-deep/10 rounded-xl p-6 hover:border-teal/30 transition-colors h-full">
                  <h3 className="font-serif text-xl text-deep mb-2">
                    {p.name}
                  </h3>
                  {p.publicDescription && (
                    <p className="text-[#5a6a7a] text-sm leading-relaxed mb-4">
                      {p.publicDescription}
                    </p>
                  )}
                  {p.partnerPageUrl && (
                    <Link
                      href={p.partnerPageUrl}
                      className="text-teal text-sm no-underline hover:underline"
                    >
                      Learn more &rarr;
                    </Link>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Guest Educators */}
      <section className="bg-deep py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="section-label text-seafoam before:bg-seafoam">
              Guest Educators
            </div>
            <h2 className="font-serif text-[clamp(1.8rem,3.5vw,2.5rem)] text-white font-normal leading-tight tracking-tight mb-4">
              Learn from the experts
            </h2>
            <p className="text-white/50 max-w-[600px] mb-12 leading-relaxed">
              Our guest educator program brings researchers, rescue teams, and
              ocean professionals into Camp Garibaldi and community workshops.
            </p>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {guestModules.map((m, i) => (
              <Reveal key={i} delay={i * 50}>
                <div className="bg-white/[0.04] border border-white/10 rounded-xl p-5 hover:border-seafoam/30 transition-colors h-full flex flex-col">
                  <div className="text-[11px] text-teal/60 font-medium tracking-[0.15em] uppercase mb-2">
                    {m.partner}
                  </div>
                  <h3 className="font-serif text-lg text-white mb-2 leading-snug">
                    {m.title}
                  </h3>
                  <p className="text-white/40 text-sm leading-relaxed mb-4 flex-1">
                    {m.description}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-white/30">
                    <span>{m.duration}</span>
                    {m.ngss && m.ngss.length > 0 && (
                      <span className="bg-teal/20 text-teal px-2 py-0.5 rounded-full">
                        NGSS {m.ngss.join(", ")}
                      </span>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Data Sources */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="section-label">Data Sources</div>
            <h2 className="font-serif text-[clamp(1.8rem,3.5vw,2.5rem)] text-deep font-normal leading-tight tracking-tight mb-4">
              Real-time ocean intelligence
            </h2>
            <p className="text-[#5a6a7a] max-w-[600px] mb-12 leading-relaxed">
              Our{" "}
              <Link href="/conditions" className="text-teal no-underline hover:underline">
                conditions dashboard
              </Link>{" "}
              pulls from six real-time data sources to give you the most
              accurate picture of what&apos;s happening in the water.
            </p>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {dataSources.map((ds, i) => (
              <Reveal key={i} delay={i * 40}>
                <div className="bg-salt border border-deep/10 rounded-lg p-5">
                  <div className="font-mono text-sm text-teal font-medium mb-1">
                    {ds.name}
                  </div>
                  <p className="text-[#5a6a7a] text-sm leading-relaxed">
                    {ds.detail}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Community */}
      <section className="bg-salt py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="section-label">Network</div>
            <h2 className="font-serif text-[clamp(1.8rem,3.5vw,2.5rem)] text-deep font-normal leading-tight tracking-tight mb-4">
              A growing network
            </h2>
            <p className="text-[#5a6a7a] max-w-[600px] mb-8 leading-relaxed">
              Beyond our featured partners, we work with local schools, UCSD,
              dive shops, surf schools, military recreation programs, and
              community organizations across San Diego to make freediving
              accessible to everyone.
            </p>
          </Reveal>
          <Reveal>
            <div className="flex flex-wrap gap-3">
              {[
                "Local Schools",
                "UC San Diego",
                "Dive Shops",
                "Surf Schools",
                "Military MWR",
                "Homeschool Co-ops",
                "Hotels & Tourism",
                "Local Media",
              ].map((tag) => (
                <span
                  key={tag}
                  className="bg-white border border-deep/10 text-deep/60 text-sm px-4 py-2 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Get Involved CTA */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <Reveal>
            <div className="section-label justify-center">Get Involved</div>
            <h2 className="font-serif text-[clamp(1.8rem,3.5vw,2.5rem)] text-deep font-normal leading-tight tracking-tight mb-4">
              Partner with us
            </h2>
            <p className="text-[#5a6a7a] max-w-[560px] mx-auto mb-8 leading-relaxed">
              Are you a researcher, educator, conservation organization, or
              business that shares our commitment to the ocean? We&apos;d love to
              explore how we can work together.
            </p>
            <a
              href="mailto:joshuabeneventi@gmail.com?subject=LJFC%20Partnership%20Inquiry"
              className="inline-block bg-coral text-white px-8 py-4 rounded-full font-medium text-[0.95rem] no-underline hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(199,91,58,0.4)] transition-all"
            >
              Get in touch &rarr;
            </a>
          </Reveal>
        </div>
      </section>

      <EmailCapture />
    </>
  );
}
