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
import ArticleContextSetter from "@/components/ArticleContextSetter";

interface SpokePageProps {
  params: Promise<{ hub: string; spoke: string }>;
}

export default async function SpokePage({ params }: SpokePageProps) {
  const { hub, spoke } = await params;
  const dirName = hubSlugToDir(hub);
  if (!dirName) notFound();

  const spokes = getSpokesForHub(hub);
  const spokeEntry = spokes.find((s) => s.slug === spoke);
  if (!spokeEntry) notFound();

  const filePath = path.join(
    process.cwd(),
    "strategy",
    dirName,
    spokeEntry.fileName
  );
  const { data, contentHtml } = await parseMarkdown(filePath);
  const htmlWithIds = injectHeadingIds(contentHtml);
  const headings = extractHeadings(htmlWithIds);
  const hubTitle = HUB_LABELS[hub] || hub;

  const otherSpokes = spokes.filter((s) => s.slug !== spoke);
  const relatedArticles = otherSpokes.slice(0, 3).map((s) => ({
    slug: s.slug,
    title: s.title,
    description: s.description,
    hubSlug: hub,
  }));

  // Extract urgency score from frontmatter
  const urgencyScore = data.urgency_score || data.urgencyScore || 7;
  const articleTitle = data.title || spokeEntry.title;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Register article context with Vapi so Claire knows what we're reading */}
      <ArticleContextSetter
        title={articleTitle}
        urgencyScore={urgencyScore}
        hubTitle={hubTitle}
        slug={spoke}
      />

      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/" className="hover:text-white">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/strategy/${hub}`} className="hover:text-white">
          {hubTitle}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-300">{articleTitle}</span>
      </nav>

      {/* Contextual Nav — sticky sub-header */}
      <div className="sticky top-16 z-40 -mx-4 mb-8 border-b border-white/10 bg-black/90 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="max-w-md">
          <ContextualNav
            hubSlug={hub}
            hubTitle={hubTitle}
            spokes={spokes.map((s, i) => ({ slug: s.slug, title: s.title }))}
            currentSpoke={spoke}
          />
        </div>
      </div>

      <div className="flex gap-10">
        <article className="min-w-0 flex-1">
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: htmlWithIds }}
          />

          <AdSlot variant="horizontal" label="Ad — Article Bottom" />
          <RelatedCards articles={relatedArticles} />

          <InlineClaireCard
            heading={`Have questions about ${articleTitle}?`}
            description="Claire can help you navigate this issue and connect you with relevant BC programs and resources."
          />
        </article>

        <aside className="hidden w-56 shrink-0 lg:block">
          <TableOfContents headings={headings} />
          <div className="mt-8">
            <AdSlot variant="vertical" label="Ad — Article Sidebar" />
          </div>
        </aside>
      </div>
    </div>
  );
}
