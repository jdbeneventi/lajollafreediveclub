import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "State Anchors: What Buddhist Monasteries Taught Me About Freediving",
  description:
    "The cognitive tool that turned 30 minutes of relaxation into 30 seconds. How ancient contemplative practices and modern neuroscience converge in freediving mental training.",
  authors: [{ name: "Joshua Beneventi" }],
  keywords: [
    "freediving mental training",
    "state anchors freediving",
    "freediving meditation",
    "freediving visualization",
    "AIDA mental training",
    "freediving psychology",
    "breath-hold mental techniques",
    "freediving consciousness",
    "kammatthana freediving",
    "freediving alpha waves",
  ],
  openGraph: {
    title: "State Anchors: What Buddhist Monasteries Taught Me About Freediving",
    description:
      "The cognitive tool that turned 30 minutes of relaxation into 30 seconds.",
    type: "article",
    url: "https://lajollafreediveclub.com/blog/state-anchors",
    publishedTime: "2026-03-22",
    authors: ["Joshua Beneventi"],
    section: "Training",
    images: [
      {
        url: "https://lajollafreediveclub.com/images/hero.jpg",
        width: 1200,
        height: 800,
        alt: "State Anchors — Freediving Mental Training",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "State Anchors: What Buddhist Monasteries Taught Me About Freediving",
    description:
      "The cognitive tool that turned 30 minutes of relaxation into 30 seconds.",
  },
  alternates: { canonical: "/blog/state-anchors" },
};

export default function StateAnchorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline:
              "State Anchors: What Buddhist Monasteries Taught Me About Freediving",
            description:
              "The cognitive tool that turned 30 minutes of relaxation into 30 seconds.",
            datePublished: "2026-03-22",
            author: {
              "@type": "Person",
              name: "Joshua Beneventi",
              url: "https://lajollafreediveclub.com/about",
            },
            publisher: {
              "@type": "Organization",
              name: "La Jolla Freedive Club",
              url: "https://lajollafreediveclub.com",
            },
            mainEntityOfPage:
              "https://lajollafreediveclub.com/blog/state-anchors",
            articleSection: "Training",
          }),
        }}
      />
      {children}
    </>
  );
}
