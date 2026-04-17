/* ═══════════════════════════════════════════════════════════════════
   LJFC Certification & Journey System
   Defines AIDA cert levels, requirements, and progression logic
   ═══════════════════════════════════════════════════════════════════ */

export type CertLevel = "aida1" | "aida2" | "aida3" | "aida4";

export interface Requirement {
  id: string;
  label: string;
  category: "form" | "theory" | "pool" | "openwater" | "prep";
  description?: string;
}

export interface Certification {
  id: CertLevel;
  name: string;
  fullName: string;
  subtitle: string;
  maxDepth: string;
  duration: string;
  price: number;
  pricePrivate?: number;
  prereq: CertLevel | null;
  requirements: Requirement[];
  color: string;
  prepGuide?: string; // route to prep guide if available
}

export const CERTIFICATIONS: Record<CertLevel, Certification> = {
  aida1: {
    id: "aida1",
    name: "AIDA 1",
    fullName: "Discover Freediving",
    subtitle: "Your first breath hold in the ocean",
    maxDepth: "5m",
    duration: "Half day",
    price: 200,
    prereq: null,
    color: "#3db8a4", // seafoam
    prepGuide: "/portal/prep/aida1",
    requirements: [
      { id: "a1-waiver", label: "LJFC Waiver", category: "form" },
      { id: "a1-medical", label: "AIDA Medical Statement", category: "form" },
      { id: "a1-liability", label: "AIDA Liability Release", category: "form" },
      { id: "a1-prep", label: "Course Prep Guide", category: "prep", description: "Complete the interactive prep guide" },
      { id: "a1-theory", label: "Introduction to freediving theory", category: "theory" },
      { id: "a1-breathing", label: "Breathing & relaxation technique", category: "pool" },
      { id: "a1-static", label: "Static breath hold (pool)", category: "pool" },
      { id: "a1-dynamic", label: "Dynamic swim (pool)", category: "pool" },
      { id: "a1-ow-dive", label: "Open water dive to 5m", category: "openwater" },
      { id: "a1-buddy", label: "Basic buddy safety", category: "openwater" },
    ],
  },
  aida2: {
    id: "aida2",
    name: "AIDA 2",
    fullName: "AIDA 2 Freediver",
    subtitle: "The international beginner certification",
    maxDepth: "20m",
    duration: "2–3 days",
    price: 575,
    pricePrivate: 800,
    prereq: null,
    color: "#1B6B6B", // teal
    prepGuide: "/portal/prep/aida2",
    requirements: [
      // Forms
      { id: "a2-waiver", label: "LJFC Waiver", category: "form" },
      { id: "a2-medical", label: "AIDA Medical Statement", category: "form" },
      { id: "a2-liability", label: "AIDA Liability Release", category: "form" },
      // Prep
      { id: "a2-prep", label: "Course Prep Guide", category: "prep", description: "Complete the interactive prep guide" },
      // Theory
      { id: "a2-physiology", label: "Physiology of breath holding", category: "theory" },
      { id: "a2-equalization", label: "Equalization theory & technique", category: "theory" },
      { id: "a2-safety-theory", label: "Safety: LMC, blackout, hyperventilation", category: "theory" },
      { id: "a2-boyles", label: "Boyle's Law & pressure/volume", category: "theory" },
      { id: "a2-equipment", label: "Equipment selection & use", category: "theory" },
      { id: "a2-exam", label: "Written exam (pass)", category: "theory" },
      // Pool
      { id: "a2-static", label: "Static apnea ≥ 2:00", category: "pool" },
      { id: "a2-dynamic", label: "Dynamic apnea ≥ 40m", category: "pool" },
      { id: "a2-rescue-pool", label: "Rescue scenario (pool)", category: "pool" },
      // Open Water
      { id: "a2-duck", label: "Duck dive technique", category: "openwater" },
      { id: "a2-cwt", label: "Constant weight dive to 12–20m", category: "openwater" },
      { id: "a2-recovery", label: "Recovery breathing demonstration", category: "openwater" },
      { id: "a2-rescue-ow", label: "Rescue from 5m", category: "openwater" },
      { id: "a2-buddy-ow", label: "Buddy system & surface protocol", category: "openwater" },
    ],
  },
  aida3: {
    id: "aida3",
    name: "AIDA 3",
    fullName: "AIDA 3 Advanced Freediver",
    subtitle: "Depth, technique, and confidence",
    maxDepth: "30m",
    duration: "3–4 days",
    price: 700,
    pricePrivate: 950,
    prereq: "aida2",
    color: "#163B4E", // ocean
    requirements: [
      { id: "a3-waiver", label: "LJFC Waiver", category: "form" },
      { id: "a3-medical", label: "AIDA Medical Statement", category: "form" },
      { id: "a3-liability", label: "AIDA Liability Release", category: "form" },
      { id: "a3-physiology", label: "Advanced physiology & training", category: "theory" },
      { id: "a3-frenzel", label: "Frenzel equalization mastery", category: "theory" },
      { id: "a3-training-theory", label: "Training program design", category: "theory" },
      { id: "a3-advanced-safety", label: "Advanced safety & risk management", category: "theory" },
      { id: "a3-exam", label: "Written exam (pass)", category: "theory" },
      { id: "a3-static", label: "Static apnea ≥ 2:45", category: "pool" },
      { id: "a3-dynamic", label: "Dynamic apnea ≥ 55m", category: "pool" },
      { id: "a3-rescue-pool", label: "Advanced rescue scenario (pool)", category: "pool" },
      { id: "a3-cwt", label: "Constant weight dive to 24–30m", category: "openwater" },
      { id: "a3-frc", label: "FRC (exhale) dive demonstration", category: "openwater" },
      { id: "a3-rescue-ow", label: "Rescue from 10m", category: "openwater" },
      { id: "a3-line-setup", label: "Line & buoy setup", category: "openwater" },
    ],
  },
  aida4: {
    id: "aida4",
    name: "AIDA 4",
    fullName: "AIDA 4 Master Freediver",
    subtitle: "The highest recreational certification",
    maxDepth: "40m+",
    duration: "4–5 days",
    price: 950,
    prereq: "aida3",
    color: "#0B1D2C", // deep
    requirements: [
      { id: "a4-waiver", label: "LJFC Waiver", category: "form" },
      { id: "a4-medical", label: "AIDA Medical Statement", category: "form" },
      { id: "a4-liability", label: "AIDA Liability Release", category: "form" },
      { id: "a4-physiology", label: "Expert physiology & adaptation", category: "theory" },
      { id: "a4-mouthfill", label: "Mouthfill equalization", category: "theory" },
      { id: "a4-coaching", label: "Coaching & mentoring skills", category: "theory" },
      { id: "a4-exam", label: "Written exam (pass)", category: "theory" },
      { id: "a4-static", label: "Static apnea ≥ 3:30", category: "pool" },
      { id: "a4-dynamic", label: "Dynamic apnea ≥ 70m", category: "pool" },
      { id: "a4-cwt", label: "Constant weight dive to 32–40m", category: "openwater" },
      { id: "a4-free-immersion", label: "Free immersion dive", category: "openwater" },
      { id: "a4-rescue-ow", label: "Rescue from 15m", category: "openwater" },
    ],
  },
};

export const CERT_ORDER: CertLevel[] = ["aida1", "aida2", "aida3", "aida4"];

export function getCert(level: CertLevel): Certification {
  return CERTIFICATIONS[level];
}

export function getNextCert(current: CertLevel | null): CertLevel | null {
  if (!current) return "aida2"; // AIDA 2 is the standard entry point
  const idx = CERT_ORDER.indexOf(current);
  if (idx === -1 || idx >= CERT_ORDER.length - 1) return null;
  return CERT_ORDER[idx + 1];
}

export function getProgressPercent(completedIds: string[], level: CertLevel): number {
  const cert = CERTIFICATIONS[level];
  if (!cert) return 0;
  const done = cert.requirements.filter((r) => completedIds.includes(r.id)).length;
  return Math.round((done / cert.requirements.length) * 100);
}

export function getCategoryProgress(
  completedIds: string[],
  level: CertLevel,
  category: Requirement["category"]
): { done: number; total: number } {
  const cert = CERTIFICATIONS[level];
  const reqs = cert.requirements.filter((r) => r.category === category);
  const done = reqs.filter((r) => completedIds.includes(r.id)).length;
  return { done, total: reqs.length };
}
