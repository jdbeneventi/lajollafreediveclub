import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Saturday Sessions — La Jolla Freedive Club",
  description:
    "Every Saturday morning at La Jolla Shores. Ocean Flow yoga at 7am, ORIGIN Protocol at 7:30am, group freedive at 8:30am. Open to all levels.",
  keywords: [
    "Saturday freediving La Jolla",
    "La Jolla Shores yoga",
    "freediving group dive San Diego",
    "ocean flow yoga La Jolla",
    "ORIGIN protocol freediving",
    "La Jolla Freedive Club Saturday",
  ],
  openGraph: {
    title: "Saturday Sessions — La Jolla Freedive Club",
    description:
      "Ocean Flow. ORIGIN Protocol. Line Diving. Every Saturday morning at La Jolla Shores.",
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
