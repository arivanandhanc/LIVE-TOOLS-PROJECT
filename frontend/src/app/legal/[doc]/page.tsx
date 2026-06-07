import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { legalDocs, legalSlugs } from "@/lib/legal";

export function generateStaticParams() {
  return legalSlugs.map((doc) => ({ doc }));
}

export async function generateMetadata(props: PageProps<"/legal/[doc]">): Promise<Metadata> {
  const { doc } = await props.params;
  const legal = legalDocs[doc];
  if (!legal) return {};
  return {
    title: legal.title,
    description: legal.intro,
    alternates: { canonical: `/legal/${legal.slug}` },
  };
}

export default async function LegalPage(props: PageProps<"/legal/[doc]">) {
  const { doc } = await props.params;
  const legal = legalDocs[doc];
  if (!legal) notFound();

  return (
    <div className="container-page max-w-3xl py-12">
      <header className="mb-8 border-b border-border pb-6">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{legal.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: {legal.updated}</p>
        <p className="mt-4 text-muted-foreground">{legal.intro}</p>
      </header>

      <div className="space-y-8">
        {legal.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="mb-3 text-xl font-semibold tracking-tight">{section.heading}</h2>
            <div className="space-y-3">
              {section.body.map((p, i) => (
                <p key={i} className="text-sm leading-relaxed text-muted-foreground">{p}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
