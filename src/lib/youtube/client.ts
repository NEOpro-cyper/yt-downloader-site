/**
 * YouTube Download Client — uses Express API for vidssave.com calls
 *
 * Flow:
 *   1. GET /parse?url=<YT> → video info + all formats (2-3s)
 *   2. For non-direct formats → GET /resolve?rc=<token> (each one separately)
 *
 * Auto-resolves only top 2 highest video qualities that need resolving.
 */

import type { YouTubeVideoInfo, YouTubeFormat } from './types';

// ─── Config ───────────────────────────────────────────────────────────────────
// Express API URL — handles vidssave.com + proxy
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

// ─── Utility ─────────────────────────────────────────────────────────────────
function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function formatSize(bytes: number): number | null {
  if (!bytes) return null;
  return Math.round(bytes / 1048576 * 100) / 100;
}

// ─── API Calls ────────────────────────────────────────────────────────────────

/** Parse: GET /parse?url=<YT_URL> */
async function apiParse(ytUrl: string) {
  const url = `${API_BASE}/parse?url=${encodeURIComponent(ytUrl)}`;
  const resp = await fetch(url, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ error: `HTTP ${resp.status}` }));
    throw new Error(err.error || `Parse failed (${resp.status})`);
  }

  const data = await resp.json();
  return data;
}

/** Resolve: GET /resolve?rc=<resourceContent> */
async function apiResolve(resourceContent: string): Promise<{ downloadUrl: string; filesize: number }> {
  const url = `${API_BASE}/resolve?rc=${encodeURIComponent(resourceContent)}`;
  const resp = await fetch(url, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ error: `HTTP ${resp.status}` }));
    throw new Error(err.error || `Resolve failed (${resp.status})`);
  }

  const data = await resp.json();
  return {
    downloadUrl: data.downloadUrl,
    filesize: data.filesize || 0,
  };
}

// ─── Main API ─────────────────────────────────────────────────────────────────

/**
 * Get YouTube video info + all formats.
 * Calls Express API /parse — returns formats with direct URLs + resourceContent tokens.
 */
export async function getVideoInfo(url: string): Promise<YouTubeVideoInfo> {
  const fullUrl = normalizeUrl(url);
  const videoId = extractVideoId(url);

  const parsed = await apiParse(fullUrl);

  const formats: YouTubeFormat[] = (parsed.formats || []).map((f: any) => ({
    quality: f.quality,
    type: f.type,
    format: f.format,
    sizeBytes: f.sizeBytes || 0,
    sizeMB: f.sizeMB || formatSize(f.sizeBytes),
    downloadUrl: f.downloadUrl || null,
    resourceContent: f.resourceContent || null,
    isDirect: !!f.downloadUrl,
  }));

  return {
    id: parsed.id || videoId || '',
    title: parsed.title || '',
    thumbnail: parsed.thumbnail || `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
    durationSeconds: parsed.durationSeconds || 0,
    durationHms: parsed.durationHms || '0:00',
    formats,
  };
}

/**
 * Resolve a single resourceContent token → download URL.
 * Each call is independent — one API request per quality.
 */
export async function resolveResourceContent(resourceContent: string): Promise<{ downloadUrl: string; filesize: number }> {
  return apiResolve(resourceContent);
}

/**
 * Get the top N non-direct video formats to auto-resolve.
 * Strategy: pick top 2 highest qualities that need resolving.
 * E.g. if 1080P + 720P need resolve → resolve both.
 * If 1080P not available → resolve 720P + 480P instead.
 */
export function getTopFormatsToAutoResolve(formats: YouTubeFormat[], count: number = 2): YouTubeFormat[] {
  const nonDirectVideo = formats.filter(f => f.type === 'video' && !f.isDirect && f.resourceContent);
  return nonDirectVideo.slice(0, count);
}
