"use client";

import * as React from "react";
import { Cookie } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";

const CONSENT_KEY = "cf_consent";
const CONSENT_VERSION = "1.0";

interface ConsentChoice {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  consentVersion: string;
}

export function ConsentBanner() {
  const [visible, setVisible] = React.useState(false);
  const [customizing, setCustomizing] = React.useState(false);
  const [analytics, setAnalytics] = React.useState(true);
  const [marketing, setMarketing] = React.useState(false);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(CONSENT_KEY);
      if (!stored || JSON.parse(stored).consentVersion !== CONSENT_VERSION) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  async function save(choice: ConsentChoice) {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(choice));
    setVisible(false);
    // Record server-side for the consent ledger (IP, country, browser captured there).
    await apiFetch("/api/consent", { method: "POST", body: JSON.stringify(choice) }).catch(() => undefined);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] p-4">
      <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-5 shadow-xl">
        <div className="flex items-start gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
            <Cookie className="size-5" />
          </span>
          <div className="flex-1">
            <h2 className="font-semibold">We value your privacy</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              We use necessary cookies to make the site work. With your consent we also use
              analytics to improve Arivu's Scrab Tools. Read our{" "}
              <Link href="/legal/cookies" className="underline">Cookie Policy</Link>.
            </p>

            {customizing && (
              <div className="mt-4 space-y-2">
                <Row label="Strictly necessary" desc="Required for the site to function." checked disabled />
                <Row label="Analytics" desc="Helps us understand usage." checked={analytics} onChange={setAnalytics} />
                <Row label="Marketing" desc="Personalized content and offers." checked={marketing} onChange={setMarketing} />
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                onClick={() => save({ necessary: true, analytics: true, marketing: true, consentVersion: CONSENT_VERSION })}
              >
                Accept all
              </Button>
              {customizing ? (
                <Button
                  variant="outline"
                  onClick={() => save({ necessary: true, analytics, marketing, consentVersion: CONSENT_VERSION })}
                >
                  Save preferences
                </Button>
              ) : (
                <Button variant="outline" onClick={() => setCustomizing(true)}>
                  Customize
                </Button>
              )}
              <Button
                variant="ghost"
                onClick={() => save({ necessary: true, analytics: false, marketing: false, consentVersion: CONSENT_VERSION })}
              >
                Reject non-essential
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({
  label, desc, checked, disabled, onChange,
}: {
  label: string; desc: string; checked: boolean; disabled?: boolean; onChange?: (v: boolean) => void;
}) {
  return (
    <label className="flex items-start gap-3 rounded-lg border border-border p-3">
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        className="mt-0.5 accent-[var(--color-primary)]"
      />
      <span>
        <span className="block text-sm font-medium">{label}</span>
        <span className="block text-xs text-muted-foreground">{desc}</span>
      </span>
    </label>
  );
}
