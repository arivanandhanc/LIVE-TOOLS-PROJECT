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
      "Scrab Tools is built privacy-first. This policy explains, in detail, what personal data we collect, why we collect it, how long we keep it, who we share it with, and the rights you have under the GDPR, UK GDPR, CCPA/CPRA and similar laws. It applies to www.scrabtools.site and the Scrab Tools API.",
    sections: [
      {
        heading: "1. Who we are (data controller)",
        body: [
          "Scrab Tools (\"we\", \"us\", \"our\") operates the website at www.scrabtools.site and is the data controller for the personal data described in this policy.",
          "For any privacy question or to exercise your rights, contact us through the Contact page or at the email address published there. If you are in the EEA/UK and are not satisfied with our response, you may also lodge a complaint with your local data protection authority.",
        ],
      },
      {
        heading: "2. Our privacy-first model",
        body: [
          "Most Scrab Tools tools run entirely in your browser. For these client-side tools (the majority of our image, text, CSV, and developer utilities), your files and text are processed locally on your device and are never uploaded to or seen by our servers.",
          "A smaller set of tools require server-side processing — for example certain PDF operations and all AI tools. For these, the data you submit is transmitted to our backend over an encrypted (TLS/HTTPS) connection, processed, and then deleted according to the retention schedule in section 6.",
          "Each tool page tells you whether it 'Runs in your browser' or uses 'Secure server processing', so you always know before you act.",
        ],
      },
      {
        heading: "3. Personal data we collect",
        body: [
          "Account data (only if you create an account): your email address, optional display name, and a password that is stored only as a salted, hashed value (scrypt) — never in plain text. If you sign in with Google, we receive your email, name, profile picture URL, and Google account identifier.",
          "Authentication data: short-lived access tokens (held in memory in your browser) and a rotating refresh token stored in a secure, HttpOnly cookie. A one-time passcode (OTP) may be emailed to you to verify your address.",
          "Uploaded content (transient): for server-side and AI tools, the files or text you submit, retained only until automatic deletion (see section 6).",
          "Usage and security data: tool-usage records (which tool ran, success/failure, duration), request metadata (IP address, user agent, request IDs), and audit logs, used to operate, secure, and improve the service.",
          "Consent records: your cookie choices stored together with a timestamp, IP address, derived country, and browser, as evidence of consent required by law.",
          "Communications: any information you include when you contact us.",
        ],
      },
      {
        heading: "4. How we use your data and our legal bases",
        body: [
          "To provide the tools you request — legal basis: performance of a contract / your request.",
          "To create and secure your account, verify your email via OTP, and keep you signed in — performance of a contract.",
          "To protect the service against abuse, fraud, and attacks (rate limiting, reCAPTCHA, audit logs) — legitimate interests, and legal obligation where applicable.",
          "To analyze aggregated, anonymized usage so we can improve the product — legitimate interests, or consent where analytics cookies are used.",
          "To comply with legal obligations and respond to lawful requests — legal obligation.",
          "We do not use your uploaded content to train AI models, and we do not sell your personal data.",
        ],
      },
      {
        heading: "5. AI tools and third-party processing",
        body: [
          "When you use an AI tool (e.g. Document Summary, OCR, Content Generator, Image/PDF analysis), the text, image, or document you submit is sent to our AI subprocessor (Anthropic) solely to generate your result, and returned to you.",
          "We instruct our AI subprocessor not to use submitted content to train their models. We recommend you avoid submitting highly sensitive personal data to AI tools where it is not necessary.",
        ],
      },
      {
        heading: "6. Data retention and automatic deletion",
        body: [
          "Server-processed files are deleted automatically: within 1 hour for guests and within 24 hours for signed-in users. You can also delete saved files sooner from your dashboard.",
          "Tool-usage and audit logs are retained for a limited period for security and analytics, then deleted or anonymized.",
          "Account data is retained while your account is active and deleted (or anonymized) after you close your account, except where we must retain limited records to meet legal obligations.",
        ],
      },
      {
        heading: "7. Cookies and similar technologies",
        body: [
          "We use strictly necessary cookies for security and session management (for example a secure refresh-token cookie and an anonymous guest identifier), and — only with your consent — optional analytics or marketing cookies. See our Cookie Policy for the full breakdown and how to change your choices.",
        ],
      },
      {
        heading: "8. Advertising",
        body: [
          "This site is free to use and is funded by advertising. We use Google AdSense to serve ads. Google, as a third-party vendor, uses cookies to serve ads on this site, and its use of advertising cookies enables it and its partners to serve ads to you based on your visit to this and other sites on the internet.",
          "Third-party vendors and ad networks may also use cookies, web beacons or similar technologies to collect information such as your IP address, device and browser characteristics, and the pages you view, in order to measure and personalise advertising.",
          "You can opt out of personalised advertising by visiting Google's Ads Settings at adssettings.google.com, and you can opt out of third-party vendors' use of cookies for personalised advertising at aboutads.info/choices. If you are in the EEA or UK, personalised advertising is only used where you have given consent through our cookie banner, and you can withdraw that consent at any time.",
          "Advertising never has access to the files you process. Browser-based tools keep your files on your device entirely, and files sent to our servers are used solely to perform the requested operation and are deleted automatically.",
        ],
      },
      {
        heading: "9. Subprocessors we rely on",
        body: [
          "We use carefully selected service providers who process data on our behalf under appropriate agreements: hosting and content delivery (e.g. Vercel for the web app, Render for the API), database (e.g. Neon/PostgreSQL), optional object storage (e.g. Cloudflare R2 / S3-compatible storage), transactional email (your configured SMTP/email provider) for OTP and notifications, AI processing (Anthropic), advertising (Google AdSense), analytics (Vercel Web Analytics and Speed Insights), and bot/abuse protection (Google reCAPTCHA).",
          "These providers may process data in countries outside your own; where required we rely on appropriate safeguards such as Standard Contractual Clauses.",
        ],
      },
      {
        heading: "10. International transfers",
        body: [
          "Your data may be processed in countries other than where you live. Where personal data is transferred outside the EEA/UK, we use lawful transfer mechanisms (such as adequacy decisions or Standard Contractual Clauses) to protect it.",
        ],
      },
      {
        heading: "11. Security",
        body: [
          "We apply industry-standard safeguards: TLS encryption in transit, hashed passwords (scrypt), HttpOnly/Secure cookies, strict security headers and Content-Security-Policy, CORS allow-listing, rate limiting, and audit logging. No method of transmission or storage is 100% secure, but we work continuously to protect your data.",
        ],
      },
      {
        heading: "12. Children's privacy",
        body: [
          "Scrab Tools is not directed to children under 16 (or the age required by your jurisdiction). We do not knowingly collect their personal data; if you believe a child has provided us data, contact us and we will delete it.",
        ],
      },
      {
        heading: "13. Your rights",
        body: [
          "Depending on where you live, you may have the right to access, correct, delete, restrict, or object to the processing of your personal data, to data portability, and to withdraw consent at any time. California residents have rights to know, delete, correct, and opt out of 'sale'/'sharing' (we do not sell or share personal data for cross-context behavioral advertising).",
          "To exercise any right, contact us via the Contact page. We will verify your identity and respond within the timeframe required by law. You will not be discriminated against for exercising your rights.",
        ],
      },
      {
        heading: "14. Changes to this policy",
        body: [
          "We may update this policy as the service evolves. We will revise the 'Last updated' date above and, for material changes, provide a more prominent notice.",
        ],
      },
      {
        heading: "15. Contact",
        body: [
          "For any privacy question or request, please use the Contact page. We aim to respond promptly.",
        ],
      },
    ],
  },
  cookies: {
    slug: "cookies",
    title: "Cookie Policy",
    updated,
    intro:
      "This Cookie Policy explains what cookies and similar technologies Scrab Tools uses, why we use them, how long they last, and how you can control them. It should be read together with our Privacy Policy.",
    sections: [
      {
        heading: "1. What are cookies?",
        body: [
          "Cookies are small text files stored on your device by your browser. Similar technologies include localStorage and sessionStorage. They let a site remember actions and preferences (such as keeping you signed in) and help keep the service secure.",
        ],
      },
      {
        heading: "2. Categories of cookies we use",
        body: [
          "Strictly necessary (always on): required for core functionality and security. These include our authentication cookie 'cf_refresh' (a secure, HttpOnly refresh-token cookie that keeps you signed in), an anonymous guest identifier 'cf_guest' (used for rate-limiting and anonymous history on server tools), a short-lived OAuth state cookie used during Google sign-in, and your saved cookie-consent choice. These cannot be switched off as the service would not work without them.",
          "Analytics (optional): help us understand, in aggregate, how the site is used so we can improve it. These are set only if you consent.",
          "Advertising (optional): set by Google AdSense and its partners to serve and measure ads, and — where you consent — to personalise them. These are off by default in the EEA and UK until you accept, and you can change your choice at any time.",
        ],
      },
      {
        heading: "3. Third-party cookies",
        body: [
          "Google reCAPTCHA protects the whole site against automated abuse. It loads on first interaction and is checked whenever you submit a form or send a file to our servers. This is a strictly necessary security measure; Google may set cookies and collect device and behaviour data subject to its own Privacy Policy and Terms of Service.",
          "Google AdSense serves the advertising that funds the site. Google, as a third-party vendor, uses cookies to serve ads, and its use of advertising cookies enables it and its partners to serve ads based on your visits to this and other sites. Other ad-technology vendors may also set cookies or similar identifiers to measure and personalise advertising. You can opt out of personalised advertising at adssettings.google.com, or opt out of participating third-party vendors at aboutads.info/choices.",
          "Our hosting and CDN providers may also set strictly necessary cookies for security and load balancing.",
        ],
      },
      {
        heading: "4. How long cookies last",
        body: [
          "Session cookies are deleted when you close your browser. Persistent cookies last for a defined period — for example, the guest identifier and refresh-token cookie persist for up to 30 days (or until you sign out), and your consent choice is stored so we do not ask again on every visit.",
        ],
      },
      {
        heading: "5. Managing your choices",
        body: [
          "You can accept or reject optional cookies via our consent banner, and change your mind at any time. We record your choice (with timestamp, IP, country, and browser) to honor it and to comply with consent regulations.",
          "You can also block or delete cookies in your browser settings, but blocking strictly necessary cookies may break sign-in and other core features.",
        ],
      },
    ],
  },
  terms: {
    slug: "terms",
    title: "Terms of Service",
    updated,
    intro:
      "These Terms of Service ('Terms') govern your access to and use of Scrab Tools at www.scrabtools.site and the Scrab Tools API. By using the service you agree to these Terms. If you do not agree, please do not use the service.",
    sections: [
      {
        heading: "1. Eligibility and accounts",
        body: [
          "You must be at least 16 years old (or the age of digital consent in your country) to use Scrab Tools. Accounts are optional; if you create one, you are responsible for keeping your credentials secure and for all activity under your account. Provide accurate information and keep it up to date.",
        ],
      },
      {
        heading: "2. The service",
        body: [
          "Scrab Tools provides online tools to convert, compress, edit, and transform files, plus optional AI-powered tools. Many tools run in your browser; some are processed on our servers. Features, tool availability, and limits may change over time.",
        ],
      },
      {
        heading: "3. Acceptable use",
        body: [
          "You may use Scrab Tools only for lawful purposes. You must own or have the necessary rights and permissions for any file or content you upload or process.",
          "You may not: process illegal, infringing, or harmful content; violate others' intellectual property or privacy; attempt to disrupt, overload, reverse engineer, or gain unauthorized access to the service; circumvent rate limits or security; or use the service to build a competing product by scraping or bulk extraction.",
          "We may suspend or terminate access that violates these Terms or that poses a security or legal risk.",
        ],
      },
      {
        heading: "4. Your content",
        body: [
          "You retain all rights to the files and content you submit. You grant us only the limited, temporary rights necessary to process your content to provide the tool you requested. Server-processed files are deleted automatically (guests within 1 hour, registered users within 24 hours).",
        ],
      },
      {
        heading: "5. AI tools",
        body: [
          "AI tools generate output using a third-party AI provider. AI output may be inaccurate or incomplete; you are responsible for reviewing and verifying it before relying on it. Do not submit content you are not permitted to share with a third-party processor.",
        ],
      },
      {
        heading: "6. Plans and payments",
        body: [
          "The Basic plan is free. Paid plans (e.g. Pro) may unlock additional or higher-resource features and are billed as described on the Pricing page. Prices may be shown in your local currency. Where billing is enabled, taxes may apply and terms shown at checkout form part of these Terms.",
        ],
      },
      {
        heading: "7. Intellectual property",
        body: [
          "The Scrab Tools name, software, design, and content (excluding your files) are owned by us or our licensors and are protected by law. We grant you a limited, non-exclusive, non-transferable right to use the service in accordance with these Terms.",
        ],
      },
      {
        heading: "8. Service availability and changes",
        body: [
          "The service is provided 'as is' and 'as available' without warranties of any kind, whether express or implied, including fitness for a particular purpose and non-infringement. We strive for high availability but do not guarantee that the service will be uninterrupted, error-free, or that results will meet your requirements.",
        ],
      },
      {
        heading: "9. Limitation of liability",
        body: [
          "To the maximum extent permitted by law, Scrab Tools and its operators will not be liable for any indirect, incidental, special, consequential, or punitive damages, or for any loss of data, profits, or goodwill, arising from or related to your use of the service. Our total liability for any claim is limited to the amount you paid us (if any) in the 12 months before the claim.",
        ],
      },
      {
        heading: "10. Indemnity",
        body: [
          "You agree to indemnify and hold us harmless from claims, damages, and expenses arising from your misuse of the service or violation of these Terms or applicable law.",
        ],
      },
      {
        heading: "11. Termination",
        body: [
          "You may stop using the service at any time. We may suspend or terminate access if you breach these Terms or to protect the service. Provisions that by their nature should survive termination (such as liability limits) will survive.",
        ],
      },
      {
        heading: "12. Changes to these Terms",
        body: [
          "We may update these Terms from time to time. Material changes will be reflected by the 'Last updated' date and, where appropriate, additional notice. Continued use after changes means you accept the updated Terms.",
        ],
      },
      {
        heading: "13. Contact",
        body: ["Questions about these Terms? Reach us via the Contact page."],
      },
    ],
  },
  gdpr: {
    slug: "gdpr",
    title: "GDPR Compliance",
    updated,
    intro:
      "This page explains how Scrab Tools aligns with the EU General Data Protection Regulation (GDPR) and the UK GDPR. It complements our Privacy Policy with detail aimed at data subjects and business customers.",
    sections: [
      {
        heading: "1. Roles",
        body: [
          "For personal data of our users, Scrab Tools acts as the data controller. Where we process files on your behalf through our tools, we act as a processor for that content and engage subprocessors (listed in our Privacy Policy) under appropriate agreements.",
        ],
      },
      {
        heading: "2. Lawful bases for processing",
        body: [
          "We rely on: consent (e.g. optional analytics/marketing cookies, which you can withdraw at any time); performance of a contract (providing the tools and account features you request); legitimate interests (securing the service, preventing abuse and fraud, and improving the product, balanced against your rights); and legal obligation (where we must retain or disclose data by law).",
        ],
      },
      {
        heading: "3. Your data subject rights",
        body: [
          "You have the right to be informed, and rights of access, rectification, erasure ('right to be forgotten'), restriction of processing, data portability, and objection, as well as rights regarding automated decision-making.",
          "We do not carry out automated decision-making that produces legal or similarly significant effects about you.",
          "To exercise any right, contact us via the Contact page. We verify requests and respond within one month, extendable by two further months for complex requests, as permitted by the GDPR.",
        ],
      },
      {
        heading: "4. Data minimization and retention",
        body: [
          "We collect only the data needed to deliver the service. Uploaded files for server-side tools are deleted automatically (guests within 1 hour, registered users within 24 hours). Account data is kept only while your account is active; logs are retained for a limited period for security and then deleted or anonymized.",
        ],
      },
      {
        heading: "5. International data transfers",
        body: [
          "Where personal data is transferred outside the EEA/UK to our subprocessors, we rely on appropriate safeguards such as adequacy decisions or Standard Contractual Clauses, together with supplementary measures where needed.",
        ],
      },
      {
        heading: "6. Security and breach notification",
        body: [
          "We implement appropriate technical and organizational measures (encryption in transit, hashed credentials, access controls, audit logging, security headers, rate limiting). In the event of a personal data breach that is likely to result in a risk to your rights, we will notify the relevant supervisory authority and affected individuals as required by the GDPR.",
        ],
      },
      {
        heading: "7. Subprocessors and DPAs",
        body: [
          "We use vetted subprocessors (hosting, database, storage, email, AI, and bot-protection providers) under data processing agreements. Business customers who require a Data Processing Agreement can request one via the Contact page.",
        ],
      },
      {
        heading: "8. Complaints",
        body: [
          "If you believe we have not handled your personal data lawfully, please contact us first so we can address it. You also have the right to lodge a complaint with your local supervisory authority (in the UK, the ICO).",
        ],
      },
    ],
  },
};

export const legalSlugs = Object.keys(legalDocs);
