// Moon phase calculator using synodic period method
// Accurate to within ~1 day — sufficient for dive planning

const SYNODIC_MONTH = 29.53058770576; // days
const KNOWN_NEW_MOON = new Date("2024-01-11T11:57:00Z").getTime(); // known new moon reference

export interface MoonPhase {
  phase: string;
  emoji: string;
  illumination: number; // 0-100
  age: number; // days into cycle (0 = new moon)
  isSpringTide: boolean;
  isNeapTide: boolean;
  diveTip: string;
  nightDiveTip: string;
}

export function getMoonPhase(date: Date = new Date()): MoonPhase {
  const diffMs = date.getTime() - KNOWN_NEW_MOON;
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  const age = ((diffDays % SYNODIC_MONTH) + SYNODIC_MONTH) % SYNODIC_MONTH;

  // Illumination approximation (cosine curve)
  const illumination = Math.round((1 - Math.cos((age / SYNODIC_MONTH) * 2 * Math.PI)) / 2 * 100);

  // Phase name and emoji
  let phase: string;
  let emoji: string;

  if (age < 1.85) { phase = "New Moon"; emoji = "🌑"; }
  else if (age < 5.53) { phase = "Waxing Crescent"; emoji = "🌒"; }
  else if (age < 9.22) { phase = "First Quarter"; emoji = "🌓"; }
  else if (age < 12.91) { phase = "Waxing Gibbous"; emoji = "🌔"; }
  else if (age < 16.61) { phase = "Full Moon"; emoji = "🌕"; }
  else if (age < 20.30) { phase = "Waning Gibbous"; emoji = "🌖"; }
  else if (age < 23.99) { phase = "Last Quarter"; emoji = "🌗"; }
  else if (age < 27.68) { phase = "Waning Crescent"; emoji = "🌘"; }
  else { phase = "New Moon"; emoji = "🌑"; }

  // Spring tides: within 2 days of new or full moon
  const isSpringTide = age < 2 || (age > 12.9 && age < 16.7) || age > 27.5;
  // Neap tides: within 2 days of quarter moons
  const isNeapTide = (age > 5.5 && age < 9.3) || (age > 20.3 && age < 24);

  // Dive tips
  let diveTip: string;
  if (isSpringTide) {
    diveTip = "Spring tide — expect larger tidal swings and stronger currents. More water movement can improve visibility on the incoming tide but creates stronger pull on the outgoing.";
  } else if (isNeapTide) {
    diveTip = "Neap tide — smaller tidal swings and gentler currents. Great conditions for beginners and longer sessions. Less water exchange means visibility changes less dramatically.";
  } else {
    diveTip = "Moderate tidal range. Standard conditions — check swell and wind for the full picture.";
  }

  let nightDiveTip: string;
  if (illumination < 15) {
    nightDiveTip = "Dark moon — best bioluminescence. The darker the sky, the brighter the blue glow. Also best conditions for market squid runs (winter).";
  } else if (illumination > 85) {
    nightDiveTip = "Bright moon — underwater ambient light is surprisingly good on full moon nights. Bioluminescence will be less visible but you can see the reef structure in the moonlight.";
  } else {
    nightDiveTip = "Moderate moonlight. Good balance for night diving — some ambient light with decent bioluminescence potential.";
  }

  return {
    phase,
    emoji,
    illumination,
    age: Math.round(age * 10) / 10,
    isSpringTide,
    isNeapTide,
    diveTip,
    nightDiveTip,
  };
}

// Get next occurrence of a phase
export function getNextFullMoon(from: Date = new Date()): Date {
  const phase = getMoonPhase(from);
  const daysToFull = phase.age < 14.77 ? 14.77 - phase.age : SYNODIC_MONTH - phase.age + 14.77;
  return new Date(from.getTime() + daysToFull * 24 * 60 * 60 * 1000);
}

export function getNextNewMoon(from: Date = new Date()): Date {
  const phase = getMoonPhase(from);
  const daysToNew = SYNODIC_MONTH - phase.age;
  return new Date(from.getTime() + daysToNew * 24 * 60 * 60 * 1000);
}
