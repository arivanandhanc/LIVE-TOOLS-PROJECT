"use client";

import * as React from "react";
import Script from "next/script";
import { onConsentChange, readConsent } from "@/lib/consent";

/**
 * GA4 measurement id. Empty disables the tag entirely, which is what preview
 * deployments and local dev want — otherwise every `next dev` session pollutes
 * the production property with fake sessions.
 */
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || "";

/**
 * Google Analytics 4, gated by the cookie banner through Consent Mode v2.
 *
 * Consent Mode rather than "load the tag only after consent" is deliberate.
 * The defaults are already set to `denied` by CONSENT_BOOTSTRAP_SCRIPT before
 * this — or AdSense — loads, so with no answer from the visitor GA writes no
 * cookies and no identifiers; it sends only cookieless pings. That keeps the
 * Cookie Policy's promise intact while still counting the visit, and it is the
 * signal AdSense needs to keep serving ads in the EEA and UK. Withholding the
 * tag entirely would lose both.
 *
 * `strategy="afterInteractive"` keeps gtag.js off the critical path, matching
 * the reasoning in RecaptchaProvider: nothing on screen depends on it, so it
 * has no business competing with hydration.
 */
export function GoogleAnalytics() {
  // Re-apply consent whenever the visitor saves a choice. The banner writes to
  // localStorage, which the bootstrap script only reads once at page load — so
  // without this the first answer would not take effect until a reload.
  React.useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;
    return onConsentChange((choice) => {
      if (!choice || typeof window.gtag !== "function") return;
      const analytics = choice.analytics ? "granted" : "denied";
      const marketing = choice.marketing ? "granted" : "denied";
      window.gtag("consent", "update", {
        analytics_storage: analytics,
        ad_storage: marketing,
        ad_user_data: marketing,
        ad_personalization: marketing,
      });
    });
  }, []);

  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script
        id="ga4-loader"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script id="ga4-config" strategy="afterInteractive">
        {`
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}

/** Returns the visitor's current analytics consent, for callers that need it. */
export function hasAnalyticsConsent(): boolean {
  return readConsent()?.analytics ?? false;
}
