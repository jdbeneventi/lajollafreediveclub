import { PasswordGate } from "@/components/PasswordGate";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Research — LJFC Internal",
  robots: { index: false, follow: false },
};

const TOPICS = [
  {
    id: "isobue",
    title: "Isobue (磯笛)",
    subtitle: "The Sea Whistle — Ama Recovery Breathing",
    sections: [
      {
        heading: "What is Isobue?",
        content: `Isobue (磯笛, "sea whistle") is a recovery breathing technique used by the Ama — Japan's traditional freedivers — for over 2,000 years. It's characterized by a long, slow exhalation with the upper lip drawn over the lower, creating a distinctive whistling sound. The lips must be wet for the whistle to result.

In 1996, the isobue was designated as one of Japan's memorable 100 Soundscapes by the Ministry of the Environment.

The Korean haenyeo divers practice an identical technique called sumbisori.`,
      },
      {
        heading: "Technique",
        content: `Upon surfacing, the Ama performs a sharp exhalation followed by the slow whistled exhale, then deep recovery breaths. The sequence:

1. Surface — sharp burst exhale to clear airways
2. Isobue — long slow whistle exhale, upper lip over lower, lips wet
3. Deep inhale — full diaphragmatic breath
4. Repeat 2-3 cycles before next dive

The whistle creates back-pressure (similar to pursed-lip breathing in respiratory therapy), which:
• Keeps alveoli open longer for better gas exchange
• Slows the exhale, extending CO₂ ventilation time
• Creates a controlled, rhythmic recovery pattern
• Signals to other divers that you're OK on the surface`,
      },
      {
        heading: "Connection to Modern Freediving",
        content: `Modern freediving recovery breathing (passive half-exhale → strong inhale → pursed-lip exhale) mirrors the isobue almost exactly. The pursed-lip controlled exhale phase is functionally the same mechanism — creating back-pressure to optimize gas exchange.

The Ama developed this empirically over millennia. Modern sports science arrived at the same conclusion through physiology research. The main difference: Ama use it during short surface intervals (often <60 seconds) between repetitive dives to 10-25m, while recreational freedivers use it after single deeper dives with longer rest.

The Ama also demonstrate that recovery breathing is trainable — elder Ama teach the technique to younger divers, and proficiency develops over years of practice. This supports the AIDA approach of drilling recovery breathing on every dive.`,
      },
      {
        heading: "The Ama Tradition",
        content: `The Ama (海女, "sea women") are predominantly female freedivers who have harvested shellfish, seaweed, and pearls from the coastal waters of Japan for over 2,000 years. They dive without scuba equipment — just mask, wetsuit (historically, just a loincloth), weight belt, and a float/barrel on the surface.

Key characteristics:
• Dive depths: typically 7-15m, some to 25m+
• Dive times: 30-90 seconds
• Surface intervals: 30-60 seconds (very short — isobue makes this possible)
• Repetitive dives: 60-100+ dives per session (2-3 hours)
• Water temperature: dive year-round, including winter
• Two types: Kachido (shore divers, shallower) and Funado (boat divers, deeper)

The Ama tradition is concentrated in Mie Prefecture (Toba, Shima) and parts of Chiba, Tokushima, and Jeju Island (Korea — haenyeo). The population has declined from ~17,000 in the 1950s to ~2,000 today, with an average age over 65.`,
      },
      {
        heading: "Research Questions",
        notes: true,
        content: `• How does isobue back-pressure compare quantitatively to standard pursed-lip recovery?
• Could incorporating the whistle (audible feedback) help students learn recovery breathing faster?
• Ama surface intervals are far shorter than the 3× rule — what physiological adaptations enable this?
• Is there a cardiovascular conditioning component to decades of repetitive diving that reduces O₂ cost?
• Connection to the mammalian dive reflex — do Ama show enhanced MDR after years of practice?
• Sumbisori vs. isobue — are there technique differences between Japanese and Korean traditions?`,
      },
    ],
    videos: [
      {
        videoId: "sTIf2vA-_JQ",
        title: "Isobue — Ama Diver Breathing",
        context: "Traditional Ama divers demonstrating the isobue recovery whistle technique.",
      },
    ],
    references: [
      { title: "Ama Freedivers — Blue Japan", url: "https://bluejapan.org/culture/japans-diving-culture/history/ama/" },
      { title: "Diving Into The Past — A Modern Freediver Visits The Ama", url: "https://www.deeperblue.com/diving-past-modern-freediver-visits-ama/" },
      { title: "Ama Divers Part 2 — Blue Japan", url: "https://bluejapan.org/blog/2021/06/01/ama-divers-part-2/" },
      { title: "The Breath-hold of Japan's Pearl Diving Mermaids — UW360", url: "https://www.uw360.asia/the-breath-hold-of-the-pearl-diving-mermaids-of-japan/" },
      { title: "Ama — 5,000-Year Tradition of Awesome Female Freedivers", url: "https://www.morethantokyo.com/ama-freedivers/" },
      { title: "Ama — REMO Since 1988", url: "https://remosince1988.com/en-us/blogs/stories/ama" },
    ],
  },
];

export default function ResearchPage() {
  return (
    <PasswordGate>
      <div className="min-h-screen bg-deep">
        <div className="max-w-[780px] mx-auto px-6 py-16">
          {/* Header */}
          <div className="mb-12">
            <div className="text-[11px] text-seafoam/40 font-medium tracking-[0.2em] uppercase mb-2">
              Internal · Not Public
            </div>
            <h1 className="font-serif text-[clamp(2rem,4vw,3rem)] text-white font-normal">
              Research <em className="italic text-sand">Notes</em>
            </h1>
            <p className="text-white/30 text-sm mt-2">
              Personal research and reference material. Not linked from navigation.
            </p>
          </div>

          {/* Topics */}
          {TOPICS.map((topic) => (
            <article key={topic.id} id={topic.id} className="mb-16">
              <div className="mb-8">
                <div className="text-[11px] text-seafoam/60 font-medium tracking-[0.2em] uppercase mb-1">
                  Research Topic
                </div>
                <h2 className="font-serif text-3xl text-white font-normal mb-1">{topic.title}</h2>
                <p className="text-white/40 text-sm">{topic.subtitle}</p>
                <div className="w-10 h-[2px] bg-seafoam/40 mt-4" />
              </div>

              {/* Videos */}
              {topic.videos.map((v) => (
                <div key={v.videoId} className="mb-8 rounded-xl overflow-hidden border border-white/10">
                  <div className="relative pb-[56.25%] h-0 bg-black">
                    <iframe
                      src={`https://www.youtube.com/embed/${v.videoId}`}
                      title={v.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute top-0 left-0 w-full h-full border-none"
                    />
                  </div>
                  <div className="bg-ocean/40 px-4 py-3">
                    <div className="text-[10px] font-bold text-seafoam uppercase tracking-[1px] mb-0.5">▶ Reference Video</div>
                    <div className="text-sm text-white font-medium">{v.title}</div>
                    <div className="text-xs text-white/40 mt-0.5">{v.context}</div>
                  </div>
                </div>
              ))}

              {/* Sections */}
              {topic.sections.map((sec, i) => (
                <div key={i} className={`mb-8 ${sec.notes ? "bg-sand/[0.06] border border-sand/20 rounded-xl p-6" : ""}`}>
                  <h3 className={`font-serif text-lg mb-3 font-normal ${sec.notes ? "text-sand" : "text-white"}`}>
                    {sec.heading}
                  </h3>
                  <div className={`text-sm leading-[1.85] whitespace-pre-wrap ${sec.notes ? "text-sand/60" : "text-white/50"}`}>
                    {sec.content}
                  </div>
                </div>
              ))}

              {/* References */}
              {topic.references && topic.references.length > 0 && (
                <div className="mt-8 pt-6 border-t border-white/[0.06]">
                  <div className="text-[10px] text-white/20 uppercase tracking-wide mb-3">References</div>
                  <div className="space-y-1.5">
                    {topic.references.map((ref, i) => (
                      <a key={i} href={ref.url} target="_blank" rel="noopener noreferrer"
                        className="block text-xs text-seafoam/50 no-underline hover:text-seafoam transition-colors">
                        {ref.title} ↗
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </PasswordGate>
  );
}
