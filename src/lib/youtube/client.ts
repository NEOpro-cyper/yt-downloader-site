/**
 * YouTube Download Client — vidssave.com API integration
 *
 * Self-contained: calls vidssave.com directly using node-fetch + https-proxy-agent.
 * No separate Express API needed!
 *
 * Flow (matches vidssave.com frontend):
 *   Step 1: POST media/parse → video info + all formats
 *     - Some formats have direct downloadUrl (360P, 48KBPS, 128KBPS)
 *     - Others have resourceContent token (needs Step 2)
 *   Step 2: POST media/download with resourceContent → task_id
 *   Step 3: GET media/download_query?task_id=… → SSE stream → download_link
 */

import type { YouTubeVideoInfo, YouTubeFormat } from './types';

// ─── Dynamic imports for Node.js-only modules ────────────────────────────────
// These only work in API routes (server-side), not in client components
let _fetch: any = null;
let _HttpsProxyAgent: any = null;
let _proxyAgent: any = null;

async function getProxyFetch() {
  if (_fetch && _HttpsProxyAgent) return { fetch: _fetch, agent: _proxyAgent };

  // Use node-fetch v2 (CJS) which supports `agent` option
  const nodeFetch = await import('node-fetch');
  _fetch = nodeFetch.default || nodeFetch;

  const proxyUrl = process.env.PROXY_URL || 'http://qijlkvsz-rotate:viryx2zv5njj@p.webshare.io:80';
  const { HttpsProxyAgent } = await import('https-proxy-agent');
  _HttpsProxyAgent = HttpsProxyAgent;
  _proxyAgent = new HttpsProxyAgent(proxyUrl);

  return { fetch: _fetch, agent: _proxyAgent };
}

// ─── Config ───────────────────────────────────────────────────────────────────
const VIDSSAVE_API = 'https://api.vidssave.com/api/contentsite_api';
const AUTH = '20250901majwlqo';
const DOMAIN = 'api-ak.vidssave.com';

const BROWSER_HEADERS: Record<string, string> = {
  'Origin': 'https://vidssave.com',
  'Referer': 'https://vidssave.com/youtube-video-downloader-7gt',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
  'Accept': 'application/json, text/plain, */*',
  'Accept-Language': 'en-US,en;q=0.9',
  'sec-ch-ua': '"Chromium";v="137", "Google Chrome";v="137"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Windows"',
  'Sec-Fetch-Dest': 'empty',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Site': 'same-site',
};

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

// ─── vidssave API ────────────────────────────────────────────────────────────

/** Step 1: Parse → video info + all formats (FAST: ~1-2s) */
async function vidssaveParse(ytUrl: string) {
  const { fetch: nodeFetch, agent } = await getProxyFetch();

  const body = new URLSearchParams({
    auth: AUTH,
    domain: DOMAIN,
    origin: 'source',
    link: ytUrl,
  }).toString();

  const resp = await nodeFetch(`${VIDSSAVE_API}/media/parse`, {
    method: 'POST',
    headers: {
      ...BROWSER_HEADERS,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
    agent,
  });

  const data = await resp.json();
  if (data.status === 0 && data.status_code === 'analyze_risk') {
    throw new Error('Video blocked by risk analysis. Please try again.');
  }
  if (data.status === 1 || data.data) return data.data;
  throw new Error(data.msg || 'Failed to parse video. Please check the URL and try again.');
}

/** Step 2: Request download → task_id */
async function vidssaveDownload(resourceContent: string): Promise<string> {
  const { fetch: nodeFetch, agent } = await getProxyFetch();

  const body = `auth=${AUTH}&domain=${DOMAIN}&request=${encodeURIComponent(resourceContent)}&no_encrypt=1`;

  const resp = await nodeFetch(`${VIDSSAVE_API}/media/download`, {
    method: 'POST',
    headers: {
      ...BROWSER_HEADERS,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
    agent,
  });

  const data = await resp.json();
  if (data.status === 1 && data.data && data.data.task_id) return data.data.task_id;
  throw new Error(data.msg || 'Download request failed');
}

/** Step 3: Read SSE stream → download_link */
async function vidssaveQueryDownload(taskId: string): Promise<{ downloadLink: string; filesize: number }> {
  const { fetch: nodeFetch, agent } = await getProxyFetch();

  const queryUrl = `${VIDSSAVE_API}/media/download_query?auth=${AUTH}&domain=${DOMAIN}&task_id=${encodeURIComponent(taskId)}&download_domain=vidssave.com&origin=content_site`;

  // Strategy 1: Read the SSE stream directly (fastest)
  try {
    const resp = await nodeFetch(queryUrl, {
      headers: { ...BROWSER_HEADERS },
      agent,
    });
    const text = await resp.text();
    if (text.includes('download_link')) {
      const match = text.match(/"download_link"\s*:\s*"([^"]+)"/);
      if (match) return { downloadLink: match[1], filesize: 0 };
      try {
        const json = JSON.parse(text.replace(/^event:.*\n/gm, '').replace(/^data:\s*/gm, ''));
        if (json.data && json.data.download_link) return { downloadLink: json.data.download_link, filesize: json.data.filesize || 0 };
      } catch (e) {}
    }
  } catch (err) {
    console.warn('[SSE stream] failed, falling back to polling:', err);
  }

  // Strategy 2: Fast polling at 500ms
  for (let attempt = 1; attempt <= 20; attempt++) {
    await new Promise(r => setTimeout(r, 500));
    try {
      const resp = await nodeFetch(queryUrl, { headers: { ...BROWSER_HEADERS }, agent });
      const text = await resp.text();
      if (text.includes('download_link')) {
        const match = text.match(/"download_link"\s*:\s*"([^"]+)"/);
        if (match) return { downloadLink: match[1], filesize: 0 };
        try {
          const json = JSON.parse(text);
          if (json.data && json.data.download_link) return { downloadLink: json.data.download_link, filesize: json.data.filesize || 0 };
        } catch (e) {}
      }
    } catch (err) {}
  }
  throw new Error('Download URL resolution timed out. Please try again.');
}

/** Resolve a resourceContent token → download URL (steps 2+3) */
export async function resolveResourceContent(resourceContent: string): Promise<{ downloadUrl: string; filesize: number }> {
  const taskId = await vidssaveDownload(resourceContent);
  const result = await vidssaveQueryDownload(taskId);
  return { downloadUrl: result.downloadLink, filesize: result.filesize };
}

// ─── Main API ─────────────────────────────────────────────────────────────────

/**
 * Get YouTube video info + all formats.
 * FAST: ~1-2s. Returns direct URLs for some formats (360P, audio),
 * and resourceContent tokens for others (1080P, 720P, 480P).
 */
export async function getVideoInfo(url: string): Promise<YouTubeVideoInfo> {
  const fullUrl = normalizeUrl(url);
  const videoId = extractVideoId(url);

  const parsed = await vidssaveParse(fullUrl);
  const resources = parsed.resources || [];
  const id = parsed.id || videoId || '';

  const formats: YouTubeFormat[] = resources.map((r: any) => {
    const isDirect = !!(r.download_url && r.download_mode === 'check_download');
    return {
      quality: r.quality,
      type: r.type,
      format: r.format,
      sizeBytes: r.size || 0,
      sizeMB: formatSize(r.size),
      downloadUrl: isDirect ? r.download_url : null,
      resourceContent: r.resource_content || null,
      isDirect,
    };
  });

  return {
    id,
    title: parsed.title || '',
    thumbnail: parsed.thumbnail || `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
    durationSeconds: parsed.duration || 0,
    durationHms: formatDuration(parsed.duration || 0),
    formats,
  };
}
