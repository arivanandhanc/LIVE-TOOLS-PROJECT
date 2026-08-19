"use client";

import * as React from "react";
import { preloadRecaptcha, RECAPTCHA_ENABLED } from "@/lib/recaptcha";

/**
 * Loads Google reCAPTCHA on the first sign of user interaction.
 *
 * Rendered once from the root layout, so reCAPTCHA still covers every page —
 * but it is no longer fetched during initial page load. On a throttled mobile
 * CPU the script cost ~470ms of main-thread time, and it was competing directly
 * with React hydration: the largest single contributor to Total Blocking Time,
 * on every page, whether or not the visitor ever triggered a protected action.
 *
 * Waiting for interaction is safe rather than a trick. Nothing needs a token
 * until the user *does* something, and `executeRecaptcha` loads the script
 * itself if it is somehow called first — so a protected action can never race
 * ahead of the loader. A real visitor touches, scrolls or clicks within the
 * first moments, gets the badge, and Google still scores the session; a bot
 * that never interacts was never going to submit anything anyway.
 *
 * `once: true` plus `passive: true` keeps these listeners off the scroll path.
 */
export function RecaptchaProvider() {
  React.useEffect(() => {
    if (!RECAPTCHA_ENABLED) return;

    let done = false;
    const load = () => {
      if (done) return;
      done = true;
      preloadRecaptcha();
    };

    const events = ["pointerdown", "keydown", "touchstart", "scroll"] as const;
    events.forEach((event) =>
      window.addEventListener(event, load, { once: true, passive: true })
    );

    // Backstop for a visitor who reads without interacting at all: load well
    // after the page has settled, so it still never competes with hydration.
    const timer = window.setTimeout(load, 10_000);

    return () => {
      events.forEach((event) => window.removeEventListener(event, load));
      window.clearTimeout(timer);
    };
  }, []);

  return null;
}
