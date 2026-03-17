/**
 * Private Briefing Engine — The Sean/Claire Nexus.
 *
 * When Claire identifies a complex need, she:
 * 1. Puts the User on HOLD (lo-fi mint-green loop at 100%)
 * 2. Opens a private VoIP bridge to Sean (music ducked to 20%)
 * 3. Sean provides the Intel Briefing
 * 4. Claire selects a handover path (A/B/C)
 *
 * Audio Routing:
 *   Hold music: /assets/audio/hold-music.mp3
 *   User volume: 100% (hold music)
 *   Sean volume: 20% (ducked hold music) + Claire's voice
 *
 * Three Handover Paths:
 *   A — The Informant: Claire relays Sean's intel, Sean disconnects
 *   B — The Direct Expert: User transferred to Sean live at 778-386-2334
 *   C — The Closer: Sean consults, transfers back to Claire for scheduling
 *
 * Sean's Primary Transfer Number: 778-386-2334
 */

/** Sean's direct line — all transfers route here */
export const SEAN_TRANSFER_NUMBER = "+17783862334";

export interface BriefingRequest {
  topic: string;
  urgencyScore?: number;
  userQuery?: string;
  hubTitle?: string;
}

export interface BriefingResult {
  seanResponse: string;
  recommendedPath: "A" | "B" | "C";
  holdDuration: number; // estimated seconds
  transferNumber: string; // Sean's number for Path B
  audioConfig: {
    holdMusicUrl: string;
    userVolume: number; // 0-100
    seanVolume: number; // 0-100 (ducked)
  };
}

/**
 * Initiate a private briefing between Claire and Sean.
 *
 * In production, this triggers the Vapi call transfer / conference.
 * Here we resolve the intelligence Sean would provide based on the topic,
 * and recommend the appropriate handover path.
 */
export async function initiateBriefing(
  request: BriefingRequest
): Promise<BriefingResult> {
  const { topic, urgencyScore } = request;
  const score = urgencyScore || 5;

  const { response, path } = resolveSeanIntel(topic, score);

  return {
    seanResponse: response,
    recommendedPath: path,
    holdDuration: path === "A" ? 8 : path === "B" ? 5 : 12,
    transferNumber: SEAN_TRANSFER_NUMBER,
    audioConfig: {
      holdMusicUrl: "/assets/audio/hold-music.mp3",
      userVolume: 100, // User hears hold music at full volume
      seanVolume: 20, // Sean hears ducked music + Claire's briefing voice
    },
  };
}

/**
 * Resolve what Sean would advise based on the topic and urgency.
 * Maps each domain to specific regulatory/process intelligence.
 */
function resolveSeanIntel(
  topic: string,
  urgency: number
): { response: string; path: "A" | "B" | "C" } {
  const topicLower = topic.toLowerCase();

  // High urgency (8+) or complex legal/financial → Path B (live Sean transfer)
  if (urgency >= 9) {
    return {
      response: buildHighUrgencyResponse(topicLower),
      path: "B",
    };
  }

  // Medium urgency or regulatory questions → Path A (Claire relays)
  if (urgency >= 6) {
    return {
      response: buildMediumResponse(topicLower),
      path: "A",
    };
  }

  // Lower urgency but user needs scheduling → Path C
  return {
    response: buildGeneralResponse(topicLower),
    path: "C",
  };
}

function buildHighUrgencyResponse(topic: string): string {
  if (topic.includes("housing") || topic.includes("rental"))
    return "the BC Residential Tenancy Branch has a 48-hour emergency process for wrongful eviction cases — the user should file Form RTB-2 immediately, and we can expedite this in a live session";

  if (topic.includes("legal") || topic.includes("visa") || topic.includes("immigration"))
    return "Legal Aid BC has expanded eligibility for immigration matters as of Q1 2026 — the income threshold is now $42,000 for a family of four. I should walk them through the intake directly";

  if (topic.includes("health") || topic.includes("mental"))
    return "the BC Crisis Centre has a new warm-transfer protocol for displaced populations — I can connect them immediately with a culturally matched counselor through their 1-833 line";

  if (topic.includes("refugee") || topic.includes("crisis"))
    return "the BC Emergency Management Authority has activated supplementary housing vouchers for climate-displaced families — there is a 72-hour application window that I should help them navigate in real time";

  if (topic.includes("family") || topic.includes("separation"))
    return "the federal family reunification fast-track now applies to BC provincial nominees — processing has dropped to 90 days, but the documentation requirements are specific. I should review their case directly";

  return "this falls under a critical regulatory window in BC — given the urgency level, I should review the specific details with the user directly to ensure they don't miss any deadlines";
}

function buildMediumResponse(topic: string): string {
  if (topic.includes("job") || topic.includes("employment") || topic.includes("economic"))
    return "WorkBC has launched sector-specific retraining grants for displaced workers — up to $12,000 per applicant with expedited processing for urgency-rated cases. The user should start with their local WorkBC centre and reference the Forensic Equity pathway";

  if (topic.includes("education") || topic.includes("school"))
    return "BC's Ministry of Education has a same-week enrollment guarantee for displaced children — no documentation required for initial placement. The school district's newcomer liaison can override any administrative delays";

  if (topic.includes("transport"))
    return "BC Transit has a 90-day free transit pass program for newly relocated individuals — the application is through the local settlement agency, not Transit directly. Most people miss this because it's not advertised on the Transit website";

  if (topic.includes("cultural") || topic.includes("language"))
    return "the Settlement Language Programs funded by IRCC now include evening and weekend cohorts with childcare — WelcomeBC can do a same-day referral. The user should ask specifically for the CLB assessment fast-track";

  if (topic.includes("infrastructure") || topic.includes("utility"))
    return "BC Hydro's Customer Crisis Fund covers first and last month utility deposits for displaced households — the application goes through a community agency, not BC Hydro directly. Processing is 3-5 business days";

  return `the latest BC policy update for ${topic} includes new support pathways through the provincial settlement framework. The user should reference their urgency rating when contacting the relevant agency for prioritized processing`;
}

function buildGeneralResponse(topic: string): string {
  return `the standard process for ${topic} in BC has a clear pathway through the provincial support system. I'd recommend we schedule a focused 20-minute session to map out their specific next steps and connect them with the right agencies`;
}
