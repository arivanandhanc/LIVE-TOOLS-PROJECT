import type { Metadata } from "next";
import { Mail, Shield, LifeBuoy } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the Arivu's Scrab Tools team.",
  alternates: { canonical: "/contact" },
};

const channels = [
  { icon: Mail, title: "Support email", body: "support@arivanandhan.in", href: "mailto:support@arivanandhan.in" },
  { icon: LifeBuoy, title: "Support center", body: "support.arivanandhan.in", href: "https://support.arivanandhan.in" },
  { icon: Shield, title: "Privacy & data requests", body: "support@arivanandhan.in", href: "mailto:support@arivanandhan.in?subject=Privacy%20request" },
];

export default function ContactPage() {
  return (
    <div className="container-page max-w-3xl py-14">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Contact us</h1>
      <p className="mt-4 text-muted-foreground">
        Questions, feedback or partnership ideas? We&apos;d love to hear from you.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {channels.map(({ icon: Icon, title, body, href }) => (
          <div key={title} className="rounded-xl border border-border bg-card p-6">
            <span className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
              <Icon className="size-5" />
            </span>
            <h2 className="mt-4 font-semibold">{title}</h2>
            {href ? (
              <a href={href} className="mt-1 block text-sm text-primary hover:underline">{body}</a>
            ) : (
              <p className="mt-1 text-sm text-muted-foreground">{body}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
