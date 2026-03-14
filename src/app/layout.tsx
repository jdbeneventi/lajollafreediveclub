import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://lajollafreediveclub.com"),
  title: {
    default: "La Jolla Freedive Club — Breathe. Dive. Belong.",
    template: "%s | La Jolla Freedive Club",
  },
  description:
    "San Diego's premier freediving community. AIDA certification courses, beginner experiences, group ocean sessions, private coaching, and Camp Garibaldi kids program in La Jolla, CA.",
  keywords: [
    "freediving La Jolla",
    "freedive San Diego",
    "AIDA certification San Diego",
    "learn to freedive",
    "freediving course California",
    "Camp Garibaldi",
  ],
  openGraph: {
    siteName: "La Jolla Freedive Club",
    type: "website",
    locale: "en_US",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SportsActivityLocation",
              name: "La Jolla Freedive Club",
              description:
                "San Diego's premier freediving community offering AIDA certification courses, beginner experiences, group ocean sessions, private coaching, and youth programs.",
              url: "https://lajollafreediveclub.com",
              address: {
                "@type": "PostalAddress",
                addressLocality: "La Jolla",
                addressRegion: "CA",
                postalCode: "92037",
                addressCountry: "US",
              },
              sport: "Freediving",
            }),
          }}
        />
      </head>
      <body className="bg-salt text-deep antialiased">
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
