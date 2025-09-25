// lib/api.ts
export const API_URL = "https://vgc.psofttechnologies.in/api/v1/pages";
export const IMAGE_BASE = "https://vgc.psofttechnologies.in/storage/builder/";

/**
 * Fetch with timeout
 */
export async function fetchWithTimeout(input: RequestInfo, init: RequestInit = {}, timeoutMs = 7000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(input, { ...init, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(id);
  }
}

/**
 * Ensure provided image path becomes an absolute URL acceptable by next/image.
 * Accepts already-absolute URLs or builder/relative paths returned by API.
 */
export function ensureUrl(path?: string | null) {
  if (!path) return "";
  if (/^https?:\/\//.test(path)) return path;
  // strip leading slashes and optional "builder/" prefix
  const normalized = String(path).replace(/^\/+/, "").replace(/^builder\//, "");
  return IMAGE_BASE + normalized;
}

/**
 * Remove HTML tags (simple)
 */
export function stripHtml(html = ""): string {
  return String(html).replace(/<[^>]+>/g, "").trim();
}
