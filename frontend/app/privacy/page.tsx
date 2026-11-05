import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/legal/LegalPage";
import { SITE } from "@/lib/content/site";

export const metadata: Metadata = {
  title: "Privacy notice",
  description: "How Gmac Group collects, uses and protects personal information.",
  alternates: { canonical: "/privacy" },
};

const sections: LegalSection[] = [
  {
    id: "who",
    title: "Who we are",
    body: [
      `This notice explains how ${SITE.legalName} ("Gmac Group", "we") handles personal information collected through this website and our programmes, events and services.`,
      `We are responsible for the personal information described here. You can reach us about privacy at ${SITE.email}.`,
    ],
  },
  {
    id: "collect",
    title: "What we collect",
    body: [
      [
        "Enquiries: your name, email, organisation, subject and message when you contact us.",
        "Newsletter: your email address when you subscribe to Gmac Insights.",
        "Member accounts: your name, email, password (stored only in encrypted form) and any profile details you add.",
        "Applications and enrolments: the details you submit for a programme, fellowship or role, including CVs and supporting documents you upload.",
        "Payments: confirmation of payments made through our payment provider. We do not receive or store your full card details.",
        "Website use: anonymous, aggregated statistics about page visits. We do not use advertising or tracking cookies.",
      ],
    ],
  },
  {
    id: "use",
    title: "How we use it",
    body: [
      [
        "To reply to enquiries and scope work you ask us about.",
        "To run programmes, events and applications you take part in, including reviewing applications and issuing certificates.",
        `To send Gmac Insights and event updates you have subscribed to. You can unsubscribe at any time by emailing ${SITE.email}.`,
        "To process and reconcile payments.",
        "To keep the website secure and understand, in aggregate, how it is used.",
      ],
      "We rely on your consent, on steps needed to provide a service you asked for, and on our legitimate interest in running and improving our work. We do not sell personal information.",
    ],
  },
  {
    id: "share",
    title: "Who we share it with",
    body: [
      "We share personal information only with service providers who help us operate, under agreements that require them to protect it:",
      [
        "Website and application hosting (Vercel and Render).",
        "Database and secure file storage (Supabase).",
        "Email delivery providers, used to send confirmations and newsletters.",
        "Payment processing (Flutterwave).",
      ],
      "Where an application is for a role or programme run with a named partner, we will tell you before sharing your application with that partner. We may also disclose information where the law requires it.",
    ],
  },
  {
    id: "international",
    title: "International transfers",
    body: [
      "Our team works remotely from several countries and some of our service providers store data outside your country. Where information moves across borders we use providers with recognised security standards and limit access to the people who need it.",
    ],
  },
  {
    id: "keep",
    title: "How long we keep it",
    body: [
      [
        "Enquiries: up to two years after our last contact, unless they lead to an engagement.",
        "Applications and uploaded documents: up to twelve months after the selection process closes, unless you join the programme or role.",
        "Newsletter: until you unsubscribe.",
        "Member accounts: until you ask us to close your account.",
        "Payment records: as long as accounting and tax law requires.",
      ],
    ],
  },
  {
    id: "rights",
    title: "Your rights",
    body: [
      "Depending on where you live, data protection laws, including Ghana's Data Protection Act, 2012 (Act 843) and Nigeria's Data Protection Act, 2023, give you rights to:",
      [
        "ask for a copy of the personal information we hold about you;",
        "ask us to correct or delete it;",
        "object to or restrict how we use it, and withdraw consent at any time;",
        "complain to your national data protection authority.",
      ],
      `To exercise any of these rights, email ${SITE.email}. We will reply within one month.`,
    ],
  },
  {
    id: "security",
    title: "Security",
    body: [
      "Uploaded documents are stored privately and can only be opened by authorised staff through time limited links. Passwords are stored using one way encryption. No method of transmission or storage is perfectly secure, but we review our safeguards regularly.",
    ],
  },
  {
    id: "changes",
    title: "Changes to this notice",
    body: ["We will post any changes on this page and update the date at the top. Significant changes will be highlighted on the website."],
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy notice"
      intro="We collect only what we need to reply to you, run our programmes and events, and keep the website secure. This page explains what that means in practice."
      updated="7 October 2026"
      sections={sections}
    />
  );
}
