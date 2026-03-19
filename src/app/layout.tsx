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
    "San Diego's freediving community. AIDA certification courses, live ocean conditions, group dives, private coaching, and Camp Garibaldi youth program in La Jolla, CA.",
  keywords: [
    "freediving La Jolla",
    "freedive San Diego",
    "AIDA certification San Diego",
    "AIDA 2 course La Jolla",
    "learn to freedive San Diego",
    "freediving course California",
    "freediving lessons La Jolla",
    "Camp Garibaldi",
    "La Jolla dive conditions",
    "La Jolla underwater",
    "freediving community San Diego",
    "AIDA instructor San Diego",
  ],
  openGraph: {
    siteName: "La Jolla Freedive Club",
    type: "website",
    locale: "en_US",
    url: "https://lajollafreediveclub.com",
    title: "La Jolla Freedive Club — Breathe. Dive. Belong.",
    description: "San Diego's freediving community. AIDA courses, live ocean data, weekly dives, and Camp Garibaldi youth program.",
    images: [
      {
        url: "/images/hero.jpg",
        width: 1200,
        height: 630,
        alt: "La Jolla Freedive Club — freediving in La Jolla, San Diego",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "La Jolla Freedive Club — Breathe. Dive. Belong.",
    description: "San Diego's freediving community. AIDA courses, live ocean data, weekly dives.",
    images: ["/images/hero.jpg"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://lajollafreediveclub.com" },
  other: {
    "geo.region": "US-CA",
    "geo.placename": "La Jolla, San Diego",
    "geo.position": "32.8568;-117.2555",
    "ICBM": "32.8568, -117.2555",
  },
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
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "LocalBusiness",
                "@id": "https://lajollafreediveclub.com",
                name: "La Jolla Freedive Club",
                description:
                  "San Diego's freediving community offering AIDA certification courses, live ocean conditions, group ocean sessions, private coaching, and Camp Garibaldi youth programs.",
                url: "https://lajollafreediveclub.com",
                image: "https://lajollafreediveclub.com/images/hero.jpg",
                address: {
                  "@type": "PostalAddress",
                  addressLocality: "La Jolla",
                  addressRegion: "CA",
                  postalCode: "92037",
                  addressCountry: "US",
                },
                geo: {
                  "@type": "GeoCoordinates",
                  latitude: 32.8568,
                  longitude: -117.2555,
                },
                areaServed: {
                  "@type": "City",
                  name: "San Diego",
                },
                priceRange: "$175-$950",
                openingHours: "Sa 07:00-12:00",
                sport: "Freediving",
                founder: {
                  "@type": "Person",
                  name: "Joshua Beneventi",
                  jobTitle: "AIDA Instructor & Founder",
                  url: "https://www.aidainternational.org/InstructorProfile/858dbbd9-9e54-4235-abf8-e0a035ccd077",
                  knowsAbout: ["Freediving", "AIDA Certification", "Youth Freediving Instruction"],
                  hasCredential: [
                    { "@type": "EducationalOccupationalCredential", name: "AIDA Instructor" },
                    { "@type": "EducationalOccupationalCredential", name: "AIDA Youth Instructor" },
                    { "@type": "EducationalOccupationalCredential", name: "AIDA 4 Freediver" },
                    { "@type": "EducationalOccupationalCredential", name: "American Red Cross First Aid/CPR/AED" },
                  ],
                },
              },
              {
                "@context": "https://schema.org",
                "@type": "Course",
                name: "AIDA 2 Freediver Certification",
                description: "The international standard beginner freediving certification. Pool and open water training over 2-3 days in La Jolla, San Diego. Dive to 20m.",
                provider: {
                  "@type": "Organization",
                  name: "La Jolla Freedive Club",
                  url: "https://lajollafreediveclub.com",
                },
                offers: {
                  "@type": "Offer",
                  price: "575",
                  priceCurrency: "USD",
                  availability: "https://schema.org/InStock",
                },
                coursePrerequisites: "Able to swim 200m non-stop. No previous freediving experience required.",
                educationalLevel: "Beginner",
                timeRequired: "P3D",
                locationCreated: {
                  "@type": "Place",
                  name: "La Jolla Shores",
                  address: { "@type": "PostalAddress", addressLocality: "La Jolla", addressRegion: "CA" },
                },
              },
              {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: [
                  {
                    "@type": "Question",
                    name: "How much does a freediving course cost in San Diego?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "LJFC offers AIDA 1 (Introduction) for $175, AIDA 2 (Beginner Certification) for $575, and AIDA 3 (Advanced) for $700. Private courses available from $800.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Do I need experience to learn freediving?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "No previous freediving experience is required for AIDA 1 or AIDA 2 courses. You should be a confident swimmer able to swim 200m non-stop.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Where do you freedive in La Jolla?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "We dive at La Jolla Shores, La Jolla Cove, and the La Jolla Canyon. Our mooring line is set at the canyon edge at approximately 35-40ft depth.",
                    },
                  },
                ],
              },
            ]),
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
