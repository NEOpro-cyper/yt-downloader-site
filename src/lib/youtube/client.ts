/**
 * YouTube Download Client — Uses our Node.js Express API as backend
 *
 * Flow:
 *   1. POST /api/youtube/info → calls Express API /parse → video info + formats
 *   2. POST /api/youtube/resolve → calls Express API /resolve → download URL
 *
 * The Express API handles the vidssave.com communication + Webshare proxy.
 * This client just talks to our own API.
 */

import type { YouTubeVideoInfo, YouTubeFormat } from './types';

// ─── Config ───────────────────────────────────────────────────────────────────
// The Express API URL — set NEXT_PUBLIC_API_URL in .env or it defaults to same-origin
const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

// ─── Rate Limiting ────────────────────────────────────────────────────────────
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 15;

export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = requestCounts.get(ip);
  if (!record || now > record.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  if (record.count >= MAX_REQUESTS_PER_WINDOW) return false;
  record.count++;
  return true;
}

// ─── URL Validation ──────────────────────────────────────────────────────────
const YOUTUBE_URL_PATTERNS = [
  /youtube\.com\/watch\?v=/i,
  /youtu\.be\//i,
  /youtube\.com\/embed\//i,
  /youtube\.com\/shorts\//i,
  /youtube\.com\/live\//i,
  /youtube\.com\/v\//i,
];

export function isValidYouTubeUrl(url: string): boolean {
  return YOUTUBE_URL_PATTERNS.some(pattern => pattern.test(url));
}

export function extractVideoId(url: string): string | null {
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/|youtube\.com\/live\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/,
  ];
  for (const pat of patterns) {
    const m = url.match(pat);
    if (m) return m[1];
  }
  return null;
}

export function normalizeUrl(url: string): string {
  url = url.trim();
  if (!url.startsWith('http')) return `https://www.youtube.com/watch?v=${url}`;
  const m = url.match(/https?:\/\/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (m) return `https://www.youtube.com/watch?v=${m[1]}`;
  return url;
}

// ─── Main API ─────────────────────────────────────────────────────────────────

/**
 * Get YouTube video info + all formats.
 * Calls our Express API /parse endpoint.
 * FAST: ~1-2s. Returns direct URLs for some formats (360P, audio),
 * and resourceContent tokens for others (1080P, 720P, 480P).
 */
export async function getVideoInfo(url: string): Promise<YouTubeVideoInfo> {
  const fullUrl = normalizeUrl(url);
  const videoId = extractVideoId(url);

  // Call our Express API /parse endpoint
  const parseUrl = `${API_BASE}/parse?url=${encodeURIComponent(fullUrl)}`;
  const resp = await fetch(parseUrl, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
  });

  if (!resp.ok) {
    const errorData = await resp.json().catch(() => ({ error: `HTTP ${resp.status}` }));
    throw new Error(errorData.error || `Parse failed with status ${resp.status}`);
  }

  const data = await resp.json();

  const formats: YouTubeFormat[] = (data.formats || []).map((f: any) => ({
    quality: f.quality,
    type: f.type,
    format: f.format,
    sizeBytes: f.sizeBytes || 0,
    sizeMB: f.sizeMB || null,
    downloadUrl: f.downloadUrl || null,
    resourceContent: f.resourceContent || null,
    isDirect: !!f.downloadUrl,
  }));

  return {
    id: data.id || videoId || '',
    title: data.title || '',
    thumbnail: data.thumbnail || `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
    durationSeconds: data.durationSeconds || 0,
    durationHms: data.durationHms || '0:00',
    formats,
  };
}

/**
 * Resolve a resourceContent token → download URL.
 * Calls our Express API /resolve endpoint.
 * ~4-7s per call.
 */
export async function resolveResourceContent(resourceContent: string): Promise<{ downloadUrl: string; filesize: number }> {
  const resolveUrl = `${API_BASE}/resolve`;
  const resp = await fetch(resolveUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rc: resourceContent }),
  });

  if (!resp.ok) {
    const errorData = await resp.json().catch(() => ({ error: `HTTP ${resp.status}` }));
    throw new Error(errorData.error || `Resolve failed with status ${resp.status}`);
  }

  const data = await resp.json();
  return {
    downloadUrl: data.downloadUrl,
    filesize: data.filesize || 0,
  };
}
