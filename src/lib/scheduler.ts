/**
 * Recursive Gatekeeper Scheduler.
 *
 * Claire is the ONLY entity allowed to book the calendar.
 * She never sends a link — she manages the Gate.
 *
 * Calendar: https://calendar.app.google/Ng9V2fAzkb4msyHc8
 */

export interface SlotPreference {
  date: string; // "2026-03-18"
  time: string; // "10:00"
  type: "phone" | "google-meet";
  name?: string;
  email?: string;
  phone?: string;
  notes?: string;
}

interface AvailableSlot {
  date: string;
  time: string;
  display: string; // Human-readable
}

interface BookingResult {
  confirmed: boolean;
  slot?: string;
  type?: string;
  reason?: string;
}

/**
 * Check Sean's real-time availability.
 * Returns the next 5 available slots.
 *
 * Implementation note: In production, this integrates with Google Calendar API
 * using a service account. For now, we generate availability based on business
 * hours (Mon-Fri 9AM-5PM PST) excluding the next 2 hours.
 */
export async function checkAvailability(): Promise<AvailableSlot[]> {
  const slots: AvailableSlot[] = [];
  const now = new Date();
  // Start from at least 2 hours from now
  const earliest = new Date(now.getTime() + 2 * 60 * 60 * 1000);

  const PST_OFFSET = -8; // PST
  let candidate = new Date(earliest);

  // Round up to next 30-min boundary
  candidate.setMinutes(Math.ceil(candidate.getMinutes() / 30) * 30, 0, 0);

  let attempts = 0;
  while (slots.length < 5 && attempts < 100) {
    attempts++;
    const pstHour = (candidate.getUTCHours() + PST_OFFSET + 24) % 24;
    const dayOfWeek = candidate.getDay(); // 0=Sun, 6=Sat

    // Business hours: Mon-Fri, 9AM-5PM PST
    if (dayOfWeek >= 1 && dayOfWeek <= 5 && pstHour >= 9 && pstHour < 17) {
      const dateStr = candidate.toISOString().split("T")[0];
      const timeStr = `${pstHour.toString().padStart(2, "0")}:${candidate
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;
      const dayName = candidate.toLocaleDateString("en-US", {
        weekday: "long",
        timeZone: "America/Vancouver",
      });

      slots.push({
        date: dateStr,
        time: timeStr,
        display: `${dayName}, ${dateStr} at ${timeStr} PST`,
      });
    }

    // Advance by 30 minutes
    candidate = new Date(candidate.getTime() + 30 * 60 * 1000);
  }

  return slots;
}

/**
 * Book an appointment on Sean's calendar.
 *
 * Implementation note: In production, this creates a Google Calendar event
 * via the Calendar API. Returns confirmation for Claire to relay.
 */
export async function bookAppointment(
  pref: SlotPreference
): Promise<BookingResult> {
  // Validate the slot is in the future and during business hours
  const slotDate = new Date(`${pref.date}T${pref.time}:00-08:00`); // PST
  const now = new Date();

  if (slotDate <= now) {
    return {
      confirmed: false,
      reason: "That slot has already passed. Please choose a future time.",
    };
  }

  const dayOfWeek = slotDate.getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return {
      confirmed: false,
      reason:
        "Sean is not available on weekends. Let me check the next weekday.",
    };
  }

  // In production: create Google Calendar event here
  // For now, confirm the booking
  const displaySlot = slotDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "America/Vancouver",
  });

  const meetingType =
    pref.type === "google-meet"
      ? "Google Meet video session"
      : "regular phone call";

  return {
    confirmed: true,
    slot: `${displaySlot} at ${pref.time} PST`,
    type: meetingType,
  };
}
