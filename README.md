# SnapTok

TikTok Video Downloader — download TikTok videos without watermark, with all quality levels.

## Features

- Download TikTok videos without watermark
- Multiple quality levels (360p to 4K when available)
- H.264 and H.265 codec support
- Audio download support
- Dark mode
- Mobile responsive
- No registration required

## Deploy with Docker / Coolify

```bash
# Build
docker build -t snaptok .

# Run
docker run -p 3000:3000 snaptok
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ENABLE_PROXY` | No | Set to `true` to use HTTP proxy for TikTok API requests |
| `PROXY_HOST` | No | Proxy hostname |
| `PROXY_PORT` | No | Proxy port |
| `PROXY_USER` | No | Proxy username |
| `PROXY_PASS` | No | Proxy password |
| `TOKEN_SECRET` | No | Secret for worker token encryption (auto-generated if not set) |
| `FB_WORKER_URL` | No | Cloudflare Worker URL for download offloading |

## Tech Stack

- Next.js 16 (standalone output)
- React 19
- Tailwind CSS 4
- shadcn/ui
- TypeScript

## How It Works

1. User pastes a TikTok video URL
2. Server extracts the video ID from the URL
3. Server queries TikTok's internal API (`api.tiktokv.com/aweme/v1/aweme/detail/`) for video metadata
4. The API returns all available quality levels in the `bit_rate` array
5. User picks a quality and downloads through our proxy server
