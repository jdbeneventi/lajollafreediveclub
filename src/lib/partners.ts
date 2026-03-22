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
  threeColSection?: { label: string; title: string; titleEm: string; subtitle?: string; cards: { label: string; title: string; description: string }[] };
  providesTitle?: string;
  providesTitleEm?: string;
  providesSubtitle?: string;
  providesCards?: PartnerDataSource[];
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
      { src: "/images/photos/joshua-lena-shores.jpg", alt: "Joshua and Lena at La Jolla Shores — directly below Scripps Pier", caption: "At La Jolla Shores — your front yard, our dive site", position: "after-connection" },
      { src: "/images/photos/joshua-teaching-kids.jpg", alt: "Joshua teaching kids freediving poolside", caption: "Camp Garibaldi — breath-first ocean education", position: "after-camp" },
      { src: "/images/photos/ljfc-crew-lunch.jpg", alt: "LJFC crew after a Saturday session", caption: "The Saturday crew — this is who shows up every week", position: "after-ideas" },
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
      { src: "/images/photos/joshua-brooke-kristina.jpg", alt: "LJFC crew in wetsuits ready to dive La Jolla", caption: "Your audience inspired — our crew ready to take them in", position: "after-connection" },
      { src: "/images/photos/joshua-kid-beach.jpg", alt: "Joshua with a young student at the beach after a session", caption: "Camp Garibaldi — from nervous about waves to confident in the ocean", position: "after-camp" },
      { src: "/images/photos/ljfc-crew-lunch.jpg", alt: "LJFC crew after a Saturday session", caption: "The community behind the program", position: "after-ideas" },
    ],
  },
  {
    slug: "ocean-discovery-institute",
    name: "Ocean Discovery Institute",
    heroImage: "/images/partners/odi-living-lab.jpg",
    heroHeadline: "The ocean is 20 minutes away.",
    heroHeadlineEm: "For some kids, it might as well be another planet.",
    heroSubtitle: "ODI has spent two decades getting underserved San Diego kids into ocean science. LJFC teaches kids to be in the ocean \u2014 with breath control, freediving, and surf survival. But the deeper work is what breath-hold training does off the water: nervous system regulation, composure under pressure, and the kind of courage that only comes from facing real challenge. Together, we could build the bridge from City Heights to the waterline \u2014 and to a different relationship with fear.",
    heritageLabel: "Why This Is Personal",
    heritageQuote: "Shara Fisler started ODI from a kayak shack in Mission Bay because she realized she could make a bigger difference creating science opportunities for young people than doing science herself. I grew up in Point Loma, four blocks from the water, and never thought about ocean access because I always had it. When I started teaching freediving to kids, I realized most San Diego children \u2014 even ones who live 20 minutes from the beach \u2014 have never put their face underwater in the ocean. That's not a skill gap. That's an access gap. ODI has been working on that gap for 25 years. I want to help.",
    heritageAttribution: "Joshua Beneventi \u2014 UCSD Alum, Founder of LJFC",
    connectionTitle: "ODI teaches ocean science.",
    connectionTitleEm: "We add ocean capability.",
    connectionCards: [
      {
        title: "What ODI has built",
        content: [
          "In 25 years, ODI has gone from a kayak shack in Mission Bay to a $17 million Living Lab in the heart of City Heights \u2014 complete with a Scientist-in-Residence studio, live-streaming ocean views, and a Leadership Pathway wall celebrating alumni. You serve 6,000+ students a year across every school in the Hoover cluster. Your Ocean Leaders learn to swim and snorkel, do rocky intertidal research at Cabrillo Tidepools, visit Scripps, travel to Mexico for fieldwork. You've won the Presidential Award. NOAA funds you. Charity Navigator gives you 4 stars. Anai Novoa, Class of 2007, now coordinates summer programs at Scripps and has served on your Science Advisory Council.",
          "I also know the AmeriCorps partnership that funded your teachers ended overnight. That makes what I'm offering more relevant, not less \u2014 because LJFC doesn't need ODI's funding. We bring our own instruction, our own insurance, our own gear. What we need from you is what money can't buy: the students and the community trust.",
        ],
      },
      {
        title: "The specific gap we fill",
        content: [
          "ODI gets kids to the coast and teaches ocean science brilliantly. Your Ocean Leaders already snorkel and do intertidal research. What the program doesn't include \u2014 and shouldn't have to build from scratch \u2014 is breath-hold diving, surf survival, underwater composure, and advanced in-water capability. That's a specialized athletic discipline requiring AIDA Youth Instructor certification, DAN insurance, and a specific training methodology.",
          "Camp Garibaldi's breath-first methodology starts on land \u2014 composure and breathing drills that could begin at the Living Lab \u2014 before progressing to open water at La Jolla Shores. For Ocean Leaders who already snorkel, this is the next level. For younger students in summer camp, it's a foundation of water safety and confidence they'll carry for life.",
        ],
      },
    ],
    researchTitle: "Ocean competence is",
    researchTitleEm: "a life skill.",
    researchSubtitle: "Kids who are confident in the ocean are safer in the ocean. They become surfers, divers, marine biologists, lifeguards, conservationists. But that confidence has to be built \u2014 and right now, it's mostly built by families who already have access.",
    researchCards: [
      { id: "Safety", name: "Drowning Prevention", detail: "Drowning is a leading cause of death for children ages 1-14. Kids who learn breath control, rip current identification, and surf survival carry those skills for life." },
      { id: "Confidence", name: "Composure Under Pressure", detail: "Our breath-first methodology teaches kids to manage panic, control their breathing, and stay calm when things get intense \u2014 skills that transfer far beyond the ocean." },
      { id: "Science", name: "Ocean Data Literacy", detail: "Every camp session includes reading real Scripps buoy data, tide charts, and weather forecasts. Kids learn to assess the ocean using the same instruments scientists use." },
      { id: "Stewardship", name: "Conservation Through Experience", detail: "Kids who've swum with leopard sharks and identified garibaldi on a reef don't need to be told the ocean matters. They know. They become its advocates." },
      { id: "Gear Provided", name: "Zero Barrier to Entry", detail: "Wetsuits, masks, fins, snorkels \u2014 all provided. No family needs to own anything. The only requirement is showing up. We remove every equipment barrier." },
      { id: "Location", name: "La Jolla Shores", detail: "Sandy beach, gentle slope, warm shallow water, lifeguards on duty. The easiest and safest ocean entry in San Diego. Inside the Matlahuayl Marine Reserve \u2014 protected since 1929." },
    ],
    additionalSections: [
      {
        label: "Beyond Ocean Skills",
        title: "Breath-hold training is",
        titleEm: "character development.",
        cards: [
          {
            title: "The science of composure",
            content: [
              "When a kid holds their breath and feels the urge to breathe, something remarkable happens: their body floods with CO\u2082, which activates stress circuits in the brain. The urge to panic is real and measurable. But with training, kids learn to recognize that signal, stay calm, and choose their response rather than react. That's not ocean training \u2014 that's nervous system regulation. It's the same skill that helps in a test, a conflict, a job interview, or any moment where the pressure is on and the instinct is to freeze or flee.",
              "The mammalian dive reflex \u2014 the same response that allows seals and dolphins to dive \u2014 triggers automatically in every human: heart rate drops, peripheral blood vessels constrict, the body conserves oxygen. Kids learn that their bodies are built for this. That biological truth becomes a foundation for confidence that no pep talk can match.",
            ],
          },
          {
            title: "What it builds in kids",
            content: [
              "Courage through incremental challenge. Every breath hold is slightly longer than the last. Every dive is slightly deeper. Kids learn to sit with discomfort, push their edge, and expand what they thought was possible \u2014 in a controlled, safe environment with a trained instructor beside them.",
              "Trust and partnership. Freediving is a buddy discipline. One person dives, the other watches. You are responsible for someone else's safety, and they are responsible for yours. That mutual accountability is built into every session from day one.",
              "Self-knowledge through physiology. Kids learn what happens in their body under stress \u2014 rising CO\u2082, diaphragm contractions, heart rate changes \u2014 and they learn it's not something to fear. It's information. That reframe changes how they relate to pressure everywhere.",
            ],
          },
        ],
      },
    ],
    showCamp: true,
    campDescription: "Named after the garibaldi \u2014 California's state fish, bright orange, impossible to miss, and fiercely protective of its territory. Camp Garibaldi teaches kids to be that confident in the water. A week-long program for ages 8\u201316 that builds breath control, ocean awareness, and real capability before kids ever put a mask on.",
    campHighlights: [
      { label: "Breath-First", description: "We start on land. Breathing drills, composure exercises, and understanding what your body does under stress \u2014 before anyone gets in the water. This is how we build confidence that lasts." },
      { label: "Surf Survival", description: "Rip current identification, wave assessment, safe entry and exit, hold-down response. Real skills for real conditions \u2014 not a pool simulation." },
      { label: "Freediving", description: "By mid-week, kids are holding their breath for over a minute and diving to the bottom at La Jolla Shores. They learn equalization, buoyancy, and how to move efficiently underwater." },
      { label: "Nervous System Literacy", description: "Kids learn why the urge to breathe comes from CO\u2082, not low oxygen. They learn the dive reflex. They learn to read their body's signals as information, not emergency. This transfers to every high-pressure moment in their lives." },
      { label: "Marine Science", description: "Species identification in the wild \u2014 the same leopard sharks, garibaldi, and sea lions that live in the La Jolla reserve. Plus real Scripps ocean data literacy." },
      { label: "Courage & Trust", description: "Incremental challenge builds real courage. The buddy system builds mutual accountability. Kids leave knowing they can handle things they didn't think they could." },
      { label: "4:1 Ratio", description: "Maximum 4 students per instructor in the water. Every kid gets individual attention, especially the ones who are nervous. We never rush a kid past their comfort zone." },
      { label: "All Gear Provided", description: "Wetsuit, mask, fins, snorkel \u2014 everything. No family needs to buy or bring anything. The financial barrier stops at the registration fee (and with ODI, maybe not even there)." },
    ],
    partnershipTitle: "Six ways to build",
    partnershipTitleEm: "this together.",
    partnershipIdeas: [
      { title: "Ocean Leaders \u2014 Freediving as a STEM Skill", description: "Ocean Leaders starts the summer before 9th grade with a 12-day Bridge program. The following summer, students learn to swim and snorkel, visit Mexico for fieldwork, and interact with sea life. In 9th grade, they do rocky intertidal research at Cabrillo Tidepools. Freediving is the natural next step in this progression \u2014 it takes students who can already snorkel and gives them breath-hold capability, equalization skills, and the ability to observe below the surface. An AIDA certification is internationally recognized and directly applicable to marine science careers. We'd offer sponsored AIDA certification for Ocean Leaders as part of their 10th or 11th grade summer intensive." },
      { title: "Out-of-School Summer Module \u2014 Ocean Safety & Freediving", description: "ODI already runs week-long summer camps for K-8 with changing themes each year. A \"Breath & Ocean\" week \u2014 co-designed with your curriculum team \u2014 could add breath-hold training, surf survival, and underwater confidence to the rotation. We bring the in-water instruction and all gear. ODI provides the students, the community relationships, and the educational framework. Dry sessions (breathing drills, ocean data literacy) could happen at the Living Lab. Ocean days happen at La Jolla Shores." },
      { title: "\"First Ocean Day\" \u2014 Single-Day Pilot", description: "The lowest-commitment way to start. One Saturday, ODI brings a group of students to La Jolla Shores for a guided ocean experience: tide pool exploration, shallow water snorkeling, species identification, and introductory breath-hold exercises. No certification, no pressure \u2014 just a day in the ocean with professional guidance and all gear provided. We see how the kids respond, what works, and what to adjust before building anything bigger." },
      { title: "Joint Grant Applications", description: "ODI already receives NOAA B-WET funding and has relationships with California Coastal Conservancy, San Diego Foundation, and Price Philanthropies. Beyond your existing funders: the Lilly Endowment just awarded the American Camp Association $45.5 million for character development at camps \u2014 with individual grants of $50,000 to $300,000 available to nonprofit camps serving underrepresented youth. Freediving is uniquely suited to character development: composure under pressure, incremental courage, trust through the buddy system, and self-knowledge through physiology. ODI's 501(c)(3) status and track record combined with LJFC's specialized curriculum makes a compelling application." },
      { title: "Character Development Through the Ocean", description: "This is the deeper opportunity. Breath-hold training isn't just a physical skill \u2014 it teaches kids to sit with discomfort, manage panic responses, build tolerance incrementally, and trust a partner with their safety. Every breath hold is a controlled encounter with your own limits. The ACA's Character at Camp initiative specifically funds programs that develop perseverance, responsibility, and willingness to try new things \u2014 that's a freediving session described in developmental language. With ODI's expertise in youth development and LJFC's methodology, we could build a character development curriculum grounded in ocean science and breath-hold physiology that doesn't exist anywhere else." },
      { title: "STEM Career Pathway \u2014 Marine Fieldwork", description: "ODI alumni are entering biotech, environmental consulting, fisheries, marine biology, and public policy. Your Ocean Leaders already do rocky intertidal research at Cabrillo Tidepools in 9th grade. Freediving extends that \u2014 giving students the ability to observe below the surface, collect data underwater, and build a skill that's rare and valuable in marine science. The pathway: Ocean Leaders introduction in high school \u2192 AIDA certification \u2192 citizen science data collection at the La Jolla marine reserve \u2192 college application with documented underwater fieldwork. Anai Novoa went from ODI Class of 2007 to Summer Programs Coordinator at Scripps and a seat on your Science Advisory Council. Imagine an Ocean Leader who arrives at Scripps already AIDA-certified and with a portfolio of underwater observations from the La Jolla canyon." },
    ],
    providesTitle: "Everything except",
    providesTitleEm: "the students.",
    providesSubtitle: "ODI brings community trust, student relationships, and organizational infrastructure. Here's what we bring to match it.",
    providesCards: [
      { id: "Instruction", name: "AIDA Youth Instructor", detail: "San Diego's only AIDA-certified youth instructor. Trained specifically for teaching children ages 8-16 in open water environments." },
      { id: "Safety", name: "DAN + Red Cross", detail: "Divers Alert Network professional liability insurance. American Red Cross Adult & Pediatric First Aid/CPR/AED. 4:1 student-to-instructor ratio." },
      { id: "Gear", name: "Complete Equipment", detail: "Wetsuits, masks, fins, snorkels for every student. All sizes. No family needs to own or purchase anything." },
      { id: "Curriculum", name: "Tested Program", detail: "Breath-first methodology, progressive skill building, marine science integration, Scripps data literacy. Developed specifically for kids with no prior ocean experience." },
      { id: "Development", name: "Character & Nervous System", detail: "Breath-hold training teaches composure under pressure, incremental courage, trust through the buddy system, and self-knowledge through physiology. These skills transfer to every high-pressure moment in a young person's life." },
      { id: "Location", name: "La Jolla Shores", detail: "Safest ocean entry in San Diego. Sandy bottom, gradual slope, warm water, lifeguards. Inside a marine reserve with abundant wildlife." },
      { id: "Platform", name: "Ocean Data Tools", detail: "Real-time conditions dashboard, underwater field guide with 50+ species, daily ocean intelligence. Kids learn to read the ocean like scientists do." },
    ],
    credentials: [
      { value: "UCSD", label: "Alumni\nCame home to build LJFC" },
      { value: "AIDA", label: "Instructor + Youth Instructor\nSan Diego's only" },
      { value: "8\u201316", label: "Ages served\nby Camp Garibaldi" },
      { value: "4:1", label: "Student-to-instructor\nratio in the water" },
      { value: "DAN", label: "Professional liability\nDivers Alert Network" },
      { value: "ARC", label: "Red Cross First Aid\nCPR/AED certified" },
    ],
    ctaTitle: "Start with",
    ctaTitleEm: "one group, one Saturday.",
    ctaDescription: "Bring a group of ODI students to La Jolla Shores for a guided ocean day. We provide the gear, the instruction, and the safety. You provide the kids and the trust. If it works, we build from there. Or, if you'd prefer to see the work firsthand: I'd love to apply for your Scientist-in-Residence program and spend a week at the Living Lab \u2014 teaching breath-hold physiology, running breathing exercises with students, and showing how the mammalian dive reflex connects every marine mammal in the ocean to the kids in the room.",
    ctaButtonText: "Let's get kids in the water",
    ctaEmail: "joshuabeneventi@gmail.com",
    ctaEmailSubject: "LJFC \u00D7 Ocean Discovery Institute \u2014 Youth Ocean Access",
    ctaSecondary: "Joshua Beneventi \u00B7 UCSD Alum \u00B7 joshuabeneventi@gmail.com",
    ctaLinks: [
      { label: "lajollafreediveclub.com/camp-garibaldi", url: "https://lajollafreediveclub.com/camp-garibaldi" },
      { label: "lajollafreediveclub.com/map", url: "https://lajollafreediveclub.com/map" },
    ],
    images: [
      { src: "/images/partners/odi-living-lab.jpg", alt: "Ocean Discovery Institute Living Lab in City Heights", caption: "The $17 million Living Lab \u2014 from a kayak shack to this", position: "after-heritage" },
      { src: "/images/photos/joshua-teaching-kids.jpg", alt: "Joshua teaching kids freediving poolside", caption: "Camp Garibaldi \u2014 breath-first ocean education", position: "after-connection" },
      { src: "/images/photos/joshua-kid-beach.jpg", alt: "Joshua with a young student at the beach", caption: "From nervous about waves to confident in the ocean", position: "after-camp" },
      { src: "/images/photos/ljfc-crew-lunch.jpg", alt: "LJFC crew after a Saturday session", caption: "The community behind the program", position: "after-ideas" },
    ],
  },
  {
    slug: "outdoor-outreach",
    name: "Outdoor Outreach",
    heroImage: "/images/partners/oo-kayakers.jpg",
    heroHeadline: "You take kids climbing, surfing, kayaking.",
    heroHeadlineEm: "We take them under the surface.",
    heroSubtitle: "Outdoor Outreach runs 500+ outdoor programs a year \u2014 hiking, biking, climbing, surfing, SUP, camping. But you don't have freediving. Nobody does. LJFC would be the first freediving program for underserved youth in San Diego. Here's how we add a new dimension to what you already do brilliantly.",
    heritageLabel: "Why This Matters to Me",
    heritageQuote: "Sunny Chang on your team said it best \u2014 some of your kids have lived in San Diego their whole lives and never been to the ocean. I know that feeling from the other side. I grew up in Point Loma, four blocks from the water. I never thought about ocean access because I always had it. My grandfather freedived for abalone in La Jolla. I graduated from UCSD, trained as a freediving instructor around the world, and came home to build the program I wish existed for every kid in this city \u2014 not just the ones who grew up on the coast.",
    heritageAttribution: "Joshua Beneventi \u2014 UCSD Alum, Founder of LJFC",
    connectionLabel: "The Fit",
    connectionTitle: "40+ outdoor activities.",
    connectionTitleEm: "Zero below the surface.",
    connectionCards: [
      {
        title: "What Outdoor Outreach has built",
        content: [
          "Since 1999, over 17,000 young people ages 9-24 have hiked, biked, kayaked, climbed, surfed, and camped with Outdoor Outreach. You operate 500+ programs a year across City Heights, El Cajon, and countywide. You've received $1.35 million in California Outdoor Equity Grants. San Diego Foundation funds your Opening the Outdoors work. You're part of the Thrive Outside coalition. Your Leadership Program graduates become your Field Instructors \u2014 you hire from within your own community.",
          "You take kids rock climbing in Joshua Tree, surfing in Coronado, kayaking in Mission Bay. You show them what they're capable of above the water and on land. But you don't go underneath. That's the frontier we open.",
        ],
      },
      {
        title: "What freediving adds",
        content: [
          "Freediving is unlike any other outdoor activity. Every other sport lets you externalize stress \u2014 push harder, move faster, yell louder. Freediving requires the opposite. You slow down. You quiet your mind. You learn that the urge to panic is a signal, not a command. Then you go underwater and discover you can do something extraordinary.",
          "For a kid who's never been in the ocean, holding their breath for a minute and diving to the bottom at La Jolla Shores is a defining moment. It rewires what they believe they're capable of \u2014 and that transfers to every hard thing they face afterward. That's character development through physiology, not lecture.",
        ],
      },
    ],
    researchTitle: "What a breath hold",
    researchTitleEm: "actually teaches.",
    researchSubtitle: "Every outdoor activity builds character. Freediving builds a specific kind \u2014 the kind that comes from sitting with discomfort and discovering you can handle it.",
    researchCards: [
      { id: "Composure", name: "Calm Under Pressure", detail: "The urge to breathe is driven by rising CO\u2082, not low oxygen. Learning to stay calm through that discomfort \u2014 to recognize it as a signal, not an emergency \u2014 is the core skill." },
      { id: "Courage", name: "Incremental & Measurable", detail: "Yesterday you held your breath for 30 seconds. Today, 45. Tomorrow, a minute. Courage isn't abstract \u2014 it's a number you can see growing. Kids track their own progress in real time." },
      { id: "Trust", name: "The Buddy System", detail: "In freediving, you never dive alone. Your buddy watches you, and you watch them. You literally trust another person with your safety. That's not a team-building exercise \u2014 it's the real thing." },
      { id: "Self-Knowledge", name: "Reading Your Own Body", detail: "Kids learn to recognize their heart rate, their breathing pattern, their stress response. They learn what panic feels like \u2014 and that they can choose how to respond to it." },
      { id: "Resilience", name: "Failure is Built In", detail: "Every freediver hits their limit multiple times per session. You come up, breathe, rest, try again. The practice of meeting your edge and returning to it is the practice of resilience." },
      { id: "Wonder", name: "A World Below the Surface", detail: "Leopard sharks, garibaldi, sea lions, bat rays \u2014 all visible from a single breath hold at La Jolla Shores. The moment a kid sees a shark underwater for the first time, everything changes." },
    ],
    additionalSections: [
      {
        label: "What LJFC Brings",
        title: "You handle recruitment and trust.",
        titleEm: "We handle the water.",
        cards: [
          {
            title: "Instruction & safety",
            content: [
              "San Diego's only AIDA-certified Youth Instructor. DAN professional liability insured. Red Cross First Aid/CPR/AED. 4:1 student-to-instructor ratio in the water. The methodology starts on land \u2014 breathing drills, composure exercises, understanding your body's stress response \u2014 before anyone enters the ocean. Designed specifically for kids with no prior ocean experience.",
            ],
          },
          {
            title: "Gear & location",
            content: [
              "Complete gear for every participant: wetsuits, masks, fins, snorkels. All sizes. No family needs to own or bring anything. We operate at La Jolla Shores \u2014 sandy bottom, gentle slope, warm shallow water, lifeguards on duty. The easiest and safest ocean entry in San Diego. Inside the Matlahuayl Marine Reserve, protected since 1929 \u2014 world-class wildlife within wading distance.",
            ],
          },
        ],
      },
    ],
    showCamp: false,
    partnershipTitle: "Five ways to add freediving",
    partnershipTitleEm: "to your menu.",
    partnershipIdeas: [
      { title: "Freediving as an Adventure Club Activity", description: "Outdoor Outreach runs weekend, summer, and after-school adventure clubs in City Heights and El Cajon. Freediving slots in alongside surfing, SUP, and kayaking \u2014 but with a completely different character. We run a half-day session at La Jolla Shores: breath training on the beach, shallow water confidence building, then guided snorkeling and freediving on the reef. All gear provided. One session is enough for kids to hold their breath for over a minute and see wildlife they'll never forget." },
      { title: "Leadership Program \u2014 AIDA Certification", description: "Your Leadership Program graduates become Field Instructors \u2014 you hire from your own community. An AIDA freediving certification adds a tangible, internationally recognized credential to their development. It's rare, impressive on a resume, and directly applicable to marine science, conservation, and outdoor recreation careers. A certified freediver who started in your Leadership Program is a powerful story for both of our organizations." },
      { title: "Pilot Session \u2014 One Group, One Saturday", description: "The simplest way to start. Bring one Outdoor Outreach group to La Jolla Shores on a Saturday morning. We handle everything: instruction, gear, safety, logistics. Your staff observes. Kids experience it. We debrief afterward and decide together whether this belongs in your program rotation. No cost, no commitment \u2014 just a test." },
      { title: "Foster Care Youth \u2014 Ocean as Regulation", description: "Outdoor Outreach partners with Casey Family Programs to serve young adults in the foster care system. Freediving's emphasis on breath control, composure under stress, and nervous system regulation is especially relevant for youth who've experienced trauma. The mammalian dive reflex \u2014 the body's automatic calming response to water immersion \u2014 is measurable, immediate, and doesn't require talking about anything. It's embodied regulation, not therapy. For kids who've learned to be on guard, discovering they can be calm underwater is quietly transformative." },
      { title: "Joint Grant Applications", description: "Outdoor Outreach already receives California Outdoor Equity Grants and San Diego Foundation Opening the Outdoors funding. \"Freediving for underserved youth\" adds a unique dimension to existing grant narratives \u2014 ocean access that goes literally below the surface. The ACA's Lilly Endowment Character at Camp initiative ($45.5M nationally) specifically funds programs building perseverance, responsibility, and willingness to try new things. A freediving module \u2014 with its measurable progression, buddy-system trust, and composure training \u2014 fits that framework perfectly. Your nonprofit status is the vehicle. Our program is the content." },
    ],
    credentials: [
      { value: "UCSD", label: "Alumni\nCame home to build LJFC" },
      { value: "AIDA", label: "Instructor + Youth Instructor\nSan Diego's only" },
      { value: "4:1", label: "Student-to-instructor\nratio in the water" },
      { value: "DAN", label: "Professional liability\nDivers Alert Network" },
      { value: "ARC", label: "Red Cross First Aid\nCPR/AED certified" },
      { value: "Gear", label: "All equipment provided\nZero barrier to entry" },
    ],
    ctaTitle: "Bring a group.",
    ctaTitleEm: "We'll take them under.",
    ctaDescription: "One Saturday at La Jolla Shores. We provide the gear, the instruction, the safety. Your staff watches. If the kids come out of the water talking about it for weeks \u2014 we build it into your rotation. That's the whole pitch.",
    ctaButtonText: "Let's plan a pilot session",
    ctaEmail: "joshuabeneventi@gmail.com",
    ctaEmailSubject: "LJFC \u00D7 Outdoor Outreach \u2014 Freediving for Youth",
    ctaSecondary: "Joshua Beneventi \u00B7 UCSD Alum \u00B7 joshuabeneventi@gmail.com",
    ctaLinks: [
      { label: "lajollafreediveclub.com/camp-garibaldi", url: "https://lajollafreediveclub.com/camp-garibaldi" },
      { label: "lajollafreediveclub.com/map", url: "https://lajollafreediveclub.com/map" },
    ],
    images: [
      { src: "/images/partners/oo-surfers.jpg", alt: "Outdoor Outreach kids with surfboards on the beach", caption: "500+ outdoor programs a year \u2014 hiking, biking, climbing, surfing, kayaking", position: "after-heritage" },
      { src: "/images/photos/joshua-teaching-kids.jpg", alt: "Joshua teaching kids freediving", caption: "Breath-first methodology \u2014 composure before capability", position: "after-connection" },
      { src: "/images/photos/joshua-kid-beach.jpg", alt: "Joshua with a young student at the beach", caption: "From never been in the ocean to confident underwater", position: "after-camp" },
      { src: "/images/photos/ljfc-crew-lunch.jpg", alt: "LJFC crew after a Saturday session", caption: "The community behind the program", position: "after-ideas" },
    ],
  },
  {
    slug: "ucsd",
    name: "UC San Diego",
    heroHeadline: "40,000 students. Five minutes",
    heroHeadlineEm: "from the best diving in California.",
    heroSubtitle: "I'm a UCSD alum. I run the only AIDA-certified freediving operation in San Diego, based at La Jolla Shores \u2014 a 5-minute drive from campus. You already have surfing, kayaking, scuba, sailing, rock climbing, and Baja trips. You don't have freediving. I'd like to change that \u2014 and I think it fits in more places than you'd expect.",
    heritageLabel: "Coming Home",
    heritageQuote: "I graduated from UCSD. I trained as a freediving instructor in Malaysia, Egypt, and Baja. I came back to La Jolla because there's nowhere better in the world to teach this sport \u2014 the canyon starts 100 yards from the beach, the marine reserve has been protected since 1929, and the first freediving club in America was founded here in 1939. Your Baja Surf Safari goes to the same coastline where I did my advanced training. The Scripps Scientific Diving Program \u2014 the oldest in the world \u2014 is 500 yards from where I dive every Saturday. The connection between UCSD and this ocean is already deep. Freediving just makes it personal.",
    heritageAttribution: "Joshua Beneventi \u2014 UCSD Alum, Founder of LJFC",
    connectionLabel: "The Opportunity",
    connectionTitle: "Outback has everything",
    connectionTitleEm: "except freediving.",
    connectionCards: [
      {
        title: "What UCSD Recreation already runs",
        content: [
          "Outback Adventures: surfing at Blacks and in Baja, kayaking at Mission Bay and Catalina, rock climbing at Joshua Tree, backpacking in the Sierra, Wilderness Orientation trips that define the start of college for thousands of incoming students every year.",
          "The UCSD scuba program: PADI certification from Open Water through Divemaster. Mission Bay Aquatic Center: 30,000+ participants per year. Scripps Scientific Diving: the oldest scientific diving program in the world, 150-200 active divers on campus. UCSD Rec already runs the most comprehensive university watersports operation in the country. Freediving is the one underwater discipline that's missing \u2014 and it happens to be the fastest-growing one in the world.",
        ],
      },
      {
        title: "Why students will love this",
        content: [
          "Freediving is the most Instagram-worthy, story-worthy, bucket-list-worthy water activity a student can do in San Diego. Holding your breath for 2 minutes. Diving to 30 feet on a single breath. Swimming with leopard sharks and garibaldi in a marine reserve. Coming up with a story nobody at their next class has heard before.",
          "It's also internationally certified. An AIDA card travels with them after graduation \u2014 usable in Bali, the Philippines, Egypt, Thailand, wherever they go. For international students especially, this is a California experience and a lifelong credential in one package.",
        ],
      },
    ],
    researchTitle: "Six ways to",
    researchTitleEm: "get in the water.",
    researchSubtitle: "Each offering fits a different commitment level and can integrate into Outback's existing registration system.",
    researchCards: [
      { id: "Entry Level", name: "Discover Freediving", detail: "Half-day session. Breath training, pool work, open water experience at La Jolla Shores. No prerequisites. Student rate: $125 (vs. $175 regular). Run quarterly, capacity 8-12 students." },
      { id: "Certification", name: "AIDA 2 Course", detail: "2-3 day course. Theory, pool sessions, open water dives. Internationally recognized certification valid in 100+ countries. Student rate: $475 (vs. $575 regular). Run during breaks." },
      { id: "Community", name: "Saturday Ocean Sessions", detail: "Weekly group dive at La Jolla Shores. Free with Ocean Flow ($20 yoga warmup) or $25 drop-in. Requires freediving certification, own gear, and signed waiver." },
      { id: "Club Event", name: "Breath-Hold Workshop", detail: "Free 90-minute workshop for any UCSD club \u2014 Surf Team, Club Swim, international student groups, Greek life, dorm groups. Dry-land breath training, timed holds, physiology basics. Zero cost." },
      { id: "WO Trip", name: "Wilderness Orientation \u2014 Freedive", detail: "A new WO option: multi-day freediving trip at La Jolla Shores for incoming students. Breath training, ocean safety, species identification, and guided dives in the marine reserve." },
      { id: "Baja Extension", name: "Freediving in Baja", detail: "Your Baja Surf Safari already goes to the Pacific coast south of Ensenada. A Baja freediving trip \u2014 warm water, clear visibility, mobula rays \u2014 is a natural sibling trip. I trained in Baja and know the dive sites." },
    ],
    threeColSection: {
      label: "Where It Fits",
      title: "Freediving connects to programs",
      titleEm: "that already exist.",
      subtitle: "This isn't a standalone add-on. Freediving integrates with at least seven existing UCSD programs \u2014 each one a different door into the same experience.",
      cards: [
        { label: "Outback Adventures", title: "The core integration", description: "Quarterly Discover Freediving sessions listed alongside surfing, kayaking, and climbing. Baja Freediving as a sibling to Baja Surf Safari. Wilderness Orientation Freedive Trip for incoming students." },
        { label: "UCSD Scuba Program", title: "The complement", description: "UCSD already runs PADI certification from Open Water through Divemaster. Freediving sits alongside scuba \u2014 not as a replacement, but as a parallel discipline. The underwater program becomes complete." },
        { label: "Scripps Scientific Diving", title: "The research tool", description: "150-200 scientific divers on campus. Freediving offers silent, bubble-free observation. Faster deployment, no tank logistics. For marine bio grad students studying behavior in the field, it's a practical complement." },
        { label: "Scripps DIVERSity Fellowship", title: "The access pathway", description: "Freediving is inherently lower-barrier than scuba: less gear, lower cost, simpler logistics. A breath-hold training and water confidence module for incoming DIVERSity fellows builds comfort before the full scientific diving course." },
        { label: "CAPS \u00D7 Rec: Tritons RISE", title: "The wellbeing workshop", description: "CAPS and Rec co-run Tritons RISE workshops. A \"breath-hold and ocean immersion\" workshop fits directly. The mammalian dive reflex activates the parasympathetic nervous system \u2014 measurable stress reduction, not abstract wellness talk." },
        { label: "Mission Bay Aquatic Center", title: "The youth pipeline", description: "MBAC's Watersports Camp serves 30,000+ participants per year, ages 6-17. Camp Garibaldi is the underwater option for kids who are ready to go deeper. Complementary, not competitive." },
      ],
    },
    additionalSections: [
      {
        label: "Student Clubs",
        title: "The clubs that would",
        titleEm: "sign up tomorrow.",
        cards: [
          {
            title: "UCSD Surf Team",
            content: [
              "State champions for the first time since 1997. Their own constitution lists \"water safety\" as the primary risk. Surf survival \u2014 wipeout recovery, extended breath-holds, calm under turbulence \u2014 is exactly what I teach. A free breath-hold workshop for the competitive surf team is the single highest-signal workshop on campus.",
            ],
          },
          {
            title: "Club Swim + International Students + 750 Orgs",
            content: [
              "UCSD Club Swim is one of the fastest-growing sport clubs on campus. UCSD has one of the largest international student populations in the UC system \u2014 students actively seeking the quintessential California experience. And with 750+ registered student organizations, a free breath-hold workshop is the easiest event a club can book: no pool, no ocean, no gear, no cost. Just a room and 90 minutes.",
            ],
          },
        ],
      },
      {
        label: "Research & Academics",
        title: "The academic connections",
        titleEm: "are already there.",
        cards: [
          {
            title: "EPARC & Exercise Physiology",
            content: [
              "The Exercise and Physical Activity Resource Center runs the \"Exercise Is Medicine\u00AE\" curriculum in UCSD Medical School and conducts applied exercise physiology research. Breath-hold physiology \u2014 cardiovascular responses to apnea, cerebral blood flow during hypoxia, parasympathetic activation \u2014 is an area with active research interest. LJFC provides a population of trained freedivers and a weekly field setting.",
            ],
          },
          {
            title: "BIPN 108 & Marine Biology",
            content: [
              "BIPN 108: Biology and Medicine of Exercise covers the human body's response to exercise. A guest lecture on breath-hold physiology \u2014 the mammalian dive reflex, hypoxic and hypercapnic responses during apnea \u2014 is directly relevant. For marine bio students: freediving as a field observation method. No bubbles. Silent approach. The same reefs they study, observed on a breath hold 5 minutes from campus.",
            ],
          },
        ],
      },
    ],
    showCamp: false,
    partnershipTitle: "Twelve ways to make this",
    partnershipTitleEm: "happen.",
    partnershipIdeas: [
      { title: "Quarterly Discover Freediving in Outback Programming", description: "The simplest integration. Add a \"Discover Freediving\" session to the Outback Adventures schedule once per quarter. LJFC handles all instruction, gear, and safety. UCSD Rec handles registration, promotion, and payment processing. Student rate: $125. Capacity: 8-12 per session. Four sessions per year, minimal administrative burden." },
      { title: "Wilderness Orientation \u2014 Freedive Trip", description: "A new WO option: multi-day freediving trip at La Jolla Shores for incoming students. Breath training, ocean safety, species identification, and guided dives in the marine reserve. The UCSD orientation experience nobody else offers. Unique in the entire UC system." },
      { title: "Free Club Workshops \u2014 Top of Funnel", description: "Free 90-minute breath-hold workshop for any UCSD student club. Dry-land only, no pool or ocean needed, can be held on campus. Starting with the Surf Team would send the strongest signal \u2014 if the state champions train breath-hold, word spreads fast." },
      { title: "AIDA Certification Courses During Breaks", description: "Offer AIDA 2 certification through Outback during winter, spring, and summer breaks. Student rate: $475. Students graduate with an internationally recognized credential. Could also serve Scripps graduate students \u2014 freediving as a marine research tool." },
      { title: "Baja Freediving Trip", description: "Sibling to Baja Surf Safari. Warm-water dive sites with clearer visibility, mobula ray encounters. I trained in Baja and know the dive sites, logistics, and local operators. Same Outback format: multi-day, transportation provided, beginner-friendly, life-changing." },
      { title: "Tritons RISE Breath-Hold & Ocean Immersion", description: "CAPS and Rec co-run Tritons RISE workshops with co-curricular credit. A \"breath-hold and ocean immersion\" workshop fits the framework. The mammalian dive reflex triggers measurable parasympathetic activation \u2014 real stress regulation, not abstract wellness talk. Ideal for finals week." },
      { title: "Scripps DIVERSity Fellowship Bridge Program", description: "Freediving as a lower-barrier entry point for DIVERSity fellows \u2014 less gear, lower cost, no 100-hour course. A breath-hold training and water confidence module builds comfort before the full scientific diving course." },
      { title: "MBAC Watersports Camp \u2192 Camp Garibaldi Pipeline", description: "MBAC's Watersports Camp serves 30,000+ participants per year. Camp Garibaldi is the underwater option for ages 8-16. Cross-promotion in camp materials and a \"What comes after Watersports Camp?\" pathway." },
      { title: "Scuba Program Cross-Training", description: "Offer freediving as a cross-training elective for scuba students. A 3-hour \"Freediving for Scuba Divers\" workshop once per quarter. Better breath-hold improves air consumption, buoyancy control, and emergency preparedness." },
      { title: "UCSD Extension \u2014 International Student Experience", description: "UCSD Extension hosts thousands of international students. \"Discover Freediving in La Jolla\" as a weekend activity or cultural experience would stand out dramatically. AIDA certification is internationally recognized \u2014 a credential and a story they bring home." },
      { title: "Triton Alumni Events", description: "The Triton Center opens in 2026 \u2014 245,000 alumni strong. \"Discover Freediving for Triton Alumni\" at La Jolla Shores is a premium, unique experience. I'm an alum myself. This event could launch alongside the Triton Center opening." },
      { title: "Conditions Platform for UCSD Watersports", description: "Our real-time ocean conditions dashboard \u2014 swell, wind, temperature, visibility, tides, dive grade \u2014 powered by Scripps data. Could be linked from Outback's watersports pages as a free resource for any student heading to La Jolla Shores." },
    ],
    credentialsLabel: "Credentials",
    credentials: [
      { value: "UCSD", label: "Alumni\nCame back to build LJFC" },
      { value: "AIDA", label: "Instructor + Youth Instructor\nSan Diego's only" },
      { value: "$125", label: "Student rate\nDiscover Freediving" },
      { value: "5 min", label: "Campus to dive site\nLa Jolla Shores" },
      { value: "DAN", label: "Professional liability\nDivers Alert Network" },
      { value: "ARC", label: "Adult & Pediatric\nFirst Aid / CPR / AED" },
      { value: "50+", label: "Species documented\nLa Jolla Underwater Atlas" },
      { value: "6am", label: "Daily conditions email\nScripps data, free to subscribe" },
    ],
    ctaTitle: "Let me run",
    ctaTitleEm: "one session this quarter.",
    ctaDescription: "One Discover Freediving session. Eight students. A Saturday morning at La Jolla Shores. I handle everything \u2014 instruction, gear, safety, insurance. You list it, students sign up, and we see what happens. If the reviews are strong, we talk about the rest.",
    ctaButtonText: "Let's run one session",
    ctaEmail: "joshuabeneventi@gmail.com",
    ctaEmailSubject: "LJFC \u00D7 UCSD Rec \u2014 Freediving Program",
    ctaSecondary: "Joshua Beneventi \u00B7 UCSD Alum \u00B7 joshuabeneventi@gmail.com",
    ctaLinks: [
      { label: "lajollafreediveclub.com/conditions", url: "https://lajollafreediveclub.com/conditions" },
      { label: "lajollafreediveclub.com/programs", url: "https://lajollafreediveclub.com/programs" },
    ],
    images: [
      { src: "/images/photos/joshua-red-sea.jpg", alt: "Joshua Beneventi", caption: "UCSD alum, came home to build LJFC", position: "after-heritage" },
      { src: "/images/photos/joshua-lena-shores.jpg", alt: "Joshua and Lena at La Jolla Shores", caption: "La Jolla Shores \u2014 5 minutes from campus", position: "after-connection" },
      { src: "/images/photos/ljfc-crew-lunch.jpg", alt: "LJFC crew after a Saturday session", caption: "The Saturday crew \u2014 students welcome", position: "after-ideas" },
    ],
  },
  {
    slug: "sd-lifeguards",
    name: "San Diego Lifeguard Services",
    heroHeadline: "I'm the freedive instructor",
    heroHeadlineEm: "at your beach.",
    heroSubtitle: "My name is Joshua Beneventi. I'm an AIDA-certified freediving instructor \u2014 San Diego's only one \u2014 and I operate at La Jolla Shores every Saturday, year-round. I run courses, community dive sessions, and a youth ocean camp out of Kellogg Park. I wanted to introduce myself properly, show you what I've built, and share a few ideas about how I might be useful to your team.",
    heritageLabel: "Who I Am",
    heritageQuote: "I grew up in Point Loma, four blocks from the water. My great-grandfather was a whaler from the Azores who settled in San Diego for tuna fishing. My grandfather freedived for abalone in La Jolla. I graduated from UCSD, trained as a freediving instructor in Malaysia, Egypt, and Baja, and came back to La Jolla because there's nowhere better to do this work. I'm AIDA Instructor and AIDA Youth Instructor certified \u2014 the only one in San Diego for both adults and kids. DAN insured for professional liability. Red Cross certified in Adult and Pediatric First Aid, CPR, and AED. I carry a rescue tube and emergency oxygen on every session. I know the canyon, the walls, the currents, the seasonal patterns, and the marine life. You've probably seen me. I'm the guy with the orange buoy and the dive flag, swimming out to the canyon rim with a group on Saturday mornings.",
    heritageAttribution: "Joshua Beneventi \u2014 AIDA Instructor, Founder of LJFC",
    connectionLabel: "What I Operate at La Jolla Shores",
    connectionTitle: "Three programs,",
    connectionTitleEm: "all from Kellogg Park.",
    connectionCards: [
      {
        title: "Weekly Saturday Sessions",
        content: [
          "Year-round group freediving at La Jolla Shores. We meet at Kellogg Park, enter at Vallecitos, swim out to the canyon. All participants are certified freedivers with their own gear, signed waivers, and a dive computer. I provide buoys, lines, and session leadership. Typical group: 6-15 divers. We're usually in the water by 8am and out by 10:30am.",
        ],
      },
      {
        title: "Certification Courses",
        content: [
          "AIDA 1 (Discover Freediving) and AIDA 2 certification courses, run throughout the year. Small groups \u2014 maximum 4 students per course. Pool sessions at local facilities, open water at La Jolla Shores. All students receive safety briefings on the marine reserve, dive flag protocol, and local hazards.",
        ],
      },
    ],
    additionalSections: [
      {
        label: "",
        title: "",
        titleEm: "",
        cards: [
          {
            title: "Camp Garibaldi \u2014 Youth Program",
            content: [
              "A week-long ocean camp for kids ages 8-16, teaching freediving, surf survival, and water confidence. Gear provided. The camp's philosophy is building breath control and internal calm before developing external water skills. Kids learn to read conditions, identify species, equalize, and hold their breath before they ever go deeper than chest-high water. I'd like to talk with you about Camp Garibaldi specifically \u2014 I want to make sure you're aware of the program before it runs this summer.",
            ],
          },
          {
            title: "Our Mooring Line",
            content: [
              "We maintain a mooring line at 32.856746, -117.262603 \u2014 canyon edge, approximately 35-40 feet depth, about 500 meters offshore from Kellogg Park. We always fly a dive flag. All divers use a lanyard attached to the line. We follow float, flag, anchor, and descent line requirements per marine reserve regulations.",
            ],
          },
        ],
      },
      {
        label: "What I'm Asking",
        title: "Awareness first.",
        titleEm: "Then maybe more.",
        cards: [
          {
            title: "Know who I am",
            content: [
              "I'm a trained, insured, certified professional operating in your jurisdiction every week. I'd rather you know me than not. If there's ever an incident involving a freediver at La Jolla Shores, I want to be someone you can call. I carry rescue equipment and emergency oxygen. I know the site. I'm almost always there on Saturday mornings.",
            ],
          },
          {
            title: "Be aware of Camp Garibaldi",
            content: [
              "I'm running a youth ocean camp at La Jolla Shores this summer. Kids ages 8-16, in the water every day for a week. Parents will feel better knowing that lifeguards are aware of the program. I'm not asking you to supervise \u2014 I'm asking you to know it's happening so nothing catches you off guard. I'm happy to share our curriculum, safety protocols, and daily schedules in advance.",
            ],
          },
        ],
      },
      {
        label: "",
        title: "",
        titleEm: "",
        cards: [
          {
            title: "Share conditions intel when it matters",
            content: [
              "If you close the beach, post a shark advisory, or see something unusual \u2014 I have an email list of the exact people who need to hear it. Divers, snorkelers, swimmers who are heading to La Jolla Shores that day. I can amplify your warnings to the community that's most at risk. In return, my conditions platform is yours to glance at anytime.",
            ],
          },
          {
            title: "Freediver incident resource",
            content: [
              "Freediving incidents look different from drowning. A diver floating face-down at the surface might be doing recovery breathing \u2014 or experiencing hypoxic blackout. The difference matters in the first 10 seconds. I can provide a one-page reference card for your towers covering freediver-specific emergencies: shallow water blackout recognition, loss of motor control, rescue breathing protocol for apnea blackout, and how to distinguish a freediver in distress from one who's fine. No cost, just a resource if you want it.",
            ],
          },
        ],
      },
      {
        label: "What I Can Offer Your Team",
        title: "Training that's",
        titleEm: "directly relevant to what you do.",
        cards: [
          {
            title: "Breath-hold training for lifeguards",
            content: [
              "Your Dive Rescue Team conducts underwater search and recovery on breath-hold. Your seasonal guards train in surf rescue where getting held down is a daily reality. Structured breath-hold training \u2014 CO\u2082 tolerance drills, relaxation under oxygen debt, extending functional time underwater \u2014 directly improves rescue capability. I can run a 2-hour workshop for any unit: dry-land breathing drills, timed static holds, and the physiology behind why it works.",
            ],
          },
          {
            title: "Freediving awareness briefing",
            content: [
              "Recreational freediving is the fastest-growing underwater sport in the world. Your guards are going to see more freedivers at La Jolla Shores every year. A 90-minute awareness briefing covers: what recreational freedivers actually do, how to read a freediving operation (buoys, lanyards, safety divers, dive flags), what a normal surface interval looks like, what shallow water blackout looks like, and the specific rescue protocols that apply.",
            ],
          },
        ],
      },
      {
        label: "",
        title: "",
        titleEm: "",
        cards: [
          {
            title: "Shallow water blackout reference card",
            content: [
              "A laminated one-pager for towers and stations covering: how to recognize a hypoxic blackout at the surface (loss of motor control, facial twitching, tonic posturing \u2014 distinct from panic drowning), immediate response protocol (airway management, rescue breathing within 10 seconds, monitor for laryngospasm), and how to distinguish a freediver doing recovery breathing from one in distress. Clear, visual, built for a guard who has 5 seconds to make a call. I'll produce this at no cost.",
            ],
          },
          {
            title: "Ongoing resource",
            content: [
              "Freediving incidents in San Diego are rare but they happen. When they do, having a local subject-matter expert you can call is useful. I know the freediving community here \u2014 who's certified, who's operating, what the common practices are. I can help with incident debriefs, community communication after an event, and identifying whether an operation was following standard safety protocols. Think of me as a resource in your back pocket \u2014 not a regular obligation.",
            ],
          },
        ],
      },
      {
        label: "Junior Lifeguards",
        title: "Surface skills and underwater skills.",
        titleEm: "The complete picture.",
        cards: [
          {
            title: "Freediving demo day during JG sessions",
            content: [
              "Your JGs already visit La Jolla Cove for snorkeling and cave exploration. A freediving demo day at La Jolla Shores would give kids a taste of breath-hold diving in controlled conditions \u2014 timed breath holds on the beach, basic equalization technique, a guided shallow freedive with their JG instructors present. I handle all instruction and safety. One session, 2-3 hours, no cost.",
            ],
          },
          {
            title: "Camp Garibaldi as the \"next step\"",
            content: [
              "JG teaches surf safety, CPR, water rescue, ocean awareness, and fitness. Camp Garibaldi teaches breath-hold diving, equalization, underwater navigation, species identification, and dive physiology. A JG alum who's done two or three summers and wants to go underwater is the exact kid Camp Garibaldi was built for. Cross-referral between the programs gives parents a clear progression: Junior Lifeguards for surface confidence, Camp Garibaldi for underwater skills.",
            ],
          },
        ],
      },
      {
        label: "",
        title: "",
        titleEm: "",
        cards: [
          {
            title: "JG Intern AIDA certification",
            content: [
              "Your intern program accepts 16-20 kids per summer \u2014 ages 15.5-17, running a sub-8:30 mile and a sub-10:00 500m swim. These are elite young athletes. An AIDA 1 or AIDA 2 certification for JG interns would be a legitimate professional development credential \u2014 internationally recognized, directly relevant to careers in lifeguarding, marine safety, or dive operations. I'd offer this at a deeply discounted rate or explore sponsorship to cover the cost entirely.",
            ],
          },
          {
            title: "Breath-hold physiology for A Group",
            content: [
              "Your A Group kids are 14-17 \u2014 old enough for real science. A 60-minute session on breath-hold physiology would cover the mammalian dive reflex (why your heart rate drops when your face hits cold water), how CO\u2082 tolerance works (why the urge to breathe is a signal, not an emergency), and the basics of shallow water blackout. This is directly relevant to surf hold-downs, rescue swimming, and their own safety. They'll feel the dive reflex activate in real time during a timed breath hold on the beach.",
            ],
          },
        ],
      },
    ],
    researchTitle: "A conditions platform",
    researchTitleEm: "that might be useful to you.",
    researchSubtitle: "I built a free ocean conditions dashboard for the La Jolla diving community. It pulls from the same data sources you check. I send a daily email to subscribers at 6am with a morning briefing. You're welcome to use any of it.",
    researchCards: [
      { id: "Wave & Temp", name: "NDBC 46254", detail: "Scripps Nearshore Waverider Buoy. Wave height, period, direction, sea temperature. Updated every 30 minutes." },
      { id: "Wind", name: "NDBC LJPC1", detail: "Scripps Pier C-MAN station. Wind speed, direction, gusts. Combined with LJAC1 NOS station for pressure and water level." },
      { id: "Tides", name: "NOAA 9410230", detail: "La Jolla tide predictions. High/low times, tidal range, and a 7-day calendar showing optimal dive windows." },
      { id: "Visibility", name: "Scripps Underwater Cam", detail: "AI analysis of the HDOnTap camera on Scripps Pier at 13ft depth. Automated visibility estimate based on reference pilings." },
      { id: "Marine Forecast", name: "NWS PZZ740", detail: "Inner coastal waters forecast for San Diego. Fog, wind, swell direction, and small craft advisories." },
      { id: "Water Quality", name: "sdbeachinfo.com", detail: "Beach advisory/warning/closure status. 72-hour post-rain advisories. Persistent advisory tracking for La Jolla Cove and Children's Pool." },
    ],
    showCamp: false,
    partnershipTitle: "Ideas that don't exist in this page",
    partnershipTitleEm: "placeholder.",
    partnershipIdeas: [],
    credentialsLabel: "For Your Records",
    credentials: [
      { value: "AIDA", label: "Instructor\n+ Youth Instructor" },
      { value: "DAN", label: "ID# 3339867\nPolicy DAN9477420" },
      { value: "ARC", label: "First Aid / CPR / AED\nCert 022T2IJ, exp Sept 2027" },
      { value: "AIDA 4", label: "Personal certification\nAdvanced freediver" },
    ],
    ctaTitle: "I'm at the Shores",
    ctaTitleEm: "every Saturday.",
    ctaDescription: "If you'd like to see what we do, you're welcome anytime \u2014 I'm usually at Kellogg Park by 7am on Saturdays. I'm also happy to walk through the conditions platform, share our Camp Garibaldi safety plan, talk about a breath-hold training session for your team, or discuss a freediving demo for Junior Lifeguards. Whatever makes sense, at whatever pace works for you.",
    ctaButtonText: "Get in touch",
    ctaEmail: "joshuabeneventi@gmail.com",
    ctaEmailSubject: "La Jolla Freedive Club \u2014 Introduction",
    ctaSecondary: "Joshua Beneventi \u00B7 joshuabeneventi@gmail.com",
    ctaLinks: [
      { label: "lajollafreediveclub.com/conditions", url: "https://lajollafreediveclub.com/conditions" },
    ],
    images: [
      { src: "/images/photos/joshua-red-sea.jpg", alt: "Joshua Beneventi", caption: "AIDA Instructor, DAN insured, Red Cross certified", position: "after-heritage" },
      { src: "/images/photos/joshua-teaching-kids.jpg", alt: "Joshua teaching kids", caption: "Camp Garibaldi at La Jolla Shores this summer", position: "after-connection" },
      { src: "/images/photos/ljfc-crew-lunch.jpg", alt: "LJFC Saturday crew", caption: "The Saturday crew \u2014 we're at Kellogg Park every week", position: "after-ideas" },
    ],
  },
];

export function getPartner(slug: string): Partner | undefined {
  return partners.find((p) => p.slug === slug);
}

export function getAllPartners(): Partner[] {
  return partners;
}
