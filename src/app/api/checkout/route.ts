import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/lib/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
});

const COURSES: Record<string, { name: string; price: number }> = {
  "aida1": { name: "AIDA 1 — Discover Freediving", price: 200 },
  "aida2-group": { name: "AIDA 2 Certification (Group)", price: 575 },
  "aida2-private": { name: "AIDA 2 Certification (Private)", price: 800 },
  "aida3-group": { name: "AIDA 3 — Advanced (Group)", price: 700 },
  "aida3-private": { name: "AIDA 3 — Advanced (Private)", price: 950 },
  "private-coaching": { name: "Private Coaching Session", price: 150 },
  "camp-3day": { name: "Camp Garibaldi — 3 Day", price: 450 },
  "camp-5day": { name: "Camp Garibaldi — 5 Day", price: 750 },
};

export async function POST(request: Request) {
  try {
    const { courseId, email, name, dates, paymentType } = await request.json();

    const course = COURSES[courseId];
    if (!course) {
      return NextResponse.json({ error: "Invalid course" }, { status: 400 });
    }

    const isDeposit = paymentType === "deposit";
    const amount = isDeposit ? Math.round(course.price / 2) : course.price;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: email || undefined,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: course.name,
              description: isDeposit
                ? `50% deposit — $${course.price - amount} balance due before course`
                : `Full payment${dates ? ` · ${dates}` : ""}`,
            },
            unit_amount: amount * 100, // cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `https://lajollafreediveclub.com/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://lajollafreediveclub.com/booking?cancelled=true`,
      metadata: {
        courseId,
        courseName: course.name,
        coursePrice: String(course.price),
        paymentType: isDeposit ? "deposit" : "full",
        studentName: name || "",
        dates: dates || "",
      },
    });

    // Create booking record
    try {
      // Upsert student
      let studentId: string | null = null;
      if (email) {
        const nameParts = (name || "").split(" ");
        const { data: student } = await supabase
          .from("students")
          .upsert({
            email,
            first_name: nameParts[0] || null,
            last_name: nameParts.slice(1).join(" ") || null,
          }, { onConflict: "email" })
          .select("id")
          .single();
        studentId = student?.id || null;
      }

      await supabase.from("bookings").insert({
        student_id: studentId,
        email: email || "unknown",
        course: course.name,
        course_dates: dates || null,
        status: "pending",
        payment_status: "pending",
        payment_amount: course.price,
        deposit_paid: isDeposit ? amount : null,
        stripe_session_id: session.id,
      });
    } catch {}

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Checkout failed" },
      { status: 500 }
    );
  }
}
