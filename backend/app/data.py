"""Static service catalogue kept for the legacy /services endpoint.

Programmes, opportunities and publications now live in the catalogue_items table
(see database/migrations/0013_catalogue.sql and app/services/catalogue.py).
"""

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
