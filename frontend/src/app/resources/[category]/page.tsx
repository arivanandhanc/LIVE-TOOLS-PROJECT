import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  serviceCategories,
  getServiceCategory,
  getServicesByCategory,
} from "@/lib/resources/services";
import { ServiceCard } from "@/components/service-card";

export function generateStaticParams() {
  return serviceCategories.map((cat) => ({ category: cat.slug }));
}

export async function generateMetadata(
  props: PageProps<"/resources/[category]">
): Promise<Metadata> {
  const { category } = await props.params;
  const cat = getServiceCategory(category);
  if (!cat) return {};
  const count = getServicesByCategory(category).length;
  return {
    title: `${cat.name} — ${count} Recommended Tools`,
    description: `${cat.description} Browse ${count} recommended ${cat.name.toLowerCase()}.`,
    alternates: { canonical: `/resources/${cat.slug}` },
  };
}

export default async function ResourceCategoryPage(
  props: PageProps<"/resources/[category]">
) {
  const { category } = await props.params;
  const cat = getServiceCategory(category);
  if (!cat) notFound();

  const list = getServicesByCategory(category);

  return (
    <div className="container-page py-10">
      <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link href="/resources" className="hover:text-foreground">Resources</Link>
        <ChevronRight className="size-4" />
        <span className="text-foreground">{cat.name}</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{cat.name}</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">{cat.description}</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((service) => (
          <ServiceCard key={service.slug} service={service} />
        ))}
      </div>
    </div>
  );
}
