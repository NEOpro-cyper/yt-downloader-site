'use client';

import { useState, useCallback, useRef } from 'react';
import { ArrowDownToLine, Loader2, Clipboard, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface YouTubeInputProps {
  onFetch: (url: string) => void;
  isLoading: boolean;
}

export function YouTubeInput({ onFetch, isLoading }: YouTubeInputProps) {
  const [url, setUrl] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const isValidYouTubeUrl = (text: string): boolean => {
    if (/^[a-zA-Z0-9_-]{11}$/.test(text)) return true;
    return /^(https?:\/\/)?(www\.|m\.)?(youtube\.com\/(watch\?v=|embed\/|shorts\/|live\/|v\/)|youtu\.be\/)/i.test(text);
  };

  const handleSubmit = useCallback(() => {
    const trimmed = url.trim();
    if (!trimmed) return;
    if (!isValidYouTubeUrl(trimmed)) return;
    onFetch(trimmed);
  }, [url, onFetch]);

  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
      if (isValidYouTubeUrl(text)) {
        onFetch(text);
      }
    } catch {
      // Clipboard API not available
    }
  }, [onFetch]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  }, [handleSubmit]);

  const validUrl = url.trim() ? isValidYouTubeUrl(url.trim()) : true;

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className={`flex flex-col sm:flex-row gap-3 p-2 bg-card border-2 rounded-2xl shadow-lg transition-colors ${
        validUrl ? 'border-border hover:border-red-500/50 focus-within:border-red-500' : 'border-red-500'
      }`}>
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Paste your YouTube video link here..."
            className="w-full h-12 px-4 pr-20 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-base"
            autoComplete="off"
            spellCheck={false}
            disabled={isLoading}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {url && (
              <button
                onClick={() => setUrl('')}
                className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Clear"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={handlePaste}
              className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Paste from clipboard"
            >
              <Clipboard className="w-4 h-4" />
            </button>
          </div>
        </div>
        <Button
          onClick={handleSubmit}
          disabled={isLoading || !url.trim() || !validUrl}
          className="h-12 px-8 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold text-base gap-2 shrink-0"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Loading...</span>
            </>
          ) : (
            <>
              <ArrowDownToLine className="w-5 h-5" />
              <span>Download</span>
            </>
          )}
        </Button>
      </div>
      {!validUrl && (
        <p className="text-sm text-red-500 mt-2 text-center">
          Please enter a valid YouTube video URL (e.g., youtube.com/watch?v=..., youtu.be/..., youtube.com/shorts/...)
        </p>
      )}
    </div>
  );
}
