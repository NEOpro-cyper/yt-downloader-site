import { NextRequest, NextResponse } from 'next/server';
import { proxyFetch } from '@/lib/proxy';

export const maxDuration = 300;
export const dynamic = 'force-dynamic';

/**
 * YouTube Video Stream Proxy Route
 *
 * GET /api/youtube/stream?url=ENCODED_URL
 * Proxies video with CORS headers and Range support for video preview
 */
export async function GET(request: NextRequest) {
  const streamUrl = request.nextUrl.searchParams.get('url');

  if (!streamUrl) {
    return NextResponse.json(
      { success: false, error: 'Missing stream URL parameter' },
      { status: 400 }
    );
  }

  try {
    console.log(`[YouTube Stream] Proxying: ${streamUrl.substring(0, 80)}...`);

    const headers: Record<string, string> = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      'Referer': 'https://www.youtube.com/',
      'Accept': '*/*',
    };

    const rangeHeader = request.headers.get('range');
    if (rangeHeader) {
      headers['Range'] = rangeHeader;
    }

    const videoResponse = await proxyFetch(streamUrl, {
      headers,
      redirect: 'follow',
    });

    if (!videoResponse.ok && videoResponse.status !== 206) {
      console.error(`[YouTube Stream] CDN returned ${videoResponse.status}`);
      return NextResponse.json(
        { success: false, error: `Stream failed: HTTP ${videoResponse.status}` },
        { status: videoResponse.status >= 400 && videoResponse.status < 500 ? videoResponse.status : 502 }
      );
    }

    const responseHeaders = new Headers();
    const contentType = videoResponse.headers.get('content-type');
    const contentLength = videoResponse.headers.get('content-length');
    const contentRange = videoResponse.headers.get('content-range');

    responseHeaders.set('Content-Type', contentType || 'video/mp4');
    if (contentLength) responseHeaders.set('Content-Length', contentLength);
    if (contentRange) responseHeaders.set('Content-Range', contentRange);
    responseHeaders.set('Accept-Ranges', 'bytes');
    responseHeaders.set('Content-Disposition', 'inline');
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('Access-Control-Allow-Headers', 'Range');
    responseHeaders.set('Access-Control-Expose-Headers', 'Content-Range, Content-Length, Accept-Ranges');
    responseHeaders.set('Cache-Control', 'public, max-age=600, s-maxage=600');

    if (videoResponse.body) {
      return new NextResponse(videoResponse.body, {
        status: videoResponse.status,
        headers: responseHeaders,
      });
    }

    const buffer = await videoResponse.arrayBuffer();
    return new NextResponse(buffer, {
      status: videoResponse.status,
      headers: responseHeaders,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Stream proxy failed';
    console.error(`[YouTube Stream] Error: ${message}`);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
