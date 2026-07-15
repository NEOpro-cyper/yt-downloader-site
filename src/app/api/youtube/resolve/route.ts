import { NextRequest, NextResponse } from 'next/server';
import { resolveQuality, normalizeUrl } from '@/lib/youtube/client';

export const maxDuration = 300;
export const dynamic = 'force-dynamic';

/**
 * YouTube Quality Resolve Route
 *
 * POST /api/youtube/resolve
 * Body: { url: "https://youtube.com/watch?v=...", quality: "1080p" }
 *
 * Takes a YouTube URL + quality label, calls the external API's /download
 * endpoint to resolve it to a direct download URL + audio URL.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, quality } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { success: false, error: 'YouTube video URL is required' },
        { status: 400 }
      );
    }

    if (!quality || typeof quality !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Quality parameter is required (e.g. "1080p", "720p")' },
        { status: 400 }
      );
    }

    const normalizedUrl = normalizeUrl(url);
    const result = await resolveQuality(normalizedUrl, quality);

    return NextResponse.json({
      success: true,
      data: {
        downloadUrl: result.downloadUrl,
        audioUrl: result.audioUrl || null,
        sizeMB: result.sizeMB || null,
      },
    });
  } catch (error: unknown) {
    console.error('[YouTube Resolve Error]', error);
    const message = error instanceof Error ? error.message : 'Failed to resolve download URL';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
