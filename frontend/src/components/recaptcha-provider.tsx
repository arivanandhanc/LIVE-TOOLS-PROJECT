"use client";

import * as React from "react";
import { preloadRecaptcha, RECAPTCHA_ENABLED } from "@/lib/recaptcha";

/**
 * Mounts Google reCAPTCHA v3 on EVERY page of the site.
 *
 * Rendered once from the root layout, so the badge is present sitewide and
 * Google can score the whole session rather than just the moment a form is
 * submitted. Loading is deferred to browser idle time so it never competes with
 * LCP or blocks hydration; nothing is rendered into the DOM by this component
 * (the badge is injected by Google's script — see `.grecaptcha-badge` in
 * globals.css for its placement).
 */
export function RecaptchaProvider() {
  React.useEffect(() => {
    if (!RECAPTCHA_ENABLED) return;

    const idle = window.requestIdleCallback;
    if (typeof idle === "function") {
      const handle = idle(() => preloadRecaptcha(), { timeout: 3000 });
      return () => window.cancelIdleCallback?.(handle);
    }
    const timer = window.setTimeout(preloadRecaptcha, 1200);
    return () => window.clearTimeout(timer);
  }, []);

  return null;
}
