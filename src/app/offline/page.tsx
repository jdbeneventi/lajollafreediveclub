"use client";

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-deep flex items-center justify-center px-6">
      <div className="max-w-[400px] text-center">
        <div className="text-5xl mb-6 opacity-60">🌊</div>
        <h1 className="font-serif text-3xl text-salt mb-3">You&apos;re offline</h1>
        <p className="text-salt/60 text-sm leading-relaxed mb-6">
          Can&apos;t reach the ocean data right now. Check your connection and try
          again — the conditions will be here when you&apos;re back.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-teal text-salt rounded-full text-sm font-medium hover:opacity-85 transition-opacity"
        >
          Try again
        </button>
        <p className="text-salt/20 text-xs mt-8">La Jolla Freedive Club</p>
      </div>
    </div>
  );
}
