import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { EmailCapture } from "@/components/EmailCapture";

export const metadata: Metadata = {
  title: "About — La Jolla Freedive Club",
  description:
    "The story behind La Jolla Freedive Club. Founded by Joshua Beneventi, AIDA-certified instructor trained in Malaysia, Egypt, and Mexico. San Diego's only AIDA-certified freediving instructor for adults and kids.",
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
    a: "We offer AIDA (Association Internationale pour le Développement de l'Apnée) certifications — the most widely recognized freediving credentials worldwide. Our standard course is the AIDA 2, with AIDA 1 and AIDA 3 also available.",
  },
  {
    q: "Do I need my own gear?",
    a: "Not for courses or intro experiences — all gear is included. For ongoing group sessions, you'll want your own mask, fins, wetsuit, and weight belt. We can help you choose the right setup.",
  },
  {
    q: "How deep will I dive?",
    a: "In the AIDA 2 course, the target depth is 16–20 meters (52–65 ft). In group sessions, we dive to whatever depth is appropriate for conditions and your comfort level. Many members enjoy the 10–15 meter range.",
  },
  {
    q: "What ages is Camp Garibaldi for?",
    a: "Camp Garibaldi is designed for kids ages 8–16. We group campers by age and ability level to ensure appropriate progression.",
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
          <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-8 border-2 border-white/20">
            <img src="/images/photos/joshua-red-sea.jpg" alt="Joshua Beneventi floating in the Red Sea" className="w-full h-full object-cover object-top" />
          </div>
          <div className="section-label text-seafoam before:bg-seafoam justify-center">
            About
          </div>
          <h1 className="font-serif text-[clamp(2.5rem,5vw,4rem)] text-white font-normal leading-tight tracking-tight mb-6">
            The long way to<br />the water
          </h1>
          <p className="text-lg text-white/60 max-w-[560px] mx-auto leading-relaxed">
            From Point Loma to a Thai monastery to the Blue Hole in Egypt —
            and back to where it started.
          </p>
        </Reveal>
      </section>

      {/* Joshua's Story */}
      <section className="bg-white py-24 px-6">
        <div className="max-w-[720px] mx-auto">
          <Reveal>
            <div className="space-y-6 text-[0.95rem] text-[#2a2a2a] leading-relaxed">
              <h2 className="font-serif text-2xl text-deep">Growing up four blocks from the ocean</h2>

              <p>
                I grew up in Point Loma and Ocean Beach — four blocks from the water. As a kid,
                I spent most of my time at Sunset Cliffs. In high school, I started spearfishing
                off Point Loma with friends. Eventually I picked up a longboard and learned to surf.
              </p>

              <p>
                The ocean was always the place I went to process things. Not in a poetic,
                Instagram-caption kind of way — it was just where I went when I needed to think,
                or when I didn&apos;t want to think at all.
              </p>

              <h2 className="font-serif text-2xl text-deep pt-6">The detour</h2>

              <p>
                After San Diego, life took me in a few unexpected directions. I lived in
                Portugal, got my real estate license in Arizona, then went back to Portugal
                before entering a Thai forest monastery — Sumedharama in Ericeira — where
                I stayed for about four months. From there, Thailand.
              </p>

              <p>
                At some point in the monasteries, I realized it was time to leave. And for
                the first time in my life, I had absolutely nothing on my calendar. So I asked
                myself a question I&apos;d never really given myself permission to ask:
                <em> What are the things I&apos;ve always wanted to do but never made time for?</em>
              </p>

              <p>
                One of those things was freediving.
              </p>

              <h2 className="font-serif text-2xl text-deep pt-6">The training</h2>

              <p>
                I flew to Tioman Island in Malaysia and took my first freediving course at
                Freedive Tioman. My coach was Stella Abbas — the Malaysian national record
                holder. I stayed for a month, mostly wrestling with equalization (like everyone).
                At some point, Stella told me something that changed the trajectory:
                &ldquo;I think this sport is for you. You should pursue it further.&rdquo;
              </p>

              <p>
                I asked her where to go next. She said Dahab, Egypt — the Mecca of freediving.
                So I went.
              </p>

              <div className="my-8 rounded-xl overflow-hidden">
                <img src="/images/photos/joshua-stella.png" alt="Joshua with Stella Abbas at Freedive Tioman" className="w-full h-auto" />
                <p className="text-[10px] text-[#5a6a7a] mt-2 italic">With Stella Abbas, Malaysian national record holder, at Freedive Tioman</p>
              </div>

              <p>
                In Dahab, I completed my AIDA 3 certification with Pieter Van Veen, a Dutch instructor
                based in the Dahab scene. I trained at the Lighthouse,
                dove the Blue Hole, and got immersed in one of the most concentrated freediving
                communities in the world. Then I came back to the States and trained with
                Harry Chamas at Freedive Passion in La Ventana, Baja California — one of the
                top coaching facilities in Mexico.
              </p>

              <p>
                In 2025, I returned to Dahab for three months. I completed my AIDA 4 and
                then my AIDA Instructor certification under Khaled El Gammal — Egypt&apos;s
                deepest freediver, the first Egyptian to reach 100 meters on a single breath,
                and a 13-time national record holder. Training under Khaled at the Lighthouse,
                the Blue Hole, and across the Dahab scene gave me not just the technical
                qualifications but a depth of experience I couldn&apos;t have gotten anywhere else.
              </p>

              <div className="my-8 grid grid-cols-2 gap-4">
                <div className="rounded-xl overflow-hidden">
                  <img src="/images/photos/joshua-khaled.jpg" alt="Joshua with Khaled El Gammal in Dahab" className="w-full h-auto" />
                  <p className="text-[10px] text-[#5a6a7a] mt-2 italic">With Khaled El Gammal, Dahab</p>
                </div>
                <div className="rounded-xl overflow-hidden">
                  <img src="/images/photos/joshua-khaled-hannah.jpg" alt="Joshua with Khaled and Hannah after a training session" className="w-full h-auto" />
                  <p className="text-[10px] text-[#5a6a7a] mt-2 italic">Post-dive at the Lighthouse, Dahab</p>
                </div>
              </div>

              <h2 className="font-serif text-2xl text-deep pt-6">Back to San Diego</h2>

              <p>
                I came home in September 2025 and put my line in the water at La Jolla Shores.
                I&apos;m now the only AIDA-certified freediving instructor in San Diego —
                for both adults and kids.
              </p>

              <p>
                La Jolla Freedive Club is the thing I wish had existed when I was growing up
                here. A crew. A training structure. Access to the ocean with people who
                take it seriously but don&apos;t take themselves too seriously. A place where a
                12-year-old learning to hold their breath and a 40-year-old working on
                equalization are both welcome and both challenged.
              </p>

              <div className="my-8 grid grid-cols-2 gap-4">
                <div className="rounded-xl overflow-hidden">
                  <img src="/images/photos/joshua-teaching-kids.jpg" alt="Joshua teaching two kids poolside" className="w-full h-auto" />
                  <p className="text-[10px] text-[#5a6a7a] mt-2 italic">Poolside breathing drills with young students</p>
                </div>
                <div className="rounded-xl overflow-hidden">
                  <img src="/images/photos/joshua-kid-beach.jpg" alt="Joshua with a young student at Mission Bay" className="w-full h-auto" />
                  <p className="text-[10px] text-[#5a6a7a] mt-2 italic">Post-session at Mission Bay</p>
                </div>
              </div>

              <h2 className="font-serif text-2xl text-deep pt-6">The philosophy</h2>

              <p>
                I see freediving as an embodied practice — not just a sport. When you hold
                your breath and descend into dark water, you&apos;re working with surrender,
                with fear, with the unknown. You&apos;re confronting your own nervous system
                and learning to find calm inside discomfort. That&apos;s not just a diving skill.
                That&apos;s a life skill.
              </p>

              <p>
                That said, I don&apos;t run LJFC as a meditation retreat. We train like athletes.
                Breathing drills, CO2 tables, equalization work, safety protocols,
                progressive depth exposure. The science is rigorous. The methodology is
                structured. But underneath all of it is a simple belief: when you learn to
                control your breath, everything else follows.
              </p>

              <p>
                That&apos;s what we mean by &ldquo;the ocean camp that starts from the inside out.&rdquo;
              </p>

              <p className="text-xs text-[#5a6a7a] pt-4">
                For a deeper exploration of this philosophy, read{" "}
                <a href="https://joshuabeneventi.substack.com/p/the-depths-of-thought-freediving" target="_blank" rel="noopener noreferrer" className="text-teal no-underline hover:underline">
                  The Depths of Thought: Freediving, Forms, and the Return to Origin
                </a>
                {" "}— written during my instructor training in Dahab.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Credentials */}
      <section className="bg-salt py-24 px-6">
        <div className="max-w-[900px] mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <div className="section-label justify-center">Credentials</div>
              <h2 className="section-title">Training lineage</h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "AIDA Instructor",
                detail: "Certified to teach AIDA 1 through AIDA 4, pool and open water, adults and kids.",
              },
              {
                title: "AIDA 4 Freediver",
                detail: "Advanced freediver certification. Deep constant weight, free immersion, and safety protocols.",
              },
              {
                title: "Trained under Khaled El Gammal",
                detail: "Egypt's deepest freediver (100m+), 13x national record holder, AIDA Instructor Trainer. Dahab, Egypt.",
              },
              {
                title: "Trained under Stella Abbas",
                detail: "Malaysian national record holder (60m CWTB), founder of Freedive Tioman. Tioman Island, Malaysia.",
              },
              {
                title: "Trained with Harry Chamas",
                detail: "One of the world's leading freediving coaches. Freedive Passion, La Ventana, Baja California.",
              },
              {
                title: "San Diego's only AIDA instructor",
                detail: "The only AIDA-certified freediving instructor in San Diego County, for both adults and youth programs.",
              },
            ].map((cred, i) => (
              <Reveal key={cred.title} delay={i * 60}>
                <div className="bg-white p-6 rounded-xl">
                  <h3 className="text-sm font-semibold text-deep mb-1">{cred.title}</h3>
                  <p className="text-xs text-[#5a6a7a] leading-relaxed">{cred.detail}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="bg-white py-24 px-6">
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
                <div className="bg-salt p-8 rounded-2xl h-full">
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

      {/* CTA */}
      <section className="bg-deep py-20 px-6 text-center">
        <Reveal>
          <div className="max-w-[500px] mx-auto">
            <h2 className="font-serif text-3xl text-white mb-4">
              Ready to start?
            </h2>
            <p className="text-white/50 text-sm mb-8 leading-relaxed">
              Whether you&apos;re ocean-curious or already comfortable in the water,
              there&apos;s a place for you here.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/contact/courses"
                className="inline-flex px-8 py-3 bg-coral text-white rounded-full font-semibold no-underline hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(199,91,58,0.4)] transition-all"
              >
                Inquire about a course →
              </Link>
              <Link
                href="/conditions"
                className="inline-flex px-8 py-3 border border-white/20 text-white rounded-full font-semibold no-underline hover:bg-white/5 transition-all"
              >
                Check conditions
              </Link>
            </div>
          </div>
        </Reveal>
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
