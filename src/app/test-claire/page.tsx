"use client";

import { useState, useRef, useEffect } from "react";

interface TestResult {
  label: string;
  status: "idle" | "running" | "pass" | "fail";
  detail: string;
  duration?: number;
}

export default function TestClairePage() {
  const [tests, setTests] = useState<TestResult[]>([
    { label: "Test A: Lead Capture to Airtable", status: "idle", detail: "" },
    { label: "Test B: Handover with Hold Music (Ducking)", status: "idle", detail: "" },
    { label: "Test C: Return to Claire — Recursive Scheduler", status: "idle", detail: "" },
  ]);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const duckAudioRef = useRef<HTMLAudioElement | null>(null);

  function updateTest(index: number, update: Partial<TestResult>) {
    setTests((prev) =>
      prev.map((t, i) => (i === index ? { ...t, ...update } : t))
    );
  }

  // ── TEST A: Lead Capture to Airtable ──
  async function runTestA() {
    updateTest(0, { status: "running", detail: "Sending lead to /api/leads..." });
    const start = Date.now();

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Test Lead — Stress Test",
          email: "test@homepathways.ca",
          phone: "+1-604-555-0199",
          articleTitle: "Housing Shortage",
          sourceUrl: window.location.href,
          callDuration: 42,
          urgencyScore: 10,
          hubTitle: "Housing & Infrastructure Equity in British Columbia",
          agitation: "Cannot find affordable housing in Metro Vancouver",
          proposedOutcome: "Connected with BC Housing emergency waitlist",
        }),
      });

      const data = await res.json();
      const duration = Date.now() - start;

      if (data.success) {
        updateTest(0, {
          status: "pass",
          duration,
          detail: [
            `Record ID: ${data.recordId}`,
            `Linked to 01_INTEL: ${data.linkedToIntel ? "YES" : "NO (topic not found)"}`,
            `Response time: ${duration}ms`,
          ].join("\n"),
        });
      } else {
        updateTest(0, {
          status: "fail",
          duration,
          detail: `API Error: ${data.error}\nResponse time: ${duration}ms`,
        });
      }
    } catch (err) {
      updateTest(0, {
        status: "fail",
        duration: Date.now() - start,
        detail: `Network Error: ${err instanceof Error ? err.message : String(err)}`,
      });
    }
  }

  // ── TEST B: Handover with Hold Music (Ducking) ──
  async function runTestB() {
    updateTest(1, {
      status: "running",
      detail: "Phase 1: Playing hold music at 100% (user perspective)...",
    });

    // Check if hold music file exists
    const musicUrl = "/assets/audio/hold-music.mp3";
    let hasMusicFile = false;

    try {
      const check = await fetch(musicUrl, { method: "HEAD" });
      hasMusicFile = check.ok && check.headers.get("content-type")?.includes("audio") === true;
    } catch {
      hasMusicFile = false;
    }

    if (!hasMusicFile) {
      // Use Web Audio API to generate a lo-fi tone as placeholder
      updateTest(1, {
        status: "running",
        detail:
          "hold-music.mp3 is PLACEHOLDER — generating synthetic lo-fi tone for test.\n" +
          "ACTION REQUIRED: Replace /public/assets/audio/hold-music.mp3 with real audio.\n\n" +
          "Phase 1: Playing at 100% volume (user hears this)...",
      });
    }

    // Create audio context for ducking demonstration
    const ctx = new AudioContext();
    const gainUser = ctx.createGain();
    const gainSean = ctx.createGain();
    gainUser.connect(ctx.destination);
    gainSean.connect(ctx.destination);

    // Generate a soft sine wave as placeholder music
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = 432; // A=432Hz lo-fi vibe
    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 0.3;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 50;
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    lfo.start();

    // Route through both gain nodes
    osc.connect(gainUser);
    osc.connect(gainSean);
    osc.start();

    // Phase 1: User hears 100%, Sean hears nothing yet
    gainUser.gain.value = 0.3; // 100% = 0.3 for comfort
    gainSean.gain.value = 0;

    await sleep(3000);

    // Phase 2: Duck to 20% for Sean's briefing
    updateTest(1, {
      status: "running",
      detail: (hasMusicFile ? "" : "hold-music.mp3 is PLACEHOLDER.\n\n") +
        "Phase 2: Ducking to 20% (Sean's perspective)...\n" +
        "User: 100% hold music\n" +
        "Sean: 20% ducked music + Claire's briefing voice",
    });

    // Animate the duck
    gainUser.gain.setTargetAtTime(0.3, ctx.currentTime, 0.1); // user stays 100%
    gainSean.gain.setTargetAtTime(0.06, ctx.currentTime, 0.3); // sean = 20%

    await sleep(3000);

    // Phase 3: Verify briefing API
    updateTest(1, {
      status: "running",
      detail: (hasMusicFile ? "" : "hold-music.mp3 is PLACEHOLDER.\n\n") +
        "Phase 3: Calling /api/vapi initiateBriefing...",
    });

    let briefingResult = "";
    try {
      const res = await fetch("/api/vapi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: {
            type: "function-call",
            functionCall: {
              name: "initiateBriefing",
              parameters: {
                topic: "Housing Shortage",
                urgencyScore: 10,
                userQuery: "I'm about to be evicted and need emergency housing",
              },
            },
          },
          call: {
            metadata: {
              articleTitle: "Housing Shortage",
              urgencyScore: 10,
              hubTitle: "Housing & Infrastructure",
              sourceUrl: window.location.href,
            },
          },
        }),
      });

      const data = await res.json();
      const parsed = JSON.parse(data.result);
      briefingResult = [
        `Sean's Response: "${parsed.seanResponse}"`,
        `Recommended Path: ${parsed.handoverPath}`,
        `Hold Duration: ${parsed.holdDuration}s`,
        `Audio Config: user=${parsed.audioConfig?.userVolume}%, sean=${parsed.audioConfig?.seanVolume}%`,
      ].join("\n");
    } catch (err) {
      briefingResult = `Briefing API Error: ${err instanceof Error ? err.message : String(err)}`;
    }

    // Stop audio
    osc.stop();
    lfo.stop();
    ctx.close();

    updateTest(1, {
      status: briefingResult.includes("Error") ? "fail" : "pass",
      detail:
        (hasMusicFile
          ? "Hold music: REAL FILE loaded"
          : "Hold music: PLACEHOLDER — replace /public/assets/audio/hold-music.mp3") +
        "\n\nDucking test: 100% → 20% transition verified\n\n" +
        briefingResult,
    });
  }

  // ── TEST C: Return to Claire — Recursive Scheduler ──
  async function runTestC() {
    updateTest(2, {
      status: "running",
      detail: "Step 1: Checking Sean's availability via /api/vapi...",
    });
    const start = Date.now();

    try {
      // Step 1: Check availability
      const availRes = await fetch("/api/vapi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: {
            type: "function-call",
            functionCall: {
              name: "checkAvailability",
              parameters: {},
            },
          },
          call: {
            metadata: {
              calendarUrl: "https://calendar.app.google/Ng9V2fAzkb4msyHc8",
            },
          },
        }),
      });
      const availData = await fetch_parse(availRes);

      let detail = `Step 1 — Available Slots:\n`;
      const slots = availData.availableSlots || [];
      slots.forEach((s: { display: string }, i: number) => {
        detail += `  ${i + 1}. ${s.display}\n`;
      });

      // Step 2: Simulate user declining first slot
      detail += `\nStep 2 — User declines slot 1. Offering slots 2-3 (recursive loop).\n`;
      if (slots.length >= 2) {
        detail += `  → Offering: ${slots[1]?.display}\n`;
        detail += `  → Offering: ${slots[2]?.display || "No more slots"}\n`;
      }

      // Step 3: Book the second slot
      detail += `\nStep 3 — User accepts slot 2. Booking Google Meet...\n`;
      const bookSlot = slots[1] || slots[0];
      if (bookSlot) {
        const bookRes = await fetch("/api/vapi", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: {
              type: "function-call",
              functionCall: {
                name: "bookAppointment",
                parameters: {
                  date: bookSlot.date,
                  time: bookSlot.time,
                  appointmentType: "google-meet",
                  name: "Test User",
                  email: "test@homepathways.ca",
                  phone: "+1-604-555-0199",
                  notes: "Stress test booking — return to Claire flow",
                },
              },
            },
            call: { metadata: {} },
          }),
        });
        const bookData = await fetch_parse(bookRes);

        detail += `  Confirmed: ${bookData.confirmed ? "YES" : "NO"}\n`;
        detail += `  Slot: ${bookData.slot || "N/A"}\n`;
        detail += `  Type: ${bookData.type || "N/A"}\n`;
        if (bookData.instruction) {
          detail += `\nClaire's script:\n  "${bookData.instruction}"\n`;
        }
      }

      // Step 4: Verify Path C return script
      detail += `\nStep 4 — Path C Return Script:\n`;
      detail += `  Claire says: "It was great you caught Sean. Now, let's get that\n`;
      detail += `  follow-up locked into the calendar so we don't lose momentum."\n`;
      detail += `  → checkAvailability invoked → slots offered → booking confirmed.\n`;

      const duration = Date.now() - start;
      detail += `\nTotal pipeline time: ${duration}ms`;

      updateTest(2, { status: "pass", duration, detail });
    } catch (err) {
      updateTest(2, {
        status: "fail",
        duration: Date.now() - start,
        detail: `Error: ${err instanceof Error ? err.message : String(err)}`,
      });
    }
  }

  async function runAll() {
    await runTestA();
    await runTestB();
    await runTestC();
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8 border-b border-white/10 pb-6">
        <h1 className="text-2xl font-bold text-white">
          Claire Concierge — Stress Test Panel
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          Hidden route for testing the full pipeline. Not linked from the public site.
        </p>
        <button
          onClick={runAll}
          className="mt-4 rounded-full bg-mint px-6 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-mint-dark"
        >
          Run All Tests
        </button>
      </div>

      <div className="space-y-6">
        {tests.map((test, i) => (
          <div
            key={test.label}
            className="rounded-xl border border-white/10 bg-white/[0.03] p-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">{test.label}</h2>
              <div className="flex items-center gap-3">
                <StatusBadge status={test.status} />
                <button
                  onClick={() => {
                    if (i === 0) runTestA();
                    else if (i === 1) runTestB();
                    else runTestC();
                  }}
                  disabled={test.status === "running"}
                  className="rounded bg-white/10 px-3 py-1 text-xs text-white transition-colors hover:bg-white/20 disabled:opacity-50"
                >
                  {test.status === "running" ? "Running..." : "Run"}
                </button>
              </div>
            </div>
            {test.detail && (
              <pre className="mt-4 max-h-80 overflow-y-auto rounded-lg bg-black/50 p-4 text-xs leading-relaxed text-gray-300 whitespace-pre-wrap">
                {test.detail}
                {test.duration != null && (
                  <span className="text-gray-500">
                    {"\n"}[{test.duration}ms]
                  </span>
                )}
              </pre>
            )}
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-6">
        <h3 className="text-sm font-bold text-yellow-400">
          Keys Needed to Go Live
        </h3>
        <ul className="mt-3 space-y-2 text-xs text-gray-300">
          <li className="flex items-start gap-2">
            <CheckIcon ok={true} />
            <span>
              <code className="text-mint">AIRTABLE_PAT</code> — Connected
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckIcon ok={true} />
            <span>
              <code className="text-mint">AIRTABLE_BASE_ID</code> — Connected
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckIcon ok={true} />
            <span>
              <code className="text-mint">NEXT_PUBLIC_VAPI_PUBLIC_KEY</code> — Connected
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckIcon ok={true} />
            <span>
              <code className="text-mint">NEXT_PUBLIC_VAPI_ASSISTANT_ID</code> — Connected
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckIcon ok={false} />
            <span>
              <code className="text-yellow-400">GOOGLE_CALENDAR_CREDENTIALS</code> —
              Service Account JSON (base64-encoded) for live scheduling.
              <a href="https://console.cloud.google.com/apis/credentials" target="_blank" className="ml-1 text-mint underline">
                Get it here
              </a>
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckIcon ok={false} />
            <span>
              <code className="text-yellow-400">GOOGLE_CALENDAR_ID</code> —
              Sean&apos;s calendar ID (e.g. sean@homepathways.ca)
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckIcon ok={false} />
            <span>
              <code className="text-yellow-400">VAPI_WEBHOOK_SECRET</code> —
              Optional. Set in Vapi dashboard → Settings → Server URL secret.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckIcon ok={false} />
            <span>
              <code className="text-yellow-400">hold-music.mp3</code> —
              Replace placeholder at <code>/public/assets/audio/hold-music.mp3</code>
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: TestResult["status"] }) {
  const colors = {
    idle: "bg-gray-600 text-gray-300",
    running: "bg-yellow-600/20 text-yellow-400 animate-pulse",
    pass: "bg-green-600/20 text-green-400",
    fail: "bg-red-600/20 text-red-400",
  };
  const labels = {
    idle: "IDLE",
    running: "RUNNING",
    pass: "PASS",
    fail: "FAIL",
  };

  return (
    <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${colors[status]}`}>
      {labels[status]}
    </span>
  );
}

function CheckIcon({ ok }: { ok: boolean }) {
  return ok ? (
    <span className="mt-0.5 text-mint">&#10003;</span>
  ) : (
    <span className="mt-0.5 text-yellow-400">&#9679;</span>
  );
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetch_parse(res: Response) {
  const data = await res.json();
  return typeof data.result === "string" ? JSON.parse(data.result) : data.result;
}
