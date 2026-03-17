/**
 * Server-side Airtable helpers for lead attribution.
 * Reads from 01_INTEL, writes to 05_CONCIERGE_LEADS.
 *
 * 05_CONCIERGE_LEADS schema (discovered via metadata API):
 *   - Full Name          (singleLineText)
 *   - Persona Match      (singleSelect)
 *   - Current Stage      (singleSelect)
 *   - Origin Story       (richText)
 *   - Entry Point        (multipleRecordLinks → 01_INTEL)
 *   - Contact Info       (singleSelect)
 *   - Claire's Triage Note (multilineText)
 *
 * Lookup fields (read-only, populated via Entry Point link):
 *   - Topic (from Entry Point)
 *   - Raw_Question (from Entry Point)
 *   - Urgency_Score (from Entry Point)
 *   - Source_URL (from Entry Point)
 *   - Persona_Type (from Entry Point)
 */

const PAT = process.env.AIRTABLE_PAT;
const BASE_ID = process.env.AIRTABLE_BASE_ID;

function getApiUrl() {
  if (!PAT || !BASE_ID) return null;
  return `https://api.airtable.com/v0/${BASE_ID}`;
}

function getHeaders() {
  return {
    Authorization: `Bearer ${PAT}`,
    "Content-Type": "application/json",
  };
}

/**
 * Check if Airtable credentials are configured.
 */
export function isAirtableConfigured(): boolean {
  return !!PAT && !!BASE_ID;
}

/**
 * Search 01_INTEL for a record matching the article title or topic.
 * Returns the Airtable record ID if found, null otherwise.
 */
export async function findIntelRecord(
  articleTitle: string
): Promise<string | null> {
  const api = getApiUrl();
  if (!api) return null;

  const cleanTitle = articleTitle
    .replace(/:\s*A Forensic Equity Audit$/i, "")
    .trim();

  const formula = encodeURIComponent(
    `OR(FIND(LOWER("${cleanTitle}"), LOWER({Topic})), FIND(LOWER({Topic}), LOWER("${cleanTitle}")))`
  );
  const url = `${api}/01_INTEL?filterByFormula=${formula}&maxRecords=1`;

  try {
    const res = await fetch(url, { headers: getHeaders() });
    if (!res.ok) return null;

    const data = await res.json();
    if (data.records && data.records.length > 0) {
      return data.records[0].id;
    }
  } catch {
    // Graceful degradation — return null if Airtable is unreachable
  }
  return null;
}

/**
 * Create a lead in 05_CONCIERGE_LEADS.
 *
 * Maps our internal data to the actual Airtable field names:
 *   name          → "Full Name"
 *   entryPoint    → "Entry Point" (linked record IDs from 01_INTEL)
 *   stage         → "Current Stage"
 *   persona       → "Persona Match"
 *   originStory   → "Origin Story"
 *   contactInfo   → "Contact Info"
 *   triageNote    → "Claire's Triage Note"
 */
export async function createLead(params: {
  name?: string;
  entryPoint?: string[];
  stage?: string;
  persona?: string;
  originStory?: string;
  contactInfo?: string;
  triageNote?: string;
}) {
  const api = getApiUrl();
  if (!api) {
    return { records: [{ id: "SIMULATED_NO_AIRTABLE", fields: {} }] };
  }

  const fields: Record<string, unknown> = {};

  if (params.name) fields["Full Name"] = params.name;
  if (params.entryPoint) fields["Entry Point"] = params.entryPoint;
  if (params.stage) fields["Current Stage"] = params.stage;
  if (params.persona) fields["Persona Match"] = params.persona;
  if (params.originStory) fields["Origin Story"] = params.originStory;
  if (params.contactInfo) fields["Contact Info"] = params.contactInfo;
  if (params.triageNote) fields["Claire's Triage Note"] = params.triageNote;

  const url = `${api}/05_CONCIERGE_LEADS`;

  const res = await fetch(url, {
    method: "POST",
    headers: getHeaders(),
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
