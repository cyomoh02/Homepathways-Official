import Link from "next/link";
import { getAllHubs } from "@/lib/markdown";
import AdSlot from "@/components/AdSlot";
import ClaireButton from "@/components/ClaireButton";

const HUB_ICONS: Record<string, string> = {
  "housing-infrastructure": "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1",
  "health-wellbeing": "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
  "economic-equity": "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1",
  "legal-immigration": "M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3",
  "cultural-identity": "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9",
  "community-social": "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
  "crisis-safety-environment": "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.962-.833-2.732 0L4.07 16.5c-.77.833.192 2.5 1.732 2.5z",
  "education-digital-access": "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
};

export default function HomePage() {
  const hubs = getAllHubs();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/30 via-black to-black" />
        <div className="relative mx-auto max-w-4xl px-4 py-24 text-center sm:py-32">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Forensic Equity Audits for{" "}
            <span className="text-mint">British Columbia</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-400">
            Data-driven pathways to systemic change for displaced communities.
            95+ forensic audits across 8 critical hubs. Evidence-based.
            Action-oriented.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <ClaireButton
              label="Speak with Claire — Our AI Assistant"
              className="px-8 py-3.5 shadow-lg shadow-mint/25"
            />
            <a
              href="#hubs"
              className="rounded-full border border-white/20 px-8 py-3.5 text-sm font-semibold text-gray-300 transition-colors hover:border-white/40 hover:text-white"
            >
              Explore the Audits
            </a>
          </div>
        </div>
      </section>

      <AdSlot variant="horizontal" label="Ad — Homepage Top" />

      {/* Hubs Grid */}
      <section id="hubs" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            8 Content Hubs. 95+ Forensic Audits.
          </h2>
          <p className="mt-3 text-gray-400">
            Each hub is a forensic equity investigation across BC. Click to explore.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {hubs.map((hub) => {
            const iconPath = HUB_ICONS[hub.slug] || HUB_ICONS["housing-infrastructure"];
            return (
              <Link
                key={hub.slug}
                href={`/strategy/${hub.slug}`}
                className="group rounded-xl border border-white/10 bg-white/[0.03] p-6 transition-all hover:border-mint/40 hover:bg-white/[0.06]"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-mint/15">
                  <svg
                    className="h-5 w-5 text-mint"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d={iconPath}
                    />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-white group-hover:text-mint">
                  {hub.title}
                </h3>
                <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-gray-500">
                  {hub.description}
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                  <span className="rounded bg-mint/15 px-2 py-0.5 text-mint">
                    {hub.spokeCount} articles
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <AdSlot variant="horizontal" label="Ad — Homepage Mid" />

      {/* Bottom Claire CTA */}
      <section className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">
          Need Help Navigating the System?
        </h2>
        <p className="mt-4 text-gray-400">
          Claire is our AI voice assistant. She can connect you with BC-specific
          programs, eligibility criteria, and advocacy resources. No phone
          numbers. No hold times. Just answers.
        </p>
        <div className="mt-8">
          <ClaireButton
            label="Click Here To Speak with Claire"
            className="px-10 py-4 shadow-lg shadow-mint/25"
          />
        </div>
      </section>
    </div>
  );
}
