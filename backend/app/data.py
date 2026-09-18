"""Small in-memory content store used until the database layer is configured."""

from datetime import datetime, timezone
from uuid import uuid4

SERVICES = [
    {
        "id": "service-education",
        "slug": "education-employability",
        "title": "Education and Employability",
        "summary": "Practical pathways from learning to meaningful, sustainable work.",
        "description": "We help learners and institutions build the skills, confidence, and industry connections needed for sustainable careers.",
        "category": "education",
    },
    {
        "id": "service-research",
        "slug": "research-and-training",
        "title": "Research and Researcher Training",
        "summary": "Evidence, insight, and research capacity for better decisions.",
        "description": "Our research and training programmes support rigorous inquiry, econometric modeling, and translate findings into practical impact.",
        "category": "research",
    },
    {
        "id": "service-advisory",
        "slug": "consulting-and-advisory",
        "title": "Consulting and Advisory",
        "summary": "Human-capital advice designed around real organisational needs.",
        "description": "We partner with enterprises, universities, and governments on workforce development, talent architecture, and institutional capacity.",
        "category": "consulting",
    },
]

PROGRAMMES = [
    {
        "id": "programme-career-readiness",
        "title": "Career Readiness Lab",
        "category": "student",
        "description": "A practical cohort-based programme for building career direction, critical thinking, professional confidence, and employability skills.",
        "start_date": "2026-10-15T00:00:00Z",
        "end_date": "2026-12-15T00:00:00Z",
    },
    {
        "id": "programme-research-skills",
        "title": "Applied Research & Analytical Methods",
        "category": "training",
        "description": "Intensive training in study design, quantitative & econometric analysis, qualitative synthesis, and evidence-to-policy communication.",
        "start_date": "2026-11-01T00:00:00Z",
        "end_date": "2027-01-30T00:00:00Z",
    },
    {
        "id": "programme-exec-leadership",
        "title": "Executive Talent & Strategic HR Lab",
        "category": "professional_development",
        "description": "Advanced human-capital architecture for leaders scaling teams, optimizing workforce productivity, and driving institutional excellence.",
        "start_date": "2026-10-20T00:00:00Z",
        "end_date": "2026-11-20T00:00:00Z",
    },
    {
        "id": "programme-institutional-capacity",
        "title": "Higher Education Capacity & Employability Framework",
        "category": "institutional",
        "description": "Diagnostic and reform advisory for university faculties and academic leadership seeking to align curriculum with labor market realities.",
        "start_date": "2026-12-01T00:00:00Z",
        "end_date": "2027-03-01T00:00:00Z",
    },
]

OPPORTUNITIES = [
    {
        "id": "opportunity-research-fellowship",
        "title": "Research & Policy Impact Fellowship",
        "type": "fellowship",
        "organization": "GMAC Applied Research Center",
        "location": "Accra / Hybrid",
        "description": "Join an elite cohort conducting baseline workforce transition studies and institutional capacity diagnostics across West Africa.",
        "deadline": "2026-10-31T00:00:00Z",
    },
    {
        "id": "opportunity-strategy-associate",
        "title": "Human Capital Strategy Associate",
        "type": "employment",
        "organization": "GMAC Consulting Practice",
        "location": "Accra / Global Remote",
        "description": "Partner with cross-functional advisory teams supporting enterprise talent acquisition, workforce planning, and executive development.",
        "deadline": "2026-11-15T00:00:00Z",
    },
    {
        "id": "opportunity-analytics-internship",
        "title": "Graduate Analytics & Econometrics Internship",
        "type": "internship",
        "organization": "GMAC Applied Labs",
        "location": "Accra / Hybrid",
        "description": "High-velocity internship for emerging quantitative analysts and social science graduates assisting on flagship policy evaluation projects.",
        "deadline": "2026-10-25T00:00:00Z",
    },
]

RESEARCH_PROJECTS = [
    {
        "id": "project-future-work",
        "title": "The Future of Work and Graduate Transitions in Sub-Saharan Africa",
        "summary": "Multi-country empirical assessment investigating labor market entry barriers, curriculum-to-competence mismatches, and technological adoption among 10,000+ graduates.",
        "status": "ongoing",
        "lead_researcher": "Dr. Kwesi Mensah & GMAC Research Faculty",
    },
    {
        "id": "project-institutional-readiness",
        "title": "Institutional Readiness & Human Capital Diagnostics Index",
        "summary": "A comprehensive evaluative framework assessing agility, talent retention efficacy, and cross-sector training ROI across public and private tertiary institutions.",
        "status": "published",
        "lead_researcher": "Policy & Human Capital Advisory Unit",
    },
    {
        "id": "project-stem-transitions",
        "title": "STEM Graduate Pathways & Emerging Digital Labor Markets",
        "summary": "Investigating how emerging software, data analytics, and engineering graduates navigate regional tech hubs and global remote employment ecosystems.",
        "status": "fieldwork",
        "lead_researcher": "Kwabena Asante & Innovation Lab Fellows",
    },
]

PUBLICATIONS = [
    {
        "id": "pub-graduate-transition-gap",
        "title": "Bridging the Graduate Transition Gap: Empirical Findings from Ghana and West Africa",
        "authors": ["Dr. Kwesi Mensah", "Ama Serwaa", "Marcus Chen"],
    },
    {
        "id": "pub-workforce-readiness-index",
        "title": "Workforce Readiness Index: A Diagnostic Framework for Higher Education Institutions",
        "authors": ["GMAC Research Unit", "Dr. Kwesi Mensah"],
    },
    {
        "id": "pub-talent-architecture-emerging-markets",
        "title": "Strategic Talent Architecture: Navigating Skill Polarization in High-Growth African Sectors",
        "authors": ["Kwame Asante", "Ama Serwaa"],
    },
    {
        "id": "pub-evidence-policy-brief",
        "title": "Policy Brief: Aligning Tertiary Education Syllabi with 21st-Century Industry Demands",
        "authors": ["GMAC Policy Working Group"],
    },
]

EXPERTS = [
    {
        "id": "expert-kwesi-mensah",
        "full_name": "Dr. Kwesi Mensah",
        "expertise_areas": ["Labor Economics", "Higher Education Policy", "Institutional Diagnostics"],
    },
    {
        "id": "expert-ama-serwaa",
        "full_name": "Ama Serwaa",
        "expertise_areas": ["Policy Analysis", "Applied Econometrics", "Workforce Transitions"],
    },
    {
        "id": "expert-marcus-chen",
        "full_name": "Marcus Chen",
        "expertise_areas": ["Talent Architecture", "Executive Advisory", "Organizational Agility"],
    },
]

CONTACT_REQUESTS = []
ENROLMENTS = []
APPLICATIONS = []
NEWSLETTER_SUBSCRIBERS = []
PUBLICATION_REQUESTS = []
EXPERT_APPLICATIONS = []

# In-memory user store seeded with demo users
USERS = [
    {
        "id": "usr-demo-student",
        "email": "demo@gmacgroup.org",
        "password": "password123",
        "full_name": "Kwame Mensah",
        "role": "student",
        "created_at": datetime(2026, 1, 15, tzinfo=timezone.utc),
    },
    {
        "id": "usr-demo-professional",
        "email": "professional@gmacgroup.org",
        "password": "password123",
        "full_name": "Ama Osei",
        "role": "professional",
        "created_at": datetime(2026, 2, 1, tzinfo=timezone.utc),
    },
    {
        "id": "usr-demo-researcher",
        "email": "researcher@gmacgroup.org",
        "password": "password123",
        "full_name": "Dr. Kofi Boateng",
        "role": "researcher",
        "created_at": datetime(2026, 2, 10, tzinfo=timezone.utc),
    },
]


def new_record(values: dict) -> dict:
    """Add an id and UTC timestamp to a newly created record."""
    return {"id": str(uuid4()), "created_at": datetime.now(timezone.utc), **values}