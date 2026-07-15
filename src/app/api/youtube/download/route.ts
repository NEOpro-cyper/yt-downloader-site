import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 300;
export const dynamic = 'force-dynamic';

/**
 * YouTube Video Download Route
 *
 * GET /api/youtube/download?url=ENCODED_URL&filename=NAME
 * Proxies the video download with Content-Disposition: attachment header.
 * 
 * The download URL comes from the Express API /resolve endpoint (googlevideo CDN).
 * We proxy it to add proper Content-Disposition and avoid CORS issues.
 */
export async function GET(request: NextRequest) {
  const videoUrl = request.nextUrl.searchParams.get('url');
  const filename = request.nextUrl.searchParams.get('filename') || 'youtube-video.mp4';

  if (!videoUrl) {
    return NextResponse.json(
      { success: false, error: 'Missing video URL parameter' },
      { status: 400 }
    );
  }

  try {
    console.log(`[YouTube Download] Proxying: ${videoUrl.substring(0, 80)}...`);

    const headers: Record<string, string> = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      'Referer': 'https://www.youtube.com/',
      'Accept': '*/*',
    };

    // Forward Range header for partial content support
    const rangeHeader = request.headers.get('range');
    if (rangeHeader) {
      headers['Range'] = rangeHeader;
    }

    const videoResponse = await fetch(videoUrl, {
      headers,
      redirect: 'follow',
    });

    if (!videoResponse.ok && videoResponse.status !== 206) {
      console.error(`[YouTube Download] CDN returned ${videoResponse.status}`);
      return NextResponse.json(
        { success: false, error: `Failed to download video: HTTP ${videoResponse.status}. The link may have expired.` },
        { status: videoResponse.status >= 400 && videoResponse.status < 500 ? videoResponse.status : 502 }
      );
    }

    // Build response headers
    const responseHeaders = new Headers();
    const contentType = videoResponse.headers.get('content-type');
    const contentLength = videoResponse.headers.get('content-length');
    const contentRange = videoResponse.headers.get('content-range');

    responseHeaders.set('Content-Type', contentType || 'video/mp4');
    if (contentLength) responseHeaders.set('Content-Length', contentLength);
    if (contentRange) responseHeaders.set('Content-Range', contentRange);
    responseHeaders.set('Accept-Ranges', 'bytes');
    responseHeaders.set('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('Access-Control-Allow-Headers', 'Range');
    responseHeaders.set('Access-Control-Expose-Headers', 'Content-Range, Content-Length, Accept-Ranges, Content-Disposition');
    responseHeaders.set('Cache-Control', 'no-store');

    // Stream the video directly
    if (videoResponse.body) {
      return new NextResponse(videoResponse.body, {
        status: videoResponse.status,
        headers: responseHeaders,
      });
    }

    // Fallback: buffer the response
    const buffer = await videoResponse.arrayBuffer();
    return new NextResponse(buffer, { headers: responseHeaders });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Download proxy failed';
    console.error(`[YouTube Download] Error: ${message}`);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
