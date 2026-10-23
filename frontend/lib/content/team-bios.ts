import type { TeamMember } from "@/lib/content/team-seed";
import { FOUNDER } from "@/lib/content/site";

export function getTeamMemberSlug(name: string): string {
  return name
    .replace(/,?\s*Esq\.?$/i, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export type TeamOverview = {
  paragraphs: string[];
  initiatives: string[];
  expertise: string[];
  education: string;
};

export const MEMBER_OVERVIEWS: Record<string, TeamOverview> = {
  "raphael-sochima-ajana": {
    paragraphs: [
      "Raphael is the Founder of Gmac Group, leading the firm's strategic direction, sovereign advisory practice, and executive convening agenda across the continent. He leads Gmac Group's executive advisory work and the monthly Personal Brand and Professional Positioning Series, and chairs the firm's flagship annual convenings.",
      "An economist trained at the University of Ghana, Raphael has extensive research and advisory experience spanning African labour markets, developmental policy, and institutional capital mobilisation. He established Gmac Group to bridge the structural divide between high-calibre academic evidence and practical workforce transition.",
      "Under his leadership, the firm operates as a distributed advisory network, bringing together quantitative researchers, programme managers, and strategic communicators from over ten African markets to deliver verifiable impact for institutions and individuals alike."
    ],
    initiatives: [
      "Leadership 2050 Summit",
      "Personal Brand & Professional Positioning Series",
      "Executive Advisory Practice",
      "African Labour Market Evidence Diagnostics"
    ],
    expertise: ["Labour Economics", "Policy Design", "Capital Mobilisation", "Executive Advisory"],
    education: "B.A. in Economics, University of Ghana; Advanced studies in Developmental Economics and Labour Market Dynamics.",
  },
  "richard-klutse": {
    paragraphs: [
      "Richard is the Head of Programs & Business Development at Gmac Group, based in Accra, Ghana. He leads the firm's institutional client relationships, partner development frameworks, corporate sponsorships, and cross-border programmatic engagements.",
      "He actively coordinates delivery for flagship initiatives including the Young Professionals Network mentorship programme in partnership with Tarragon Edge, and drives framework agreements with development funders, corporate employers, and academic institutions.",
      "Richard brings extensive background in programme design, monitoring and evaluation, and high-level stakeholder management. He holds a degree from Kwame Nkrumah University of Science and Technology (KNUST) with specialized training in project management and organizational strategy."
    ],
    initiatives: [
      "Young Professionals Network (YPN)",
      "Institutional Framework Agreements",
      "Corporate Sponsorship & Partnerships Series",
      "Executive Cohort Mobilisation"
    ],
    expertise: ["Programme Strategy", "Institutional Partnerships", "Client Scoping", "Monitoring & Evaluation"],
    education: "B.Sc. in Development Planning, KNUST; Professional Certifications in Project Management.",
  },
  "atigsimah-richard-akamboe": {
    paragraphs: [
      "Atigsimah is a Business Development Specialist at Gmac Group, operating from Ghana. He focuses on institutional market research, partner intelligence, proposal architecture, and multi-market partnership development.",
      "He works closely with the leadership team to scope public sector inquiries, coordinate stakeholder roundtables, and map talent development pipelines across West and East Africa.",
      "Atigsimah holds a Bachelor's degree in Economics and Political Science from the University of Ghana, with a dedicated focus on regional trade integration and human capital development."
    ],
    initiatives: [
      "Institutional Inquiry Pipeline",
      "Regional Market Intelligence Briefs",
      "Partner Discovery Frameworks"
    ],
    expertise: ["Market Research", "Institutional Outreach", "Proposal Development"],
    education: "B.A. in Economics and Political Science, University of Ghana.",
  },
  "ismail-saani": {
    paragraphs: [
      "Ismail is a Research Consultant and Interim Team Lead for the Research practice at Gmac Group, based in Ghana. He leads econometric investigations, baseline studies, and policy diagnostics on labour market absorptive capacity and youth employment.",
      "He designs rigorous quantitative survey instruments, sampling methodologies, and econometric models that evaluate the real economic returns to technical skills and higher education credentials across Africa.",
      "Ismail completed advanced graduate studies in Economics at the University of Ghana, with peer-reviewed research experience in microeconometric analysis and applied development policy."
    ],
    initiatives: [
      "Applied Labour Market Diagnostics",
      "National Skills Baseline Surveys",
      "Quantitative Fieldwork Protocols"
    ],
    expertise: ["Econometrics", "Survey Design", "Quantitative Modeling", "Policy Diagnostics"],
    education: "M.Phil. in Economics, University of Ghana; B.A. in Economics with Mathematics.",
  },
  "benjamin-asiedu": {
    paragraphs: [
      "Benjamin is a Research Consultant at Gmac Group, based in Ghana. He specializes in quantitative data synthesis, econometric validation, and statistical analysis for public sector and multilateral research commissions.",
      "He manages field enumerator teams, oversees data quality assurance protocols, and conducts advanced multivariate regressions to assess institutional programme outcomes.",
      "Benjamin holds a Master's degree in Development Economics from the University of Cape Coast, with a background in field experimental methods."
    ],
    initiatives: [
      "Field Enumeration Quality Systems",
      "Multivariate Labour Market Models",
      "Econometric Evaluations"
    ],
    expertise: ["Statistical Computing", "Econometric Analysis", "Data Verification"],
    education: "M.Sc. in Development Economics, University of Cape Coast; B.A. in Economics.",
  },
  "evans-essene-dzidzienyo": {
    paragraphs: [
      "Evans is a Research Consultant at Gmac Group, working from Ghana. He brings expertise in labour economics, survey sampling design, and empirical policy assessment.",
      "He contributes to the design of rigorous research protocols, qualitative stakeholder interview frameworks, and cross-country comparative studies on industrial human capital requirements.",
      "Evans holds an M.Phil. in Economics from the University of Ghana, with published contributions on youth employability and industrial policy."
    ],
    initiatives: [
      "Industrial Workforce Diagnostics",
      "Qualitative Synthesis Protocols",
      "Labour Demand Assessments"
    ],
    expertise: ["Labour Economics", "Survey Methodology", "Policy Evaluation"],
    education: "M.Phil. in Economics, University of Ghana; B.A. in Economics.",
  },
  "oluwatosin-temitope-ogungbade": {
    paragraphs: [
      "Oluwatosin is a Research Consultant at Gmac Group, based in Nigeria. She directs Nigeria-focused sector diagnostics, policy briefs, and market intelligence for institutional clients and international development agencies.",
      "She has led key applied studies examining graduate transitions in the West African financial and technology sectors, translating complex econometric findings into actionable policy roadmaps.",
      "Oluwatosin holds an M.Sc. in Economics from the University of Lagos and a Bachelor's degree in Economics from Obafemi Awolowo University."
    ],
    initiatives: [
      "Nigeria Labour Market Briefs",
      "Sectoral Capability Diagnostics",
      "Graduate Transition Studies"
    ],
    expertise: ["Microeconomics", "Policy Brief Synthesis", "Labour Studies"],
    education: "M.Sc. in Economics, University of Lagos; B.Sc. in Economics, Obafemi Awolowo University.",
  },
  "atta-gyasi-domson": {
    paragraphs: [
      "Atta is a Research Consultant at Gmac Group, based in the United States. He coordinates comparative international development studies, macroeconomic benchmarking, and diaspora talent mobilisation frameworks.",
      "His work bridges global developmental research standards with on-the-ground African market evidence, helping institutional funders measure long-term intervention durability.",
      "Atta holds a Master's degree in Applied Economics and Public Policy from Georgetown University and an undergraduate degree in Economics from the University of Ghana."
    ],
    initiatives: [
      "Diaspora Capital & Knowledge Flows",
      "Comparative Market Benchmarking",
      "Multilateral Policy Synthesis"
    ],
    expertise: ["Applied Macroeconomics", "International Development", "Policy Synthesis"],
    education: "M.S. in Applied Economics, Georgetown University; B.A. in Economics, University of Ghana.",
  },
  "maureen-mushwimba": {
    paragraphs: [
      "Maureen is a Digital Marketing & Communications Strategist and Team Lead at Gmac Group, based in Lusaka, Zambia. She leads brand narrative, regional dissemination, digital channels, and media partnerships across Southern and East Africa.",
      "She oversees the editorial calendar, publication releases, and digital cohort recruitment campaigns, ensuring Gmac Group's research reaches policymakers, corporate executives, and emerging leaders.",
      "Maureen holds a Bachelor's degree in Media and Communications from the University of Zambia, with advanced certifications in strategic digital communications and brand management."
    ],
    initiatives: [
      "Regional Digital Outreach",
      "Research Dissemination Campaigns",
      "Brand Narrative & Media Partnerships"
    ],
    expertise: ["Strategic Communications", "Digital Campaign Architecture", "Media Relations"],
    education: "B.A. in Mass Communication, University of Zambia.",
  },
  "jude-van-tagoe": {
    paragraphs: [
      "Jude is a Digital Marketing & Communications Strategist at Gmac Group, based in Accra, Ghana. He focuses on content strategy, thought leadership dissemination, and engagement across executive and student audiences.",
      "He leads promotional campaigns for the Personal Brand and Professional Positioning Series and coordinates multi-channel messaging for annual flagship summits.",
      "Jude holds a Bachelor's degree in Communication Studies from the Ghana Institute of Journalism (GIJ)."
    ],
    initiatives: [
      "Summit Promotion & Media",
      "Professional Positioning Series Campaigns",
      "Editorial Newsletter Curation"
    ],
    expertise: ["Content Strategy", "Digital Growth", "Audience Engagement"],
    education: "B.A. in Communication Studies, Ghana Institute of Journalism.",
  },
  "yolanda-chibaya": {
    paragraphs: [
      "Yolanda is a Graphic & Web Designer and Team Lead at Gmac Group, operating from Harare, Zimbabwe. She leads visual identity, publication typography, user experience, and interactive asset design across all firm touchpoints.",
      "She oversees the editorial presentation of research reports, executive decks, and the firm's web platform, ensuring every publication reflects institutional precision.",
      "Yolanda holds a degree in Creative Brand Communications from the Vega School of Brand Leadership."
    ],
    initiatives: [
      "Brand Identity & Visual Standards",
      "Report Editorial Design System",
      "Web UX & Interface Architecture"
    ],
    expertise: ["Visual Identity", "Editorial Design", "UI/UX", "Brand Systems"],
    education: "B.A. in Creative Brand Communications, Vega School.",
  },
  "silas-bivamwijuru": {
    paragraphs: [
      "Silas is a Graphic & Web Designer at Gmac Group, based in Kigali, Rwanda. He specializes in web development, interactive data visualization, and digital publication infrastructure.",
      "He designs data-driven graphics and interactive dashboards that translate complex econometric tables into intuitive visual stories for executive readers.",
      "Silas holds a degree in Computer Science and Interactive Design from the University of Rwanda."
    ],
    initiatives: [
      "Data Visualization Engine",
      "Interactive Research Briefs",
      "Digital Platform Architecture"
    ],
    expertise: ["Web Development", "Data Visualization", "Interface Design"],
    education: "B.Sc. in Computer Science, University of Rwanda.",
  },
  "ramadhani-athumani-mbiaji": {
    paragraphs: [
      "Ramadhani is an Operations & Program Manager and Team Lead at Gmac Group, operating from Dar es Salaam, Tanzania. He oversees cohort delivery, participant logistics, mentor scheduling, and quality standards for all training cohorts across East Africa.",
      "He manages calendar execution, institutional service level agreements, and participant monitoring for university and corporate employability cohorts.",
      "Ramadhani holds a Bachelor's degree in Public Administration from Mzumbe University in Tanzania, with deep experience in organizational operations and logistics."
    ],
    initiatives: [
      "East Africa Cohort Operations",
      "Participant Tracking Frameworks",
      "Mentor Network Logistics"
    ],
    expertise: ["Operations Management", "Programme Execution", "Participant Logistics"],
    education: "B.A. in Public Administration, Mzumbe University.",
  },
  "apollo-samantha-dorcas": {
    paragraphs: [
      "Samantha is an Operations & Program Manager at Gmac Group, based in Lagos, Nigeria. A legal practitioner by training, she combines operational management with governance, compliance, and institutional contracting.",
      "She oversees programme execution, participant lifecycle management, and institutional cohort delivery across Nigeria, ensuring strict compliance with regulatory standards.",
      "Samantha holds an LL.B from the University of Benin and a B.L from the Nigerian Law School, with specialized expertise in commercial agreements and corporate governance."
    ],
    initiatives: [
      "Nigeria Cohort Delivery",
      "Institutional Compliance & Governance",
      "Participant Onboarding Systems"
    ],
    expertise: ["Legal Governance", "Programme Operations", "Risk & Compliance"],
    education: "B.L., Nigerian Law School; LL.B., University of Benin.",
  },
  "edwin-camichael-ngyfo-teno": {
    paragraphs: [
      "Edwin is an Operations & Program Manager at Gmac Group, based in Yaoundé, Cameroon. He leads operational coordination for Francophone and Central African cohorts and institutional engagements.",
      "He manages bilingual cohort logistics, participant evaluations, and cross-border partnership delivery.",
      "Edwin holds a Master's degree in Project Management from the University of Yaoundé II."
    ],
    initiatives: [
      "Francophone Africa Cohort Operations",
      "Cross-Border Logistics Coordination",
      "Cohort Performance Metrics"
    ],
    expertise: ["Bilingual Programme Management", "Operations", "Monitoring & Evaluation"],
    education: "M.Sc. in Project Management, University of Yaoundé II.",
  },
};

export function getMemberOverview(member: TeamMember): TeamOverview {
  const memberSlug = getTeamMemberSlug(member.name);
  if (MEMBER_OVERVIEWS[memberSlug]) {
    return MEMBER_OVERVIEWS[memberSlug];
  }

  // Authoritative dynamic overview for any team member from DB
  const firstName = member.name.split(" ")[0];
  return {
    paragraphs: [
      `${firstName} is a ${member.position} at Gmac Group, operating from ${member.country}. They work as an integral member of the ${member.team} team, executing client engagements, research deliverables, and capacity programmes across the continent.`,
      `In this capacity, ${firstName} supports cross-functional delivery across Gmac Group's focus markets in Africa, collaborating with regional stakeholders and institutional partners to deliver decision-ready evidence and structured talent routes.`,
      `With specialized expertise in ${member.team.toLowerCase()} and operational delivery, ${firstName} contributes to the firm's remote-by-design model, uniting rigorous methodology with local market insight.`
    ],
    initiatives: [
      `${member.team} Delivery Framework`,
      "Regional Market Fieldwork",
      "Institutional Engagement Support"
    ],
    expertise: [member.team, "Project Coordination", member.country + " Market Insight"],
    education: `Advanced professional and academic training in ${member.country}.`,
  };
}
