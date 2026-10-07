/*
 * Single source of truth for Gmac Group's core public content.
 * Every figure and claim here comes from the 2026 Company Profile.
 * Edit this file to change wording across the whole site.
 */

export const SITE = {
  name: "Gmac Group",
  legalName: "Gmac Advisory and Consulting Ltd",
  tagline: "Connecting talent to opportunity.",
  positioning:
    "Gmac Group is a research and advisory firm that builds human capital, produces decision ready evidence, and connects investors to investable projects across Africa.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://gmac-group.com",
  email: "info@gmac-group.com",
  phones: ["+233 20 215 4828", "+234 814 498 8398"],
  social: {
    linkedin: "https://www.linkedin.com/company/gmac-group/",
    instagram: "https://www.instagram.com/gmac_group",
    x: "https://twitter.com/gmacgroup",
    facebook: "https://www.facebook.com/profile.php?id=61589840175874",
  },
};

export const FIGURES = [
  { value: 2000, display: "2,000+", label: "Registrations across our training sessions and impact webinars" },
  { value: 30, display: "30+", label: "Countries represented among our participants" },
];

/** Team figures are calculated from the live team list (founder included), so they never go stale. */
export function teamFigures(team: { country: string }[]) {
  const people = team.length + 1;
  const countries = new Set([...team.map((m) => m.country), "Ghana"]).size;
  return [
    { value: countries, display: String(countries), label: "Countries our team works from" },
    { value: people, display: String(people), label: "Colleagues across five specialist teams" },
  ];
}

export const FOCUS_MARKETS = [
  "Ghana",
  "Nigeria",
  "Tanzania",
  "Botswana",
  "Rwanda",
  "Malawi",
  "Zambia",
  "Togo",
  "Côte d’Ivoire",
  "Cameroon",
];

export type PracticeArea = {
  slug: string;
  number: string;
  title: string;
  short: string;
  promise: string;
  whatItIs: string;
  whoFor: string;
  deliverables: string[];
  band: string;
  deliveredBy: string;
  note: string;
  image?: string;
};

export const PRACTICE_AREAS: PracticeArea[] = [
  {
    slug: "applied-research-and-policy-consulting",
    number: "01",
    title: "Applied Research and Policy Consulting",
    short: "Baseline studies, evaluations, labour market assessments, sector diagnostics, policy briefs and feasibility work.",
    promise: "Decision ready evidence, produced inside the markets it describes.",
    whatItIs:
      "Commissioned research for institutions that have to defend a decision. We take a brief from question design through fieldwork to a written report your committee can read, and we document the methodology in full so it can be repeated. Where the evidence does not exist yet, we collect it.",
    whoFor:
      "Development agencies and multilateral country offices, NGOs and foundations, and government ministries and their agencies.",
    deliverables: [
      "Question design and research protocol",
      "Instrument design, sampling and fieldwork across West Africa",
      "Quantitative analysis, econometric modelling and forecasting",
      "Qualitative interviews and stakeholder consultation",
      "Baseline studies, evaluations, sector diagnostics and feasibility work",
      "Written report, policy brief and a presentation to your team",
      "Documented methodology and data handover on request",
    ],
    band: "Standard to premium, priced to scope",
    deliveredBy: "Research, with Operations and Programmes on fieldwork",
    note: "Doctoral researchers with quantitative and policy expertise, based in the region, at a fraction of the cost of a London or Washington practice.",
    image: "/images/service-policy-research.jpg",
  },
  {
    slug: "institutional-capacity-building",
    number: "02",
    title: "Institutional Capacity Building",
    short: "Research methods training for institutional teams, monitoring and evaluation systems, and programme design.",
    promise: "The training capability behind our own programmes, built for your institution to own.",
    whatItIs:
      "We build the systems an institution needs to train its own people and measure whether it worked. That covers programme design, training for the staff who will run it, research and analysis capability for internal teams, and the monitoring and evaluation apparatus behind reporting. Engagements usually run in phases with review points between them.",
    whoFor:
      "Ministries and public agencies, corporate learning and development teams, universities strengthening internal research capability, and NGOs training their own staff.",
    deliverables: [
      "Programme and training design",
      "Facilitator and trainer development",
      "Research methods training for institutional teams",
      "Monitoring and evaluation system design",
      "Assessment frameworks, rubrics and materials",
      "Phased delivery with review points and handover",
    ],
    band: "Standard, often multi phase",
    deliveredBy: "Research, with Operations and Programmes",
    note: "The specialists who run our own programmes design the systems your team will run without us.",
    image: "/images/service-capacity-building.jpg",
  },
  {
    slug: "human-capital-and-workforce-consulting",
    number: "03",
    title: "Human Capital and Workforce Consulting",
    short: "Graduate recruitment programmes, internship pipelines, talent assessment, employability audits and market entry talent strategy.",
    promise: "Workforce decisions made with a real view of the talent market.",
    whatItIs:
      "Advisory and delivery for employers building teams in African markets. We design graduate intake programmes and internship pipelines, assess talent, audit how employable a cohort actually is, and set talent strategy for a market entry. Because we also serve the candidates, our view of supply is first hand rather than inferred.",
    whoFor:
      "Banks, telecoms, consumer goods companies, extractives, fast growing startups, and HR consultancies that need a local delivery partner.",
    deliverables: [
      "Graduate recruitment programme design and delivery",
      "Internship pipeline design and host matching",
      "Talent assessment and selection instruments",
      "Employability audits of an incoming cohort",
      "Inclusive hiring practice and pipeline diversification",
      "Market entry talent strategy and salary context",
    ],
    band: "Entry to standard, with retainer options",
    deliveredBy: "Research, and Operations and Programmes",
    note: "We run the individual side of this market, which is why we can see talent supply, quality signals, and what actually converts.",
    image: "/images/service-workforce-consulting.jpg",
  },
  {
    slug: "employability-programmes",
    number: "04",
    title: "Employability Programmes",
    short: "Structured programmes and coaching that move individuals from application to offer, and from offer to progression.",
    promise: "Structured routes from application to offer, and from offer to progression.",
    whatItIs:
      "Coached programmes that take a candidate through the whole search: positioning, applications, interviews and the offer conversation. Individuals buy them directly. Universities and employers buy them as provision for their graduates or staff, delivered as cohorts on a set calendar.",
    whoFor:
      "Recent graduates, young professionals, mid career switchers, and institutions buying employability provision at cohort scale.",
    deliverables: [
      "CV rewrite to applicant tracking standards",
      "LinkedIn and professional profile overhaul",
      "Search strategy and application coaching",
      "Interview preparation, mock interviews and feedback",
      "Offer and negotiation coaching",
      "Internship placement support with vetted hosts",
      "Cohort delivery and certification for partner institutions",
    ],
    band: "Entry for individuals, standard for institutional cohorts",
    deliveredBy: "Operations and Programmes, with Marketing and Communications",
    note: "Our employability series is the front door for most individuals who later work with us, and their outcomes tell us what to teach next.",
    image: "/images/service-employability.jpg",
  },
  {
    slug: "signature-events-and-workshops",
    number: "05",
    title: "Signature Events and Workshops",
    short: "Flagship convenings, recurring series and specialist workshops, open to sponsorship and institutional partnership.",
    promise: "Convenings that put the right room together, then keep it.",
    whatItIs:
      "A calendar of flagship convenings, recurring series and specialist workshops, delivered live and virtually. For individuals they are standalone experiences with a takeaway they can use immediately. For institutions they are sponsorship properties, recruitment access, and a platform for visible thought leadership.",
    whoFor:
      "Sponsors and corporate partners with graduate hiring, brand or social investment agendas. Universities and employers commissioning sessions. Individuals attending directly.",
    deliverables: [
      "Flagship annual convenings with tiered sponsorship",
      "Recurring series on employability, research and positioning",
      "Specialist workshops, single session or short course",
      "Programme design, curation and speaker recruitment",
      "Branded deliverables, delegate access and reporting for sponsors",
      "Speaking bureau: keynotes, workshops and executive briefings",
    ],
    band: "Tiered by event, entry to premium",
    deliveredBy: "Business Development and Partnerships, with Marketing and Communications and Operations and Programmes",
    note: "Our training sessions and impact webinars have drawn more than 2,000 registrations from over thirty countries.",
    image: "/images/service-signature-events.jpg",
  },
  {
    slug: "investment-facilitation",
    number: "06",
    title: "Investment Facilitation and Capital Mobilisation",
    short: "Connecting investors to African startups and investable projects across ten focus markets.",
    promise: "Africapitalism in practice: African capital, African projects, African returns.",
    whatItIs:
      "We connect investors to African startups and investable projects, and we mobilise the funds behind them. That means sourcing and vetting opportunities, preparing founders and sponsors so their proposition survives diligence, and convening the room where capital and opportunity meet. The deal flow we present is screened, not forwarded. We do not manage, hold or invest client funds.",
    whoFor:
      "Investment funds, angel networks, family offices, development finance institutions, diaspora investors, and the founders seeking capital.",
    deliverables: [
      "Deal sourcing and screening across our focus markets",
      "Investment readiness support for founders and project sponsors",
      "Business plans, financial models and data rooms",
      "Sector, market and regulatory due diligence",
      "Investor matching and structured introductions",
      "Capital mobilisation for infrastructure, agribusiness and energy projects",
      "Curated pitch convenings, investor briefings and post investment reporting",
    ],
    band: "Standard to premium, with success based elements",
    deliveredBy: "Business Development and Partnerships, with Research",
    note: "Capital rarely fails to find Africa for lack of interest. It fails for lack of prepared, screened, investable propositions.",
    image: "/images/service-investment-capital.jpg",
  },
];

export const AUDIENCES = {
  institutions: [
    { who: "Development agencies", need: "Baseline studies, evaluations and labour market evidence for programme design and reporting." },
    { who: "Private companies", need: "Workforce strategy, graduate intake pipelines, employability audits and market context." },
    { who: "Investors", need: "Screened deal flow, sector sizing, competitive mapping and regulatory context for investment theses." },
    { who: "Government ministries", need: "Policy briefs, feasibility work and capacity building for departments and agencies." },
    { who: "Universities", need: "Research methods training, supervision capability and employability provision for graduates." },
    { who: "NGOs and foundations", need: "Monitoring and evaluation systems, staff training and evidence for funder reporting." },
  ],
  individuals: [
    { who: "Graduates entering work", need: "Employability programmes, internship placement support and interview preparation." },
    { who: "Young professionals", need: "Career coaching, personal branding, LinkedIn strategy and structured job search support." },
    { who: "Researchers and analysts", need: "Research methods training, certification cohorts, mentorship and tools for productive analysis." },
    { who: "Senior leaders", need: "Founder led advisory on visibility, authority and thought leadership positioning." },
    { who: "Founders seeking capital", need: "Investment readiness support, pitch preparation and access to curated investor rooms." },
  ],
};

export const PRINCIPLES = [
  { title: "Evidence before advice", body: "We would rather establish a baseline than assert a conclusion. Where the data does not exist, we go and collect it." },
  { title: "Specialists, not generalists", body: "Every engagement is staffed from the team that owns the capability. Nobody is asked to work outside their discipline." },
  { title: "Scope written down", body: "Deliverables, milestones and pricing bands are stated before work begins." },
  { title: "Africa based, and it shows", body: "Local context is not a section in our reports. It is why the fieldwork is faster and the findings hold up." },
  { title: "Warm to work with", body: "Rigour on the page does not require coldness in the room. Clients and participants get the same courtesy." },
  { title: "Built to be handed over", body: "Methodology is documented and transferable, so your team can run the second study without us." },
];

export const ENGAGEMENT_EXAMPLES = [
  {
    sector: "Development finance",
    title: "Labour market baseline for a skills programme",
    practice: "Applied Research and Policy Consulting",
    question: "A donor funded skills programme needs a defensible baseline on employment outcomes before it scales.",
    approach: "We design the survey instruments, run fieldwork with local enumerators, and model outcomes against a comparison group.",
    receive: "A full report, a short brief for the steering committee, and a set of indicators for annual reporting.",
  },
  {
    sector: "Employers",
    title: "Graduate intake redesign",
    practice: "Human Capital and Workforce Consulting",
    question: "A graduate scheme attracts strong applicant volume but converts poorly and loses people in the first year.",
    approach: "We audit the recruitment funnel, rebuild the assessment stage around role relevant tasks, and train the selection panel.",
    receive: "A redesigned intake process, assessment instruments, and a ninety day onboarding module.",
  },
  {
    sector: "Higher education",
    title: "Research methods capability for a university department",
    practice: "Institutional Capacity Building",
    question: "A faculty wants to raise postgraduate supervision quality and research output within one academic year.",
    approach: "We run a methods training programme for staff and supervisors and rebuild the proposal review process.",
    receive: "A documented curriculum the department can run itself, with optional annual review.",
  },
  {
    sector: "Investment",
    title: "Sector screening for an investor",
    practice: "Investment Facilitation and Capital Mobilisation",
    question: "An investor needs sizing, competitive mapping and regulatory context for a sector in two African markets.",
    approach: "We combine desk research with operator interviews and build a sizing model with documented assumptions.",
    receive: "A sector study, the model, a shortlist of screened opportunities, and a presentation to the investment committee.",
  },
];

export const ENGAGEMENT_MODELS = [
  { title: "Project engagements", body: "A single defined piece of work with a fixed scope, timeline and fee. Most first engagements start here." },
  { title: "Framework agreements", body: "A standing agreement with agreed rates and terms, against which work is called off as it arises." },
  { title: "Capacity building partnerships", body: "A phased programme that transfers capability to your team: design, training, systems and review." },
  { title: "Sponsorship and event partnership", body: "Tiered packages across our flagship convenings and series, with delegate access and post event reporting." },
  { title: "Advisory retainers", body: "Continuing access to our research and human capital specialists on a monthly basis." },
];

export type EventItem = {
  tier: "Flagship" | "Series" | "Workshop";
  title: string;
  summary: string;
  cadence: string;
  format?: string;
  audience: string;
  cta?: { label: string; href: string };
};

export const EVENTS: EventItem[] = [
  {
    tier: "Flagship",
    title: "Leadership 2050 Conference",
    summary: "A multi day hybrid convening on leadership, policy and the future of Africa. Our anchor sponsorship property, and the largest room we convene each year.",
    cadence: "Annual",
    format: "Multi day, hybrid",
    audience: "Leaders, policymakers, corporates and delegates across Africa",
    cta: { label: "Request the sponsorship prospectus", href: "/contact?topic=sponsorship" },
  },
  {
    tier: "Flagship",
    title: "Business and Entrepreneurship Masterclass",
    summary: "Our premium executive event, built for a curated audience of founders, senior professionals and investors.",
    cadence: "Annual",
    format: "Single day masterclass",
    audience: "Founders, senior professionals, investors",
    cta: { label: "Enquire about partner packages", href: "/contact?topic=sponsorship" },
  },
  {
    tier: "Flagship",
    title: "Gmac Quarterly Investment Pitch Series",
    summary: "A quarterly convening where vetted founders pitch to a curated room of investors. Applications open eight to ten weeks before each event.",
    cadence: "Quarterly",
    format: "Curated pitch room, in person and streamed",
    audience: "Investors, funds, vetted founders",
    cta: { label: "Join the investor room", href: "/contact?topic=investment" },
  },
  {
    tier: "Series",
    title: "Employability Series",
    summary: "Career Awareness Conference, Personal Branding Conference, and the Job Market Workshop Series.",
    cadence: "Rolling through the year",
    audience: "Graduates, early and mid career professionals",
  },
  {
    tier: "Series",
    title: "Research and Analysis Series",
    summary: "The three day Research Methods and Certification Workshop, the Research Methods Training programme, AI for Research and Productivity, and Exploring Africa’s Emerging and Frontier Markets.",
    cadence: "Workshops plus cohort intakes",
    audience: "Researchers, analysts, investors, institutional teams",
  },
  {
    tier: "Series",
    title: "Personal Brand and Professional Positioning Series",
    summary: "A monthly advisory series led by the founder, for professionals building visibility and authority in their field.",
    cadence: "Monthly",
    audience: "Senior professionals, founders and experts",
  },
  { tier: "Workshop", title: "Professional LinkedIn Masterclass", summary: "", cadence: "Scheduled", audience: "Professionals" },
  { tier: "Workshop", title: "AI Adoption and Challenge Workshop", summary: "", cadence: "Scheduled", audience: "Professionals and teams" },
  { tier: "Workshop", title: "Public Speaking Masterclass", summary: "", cadence: "Scheduled", audience: "Professionals" },
  { tier: "Workshop", title: "Networking and Business Ads Bootcamp", summary: "", cadence: "Scheduled", audience: "Founders and professionals" },
  {
    tier: "Workshop",
    title: "Young Professionals Network",
    summary: "A mentorship programme in partnership with Tarragon Edge.",
    cadence: "Cohort",
    audience: "Young professionals",
  },
];

export const PARTNERS = [
  { name: "Tarragon Edge", role: "Partner on the Young Professionals Network mentorship programme." },
  { name: "LevelUp Africa", role: "Partner on professional development and audience programming." },
];

export const FOUNDER = {
  name: "Raphael Sochima Ajana",
  country: "Ghana",
  role: "Founder",
  quote: "Build the people and build the evidence at the same time, from inside the continent they concern.",
  bio: [
    "Raphael is an economist trained at the University of Ghana, with research and advisory experience across labour markets, development policy, and capital mobilisation for African markets. He founded Gmac Group to bring rigorous evidence and practical capability building into the same firm.",
    "He leads Gmac Group’s executive advisory work and the monthly Personal Brand and Professional Positioning Series, and chairs the firm’s flagship convenings. The Business Development and Partnerships team reports to him directly.",
  ],
  photo: "/images/people/raphael-sochima-ajana.jpg" as string | null,
};

export const TEAMS = [
  { number: "01", name: "Business Development and Partnerships", remit: "Institutional relationships, partner development, sponsorship and framework agreements." },
  { number: "02", name: "Research", remit: "Applied research, econometric analysis and consulting delivery, led by doctoral researchers with quantitative and policy expertise." },
  { number: "03", name: "Marketing and Communications", remit: "Brand, content, campaigns and communications for every programme and event." },
  { number: "04", name: "Graphic Design and Web", remit: "Visual identity, web, print, sales collateral, and event and sponsor deliverables." },
  { number: "05", name: "Operations and Programmes", remit: "Delivery operations, participant experience, logistics and programme quality." },
];

export const STORY = {
  opening:
    "Gmac Group began with a gap that was visible from both sides of the same room. Graduates were leaving university with credentials but without a route into work. Institutions were making decisions about those same graduates, and about the markets they were entering, on evidence that was thin, imported, or several years out of date.",
  growth:
    "The firm started where the need was loudest: training, coaching and convening. Workshops became series. Series became cohorts. Cohorts became a community of young professionals who kept coming back, and who told us plainly what the labour market was doing to them.",
  research:
    "Alongside that work, a research practice took shape, led by doctoral researchers who wanted to produce evidence about their own markets rather than interpret someone else's. That capability now serves institutions directly: baseline studies, labour market assessments, sector diagnostics and feasibility work.",
  vision:
    "The vision behind Gmac Group is simple. Build the people and build the evidence at the same time, from inside the continent they concern, and hold both to a standard that travels.",
  remote: "Gmac Group works remotely by design. The team assembles around a brief rather than a building.",
  stages: ["Workshops", "Series", "Cohorts", "Community", "Research practice"],
};

export const WHY_GMAC = [
  { title: "Africa based, with genuine local context", body: "We live in the markets we study. Fieldwork starts sooner, respondents answer, and the findings account for how things actually work on the ground." },
  { title: "Doctoral depth, applied to real decisions", body: "Our research practice is led by doctoral researchers with quantitative and policy expertise. Methodology is documented, defensible and handed over." },
  { title: "Competitive against Washington and London", body: "Comparable rigour at a materially lower cost base, so more of your budget goes into fieldwork and analysis rather than overhead." },
  { title: "Reach across the continent", body: "A remote team working from ten countries, with programme participants from more than thirty." },
  { title: "Dual sided market insight", body: "We serve talent and employers in the same week. That vantage point makes our advice on either side sharper." },
  { title: "Clear scope from the start", body: "Defined practice areas, deliverables and bands. Procurement teams can evaluate us without a discovery process first." },
  { title: "Five specialist teams, one standard", body: "Work is staffed from the teams that own the capability, and the founder stays close to institutional relationships throughout." },
  { title: "An audience we can convene", body: "Our events reach graduates, professionals and leaders across the region, a distribution channel for partners as well as a platform for us." },
];

export const SECTORS = [
  "Development finance and donor programmes",
  "Financial services",
  "Telecommunications",
  "Higher education",
  "Government and public agencies",
  "Investment funds and family offices",
  "NGOs and foundations",
];
