import Stripe from "stripe";
import { supabase } from "@/lib/supabase";

/**
 * Stripe sync — payment truth for the inquiry pipeline.
 *
 * Deposit invoices are issued from the VIRIDITAS LLC Stripe account (not
 * the site's own Stripe, whose webhook only sees site checkouts) — which is
 * why payment statuses rot: money moves where the site can't see it. This
 * module reads that account with STRIPE_VIRIDITAS_READ_KEY, a restricted
 * READ-ONLY key (charges/customers/invoices/payment-intents: read; all
 * else none) — it cannot create, refund, or move anything.
 *
 * Per sync: for each active inquiry in a payable status, look up succeeded
 * charges and paid invoices under the student's email. Because Viriditas
 * bills Joshua's other ventures too, a payment only advances the pipeline
 * when its description looks like a COURSE payment (aida/course/freedive/
 * coaching/deposit/ljfc); anything else is reported, never acted on.
 * The ONE transition this sync makes: active status → 'paid'.
 *
 * Zelle and bank transfers are invisible to Stripe — those remain manual
 * (one-tap in the admin).
 *
 * Fail-soft: missing key, API errors, or odd data log and return a summary;
 * callers (digest, admin endpoint) carry on.
 */

export interface StripeSyncSummary {
  ok: boolean;
  reason?: string;
  checked: number;
  customersFound: number; // emails with a Stripe customer record at all
  advancedToPaid: number;
  courseMatches: number;
  nonCoursePayments: number; // paid *something* under Viriditas, but not course-like
  errors: number;
  firstError?: string; // per-student failures are swallowed — surface one for diagnosis
}

const skip = (reason: string): StripeSyncSummary => ({
  ok: false,
  reason,
  checked: 0,
  customersFound: 0,
  advancedToPaid: 0,
  courseMatches: 0,
  nonCoursePayments: 0,
  errors: 0,
});

const COURSE_RX = /aida|freedive|freediving|course|coaching|deposit|ljfc|la jolla/i;

export function isStripeSyncConfigured(): boolean {
  return Boolean(process.env.STRIPE_VIRIDITAS_READ_KEY);
}

export async function syncStripe(windowDays = 90): Promise<StripeSyncSummary> {
  const key = process.env.STRIPE_VIRIDITAS_READ_KEY?.trim();
  if (!key) return skip("STRIPE_VIRIDITAS_READ_KEY not set");
  const stripe = new Stripe(key);

  const { data: rows, error } = await supabase
    .from("course_inquiries")
    .select("id, first_name, email, status, admin_notes")
    .eq("archived", false)
    .in("status", ["replied", "quoted", "deposit_sent"]);
  if (error) {
    console.error("[stripe-sync] inquiry query failed:", error.message);
    return skip(error.message);
  }

  const since = Math.floor(Date.now() / 1000) - windowDays * 86_400;
  let customersFound = 0;
  let advancedToPaid = 0;
  let courseMatches = 0;
  let nonCoursePayments = 0;
  let errors = 0;
  let firstError: string | undefined;

  for (const row of rows || []) {
    const email = row.email.toLowerCase();
    try {
      // Customer-first, plain list endpoints only — the Search API is not
      // available to restricted keys, and every Viriditas invoice creates
      // a customer anyway.
      const customers = await stripe.customers.list({ email, limit: 5 });
      if (customers.data.length === 0) continue;
      customersFound++;

      const hits: Array<{ when: number; amount: number; what: string }> = [];
      for (const cust of customers.data) {
        const [charges, invoices] = await Promise.all([
          stripe.charges.list({ customer: cust.id, limit: 20 }),
          stripe.invoices.list({ customer: cust.id, status: "paid", limit: 10 }),
        ]);
        for (const c of charges.data) {
          if (c.status !== "succeeded" || c.refunded || c.created < since) continue;
          hits.push({
            when: c.created,
            amount: c.amount,
            what: c.description || c.calculated_statement_descriptor || "",
          });
        }
        for (const inv of invoices.data) {
          if ((inv.status_transitions?.paid_at || 0) < since) continue;
          hits.push({
            when: inv.status_transitions?.paid_at || inv.created,
            amount: inv.amount_paid,
            what: inv.lines?.data?.map((l) => l.description || "").join(" ") || inv.description || "",
          });
        }
      }

      if (hits.length === 0) continue;
      const course = hits.filter((h) => COURSE_RX.test(h.what));
      if (course.length === 0) {
        nonCoursePayments++;
        continue; // paid Viriditas for something non-course — never advance on that
      }
      courseMatches++;
      const newest = course.sort((a, b) => b.when - a.when)[0];
      const label = `Stripe: paid $${(newest.amount / 100).toFixed(2)} on ${new Date(newest.when * 1000).toISOString().slice(0, 10)} (${newest.what.slice(0, 60)})`;

      const { error: upErr } = await supabase
        .from("course_inquiries")
        .update({
          status: "paid",
          admin_notes: row.admin_notes ? `${row.admin_notes} | ${label}` : label,
        })
        .eq("id", row.id);
      if (upErr) {
        console.error("[stripe-sync] persist failed:", upErr.message);
      } else {
        advancedToPaid++;
      }
    } catch (e) {
      // One student's lookup failing must not sink the run.
      errors++;
      const msg = e instanceof Error ? e.message : String(e);
      firstError ||= msg;
      console.error(`[stripe-sync] lookup failed for ${row.first_name}:`, msg);
    }
  }

  return {
    ok: true,
    checked: (rows || []).length,
    customersFound,
    advancedToPaid,
    courseMatches,
    nonCoursePayments,
    errors,
    firstError,
  };
}
