import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const STRATEGY_DIR = path.join(process.cwd(), "strategy");

export interface HubMeta {
  dirName: string; // e.g. "hub-01-housing-infrastructure"
  slug: string; // e.g. "housing-infrastructure" (from hub_slug frontmatter)
  title: string;
  description: string;
  spokeCount: number;
  date: string;
  author: string;
}

export interface SpokeMeta {
  fileName: string; // e.g. "housing-shortage.md"
  slug: string; // e.g. "housing-shortage" (from spoke_slug frontmatter)
  title: string;
  description: string;
  hubSlug: string;
  hub: string;
  urgencyScore: number;
  date: string;
  author: string;
}

export const HUB_DIRS = [
  "hub-01-housing-infrastructure",
  "hub-02-health-wellbeing",
  "hub-03-economic-equity",
  "hub-04-legal-immigration",
  "hub-05-cultural-identity",
  "hub-06-community-social",
  "hub-07-crisis-safety-environment",
  "hub-08-education-digital-access",
] as const;

export const HUB_LABELS: Record<string, string> = {
  "housing-infrastructure": "Housing & Infrastructure Equity in BC",
  "health-wellbeing": "Health & Wellbeing Access",
  "economic-equity": "Economic Equity & Employment Justice",
  "legal-immigration": "Legal Barriers & Immigration Pathways",
  "cultural-identity": "Cultural Identity & Belonging",
  "community-social": "Community & Social Fabric",
  "crisis-safety-environment": "Crisis Response, Safety & Environmental Justice",
  "education-digital-access": "Education Equity & Digital Access",
};

/** Map hub_slug (e.g. "housing-infrastructure") to the directory name */
export function hubSlugToDir(hubSlug: string): string | undefined {
  return HUB_DIRS.find((d) => d.includes(hubSlug));
}

/** Read and parse a markdown file, returning frontmatter + HTML */
export async function parseMarkdown(filePath: string) {
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const result = await remark().use(html, { sanitize: false }).process(content);
  return { data, contentHtml: result.toString() };
}

/** Get metadata for all 8 hubs */
export function getAllHubs(): HubMeta[] {
  return HUB_DIRS.map((dirName) => {
    const indexPath = path.join(STRATEGY_DIR, dirName, "index.md");
    const raw = fs.readFileSync(indexPath, "utf-8");
    const { data } = matter(raw);
    return {
      dirName,
      slug: data.hub_slug || dirName.replace(/^hub-\d+-/, ""),
      title: data.title || dirName,
      description: data.description || "",
      spokeCount: data.spoke_count || 0,
      date: data.date || "",
      author: data.author || "",
    };
  });
}

/** Get all spoke articles for a given hub_slug */
export function getSpokesForHub(hubSlug: string): SpokeMeta[] {
  const dirName = hubSlugToDir(hubSlug);
  if (!dirName) return [];
  const hubPath = path.join(STRATEGY_DIR, dirName);
  const files = fs.readdirSync(hubPath).filter(
    (f) => f.endsWith(".md") && f !== "index.md"
  );
  return files.map((fileName) => {
    const filePath = path.join(hubPath, fileName);
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(raw);
    return {
      fileName,
      slug: data.spoke_slug || fileName.replace(/\.md$/, ""),
      title: data.title || fileName.replace(/\.md$/, ""),
      description: data.description || "",
      hubSlug: data.hub_slug || hubSlug,
      hub: data.hub || "",
      urgencyScore: data.urgency_score || 0,
      date: data.date || "",
      author: data.author || "",
    };
  });
}

/** Extract h2/h3 headings from HTML for the TOC */
export function extractHeadings(
  htmlContent: string
): { id: string; text: string; level: number }[] {
  const headings: { id: string; text: string; level: number }[] = [];
  const regex = /<h([23])[^>]*>(.*?)<\/h[23]>/gi;
  let match;
  while ((match = regex.exec(htmlContent)) !== null) {
    const level = parseInt(match[1], 10);
    const text = match[2].replace(/<[^>]*>/g, "").trim();
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    headings.push({ id, text, level });
  }
  return headings;
}

/** Inject id attributes into h2/h3 tags */
export function injectHeadingIds(htmlContent: string): string {
  return htmlContent.replace(
    /<h([23])([^>]*)>(.*?)<\/h[23]>/gi,
    (_match, level, attrs, inner) => {
      const text = inner.replace(/<[^>]*>/g, "").trim();
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      return `<h${level}${attrs} id="${id}">${inner}</h${level}>`;
    }
  );
}
