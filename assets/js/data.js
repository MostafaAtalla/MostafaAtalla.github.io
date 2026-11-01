/* =====================================================================
   SITE CONTENT — the only file you need to edit to update the website.
   Anything marked  placeholder: true  shows a dashed "Sample" badge on the
   site until you replace it with your own content and delete that flag.
   ===================================================================== */

window.SITE = {

  person: {
    name: "Mostafa A. Atalla",
    shortName: "Mostafa Atalla",
    role: "Postdoctoral Researcher",
    affiliation: "Robotics and Mechatronics (RaM), University of Twente",
    location: "The Hague, The Netherlands",
    email: "mostafa.a.atalla@gmail.com",
    cv: "assets/docs/Atalla_CV.pdf",
    portrait: "", // e.g. "assets/photos/portrait.jpg"
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
    "I design medical instruments that treat friction as a design variable rather than a loss to be minimised. Endoluminal instruments move through biological lumens by contact, so the friction at that contact decides whether an instrument advances, holds position or injures tissue.",
    "My PhD at TU Delft showed that ultrasonic vibration can lower the friction of a catheter on demand through a squeeze film, and that coordinating friction across several contacts is enough to make a capsule robot for colonoscopy propel itself. At the University of Twente I now work on mechanically intelligent soft robots for safe interaction in colonoscopy."
  ],
  now: "Currently: postdoc at the University of Twente, lead organiser of the ICRA 2026 workshop “Soft ≠ Safe? Rethinking Softness in Medical Robotics”, and founder of Mijzan Mechanical.",

  /* ---------------- HOME PAGE STATEMENTS ----------------
     Drafts written from your CV. Rewrite them in your own words.  */
  researchStatement: {
    title: "Friction, engineered to function",
    lead: "Every endoluminal instrument meets the body through contact, and friction governs that contact. Too much, and the instrument buckles, stalls or loads the tissue; too little, and it cannot hold position or transmit force.",
    body: "My research treats friction as a function to be designed rather than a loss to be minimised: modulated in time by ultrasonic vibration, distributed in space across coordinated contacts, and encoded in the mechanics of the structure itself. The aim is instruments that glide, grip and propel through biological lumens on demand.",
    principles: [
      { title: "Physics first", text: "Understand the mechanism before designing the device. Squeeze-film levitation in liquid came before the first lubricated catheter." },
      { title: "Design is the art", text: "Nature and imagination supply the form: an ovipositor, an inchworm, a vibrating asymmetric body." },
      { title: "Intelligence in the structure", text: "Where possible, mechanics rather than software decides how an instrument interacts with tissue." },
      { title: "Validate where it matters", text: "From bench models to ex-vivo tissue, results are reported for the conditions in which they were measured." }
    ]
  },
  teachingStatement: {
    title: "Research is learned by doing it",
    lead: "Students learn research by owning a real question. Each MSc student I supervise works on an open problem inside an active project, designs and builds the experiment, and takes the result to a conference or a paper.",
    practices: [
      { title: "Ownership", text: "An open question, not an exercise: the student's result decides the next step of the project." },
      { title: "Physical intuition", text: "Mechanisms first, explained with prototypes and demonstrations before equations." },
      { title: "Communication", text: "A result is finished when it is clear: figures, talks and writing are trained as research skills." },
      { title: "Open doors", text: "Fellowships, travel grants and workshops are shared early, so students can reach them." }
    ]
  },
  vision: {
    research: "Medical instruments that are safe by construction, whose mechanics decide how they touch the body.",
    community: "A research community where junior researchers see opportunities early and own the work they do."
  },

  /* ---------------- RESEARCH ---------------- */
  themes: [
    {
      verb: "Glide",
      title: "Ultrasonic lubrication",
      text: "Vibrating an instrument surface at ultrasonic frequency squeezes a thin film between instrument and tissue. The film carries part of the load, so friction drops while the vibration is on and returns when it is off.",
      pubs: ["J6", "J3", "J2", "C2", "C4", "P1"]
    },
    {
      verb: "Grip",
      title: "Friction on demand",
      text: "Some tasks need the opposite: an instrument that holds its position against the lumen wall. Electroadhesion and switchable lubrication let one device stabilise where it must and slide where it should.",
      pubs: ["C0", "A2", "C1"]
    },
    {
      verb: "Propel",
      title: "Friction-driven locomotion",
      text: "Alternating high- and low-friction contacts converts reciprocating motion into net displacement. This is the principle behind OSCAR, an ovipositor-inspired capsule robot for colonoscopy, and our pipeline and sliding robots.",
      pubs: ["J1", "C1", "C3", "J5"]
    }
  ],

  /* ---------------- PUBLICATIONS ----------------
     type: journal | conference | abstract | patent
     status: "" | "under review" | "accepted"            */
  publications: [
    { id: "C0", type: "conference", year: 2026, status: "accepted",
      title: "Toward 3D Printable Non-Planar Electroadhesive Structures for Active Anchoring",
      authors: "M. A. Atalla et al.",
      venue: "IEEE SENSORS 2026", url: "https://www.linkedin.com/feed/update/urn:li:activity:7520824637002256384/" },
    { id: "J1", type: "journal", year: 2026, status: "under review",
      title: "OSCAR: An Ovipositor-Inspired Self-Propelling Capsule Robot for Colonoscopy",
      authors: "M. A. Atalla, A. S. Sekar, R. van Starkenburg, D. J. Jager, A. Sakes, M. Wiertlewski, and P. Breedveld",
      venue: "Preprint, arXiv", doi: "10.48550/arXiv.2602.15309" },
    { id: "J2", type: "journal", year: 2025, status: "under review",
      title: "Active Lubrication of Transluminal Medical Instruments",
      authors: "M. A. Atalla, J. Nieuwenhuis, A. Martin, X. Wang, A. Canden, M. J. Carré, R. Lewis, A. Sakes, and M. Wiertlewski",
      venue: "Preprint, arXiv", doi: "10.48550/arXiv.2506.07225" },
    { id: "J3", type: "journal", year: 2024,
      title: "Toward Variable-Friction Catheters Using Ultrasonic Lubrication",
      authors: "M. A. Atalla, J. J. Tuijp, M. Wiertlewski, and A. Sakes",
      venue: "IEEE Transactions on Medical Robotics and Bionics, 6(4), 1375–1381", doi: "10.1109/TMRB.2024.3464672" },
    { id: "J4", type: "journal", year: 2024,
      title: "Advancements in aspiration catheter tip design for thrombectomy: a comprehensive patent review",
      authors: "V. G. Kortman, Y. Verberne, M. A. Atalla, and A. Sakes",
      venue: "Frontiers in Medical Technology, 6, 1388638", doi: "10.3389/fmedt.2024.1388638" },
    { id: "J5", type: "journal", year: 2023,
      title: "Simple and Fast Locomotion of Vibrating Asymmetric Soft Robots",
      authors: "A. Sabbadini, M. A. Atalla, and M. Wiertlewski",
      venue: "Soft Robotics, 10(6), 1199–1208", doi: "10.1089/soro.2022.0209" },
    { id: "J6", type: "journal", year: 2023,
      title: "Incompressible squeeze-film levitation",
      authors: "M. A. Atalla, R. A. J. van Ostayen, A. Sakes, and M. Wiertlewski",
      venue: "Applied Physics Letters, 122(24), 241601", doi: "10.1063/5.0149501" },
    { id: "J7", type: "journal", year: 2021,
      title: "Beyond Constant Curvature: A New Mechanics Model for Unidirectional Notched-Tube Continuum Wrists",
      authors: "N. E. Pacheco, J. B. Gafford, M. A. Atalla, R. J. Webster, and L. Fichera",
      venue: "Journal of Medical Robotics Research, 6(1–2)", doi: "10.1142/S2424905X21400043" },
    { id: "J8", type: "journal", year: 2020,
      title: "A proposed soft pneumatic actuator control based on angle estimation from data-driven model",
      authors: "M. H. Mohamed, S. H. Wagdy, M. A. Atalla, A. R. Youssef, and S. A. Maged",
      venue: "Proc. IMechE Part H: Journal of Engineering in Medicine, 234(6), 612–625", doi: "10.1177/0954411920911277" },

    { id: "C1", type: "conference", year: 2026, status: "accepted",
      title: "Grip as Needed, Glide on Demand: Ultrasonic Lubrication for Robotic Locomotion",
      authors: "M. A. Atalla, D. van Bemmel, J. Cummings, P. Breedveld, M. Wiertlewski, and A. Sakes",
      venue: "IEEE International Conference on Robotics and Automation (ICRA), Vienna", doi: "10.48550/arXiv.2602.15608" },
    { id: "C2", type: "conference", year: 2024,
      title: "Ultrasonically-lubricated catheters: miniaturization and ex-vivo tissue validation",
      authors: "M. A. Atalla, J. Nieuwenhuis, A. Martin, A. Canden, X. Wang, M. J. Carré, R. Lewis, M. Wiertlewski, and A. Sakes",
      venue: "Hamlyn Symposium on Medical Robotics (HSMR)", doi: "10.31256/HSMR2024.10" },
    { id: "C3", type: "conference", year: 2024,
      title: "Mechanically-Inflatable Bio-Inspired Locomotion for Robotic Pipeline Inspection",
      authors: "M. A. Atalla, F. Trauzettel, S. P. van Gelder, P. Breedveld, M. Wiertlewski, and A. Sakes",
      venue: "IEEE 7th International Conference on Soft Robotics (RoboSoft), San Diego, 586–592", doi: "10.1109/RoboSoft60065.2024.10521968" },
    { id: "C4", type: "conference", year: 2023,
      title: "Ultrasonically-Lubricated Catheters: A Proof of Concept",
      authors: "M. A. Atalla, J. J. Tuijp, M. Wiertlewski, and A. Sakes",
      venue: "Hamlyn Symposium on Medical Robotics (HSMR), London", doi: "10.31256/HSMR2023.12" },

    { id: "A1", type: "abstract", year: 2025, award: "Best Paper and Oral Presentation Award",
      title: "OSCAR: An Ovipositor-Inspired Capsule Robot for Colonoscopy – A Proof of Concept",
      authors: "M. A. Atalla, A. Sekar, R. van Starkenburg, D. Jager, A. Sakes, and P. Breedveld",
      venue: "14th Conference on New Technologies for Computer/Robot Assisted Surgery (CRAS), Lisbon" },
    { id: "A2", type: "abstract", year: 2025,
      title: "Electroadhesive Stabilization of Soft Robotic Catheters",
      authors: "M. A. Atalla, T. de Visser, A. Sakes, M. Wiertlewski, and Y. Vardar",
      venue: "IEEE 8th International Conference on Soft Robotics (RoboSoft), Lausanne" },
    { id: "A3", type: "abstract", year: 2024, award: "Maurice-Godet Award",
      title: "Friction modulation of catheters using ultrasonic waves",
      authors: "M. A. Atalla, J. Nieuwenhuis, A. Martin, A. Canden, X. Wang, M. J. Carré, R. Lewis, M. Wiertlewski, and A. Sakes",
      venue: "49th Leeds-Lyon Symposium on Tribology" },
    { id: "A4", type: "abstract", year: 2024, award: "Best Poster Award",
      title: "Mechanically-Inflatable Bio-Inspired Locomotion for Robotic Pipeline Inspection",
      authors: "M. A. Atalla, F. Trauzettel, S. P. van Gelder, P. Breedveld, M. Wiertlewski, and A. Sakes",
      venue: "Dutch Soft Robotics Symposium (DSRS)" },
    { id: "A5", type: "abstract", year: 2023,
      title: "On the Squeeze Film Levitation Phenomenon in Incompressible Liquid Environments",
      authors: "M. A. Atalla, R. A. J. van Ostayen, A. Sakes, and M. Wiertlewski",
      venue: "APS March Meeting" },
    { id: "A6", type: "abstract", year: 2022,
      title: "Near-Field Acoustic Levitation in Liquid Environment",
      authors: "M. A. Atalla, A. Sakes, and M. Wiertlewski",
      venue: "IEEE International Ultrasonics Symposium (IUS), Venice" },

    { id: "P1", type: "patent", year: 2025,
      title: "Medical device for intraluminal intervention",
      authors: "M. A. Atalla, J. Nieuwenhuis, M. Wiertlewski, and A. Sakes",
      venue: "Dutch patent NL2036368B1, granted", url: "https://patents.google.com/patent/NL2036368B1" },
    { id: "P2", type: "patent", year: 2025,
      title: "Mechanical Shear Wave Generation for Ultrasonic Elastography",
      authors: "M. A. Atalla, R. Q. Erkamp, and M. M. Nguyen",
      venue: "U.S. Patent US12364463B2, granted", url: "https://patents.google.com/patent/US12364463B2" }
  ],

  /* ---------------- JOURNEY ----------------
     kind: academic | industry | education ; city must match a station id */
  stations: [
    { id: "cairo", city: "Cairo", years: "2009–2018" },
    { id: "boston", city: "Massachusetts", years: "2018–2020" },
    { id: "delft", city: "Delft", years: "2020–2026" },
    { id: "twente", city: "Enschede", years: "2024–" },
    { id: "hague", city: "The Hague", years: "2025–" }
  ],
  timeline: [
    { when: "2025–", kind: "industry", city: "hague", title: "Founder", org: "Mijzan Mechanical, The Hague", text: "Engineering consultancy and product design for mechatronic solutions." },
    { when: "2024–", kind: "academic", city: "twente", title: "Postdoctoral Researcher", org: "Robotics and Mechatronics, University of Twente", text: "Mechanically intelligent soft robots for safe interaction in colonoscopy, with Prof. dr. ir. Gijs Krijnen." },
    { when: "2020–2026", kind: "academic", city: "delft", title: "PhD Researcher", org: "Faculty of Mechanical Engineering, TU Delft", text: "Thesis: When Friction Meets Function. Promotors: Dr. ir. M. Wiertlewski, Dr. ir. A. Sakes and Prof. dr. ir. P. Breedveld." },
    { when: "2020", kind: "industry", city: "boston", title: "Intern, Mechanical Design for Robotics and Navigation", org: "Philips Research North America, Cambridge MA", text: "Image Guided Therapy department. Built functional robotic hardware for a surgical application within three months." },
    { when: "2019", kind: "industry", city: "boston", title: "Research Intern, Mechanical Design", org: "Philips Research North America, Cambridge MA", text: "Ultrasound Imaging and Intervention department." },
    { when: "2018–2020", kind: "education", city: "boston", title: "MSc Robotics Engineering", org: "Worcester Polytechnic Institute", text: "Fulbright Scholar, medical robotics, advised by Dr. Loris Fichera. GPA 4.0/4.0." },
    { when: "2018–2019", kind: "industry", city: "boston", title: "Product Development Engineer Intern", org: "UbiRos, Natick MA", text: "" },
    { when: "2016–2018", kind: "industry", city: "cairo", title: "Mechanical Engineer → Research & Innovation Engineer", org: "Advansys ESC, Cairo", text: "Mechanical and innovation departments; STDF-funded collaboration with Ain Shams University on robotic assistive rehabilitation." },
    { when: "2015–2016", kind: "industry", city: "cairo", title: "Mechanical Engineer", org: "Technical Office of Hydraulics, Cairo", text: "Maintenance department." },
    { when: "2009–2014", kind: "education", city: "cairo", title: "BSc Mechanical Design and Production Engineering", org: "Cairo University", text: "Ranked 3rd of 37. Advised by Prof. Yasser H. Anis and Prof. Sayed M. Metwalli." }
  ],

  awards: [
    { year: 2025, title: "Best Paper and Oral Presentation Award", org: "14th CRAS Conference, Lisbon" },
    { year: 2025, title: "Runner-Up Best Poster Award", org: "The Unconventional Robotics Symposium, TU Delft" },
    { year: 2024, title: "Maurice-Godet Award, best oral presentation and paper in tribology", org: "49th Leeds-Lyon Symposium on Tribology" },
    { year: 2024, title: "Best Poster Award", org: "BioMechanical Engineering Department Conference" },
    { year: 2024, title: "Best Poster Award", org: "Dutch Soft Robotics Symposium" },
    { year: 2024, title: "RoboSoft24 Travel Grant for Excellence", org: "IEEE Robotics and Automation Society" },
    { year: 2018, title: "Fulbright Foreign Student Program Grant", org: "U.S. Department of State, Fulbright Egypt (top 1% of applicants)" },
    { year: 2018, title: "Graduate scholarship for academic excellence", org: "Worcester Polytechnic Institute" },
    { year: 2018, title: "Certificate of Appreciation for Outstanding Performance", org: "Advansys ESC" },
    { year: 2016, title: "Research support grant", org: "Science and Technology Development Fund (STDF), Egypt" },
    { year: 2016, title: "MSc graduate scholarship for academic excellence", org: "Faculty of Engineering, Cairo University" },
    { year: 2014, title: "Distinguished Undergraduate Student Award", org: "Cairo University" }
  ],

  talks: [
    { year: 2026, kind: "Invited", title: "Engineering safe- and functional-by-design robots and devices", venue: "Robotics colloquium, TU Eindhoven" },
    { year: 2026, kind: "Oral", title: "Grip as Needed, Glide on Demand: Ultrasonic Lubrication for Robotic Locomotion", venue: "ICRA 2026, Vienna" },
    { year: 2026, kind: "Invited", title: "The Body Thinks Too: Physical Intelligence for Medical Robotics in the Age of AI", venue: "ORSI Innotech Surgical AI & Telesurgery Days, Ghent" },
    { year: 2026, kind: "Oral", title: "Designing ‘With’ Friction: A New Paradigm Toward Programmable Physical Interaction", venue: "Embodied Intelligence Conference" },
    { year: 2025, kind: "Oral", title: "OSCAR: an Ovipositor-Inspired Capsule Robot for Colonoscopy", venue: "CRAS, Lisbon" },
    { year: 2025, kind: "Oral", title: "Active Lubrication of Endoluminal Instruments Using Ultrasonic Waves", venue: "Dutch Biomedical Engineering Conference" },
    { year: 2024, kind: "Oral", title: "Friction modulation of catheters using ultrasonic waves", venue: "Leeds-Lyon Symposium on Tribology" },
    { year: 2024, kind: "Oral", title: "Ultrasonically-lubricated catheters: miniaturization and ex-vivo validation", venue: "Hamlyn Symposium on Medical Robotics" },
    { year: 2023, kind: "Oral", title: "On the Squeeze Film Levitation Phenomenon in Incompressible Liquids", venue: "APS March Meeting" }
  ],

  teaching: [
    { year: "2025", title: "Lecturer, AI-Image Guided Robotics", sub: "Graduate course, two lectures" },
    { year: "2023", title: "Teaching assistant, Bio-Inspired Design", sub: "Graduate course, P. Breedveld" },
    { year: "2023", title: "Grader, Fundamentals of Biomedical Engineering", sub: "A. Sakes" },
    { year: "2021", title: "Teaching assistant, Control in Human-Robot Interaction", sub: "Graduate course, M. Wiertlewski" }
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
    // Supervised students. "paper" lists the publication ids they co-authored.
    supervision: [
      { name: "Joan Castelló Belenguer", year: 2025, thesis: "Active Sealing using Squeeze Film Levitation", co: "R. van Ostayen", paper: [] },
      { name: "Jack Cummings", year: 2024, thesis: "Ultrasonically-augmented inchworm locomotion", co: "A. Sakes", paper: ["C1"] },
      { name: "Tim de Visser", year: 2024, thesis: "Stabilization of endoscopes using electroadhesion", co: "Y. Vardar", paper: ["A2"] },
      { name: "Daan van Bemmel", year: 2024, thesis: "Efficient Locomotion for Sliding Robots", co: "P. Breedveld", paper: ["C1"] },
      { name: "Jelte Nieuwenhuis", year: 2023, thesis: "Ultrasonic friction modulating rings for endoscopes", co: "A. Sakes", paper: ["J2", "C2", "A3", "P1"] },
      { name: "Rick Matthijssen", year: 2023, thesis: "Multi-sample cardiac bioptome", co: "A. Sakes", paper: [] },
      { name: "Anand Sekar", year: 2023, thesis: "Design of Intestine Inspection Device", co: "P. Breedveld", paper: ["J1", "A1"] },
      { name: "Jeroen Tuijp", year: 2022, thesis: "Friction Modulation for Endoscopes: A Proof of Concept", co: "M. Wiertlewski", paper: ["J3", "C4"] }
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

  service: [
    "Associate Editor, IEEE BioRob 2026",
    "Reviewer: IEEE T-RO, T-MRB, RA-L, ICRA, T-MECH, Applied Physics Letters, Physics of Fluids",
    "Session chair, APS March Meeting 2023",
    "Class representative, Mechanical Engineering, Cairo University, 2014"
  ],

  /* ---------------- WRITING ----------------
     type "essay": markdown file in /posts/<slug>.md, rendered on the site.
     type "linkedin": external piece, set url to the LinkedIn article/post.
     type "press": media coverage of your work.                          */
  posts: [
    { slug: "the-art-of-science", type: "essay", date: "2026-11-01", title: "The art of science",
      summary: "Why I closed my PhD defense by calling scientists the maestros of discovery.", placeholder: true },
    { type: "linkedin", cat: "perspective", date: "2026-10-08", urn: "7514060889940094978", url: "https://www.linkedin.com/feed/update/urn:li:activity:7514060889940094978/", title: 'What is the point of “top 2%” lists?', summary: 'Why reducing scientific impact to a ranking misses what makes science valuable.' },
    { type: "linkedin", cat: "perspective", date: "2026-05-03", urn: "7456493650366119936", url: "https://www.linkedin.com/feed/update/urn:li:activity:7456493650366119936/", title: 'Silence is not always disengagement', summary: 'Notes on intercultural PhD supervision: reading a quiet student as a cultural norm rather than a lack of interest.' },
    { type: "linkedin", cat: "perspective", date: "2026-04-25", urn: "7453610049844699136", url: "https://www.linkedin.com/feed/update/urn:li:activity:7453610049844699136/", title: 'What a “good student” looks like is not shared', summary: 'Notes on intercultural PhD supervision: how expectations of independence differ between students and advisors.' },
    { type: "linkedin", cat: "perspective", date: "2026-01-12", urn: "7416506938068340736", url: "https://www.linkedin.com/feed/update/urn:li:activity:7416506938068340736/", title: 'Are soft robots inherently safe?', summary: 'Softness brings real trade-offs; the question is when to use it, when not to, and when hybrid or rigid systems serve patients better.' },
    { type: "linkedin", cat: "perspective", date: "2025-12-20", urn: "7408178259902742528", url: "https://www.linkedin.com/feed/update/urn:li:activity:7408178259902742528/", title: 'LLMs are 3D printers for words', summary: 'A language model fabricates whatever design it is given; the design, and the innovation, still have to come from us.' },
    { type: "linkedin", cat: "perspective", date: "2025-11-17", urn: "7396200152119529473", url: "https://www.linkedin.com/feed/update/urn:li:activity:7396200152119529473/", title: 'Criticising ideas is not attacking people', summary: 'Academic institutions exist to test ideas, and that requires room for honest disagreement.' },
    { type: "linkedin", cat: "perspective", date: "2025-11-06", urn: "7392337632854253568", url: "https://www.linkedin.com/feed/update/urn:li:activity:7392337632854253568/", title: 'Ideas should rise by their depth, not their postcode', summary: 'On academic elitism and why it makes science narrower.' },
    { type: "linkedin", cat: "perspective", date: "2025-10-21", urn: "7386534434289922048", url: "https://www.linkedin.com/feed/update/urn:li:activity:7386534434289922048/", title: 'Figures first', summary: 'If you cannot explain it in a figure, you may not understand it well enough.' },
    { type: "linkedin", cat: "perspective", date: "2025-07-02", urn: "7346295605230551041", url: "https://www.linkedin.com/feed/update/urn:li:activity:7346295605230551041/", title: 'Stories behind every picture', summary: "Why I photograph conferences and colleagues: the stories in people's faces." },
    { type: "linkedin", cat: "perspective", date: "2024-06-08", urn: "7205150855438712832", url: "https://www.linkedin.com/feed/update/urn:li:activity:7205150855438712832/", title: 'Why is everyone on LinkedIn “thrilled”?', summary: 'A light question about the vocabulary of professional announcements.' },
    { type: "linkedin", cat: "perspective", date: "2023-10-03", urn: "7115013270477926400", url: "https://www.linkedin.com/feed/update/urn:li:activity:7115013270477926400/", title: 'What two Nobel laureates said about funding and curiosity', summary: 'Reflections on long-term, curiosity-driven research and how it is funded.' },
    { type: "linkedin", cat: "news", date: "2026-10-27", urn: "7520824637002256384", url: "https://www.linkedin.com/feed/update/urn:li:activity:7520824637002256384/", title: '3D-printed electroadhesive shafts for active anchoring', summary: 'Paper accepted at IEEE SENSORS 2026: non-planar structures with embedded electroadhesion, printed in one step.' },
    { type: "linkedin", cat: "news", date: "2026-10-06", urn: "7513136497014009856", url: "https://www.linkedin.com/feed/update/urn:li:activity:7513136497014009856/", title: 'Colloquium talk at TU Eindhoven', summary: 'Invited talk at the TU/e Robotics colloquium on safe- and functional-by-design robots and devices.' },
    { type: "linkedin", cat: "news", date: "2026-06-01", urn: "7467154829153517568", url: "https://www.linkedin.com/feed/update/urn:li:activity:7467154829153517568/", title: '“Approachable! Ask me anything!” badges at ICRA', summary: 'Badges for senior researchers who welcome questions from first-time attendees and junior researchers.' },
    { type: "linkedin", cat: "news", date: "2026-05-29", urn: "7466097103459700737", url: "https://www.linkedin.com/feed/update/urn:li:activity:7466097103459700737/", title: 'At ICRA 2026 in Vienna', summary: 'Oral presentation on ultrasonic friction control for locomotion, a workshop poster and the Soft ≠ Safe workshop.' },
    { type: "linkedin", cat: "news", date: "2026-05-26", urn: "7465102661198069760", url: "https://www.linkedin.com/feed/update/urn:li:activity:7465102661198069760/", title: 'Soft ≠ Safe? workshop programme', summary: 'The ICRA 2026 workshop programme: invited clinical, technical and industry talks, plus three startup pitches.' },
    { type: "linkedin", cat: "news", date: "2025-06-28", urn: "7344712541798903808", url: "https://www.linkedin.com/feed/update/urn:li:activity:7344712541798903808/", title: 'Robotic colonoscopy workshop at the Hamlyn Symposium', summary: 'A full-day workshop on unmet clinical needs in colonoscopy and the translation of robotic solutions.' },
    { type: "linkedin", cat: "news", date: "2025-03-17", urn: "7307418294355976193", url: "https://www.linkedin.com/feed/update/urn:li:activity:7307418294355976193/", title: 'RoboSoft 2025 workshop in Lausanne', summary: 'Call for contributions to “Soft Robotics Mimicking the Human Body for Advanced Medical Applications”.' },
    { type: "linkedin", cat: "news", date: "2024-11-14", urn: "7262872744508145664", url: "https://www.linkedin.com/feed/update/urn:li:activity:7262872744508145664/", title: 'Variable-friction catheters on the TU Delft front page', summary: 'TU Delft news featured our ultrasonically lubricated catheters.' },
    { type: "linkedin", cat: "news", date: "2024-09-26", urn: "7245069667755524096", url: "https://www.linkedin.com/feed/update/urn:li:activity:7245069667755524096/", title: 'Variable-friction catheters accepted in IEEE T-MRB', summary: 'Micron-level ultrasonic vibration switches a catheter between low and high friction on demand.' },
    { type: "linkedin", cat: "news", date: "2024-09-05", urn: "7237575279555084288", url: "https://www.linkedin.com/feed/update/urn:li:activity:7237575279555084288/", title: 'Maurice Godet Award', summary: 'Best oral presentation and paper at the 49th Leeds-Lyon Symposium on Tribology, Lyon.' },
    { type: "linkedin", cat: "news", date: "2024-05-30", urn: "7201984738826272768", url: "https://www.linkedin.com/feed/update/urn:li:activity:7201984738826272768/", title: 'Best Poster Award at the Dutch Soft Robotics Symposium', summary: 'For the wasp-inspired, mechanically inflatable pipeline locomotion system.' },
    { type: "linkedin", cat: "news", date: "2024-04-21", urn: "7187809284330520576", url: "https://www.linkedin.com/feed/update/urn:li:activity:7187809284330520576/", title: 'RoboSoft 2024 in San Diego', summary: 'Presenting soft robotic in-pipe locomotion to the soft robotics community.' },
    { type: "linkedin", cat: "news", date: "2024-03-12", urn: "7173393138596712448", url: "https://www.linkedin.com/feed/update/urn:li:activity:7173393138596712448/", title: 'RoboSoft travel award for excellence', summary: 'Travel support to present wasp-inspired pipeline locomotion at RoboSoft 2024.' },
    { type: "linkedin", cat: "news", date: "2024-02-26", urn: "7167859584093650944", url: "https://www.linkedin.com/feed/update/urn:li:activity:7167859584093650944/", title: 'Bio-inspired medical robotics workshop', summary: 'Half-day workshop at the Hamlyn Symposium 2024, from evolution to revolution in healthcare.' },
    { type: "linkedin", cat: "news", date: "2020-10-01", urn: "6717450065151107072", url: "https://www.linkedin.com/feed/update/urn:li:activity:6717450065151107072/", title: 'Second internship at Philips Research North America', summary: 'Functional robotic hardware for a surgical application, built in three months.' },
    { type: "linkedin", cat: "news", date: "2020-03-07", urn: "6642170251003908096", url: "https://www.linkedin.com/feed/update/urn:li:activity:6642170251003908096/", title: 'Fulbright re-entry workshop in Washington DC', summary: 'Meeting Fulbright fellows from the Middle East and North Africa before returning home.' },
    { type: "press", date: "2024-11-14", title: "New catheter technology promises safer and more efficient treatment of blood vessels",
      summary: "TU Delft news feature on ultrasonically lubricated catheters.", url: "https://edu.nl/bpyxr", source: "TU Delft" },
    { type: "press", date: "2022-06-01", title: "Designing better catheters – with both more and less friction",
      summary: "TU Delft research outreach feature.", url: "", source: "TU Delft" }
  ],

  /* ---------------- STUDIO (YouTube) ----------------
     id = the YouTube video ID (the part after watch?v=). Leave empty until ready. */
  series: [
    { name: "PhD defense", text: "The defense of “When Friction Meets Function” at TU Delft, the ceremony, and a short film about the day.",
      videos: [
        { id: "pBPTiyE4l84", title: "When Friction Meets Function: PhD Dissertation Defense, TU Delft", length: "58:29" },
        { id: "VXnhmwvI3oM", title: "The Maestro: PhD Defense Day Short Movie", length: "10:50" },
        { id: "Jq_5KxhyKdg", title: "PhD Defense: Ceremony and Laudatio", length: "9:00" },
        { id: "XcpHcohscoA", title: "The art of science", length: "0:23", short: true }
      ] },
    { name: "Figures that speak science", text: "Sessions on designing scientific figures that carry one clear message: layout, colour, typography and the story a figure should tell.",
      videos: [
        { id: "yYFy0NK4XKE", title: "Crafting Figures that Speak Science: Session 1", length: "59:20" }
      ] },
    { name: "Lectures", text: "Teaching material from the medical robotics course.",
      videos: [
        { id: "OrSAisNkdGM", title: "Robot Forward & Inverse Kinematics Essentials: Medical Robotics Course", length: "39:38" }
      ] },
    { name: "Research in motion", text: "Conference videos of the robots and experiments behind the papers.",
      videos: [
        { id: "kEHPD8XW58o", title: "Grip as Needed, Glide on Demand: Ultrasonic Lubrication for Robotic Locomotion (ICRA 2026)", length: "3:01" },
        { id: "2bmjkfAqmaQ", title: "Ultrasonically-Lubricated Catheters (Hamlyn Symposium 2024)", length: "7:53" },
        { id: "8atIPbxrQCs", title: "Ultrasonic skiing", length: "Short", short: true }
      ] },
    { name: "Earlier engineering", text: "Earlier engineering projects.",
      videos: [
        { id: "HJShMnPIl8s", title: "PD Controller in Joint Space vs Task Space for a 2R Robot Manipulator", length: "0:16" },
        { id: "gcPTal6Eqeo", title: "SSP fertilizer granulation machine", length: "Short", short: true }
      ] }
  ],

  /* ---------------- GALLERY ----------------
     kind: trips | heroes.  Put photos in assets/photos/<album-id>/ and list them.
     A photo is { src: "assets/photos/hsmr-2024/01.jpg", caption: "..." }   */
  albums: [
    { id: "icra-2026", kind: "trips", title: "ICRA 2026", place: "Vienna", year: 2026, photos: [] },
    { id: "orsi-2026", kind: "trips", title: "ORSI Surgical AI Days", place: "Ghent", year: 2026, photos: [] },
    { id: "cras-2025", kind: "trips", title: "CRAS 2025", place: "Lisbon", year: 2025, photos: [] },
    { id: "robosoft-2025", kind: "trips", title: "RoboSoft 2025", place: "Lausanne", year: 2025, photos: [] },
    { id: "robosoft-2024", kind: "trips", title: "RoboSoft 2024", place: "San Diego", year: 2024, photos: [] },
    { id: "hsmr-2025", kind: "trips", title: "Hamlyn Symposium 2025", place: "London", year: 2025, photos: [] },
    { id: "hsmr-2024", kind: "trips", title: "Hamlyn Symposium 2024", place: "London", year: 2024, photos: [] },
    { id: "tue-2026", kind: "trips", title: "Robotics colloquium, TU/e", place: "Eindhoven", year: 2026, photos: [] },
    { id: "leeds-lyon-2024", kind: "trips", title: "Leeds-Lyon Symposium", place: "Lyon", year: 2024, photos: [] },
    { id: "ius-2022", kind: "trips", title: "IEEE Ultrasonics Symposium", place: "Venice", year: 2022, photos: [] },
    { id: "heroes", kind: "heroes", title: "Science heroes", place: "Photos with the scientists who shaped how I think", year: "", photos: [
      { src: "", caption: "Name of the scientist, where you met", placeholder: true },
      { src: "", caption: "Name of the scientist, where you met", placeholder: true },
      { src: "", caption: "Name of the scientist, where you met", placeholder: true },
      { src: "", caption: "Name of the scientist, where you met", placeholder: true }
    ] }
  ]
};
