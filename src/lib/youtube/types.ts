/**
 * YouTube video download types — vidssave.com API
 */

export interface YouTubeFormat {
  /** Quality label, e.g. "1080P", "720P", "360P", "128KBPS" */
  quality: string;
  /** "video" or "audio" */
  type: 'video' | 'audio';
  /** File format: "MP4", "MP3" */
  format: string;
  /** File size in bytes */
  sizeBytes: number;
  /** File size in MB */
  sizeMB: number | null;
  /** Direct download URL (available for 360P, some audio — instant download) */
  downloadUrl: string | null;
  /** Token needed to resolve download URL (send to /api/youtube/resolve) */
  resourceContent: string | null;
  /** Whether this format has a direct URL from parse */
  isDirect: boolean;
}

export interface YouTubeVideoInfo {
  id: string;
  title: string;
  thumbnail: string;
  durationSeconds: number;
  durationHms: string;
  /** All available formats (video + audio) */
  formats: YouTubeFormat[];
}

export interface YouTubeInfoResponse {
  success: boolean;
  data?: YouTubeVideoInfo;
  error?: string;
}

export interface YouTubeResolveResponse {
  success: boolean;
  data?: {
    downloadUrl: string;
    filesize: number;
    sizeMB: number | null;
  };
  error?: string;
}
