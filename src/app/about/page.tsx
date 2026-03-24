import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { EmailCapture } from "@/components/EmailCapture";

export const metadata: Metadata = {
  title: "About — La Jolla Freedive Club",
  description:
    "The story behind La Jolla Freedive Club. Founded by Joshua Beneventi, AIDA-certified instructor and youth instructor trained in Malaysia, Egypt, and Mexico. San Diego's only AIDA-certified freediving instructor for adults and kids.",
};

const faqs = [
  {
    q: "Do I need experience to join?",
    a: "Not at all. About 70% of our members had zero freediving experience when they started. Our AIDA 1 course is a one-day introduction designed specifically for complete beginners.",
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
    a: "Group ocean sessions require an AIDA 2 (or equivalent) certification for safety reasons. If you're not certified yet, our AIDA 1 or AIDA 2 course will get you started.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-b from-deep to-ocean pt-36 pb-20 px-6 text-center">
        <Reveal>
          <div className="w-36 h-36 rounded-full overflow-hidden mx-auto mb-8 border-2 border-white/20">
            <video autoPlay muted loop playsInline className="w-full h-full object-cover">
              <source src="/videos/joshua-blue-hole-monofin.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="section-label text-seafoam before:bg-seafoam justify-center">
            About
          </div>
          <h1 className="font-serif text-[clamp(2.5rem,5vw,4rem)] text-white font-normal leading-tight tracking-tight mb-6">
            The ocean is in my veins
          </h1>
          <p className="text-lg text-white/60 max-w-[560px] mx-auto leading-relaxed">
            From Azorean tuna fishermen to La Jolla&apos;s canyon — the story
            behind LJFC.
          </p>
        </Reveal>
      </section>

      {/* Story */}
      <section className="bg-white py-24 px-6">
        <div className="max-w-[720px] mx-auto space-y-6 text-[0.95rem] text-[#2a2a2a] leading-relaxed">
          <Reveal>
              <p className="text-xs text-[#5a6a7a] uppercase tracking-wider font-semibold">
                Joshua Beneventi · Founder &amp; Instructor ·{" "}
                <a href="https://www.aidainternational.org/InstructorProfile/858dbbd9-9e54-4235-abf8-e0a035ccd077" target="_blank" rel="noopener noreferrer" className="text-teal no-underline hover:underline">
                  AIDA Profile ↗
                </a>
              </p>

          </Reveal>
          <Reveal>
              <h2 className="font-serif text-2xl text-deep">Roots</h2>

              <p>
                My grandmother&apos;s family came to San Diego from Pico in the Azores.
                My great-grandfather worked whaling and on boats his whole life before
                settling here to fish tuna. My uncles, my grandfather — they all worked
                the tuna boats at some point. On the other side, my grandfather used to
                freedive for abalone right here in La Jolla and bodysurfed his whole life.
                The ocean wasn&apos;t something anyone in my family chose. It was just what we did.
              </p>

              <p>
                I grew up in Point Loma and Ocean Beach, four blocks from the water.
                Sunset Cliffs was where I went when I needed to feel something or stop
                feeling something. In high school I was spearfishing off Point Loma with
                friends. Eventually I picked up a longboard. The water was always there,
                pulling me back.
              </p>

              <p>
                The first freediving club in the United States was founded in La Jolla
                in 1939 — by people who probably weren&apos;t that different from the
                people in my family. Watermen. Fishermen. People who understood that the
                ocean gives you something you can&apos;t get on land. Almost a century later,
                La Jolla Freedive Club exists because that pull never went away.
              </p>

              <div className="my-8 rounded-xl overflow-hidden">
                <img src="/images/photos/scripps-underwater.jpg" alt="Underwater at Scripps" className="w-full h-auto" />
              </div>

          </Reveal>
          <Reveal>
              <h2 className="font-serif text-2xl text-deep pt-6">Finding freediving</h2>

              <p>
                In 2023, after years of traveling and a period living in a Thai forest
                monastery, I found myself with nothing on my calendar for the first time
                in my life. No plan, no obligations, no next thing. So I asked a question
                I&apos;d never given myself permission to ask: <em>what have I always
                wanted to do but never made time for?</em>
              </p>

              <p>Freediving.</p>

              <p>
                I flew to Tioman Island in Malaysia and took my first course at Freedive
                Tioman with Stella Abbas — the Malaysian national record holder. I stayed
                for a month, mostly wrestling with equalization, which humbled me completely.
                At some point Stella said something that changed everything: &ldquo;I think
                this sport is for you. You should pursue it further.&rdquo; I asked her
                where to go. She said Dahab — the Mecca of freediving. So I went.
              </p>

              <div className="my-8 rounded-xl overflow-hidden">
                <img src="/images/photos/joshua-stella.jpg" alt="Joshua with Stella Abbas at Freedive Tioman" className="w-full h-auto" />
                <p className="text-[10px] text-[#5a6a7a] mt-2 italic">With Stella Abbas at the Blue Hole, Dahab — reunited after Tioman</p>
              </div>

          </Reveal>
          <Reveal>
              <h2 className="font-serif text-2xl text-deep pt-2">Dahab</h2>

              <p>
                Dahab is a small town on the Red Sea coast of Egypt&apos;s Sinai Peninsula.
                It&apos;s where the world&apos;s best freedivers train, and it&apos;s where
                I fell completely in love with this sport. I completed my AIDA 3 with
                Pieter Van Veen, trained at the Lighthouse, dove the Blue Hole, and found
                a community of people who understood what I was only beginning to feel —
                that freediving isn&apos;t just an activity. It&apos;s a practice.
              </p>

              <div className="my-8 rounded-xl overflow-hidden">
                <video autoPlay muted loop playsInline className="w-full h-auto rounded-xl">
                  <source src="/videos/dahab-swimthrough.mp4" type="video/mp4" />
                </video>
                <p className="text-[10px] text-[#5a6a7a] mt-2 italic">Swimthrough training, Dahab</p>
              </div>

              <p>
                I came back to the States and trained with Harry Chamas at Freedive Passion
                in La Ventana, Baja California — one of the top coaching facilities in the
                world. Then, in 2025, I went back to Dahab for three months. I completed
                my AIDA 4 and earned my AIDA Instructor and Youth Instructor certifications
                under Khaled El Gammal — Egypt&apos;s deepest freediver, the first Egyptian
                to break 100 meters on a single breath, and a 13-time national record holder.
                Training under Khaled at the Lighthouse and the Blue Hole gave me something
                no textbook could — an understanding of what it means to hold space for
                someone at the edge of what they think they&apos;re capable of.
              </p>

              <div className="my-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl overflow-hidden">
                  <img src="/images/photos/joshua-khaled.jpg" alt="Joshua with Khaled El Gammal at the Lighthouse, Dahab" className="w-full h-auto" />
                  <p className="text-[10px] text-[#5a6a7a] mt-2 italic">With Khaled El Gammal at the Lighthouse, Dahab</p>
                </div>
                <div className="rounded-xl overflow-hidden">
                  <img src="/images/photos/joshua-khaled-hannah.jpg" alt="Joshua, Khaled, and Hannah at the Blue Hole, Dahab" className="w-full h-auto" />
                  <p className="text-[10px] text-[#5a6a7a] mt-2 italic">With Khaled and Hannah at the Blue Hole, Dahab</p>
                </div>
              </div>

          </Reveal>
          <Reveal>
              <h2 className="font-serif text-2xl text-deep pt-2">Back home</h2>

              <p>
                I came back to San Diego in September 2025 and put my line in the water
                at La Jolla Shores. I&apos;m now the only AIDA-certified freediving
                instructor in San Diego — for both adults and kids.
              </p>

              <div className="my-8 rounded-xl overflow-hidden">
                <video autoPlay muted loop playsInline className="w-full h-auto rounded-xl">
                  <source src="/videos/group-freedive.mp4" type="video/mp4" />
                </video>
                <p className="text-[10px] text-[#5a6a7a] mt-2 italic">Saturday group dive at La Jolla Canyon</p>
              </div>

              <p>
                La Jolla Freedive Club is the thing I wish had existed when I was growing
                up here. A crew. A training structure. A place where a kid learning to hold
                their breath and an adult working on equalization are both welcome and both
                pushed. Not a certification mill. A community.
              </p>

              <div className="my-8 rounded-xl overflow-hidden">
                <img src="/images/photos/ljfc-crew-lunch.jpg" alt="LJFC crew after a Saturday session" className="w-full h-auto" />
                <p className="text-[10px] text-[#5a6a7a] mt-2 italic">Post-session with the Saturday crew</p>
              </div>

              <p>
                One of the things I care most about is creating access to the ocean for
                young people. Too many kids grow up near the coast without ever developing
                a real relationship with the water. That&apos;s why Camp Garibaldi exists —
                to give kids the tools to be genuinely confident in the ocean, not just
                comfortable. Breath control, water safety, freediving fundamentals, all
                through a methodology that builds internal composure before external skills.
                Watching a kid go from nervous about waves to duck diving on their own is
                the best part of what I do.
              </p>

              <div className="my-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl overflow-hidden">
                  <img src="/images/photos/joshua-teaching-kids.jpg" alt="Joshua teaching two kids poolside" className="w-full h-auto" />
                  <p className="text-[10px] text-[#5a6a7a] mt-2 italic">Poolside breathing drills</p>
                </div>
                <div className="rounded-xl overflow-hidden">
                  <img src="/images/photos/joshua-kid-beach.jpg" alt="Joshua with a young student at Mission Bay" className="w-full h-auto" />
                  <p className="text-[10px] text-[#5a6a7a] mt-2 italic">Post-session at Mission Bay</p>
                </div>
              </div>

          </Reveal>
          <Reveal>
              <h2 className="font-serif text-2xl text-deep pt-2">The philosophy</h2>

              <p>
                I see freediving as an embodied practice — not just a sport. When you hold
                your breath and descend into dark water, you&apos;re working with surrender,
                with fear, with the unknown. You&apos;re confronting your own nervous system
                and learning to find calm inside discomfort. That&apos;s not just a diving
                skill. That&apos;s a life skill.
              </p>

              <p>
                But we don&apos;t sit around talking about it. We train like athletes.
                Breathing drills, CO2 tables, equalization work, safety protocols,
                progressive depth exposure. The science is rigorous. The methodology is
                structured. And underneath all of it is a simple belief: when you learn
                to control your breath, everything else follows.
              </p>

              <p className="text-xs text-[#5a6a7a] pt-4">
                For a deeper exploration of this philosophy, read{" "}
                <a href="https://joshuabeneventi.substack.com/p/the-depths-of-thought-freediving" target="_blank" rel="noopener noreferrer" className="text-teal no-underline hover:underline">
                  The Depths of Thought: Freediving, Forms, and the Return to Origin
                </a>
                {" "}— written during my instructor training in Dahab.
              </p>
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

          <Reveal>
            <div className="bg-deep rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 mb-8">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3db8a4" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div>
                <div className="text-white font-semibold text-sm mb-1">Fully insured through the Divers Alert Network (DAN)</div>
                <p className="text-white/50 text-xs leading-relaxed">
                  DAN is the leading dive safety organization worldwide. Every course, every ocean
                  session, and every Camp Garibaldi program is covered. Safety isn&apos;t a feature
                  of what we do — it&apos;s the foundation.
                </p>
              </div>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "AIDA Instructor",
                detail: "Certified to teach AIDA 1, AIDA 2, and AIDA 3 — pool and open water. San Diego's only AIDA-certified instructor.",
              },
              {
                title: "AIDA Youth Instructor",
                detail: "Certified to teach AIDA Youth levels (Bronze Dolphin through AIDA Junior) to kids ages 6–15.",
              },
              {
                title: "AIDA 4 Freediver (personal certification)",
                detail: "Advanced freediver certification — deep constant weight, free immersion, and advanced safety. Prerequisite for the Instructor course.",
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
              {
                title: "DAN insured",
                detail: "Fully insured through Divers Alert Network (DAN), the leading dive safety organization worldwide.",
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

      {/* Community link */}
      <section className="bg-salt py-16 px-6">
        <div className="max-w-[720px] mx-auto text-center">
          <Reveal>
            <p className="text-[#5a6a7a] text-sm mb-5 leading-relaxed">
              LJFC is more than one instructor. Meet the partners, coaches, and organizations we work with.
            </p>
            <Link
              href="/community"
              className="inline-flex px-6 py-3 border border-deep/10 text-deep rounded-full font-semibold text-sm no-underline hover:bg-deep hover:text-white transition-all"
            >
              Our Community &rarr;
            </Link>
          </Reveal>
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
