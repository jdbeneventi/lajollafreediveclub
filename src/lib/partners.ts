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

export interface PipelineStep {
  icon: string;
  label: string;
  detail: string;
}

export interface ConnectionSection {
  label: string;
  title: string;
  titleEm: string;
  cards: { title: string; content: string[] }[];
}

export interface ScienceComm {
  label: string;
  title: string;
  titleEm: string;
  paragraphs: string[];
}

export interface Partner {
  slug: string;
  name: string;
  heroImage?: string;
  heroHeadline: string;
  heroHeadlineEm: string;
  heroSubtitle: string;
  heritageLabel?: string;
  heritageQuote: string;
  heritageAttribution: string;
  connectionTitle: string;
  connectionTitleEm: string;
  connectionLabel?: string;
  connectionCards: { title: string; content: string[] }[];
  pipeline?: { label: string; title: string; titleEm: string; steps: PipelineStep[]; footnote?: string };
  additionalSections?: ConnectionSection[];
  scienceComm?: ScienceComm;
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
  campDescription?: string;
  campHighlights?: PartnerCampHighlight[];
  credentials: PartnerCredential[];
  credentialsLabel?: string;
  ctaTitle: string;
  ctaTitleEm: string;
  ctaDescription: string;
  ctaButtonText: string;
  ctaEmail: string;
  ctaEmailSubject: string;
  ctaSecondary: string;
  ctaLinks?: { label: string; url: string }[];
  images?: { src: string; alt: string; caption?: string; position: "after-heritage" | "after-connection" | "after-camp" | "after-ideas" }[];
}

export const partners: Partner[] = [
  {
    slug: "scripps",
    name: "Scripps Institution of Oceanography",
    heroImage: "/images/partners/scripps-aerial.jpg",
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
    images: [
      { src: "/images/partners/scripps-stairs.jpg", alt: "Stairs leading down to Scripps Pier with La Jolla coastline in background", position: "after-heritage" },
      { src: "/images/partners/scripps-campus.jpg", alt: "Scripps Institution of Oceanography campus overlooking the Pacific", position: "after-connection" },
    ],
  },
  {
    slug: "birch-aquarium",
    name: "Birch Aquarium at Scripps",
    heroImage: "/images/partners/birch-kelp-kids.jpg",
    heroHeadline: "550,000 visitors a year.",
    heroHeadlineEm: "One mile from the wild ocean.",
    heroSubtitle: "La Jolla is one of the only places in the world where families can swim with leopard sharks, watch sea lions play, and spot garibaldi on a reef \u2014 all from shore, in waist-deep water. Birch Aquarium shows them why the ocean matters. We give them the experience of being in it. Together, we could build something neither of us can offer alone.",
    heritageLabel: "Why This Matters to Me",
    heritageQuote: "I graduated from UCSD and came back to La Jolla to build the ocean program I wished existed when I was a kid here. My great-grandfather was a whaler from the Azores. My grandfather freedived for abalone in La Jolla. The first freediving club in America was founded here in 1939. I grew up in the water \u2014 and I know the difference between a kid who loves the ocean and a kid who's safe in it. Birch Aquarium creates the love. Camp Garibaldi builds the safety. Together, that's a complete ocean education.",
    heritageAttribution: "Joshua Beneventi \u2014 UCSD Alum, Founder of LJFC",
    connectionLabel: "The Opportunity",
    connectionTitle: "The wildlife is",
    connectionTitleEm: "right there.",
    connectionCards: [
      {
        title: "An untapped tourism experience",
        content: [
          "Every summer, leopard sharks aggregate in knee-deep water at La Jolla Shores \u2014 visible from the sand. Sea lions play with snorkelers at the Cove. Garibaldi \u2014 California's state fish \u2014 glow bright orange on every reef dive. Horn sharks rest under ledges at 20 feet. This is world-class marine wildlife, accessible to anyone who can put their face in the water.",
          "Birch Aquarium gets 550,000 visitors a year \u2014 many of them tourists looking for experiences. A mile away, these same animals are in the wild. But right now, there's no guided, professional bridge between the exhibit and the encounter. That's the opportunity.",
        ],
      },
      {
        title: "What we bring to the table",
        content: [
          "For kids, Camp Garibaldi is a week-long ocean camp: breath training, freediving, surf survival, marine species identification \u2014 all at La Jolla Shores. For adults and tourists, Discover Freediving is a 3-hour guided experience that gets them safely into the water and face-to-face with the animals they just saw behind glass. We're not an alternative to Birch's programming \u2014 we're the in-water extension.",
          "We handle safety (AIDA certified, DAN insured, Red Cross trained), provide all gear, and know these waters intimately \u2014 we dive here every week, year-round. Birch provides the science and the audience. We provide the immersion. Together, it's a complete La Jolla ocean experience that doesn't exist anywhere else in California.",
        ],
      },
    ],
    pipeline: {
      label: "The Family Journey",
      title: "From exhibit to",
      titleEm: "ocean.",
      steps: [
        { icon: "\uD83D\uDC20", label: "Birch Aquarium", detail: "Family visits. Kid sees the kelp forest exhibit. Falls in love with the ocean." },
        { icon: "\uD83D\uDCA1", label: "Inspiration", detail: "\"Can we go in the ocean? Can I see a real shark?\" Parent looks for options." },
        { icon: "\uD83C\uDF0A", label: "Camp Garibaldi", detail: "Week-long ocean camp. Breath training, freediving, surf survival, marine science." },
        { icon: "\uD83E\uDD3F", label: "Ocean Safe", detail: "Kid can read rip currents, survive surf, hold their breath, identify species, and handle themselves in real conditions." },
        { icon: "\uD83D\uDD04", label: "Ocean Steward", detail: "Returns to Birch with deeper understanding. Becomes a lifelong advocate for ocean conservation." },
      ],
      footnote: "For adults and tourists: Birch visit in the morning \u2192 Discover Freediving at La Jolla Shores in the afternoon. A complete ocean day, science to immersion, all within a mile of each other.",
    },
    additionalSections: [
      {
        label: "The Safety Case",
        title: "Inspiration without preparation",
        titleEm: "is a risk.",
        cards: [
          {
            title: "The gap is real",
            content: [
              "Drowning is a leading cause of death for children ages 1\u201314. La Jolla's coastline \u2014 rip currents at the Shores, surge at the Cove, rocks at Windansea \u2014 demands respect. Every summer, lifeguards rescue hundreds of swimmers at La Jolla beaches. Many are tourists and families who love the ocean but don't know how to read it.",
              "Birch Aquarium does something extraordinary: it makes people want to get in the water. That's a gift. But when a family leaves Birch and walks down to La Jolla Shores without knowing what a rip current looks like, there's a gap between inspiration and safety that someone should fill.",
            ],
          },
          {
            title: "What we teach",
            content: [
              "Camp Garibaldi's curriculum starts with ocean safety before anything else. Kids learn to read surf conditions, identify rip currents, perform the stingray shuffle, respond to hold-downs, and execute recovery breathing after submersion. These aren't theoretical lessons \u2014 they're practiced in the water, in real conditions, at La Jolla Shores.",
              "Our Discover Freediving course for adults covers the same fundamentals: breath control, calm under pressure, surf entry and exit, and how to assess conditions before entering the water. A Birch visitor who takes this course before their beach day is genuinely safer in the ocean.",
            ],
          },
        ],
      },
    ],
    scienceComm: {
      label: "Science Communication",
      title: "We don't just teach skills.",
      titleEm: "We teach the science behind them.",
      paragraphs: [
        "Camp Garibaldi isn't a generic ocean camp. Every session includes real physiology education \u2014 age-appropriate but scientifically grounded. Kids learn why the urge to breathe comes from rising CO\u2082, not low oxygen. They learn that their heart rate drops when their face hits cold water \u2014 the mammalian dive reflex \u2014 and that seals, whales, and dolphins share the same response. They learn that their spleen contracts to release oxygen-carrying red blood cells during a breath-hold.",
        "I've independently reviewed over 150 peer-reviewed papers on breath-hold diving physiology \u2014 from cerebral blood flow dynamics during apnea to the role of hypercapnia in neural plasticity. This isn't surface-level. I can speak to Birch's audience at whatever depth they want \u2014 from a 5-minute kids' talk about why dolphins hold their breath to a full public lecture on the neuroscience of the diving response.",
        "If Birch ever wants a guest speaker for a member event, school group, or public program on the physiology of breath-hold diving \u2014 the same physiology that governs every marine mammal in the exhibits \u2014 I'd love to do it.",
      ],
    },
    showCamp: true,
    campDescription: "A week-long ocean camp for ages 8\u201316 that starts with ocean safety and builds to freediving. Surf survival, rip current identification, breath control, and composure under pressure come first \u2014 before kids ever put a mask on. By the end of the week, they don't just love the ocean. They know how to be safe in it. That's the skill set that lasts a lifetime and the one most kids never get.",
    campHighlights: [
      { label: "Surf Survival First", description: "Rip current identification, wave assessment, safe entry and exit, hold-down response, recovery breathing. Real skills for real conditions at La Jolla Shores." },
      { label: "Breath-First Methodology", description: "Breathing drills and composure training before any water skills. We build internal calm and breath control so kids don't panic when things get real." },
      { label: "Scripps Data Literacy", description: "Kids learn to read buoy data, tide charts, and swell forecasts from the same instruments Birch's scientists use. They learn to assess the ocean before entering it." },
      { label: "Species in the Wild", description: "The garibaldi, leopard sharks, horn sharks, and sea lions they saw at Birch \u2014 we show them the same animals in their natural habitat at La Jolla Shores and Cove." },
      { label: "Conservation Through Competence", description: "Kids who are safe and comfortable in the ocean become its strongest advocates. Every session includes marine reserve education, species identification, and stewardship." },
      { label: "Certified Safety", description: "AIDA Youth Instructor. DAN insured. Red Cross First Aid/CPR/AED. All gear provided. 4:1 student-to-instructor ratio in the water." },
    ],
    partnershipTitle: "Seven ways to connect",
    partnershipTitleEm: "exhibit to ocean.",
    partnershipIdeas: [
      { title: "Co-Hosted \"Exhibit to Ocean\" Experience", description: "The flagship idea. A quarterly or seasonal event: morning at Birch with a guided tour of the kelp forest and Living Seas exhibits, afternoon at La Jolla Shores for a guided snorkel and wildlife encounter with LJFC. Families see leopard sharks, garibaldi, and sea lions in the wild \u2014 the same species they just saw behind glass. Could work as a public event, a Birch member exclusive, or a premium tourism package." },
      { title: "Discover Freediving for Birch Visitors", description: "A 3-hour guided ocean experience for adults and tourists: breath control, ocean safety, and a guided snorkel or freedive at La Jolla Shores. The draw is the wildlife \u2014 leopard sharks in the shallows, bat rays cruising the sand, garibaldi on every reef. Could also run as a special \"Ocean After Dark\" night snorkel \u2014 hunting octopus, horn sharks, bioluminescence. Premium, memorable, and unlike anything else offered in La Jolla." },
      { title: "Camp Garibaldi Scholarship", description: "Birch sponsors one or more Camp Garibaldi spots per summer for a family that couldn't otherwise afford it. This isn't just enrichment \u2014 it's life-saving capability. A sponsored kid learns surf survival, breath control, rip current identification, and ocean confidence. They also become a lifelong ocean steward. \"Birch Aquarium doesn't just show kids the ocean \u2014 they help make them safe in it.\" We handle all logistics and instruction." },
      { title: "Guest Speaker \u2014 The Physiology of Diving", description: "Every marine mammal in Birch's exhibits shares the mammalian dive reflex with humans \u2014 bradycardia, peripheral vasoconstriction, splenic contraction. I can present on this topic for any Birch audience: a 5-minute kids' talk on \"why dolphins hold their breath,\" a member evening on the neuroscience of freediving, or a school group session connecting exhibit animals to human physiology. This bridges Birch's marine biology programming with human performance science in a way no other local partner can." },
      { title: "Shared Educational Resources", description: "Our underwater field guide documents 50+ species at La Jolla with depth zones, seasonal patterns, and identification tips. Our conditions platform displays real-time Scripps data in a format anyone can understand. These resources could complement Birch exhibits, power educational handouts, or serve as a \"what's in the water today\" display in the aquarium \u2014 connecting the species behind glass to what's actually swimming outside right now." },
      { title: "Mutual Referral & Collateral", description: "Birch lists Camp Garibaldi (youth) and Discover Freediving (adults) as \"recommended local experiences\" on its website, family resources, or visitor guide. We list Birch Aquarium on our site as the essential marine science companion. We provide professionally designed cards for the gift shop and admissions desk at no cost. Simple, low-effort, easy to start immediately." },
      { title: "Tourism Package \u2014 \"The La Jolla Ocean Day\"", description: "The long-game vision: a co-branded tourism product. \"The La Jolla Ocean Day\" \u2014 Birch Aquarium + guided wildlife snorkel at La Jolla Shores + conditions briefing from real Scripps data, packaged as a half-day or full-day experience. Sold through Birch's website, hotel concierges, and SD Tourism Authority. La Jolla already has the wildlife, the infrastructure, and the audience. This just packages what's already there into something bookable." },
    ],
    credentialsLabel: "At a Glance",
    credentials: [
      { value: "UCSD", label: "Alumni\nCame home to build LJFC" },
      { value: "AIDA", label: "Instructor + Youth Instructor\nSan Diego's only AIDA-certified" },
      { value: "8\u201316", label: "Ages served\nby Camp Garibaldi" },
      { value: "4:1", label: "Student-to-instructor\nratio in the water" },
      { value: "50+", label: "Species documented\nin our La Jolla field guide" },
      { value: "1 mi", label: "From Birch Aquarium\nto our dive site at Kellogg Park" },
      { value: "DAN", label: "Professional liability insured\nDivers Alert Network" },
      { value: "6am", label: "Daily conditions email\nPowered by Scripps data" },
    ],
    ctaTitle: "Let's talk about what this",
    ctaTitleEm: "could look like.",
    ctaDescription: "There's a world-class marine wildlife experience one mile from your front door \u2014 leopard sharks, sea lions, garibaldi, horn sharks \u2014 and no one is packaging it with Birch as a unified experience for families and tourists. I think there's something real here. I'd love 30 minutes to explore it with you.",
    ctaButtonText: "Let's find 30 minutes",
    ctaEmail: "joshuabeneventi@gmail.com",
    ctaEmailSubject: "LJFC \u00D7 Birch Aquarium \u2014 Let's Talk",
    ctaSecondary: "Joshua Beneventi · UCSD Alum · joshuabeneventi@gmail.com",
    ctaLinks: [
      { label: "lajollafreediveclub.com/camp-garibaldi", url: "https://lajollafreediveclub.com/camp-garibaldi" },
      { label: "lajollafreediveclub.com/conditions", url: "https://lajollafreediveclub.com/conditions" },
      { label: "lajollafreediveclub.com/map", url: "https://lajollafreediveclub.com/map" },
    ],
    images: [
      { src: "/images/partners/birch-child-fish.jpg", alt: "Child pointing at fish in the Birch Aquarium reef exhibit", position: "after-heritage" },
      { src: "/images/partners/birch-whales.jpg", alt: "Families at the Birch Aquarium whale fountain entrance", caption: "550,000 visitors a year — one mile from the wild ocean", position: "after-camp" },
    ],
  },
];

export function getPartner(slug: string): Partner | undefined {
  return partners.find((p) => p.slug === slug);
}

export function getAllPartners(): Partner[] {
  return partners;
}
