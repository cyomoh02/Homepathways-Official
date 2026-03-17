"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface SpokeLink {
  slug: string;
  title: string;
}

interface ContextualNavProps {
  hubSlug: string;
  hubTitle: string;
  spokes: SpokeLink[];
  currentSpoke?: string;
}

export default function ContextualNav({
  hubSlug,
  hubTitle,
  spokes,
  currentSpoke,
}: ContextualNavProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-left text-sm font-medium text-white transition-colors hover:bg-white/10"
      >
        <span className="truncate">{hubTitle}</span>
        <svg
          className={`ml-2 h-4 w-4 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 right-0 z-40 mt-1 max-h-80 overflow-y-auto rounded-lg border border-white/15 bg-[#111] shadow-xl">
          <Link
            href={`/strategy/${hubSlug}`}
            onClick={() => setOpen(false)}
            className="block border-b border-white/10 px-4 py-2.5 text-sm font-semibold text-mint transition-colors hover:bg-white/5"
          >
            Hub Overview
          </Link>
          {spokes.map((spoke, index) => (
            <Link
              key={`${spoke.slug}-${index}`}
              href={`/strategy/${hubSlug}/${spoke.slug}`}
              onClick={() => setOpen(false)}
              className={`block px-4 py-2 text-sm transition-colors hover:bg-white/5 ${
                currentSpoke === spoke.slug
                  ? "bg-mint/15 text-mint"
                  : "text-gray-300"
              }`}
            >
              {spoke.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
