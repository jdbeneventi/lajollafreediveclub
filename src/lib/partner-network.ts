// Partner Network CRM — separate from src/lib/partners.ts (pitch pages)

export type PartnerCategory =
  | "government"
  | "science"
  | "university"
  | "conservation"
  | "grants"
  | "community"
  | "education"
  | "military"
  | "business"
  | "tourism"
  | "media"
  | "digital";

export type PartnerPriority =
  | "this_week"
  | "this_month"
  | "before_camp"
  | "after_camp"
  | "future";

export type PartnerStatus =
  | "not_started"
  | "contacted"
  | "in_discussion"
  | "active"
  | "declined"
  | "paused";

export interface GuestModule {
  title: string;
  partner: string;
  description: string;
  duration: string;
  ngss?: string[];
  seasonal?: string;
}

export interface NetworkPartner {
  id: string;
  name: string;
  category: PartnerCategory;
  priority: PartnerPriority;
  status: PartnerStatus;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  whatTheyOffer: string;
  whatWeOffer: string;
  guestModules?: GuestModule[];
  publicDescription?: string;
  showOnCommunityPage: boolean;
  partnerPageUrl?: string;
  nextStep: string;
  notes?: string;
  lastContact?: string;
  followUpDate?: string;
}

export const partners: NetworkPartner[] = [
  // ─── GOVERNMENT ────────────────────────────────────────────────
  {
    id: "sd-lifeguard-services",
    name: "SD Lifeguard Services",
    category: "government",
    priority: "this_week",
    status: "contacted",
    whatTheyOffer:
      "Beach access coordination, awareness of our operations, JG cross-referral, incident resource",
    whatWeOffer:
      "Breath-hold training workshops, freediving awareness briefings, shallow water blackout reference cards, Camp Garibaldi as JG next step",
    guestModules: [
      {
        title: "Breath-Hold Training for Lifeguards",
        partner: "SD Lifeguard Services",
        description:
          "2-hour workshop on CO2 tolerance, mammalian dive reflex, and rescue breathing techniques for active lifeguards.",
        duration: "2hr",
      },
      {
        title: "Junior Lifeguard Freediving Demo",
        partner: "SD Lifeguard Services",
        description:
          "2-hour demonstration for JG A Group introducing freediving fundamentals and breath-hold safety.",
        duration: "2hr",
      },
    ],
    publicDescription:
      "San Diego Lifeguard Services — coordinating beach safety and ocean access for our community programs.",
    showOnCommunityPage: true,
    partnerPageUrl: "/partners/sd-lifeguards",
    nextStep:
      "Introduce myself at La Jolla Shores tower, share Camp Garibaldi safety plan",
  },
  {
    id: "city-sd-parks-rec",
    name: "City of SD Parks & Rec",
    category: "government",
    priority: "this_month",
    status: "not_started",
    whatTheyOffer:
      "Permit facilitation, park and beach use coordination, programming partnerships",
    whatWeOffer:
      "Community ocean programming, freediving awareness for park rangers, Camp Garibaldi as city youth offering",
    showOnCommunityPage: false,
    nextStep:
      "Research permit requirements for commercial operations at La Jolla Shores",
  },

  // ─── SCIENCE ───────────────────────────────────────────────────
  {
    id: "scripps-institution",
    name: "Scripps Institution of Oceanography",
    category: "science",
    priority: "this_month",
    status: "not_started",
    whatTheyOffer:
      "Data acknowledgment, research collaboration, grad student discounts, citizen science framework",
    whatWeOffer:
      "Community data user showcase, weekly field observations, Camp Garibaldi researcher sessions, canyon dive data",
    guestModules: [
      {
        title: "Marine Science Field Session",
        partner: "Scripps Institution of Oceanography",
        description:
          "Scripps researcher joins Camp Garibaldi for a tide pool or kelp forest session connecting real science to the ocean environment.",
        duration: "2hr",
      },
      {
        title: "Ocean Data Literacy Workshop",
        partner: "Scripps Institution of Oceanography",
        description:
          "Reading buoy data, tide charts, and weather forecasts like a scientist — the data behind every dive decision.",
        duration: "90min",
      },
    ],
    publicDescription:
      "World-renowned ocean science institution — our conditions data comes from Scripps buoys and instruments.",
    showOnCommunityPage: true,
    partnerPageUrl: "/partners/scripps",
    nextStep:
      "Identify Scripps outreach coordinator and propose citizen science collaboration",
  },
  {
    id: "birch-aquarium",
    name: "Birch Aquarium",
    category: "science",
    priority: "before_camp",
    status: "not_started",
    whatTheyOffer:
      "Cross-referral, educator sessions, tourism package collaboration",
    whatWeOffer:
      "In-water extension of aquarium experience, Camp Garibaldi scholarship, guest speaking",
    guestModules: [
      {
        title: "Exhibit to Ocean",
        partner: "Birch Aquarium",
        description:
          "Birch educator connects aquarium species to what kids will see diving — bridging the glass to the open water.",
        duration: "90min",
      },
      {
        title: "Marine Mammal Physiology",
        partner: "Birch Aquarium",
        description:
          "The dive reflex in seals, dolphins, and humans — how marine mammals and freedivers share the same ancient adaptations.",
        duration: "60min",
      },
    ],
    publicDescription:
      "Birch Aquarium at Scripps — connecting aquarium education to real ocean encounters.",
    showOnCommunityPage: true,
    partnerPageUrl: "/partners/birch-aquarium",
    nextStep:
      "Contact Birch education department about Camp Garibaldi guest educator sessions",
  },
  {
    id: "seaworld-animal-rescue",
    name: "SeaWorld SD Animal Rescue",
    category: "science",
    priority: "before_camp",
    status: "not_started",
    whatTheyOffer: "Rescue team guest sessions, animal ID resources",
    whatWeOffer:
      "Community reporting network, stranding awareness training",
    guestModules: [
      {
        title: "Marine Animal Rescue & Rehabilitation",
        partner: "SeaWorld SD Animal Rescue",
        description:
          "How rescued animals are treated and released — the science and care behind marine animal rehabilitation.",
        duration: "60min",
        ngss: ["LS2.C"],
      },
      {
        title: "What To Do If You Find a Stranded Animal",
        partner: "SeaWorld SD Animal Rescue",
        description:
          "Identification and reporting protocol for stranded marine animals along the San Diego coast.",
        duration: "45min",
      },
    ],
    publicDescription:
      "SeaWorld San Diego Animal Rescue — marine animal rehabilitation and community education.",
    showOnCommunityPage: true,
    nextStep:
      "Contact SeaWorld rescue outreach team about Camp Garibaldi guest sessions",
  },
  {
    id: "eparc-ucsd",
    name: "EPARC / UCSD",
    category: "science",
    priority: "future",
    status: "not_started",
    whatTheyOffer: "Research collaboration, lab access",
    whatWeOffer: "Trained freediver cohort, field site",
    guestModules: [
      {
        title: "Exercise Physiology of Breath-Hold Diving",
        partner: "EPARC / UCSD",
        description:
          "Heart rate, blood flow, and oxygen dynamics during apnea — the science of what happens to your body on a dive.",
        duration: "60min",
      },
      {
        title: "Dive Reflex Physiology Deep-Dive",
        partner: "EPARC / UCSD",
        description:
          "Heart rate, blood flow, oxygen dynamics during apnea. Students measure their own dive reflex.",
        duration: "60min",
        ngss: ["HS-LS1-3"],
      },
    ],
    showOnCommunityPage: false,
    nextStep:
      "Research EPARC faculty working on diving physiology, draft collaboration proposal",
  },
  {
    id: "hubbs-seaworld-research",
    name: "Hubbs-SeaWorld Research Institute",
    category: "science",
    priority: "future",
    status: "not_started",
    whatTheyOffer: "Research data, species expertise",
    whatWeOffer: "Citizen science observations, community outreach",
    guestModules: [
      {
        title: "Shark Research in La Jolla",
        partner: "Hubbs-SeaWorld Research Institute",
        description:
          "Acoustic tagging, migration patterns, and leopard shark aggregations — real research from La Jolla waters.",
        duration: "60min",
      },
      {
        title: "Shark Research & Acoustic Tagging",
        partner: "Hubbs-SeaWorld Research Institute",
        description:
          "How sharks are tracked, migration patterns, the La Jolla leopard shark aggregation.",
        duration: "60min",
        ngss: ["MS-LS2-1"],
      },
    ],
    showOnCommunityPage: false,
    nextStep:
      "Connect with Hubbs shark research team about La Jolla leopard shark data sharing",
  },

  // ─── UNIVERSITY ────────────────────────────────────────────────
  {
    id: "ucsd-recreation",
    name: "UC San Diego Recreation",
    category: "university",
    priority: "this_month",
    status: "not_started",
    whatTheyOffer:
      "Student access, registration system, Outback Adventures listing, WO trips",
    whatWeOffer:
      "Quarterly Discover Freediving, AIDA certification during breaks, free club workshops, Baja trips",
    publicDescription:
      "UCSD Recreation — bringing freediving to the campus community through courses, workshops, and adventure trips.",
    showOnCommunityPage: true,
    partnerPageUrl: "/partners/ucsd",
    nextStep:
      "Contact UCSD Recreation programming coordinator about Discover Freediving listing",
  },
  {
    id: "ucsd-surf-team",
    name: "UCSD Surf Team",
    category: "university",
    priority: "this_month",
    status: "not_started",
    whatTheyOffer:
      "High-signal campus partnership, surf survival training demand",
    whatWeOffer: "Free breath-hold workshop for the team",
    showOnCommunityPage: false,
    nextStep:
      "Reach out to UCSD Surf Team captain about a free breath-hold workshop",
  },
  {
    id: "ucsd-alumni",
    name: "UCSD Alumni Association",
    category: "university",
    priority: "future",
    status: "not_started",
    whatTheyOffer: "Alumni event programming",
    whatWeOffer: "Discover Freediving for Triton Alumni",
    showOnCommunityPage: false,
    nextStep:
      "Contact alumni engagement office about Triton Alumni experience events",
  },
  {
    id: "scripps-scientific-diving",
    name: "Scripps Scientific Diving",
    category: "university",
    priority: "future",
    status: "not_started",
    whatTheyOffer:
      "Cross-training opportunities, research tool adoption",
    whatWeOffer: "Freediving as complement to scientific diving",
    showOnCommunityPage: false,
    nextStep:
      "Introduce freediving cross-training concept to Scripps dive safety officer",
  },

  // ─── CONSERVATION ──────────────────────────────────────────────
  {
    id: "sd-coastkeeper",
    name: "SD Coastkeeper",
    category: "conservation",
    priority: "this_month",
    status: "not_started",
    whatTheyOffer:
      "Water quality education, cleanup event co-hosting",
    whatWeOffer:
      "Diver community for underwater cleanup, water quality amplification",
    guestModules: [
      {
        title: "Water Quality Monitoring",
        partner: "SD Coastkeeper",
        description:
          "How beach water quality is tested and what the data means for ocean users and marine life.",
        duration: "60min",
        ngss: ["ESS3.C"],
      },
    ],
    publicDescription:
      "San Diego Coastkeeper — protecting and restoring fishable, swimmable, drinkable water in San Diego County.",
    showOnCommunityPage: true,
    nextStep:
      "Contact Coastkeeper about underwater cleanup co-hosting and Camp Garibaldi water quality session",
  },
  {
    id: "surfrider-sd",
    name: "Surfrider Foundation SD",
    category: "conservation",
    priority: "this_month",
    status: "not_started",
    whatTheyOffer: "Beach access advocacy, cleanup events",
    whatWeOffer: "Community participation, ocean user voice",
    showOnCommunityPage: false,
    nextStep:
      "Attend next Surfrider SD chapter meeting and introduce LJFC",
  },
  {
    id: "i-love-a-clean-sd",
    name: "I Love A Clean SD",
    category: "conservation",
    priority: "after_camp",
    status: "not_started",
    whatTheyOffer: "Cleanup logistics, environmental ed resources",
    whatWeOffer: "Underwater cleanup capability",
    showOnCommunityPage: false,
    nextStep:
      "Register as cleanup partner for next coastal cleanup day",
  },
  {
    id: "ocean-discovery-institute",
    name: "Ocean Discovery Institute",
    category: "conservation",
    priority: "after_camp",
    status: "not_started",
    whatTheyOffer:
      "Underserved youth access, curriculum expertise, 501c3 for grants",
    whatWeOffer:
      "Freediving instruction, gear, ocean capability training",
    publicDescription:
      "Ocean Discovery Institute — using ocean science to empower underserved young people to transform their community.",
    showOnCommunityPage: true,
    partnerPageUrl: "/partners/ocean-discovery-institute",
    nextStep:
      "Contact ODI program director about scholarship freediving sessions for their students",
  },
  {
    id: "outdoor-outreach",
    name: "Outdoor Outreach",
    category: "conservation",
    priority: "after_camp",
    status: "not_started",
    whatTheyOffer:
      "Youth recruitment, community trust, adventure club integration",
    whatWeOffer:
      "Freediving as new adventure activity, breath-hold training",
    publicDescription:
      "Outdoor Outreach — connecting underserved youth to the transformative power of the outdoors.",
    showOnCommunityPage: true,
    partnerPageUrl: "/partners/outdoor-outreach",
    nextStep:
      "Propose freediving as a new Outdoor Outreach adventure club activity",
  },
  {
    id: "wildcoast",
    name: "WILDCOAST",
    category: "conservation",
    priority: "future",
    status: "not_started",
    whatTheyOffer:
      "Binational conservation network, coastal protection expertise",
    whatWeOffer:
      "Ocean user community voice, Baja freediving trip conservation tie-in",
    showOnCommunityPage: false,
    nextStep:
      "Explore WILDCOAST volunteer programs and Baja conservation connections",
  },
  {
    id: "sd-audubon",
    name: "SD Audubon Society",
    category: "conservation",
    priority: "future",
    status: "not_started",
    whatTheyOffer:
      "Birding/nature community crossover, citizen science programs",
    whatWeOffer:
      "Marine bird sighting reports from dive sessions",
    showOnCommunityPage: false,
    nextStep:
      "Explore citizen science collaboration for marine bird observations",
  },
  {
    id: "sd-oceans-foundation",
    name: "SD Oceans Foundation",
    category: "conservation",
    priority: "after_camp",
    status: "not_started",
    whatTheyOffer:
      "Ocean conservation network, event collaboration",
    whatWeOffer:
      "Freediving community engagement, ocean user perspective",
    showOnCommunityPage: false,
    nextStep:
      "Research SD Oceans Foundation programs and identify collaboration points",
  },
  {
    id: "challenged-athletes",
    name: "Challenged Athletes Foundation",
    category: "conservation",
    priority: "future",
    status: "not_started",
    whatTheyOffer:
      "Adaptive athlete community, grant funding for adaptive programs",
    whatWeOffer:
      "Adaptive freediving programming, water confidence training",
    showOnCommunityPage: false,
    nextStep:
      "Research CAF adaptive water sports programs and propose freediving inclusion",
  },

  // ─── GRANTS ────────────────────────────────────────────────────
  {
    id: "san-diego-foundation",
    name: "San Diego Foundation",
    category: "grants",
    priority: "after_camp",
    status: "not_started",
    whatTheyOffer:
      "Grant funding for youth ocean programs, community foundation network",
    whatWeOffer:
      "Camp Garibaldi scholarship program, measurable youth outcomes",
    showOnCommunityPage: false,
    nextStep:
      "Review SD Foundation grant cycles and eligibility for youth ocean programs",
  },
  {
    id: "lilly-endowment-aca",
    name: "Lilly Endowment / ACA",
    category: "grants",
    priority: "future",
    status: "not_started",
    whatTheyOffer:
      "National camp grant funding, ACA accreditation pathway",
    whatWeOffer:
      "Innovative ocean camp model, AIDA youth certification integration",
    showOnCommunityPage: false,
    nextStep:
      "Research ACA accreditation requirements and Lilly Endowment camp grant programs",
  },

  // ─── COMMUNITY ─────────────────────────────────────────────────
  {
    id: "lj-community-center",
    name: "La Jolla Community Center",
    category: "community",
    priority: "this_month",
    status: "not_started",
    whatTheyOffer: "Event space, community bulletin",
    whatWeOffer: "Free community breath-hold workshops",
    showOnCommunityPage: false,
    nextStep:
      "Visit community center, post Camp Garibaldi flyer, inquire about event space for workshops",
  },
  {
    id: "lj-shores-association",
    name: "La Jolla Shores Association",
    category: "community",
    priority: "this_month",
    status: "not_started",
    whatTheyOffer: "Local stakeholder support",
    whatWeOffer:
      "Responsible ocean operator, community conditions tool",
    showOnCommunityPage: false,
    nextStep:
      "Attend next LJSA meeting, introduce LJFC as a responsible beach operator",
  },
  {
    id: "lj-town-council",
    name: "La Jolla Town Council",
    category: "community",
    priority: "this_month",
    status: "not_started",
    whatTheyOffer:
      "Community endorsement, local government awareness",
    whatWeOffer:
      "Ocean safety education, community conditions resource",
    showOnCommunityPage: false,
    nextStep:
      "Attend La Jolla Town Council meeting and introduce LJFC community programs",
  },

  // ─── EDUCATION ─────────────────────────────────────────────────
  {
    id: "lj-elementary",
    name: "La Jolla Elementary",
    category: "education",
    priority: "before_camp",
    status: "not_started",
    whatTheyOffer: "Student enrollment pipeline, parent network",
    whatWeOffer:
      "Camp Garibaldi flyers, school assembly demo",
    showOnCommunityPage: false,
    nextStep:
      "Contact front office about posting Camp Garibaldi flyers and assembly demo opportunity",
  },
  {
    id: "bird-rock-elementary",
    name: "Bird Rock Elementary",
    category: "education",
    priority: "before_camp",
    status: "not_started",
    whatTheyOffer:
      "Student enrollment pipeline, coastal community families",
    whatWeOffer: "Camp Garibaldi flyers, school assembly demo",
    showOnCommunityPage: false,
    nextStep:
      "Contact front office about posting Camp Garibaldi flyers",
  },
  {
    id: "torrey-pines-elementary",
    name: "Torrey Pines Elementary",
    category: "education",
    priority: "before_camp",
    status: "not_started",
    whatTheyOffer:
      "Student enrollment pipeline, parent network",
    whatWeOffer: "Camp Garibaldi flyers, school assembly demo",
    showOnCommunityPage: false,
    nextStep:
      "Contact front office about posting Camp Garibaldi flyers",
  },
  {
    id: "muirlands-middle",
    name: "Muirlands Middle School",
    category: "education",
    priority: "before_camp",
    status: "not_started",
    whatTheyOffer:
      "Older student enrollment, after-school program potential",
    whatWeOffer:
      "Camp Garibaldi flyers, ocean science assembly",
    showOnCommunityPage: false,
    nextStep:
      "Contact activities coordinator about Camp Garibaldi promotion",
  },
  {
    id: "lj-high-school",
    name: "La Jolla High School",
    category: "education",
    priority: "before_camp",
    status: "not_started",
    whatTheyOffer:
      "Teen enrollment, potential volunteer counselors",
    whatWeOffer:
      "Camp Garibaldi flyers, freediving club support",
    showOnCommunityPage: false,
    nextStep:
      "Contact activities office about freediving club or Camp Garibaldi counselor-in-training program",
  },
  {
    id: "ymca-boys-girls",
    name: "YMCA / Boys & Girls Club",
    category: "education",
    priority: "before_camp",
    status: "not_started",
    whatTheyOffer:
      "Youth enrollment pipeline, facility access, community trust",
    whatWeOffer:
      "Camp Garibaldi scholarships, breath-hold workshops",
    showOnCommunityPage: false,
    nextStep:
      "Contact local YMCA and Boys & Girls Club about Camp Garibaldi partnership",
  },
  {
    id: "junior-lifeguard-program",
    name: "Junior Lifeguard Program",
    category: "education",
    priority: "after_camp",
    status: "not_started",
    whatTheyOffer: "JG alumni pipeline, cross-referral",
    whatWeOffer:
      "Camp Garibaldi as underwater next step after JG",
    showOnCommunityPage: false,
    nextStep:
      "Connect with JG program coordinator about cross-referral for graduates",
  },
  {
    id: "sd-homeschool-coops",
    name: "SD Homeschool Co-ops",
    category: "education",
    priority: "this_month",
    status: "not_started",
    whatTheyOffer:
      "Flexible scheduling families, NGSS-aligned field trip demand",
    whatWeOffer:
      "Ocean science field trips, Camp Garibaldi enrollment, NGSS-aligned curriculum",
    showOnCommunityPage: false,
    nextStep:
      "Research SD homeschool co-op networks and post Camp Garibaldi offerings",
  },

  // ─── MILITARY ──────────────────────────────────────────────────
  {
    id: "naval-base-sd-mwr",
    name: "Naval Base SD MWR",
    category: "military",
    priority: "before_camp",
    status: "not_started",
    whatTheyOffer:
      "Military family enrollment, base promotion",
    whatWeOffer:
      "Military family discount, veteran breath-hold workshops",
    showOnCommunityPage: false,
    nextStep:
      "Contact MWR recreation office about listing freediving courses",
  },
  {
    id: "armed-services-ymca",
    name: "Armed Services YMCA SD",
    category: "military",
    priority: "before_camp",
    status: "not_started",
    whatTheyOffer:
      "Military family network, facility access",
    whatWeOffer:
      "Military family Camp Garibaldi discounts, breath-hold workshops",
    showOnCommunityPage: false,
    nextStep:
      "Contact Armed Services YMCA about youth program partnerships",
  },
  {
    id: "veterans-orgs",
    name: "Veterans Orgs (Team RWB, WWP, Rubicon)",
    category: "military",
    priority: "after_camp",
    status: "not_started",
    whatTheyOffer:
      "Veteran community, therapeutic recreation network",
    whatWeOffer:
      "Freediving as therapeutic recreation, veteran-specific workshops",
    showOnCommunityPage: false,
    nextStep:
      "Attend local Team RWB event and introduce freediving as veteran wellness activity",
  },

  // ─── BUSINESS ──────────────────────────────────────────────────
  {
    id: "menehune-surf",
    name: "Menehune Surf School",
    category: "business",
    priority: "this_week",
    status: "not_started",
    whatTheyOffer:
      "Cross-referral, shared beach presence",
    whatWeOffer:
      "Freediving as complement to surf lessons",
    guestModules: [
      {
        title: "Surf Safety & Ocean Reading",
        partner: "Menehune Surf School",
        description:
          "Wave assessment, rip currents, and surf entry/exit — ocean reading skills for freedivers and surfers alike.",
        duration: "90min",
      },
    ],
    showOnCommunityPage: false,
    nextStep:
      "Walk over to Menehune at La Jolla Shores, introduce myself and propose cross-referral",
  },
  {
    id: "ocean-enterprises",
    name: "Ocean Enterprises",
    category: "business",
    priority: "this_month",
    status: "not_started",
    whatTheyOffer:
      "Gear retail partnership, student referrals",
    whatWeOffer:
      "Certified diver pipeline, gear recommendations",
    showOnCommunityPage: false,
    nextStep:
      "Visit Ocean Enterprises, introduce LJFC and discuss gear referral partnership",
  },
  {
    id: "house-of-scuba",
    name: "House of Scuba",
    category: "business",
    priority: "this_month",
    status: "not_started",
    whatTheyOffer:
      "Gear retail, scuba-to-freedive crossover referrals",
    whatWeOffer:
      "Freediver pipeline, gear recommendations to their shop",
    showOnCommunityPage: false,
    nextStep:
      "Visit House of Scuba, introduce LJFC and discuss cross-referral",
  },
  {
    id: "sd-divers",
    name: "SD Divers",
    category: "business",
    priority: "this_month",
    status: "not_started",
    whatTheyOffer:
      "Scuba community crossover, gear access",
    whatWeOffer:
      "Freediving workshops for scuba divers, cross-referral",
    showOnCommunityPage: false,
    nextStep:
      "Connect with SD Divers about freediving workshops for their scuba community",
  },
  {
    id: "spear-america",
    name: "Spear America",
    category: "business",
    priority: "this_month",
    status: "not_started",
    whatTheyOffer:
      "Spearfishing community, gear expertise",
    whatWeOffer:
      "Breath-hold training for spearos, AIDA certification",
    guestModules: [
      {
        title: "Spearfishing Ethics & Regulations",
        partner: "Spear America",
        description:
          "California regulations, species ID, and sustainable harvest — responsible spearfishing for freedivers.",
        duration: "60min",
      },
    ],
    showOnCommunityPage: false,
    nextStep:
      "Contact Spear America about co-hosting a breath-hold training for spearfishers",
  },
  {
    id: "waterhorse-charters",
    name: "Waterhorse Charters",
    category: "business",
    priority: "future",
    status: "not_started",
    whatTheyOffer:
      "Boat access for offshore dives, charter partnership",
    whatWeOffer:
      "Freediver charter clients, group trip bookings",
    showOnCommunityPage: false,
    nextStep:
      "Research Waterhorse Charters for potential offshore freediving trip partnership",
  },
  {
    id: "lena-ocean-flow",
    name: "Lena / Ocean Flow",
    category: "business",
    priority: "this_week",
    status: "active",
    whatTheyOffer:
      "Saturday morning yoga, community co-hosting",
    whatWeOffer:
      "Dive session after yoga, shared community",
    guestModules: [
      {
        title: "Ocean Flow Yoga for Divers",
        partner: "Lena / Ocean Flow",
        description:
          "Pre-dive mobility, intercostal opening, and breath awareness — the perfect warmup before a freedive session.",
        duration: "60min",
      },
    ],
    publicDescription:
      "Ocean Flow with Lena — Saturday morning stretching and breathing exercises at La Jolla Shores, the perfect complement to a dive session.",
    showOnCommunityPage: true,
    nextStep: "Continue Saturday co-hosting, explore joint events",
  },

  // ─── TOURISM ───────────────────────────────────────────────────
  {
    id: "la-valencia",
    name: "La Valencia Hotel",
    category: "tourism",
    priority: "after_camp",
    status: "not_started",
    whatTheyOffer:
      "Guest referrals, concierge listing, luxury tourism channel",
    whatWeOffer:
      "Exclusive Discover Freediving experience for hotel guests",
    showOnCommunityPage: false,
    nextStep:
      "Approach concierge with Discover Freediving one-sheet for hotel guests",
  },
  {
    id: "grande-colonial",
    name: "Grande Colonial Hotel",
    category: "tourism",
    priority: "after_camp",
    status: "not_started",
    whatTheyOffer:
      "Guest referrals, concierge listing",
    whatWeOffer:
      "Discover Freediving experience for guests",
    showOnCommunityPage: false,
    nextStep:
      "Approach concierge with Discover Freediving one-sheet",
  },
  {
    id: "lj-shores-hotel",
    name: "La Jolla Shores Hotel",
    category: "tourism",
    priority: "after_camp",
    status: "not_started",
    whatTheyOffer:
      "Guest referrals, beachfront proximity",
    whatWeOffer:
      "Discover Freediving for guests, Camp Garibaldi for visiting families",
    showOnCommunityPage: false,
    nextStep:
      "Drop off Discover Freediving and Camp Garibaldi materials at front desk",
  },
  {
    id: "pantai-inn",
    name: "Pantai Inn",
    category: "tourism",
    priority: "after_camp",
    status: "not_started",
    whatTheyOffer:
      "Boutique guest referrals, concierge listing",
    whatWeOffer:
      "Discover Freediving experience for guests",
    showOnCommunityPage: false,
    nextStep:
      "Approach Pantai Inn concierge with Discover Freediving materials",
  },
  {
    id: "estancia-la-jolla",
    name: "Estancia La Jolla",
    category: "tourism",
    priority: "after_camp",
    status: "not_started",
    whatTheyOffer:
      "Corporate retreat and event referrals",
    whatWeOffer:
      "Team-building freediving experiences",
    showOnCommunityPage: false,
    nextStep:
      "Contact events coordinator about team-building freediving packages",
  },
  {
    id: "lj-beach-tennis",
    name: "La Jolla Beach & Tennis Club",
    category: "tourism",
    priority: "after_camp",
    status: "not_started",
    whatTheyOffer:
      "Member referrals, family-oriented clientele",
    whatWeOffer:
      "Camp Garibaldi for members' kids, Discover Freediving for members",
    showOnCommunityPage: false,
    nextStep:
      "Contact activities director about member programming partnership",
  },
  {
    id: "sd-tourism-authority",
    name: "SD Tourism Authority",
    category: "tourism",
    priority: "after_camp",
    status: "not_started",
    whatTheyOffer:
      "Tourism listing, visitor guide inclusion, event promotion",
    whatWeOffer:
      "Unique ocean experience for San Diego visitors",
    showOnCommunityPage: false,
    nextStep:
      "Apply for SD Tourism Authority experience listing",
  },

  // ─── MEDIA ─────────────────────────────────────────────────────
  {
    id: "lajolla-ca-light",
    name: "lajolla.ca / La Jolla Light",
    category: "media",
    priority: "this_month",
    status: "not_started",
    whatTheyOffer:
      "Local press coverage, community calendar listing",
    whatWeOffer:
      "Story angles: Camp Garibaldi launch, first AIDA youth instructor in SD, conditions tool",
    showOnCommunityPage: false,
    nextStep:
      "Draft press release for Camp Garibaldi and pitch to La Jolla Light editor",
  },
  {
    id: "sd-union-tribune",
    name: "SD Union-Tribune",
    category: "media",
    priority: "after_camp",
    status: "not_started",
    whatTheyOffer:
      "Regional press coverage, feature story potential",
    whatWeOffer:
      "Feature story: youth ocean camp, freediving culture in SD, ocean conditions tech",
    showOnCommunityPage: false,
    nextStep:
      "Pitch Camp Garibaldi feature to U-T outdoor/recreation reporter after first session",
  },
  {
    id: "local-tv",
    name: "Local TV (NBC7, CBS8, Fox5)",
    category: "media",
    priority: "after_camp",
    status: "not_started",
    whatTheyOffer:
      "TV coverage, morning show segment potential",
    whatWeOffer:
      "Visual story: kids freediving, underwater footage, ocean conditions tech",
    showOnCommunityPage: false,
    nextStep:
      "Pitch Camp Garibaldi morning show segment with underwater footage after first session",
  },
  {
    id: "deeperblue-podcast",
    name: "DeeperBlue Podcast",
    category: "media",
    priority: "after_camp",
    status: "not_started",
    whatTheyOffer:
      "Freediving community exposure, global audience",
    whatWeOffer:
      "Guest episode: building a freediving community, AIDA youth program, La Jolla diving",
    showOnCommunityPage: false,
    nextStep:
      "Pitch guest episode to DeeperBlue about building a local freediving community",
  },
  {
    id: "freedive-cafe-podcast",
    name: "Freedive Cafe Podcast",
    category: "media",
    priority: "after_camp",
    status: "not_started",
    whatTheyOffer:
      "Freediving community exposure, niche audience",
    whatWeOffer:
      "Guest episode: Camp Garibaldi, youth freediving, community building",
    showOnCommunityPage: false,
    nextStep:
      "Pitch guest episode to Freedive Cafe about youth freediving and community model",
  },

  // ─── DIGITAL ───────────────────────────────────────────────────
  {
    id: "google-business-profile",
    name: "Google Business Profile",
    category: "digital",
    priority: "this_week",
    status: "not_started",
    whatTheyOffer:
      "Local search visibility, Google Maps presence, review platform",
    whatWeOffer: "Active business listing, regular updates",
    showOnCommunityPage: false,
    nextStep: "Complete and verify GBP listing",
  },
  {
    id: "tripadvisor",
    name: "TripAdvisor",
    category: "digital",
    priority: "this_month",
    status: "not_started",
    whatTheyOffer:
      "Tourist discovery channel, review platform",
    whatWeOffer:
      "Experience listing, review solicitation from students",
    showOnCommunityPage: false,
    nextStep:
      "Create TripAdvisor experience listing for Discover Freediving",
  },
  {
    id: "yelp",
    name: "Yelp",
    category: "digital",
    priority: "this_month",
    status: "not_started",
    whatTheyOffer:
      "Local discovery, review platform",
    whatWeOffer:
      "Business listing, review solicitation",
    showOnCommunityPage: false,
    nextStep: "Claim or create Yelp business listing",
  },
  {
    id: "inaturalist",
    name: "iNaturalist",
    category: "digital",
    priority: "this_week",
    status: "active",
    whatTheyOffer:
      "Species observation data, citizen science platform",
    whatWeOffer:
      "Regular marine observations from La Jolla dives, community reporting",
    showOnCommunityPage: false,
    nextStep:
      "Continue regular observations, encourage community members to contribute",
  },

  // ─── GUEST MODULE PARTNERS (Future) ──────────────────────────────
  {
    id: "sd-natural-history-museum",
    name: "SD Natural History Museum",
    category: "science",
    priority: "future",
    status: "not_started",
    whatTheyOffer:
      "Paleontology and geology expertise, museum education resources",
    whatWeOffer:
      "Field-based geology sessions, community education programming",
    guestModules: [
      {
        title: "Canyon Geology & Paleontology",
        partner: "SD Natural History Museum",
        description:
          "The La Jolla canyon is carved into 75-million-year-old Cretaceous sandstone. Canyon wall striations, plate tectonics, sea level change.",
        duration: "60min",
        ngss: ["MS-ESS1-4", "MS-ESS2-3"],
      },
    ],
    showOnCommunityPage: false,
    nextStep:
      "Contact museum education department about Camp Garibaldi geology guest sessions",
  },
  {
    id: "marine-room-restaurant",
    name: "Marine Room Restaurant",
    category: "business",
    priority: "future",
    status: "not_started",
    whatTheyOffer:
      "Chef-led ocean-to-plate education, sustainable seafood expertise",
    whatWeOffer:
      "Community programming, youth ocean education partnership",
    guestModules: [
      {
        title: "Ocean to Plate",
        partner: "Marine Room Restaurant",
        description:
          "A chef from the Marine Room connects the species kids saw underwater to sustainable seafood — the food chain from reef to restaurant.",
        duration: "45min",
      },
    ],
    showOnCommunityPage: false,
    nextStep:
      "Contact Marine Room about a guest chef session for Camp Garibaldi",
  },
  {
    id: "sd-fire-rescue-dive-team",
    name: "SD Fire-Rescue Dive Team",
    category: "government",
    priority: "future",
    status: "not_started",
    whatTheyOffer:
      "Public safety diving expertise, career pathway education",
    whatWeOffer:
      "Community youth programming, ocean safety awareness",
    guestModules: [
      {
        title: "Underwater Search & Recovery",
        partner: "SD Fire-Rescue Dive Team",
        description:
          "How the dive team operates, equipment overview, career pathways in public safety diving.",
        duration: "60min",
      },
    ],
    showOnCommunityPage: false,
    nextStep:
      "Contact SD Fire-Rescue dive team about a guest session for Camp Garibaldi",
  },
  {
    id: "local-underwater-photographer",
    name: "Local Underwater Photographer",
    category: "community",
    priority: "future",
    status: "not_started",
    whatTheyOffer:
      "Underwater photography expertise, visual storytelling skills",
    whatWeOffer:
      "Youth education platform, community exposure",
    guestModules: [
      {
        title: "Underwater Photography & Art",
        partner: "Local Underwater Photographer",
        description:
          "Composition, lighting, and storytelling underwater. Kids photograph what they observed and create a visual species log.",
        duration: "60min",
      },
    ],
    showOnCommunityPage: false,
    nextStep:
      "Identify local underwater photographers for guest educator sessions",
  },
  {
    id: "sd-zoo-wildlife-alliance",
    name: "SD Zoo Wildlife Alliance",
    category: "conservation",
    priority: "future",
    status: "not_started",
    whatTheyOffer:
      "Global conservation expertise, ocean conservation programs",
    whatWeOffer:
      "Local marine education partner, community programming",
    guestModules: [
      {
        title: "Marine Conservation & Global Connections",
        partner: "SD Zoo Wildlife Alliance",
        description:
          "How local marine conservation connects to global efforts. The zoo's ocean conservation programs.",
        duration: "60min",
      },
    ],
    showOnCommunityPage: false,
    nextStep:
      "Contact SD Zoo Wildlife Alliance about marine conservation guest sessions",
  },
  {
    id: "noaa-marine-sanctuaries",
    name: "NOAA National Marine Sanctuaries",
    category: "government",
    priority: "future",
    status: "not_started",
    whatTheyOffer:
      "Marine protected area expertise, federal conservation education",
    whatWeOffer:
      "Community youth education in a marine reserve, citizen science potential",
    guestModules: [
      {
        title: "Marine Protected Areas",
        partner: "NOAA National Marine Sanctuaries",
        description:
          "The Matlahuayl reserve in context — how marine protected areas work and why they matter.",
        duration: "60min",
      },
    ],
    showOnCommunityPage: false,
    nextStep:
      "Contact NOAA National Marine Sanctuaries West Coast office about education partnership",
  },
];

// ─── HELPER FUNCTIONS ────────────────────────────────────────────

export function getPartnersByCategory(
  category: PartnerCategory
): NetworkPartner[] {
  return partners.filter((p) => p.category === category);
}

export function getPartnersByStatus(
  status: PartnerStatus
): NetworkPartner[] {
  return partners.filter((p) => p.status === status);
}

export function getPartnersByPriority(
  priority: PartnerPriority
): NetworkPartner[] {
  return partners.filter((p) => p.priority === priority);
}

export function getPublicPartners(): NetworkPartner[] {
  return partners.filter((p) => p.showOnCommunityPage);
}

export function getAllGuestModules(): GuestModule[] {
  return partners.flatMap((p) => p.guestModules ?? []);
}

export function getPartnersNeedingFollowUp(): NetworkPartner[] {
  const now = new Date().toISOString().slice(0, 10);
  return partners.filter(
    (p) =>
      p.followUpDate &&
      p.followUpDate <= now &&
      p.status !== "declined"
  );
}

export function getThisWeekActions(): NetworkPartner[] {
  return partners.filter((p) => p.priority === "this_week");
}
