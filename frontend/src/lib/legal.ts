export interface LegalSection {
  heading: string;
  body: string[];
}

export interface LegalDoc {
  slug: string;
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}

const updated = "June 2026";

export const legalDocs: Record<string, LegalDoc> = {
  privacy: {
    slug: "privacy",
    title: "Privacy Policy",
    updated,
    intro:
      "ConvertFlow is built privacy-first. This policy explains what we collect, why, and your rights under the GDPR and CCPA.",
    sections: [
      {
        heading: "Our privacy-first model",
        body: [
          "The majority of our tools run entirely in your browser. For these tools, your files and text never leave your device and are never transmitted to our servers.",
          "Some tools (e.g. certain PDF operations) require server-side processing. For those, files are uploaded over an encrypted (TLS) connection, processed in an isolated worker, and automatically deleted.",
        ],
      },
      {
        heading: "Data we collect",
        body: [
          "Account data (optional): if you create an account, we store your email, name and a securely hashed password.",
          "Uploaded files (transient): only for server-side tools, kept until automatic deletion — within 1 hour for guests and 24 hours for registered users.",
          "Usage and security logs: anonymized tool usage, request metadata and audit logs to operate the service securely.",
          "Consent records: your cookie choices, with timestamp, IP, country and browser, as required for compliance.",
        ],
      },
      {
        heading: "Automatic file deletion",
        body: [
          "Processed files are deleted automatically: guests within 1 hour, registered users within 24 hours. You can delete files sooner from your dashboard.",
        ],
      },
      {
        heading: "Your rights",
        body: [
          "You can access, export, correct or delete your data at any time. Email us to exercise GDPR/CCPA rights including erasure and data portability.",
          "We never sell your personal data.",
        ],
      },
      {
        heading: "Contact",
        body: ["For privacy questions or requests, contact our team via the contact page."],
      },
    ],
  },
  cookies: {
    slug: "cookies",
    title: "Cookie Policy",
    updated,
    intro: "This policy explains how ConvertFlow uses cookies and similar technologies.",
    sections: [
      {
        heading: "Categories of cookies",
        body: [
          "Strictly necessary: required for core functionality such as security and session management. Always on.",
          "Analytics (optional): help us understand how the site is used so we can improve it. Enabled only with your consent.",
          "Marketing (optional): used for personalized content. Off by default.",
        ],
      },
      {
        heading: "Managing your choices",
        body: [
          "You can change your preferences at any time via the cookie banner. We record your choice (with timestamp, IP, country and browser) to honor it and to comply with consent regulations.",
        ],
      },
    ],
  },
  terms: {
    slug: "terms",
    title: "Terms of Service",
    updated,
    intro: "By using ConvertFlow you agree to these terms.",
    sections: [
      {
        heading: "Acceptable use",
        body: [
          "You may use ConvertFlow for lawful purposes only. You must own or have the right to process any files you upload.",
          "You may not use the service to process illegal content, infringe intellectual property, or attempt to disrupt or attack the service.",
        ],
      },
      {
        heading: "Service availability",
        body: [
          "The service is provided 'as is' without warranties. We work hard to keep it fast and reliable but do not guarantee uninterrupted availability.",
        ],
      },
      {
        heading: "Limitation of liability",
        body: [
          "To the maximum extent permitted by law, ConvertFlow is not liable for indirect or consequential damages arising from use of the service.",
        ],
      },
    ],
  },
  gdpr: {
    slug: "gdpr",
    title: "GDPR Compliance",
    updated,
    intro: "How ConvertFlow aligns with the EU General Data Protection Regulation.",
    sections: [
      {
        heading: "Lawful basis",
        body: [
          "We process personal data on the basis of consent, contract performance (providing the service you request), and legitimate interests (security and fraud prevention).",
        ],
      },
      {
        heading: "Data subject rights",
        body: [
          "You have the right to access, rectification, erasure, restriction, portability and objection. We respond to verified requests within statutory timeframes.",
        ],
      },
      {
        heading: "Data minimization & retention",
        body: [
          "We collect only what is necessary and delete uploaded files automatically (guests 1h, users 24h). Account data is retained only while your account is active.",
        ],
      },
    ],
  },
};

export const legalSlugs = Object.keys(legalDocs);
