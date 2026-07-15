import { NextRequest, NextResponse } from 'next/server';
import { resolveResourceContent } from '@/lib/youtube/client';

export const maxDuration = 300;
export const dynamic = 'force-dynamic';

/**
 * YouTube Resource Resolve Route
 *
 * POST /api/youtube/resolve
 * Body: { resourceContent: "..." }
 * Takes a resourceContent token from /api/youtube/info response and resolves it to a download URL.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resourceContent } = body;

    if (!resourceContent || typeof resourceContent !== 'string') {
      return NextResponse.json(
        { success: false, error: 'resourceContent token is required' },
        { status: 400 }
      );
    }

    const result = await resolveResourceContent(resourceContent);

    return NextResponse.json({
      success: true,
      data: {
        downloadUrl: result.downloadUrl,
        filesize: result.filesize,
        sizeMB: result.filesize ? Math.round(result.filesize / 1048576 * 100) / 100 : null,
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
