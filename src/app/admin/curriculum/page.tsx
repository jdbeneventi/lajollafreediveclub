"use client";

import { useState, useMemo, useEffect, useCallback } from "react";

// ─── CONSTANTS ─────────────────────────────────────────────────────

const SECRET = "ljfc";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const MONTHLY_THEMES: Record<string, string> = {
  January: "Squid Run",
  February: "Gray Whale Migration",
  March: "Upwelling Season",
  April: "Kelp Forest Recovery",
  May: "Citizen Science Day",
  June: "Summer Kickoff",
  July: "Leopard Shark Season",
  August: "The Canyon",
  September: "Fall Blue Water",
  October: "Sea Lion Pup Season",
  November: "Lobster Season / Night Ocean",
  December: "Winter Bioluminescence",
};

const SESSION_TYPES = [
  "Camp Garibaldi 5-day",
  "Camp Garibaldi 3-day",
  "Ocean Explorers (8-11)",
  "Canyon Crew (11-14)",
  "Field Trip",
  "Community Ocean Day",
];

const GRADE_BANDS = ["Grades 3-5", "Grades 6-8", "High School"];

const GRADE_COLORS: Record<string, string> = {
  "Grades 3-5": "#f0b429",
  "Grades 6-8": "#3db8a4",
  "High School": "#C75B3A",
};

const SESSION_TYPE_COLORS: Record<string, string> = {
  "Camp Garibaldi 5-day": "#3db8a4",
  "Camp Garibaldi 3-day": "#1B6B6B",
  "Ocean Explorers (8-11)": "#f0b429",
  "Canyon Crew (11-14)": "#D4A574",
  "Field Trip": "#163B4E",
  "Community Ocean Day": "#C75B3A",
};

// ─── NGSS STANDARDS ────────────────────────────────────────────────

interface NGSSStandard {
  code: string;
  label: string;
}

const NGSS_DOMAINS: { domain: string; standards: NGSSStandard[] }[] = [
  {
    domain: "K–2 Physical Sciences",
    standards: [
      { code: "K-PS2-1", label: "Pushes and pulls change motion" },
      { code: "K-PS2-2", label: "Effect of different strengths/directions of pushes and pulls" },
      { code: "K-PS3-1", label: "Sunlight warms Earth's surface" },
      { code: "K-PS3-2", label: "Sunlight effect on Earth's surface" },
      { code: "1-PS4-1", label: "Sound causes vibration" },
      { code: "1-PS4-2", label: "Objects can be seen when light is available" },
      { code: "1-PS4-3", label: "Determine effect of placing materials in path of light" },
      { code: "1-PS4-4", label: "Design device that uses light or sound to communicate" },
      { code: "2-PS1-1", label: "Plan and conduct investigation to describe matter properties" },
      { code: "2-PS1-2", label: "Analyze data to classify different kinds of materials" },
      { code: "2-PS1-3", label: "Make observations to construct evidence that change is reversible or not" },
      { code: "2-PS1-4", label: "Construct an argument that some changes are reversible" },
    ],
  },
  {
    domain: "K–2 Life Sciences",
    standards: [
      { code: "K-LS1-1", label: "Observe patterns of what plants and animals need to survive" },
      { code: "K-ESS3-1", label: "Use a model to represent relationship between needs and where they live" },
      { code: "1-LS1-1", label: "Use materials to design a solution to a human problem by mimicking organisms" },
      { code: "1-LS1-2", label: "Read texts to compare ways parents and offspring engage in behaviors" },
      { code: "1-LS3-1", label: "Make observations to construct account that young are similar but not exactly like parents" },
      { code: "2-LS2-1", label: "Plan and conduct investigation to determine if plants need sunlight/water" },
      { code: "2-LS2-2", label: "Develop a simple model illustrating that plants depend on animals for needs" },
      { code: "2-LS4-1", label: "Make observations of plants and animals to compare diversity in different habitats" },
    ],
  },
  {
    domain: "K–2 Earth & Space Sciences",
    standards: [
      { code: "K-ESS2-1", label: "Use and share observations of weather conditions" },
      { code: "K-ESS2-2", label: "Construct argument about changes in land and water" },
      { code: "K-ESS3-2", label: "Ask questions to obtain info about weather forecasting" },
      { code: "K-ESS3-3", label: "Communicate solutions to reduce impact of weather events" },
      { code: "1-ESS1-1", label: "Use observations to describe patterns of sun, moon, stars" },
      { code: "1-ESS1-2", label: "Make observations at different times of year for seasonal patterns" },
      { code: "2-ESS1-1", label: "Use info from observations to identify events happening now that are similar to the past" },
      { code: "2-ESS2-1", label: "Compare multiple solutions to slow or prevent wind/water from changing land shape" },
      { code: "2-ESS2-2", label: "Develop a model to represent land and bodies of water" },
      { code: "2-ESS2-3", label: "Obtain info to identify where water is found on Earth" },
    ],
  },
  {
    domain: "3–5 Life Sciences",
    standards: [
      { code: "3-LS1-1", label: "Develop models to describe organisms' unique life cycles" },
      { code: "3-LS2-1", label: "Construct argument that animals form groups to help survive" },
      { code: "3-LS3-1", label: "Analyze and interpret data for patterns of inherited traits" },
      { code: "3-LS3-2", label: "Use evidence to support that traits can be influenced by environment" },
      { code: "3-LS4-1", label: "Analyze and interpret fossil data for patterns in life over time" },
      { code: "3-LS4-2", label: "Use evidence to construct explanation for how variations in a trait give advantage" },
      { code: "3-LS4-3", label: "Construct argument with evidence that in a habitat some survive well, some less" },
      { code: "3-LS4-4", label: "Make a claim about merit of a solution to a problem caused by environmental change" },
      { code: "4-LS1-1", label: "Construct argument that plants and animals have internal and external structures for survival" },
      { code: "4-LS1-2", label: "Use a model to describe that animals receive information through their senses" },
      { code: "5-LS1-1", label: "Support argument that plants get materials for growth from water and air" },
      { code: "5-LS2-1", label: "Develop a model to describe movement of matter among plants, animals, decomposers" },
    ],
  },
  {
    domain: "3–5 Earth & Space Sciences",
    standards: [
      { code: "3-ESS2-1", label: "Represent data in tables/graphs to describe weather conditions" },
      { code: "3-ESS2-2", label: "Obtain and combine info to describe climates in different regions" },
      { code: "3-ESS3-1", label: "Make a claim about merit of a design solution reducing weather impacts" },
      { code: "4-ESS1-1", label: "Identify evidence from patterns in rock formations/fossils" },
      { code: "4-ESS2-1", label: "Make observations/measurements to provide evidence of weathering or erosion" },
      { code: "4-ESS2-2", label: "Analyze and interpret data from maps to describe patterns of Earth's features" },
      { code: "4-ESS3-1", label: "Obtain and combine info about Earth processes to generate solutions" },
      { code: "4-ESS3-2", label: "Generate/compare solutions to reduce impacts of natural Earth processes" },
      { code: "5-ESS1-1", label: "Support argument that sun apparent brightness is due to distance" },
      { code: "5-ESS1-2", label: "Represent data in graphical displays to reveal patterns of daily changes" },
      { code: "5-ESS2-1", label: "Develop a model describing ways the geosphere, biosphere, hydrosphere interact" },
      { code: "5-ESS2-2", label: "Describe and graph amounts/percentages of water/fresh water" },
      { code: "5-ESS3-1", label: "Obtain and combine info about ways communities protect Earth's resources" },
    ],
  },
  {
    domain: "3–5 Physical Sciences",
    standards: [
      { code: "3-PS2-1", label: "Plan investigation to provide evidence of effects of balanced/unbalanced forces" },
      { code: "3-PS2-2", label: "Make observations/measurements of object motion to provide evidence of pattern" },
      { code: "3-PS2-3", label: "Ask questions to determine cause and effect of electric/magnetic interactions" },
      { code: "3-PS2-4", label: "Define a simple design problem solved by applying magnetic interactions" },
      { code: "4-PS3-1", label: "Use evidence to construct explanation relating speed of object to energy" },
      { code: "4-PS3-2", label: "Make observations to provide evidence that energy can transfer from place to place" },
      { code: "4-PS3-3", label: "Ask questions and predict outcomes about changes in energy from collisions" },
      { code: "4-PS3-4", label: "Apply scientific ideas to design/test/refine a device converting energy" },
      { code: "4-PS4-1", label: "Develop a model of waves to describe patterns of amplitude and wavelength" },
      { code: "4-PS4-2", label: "Develop a model to describe that light reflecting off objects allows them to be seen" },
      { code: "5-PS1-1", label: "Develop a model to describe that matter is made of particles too small to be seen" },
      { code: "5-PS1-2", label: "Measure and graph quantities to provide evidence that properties don't change when matter changes" },
      { code: "5-PS1-3", label: "Make observations and measurements to identify materials based on properties" },
      { code: "5-PS1-4", label: "Conduct investigation to determine whether mixing creates new substances" },
      { code: "5-PS2-1", label: "Support argument that gravitational force exerted by Earth on objects is downward" },
      { code: "5-PS3-1", label: "Use models to describe that energy in animals' food was once energy from the sun" },
    ],
  },
  {
    domain: "MS Life Sciences",
    standards: [
      { code: "MS-LS1-1", label: "Conduct investigation to provide evidence that living things are made of cells" },
      { code: "MS-LS1-2", label: "Develop and use a model to describe the function of a cell" },
      { code: "MS-LS1-3", label: "Use argument supported by evidence for how the body is a system of interacting subsystems" },
      { code: "MS-LS1-4", label: "Use argument based on evidence for how behavior/structural changes respond to stimuli" },
      { code: "MS-LS1-5", label: "Construct scientific explanation based on evidence for how environmental/genetic factors influence growth" },
      { code: "MS-LS1-6", label: "Construct explanation based on evidence for role of photosynthesis in cycling matter and energy" },
      { code: "MS-LS1-7", label: "Develop model to describe how food is rearranged through chemical reactions to release energy" },
      { code: "MS-LS1-8", label: "Gather and synthesize info that sensory receptors respond to stimuli by sending messages to brain" },
      { code: "MS-LS2-1", label: "Analyze and interpret data for resource effects on organisms and populations" },
      { code: "MS-LS2-2", label: "Construct explanation predicting patterns of interactions among organisms across ecosystems" },
      { code: "MS-LS2-3", label: "Develop model to describe cycling of matter and flow of energy in ecosystems" },
      { code: "MS-LS2-4", label: "Construct argument supported by evidence that changes to ecosystems affect populations" },
      { code: "MS-LS2-5", label: "Evaluate competing design solutions for maintaining biodiversity" },
      { code: "MS-LS3-1", label: "Develop and use a model to describe why structural changes to genes may affect proteins" },
      { code: "MS-LS3-2", label: "Develop and use a model to describe why asexual reproduction results in identical offspring" },
      { code: "MS-LS4-1", label: "Analyze and interpret data for patterns in the fossil record" },
      { code: "MS-LS4-2", label: "Apply scientific ideas to construct explanation for anatomical similarities/differences" },
      { code: "MS-LS4-3", label: "Analyze displays of data for relationship between resources and population growth" },
      { code: "MS-LS4-4", label: "Construct explanation based on evidence for how natural selection leads to adaptation" },
      { code: "MS-LS4-5", label: "Gather and synthesize info about technologies that have changed how humans affect inheritance" },
      { code: "MS-LS4-6", label: "Use mathematical representations to support explanations of how natural selection may lead to change" },
    ],
  },
  {
    domain: "MS Earth & Space Sciences",
    standards: [
      { code: "MS-ESS1-1", label: "Develop and use a model of the Earth-sun-moon system" },
      { code: "MS-ESS1-2", label: "Develop and use a model describing role of gravity in motions within galaxies and solar system" },
      { code: "MS-ESS1-3", label: "Analyze and interpret data to determine scale properties of objects in the solar system" },
      { code: "MS-ESS1-4", label: "Construct explanation based on evidence for how geoscience processes have changed Earth's surface" },
      { code: "MS-ESS2-1", label: "Develop a model to describe the cycling of Earth's materials and energy flow" },
      { code: "MS-ESS2-2", label: "Construct explanation based on evidence for how geoscience processes change Earth's surface" },
      { code: "MS-ESS2-3", label: "Analyze and interpret data on distribution of fossils and rocks for evidence of past plate motions" },
      { code: "MS-ESS2-4", label: "Develop a model to describe water cycling driven by energy and gravity" },
      { code: "MS-ESS2-5", label: "Collect data to provide evidence for how motions and interactions of air masses result in weather" },
      { code: "MS-ESS2-6", label: "Develop and use a model for how unequal heating causes atmospheric/oceanic circulation" },
      { code: "MS-ESS3-1", label: "Construct a scientific explanation for how uneven distribution of resources results from geologic processes" },
      { code: "MS-ESS3-2", label: "Analyze and interpret data on natural hazards to forecast future events" },
      { code: "MS-ESS3-3", label: "Apply scientific principles to design a method for monitoring/minimizing human impact" },
      { code: "MS-ESS3-4", label: "Construct argument supported by evidence that increase in human population affects Earth's systems" },
      { code: "MS-ESS3-5", label: "Ask questions to clarify evidence of factors causing rise in global temperatures" },
    ],
  },
  {
    domain: "MS Physical Sciences",
    standards: [
      { code: "MS-PS1-1", label: "Develop models to describe atomic composition of simple molecules" },
      { code: "MS-PS1-2", label: "Analyze and interpret data on properties of substances before and after reaction" },
      { code: "MS-PS1-3", label: "Gather and make sense of info about synthetic materials from natural resources" },
      { code: "MS-PS1-4", label: "Develop model that predicts/describes changes in particle motion and energy in a substance" },
      { code: "MS-PS1-5", label: "Develop and use model to describe how total number of atoms does not change in reaction" },
      { code: "MS-PS1-6", label: "Undertake design project to construct/test/modify device releasing/absorbing thermal energy" },
      { code: "MS-PS2-1", label: "Apply Newton's Third Law to design solution to a problem involving motion of two objects" },
      { code: "MS-PS2-2", label: "Plan investigation to provide evidence that change in motion depends on net forces and mass" },
      { code: "MS-PS2-3", label: "Ask questions about data to determine factors affecting strength of electric/magnetic forces" },
      { code: "MS-PS2-4", label: "Construct and present arguments using evidence to support that gravitational interactions are attractive" },
      { code: "MS-PS2-5", label: "Conduct investigation and evaluate design to provide evidence that fields exist between objects" },
      { code: "MS-PS3-1", label: "Construct and interpret graphical displays of data to describe relationships of kinetic energy" },
      { code: "MS-PS3-2", label: "Develop a model to describe that when arrangement of objects changes, potential energy changes" },
      { code: "MS-PS3-3", label: "Apply scientific principles to design/construct/test a device minimizing or maximizing thermal energy" },
      { code: "MS-PS3-4", label: "Plan investigation to determine relationships among energy transfer and type of matter" },
      { code: "MS-PS3-5", label: "Construct/use/present arguments to support claim that when kinetic energy changes, energy transfers" },
      { code: "MS-PS4-1", label: "Use mathematical representations to describe a simple model for waves" },
      { code: "MS-PS4-2", label: "Develop and use a model to describe that waves are reflected, absorbed, or transmitted" },
      { code: "MS-PS4-3", label: "Integrate qualitative info to support claim that digitized signals are more reliable" },
    ],
  },
  {
    domain: "HS Life Sciences",
    standards: [
      { code: "HS-LS1-1", label: "Construct explanation based on evidence for how structure of DNA determines protein structure" },
      { code: "HS-LS1-2", label: "Develop and use a model to illustrate hierarchical organization of interacting body systems" },
      { code: "HS-LS1-3", label: "Plan and conduct investigation to provide evidence that feedback mechanisms maintain homeostasis" },
      { code: "HS-LS1-4", label: "Use a model to illustrate the role of cellular division in producing new organisms" },
      { code: "HS-LS1-5", label: "Use a model to illustrate how photosynthesis transforms light energy into stored chemical energy" },
      { code: "HS-LS1-6", label: "Construct and revise explanation based on evidence for how carbon, hydrogen, and oxygen form molecules" },
      { code: "HS-LS1-7", label: "Use a model to illustrate that cellular respiration rearranges molecules to release energy" },
      { code: "HS-LS2-1", label: "Use mathematical/computational representations of carrying capacity of ecosystems" },
      { code: "HS-LS2-2", label: "Use mathematical representations to support/revise explanations of factors affecting biodiversity" },
      { code: "HS-LS2-3", label: "Construct and revise explanation based on evidence for cycling of matter and energy in aerobic conditions" },
      { code: "HS-LS2-4", label: "Use mathematical representations to support claims for cycling of matter and energy" },
      { code: "HS-LS2-5", label: "Develop a model to illustrate role of photosynthesis and cellular respiration in carbon cycling" },
      { code: "HS-LS2-6", label: "Evaluate claims, evidence, and reasoning that complex interactions maintain stability of ecosystems" },
      { code: "HS-LS2-7", label: "Design, evaluate, and refine a solution for reducing impacts of human activities on environment/biodiversity" },
      { code: "HS-LS2-8", label: "Evaluate evidence for role of group behavior on individual and species' chances to survive/reproduce" },
      { code: "HS-LS3-1", label: "Ask questions to clarify relationships about the role of DNA and chromosomes" },
      { code: "HS-LS3-2", label: "Make and defend a claim based on evidence that inheritable genetic variations may result from mutations" },
      { code: "HS-LS3-3", label: "Apply concepts of statistics to explain variation and distribution of expressed traits" },
      { code: "HS-LS4-1", label: "Communicate scientific info that common ancestry is supported by evidence" },
      { code: "HS-LS4-2", label: "Construct explanation based on evidence that biological evolution results from genetic variation" },
      { code: "HS-LS4-3", label: "Apply concepts of statistics to support explanations that organisms with advantageous traits tend to survive" },
      { code: "HS-LS4-4", label: "Construct explanation based on evidence for how natural selection leads to adaptation" },
      { code: "HS-LS4-5", label: "Evaluate evidence supporting claims that environmental changes can result in speciation or extinction" },
      { code: "HS-LS4-6", label: "Create/revise a simulation to test a solution to mitigate adverse impacts on biodiversity" },
    ],
  },
  {
    domain: "HS Earth & Space Sciences",
    standards: [
      { code: "HS-ESS1-1", label: "Develop a model based on evidence to illustrate life span of the sun" },
      { code: "HS-ESS1-2", label: "Construct an explanation of the Big Bang theory based on evidence" },
      { code: "HS-ESS1-3", label: "Communicate scientific ideas about the way stars produce elements" },
      { code: "HS-ESS1-4", label: "Use mathematical or computational representations to predict motion of orbiting objects" },
      { code: "HS-ESS1-5", label: "Evaluate evidence of past and current movements of continental and oceanic crust" },
      { code: "HS-ESS1-6", label: "Apply scientific reasoning and evidence from ancient Earth materials to construct account of Earth's formation" },
      { code: "HS-ESS2-1", label: "Develop a model to illustrate how Earth's internal and surface processes operate at different scales" },
      { code: "HS-ESS2-2", label: "Analyze geoscience data to make the claim that one change to Earth's surface can create feedbacks" },
      { code: "HS-ESS2-3", label: "Develop model based on evidence of Earth's interior to describe cycling of matter" },
      { code: "HS-ESS2-4", label: "Use a model to describe how variations in flow of energy drive changes in weather and climate" },
      { code: "HS-ESS2-5", label: "Plan and conduct investigation of properties of water and its effects on surface processes" },
      { code: "HS-ESS2-6", label: "Develop a quantitative model to describe cycling of carbon among Earth's systems" },
      { code: "HS-ESS2-7", label: "Construct argument based on evidence about simultaneous coevolution of Earth's systems" },
      { code: "HS-ESS3-1", label: "Construct explanation based on evidence for how availability of natural resources has guided society" },
      { code: "HS-ESS3-2", label: "Evaluate competing design solutions for developing/managing natural resources" },
      { code: "HS-ESS3-3", label: "Create a computational simulation to illustrate relationships among Earth's systems" },
      { code: "HS-ESS3-4", label: "Evaluate or refine a technological solution that reduces impacts on natural systems" },
      { code: "HS-ESS3-5", label: "Analyze geoscience data and results from global climate models to make evidence-based forecast" },
      { code: "HS-ESS3-6", label: "Use a computational representation to illustrate relationships among Earth systems and human activities" },
    ],
  },
  {
    domain: "HS Physical Sciences",
    standards: [
      { code: "HS-PS1-1", label: "Use the periodic table to predict properties of elements" },
      { code: "HS-PS1-2", label: "Construct explanation about the outcome of a simple chemical reaction" },
      { code: "HS-PS1-3", label: "Plan and conduct investigation to gather evidence comparing structure of substances" },
      { code: "HS-PS1-4", label: "Develop model to illustrate that release/absorption of energy occurs during chemical reaction" },
      { code: "HS-PS1-5", label: "Apply scientific principles and evidence to provide explanation about effects of changing conditions" },
      { code: "HS-PS1-6", label: "Refine design of chemical system by specifying a change in conditions to produce increased product" },
      { code: "HS-PS1-7", label: "Use mathematical representations to support the claim that atoms are conserved" },
      { code: "HS-PS1-8", label: "Develop models to illustrate the changes in composition of the nucleus" },
      { code: "HS-PS2-1", label: "Analyze data to support claim that Newton's second law describes mathematical relationship" },
      { code: "HS-PS2-2", label: "Use mathematical representations to support claim that forces on two interacting bodies are equal" },
      { code: "HS-PS2-3", label: "Apply scientific and engineering ideas to design/evaluate/refine a device minimizing force during collision" },
      { code: "HS-PS2-4", label: "Use mathematical representations to explain gravitational and electrostatic force interactions" },
      { code: "HS-PS2-5", label: "Plan and conduct investigation to provide evidence that electric current produces magnetic field" },
      { code: "HS-PS2-6", label: "Communicate scientific and technical info about why the molecular-level structure is important" },
      { code: "HS-PS3-1", label: "Create computational model to calculate change in kinetic energy when net force acts on object" },
      { code: "HS-PS3-2", label: "Develop and use models to illustrate that energy at the macroscopic scale can be accounted for" },
      { code: "HS-PS3-3", label: "Design/build/refine device that works within given constraints to convert one form of energy to another" },
      { code: "HS-PS3-4", label: "Plan and conduct investigation to provide evidence that energy transfer is accompanied by change in temperature" },
      { code: "HS-PS3-5", label: "Develop and use a model of two objects interacting through electric or magnetic fields" },
      { code: "HS-PS4-1", label: "Use mathematical representations to support claim for relationships between frequency/wavelength/speed" },
      { code: "HS-PS4-2", label: "Evaluate questions about advantages of using digital transmission/storage" },
      { code: "HS-PS4-3", label: "Evaluate design solution using electromagnetic radiation to transmit and capture information" },
      { code: "HS-PS4-4", label: "Evaluate claims, evidence, reasoning behind the idea that electromagnetic radiation is particle and wave" },
      { code: "HS-PS4-5", label: "Communicate technical information about how some technological devices use principles of wave behavior" },
    ],
  },
  {
    domain: "Engineering, Technology & Applications (K–12)",
    standards: [
      { code: "K-2-ETS1-1", label: "Ask questions, make observations to gather info about a problem to be solved" },
      { code: "K-2-ETS1-2", label: "Develop a simple sketch/drawing/model to illustrate how an object's shape helps solve a problem" },
      { code: "K-2-ETS1-3", label: "Analyze data from tests of two objects designed to solve the same problem" },
      { code: "3-5-ETS1-1", label: "Define a simple design problem reflecting a need including criteria for success" },
      { code: "3-5-ETS1-2", label: "Generate and compare multiple possible solutions to a problem based on criteria" },
      { code: "3-5-ETS1-3", label: "Plan and carry out fair tests to identify aspects of a model or prototype to improve" },
      { code: "MS-ETS1-1", label: "Define criteria and constraints of a design problem with precision" },
      { code: "MS-ETS1-2", label: "Evaluate competing design solutions using systematic process" },
      { code: "MS-ETS1-3", label: "Analyze data from tests to determine similarities/differences in design solutions" },
      { code: "MS-ETS1-4", label: "Develop model to generate data for iterative testing and modification" },
      { code: "HS-ETS1-1", label: "Analyze a major global challenge to specify qualitative and quantitative criteria" },
      { code: "HS-ETS1-2", label: "Design solution to a complex real-world problem by breaking it into smaller manageable problems" },
      { code: "HS-ETS1-3", label: "Evaluate solution to a complex real-world problem based on prioritized criteria and trade-offs" },
      { code: "HS-ETS1-4", label: "Use computer simulation to model proposed solutions to a complex real-world problem" },
    ],
  },
];

const SEP_PRACTICES = [
  "Asking questions",
  "Developing models",
  "Planning investigations",
  "Analyzing data",
  "Constructing explanations",
  "Engaging in argument from evidence",
  "Obtaining/evaluating information",
];

// ─── TYPES ─────────────────────────────────────────────────────────

interface SessionPlan {
  id: string;
  sessionType: string;
  month: string;
  theme: string;
  gradeBand: string;
  scientificFocus: string;
  inWaterActivities: string;
  shoreLandActivities: string;
  speciesTargets: string;
  ngssStandards: string[];
  sepPractices: string[];
  journalPrompt: string;
  guestEducator: string;
  materialsNeeded: string;
  safetyNotes: string;
  createdAt: string;
}

const EMPTY_SESSION: Omit<SessionPlan, "id" | "createdAt"> = {
  sessionType: "",
  month: "",
  theme: "",
  gradeBand: "",
  scientificFocus: "",
  inWaterActivities: "",
  shoreLandActivities: "",
  speciesTargets: "",
  ngssStandards: [],
  sepPractices: [],
  journalPrompt: "",
  guestEducator: "",
  materialsNeeded: "",
  safetyNotes: "",
};

// ─── STORAGE ───────────────────────────────────────────────────────

const STORAGE_KEY = "ljfc-curriculum-sessions";

function loadSessions(): SessionPlan[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveSessions(sessions: SessionPlan[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

// ─── COMPONENTS ────────────────────────────────────────────────────

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap"
      style={{ backgroundColor: color + "22", color }}
    >
      {label}
    </span>
  );
}

function Pill({ label }: { label: string }) {
  return (
    <span className="text-[9px] font-mono bg-white/[0.08] text-white/60 px-1.5 py-0.5 rounded">
      {label}
    </span>
  );
}

function SessionCard({
  session,
  onEdit,
  onDelete,
}: {
  session: SessionPlan;
  onEdit: (s: SessionPlan) => void;
  onDelete: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white/[0.04] border border-white/10 rounded-xl p-5 hover:border-white/20 transition-colors print:bg-white print:border-gray-200 print:text-black">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-serif text-lg text-white leading-snug print:text-black">
            {session.theme || session.month}
          </h3>
          <p className="text-white/40 text-xs mt-1 print:text-gray-500">
            {session.month} &middot; {session.scientificFocus}
          </p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
          <Badge label={session.gradeBand} color={GRADE_COLORS[session.gradeBand] || "#3db8a4"} />
          <Badge label={session.sessionType} color={SESSION_TYPE_COLORS[session.sessionType] || "#3A4A56"} />
        </div>
      </div>

      {/* NGSS pills */}
      {session.ngssStandards.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {session.ngssStandards.map((code) => (
            <Pill key={code} label={code} />
          ))}
        </div>
      )}

      {/* Species */}
      {session.speciesTargets && (
        <p className="text-white/50 text-xs mb-3 print:text-gray-500">
          <span className="text-white/30 print:text-gray-400">Species:</span>{" "}
          {session.speciesTargets}
        </p>
      )}

      {/* Toggle expand */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-seafoam text-xs hover:text-seafoam/80 transition-colors bg-transparent border-none cursor-pointer print:hidden"
      >
        {expanded ? "Collapse" : "View details"}
      </button>

      {expanded && (
        <div className="mt-4 space-y-3 border-t border-white/10 pt-4 print:border-gray-200">
          {session.inWaterActivities && (
            <div>
              <div className="text-[10px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-1">
                In-Water Activities
              </div>
              <p className="text-white/70 text-sm whitespace-pre-wrap print:text-gray-700">
                {session.inWaterActivities}
              </p>
            </div>
          )}
          {session.shoreLandActivities && (
            <div>
              <div className="text-[10px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-1">
                Shore/Land Activities
              </div>
              <p className="text-white/70 text-sm whitespace-pre-wrap print:text-gray-700">
                {session.shoreLandActivities}
              </p>
            </div>
          )}
          {session.sepPractices.length > 0 && (
            <div>
              <div className="text-[10px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-1">
                Science & Engineering Practices
              </div>
              <div className="flex flex-wrap gap-1">
                {session.sepPractices.map((p) => (
                  <Pill key={p} label={p} />
                ))}
              </div>
            </div>
          )}
          {session.journalPrompt && (
            <div>
              <div className="text-[10px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-1">
                Journal Prompt
              </div>
              <p className="text-white/70 text-sm italic print:text-gray-700">
                &ldquo;{session.journalPrompt}&rdquo;
              </p>
            </div>
          )}
          {session.guestEducator && (
            <div>
              <div className="text-[10px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-1">
                Guest Educator
              </div>
              <p className="text-white/70 text-sm print:text-gray-700">{session.guestEducator}</p>
            </div>
          )}
          {session.materialsNeeded && (
            <div>
              <div className="text-[10px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-1">
                Materials Needed
              </div>
              <p className="text-white/70 text-sm whitespace-pre-wrap print:text-gray-700">
                {session.materialsNeeded}
              </p>
            </div>
          )}
          {session.safetyNotes && (
            <div>
              <div className="text-[10px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-1">
                Safety Notes
              </div>
              <p className="text-coral/80 text-sm whitespace-pre-wrap print:text-red-600">
                {session.safetyNotes}
              </p>
            </div>
          )}

          <div className="flex gap-2 pt-2 print:hidden">
            <button
              onClick={() => onEdit(session)}
              className="text-xs text-seafoam bg-seafoam/10 px-3 py-1.5 rounded-lg border border-seafoam/20 hover:bg-seafoam/20 transition-colors cursor-pointer"
            >
              Edit
            </button>
            <button
              onClick={() => {
                if (confirm("Delete this session?")) onDelete(session.id);
              }}
              className="text-xs text-coral bg-coral/10 px-3 py-1.5 rounded-lg border border-coral/20 hover:bg-coral/20 transition-colors cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────

export default function CurriculumPlannerPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [sessions, setSessions] = useState<SessionPlan[]>([]);
  const [form, setForm] = useState(EMPTY_SESSION);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showBuilder, setShowBuilder] = useState(false);

  // Filters
  const [filterGrade, setFilterGrade] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterMonth, setFilterMonth] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Load sessions from localStorage
  useEffect(() => {
    setSessions(loadSessions());
  }, []);

  // Auth via URL param
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("key") === SECRET) setAuthed(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === SECRET) setAuthed(true);
  };

  // Auto-fill theme when month changes
  const updateForm = useCallback(
    (patch: Partial<typeof form>) => {
      setForm((prev) => {
        const next = { ...prev, ...patch };
        if (patch.month && !prev.theme && MONTHLY_THEMES[patch.month]) {
          next.theme = MONTHLY_THEMES[patch.month];
        }
        return next;
      });
    },
    []
  );

  const handleSave = () => {
    if (!form.sessionType || !form.month || !form.gradeBand) {
      alert("Session type, month, and grade band are required.");
      return;
    }

    let updated: SessionPlan[];
    if (editingId) {
      updated = sessions.map((s) =>
        s.id === editingId ? { ...form, id: editingId, createdAt: s.createdAt } : s
      );
    } else {
      const newSession: SessionPlan = {
        ...form,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      updated = [...sessions, newSession];
    }

    setSessions(updated);
    saveSessions(updated);
    setForm(EMPTY_SESSION);
    setEditingId(null);
    setShowBuilder(false);
  };

  const handleEdit = (session: SessionPlan) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, createdAt, ...rest } = session;
    setForm(rest);
    setEditingId(session.id);
    setShowBuilder(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id: string) => {
    const updated = sessions.filter((s) => s.id !== id);
    setSessions(updated);
    saveSessions(updated);
  };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(sessions, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ljfc-curriculum-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = JSON.parse(reader.result as string) as SessionPlan[];
        const merged = [...sessions, ...imported.filter((i) => !sessions.some((s) => s.id === i.id))];
        setSessions(merged);
        saveSessions(merged);
        alert(`Imported ${imported.length} sessions.`);
      } catch {
        alert("Invalid JSON file.");
      }
    };
    reader.readAsText(file);
  };

  // Filtered sessions
  const filtered = useMemo(() => {
    let result = [...sessions];
    if (filterGrade !== "all") result = result.filter((s) => s.gradeBand === filterGrade);
    if (filterType !== "all") result = result.filter((s) => s.sessionType === filterType);
    if (filterMonth !== "all") result = result.filter((s) => s.month === filterMonth);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.theme.toLowerCase().includes(q) ||
          s.scientificFocus.toLowerCase().includes(q) ||
          s.inWaterActivities.toLowerCase().includes(q) ||
          s.shoreLandActivities.toLowerCase().includes(q) ||
          s.speciesTargets.toLowerCase().includes(q) ||
          s.journalPrompt.toLowerCase().includes(q) ||
          s.guestEducator.toLowerCase().includes(q) ||
          s.materialsNeeded.toLowerCase().includes(q) ||
          s.ngssStandards.some((c) => c.toLowerCase().includes(q))
      );
    }
    return result;
  }, [sessions, filterGrade, filterType, filterMonth, searchQuery]);

  // Group by month
  const grouped = useMemo(() => {
    const map: Record<string, SessionPlan[]> = {};
    for (const m of MONTHS) map[m] = [];
    for (const s of filtered) {
      if (!map[s.month]) map[s.month] = [];
      map[s.month].push(s);
    }
    return Object.entries(map).filter(([, arr]) => arr.length > 0);
  }, [filtered]);

  // NGSS coverage matrix
  const allStandardCodes = useMemo(
    () => NGSS_DOMAINS.flatMap((d) => d.standards.map((s) => s.code)),
    []
  );
  const coverageMatrix = useMemo(() => {
    const matrix: Record<string, Set<string>> = {};
    for (const code of allStandardCodes) matrix[code] = new Set();
    for (const s of sessions) {
      for (const code of s.ngssStandards) {
        if (matrix[code]) matrix[code].add(s.month);
      }
    }
    return matrix;
  }, [sessions, allStandardCodes]);

  const uncoveredStandards = useMemo(
    () => allStandardCodes.filter((code) => coverageMatrix[code].size === 0),
    [allStandardCodes, coverageMatrix]
  );

  // ─── PASSWORD GATE ─────────────────────────────────────────────

  if (!authed) {
    return (
      <div className="min-h-screen bg-deep flex items-center justify-center px-6">
        <form onSubmit={handleLogin} className="max-w-sm w-full">
          <h1 className="font-serif text-2xl text-white mb-6 text-center">
            Curriculum Planner
          </h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter access key"
            className="w-full px-5 py-3 rounded-lg bg-white/[0.08] border border-white/20 text-white placeholder:text-white/40 outline-none focus:border-seafoam mb-4"
          />
          <button
            type="submit"
            className="w-full px-5 py-3 rounded-lg bg-coral text-white font-medium border-none cursor-pointer hover:bg-coral/90 transition-colors"
          >
            Access Planner
          </button>
        </form>
      </div>
    );
  }

  // ─── MAIN LAYOUT ───────────────────────────────────────────────

  return (
    <>
      {/* Print styles */}
      <style>{`
        @media print {
          body { background: white !important; }
          .print\\:hidden { display: none !important; }
          .print\\:bg-white { background: white !important; }
          .print\\:border-gray-200 { border-color: #e5e7eb !important; }
          .print\\:text-black { color: black !important; }
          .print\\:text-gray-500 { color: #6b7280 !important; }
          .print\\:text-gray-400 { color: #9ca3af !important; }
          .print\\:text-gray-700 { color: #374151 !important; }
          .print\\:text-red-600 { color: #dc2626 !important; }
        }
      `}</style>

      <div className="min-h-screen bg-deep pt-28 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 print:hidden">
            <div>
              <h1 className="font-serif text-3xl text-white mb-2">
                Curriculum Planner
              </h1>
              <p className="text-white/40 text-sm">
                LJFC session planning &middot; NGSS-aligned &middot;{" "}
                {sessions.length} session{sessions.length !== 1 ? "s" : ""} saved
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => {
                  setShowBuilder(!showBuilder);
                  if (showBuilder) {
                    setForm(EMPTY_SESSION);
                    setEditingId(null);
                  }
                }}
                className="bg-coral text-white px-5 py-2.5 rounded-full text-sm font-medium border-none cursor-pointer hover:-translate-y-0.5 transition-all"
              >
                {showBuilder ? "Cancel" : "+ New Session"}
              </button>
              <button
                onClick={() => window.print()}
                className="bg-white/[0.08] text-white/70 px-4 py-2.5 rounded-full text-sm border border-white/10 cursor-pointer hover:bg-white/[0.12] transition-colors"
              >
                Export PDF
              </button>
              <button
                onClick={handleExportJSON}
                className="bg-white/[0.08] text-white/70 px-4 py-2.5 rounded-full text-sm border border-white/10 cursor-pointer hover:bg-white/[0.12] transition-colors"
              >
                Export JSON
              </button>
              <label className="bg-white/[0.08] text-white/70 px-4 py-2.5 rounded-full text-sm border border-white/10 cursor-pointer hover:bg-white/[0.12] transition-colors">
                Import JSON
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportJSON}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* ─── SESSION BUILDER ─────────────────────────────── */}
          {showBuilder && (
            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 md:p-8 mb-10 print:hidden">
              <h2 className="font-serif text-xl text-white mb-6">
                {editingId ? "Edit Session" : "New Session Plan"}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* Session type */}
                <div>
                  <label className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase block mb-2">
                    Session Type *
                  </label>
                  <select
                    value={form.sessionType}
                    onChange={(e) => updateForm({ sessionType: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-white/[0.08] border border-white/20 text-white outline-none focus:border-seafoam appearance-none"
                  >
                    <option value="" className="bg-deep">Select...</option>
                    {SESSION_TYPES.map((t) => (
                      <option key={t} value={t} className="bg-deep">{t}</option>
                    ))}
                  </select>
                </div>

                {/* Month */}
                <div>
                  <label className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase block mb-2">
                    Month *
                  </label>
                  <select
                    value={form.month}
                    onChange={(e) => updateForm({ month: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-white/[0.08] border border-white/20 text-white outline-none focus:border-seafoam appearance-none"
                  >
                    <option value="" className="bg-deep">Select...</option>
                    {MONTHS.map((m) => (
                      <option key={m} value={m} className="bg-deep">{m}</option>
                    ))}
                  </select>
                </div>

                {/* Theme */}
                <div>
                  <label className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase block mb-2">
                    Theme
                  </label>
                  <input
                    type="text"
                    value={form.theme}
                    onChange={(e) => updateForm({ theme: e.target.value })}
                    placeholder={form.month ? MONTHLY_THEMES[form.month] || "" : ""}
                    className="w-full px-4 py-2.5 rounded-lg bg-white/[0.08] border border-white/20 text-white placeholder:text-white/30 outline-none focus:border-seafoam"
                  />
                </div>

                {/* Grade band */}
                <div>
                  <label className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase block mb-2">
                    Grade Band *
                  </label>
                  <select
                    value={form.gradeBand}
                    onChange={(e) => updateForm({ gradeBand: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-white/[0.08] border border-white/20 text-white outline-none focus:border-seafoam appearance-none"
                  >
                    <option value="" className="bg-deep">Select...</option>
                    {GRADE_BANDS.map((g) => (
                      <option key={g} value={g} className="bg-deep">{g}</option>
                    ))}
                  </select>
                </div>

                {/* Scientific focus */}
                <div>
                  <label className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase block mb-2">
                    Scientific Focus
                  </label>
                  <input
                    type="text"
                    value={form.scientificFocus}
                    onChange={(e) => updateForm({ scientificFocus: e.target.value })}
                    placeholder="e.g. Shark biology & aggregation behavior"
                    className="w-full px-4 py-2.5 rounded-lg bg-white/[0.08] border border-white/20 text-white placeholder:text-white/30 outline-none focus:border-seafoam"
                  />
                </div>

                {/* Species targets */}
                <div>
                  <label className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase block mb-2">
                    Species Targets
                  </label>
                  <input
                    type="text"
                    value={form.speciesTargets}
                    onChange={(e) => updateForm({ speciesTargets: e.target.value })}
                    placeholder="leopard sharks, garibaldi, bat rays"
                    className="w-full px-4 py-2.5 rounded-lg bg-white/[0.08] border border-white/20 text-white placeholder:text-white/30 outline-none focus:border-seafoam"
                  />
                </div>

                {/* In-water activities */}
                <div className="md:col-span-2 lg:col-span-1">
                  <label className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase block mb-2">
                    In-Water Activities
                  </label>
                  <textarea
                    value={form.inWaterActivities}
                    onChange={(e) => updateForm({ inWaterActivities: e.target.value })}
                    rows={3}
                    placeholder="Snorkel survey, freedive transects..."
                    className="w-full px-4 py-2.5 rounded-lg bg-white/[0.08] border border-white/20 text-white placeholder:text-white/30 outline-none focus:border-seafoam resize-y"
                  />
                </div>

                {/* Shore/land activities */}
                <div className="md:col-span-2 lg:col-span-1">
                  <label className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase block mb-2">
                    Shore/Land Activities
                  </label>
                  <textarea
                    value={form.shoreLandActivities}
                    onChange={(e) => updateForm({ shoreLandActivities: e.target.value })}
                    rows={3}
                    placeholder="Tide pool exploration, journal writing..."
                    className="w-full px-4 py-2.5 rounded-lg bg-white/[0.08] border border-white/20 text-white placeholder:text-white/30 outline-none focus:border-seafoam resize-y"
                  />
                </div>

                {/* Journal prompt */}
                <div>
                  <label className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase block mb-2">
                    Journal Prompt
                  </label>
                  <input
                    type="text"
                    value={form.journalPrompt}
                    onChange={(e) => updateForm({ journalPrompt: e.target.value })}
                    placeholder="What did you observe about..."
                    className="w-full px-4 py-2.5 rounded-lg bg-white/[0.08] border border-white/20 text-white placeholder:text-white/30 outline-none focus:border-seafoam"
                  />
                </div>

                {/* Guest educator */}
                <div>
                  <label className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase block mb-2">
                    Guest Educator
                  </label>
                  <input
                    type="text"
                    value={form.guestEducator}
                    onChange={(e) => updateForm({ guestEducator: e.target.value })}
                    placeholder="Name / Organization"
                    className="w-full px-4 py-2.5 rounded-lg bg-white/[0.08] border border-white/20 text-white placeholder:text-white/30 outline-none focus:border-seafoam"
                  />
                </div>

                {/* Materials needed */}
                <div>
                  <label className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase block mb-2">
                    Materials Needed
                  </label>
                  <textarea
                    value={form.materialsNeeded}
                    onChange={(e) => updateForm({ materialsNeeded: e.target.value })}
                    rows={2}
                    placeholder="Field journals, species ID cards..."
                    className="w-full px-4 py-2.5 rounded-lg bg-white/[0.08] border border-white/20 text-white placeholder:text-white/30 outline-none focus:border-seafoam resize-y"
                  />
                </div>

                {/* Safety notes */}
                <div className="lg:col-span-3">
                  <label className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase block mb-2">
                    Safety Notes
                  </label>
                  <textarea
                    value={form.safetyNotes}
                    onChange={(e) => updateForm({ safetyNotes: e.target.value })}
                    rows={2}
                    placeholder="Surf conditions check, buddy system..."
                    className="w-full px-4 py-2.5 rounded-lg bg-white/[0.08] border border-white/20 text-white placeholder:text-white/30 outline-none focus:border-seafoam resize-y"
                  />
                </div>
              </div>

              {/* NGSS Standards */}
              <div className="mt-6">
                <h3 className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-4">
                  NGSS Standards
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {NGSS_DOMAINS.map((domain) => (
                    <div key={domain.domain}>
                      <div className="text-white/60 text-xs font-semibold mb-2">
                        {domain.domain}
                      </div>
                      <div className="space-y-1.5">
                        {domain.standards.map((std) => (
                          <label
                            key={std.code}
                            className="flex items-start gap-2 cursor-pointer group"
                          >
                            <input
                              type="checkbox"
                              checked={form.ngssStandards.includes(std.code)}
                              onChange={(e) => {
                                const codes = e.target.checked
                                  ? [...form.ngssStandards, std.code]
                                  : form.ngssStandards.filter((c) => c !== std.code);
                                updateForm({ ngssStandards: codes });
                              }}
                              className="mt-0.5 accent-seafoam"
                            />
                            <span className="text-white/50 text-xs group-hover:text-white/70 transition-colors">
                              <span className="font-mono text-white/40">{std.code}</span>{" "}
                              {std.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Science & Engineering Practices */}
              <div className="mt-6">
                <h3 className="text-[11px] text-teal/60 font-medium tracking-[0.2em] uppercase mb-3">
                  Science & Engineering Practices
                </h3>
                <div className="flex flex-wrap gap-3">
                  {SEP_PRACTICES.map((p) => (
                    <label key={p} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={form.sepPractices.includes(p)}
                        onChange={(e) => {
                          const practices = e.target.checked
                            ? [...form.sepPractices, p]
                            : form.sepPractices.filter((x) => x !== p);
                          updateForm({ sepPractices: practices });
                        }}
                        className="accent-seafoam"
                      />
                      <span className="text-white/50 text-xs group-hover:text-white/70 transition-colors">
                        {p}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Save */}
              <div className="mt-8 flex gap-3">
                <button
                  onClick={handleSave}
                  className="bg-seafoam text-deep px-6 py-3 rounded-lg font-medium border-none cursor-pointer hover:bg-seafoam/90 transition-colors"
                >
                  {editingId ? "Update Session" : "Save Session"}
                </button>
                <button
                  onClick={() => {
                    setForm(EMPTY_SESSION);
                    setEditingId(null);
                    setShowBuilder(false);
                  }}
                  className="bg-white/[0.08] text-white/60 px-6 py-3 rounded-lg border border-white/10 cursor-pointer hover:bg-white/[0.12] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* ─── FILTERS ────────────────────────────────────── */}
          <div className="flex flex-wrap gap-3 mb-8 print:hidden">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sessions..."
              className="px-4 py-2 rounded-lg bg-white/[0.08] border border-white/20 text-white placeholder:text-white/30 outline-none focus:border-seafoam text-sm flex-1 min-w-[200px]"
            />
            <select
              value={filterGrade}
              onChange={(e) => setFilterGrade(e.target.value)}
              className="px-3 py-2 rounded-lg bg-white/[0.08] border border-white/20 text-white text-sm outline-none focus:border-seafoam appearance-none"
            >
              <option value="all" className="bg-deep">All Grades</option>
              {GRADE_BANDS.map((g) => (
                <option key={g} value={g} className="bg-deep">{g}</option>
              ))}
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 rounded-lg bg-white/[0.08] border border-white/20 text-white text-sm outline-none focus:border-seafoam appearance-none"
            >
              <option value="all" className="bg-deep">All Types</option>
              {SESSION_TYPES.map((t) => (
                <option key={t} value={t} className="bg-deep">{t}</option>
              ))}
            </select>
            <select
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className="px-3 py-2 rounded-lg bg-white/[0.08] border border-white/20 text-white text-sm outline-none focus:border-seafoam appearance-none"
            >
              <option value="all" className="bg-deep">All Months</option>
              {MONTHS.map((m) => (
                <option key={m} value={m} className="bg-deep">{m}</option>
              ))}
            </select>
          </div>

          {/* ─── SESSION LIBRARY ─────────────────────────────── */}
          {grouped.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-white/30 text-lg font-serif mb-4">No sessions yet</p>
              <p className="text-white/20 text-sm">
                Click &ldquo;+ New Session&rdquo; to start building your curriculum.
              </p>
            </div>
          ) : (
            <div className="space-y-10">
              {grouped.map(([month, monthSessions]) => (
                <div key={month}>
                  <div className="flex items-center gap-3 mb-4">
                    <h2 className="font-serif text-xl text-white">{month}</h2>
                    <span className="text-white/30 text-xs">
                      {MONTHLY_THEMES[month]}
                    </span>
                    <span className="text-white/20 text-xs">
                      {monthSessions.length} session{monthSessions.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {monthSessions.map((session) => (
                      <SessionCard
                        key={session.id}
                        session={session}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ─── NGSS COVERAGE MATRIX ────────────────────────── */}
          {sessions.length > 0 && (
            <div className="mt-16 print:mt-8">
              <h2 className="font-serif text-xl text-white mb-2">NGSS Coverage Matrix</h2>
              <p className="text-white/40 text-sm mb-6">
                Standards coverage across all saved sessions by month
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr>
                      <th className="text-left text-white/40 font-medium p-2 sticky left-0 bg-deep min-w-[140px]">
                        Standard
                      </th>
                      {MONTHS.map((m) => (
                        <th
                          key={m}
                          className="text-center text-white/40 font-medium p-2 min-w-[40px]"
                        >
                          {m.slice(0, 3)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {NGSS_DOMAINS.map((domain) => (
                      <>
                        <tr key={`header-${domain.domain}`}>
                          <td
                            colSpan={13}
                            className="text-[10px] text-teal/60 font-semibold tracking-[0.15em] uppercase pt-4 pb-1 px-2"
                          >
                            {domain.domain}
                          </td>
                        </tr>
                        {domain.standards.map((std) => {
                          const covered = coverageMatrix[std.code];
                          const isCovered = covered.size > 0;
                          return (
                            <tr
                              key={std.code}
                              className={
                                isCovered ? "" : "bg-coral/[0.05]"
                              }
                            >
                              <td
                                className={`p-2 font-mono sticky left-0 bg-deep ${
                                  isCovered ? "text-white/50" : "text-coral/70"
                                }`}
                              >
                                {std.code}
                              </td>
                              {MONTHS.map((m) => (
                                <td key={m} className="p-2 text-center">
                                  {covered.has(m) ? (
                                    <span className="inline-block w-4 h-4 rounded bg-seafoam/30 border border-seafoam/50" />
                                  ) : (
                                    <span className="inline-block w-4 h-4 rounded bg-white/[0.03]" />
                                  )}
                                </td>
                              ))}
                            </tr>
                          );
                        })}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Gaps summary */}
              {uncoveredStandards.length > 0 && (
                <div className="mt-6 bg-coral/10 border border-coral/20 rounded-xl p-5">
                  <div className="text-[10px] text-coral font-semibold uppercase tracking-wider mb-2">
                    Coverage Gaps — {uncoveredStandards.length} standard{uncoveredStandards.length !== 1 ? "s" : ""} with no sessions
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {uncoveredStandards.map((code) => (
                      <span
                        key={code}
                        className="text-[10px] font-mono bg-coral/20 text-coral px-2 py-0.5 rounded"
                      >
                        {code}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
