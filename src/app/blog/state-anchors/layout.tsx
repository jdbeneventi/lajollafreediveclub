import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "State Anchors: What Buddhist Monasteries Taught Me About Freediving",
  description:
    "The cognitive tool that turned 30 minutes of relaxation into 30 seconds. How ancient contemplative practices and modern neuroscience converge in freediving mental training.",
  authors: [{ name: "Joshua Beneventi" }],
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
  return <>{children}</>;
}
