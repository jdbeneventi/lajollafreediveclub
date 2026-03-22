export interface PartnerDataSource {
  id: string;
  name: string;
  detail: string;
}

export interface PartnerIdea {
  title: string;
  description: string;
}

export interface PartnerCampHighlight {
  label: string;
  description: string;
}

export interface PartnerCredential {
  value: string;
  label: string;
}

export interface Partner {
  slug: string;
  name: string;
  heroHeadline: string;
  heroHeadlineEm: string;
  heroSubtitle: string;
  heritageQuote: string;
  heritageAttribution: string;
  connectionTitle: string;
  connectionTitleEm: string;
  connectionCards: { title: string; content: string[] }[];
  researchTitle?: string;
  researchTitleEm?: string;
  researchSubtitle?: string;
  researchCards?: PartnerDataSource[];
  academicTitle?: string;
  academicTitleEm?: string;
  academicIdeas?: PartnerIdea[];
  dataTitle?: string;
  dataTitleEm?: string;
  dataSubtitle?: string;
  dataSources?: PartnerDataSource[];
  partnershipTitle: string;
  partnershipTitleEm: string;
  partnershipIdeas: PartnerIdea[];
  showCamp: boolean;
  campHighlights?: PartnerCampHighlight[];
  credentials: PartnerCredential[];
  ctaTitle: string;
  ctaTitleEm: string;
  ctaDescription: string;
  ctaButtonText: string;
  ctaEmail: string;
  ctaEmailSubject: string;
  ctaSecondary: string;
}

export const partners: Partner[] = [
  {
    slug: "scripps",
    name: "Scripps Institution of Oceanography",
    heroHeadline: "Your data,",
    heroHeadlineEm: "in the water.",
    heroSubtitle: "I'm a UCSD alum who came back to La Jolla to build a freediving community and an ocean conditions platform — powered entirely by Scripps instruments. We dive the canyon below your pier every week. Here's how we could work together.",
    heritageQuote: "Scripps has studied these waters for over 120 years. The Matlahuayl reserve has been protected since 1929. The first freediving club in America was founded here in 1939. My great-grandfather came from the Azores as a whaler and settled in San Diego for tuna fishing. My grandfather freedived for abalone right here in La Jolla. I graduated from UCSD, trained as a freediving instructor around the world, and came home to build this at the university's front door. This place has been studied, protected, and dived longer than almost anywhere else in the Pacific. That's what makes this partnership natural.",
    heritageAttribution: "Joshua Beneventi — UCSD Alum, Founder of LJFC",
    connectionTitle: "Scripps collects the data.",
    connectionTitleEm: "We put it in divers' hands.",
    connectionCards: [
      {
        title: "What we built",
        content: [
          "A real-time ocean conditions dashboard at lajollafreediveclub.com/conditions that translates raw buoy, tide, and weather data into a simple dive-grade assessment. An interactive underwater field guide mapping 10 dive sites and 50+ species. A comprehensive La Jolla Underwater Atlas compiled from Scripps research, dive reports, and community knowledge. And a daily conditions email at 6am — swell, wind, temperature, tides, visibility, moon phase, and seasonal species intel in a two-minute morning read.",
        ],
      },
      {
        title: "In your front yard",
        content: [
          "LJFC operates at La Jolla Shores — directly below Scripps Pier. The La Jolla Canyon starts 100 yards from your beach. Our divers are in the water above your instruments every week, swimming past the pier where your buoys, cameras, and shore stations collect the data our platform displays.",
          "Every data point on our platform traces back to Scripps-operated or Scripps-affiliated instruments. We don't generate ocean data — we make yours accessible to the community that uses the ocean every day.",
        ],
      },
    ],
    researchTitle: "A ready-made cohort —",
    researchTitleEm: "and a hypothesis to test.",
    researchSubtitle: "LJFC's community includes trained breath-hold divers who meet weekly at a consistent dive site with logged environmental conditions. That's a controlled field population most researchers spend months recruiting. But there's more: I've been independently synthesizing the literature on CO\u2082 as a neuromodulator in breath-hold diving and developing a protocol concept I'd love academic support refining.",
    researchCards: [
      { id: "150+ Papers", name: "Independent Literature Review", detail: "I've synthesized research across dive physiology, hypercapnia, memory reconsolidation, and the mammalian dive response — including Schagatay, Ziemann, Monfils & Holmes, and Kedar et al. on paleolithic hypercapnia." },
      { id: "CO\u2082 Hypothesis", name: "Hypercapnia & Neural Plasticity", detail: "Elevated CO\u2082 activates ASIC1a channels in the amygdala, potentially creating windows for memory reconsolidation and fear-response updating. I'm developing a breath-hold protocol around this mechanism and would love rigorous academic input." },
      { id: "The Paradox", name: "Depth & Cerebral Blood Flow", detail: "At 20-30m: heart rate drops to 20-24 bpm, brain oxygen falls to 25-50% — but cerebral blood flow increases 93-165%. Clear consciousness during extreme physiology. Ideal conditions for studying neural change." },
      { id: "SDCED \u00D7 DAN", name: "Freediving Research at UCSD", detail: "The San Diego Center of Excellence in Diving co-hosted the 2023 Barotrauma and SIPE in Freediving workshop with DAN — the same network that insures LJFC. This work is happening here." },
      { id: "Weekly Cohort", name: "Trained Breath-Hold Divers", detail: "Consistent dive site, logged environmental conditions (temp, vis, swell, depth), and a community of divers willing to participate in studies. Available every Saturday, year-round." },
      { id: "Seeking", name: "Academic Partnership", detail: "I have the literature synthesis, a testable protocol concept, and a ready cohort. What I need is proper experimental design, IRB oversight, and researchers who want to study this rigorously." },
    ],
    academicTitle: "UCSD students, faculty,",
    academicTitleEm: "and researchers.",
    academicIdeas: [
      { title: "Scripps Grad Students", description: "Marine science grad students studying La Jolla's ecosystems could benefit from freediving as a research tool — quiet observation with no bubbles, no tank logistics, and direct access to the canyon and reef systems they study. We offer discounted AIDA certification for Scripps graduate researchers." },
      { title: "UCSD School of Medicine / SDCED", description: "The SDCED already studies freediving physiology. I've independently reviewed 150+ papers on breath-hold diving and developed a protocol concept around CO\u2082 as a neuromodulator — specifically ASIC1a activation in the amygdala during controlled hypercapnia and its potential for memory reconsolidation. I have the literature synthesis and a testable hypothesis. What I'm looking for is proper experimental design, IRB support, and researchers who find this worth investigating." },
      { title: "Mental Health & Neuroscience", description: "The literature on CO\u2082 inhalation studies shows promise for anxiety, phobias, and PTSD — but those studies use gas mixtures in clinical settings. Freediving produces elevated CO\u2082 naturally, combined with the mammalian dive reflex (parasympathetic activation, vagal tone increase, measurable bradycardia). UCSD's psychiatry and cognitive science departments could study whether structured breath-hold protocols produce similar reconsolidation effects in ecological conditions. Our veteran and military community members represent a particularly compelling study population." },
      { title: "UCSD Recreation & Student Clubs", description: "40,000 students, five minutes from La Jolla Shores. We offer student-rate Discover Freediving sessions, guest workshops for the Surf Club and Dive Club, and can integrate into UCSD Recreation's outdoor adventure programming. International students in particular — AIDA certification travels with them anywhere in the world." },
      { title: "Exercise Physiology & Kinesiology", description: "The cerebral blood flow paradox in breath-hold diving — oxygen saturation dropping to 25-50% while cerebral blood flow increases 93-165% — is one of the most extraordinary physiological responses in sport. Add heart rates of 20-30 bpm, blood pressure spikes to 200 mmHg, and splenic contraction releasing red blood cells into circulation. UCSD's exercise science program could instrument our divers during real ocean dives at a consistent field site with known, logged conditions." },
    ],
    dataTitle: "Seven instruments,",
    dataTitleEm: "one dashboard.",
    dataSubtitle: "Every data source on our platform traces back to Scripps-operated or Scripps-affiliated instruments.",
    dataSources: [
      { id: "NDBC 46254", name: "Scripps Nearshore Buoy", detail: "Wave height, period, direction, sea surface temperature. Our primary swell and temperature source." },
      { id: "NDBC LJPC1", name: "Scripps Pier C-MAN", detail: "Wind speed, direction, and gusts. Used for our wind assessment and daily email." },
      { id: "HDOnTap", name: "Scripps Underwater Cam", detail: "AI-analyzed every 30 minutes for underwater visibility estimation. Donated by DeepSea Power & Light." },
      { id: "NOAA CO-OPS", name: "La Jolla Tide Station", detail: "Station 9410230. Tide predictions, water level, 7-day calendar with dive windows." },
      { id: "SCCOOS", name: "Scripps Shore Station", detail: "Chlorophyll, salinity, pH, dissolved oxygen. Real-time nearshore water quality at 5m depth." },
      { id: "CalHABMAP", name: "HABs Scripps Pier", detail: "Weekly phytoplankton sampling for harmful algal bloom monitoring. Integrating for red tide alerts." },
      { id: "NWS PZZ740", name: "Marine Forecast", detail: "Coastal waters forecast for San Diego. Parsed for fog, wind, and hazard warnings." },
    ],
    partnershipTitle: "Six ways we could",
    partnershipTitleEm: "work together.",
    partnershipIdeas: [
      { title: "Community Data User Acknowledgment", description: "The simplest starting point. We add \"Powered by Scripps data\" to our conditions platform. Scripps lists LJFC as a community data user on its outreach or data portal page. Low effort, high credibility for both sides. A template for how public ocean data should flow from instruments to communities." },
      { title: "La Jolla Canyon — Eyes in the Water", description: "The MOD group's Turbulence in the La Jolla Canyon project deployed instruments and dye in October 2025 to study the canyon's upwelling dynamics. Our community dives this canyon every week — logging depth, temperature, visibility, current, and species observations. We could provide structured, recurring nearshore observation data from a location Scripps is actively studying, at no cost." },
      { title: "Camp Garibaldi \u00D7 Scripps Education", description: "Our youth ocean camp teaches 8\u201316 year olds to read Scripps buoy data, interpret tide charts, and understand marine ecosystems — then gets them in the water to experience it firsthand. A Scripps researcher guest session during camp would be extraordinary for the kids and compelling content for both organizations." },
      { title: "Citizen Science — Species Monitoring", description: "Our divers log species observations to iNaturalist after every session. Dr. Andrew Nosal's acoustic tagging work has shown soupfin sharks return to La Jolla Shores on a 3-year cycle — our divers witness these animals regularly. We could formalize structured underwater observation data from weekly dives at the canyon, reef, and kelp forest to complement Scripps research programs." },
      { title: "Kelp Canopy — Amplifying Parnell's Work", description: "Ed Parnell's 50-year kelp dataset, published this month, shows La Jolla's giant kelp forests are declining. We're integrating Kelpwatch.org satellite data into our conditions page to display kelp canopy status for divers. If Scripps has localized monitoring data for the La Jolla beds, we'd surface it to the community that cares most — the people who dive the kelp every week and can see the changes firsthand." },
      { title: "Birch Aquarium Cross-Referral", description: "Birch Aquarium shows 550,000 families the ocean through glass each year. We put them in it. A \"recommended experience\" listing for Camp Garibaldi and Discover Freediving would connect Scripps visitors to hands-on ocean immersion at La Jolla Shores — a natural extension of the aquarium experience." },
    ],
    showCamp: true,
    campHighlights: [
      { label: "Breath-First", description: "Breathing drills and composure training before any water skills. Athletic methodology, not wellness culture." },
      { label: "Real Data", description: "Kids learn to read buoy data, tide charts, and swell forecasts from Scripps instruments. Ocean literacy through practice." },
      { label: "Marine Science", description: "Species identification, ecosystem understanding, and conservation awareness — taught in the water, not from a textbook." },
      { label: "Certified Safety", description: "AIDA Youth Instructor. DAN insured. Red Cross First Aid/CPR/AED. All gear provided." },
    ],
    credentials: [
      { value: "UCSD", label: "Alumni\nCame home to build LJFC" },
      { value: "AIDA", label: "Instructor + Youth Instructor\nSan Diego's only AIDA-certified" },
      { value: "DAN", label: "Professional liability insured\nDivers Alert Network" },
      { value: "ARC", label: "Red Cross First Aid\nCPR/AED certified" },
      { value: "50+", label: "Species documented\nin our La Jolla field guide" },
      { value: "7", label: "Scripps data sources\npowering our platform" },
    ],
    ctaTitle: "The easiest first step is",
    ctaTitleEm: "mutual acknowledgment.",
    ctaDescription: "We add \"Powered by Scripps data\" to our platform. You list us as a community data user. Everything else grows from there. I'd love to hear what makes sense from your side.",
    ctaButtonText: "Start a conversation",
    ctaEmail: "joshuabeneventi@gmail.com",
    ctaEmailSubject: "LJFC × Scripps — Community Data Partnership",
    ctaSecondary: "Joshua Beneventi · UCSD Alum · joshuabeneventi@gmail.com",
  },
];

export function getPartner(slug: string): Partner | undefined {
  return partners.find((p) => p.slug === slug);
}

export function getAllPartners(): Partner[] {
  return partners;
}
