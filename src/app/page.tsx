"use client";
import React, { useEffect, useState } from "react";
import Vapi from "@vapi-ai/web";

// This pulls your key from the Vercel Environment Variables
const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || "");

export default function Home() {
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);

  const startCall = () => {
    setConnecting(true);
    // 💡 IMPORTANT: Replace 'YOUR_ASSISTANT_ID' with your ID from the Vapi Dashboard
    vapi.start("YOUR_ASSISTANT_ID", {
      assistantOverrides: {
        variableValues: { personaId: "H07" } 
      }
    });
  };

  useEffect(() => {
    vapi.on("call-start", () => {
      setConnecting(false);
      setConnected(true);
    });
    vapi.on("call-end", () => {
      setConnected(false);
      setConnecting(false);
    });
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-6">
      <div className="z-10 max-w-5xl w-full items-center justify-center flex flex-col text-center">
        <h1 className="text-6xl font-black mb-4 tracking-tighter bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent">
          HOMEPATHWAYS
        </h1>
        <div className="h-1 w-24 bg-blue-600 mb-8"></div>
        
        <h2 className="text-2xl font-light mb-12 text-slate-400 tracking-widest uppercase">
          Forensic Equity Audit <span className="text-blue-500 font-bold">2026</span>
        </h2>
        
        <button 
          onClick={connected ? () => vapi.stop() : startCall}
          className={`group relative px-16 py-8 rounded-full font-black text-2xl transition-all duration-500 shadow-2xl ${
            connected 
            ? 'bg-red-600 text-white animate-pulse shadow-red-500/50' 
            : 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-500/20'
          }`}
        >
          {connecting ? "SYNCING..." : connected ? "STOP AUDIT" : "TALK TO CLAIRE"}
        </button>

        <p className="mt-12 text-slate-600 text-sm font-mono uppercase tracking-widest">
          {connected ? "Secure Connection Live" : "Awaiting Hub Master Signal"}
        </p>
      </div>
      
      {/* The Claire Ribbon */}
      <div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
    </main>
  );
}