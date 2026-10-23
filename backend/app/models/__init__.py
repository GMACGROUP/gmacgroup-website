"""Import all ORM models so SQLAlchemy registers their tables."""

from app.models.catalogue import CatalogueItem
from app.models.contact import ContactRequest
from app.models.event import Event
from app.models.newsletter import NewsletterSubscriber
from app.models.opportunity import Application, ApplicationEvent, Opportunity
from app.models.payment import Payment
from app.models.programme import Programme, ProgrammeEnrolment
from app.models.team import TeamMember
from app.models.user import User

__all__ = [
	"CatalogueItem",
	"Application",
	"ApplicationEvent",
	"ContactRequest",
	"Event",
	"NewsletterSubscriber",
	"Opportunity",
	"Payment",
	"Programme",
	"ProgrammeEnrolment",
	"TeamMember",
	"User",
]
