import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Saturday Sessions — La Jolla Freedive Club",
  description:
    "Every Saturday morning at La Jolla Shores. Ocean Flow + dry training 7–8:15am, line diving 8:30–10am. Open to all levels.",
  keywords: [
    "Saturday freediving La Jolla",
    "La Jolla Shores yoga",
    "freediving group dive San Diego",
    "ocean flow yoga La Jolla",
    "breathing exercises freediving",
    "La Jolla Freedive Club Saturday",
  ],
  openGraph: {
    title: "Saturday Sessions — La Jolla Freedive Club",
    description:
      "Ocean Flow. Breathing drills. Line diving. Every Saturday morning at La Jolla Shores.",
    type: "website",
    url: "https://lajollafreediveclub.com/saturday-sessions",
  },
  alternates: { canonical: "/saturday-sessions" },
};

export default function SaturdaySessionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
