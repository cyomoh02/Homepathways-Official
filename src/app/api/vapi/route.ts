import { NextRequest, NextResponse } from "next/server";
import { findIntelRecord, createLead, isAirtableConfigured } from "@/lib/airtable";
import {
  checkAvailability,
  bookAppointment,
  type SlotPreference,
} from "@/lib/scheduler";
import {
  initiateBriefing,
  SEAN_TRANSFER_NUMBER,
  type BriefingResult,
} from "@/lib/briefing";
import { validateVapiSecret } from "@/lib/api-security";

/**
 * POST /api/vapi
 *
 * Vapi server-side function handler. Claire invokes these tools mid-conversation.
 * Secured via x-vapi-secret header validation (when VAPI_WEBHOOK_SECRET is set).
 *
 * Sean's Transfer Number: 778-386-2334 (hardcoded in SEAN_TRANSFER_NUMBER)
 */
export async function POST(req: NextRequest) {
  if (!validateVapiSecret(req)) {
    return NextResponse.json(
      { result: JSON.stringify({ error: "Unauthorized" }) },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { message } = body;

    if (message?.type === "function-call") {
      const fnName = message.functionCall?.name;
      const params = message.functionCall?.parameters || {};
      const metadata = body.call?.metadata || {};

      switch (fnName) {
        // ── TRANSFER TO SEAN (Path B) ──
        case "transferCall": {
          return NextResponse.json({
            result: JSON.stringify({
              destination: SEAN_TRANSFER_NUMBER,
              destinationFormatted: "778-386-2334",
              transferType: "warm",
              instruction:
                'Say: "Sean is available right now and can walk you through this directly. ' +
                'I\'m connecting you now — one moment." Then execute the transfer to ' +
                SEAN_TRANSFER_NUMBER +
                ". Claire remains on standby for Path C return.",
            }),
          });
        }

        // ── RECURSIVE SCHEDULER ──
        case "checkAvailability": {
          const slots = await checkAvailability();
          return NextResponse.json({
            result: JSON.stringify({
              availableSlots: slots,
              calendarUrl: metadata.calendarUrl,
              instruction:
                "RECURSIVE SCHEDULING PROTOCOL: " +
                "1. Offer the FIRST available slot with the choice: 'Would you prefer a regular phone call or a Google Meet video session?' " +
                "2. If the user says 'I can't do that time,' respond empathetically: " +
                "'I completely understand — let me check what else Sean has open.' " +
                "Then offer the NEXT TWO slots in a single sentence: " +
                "'I also see [slot 2] and [slot 3] — would either of those work better for you?' " +
                "3. If declined again, pull the next two from the list and repeat. " +
                "4. NEVER book until the user explicitly confirms with a 'yes' or 'that works.' " +
                "5. NEVER send the calendar link. Claire is the gatekeeper. " +
                "6. Once confirmed, invoke bookAppointment with the confirmed slot.",
            }),
          });
        }

        case "bookAppointment": {
          // Guard: only book if user has confirmed
          if (!params.userConfirmed) {
            return NextResponse.json({
              result: JSON.stringify({
                confirmed: false,
                instruction:
                  "BOOKING BLOCKED: The user has not explicitly confirmed this slot. " +
                  "Ask: 'Just to confirm — shall I lock in [slot] for you?' " +
                  "Only invoke bookAppointment again with userConfirmed: true after a clear 'yes.'",
              }),
            });
          }

          const preference: SlotPreference = {
            date: params.date,
            time: params.time,
            type: params.appointmentType || "phone",
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
                ? `Booking confirmed. Say: "You're locked in. I'm sending the calendar invite and the forensic summary to your ${preference.email ? "email" : "phone"} now."`
                : `Booking failed: ${booking.reason}. Invoke checkAvailability to get fresh slots and offer the next two.`,
            }),
          });
        }

        // ── PRIVATE BRIEFING ──
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
              transferNumber: briefingResult.transferNumber,
              audioConfig: briefingResult.audioConfig,
              instruction: buildBriefingInstruction(briefingResult),
            }),
          });
        }

        // ── LEAD CAPTURE ──
        case "captureLead": {
          if (!isAirtableConfigured()) {
            return NextResponse.json({
              result: JSON.stringify({
                success: true,
                recordId: "SIMULATED_NO_AIRTABLE",
                linkedToIntel: false,
                instruction: "Lead captured in simulation mode (Airtable not configured).",
              }),
            });
          }

          let entryPoint: string[] | undefined;
          const articleTitle =
            params.articleTitle || metadata.articleTitle;

          if (articleTitle) {
            const intelId = await findIntelRecord(articleTitle);
            if (intelId) entryPoint = [intelId];
          }

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

    return NextResponse.json({ result: "ok" });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("[/api/vapi] Error:", msg);
    return NextResponse.json(
      { result: JSON.stringify({ error: msg }) },
      { status: 200 }
    );
  }
}

/**
 * Build the briefing instruction based on Sean's recommended handover path.
 * Path B explicitly uses the hardcoded transfer number 778-386-2334.
 */
function buildBriefingInstruction(result: BriefingResult): string {
  switch (result.recommendedPath) {
    case "A":
      return (
        "PATH A — THE INFORMANT: You now have Sean's intel. " +
        'Resume with the user and say: "Sean confirmed that for your specific case, ' +
        `${result.seanResponse}." Do NOT transfer the user. Sean disconnects silently.`
      );
    case "B":
      return (
        "PATH B — THE DIRECT EXPERT: This requires Sean's live expertise. " +
        'Say: "That\'s a critical nuance. Let me verify the latest regulatory shift with Sean ' +
        'privately so I can give you the exact path forward. One moment." ' +
        "Place the user on hold with /assets/audio/hold-music.mp3 at 100% volume. " +
        `Then invoke transferCall to connect the user to Sean at ${SEAN_TRANSFER_NUMBER} (778-386-2334). ` +
        "Claire remains on standby. If Sean transfers the user back (Path C fallback), " +
        "Claire resumes with the Recursive Scheduler."
      );
    case "C":
      return (
        "PATH C — THE CLOSER: Sean will consult briefly with the user, then disconnect. " +
        "Claire remains on the line. When Sean disconnects, resume immediately: " +
        '"It was great you caught Sean. Now, let\'s get that follow-up locked into the ' +
        'calendar so we don\'t lose momentum." ' +
        "Then invoke checkAvailability to start the Recursive Scheduling loop."
      );
    default:
      return "Proceed with the information available.";
  }
}

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
