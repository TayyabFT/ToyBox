import type { TermsSectionContent, TermsSectionId } from "./mockData";

export const termsSectionsContent: Record<TermsSectionId, TermsSectionContent> = {
  introduction: {
    heading: "Introduction",
    subsections: [
      {
        title: "1. Introduction",
        paragraphs: [
          "Welcome to Toybox.",
          'These Terms of Service ("Terms") govern your use of the Toybox mobile application, website, and related services ("Services"). By creating an account or using Toybox, you agree to these Terms.',
          "If you do not agree, please do not use the Services.",
        ],
      },
      {
        title: "2. Eligibility",
        paragraphs: ["You must:"],
        bullets: [
          "Be at least 18 years old.",
          "Have the legal capacity to enter into a binding agreement.",
          "Provide accurate and complete registration information.",
        ],
      },
    ],
  },
  "your-account": {
    heading: "Your Account",
    subsections: [
      {
        title: "3. Your Account",
        paragraphs: ["You are responsible for:"],
        bullets: [
          "Maintaining the confidentiality of your account.",
          "Keeping your password secure.",
          "All activity occurring under your account.",
        ],
        footerParagraphs: [
          "Toybox may suspend or terminate accounts that violate these Terms.",
        ],
      },
    ],
  },
  "services-payments": {
    heading: "Services & Payments",
    subsections: [
      {
        title: "4. Toybox Services",
        paragraphs: [
          "Toybox provides access to concierge, automotive, lifestyle, memberships and related digital services.",
          "Some services are fulfilled by third-party partners. Availability may vary and additional provider terms may apply.",
          "Toybox does not guarantee availability of every requested service.",
        ],
      },
      {
        title: "5. Payments",
        paragraphs: [
          "Certain Services require payment.",
          "Prices are displayed before confirmation.",
          "Payments are securely processed through authorised payment providers.",
          "Refunds are subject to applicable cancellation policies and UAE consumer laws.",
        ],
      },
    ],
  },
  responsibilities: {
    heading: "Responsibilities",
    subsections: [
      {
        title: "6. User Responsibilities",
        paragraphs: ["You agree not to:"],
        bullets: [
          "Use Toybox unlawfully.",
          "Submit false information.",
          "Abuse employees or service providers.",
          "Attempt to interfere with platform security.",
          "Reverse engineer or copy the platform.",
        ],
      },
      {
        title: "7. Vehicle Services",
        paragraphs: ["Where Toybox facilitates vehicle-related services:"],
        bullets: [
          "You confirm you are authorised to request services.",
          "Vehicle information provided is accurate.",
          "Toybox acts as a platform coordinating approved service providers unless otherwise stated.",
        ],
      },
    ],
  },
  "intellectual-property": {
    heading: "Intellectual Property",
    subsections: [
      {
        title: "8. Intellectual Property",
        paragraphs: [
          "All software, branding, logos, designs, content and technology remain the exclusive property of Toybox.",
          "No rights are transferred to users except the limited right to use the Services.",
        ],
      },
      {
        title: "9. Privacy",
        paragraphs: [
          "Your use of Toybox is governed by our Privacy Policy.",
        ],
      },
    ],
  },
  "liability-termination": {
    heading: "Liability & Termination",
    subsections: [
      {
        title: "10. Limitation of Liability",
        paragraphs: ["To the fullest extent permitted by applicable law:"],
        bullets: [
          "Toybox is not liable for indirect, incidental or consequential damages.",
          "Our total liability shall not exceed the amount paid by you to Toybox during the twelve months preceding the claim.",
        ],
        footerParagraphs: [
          "Nothing in these Terms limits liability where such limitation is prohibited by law.",
        ],
      },
      {
        title: "11. Suspension and Termination",
        paragraphs: ["Toybox may suspend or terminate access where:"],
        bullets: [
          "These Terms are breached.",
          "Fraud is suspected.",
          "Required by law.",
        ],
        footerParagraphs: [
          "Users may close their accounts by contacting support.",
        ],
      },
    ],
  },
  "changes-law": {
    heading: "Changes & Governing Law",
    subsections: [
      {
        title: "12. Changes",
        paragraphs: [
          "We may update these Terms periodically.",
          "Continued use after updates constitutes acceptance of the revised Terms.",
        ],
      },
      {
        title: "13. Governing Law",
        paragraphs: [
          "These Terms are governed by the laws of the United Arab Emirates.",
          "Disputes shall be subject to the competent courts of the UAE unless otherwise required by applicable law.",
        ],
      },
    ],
  },
  contact: {
    heading: "Contact",
    paragraphs: [
      "For questions about these Terms, reach out to the Toybox team using the contact details below.",
    ],
    subsections: [
      {
        title: "14. Contact",
        paragraphs: ["contact@Toybox.com"],
      },
    ],
  },
  "privacy-policy": {
    heading: "Privacy Policy",
    paragraphs: ["Effective Date: [Insert Date]"],
    subsections: [
      {
        title: "1. Introduction",
        paragraphs: [
          "Toybox respects your privacy and is committed to protecting your personal information in accordance with applicable UAE privacy legislation.",
        ],
      },
      {
        title: "2. Information We Collect",
        paragraphs: ["Depending on your use of Toybox, we may collect:"],
        bullets: [
          "Name",
          "Email address",
          "Telephone number",
          "Vehicle information",
          "Membership details",
          "Booking history",
          "Concierge requests",
          "Device information",
          "IP address",
          "App usage information",
          "Location data (only with permission)",
        ],
        bulletVariant: "data-field",
        footerParagraphs: [
          "We do not intentionally collect information from children under 18.",
        ],
      },
      {
        title: "3. How We Use Information",
        paragraphs: ["We use personal information to:"],
        bullets: [
          "Create and manage accounts",
          "Deliver requested services",
          "Process bookings",
          "Provide concierge services",
          "Improve our platform",
          "Detect fraud",
          "Maintain platform security",
          "Comply with legal obligations",
        ],
      },
      {
        title: "4. Sharing Information",
        paragraphs: ["We may share information with:"],
        bullets: [
          "Service providers",
          "Automotive partners",
          "Concierge partners",
          "Payment processors",
          "Cloud hosting providers",
          "Government authorities where legally required",
        ],
        footerParagraphs: ["Toybox does not sell personal information."],
      },
      {
        title: "5. Data Security",
        paragraphs: [
          "Toybox uses commercially reasonable administrative, organisational and technical safeguards to protect personal information against unauthorised access, alteration, disclosure or destruction.",
        ],
      },
      {
        title: "6. International Transfers",
        paragraphs: [
          "Information may be processed outside the UAE where necessary to provide Services.",
          "Where international transfers occur, Toybox implements appropriate safeguards consistent with applicable law.",
        ],
      },
      {
        title: "7. Data Retention",
        paragraphs: [
          "Personal information is retained only for as long as necessary:",
        ],
        bullets: [
          "To provide Services",
          "Meet legal obligations",
          "Resolve disputes",
          "Enforce agreements",
        ],
        footerParagraphs: [
          "Information is securely deleted when no longer required.",
        ],
      },
      {
        title: "8. Your Rights",
        paragraphs: ["Subject to applicable law, you may request:"],
        bullets: [
          "Access to your personal information",
          "Correction of inaccurate information",
          "Deletion where legally permitted",
          "Withdrawal of consent where applicable",
        ],
        footerParagraphs: [
          "Requests may be submitted to:",
          "legal@toybox.app",
        ],
      },
      {
        title: "9. Cookies and Analytics",
        paragraphs: [
          "Toybox may use cookies, analytics and similar technologies to:",
        ],
        bullets: [
          "Improve platform performance",
          "Understand usage",
          "Maintain security",
        ],
        footerParagraphs: [
          "You may manage certain preferences through your device settings.",
        ],
      },
      {
        title: "10. Changes",
        paragraphs: [
          "We may update this Privacy Policy from time to time.",
          "Material changes will be communicated through the application or website.",
        ],
      },
      {
        title: "11. Contact",
        paragraphs: [
          "Toybox",
          "Email: legal@toybox.app",
          "Website: www.toybox.app",
        ],
      },
    ],
  },
};
