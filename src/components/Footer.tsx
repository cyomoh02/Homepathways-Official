import Link from "next/link";
import ClaireButton from "./ClaireButton";

const hubs = [
  { slug: "housing-infrastructure", label: "Housing & Infrastructure" },
  { slug: "health-wellbeing", label: "Health & Wellbeing" },
  { slug: "economic-equity", label: "Economic Equity" },
  { slug: "legal-immigration", label: "Legal & Immigration" },
  { slug: "cultural-identity", label: "Cultural Identity" },
  { slug: "community-social", label: "Community & Social" },
  { slug: "crisis-safety-environment", label: "Crisis & Safety" },
  { slug: "education-digital-access", label: "Education & Digital" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Top section */}
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="font-serif text-lg font-bold tracking-[0.2em] text-white"
            >
              HOMEPATHWAYS
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-gray-400">
              Forensic equity audits for displaced communities across British
              Columbia. Data-driven pathways to systemic change.
            </p>
          </div>

          {/* Hub links */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-300">
              Content Hubs
            </h3>
            <ul className="space-y-1.5">
              {hubs.map((hub) => (
                <li key={hub.slug}>
                  <Link
                    href={`/strategy/${hub.slug}`}
                    className="text-sm text-gray-400 transition-colors hover:text-mint"
                  >
                    {hub.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Claire CTA */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-300">
              Get Help Now
            </h3>
            <p className="mb-4 text-sm text-gray-400">
              Claire is our AI voice assistant. She can connect you with
              BC-specific programs, eligibility criteria, and advocacy resources
              in seconds.
            </p>
            <ClaireButton label="Speak with Claire" />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} HomePathways. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/"
              className="text-xs text-gray-500 transition-colors hover:text-white"
            >
              Home
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
