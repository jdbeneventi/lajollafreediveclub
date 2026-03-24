import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Big Blue — Movie Night at the Beach",
  description:
    "Free outdoor screening of The Big Blue at Kellogg Park, La Jolla Shores. Sunset yoga, ORIGIN Protocol, and the film that started it all.",
  robots: { index: true, follow: true },
  openGraph: {
    title: "The Big Blue — Movie Night at the Beach | LJFC",
    description:
      "Free outdoor screening of The Big Blue at Kellogg Park, La Jolla Shores. Sunset yoga, ORIGIN Protocol, and the film that started it all.",
    images: ["/images/blog/big-blue-still.jpg"],
  },
};

export default function BigBlueNightLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
