import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TOOL_COUNT } from "@/lib/tools/registry";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn more about Arivanandhan and the mission behind Tools by Arivanandhan.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="container-page max-w-3xl py-14">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        About Tools by Arivanandhan
      </h1>

      <p className="mt-2 text-lg text-muted-foreground">
        Independent Developer • Builder • Problem Solver
      </p>

      <div className="mt-6 space-y-4 text-muted-foreground">
        <p>
          Hi, I&apos;m <strong>Arivanandhan</strong>, an independent software
          developer passionate about creating practical tools that help people
          work smarter and save time.
        </p>

        <p>
          I built this platform to provide powerful, accessible, and
          privacy-friendly tools without unnecessary complexity. Whether you
          need file conversion, PDF utilities, image tools, developer helpers,
          AI-powered features, or productivity solutions, everything is designed
          to be simple and efficient.
        </p>

        <p>
          Today, the platform offers <strong>{TOOL_COUNT}+ tools</strong> and
          continues to grow with new features, improvements, and user-requested
          functionality.
        </p>

        <p>
          My focus is on delivering fast, reliable, and easy-to-use solutions.
          Whenever possible, tools run directly in your browser to help protect
          your privacy and provide a seamless experience.
        </p>

        <p>
          This project is continuously evolving. Every suggestion, bug report,
          and piece of feedback helps make it better for everyone.
        </p>

        <p>
          Thank you for visiting and supporting independent development.
        </p>
      </div>

      <div className="mt-8 rounded-lg border bg-card p-6">
        <h2 className="text-lg font-semibold">About the Developer</h2>

        <p className="mt-3 text-muted-foreground">
          Arivanandhan is an independent developer specializing in automation,
          productivity tools, AI-powered applications, dashboards, developer
          utilities, and digital solutions. His goal is to build software that
          is useful, reliable, and accessible to everyone.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/tools">Explore Tools</Link>
        </Button>

        <Button asChild variant="outline">
          <Link href="/contact">Contact Me</Link>
        </Button>

        <Button asChild variant="outline">
          <a
            href="https://arivanandhan.in"
            target="_blank"
            rel="noopener noreferrer"
          >
            Arivanandhan.in
          </a>
        </Button>
      </div>
    </div>
  );
}