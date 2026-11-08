/* =====================================================================
   SITE CONTENT — the only file you need to edit to update the website.
   Anything marked  placeholder: true  shows a dashed "Sample" badge on the
   site until you replace it with your own content and delete that flag.
   ===================================================================== */

window.SITE = {
  /* Visitor statistics (GoatCounter: free, no cookies, no consent banner needed).
     Sign up at https://www.goatcounter.com, then put your site code here,
     e.g. "mostafaatalla" for mostafaatalla.goatcounter.com. Leave empty to switch off. */
  analytics: { goatcounter: "mostafaatalla" },


  person: {
    name: "Mostafa A. Atalla, PhD",
    shortName: "Mostafa Atalla",
    role: "Postdoctoral Researcher",
    affiliation: "Bio-Inspired Technology (BITE) group, TU Delft",
    location: "Delft, The Netherlands",
    email: "mostafa.a.atalla@gmail.com",
    cv: "assets/docs/Atalla_CV.pdf",
    portrait: "", // e.g. "assets/photos/portrait.jpg"
    // References: shown on the Contact page with email only
    references: [
      { name: "Prof. dr. ir. Paul Breedveld", title: "Full Professor, Faculty of Mechanical Engineering, TU Delft", email: "p.breedveld@tudelft.nl" },
      { name: "Dr. ir. Aimée Sakes", title: "Associate Professor, Faculty of Mechanical Engineering, TU Delft", email: "a.sakes@tudelft.nl" },
      { name: "Dr. Michaël Wiertlewski", title: "Associate Professor, Faculty of Mechanical Engineering, TU Delft", email: "m.wiertlewski@tudelft.nl" },
      { name: "Prof. dr. ir. Gijs Krijnen", title: "Full Professor, Faculty of EEMCS, University of Twente", email: "gijs.krijnen@utwente.nl" },
      { name: "Prof. Robert J. Webster III", title: "Richard A. Schroeder Professor of Mechanical Engineering, Vanderbilt University", email: "robert.webster@vanderbilt.edu" }
    ],
    links: {
      // Paste your full profile URLs. Empty links are hidden automatically.
      linkedin: "https://www.linkedin.com/in/mostafa-atalla193/",
      scholar: "",
      orcid: "",
      github: "",
      youtube: "https://www.youtube.com/@mostafaaatalla",
      researchgate: ""
    }
  },

  quote: {
    text: "Science is the art of discovery and scientists are the maestros that orchestrate the art of science",
    context: "From my PhD defense, Delft University of Technology"
  },

  // Defense clip. Use EITHER a YouTube video ID (recommended for long clips)
  // OR an mp4 in assets/video/ (keep it under ~50 MB for GitHub).
  defense: {
    // Background of the home page: a short clip of you saying the quote.
    // Muted, looping, full width. Option 1 (best): an mp4 in assets/video/.
    heroVideo: "assets/video/hero-loop.mp4",
    heroPoster: "",          // optional still image shown while the video loads
    // Option 2: a YouTube video. Clear heroVideo above, then fill these in.
    heroYoutubeId: "",
    heroStart: 0,            // seconds where the quote starts
    heroEnd: 0,              // seconds where it ends (0 = end of video)

    // The full defense in the section below the hero (with sound and controls).
    youtubeId: "pBPTiyE4l84",
    mp4: "assets/video/defense-clip.mp4",
    poster: "",
    caption: "The full defense, Delft University of Technology. 58 min.",
    thesis: "When Friction Meets Function: Engineering Medical Instruments with Friction to Glide, Grip and Propel"
  },

  bio: [
    "I build physical intelligence into machines that interact with the world through contact, so that their mechanics keep that interaction safe and functional. Friction is my main instrument: modulated, switched and coordinated across contacts, it decides whether a machine advances, holds or harms what it touches. Medical instruments in biological lumens are the most demanding application, and the same principles extend to robotic locomotion and manipulation.",
    "My PhD at TU Delft showed that ultrasonic vibration can lower the friction of a catheter on demand through a squeeze film, and that coordinating friction across several contacts is enough to make a capsule robot for colonoscopy propel itself. After a postdoc at the University of Twente on mechanically intelligent soft robots for colonoscopy, I am now a postdoctoral researcher in the Bio-Inspired Technology (BITE) group at TU Delft, where I continue this work toward physically intelligent machines that are safe by design."
  ],
  now: "Currently: postdoctoral researcher in the Bio-Inspired Technology (BITE) group at TU Delft.",

  /* ---------------- HOME PAGE STATEMENTS ----------------
     Drafts written from your CV. Rewrite them in your own words.  */
  researchInterests: ["Physical intelligence", "Safe physical interaction", "Friction and contact mechanics", "Medical and surgical robotics", "Robotic locomotion", "Robotic manipulation", "Soft and continuum robots", "Bio-inspired design"],
  researchStatement: {
    title: "Physical intelligence for safe and functional mechanical interaction",
    lead: "A robot or an instrument acts on its environment through contact, and the mechanics of that contact, friction, the distribution of normal load and local stiffness, decide both whether the interaction does its job and whether it remains safe. The two requirements pull in opposite directions: the friction that lets a device grip or propel is the friction that loads the surface it touches, and the stiffness that transmits force along a body is the stiffness that concentrates it at the contact. Softness alone does not resolve this conflict; it trades function for compliance, without defining what safe means.",
    body: [
      "My research addresses this conflict in the mechanics itself, by building physical intelligence into the body of the device: the capacity of its surfaces and structure to respond to interaction through their mechanics, locally and at the instant the load appears. Examples from my work include friction modulated on demand by ultrasonic squeeze films, friction anisotropy encoded by motion to generate locomotion, and electroadhesion that lets one device grip where it must and slide where it should. Medical instruments in biological lumens are the most demanding testbed, because tissue is fragile, variable and viscoelastic, and failure has clinical consequences; the same principles govern robotic locomotion and extend to manipulation.",
      "I believe the next wave of intelligence in robotics will reduce the load on the brain through embodied physical intelligence. Artificial intelligence gives robots powerful perception, planning and reasoning, but contact loads arise along the entire body, often far from where sensors and actuators sit, and it is the embodied mechanics that ultimately determine how safely and effectively a robot interacts with its environment. A body that is safe by design, and that filters disturbances and interaction uncertainties locally, reduces the sensing and control burden on AI, leaving the brain free for high-level decisions rather than micromanaging the physics."
    ],
    quote: "The smartest robot is not the one that thinks the most. It is the one that needs to think the least.",
    quoteBy: "Mostafa A. Atalla",
    quoteSource: "Invited talk “The Body Thinks Too: Physical Intelligence for Medical Robotics in the Age of AI”, ORSI Innotech Surgical AI & Telesurgery Days 2026, Ghent",
    principles: [
      { title: "Physics first", text: "Every project starts with the mechanism behind the interaction, understood and modelled before any device is designed. Squeeze-film levitation in liquid came before the first lubricated catheter." },
      { title: "Design is the art", text: "Nature and imagination supply the form that puts the mechanism to work: an ovipositor, an inchworm, a vibrating asymmetric body." },
      { title: "Intelligence in the structure", text: "Where possible, the response to interaction is built into materials and structure, so safety does not depend on a sensor or a controller working correctly." },
      { title: "Validate where it matters", text: "Devices are tested in the conditions of their application, from bench models to ex-vivo tissue, and claims stay within what was measured." }
    ]
  },
  researchLines: {
    title: "A continuous synergy between fundamental and applied research",
    lead: "Applications inspire fundamental research questions in physics and mechanics. We tackle those questions with the techniques of physics and mechanics to uncover new physical principles, and once uncovered, those principles inform new designs and technologies that fulfil the needs of the application. The new technologies raise new questions, and the cycle goes back and forth. My research lines therefore rest on two pillars, fundamental and applied, and inside each lie the specific methods and applications I explore.",
    toFundamental: "Applications inspire questions",
    toApplied: "Principles inform designs",
    pillars: [
      { key: "Applied", title: "Technologies for safe and functional interaction",
        text: "Designs and devices built on the principles we uncover, tested in the conditions of their application.",
        groups: [
          { label: "Medical instruments", items: ["Variable-friction catheters", "Actively lubricated instrument sheaths", "Self-propelling capsule robots for colonoscopy", "Safe-by-design endoluminal instruments"] },
          { label: "Locomotion", items: ["Vibrating asymmetric soft robots", "Pipeline and sliding robots"] },
          { label: "Manipulation", items: ["Switchable friction and electroadhesion for grasping"] }
        ] },
      { key: "Fundamental", title: "Physics and mechanics of contact",
        text: "The physical questions that applications raise, studied in their own right.",
        groups: [
          { label: "Questions", items: ["Squeeze-film levitation and ultrasonic friction modulation", "Friction anisotropy and stick-slip in locomotion", "Electroadhesion on non-planar structures", "Rolling contact of soft bodies"] },
          { label: "Techniques", items: ["Analytical and numerical modelling", "Tribological characterisation", "Controlled bench and ex-vivo experiments"] }
        ] }
    ]
  },
  teachingPhilosophy: {
    title: "Stimulating minds to think",
    lead: "I believe teaching is about stimulating minds to think. That means engaging students actively in a dialogue where they can express their perspective freely, with the focus on deep understanding of the subject and, very importantly, its connection to the greater landscape of science and history. With the rise of AI, we need more than ever to cultivate critical thinking: the ability to ask the questions that matter.",
    practices: [
      { title: "Questions before answers", text: "A session opens with a question rather than a definition. Students reason toward the concept in open dialogue and defend their own perspective, so understanding is built rather than received." },
      { title: "Ideas with their history", text: "Every concept is taught in its place in the landscape of science: the problem that demanded it, the people who found it, and what it made possible next." },
      { title: "Integrated science", text: "No subject is taught as a standalone island. Each course is presented as part of a whole, connected to the other disciplines it draws on and feeds into, so students see how the pieces of science fit together." },
      { title: "A culture of learning from mistakes", text: "Mistakes are expected and openly discussed in class. A wrong answer examined together teaches more than a right answer memorised, so students learn to take risks in their thinking." },
      { title: "Build it, then defend it", text: "Hands-on, project-based work tests ideas against reality; debate sessions and regular oral presentations make students argue for their reasoning in front of their peers." },
      { title: "AI in the service of learning", text: "With the rise of AI, students use AI engines as assistants that raise their productivity, while the course trains what AI cannot replace: asking the question that matters and judging whether an answer holds. AI also assists us, educators, in our mission: it makes it practical to gamify learning, turning a concept into a game in which students feel the physics before they meet the equations, so that learning becomes more intuitive and more effective. The Lab on this site does this for my own research." }
    ]
  },
  teachingStatement: {
    title: "Patience, trust and room to grow",
    lead: "Mentoring is about helping people grow and reach their full potential. It takes patience, patience and patience. As a mentor I am like a farmer who cultivates seeds: I give water and nutrients when they are needed, in the right amount, not too much and not too little, and then I leave the seeds the room and the time to grow.",
    practices: [
      { title: "Patience", text: "Growth cannot be rushed. Real progress takes time, and a mentor's first job is to wait for it." },
      { title: "Trust and a safe space", text: "I trust my mentees and give them a safe space to make mistakes, because that is how they find their own way." },
      { title: "The right dose", text: "Support when it is needed, room when it is not. Too much guidance stifles growth; too little leaves it starved." },
      { title: "No one size fits all", text: "Every mentee, like every seed, has specific needs, so I tailor the style and frequency of mentorship to each person." }
    ]
  },
  vision: {
    research: "Machines that are safe by design, whose mechanics decide how they touch the world.",
    researchShort: "Safe by design",
    community: "Open doors for junior researchers: make opportunities visible early and give them ownership of real research.",
    communityShort: "Open doors"
  },

  /* ---------------- RESEARCH ---------------- */
  themes: [
    {
      verb: "Glide",
      title: "Friction lowered on demand",
      text: "Vibrating a surface at ultrasonic frequency squeezes a thin film into the contact. The film carries part of the load, so friction drops while the vibration is on and returns when it is off: catheters that glide through biological lumens, and surfaces whose friction is set in real time.",
      pubs: ["J6", "J3", "J2", "C3", "C5", "P1"]
    },
    {
      verb: "Grip",
      title: "Holding where it must",
      text: "Some tasks need the opposite: a structure that holds against what it touches. Electroadhesion and switchable lubrication let one device anchor where it must and slide where it should, from instruments stabilised against the lumen wall toward grasping in manipulation.",
      pubs: ["C1", "A1", "C2"]
    },
    {
      verb: "Propel",
      title: "Friction-driven locomotion",
      text: "Alternating high- and low-friction contacts converts reciprocating motion into net displacement. The same principle drives OSCAR, an ovipositor-inspired capsule robot for colonoscopy, vibrating asymmetric soft robots, and pipeline and sliding robots.",
      pubs: ["J1", "C2", "C4", "J5"]
    }
  ],

  /* ---------------- PUBLICATIONS ----------------
     type: journal | conference | abstract | patent
     status: "" | "under review" | "accepted"            */
  publications: [
    // hl: one-line highlight · img: figure · video: YouTube ID · also: related presentations and awards
    { id: "T1", type: "thesis", year: 2026,
      title: "When Friction Meets Function: Engineering Medical Instruments with Friction to Glide, Grip and Propel",
      authors: "M. A. Atalla", venue: "PhD dissertation, Delft University of Technology",
      doi: "10.4233/uuid:03d8697a-d8ba-47b4-b779-892ae2e980c4", video: "pBPTiyE4l84", img: "assets/photos/defense-day.jpg",
      hl: "Friction treated as a design variable: modulated by ultrasound to glide, switched on to grip, and coordinated across contacts to propel." },

    { id: "J1", type: "journal", year: 2026, status: "under review",
      title: "OSCAR: An Ovipositor-Inspired Self-Propelling Capsule Robot for Colonoscopy",
      authors: "M. A. Atalla, A. S. Sekar, R. van Starkenburg, D. J. Jager, A. Sakes, M. Wiertlewski, and P. Breedveld",
      venue: "arXiv preprint", doi: "10.48550/arXiv.2602.15309", img: "assets/img/pubs/oscar.jpg",
      hl: "Twelve cam-driven sliders reproduce the anchor-and-release motion of a parasitic wasp's ovipositor, letting a capsule propel itself without external actuation of the colon wall.",
      also: [{ t: "Proof of concept at CRAS 2025, Lisbon", award: "Best Paper and Oral Presentation Award" }] },
    { id: "J2", type: "journal", year: 2025, status: "under review",
      title: "Active Lubrication of Transluminal Medical Instruments",
      authors: "M. A. Atalla, J. Nieuwenhuis, A. Martin, X. Wang, A. Canden, M. J. Carré, R. Lewis, A. Sakes, and M. Wiertlewski",
      venue: "arXiv preprint", doi: "10.48550/arXiv.2506.07225", img: "assets/img/pubs/activelub.jpg",
      hl: "Ultrasonic friction-control modules along a sheath lubricate an instrument on demand, with friction and thermal safety characterised on ex-vivo tissue.",
      also: [{ t: "“Friction modulation of catheters using ultrasonic waves”, 49th Leeds-Lyon Symposium on Tribology, 2024", award: "Maurice Godet Award" }, { t: "Dutch Biomedical Engineering Conference, Egmond aan Zee, 2025 (oral)" }, { t: "Health Tech Open Day, TU Delft, 2024 (oral)" }] },
    { id: "J3", type: "journal", year: 2024,
      title: "Toward Variable-Friction Catheters Using Ultrasonic Lubrication",
      authors: "M. A. Atalla, J. J. Tuijp, M. Wiertlewski, and A. Sakes",
      venue: "IEEE Transactions on Medical Robotics and Bionics, 6(4), 1375–1381", doi: "10.1109/TMRB.2024.3464672", video: "2bmjkfAqmaQ",
      hl: "Micron-level ultrasonic surface vibration switches a catheter between a low-friction state for navigation and a high-friction state for stable task execution.",
      also: [{ t: "Featured on the TU Delft news front page, November 2024" }, { t: "BioMechanical Engineering Department Conference 2024", award: "Best Poster Award" }] },
    { id: "J4", type: "journal", year: 2024,
      title: "Advancements in aspiration catheter tip design for thrombectomy: a comprehensive patent review",
      authors: "V. G. Kortman, Y. Verberne, M. A. Atalla, and A. Sakes",
      venue: "Frontiers in Medical Technology, 6, 1388638", doi: "10.3389/fmedt.2024.1388638",
      hl: "A structured review of patented aspiration-catheter tip designs for removing blood clots." },
    { id: "J5", type: "journal", year: 2023,
      title: "Simple and Fast Locomotion of Vibrating Asymmetric Soft Robots",
      authors: "A. Sabbadini, M. A. Atalla, and M. Wiertlewski",
      venue: "Soft Robotics, 10(6), 1199–1208", doi: "10.1089/soro.2022.0209",
      hl: "Vibrating an asymmetric soft body produces directional friction and fast locomotion from a single actuator." },
    { id: "J6", type: "journal", year: 2023,
      title: "Incompressible squeeze-film levitation",
      authors: "M. A. Atalla, R. A. J. van Ostayen, A. Sakes, and M. Wiertlewski",
      venue: "Applied Physics Letters, 122(24), 241601", doi: "10.1063/5.0149501", img: "assets/img/pubs/squeezefilm.jpg",
      hl: "Squeeze-film levitation also works in liquid: an ultrasonically vibrating surface levitates a free-floating reflector, explained by a model of the incompressible film.",
      also: [{ t: "APS March Meeting 2023 (oral)" }, { t: "IEEE International Ultrasonics Symposium 2022, Venice" }] },
    { id: "J7", type: "journal", year: 2021,
      title: "Beyond Constant Curvature: A New Mechanics Model for Unidirectional Notched-Tube Continuum Wrists",
      authors: "N. E. Pacheco, J. B. Gafford, M. A. Atalla, R. J. Webster, and L. Fichera",
      venue: "Journal of Medical Robotics Research, 6(1–2)", doi: "10.1142/S2424905X21400043",
      hl: "A mechanics model for notched-tube surgical wrists that captures their deformation beyond the constant-curvature assumption." },
    { id: "J8", type: "journal", year: 2020,
      title: "A proposed soft pneumatic actuator control based on angle estimation from data-driven model",
      authors: "M. H. Mohamed, S. H. Wagdy, M. A. Atalla, A. R. Youssef, and S. A. Maged",
      venue: "Proc. IMechE Part H: Journal of Engineering in Medicine, 234(6), 612–625", doi: "10.1177/0954411920911277",
      hl: "Bending-angle control of a soft pneumatic actuator from a data-driven estimation model." },

    { id: "C1", type: "conference", year: 2026, status: "accepted",
      title: "Toward 3D Printable Non-Planar Electroadhesive Structures for Active Anchoring",
      authors: "M. A. Atalla, C. R. Derla, P. Canyelles Pericàs, and G. Krijnen",
      venue: "Proceedings of IEEE SENSORS 2026, Rotterdam", doi: "10.48550/arXiv.2609.18700", img: "assets/img/pubs/sensors26.jpg",
      hl: "Multi-material 3D printing builds electrodes into curved shafts in one step, avoiding the delamination of wrapped flat pads, with electrically controlled adhesion shown experimentally." },    { id: "C2", type: "conference", year: 2026,
      title: "Grip as Needed, Glide on Demand: Ultrasonic Lubrication for Robotic Locomotion",
      authors: "M. A. Atalla, J. Cummings, D. van Bemmel, P. Breedveld, M. Wiertlewski, and A. Sakes",
      venue: "2026 IEEE International Conference on Robotics and Automation (ICRA), Vienna, 23957–23964", doi: "10.1109/ICRA57385.2026.11696075", img: "assets/img/pubs/icra26.jpg", video: "kEHPD8XW58o",
      hl: "Switching ultrasonic vibration on and off toggles each module between grip and glide, so locomotion needs neither normal-force control nor anisotropic surfaces.",
      also: [{ t: "Oral presentation, Mechanisms Design session, ICRA 2026" }, { t: "“Unconventional robotic locomotion: the ultrasonic lubrication way”, Unconventional Robotics Symposium 2025 (poster)" }] },
    { id: "C3", type: "conference", year: 2024,
      title: "Ultrasonically-lubricated catheters: miniaturization and ex-vivo tissue validation",
      authors: "M. A. Atalla, J. Nieuwenhuis, A. Martin, A. Canden, X. Wang, M. J. Carré, R. Lewis, M. Wiertlewski, and A. Sakes",
      venue: "Hamlyn Symposium on Medical Robotics (HSMR), London", doi: "10.31256/HSMR2024.10", video: "2bmjkfAqmaQ",
      hl: "A miniaturised ultrasonic catheter module reduces friction on ex-vivo tissue." },
    { id: "C4", type: "conference", year: 2024,
      title: "Mechanically-Inflatable Bio-Inspired Locomotion for Robotic Pipeline Inspection",
      authors: "M. A. Atalla, F. Trauzettel, S. P. van Gelder, P. Breedveld, M. Wiertlewski, and A. Sakes",
      venue: "IEEE 7th International Conference on Soft Robotics (RoboSoft), San Diego, 586–592", doi: "10.1109/RoboSoft60065.2024.10521968", img: "assets/img/pubs/pipeline.jpg",
      hl: "A wasp-inspired motion sequence induces friction anisotropy, letting an inflatable robot crawl through pipes and confined spaces.",
      also: [{ t: "RoboSoft 2024", award: "Travel Grant for Excellence" }, { t: "Dutch Soft Robotics Symposium 2024", award: "Best Poster Award" }] },
    { id: "C5", type: "conference", year: 2023,
      title: "Ultrasonically-Lubricated Catheters: A Proof of Concept",
      authors: "M. A. Atalla, J. J. Tuijp, M. Wiertlewski, and A. Sakes",
      venue: "Hamlyn Symposium on Medical Robotics (HSMR), London", doi: "10.31256/HSMR2023.12",
      hl: "First demonstration that ultrasonic vibration lowers catheter friction on demand." },

    { id: "A1", type: "abstract", year: 2025,
      title: "Electroadhesive Stabilization of Soft Robotic Catheters",
      authors: "M. A. Atalla, T. de Visser, A. Sakes, M. Wiertlewski, and Y. Vardar",
      venue: "IEEE 8th International Conference on Soft Robotics (RoboSoft), Lausanne",
      hl: "Electroadhesion anchors a soft catheter against the lumen wall to stabilise it during a task." },

    { id: "P1", type: "patent", year: 2025,
      title: "Medical device for intraluminal intervention",
      authors: "M. A. Atalla, J. Nieuwenhuis, M. Wiertlewski, and A. Sakes",
      venue: "Dutch patent NL2036368B1, granted, published 4 June 2025", url: "https://patents.google.com/patent/NL2036368B1", img: "assets/img/pubs/activelub-proto.jpg",
      hl: "Covers intraluminal devices with ultrasonic friction control." },
    { id: "P2", type: "patent", year: 2025,
      title: "Mechanical Shear Wave Generation for Ultrasonic Elastography",
      authors: "M. A. Atalla, R. Q. Erkamp, and M. M. Nguyen",
      venue: "U.S. Patent US12364463B2, granted", url: "https://patents.google.com/patent/US12364463B2",
      hl: "From Philips Research: mechanical generation of shear waves for ultrasound elastography." }
  ],

  /* ---------------- JOURNEY ----------------
     kind: academic | industry | education ; city must match a station id */
  // Journey: chapters on the map, and the big moves between them.
  // logos are files in assets/img/logos/ ; photos rotate in each chapter.
  /* The Lab: one playable demo per research contribution.
     papers = indices into publications[]; fig = a figure from the paper shown in the game. */
  lab: {
    themes: {
      grip: { title: "Grip and glide: friction on demand", text: "A violin needs grip and slip; a catheter needs glide or grip, at the right moment. The tutorial builds the intuition, the games put it to work." },
      sync: { title: "Coordination: many contacts, one motion", text: "An orchestra needs a maestro; a capsule with twelve sliders needs a cam. The tutorial builds the intuition, the game lets you design it." },
      both: { title: "Both at once: friction on demand, timed", text: "A skier needs the two ideas together: friction switched on demand under each ski, and the switching timed to the stride. No new tutorial: this game builds on both of the above.", builds: ["violin", "maestro"] }
    },
    title: "Play the research",
    lede: "Experience science through gameplay: two tutorials and four games in three themes, each driven by the model from the paper behind it. Feel why friction decides whether a catheter is safe, levitate a disc on a liquid film, design the cam that drives a capsule to the cecum, and ski on ground with no ice.",
    games: [
      { id: "violin", theme: "grip", n: "A", tag: "Tutorial A", kind: "tutorial", verb: "Grip + slip", title: "The violinist's secret", hook: "Bow a violin: too light and it whispers, too heavy and it crunches. Then lend the physician your bow.",
        learn: "A violin sings only when the bow grips and slips in turn, under the player's control. A catheter needs the same control: glide to navigate, grip to work.",
        papers: [3, 2], fig: "assets/img/lab/violin-catheter.jpg", figcap: "From my PhD defense", status: "live", time: "3 min", next: "glide",
        model: ["Bowed-string stick-slip: the bow grips the string, the string's tension breaks it free, and it slips back (Helmholtz motion, a saw-tooth)", "Playable window between a minimum and a maximum bow force, F_min ∝ v/β² and F_max ∝ v/β (Schelleng)"],
        illus: ["Constants of the force window, the slow-motion close-up and the synthesized sound", "The physician's four decisions are teaching cases, not a simulation", "Characters and stage"] },
      { id: "glide", theme: "grip", n: 1, verb: "Glide", title: "The squeeze-film lab", hook: "Carry a full cup across a rough floor, levitate a disc on a liquid film, and stop a catheter on the mark.",
        learn: "A surface vibrating a few micrometres turns stick-slip into glide, and the film carries load even in a liquid.",
        papers: [6, 3], fig: "assets/img/pubs/squeezefilm.jpg", status: "live", time: "3 min",
        model: ["Stick-slip: Coulomb friction (static and kinetic) on a spring-pulled sled, solved in time", "Friction reduction by surface, as measured: ~80% rigid dry, ~60% rigid wet, ~38% ex-vivo aorta", "Levitation height scales as amplitude/√mass (APL Eq. 14)"],
        illus: ["Levitation prefactor set to the measured range (tens of µm); Eq. 14's constant is too sensitive to C_e to use directly", "Pressure trace shows the form of the inertia term, not a film-equation solution", "Water spill, heartbeat push, spring stiffness and masses", "Contact load, wall indentation and the asperity close-up are drawn to explain the mechanism, not to scale"] },
      { id: "catheter", theme: "grip", n: 2, verb: "Glide + grip", title: "Catheter run", hook: "Be the cardiologist: navigate the vessels, then deploy a stent, a valve or remove a clot while the heart beats.",
        learn: "Low friction makes navigation safe; high friction is what holds the tip still when it matters.",
        papers: [3, 2, 11], fig: "assets/img/pubs/activelub.jpg", status: "live", time: "6 min",
        model: ["Force along the catheter decays at every bend as exp(−μθ), θ the angle wrapped (capstan effect), so friction grows with the bends passed", "Wall contact load T·|κ| at each bend, and wear ∝ μ × load × sliding", "Ultrasound lowers μ by the measured mean 38% (ex-vivo aorta)", "The shaft buckles when the hand force exceeds a set buckling load"],
        illus: ["Absolute forces, the buckling load and the damage scale: the papers report buckling only qualitatively", "Vessel geometry (a simplified femoral-to-coronary route), heartbeat motion and deployment tolerances", "How much of the heartbeat the tip follows is a simple grip model, not measured", "Shaft shape: resting on the outer wall of each bend, bowing inside the lumen under compression, and the squeeze-film thickness are drawn to scale for visibility, not computed"] },
      { id: "maestro", theme: "sync", n: "B", tag: "Tutorial B", kind: "tutorial", verb: "Coordination", title: "The maestro and the cam", hook: "Keep an orchestra on the beat, then conduct twelve capsule sliders by hand, and watch the cam do it for you.",
        learn: "Many players need a common beat. OSCAR's sliders pull only while more of them retract than advance, so the cam must time every slider, like a maestro.",
        papers: [1], fig: "assets/img/lab/maestro-capsule.jpg", figcap: "From my PhD defense", status: "live", time: "4 min", next: "oscar",
        model: ["Net thrust ∝ (sliders retracting − sliders advancing) / n, the OSCAR principle n_ret > n_adv", "A slider that reaches the end of its stroke stops pulling until it is advanced", "Mean thrust with the cam ≈ 1 − 2·(advance time / cycle), i.e. Δd"],
        illus: ["Music, audience and timing tolerances", "Capsule speed from thrust and the rocking animation", "Slider stroke and cycle times are scaled for play"] },
      { id: "oscar", theme: "sync", n: 3, verb: "Propel", title: "OSCAR: race to the cecum", hook: "Design the cam that times twelve sliders, then drive your capsule through the colon against the clock.",
        learn: "Thrust follows the retract–advance asymmetry of the cam; balancing the sliders smooths the ripple.",
        papers: [1], fig: "assets/img/pubs/oscar-design.jpg", status: "live", time: "6 min",
        model: ["Mean thrust ∝ Δd = d_ret − d_adv (Eq. 18), scaled to the measured 0.85 N of the single-jump cam", "Each advance takes about 32° of cam rotation, which reproduces the paper's Δd of 0.82, 0.64 and 0.48 for 1, 2 and 3 jumps", "12 sliders on evenly spaced phases, friction-limited in both directions: asynchrony ripple from the number advancing at once, as in the paper's model", "Rocking from an unbalanced advance, which opposite sliders cancel with 2 or 3 jumps: the paper's explanation of the measured ripple"],
        illus: ["Rocking amplitude scaled to the measured ~0.3 N for one jump; its growth with motor speed and with steeper advances is assumed (inertia), not measured", "The game reproduces the drop in ripple from 1 jump to balanced cams, not the further drop from 2 to 3 jumps the paper measured", "Colon lengths and drag per segment, speed scaling with the motor and the comfort score; the measured speed is 3.08 mm/s with the single-jump cam", "The 4-jump cam and slider counts other than 12 are extrapolations"] },
      { id: "ski", theme: "both", n: 4, verb: "Glide + grip + timing", title: "Skiing without ice", hook: "Switch the ultrasound from ski to ski in time with the stride, and cross dry, wet, sandpaper and soil tracks with no ice and no lifting.",
        learn: "Lubricate the ski that moves, let the other grip, and swap in time: locomotion on any ground, with no ice and no lifting.",
        papers: [10], fig: "assets/img/pubs/icra26.jpg", status: "live", time: "4 min",
        model: ["Each stride slides one ski forward against the other: the ski with less friction moves", "Friction reduction under a vibrating ski, as measured: 71–77% dry, 56–71% wet, 28–49% sandpaper and soil (one shared range), 27–38% ex-vivo intestine", "How much the gripping ski slips back is set so that dry ground gives the ~95% stride efficiency measured with the inchworm robot"],
        illus: ["Split of the shared 28–49% range between sandpaper and soil, and the slip on wet, sandpaper and soil: model predictions, not measured", "Effect of mistimed switching: a model prediction (the paper leaves activation timing to future work)", "The skier, stride rhythm, track lengths and race times; the robots in the paper are an inchworm and an ovipositor mechanism, not a skier"] }
    ]
  },

  /* Journey atlas: places shown on the map besides the three homes.
     type "work": places worked or collaborated; type "venue": talks are matched to it
     from talks[] by the strings in match (the talk year decides which chapter lights it up). */
  places: [
    { id: "enschede", type: "work", city: "Enschede", name: "University of Twente", chapter: "delft", logo: "utwente", text: "Postdoctoral researcher, RaM group, 2024–2026" },
    { id: "sheffield", type: "work", city: "Sheffield", name: "University of Sheffield", chapter: "delft", text: "Tribology collaboration during the PhD" },
    { id: "ghent", type: "venue", city: "Ghent", match: ["Ghent"] },
    { id: "eindhoven", type: "venue", city: "Eindhoven", match: ["TU Eindhoven", "DSRS"] },
    { id: "egmond", type: "venue", city: "Egmond aan Zee", match: ["Egmond"] },
    { id: "london", type: "venue", city: "London", match: ["Hamlyn"] },
    { id: "lyon", type: "venue", city: "Lyon", match: ["Leeds-Lyon"] },
    { id: "lausanne", type: "venue", city: "Lausanne", match: ["Lausanne"] },
    { id: "venice", type: "venue", city: "Venice", match: ["Venice"] },
    { id: "vienna", type: "venue", city: "Vienna", match: ["Vienna"] },
    { id: "lisbon", type: "venue", city: "Lisbon", match: ["Lisbon"] },
    { id: "sandiego", type: "venue", city: "San Diego", match: ["San Diego"] },
    { id: "lasvegas", type: "venue", city: "Las Vegas", match: ["APS March"] },
    { id: "delft", type: "venue", city: "Delft", home: true, match: ["TU Delft", "BMechE"] }
  ],

  chapters: [
    { id: "cairo", pin: "cairo", city: "Cairo, Egypt", years: "2009–2018", title: "Engineering foundations",
      text: "Mechanical design and production engineering at Cairo University, then industry: hydraulics maintenance, and research and innovation at Advansys, where I led a soft robotic hand exoskeleton project with Ain Shams University.",
      logos: [["cairo-university", "Cairo University"], ["advansys", "Advansys ESC"], ["dematic", "Dematic (Advansys partner)"]],
      photos: [{ src: "assets/journey/advansys-exohand-demo.jpg", caption: 'ExoHand project: final presentation and demo, Cairo' }, { src: "assets/journey/advansys-team.jpg", caption: 'The Advansys ESC team, Cairo' }, { src: "assets/journey/exohand-glove.jpg", caption: 'Soft robotic hand exoskeleton, proof of concept' }, { src: "assets/journey/exohand-actuators.jpg", caption: 'Soft pneumatic actuators for the ExoHand' }, { src: "assets/journey/ar-science-kit.jpg", caption: 'AR science kit for primary schools, a project I managed' }, { src: "assets/journey/dematic-frankfurt.jpg", caption: 'Supporting the Dematic R&D team on site, Frankfurt' }, { src: "assets/journey/advansys-certificate.jpg", caption: 'Certificate of appreciation, Advansys innovation team, 2018' }] },
    { id: "massachusetts", pin: "worcester", city: "Worcester & Cambridge, MA, USA", years: "2018–2020", title: "Robotics in Massachusetts",
      text: "An MSc in Robotics Engineering at WPI as a Fulbright Scholar in the COMET Lab, product development at UbiRos, and two internships at Philips Research North America on ultrasound elastography and image-guided therapy robotics.",
      logos: [["wpi", "Worcester Polytechnic Institute"], ["comet-lab", "COMET Lab, WPI"], ["fulbright", "Fulbright"], ["ubiros", "UbiRos"], ["philips", "Philips Research"]],
      photos: [{ src: "assets/journey/comet-lab-team.jpg", caption: 'The COMET Lab team, Worcester' }, { src: "assets/journey/wpi-continuum-robot.jpg", caption: 'A low-cost continuum robot platform for the lab' }, { src: "assets/journey/wpi-exoskeleton.jpg", caption: 'Position sensing for a hand exoskeleton' }, { src: "assets/journey/ubiros-gripper.jpg", caption: 'UbiRos soft gripper: quick-release mechanism prototype' }, { src: "assets/journey/ubiros-teleop.jpg", caption: 'Keyboard tele-operation of the gripper through ROS' }, { src: "assets/journey/philips-elastography-team.jpg", caption: 'Philips Research, 2019: portable elastography' }, { src: "assets/journey/elastography-prototype.jpg", caption: 'Mechanical-vibration elastography prototype' }, { src: "assets/journey/philips-robotics-team.jpg", caption: 'Philips Research robotics team, 2020' }, { src: "assets/journey/endovascular-robot.jpg", caption: 'Endovascular robot platform built at Philips' }, { src: "assets/journey/fulbright-dc.jpg", caption: 'Fulbright scholars workshop, Washington DC' }, { src: "assets/photos/li/wpi-lab-1.jpg", caption: 'The robotics lab at WPI' }] },
    { id: "delft", pin: "delft", city: "Delft & Enschede, The Netherlands", years: "2020–", title: "Friction meets function",
      text: "A PhD at TU Delft on engineering friction in medical instruments, in collaboration with the tribology group at the University of Sheffield, a postdoc at the University of Twente on mechanically intelligent soft robots for colonoscopy, and now a postdoc in the Bio-Inspired Technology (BITE) group at TU Delft.",
      logos: [["tudelft", "TU Delft"], ["utwente", "University of Twente"], ["bite", "Bio-Inspired Technology group"]],
      photos: [{ src: "assets/journey/catheter-module.jpg", caption: 'Ultrasonic friction-control module next to a 2-euro coin' }, { src: "assets/journey/oscar-parts.jpg", caption: 'Parts of the OSCAR capsule robot' }, { src: "assets/journey/pipeline-robot.jpg", caption: 'Wasp-inspired pipeline locomotion' }, { src: "assets/journey/squeeze-film-setup.jpg", caption: 'Squeeze-film levitation setup' }, { src: "assets/journey/tactile-gripper.jpg", caption: 'A tactile robotic gripper for haptics research' }, { src: "assets/journey/sheffield-tribology.jpg", caption: 'With the tribology group, University of Sheffield' }, { src: "assets/photos/li/godet-2.jpg", caption: 'Maurice Godet Award, Lyon, 2024' }, { src: "assets/photos/li/robosoft24-2.jpg", caption: 'RoboSoft 2024, San Diego' }, { src: "assets/journey/phd-committee.jpg", caption: 'The PhD committee' }, { src: "assets/photos/defense-day.jpg", caption: "PhD defense, TU Delft" }] }
  ],
  moves: [
    { from: "cairo", to: "worcester", arc: "cairo_worcester", year: 2018, label: "Fulbright Scholar", text: "A Fulbright grant takes me from Cairo to Worcester, Massachusetts, for an MSc in Robotics Engineering.", photo: "assets/journey/leaving-for-massachusetts.jpg" },
    { from: "worcester", to: "delft", arc: "worcester_delft", year: 2020, label: "PhD at TU Delft", text: "From Massachusetts across the Atlantic to Delft, to start a PhD on friction in medical instruments.", photo: "assets/journey/phd-committee.jpg" }
  ],
  timeline: [
    { when: "2026–", kind: "academic", city: "delft", title: "Postdoctoral Researcher", org: "Bio-Inspired Technology (BITE) group, TU Delft", text: "Bio-inspired, safe-by-design instruments for interventions in biological lumens." },
    { when: "2024–2026", kind: "academic", city: "delft", title: "Postdoctoral Researcher", org: "Robotics and Mechatronics (RaM) group, EEMCS, University of Twente", text: "Mechanically intelligent soft robots for safe interactions in colonoscopy, with Prof. dr. ir. Gijs Krijnen." },
    { when: "2020–2026", kind: "academic", city: "delft", title: "PhD Researcher", org: "Faculty of Mechanical Engineering, TU Delft", text: "Thesis: When Friction Meets Function. Promotors: Dr. ir. M. Wiertlewski, Dr. ir. A. Sakes and Prof. dr. ir. P. Breedveld." },
    { when: "2020", kind: "industry", city: "massachusetts", title: "Intern, Mechanical Design for Robotics and Navigation", org: "Philips Research North America, Cambridge MA", text: "Image Guided Therapy department, March–September 2020. Built functional robotic hardware for a surgical application within three months." },
    { when: "2019", kind: "industry", city: "massachusetts", title: "Research Intern, Mechanical Design", org: "Philips Research North America, Cambridge MA", text: "Ultrasound Imaging and Intervention department, May–September 2019. Mechanical-vibration elastography, leading to a granted U.S. patent." },
    { when: "2018–2020", kind: "education", city: "massachusetts", title: "MSc Robotics Engineering", org: "Worcester Polytechnic Institute", text: "Fulbright Scholar, medical robotics, advised by Dr. Loris Fichera. GPA 4.0/4.0." },
    { when: "2018–2019", kind: "industry", city: "massachusetts", title: "Product Development Engineer Intern", org: "UbiRos, Natick MA", text: "" },
    { when: "2018", kind: "industry", city: "cairo", title: "Research and Innovation Engineer II & III", org: "Advansys ESC, Cairo", text: "Innovation department, March–August 2018. STDF-funded collaboration with Ain Shams University on robotic assistive rehabilitation." },
    { when: "2016–2017", kind: "industry", city: "cairo", title: "Mechanical Engineer I & II", org: "Advansys ESC, Cairo", text: "Mechanical department, September 2016–February 2017." },
    { when: "2015–2016", kind: "industry", city: "cairo", title: "Mechanical Engineer", org: "Technical Office of Hydraulics (TO-Hydraulics), Cairo", text: "Maintenance department." },
    { when: "2009–2014", kind: "education", city: "cairo", title: "BSc Mechanical Design and Production Engineering", org: "Cairo University", text: "GPA 3.3/4.0, ranked 3rd of 37. Advised by Prof. Yasser H. Anis and Prof. Sayed M. Metwalli." }
  ],

  awards: [
    // kind: award | grant · photos and story appear when a visitor opens the award
    { year: 2025, kind: "award", title: "Best Paper and Oral Presentation Award", org: "14th CRAS Conference, Lisbon", url: "https://research.tudelft.nl/en/prizes/best-paper-and-oral-presentation-award-in-medical-robotics/", work: "OSCAR: an ovipositor-inspired capsule robot for colonoscopy, a proof of concept", pub: "J1",
      photos: ["assets/img/pubs/oscar.jpg", "assets/img/pubs/oscar-design.jpg"],
      story: "Awarded for the paper and oral presentation introducing OSCAR, a capsule robot whose twelve sliders anchor and release like the valves of a parasitic wasp's ovipositor." },
    { year: 2024, kind: "award", title: "Maurice Godet Award", org: "49th Leeds-Lyon Symposium on Tribology, Lyon", award_url: "https://research.tudelft.nl/en/prizes/maurice-godet-award-for-best-oral-presentation-and-paper-in-tribo/", work: "Friction modulation of catheters using ultrasonic waves", pub: "J2",
      photos: ["assets/photos/li/godet-2.jpg", "assets/photos/li/godet-1.jpg"], url: "https://www.linkedin.com/feed/update/urn:li:activity:7237575279555084288/",
      story: "The award recognises the best oral presentation and paper in tribology. During the symposium I learned Maurice Godet's line: “If mechanics is the science of motion, tribology is the science that makes it possible.”" },
    { year: 2024, kind: "award", title: "Best Poster Award", org: "Dutch Soft Robotics Symposium, Eindhoven", award_url: "https://research.tudelft.nl/en/prizes/best-poster-award-in-soft-robotics/", work: "Mechanically-inflatable bio-inspired locomotion for robotic pipeline inspection", pub: "C4",
      photos: ["assets/photos/li/dsrs24-1.jpg", "assets/photos/li/dsrs24-2.jpg"], url: "https://www.linkedin.com/feed/update/urn:li:activity:7201984738826272768/",
      story: "Awarded for the wasp-inspired pipeline robot, after a poster session full of discussion with the Dutch soft robotics community." },
    { year: 2024, kind: "award", title: "Best Poster Award", org: "BioMechanical Engineering Department Conference (BMechE), TU Delft", work: "Toward variable-friction catheters using ultrasonic lubrication", pub: "J3", award_url: "https://research.tudelft.nl/en/prizes/best-poster-award-in-biomechanical-engineering/", photos: ["assets/journey/catheter-module.jpg"], story: "Awarded for the poster on catheters whose friction switches between grip and glide under ultrasonic vibration." },
    { year: 2024, kind: "grant", title: "RoboSoft24 Travel Grant for Excellence", org: "IEEE Robotics and Automation Society", work: "Mechanically-inflatable bio-inspired locomotion for robotic pipeline inspection", pub: "C4",
      photos: ["assets/photos/li/robosoft24-2.jpg", "assets/photos/li/robosoft24-1.jpg", "assets/photos/li/robosoft24-3.jpg"], url: "https://www.linkedin.com/feed/update/urn:li:activity:7173393138596712448/",
      story: "Travel support to present the pipeline robot at IEEE RoboSoft 2024 in San Diego, where a wasp-inspired motion sequence induces the friction anisotropy that drives locomotion." },
    { year: 2018, kind: "grant", title: "Fulbright Foreign Student Program Grant", org: "U.S. Department of State and Fulbright Commission in Egypt; full MSc scholarship, top 1% of applicants in Egypt",
      photos: ["assets/photos/li/fulbright20-1.jpg"], url: "https://www.linkedin.com/feed/update/urn:li:activity:6642170251003908096/",
      story: "The Fulbright grant funded my MSc in Robotics Engineering at Worcester Polytechnic Institute, and opened the path to Philips Research and TU Delft." },
    { year: 2018, kind: "grant", title: "Graduate scholarship for academic excellence, 2018–2020", org: "Worcester Polytechnic Institute" },
    { year: 2018, kind: "award", title: "Certificate of Appreciation for Outstanding Performance", org: "Advansys ESC" },
    { year: 2016, kind: "grant", title: "Research support grant", org: "Science and Technology Development Fund (STDF), Egypt; Advansys ESC and Ain Shams University, robotic assistive rehabilitation" },
    { year: 2016, kind: "grant", title: "MSc graduate scholarship for academic excellence", org: "Faculty of Engineering, Cairo University" },
    { year: 2014, kind: "award", title: "Distinguished Undergraduate Student Award", org: "Cairo University and Engineering Company for Industrial Services" }
  ],

  talks: [
    // kind: Invited | Oral | Poster ; award shown with a star
    { year: 2026, kind: "Invited", title: "The Body Thinks Too: Physical Intelligence for Medical Robotics in the Age of AI", venue: "ORSI Innotech Surgical AI & Telesurgery Days 2026, Ghent" },
    { year: 2026, kind: "Invited", title: "Safe and Functional by Design: Engineering Robots for Intelligent Physical Interaction", venue: "Robotics (RBT) Colloquium, TU Eindhoven" },
    { year: 2026, kind: "Oral", title: "Designing ‘With’ Friction: A New Paradigm Toward Programmable Physical Interaction", venue: "Embodied Intelligence Conference (online)" },
    { year: 2026, kind: "Oral", title: "Grip as Needed, Glide on Demand: Ultrasonic Lubrication for Robotic Locomotion", venue: "ICRA 2026, Vienna" },
    { year: 2025, kind: "Oral", title: "OSCAR: an Ovipositor-Inspired Capsule Robot for Colonoscopy: A Proof of Concept", venue: "CRAS, Lisbon", award: "Best Paper and Oral Presentation Award" },
    { year: 2025, kind: "Oral", title: "Active Lubrication of Endoluminal Instruments Using Ultrasonic Waves", venue: "Dutch Biomedical Engineering Conference, Egmond aan Zee" },
    { year: 2025, kind: "Poster", title: "Unconventional Robotic Locomotion: The Ultrasonic Lubrication Way", venue: "The Unconventional Robotics Symposium, TU Delft" },
    { year: 2025, kind: "Poster", title: "Electroadhesive Stabilization of Soft Robotic Catheters", venue: "IEEE RoboSoft, Lausanne" },
    { year: 2024, kind: "Oral", title: "Friction modulation of catheters using ultrasonic waves", venue: "49th Leeds-Lyon Symposium on Tribology", award: "Maurice Godet Award" },
    { year: 2024, kind: "Oral", title: "Ultrasonically-lubricated catheters: miniaturization and ex-vivo tissue validation", venue: "Hamlyn Symposium on Medical Robotics" },
    { year: 2024, kind: "Oral", title: "Active Lubrication of Endoluminal Instruments Using Ultrasonic Waves", venue: "Health Tech Open Day, TU Delft" },
    { year: 2024, kind: "Poster", title: "Toward Variable-Friction Catheters Using Ultrasonic Lubrication", venue: "BioMechanical Engineering Department Conference (BMechE)", award: "Best Poster Award" },
    { year: 2024, kind: "Poster", title: "Mechanically-Inflatable Bio-Inspired Locomotion for Robotic Pipeline Inspection", venue: "Dutch Soft Robotics Symposium (DSRS)", award: "Best Poster Award" },
    { year: 2024, kind: "Poster", title: "Mechanically-Inflatable Bio-Inspired Locomotion for Robotic Pipeline Inspection", venue: "IEEE RoboSoft, San Diego" },
    { year: 2023, kind: "Oral", title: "Ultrasonically-Lubricated Catheters: A Proof-of-Concept", venue: "Hamlyn Symposium on Medical Robotics, London" },
    { year: 2023, kind: "Oral", title: "On the Squeeze Film Levitation Phenomenon in Incompressible Liquid Environments", venue: "APS March Meeting" },
    { year: 2022, kind: "Poster", title: "Near-Field Acoustic Levitation in Liquid Environment", venue: "IEEE International Ultrasonics Symposium (IUS), Venice" }
  ],

  teaching: [
    { year: "Spring 2025", title: "Lecturer, AI-Image Guided Robotics", sub: "Graduate course, two lectures" },
    { year: "Fall 2023", title: "Teaching assistant, Bio-Inspired Design", sub: "Graduate course, instructor P. Breedveld" },
    { year: "Fall 2023", title: "Grader, Fundamentals of Biomedical Engineering", sub: "Instructor A. Sakes" },
    { year: "Spring 2021", title: "Teaching assistant, Control in Human-Robot Interaction", sub: "Graduate course, instructor M. Wiertlewski" }
  ],

  /* ---------------- MISSION ---------------- */
  mission: {
    statement: "Every junior researcher deserves to <em>see</em> the opportunities early, and the chance to <em>own</em> real research.",
    story: "A Fulbright grant took me from Cairo University to Worcester Polytechnic Institute, and from there to Philips Research and TU Delft. Each step depended on someone making an opportunity visible before I knew to look for it. I try to do the same for students and early-career researchers.",
    pillars: [
      { title: "Make opportunities visible", text: "Fellowships, travel grants and workshops reach the students who hear about them. Sharing them early and openly widens who applies." },
      { title: "Give students ownership", text: "MSc students I supervise work on open research questions, present at conferences and co-author the resulting papers." },
      { title: "Build platforms", text: "Workshops at ICRA, RoboSoft and the Hamlyn Symposium put early-career researchers on the same stage as established groups." }
    ],
    initiatives: [
      { when: "2026", title: "“Approachable! Ask me anything!” badges", text: "At ICRA 2026 in Vienna I made badges for senior researchers who are open to being approached, so first-time attendees and junior researchers know whom they can talk to.", tags: ["Junior researchers", "ICRA"], url: "https://www.linkedin.com/feed/update/urn:li:activity:7467154829153517568/" },
      { when: "2026", title: "Soft ≠ Safe? Rethinking Softness in Medical Robotics", text: "Lead organiser of an ICRA 2026 workshop in Vienna (5 June), with S. Sharma, T. Morimoto, T. Nanayakkara, R. J. Webster III and A. Menciassi: invited clinical, technical and industry talks, and pitches from three medical-robotics startups.", tags: ["Workshop", "ICRA"], url: "https://www.linkedin.com/feed/update/urn:li:activity:7465102661198069760/" },
      { when: "2026", title: "Notes on intercultural PhD supervision", text: "A series of posts from my reading on intercultural supervision: how silence, independence and feedback are read differently across academic cultures.", tags: ["Mentoring", "Writing"], url: "writing.html#perspective" },
      { when: "2024–2026", title: "Hamlyn Symposium workshops", text: "Lead or co-organiser of four workshops on robotic colonoscopy, bio-inspired medical robotics, soft endoluminal systems and equitable surgical device design.", tags: ["Workshop", "HSMR"] },
      { when: "2025", title: "Soft Robotics Mimicking Human Body for Medical Applications", text: "Lead co-organiser of a RoboSoft 2025 workshop in Lausanne.", tags: ["Workshop", "RoboSoft"] },
      { when: "2024", title: "“Make your own soft robot”", text: "Hands-on soft robotics workshop for the public at the RoboCup 2024 Science Festival, Eindhoven.", tags: ["Outreach"] },
      { when: "2022–2023", title: "Dutch Soft Robotics Summer School and World Haptics", text: "Organising committee member for the 2022 summer school and symposium and the 2023 World Haptics conference.", tags: ["Community"] },
      { when: "2020", title: "Fulbright Association, Massachusetts Chapter", text: "Board member supporting incoming international scholars.", tags: ["Mentoring"] },
      { when: "", title: "Your next initiative for junior researchers", text: "Describe another mentoring programme, opportunity newsletter, application clinic or similar initiative, and what it changed for participants.", tags: ["Add yours"], placeholder: true }
    ],
    // Acting on the mission: things done specifically for junior researchers
    juniors: [
      { title: "From Research Idea to Funded Proposal", when: "14 Sep 2026", img: "", url: "",
        text: "A workshop on grant acquisition for (unconventional) early-career researchers, which I organise at The Unconventional Robotics Symposium, TU Delft." },
      { title: "“Approachable! Ask me anything!” badges", when: "ICRA 2026", img: "assets/photos/li/badges-1.jpg", url: "https://www.linkedin.com/feed/update/urn:li:activity:7467154829153517568/",
        text: "Large conferences are intimidating for first-time attendees. I 3D-printed badges for senior researchers who are happy to be approached, so newcomers can see whom they can talk to." },
      { title: "Supervising MSc students as researchers", when: "2022–2025", img: "assets/journey/catheter-module.jpg", url: "teaching.html#orchestra",
        text: "Eight MSc students worked on open questions inside active projects; six of their theses became co-authored papers, abstracts or a patent." },
      { title: "Notes on intercultural PhD supervision", when: "2026", img: "assets/photos/li/silence-1.jpg", url: "perspectives.html",
        text: "A series of posts from my reading on how silence, independence and feedback are read differently across academic cultures, written for students and supervisors." },
      { title: "“Make your own soft robot”", when: "2024", img: "",
        text: "A hands-on workshop where children and families built their own soft robots at the RoboCup 2024 Science Festival in Eindhoven, where I volunteered." },
      { title: "Fulbright Association, Massachusetts Chapter", when: "2020", img: "assets/journey/fulbright-dc.jpg",
        text: "As a board member I supported incoming international scholars settling into academic life in the United States." }
    ],
    // Building the research community: workshops and events organised (service, not mentoring)
    community: [
      { title: "Soft ≠ Safe? Rethinking Softness in Medical Robotics", when: "2026", where: "ICRA, Vienna", role: "Lead organiser", img: "assets/photos/li/softsafe-1.jpg", url: "https://www.linkedin.com/feed/update/urn:li:activity:7465102661198069760/" },
      { title: "Soft Robotic Systems for Diagnostics and Therapy in Minimally Invasive and Endoluminal Interventions", when: "2026", where: "Hamlyn Symposium, London", role: "Co-organiser" },
      { title: "Smart by Structure: Designing Surgical Devices for Equity and Sustainability", when: "2026", where: "Hamlyn Symposium, London", role: "Co-organiser" },
      { title: "From Research to Clinical Practice: Bridging the Gap in Robotic Colonoscopy", when: "2025", where: "Hamlyn Symposium, London", role: "Lead co-organiser", img: "assets/photos/li/hamlyn25-1.jpg", url: "https://www.linkedin.com/feed/update/urn:li:activity:7344712541798903808/" },
      { title: "Soft Robotics Mimicking the Human Body for Medical Applications", when: "2025", where: "RoboSoft, Lausanne", role: "Lead co-organiser", img: "assets/photos/li/robosoft25-1.jpg", url: "https://www.linkedin.com/feed/update/urn:li:activity:7307418294355976193/" },
      { title: "Bio-Inspired Medical Robotics: From Evolution to Revolution in Healthcare", when: "2024", where: "Hamlyn Symposium, London", role: "Lead organiser", img: "assets/photos/li/bioinsp24-1.jpg", url: "https://www.linkedin.com/feed/update/urn:li:activity:7167859584093650944/" },
      { title: "World Haptics Symposium", when: "2023", where: "Delft", role: "Organising committee" },
      { title: "Dutch Soft Robotics Summer School and Symposium", when: "2022", where: "Delft", role: "Organising committee" }
    ],
    // Doors that opened for me: grants I received, what they made possible, and where to apply
    doors: [
      { name: "Fulbright Foreign Student Program", year: 2018, enabled: "Funded my MSc in Robotics Engineering at WPI, and with it the move from Cairo to Massachusetts.", url: "https://foreign.fulbrightonline.org/", logo: "fulbright" },
      { name: "IEEE RAS conference travel grants", year: 2024, enabled: "Paid my travel to present at RoboSoft 2024 in San Diego, where the pipeline robot later led to a best-poster award.", url: "https://www.ieee-ras.org/" },
      { name: "WPI graduate scholarship", year: 2018, enabled: "Covered part of my graduate study alongside Fulbright.", url: "https://www.wpi.edu/admissions/graduate", logo: "wpi" },
      { name: "STDF Research Support Grant, Egypt", year: 2016, enabled: "Funded the soft robotic hand exoskeleton I developed with undergraduate students from Ain Shams University.", url: "https://stdf.eg/" }
    ],
    // Supervised students. "paper" lists the publication ids they co-authored.
    supervision: [
      { name: "Joan Castelló Belenguer", year: 2025, thesis: "Active Sealing using Squeeze Film Levitation", co: "R. van Ostayen", paper: [] },
      { name: "Jack Cummings", year: 2024, thesis: "Ultrasonically-augmented inchworm locomotion", co: "A. Sakes", paper: ["C2"] },
      { name: "Tim de Visser", year: 2024, thesis: "Stabilization of endoscopes using electroadhesion", co: "Y. Vardar", paper: ["A1"] },
      { name: "Daan van Bemmel", year: 2024, thesis: "Efficient Locomotion for Sliding Robots", co: "P. Breedveld", paper: ["C2"] },
      { name: "Jelte Nieuwenhuis", year: 2023, thesis: "Ultrasonic friction modulating rings for endoscopes", co: "A. Sakes", paper: ["J2", "C3", "P1"] },
      { name: "Rick Matthijssen", year: 2023, thesis: "Multi-sample cardiac bioptome", co: "A. Sakes", paper: [] },
      { name: "Anand Sekar", year: 2023, thesis: "Design of Intestine Inspection Device", co: "P. Breedveld", paper: ["J1"] },
      { name: "Jeroen Tuijp", year: 2022, thesis: "Friction Modulation for Endoscopes: A Proof of Concept", co: "M. Wiertlewski", paper: ["J3", "C5"] }
    ],
    // Opportunity compass. Always check eligibility on the official page.
    opportunities: [
      { name: "Fulbright Foreign Student Program", stage: ["MSc", "PhD"], kind: "Scholarship", text: "Graduate study in the United States for international students.", url: "https://foreign.fulbrightonline.org/" },
      { name: "Conference travel grants (IEEE RAS)", stage: ["MSc", "PhD"], kind: "Travel", text: "Support for students presenting at RAS-sponsored conferences such as RoboSoft and ICRA.", url: "https://www.ieee-ras.org/" },
      { name: "NWO Rubicon", stage: ["Postdoc"], kind: "Fellowship", text: "Dutch grant for recent PhD graduates to work at a research institute abroad.", url: "https://www.nwo.nl/en/researchprogrammes/rubicon" },
      { name: "MSCA Postdoctoral Fellowships", stage: ["Postdoc"], kind: "Fellowship", text: "EU fellowships for postdoctoral mobility, with options for secondments outside Europe.", url: "https://marie-sklodowska-curie-actions.ec.europa.eu/actions/postdoctoral-fellowships" },
      { name: "Humboldt Research Fellowship", stage: ["Postdoc"], kind: "Fellowship", text: "Research stays at host institutions in Germany.", url: "https://www.humboldt-foundation.de/en/apply/sponsorship-programmes/humboldt-research-fellowship" },
      { name: "NWO Talent Programme (Veni)", stage: ["Postdoc"], kind: "Grant", text: "Personal grant for researchers early after the PhD to develop their own line of research.", url: "https://www.nwo.nl/en/researchprogrammes/nwo-talent-programme" },
      { name: "ERC Starting Grant", stage: ["Postdoc"], kind: "Grant", text: "Funding for early-career researchers to build an independent team in Europe.", url: "https://erc.europa.eu/apply-grant/starting-grant" }
    ]
  },

  // Community leadership (shown first on Journey and Vision & Mission)
  leadership: [
    { role: "Corresponding Founding Co-Chair", body: "IEEE RAS Working Group on Safety in Surgical Robotics", text: "Hosted by the IEEE RAS Technical Committee on Surgical Robotics: an international forum on safety definitions, evidence and evaluation in surgical robotics. Co-chairs: Di Wu, Julie Legrand, Linda Paternò and Tim Horeman." }
  ],
  service: [
    "Corresponding Founding Co-Chair, IEEE RAS Working Group on Safety in Surgical Robotics",
    "Associate Editor, IEEE RAS/EMBS BioRob 2026",
    "Reviewer: IEEE T-RO, T-MRB, RA-L, ICRA, T-MECH, Applied Physics Letters, Physics of Fluids",
    "Volunteer, “Make your own soft robot” workshop, RoboCup 2024 Science Festival, Eindhoven",
    "Organising committee, World Haptics Symposium 2023",
    "Session chair, APS March Meeting 2023",
    "Organising committee, Dutch Soft Robotics Summer School and Symposium 2022",
    "Board member, Fulbright Association Massachusetts Chapter, 2020",
    "Class representative, Mechanical Engineering, Cairo University, 2014"
  ],

  /* ---------------- WRITING ----------------
     type "essay": markdown file in /posts/<slug>.md, rendered on the site.
     type "linkedin": external piece, set url to the LinkedIn article/post.
     type "press": media coverage of your work.                          */
  posts: [
    { slug: "the-art-of-science", type: "essay", date: "2026-11-01", title: "The art of science",
      summary: "Why I closed my PhD defense by calling scientists the maestros of discovery.", placeholder: true },
    { type: "linkedin", cat: "perspective", date: "2026-10-08", urn: "7514060889940094978", url: "https://www.linkedin.com/feed/update/urn:li:activity:7514060889940094978/", title: 'What is the point of “top 2%” lists?', summary: 'Why reducing scientific impact to a ranking misses what makes science valuable.', img: "assets/photos/li/top2-1.jpg" },
    { type: "linkedin", cat: "perspective", date: "2026-05-03", urn: "7456493650366119936", url: "https://www.linkedin.com/feed/update/urn:li:activity:7456493650366119936/", title: 'Silence is not always disengagement', summary: 'Notes on intercultural PhD supervision: reading a quiet student as a cultural norm rather than a lack of interest.', img: "assets/photos/li/silence-1.jpg" },
    { type: "linkedin", cat: "perspective", date: "2026-04-25", urn: "7453610049844699136", url: "https://www.linkedin.com/feed/update/urn:li:activity:7453610049844699136/", title: 'What a “good student” looks like is not shared', summary: 'Notes on intercultural PhD supervision: how expectations of independence differ between students and advisors.', img: "assets/photos/li/independence-1.jpg" },
    { type: "linkedin", cat: "perspective", date: "2026-01-12", urn: "7416506938068340736", url: "https://www.linkedin.com/feed/update/urn:li:activity:7416506938068340736/", title: 'Are soft robots inherently safe?', summary: 'Softness brings real trade-offs; the question is when to use it, when not to, and when hybrid or rigid systems serve patients better.', img: "assets/photos/li/softsafe-q-1.jpg" },
    { type: "linkedin", cat: "perspective", date: "2025-12-20", urn: "7408178259902742528", url: "https://www.linkedin.com/feed/update/urn:li:activity:7408178259902742528/", title: 'LLMs are 3D printers for words', summary: 'A language model fabricates whatever design it is given; the design, and the innovation, still have to come from us.', img: "assets/photos/li/llm-1.jpg" },
    { type: "linkedin", cat: "perspective", date: "2025-11-17", urn: "7396200152119529473", url: "https://www.linkedin.com/feed/update/urn:li:activity:7396200152119529473/", title: 'Criticising ideas is not attacking people', summary: 'Academic institutions exist to test ideas, and that requires room for honest disagreement.', img: "assets/photos/li/debate-1.jpg" },
    { type: "linkedin", cat: "perspective", date: "2025-11-06", urn: "7392337632854253568", url: "https://www.linkedin.com/feed/update/urn:li:activity:7392337632854253568/", title: 'Ideas should rise by their depth, not their postcode', summary: 'On academic elitism and why it makes science narrower.', img: "assets/photos/li/elitism-1.jpg" },
    { type: "linkedin", cat: "perspective", date: "2025-10-21", urn: "7386534434289922048", url: "https://www.linkedin.com/feed/update/urn:li:activity:7386534434289922048/", title: 'Figures first', summary: 'If you cannot explain it in a figure, you may not understand it well enough.', img: "assets/photos/li/figures-1.jpg" },
    { type: "linkedin", cat: "perspective", date: "2025-07-02", urn: "7346295605230551041", url: "https://www.linkedin.com/feed/update/urn:li:activity:7346295605230551041/", title: 'Stories behind every picture', summary: "Why I photograph conferences and colleagues: the stories in people's faces.", img: "assets/photos/li/stories-2.jpg" },
    { type: "linkedin", cat: "perspective", date: "2024-06-08", urn: "7205150855438712832", url: "https://www.linkedin.com/feed/update/urn:li:activity:7205150855438712832/", title: 'Why is everyone on LinkedIn “thrilled”?', summary: 'A light question about the vocabulary of professional announcements.' },
    { type: "linkedin", cat: "perspective", date: "2023-10-03", urn: "7115013270477926400", url: "https://www.linkedin.com/feed/update/urn:li:activity:7115013270477926400/", title: 'What two Nobel laureates said about funding and curiosity', summary: 'Reflections on long-term, curiosity-driven research and how it is funded.' },
    { type: "linkedin", cat: "news", date: "2026-10-27", urn: "7520824637002256384", url: "https://www.linkedin.com/feed/update/urn:li:activity:7520824637002256384/", title: '3D-printed electroadhesive shafts for active anchoring', summary: 'Paper accepted at IEEE SENSORS 2026: non-planar structures with embedded electroadhesion, printed in one step.', img: "assets/photos/li/sensors26-2.jpg", kind: "paper" },
    { type: "linkedin", cat: "news", date: "2026-10-06", urn: "7513136497014009856", url: "https://www.linkedin.com/feed/update/urn:li:activity:7513136497014009856/", title: 'Colloquium talk at TU Eindhoven', summary: 'Invited talk at the TU/e Robotics colloquium on safe- and functional-by-design robots and devices.', img: "assets/photos/li/tue26-1.jpg", kind: "talk" },
    { type: "linkedin", cat: "news", date: "2026-06-01", urn: "7467154829153517568", url: "https://www.linkedin.com/feed/update/urn:li:activity:7467154829153517568/", title: '“Approachable! Ask me anything!” badges at ICRA', summary: 'Badges for senior researchers who welcome questions from first-time attendees and junior researchers.', img: "assets/photos/li/badges-1.jpg", kind: "community" },
    { type: "linkedin", cat: "news", date: "2026-05-29", urn: "7466097103459700737", url: "https://www.linkedin.com/feed/update/urn:li:activity:7466097103459700737/", title: 'At ICRA 2026 in Vienna', summary: 'Oral presentation on ultrasonic friction control for locomotion, a workshop poster and the Soft ≠ Safe workshop.', img: "assets/photos/li/icra26-1.jpg", kind: "talk" },
    { type: "linkedin", cat: "news", date: "2026-05-26", urn: "7465102661198069760", url: "https://www.linkedin.com/feed/update/urn:li:activity:7465102661198069760/", title: 'Soft ≠ Safe? workshop programme', summary: 'The ICRA 2026 workshop programme: invited clinical, technical and industry talks, plus three startup pitches.', img: "assets/photos/li/softsafe-1.jpg", kind: "workshop" },
    { type: "linkedin", cat: "news", date: "2025-06-28", urn: "7344712541798903808", url: "https://www.linkedin.com/feed/update/urn:li:activity:7344712541798903808/", title: 'Robotic colonoscopy workshop at the Hamlyn Symposium', summary: 'A full-day workshop on unmet clinical needs in colonoscopy and the translation of robotic solutions.', img: "assets/photos/li/hamlyn25-1.jpg", kind: "workshop" },
    { type: "linkedin", cat: "news", date: "2025-03-17", urn: "7307418294355976193", url: "https://www.linkedin.com/feed/update/urn:li:activity:7307418294355976193/", title: 'RoboSoft 2025 workshop in Lausanne', summary: 'Call for contributions to “Soft Robotics Mimicking the Human Body for Advanced Medical Applications”.', img: "assets/photos/li/robosoft25-1.jpg", kind: "workshop" },
    { type: "linkedin", cat: "news", date: "2024-09-26", urn: "7245069667755524096", url: "https://www.linkedin.com/feed/update/urn:li:activity:7245069667755524096/", title: 'Variable-friction catheters accepted in IEEE T-MRB', summary: 'Micron-level ultrasonic vibration switches a catheter between low and high friction on demand.', img: "https://i.ytimg.com/vi/2bmjkfAqmaQ/hqdefault.jpg", kind: "paper" },
    { type: "linkedin", cat: "news", date: "2024-09-05", urn: "7237575279555084288", url: "https://www.linkedin.com/feed/update/urn:li:activity:7237575279555084288/", title: 'Maurice Godet Award', summary: 'Best oral presentation and paper at the 49th Leeds-Lyon Symposium on Tribology, Lyon.', img: "assets/photos/li/godet-2.jpg", kind: "award" },
    { type: "linkedin", cat: "news", date: "2024-05-30", urn: "7201984738826272768", url: "https://www.linkedin.com/feed/update/urn:li:activity:7201984738826272768/", title: 'Best Poster Award at the Dutch Soft Robotics Symposium', summary: 'For the wasp-inspired, mechanically inflatable pipeline locomotion system.', img: "assets/photos/li/dsrs24-1.jpg", kind: "award" },
    { type: "linkedin", cat: "news", date: "2024-04-21", urn: "7187809284330520576", url: "https://www.linkedin.com/feed/update/urn:li:activity:7187809284330520576/", title: 'RoboSoft 2024 in San Diego', summary: 'Presenting soft robotic in-pipe locomotion to the soft robotics community.', img: "assets/photos/li/robosoft24-2.jpg", kind: "talk" },
    { type: "linkedin", cat: "news", date: "2024-03-12", urn: "7173393138596712448", url: "https://www.linkedin.com/feed/update/urn:li:activity:7173393138596712448/", title: 'RoboSoft travel award for excellence', summary: 'Travel support to present wasp-inspired pipeline locomotion at RoboSoft 2024.', img: "assets/photos/li/robosoft24-1.jpg", kind: "award" },
    { type: "linkedin", cat: "news", date: "2024-02-26", urn: "7167859584093650944", url: "https://www.linkedin.com/feed/update/urn:li:activity:7167859584093650944/", title: 'Bio-inspired medical robotics workshop', summary: 'Half-day workshop at the Hamlyn Symposium 2024, from evolution to revolution in healthcare.', img: "assets/photos/li/bioinsp24-1.jpg", kind: "workshop" },
    { type: "linkedin", cat: "news", date: "2020-10-01", urn: "6717450065151107072", url: "https://www.linkedin.com/feed/update/urn:li:activity:6717450065151107072/", title: 'Second internship at Philips Research North America', summary: 'Functional robotic hardware for a surgical application, built in three months.', img: "assets/photos/li/philips20-1.jpg", kind: "career" },
    { type: "linkedin", cat: "news", date: "2020-03-07", urn: "6642170251003908096", url: "https://www.linkedin.com/feed/update/urn:li:activity:6642170251003908096/", title: 'Fulbright re-entry workshop in Washington DC', summary: 'Meeting Fulbright fellows from the Middle East and North Africa before returning home.', img: "assets/photos/li/fulbright20-1.jpg", kind: "career" },
    { type: "press", date: "2024-11-14", title: "New catheter technology promises safer and more efficient treatment of blood vessels",
      summary: "TU Delft news front-page feature on our variable-friction catheters, which switch between grip and glide with ultrasonic vibration.", url: "https://www.tudelft.nl/en/2024/tu-delft/new-catheter-technology-promises-safer-and-more-efficient-treatment-of-blood-vessels", source: "TU Delft", img: "https://i.ytimg.com/vi/2bmjkfAqmaQ/hqdefault.jpg" },
    { type: "press", date: "2022-06-01", title: "Designing better catheters – with both more and less friction",
      summary: "TU Delft research outreach feature on catheters that use both more and less friction.", url: "https://www.tudelft.nl/me/onderzoek/cohesieprojecten/designing-better-catheters-with-both-more-and-less-friction", source: "TU Delft" }
  ],

  /* ---------------- STUDIO (YouTube) ----------------
     id = the YouTube video ID (the part after watch?v=). Leave empty until ready. */
  series: [
    { name: "PhD defense", group: "talks", text: "The defense of “When Friction Meets Function” at TU Delft, the ceremony, and a short film about the day.",
      videos: [
        { id: "pBPTiyE4l84", title: "When Friction Meets Function: PhD Dissertation Defense, TU Delft", length: "58:29" },
        { id: "VXnhmwvI3oM", title: "The Maestro: PhD Defense Day Short Movie", length: "10:50" },
        { id: "Jq_5KxhyKdg", title: "PhD Defense: Ceremony and Laudatio", length: "9:00" },
        { id: "XcpHcohscoA", title: "The art of science", length: "0:23", short: true }
      ] },
    { name: "Conference and paper talks", group: "talks", text: "Videos accompanying papers, and the robots and experiments behind them.",
      videos: [
        { id: "kEHPD8XW58o", title: "Grip as Needed, Glide on Demand: Ultrasonic Lubrication for Robotic Locomotion (ICRA 2026)", length: "3:01", pub: "C2" },
        { id: "2bmjkfAqmaQ", title: "Ultrasonically-Lubricated Catheters (Hamlyn Symposium 2024)", length: "7:53", pub: "C3" }
      ] },
    { name: "Crafting figures that speak science", group: "courses", text: "A course on designing scientific figures that carry one clear message: layout, colour, typography and the story a figure should tell.",
      videos: [
        { id: "yYFy0NK4XKE", title: "Crafting Figures that Speak Science: Session 1", length: "59:20" }
      ] },
    { name: "Medical robotics", group: "courses", text: "Lectures from the graduate course AI-Image Guided Robotics.",
      videos: [
        { id: "OrSAisNkdGM", title: "Robot Forward & Inverse Kinematics Essentials", length: "39:38" }
      ] }
  ],

  /* ---------------- GALLERY ----------------
     kind: trips | heroes.  Put photos in assets/photos/<album-id>/ and list them.
     A photo is { src: "assets/photos/hsmr-2024/01.jpg", caption: "..." }   */
  // Science heroes: photos with scientists who shaped how you think.
  // Add one object per photo: { src: "assets/photos/heroes/name.jpg", name: "Prof. Full Name", note: "Where and when you met" }
  heroes: [
    { src: "assets/photos/heroes/hero-36.jpg", name: "Prof. Jenny Dankelman, Prof. Just Herder, Prof. Robert J. Webster, Prof. Michaël Wiertlewski and Prof. Paul Breedveld", note: "PhD defense, Delft" },
    { src: "assets/photos/heroes/hero-4.jpg", name: "Prof. Arianna Menciassi", note: "My IEEE RAS mentor · ICRA 2026, Vienna" },
    { src: "assets/photos/heroes/hero-5.jpg", name: "Prof. Arianna Menciassi", note: "RoboSoft 2025, Lausanne" },
    { src: "assets/photos/heroes/hero-6.jpg", name: "Prof. Leonardo Mattos", note: "CRAS 2025" },
    { src: "assets/photos/heroes/hero-7.jpg", name: "Prof. Oussama Khatib", note: "ICRA 2026, Vienna" },
    { src: "assets/photos/heroes/hero-9.jpg", name: "Prof. Gijs Krijnen", note: "University of Twente" },
    { src: "assets/photos/heroes/hero-11.jpg", name: "URS 2026", note: "" },
    { src: "assets/photos/heroes/hero-12.jpg", name: "Prof. Michaël Wiertlewski", note: "" },
    { src: "assets/photos/heroes/hero-13.jpg", name: "Prof. Robert J. Webster III", note: "PhD defense, Delft" },
    { src: "assets/photos/heroes/hero-14.jpg", name: "Prof. Michaël Wiertlewski and Prof. Robert J. Webster III", note: "PhD defense, Delft" },
    { src: "assets/photos/heroes/hero-15.jpg", name: "Prof. Jenny Dankelman", note: "" },
    { src: "assets/photos/heroes/hero-16.jpg", name: "Prof. Benjamin Gorissen", note: "KU Leuven" },
    { src: "assets/photos/heroes/hero-17.jpg", name: "Prof. Leonardo Mattos and Dr. Julie Legrand", note: "Hamlyn Symposium, London" },
    { src: "assets/photos/heroes/hero-18.jpg", name: "Prof. Robert J. Webster III, Prof. Jenny Dankelman, Prof. Paul Breedveld and Prof. Luigi Manfredi", note: "" },
    { src: "assets/photos/heroes/hero-19.jpg", name: "Prof. Robert J. Webster III", note: "Hamlyn Symposium, London" },
    { src: "assets/photos/heroes/hero-20.jpg", name: "Prof. Oussama Khatib", note: "Lunch with leaders, ICRA 2026, Vienna" },
    { src: "assets/photos/heroes/hero-22.jpg", name: "Prof. Paul Breedveld", note: "" },
    { src: "assets/photos/heroes/hero-23.jpg", name: "Prof. Paul Breedveld, Prof. Robert J. Webster III, Prof. Michaël Wiertlewski and Jess", note: "After the PhD defense, Delft" },
    { src: "assets/photos/heroes/hero-24.jpg", name: "Prof. Jenny Dankelman and Prof. Emmanuel Vander Poorten (KU Leuven)", note: "Hamlyn Symposium, London" },
    { src: "assets/photos/heroes/hero-25.jpg", name: "Prof. Amir Hooshiar (McGill University)", note: "Hamlyn Symposium, London" },
    { src: "assets/photos/heroes/hero-26.jpg", name: "Prof. Robert J. Webster III", note: "Hamlyn Symposium, London" },
    { src: "assets/photos/heroes/hero-27.jpg", name: "Prof. Allison Okamura", note: "RoboSoft 2025, Lausanne" },
    { src: "assets/photos/heroes/hero-28.jpg", name: "Prof. Robert J. Webster III and Prof. Howie Choset", note: "Dinner at the Hamlyn Symposium, London" },
    { src: "assets/photos/heroes/hero-29.jpg", name: "Prof. Robert J. Webster III, Prof. Paul Breedveld, Prof. Luigi Manfredi, Prof. Alberto Arezzo and Dr. Marta Scali", note: "Hamlyn Symposium, London" },
    { src: "assets/photos/heroes/hero-30.jpg", name: "Prof. Howie Choset and Prof. Robert J. Webster III", note: "Hamlyn Symposium, London" },
    { src: "assets/photos/heroes/hero-31.jpg", name: "Prof. Arianna Menciassi", note: "Hamlyn Symposium, London" },
    { src: "assets/photos/heroes/hero-32.jpg", name: "Hamlyn Symposium, London", note: "" },
    { src: "assets/photos/heroes/hero-33.jpg", name: "", note: "" },
    { src: "assets/photos/heroes/hero-34.jpg", name: "", note: "" },
    { src: "assets/photos/heroes/hero-35.jpg", name: "", note: "" },
    { src: "assets/photos/heroes/hero-3.jpg", name: "", note: "" },
    { src: "assets/photos/heroes/hero-2.jpg", name: "ICRA 2026, Vienna", note: "" }
  ],

  albums: [
    { id: "sensors-2026", kind: "trips", title: "IEEE SENSORS 2026", place: "Rotterdam", year: 2026, photos: [
      { src: "assets/photos/li/sensors26-2.jpg", caption: 'Carol Derla presenting our 3D-printed electroadhesion paper' },
      { src: "assets/photos/li/sensors26-3.jpg", caption: 'The SENSORS session' },
      { src: "assets/photos/li/sensors26-4.jpg", caption: 'Q&A after the talk' },
      { src: "assets/photos/li/sensors26-1.jpg", caption: 'Concept: from flat pads to printed non-planar electrodes' }
    ] },
    { id: "tue-2026", kind: "trips", title: "Robotics colloquium, TU/e", place: "Eindhoven", year: 2026, photos: [
      { src: "assets/photos/li/tue26-1.jpg", caption: 'After the colloquium talk' },
      { src: "assets/photos/li/tue26-2.jpg", caption: 'Lab tour' },
      { src: "assets/photos/li/tue26-3.jpg", caption: 'With colleagues at TU/e' },
      { src: "assets/photos/li/tue26-4.jpg", caption: 'Catching up' }
    ] },
    { id: "icra-2026", kind: "trips", title: "ICRA 2026", place: "Vienna", year: 2026, photos: [
      { src: "assets/photos/li/badges-1.jpg", caption: '“Approachable! Ask me anything!” badges for first-time attendees' },
      { src: "assets/photos/li/icra26-2.jpg", caption: '3D-printed badges' },
      { src: "assets/photos/li/icra26-1.jpg", caption: 'Oral presentation: Grip as Needed, Glide on Demand' },
      { src: "assets/photos/li/softsafe-1.jpg", caption: 'Soft ≠ Safe? workshop programme' }
    ] },
    { id: "hamlyn-2025", kind: "trips", title: "Hamlyn Symposium 2025", place: "London", year: 2025, photos: [
      { src: "assets/photos/li/hamlyn25-1.jpg", caption: 'Robotic colonoscopy workshop: speakers and organisers' },
      { src: "assets/photos/li/hamlyn25-2.jpg", caption: 'The Hamlyn Symposium 2025' },
      { src: "assets/photos/li/hamlyn25-3.jpg", caption: 'A full room' },
      { src: "assets/photos/li/hamlyn25-t1-1.jpg", caption: 'Workshop talk' },
      { src: "assets/photos/li/hamlyn25-t2-1.jpg", caption: 'Workshop talk' },
      { src: "assets/photos/li/hamlyn25-t3-1.jpg", caption: 'Workshop talk' },
      { src: "assets/photos/li/hamlyn25-t4-1.jpg", caption: 'Workshop talk' },
      { src: "assets/photos/li/hamlyn25-t5-1.jpg", caption: 'Workshop talk' },
      { src: "assets/photos/li/hamlyn25-t6-1.jpg", caption: 'Workshop talk' }
    ] },
    { id: "gem-2025", kind: "trips", title: "Grand Egyptian Museum", place: "Cairo", year: 2025, photos: [
      { src: "assets/photos/li/gem-2.jpg", caption: 'At the opening of the Grand Egyptian Museum' },
      { src: "assets/photos/li/gem-1.jpg", caption: 'The grand hall' }
    ] },
    { id: "leeds-lyon-2024", kind: "trips", title: "Leeds-Lyon Symposium on Tribology", place: "Lyon", year: 2024, photos: [
      { src: "assets/photos/li/godet-2.jpg", caption: 'Receiving the Maurice Godet Award' },
      { src: "assets/photos/li/godet-1.jpg", caption: 'The award session' }
    ] },
    { id: "dsrs-2024", kind: "trips", title: "Dutch Soft Robotics Symposium", place: "Eindhoven", year: 2024, photos: [
      { src: "assets/photos/li/dsrs24-1.jpg", caption: 'Best Poster Award' },
      { src: "assets/photos/li/dsrs24-2.jpg", caption: 'Award ceremony' }
    ] },
    { id: "robosoft-2024", kind: "trips", title: "IEEE RoboSoft 2024", place: "San Diego", year: 2024, photos: [
      { src: "assets/photos/li/robosoft24-2.jpg", caption: 'At the poster' },
      { src: "assets/photos/li/robosoft24-3.jpg", caption: 'Discussing soft in-pipe locomotion' },
      { src: "assets/photos/li/robosoft24-1.jpg", caption: 'The conference hall' }
    ] },
    { id: "fulbright-2020", kind: "trips", title: "Fulbright re-entry workshop", place: "Washington DC", year: 2020, photos: [
      { src: "assets/photos/li/fulbright20-1.jpg", caption: 'Fulbright scholars from the Middle East and North Africa' }
    ] },
    { id: "wpi-2019", kind: "trips", title: "WPI robotics lab", place: "Worcester, MA", year: 2019, photos: [
      { src: "assets/photos/li/wpi-lab-1.jpg", caption: 'The lab at Worcester Polytechnic Institute' }
    ] },
    { id: "colleagues", kind: "trips", title: "Moments with colleagues", place: "Conferences and labs", year: 2025, photos: [
      { src: "assets/photos/li/stories-2.jpg", caption: "A collection of moments with colleagues at conferences" }
    ] }
  ]
};
