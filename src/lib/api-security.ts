/**
 * API route security helpers.
 * - Origin validation (reject requests from unknown origins)
 * - Vapi webhook signature verification
 */
import { NextRequest } from "next/server";

const ALLOWED_ORIGINS = [
  "https://homepathways.ca",
  "https://www.homepathways.ca",
  "http://localhost:3000",
  "http://localhost:3001",
];

// Vapi's known server IPs/origins
const VAPI_ORIGINS = [
  "https://api.vapi.ai",
];

/**
 * Validate that the request comes from an allowed origin.
 * Returns null if valid, or an error message if rejected.
 */
export function validateOrigin(req: NextRequest): string | null {
  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");

  // Allow requests with no origin (server-to-server, Vapi webhooks)
  if (!origin && !referer) return null;

  // Check origin header
  if (origin) {
    if (
      ALLOWED_ORIGINS.includes(origin) ||
      VAPI_ORIGINS.includes(origin)
    ) {
      return null;
    }
    return `Rejected origin: ${origin}`;
  }

  // Check referer as fallback
  if (referer) {
    const refOrigin = new URL(referer).origin;
    if (
      ALLOWED_ORIGINS.includes(refOrigin) ||
      VAPI_ORIGINS.includes(refOrigin)
    ) {
      return null;
    }
    return `Rejected referer: ${referer}`;
  }

  return null;
}

/**
 * Validate Vapi webhook secret (if configured).
 * Vapi sends an x-vapi-secret header with each request.
 */
export function validateVapiSecret(req: NextRequest): boolean {
  const secret = process.env.VAPI_WEBHOOK_SECRET;
  if (!secret) return true; // No secret configured, skip validation

  const headerSecret = req.headers.get("x-vapi-secret");
  return headerSecret === secret;
}
