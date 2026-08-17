import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/lib/supabase";
import { issueMagicLink } from "@/lib/auth";
import { Resend } from "resend";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
});
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const OWNER_EMAIL = "joshuabeneventi@gmail.com";
const INQUIRY_INBOX = process.env.BUSINESS_EMAIL?.trim() || OWNER_EMAIL;
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  let event: Stripe.Event;

  try {
    if (WEBHOOK_SECRET && sig) {
      event = stripe.webhooks.constructEvent(body, sig, WEBHOOK_SECRET);
    } else {
      event = JSON.parse(body) as Stripe.Event;
    }
  } catch (err) {
    console.error("[stripe-webhook] verification failed:", err instanceof Error ? err.message : err);
    console.error("[stripe-webhook] sig present:", !!sig, "secret present:", !!WEBHOOK_SECRET);
    return NextResponse.json({ error: "Webhook verification failed" }, { status: 400 });
  }

  // Wrap all processing in try/catch — always return 200 to Stripe
  // so it stops retrying, even if our internal processing fails.
  try {

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const meta = session.metadata || {};
    const email = session.customer_email || session.customer_details?.email || "";
    const isDeposit = meta.paymentType === "deposit";
    const amountPaid = (session.amount_total || 0) / 100;

    // Update booking
    let bookingId: string | null = null;
    if (session.id) {
      try {
        const { data: updated } = await supabase
          .from("bookings")
          .update({
            status: "confirmed",
            payment_status: isDeposit ? "deposit" : "paid",
            deposit_paid: isDeposit ? amountPaid : null,
          })
          .eq("stripe_session_id", session.id)
          .select("id")
          .single();
        bookingId = updated?.id ?? null;
      } catch (e) {
        console.error("[stripe-webhook] booking update failed:", e);
      }
    }

    // Link the most recent active inquiry to this booking and bump status to 'paid'.
    // This is what powers the /admin/inquiries pipeline view — students who pay
    // automatically advance to the 'paid' column.
    if (email && bookingId) {
      try {
        const { data: latestInquiry } = await supabase
          .from("course_inquiries")
          .select("id")
          .eq("email", email.toLowerCase())
          .eq("archived", false)
          .in("status", ["new", "replied", "quoted", "deposit_sent"])
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (latestInquiry) {
          await supabase
            .from("course_inquiries")
            .update({
              status: "paid",
              linked_booking_id: bookingId,
            })
            .eq("id", latestInquiry.id);
        }
      } catch (e) {
        console.error("[stripe-webhook] inquiry linking failed:", e);
      }
    }

    // Generate magic link for the student
    let magicLinkUrl = "https://lajollafreediveclub.com/portal";
    if (email) {
      const link = await issueMagicLink(email);
      if (link) {
        magicLinkUrl = link.url;
      }
    }

    // Send confirmation emails
    if (RESEND_API_KEY && email) {
      const resend = new Resend(RESEND_API_KEY);
      const fromAddress = "La Jolla Freedive Club <noreply@lajollafreediveclub.com>";
      const courseName = meta.courseName || "Course";
      const coursePrice = parseInt(meta.coursePrice || "0");
      const balance = isDeposit ? coursePrice - amountPaid : 0;

      // Email to student — with magic link CTA
      try {
        await resend.emails.send({
          from: fromAddress,
          to: [email],
          subject: `Payment confirmed — ${courseName}`,
          html: `
            <div style="font-family:-apple-system,sans-serif;max-width:540px;padding:20px;">
              <h2 style="color:#0B1D2C;margin-bottom:8px;">Payment received!</h2>
              <div style="background:#FAF3EC;border-radius:12px;padding:16px;margin:16px 0;">
                <table style="width:100%;font-size:14px;border-collapse:collapse;">
                  <tr><td style="padding:6px 0;color:#5a6a7a;">Course</td><td style="padding:6px 0;font-weight:600;">${courseName}</td></tr>
                  ${meta.dates ? `<tr><td style="padding:6px 0;color:#5a6a7a;">Dates</td><td style="padding:6px 0;">${meta.dates}</td></tr>` : ""}
                  <tr><td style="padding:6px 0;color:#5a6a7a;">Paid</td><td style="padding:6px 0;font-weight:600;color:#1B6B6B;">$${amountPaid}${isDeposit ? " (deposit)" : ""}</td></tr>
                  ${balance > 0 ? `<tr><td style="padding:6px 0;color:#5a6a7a;">Balance due</td><td style="padding:6px 0;font-weight:600;color:#C75B3A;">$${balance} — due before course</td></tr>` : ""}
                </table>
              </div>

              <div style="background:#0B1D2C;border-radius:12px;padding:20px;margin:20px 0;text-align:center;">
                <p style="color:#3db8a4;font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin:0 0 4px;">Next Step</p>
                <p style="color:white;font-size:16px;font-weight:600;margin:0 0 4px;">Finish your pre-course onboarding</p>
                <p style="color:rgba(255,255,255,0.4);font-size:12px;margin:0 0 16px;">Gear, medical info, and course prep — takes 5 minutes.</p>
                <a href="${magicLinkUrl}" style="display:inline-block;padding:14px 32px;background:#3db8a4;color:#0B1D2C;border-radius:50px;text-decoration:none;font-weight:700;font-size:14px;">
                  Start onboarding →
                </a>
              </div>

              <p style="font-size:12px;color:#5a6a7a;line-height:1.6;">
                You can also access your portal anytime at
                <a href="https://lajollafreediveclub.com/portal" style="color:#1B6B6B;">lajollafreediveclub.com/portal</a>
              </p>
              <p style="color:#5a6a7a;font-size:11px;margin-top:24px;">La Jolla Freedive Club · San Diego, CA · AIDA Certified · DAN Insured</p>
            </div>
          `,
        });
      } catch {}

      // Email to Joshua
      try {
        await resend.emails.send({
          from: fromAddress,
          to: [INQUIRY_INBOX],
          subject: `Payment: ${meta.studentName || email} — ${courseName} — $${amountPaid}${isDeposit ? " (deposit)" : ""}`,
          html: `
            <div style="font-family:-apple-system,sans-serif;max-width:540px;padding:20px;">
              <h3 style="color:#0B1D2C;">Payment received</h3>
              <table style="font-size:14px;border-collapse:collapse;">
                <tr><td style="padding:4px 12px 4px 0;color:#5a6a7a;">Student</td><td style="font-weight:600;">${meta.studentName || email}</td></tr>
                <tr><td style="padding:4px 12px 4px 0;color:#5a6a7a;">Email</td><td>${email}</td></tr>
                <tr><td style="padding:4px 12px 4px 0;color:#5a6a7a;">Course</td><td>${courseName}</td></tr>
                <tr><td style="padding:4px 12px 4px 0;color:#5a6a7a;">Amount</td><td style="color:#1B6B6B;font-weight:600;">$${amountPaid}${isDeposit ? " (deposit)" : " (full)"}</td></tr>
                ${balance > 0 ? `<tr><td style="padding:4px 12px 4px 0;color:#5a6a7a;">Balance</td><td style="color:#C75B3A;font-weight:600;">$${balance}</td></tr>` : ""}
                ${meta.dates ? `<tr><td style="padding:4px 12px 4px 0;color:#5a6a7a;">Dates</td><td>${meta.dates}</td></tr>` : ""}
              </table>
            </div>
          `,
        });
      } catch {}
    }
  }

  } catch (err) {
    console.error("[stripe-webhook] processing error:", err instanceof Error ? err.message : err);
  }

  return NextResponse.json({ received: true });
}
