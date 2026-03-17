"use client";

import { useEffect } from "react";
import { useVapi } from "@/context/VapiContext";

interface ArticleContextSetterProps {
  title: string;
  urgencyScore: number;
  hubTitle: string;
  slug: string;
}

/**
 * Invisible component that registers the current article's metadata
 * with the VapiContext so Claire knows what the user is reading.
 * Rendered by hub/spoke pages.
 */
export default function ArticleContextSetter({
  title,
  urgencyScore,
  hubTitle,
  slug,
}: ArticleContextSetterProps) {
  const { setArticleContext } = useVapi();

  useEffect(() => {
    setArticleContext({ title, urgencyScore, hubTitle, slug });
    return () => setArticleContext(null);
  }, [title, urgencyScore, hubTitle, slug, setArticleContext]);

  return null;
}
