/**
 * Server-side Airtable helpers for lead attribution.
 * Reads from 01_INTEL, writes to 05_CONCIERGE_LEADS.
 */

const PAT = process.env.AIRTABLE_PAT!;
const BASE_ID = process.env.AIRTABLE_BASE_ID!;
const API = `https://api.airtable.com/v0/${BASE_ID}`;

const headers = {
  Authorization: `Bearer ${PAT}`,
  "Content-Type": "application/json",
};

/**
 * Search 01_INTEL for a record matching the article title or topic.
 * Returns the Airtable record ID if found, null otherwise.
 */
export async function findIntelRecord(
  articleTitle: string
): Promise<string | null> {
  // Strip common suffixes from article titles
  const cleanTitle = articleTitle
    .replace(/:\s*A Forensic Equity Audit$/i, "")
    .trim();

  // Search by Topic field using filterByFormula
  const formula = encodeURIComponent(
    `OR(FIND(LOWER("${cleanTitle}"), LOWER({Topic})), FIND(LOWER({Topic}), LOWER("${cleanTitle}")))`
  );
  const url = `${API}/01_INTEL?filterByFormula=${formula}&maxRecords=1`;

  const res = await fetch(url, { headers });
  if (!res.ok) return null;

  const data = await res.json();
  if (data.records && data.records.length > 0) {
    return data.records[0].id;
  }
  return null;
}

/**
 * Create a lead in 05_CONCIERGE_LEADS linked to an 01_INTEL record.
 */
export async function createLead(fields: {
  Name?: string;
  Email?: string;
  Phone?: string;
  Source_URL?: string;
  Article_Title?: string;
  Entry_Point?: string[]; // Linked record IDs from 01_INTEL
  Call_Duration?: number;
  Captured_At?: string;
  Status?: string;
  Notes?: string;
}) {
  const url = `${API}/05_CONCIERGE_LEADS`;

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({
      records: [{ fields }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Airtable create failed: ${res.status} — ${err}`);
  }

  return res.json();
}
