"use client";
import React, { useState, useEffect } from "react";
import Vapi from "@vapi-ai/web";

// Replace with your actual Public Key from Vapi -> API Keys
const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || "YOUR_PUBLIC_KEY_HERE");

export default function HomePage() {
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    vapi.on("call-start", () => {
      setConnecting(false);
      setConnected(true);
    });
    vapi.on("call-end", () => {
      setConnecting(false);
      setConnected(false);
    });
  }, []);

  const handleCall = () => {
    if (connected) {
      vapi.stop();
    } else {
      setConnecting(true);
      // Using your specific Assistant ID from the screenshot
      vapi.start("595d847e-a102-4ea9-b1c9-3bbc5a5f59b1");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-4 text-center font-sans">
      {/* 2026 BRANDING SECTION */}
      <div className="mb-12">
        <h1 className="text-5xl font-bold tracking-widest mb-2 opacity-90">
          HOMEPATHWAYS
        </h1>
        <p className="text-blue-400 font-mono text-sm tracking-tighter uppercase mb-8">
          Forensic Equity Audit 2026
        </p>
      </div>

      {/* THE VOICE BUTTON */}
      <button
        onClick={handleCall}
        disabled={connecting}
        className={`px-12 py-4 rounded-full font-bold transition-all duration-500 transform hover:scale-105 ${
          connected 
            ? "bg-red-600 shadow-[0_0_30px_rgba(220,38,38,0.5)]" 
            : "bg-blue-600 shadow-[0_0_30px_rgba(37,99,235,0.5)]"
        }`}
      >
        {connecting ? "SYNCING..." : connected ? "STOP AUDIT" : "TALK TO CLAIRE"}
      </button>

      {/* STATUS SUBTEXT */}
      <p className="mt-8 text-[10px] text-gray-600 font-mono tracking-widest uppercase">
        {connected ? "LIVE FEED ACTIVE" : "AWAITING HUB MASTER SIGNAL"}
      </p>

      {/* FOOTER / PERSONA INDICATOR */}
      <div className="absolute bottom-10 opacity-30">
        <p className="text-[10px] tracking-[0.2em]">PREC: SEAN | PERSONA #9 ENABLED</p>
      </div>
    </main>
  );
}