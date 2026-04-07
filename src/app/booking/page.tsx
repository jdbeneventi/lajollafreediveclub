"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const COURSES = [
  { id: "aida1", name: "AIDA 1 — Discover Freediving", price: 200, duration: "Half day" },
  { id: "aida2-group", name: "AIDA 2 Certification (Group)", price: 575, duration: "3 days" },
  { id: "aida2-private", name: "AIDA 2 Certification (Private)", price: 800, duration: "Flexible" },
  { id: "aida3-group", name: "AIDA 3 — Advanced (Group)", price: 700, duration: "3-4 days" },
  { id: "aida3-private", name: "AIDA 3 — Advanced (Private)", price: 950, duration: "Flexible" },
  { id: "private-coaching", name: "Private Coaching Session", price: 150, duration: "2-3 hours" },
  { id: "camp-3day", name: "Camp Garibaldi — 3 Day", price: 450, duration: "3 days" },
  { id: "camp-5day", name: "Camp Garibaldi — 5 Day", price: 750, duration: "5 days" },
];

function BookingInner() {
  const params = useSearchParams();
  const preselect = params.get("course") || "";
  const cancelled = params.get("cancelled") === "true";

  const [courseId, setCourseId] = useState(preselect);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dates, setDates] = useState("");
  const [paymentType, setPaymentType] = useState<"full" | "deposit">("full");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selected = COURSES.find(c => c.id === courseId);
  const amount = selected ? (paymentType === "deposit" ? Math.round(selected.price / 2) : selected.price) : 0;
  const fee = amount ? Math.round(amount * 0.029 + 0.30) : 0;
  const total = amount + fee;

  const handleCheckout = async () => {
    if (!courseId || !email || !name) {
      setError("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, email, name, dates, paymentType }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Checkout failed.");
        setLoading(false);
      }
    } catch {
      setError("Network error. Try again.");
      setLoading(false);
    }
  };

  return (
    <>
      <section className="bg-gradient-to-b from-deep to-ocean pt-36 pb-16 px-6 text-center">
        <h1 className="font-serif text-[clamp(2rem,4vw,3rem)] text-white leading-tight tracking-tight mb-4">
          Book &amp; Pay
        </h1>
        <p className="text-white/50 text-sm max-w-[480px] mx-auto">
          Select your course, choose full payment or 50% deposit, and check out securely via Stripe.
        </p>
      </section>

      <section className="bg-salt py-16 px-6">
        <div className="max-w-[560px] mx-auto">
          {cancelled && (
            <div className="bg-coral/10 border border-coral/20 rounded-xl p-4 mb-6 text-coral text-sm text-center">
              Payment was cancelled. You can try again below.
            </div>
          )}

          <div className="bg-white rounded-2xl p-6 md:p-8 space-y-6">
            {/* Course selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Course *</label>
              <select
                value={courseId}
                onChange={e => setCourseId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-salt border border-deep/10 text-deep outline-none focus:border-teal transition-colors text-sm"
              >
                <option value="">Select a course...</option>
                {COURSES.map(c => (
                  <option key={c.id} value={c.id}>{c.name} — ${c.price}</option>
                ))}
              </select>
            </div>

            {/* Name + Email */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name *</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required className="w-full px-4 py-3 rounded-xl bg-salt border border-deep/10 text-deep outline-none focus:border-teal transition-colors text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email *</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" required className="w-full px-4 py-3 rounded-xl bg-salt border border-deep/10 text-deep outline-none focus:border-teal transition-colors text-sm" />
              </div>
            </div>

            {/* Dates */}
            <div>
              <label className="block text-sm font-medium mb-2">Preferred Dates</label>
              <input value={dates} onChange={e => setDates(e.target.value)} placeholder="e.g. May 29-31 or flexible" className="w-full px-4 py-3 rounded-xl bg-salt border border-deep/10 text-deep outline-none focus:border-teal transition-colors text-sm" />
            </div>

            {/* Payment type */}
            {selected && selected.price > 200 && (
              <div>
                <label className="block text-sm font-medium mb-3">Payment Option</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPaymentType("full")}
                    className={`py-4 px-4 rounded-xl border-2 text-center cursor-pointer transition-all ${
                      paymentType === "full"
                        ? "border-teal bg-teal/5"
                        : "border-deep/10 hover:border-deep/20"
                    }`}
                  >
                    <div className="font-serif text-xl mb-1">${selected.price}</div>
                    <div className="text-xs text-[#5a6a7a]">Pay in full</div>
                  </button>
                  <button
                    onClick={() => setPaymentType("deposit")}
                    className={`py-4 px-4 rounded-xl border-2 text-center cursor-pointer transition-all ${
                      paymentType === "deposit"
                        ? "border-teal bg-teal/5"
                        : "border-deep/10 hover:border-deep/20"
                    }`}
                  >
                    <div className="font-serif text-xl mb-1">${Math.round(selected.price / 2)}</div>
                    <div className="text-xs text-[#5a6a7a]">50% deposit</div>
                  </button>
                </div>
                {paymentType === "deposit" && (
                  <p className="text-xs text-[#5a6a7a] mt-2">Remaining ${selected.price - Math.round(selected.price / 2)} due before course.</p>
                )}
              </div>
            )}

            {/* Summary + CTA */}
            {selected && (
              <div className="bg-salt rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium">{selected.name}</div>
                  <div className="text-sm">${amount}</div>
                </div>
                {fee > 0 && (
                  <div className="flex items-center justify-between text-xs text-[#5a6a7a]">
                    <span>Processing fee</span>
                    <span>${fee.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-2 mt-2 border-t border-deep/[0.06]">
                  <div className="text-sm font-semibold">Total</div>
                  <div className="font-serif text-xl text-teal">${total.toFixed(2)}</div>
                </div>
              </div>
            )}

            {error && <p className="text-coral text-sm">{error}</p>}

            <button
              onClick={handleCheckout}
              disabled={loading || !courseId || !email || !name}
              className="w-full py-3.5 bg-coral text-white rounded-full font-semibold text-sm cursor-pointer border-none hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(199,91,58,0.4)] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? "Redirecting to Stripe..." : `Pay $${total.toFixed(2)} →`}
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-[#5a6a7a]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Secure checkout via Stripe
            </div>
          </div>

          <div className="text-center mt-6 space-y-2">
            <Link href="/contact/courses" className="text-teal text-sm no-underline hover:underline block">
              Have questions? Contact us first →
            </Link>
            <Link href="/policies" className="text-[#5a6a7a] text-xs no-underline hover:underline block">
              View cancellation &amp; deposit policy
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-salt" />}>
      <BookingInner />
    </Suspense>
  );
}
