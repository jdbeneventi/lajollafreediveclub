import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { EmailCapture } from "@/components/EmailCapture";

export const metadata: Metadata = {
  title: "About — Our Story",
  description:
    "The story behind La Jolla Freedive Club. Why we started, what we believe, and how we're building San Diego's freediving community.",
};

const faqs = [
  {
    q: "Do I need experience to join?",
    a: "Not at all. About 70% of our members had zero freediving experience when they started. Our Discover Freediving session is designed specifically for complete beginners.",
  },
  {
    q: "Is freediving safe?",
    a: "When done with proper training and a buddy, freediving has an excellent safety record. The primary risk — shallow water blackout — is almost entirely preventable with correct protocols. Every program we run emphasizes safety as the foundation.",
  },
  {
    q: "Do I need to be a strong swimmer?",
    a: "You should be a comfortable swimmer who can tread water and swim 200m without stopping. You don't need to be a competitive swimmer — relaxation matters more than speed in freediving.",
  },
  {
    q: "What certification do you offer?",
    a: "We offer AIDA (Association Internationale pour le Développement de l'Apnée) certifications, which are the most widely recognized freediving credentials worldwide. Our standard course is the AIDA 2 Star.",
  },
  {
    q: "Do I need my own gear?",
    a: "Not for courses or intro experiences — all gear is included. For ongoing group sessions, you'll want your own mask, fins, wetsuit, and weight belt. We can help you choose the right setup for your level and budget.",
  },
  {
    q: "How deep will I dive?",
    a: "In the AIDA 2 course, the target depth is 16–20 meters. In group sessions, we dive to whatever depth is appropriate for conditions and your comfort level — there's no pressure to go deep. Many of our members enjoy diving in the 10–15 meter range.",
  },
  {
    q: "What ages is Camp Garibaldi for?",
    a: "Camp Garibaldi is designed for kids ages 8–16. We group campers by age and ability level to ensure appropriate progression for everyone.",
  },
  {
    q: "Can I join group sessions without certification?",
    a: "Group ocean sessions require an AIDA 2 (or equivalent) certification for safety reasons. If you're not certified yet, our Discover Freediving or AIDA 2 course will get you there.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-b from-deep to-ocean pt-36 pb-20 px-6 text-center">
        <Reveal>
          <div className="section-label text-seafoam before:bg-seafoam justify-center">
            Our Story
          </div>
          <h1 className="font-serif text-[clamp(2.5rem,5vw,4rem)] text-white font-normal leading-tight tracking-tight mb-6">
            Built by divers,<br />for divers
          </h1>
          <p className="text-lg text-white/60 max-w-[560px] mx-auto leading-relaxed">
            How a love for the ocean and a belief in breath-first training became
            San Diego&apos;s freediving community.
          </p>
        </Reveal>
      </section>

      {/* Story */}
      <section className="bg-white py-24 px-6">
        <div className="max-w-[720px] mx-auto">
          <Reveal>
            <div className="prose">
              <h2>Why we started</h2>
              <p>
                La Jolla Freedive Club started from a simple frustration: San Diego has
                some of the best freediving conditions in California, but there was no
                real community around it. Plenty of people wanted to try freediving or
                needed dive buddies, but there was no central place to connect, train,
                and progress together.
              </p>
              <p>
                We wanted to build something different from a typical dive shop or
                certification mill. We wanted a club — a crew of ocean people who show
                up every week, push each other, keep each other safe, and make the ocean
                a regular part of their lives.
              </p>

              <h2>What we believe</h2>
              <p>
                Every program we run is built on a breath-first methodology. That means
                before anyone gets in the water, they learn to control their breathing,
                lower their heart rate, and find composure under pressure. It&apos;s the
                same approach whether you&apos;re a beginner doing your first pool session
                or a kid at Camp Garibaldi learning surf survival.
              </p>
              <p>
                This isn&apos;t wellness culture — it&apos;s athletic training. The same way a
                sprinter trains their start or a boxer trains their footwork, we train
                the foundational skill that every water activity depends on: the ability
                to stay calm and breathe efficiently.
              </p>
              <p>
                The result is divers who are confident, not just competent. People who
                can handle real ocean conditions because they&apos;ve built real internal
                capacity — not just logged hours in the water.
              </p>

              <h2>La Jolla: our backyard</h2>
              <p>
                We&apos;re based in La Jolla because the coastline here is uniquely perfect
                for freediving at every level. The La Jolla Ecological Reserve gives us
                protected waters with incredible marine life, the Cove provides easy
                access for beginners, and the Canyon offers world-class wall diving for
                experienced divers — all within a few hundred meters of each other.
              </p>
              <p>
                When people visit La Jolla, they see the sea lions and the pretty
                coastline. When we look at it, we see one of the best natural training
                grounds for freedivers anywhere on the West Coast.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="bg-salt py-24 px-6">
        <div className="max-w-[1000px] mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <div className="section-label justify-center">What Guides Us</div>
              <h2 className="section-title">Our principles</h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Safety is non-negotiable",
                desc: "Every session has safety divers. Every diver has a buddy. Every program teaches rescue skills. We don't cut corners on this, ever.",
              },
              {
                title: "Depth is earned, not rushed",
                desc: "We never pressure anyone to go deeper than they're ready for. Progression should feel natural, not forced. The depth will come.",
              },
              {
                title: "Community over competition",
                desc: "We celebrate personal bests, not rankings. The goal is to build each other up — whether that's your first 10-meter dive or your hundredth.",
              },
            ].map((v, i) => (
              <Reveal key={v.title} delay={i * 80}>
                <div className="bg-white p-8 rounded-2xl h-full">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal to-seafoam flex items-center justify-center text-white font-bold text-sm mb-6">
                    {i + 1}
                  </div>
                  <h3 className="font-serif text-xl mb-3">{v.title}</h3>
                  <p className="text-sm text-[#5a6a7a] leading-relaxed">{v.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-white py-24 px-6 scroll-mt-20">
        <div className="max-w-[720px] mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <div className="section-label justify-center">FAQ</div>
              <h2 className="section-title">Common questions</h2>
            </div>
          </Reveal>

          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <Reveal key={i} delay={i * 40}>
                <div className="border-b border-deep/[0.06] pb-6">
                  <h3 className="font-semibold text-[1.02rem] mb-3">{faq.q}</h3>
                  <p className="text-sm text-[#5a6a7a] leading-relaxed">{faq.a}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <EmailCapture />
    </>
  );
}
