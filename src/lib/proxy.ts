/**
 * HTTP Proxy with CONNECT tunnel support
 *
 * Uses a custom HTTP CONNECT tunnel approach with Node.js built-in `net` and `tls` modules.
 * Falls back to direct fetch when proxy is not configured or fails.
 */

import net from 'node:net';
import tls from 'node:tls';
import { URL } from 'node:url';

function isProxyEnabled(): boolean {
  return process.env.ENABLE_PROXY === 'true';
}

function getProxyConfig(): { host: string; port: number; user?: string; pass?: string } | null {
  const host = process.env.PROXY_HOST;
  const port = parseInt(process.env.PROXY_PORT || '0');
  if (!host || !port) return null;
  return {
    host,
    port,
    user: process.env.PROXY_USER,
    pass: process.env.PROXY_PASS,
  };
}

/**
 * Create an HTTP CONNECT tunnel through the proxy server.
 * Returns a TLS socket connected to the target server via the proxy.
 */
function createTunnel(targetHost: string, targetPort: number): Promise<tls.TLSSocket> {
  const proxy = getProxyConfig();
  if (!proxy) throw new Error('Proxy not configured');

  return new Promise((resolve, reject) => {
    // Step 1: Connect to the proxy server
    const socket = net.connect(proxy.port, proxy.host, () => {
      // Step 2: Send CONNECT request with optional proxy auth
      let connectReq = `CONNECT ${targetHost}:${targetPort} HTTP/1.1\r\nHost: ${targetHost}:${targetPort}\r\n`;
      if (proxy.user && proxy.pass) {
        const auth = Buffer.from(`${proxy.user}:${proxy.pass}`).toString('base64');
        connectReq += `Proxy-Authorization: Basic ${auth}\r\n`;
      }
      connectReq += '\r\n';
      socket.write(connectReq);
    });

    // Step 3: Parse the CONNECT response
    let response = '';
    const onData = (chunk: Buffer) => {
      response += chunk.toString();
      if (response.includes('\r\n\r\n')) {
        socket.removeListener('data', onData);
        const statusLine = response.split('\r\n')[0];
        const statusCode = parseInt(statusLine.split(' ')[1]);

        if (statusCode === 200) {
          // Step 4: Upgrade the socket to TLS
          const tlsSocket = tls.connect({
            socket,
            servername: targetHost,
            rejectUnauthorized: false,
          }, () => {
            resolve(tlsSocket);
          });
          tlsSocket.on('error', reject);
        } else {
          socket.destroy();
          reject(new Error(`Proxy CONNECT failed: ${statusLine}`));
        }
      }
    };

    socket.on('data', onData);
    socket.on('error', reject);
    socket.setTimeout(30_000, () => {
      socket.destroy();
      reject(new Error('Proxy connection timeout'));
    });
  });
}

/**
 * Make an HTTPS request through a proxy CONNECT tunnel.
 * Returns the raw response as a Buffer.
 */
async function fetchThroughTunnel(
  url: string,
  headers: Record<string, string>,
  method: string = 'GET',
  maxRedirects: number = 10
): Promise<{ status: number; statusText: string; headers: Record<string, string>; body: Buffer }> {
  if (maxRedirects <= 0) throw new Error('Too many redirects');

  const parsed = new URL(url);
  const targetHost = parsed.hostname;
  const targetPort = parseInt(parsed.port) || 443;
  const path = parsed.pathname + parsed.search;

  const tunnel = await createTunnel(targetHost, targetPort);

  return new Promise((resolve, reject) => {
    // Build HTTP request
    let req = `${method} ${path} HTTP/1.1\r\n`;
    req += `Host: ${targetHost}\r\n`;
    for (const [key, value] of Object.entries(headers)) {
      req += `${key}: ${value}\r\n`;
    }
    req += 'Connection: close\r\n';
    req += '\r\n';
    tunnel.write(req);

    let responseData = Buffer.alloc(0);
    tunnel.on('data', (chunk: Buffer) => {
      responseData = Buffer.concat([responseData, chunk]);
    });
    tunnel.on('end', () => {
      // Parse HTTP response
      const headerEnd = responseData.indexOf('\r\n\r\n');
      if (headerEnd === -1) {
        reject(new Error('Invalid HTTP response'));
        return;
      }

      const headerSection = responseData.slice(0, headerEnd).toString();
      const bodyBuffer = responseData.slice(headerEnd + 4);

      const lines = headerSection.split('\r\n');
      const statusLine = lines[0];
      const statusCode = parseInt(statusLine.split(' ')[1]);
      const statusText = statusLine.split(' ').slice(2).join(' ');

      const respHeaders: Record<string, string> = {};
      for (let i = 1; i < lines.length; i++) {
        const colonIdx = lines[i].indexOf(':');
        if (colonIdx > 0) {
          const key = lines[i].substring(0, colonIdx).trim().toLowerCase();
          const val = lines[i].substring(colonIdx + 1).trim();
          respHeaders[key] = val;
        }
      }

      // Handle chunked transfer encoding
      let finalBody = bodyBuffer;
      if (respHeaders['transfer-encoding']?.includes('chunked')) {
        finalBody = decodeChunked(bodyBuffer);
      }

      // Handle redirects
      if ([301, 302, 303, 307, 308].includes(statusCode) && respHeaders['location']) {
        let location = respHeaders['location'];
        if (location.startsWith('/')) {
          location = `${parsed.protocol}//${parsed.host}${location}`;
        }
        console.log(`[Proxy] Following redirect ${statusCode}: ${location.substring(0, 80)}...`);
        const newMethod = [307, 308].includes(statusCode) ? method : 'GET';
        fetchThroughTunnel(location, headers, newMethod, maxRedirects - 1)
          .then(resolve)
          .catch(reject);
        return;
      }

      resolve({ status: statusCode, statusText, headers: respHeaders, body: finalBody });
    });
    tunnel.on('error', reject);
    tunnel.setTimeout(120_000, () => {
      tunnel.destroy();
      reject(new Error('Tunnel request timeout'));
    });
  });
}

/**
 * Decode chunked transfer encoding
 */
function decodeChunked(buffer: Buffer): Buffer {
  const chunks: Buffer[] = [];
  let offset = 0;

  while (offset < buffer.length) {
    // Find the end of the chunk size line
    const lineEnd = buffer.indexOf('\r\n', offset);
    if (lineEnd === -1) break;

    const sizeLine = buffer.slice(offset, lineEnd).toString().trim();
    const chunkSize = parseInt(sizeLine, 16);

    if (isNaN(chunkSize) || chunkSize === 0) break;

    const chunkStart = lineEnd + 2;
    const chunkEnd = chunkStart + chunkSize;
    if (chunkEnd > buffer.length) break;

    chunks.push(buffer.slice(chunkStart, chunkEnd));
    offset = chunkEnd + 2; // Skip the trailing \r\n
  }

  return Buffer.concat(chunks);
}

/**
 * Proxy-aware fetch: Uses the rotating proxy if enabled and configured,
 * otherwise falls back to direct fetch.
 *
 * Uses a custom HTTP CONNECT tunnel approach that's stable in Next.js runtime.
 * Fully buffers the response before returning.
 */
export async function proxyFetch(url: string, init?: RequestInit): Promise<Response> {
  if (!isProxyEnabled()) {
    return fetch(url, init);
  }

  const proxyConfig = getProxyConfig();
  if (!proxyConfig) {
    return fetch(url, init);
  }

  try {
    // Build headers object
    const reqHeaders: Record<string, string> = {};
    if (init?.headers) {
      if (init.headers instanceof Headers) {
        init.headers.forEach((v, k) => { reqHeaders[k] = v; });
      } else if (Array.isArray(init.headers)) {
        for (const [k, v] of init.headers) { reqHeaders[k] = v; }
      } else {
        Object.assign(reqHeaders, init.headers);
      }
    }

    const result = await fetchThroughTunnel(url, reqHeaders, (init?.method as string) || 'GET');

    // Convert to Web Response
    const webHeaders = new Headers();
    for (const [key, value] of Object.entries(result.headers)) {
      // Skip hop-by-hop headers
      if (['transfer-encoding', 'connection', 'keep-alive'].includes(key)) continue;
      webHeaders.set(key, value);
    }

    return new Response(result.body, {
      status: result.status,
      statusText: result.statusText,
      headers: webHeaders,
    });
  } catch (proxyError) {
    const msg = proxyError instanceof Error ? proxyError.message : 'unknown';
    console.log(`[Proxy] Tunnel failed for ${url.substring(0, 60)}: ${msg}. Using direct fetch.`);
    return fetch(url, init);
  }
}

/**
 * Check if proxy is configured
 */
export function isProxyConfigured(): boolean {
  return !!(process.env.PROXY_HOST && process.env.PROXY_PORT);
}


