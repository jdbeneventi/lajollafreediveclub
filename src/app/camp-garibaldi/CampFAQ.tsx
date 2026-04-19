"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "What if my child isn't a strong swimmer yet?",
    a: "Kids need to be comfortable in water over their head and able to swim ~25 yards without stopping. They don't need to be racing-team strong — the camp builds water competence from there. If you're not sure where your child falls, reach out before registering and we'll talk through it."
  },
  {
    q: "What does my child need to bring?",
    a: "We provide mask, snorkel, fins, and a 3mm wetsuit. Families bring: swimsuit, towel, refillable water bottle, cold lunch + 2 snacks, sunscreen (reef-safe), and a change of warm clothes. A full packing list is emailed the week before camp."
  },
  {
    q: "What's the student-to-instructor ratio?",
    a: "6:1 in the water, always. Groups are capped at 12 with two instructors. For the canyon-depth days (Day 4 of the 5-day), we run 4:1."
  },
  {
    q: "What happens if weather or conditions are bad?",
    a: "We make the go/no-go call the morning of, based on live Scripps buoy data — and we teach kids to read the same data. If the ocean isn't safe, we run the pool/land program at the same site and move water sessions to conditions windows later in the week. No camp day is ever cancelled for weather; we adapt."
  },
  {
    q: "Does my child need any prior freediving experience?",
    a: "None. Camp Garibaldi is designed for first-timers and builds from there. Returning campers get differentiated progressions so they keep advancing."
  },
  {
    q: "Is there before or after care?",
    a: "Not currently. Drop-off opens at 8:50am, pickup is 3:00pm sharp. If you need a later pickup for one-off days, reach out and we can often work something out."
  },
  {
    q: "What's the refund policy?",
    a: "Full refund up to 30 days before camp. 50% refund 14–29 days out. Inside 14 days, we hold your deposit as credit toward a future session or Saturday program."
  },
  {
    q: "How deep will my child actually dive?",
    a: "By design, recreational youth freediving stays in the 10–35 ft range across the week. Progression is competence-gated, not age-gated — a confident 10-year-old may reach 20 ft on Day 3; a cautious 13-year-old may stay at 15 ft and that's exactly right. Nobody gets pushed past their edge."
  },
];

export default function CampFAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="camp-faq camp-section">
      <div className="camp-container-narrow">
        <div className="camp-faq-header">
          <span className="eyebrow">Parent Questions</span>
          <h2>What families ask us first.</h2>
        </div>
        <div className="camp-faq-list">
          {FAQS.map((f, i) => (
            <div key={i} className={`camp-faq-item ${open === i ? "open" : ""}`}>
              <button
                className="camp-faq-q"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <span>{f.q}</span>
                <span className="camp-faq-chev" aria-hidden="true">+</span>
              </button>
              {open === i && <div className="camp-faq-a">{f.a}</div>}
            </div>
          ))}
        </div>
        <p className="camp-faq-footer">
          More questions? <a href="/contact/camp">Ask Lena directly →</a>
        </p>
      </div>
    </section>
  );
}
