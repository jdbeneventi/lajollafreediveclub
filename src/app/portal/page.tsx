import { getStudent, isOnboardingComplete } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { PortalLogin } from "./PortalLogin";
import { LogoutButton } from "./LogoutButton";
import { JourneyCard } from "./JourneyCard";
import type { CertLevel } from "@/lib/certifications";

export default async function PortalPage() {
  const student = await getStudent();

  if (!student) {
    return <PortalLogin />;
  }

  // Fetch all student data in parallel
  const [
    { data: bookings },
    { data: aidaForms },
    { data: waiverMember },
    { data: progress },
    { data: certRecord },
    { data: onboarding },
  ] = await Promise.all([
    supabase.from("bookings").select("*").eq("email", student.email).order("created_at", { ascending: false }),
    supabase.from("aida_forms").select("id, form_type, course, physician_required, physician_cleared, signed_at").eq("email", student.email).order("created_at", { ascending: false }),
    supabase.from("saturday_members").select("waiver_signed, waiver_signed_at").eq("email", student.email).single(),
    supabase.from("student_progress").select("requirement_id").eq("student_id", student.id),
    supabase.from("student_certifications").select("cert_level, certified_at").eq("student_id", student.id).order("certified_at", { ascending: false }).limit(1),
    supabase.from("student_onboarding").select("*").eq("student_id", student.id).single(),
  ]);

  const firstName = student.first_name || student.email.split("@")[0];
  const hasWaiver = waiverMember?.waiver_signed || false;
  const hasMedical = aidaForms?.some((f: { form_type: string }) => f.form_type === "medical_statement");
  const hasLiability = aidaForms?.some((f: { form_type: string }) => f.form_type === "liability_release");
  const completedRequirements = (progress || []).map((p: { requirement_id: string }) => p.requirement_id);
  const currentCert = certRecord?.[0]?.cert_level as CertLevel | undefined ?? null;

  const onboardingComplete = await isOnboardingComplete(student.id, student.email);

  // Determine what cert level the student is working toward
  const bookedLevel: CertLevel | null = (() => {
    if (!bookings || bookings.length === 0) return null;
    const latest = (bookings[0] as { course: string }).course.toLowerCase();
    if (latest.includes("aida 3") || latest.includes("aida3")) return "aida3";
    if (latest.includes("aida 2") || latest.includes("aida2")) return "aida2";
    if (latest.includes("aida 1") || latest.includes("aida1") || latest.includes("discover")) return "aida1";
    return null;
  })();

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
        {/* Onboarding gate — if not complete, show prominent CTA */}
        {!onboardingComplete && (
          <Link href="/portal/onboarding" className="block no-underline">
            <div className="bg-gradient-to-r from-coral to-sun rounded-2xl p-6 relative overflow-hidden group hover:shadow-lg transition-shadow">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.06] rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative">
                <div className="text-[10px] font-bold text-white/80 uppercase tracking-[1.5px] mb-1">Required</div>
                <h2 className="font-serif text-xl text-white mb-1">
                  {onboarding ? "Finish your onboarding" : "Complete your onboarding"}
                </h2>
                <p className="text-white/60 text-sm mb-4 max-w-[460px]">
                  We need a few things before your course — medical info, emergency contact, swim experience, and gear. Takes about 5 minutes.
                </p>
                <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-deep rounded-full text-sm font-semibold group-hover:-translate-y-0.5 transition-transform">
                  {onboarding ? "Continue onboarding →" : "Start onboarding →"}
                </span>
              </div>
            </div>
          </Link>
        )}

        {/* Prep guide nudge — only show if onboarding is complete */}
        {onboardingComplete && !currentCert && (() => {
          const prepLevel = bookedLevel || "aida1";
          const prefix = prepLevel === "aida1" ? "prep-aida1-section-" : "prep-section-";
          const totalSections = 10;
          const prepGuideUrl = prepLevel === "aida1" ? "/portal/prep/aida1" : "/portal/prep/aida2";
          const prepSections = completedRequirements.filter((r: string) => r.startsWith(prefix));
          const prepDone = prepSections.length >= totalSections;
          if (prepDone) return null;
          const pct = Math.round((prepSections.length / totalSections) * 100);
          return (
            <Link href={prepGuideUrl} className="block no-underline">
              <div className="bg-gradient-to-r from-deep to-ocean rounded-2xl p-6 relative overflow-hidden group hover:shadow-lg transition-shadow">
                <div className="absolute top-0 right-0 w-32 h-32 bg-seafoam/[0.06] rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative">
                  <div className="text-[10px] font-bold text-seafoam uppercase tracking-[1.5px] mb-1">
                    {prepSections.length === 0 ? "Before Day 1" : `${pct}% Complete`}
                  </div>
                  <h2 className="font-serif text-xl text-white mb-1">
                    {prepSections.length === 0 ? "Start your course prep" : "Continue your course prep"}
                  </h2>
                  <p className="text-white/40 text-sm mb-4 max-w-[460px]">
                    {prepSections.length === 0
                      ? "This interactive guide covers everything you need to know before the course — physiology, equalization, safety, and more. Students who complete it show up ready."
                      : `You've completed ${prepSections.length} of ${totalSections} sections. Pick up where you left off.`}
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-seafoam text-deep rounded-full text-sm font-semibold group-hover:-translate-y-0.5 transition-transform">
                      {prepSections.length === 0 ? "Start prep guide →" : "Continue →"}
                    </span>
                    {prepSections.length > 0 && (
                      <div className="flex items-center gap-2 flex-1 max-w-[160px]">
                        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-seafoam rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-[10px] text-white/30">{prepSections.length}/{totalSections}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          );
        })()}

        {/* Locked prep guide if onboarding not done */}
        {!onboardingComplete && !currentCert && (
          <div className="bg-white rounded-2xl p-6 opacity-60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-deep/10 flex items-center justify-center shrink-0">
                <span className="text-deep/30">🔒</span>
              </div>
              <div>
                <h2 className="font-serif text-lg text-deep/50">Course Prep Guide</h2>
                <p className="text-[11px] text-slate/40">Complete your onboarding to unlock</p>
              </div>
            </div>
          </div>
        )}

        {/* Journey */}
        <JourneyCard
          currentCert={currentCert}
          bookedLevel={bookedLevel}
          completedRequirements={completedRequirements}
          hasWaiver={hasWaiver}
          hasMedical={!!hasMedical}
          hasLiability={!!hasLiability}
        />

        {/* Forms Status */}
        <div className="bg-white rounded-2xl p-6">
          <h2 className="font-serif text-lg mb-4">Forms on File</h2>
          <div className="space-y-3">
            <FormRow label="LJFC Waiver" completed={hasWaiver} href="/waiver" />
            <FormRow label="AIDA Medical Statement" completed={!!hasMedical} href={onboardingComplete ? "/forms/aida" : "/portal/onboarding"} />
            <FormRow label="AIDA Liability Release" completed={!!hasLiability} href="/forms/aida" />
          </div>
        </div>

        {/* Course Materials */}
        {(() => {
          const manuals: { label: string; file: string; desc: string }[] = [];
          const courseNames = (bookings || []).map((b: { course: string }) => b.course.toLowerCase());
          const hasAida1 = courseNames.some((c: string) => c.includes("aida 1") || c.includes("aida1") || c.includes("discover"));
          const hasAida2Plus = courseNames.some((c: string) => c.includes("aida 2") || c.includes("aida2") || c.includes("aida 3") || c.includes("aida3") || c.includes("aida 4") || c.includes("aida4"));

          if (hasAida1) manuals.push({ label: "AIDA1 Discover Freediving Manual", file: "aida1-manual.pdf", desc: "Official AIDA reference · v2.0" });
          if (hasAida2Plus) manuals.push({ label: "AIDA2 Freediver Course Manual", file: "aida2-manual.pdf", desc: "Official AIDA reference · v2.0" });
          if (manuals.length === 0 && !currentCert) manuals.push({ label: "AIDA2 Freediver Course Manual", file: "aida2-manual.pdf", desc: "Official AIDA reference · v2.0" });

          if (manuals.length === 0) return null;

          return (
            <div className="bg-white rounded-2xl p-6">
              <h2 className="font-serif text-lg mb-4">Course Materials</h2>
              <div className="space-y-2">
                {manuals.map((m) => (
                  <a key={m.file} href={`/documents/${m.file}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 bg-salt rounded-xl no-underline hover:bg-deep/5 transition-colors group">
                    <div className="w-9 h-9 rounded-lg bg-coral/10 flex items-center justify-center shrink-0">
                      <span className="text-coral text-sm">PDF</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-deep">{m.label}</div>
                      <div className="text-[10px] text-[#5a6a7a]">{m.desc}</div>
                    </div>
                    <span className="text-[#5a6a7a]/40 text-xs group-hover:text-teal transition-colors">↓</span>
                  </a>
                ))}
              </div>
            </div>
          );
        })()}

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
            <QuickLink href="/portal/prep/aida1" label="AIDA 1 Prep Guide" />
            <QuickLink href="/portal/prep/aida2" label="AIDA 2 Prep Guide" />
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
