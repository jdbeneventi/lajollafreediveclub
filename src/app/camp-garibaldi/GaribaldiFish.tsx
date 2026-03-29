export function GaribaldiFish({ size = 100, className = "" }: { size?: number; className?: string }) {
  const h = Math.round(size * 0.8);
  return (
    <svg width={size} height={h} viewBox="0 0 100 80" fill="none" className={className}>
      <ellipse cx="45" cy="40" rx="35" ry="28" fill="#F97316" />
      <ellipse cx="45" cy="40" rx="30" ry="23" fill="#FB923C" />
      <circle cx="25" cy="35" r="5" fill="#1E293B" />
      <circle cx="24" cy="34" r="2" fill="white" />
      <path d="M75 40 Q95 25 85 40 Q95 55 75 40" fill="#F97316" />
      <path d="M45 15 Q55 5 50 20 Q60 10 55 22 Q65 15 58 25" fill="#F97316" />
      <path d="M30 65 Q35 75 40 65" fill="#F97316" />
      <path d="M50 65 Q55 72 60 65" fill="#F97316" />
    </svg>
  );
}

export function GaribaldiFishSmall({ className = "" }: { className?: string }) {
  return (
    <svg width="28" height="22" viewBox="0 0 56 44" fill="none" className={className}>
      <ellipse cx="26" cy="22" rx="18" ry="14" fill="#E8682A" />
      <ellipse cx="26" cy="22" rx="15" ry="11" fill="#F4894D" />
      <path d="M44 22 L56 10 L56 34 Z" fill="#E8682A" />
      <circle cx="15" cy="18" r="3.5" fill="#0B1D2C" />
      <circle cx="14" cy="17" r="1" fill="white" opacity="0.6" />
      <path d="M10 24 Q14 28 18 26" stroke="#C4521C" strokeWidth="1.5" fill="none" opacity="0.5" />
    </svg>
  );
}
