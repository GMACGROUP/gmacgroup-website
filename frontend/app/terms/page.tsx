import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/legal/LegalPage";
import { SITE } from "@/lib/content/site";

export const metadata: Metadata = {
  title: "Terms of use",
  description: "The terms that apply to using the Gmac Group website.",
  alternates: { canonical: "/terms" },
};

const sections: LegalSection[] = [
  {
    id: "about",
    title: "About these terms",
    body: [
      `These terms apply to your use of this website, operated by ${SITE.legalName} ("Gmac Group"). By using the website you accept them. Separate terms, shown at the point of enrolment, registration or engagement, apply to programmes, events, payments and advisory work.`,
    ],
  },
  {
    id: "use",
    title: "Using the website",
    body: [
      [
        "Use the website lawfully and do not attempt to disrupt it, access accounts that are not yours, or upload harmful files.",
        "Keep your member account details secure. You are responsible for activity under your account.",
        "Information you submit, such as applications, must be accurate and your own.",
      ],
    ],
  },
  {
    id: "content",
    title: "Our content",
    body: [
      "The text, research, images, design and logo on this website belong to Gmac Group or are used with permission. You may share links and quote short extracts with attribution. Please ask us before reproducing larger parts.",
      "Research and insights published here are provided for general information. They are not professional, financial or legal advice for your specific situation.",
    ],
  },
  {
    id: "investment",
    title: "Investment facilitation",
    body: [
      "Gmac Group connects investors with projects and prepares propositions for review. We do not manage, hold or invest client funds, and nothing on this website is an offer of securities or investment advice.",
    ],
  },
  {
    id: "links",
    title: "Links to other websites",
    body: ["We are not responsible for the content or privacy practices of websites we link to, including registration and payment pages run by our providers."],
  },
  {
    id: "liability",
    title: "Liability",
    body: [
      "We work to keep the website accurate and available, but we cannot guarantee it will always be complete, current or uninterrupted. To the extent the law allows, we are not liable for losses arising from use of the website. Nothing in these terms limits liability that cannot be limited by law.",
    ],
  },
  {
    id: "law",
    title: "Governing law",
    body: ["These terms are governed by the laws of the Federal Republic of Nigeria, where Gmac Group is registered."],
  },
  {
    id: "contact",
    title: "Contact",
    body: [`Questions about these terms can be sent to ${SITE.email}.`],
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of use"
      intro="The plain terms that apply when you use this website."
      updated="7 October 2026"
      sections={sections}
    />
  );
}
