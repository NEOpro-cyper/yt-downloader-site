'use client';

import { useState, useCallback, useEffect } from 'react';
import { Download, Loader2, X, Eye, Pause, Film, Zap, Headphones, MonitorSmartphone, ChevronDown, ChevronUp, Music, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { YouTubeVideoInfo, YouTubeFormat } from '@/lib/youtube/types';

interface YouTubeResultCardProps {
  video: YouTubeVideoInfo;
  onReset: () => void;
}

function formatFileSize(bytes: number | null): string {
  if (!bytes) return '';
  if (bytes >= 1_073_741_824) return `${(bytes / 1_073_741_824).toFixed(1)} GB`;
  if (bytes >= 1_048_576) return `${(bytes / 1_048_576).toFixed(1)} MB`;
  if (bytes >= 1_024) return `${(bytes / 1_024).toFixed(0)} KB`;
  return `${bytes} B`;
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

function isVideoFormat(f: YouTubeFormat): boolean {
  return f.type === 'video';
}

function isAudioFormat(f: YouTubeFormat): boolean {
  return f.type === 'audio';
}

export function YouTubeResultCard({ video, onReset }: YouTubeResultCardProps) {
  const [resolvingUrls, setResolvingUrls] = useState<Set<string>>(new Set());
  const [resolvedUrls, setResolvedUrls] = useState<Map<string, string>>(new Map());
  const [resolveErrors, setResolveErrors] = useState<Map<string, string>>(new Map());
  const [downloadingUrl, setDownloadingUrl] = useState<string | null>(null);
  const [showAllQualities, setShowAllQualities] = useState(false);

  const videoFormats = video.formats.filter(isVideoFormat);
  const audioFormats = video.formats.filter(isAudioFormat);

  const topVideoFormats = videoFormats.slice(0, 3);
  const moreVideoFormats = videoFormats.slice(3);
  const visibleVideoFormats = showAllQualities ? videoFormats : topVideoFormats;

  /** Resolve a resourceContent token to get the actual download URL */
  const resolveUrl = useCallback(async (format: YouTubeFormat) => {
    if (format.downloadUrl) return format.downloadUrl; // Already direct
    if (!format.resourceContent) return null;
    if (resolvedUrls.has(format.resourceContent)) return resolvedUrls.get(format.resourceContent)!;

    const rc = format.resourceContent;
    setResolvingUrls(prev => new Set(prev).add(rc));
    setResolveErrors(prev => { const m = new Map(prev); m.delete(rc); return m; });

    try {
      const response = await fetch('/api/youtube/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resourceContent: rc }),
      });

      const data = await response.json();
      if (data.success && data.data?.downloadUrl) {
        setResolvedUrls(prev => new Map(prev).set(rc, data.data.downloadUrl));
        return data.data.downloadUrl;
      }
      const errMsg = data.error || 'Failed to resolve';
      setResolveErrors(prev => new Map(prev).set(rc, errMsg));
      throw new Error(errMsg);
    } catch (err: any) {
      const errMsg = err.message || 'Resolve failed';
      setResolveErrors(prev => new Map(prev).set(rc, errMsg));
      console.error('[YouTube Resolve] Failed:', errMsg);
      throw err;
    } finally {
      setResolvingUrls(prev => {
        const next = new Set(prev);
        next.delete(rc);
        return next;
      });
    }
  }, [resolvedUrls]);

  /** Auto-resolve non-direct formats on mount (one at a time, top qualities first) */
  useEffect(() => {
    const nonDirectFormats = [...videoFormats, ...audioFormats].filter(
      f => !f.isDirect && f.resourceContent && !resolvedUrls.has(f.resourceContent) && !resolvingUrls.has(f.resourceContent)
    );
    if (nonDirectFormats.length === 0) return;

    // Resolve top 3 non-direct formats automatically
    const toResolve = nonDirectFormats.slice(0, 3);
    let cancelled = false;

    (async () => {
      for (const format of toResolve) {
        if (cancelled) break;
        try {
          await resolveUrl(format);
        } catch {}
      }
    })();

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [video.id]);

  /** Handle download click — resolve URL if needed, then download */
  const handleDownload = useCallback(async (format: YouTubeFormat) => {
    try {
      const downloadUrl = await resolveUrl(format);
      if (!downloadUrl) {
        alert('No download URL available for this format.');
        return;
      }

      setDownloadingUrl(downloadUrl);

      // Build proxied download URL
      const ext = format.type === 'audio' ? 'mp3' : 'mp4';
      const filename = `youtube-${video.id}-${format.quality}.${ext}`;
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

      const disposition = response.headers.get('content-disposition') || '';
      let filenameOut = filename;
      const filenameMatch = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (filenameMatch && filenameMatch[1]) {
        filenameOut = filenameMatch[1].replace(/['"]/g, '');
        filenameOut = decodeURIComponent(filenameOut);
      }

      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filenameOut;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('[YouTube Download] Failed:', err);
      alert('Download failed. Please try again.');
    } finally {
      setDownloadingUrl(null);
    }
  }, [video, resolveUrl]);

  /** Get effective URL for a format (direct or resolved) */
  const getEffectiveUrl = useCallback((format: YouTubeFormat): string | null => {
    if (format.downloadUrl) return format.downloadUrl;
    if (format.resourceContent && resolvedUrls.has(format.resourceContent)) {
      return resolvedUrls.get(format.resourceContent)!;
    }
    return null;
  }, [resolvedUrls]);

  /** Check if a format is currently being resolved */
  const isResolving = useCallback((format: YouTubeFormat): boolean => {
    return !format.downloadUrl && !!format.resourceContent && resolvingUrls.has(format.resourceContent);
  }, [resolvingUrls]);

  /** Get error for a format */
  const getError = useCallback((format: YouTubeFormat): string | null => {
    if (!format.resourceContent) return null;
    return resolveErrors.get(format.resourceContent) || null;
  }, [resolveErrors]);

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg">
      <div className="flex flex-col md:flex-row">
        {/* Thumbnail */}
        <div className="relative md:w-80 shrink-0 aspect-video md:aspect-auto">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover"
            style={{ minHeight: '200px' }}
          />
          {/* Duration badge */}
          {video.durationHms && (
            <div className="absolute bottom-2 right-2 text-white text-xs font-medium px-2 py-1 rounded bg-black/80">
              {video.durationHms}
            </div>
          )}
          {/* Close button */}
          <button
            onClick={onReset}
            className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full hover:bg-black/80 transition-colors z-10"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Info & Download */}
        <div className="flex-1 p-4 md:p-6 space-y-4">
          <h2 className="text-lg md:text-xl font-semibold leading-tight line-clamp-2">
            {video.title}
          </h2>

          {/* ─── Video Formats ─── */}
          {videoFormats.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  Video ({videoFormats.length} qualit{videoFormats.length !== 1 ? 'ies' : 'y'})
                </p>
                {videoFormats.length > 0 && (
                  <span className="text-xs text-muted-foreground">
                    Best: {videoFormats[0].quality}
                  </span>
                )}
              </div>

              {/* Quality list */}
              <div className="space-y-2">
                {visibleVideoFormats.map((f, idx) => {
                  const effectiveUrl = getEffectiveUrl(f);
                  const resolving = isResolving(f);
                  const error = getError(f);
                  const isDownloading = downloadingUrl === effectiveUrl;
                  const isLoading = resolving || isDownloading;

                  return (
                    <div
                      key={`v-${idx}-${f.quality}`}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all group ${
                        error ? 'border-red-500/30 bg-red-500/5' : 'border-border hover:border-red-500/30 hover:bg-red-500/5'
                      }`}
                    >
                      {/* Quality badge */}
                      <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-bold border ${getQualityBadgeColor(f.quality)}`}>
                        {getQualityIcon(f.quality)}
                        {f.quality}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium text-foreground">{f.format}</span>
                          {f.isDirect && (
                            <span className="text-xs bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded font-medium">
                              DIRECT
                            </span>
                          )}
                          {idx === 0 && !f.isDirect && !error && (
                            <span className="text-xs bg-red-600/20 text-red-400 px-1.5 py-0.5 rounded font-medium">
                              BEST
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                          {f.sizeMB ? <span>{f.sizeMB} MB</span> : null}
                          {resolving && (
                            <span className="text-blue-400 flex items-center gap-1">
                              <Loader2 className="w-3 h-3 animate-spin" />
                              Resolving...
                            </span>
                          )}
                          {!f.isDirect && !effectiveUrl && !resolving && !error && (
                            <span className="text-yellow-500">Waiting to resolve...</span>
                          )}
                          {error && (
                            <span className="text-red-400 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {error}
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
                          error
                            ? 'bg-red-600 hover:bg-red-700 text-white'
                            : idx === 0
                              ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20'
                              : 'bg-red-600/10 hover:bg-red-600/20 text-red-500 border border-red-500/30'
                        }`}
                      >
                        {isLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : error ? (
                          <RefreshCw className="w-4 h-4" />
                        ) : (
                          <Download className="w-4 h-4" />
                        )}
                        <span>{isLoading ? '...' : error ? 'Retry' : 'MP4'}</span>
                      </Button>
                    </div>
                  );
                })}
              </div>

              {/* Show more / less */}
              {moreVideoFormats.length > 0 && (
                <button
                  onClick={() => setShowAllQualities(!showAllQualities)}
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-red-500 transition-colors w-full justify-center py-1"
                >
                  {showAllQualities ? (
                    <>
                      <ChevronUp className="w-4 h-4" />
                      Show less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      Show {moreVideoFormats.length} more qualit{moreVideoFormats.length === 1 ? 'y' : 'ies'}
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {/* ─── Audio Formats ─── */}
          {audioFormats.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Audio ({audioFormats.length} format{audioFormats.length !== 1 ? 's' : ''})
              </p>
              <div className="space-y-2">
                {audioFormats.map((f, idx) => {
                  const effectiveUrl = getEffectiveUrl(f);
                  const resolving = isResolving(f);
                  const error = getError(f);
                  const isDownloading = downloadingUrl === effectiveUrl;
                  const isLoading = resolving || isDownloading;

                  return (
                    <div
                      key={`a-${idx}-${f.quality}`}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all group ${
                        error ? 'border-red-500/30 bg-red-500/5' : 'border-border hover:border-purple-500/30 hover:bg-purple-500/5'
                      }`}
                    >
                      {/* Audio badge */}
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-bold border bg-purple-500/20 text-purple-400 border-purple-500/30">
                        <Headphones className="w-3.5 h-3.5" />
                        {f.quality}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium text-foreground">{f.format}</span>
                          {f.isDirect && (
                            <span className="text-xs bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded font-medium">
                              DIRECT
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                          {f.sizeMB ? <span>{f.sizeMB} MB</span> : null}
                          {resolving && (
                            <span className="text-blue-400 flex items-center gap-1">
                              <Loader2 className="w-3 h-3 animate-spin" />
                              Resolving...
                            </span>
                          )}
                          {error && (
                            <span className="text-red-400 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {error}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Download button */}
                      <Button
                        onClick={() => handleDownload(f)}
                        disabled={isLoading}
                        size="sm"
                        className="h-9 rounded-lg gap-1.5 text-sm font-semibold bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 border border-purple-500/30 hover:border-purple-500/50"
                      >
                        {isLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : error ? (
                          <RefreshCw className="w-4 h-4" />
                        ) : (
                          <Download className="w-4 h-4" />
                        )}
                        <span>{isLoading ? '...' : error ? 'Retry' : 'MP3'}</span>
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* No formats */}
          {videoFormats.length === 0 && audioFormats.length === 0 && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 text-center">
              <p className="text-sm text-muted-foreground">
                No download formats available. This video may be private, age-restricted, or the format is not supported.
              </p>
            </div>
          )}

          {/* Merge tip for HD formats */}
          <p className="text-xs text-muted-foreground">
            1080P/720P video-only files need to be merged with audio using ffmpeg: <code className="text-foreground/60">ffmpeg -i video.mp4 -i audio.mp3 -c copy output.mp4</code>
          </p>
        </div>
      </div>
    </div>
  );
}
