import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPartner, getAllPartners } from "@/lib/partners";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllPartners().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const partner = getPartner(slug);
  if (!partner) return {};
  return {
    title: `LJFC × ${partner.name}`,
    robots: { index: false, follow: false },
  };
}

export default async function PartnerPage({ params }: Props) {
  const { slug } = await params;
  const partner = getPartner(slug);
  if (!partner) notFound();

  const mailtoHref = `mailto:${partner.ctaEmail}?subject=${encodeURIComponent(partner.ctaEmailSubject)}&body=${encodeURIComponent(`Hi Joshua,\n\nI saw the partnership page and`)}`;

  return (
    <div className="bg-deep text-salt font-sans font-light leading-relaxed overflow-x-hidden">
      {/* Grain overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-[1000] opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ── Hero ── */}
      <section className="min-h-screen flex flex-col justify-end px-6 md:px-8 pt-12 pb-16 md:pb-24 relative overflow-hidden">
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background: `
              radial-gradient(ellipse at 20% 80%, rgba(27, 107, 107, 0.15) 0%, transparent 60%),
              radial-gradient(ellipse at 80% 20%, rgba(22, 59, 78, 0.3) 0%, transparent 50%),
              linear-gradient(180deg, rgba(11, 29, 44, 0.4) 0%, #0B1D2C 100%)
            `,
          }}
        />
        <div className="relative z-[2] max-w-[900px]">
          <div className="flex items-center gap-6 mb-12 animate-[fadeUp_0.8s_ease_0.2s_forwards] opacity-0">
            <span className="text-seafoam font-medium text-sm tracking-[0.08em] uppercase">La Jolla Freedive Club</span>
            <span className="w-px h-10 bg-sand/40" />
            <span className="text-salt/70 text-sm tracking-[0.05em]">{partner.name}</span>
          </div>
          <h1 className="font-serif text-[clamp(2.8rem,6vw,5rem)] font-normal leading-[1.1] mb-8 animate-[fadeUp_0.8s_ease_0.4s_forwards] opacity-0">
            {partner.heroHeadline} <em className="italic text-sand">{partner.heroHeadlineEm}</em>
          </h1>
          <p className="text-[1.15rem] leading-[1.8] text-salt/70 max-w-[600px] animate-[fadeUp_0.8s_ease_0.6s_forwards] opacity-0">
            {partner.heroSubtitle}
          </p>
        </div>
      </section>

      {/* ── Heritage ── */}
      <div className="bg-ocean/15 border-t border-b border-seafoam/10 py-20 px-6 md:px-8">
        <div className="max-w-[700px] mx-auto text-center">
          <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-4">{partner.heritageLabel || "Shared History"}</div>
          <blockquote className="font-serif italic text-[clamp(1.3rem,3vw,1.8rem)] leading-[1.6] text-salt/80 mb-6">
            &ldquo;{partner.heritageQuote}&rdquo;
          </blockquote>
          <div className="text-sm text-sand/60">{partner.heritageAttribution}</div>
        </div>
      </div>

      {/* ── Connection ── */}
      <section className="py-24 px-6 md:px-8 max-w-[1000px] mx-auto border-t border-seafoam/15">
        <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-4">{partner.connectionLabel || "The Connection"}</div>
        <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-normal leading-[1.2] mb-8">
          {partner.connectionTitle}<br /><em className="italic text-sand">{partner.connectionTitleEm}</em>
        </h2>
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 mt-12">
          {partner.connectionCards.map((card) => (
            <div key={card.title} className="p-8 md:p-10 bg-ocean/25 border border-seafoam/10 rounded-sm">
              <h3 className="font-serif text-[1.4rem] font-normal text-seafoam mb-4">{card.title}</h3>
              {card.content.map((p, i) => (
                <p key={i} className={`text-[0.95rem] text-salt/65 leading-[1.8] ${i > 0 ? "mt-4" : ""}`}>{p}</p>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ── Pipeline ── */}
      {partner.pipeline && (
        <div className="bg-ocean/20 border-t border-b border-seafoam/10 py-20 px-6 md:px-8">
          <div className="max-w-[1000px] mx-auto">
            <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-4">{partner.pipeline.label}</div>
            <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-normal leading-[1.2] mb-12">
              {partner.pipeline.title} <em className="italic text-sand">{partner.pipeline.titleEm}</em>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6">
              {partner.pipeline.steps.map((step, i) => (
                <div key={i} className="text-center py-6 relative">
                  <div className="text-3xl mb-3">{step.icon}</div>
                  <div className="font-serif text-[1.1rem] mb-1">{step.label}</div>
                  <div className="text-[0.85rem] text-salt/45 leading-[1.5]">{step.detail}</div>
                  {i < partner.pipeline!.steps.length - 1 && (
                    <span className="hidden lg:block absolute right-[-0.75rem] top-1/2 -translate-y-1/2 text-sand/30 text-2xl">&rarr;</span>
                  )}
                </div>
              ))}
            </div>
            {partner.pipeline.footnote && (
              <p className="max-w-[700px] mx-auto mt-12 text-center text-[0.95rem] text-salt/45 leading-[1.8]">
                <strong className="text-sand/70">{partner.pipeline.footnote}</strong>
              </p>
            )}
          </div>
        </div>
      )}

      {/* ── Additional Sections ── */}
      {partner.additionalSections?.map((section, idx) => (
        <section key={idx} className="py-24 px-6 md:px-8 max-w-[1000px] mx-auto border-t border-seafoam/15">
          <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-4">{section.label}</div>
          <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-normal leading-[1.2] mb-8">
            {section.title} <em className="italic text-sand">{section.titleEm}</em>
          </h2>
          <div className="grid md:grid-cols-2 gap-8 md:gap-16 mt-12">
            {section.cards.map((card) => (
              <div key={card.title} className="p-8 md:p-10 bg-ocean/25 border border-seafoam/10 rounded-sm">
                <h3 className="font-serif text-[1.4rem] font-normal text-seafoam mb-4">{card.title}</h3>
                {card.content.map((p, i) => (
                  <p key={i} className={`text-[0.95rem] text-salt/65 leading-[1.8] ${i > 0 ? "mt-4" : ""}`}>{p}</p>
                ))}
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* ── Research ── */}
      {partner.researchCards && (
        <div className="bg-ocean/20 border-t border-b border-seafoam/10 py-16 px-6 md:px-8">
          <div className="max-w-[1000px] mx-auto">
            <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-4">Research Opportunity</div>
            <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-normal leading-[1.2] mb-4">
              {partner.researchTitle} <em className="italic text-sand">{partner.researchTitleEm}</em>
            </h2>
            <p className="text-salt/50 text-base mb-12 max-w-[600px]">{partner.researchSubtitle}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {partner.researchCards.map((src) => (
                <div key={src.id} className="p-6 bg-deep/50 border border-seafoam/[0.08] rounded-sm">
                  <div className="text-[11px] tracking-[0.15em] uppercase text-seafoam/60 mb-2">{src.id}</div>
                  <div className="font-serif text-[1.1rem] mb-1">{src.name}</div>
                  <div className="text-[0.85rem] text-salt/45 leading-[1.6]">{src.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Academic Integration ── */}
      {partner.academicIdeas && (
        <section className="py-24 px-6 md:px-8 max-w-[1000px] mx-auto">
          <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-4">Academic Integration</div>
          <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-normal leading-[1.2] mb-12">
            {partner.academicTitle} <em className="italic text-sand">{partner.academicTitleEm}</em>
          </h2>
          <div className="flex flex-col gap-10">
            {partner.academicIdeas.map((idea, i) => (
              <div key={i} className="grid grid-cols-[40px_1fr] md:grid-cols-[60px_1fr] gap-4 md:gap-8 items-start pb-10 border-b border-seafoam/[0.08] last:border-0 last:pb-0">
                <div className="font-serif text-[2.5rem] text-sand/30 leading-none">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div>
                  <h3 className="font-serif text-[1.3rem] font-normal mb-2">{idea.title}</h3>
                  <p className="text-[0.95rem] text-salt/60 leading-[1.8]">{idea.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Data Sources ── */}
      {partner.dataSources && (
        <div className="bg-ocean/20 border-t border-b border-seafoam/10 py-16 px-6 md:px-8">
          <div className="max-w-[1000px] mx-auto">
            <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-4">Scripps Data We Use</div>
            <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-normal leading-[1.2] mb-4">
              {partner.dataTitle} <em className="italic text-sand">{partner.dataTitleEm}</em>
            </h2>
            <p className="text-salt/50 text-base mb-12 max-w-[600px]">{partner.dataSubtitle}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {partner.dataSources.map((src) => (
                <div key={src.id} className="p-6 bg-deep/50 border border-seafoam/[0.08] rounded-sm">
                  <div className="text-[11px] tracking-[0.15em] uppercase text-seafoam/60 mb-2">{src.id}</div>
                  <div className="font-serif text-[1.1rem] mb-1">{src.name}</div>
                  <div className="text-[0.85rem] text-salt/45 leading-[1.6]">{src.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Partnership Ideas ── */}
      <section className="py-24 px-6 md:px-8 max-w-[1000px] mx-auto border-t border-seafoam/15">
        <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-4">Partnership Ideas</div>
        <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-normal leading-[1.2] mb-12">
          {partner.partnershipTitle} <em className="italic text-sand">{partner.partnershipTitleEm}</em>
        </h2>
        <div className="flex flex-col gap-10">
          {partner.partnershipIdeas.map((idea, i) => (
            <div key={i} className="grid grid-cols-[40px_1fr] md:grid-cols-[60px_1fr] gap-4 md:gap-8 items-start pb-10 border-b border-seafoam/[0.08] last:border-0 last:pb-0">
              <div className="font-serif text-[2.5rem] text-sand/30 leading-none">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div>
                <h3 className="font-serif text-[1.3rem] font-normal mb-2">{idea.title}</h3>
                <p className="text-[0.95rem] text-salt/60 leading-[1.8]">{idea.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Science Communication ── */}
      {partner.scienceComm && (
        <div className="bg-ocean/[0.12] border-t border-b border-seafoam/10 py-20 px-6 md:px-8">
          <div className="max-w-[800px] mx-auto">
            <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-4">{partner.scienceComm.label}</div>
            <h2 className="font-serif text-[clamp(1.8rem,3vw,2.5rem)] font-normal leading-[1.2] mb-8">
              {partner.scienceComm.title} <em className="italic text-sand">{partner.scienceComm.titleEm}</em>
            </h2>
            {partner.scienceComm.paragraphs.map((p, i) => (
              <p key={i} className={`text-[1.05rem] text-salt/65 leading-[1.8] ${i > 0 ? "mt-6" : ""}`}>{p}</p>
            ))}
          </div>
        </div>
      )}

      {/* ── Camp Garibaldi ── */}
      {partner.showCamp && partner.campHighlights && (
        <section className="py-24 px-6 md:px-8 max-w-[1000px] mx-auto border-t border-seafoam/15">
          <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-4">
            {partner.slug === "birch-aquarium" ? "The Program" : "Youth Program"}
          </div>
          <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-normal leading-[1.2] mb-8">
            Camp Garibaldi — <em className="italic text-sand">the ocean camp<br />that starts from the inside out.</em>
          </h2>
          <p className="text-[1.05rem] text-salt/65 max-w-[700px] mb-12">
            {partner.campDescription || "A week-long ocean camp for ages 8\u201316 teaching freediving, surf survival, and water confidence through a breath-first methodology. We build internal calm and breath control before developing external water skills. Every session includes reading real Scripps ocean data \u2014 teaching kids to understand the ocean before they enter it."}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {partner.campHighlights.map((h) => (
              <div key={h.label} className="pl-6 border-l-2 border-seafoam/20">
                <strong className="block font-serif text-[1.1rem] font-normal text-seafoam mb-1">{h.label}</strong>
                <span className="text-[0.9rem] text-salt/50 leading-[1.6]">{h.description}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Credentials ── */}
      <section className="py-24 px-6 md:px-8 max-w-[1000px] mx-auto border-t border-seafoam/15">
        <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-4">{partner.credentialsLabel || "Credentials"}</div>
        <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-normal leading-[1.2] mb-12">Who we are.</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {partner.credentials.map((c) => (
            <div key={c.value} className="text-center py-8">
              <div className="font-serif text-[2.2rem] text-sand mb-1">{c.value}</div>
              <div className="text-[0.85rem] text-salt/45 leading-[1.5] whitespace-pre-line">{c.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="text-center py-32 px-6 md:px-8">
        <div className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-4">Next Step</div>
        <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-normal leading-[1.2] mb-6">
          {partner.ctaTitle} <em className="italic text-sand">{partner.ctaTitleEm}</em>
        </h2>
        <p className="text-[1.1rem] text-salt/60 mb-12 max-w-[500px] mx-auto">{partner.ctaDescription}</p>
        <a
          href={mailtoHref}
          className="inline-block px-12 py-4 bg-transparent border border-sand text-sand font-medium text-sm tracking-[0.12em] uppercase no-underline hover:bg-sand hover:text-deep transition-all duration-300"
        >
          {partner.ctaButtonText}
        </a>
        <div className="mt-6 text-[0.85rem] text-salt/35">
          {partner.ctaSecondary}<br />
          {(partner.ctaLinks || [
            { label: "lajollafreediveclub.com/conditions", url: "https://lajollafreediveclub.com/conditions" },
            { label: "lajollafreediveclub.com/map", url: "https://lajollafreediveclub.com/map" },
          ]).map((link, i) => (
            <span key={i}>
              {i > 0 && " · "}
              <a href={link.url} className="text-seafoam/40 no-underline">{link.label}</a>
            </span>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-12 px-6 text-center border-t border-seafoam/[0.08]">
        <p className="text-[0.8rem] text-salt/25">
          This page was created specifically for {partner.name}.<br />
          <a href="https://lajollafreediveclub.com" className="text-seafoam/40 no-underline">La Jolla Freedive Club</a> · La Jolla, California
        </p>
      </footer>
    </div>
  );
}
