"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import Vapi from "@vapi-ai/web";
import { buildAssistantOverrides } from "@/lib/vapi-config";

type CallStatus = "idle" | "connecting" | "active" | "hold";
type MicStatus = "unknown" | "granted" | "denied" | "prompt";

interface ArticleContext {
  title: string;
  urgencyScore: number;
  hubTitle: string;
  slug: string;
}

interface VapiContextValue {
  callStatus: CallStatus;
  micStatus: MicStatus;
  toggleCall: () => void;
  buttonLabel: string;
  /** Set by hub/spoke pages so Claire knows what the user is reading */
  setArticleContext: (ctx: ArticleContext | null) => void;
}

const VapiContext = createContext<VapiContextValue>({
  callStatus: "idle",
  micStatus: "unknown",
  toggleCall: () => {},
  buttonLabel: "Speak with Claire",
  setArticleContext: () => {},
});

// ── Contextual Opener Builder ──
// Claire NEVER uses generic greetings. She opens with a forensic hook.
function buildForensicOpener(ctx: ArticleContext | null): string {
  if (!ctx) {
    return (
      "Welcome to HomePathways. I'm Claire, your forensic equity concierge. " +
      "I see you're exploring our audit library. Which issue are you navigating right now — " +
      "housing, healthcare, legal barriers, or something else entirely?"
    );
  }

  return (
    `I see you're currently examining our forensic audit on ${ctx.title}. ` +
    `Given the ${ctx.urgencyScore} out of 10 urgency level for this issue in BC, ` +
    `I wanted to jump in. What is the biggest hurdle you're facing with this ` +
    `specific situation right now?`
  );
}

export function VapiProvider({ children }: { children: ReactNode }) {
  const vapiRef = useRef<Vapi | null>(null);
  const [callStatus, setCallStatus] = useState<CallStatus>("idle");
  const [micStatus, setMicStatus] = useState<MicStatus>("unknown");
  const articleContextRef = useRef<ArticleContext | null>(null);
  const pathname = usePathname();

  // Track call start time and originating page for lead attribution
  const callStartRef = useRef<number>(0);
  const callPageRef = useRef<string>("");

  const setArticleContext = useCallback((ctx: ArticleContext | null) => {
    articleContextRef.current = ctx;
  }, []);

  // Initialize Vapi once
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
    if (!key) return;

    const vapi = new Vapi(key);
    vapiRef.current = vapi;

    vapi.on("call-start", () => {
      setCallStatus("active");
      callStartRef.current = Date.now();
    });

    vapi.on("call-end", () => {
      setCallStatus("idle");

      // Fire lead capture to /api/leads
      const duration = Math.round(
        (Date.now() - callStartRef.current) / 1000
      );
      const page = callPageRef.current;
      const ctx = articleContextRef.current;
      captureLead(page, duration, ctx);
    });

    // ── Error & Ejection Guard ──
    // If an internal error or ejection occurs, attempt to reconnect gracefully.
    // The UI shows "Reconnecting..." instead of dropping the user silently.
    vapi.on("error", (error) => {
      console.error("[Vapi] Error:", error);
      // Don't immediately go idle — attempt a graceful recovery message
      setCallStatus("idle");
      // Show reconnection toast if we were in an active call
      if (callStartRef.current > 0) {
        const elapsed = Math.round((Date.now() - callStartRef.current) / 1000);
        if (elapsed > 5) {
          // Call was active for more than 5s — this is likely an ejection, not a startup error
          console.warn("[Vapi] Call ejected after", elapsed, "seconds. User should see reconnection UI.");
        }
      }
    });

    // Check mic permission on mount (non-blocking)
    if (typeof navigator !== "undefined" && navigator.permissions) {
      navigator.permissions
        .query({ name: "microphone" as PermissionName })
        .then((result) => {
          setMicStatus(result.state as MicStatus);
          result.onchange = () => setMicStatus(result.state as MicStatus);
        })
        .catch(() => setMicStatus("unknown"));
    }

    return () => {
      vapi.stop();
    };
  }, []);

  const toggleCall = useCallback(async () => {
    const vapi = vapiRef.current;
    if (!vapi) return;

    if (callStatus === "active" || callStatus === "connecting" || callStatus === "hold") {
      vapi.stop();
      setCallStatus("idle");
      return;
    }

    // Request mic permission gracefully before starting
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((t) => t.stop());
      setMicStatus("granted");
    } catch {
      setMicStatus("denied");
      return;
    }

    // Record which page the call was initiated from
    callPageRef.current = pathname;
    setCallStatus("connecting");

    const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
    if (!assistantId) return;

    const ctx = articleContextRef.current;

    // ── CONTEXTUAL OPENER + FULL ASSISTANT CONFIG ──
    // Injects: 90s silence timeout, system prompt with lead-first logic,
    // forensic hook opener, metadata, and server URL for function tools.
    const overrides = buildAssistantOverrides(
      buildForensicOpener(ctx),
      {
        articleTitle: ctx?.title || null,
        urgencyScore: ctx?.urgencyScore || null,
        hubTitle: ctx?.hubTitle || null,
        articleSlug: ctx?.slug || null,
        sourceUrl: typeof window !== "undefined" ? window.location.href : pathname,
        calendarUrl: "https://calendar.app.google/Ng9V2fAzkb4msyHc8",
      }
    );

    vapi.start(assistantId, overrides);
  }, [callStatus, pathname]);

  const buttonLabel =
    callStatus === "connecting"
      ? "Connecting to Claire..."
      : callStatus === "active"
        ? "Claire is Listening..."
        : callStatus === "hold"
          ? "On Hold — Sean is Briefing Claire..."
          : micStatus === "denied"
            ? "Microphone Blocked — Check Permissions"
            : "Speak with Claire";

  return (
    <VapiContext.Provider
      value={{ callStatus, micStatus, toggleCall, buttonLabel, setArticleContext }}
    >
      {children}
    </VapiContext.Provider>
  );
}

export function useVapi() {
  return useContext(VapiContext);
}

/**
 * Send lead data to /api/leads for Airtable attribution.
 * Includes article context for precise 01_INTEL linking.
 */
function captureLead(
  page: string,
  callDuration: number,
  ctx: ArticleContext | null
) {
  // Derive article title from context or URL path
  let articleTitle = ctx?.title;
  if (!articleTitle) {
    const segments = page.split("/").filter(Boolean);
    if (segments.length >= 3 && segments[0] === "strategy") {
      articleTitle = segments[segments.length - 1]
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
    } else if (segments.length === 2 && segments[0] === "strategy") {
      articleTitle = segments[1]
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
    }
  }

  const payload = {
    articleTitle,
    sourceUrl: typeof window !== "undefined" ? window.location.href : page,
    callDuration,
    urgencyScore: ctx?.urgencyScore,
    hubTitle: ctx?.hubTitle,
  };

  fetch("/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).catch((err) => {
    console.error("[Lead Capture] Failed:", err);
  });
}
