import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  parseMarkdown,
  getSpokesForHub,
  hubSlugToDir,
  extractHeadings,
  injectHeadingIds,
  HUB_LABELS,
} from "@/lib/markdown";
import ContextualNav from "@/components/ContextualNav";
import TableOfContents from "@/components/TableOfContents";
import RelatedCards from "@/components/RelatedCards";
import AdSlot from "@/components/AdSlot";
import InlineClaireCard from "@/components/InlineClaireCard";

interface HubPageProps {
  params: Promise<{ hub: string }>;
}

export default async function HubPage({ params }: HubPageProps) {
  const { hub } = await params;
  const dirName = hubSlugToDir(hub);
  if (!dirName) notFound();

  const indexPath = path.join(process.cwd(), "strategy", dirName, "index.md");
  const { data, contentHtml } = await parseMarkdown(indexPath);
  const spokes = getSpokesForHub(hub);
  const htmlWithIds = injectHeadingIds(contentHtml);
  const headings = extractHeadings(htmlWithIds);
  const hubTitle = data.title || HUB_LABELS[hub] || hub;

  // Pick 3 spokes for related cards
  const relatedArticles = spokes.slice(0, 3).map((s) => ({
    slug: s.slug,
    title: s.title,
    description: s.description,
    hubSlug: hub,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/" className="hover:text-white">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-300">{hubTitle}</span>
      </nav>

      {/* Contextual Nav — sticky sub-header */}
      <div className="sticky top-16 z-40 -mx-4 mb-8 border-b border-white/10 bg-black/90 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="max-w-md">
          <ContextualNav
            hubSlug={hub}
            hubTitle={hubTitle}
            spokes={spokes.map((s, i) => ({ slug: s.slug, title: s.title }))}
          />
        </div>
      </div>

      <div className="flex gap-10">
        {/* Main content */}
        <article className="min-w-0 flex-1">
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: htmlWithIds }}
          />

          <AdSlot variant="horizontal" label="Ad — Hub Bottom" />

          <RelatedCards articles={relatedArticles} />

          <InlineClaireCard
            heading="Need personalized guidance?"
            description="Claire can walk you through the issues in this hub and connect you with BC-specific resources."
          />
        </article>

        {/* Sidebar */}
        <aside className="hidden w-56 shrink-0 lg:block">
          <TableOfContents headings={headings} />
          <div className="mt-8">
            <AdSlot variant="vertical" label="Ad — Hub Sidebar" />
          </div>
        </aside>
      </div>
    </div>
  );
}
