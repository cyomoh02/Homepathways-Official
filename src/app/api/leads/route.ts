import { NextRequest, NextResponse } from "next/server";
import {
  findIntelRecord,
  createLead,
  isAirtableConfigured,
} from "@/lib/airtable";
import { validateOrigin } from "@/lib/api-security";

/**
 * POST /api/leads
 *
 * Accepts lead data from the client (captured during/after a Vapi call),
 * resolves the 01_INTEL record for attribution, and writes to 05_CONCIERGE_LEADS.
 *
 * Graceful degradation: if Airtable keys are missing, returns a simulated success
 * so the UI doesn't crash.
 */
export async function POST(req: NextRequest) {
  // Origin validation
  const originError = validateOrigin(req);
  if (originError) {
    return NextResponse.json(
      { success: false, error: "Forbidden" },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const {
      name,
      email,
      phone,
      articleTitle,
      sourceUrl,
      callDuration,
      urgencyScore,
      hubTitle,
      notes,
      agitation,
      proposedOutcome,
    } = body;

    // Graceful degradation if Airtable is not configured
    if (!isAirtableConfigured()) {
      return NextResponse.json({
        success: true,
        recordId: "SIMULATED_NO_AIRTABLE",
        linkedToIntel: false,
        note: "Airtable credentials not configured. Lead captured in simulation mode.",
      });
    }

    // Resolve the 01_INTEL record for this article
    let entryPoint: string[] | undefined;
    if (articleTitle) {
      const intelId = await findIntelRecord(articleTitle);
      if (intelId) {
        entryPoint = [intelId];
      }
    }

    // Build 3-sentence triage note
    const topic = articleTitle || "an equity concern";
    const pain =
      agitation || "systemic barriers affecting their transition in BC";
    const outcome =
      proposedOutcome ||
      "a clear pathway through relevant programs and resources";
    const triageNote =
      notes ||
      `Lead originated from the forensic audit on "${topic}" (Urgency: ${urgencyScore || "N/A"}/10, Hub: ${hubTitle || "General"}). ` +
        `Primary agitation: ${pain}. ` +
        `Proposed outcome: ${outcome}. ` +
        `Call duration: ${callDuration || 0}s. Source: ${sourceUrl || "direct"}.`;

    // Build contact info string
    const contactParts: string[] = [];
    if (email) contactParts.push(email);
    if (phone) contactParts.push(phone);

    const result = await createLead({
      name: name || "Anonymous Lead",
      entryPoint,
      stage: "Lead Captured",
      originStory: `Engaged via Claire voice assistant while reading "${topic}" on HomePathways. Urgency: ${urgencyScore || "N/A"}/10.`,
      triageNote,
    });

    return NextResponse.json({
      success: true,
      recordId: result.records?.[0]?.id,
      linkedToIntel: !!entryPoint,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error";
    console.error("[/api/leads] Error:", message);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
