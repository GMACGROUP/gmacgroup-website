# GMACGROUP — Digital Platform & Ecosystem

> **Bridging Learning, Opportunity, and Impact.**  
> The official full-stack digital web platform and operations portal for **GMACGROUP** — a premier Human Capital, Research, and Professional Development organization.

---

## 📌 Executive Overview

**GMACGROUP** provides transformative human capital advisory, empirical research, and executive capacity-building programmes across Africa and globally.

This repository houses the complete, enterprise-grade digital ecosystem powering GMACGROUP's operations, public web presence, candidate application pipeline, and administrative management workflows.

```mermaid
graph TD
    A[Next.js 14 Frontend\nTailwind CSS / TypeScript] -->|REST API + JWT| B[FastAPI Backend\nPython 3.11+ / SQLAlchemy]
    B -->|SQL Queries / Migrations| C[(PostgreSQL / Supabase DB)]
    B -->|Webhook & Verification| D[Flutterwave Payment Gateway]
    B -->|Transactional Emails| E[Email Services\nBrevo / Resend / Gmail SMTP]
    B -->|Resume & CV Storage| F[Storage Provider\nLocal / Supabase Bucket]
    B -->|Natural Language Queries| G[AI Assistant Service]
    H[Admin Operations Portal] -->|Role-Protected Operations| B
```

---

## 🚀 Key Features & System Modules

### 🎓 1. Programmes & Capacity Building
- **Curated Learning Cohorts**: Career readiness labs, empirical research masterclasses, and executive leadership workshops.
- **Tiered Enrolment Model**: Support for **Free**, **VIP**, and **Premium** participation tiers with instant tier-based access control.
- **Enrolment Automation**: Direct checkout integration and automated confirmation tracking linked to student/professional profiles.

### 💼 2. Opportunities & Talent Pipeline
- **Categorized Opportunities**: Jobs, Internships, Fellowships, and Research Grants.
- **Flexible Application Paths**: Standard free submissions, Fast-Track review, and Premium application tiers.
- **Document Attachments**: Direct resume/CV and cover letter uploads with format and size validation.
- **Application Tracking**: Real-time status visibility for applicants (`submitted`, `under_review`, `interview`, `shortlisted`, `approved`, `accepted`, `rejected`, `withdrawn`).

### 🔬 3. Research & Publications Hub
- **Open-Access Publications**: Whitepapers, policy briefs, econometric studies, and institutional reports.
- **Structured Taxonomy**: Filterable by thematic categories (Education, Labour Economics, Technology, Governance).
- **Asset Access**: Direct reading interfaces, PDF downloading, and citation tracking.

### 💳 4. Payments Engine (Flutterwave)
- **Seamless Checkout**: In-app checkout initialization supporting local and international currencies (GHS, USD, etc.).
- **Security & Integrity**: Webhook signature verification (`FLW_WEBHOOK_SECRET_HASH`), transaction amount/currency validation, and idempotent receipt generation.
- **Event-Driven Fulfillment**: Automated activation of programme enrolments and priority application processing upon payment verification.

### 🛡️ 5. Admin Operations Portal
- **KPI Metrics Dashboard**: Live counts for active members, total applications, enrolments, open contact tickets, and pending payments.
- **Candidate & Member Management**: Paginated, filterable directory of all registered users with role auditing.
- **Status Workflow Engine**: Interactive review and state-transition management for candidate applications and cohort enrolments.
- **Audit Logging**: Chronological event logs for status changes, review notes, and operational actions.
- **Diagnostic Utilities**: Built-in email delivery test harness to verify provider connectivity directly from the admin panel.

### 📧 6. Multi-Provider Notification System
- **Resilient Delivery Engine**: Pluggable provider architecture supporting **Brevo API (v3)**, **Resend**, and **SMTP (Gmail / Custom Host)**, with development console logging.
- **Automated Lifecycle Alerts**:
  - Member welcome & registration confirmation
  - Password reset token delivery
  - Application receipt & status update alerts
  - Programme enrolment & payment receipt notifications
  - Operations notifications for inbound contact submissions
  - Newsletter subscription confirmation

### 📂 7. Secure Document Management
- **Resume & CV Storage**: Dedicated handling for candidate documents (PDF/DOCX, up to 10MB).
- **Pluggable Storage Backends**: Configurable for local disk storage or cloud object storage (**Supabase Storage / AWS S3**).
- **Safe Streaming**: Protected, authenticated document viewing endpoints with inline browser preview and safe download headers.

### 🤖 8. AI Assistant Integration
- **Context-Aware Assistance**: Dedicated API gateway routing conversational prompts to the GMACGROUP AI Assistant service.
- **Platform Knowledge Retrieval**: Answering inquiries regarding programmes, opportunities, and research publications with cited references.

### 👤 9. Authentication & Role-Based Access Control (RBAC)
- **JWT Authentication**: Token generation, stateless verification, and secure password hashing via `passlib` / `bcrypt`.
- **Specialized Roles**: Custom dashboards and permissions for `student`, `professional`, `researcher`, `employer`, `institution`, `employee`, and `admin`.
- **Self-Service Account Tools**: Password reset flow with time-limited cryptographic tokens.

---

## 🏗️ Architecture & Technology Stack

| Domain | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | **Next.js 14** (App Router) + React 18 | High-performance Server & Client rendering |
| **Language** | **TypeScript 5.5** | Type-safe frontend component architecture |
| **Styling** | **Tailwind CSS 3.4** + PostCSS | Responsive design system & custom utility tokens |
| **Backend API** | **FastAPI 0.115** | High-performance asynchronous REST API |
| **Backend Runtime** | **Python 3.11+** | Modern Python type hints & async execution |
| **ORM & Database** | **SQLAlchemy 2.0** + **PostgreSQL** | Relational data persistence & migrations |
| **Cloud Services** | **Supabase** | Managed PostgreSQL database & object storage |
| **Payment Gateway** | **Flutterwave** | Global and local payment processing & webhooks |
| **Email Delivery** | **Brevo / Resend / SMTP** | Multi-channel transactional email dispatching |
| **Testing** | **Pytest 8.3** + `pytest-asyncio` | Backend unit, integration, and endpoint testing |
| **Deployment** | **Docker**, Render, Vercel | Containerized backend & edge-deployed frontend |

---

## 📁 Repository Directory Structure

```text
gmacgroup-website/
├── frontend/                     # Next.js 14 Frontend Application
│   ├── app/                      # App router pages & layouts
│   │   ├── (auth)/               # Login, register, password reset pages
│   │   ├── about/                # About GMACGROUP, team, and mission
│   │   ├── admin/                # Admin Operations Portal
│   │   ├── ai/                   # AI Assistant chat interface
│   │   ├── contact/              # Inquiries and partnership contact forms
│   │   ├── dashboard/            # Member profile and history dashboard
│   │   ├── opportunities/        # Opportunity catalogue & application modal
│   │   ├── payment/              # Payment return & verification pages
│   │   ├── programmes/           # Programme directory & enrolment modal
│   │   ├── research/             # Publications and whitepapers library
│   │   └── services/             # Human capital, advisory & training services
│   ├── components/               # Modular UI components (cards, forms, modals, nav)
│   ├── lib/                      # API client, auth helpers, Supabase utilities
│   ├── styles/                   # Global CSS and Tailwind directives
│   └── package.json              # Frontend dependencies and scripts
│
├── backend/                      # FastAPI REST Backend
│   ├── app/
│   │   ├── api/                  # API routers, dependencies, and route endpoints
│   │   │   ├── routes/           # Auth, admin, programmes, opportunities, payments, etc.
│   │   │   └── dependencies.py   # Auth, JWT, DB session, and role guard dependencies
│   │   ├── core/                 # Configuration, database engine, password hashing
│   │   ├── models/               # SQLAlchemy ORM database models
│   │   ├── schemas/              # Pydantic validation and serialization schemas
│   │   ├── services/             # Business logic (notifications, storage, email)
│   │   ├── utils/                # Pagination, security, and helper routines
│   │   └── main.py               # FastAPI application entry point & CORS configuration
│   ├── tests/                    # Pytest test suite (API tests, auth, lifecycle)
│   ├── Dockerfile                # Production backend container definition
│   └── requirements.txt          # Python dependencies
│
├── database/                     # Database Schema & Migrations
│   ├── migrations/               # Ordered SQL migration scripts (0001 to 0009)
│   ├── schemas/                  # Schema documentation and reference SQL
│   └── seed/                     # Seed data scripts for development
│
├── docs/                         # Technical Architecture, API & Dev Documentation
├── uploads/                      # Local document upload directory (when using local storage)
├── .env.example                  # Environment configuration template
├── render.yaml                   # Infrastructure-as-code deployment configuration
└── README.md                     # Project documentation (this file)
```

---

## 🗄️ Database Migrations

The database schema is managed through version-controlled SQL migrations under [`database/migrations/`](file:///c:/Users/DELL/OneDrive/Desktop/USED%20FILE/gmacgroup-website/database/migrations):

1. **`0001_init.sql`** — Core schema: `users`, `programmes`, `programme_enrolments`, `opportunities`, `applications`, `contact_requests`, `reviews`.
2. **`0002_payments_and_offers.sql`** — `payments` table, offer types, transaction tracking, and reference indices.
3. **`0003_member_operations.sql`** — Application status workflow expansion, `application_events` audit trail, reviewer notes.
4. **`0004_newsletters.sql`** — `newsletter_subscribers` table with unsubscribe tokens and preferences.
5. **`0005_fix_users_role_check.sql`** — Expanded user role check constraints for enterprise roles.
6. **`0006_fix_programme_enrolment_status_check.sql`** — Enrolment status constraint alignment.
7. **`0007_grant_superadmin_role.sql`** — Role provisioning helpers for administrative users.
8. **`0008_member_history_indexes.sql`** — High-performance querying indexes for user activity timelines.
9. **`0009_prevent_duplicate_member_submissions.sql`** — Unique constraint safeguards against duplicate active applications.

---

## ⚡ Getting Started & Local Setup

### 1. Prerequisites
- **Node.js** `v18.0.0+` & **npm**
- **Python** `3.11+`
- **PostgreSQL** (local instance or cloud [Supabase](https://supabase.com) project)
- **Git**

---

### 2. Environment Configuration

1. Copy the environment template:
   ```bash
   cp .env.example .env
   ```
2. Configure your database connection string and authentication secrets in `.env`:
   ```env
   ENVIRONMENT=development
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/gmacgroup
   JWT_SECRET=your-secure-random-jwt-secret-key-32-chars-min
   FRONTEND_URL=http://localhost:3000
   ALLOWED_ORIGINS=["http://localhost:3000"]
   ```

---

### 3. Backend Setup

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Create and activate a Python virtual environment
python -m venv .venv

# On Linux/macOS:
source .venv/bin/activate

# On Windows (PowerShell):
.venv\Scripts\Activate.ps1

# 3. Install backend dependencies
pip install -r requirements.txt

# 4. Apply database migrations to your PostgreSQL database
# (Execute the SQL files from database/migrations/ in sequential order on your PostgreSQL instance)

# 5. Start the FastAPI development server
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

The backend interactive API documentation will be available at:
- **Swagger UI**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **ReDoc**: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)
- **Health Probe**: [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)

---

### 4. Frontend Setup

```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Create frontend local environment file
# Ensure NEXT_PUBLIC_API_URL points to your backend
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1" > .env.local

# 4. Launch the Next.js development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📡 REST API Endpoint Summary

All API endpoints are versioned under `/api/v1`:

| Module | Method | Endpoint | Access | Description |
|---|---|---|---|---|
| **Health** | `GET` | `/health` | Public | Liveness probe |
| **Health** | `GET` | `/ready` | Public | Database readiness probe |
| **Auth** | `POST` | `/api/v1/auth/register` | Public | Register new member account & return JWT |
| **Auth** | `POST` | `/api/v1/auth/login` | Public | Authenticate with email/password |
| **Auth** | `GET` | `/api/v1/auth/me` | Authenticated | Retrieve current user profile |
| **Auth** | `POST` | `/api/v1/auth/password-reset/request` | Public | Request password reset email |
| **Auth** | `POST` | `/api/v1/auth/password-reset/confirm` | Public | Confirm reset token and set new password |
| **Users** | `GET` | `/api/v1/users/me/history` | Authenticated | Fetch current user applications & enrolments |
| **Services** | `GET` | `/api/v1/services/` | Public | List all advisory & training services |
| **Services** | `GET` | `/api/v1/services/{slug}` | Public | Get service details by slug |
| **Programmes**| `GET` | `/api/v1/programmes/` | Public | List learning cohorts & workshops |
| **Programmes**| `POST`| `/api/v1/programmes/enrol` | Authenticated | Enrol in a free or paid programme |
| **Opportunities**| `GET` | `/api/v1/opportunities/` | Public | List job, fellowship, & grant opportunities |
| **Opportunities**| `POST`| `/api/v1/opportunities/apply`| Authenticated | Submit candidate application with resume |
| **Research** | `GET` | `/api/v1/research/` | Public | Browse publications and whitepapers |
| **Contact** | `POST`| `/api/v1/contact/` | Public | Submit contact / partnership inquiry |
| **Contact** | `POST`| `/api/v1/contact/newsletter` | Public | Subscribe to newsletter updates |
| **Payments** | `POST`| `/api/v1/payments/initialize` | Authenticated | Initialize Flutterwave checkout session |
| **Payments** | `GET` | `/api/v1/payments/verify/{tx_ref}` | Authenticated | Verify transaction status and activate item |
| **Payments** | `POST`| `/api/v1/payments/webhook` | Webhook | Handle Flutterwave transaction webhook |
| **Uploads** | `POST`| `/api/v1/uploads/document` | Authenticated | Upload resume/CV document (PDF/DOCX) |
| **Uploads** | `GET` | `/api/v1/uploads/files/{file_id}/{fn}` | Admin | Securely view/stream candidate resume |
| **Admin** | `GET` | `/api/v1/admin/overview` | Admin | Aggregate dashboard operational metrics |
| **Admin** | `GET` | `/api/v1/admin/applications` | Admin | Paginated list of candidate applications |
| **Admin** | `PATCH`| `/api/v1/admin/applications/{id}/status`| Admin | Update application status & trigger email |
| **Admin** | `GET` | `/api/v1/admin/enrolments` | Admin | Paginated list of programme enrolments |
| **Admin** | `PATCH`| `/api/v1/admin/enrolments/{id}/status` | Admin | Update enrolment status & trigger email |
| **Admin** | `GET` | `/api/v1/admin/members` | Admin | Paginated member directory |
| **Admin** | `GET` | `/api/v1/admin/payments` | Admin | Paginated payment history & audit |
| **Admin** | `POST`| `/api/v1/admin/email/test` | Admin | Dispatch diagnostic test email |
| **AI** | `POST`| `/api/v1/ai/assistant` | Public | Query conversational AI assistant |

---

## 🧪 Testing & Quality Assurance

### Running Backend Tests

The backend test suite covers authentication, role guards, services, opportunities, programmes, payments, and admin endpoints:

```bash
cd backend
pytest -v
```

To run with coverage reporting:
```bash
pytest --cov=app tests/
```

### Running Frontend Verification

```bash
cd frontend
# Check linting and static typing
npm run lint

# Validate production build bundle
npm run build
```

---

## 🔒 Security & Production Guidelines

When deploying to staging or production:
1. **JWT Secret**: Ensure `JWT_SECRET` is set to a cryptographically strong secret (minimum 32 characters).
2. **CORS Origins**: Configure `ALLOWED_ORIGINS` to strictly allow only the verified frontend origin(s).
3. **Storage Provider**: Set `STORAGE_PROVIDER=supabase` or S3 in production to ensure durable document storage across server restarts.
4. **Payment Signatures**: Ensure `FLW_WEBHOOK_SECRET_HASH` is configured and matches your Flutterwave dashboard webhook secret.
5. **Email Reputation**: Verify your sending domain with Brevo / Resend before sending from a branded email address.

---

## 👥 Ownership & License

Maintained and developed by **GMACGROUP**.  
All rights reserved. Proprietary software — unauthorized reproduction or distribution is strictly prohibited.

---

**GMACGROUP** — *Human Capital • Research • Professional Development*  
Website: [https://gmacgroup.vercel.app](https://gmacgroup.vercel.app)
