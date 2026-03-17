# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Claire is a voice-powered forensic equity audit assistant deployed at homepathways.ca. It uses the Vapi Web SDK for voice conversations with an AI assistant (Persona #9 / SEAN). The app is a lean client-side Next.js application — Vapi handles all backend AI logic.

## Commands

```bash
npm run dev      # Start dev server (Next.js)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint (flat config, Next.js core web vitals + TypeScript)
```

No test framework is configured.

## Tech Stack

- **Next.js 16** with App Router (not Pages Router)
- **React 19** with React Compiler enabled (`next.config.ts`)
- **TypeScript** in strict mode; path alias `@/*` → `./src/*`
- **Tailwind CSS 4** via PostCSS plugin
- **Vapi Web SDK 2.5** for voice call integration

## Architecture

- `src/app/layout.tsx` — Root layout with Geist font configuration
- `src/app/page.tsx` — Main (and only) page, marked `"use client"`. Contains all UI and Vapi call logic in a single component
- `src/app/globals.css` — Tailwind imports and CSS custom properties for dark/light theming
- No API routes, no component decomposition, no state management library — just React hooks (useState/useEffect)

## Environment Variables

- `NEXT_PUBLIC_VAPI_PUBLIC_KEY` — Required for Vapi SDK initialization

## Deployment

Static deployment via GitHub Pages with custom domain (CNAME: homepathways.ca).
