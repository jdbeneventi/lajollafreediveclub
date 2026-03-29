export function GaribaldiFish({ size = 120, className = "" }: { size?: number; className?: string }) {
  const h = Math.round(size * 0.8);
  return (
    <svg width={size} height={h} viewBox="0 0 120 96" fill="none" className={className}>
      <ellipse cx="56" cy="48" rx="38" ry="30" fill="#E8682A" />
      <ellipse cx="56" cy="48" rx="32" ry="24" fill="#F4894D" />
      <path d="M94 48 L118 22 L118 74 Z" fill="#E8682A" />
      <path d="M94 48 L110 28 L110 68 Z" fill="#C4521C" opacity="0.35" />
      <circle cx="34" cy="40" r="7" fill="#0B1D2C" />
      <circle cx="32" cy="38" r="2.5" fill="white" opacity="0.7" />
      <path d="M24 54 Q34 62 44 58" stroke="#C4521C" strokeWidth="2" fill="none" opacity="0.5" />
      <ellipse cx="50" cy="60" rx="8" ry="3" fill="#C4521C" opacity="0.2" />
      <path d="M40 20 C50 10 68 14 64 30" fill="#C4521C" opacity="0.4" />
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
