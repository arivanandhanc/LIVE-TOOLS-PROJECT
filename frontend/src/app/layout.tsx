import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ConsentBanner } from "@/components/consent-banner";
import { RecaptchaProvider } from "@/components/recaptcha-provider";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { siteConfig } from "@/lib/site";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  applicationName: siteConfig.name,
  manifest: "/manifest.webmanifest",
  authors: [{ name: siteConfig.name }],
  openGraph: {
    type: "website",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    // og:image is generated dynamically by app/opengraph-image.tsx
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    creator: siteConfig.twitter,
  },
  robots: { index: true, follow: true },
  // Search Console ownership. This is the meta-tag method, an alternative to the
  // DNS TXT record — useful because it ships with a deploy instead of needing
  // registrar access. Note the token differs per verification method: paste the
  // one Search Console shows for "HTML tag", not the DNS TXT value.
  verification: {
    google:
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
      "gccSBhwQ7mLvfEKUe-bSx9YHflXsLNWzgLXLR92gKt0",
  },
};

// Google AdSense publisher id. Overridable per-environment so preview
// deployments can run without ads.
const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-8840337065465233";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FBBF24" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a1a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {/* Google AdSense — loaded on every page. React 19 hoists async scripts
            into <head>, which is where AdSense expects its loader for site
            verification and Auto ads. */}
        {ADSENSE_CLIENT && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
          />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  name: siteConfig.name,
                  url: siteConfig.url,
                  logo: `${siteConfig.url}/icon.svg`,
                  description: siteConfig.description,
                  founder: {
                    "@type": "Person",
                    name: "Arivanandhan Chitheshwaran",
                    url: `${siteConfig.url}/about/founder`,
                  },
                  sameAs: [
                    "https://arivanandhan.in",
                    "https://www.linkedin.com/in/arivanandhan",
                    "https://github.com/arivanandhanc",
                  ],
                },
                {
                  "@type": "WebSite",
                  name: siteConfig.name,
                  url: siteConfig.url,
                  potentialAction: {
                    "@type": "SearchAction",
                    target: {
                      "@type": "EntryPoint",
                      urlTemplate: `${siteConfig.url}/tools?q={search_term_string}`,
                    },
                    "query-input": "required name=search_term_string",
                  },
                },
              ],
            }),
          }}
        />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <ConsentBanner />
            {/* reCAPTCHA v3 — loaded on every page of the site */}
            <RecaptchaProvider />
            {/* Vercel Web Analytics — page views across every route */}
            <Analytics />
            {/* Vercel Speed Insights — real-user Core Web Vitals */}
            <SpeedInsights />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
