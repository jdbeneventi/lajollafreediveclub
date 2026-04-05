import Link from "next/link";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
});

export default async function BookingSuccessPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams;

  let session: Stripe.Checkout.Session | null = null;
  if (session_id) {
    try {
      session = await stripe.checkout.sessions.retrieve(session_id);
    } catch {}
  }

  const meta = session?.metadata || {};
  const amount = session ? (session.amount_total || 0) / 100 : 0;
  const isDeposit = meta.paymentType === "deposit";
  const coursePrice = parseInt(meta.coursePrice || "0");
  const balance = isDeposit ? coursePrice - amount : 0;

  return (
    <div className="min-h-screen bg-salt flex items-center justify-center px-6">
      <div className="max-w-[500px] text-center">
        <div className="w-16 h-16 bg-teal/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-teal" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h1 className="font-serif text-3xl mb-4">Payment confirmed!</h1>

        {session && (
          <div className="bg-white rounded-xl p-6 mb-6 text-left">
            <table className="w-full text-sm">
              <tbody>
                <tr><td className="py-2 text-[#5a6a7a]">Course</td><td className="py-2 font-medium">{meta.courseName}</td></tr>
                {meta.dates && <tr><td className="py-2 text-[#5a6a7a]">Dates</td><td className="py-2">{meta.dates}</td></tr>}
                <tr><td className="py-2 text-[#5a6a7a]">Paid</td><td className="py-2 font-semibold text-teal">${amount}{isDeposit ? " (deposit)" : ""}</td></tr>
                {balance > 0 && <tr><td className="py-2 text-[#5a6a7a]">Balance due</td><td className="py-2 font-semibold text-coral">${balance}</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        <p className="text-[#5a6a7a] text-sm mb-6">
          Check your email for a confirmation. Complete these before your course:
        </p>

        <div className="space-y-3 mb-8">
          <Link href="/forms/aida" className="block bg-white rounded-xl p-4 no-underline text-deep hover:shadow-md transition-all text-left">
            <div className="font-medium text-sm">Complete AIDA Forms →</div>
            <div className="text-xs text-[#5a6a7a]">Medical statement + liability release</div>
          </Link>
          <Link href="/waiver" className="block bg-white rounded-xl p-4 no-underline text-deep hover:shadow-md transition-all text-left">
            <div className="font-medium text-sm">Sign LJFC Waiver →</div>
            <div className="text-xs text-[#5a6a7a]">Required for all in-water activities</div>
          </Link>
          <Link href="/portal" className="block bg-white rounded-xl p-4 no-underline text-deep hover:shadow-md transition-all text-left">
            <div className="font-medium text-sm">View Your Dashboard →</div>
            <div className="text-xs text-[#5a6a7a]">See bookings, forms, and payment status</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
