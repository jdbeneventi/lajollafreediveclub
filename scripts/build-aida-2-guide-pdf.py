"""
Generates the AIDA 2 Course Guide PDF — student-facing, downloadable from
/programs/aida-2-guide and from inquiry confirmation emails.

Source of truth for the content: same as the Next.js page at
src/app/programs/aida-2-guide/page.tsx. Re-run this script when the page
content changes substantively.

Output: public/documents/LJFC-AIDA2-Course-Guide.pdf
"""

import os
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    HRFlowable,
    PageBreak,
)

# ─── LJFC brand colors ─────────────────────────────────────────────────────
DEEP = HexColor("#0B1D2C")
OCEAN = HexColor("#163B4E")
TEAL = HexColor("#1B6B6B")
SEAFOAM = HexColor("#3db8a4")
SAND = HexColor("#D4A574")
SALT = HexColor("#FAF3EC")
CORAL = HexColor("#C75B3A")
SUN = HexColor("#f0b429")
SLATE = HexColor("#3A4A56")
MUTED = HexColor("#5a6a7a")
LIGHT = HexColor("#e6e9ea")

styles = getSampleStyleSheet()


def make_styles():
    s = {}
    s["preheader"] = ParagraphStyle(
        "preheader", parent=styles["Normal"], fontName="Helvetica-Bold",
        fontSize=9, textColor=TEAL, spaceAfter=4, leading=11, alignment=TA_CENTER,
    )
    s["title"] = ParagraphStyle(
        "title", parent=styles["Title"], fontName="Helvetica",
        fontSize=26, textColor=DEEP, spaceAfter=4, leading=30, alignment=TA_CENTER,
    )
    s["subtitle"] = ParagraphStyle(
        "subtitle", parent=styles["Normal"], fontName="Helvetica-Oblique",
        fontSize=11, textColor=SLATE, spaceAfter=4, leading=14, alignment=TA_CENTER,
    )
    s["tagline"] = ParagraphStyle(
        "tagline", parent=styles["Normal"], fontName="Helvetica-Oblique",
        fontSize=10, textColor=MUTED, spaceAfter=10, leading=13, alignment=TA_CENTER,
    )
    s["section_label"] = ParagraphStyle(
        "section_label", parent=styles["Normal"], fontName="Helvetica-Bold",
        fontSize=9, textColor=TEAL, spaceAfter=4, leading=11,
    )
    s["section_label_coral"] = ParagraphStyle(
        "section_label_coral", parent=styles["Normal"], fontName="Helvetica-Bold",
        fontSize=9, textColor=CORAL, spaceAfter=4, leading=11,
    )
    s["section_label_sand"] = ParagraphStyle(
        "section_label_sand", parent=styles["Normal"], fontName="Helvetica-Bold",
        fontSize=9, textColor=HexColor("#85540B"), spaceAfter=4, leading=11,
    )
    s["h2"] = ParagraphStyle(
        "h2", parent=styles["Normal"], fontName="Helvetica",
        fontSize=18, textColor=DEEP, spaceAfter=10, leading=22,
    )
    s["body"] = ParagraphStyle(
        "body", parent=styles["Normal"], fontName="Helvetica",
        fontSize=10, textColor=DEEP, spaceAfter=8, leading=15,
    )
    s["body_muted"] = ParagraphStyle(
        "body_muted", parent=styles["Normal"], fontName="Helvetica",
        fontSize=9.5, textColor=MUTED, spaceAfter=6, leading=14,
    )
    s["bullet"] = ParagraphStyle(
        "bullet", parent=styles["Normal"], fontName="Helvetica",
        fontSize=10, textColor=DEEP, spaceAfter=4, leading=14,
        leftIndent=14, bulletIndent=2,
    )
    s["footer"] = ParagraphStyle(
        "footer", parent=styles["Normal"], fontName="Helvetica",
        fontSize=8, textColor=MUTED, spaceAfter=2, leading=11, alignment=TA_CENTER,
    )
    s["source"] = ParagraphStyle(
        "source", parent=styles["Normal"], fontName="Helvetica-Oblique",
        fontSize=8, textColor=MUTED, spaceAfter=8, leading=11,
    )
    return s


def callout(text, accent, styles_dict):
    """Render a colored callout."""
    if accent == "info":
        bg = HexColor("#F0F8FC")
        border = TEAL
    elif accent == "warning":
        bg = HexColor("#FAF3EC")
        border = CORAL
    elif accent == "sand":
        bg = HexColor("#FDF6EA")
        border = SAND
    else:
        bg = SALT
        border = SLATE
    para = Paragraph(text, styles_dict["body"])
    t = Table([[para]], colWidths=[6.5 * inch])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), bg),
        ("LINEBEFORE", (0, 0), (0, -1), 2, border),
        ("TOPPADDING", (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
        ("LEFTPADDING", (0, 0), (-1, -1), 14),
        ("RIGHTPADDING", (0, 0), (-1, -1), 14),
    ]))
    return t


def perf_card(label, value, desc, accent_coral=False):
    s = make_styles()
    label_color = CORAL if accent_coral else TEAL
    label_para = Paragraph(
        f"<font color='{label_color.hexval()}' name='Helvetica-Bold' size='8'>{label.upper()}</font>",
        s["body"],
    )
    value_para = Paragraph(
        f"<font color='#0B1D2C' name='Helvetica' size='18'>{value}</font>",
        s["body"],
    )
    desc_para = Paragraph(
        f"<font color='#5a6a7a' name='Helvetica' size='8.5'>{desc}</font>",
        s["body"],
    )
    return [label_para, value_para, desc_para]


def build_pdf(output_path):
    s = make_styles()
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        leftMargin=0.7 * inch,
        rightMargin=0.7 * inch,
        topMargin=0.55 * inch,
        bottomMargin=0.55 * inch,
        title="AIDA 2 Course Guide — La Jolla Freedive Club",
        author="Joshua Beneventi",
    )
    story = []

    # ─── Hero ──────────────────────────────────────────────────────────────
    story.append(Paragraph("LA JOLLA FREEDIVE CLUB", s["preheader"]))
    story.append(Paragraph("AIDA 2 Freediver", s["title"]))
    story.append(Paragraph("What you're getting into.", s["subtitle"]))
    story.append(Paragraph("A complete guide for prospective students", s["tagline"]))
    story.append(HRFlowable(width="100%", thickness=0.5, color=OCEAN, spaceBefore=0, spaceAfter=14))
    story.append(Paragraph(
        "The world's most widely recognized entry-level freediving certification, taught "
        "over <b>2.5 to 3 days</b> at La Jolla Shores. You'll hold your breath for two minutes, "
        "swim 40 meters underwater on one breath, descend to 12 meters on a vertical line, and "
        "know how to rescue a buddy from depth. The card you walk away with is honored by every "
        "freediving school in the world.",
        s["body"]
    ))
    story.append(Spacer(1, 14))

    # ─── What is AIDA 2 ────────────────────────────────────────────────────
    story.append(Paragraph("WHAT THIS IS", s["section_label"]))
    story.append(Paragraph("The foundation certification for recreational freediving.", s["h2"]))
    story.append(Paragraph(
        "AIDA International is the oldest international standards body for freediving — founded "
        "in 1992, governs the world championships, and sets the credentialing standards every "
        "serious freediving school uses or maps to.",
        s["body"]
    ))
    story.append(Paragraph(
        "AIDA 2 is the level at which you become a competent, autonomous freediver: comfortable "
        "with breath-hold physiology, capable of recognizing and responding to safety issues in "
        "your buddy, and trained to descend on a vertical line under your own control. Most "
        "students at LJFC are first-time freedivers — no prior certification required.",
        s["body"]
    ))
    story.append(Spacer(1, 12))

    # ─── Performance Standards ─────────────────────────────────────────────
    story.append(Paragraph("PERFORMANCE STANDARDS", s["section_label"]))
    story.append(Paragraph("What you'll need to do.", s["h2"]))

    # 4-card performance grid
    perf_table = Table([[
        perf_card("Static", "2:00", "Breath hold in confined water, with buddy"),
        perf_card("Dynamic", "40m", "Underwater swim with bi-fins"),
        perf_card("Depth", "12m", "Constant Weight on the line", accent_coral=True),
        perf_card("Exam", "75%", "Written theoretical exam"),
    ]], colWidths=[1.6 * inch] * 4)
    perf_table.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("BACKGROUND", (0, 0), (-1, -1), HexColor("#EDF1F4")),
        ("BOX", (0, 0), (-1, -1), 0.5, LIGHT),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, LIGHT),
        ("TOPPADDING", (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
    ]))
    story.append(perf_table)
    story.append(Spacer(1, 10))
    story.append(Paragraph(
        "These numbers look bigger on paper than they feel in practice. Most students hit the "
        "confined-water requirements — the 2-minute static and 40m dynamic — on their first or "
        "second try during the course. Depth is more variable, but with proper Frenzel technique "
        "and relaxation, 12 meters is well within reach for almost any healthy adult. "
        "<b>It looks daunting from outside the water. Inside, it's doable.</b>",
        s["body_muted"]
    ))
    story.append(Spacer(1, 14))

    # ─── Course structure ─────────────────────────────────────────────────
    story.append(Paragraph("COURSE STRUCTURE", s["section_label"]))
    story.append(Paragraph("2.5 to 3 days, structured.", s["h2"]))

    day_rows = [
        ["DAY 1 · EVENING", "Classroom theory", "~3 hours covering physiology, equalization, safety, equipment, and the freediving disciplines. In person or Zoom."],
        ["DAY 2 · FULL DAY", "Confined water + ocean", "Morning static and dynamic apnea with rescue scenarios — at calm shallow water at the Shores when conditions allow, in a pool otherwise. Afternoon open-water session — first depth dives at 5–8m on the LJFC line."],
        ["DAY 3 · CERT", "Cert dives + exam", "Morning 12m cert dives in peak-tide calm conditions. Written exam on the beach. Cards processed in AIDA EOS within 24h."],
    ]
    for label, title, desc in day_rows:
        is_cert = "CERT" in label
        label_color = CORAL if is_cert else TEAL
        story.append(Paragraph(
            f"<font color='{label_color.hexval()}' name='Helvetica-Bold' size='8'>{label}</font>",
            s["body"]
        ))
        story.append(Paragraph(
            f"<font color='#0B1D2C' name='Helvetica-Bold' size='12'>{title}</font>",
            s["body"]
        ))
        story.append(Paragraph(desc, s["body_muted"]))
        story.append(Spacer(1, 10))

    # ─── Curriculum ────────────────────────────────────────────────────────
    story.append(Spacer(1, 6))
    story.append(Paragraph("WHAT YOU'LL LEARN", s["section_label"]))
    story.append(Paragraph("Ten subject areas across theory, confined water, and open water.", s["h2"]))
    story.append(Paragraph("<b>Theory · the why</b>", s["body"]))
    for item in [
        "Basic physiology of freediving (respiratory + circulatory systems, breath regulation)",
        "The freedive breathing cycle (relaxation, full breath, recovery)",
        "Equalization — Frenzel introduction",
        "Safety, LMC, blackout, buddy systems, rescue protocols",
        "Freediving equipment",
        "Freediving disciplines (STA, DYN, FIM, CWT, VWT, NLT)",
        "AIDA Green — environmental responsibility (new in 2025 curriculum)",
    ]:
        story.append(Paragraph(f"• {item}", s["bullet"]))
    story.append(Spacer(1, 6))
    story.append(Paragraph("<b>Confined water · the mechanics</b> <font color='#5a6a7a'><i>pool, or calm shallow water at the Shores</i></font>", s["body"]))
    for item in [
        "2-minute static apnea with a buddy",
        "40m dynamic with bi-fins",
        "Surface LMC recovery + blackout response with weight removal",
    ]:
        story.append(Paragraph(f"• {item}", s["bullet"]))
    story.append(Spacer(1, 6))
    story.append(Paragraph("<b>Open water · the application</b>", s["body"]))
    for item in [
        "Equipment setup, weighting check, surface protocols",
        "Equalization on the line, head-down descent technique",
        "Duck dives, vertical bi-finning, controlled turns at depth",
        "Buddy supervision from the surface, rescue from depth",
        "The 12-meter Constant Weight Bi-fins certification dive",
    ]:
        story.append(Paragraph(f"• {item}", s["bullet"]))
    story.append(Spacer(1, 12))

    # ─── Pricing ───────────────────────────────────────────────────────────
    story.append(Paragraph("PRICING", s["section_label"]))
    story.append(Paragraph("Two ways to take it.", s["h2"]))
    pricing_table = Table([[
        [
            Paragraph("<font color='#1B6B6B' name='Helvetica-Bold' size='9'>GROUP · 2+ STUDENTS</font>", s["body"]),
            Paragraph("<font color='#0B1D2C' name='Helvetica' size='28'>$575</font>", s["body"]),
            Paragraph("<font color='#5a6a7a' name='Helvetica' size='9'>per person</font>", s["body"]),
            Spacer(1, 6),
            Paragraph("<font color='#0B1D2C' name='Helvetica' size='9.5'>Group rate kicks in at 2. If you book solo and another student locks in your dates, you both pay group.</font>", s["body"]),
        ],
        [
            Paragraph("<font color='#5a6a7a' name='Helvetica-Bold' size='9'>PRIVATE · SOLO</font>", s["body"]),
            Paragraph("<font color='#0B1D2C' name='Helvetica' size='28'>$800</font>", s["body"]),
            Paragraph("<font color='#5a6a7a' name='Helvetica' size='9'>one-on-one</font>", s["body"]),
            Spacer(1, 6),
            Paragraph("<font color='#0B1D2C' name='Helvetica' size='9.5'>Same curriculum, taught one-on-one with flexible scheduling around your week.</font>", s["body"]),
        ],
    ]], colWidths=[3.25 * inch, 3.25 * inch])
    pricing_table.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("BACKGROUND", (0, 0), (0, 0), HexColor("#EDF4F4")),
        ("BACKGROUND", (1, 0), (1, 0), HexColor("#F0F3F5")),
        ("BOX", (0, 0), (0, 0), 1.5, TEAL),
        ("BOX", (1, 0), (1, 0), 0.5, LIGHT),
        ("TOPPADDING", (0, 0), (-1, -1), 16),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 16),
        ("LEFTPADDING", (0, 0), (-1, -1), 14),
        ("RIGHTPADDING", (0, 0), (-1, -1), 14),
    ]))
    story.append(pricing_table)
    story.append(Spacer(1, 8))
    story.append(Paragraph(
        "Includes: AIDA certification card, full course, digital manual, instructor time, "
        "LJFC mooring line access. Not included: personal gear (rentals available), AIDA "
        "membership (first year free with certification), optional extra ocean training days "
        "($150/day if needed).",
        s["body_muted"]
    ))
    story.append(Spacer(1, 14))

    # ─── Modular completion ───────────────────────────────────────────────
    story.append(Paragraph("HOW THE CERT ACTUALLY WORKS", s["section_label"]))
    story.append(Paragraph("Skills are recorded individually. You can always come back.", s["h2"]))
    story.append(Paragraph(
        "AIDA 2 isn't a pass-or-fail exam — it's four separate performance standards (static, "
        "dynamic, depth, written) that are evaluated independently. Your logbook records exactly "
        "which skills you've met. If you complete three of the four during your course, that "
        "progress stays with you.",
        s["body"]
    ))
    story.append(callout(
        "The AIDA standard gives you up to <b>12 months</b> from your last signed skill to "
        "complete the remaining requirements — with us or with any AIDA instructor worldwide. "
        "No redoing what you've already passed.",
        "warning", s
    ))
    story.append(Spacer(1, 8))
    story.append(Paragraph(
        "<i>Source: AIDA Instructor Standards v4.4 (Jan 2023), §8.5 Referral Procedures.</i>",
        s["source"]
    ))
    story.append(Spacer(1, 8))
    story.append(Paragraph(
        "<b>Three certification variants</b> per AIDA Instructor Standards ch.7:",
        s["body"]
    ))
    for item in [
        "<b>AIDA 2 Freediver</b> — full cert, both confined-water and depth requirements met",
        "<b>AIDA 2 Pool Freediver</b> — confined-water requirements met, depth not yet completed",
        "<b>AIDA 2 Depth Freediver</b> — depth requirement met, confined-water portion not yet complete",
    ]:
        story.append(Paragraph(f"• {item}", s["bullet"]))
    story.append(Paragraph(
        "Whichever partial cert you receive, you complete the remaining portion within 12 months "
        "and upgrade to the full AIDA 2 card (€10 upgrade fee at the AIDA level). The certs are "
        "named \"Pool\" and \"Depth\" in the AIDA system — confined water can happen at the Shores "
        "when conditions allow.",
        s["body_muted"]
    ))
    story.append(Spacer(1, 14))

    # ─── Medical Screening ────────────────────────────────────────────────
    story.append(Paragraph("MEDICAL SCREENING", s["section_label"]))
    story.append(Paragraph("How we screen for medical safety.", s["h2"]))
    story.append(Paragraph(
        "Freediving puts real demands on your cardiovascular, respiratory, and ear/sinus systems. "
        "The standard tool is the <b>AIDA Medical Statement</b> — 11 questions you answer honestly "
        "before any in-water training. We send it in your booking confirmation; you complete it "
        "before course day.",
        s["body"]
    ))
    story.append(Paragraph("<b>What we ask about</b>", s["body"]))
    med_cats = [
        ("1. Regular medications", "7. Eye conditions, eye surgery"),
        ("2. Mental and mood conditions", "8. Diabetes"),
        ("3. Neurological — seizures, blackouts", "9. Prior diving accidents"),
        ("4. Cardiovascular — heart, BP, pacemaker", "10. Judgment under stress"),
        ("5. Pulmonary — asthma, lung function", "11. Pregnancy"),
        ("6. ENT — sinuses, eardrums, hearing", ""),
    ]
    med_table = Table(med_cats, colWidths=[3.25 * inch, 3.25 * inch])
    med_table.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("FONTNAME", (0, 0), (-1, -1), "Helvetica"),
        ("FONTSIZE", (0, 0), (-1, -1), 9.5),
        ("TEXTCOLOR", (0, 0), (-1, -1), DEEP),
        ("TOPPADDING", (0, 0), (-1, -1), 3),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
    ]))
    story.append(med_table)
    story.append(Spacer(1, 10))
    story.append(callout(
        "<b>A YES to any question triggers a physician review — not an automatic disqualification.</b> "
        "Your doctor signs the form stating they find no medical conditions incompatible with "
        "freediving. Most students with mild, controlled, or seasonal conditions get cleared without difficulty.",
        "sand", s
    ))
    story.append(Spacer(1, 10))

    # Two-column workable / incompatible
    workable = [Paragraph("<font color='#1B6B6B' name='Helvetica-Bold' size='9'>USUALLY WORKABLE</font>", s["body"])]
    for item in [
        "Seasonal allergies (pre-treat)",
        "Mild, controlled asthma (with physician sign-off)",
        "Sinus issues — time the dive day",
        "Past ear infections, fully resolved",
        "Most routine prescriptions",
        "Mild, controlled hypertension",
        "Corrected vision (LASIK with clearance)",
    ]:
        workable.append(Paragraph(f"• {item}", s["bullet"]))

    incompatible = [Paragraph("<font color='#993C1D' name='Helvetica-Bold' size='9'>GENERALLY INCOMPATIBLE</font>", s["body"])]
    for item in [
        "Severe, uncontrolled asthma or COPD",
        "Recent heart attack, BP &gt; 160/90",
        "Active seizure disorder",
        "History of significant blackout or dive accident",
        "Pregnancy",
        "Recent ear/sinus surgery without specialist clearance",
        "Type 1 diabetes without stable control",
        "Perforated eardrum, untreated",
    ]:
        incompatible.append(Paragraph(f"• {item}", s["bullet"]))

    cond_table = Table([[workable, incompatible]], colWidths=[3.25 * inch, 3.25 * inch])
    cond_table.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("BACKGROUND", (0, 0), (0, 0), HexColor("#EAF6F2")),
        ("BACKGROUND", (1, 0), (1, 0), HexColor("#FAEEE8")),
        ("BOX", (0, 0), (0, 0), 0.5, SEAFOAM),
        ("BOX", (1, 0), (1, 0), 0.5, CORAL),
        ("TOPPADDING", (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
    ]))
    story.append(cond_table)
    story.append(Spacer(1, 8))
    story.append(Paragraph(
        "<b>If you're unsure</b>, reach out before you book. A short conversation upfront saves "
        "the surprise of finding out the day before the course. DAN maintains a referral network "
        "of dive-aware physicians — <font color='#1B6B6B'>dan.org/find-a-doctor</font>.",
        s["body_muted"]
    ))
    story.append(Spacer(1, 14))

    # ─── How to prepare ───────────────────────────────────────────────────
    story.append(Paragraph("HOW TO PREPARE", s["section_label"]))
    story.append(Paragraph("Four weeks of low-volume prep makes everything easier.", s["h2"]))
    story.append(Paragraph(
        "The single biggest predictor of how well you do on AIDA 2 isn't fitness. It's arriving "
        "rested and comfortable with Frenzel equalization. Those two things compound. The full "
        "4-week plan is at lajollafreediveclub.com/blog/how-to-prepare-for-aida-2-san-diego-4-week-plan.",
        s["body"]
    ))
    for item in [
        "<b>Week 1:</b> Get comfortable with the 200m swim",
        "<b>Week 2:</b> Learn Frenzel equalization on land and practice diaphragmatic breathing",
        "<b>Week 3:</b> Build a 90-second to 2-minute static breath hold lying down (never near water alone)",
        "<b>Week 4:</b> Taper, rest, and arrive fresh",
    ]:
        story.append(Paragraph(f"• {item}", s["bullet"]))
    story.append(Spacer(1, 12))

    # ─── Your instructor ──────────────────────────────────────────────────
    story.append(Paragraph("YOUR INSTRUCTOR", s["section_label"]))
    story.append(Paragraph("Joshua Beneventi", s["h2"]))
    story.append(Paragraph(
        "AIDA Instructor · AIDA Youth Instructor · AIDA 4 Master Freediver. San Diego's only "
        "AIDA-certified instructor for both adults and youth. DAN Professionally Insured. Current "
        "Red Cross Adult &amp; Pediatric First Aid/CPR/AED.",
        s["body"]
    ))
    story.append(Paragraph(
        "Training lineage: Stella Abbas (Freedive Tioman, Malaysia) → Pieter Van Veen (Dahab, Egypt) → "
        "Harry Chamas (Freedive Passion, La Ventana, Mexico) → Khaled El Gammal (Dahab, Egypt) for "
        "AIDA 4 and the Instructor + Youth Instructor courses.",
        s["body"]
    ))
    story.append(Spacer(1, 14))

    # ─── Safety ───────────────────────────────────────────────────────────
    story.append(Paragraph("SAFETY", s["section_label"]))
    story.append(Paragraph("How the course is run.", s["h2"]))
    for item in [
        "<b>Tighter than required ratios</b> — AIDA mandates 4:1 in open water; we run closer to 2:1",
        "<b>No hyperventilation, ever</b> — the single most dangerous habit in freediving",
        "<b>Buddy protocols on every dive</b> — one up, one down, surface watch",
        "<b>DAN-stocked O2 + first aid kit</b> on site for every water day",
        "<b>Written Emergency Action Plan</b> — AIDA-mandated; nearest hospital (UCSD), nearest hyperbaric facility, lifeguard tower contact, evacuation route",
        "<b>Medical screening upfront</b> — conditions get a conversation, sometimes a physician sign-off",
    ]:
        story.append(Paragraph(f"• {item}", s["bullet"]))
    story.append(Spacer(1, 14))

    # ─── Sources ──────────────────────────────────────────────────────────
    story.append(Paragraph("SOURCES &amp; REFERENCES", s["section_label"]))
    for item in [
        "AIDA International course standards — aidainternational.org/Education/AIDAFreedivingCourses",
        "AIDA Instructor Standards v4.4 (January 2023)",
        "AIDA 2 Manual v2.0 (2025) — provided as PDF to all enrolled students",
        "AIDA Medical Statement V2.2 (June 2019)",
        "AIDA EOS certification system — eos.aidainternational.org",
        "DAN (Divers Alert Network) — dan.org",
    ]:
        story.append(Paragraph(f"• {item}", s["body_muted"]))
    story.append(Spacer(1, 14))

    # ─── Footer ──────────────────────────────────────────────────────────
    story.append(HRFlowable(width="100%", thickness=0.5, color=OCEAN, spaceBefore=0, spaceAfter=8))
    story.append(Paragraph("Joshua Beneventi · joshuabeneventi@gmail.com · lajollafreediveclub.com", s["footer"]))
    story.append(Paragraph("AIDA Instructor · DAN Insured · Red Cross First Aid/CPR/AED", s["footer"]))
    story.append(Paragraph("To inquire about course dates: lajollafreediveclub.com/contact/courses", s["footer"]))

    doc.build(story)


if __name__ == "__main__":
    out_dir = os.path.join(os.path.dirname(__file__), "..", "public", "documents")
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "LJFC-AIDA2-Course-Guide.pdf")
    build_pdf(out_path)
    size_kb = os.path.getsize(out_path) / 1024
    print(f"Wrote: {out_path} ({size_kb:.1f} KB)")
