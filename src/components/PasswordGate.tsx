"use client";

import { useState, ReactNode } from "react";

export function PasswordGate({
  children,
  code = "ljfc",
}: {
  children: ReactNode;
  code?: string;
}) {
  const [unlocked, setUnlocked] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  if (unlocked) return <>{children}</>;

  return (
    <div className="min-h-screen bg-deep flex items-center justify-center px-6">
      <div className="max-w-[360px] w-full text-center">
        <div className="text-[11px] text-seafoam/50 font-medium tracking-[0.2em] uppercase mb-4">
          Private
        </div>
        <h1 className="font-serif text-3xl text-white mb-2">Enter code</h1>
        <p className="text-white/30 text-sm mb-8">
          This page is invite-only.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (input.toLowerCase().trim() === code.toLowerCase()) {
              setUnlocked(true);
              setError(false);
            } else {
              setError(true);
            }
          }}
          className="flex gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError(false);
            }}
            placeholder="Code"
            autoFocus
            className="flex-1 px-5 py-3 rounded-full bg-white/[0.06] border border-white/10 text-white text-sm outline-none focus:border-seafoam transition-colors placeholder:text-white/20 text-center tracking-widest"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-full bg-seafoam text-deep font-semibold text-sm cursor-pointer border-none hover:-translate-y-0.5 transition-all"
          >
            Enter
          </button>
        </form>
        {error && (
          <p className="text-coral/70 text-xs mt-3">Incorrect code.</p>
        )}
      </div>
    </div>
  );
}
