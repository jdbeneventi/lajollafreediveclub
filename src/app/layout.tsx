import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.lajollafreediveclub.com"),
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
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-X0ZXTHKTKK" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-X0ZXTHKTKK');`,
          }}
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0B1D2C" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="LJFC" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": ["SportsClub", "LocalBusiness"],
                "@id": "https://lajollafreediveclub.com",
                name: "La Jolla Freedive Club",
                description: "San Diego's only AIDA-certified freediving instructor for both adults and kids. AIDA courses, live ocean conditions, group dives, private coaching, and Camp Garibaldi youth program in La Jolla, California.",
                url: "https://lajollafreediveclub.com",
                image: "https://lajollafreediveclub.com/images/hero.jpg",
                slogan: "Breathe. Dive. Belong.",
                foundingDate: "2026",
                address: { "@type": "PostalAddress", addressLocality: "La Jolla", addressRegion: "CA", postalCode: "92037", addressCountry: "US" },
                geo: { "@type": "GeoCoordinates", latitude: 32.8568, longitude: -117.2555 },
                areaServed: { "@type": "City", name: "San Diego" },
                priceRange: "$150-$950",
                openingHours: "Sa 07:00-12:00",
                sport: "Freediving",
                sameAs: [
                  "https://www.aidainternational.org/InstructorProfile/858dbbd9-9e54-4235-abf8-e0a035ccd077",
                  "https://joshuabeneventi.substack.com",
                ],
                knowsAbout: ["Freediving", "AIDA certification", "Youth freediving instruction", "Breath-hold training", "Equalization technique", "Freediving safety", "La Jolla ocean conditions", "Spearfishing"],
                founder: {
                  "@type": "Person",
                  name: "Joshua Beneventi",
                  jobTitle: "AIDA Instructor & Founder",
                  url: "https://www.aidainternational.org/InstructorProfile/858dbbd9-9e54-4235-abf8-e0a035ccd077",
                  knowsAbout: ["Freediving", "AIDA Certification", "Youth Freediving Instruction", "Mammalian dive reflex", "Breath-hold training", "Equalization technique", "Freediving safety"],
                  hasCredential: [
                    { "@type": "EducationalOccupationalCredential", name: "AIDA Instructor", credentialCategory: "certification", recognizedBy: { "@type": "Organization", name: "AIDA International" } },
                    { "@type": "EducationalOccupationalCredential", name: "AIDA Youth Instructor", credentialCategory: "certification", recognizedBy: { "@type": "Organization", name: "AIDA International" } },
                    { "@type": "EducationalOccupationalCredential", name: "AIDA 4 Freediver", credentialCategory: "certification", recognizedBy: { "@type": "Organization", name: "AIDA International" } },
                    { "@type": "EducationalOccupationalCredential", name: "American Red Cross Adult & Pediatric First Aid/CPR/AED", credentialCategory: "certification", recognizedBy: { "@type": "Organization", name: "American Red Cross" } },
                    { "@type": "EducationalOccupationalCredential", name: "DAN Professional Liability Insurance", credentialCategory: "insurance", recognizedBy: { "@type": "Organization", name: "Divers Alert Network" } },
                  ],
                },
              },
              // Course: AIDA 1
              {
                "@context": "https://schema.org", "@type": "Course",
                name: "AIDA 1 Freediving Introduction",
                description: "A half-day introduction to freediving in La Jolla, San Diego. Learn breath-hold basics, static apnea, equalization, and safety fundamentals.",
                provider: { "@type": "Organization", name: "La Jolla Freedive Club", url: "https://lajollafreediveclub.com" },
                offers: { "@type": "Offer", price: "200", priceCurrency: "USD", availability: "https://schema.org/InStock" },
                coursePrerequisites: "Able to swim 50m non-stop. No prior freediving experience required.",
                educationalLevel: "Beginner",
                timeRequired: "PT4H",
                teaches: ["Breath-hold basics", "Static apnea", "Equalization introduction", "Freediving safety fundamentals"],
                hasCourseInstance: { "@type": "CourseInstance", courseMode: "Offline", location: { "@type": "Place", name: "La Jolla Shores", address: { "@type": "PostalAddress", addressLocality: "La Jolla", addressRegion: "CA", addressCountry: "US" } }, instructor: { "@type": "Person", name: "Joshua Beneventi" } },
              },
              // Course: AIDA 2
              {
                "@context": "https://schema.org", "@type": "Course",
                name: "AIDA 2 Freediver Certification",
                description: "The international standard beginner freediving certification. Pool and open water training over 2-3 days in La Jolla, San Diego. Dive to 20m.",
                provider: { "@type": "Organization", name: "La Jolla Freedive Club", url: "https://lajollafreediveclub.com" },
                offers: { "@type": "Offer", price: "575", priceCurrency: "USD", availability: "https://schema.org/InStock" },
                coursePrerequisites: "Able to swim 200m non-stop. No previous freediving experience required.",
                educationalLevel: "Beginner",
                timeRequired: "P3D",
                teaches: ["Static apnea 2+ minutes", "Dynamic apnea 40m+", "Constant weight dive to 20m", "Buddy safety procedures", "Rescue from 10m depth"],
                hasCourseInstance: { "@type": "CourseInstance", courseMode: "Offline", location: { "@type": "Place", name: "La Jolla Shores", address: { "@type": "PostalAddress", addressLocality: "La Jolla", addressRegion: "CA", addressCountry: "US" } }, instructor: { "@type": "Person", name: "Joshua Beneventi" } },
              },
              // Course: AIDA 3
              {
                "@context": "https://schema.org", "@type": "Course",
                name: "AIDA 3 Advanced Freediver Certification",
                description: "Intermediate AIDA certification for freedivers ready to push past 20m. 3-4 days of training at La Jolla Shores, San Diego.",
                provider: { "@type": "Organization", name: "La Jolla Freedive Club", url: "https://lajollafreediveclub.com" },
                offers: { "@type": "Offer", price: "700", priceCurrency: "USD", availability: "https://schema.org/InStock" },
                coursePrerequisites: "AIDA 2 certification or equivalent.",
                educationalLevel: "Intermediate",
                timeRequired: "P4D",
                teaches: ["Free immersion to 24m", "Constant weight to 30m+", "Rescue from 20m depth", "Advanced equalization (Mouthfill)", "Dive planning and safety supervision"],
                hasCourseInstance: { "@type": "CourseInstance", courseMode: "Offline", location: { "@type": "Place", name: "La Jolla Shores", address: { "@type": "PostalAddress", addressLocality: "La Jolla", addressRegion: "CA", addressCountry: "US" } }, instructor: { "@type": "Person", name: "Joshua Beneventi" } },
              },
              // Course: Camp Garibaldi
              {
                "@context": "https://schema.org", "@type": "Course",
                name: "Camp Garibaldi Youth Freediving Camp",
                description: "A 5-day ocean camp for kids ages 8-14 in La Jolla. Freediving, surf survival, and water confidence through a breath-first methodology.",
                provider: { "@type": "Organization", name: "La Jolla Freedive Club", url: "https://lajollafreediveclub.com" },
                offers: { "@type": "Offer", price: "750", priceCurrency: "USD", availability: "https://schema.org/InStock" },
                coursePrerequisites: "Ages 8-14, comfortable swimmer, parent/guardian consent.",
                educationalLevel: "Beginner",
                timeRequired: "P5D",
                teaches: ["Ocean confidence", "Breath-hold fundamentals", "Surf survival", "Freediving safety", "Snorkeling and duck diving"],
                audience: { "@type": "PeopleAudience", audienceType: "Youth, ages 8-14", suggestedMinAge: 8, suggestedMaxAge: 14 },
                hasCourseInstance: { "@type": "CourseInstance", courseMode: "Offline", location: { "@type": "Place", name: "La Jolla Shores", address: { "@type": "PostalAddress", addressLocality: "La Jolla", addressRegion: "CA", addressCountry: "US" } }, instructor: { "@type": "Person", name: "Joshua Beneventi" } },
              },
            ]),
          }}
        />
      </head>
      <body className="bg-salt text-deep antialiased">
        <ServiceWorkerRegister />
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
