import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";

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
                foundingDate: "2024",
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
                description: "A 5-day ocean camp for kids ages 8-16 in La Jolla. Freediving, surf survival, and water confidence through a breath-first methodology.",
                provider: { "@type": "Organization", name: "La Jolla Freedive Club", url: "https://lajollafreediveclub.com" },
                offers: { "@type": "Offer", price: "750", priceCurrency: "USD", availability: "https://schema.org/InStock" },
                coursePrerequisites: "Ages 8-16, comfortable swimmer, parent/guardian consent.",
                educationalLevel: "Beginner",
                timeRequired: "P5D",
                teaches: ["Ocean confidence", "Breath-hold fundamentals", "Surf survival", "Freediving safety", "Snorkeling and duck diving"],
                audience: { "@type": "PeopleAudience", audienceType: "Youth, ages 8-16", suggestedMinAge: 8, suggestedMaxAge: 16 },
                hasCourseInstance: { "@type": "CourseInstance", courseMode: "Offline", location: { "@type": "Place", name: "La Jolla Shores", address: { "@type": "PostalAddress", addressLocality: "La Jolla", addressRegion: "CA", addressCountry: "US" } }, instructor: { "@type": "Person", name: "Joshua Beneventi" } },
              },
              // FAQ — 20 Q&A
              {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: [
                  { "@type": "Question", name: "Who is Joshua Beneventi?", acceptedAnswer: { "@type": "Answer", text: "Joshua Beneventi is the founder and head instructor of La Jolla Freedive Club. He holds AIDA Instructor, AIDA Youth Instructor, and AIDA 4 Freediver certifications. His family is from Pico, Azores — his great-grandfather was a whaler and his grandfather freedove for abalone in La Jolla. He trained in Malaysia (Stella Abbas), Egypt (Pieter Van Veen, Khaled El Gammal), and Mexico (Harry Chamas)." } },
                  { "@type": "Question", name: "What certifications does an LJFC instructor hold?", acceptedAnswer: { "@type": "Answer", text: "Joshua holds AIDA Instructor, AIDA Youth Instructor, and AIDA 4 Freediver certifications from AIDA International. He also holds American Red Cross Adult & Pediatric First Aid/CPR/AED certification and carries DAN Professional Liability Insurance." } },
                  { "@type": "Question", name: "Is La Jolla Freedive Club insured?", acceptedAnswer: { "@type": "Answer", text: "Yes. LJFC carries DAN Professional Liability Insurance (ID #3339867, valid through September 2026) and Joshua holds Red Cross CPR/AED certification (cert 022T2IJ, valid through September 2027)." } },
                  { "@type": "Question", name: "How does LJFC compare to other San Diego freediving schools?", acceptedAnswer: { "@type": "Answer", text: "La Jolla Freedive Club is San Diego's only AIDA-certified instructor teaching both adults and kids. AIDA is the international governing body for competitive and recreational freediving. Other local schools use different certification agencies." } },
                  { "@type": "Question", name: "How much does a freediving course cost in San Diego?", acceptedAnswer: { "@type": "Answer", text: "LJFC offers AIDA 1 (half-day introduction) for $200, AIDA 2 (beginner certification, 2-3 days) for $575, and AIDA 3 (intermediate, 3-4 days) for $700. Private courses: AIDA 2 for $800, AIDA 3 for $950. Private coaching sessions from $150." } },
                  { "@type": "Question", name: "How long does it take to get AIDA 2 certified?", acceptedAnswer: { "@type": "Answer", text: "The AIDA 2 course runs 2-3 days. This includes a pool session, two ocean training dives to 20m on the LJFC mooring line at La Jolla Shores, theory review, and a written exam. Most students certify within the scheduled days." } },
                  { "@type": "Question", name: "What's the difference between AIDA 1, 2, and 3?", acceptedAnswer: { "@type": "Answer", text: "AIDA 1 is a half-day introduction to freediving ($200) — no certification required afterward. AIDA 2 is the standard beginner certification allowing dives to 20m ($575, 2-3 days). AIDA 3 is the intermediate certification for 30m+ depths ($700, 3-4 days) and requires AIDA 2 as a prerequisite." } },
                  { "@type": "Question", name: "Do I need to own gear to take a freediving course?", acceptedAnswer: { "@type": "Answer", text: "No. Students can bring their own gear or rent from local dive shops in La Jolla. Course fees do not include gear. LJFC provides mooring line access, buoys, and safety equipment. A 5mm wetsuit, mask, snorkel, fins, and weight belt are needed." } },
                  { "@type": "Question", name: "Can I take a private AIDA course?", acceptedAnswer: { "@type": "Answer", text: "Yes. Private AIDA 2 is $800 (1-on-1), private AIDA 3 is $950. Private courses offer a flexible schedule and personalized pacing. Contact Joshua through the course inquiry form to arrange dates." } },
                  { "@type": "Question", name: "What's the youngest age for freediving with LJFC?", acceptedAnswer: { "@type": "Answer", text: "Camp Garibaldi accepts kids ages 8-16 for a week-long ocean camp ($750). Adult AIDA courses require students to be 16 or older. Younger students may participate with guardian consent through the AIDA Youth Instructor program." } },
                  { "@type": "Question", name: "Is freediving safe?", acceptedAnswer: { "@type": "Answer", text: "Freediving done with proper AIDA training, buddy protocols, direct instructor supervision, and surface safety support has an excellent safety record. The primary risk — shallow water blackout — is almost entirely preventable with correct protocols. LJFC emphasizes safety as the foundation of every session." } },
                  { "@type": "Question", name: "What are the best times of year to learn freediving in San Diego?", acceptedAnswer: { "@type": "Answer", text: "May through November offers the best conditions in La Jolla. Water temperatures range from 62-72°F, and underwater visibility peaks from August through October. Winter diving is still possible with a thicker wetsuit — water temps drop to 58-60°F." } },
                  { "@type": "Question", name: "What's the water temperature in La Jolla?", acceptedAnswer: { "@type": "Answer", text: "La Jolla water temperatures range from 58°F in winter to 72°F in late summer. A 5mm wetsuit is recommended year-round. Live conditions including water temperature are available at lajollafreediveclub.com/conditions." } },
                  { "@type": "Question", name: "Do I need a wetsuit for freediving in La Jolla?", acceptedAnswer: { "@type": "Answer", text: "Yes. A 5mm wetsuit is recommended year-round in La Jolla. In winter months (December-March), a 7mm or hooded 5mm is ideal. See lajollafreediveclub.com/gear for specific recommendations by season." } },
                  { "@type": "Question", name: "What's included in the AIDA course fee?", acceptedAnswer: { "@type": "Answer", text: "The course fee includes AIDA certification card, all training sessions (pool and ocean), digital course manual, mooring line access, instructor time, and safety equipment. Not included: personal gear (wetsuit, mask, fins, weights) and AIDA membership (first year free with certification)." } },
                  { "@type": "Question", name: "Can I freedive if I have asthma?", acceptedAnswer: { "@type": "Answer", text: "It depends on severity. Mild, well-controlled asthma is often compatible with freediving, but requires physician clearance on the AIDA medical form. Severe or uncontrolled asthma is a disqualifier. Discuss your specific situation with Joshua before booking." } },
                  { "@type": "Question", name: "Can I freedive if I can't equalize?", acceptedAnswer: { "@type": "Answer", text: "Equalization is a trainable skill — most people can learn it. LJFC teaches both Valsalva and Frenzel equalization techniques. Some students need extra practice before ocean dives, which is normal and not a disqualifier. The prep guide covers equalization in detail." } },
                  { "@type": "Question", name: "Is there a weight or age limit for freediving?", acceptedAnswer: { "@type": "Answer", text: "There is no strict weight limit. Minimum age is 16 for adult AIDA courses, 8 for Camp Garibaldi youth program. All students must be able to swim 200m non-stop without fins for AIDA 2 and above." } },
                  { "@type": "Question", name: "What should I expect on course day?", acceptedAnswer: { "@type": "Answer", text: "A typical course day at La Jolla Shores includes pool skill sessions, theory review, and ocean dives on the LJFC mooring line at the canyon edge. Sessions run 4-6 hours. Bring hydration, snacks, sun protection, and all your gear. Meet at the Shores by the lifeguard tower." } },
                  { "@type": "Question", name: "How do I book a freediving course?", acceptedAnswer: { "@type": "Answer", text: "Visit lajollafreediveclub.com/programs for course details and pricing. Submit a request through the course inquiry form at lajollafreediveclub.com/contact/courses. Joshua will follow up to confirm dates and send a payment link." } },
                ],
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
