"use client";

import { useVapi } from "@/context/VapiContext";

interface ClaireButtonProps {
  /** Override idle label (e.g. "Click Here To Speak with Claire. No Phone Numbers Needed") */
  label?: string;
  className?: string;
  /** Compact mode for header/small buttons */
  compact?: boolean;
}

export default function ClaireButton({
  label,
  className = "",
  compact = false,
}: ClaireButtonProps) {
  const { callStatus, micStatus, toggleCall, buttonLabel } = useVapi();

  const isActive = callStatus === "active";
  const isConnecting = callStatus === "connecting";
  const isDenied = micStatus === "denied" && callStatus === "idle";

  const displayLabel = isActive || isConnecting || isDenied
    ? buttonLabel
    : label || buttonLabel;

  const pulseClass = isActive ? "animate-pulse" : "";
  const activeClass = isActive
    ? "bg-mint/80 shadow-mint/40 shadow-lg"
    : isConnecting
      ? "bg-mint/60"
      : isDenied
        ? "bg-red-600 hover:bg-red-500"
        : "";

  return (
    <button
      onClick={toggleCall}
      className={`rounded-full bg-mint font-semibold text-black transition-all hover:bg-mint-dark ${pulseClass} ${activeClass} ${
        compact ? "px-3 py-1.5 text-[10px]" : "px-6 py-2.5 text-sm"
      } ${className}`}
    >
      {isActive && (
        <span className="mr-2 inline-block h-2 w-2 rounded-full bg-red-500 animate-pulse" />
      )}
      {displayLabel}
    </button>
  );
}
