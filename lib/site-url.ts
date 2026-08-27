/**
 * Canonical origin for anything that has to hand a URL back to the user:
 * Supabase auth callbacks, share links, emails.
 *
 * Preview deployments keep their own origin so auth still works there, but any
 * production *.vercel.app hit is redirected to Quero.in at the edge
 * (see vercel.json), so links must never be minted against that host.
 */
export const CANONICAL_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL as any;

export function siteOrigin(): string {
  if (typeof window === "undefined") return CANONICAL_ORIGIN;

  const { origin, hostname } = window.location;

  // Local dev and Vercel deployments: use whatever origin we are actually on.
  if (hostname === "localhost" || hostname === "127.0.0.1") return origin;
  if (hostname.endsWith(".vercel.app")) return origin;

  return CANONICAL_ORIGIN;
}

/** Absolute URL on the canonical origin, e.g. siteUrl("/auth"). */
export function siteUrl(path = "/"): string {
  return new URL(path, siteOrigin()).toString();
}
