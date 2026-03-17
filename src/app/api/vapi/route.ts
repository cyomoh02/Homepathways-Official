import { NextRequest, NextResponse } from "next/server";
import { findIntelRecord, createLead, isAirtableConfigured } from "@/lib/airtable";
import {
  checkAvailability,
  bookAppointment,
  type SlotPreference,
} from "@/lib/scheduler";
import { initiateBriefing, type BriefingResult } from "@/lib/briefing";
import { validateVapiSecret } from "@/lib/api-security";

/**
 * POST /api/vapi
 *
 * Vapi server-side function handler. Claire invokes these tools mid-conversation.
 * Secured via x-vapi-secret header validation (when VAPI_WEBHOOK_SECRET is set).
 */
export async function POST(req: NextRequest) {
  // Validate Vapi webhook secret
  if (!validateVapiSecret(req)) {
    return NextResponse.json(
      { result: JSON.stringify({ error: "Unauthorized" }) },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { message } = body;

    // Handle function calls from Claire
    if (message?.type === "function-call") {
      const fnName = message.functionCall?.name;
      const params = message.functionCall?.parameters || {};
      const metadata = body.call?.metadata || {};

      switch (fnName) {
        // ── III. RECURSIVE SCHEDULER ──
        case "checkAvailability": {
          const slots = await checkAvailability();
          return NextResponse.json({
            result: JSON.stringify({
              availableSlots: slots,
              calendarUrl: metadata.calendarUrl,
              instruction:
                "Offer the first available slot. If the user declines, offer the next two. " +
                "Repeat until confirmed. Never send the calendar link directly.",
            }),
          });
        }

        case "bookAppointment": {
          const preference: SlotPreference = {
            date: params.date,
            time: params.time,
            type: params.appointmentType || "phone", // "phone" | "google-meet"
            name: params.name,
            email: params.email,
            phone: params.phone,
            notes: params.notes,
          };
          const booking = await bookAppointment(preference);
          return NextResponse.json({
            result: JSON.stringify({
              confirmed: booking.confirmed,
              slot: booking.slot,
              type: booking.type,
              instruction: booking.confirmed
                ? `Booking confirmed. Tell the user: "You're locked in. I'm sending the calendar invite and the forensic summary to your ${preference.email ? "email" : "phone"} now."`
                : `Booking failed: ${booking.reason}. Check the next available slot.`,
            }),
          });
        }

        // ── II. PRIVATE BRIEFING ──
        case "initiateBriefing": {
          const briefingResult: BriefingResult = await initiateBriefing({
            topic: params.topic || metadata.articleTitle,
            urgencyScore: params.urgencyScore || metadata.urgencyScore,
            userQuery: params.userQuery,
            hubTitle: metadata.hubTitle,
          });
          return NextResponse.json({
            result: JSON.stringify({
              seanResponse: briefingResult.seanResponse,
              handoverPath: briefingResult.recommendedPath,
              instruction: buildBriefingInstruction(briefingResult),
            }),
          });
        }

        // ── IV. TRANSACTIONAL PIPELINE — Mid-call lead capture ──
        case "captureLead": {
          let entryPoint: string[] | undefined;
          const articleTitle =
            params.articleTitle || metadata.articleTitle;

          if (articleTitle) {
            const intelId = await findIntelRecord(articleTitle);
            if (intelId) entryPoint = [intelId];
          }

          // Build the 3-sentence triage note
          const triageNote = buildLeadSummary(
            articleTitle,
            params.agitation,
            params.proposedOutcome
          );

          const result = await createLead({
            name: params.name || "Anonymous Lead (Voice)",
            entryPoint,
            stage: "Lead Captured",
            originStory: `Voice call via Claire on "${articleTitle || "HomePathways"}". Urgency: ${metadata.urgencyScore || "N/A"}/10.`,
            triageNote,
          });

          return NextResponse.json({
            result: JSON.stringify({
              success: true,
              recordId: result.records?.[0]?.id,
              linkedToIntel: !!entryPoint,
              instruction:
                "Lead captured and linked to the intelligence table. " +
                "Proceed to offer scheduling if appropriate.",
            }),
          });
        }

        default:
          return NextResponse.json({
            result: JSON.stringify({ error: `Unknown function: ${fnName}` }),
          });
      }
    }

    // Default: acknowledge non-function messages
    return NextResponse.json({ result: "ok" });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("[/api/vapi] Error:", msg);
    return NextResponse.json(
      { result: JSON.stringify({ error: msg }) },
      { status: 200 } // Vapi expects 200 even on errors
    );
  }
}

/**
 * Build the briefing instruction based on Sean's recommended handover path.
 */
function buildBriefingInstruction(result: BriefingResult): string {
  switch (result.recommendedPath) {
    case "A":
      return (
        "PATH A — THE INFORMANT: You now have Sean's intel. " +
        'Resume with the user and say: "Sean confirmed that for your specific case, ' +
        `${result.seanResponse}." Do NOT transfer the user.`
      );
    case "B":
      return (
        "PATH B — THE DIRECT EXPERT: This requires Sean's live expertise. " +
        'Say: "Sean is available right now and can walk you through this directly. ' +
        'Let me connect you." Then transfer the user to Sean.'
      );
    case "C":
      return (
        "PATH C — THE CLOSER: After Sean's consultation, the user will return to you. " +
        "When they do, say: \"It was great you caught Sean. Now, let's get that " +
        "follow-up locked into the calendar so we don't lose momentum.\" " +
        "Then invoke checkAvailability to start the scheduling loop."
      );
    default:
      return "Proceed with the information available.";
  }
}

/**
 * Build a 3-sentence executive summary for the lead record.
 */
function buildLeadSummary(
  articleTitle: string | undefined,
  agitation: string | undefined,
  proposedOutcome: string | undefined
): string {
  const topic = articleTitle || "an equity concern";
  const pain = agitation || "systemic barriers affecting their transition in BC";
  const outcome =
    proposedOutcome || "a clear pathway through the relevant programs and resources";

  return (
    `Lead originated from the forensic audit on "${topic}." ` +
    `Primary agitation: ${pain}. ` +
    `Proposed outcome: ${outcome}.`
  );
}
