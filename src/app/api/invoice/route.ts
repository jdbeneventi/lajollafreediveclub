import { NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import { supabase } from "@/lib/supabase";

const RESEND_API_KEY = process.env.RESEND_API_KEY;

function getStripe() {
  // Check for test mode override
  const useTest = process.env.STRIPE_MODE === "test";
  const key = useTest
    ? (process.env.STRIPE_TEST_SECRET_KEY || process.env.STRIPE_SECRET_KEY!)
    : process.env.STRIPE_SECRET_KEY!;
  return new Stripe(key, { apiVersion: "2025-03-31.basil" });
}

// POST: Create invoice and send payment link
export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  if (secret !== "ljfc" && secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();
    const { action } = data;

    if (action === "create") {
      const { studentEmail, studentName, course, courseDates, amount, depositAmount, notes, sendEmail } = data;

      if (!studentEmail || !course || !amount) {
        return NextResponse.json({ error: "Email, course, and amount required" }, { status: 400 });
      }

      const stripe = getStripe();
      const isDeposit = depositAmount && depositAmount < amount;
      const chargeAmount = isDeposit ? depositAmount : amount;

      // Create Stripe Checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card", "us_bank_account"],
        customer_email: studentEmail,
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: course,
                description: isDeposit
                  ? `Deposit — $${amount - chargeAmount} balance due before course`
                  : `Full payment${courseDates ? ` · ${courseDates}` : ""}`,
              },
              unit_amount: chargeAmount * 100,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `https://lajollafreediveclub.com/booking/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `https://lajollafreediveclub.com/booking?cancelled=true`,
        metadata: {
          courseId: "custom",
          courseName: course,
          coursePrice: String(amount),
          paymentType: isDeposit ? "deposit" : "full",
          studentName: studentName || "",
          dates: courseDates || "",
          notes: notes || "",
        },
      });

      const paymentUrl = session.url;

      // Upsert student
      let studentId: string | null = null;
      try {
        const nameParts = (studentName || "").split(" ");
        const { data: student } = await supabase
          .from("students")
          .upsert({
            email: studentEmail,
            first_name: nameParts[0] || null,
            last_name: nameParts.slice(1).join(" ") || null,
          }, { onConflict: "email" })
          .select("id")
          .single();
        studentId = student?.id || null;
      } catch {}

      // Create booking
      try {
        await supabase.from("bookings").insert({
          student_id: studentId,
          email: studentEmail,
          course,
          course_dates: courseDates || null,
          status: "invoice_sent",
          payment_status: "unpaid",
          payment_amount: amount,
          deposit_paid: null,
          stripe_session_id: session.id,
          notes: notes || null,
        });
      } catch {}

      // Send payment link email
      if (sendEmail && RESEND_API_KEY && paymentUrl) {
        const resend = new Resend(RESEND_API_KEY);
        const firstName = (studentName || studentEmail).split(" ")[0].split("@")[0];

        try {
          await resend.emails.send({
            from: "La Jolla Freedive Club <noreply@lajollafreediveclub.com>",
            to: [studentEmail],
            subject: `Invoice: ${course} — $${chargeAmount}`,
            html: `
              <div style="font-family:-apple-system,sans-serif;max-width:540px;padding:20px;">
                <h2 style="color:#0B1D2C;margin-bottom:8px;">Hi ${firstName},</h2>
                <p style="color:#5a6a7a;font-size:14px;line-height:1.6;">
                  Here's your invoice for <strong>${course}</strong>.
                  ${notes ? `<br><br><em style="color:#5a6a7a;">"${notes}"</em>` : ""}
                </p>

                <div style="background:#FAF3EC;border-radius:12px;padding:16px;margin:16px 0;">
                  <table style="width:100%;font-size:14px;border-collapse:collapse;">
                    <tr><td style="padding:6px 0;color:#5a6a7a;">Course</td><td style="padding:6px 0;font-weight:600;">${course}</td></tr>
                    ${courseDates ? `<tr><td style="padding:6px 0;color:#5a6a7a;">Dates</td><td style="padding:6px 0;">${courseDates}</td></tr>` : ""}
                    <tr><td style="padding:6px 0;color:#5a6a7a;">Total</td><td style="padding:6px 0;">$${amount}</td></tr>
                    <tr><td style="padding:6px 0;color:#5a6a7a;">Amount due now</td><td style="padding:6px 0;font-weight:600;color:#1B6B6B;">$${chargeAmount}${isDeposit ? " (deposit)" : ""}</td></tr>
                    ${isDeposit ? `<tr><td style="padding:6px 0;color:#5a6a7a;">Balance</td><td style="padding:6px 0;color:#C75B3A;">$${amount - chargeAmount} due before course</td></tr>` : ""}
                  </table>
                </div>

                <div style="text-align:center;margin:24px 0;">
                  <a href="${paymentUrl}" style="display:inline-block;padding:14px 32px;background:#C75B3A;color:white;border-radius:50px;text-decoration:none;font-weight:600;font-size:15px;">
                    Pay $${chargeAmount} →
                  </a>
                </div>

                <p style="color:#5a6a7a;font-size:12px;text-align:center;">
                  Secure payment via Stripe. This link expires in 24 hours.
                </p>

                <p style="color:#5a6a7a;font-size:11px;margin-top:24px;">
                  La Jolla Freedive Club · San Diego, CA · AIDA Certified · DAN Insured
                </p>
              </div>
            `,
          });
        } catch {}
      }

      return NextResponse.json({
        success: true,
        paymentUrl,
        sessionId: session.id,
        emailSent: !!sendEmail,
      });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed" },
      { status: 500 }
    );
  }
}

// GET: list invoices/bookings
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  if (secret !== "ljfc" && secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ bookings: data });
}
