/**
 * Cookie-consent state, shared by the banner that writes it and the tags that
 * read it.
 *
 * The banner used to own these constants privately, which meant nothing else
 * could act on the visitor's choice — the "Analytics" toggle recorded a
 * preference and then no code ever consulted it. Anything that needs to honour
 * consent now reads it from here.
 */

export const CONSENT_KEY = "cf_consent";
export const CONSENT_VERSION = "1.0";

/**
 * Fired on `window` whenever the visitor saves a choice. Tags subscribe to this
 * instead of polling: the browser's native `storage` event only fires in *other*
 * tabs, so the tab that made the change would otherwise never hear about it.
 */
export const CONSENT_EVENT = "cf:consent";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (
      command: "js" | "config" | "event" | "consent",
      ...args: unknown[]
    ) => void;
  }
}

export interface ConsentChoice {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  consentVersion: string;
}

/** The visitor's stored choice, or `null` if they have not answered the banner. */
export function readConsent(): ConsentChoice | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored) as ConsentChoice;
    // A bumped version invalidates the old answer — treat it as unanswered so
    // the banner asks again rather than acting on stale permission.
    return parsed.consentVersion === CONSENT_VERSION ? parsed : null;
  } catch {
    return null;
  }
}

/** Persist a choice and tell this tab's listeners about it. */
export function publishConsent(choice: ConsentChoice): void {
  localStorage.setItem(CONSENT_KEY, JSON.stringify(choice));
  window.dispatchEvent(new CustomEvent<ConsentChoice>(CONSENT_EVENT, { detail: choice }));
}

/** Subscribe to consent changes in this tab and in others. Returns an unsubscribe. */
export function onConsentChange(handler: (choice: ConsentChoice | null) => void): () => void {
  const onCustom = (event: Event) => handler((event as CustomEvent<ConsentChoice>).detail);
  const onStorage = (event: StorageEvent) => {
    if (event.key === CONSENT_KEY) handler(readConsent());
  };
  window.addEventListener(CONSENT_EVENT, onCustom);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CONSENT_EVENT, onCustom);
    window.removeEventListener("storage", onStorage);
  };
}

/**
 * Inline script that establishes Google Consent Mode v2 defaults.
 *
 * This has to run *before* any Google tag — gtag.js or the AdSense loader —
 * otherwise those tags start with Google's own defaults (granted) and can write
 * storage before we ever get to deny it. So it ships as a blocking inline
 * script at the very top of <body> rather than as a React component, which
 * would only run after hydration.
 *
 * It reads the stored choice synchronously so a returning visitor who already
 * accepted is granted from the first byte, with no denied-then-granted flip.
 * A first-time visitor defaults to denied: under Consent Mode v2 the tags still
 * load and send cookieless pings, so traffic is measured, but nothing is stored
 * on the device until the banner is answered. That matches what the Cookie
 * Policy promises — optional cookies "are set only if you consent".
 */
export const CONSENT_BOOTSTRAP_SCRIPT = `
window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments)}
window.gtag=gtag;
var g="granted",d="denied",a=d,m=d;
try{var s=JSON.parse(localStorage.getItem(${JSON.stringify(CONSENT_KEY)})||"null");
if(s&&s.consentVersion===${JSON.stringify(CONSENT_VERSION)}){a=s.analytics?g:d;m=s.marketing?g:d}}catch(e){}
gtag("consent","default",{analytics_storage:a,ad_storage:m,ad_user_data:m,ad_personalization:m,functionality_storage:g,security_storage:g,wait_for_update:500});
`.trim();
