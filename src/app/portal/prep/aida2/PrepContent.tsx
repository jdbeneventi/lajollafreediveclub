"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════════
   AIDA2 Course Prep — Interactive Journey
   Uses site Tailwind tokens: deep, ocean, teal, seafoam, sand, salt, coral
   ═══════════════════════════════════════════════════════════════════ */

// ---------- Section Data ----------
interface QuizBlock {
  t: "quiz";
  q: string;
  type: "mc" | "tf" | "multi";
  options?: string[];
  answer: number | boolean | number[];
  explain: string;
}
interface TextBlock { t: "p" | "h3"; text: string }
interface SafetyBlock { t: "safety"; text: string }
interface CalloutBlock { t: "callout"; label?: string; text: string }
interface InstructorBlock { t: "instructor"; text: string }
interface DiagramBlock { t: "diagram"; id: string }
interface InteractiveBlock { t: "interactive"; id: string }
interface VideoBlock { t: "video"; videoId: string; title: string; context: string }
interface ListBlock { t: "list"; items: string[] }
interface PhasesBlock { t: "phases"; items: { name: string; desc: string }[] }
interface ProtocolBlock { t: "protocol"; steps: { letter: string; word: string; desc: string }[] }
interface TechniquesBlock { t: "techniques"; items: { name: string; how: string; note: string }[] }
interface ChecklistBlock { t: "checklist"; items: { item: string; desc: string }[] }
interface GearBlock { t: "gear"; items: { name: string; points: string[] }[] }
interface FaqBlock { t: "faq"; items: { q: string; a: string }[] }

type Block = QuizBlock | TextBlock | SafetyBlock | CalloutBlock | InstructorBlock | DiagramBlock | InteractiveBlock | VideoBlock | ListBlock | PhasesBlock | ProtocolBlock | TechniquesBlock | ChecklistBlock | GearBlock | FaqBlock;

interface Section {
  id: string;
  num: string;
  title: string;
  subtitle: string;
  icon: string;
  hideQC?: boolean;
  blocks: Block[];
}

const SECTIONS: Section[] = [
  { id: "welcome", num: "00", title: "Welcome", subtitle: "A note from your instructor", icon: "👋", hideQC: true, blocks: [
    { t: "instructor", text: "I'm really glad you're here. The fact that you're reading this before the course tells me you're the kind of person who takes this seriously — and that's exactly the mindset that makes a great freediver. I put this guide together so you can show up on Day 1 already speaking the language. You don't need to memorize anything. Just read through, try the practice questions, and jot down anything you want to ask. See you at the Shores." },
    { t: "h3", text: "What happens during the course" },
    { t: "p", text: "We spend time in classroom theory and in the water. Theory covers physiology, breathing, equalization, safety, and rescue — everything in this guide. Water sessions start in controlled conditions and progress to open-water dives on the line at La Jolla Shores, right at the edge of the submarine canyon." },
    { t: "p", text: "You'll do static breath holds (face down, just breathing practice), dynamic swims (horizontal laps on one breath), and depth dives on a line. We build skills incrementally — nobody gets pushed past what they're comfortable with." },
    { t: "callout", label: "The most important thing you can bring", text: "A willingness to relax. Freediving is one of the few sports where trying harder makes you worse. The students who progress fastest are the ones who learn to let go." },
  ]},
  { id: "nerves", num: "01", title: "It's Normal to Be Nervous", subtitle: "What everyone worries about", icon: "💭", hideQC: true, blocks: [
    { t: "p", text: "Almost every student shows up with some version of these worries. You're not alone — and none of them are reasons not to do this." },
    { t: "faq", items: [
      { q: "\"What if I can't hold my breath long enough?\"", a: "You can. Most people hold 60–90 seconds with zero training. After learning relaxation technique, that number typically doubles on Day 1. We're not chasing records." },
      { q: "\"What if I panic underwater?\"", a: "You stop and surface. That's not failure — that's good freediving. We build depth gradually. You always have the line. Your buddy and I are right there." },
      { q: "\"What if I can't equalize?\"", a: "Equalization is the most common sticking point and it's completely learnable. We work on it dry first, then shallow water. There's a whole section below with video tutorials." },
      { q: "\"Is it dangerous?\"", a: "With proper training and a buddy, freediving is very safe. AIDA has an impeccable safety record over 30+ years. The dangerous things — diving alone, hyperventilating, ignoring signals — are exactly what this course teaches you NOT to do." },
    ]},
    { t: "instructor", text: "If you have fears not listed here, bring them to Day 1. Seriously. The students who share what they're feeling always have a better experience than those who push through silently." },
  ]},
  { id: "physiology", num: "02", title: "How Your Body Works", subtitle: "The science that makes it make sense", icon: "🫁", blocks: [
    { t: "p", text: "You don't need to become a physiologist — just grasping a few key concepts will completely change your first breath hold." },
    { t: "h3", text: "The Respiratory System" },
    { t: "p", text: "Air enters through your mouth (nose covered by mask), travels down the trachea, branches through the bronchial tree, and reaches the alveoli — tiny air sacs where gas exchange happens. O₂ enters blood; CO₂ exits to be exhaled." },
    { t: "diagram", id: "respiratory" },
    { t: "h3", text: "The Key Insight: CO₂ Drives Your Urge to Breathe" },
    { t: "p", text: "Most people assume they need to breathe because they're low on oxygen. That's not what's happening. Breathing is regulated primarily by CO₂ levels. CO₂ is a waste product of all activity — physical and mental. When it builds up, chemoreceptors trigger the urge to breathe." },
    { t: "callout", label: "Think of it like this", text: "O₂ is the gas in your tank. CO₂ is the fuel gauge. You can't see how much oxygen you have directly, but rising CO₂ tells you how far along you are." },
    { t: "quiz", q: "Your urge to breathe during a breath hold is primarily caused by:", type: "mc", options: ["Lack of oxygen", "Rising CO₂ levels", "Water pressure", "Muscle fatigue"], answer: 1, explain: "Breathing is regulated mainly by CO₂, not O₂. The urge arrives well before oxygen is a concern." },
    { t: "h3", text: "Contractions" },
    { t: "p", text: "At a certain point, your diaphragm and breathing muscles may contract involuntarily — your body attempting to exhale CO₂. This doesn't mean you need to breathe immediately. It's information, not an emergency. Relax into them." },
    { t: "h3", text: "Oxygen Saturation" },
    { t: "p", text: "At rest, your blood is already 96–99% saturated with O₂. That's the maximum. You cannot \"load up\" extra oxygen. Preparation is about relaxation, not oxygenation." },
    { t: "quiz", q: "A healthy person's blood O₂ saturation is roughly 96–99% at all times when breathing.", type: "tf", answer: true, explain: "Already near maximum. No room to store more." },
    { t: "h3", text: "Hyperventilation — Why It's Dangerous" },
    { t: "safety", text: "Hyperventilation (over-breathing) artificially lowers CO₂. This does NOT add oxygen. It suppresses warning signals. You can lose consciousness without ever feeling the urge to breathe. It's the #1 cause of freediving accidents." },
    { t: "p", text: "Symptoms: euphoria, tingling, lightheadedness, dizziness, numbness around mouth, metallic taste, hand paralysis. If you feel any of these — do not dive." },
    { t: "quiz", q: "Hyperventilation stores significantly more oxygen in the blood.", type: "tf", answer: false, explain: "It lowers CO₂ but does NOT increase O₂ storage." },
  ]},
  { id: "breathing", num: "03", title: "The Breathing Cycle", subtitle: "Four phases for every dive", icon: "🌊", blocks: [
    { t: "p", text: "Now that you understand CO₂ and why relaxation matters, here's the practical framework." },
    { t: "phases", items: [
      { name: "1. Relaxation Phase", desc: "1–2 min calm belly breathing. Let body and mind settle. Breathe normally — don't force deeper or faster." },
      { name: "2. One Full Breath", desc: "Single slow deep inhalation — belly first (diaphragm), then chest (intercostals). Comfortable fullness, not max tension." },
      { name: "3. Breath Hold", desc: "The dive. Stay relaxed. Accept rising CO₂. Let contractions come and go. Ideal state: complete stillness." },
      { name: "4. Recovery Breathing", desc: "Min 3 recovery breaths after surfacing. A dive isn't over until you've recovered + given OK sign." },
    ]},
    { t: "h3", text: "Recovery Breathing" },
    { t: "p", text: "A safety mechanism you train into muscle memory: passive half-exhale → strong inhale → brief hold → controlled exhale through pursed lips. Train this on every dive." },
    { t: "diagram", id: "recovery" },
    { t: "quiz", q: "Recovery breathing can be described as:", type: "mc", options: ["Deep slow inhales from the diaphragm", "Passive exhalations followed by quick inhalations", "Full exhales followed by full inhales", "Shallow inhales and exhales"], answer: 1, explain: "Passive half-exhale, then strong quick inhale, then controlled pursed-lip exhale." },
  ]},
  { id: "equalization", num: "04", title: "Equalization", subtitle: "Protecting your ears at depth", icon: "👂", blocks: [
    { t: "p", text: "As you descend, water pressure compresses air spaces. Eardrums flex inward. Equalization means gently introducing air into the middle ear to restore volume." },
    { t: "diagram", id: "ear" },
    { t: "safety", text: "Equalize early and often — at the first hint of pressure, before discomfort. Never push through pain. If it's not working, stop and surface. Some ear injuries are permanent." },
    { t: "h3", text: "Boyle's Law: Depth, Pressure & Volume" },
    { t: "p", text: "Pressure increases ~1 bar per 10m. Surface: 1 bar. 10m: 2 bar. Boyle's Law: gas volume is inversely proportional to pressure. At 10m your air spaces are half their surface volume." },
    { t: "interactive", id: "boyles" },
    { t: "quiz", q: "On immersion, pressure increases at ~1 bar per 10m of seawater.", type: "tf", answer: true, explain: "Surface = 1 bar. 10m = 2 bar. 20m = 3 bar." },
    { t: "h3", text: "Three Techniques" },
    { t: "techniques", items: [
      { name: "Valsalva", how: "Pinch nose, gently blow against closed nostrils.", note: "Common in scuba but limited beyond 8–10m." },
      { name: "Frenzel", how: "Pinch nose, use tongue as piston against palate to compress mouth air.", note: "The Swiss army knife of freediving. No chest tension." },
      { name: "Hands-Free (BTV)", how: "Mechanically open Eustachian tubes without pressure.", note: "Appealing but unreliable. Learn Frenzel as backup." },
    ]},
    { t: "video", videoId: "Mo07gZR741M", title: "How to Frenzel Equalize — Adam Stern", context: "Australian record holder walks through tongue movements step by step. Practice in front of a mirror. This is pre-course homework." },
    { t: "quiz", q: "Air spaces a diver equalizes on descent:", type: "multi", options: ["Lungs", "Ears (middle ear)", "Sinuses", "Mask"], answer: [1, 2, 3], explain: "Ears, sinuses, and mask. Lungs compress naturally." },
    { t: "instructor", text: "Equalization is the #1 thing students stress about. Practice Frenzel dry — on the bus, watching TV — even 5 min/day before the course. The Adam Stern video above is your best friend here." },
  ]},
  { id: "technique", num: "05", title: "Freedive Technique", subtitle: "Moving efficiently in water", icon: "🏊", blocks: [
    { t: "p", text: "Good technique minimizes O₂ use and CO₂ production. We'll work on each skill individually." },
    { t: "h3", text: "The Duck Dive" },
    { t: "p", text: "Transitions you from surface to descent. Done well, carries you to 5m before kicking. Sequence: stretch out → bend at waist → pull arms to thighs → equalize → kick. Smooth and continuous." },
    { t: "video", videoId: "HphNnaPLSrI", title: "Perfect Your Duck Dive — Sheena McNally", context: "Canadian record holder breaks it down on land and in water. Watch the common mistakes section." },
    { t: "h3", text: "Finning & Streamlining" },
    { t: "p", text: "Kick from hips, not knees. Long fluid strokes. Head aligned with body — look forward along the line, not up. On ascent, let buoyancy do the work for the last meters." },
    { t: "callout", label: "One rule for the ascent", text: "Once you start ascending, never turn back down. There will always be another dive." },
    { t: "quiz", q: "Correct statements about technique:", type: "multi", options: ["Good technique is important for success", "It minimizes O₂ consumption", "It maximizes safety and enjoyment", "Only important for competitive freedivers"], answer: [0, 1, 2], explain: "Technique matters at every level." },
  ]},
  { id: "safety", num: "06", title: "Safety & Rescue", subtitle: "LMC, Blackout, and SAFE protocol", icon: "🛟", blocks: [
    { t: "safety", text: "Always freedive with a qualified buddy. One up, one down. No exceptions. Solo breath-hold diving is the leading cause of freediving fatalities worldwide." },
    { t: "h3", text: "LMC (Loss of Motor Control)" },
    { t: "p", text: "A hypoxic fit after surfacing when O₂ is too low. Involuntary jerky movements. May progress to blackout. Response: hold airways out, remove equipment, coach recovery breaths. Stop diving for the day." },
    { t: "quiz", q: "\"A hypoxic fit triggered by low oxygen\" describes:", type: "mc", options: ["LMC", "Hyperventilation", "Blackout", "Cyanosis"], answer: 0, explain: "LMC = mild hypoxia. Blackout = severe hypoxia (full unconsciousness)." },
    { t: "h3", text: "Blackout (BO)" },
    { t: "p", text: "Full loss of consciousness from severe hypoxia. Warnings: ear ringing, warmth, dive feeling easier, tunnel vision, fuzzy thoughts. In recreational freediving, you should never approach these." },
    { t: "quiz", q: "Blackout warning symptoms include:", type: "multi", options: ["Sudden warmth", "Ear ringing", "Tunnel vision", "Strong confident fin kick"], answer: [0, 1, 2], explain: "Warmth, ringing, tunnel vision = hypoxia warnings. Strong kick = normal." },
    { t: "h3", text: "The SAFE Protocol + BTT" },
    { t: "protocol", steps: [
      { letter: "S", word: "Surface", desc: "Get diver up. Secure airway with sandwich grip." },
      { letter: "A", word: "Airways", desc: "Nose and mouth above water at all times." },
      { letter: "FE", word: "Facial Equipment", desc: "Remove mask, clip, goggles. Expose face." },
    ]},
    { t: "callout", label: "Then: BTT Cycle", text: "Blow around nose/eyes. Tap both cheeks. Talk: \"[Name], breathe in!\" Repeat 10–15s. No response → 5 rescue breaths. Still nothing → CPR + emergency services." },
    { t: "quiz", q: "Most likely cause of a blackout:", type: "mc", options: ["Not enough prep time", "Hyperventilation", "Bad finning", "Safety diver too close"], answer: 1, explain: "Hyperventilation suppresses CO₂ warnings, letting divers push past safe limits." },
    { t: "instructor", text: "We practice rescue in every course. By the end, SAFE becomes muscle memory. That's the point." },
  ]},
  { id: "risk", num: "07", title: "Risk Reduction", subtitle: "The habits that keep it safe", icon: "✅", blocks: [
    { t: "checklist", items: [
      { item: "Always dive with a qualified buddy", desc: "One up, one down." },
      { item: "Conservative freediving", desc: "Stressed? Don't dive. Underwater? Ascend." },
      { item: "Gradual progression", desc: "AIDA2 max: 20m." },
      { item: "Recovery breathing every dive", desc: "Train it on easy dives." },
      { item: "Stay hydrated", desc: "Water + electrolytes. Immersion suppresses thirst." },
      { item: "Correct weighting", desc: "Full exhale at surface = should not sink." },
      { item: "Snorkel out before diving", desc: "Prevents water path to airways." },
      { item: "Surface intervals ≥ 3× dive time", desc: "1 min dive = 3 min rest." },
      { item: "Don't dive when sick", desc: "Congestion = dangerous equalization." },
    ]},
    { t: "quiz", q: "After one scuba dive, wait __ hours; after multiple: __ hours.", type: "mc", options: ["6 / 12", "12 / 24", "24 / 48", "8 / 16"], answer: 1, explain: "12h after one, 24h after multiple — to avoid decompression illness." },
  ]},
  { id: "equipment", num: "08", title: "Equipment", subtitle: "What you need and why", icon: "🤿", blocks: [
    { t: "p", text: "Technique > gear. Here's what you'll use:" },
    { t: "gear", items: [
      { name: "Mask", points: ["Encloses nose (equalization)", "Low volume", "Good fit > price", "Clear lenses for buddy eye contact"] },
      { name: "Fins", points: ["Start short for technique", "Full foot pocket", "Kick from hips"] },
      { name: "Snorkel", points: ["Surface breathing safety tool", "Rigid preferred", "Always remove before diving"] },
      { name: "Weight Belt", points: ["Rubber/silicone, on hips", "Quick-release buckle", "Preserves belly breathing"] },
    ]},
    { t: "quiz", q: "Short/soft fins are better for learning technique.", type: "tf", answer: true, explain: "Develop hip-driven technique before moving to longer blades." },
    { t: "instructor", text: "Don't buy anything before the course. We provide everything. If you want one investment: a well-fitting mask. Try before you buy." },
  ]},
  { id: "logistics", num: "09", title: "Day 1 Logistics", subtitle: "Where, when, what to bring", icon: "📍", hideQC: true, blocks: [
    { t: "h3", text: "Where to Meet" },
    { t: "p", text: "La Jolla Shores beach, near the main lifeguard tower. I'll send the exact pin and time separately. Parking on Camino Del Oro or La Jolla Shores Drive — arrive 15 min early, lot fills on weekends." },
    { t: "h3", text: "What to Bring" },
    { t: "list", items: ["Swimsuit + towel", "Reef-safe sunscreen", "Water bottle + electrolytes", "Light snack (no dairy, heavy fats, spicy)", "Completed AIDA medical statement + signed waiver", "Personal gear if you have it — otherwise we provide everything", "Positive attitude"] },
    { t: "h3", text: "What to Eat" },
    { t: "p", text: "Light, easy to digest. Banana, toast, light smoothie 1–2 hours before. Avoid dairy, caffeine, and spicy food — they increase mucus and hinder equalization." },
    { t: "h3", text: "Night Before" },
    { t: "p", text: "No alcohol. Good sleep. Don't cram this guide — you already know enough. The real learning happens in the water." },
    { t: "instructor", text: "If anything comes up — running late, sick, midnight question — just text me. I'd rather hear from you than have you stress." },
  ]},
];

// ---------- Sub-components ----------

function SafetyBox({ text }: { text: string }) {
  return (
    <div className="bg-coral/10 border-2 border-coral rounded-lg px-4 py-3.5 my-3">
      <div className="text-[10px] font-bold text-coral uppercase tracking-[1.2px] mb-1">⚠ Safety Critical</div>
      <p className="text-sm leading-relaxed text-deep m-0">{text}</p>
    </div>
  );
}

function Callout({ label, text }: { label?: string; text: string }) {
  return (
    <div className="bg-salt border-l-4 border-seafoam rounded-r-lg px-4 py-3 my-3">
      {label && <div className="text-[10px] font-bold text-seafoam uppercase tracking-[1px] mb-0.5">{label}</div>}
      <p className="text-sm leading-relaxed text-deep italic m-0">{text}</p>
    </div>
  );
}

function Instructor({ text }: { text: string }) {
  return (
    <div className="bg-deep rounded-[10px] px-[18px] py-4 my-3.5">
      <div className="text-[10px] font-bold text-seafoam uppercase tracking-[1.2px] mb-1.5">From Your Instructor — Joshua</div>
      <p className="text-sm leading-relaxed text-seafoam/70 m-0">{text}</p>
    </div>
  );
}

function InlineQuiz({ q, type, options, answer, explain }: QuizBlock) {
  const [sel, setSel] = useState<number | boolean | null>(null);
  const [ms, setMs] = useState<number[]>([]);
  const [done, setDone] = useState(false);

  const ok = type === "tf"
    ? sel === answer
    : type === "mc"
    ? sel === answer
    : (() => {
        const a = [...ms].sort();
        const b = [...(answer as number[])].sort();
        return a.length === b.length && a.every((v, i) => v === b[i]);
      })();

  const can = type === "tf" || type === "mc" ? sel !== null : ms.length > 0;

  return (
    <div className={`rounded-[10px] px-4 py-3.5 my-4 border-[1.5px] transition-all ${
      done ? (ok ? "bg-green-50 border-green-500" : "bg-coral/10 border-coral") : "bg-salt border-deep/10"
    }`}>
      <div className={`text-[10px] font-bold uppercase tracking-[1px] mb-1.5 ${
        done ? (ok ? "text-green-600" : "text-coral") : "text-seafoam"
      }`}>Quick Check</div>
      <p className="text-[13px] font-semibold text-deep mb-2.5 leading-snug">{q}</p>

      {type === "tf" && (
        <div className="flex gap-1.5">
          {[true, false].map((v) => (
            <button key={String(v)} onClick={() => !done && setSel(v)}
              className={`px-[18px] py-[7px] rounded-md border-2 text-xs font-semibold text-deep cursor-pointer transition-colors ${
                sel === v ? "border-seafoam bg-seafoam/15" : "border-deep/10 bg-white"
              } ${done ? "cursor-default" : ""}`}>
              {v ? "True" : "False"}
            </button>
          ))}
        </div>
      )}

      {type === "mc" && options?.map((o, i) => (
        <button key={i} onClick={() => !done && setSel(i)}
          className={`block w-full text-left px-2.5 py-[7px] mb-1 rounded-md border-2 text-xs text-deep cursor-pointer transition-colors ${
            done && i === answer ? "border-green-500 bg-green-50" : sel === i ? "border-seafoam bg-seafoam/15" : "border-deep/10 bg-white"
          } ${done ? "cursor-default" : ""}`}>
          <span className="font-bold text-seafoam mr-1.5">{String.fromCharCode(65 + i)}</span>{o}
        </button>
      ))}

      {type === "multi" && options?.map((o, i) => (
        <button key={i} onClick={() => !done && setMs((p) => p.includes(i) ? p.filter((x) => x !== i) : [...p, i])}
          className={`block w-full text-left px-2.5 py-[7px] mb-1 rounded-md border-2 text-xs text-deep cursor-pointer transition-colors ${
            done && (answer as number[]).includes(i) ? "border-green-500 bg-green-50" : ms.includes(i) ? "border-seafoam bg-seafoam/15" : "border-deep/10 bg-white"
          } ${done ? "cursor-default" : ""}`}>
          <span className="mr-1.5">{ms.includes(i) ? "☑" : "☐"}</span>{o}
        </button>
      ))}

      <div className="mt-2.5">
        {!done ? (
          <button onClick={() => setDone(true)} disabled={!can}
            className={`px-[18px] py-[7px] rounded-md border-none text-xs font-semibold cursor-pointer ${
              can ? "bg-deep text-white" : "bg-deep/10 text-deep/30 cursor-default"
            }`}>
            Check
          </button>
        ) : (
          <div className="text-xs leading-snug">
            <strong className={ok ? "text-green-600" : "text-coral"}>{ok ? "✓ Correct" : "✗ Not quite"}</strong>
            <span className="text-slate ml-1.5">{explain}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function Diagram({ id }: { id: string }) {
  const diagrams: Record<string, React.ReactNode> = {
    respiratory: (
      <svg viewBox="0 0 380 190" className="w-full max-w-[400px]">
        <circle cx="190" cy="20" r="14" fill="rgba(61,184,164,0.15)" stroke="#3db8a4" strokeWidth="1.5" />
        <text x="190" y="24" fontSize="8" fill="#0B1D2C" fontFamily="DM Sans" textAnchor="middle" fontWeight="600">Mouth</text>
        <rect x="184" y="34" width="12" height="30" rx="4" fill="#D4A574" stroke="#D4A574" strokeWidth="1.5" />
        <text x="210" y="52" fontSize="7" fill="#3A4A56" fontFamily="DM Sans">Trachea</text>
        <path d="M190 64 L130 88" stroke="#D4A574" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M190 64 L250 88" stroke="#D4A574" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <text x="142" y="82" fontSize="7" fill="#3A4A56" fontFamily="DM Sans">Bronchi</text>
        <ellipse cx="115" cy="128" rx="58" ry="45" fill="rgba(61,184,164,0.09)" stroke="#3db8a4" strokeWidth="1.5" />
        <ellipse cx="265" cy="128" rx="58" ry="45" fill="rgba(61,184,164,0.09)" stroke="#3db8a4" strokeWidth="1.5" />
        {[90, 110, 130, 145].map((x, j) => <circle key={`l${j}`} cx={x} cy={128 + Math.sin(j * 2) * 12} r="4.5" fill="rgba(199,91,58,0.4)" stroke="#C75B3A" strokeWidth=".8" />)}
        {[240, 260, 280, 295].map((x, j) => <circle key={`r${j}`} cx={x} cy={128 + Math.sin(j * 2) * 12} r="4.5" fill="rgba(199,91,58,0.4)" stroke="#C75B3A" strokeWidth=".8" />)}
        <text x="115" y="162" fontSize="7" fill="#C75B3A" fontFamily="DM Sans" textAnchor="middle" fontWeight="600">Alveoli</text>
        <text x="265" y="162" fontSize="7" fill="#C75B3A" fontFamily="DM Sans" textAnchor="middle" fontWeight="600">Alveoli</text>
        <rect x="130" y="174" width="120" height="13" rx="4" fill="#0B1D2C" />
        <text x="190" y="183" fontSize="7" fill="#3db8a4" fontFamily="DM Sans" textAnchor="middle" fontWeight="600">O₂ in ↔ CO₂ out = Gas Exchange</text>
      </svg>
    ),
    ear: (
      <svg viewBox="0 0 380 190" className="w-full max-w-[420px]">
        <path d="M30 90 Q70 88 110 90 Q118 90 118 82 L118 102 Q118 110 110 110 Q70 112 30 110 Z" fill="rgba(61,184,164,0.1)" stroke="#3db8a4" strokeWidth="1.5" />
        <text x="65" y="84" fontSize="8" fill="#3A4A56" fontFamily="DM Sans" textAnchor="middle" fontWeight="600">Outer Ear Canal</text>
        <text x="10" y="78" fontSize="7" fill="#3db8a4" fontFamily="DM Sans" fontWeight="700">WATER →</text>
        <ellipse cx="128" cy="96" rx="3.5" ry="16" fill="rgba(199,91,58,0.4)" stroke="#C75B3A" strokeWidth="2" />
        <text x="140" y="76" fontSize="8" fill="#C75B3A" fontFamily="DM Sans" fontWeight="700">Eardrum</text>
        <rect x="143" y="80" width="48" height="34" rx="7" fill="#FAF3EC" stroke="#D4A574" strokeWidth="1.5" />
        <text x="167" y="94" fontSize="8" fill="#3A4A56" fontFamily="DM Sans" textAnchor="middle" fontWeight="600">Middle</text>
        <text x="167" y="104" fontSize="8" fill="#3A4A56" fontFamily="DM Sans" textAnchor="middle" fontWeight="600">Ear</text>
        <path d="M167 114 Q167 138 200 150 Q240 164 280 164" fill="none" stroke="#0B1D2C" strokeWidth="2.5" strokeDasharray="4 3" />
        <text x="215" y="146" fontSize="8" fill="#0B1D2C" fontFamily="DM Sans" fontWeight="700">Eustachian Tube</text>
        <rect x="270" y="152" width="62" height="26" rx="5" fill="rgba(11,29,44,0.08)" stroke="#0B1D2C" strokeWidth="1.5" />
        <text x="301" y="168" fontSize="8" fill="#0B1D2C" fontFamily="DM Sans" textAnchor="middle" fontWeight="600">Throat</text>
        <rect x="200" y="16" width="150" height="42" rx="7" fill="#0B1D2C" />
        <text x="275" y="33" fontSize="9" fill="#3db8a4" fontFamily="DM Sans" textAnchor="middle" fontWeight="700">EQUALIZE = send air</text>
        <text x="275" y="46" fontSize="9" fill="rgba(61,184,164,0.6)" fontFamily="DM Sans" textAnchor="middle">through tube → middle ear</text>
      </svg>
    ),
    recovery: (
      <svg viewBox="0 0 400 95" className="w-full max-w-[440px]">
        {[
          { x: 8, n: "1", t: "Half Exhale", s: "Passive", c: "#D4A574", ic: "↓" },
          { x: 105, n: "2", t: "Strong Inhale", s: "Quick, full", c: "#3db8a4", ic: "↑↑" },
          { x: 202, n: "3", t: "Brief Hold", s: "~1 sec", c: "#0B1D2C", ic: "—" },
          { x: 299, n: "4", t: "Pursed Exhale", s: "Controlled", c: "#C75B3A", ic: "↓~" },
        ].map((step, j) => (
          <g key={j}>
            <rect x={step.x} y="6" width="88" height="62" rx="8" fill={step.c + "18"} stroke={step.c} strokeWidth="1.5" />
            <circle cx={step.x + 13} cy="20" r="7" fill={step.c} />
            <text x={step.x + 13} y="23" fontSize="9" fill="white" fontFamily="DM Sans" textAnchor="middle" fontWeight="700">{step.n}</text>
            <text x={step.x + 52} y="23" fontSize="14" fill={step.c} fontFamily="DM Sans" textAnchor="middle">{step.ic}</text>
            <text x={step.x + 44} y="44" fontSize="9" fill="#0B1D2C" fontFamily="DM Sans" textAnchor="middle" fontWeight="700">{step.t}</text>
            <text x={step.x + 44} y="56" fontSize="7" fill="#718096" fontFamily="DM Sans" textAnchor="middle">{step.s}</text>
            {j < 3 && <text x={step.x + 94} y="38" fontSize="14" fill="rgba(61,184,164,0.4)">→</text>}
          </g>
        ))}
        <text x="200" y="85" fontSize="8" fill="#3db8a4" fontFamily="DM Sans" textAnchor="middle" fontWeight="700">↻ Repeat ×3 minimum</text>
      </svg>
    ),
  };
  return <div className="my-3.5 bg-salt border border-deep/10 rounded-[10px] px-2 pt-2.5 pb-1.5">{diagrams[id] || null}</div>;
}

function BoylesLaw() {
  const [depth, setDepth] = useState(0);
  const pr = 1 + depth / 10;
  const vol = 100 / pr;
  const presets = [
    { d: 0, l: "0m" }, { d: 10, l: "10m" }, { d: 20, l: "20m" }, { d: 40, l: "40m" }, { d: 100, l: "100m" },
  ];

  return (
    <div className="my-4 bg-gradient-to-b from-ocean to-[#0a2540] rounded-xl px-4 py-[18px] text-white">
      <div className="text-[10px] font-bold text-seafoam uppercase tracking-[1.5px] mb-1.5">Interactive · Boyle&apos;s Law</div>
      <div className="text-xs text-seafoam/60 mb-3.5 leading-snug">Drag to see how pressure and volume change. This is the exact table from your exam.</div>
      <input type="range" min="0" max="100" value={depth} onChange={(e) => setDepth(+e.target.value)} className="w-full accent-seafoam" />
      <div className="flex justify-between my-1.5 mb-3.5 gap-1">
        {presets.map((p) => (
          <button key={p.d} onClick={() => setDepth(p.d)}
            className={`px-2 py-0.5 rounded text-[10px] font-semibold border-none cursor-pointer ${
              depth === p.d ? "bg-seafoam text-deep" : "bg-white/10 text-seafoam/60"
            }`}>
            {p.l}
          </button>
        ))}
      </div>
      <div className="flex gap-1.5 mb-3">
        {[
          { l: "Depth", v: `${depth}m`, c: "text-seafoam" },
          { l: "Pressure", v: `${pr.toFixed(1)} bar`, c: "text-sand" },
          { l: "Volume", v: `${vol.toFixed(0)}%`, c: "text-coral" },
        ].map((r) => (
          <div key={r.l} className="flex-1 bg-white/[0.06] rounded-lg px-1.5 py-2 text-center">
            <div className="text-[9px] text-white/40 uppercase tracking-[1px]">{r.l}</div>
            <div className={`text-xl font-bold mt-0.5 ${r.c}`}>{r.v}</div>
          </div>
        ))}
      </div>
      <div className="text-center">
        <svg viewBox="0 0 160 60" className="w-[140px]">
          <ellipse cx="80" cy="30" rx={Math.max(8, 38 * (vol / 100))} ry={Math.max(6, 26 * (vol / 100))}
            fill="rgba(61,184,164,0.35)" stroke="#3db8a4" strokeWidth="1.5" style={{ transition: "all .3s" }} />
          <text x="80" y="34" fontSize="10" fill="white" fontFamily="DM Sans" textAnchor="middle" fontWeight="700">{vol.toFixed(0)}%</text>
        </svg>
        <div className="text-[9px] text-white/40">Lung volume at {depth}m</div>
      </div>
    </div>
  );
}

function RenderBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        switch (b.t) {
          case "p": return <p key={i} className="text-sm leading-relaxed text-slate mb-2.5">{b.text}</p>;
          case "h3": return <h3 key={i} className="font-serif text-base text-deep mt-[18px] mb-1.5 font-normal">{b.text}</h3>;
          case "safety": return <SafetyBox key={i} text={b.text} />;
          case "callout": return <Callout key={i} label={b.label} text={b.text} />;
          case "instructor": return <Instructor key={i} text={b.text} />;
          case "diagram": return <Diagram key={i} id={b.id} />;
          case "interactive": return b.id === "boyles" ? <BoylesLaw key={i} /> : null;
          case "quiz": return <InlineQuiz key={i} {...b} />;
          case "video": return (
            <div key={i} className="my-4 rounded-[10px] overflow-hidden border border-deep/10 bg-deep">
              <div className="relative pb-[56.25%] h-0">
                <iframe src={`https://www.youtube.com/embed/${b.videoId}`} title={b.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen
                  className="absolute top-0 left-0 w-full h-full border-none" />
              </div>
              <div className="px-3.5 py-2.5">
                <div className="text-[10px] font-bold text-seafoam uppercase tracking-[1px] mb-0.5">▶ Watch This</div>
                <div className="text-[13px] font-semibold text-white mb-0.5">{b.title}</div>
                <div className="text-xs text-seafoam/60 leading-snug">{b.context}</div>
              </div>
            </div>
          );
          case "list": return (
            <ul key={i} className="my-2 ml-1.5 p-0 list-none">
              {b.items.map((item, j) => (
                <li key={j} className="text-[13px] leading-relaxed text-slate py-0.5 pl-4 relative">
                  <span className="absolute left-0 text-seafoam">•</span>{item}
                </li>
              ))}
            </ul>
          );
          case "phases": return (
            <div key={i} className="my-3.5">
              {b.items.map((p, j) => (
                <div key={j} className={`flex gap-3 py-3 ${j < b.items.length - 1 ? "border-b border-deep/[0.06]" : ""}`}>
                  <div className="w-7 h-7 rounded-full bg-deep text-seafoam flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{j + 1}</div>
                  <div>
                    <div className="font-bold text-[13px] text-deep mb-0.5">{p.name}</div>
                    <div className="text-[13px] leading-snug text-slate">{p.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          );
          case "protocol": return (
            <div key={i} className="bg-salt border-2 border-deep rounded-lg p-4 my-3.5">
              {b.steps.map((s, j) => (
                <div key={j} className={`flex gap-2.5 items-start ${j < b.steps.length - 1 ? "mb-2.5" : ""}`}>
                  <div className="min-w-[32px] h-6 bg-deep text-seafoam rounded flex items-center justify-center text-xs font-extrabold">{s.letter}</div>
                  <div><span className="font-bold text-deep text-[13px]">{s.word}</span> <span className="text-slate text-[13px]">— {s.desc}</span></div>
                </div>
              ))}
            </div>
          );
          case "techniques": return (
            <div key={i} className="my-2.5">
              {b.items.map((t, j) => (
                <div key={j} className={`rounded-md px-3.5 py-2.5 mb-1.5 ${j % 2 === 0 ? "bg-salt" : "bg-white"}`}>
                  <div className="font-bold text-[13px] text-deep mb-0.5">{t.name}</div>
                  <div className="text-xs text-slate leading-snug">{t.how}</div>
                  <div className="text-[11px] text-seafoam italic mt-0.5">{t.note}</div>
                </div>
              ))}
            </div>
          );
          case "checklist": return (
            <div key={i} className="my-2.5">
              {b.items.map((c, j) => (
                <div key={j} className="flex gap-2 py-2 border-b border-deep/[0.06] items-start">
                  <span className="text-seafoam text-[15px] mt-0.5">☐</span>
                  <div>
                    <div className="font-bold text-[13px] text-deep">{c.item}</div>
                    <div className="text-xs text-slate/60">{c.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          );
          case "gear": return (
            <div key={i} className="my-2.5">
              {b.items.map((g, j) => (
                <div key={j} className="mb-3 bg-salt rounded-lg px-3.5 py-2.5 border border-deep/[0.06]">
                  <div className="font-bold text-sm text-deep mb-1">{g.name}</div>
                  {g.points.map((p, k) => (
                    <div key={k} className="text-xs text-slate py-px pl-3 relative">
                      <span className="absolute left-0 text-seafoam">›</span>{p}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          );
          case "faq": return (
            <div key={i} className="my-2.5">
              {b.items.map((f, j) => (
                <div key={j} className="mb-3.5">
                  <div className="text-sm font-semibold text-deep mb-1">{f.q}</div>
                  <div className="text-[13px] text-slate leading-relaxed pl-3 border-l-[3px] border-seafoam/30">{f.a}</div>
                </div>
              ))}
            </div>
          );
          default: return null;
        }
      })}
    </>
  );
}

// ---------- Main Component ----------

interface PrepContentProps {
  studentEmail?: string;
  initialCompleted?: string[];
}

export default function PrepContent({ studentEmail, initialCompleted = [] }: PrepContentProps) {
  const [active, setActive] = useState<number | null>(null);
  const [completed, setCompleted] = useState<Set<string>>(new Set(initialCompleted));
  const ref = useRef<HTMLDivElement>(null);
  const saving = useRef(false);

  useEffect(() => { ref.current?.scrollTo(0, 0); }, [active]);

  // Persist progress
  const saveProgress = useCallback(async (newCompleted: Set<string>) => {
    if (!studentEmail || saving.current) return;
    saving.current = true;
    try {
      await fetch("/api/portal/prep-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections: Array.from(newCompleted) }),
      });
    } catch { /* silent */ }
    saving.current = false;
  }, [studentEmail]);

  const sec = active !== null ? SECTIONS[active] : null;
  const next = active !== null && active < SECTIONS.length - 1 ? active + 1 : null;
  const allDone = completed.size === SECTIONS.length;

  const advance = () => {
    if (sec) {
      const arr = Array.from(completed);
      arr.push(sec.id);
      const newCompleted = new Set(arr);
      setCompleted(newCompleted);
      saveProgress(newCompleted);
    }
    if (next !== null) setActive(next);
    else setActive(null);
  };

  // ---------- Overview ----------
  if (active === null) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-deep via-ocean to-deep">
        <div className="px-5 pt-9 pb-4 text-center">
          <div className="text-[10px] font-bold text-seafoam uppercase tracking-[3px] mb-2.5">La Jolla Freedive Club</div>
          <h1 className="font-serif text-[30px] text-white font-normal mb-1">AIDA2 Course Prep</h1>
          <p className="text-[13px] text-seafoam/50 mb-4">Your guide to arriving ready on Day 1</p>
          <div className="max-w-[300px] mx-auto">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-[5px] bg-white/[0.12] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-seafoam to-seafoam/60 rounded-full transition-all duration-500"
                  style={{ width: `${Math.round((completed.size / SECTIONS.length) * 100)}%` }} />
              </div>
              <span className="text-[11px] text-white/40">{completed.size}/{SECTIONS.length}</span>
            </div>
          </div>
        </div>

        {allDone && (
          <div className="mx-4 mb-4 p-[18px] bg-seafoam/[0.07] border-2 border-seafoam/25 rounded-xl text-center">
            <div className="text-[28px] mb-1.5">🎉</div>
            <div className="font-serif text-base text-white font-normal">You&apos;re ready for Day 1</div>
            <p className="text-xs text-seafoam/50 mt-1.5 leading-snug">
              Bring your medical statement, waiver, water, sunscreen, and an open mind. See you at the Shores.
            </p>
          </div>
        )}

        <div className="px-3.5 pb-9 max-w-[460px] mx-auto">
          {SECTIONS.map((s, idx) => {
            const done = completed.has(s.id);
            const qc = s.blocks.filter((b) => b.t === "quiz").length;
            return (
              <button key={s.id} onClick={() => setActive(idx)}
                className={`flex w-full items-center gap-3 px-4 py-3.5 mb-1.5 rounded-[10px] cursor-pointer text-left border ${
                  done ? "bg-ocean border-seafoam/20" : "bg-white/[0.03] border-white/[0.07]"
                }`}>
                <div className={`w-[38px] h-[38px] rounded-lg flex items-center justify-center text-lg shrink-0 ${
                  done ? "bg-seafoam/15" : "bg-white/[0.05]"
                }`}>
                  {done ? <span className="text-seafoam">✓</span> : s.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-seafoam font-semibold tracking-[1px]">{s.num}</span>
                    {qc > 0 && !s.hideQC && (
                      <span className="text-[9px] text-white/40 bg-white/[0.08] rounded px-1.5 py-px">{qc} quiz</span>
                    )}
                  </div>
                  <div className="text-sm font-semibold text-white truncate">{s.title}</div>
                  <div className="text-[11px] text-white/40 truncate">{s.subtitle}</div>
                </div>
                <div className="text-white/20 text-base">›</div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ---------- Section View ----------
  if (!sec) return null;
  const secId = sec.id;
  return (
    <div className="min-h-screen bg-salt flex flex-col">
      <div className="bg-deep px-4 py-2.5 flex items-center justify-between sticky top-0 z-10">
        <button onClick={() => setActive(null)} className="bg-none border-none text-seafoam text-[13px] cursor-pointer font-semibold">← All Sections</button>
        <span className="text-[11px] text-white/40">{(active as number) + 1}/{SECTIONS.length}</span>
      </div>

      <div ref={ref} className="flex-1 overflow-auto px-[18px] py-5 pb-[100px] max-w-[560px] mx-auto w-full">
        <div className="mb-[18px]">
          <div className="text-[11px] font-bold text-seafoam tracking-[2px] mb-0.5">SECTION {sec.num}</div>
          <h2 className="font-serif text-2xl text-deep font-normal mb-0.5">{sec.title}</h2>
          <p className="text-[13px] text-slate/60 m-0">{sec.subtitle}</p>
          <div className="w-9 h-[3px] bg-seafoam rounded-full mt-2.5" />
        </div>

        <RenderBlocks blocks={sec.blocks} />

        <div className="mt-[30px] text-center">
          <button onClick={advance}
            className="px-7 py-3 rounded-lg border-none bg-seafoam text-deep text-sm font-bold cursor-pointer w-full max-w-[320px]">
            {next !== null ? `Continue → ${SECTIONS[next].title}` : completed.has(secId) ? "Back to Overview" : "Complete & Finish ✓"}
          </button>
          {!completed.has(secId) && next !== null && (
            <button onClick={() => {
              const arr = Array.from(completed);
              arr.push(secId);
              const nc = new Set(arr);
              setCompleted(nc);
              saveProgress(nc);
              setActive(null);
            }} className="block mx-auto mt-2 bg-none border-none text-slate/50 text-xs cursor-pointer">
              Save progress & return to overview
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
