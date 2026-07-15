import { NextRequest, NextResponse } from 'next/server';
import { isValidYouTubeUrl, checkRateLimit, getVideoInfo, extractVideoId } from '@/lib/youtube/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { success: false, error: 'YouTube video URL is required' },
        { status: 400 }
      );
    }

    if (!isValidYouTubeUrl(url) && !extractVideoId(url)) {
      return NextResponse.json(
        { success: false, error: 'Invalid YouTube URL. Please paste a valid YouTube video link (youtube.com/watch?v=..., youtu.be/..., youtube.com/shorts/...)' },
        { status: 400 }
      );
    }

    // Rate limiting
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || 'unknown';

    if (!checkRateLimit(clientIp)) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please wait a minute and try again.' },
        { status: 429 }
      );
    }

    const videoInfo = await getVideoInfo(url);

    return NextResponse.json({
      success: true,
      data: videoInfo,
    });
  } catch (error: unknown) {
    console.error('[YouTube Info Error]', error);
    const message = error instanceof Error ? error.message : 'Failed to get video info';

    if (message.includes('private') || message.includes('unavailable') || message.includes('blocked')) {
      return NextResponse.json(
        { success: false, error: 'This video is private, unavailable, or restricted. Only public YouTube videos can be downloaded.' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: message || 'Failed to fetch video information. Please try again.' },
      { status: 500 }
    );
  }
}
