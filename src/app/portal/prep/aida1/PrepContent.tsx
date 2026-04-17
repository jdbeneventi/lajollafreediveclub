"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════════
   AIDA1 Course Prep — Interactive Journey
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
interface VideoBlock { t: "video"; videoId: string; title: string; context: string }
interface ListBlock { t: "list"; items: string[] }
interface PhasesBlock { t: "phases"; items: { name: string; desc: string }[] }
interface ProtocolBlock { t: "protocol"; steps: { letter: string; word: string; desc: string }[] }
interface TechniquesBlock { t: "techniques"; items: { name: string; how: string; note: string }[] }
interface ChecklistBlock { t: "checklist"; items: { item: string; desc: string }[] }
interface GearBlock { t: "gear"; items: { name: string; points: string[] }[] }
interface FaqBlock { t: "faq"; items: { q: string; a: string }[] }

type Block = QuizBlock | TextBlock | SafetyBlock | CalloutBlock | InstructorBlock | DiagramBlock | VideoBlock | ListBlock | PhasesBlock | ProtocolBlock | TechniquesBlock | ChecklistBlock | GearBlock | FaqBlock;

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
    { t: "instructor", text: "Welcome to your AIDA 1 course prep! This is your introduction to freediving — no experience needed, no pressure, just curiosity and a willingness to try something new. I put this guide together so you can show up on course day already familiar with the basics. You don't need to memorize anything. Just read through, try the practice questions, and bring any questions you have. See you at the Shores." },
    { t: "h3", text: "What happens during the course" },
    { t: "p", text: "AIDA 1 is a single-day course. We start with a theory session covering the fundamentals of freediving — how your body works underwater, breathing technique, safety, and equipment. Then we head to La Jolla Shores for the water session where everything comes together." },
    { t: "p", text: "At the Shores, we'll start in the shallows with your swim assessment and breath-hold practice (Static Apnea). Once you're comfortable, we move to the line for your first freedives — duck dives, descents, and finning technique, all within 10 meters of depth." },
    { t: "callout", label: "The most important thing you can bring", text: "A willingness to relax. Freediving is one of the few sports where trying harder makes you worse. The students who progress fastest are the ones who learn to let go." },
  ]},
  { id: "nerves", num: "01", title: "It's Normal to Be Nervous", subtitle: "What everyone worries about", icon: "💭", hideQC: true, blocks: [
    { t: "p", text: "Almost every student shows up with some version of these worries. You're not alone — and none of them are reasons not to do this." },
    { t: "faq", items: [
      { q: "\"What if I can't hold my breath long enough?\"", a: "You can. Most people hold 60–90 seconds with zero training. After learning the relaxation technique, that number typically doubles. We're not chasing records — we're building comfort." },
      { q: "\"What if I panic underwater?\"", a: "You stop and surface. That's not failure — that's good freediving. We build depth gradually. You always have the line to hold onto. I'm right there with you." },
      { q: "\"What if I can't equalize my ears?\"", a: "Equalization is the most common question and it's completely learnable. We'll practice on dry land first, then in shallow water. There's a section below with video tutorials." },
      { q: "\"I'm not a strong swimmer — is that okay?\"", a: "You need to swim 100m non-stop (about 4 pool lengths). It doesn't have to be fast or pretty. If you can do that, you're good. We'll do the swim assessment at the Shores before diving." },
      { q: "\"Is it dangerous?\"", a: "With proper training and a buddy, freediving is very safe. The dangerous things — diving alone, hyperventilating, ignoring your body's signals — are exactly what this course teaches you NOT to do." },
    ]},
    { t: "instructor", text: "If you have fears not on this list, bring them on course day. Seriously. The students who share what they're feeling always have a better experience than those who push through silently." },
  ]},
  { id: "physiology", num: "02", title: "How Your Body Works", subtitle: "The science behind breath holding", icon: "🫁", blocks: [
    { t: "p", text: "You don't need to become a scientist — just grasping a few key concepts will completely change your first breath hold." },
    { t: "h3", text: "The Respiratory System" },
    { t: "p", text: "Air enters through your mouth (your nose is covered by your mask), travels down the trachea, and reaches the alveoli — tiny air sacs in your lungs where gas exchange happens. Oxygen (O₂) enters your blood; carbon dioxide (CO₂) exits to be exhaled." },
    { t: "diagram", id: "respiratory" },
    { t: "h3", text: "The Key Insight: CO₂ Drives Your Urge to Breathe" },
    { t: "p", text: "Most people assume they need to breathe because they're running out of oxygen. That's not what's happening. Your urge to breathe is triggered by rising CO₂ levels — a waste product your body produces constantly. When CO₂ builds up, your brain says \"breathe.\"" },
    { t: "callout", label: "Think of it like this", text: "O₂ is the gas in your tank. CO₂ is the fuel gauge. The urge to breathe is your gauge telling you where you are — but you still have plenty of gas left." },
    { t: "p", text: "This means the discomfort you feel during a breath hold is normal and expected. It's not an emergency — it's information. Learning to stay relaxed through that discomfort is the core skill of freediving." },
    { t: "quiz", q: "Your urge to breathe during a breath hold is primarily caused by:", type: "mc", options: ["Lack of oxygen", "Rising CO₂ levels", "Water pressure", "Muscle fatigue"], answer: 1, explain: "Breathing is regulated mainly by CO₂, not O₂. The urge arrives well before oxygen is actually a concern." },
    { t: "h3", text: "Hyperventilation — Why It's Dangerous" },
    { t: "safety", text: "Hyperventilation (rapid, exaggerated breathing) artificially lowers CO₂. This does NOT add oxygen. It suppresses the warning signals that tell you when to surface. You can lose consciousness without ever feeling the urge to breathe. This is the #1 cause of freediving accidents." },
    { t: "p", text: "Symptoms of hyperventilation: tingling in fingers or lips, lightheadedness, dizziness, euphoria, metallic taste. If you feel any of these — stop, breathe normally, and do not dive." },
    { t: "quiz", q: "Hyperventilation stores significantly more oxygen in the blood.", type: "tf", answer: false, explain: "It lowers CO₂ (removing your warning system) but does NOT increase oxygen storage. Very dangerous." },
  ]},
  { id: "breathing", num: "03", title: "The Breathing Cycle", subtitle: "Four phases for every dive", icon: "🌊", blocks: [
    { t: "p", text: "Now that you understand why CO₂ matters, here's the practical breathing framework you'll use before, during, and after every breath hold." },
    { t: "video", videoId: "3aXxXCXptYA", title: "Breath-Up & Breathing for Freediving", context: "Watch the full relaxation and breath-up sequence. This is the technique you'll use before every dive and breath hold." },
    { t: "phases", items: [
      { name: "1. Relaxation Phase", desc: "1–2 minutes of calm belly breathing. Let your body and mind settle. Breathe normally — don't force deeper or faster breaths. This is where most of the magic happens." },
      { name: "2. One Full Breath", desc: "A single slow, deep inhalation — belly first (using your diaphragm), then chest. Comfortable fullness, not maximum tension. Think 85%, not 100%." },
      { name: "3. Breath Hold", desc: "The dive or static hold. Stay relaxed. Accept the rising CO₂. If contractions come (your diaphragm twitching), that's normal — let them happen." },
      { name: "4. Recovery Breathing", desc: "Minimum 3 recovery breaths after surfacing. A dive isn't over until you've recovered and given the OK sign to your buddy." },
    ]},
    { t: "h3", text: "Recovery Breathing" },
    { t: "p", text: "This is a safety technique you'll train until it's automatic: passive half-exhale → strong quick inhale → brief hold → controlled exhale through pursed lips. Repeat at least 3 times after every breath hold." },
    { t: "diagram", id: "recovery" },
    { t: "quiz", q: "Recovery breathing starts with:", type: "mc", options: ["A deep slow inhale from the diaphragm", "A passive half-exhale followed by a strong inhale", "A full forceful exhale", "Holding your breath for 5 seconds"], answer: 1, explain: "Passive half-exhale, then strong quick inhale, then controlled pursed-lip exhale. This restores O₂ fast." },
    { t: "instructor", text: "Recovery breathing is the one thing I want you to have down before course day. Practice it a few times at home — just take a breath hold on the couch, then do 3 recovery breaths. It should feel automatic in the water." },
  ]},
  { id: "equalization", num: "04", title: "Equalization", subtitle: "Protecting your ears underwater", icon: "👂", blocks: [
    { t: "p", text: "As you go deeper, water pressure increases and compresses the air spaces in your body — especially your ears. Equalization means gently sending air into your middle ear to balance the pressure and prevent discomfort." },
    { t: "diagram", id: "ear" },
    { t: "safety", text: "Equalize early and often — at the very first hint of pressure, before it becomes uncomfortable. Never push through ear pain. If equalization isn't working, stop descending and come back up. Some ear injuries can be permanent." },
    { t: "h3", text: "Two Techniques You Should Know" },
    { t: "techniques", items: [
      { name: "Valsalva", how: "Pinch your nose and gently blow against your closed nostrils. You should feel a small 'pop' or pressure release in your ears.", note: "The simplest method. Works well for AIDA 1 depths (max 10m). Most beginners start here." },
      { name: "Frenzel", how: "Pinch your nose and use your tongue as a piston — push the back of your tongue up against the roof of your mouth to compress air into your ears.", note: "More advanced but worth learning. No chest tension, works at any depth. The standard for serious freediving." },
    ]},
    { t: "video", videoId: "Mo07gZR741M", title: "How to Frenzel Equalize — Adam Stern", context: "Australian record holder walks through the tongue movements step by step. Practice in front of a mirror — even 5 minutes a day before the course helps." },
    { t: "callout", label: "Don't stress about Frenzel yet", text: "Valsalva is perfectly fine for AIDA 1 depths. If Frenzel clicks for you, great. If not, we'll work on it in the water. Many people learn it better when they can feel the pressure to equalize against." },
    { t: "quiz", q: "When should you equalize during a descent?", type: "mc", options: ["Only when your ears start hurting", "At the first hint of pressure, before discomfort", "Every 5 meters", "Only at the bottom"], answer: 1, explain: "Early and often. If you wait until it hurts, you've waited too long." },
    { t: "quiz", q: "If you can't equalize, you should:", type: "mc", options: ["Push harder", "Keep descending slowly", "Stop and ascend", "Swallow water"], answer: 2, explain: "Never force it. Stop, try once more gently, and if it won't clear — come up. There's always the next dive." },
  ]},
  { id: "safety", num: "05", title: "Safety & the Buddy System", subtitle: "Why we never dive alone", icon: "🛟", blocks: [
    { t: "safety", text: "The #1 rule of freediving: always dive with a buddy. One person dives, one person watches from the surface. No exceptions. Solo breath-hold diving is the leading cause of freediving fatalities." },
    { t: "p", text: "In your course, I'm your safety buddy. But learning these concepts now means you'll understand what's happening and why we follow specific protocols." },
    { t: "h3", text: "LMC (Loss of Motor Control)" },
    { t: "p", text: "Sometimes after a long breath hold, a diver surfaces and their body does involuntary twitchy movements — like shivering or jerky arm motions. This is called LMC (Loss of Motor Control) or a \"samba.\" It means oxygen got low. The diver is usually still conscious." },
    { t: "p", text: "Response: hold their airways above water, remove their mask, and coach them through recovery breaths. The diver should stop diving for the day." },
    { t: "h3", text: "Blackout" },
    { t: "p", text: "A blackout is a full loss of consciousness from low oxygen. It's rare in recreational freediving when you follow the rules, but you need to know how to respond." },
    { t: "p", text: "Warning signs (in yourself): ear ringing, sudden warmth, the dive feeling oddly easy, tunnel vision, fuzzy thinking. If you feel any of these — surface immediately." },
    { t: "quiz", q: "Blackout warning symptoms include:", type: "multi", options: ["Sudden warmth", "Ear ringing", "Tunnel vision", "Strong confident fin kick"], answer: [0, 1, 2], explain: "Warmth, ringing, and tunnel vision are hypoxia warnings. A strong kick is normal and fine." },
    { t: "h3", text: "The SAFE Protocol" },
    { t: "p", text: "If a diver is unresponsive at the surface, this is what you do:" },
    { t: "protocol", steps: [
      { letter: "S", word: "Surface", desc: "Get the diver to the surface. Secure their airway." },
      { letter: "A", word: "Airways", desc: "Keep nose and mouth above water at all times." },
      { letter: "FE", word: "Facial Equipment", desc: "Remove mask, nose clip, goggles — expose the face." },
    ]},
    { t: "callout", label: "Then: BTT (Blow, Tap, Talk)", text: "Blow across their nose and eyes. Tap both cheeks firmly. Talk: \"[Name], breathe!\" Repeat for 10–15 seconds. If no response → rescue breaths → CPR → call emergency services." },
    { t: "p", text: "We'll practice this in the water during the course. By the end, it'll feel natural." },
    { t: "quiz", q: "The most common cause of blackout in freediving is:", type: "mc", options: ["Deep water pressure", "Hyperventilation before a dive", "Cold water shock", "Equipment failure"], answer: 1, explain: "Hyperventilation lowers CO₂, removing warning signals and letting divers unknowingly push past safe limits." },
    { t: "instructor", text: "Safety isn't scary — it's empowering. Knowing what to do if something goes wrong means you can enjoy freediving with real confidence. We practice rescue on every course." },
  ]},
  { id: "risk", num: "06", title: "Good Habits from Day One", subtitle: "Simple rules that keep it safe", icon: "✅", blocks: [
    { t: "p", text: "Freediving has an excellent safety record when people follow basic rules. These are the habits we'll reinforce throughout the course:" },
    { t: "checklist", items: [
      { item: "Always dive with a buddy", desc: "One up, one down. Every time." },
      { item: "Never hyperventilate", desc: "Calm, normal breathing before a dive. No fast or exaggerated breaths." },
      { item: "Recovery breathe after every dive", desc: "Minimum 3 recovery breaths + OK sign. Train it on easy dives." },
      { item: "Listen to your body", desc: "Feeling off? Don't dive. Underwater and uncomfortable? Come up." },
      { item: "Stay hydrated", desc: "Water + electrolytes. Being in the ocean suppresses your sense of thirst." },
      { item: "Snorkel out before diving", desc: "Always remove your snorkel from your mouth before you go under." },
      { item: "Rest between dives", desc: "Surface interval should be at least 2–3 times your dive time." },
      { item: "Don't dive when sick", desc: "Congestion makes equalization difficult and potentially dangerous." },
    ]},
    { t: "quiz", q: "Your surface rest interval between dives should be at least:", type: "mc", options: ["30 seconds", "Equal to your dive time", "2–3 times your dive time", "10 minutes"], answer: 2, explain: "If your dive was 1 minute, rest at least 2–3 minutes before the next one." },
  ]},
  { id: "equipment", num: "07", title: "Equipment", subtitle: "What you'll use and why", icon: "🤿", blocks: [
    { t: "p", text: "Good technique matters more than expensive gear. Here's what you'll be using in the course:" },
    { t: "gear", items: [
      { name: "Mask", points: ["Must enclose your nose (for equalization)", "Low volume is better for freediving", "Good fit matters more than price", "Clear lenses help your buddy see your eyes"] },
      { name: "Snorkel", points: ["Used for surface breathing only", "Simple and rigid preferred", "Always remove from mouth before diving"] },
      { name: "Bi-Fins", points: ["Two separate fins (not a monofin)", "Full foot pocket — like a shoe", "Kick from hips, not knees", "Start with short/soft fins for learning technique"] },
      { name: "Wetsuit", points: ["Keeps you warm and adds buoyancy", "3mm is fine for San Diego in warmer months", "5mm for winter/spring"] },
      { name: "Weight Belt", points: ["Rubber or silicone, worn on hips", "Quick-release buckle (safety requirement)", "Compensates for wetsuit buoyancy", "We'll figure out the right amount together"] },
    ]},
    { t: "callout", label: "Gear for the course", text: "If you have your own mask, snorkel, and fins — bring them. If not, let Joshua know your height, weight, and shoe size and we'll sort out gear for you. If you're thinking of buying anything, a well-fitting mask is the best first investment." },
    { t: "quiz", q: "The most important factor when choosing a freediving mask is:", type: "mc", options: ["Brand name", "Color", "Good fit and low volume", "Maximum field of view"], answer: 2, explain: "Fit and low volume. A mask that leaks or has lots of air space makes everything harder." },
    { t: "instructor", text: "Don't buy anything before the course unless you want to. We'll talk about what gear makes sense for you based on how the day goes and whether you want to continue into AIDA 2." },
  ]},
  { id: "swim", num: "08", title: "The Swim Assessment", subtitle: "What to expect at La Jolla Shores", icon: "🏊", hideQC: true, blocks: [
    { t: "p", text: "Before we start the freediving portion, you'll do a swim assessment: 100 meters non-stop in the ocean at La Jolla Shores. That's roughly equivalent to 4 lengths of a standard pool." },
    { t: "callout", label: "It doesn't have to be fast", text: "Any stroke is fine. It's not timed. The goal is just to confirm you're comfortable swimming in the ocean without stopping. If you can swim 100m in a pool, you can do this." },
    { t: "h3", text: "What to expect at La Jolla Shores" },
    { t: "p", text: "La Jolla Shores is a sandy beach with a gentle entry — no rocks to navigate. We'll walk in together, do the swim assessment in the shallows, then move into breath-hold practice before heading to the line for depth dives." },
    { t: "p", text: "The water at La Jolla Shores is usually calm in the morning, especially on weekdays. Visibility varies but is often quite good. The submarine canyon drops off nearby, which is what gives us easy access to depth." },
    { t: "instructor", text: "If you're not a confident ocean swimmer, get a few swims in at a pool before the course. 100m is not much, but I want you to feel comfortable — not stressed — when we start." },
  ]},
  { id: "logistics", num: "09", title: "Course Day Logistics", subtitle: "Where, when, what to bring", icon: "📍", hideQC: true, blocks: [
    { t: "callout", label: "Meeting Location & Time", text: "Joshua will send you the exact meeting point, time, and any parking details individually before your course date." },
    { t: "h3", text: "How the Day Flows" },
    { t: "p", text: "Morning: theory session (about 2.5 hours) either in person at the studio or via Zoom. Then we head to La Jolla Shores for the water session (about 2.5 hours). The whole day is roughly 6 hours." },
    { t: "h3", text: "What to Bring" },
    { t: "list", items: ["Swimsuit + towel", "Reef-safe sunscreen", "Water bottle + electrolytes", "Light snack for between sessions", "Completed AIDA medical statement + signed waiver", "Personal gear if you have it — otherwise we provide everything", "Positive attitude and an open mind"] },
    { t: "h3", text: "What to Eat" },
    { t: "p", text: "Light and easy to digest. Banana, toast, a light smoothie — 1–2 hours before the water session. Avoid dairy, caffeine, and spicy food — they can increase mucus production and make equalization harder." },
    { t: "h3", text: "Night Before" },
    { t: "p", text: "No alcohol. Get good sleep. Don't cram this guide — you already know enough. The real learning happens in the water." },
    { t: "h3", text: "Paperwork" },
    { t: "p", text: "You'll need to complete the AIDA Medical Form and Liability Release before the course. You can do both digitally here:" },
    { t: "callout", label: "Complete Your Forms", text: "lajollafreediveclub.com/forms/aida — Takes about 10 minutes. Do this before course day so we can spend all our time in the water." },
    { t: "instructor", text: "If anything comes up — running late, feeling sick, midnight question about gear — just text me. I'd rather hear from you than have you stress about it." },
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
        body: JSON.stringify({ course: "aida1", sections: Array.from(newCompleted) }),
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
          <h1 className="font-serif text-[30px] text-white font-normal mb-1">AIDA1 Course Prep</h1>
          <p className="text-[13px] text-seafoam/50 mb-1">Introduction to Freediving</p>
          <p className="text-[11px] text-white/30 mb-4">Your guide to arriving ready on course day</p>
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
            <div className="font-serif text-base text-white font-normal">You&apos;re ready for course day</div>
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
