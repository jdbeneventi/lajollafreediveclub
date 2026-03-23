import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The ORIGIN Protocol — The Science Behind LJFC",
  description:
    "A CO\u2082-based protocol for induced neuroplasticity. Developed from freediving physiology, contemplative training, and memory reconsolidation research. The method behind everything LJFC teaches.",
  keywords: [
    "ORIGIN protocol freediving",
    "CO2 neuroplasticity",
    "freediving science",
    "hypercapnia neuroplasticity",
    "ASIC1a amygdala CO2",
    "freediving brain research",
    "breath hold neuroplasticity",
    "freediving mental training science",
    "memory reconsolidation breath hold",
    "La Jolla freediving research",
  ],
  authors: [{ name: "Joshua Beneventi" }],
  openGraph: {
    title: "The ORIGIN Protocol — The Science Behind LJFC",
    description:
      "A CO\u2082-based protocol for induced neuroplasticity developed from freediving physiology and memory reconsolidation research.",
    type: "article",
    url: "https://lajollafreediveclub.com/science",
    images: [
      {
        url: "https://lajollafreediveclub.com/images/hero.jpg",
        width: 1200,
        height: 800,
        alt: "The ORIGIN Protocol \u2014 La Jolla Freedive Club",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The ORIGIN Protocol \u2014 The Science Behind LJFC",
    description:
      "A CO\u2082-based protocol for induced neuroplasticity developed from freediving physiology.",
  },
  alternates: { canonical: "/science" },
};

export default function ScienceLayout({
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
            headline: "The ORIGIN Protocol \u2014 The Science Behind LJFC",
            description:
              "A CO\u2082-based protocol for induced neuroplasticity developed from freediving physiology, contemplative training, and memory reconsolidation research.",
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
            mainEntityOfPage: "https://lajollafreediveclub.com/science",
          }),
        }}
      />
      {children}
    </>
  );
}
