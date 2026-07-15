'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Download, Loader2, X, Film, Zap, Headphones, ChevronDown, ChevronUp, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { YouTubeVideoInfo, YouTubeFormat } from '@/lib/youtube/types';
import { getTopFormatsToAutoResolve, WORKER_URL } from '@/lib/youtube/client';

interface YouTubeResultCardProps {
  video: YouTubeVideoInfo;
  onReset: () => void;
}

function getQualityBadgeColor(quality: string): string {
  const q = quality.toUpperCase();
  if (q.includes('1080')) return 'bg-green-500/20 text-green-400 border-green-500/30';
  if (q.includes('720')) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
  if (q.includes('480')) return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
  if (q.includes('360')) return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
  if (q.includes('256') || q.includes('128') || q.includes('48')) return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
  return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
}

function getQualityIcon(quality: string) {
  const q = quality.toUpperCase();
  if (q.includes('1080') || q.includes('720')) return <Zap className="w-3.5 h-3.5" />;
  if (q.includes('KBPS') || q.includes('LOW')) return <Headphones className="w-3.5 h-3.5" />;
  return <Film className="w-3.5 h-3.5" />;
}

export function YouTubeResultCard({ video, onReset }: YouTubeResultCardProps) {
  // Track resolved URLs: quality → downloadUrl
  const [resolvedUrls, setResolvedUrls] = useState<Map<string, string>>(new Map());
  // Track audio URLs: quality → audioUrl
  const [resolvedAudioUrls, setResolvedAudioUrls] = useState<Map<string, string>>(new Map());
  // Track which are currently resolving (by quality)
  const [resolving, setResolving] = useState<Set<string>>(new Set());
  // Track errors: quality → error message
  const [errors, setErrors] = useState<Map<string, string>>(new Map());
  const [downloadingUrl, setDownloadingUrl] = useState<string | null>(null);
  const [showAllQualities, setShowAllQualities] = useState(false);

  // Prevent double auto-resolve
  const autoResolvedRef = useRef(false);

  const videoFormats = video.formats.filter(f => f.type === 'video');
  const audioFormats = video.formats.filter(f => f.type === 'audio');

  const topVideoFormats = videoFormats.slice(0, 3);
  const moreVideoFormats = videoFormats.slice(3);
  const visibleVideoFormats = showAllQualities ? videoFormats : topVideoFormats;

  /** Resolve a single quality — one API call per quality */
  const resolveFormat = useCallback(async (format: YouTubeFormat) => {
    // Already has direct URL from parse
    if (format.downloadUrl) return format.downloadUrl;
    // Already resolved?
    if (resolvedUrls.has(format.quality)) return resolvedUrls.get(format.quality)!;

    const q = format.quality;
    setResolving(prev => new Set(prev).add(q));
    setErrors(prev => { const m = new Map(prev); m.delete(q); return m; });

    try {
      const response = await fetch('/api/youtube/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: `https://www.youtube.com/watch?v=${video.id}`, quality: q }),
      });

      const data = await response.json();
      if (data.success && data.data?.downloadUrl) {
        setResolvedUrls(prev => new Map(prev).set(q, data.data.downloadUrl));
        // Store audio URL if provided (for merge tip)
        if (data.data.audioUrl) {
          setResolvedAudioUrls(prev => new Map(prev).set(q, data.data.audioUrl));
        }
        return data.data.downloadUrl;
      }
      const errMsg = data.error || 'Resolve failed';
      setErrors(prev => new Map(prev).set(q, errMsg));
      return null;
    } catch (err: any) {
      const errMsg = err.message || 'Network error';
      setErrors(prev => new Map(prev).set(q, errMsg));
      return null;
    } finally {
      setResolving(prev => { const s = new Set(prev); s.delete(q); return s; });
    }
  }, [resolvedUrls, video.id]);

  /** Auto-resolve top 2 non-direct video formats on mount */
  useEffect(() => {
    if (autoResolvedRef.current) return;
    autoResolvedRef.current = true;

    const toResolve = getTopFormatsToAutoResolve(video.formats, 2);
    if (toResolve.length === 0) return;

    // Resolve each one separately (not Promise.all — so they show progress one by one)
    let cancelled = false;
    (async () => {
      for (const format of toResolve) {
        if (cancelled) break;
        await resolveFormat(format);
      }
    })();

    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /** Handle download click */
  const handleDownload = useCallback(async (format: YouTubeFormat) => {
    try {
      let downloadUrl: string | null = null;

      // Already has direct URL from parse?
      if (format.downloadUrl) {
        downloadUrl = format.downloadUrl;
      } else if (resolvedUrls.has(format.quality)) {
        downloadUrl = resolvedUrls.get(format.quality)!;
      } else {
        // Not resolved yet — resolve now
        downloadUrl = await resolveFormat(format);
      }

      if (!downloadUrl) {
        alert('Could not get download URL. Please try again.');
        return;
      }

      setDownloadingUrl(downloadUrl);

      const ext = format.type === 'audio' ? 'mp3' : 'mp4';
      const filename = `youtube-${video.id}-${format.quality}.${ext}`;

      // Determine if this is a googlevideo URL (can be accessed directly by browser)
      const isGooglevideo = downloadUrl.includes('googlevideo.com');

      if (WORKER_URL) {
        // Use Cloudflare Worker for download (saves VPS bandwidth)
        // Worker handles vidssave redirect URLs (follows 302 + streams)
        // For googlevideo URLs: Worker redirects browser directly
        const workerUrl = `${WORKER_URL}/download?url=${encodeURIComponent(downloadUrl)}&filename=${encodeURIComponent(filename)}`;

        if (isGooglevideo) {
          // googlevideo: Worker will redirect browser directly — open in new tab
          window.open(workerUrl, '_blank');
        } else {
          // vidssave redirect URL: Worker streams the file — download via blob
          const response = await fetch(workerUrl);
          const contentType = response.headers.get('content-type') || '';

          if (contentType.includes('application/json')) {
            const data = await response.json();
            alert(data.error || 'Download failed');
            return;
          }

          const blob = await response.blob();
          const blobUrl = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(blobUrl);
        }
      } else {
        // Fallback: use VPS download proxy (if Worker URL not configured)
        const proxyUrl = `/api/youtube/download?url=${encodeURIComponent(downloadUrl)}&filename=${encodeURIComponent(filename)}`;
        const response = await fetch(proxyUrl);
        const contentType = response.headers.get('content-type') || '';

        if (contentType.includes('application/json')) {
          const data = await response.json();
          alert(data.error || 'Download failed');
          return;
        }

        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(blobUrl);
      }
    } catch (err) {
      console.error('[Download] Failed:', err);
      alert('Download failed. Please try again.');
    } finally {
      setDownloadingUrl(null);
    }
  }, [video, resolvedUrls, resolveFormat]);

  /** Get effective download URL for a format */
  const getUrl = useCallback((f: YouTubeFormat): string | null => {
    if (f.downloadUrl) return f.downloadUrl;
    return resolvedUrls.get(f.quality) || null;
  }, [resolvedUrls]);

  /** Format row — reused for video and audio */
  const FormatRow = ({ f, idx, variant }: { f: YouTubeFormat; idx: number; variant: 'video' | 'audio' }) => {
    const url = getUrl(f);
    const isResolving = !f.isDirect && resolving.has(f.quality);
    const error = !f.isDirect ? errors.get(f.quality) : null;
    const isDownloading = downloadingUrl === url;
    const isLoading = isResolving || isDownloading;
    const isAudio = variant === 'audio';

    return (
      <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
        error ? 'border-red-500/30 bg-red-500/5' :
        isAudio ? 'border-border hover:border-purple-500/30 hover:bg-purple-500/5' :
        'border-border hover:border-red-500/30 hover:bg-red-500/5'
      }`}>
        {/* Quality badge */}
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-bold border ${
          isAudio ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : getQualityBadgeColor(f.quality)
        }`}>
          {getQualityIcon(f.quality)}
          {f.quality}
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium text-foreground">{f.format}</span>
            {f.isDirect && (
              <span className="text-xs bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded font-medium">DIRECT</span>
            )}
            {idx === 0 && !f.isDirect && !isAudio && !error && (
              <span className="text-xs bg-red-600/20 text-red-400 px-1.5 py-0.5 rounded font-medium">BEST</span>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
            {f.sizeMB ? <span>{f.sizeMB} MB</span> : null}
            {isResolving && (
              <span className="text-blue-400 flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" /> Resolving...
              </span>
            )}
            {!f.isDirect && !url && !isResolving && !error && (
              <span className="text-muted-foreground/60">Click to resolve</span>
            )}
            {error && (
              <span className="text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {error}
              </span>
            )}
          </div>
        </div>

        {/* Download button */}
        <Button
          onClick={() => handleDownload(f)}
          disabled={isLoading}
          size="sm"
          className={`h-9 rounded-lg gap-1.5 text-sm font-semibold ${
            error ? 'bg-red-600 hover:bg-red-700 text-white' :
            isAudio ? 'bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 border border-purple-500/30' :
            idx === 0 ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20' :
            'bg-red-600/10 hover:bg-red-600/20 text-red-500 border border-red-500/30'
          }`}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : error ? (
            <RefreshCw className="w-4 h-4" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span>{isLoading ? '...' : error ? 'Retry' : isAudio ? 'MP3' : 'MP4'}</span>
        </Button>
      </div>
    );
  };

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg">
      <div className="flex flex-col md:flex-row">
        {/* Thumbnail */}
        <div className="relative md:w-80 shrink-0 aspect-video md:aspect-auto">
          <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" style={{ minHeight: '200px' }} />
          {video.durationHms && (
            <div className="absolute bottom-2 right-2 text-white text-xs font-medium px-2 py-1 rounded bg-black/80">
              {video.durationHms}
            </div>
          )}
          <button onClick={onReset} className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full hover:bg-black/80 transition-colors z-10" aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Info & Download */}
        <div className="flex-1 p-4 md:p-6 space-y-4">
          <h2 className="text-lg md:text-xl font-semibold leading-tight line-clamp-2">{video.title}</h2>

          {/* Video Formats */}
          {videoFormats.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  Video ({videoFormats.length} qualit{videoFormats.length !== 1 ? 'ies' : 'y'})
                </p>
                {videoFormats[0] && (
                  <span className="text-xs text-muted-foreground">Best: {videoFormats[0].quality}</span>
                )}
              </div>
              <div className="space-y-2">
                {visibleVideoFormats.map((f, idx) => (
                  <FormatRow key={`v-${idx}-${f.quality}`} f={f} idx={idx} variant="video" />
                ))}
              </div>
              {moreVideoFormats.length > 0 && (
                <button onClick={() => setShowAllQualities(!showAllQualities)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-red-500 transition-colors w-full justify-center py-1">
                  {showAllQualities ? <><ChevronUp className="w-4 h-4" /> Show less</> : <><ChevronDown className="w-4 h-4" /> Show {moreVideoFormats.length} more</>}
                </button>
              )}
            </div>
          )}

          {/* Audio Formats */}
          {audioFormats.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Audio ({audioFormats.length} format{audioFormats.length !== 1 ? 's' : ''})
              </p>
              <div className="space-y-2">
                {audioFormats.map((f, idx) => (
                  <FormatRow key={`a-${idx}-${f.quality}`} f={f} idx={idx} variant="audio" />
                ))}
              </div>
            </div>
          )}

          {/* No formats */}
          {videoFormats.length === 0 && audioFormats.length === 0 && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 text-center">
              <p className="text-sm text-muted-foreground">No download formats available. This video may be private, age-restricted, or not supported.</p>
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            1080P/720P are video-only. Merge with audio: <code className="text-foreground/60">ffmpeg -i video.mp4 -i audio.mp3 -c copy output.mp4</code>
          </p>
        </div>
      </div>
    </div>
  );
}
