export function Logo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="20" cy="20" r="19" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
      <path
        d="M12 26 C16 18, 20 14, 20 10 C20 14, 24 18, 28 26"
        stroke="white"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M14 24 C17 20, 20 18, 20 15 C20 18, 23 20, 26 24"
        stroke="rgba(61,184,164,0.6)"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="20" cy="10" r="2" fill="white" opacity="0.9" />
    </svg>
  );
}
