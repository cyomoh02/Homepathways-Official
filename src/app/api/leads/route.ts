import { NextRequest, NextResponse } from "next/server";
import { findIntelRecord, createLead } from "@/lib/airtable";

/**
 * POST /api/leads
 *
 * Accepts lead data from the client (captured during/after a Vapi call),
 * resolves the 01_INTEL record for attribution, and writes to 05_CONCIERGE_LEADS.
 *
 * Body:
 *   - name?: string
 *   - email?: string
 *   - phone?: string
 *   - articleTitle?: string   (from the page where the call was initiated)
 *   - sourceUrl?: string      (page URL)
 *   - callDuration?: number   (seconds)
 *   - notes?: string          (transcript summary or call notes)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      phone,
      articleTitle,
      sourceUrl,
      callDuration,
      notes,
    } = body;

    // Resolve the 01_INTEL record for this article
    let entryPoint: string[] | undefined;
    if (articleTitle) {
      const intelId = await findIntelRecord(articleTitle);
      if (intelId) {
        entryPoint = [intelId];
      }
    }

    // Build the lead record
    const leadFields: Record<string, unknown> = {
      Captured_At: new Date().toISOString(),
      Status: "New",
    };

    if (name) leadFields.Name = name;
    if (email) leadFields.Email = email;
    if (phone) leadFields.Phone = phone;
    if (sourceUrl) leadFields.Source_URL = sourceUrl;
    if (articleTitle) leadFields.Article_Title = articleTitle;
    if (entryPoint) leadFields.Entry_Point = entryPoint;
    if (callDuration) leadFields.Call_Duration = callDuration;
    if (notes) leadFields.Notes = notes;

    const result = await createLead(leadFields);

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
