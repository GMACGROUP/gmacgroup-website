"""Import all ORM models so SQLAlchemy registers their tables."""

from app.models.contact import ContactRequest
from app.models.newsletter import NewsletterSubscriber
from app.models.opportunity import Application, ApplicationEvent, Opportunity
from app.models.payment import Payment
from app.models.programme import Programme, ProgrammeEnrolment
from app.models.research import ResearchProject
from app.models.user import User

__all__ = [
	"Application",
	"ApplicationEvent",
	"ContactRequest",
	"NewsletterSubscriber",
	"Opportunity",
	"Payment",
	"Programme",
	"ProgrammeEnrolment",
	"ResearchProject",
	"User",
]
