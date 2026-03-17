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

type CallStatus = "idle" | "connecting" | "active";
type MicStatus = "unknown" | "granted" | "denied" | "prompt";

interface VapiContextValue {
  callStatus: CallStatus;
  micStatus: MicStatus;
  toggleCall: () => void;
  buttonLabel: string;
}

const VapiContext = createContext<VapiContextValue>({
  callStatus: "idle",
  micStatus: "unknown",
  toggleCall: () => {},
  buttonLabel: "Speak with Claire",
});

export function VapiProvider({ children }: { children: ReactNode }) {
  const vapiRef = useRef<Vapi | null>(null);
  const [callStatus, setCallStatus] = useState<CallStatus>("idle");
  const [micStatus, setMicStatus] = useState<MicStatus>("unknown");
  const pathname = usePathname();

  // Track call start time and originating page for lead attribution
  const callStartRef = useRef<number>(0);
  const callPageRef = useRef<string>("");

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
      captureLead(page, duration);
    });

    vapi.on("error", () => setCallStatus("idle"));

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

    if (callStatus === "active" || callStatus === "connecting") {
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
    if (assistantId) {
      vapi.start(assistantId);
    }
  }, [callStatus, pathname]);

  const buttonLabel =
    callStatus === "connecting"
      ? "Connecting to Claire..."
      : callStatus === "active"
        ? "Claire is Listening..."
        : micStatus === "denied"
          ? "Microphone Blocked — Check Permissions"
          : "Speak with Claire";

  return (
    <VapiContext.Provider
      value={{ callStatus, micStatus, toggleCall, buttonLabel }}
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
 * Extracts article title from the pathname (e.g. /strategy/hub-slug/spoke-slug).
 * Fire-and-forget — errors are logged but don't block the UI.
 */
function captureLead(page: string, callDuration: number) {
  // Derive article title from URL path
  const segments = page.split("/").filter(Boolean);
  let articleTitle: string | undefined;

  // /strategy/{hub}/{spoke} → spoke is the article
  if (segments.length >= 3 && segments[0] === "strategy") {
    articleTitle = segments[segments.length - 1]
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  } else if (segments.length === 2 && segments[0] === "strategy") {
    // Hub page
    articleTitle = segments[1]
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  const payload = {
    articleTitle,
    sourceUrl: typeof window !== "undefined" ? window.location.href : page,
    callDuration,
  };

  fetch("/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).catch((err) => {
    console.error("[Lead Capture] Failed:", err);
  });
}
