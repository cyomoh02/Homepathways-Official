import Link from "next/link";

interface RelatedArticle {
  slug: string;
  title: string;
  description: string;
  hubSlug: string;
}

interface RelatedCardsProps {
  articles: RelatedArticle[];
}

export default function RelatedCards({ articles }: RelatedCardsProps) {
  if (articles.length === 0) return null;

  return (
    <section className="mt-12 border-t border-white/10 pt-10">
      <h2 className="mb-6 text-xl font-bold text-white">Related Articles</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.slice(0, 3).map((article, index) => (
          <Link
            key={`${article.slug}-${index}`}
            href={`/strategy/${article.hubSlug}/${article.slug}`}
            className="group overflow-hidden rounded-xl border border-white/10 bg-white/5 transition-colors hover:border-mint/40 hover:bg-white/8"
          >
            {/* Image placeholder */}
            <div className="flex h-40 items-center justify-center bg-gradient-to-br from-mint/10 to-emerald-900/30">
              <svg
                className="h-10 w-10 text-white/20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <div className="p-4">
              <h3 className="text-sm font-semibold text-white group-hover:text-mint">
                {article.title}
              </h3>
              <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-gray-400">
                {article.description}
              </p>
              <span className="mt-3 inline-block text-xs font-medium text-mint">
                Read the Audit &rarr;
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
