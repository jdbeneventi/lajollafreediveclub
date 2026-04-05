import { redirect } from "next/navigation";
import { getStudent } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { PortalLogin } from "./PortalLogin";
import { LogoutButton } from "./LogoutButton";

export default async function PortalPage() {
  const student = await getStudent();

  if (!student) {
    return <PortalLogin />;
  }

  // Fetch student data
  const [
    { data: bookings },
    { data: aidaForms },
    { data: waiverMember },
  ] = await Promise.all([
    supabase.from("bookings").select("*").eq("email", student.email).order("created_at", { ascending: false }),
    supabase.from("aida_forms").select("id, form_type, course, physician_required, physician_cleared, signed_at").eq("email", student.email).order("created_at", { ascending: false }),
    supabase.from("saturday_members").select("waiver_signed, waiver_signed_at").eq("email", student.email).single(),
  ]);

  const firstName = student.first_name || student.email.split("@")[0];
  const hasWaiver = waiverMember?.waiver_signed || false;
  const hasMedical = aidaForms?.some((f: { form_type: string }) => f.form_type === "medical_statement");
  const hasLiability = aidaForms?.some((f: { form_type: string }) => f.form_type === "liability_release");

  return (
    <div className="min-h-screen bg-salt">
      {/* Header */}
      <div className="bg-deep px-6 py-8">
        <div className="max-w-[700px] mx-auto flex items-center justify-between">
          <div>
            <div className="text-[11px] text-seafoam/60 font-medium tracking-[0.2em] uppercase mb-1">Student Portal</div>
            <h1 className="font-serif text-2xl text-white">Hey, {firstName}</h1>
          </div>
          <LogoutButton />
        </div>
      </div>

      <div className="max-w-[700px] mx-auto px-6 py-8 space-y-6">
        {/* Forms Status */}
        <div className="bg-white rounded-2xl p-6">
          <h2 className="font-serif text-lg mb-4">Forms on File</h2>
          <div className="space-y-3">
            <FormRow label="LJFC Waiver" completed={hasWaiver} href="/waiver" />
            <FormRow label="AIDA Medical Statement" completed={!!hasMedical} href="/forms/aida" />
            <FormRow label="AIDA Liability Release" completed={!!hasLiability} href="/forms/aida" />
          </div>
        </div>

        {/* Bookings */}
        <div className="bg-white rounded-2xl p-6">
          <h2 className="font-serif text-lg mb-4">Bookings</h2>
          {!bookings || bookings.length === 0 ? (
            <div className="text-[#5a6a7a] text-sm">
              No bookings yet.{" "}
              <Link href="/contact/courses" className="text-teal no-underline hover:underline">Browse courses →</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map((b: { id: string; course: string; course_dates: string | null; status: string; payment_status: string; payment_amount: number | null; deposit_paid: number | null }) => (
                <div key={b.id} className="flex items-center justify-between py-3 border-b border-deep/[0.06] last:border-0">
                  <div>
                    <div className="text-sm font-medium">{b.course}</div>
                    {b.course_dates && <div className="text-xs text-[#5a6a7a]">{b.course_dates}</div>}
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                      b.payment_status === "paid" ? "bg-teal/10 text-teal" :
                      b.payment_status === "deposit" ? "bg-sun/10 text-sun" :
                      "bg-coral/10 text-coral"
                    }`}>
                      {b.payment_status === "paid" ? "Paid" :
                       b.payment_status === "deposit" ? `Deposit $${b.deposit_paid}` :
                       "Unpaid"}
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                      b.status === "confirmed" ? "bg-teal/10 text-teal" : "bg-deep/10 text-[#5a6a7a]"
                    }`}>
                      {b.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-2xl p-6">
          <h2 className="font-serif text-lg mb-4">Quick Links</h2>
          <div className="grid grid-cols-2 gap-3">
            <QuickLink href="/calendar" label="Course Calendar" />
            <QuickLink href="/saturday-sessions" label="Saturday Sessions" />
            <QuickLink href="/conditions" label="Live Conditions" />
            <QuickLink href="/gear" label="Gear Guide" />
          </div>
        </div>

        {/* Account */}
        <div className="text-center text-xs text-[#5a6a7a]">
          Signed in as {student.email}
        </div>
      </div>
    </div>
  );
}

function FormRow({ label, completed, href }: { label: string; completed: boolean; href: string }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm">{label}</span>
      {completed ? (
        <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-teal/10 text-teal">On file</span>
      ) : (
        <Link href={href} className="px-3 py-1.5 rounded-full text-[10px] font-semibold bg-coral text-white no-underline hover:bg-coral/80 transition-colors">
          Complete →
        </Link>
      )}
    </div>
  );
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="block px-4 py-3 bg-salt rounded-xl text-sm text-deep font-medium no-underline hover:bg-deep/5 transition-colors text-center">
      {label}
    </Link>
  );
}
